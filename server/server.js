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
    return file.buffer.toString();
  }
};

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


