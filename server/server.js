import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let text = '';

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
      text = pageTexts.join('\n');
    } else {
      text = file.buffer.toString();
    }

    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process file' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));