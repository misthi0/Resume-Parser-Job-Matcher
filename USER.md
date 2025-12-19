Resume Parser & Job Matcher Application

Overview

A full-stack application that parses resumes (PDF/DOCX) and matches them with relevant job postings using AI-powered skill extraction and job matching algorithms. No API keys required - everything runs locally.

Project Structure

├── backend/
│   ├── server.js           # Express API server (port 3001)
│   ├── utils/
│   │   ├── resumeParser.js # Resume text extraction & parsing (PDF/DOCX)
│   │   ├── skillExtractor.js # Skill detection (100+ skills)
│   │   └── jobMatcher.js   # Job matching algorithm
│   └── data/
│       └── sampleJobs.js   # 10 sample job postings
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── components/
│   │   │   ├── ResumeUpload.jsx     # File upload interface
│   │   │   ├── ResumePreview.jsx    # Parsed resume display
│   │   │   └── JobMatches.jsx       # Job matching results
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── vite.config.js
├── start.sh                # Startup script
└── replit.md              # This file
## Latest Changes (Session 2)
- **FIXED PDF Extraction:** Replaced problematic pdf-parse library with custom binary PDF text extraction
- **Expanded Skill Library:** Now detects 100+ skills (added AI/ML, cloud, frameworks, tools, etc.)
- **Improved Text Extraction:** Better handling of PDF binary data with fallback mechanisms
- **Better Education/Experience Extraction:** Enhanced keyword matching for all resume sections
## Features
### 1. Resume Parsing
- **Supports:** PDF and DOCX file formats
- **Extracts:** name, email, phone, skills, education, experience, projects
- **Robust extraction** with fallback methods for various PDF encodings
- **No external dependencies** for PDF parsing (custom implementation)
### 2. Skill Detection
- **100+ skills** across:
  - Programming languages (Python, Java, C++, JavaScript, etc.)
  - Frontend (React, Vue, Angular, Tailwind, etc.)
  - Backend (Express, Django, Flask, Spring Boot, etc.)
  - Cloud & DevOps (AWS, Azure, Docker, Kubernetes, etc.)
  - AI/ML (TensorFlow, PyTorch, NLP, Computer Vision, LangChain, etc.)
  - Databases (PostgreSQL, MongoDB, Redis, etc.)
  - Soft skills (Leadership, Communication, Teamwork, etc.)
### 3. Job Matching Algorithm
Scoring weights:
- Skills match: 40%
- Experience level: 25%
- Education: 15%
- Keyword relevance: 20%
### 4. User Interface
- Modern React UI with Tailwind CSS
- Three-tab workflow: Upload → Preview → Matches
- Dark/Light mode toggle
- Mobile-responsive design
- Real-time job matching with sortable results
## Technology Stack
**Backend:**
- Node.js (v20)
- Express.js
- Multer (file upload)
- Mammoth (DOCX parsing)
- Custom PDF binary extraction
- CORS enabled
**Frontend:**
- React 18
- Vite (build tool)
- Tailwind CSS
- React hooks for state management
## How to Use
1. **Upload Resume**
   - Click "Select File" button
   - Choose PDF or DOCX file
   - App automatically parses content
2. **Preview Data**
   - View extracted resume information
   - See extracted skills
   - Review education, experience, projects
3. **View Job Matches**
   - See all matching jobs ranked by relevance
   - Filter by match percentage
   - Click job cards for full details
## API Endpoints
- `GET /api/health` - Backend health check
- `POST /api/parse-resume` - Parse uploaded resume file
- `GET /api/jobs` - Get all sample jobs
- `POST /api/match-jobs` - Match resume with jobs
## File Upload Specifications
- **Supported Formats:** PDF, DOCX, TXT
- **Max Size:** 50MB
- **Processing:** Server-side extraction with client-side feedback
- **Error Handling:** Graceful fallbacks for extraction failures
## Running the Application
```bash
npm start  # Runs both backend and frontend via start.sh
Or manually:

cd backend && node server.js  # Terminal 1 - Backend on port 3001
cd frontend && npm run dev    # Terminal 2 - Frontend on port 5000
Known Issues & Solutions

✅ Resolved

PDF extraction: Switched from problematic external libraries to custom binary extraction
Skill detection: Expanded from 40 to 100+ skills with better matching
Education/Experience extraction: Improved keyword detection and filtering
Module loading: Removed external test file dependencies
Next Steps for Enhancement

Add PDF export of matched jobs
Resume improvement suggestions
ATS compatibility scoring
Multi-resume comparison
Custom job posting upload
User authentication
Resume history tracking
Email integration for applications
Notes

All processing happens server-side for security
No external API keys required
Sample jobs data included for testing
Skill matching uses comprehensive keyword detection
Frontend communicates with backend via REST API
Custom PDF extraction handles various PDF encodings and structures