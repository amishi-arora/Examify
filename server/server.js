import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });
const app = express();
app.use(cors());
app.use(express.json());
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
    return pageTexts.join();
  } else {
    return file.buffer.toString();
  }
};

app.post('/api/upload', upload.array('files'), async (req, res) => {
  try {
    const files = req.files;
    let texts = await Promise.all(files.map(extractText));
    const text = texts.join();
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

    const prompt = `You are an exam generator. Based on the following study material, generate an exam with exactly 5 multiple choice questions and 5 short answer questions.

Return ONLY a JSON object in this exact format, no markdown, no backticks, no explanation:
{
  "questions": [
    {
      "id": 1,
      "type": "mc",
      "question": "question here",
      "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
      "answer": "A. option1"
    },
    {
      "id": 6,
      "type": "short",
      "question": "question here",
      "answer": "sample correct answer here"
    }
  ]
} 
Study material:
${text}`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text();
    const exam = JSON.parse(raw);

    res.json(exam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate exam' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


