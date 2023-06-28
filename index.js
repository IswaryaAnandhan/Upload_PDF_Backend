const express = require('express');
const cors = require("cors")
const multer = require('multer');
const PDFParser = require('pdf-parse');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);
const upload = multer({ dest: 'uploads/' });

app.post('/api/upload', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const pdfPath = req.file.path;

  try {
    const pdfData = await PDFParser(pdfPath);
    const metadata = {
      title: pdfData.info.Title,
      author: pdfData.info.Author,
      creationDate: pdfData.info.Created,
    };

    return res.json(metadata);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to parse PDF' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

