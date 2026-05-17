import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import db from './db.js';

import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import * as prompts from "./prompts.js";
import { GoogleGenerativeAI } from '@google/generative-ai';
dotenv.config();

// --- AI Setup --- 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

// --- Middleware ---
const app = express();
app.use(cors());
app.use(express.json());

// --- File Upload & Text Extraction --- 
const upload = multer({ storage: multer.memoryStorage() });

const extractText = async (file) => {
  if (file.mimetype === 'application/pdf') {
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(file.buffer) });
    const pdfDoc = await loadingTask.promise;
    const pageTexts = await Promise.all(
      Array.from({ length: pdfDoc.numPages }, async (_, i) => {
        const page = await pdfDoc.getPage(i + 1);
        const content = await page.getTextContent();
        return content.items.map(item => item.str).join(' ');
      })
    );
    return pageTexts.join('\n');
  } else {
    // plain text file - just convert buffer directly 
    return file.buffer.toString();
  }
};

// --- Routes -- 
app.post('/api/upload', upload.array('files'), async (req, res) => {
  try {
    const files = req.files;
    let texts = await Promise.all(files.map(extractText));
    const text = texts.join('\n\n');
    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process file' });
  }
});

app.post('/api/generate-exam', async (req, res) => {
  try {
    const { text, examSettings } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'No study material text provided' });
    }
    const result = await model.generateContent(prompts.generateExam(text, examSettings));
    const raw = result.response.text().replace(/```json\n?|```/g, '').trim();
    const exam = JSON.parse(raw);

    res.json(exam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate exam' });
  }
});

app.post('/api/grade-exam', async (req, res) => {
  try {
    const results = {};
    const { examQuestions, studentAnswers } = req.body;
    const mcQuestions = examQuestions.questions.filter(q => q.type === "Multiple choice");
    const shortQuestions = examQuestions.questions.filter(q => q.type === "Short answer");

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
      return res.status(400).json({ error: 'All fields are required' });
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

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
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
      return res.status(400).json({ error: 'All fields are required' });
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

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

