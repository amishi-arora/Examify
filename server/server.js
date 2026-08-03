import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { GoogleGenerativeAI } from '@google/generative-ai';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from './db.js';
import s3 from './s3.js';
import index from './pinecone.js';
import * as constants from "../client/src/constants.js";
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import express from 'express';
import cors from 'cors';
import * as prompts from "./prompts.js";
dotenv.config();


// --- AI Setup --- 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });

// --- Middleware ---
const app = express();
app.use(cors());
app.use(express.json());

// --- Helpers --- 
async function getTextFromS3File(key, fileType) {
  const response = await s3.send(new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  }));

  const buffer = await streamToBuffer(response.Body);
  if (fileType === "application/pdf") {
    return extractPdfText(buffer);
  }
  return buffer.toString("utf-8");
}

async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () =>
      resolve(Buffer.concat(chunks))
    );
  });
}

async function extractPdfText(buffer) {
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
  const pdfDoc = await loadingTask.promise;
  const pageTexts = await Promise.all(
    Array.from({ length: pdfDoc.numPages }, async (_, i) => {
      const page = await pdfDoc.getPage(i + 1);
      const content = await page.getTextContent();
      return content.items.map(item => item.str).join(' ');
    })
  );
  return pageTexts.join('\n');
};

function sampleText(text, maxChars = 500000, numberOfSections = 20) {
  const sectionSize = Math.floor(text.length / numberOfSections);
  const charsPerSection = maxChars / numberOfSections;

  const sampledSections = [];

  for (let i = 0; i < numberOfSections; i++) {
    const start = i * sectionSize;
    sampledSections.push(text.slice(start, start + charsPerSection));
  }
  return sampledSections.join(" ");
}

// --- JWT Middleware --- 
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    req.user = user;
    next();
  });
}

// --- Routes -- 
app.post("/api/generate-exam", authenticateToken, async (req, res) => {
  try {
    const { files, examSettings } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }

    let allText = "";
    for (const file of files) {
      const text = await getTextFromS3File(file.key, file.filetype);
      allText += text + "\n\n";
    }

    let studyMaterial;
    const isLargeDocument = allText.length > 500000;

    if (isLargeDocument) {
      studyMaterial = sampleText(allText);
    } else {
      studyMaterial = allText;
    }
    console.log(studyMaterial); 

    const result = await model.generateContent(
      prompts.generateExam(studyMaterial, examSettings)
    );

    const exam = result.response.text().replace(/```json\n?|```/g, "").trim();
    res.json(JSON.parse(exam));

    // Begin indexing files in the background so they can be used for RAG 
    beginBackgroundIndexing(files, req.user.userId);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate exam" });
  }
});

