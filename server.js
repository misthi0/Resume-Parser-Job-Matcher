import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { parseResume } from './utils/resumeParser.js';
import { matchJobs } from './utils/jobMatcher.js';
import { jobs } from './data/sampleJobs.js';

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Test endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Parse resume endpoint
app.post('/api/parse-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('\n📄 Received file:', req.file.originalname, 'Size:', req.file.size);
    
    const parsedData = await parseResume(req.file);
    
    console.log('✓ Resume parsed successfully');
    res.json(parsedData);
  } catch (error) {
    console.error('❌ Parse error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to parse resume' });
  }
});

// Get jobs endpoint
app.get('/api/jobs', (req, res) => {
  res.json(jobs);
});

// Match jobs endpoint
app.post('/api/match-jobs', (req, res) => {
  try {
    const { skills, experience, education, rawText } = req.body;
    const matches = matchJobs(jobs, { skills, experience, education, rawText });
    res.json(matches);
  } catch (error) {
    console.error('Match error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✓ Resume Parser Backend running on http://0.0.0.0:${PORT}\n`);
});
