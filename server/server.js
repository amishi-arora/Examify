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
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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
    const text = req.body.text;

    if (!text) {
      return res.status(400).json({ error: 'No study material text provided' });
    }
    const result = await model.generateContent(prompts.generateExam(text));
    const raw = result.response.text();
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
    const examQuestions = req.body.examQuestions;
    const studentAnswers = req.body.studentAnswers;

    for (const q of examQuestions.questions) {
      if (!studentAnswers[q.id]) {
        results[q.id] = { score: 0, feedback: 'No answer provided', correctAnswer: q.answer };
      }
      else if (q.type === "Multiple choice") {
        results[q.id] = {
          score: studentAnswers[q.id] === q.answer ? 1 : 0,
          correctAnswer: q.answer
        }
      } else {
        const result = await model.generateContent(prompts.gradeExam(q.questionText, studentAnswers[q.id], q.answer));
        results[q.id] = JSON.parse(result.response.text());
        results[q.id].correctAnswer = q.answer;
      }
    }
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to grade exam' });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