app.post('/api/grade-exam', authenticateToken, async (req, res) => {
  try {
    const results = {};
    const { examQuestions, studentAnswers } = req.body;

    if (!examQuestions || !studentAnswers) {
      return res.status(400).json({ error: 'Exam questions and answers must be provided' });
    }
    const mcQuestions = examQuestions.questions.filter(q => q.type === constants.QUESTION_TYPES.MC);
    const shortQuestions = examQuestions.questions.filter(q => q.type === constants.QUESTION_TYPES.SHORT);

    // Grade MC locally
    for (const q of mcQuestions) {
      results[q.id] = {
        score: studentAnswers[q.id] === q.answer ? 1 : 0,
        correctAnswer: q.answer
      };
    }

    // Grade all short answers in one AI call
    if (shortQuestions.length > 0) {
      const result = await model.generateContent(prompts.gradeShortAnswers(shortQuestions, studentAnswers));
      const raw = result.response.text().replace(/```json\n?|```/g, '').trim();
      const parsed = JSON.parse(raw);
      parsed.forEach(r => {
        results[r.id] = {
          score: r.score,
          feedback: r.feedback,
          correctAnswer: shortQuestions.find(q => q.id === r.id).answer
        };
      });
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to grade exam' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All registration fields are required' });
    }

    // Check if user already exists
    const existingUser = await db.send(new QueryCommand({
      TableName: 'Users',
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email }
    }));

    if (existingUser.Items.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = uuidv4();
    await db.send(new PutCommand({
      TableName: 'Users',
      Item: { userId, name, email, password: hashedPassword }
    }));

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'All login fields are required' });
    }

    // Find user by email
    const result = await db.send(new QueryCommand({
      TableName: 'Users',
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email }
    }));

    if (result.Items.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.Items[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.post('/api/save-exam', authenticateToken, async (req, res) => {
  try {
    const { title, questions, settings, results, studentAnswers, insights, documentKeys } = req.body;
    if (!title || !questions || !settings || !results || !studentAnswers || !insights || !documentKeys) {
      return res.status(400).json({ error: 'All exam information is required' });
    }
    const examId = uuidv4();
    const date = new Date().toISOString();
    const userId = req.user.userId;
    await db.send(new PutCommand({
      TableName: 'Exams',
      Item: { examId, userId, title, questions, settings, date, results, studentAnswers, insights, documentKeys }
    }));
    res.json({ examId })

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save exam' });
  }
});


app.get('/api/get-exams', authenticateToken, async (req, res) => {
  try {
    // Find exams by userId
    const result = await db.send(new QueryCommand({
      TableName: 'Exams',
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': req.user.userId },
      ScanIndexForward: false
    }));
    res.json(result.Items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load recent exams' });
  }
});

app.get('/api/get-exam', authenticateToken, async (req, res) => {
  try {
    const examId = req.query.examId;
    if (!examId) return res.status(400).json({ error: 'examId is required' });
    const result = await db.send(new GetCommand({
      TableName: 'Exams',
      Key: { examId }
    }));

    if (!result.Item) return res.status(404).json({ error: 'Exam not found' });

    // Prevent retrieving an exam the user does not have access to 
    if (result.Item.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    res.json(result.Item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get exam' });
  }
});

app.post('/api/generate-insights', authenticateToken, async (req, res) => {
  try {
    const { examQuestions, studentAnswers, examResults } = req.body;

    if (!examQuestions || !studentAnswers || !examResults) {
      return res.status(400).json({ error: 'All exam information is required' });
    }

    const result = await model.generateContent(prompts.generateInsights(examQuestions, examResults, studentAnswers));
    const raw = result.response.text().replace(/```json\n?|```/g, '').trim();

    res.json(JSON.parse(raw));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

app.post('/api/s3-upload-url', authenticateToken, async (req, res) => {
  try {
    const { fileName, fileType } = req.body;

    const key = `uploads/${uuidv4()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    })

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 60,
    });

    res.json({ uploadUrl, key });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

app.post("/api/regenerate-exam", authenticateToken, async (req, res) => {
  try {
    const {
      documentKeys,
      weakTopics,
      examSettings
    } = req.body;


    if (!documentKeys || !examSettings || !weakTopics || weakTopics.length === 0) {
      return res.status(400).json({
        error: "Missing document or weak topics"
      });
    }

    // Retrieve relevant chunks
    const studyMaterial = await retrieveRelevantChunks(
      weakTopics,
      req.user.userId,
      documentKeys
    );

    // Generate new exam
    const result = await model.generateContent(
      prompts.generateExam(
        studyMaterial,
        examSettings,
        weakTopics
      )
    );


    const exam = result.response
      .text()
      .replace(/```json\n?|```/g, "")
      .trim();


    res.json(JSON.parse(exam));


  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to regenerate exam"
    });
  }
});

// --- RAG Setup --- 
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

async function generateEmbeddings(chunks) {
  const result = await embeddingModel.batchEmbedContents({
    requests: chunks.map(chunk => ({
      content: {
        role: "user",
        parts: [{ text: chunk }]
      },
      taskType: "RETRIEVAL_DOCUMENT"
    }))
  });

  return result.embeddings.map(e => e.values);
}

async function generateEmbedding(text) {
  const result = await embeddingModel.batchEmbedContents({
    requests: [
      {
        content: {
          parts: [
            {
              text
            }
          ]
        },
        taskType: "RETRIEVAL_QUERY"
      }
    ]
  });

  return result.embeddings[0].values;
}

function chunkText(text, chunkSize = 300, overlap = 30) {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim()) {
      chunks.push(chunk);
    }
    if (i + chunkSize >= words.length) break;
  }
  return chunks;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function beginBackgroundIndexing(files, userId) {
  for (const file of files) {
    try {
      const text = await getTextFromS3File(file.key, file.filetype);
      await indexDocument(file.key, text, userId);
    } catch (err) {
      console.error(`Indexing failed for ${file.key}:`, err);
    }
  }
}

async function indexDocument(s3Key, text, userId) {
  const chunks = chunkText(text);

  const batchSize = 100;

  console.log(`Indexing ${chunks.length} chunks`);

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batchChunks = chunks.slice(i, i + batchSize);

    const embeddings = await generateEmbeddings(batchChunks);

    const records = embeddings.map((embedding, index) => ({
      id: `${s3Key}-chunk-${i + index}`,
      values: embedding,
      metadata: {
        text: batchChunks[index],
        s3Key,
        userId,
        chunkIndex: i + index
      }
    }));

    await index.upsert({
      namespace: "default",
      records
    });

    console.log(`Indexed ${Math.min(i + batchSize, chunks.length)}/${chunks.length}`);
    await sleep(10000);
  }
}

async function retrieveRelevantChunks(topics, userId, documentKeys, topKPerTopic = 3) {
  const resultsPerTopic = await Promise.all(topics.map(async topic => {
    const topicEmbedding = await generateEmbedding(topic);
    return index.query({
      namespace: 'default',
      vector: topicEmbedding,
      topK: topKPerTopic,
      filter: {
        userId: { $eq: userId },
        s3Key: { $in: documentKeys }
      },
      includeMetadata: true
    });
  }));

  return resultsPerTopic
    .flatMap(r => r.matches)
    .map(m => m.metadata.text)
    .join('\n\n');
}

// --- Start Server ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));