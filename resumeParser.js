import mammoth from 'mammoth';
import { extractSkills } from './skillExtractor.js';
import fs from 'fs';
import path from 'path';

let pdfParse;
try {
  const pdfParseModule = await import('pdf-parse');
  pdfParse = pdfParseModule.default;
} catch (e) {
  console.warn('pdf-parse not available, using fallback');
  pdfParse = null;
}

export async function parseResume(file) {
  let text = '';

  try {
    const filename = file.originalname.toLowerCase();
    console.log('📄 Processing:', filename, 'Size:', file.size);

    if (filename.endsWith('.pdf') || file.mimetype === 'application/pdf') {
      console.log('🔍 Extracting PDF text...');
      text = await extractPdfText(file.buffer);
      console.log('✓ PDF extracted:', text.length, 'chars');
    } else if (filename.endsWith('.docx') || file.mimetype.includes('wordprocessingml')) {
      console.log('📝 Parsing DOCX...');
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      text = result.value || '';
    } else if (filename.endsWith('.txt') || file.mimetype === 'text/plain') {
      text = file.buffer.toString('utf8');
    } else {
      return defaultParsed();
    }

    text = cleanText(text).trim();
    console.log('📊 Clean text length:', text.length);
    
    if (!text || text.length < 50) {
      console.warn('⚠️ Minimal text extracted');
    }

    const parsed = {
      rawText: text.substring(0, 2500),
      name: extractName(text),
      email: extractEmail(text),
      phone: extractPhone(text),
      skills: extractSkills(text),
      education: extractEducation(text),
      experience: extractExperience(text),
      projects: extractProjects(text)
    };

    console.log('✅ Result - Skills:', parsed.skills.length, 'Edu:', parsed.education.length, 'Exp:', parsed.experience.length, 'Projects:', parsed.projects.length);
    return parsed;
  } catch (error) {
    console.error('❌ Parse error:', error.message);
    throw error;
  }
}

async function extractPdfText(buffer) {
  try {
    if (pdfParse) {
      try {
        const pdfData = await pdfParse(buffer);
        if (pdfData && pdfData.text && pdfData.text.length > 100) {
          return pdfData.text;
        }
      } catch (pdfErr) {
        console.warn('pdf-parse error:', pdfErr.message);
      }
    }
    
    // Fallback: extract text from PDF binary
    return extractTextFromPdfBinary(buffer);
  } catch (err) {
    console.error('PDF extraction failed:', err.message);
    return extractTextFromPdfBinary(buffer);
  }
}

function extractTextFromPdfBinary(buffer) {
  let text = '';
  
  try {
    // Method 1: Look for streams with text content
    const bufferStr = buffer.toString('latin1');
    
    // Extract from text streams
    const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
    let match;
    while ((match = streamRegex.exec(bufferStr)) !== null) {
      const stream = match[1];
      // Look for Tj, TJ, ', " operators which contain text
      const textOps = stream.match(/\(([^)]+)\)\s*([Tj]|'|")/g) || [];
      for (const op of textOps) {
        const extracted = op.match(/\(([^)]+)\)/);
        if (extracted) {
          text += extracted[1] + ' ';
        }
      }
    }
    
    // If got good text, return it
    if (text.length > 200) {
      return cleanRawPdfText(text);
    }
    
    // Method 2: Extract all readable ASCII+Unicode
    const readable = buffer
      .toString('utf8', 0, Math.min(buffer.length, 300000))
      .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, ' ')
      .replace(/stream.*?endstream/gs, ' ')
      .replace(/<<.*?>>/gs, ' ')
      .replace(/%.*?\n/g, '\n')
      .split('\n')
      .map(line => line.replace(/[^\x20-\x7E\xA0-\xFF]/g, ' ').trim())
      .filter(line => line.length > 3)
      .join('\n');
    
    return readable.replace(/\s+/g, ' ').trim();
  } catch (err) {
    // Last resort - just get UTF-8 readable chars
    return buffer
      .toString('utf8', 0, Math.min(buffer.length, 300000))
      .replace(/[^\x20-\x7E\n\r\t\xA0-\xFF]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

function cleanRawPdfText(text) {
  // Decode PDF escapes
  text = text.replace(/\\n/g, '\n').replace(/\\\(/g, '(').replace(/\\\)/g, ')').replace(/\\\\/g, '\\');
  // Clean extra spaces
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

function cleanText(text) {
  if (!text) return '';
  text = text.replace(/\s+/g, ' ').trim();
  text = text.replace(/https?:\/\/\S+/g, ' ');
  text = text.replace(/www\.\S+/g, ' ');
  return text;
}

function defaultParsed() {
  return {
    rawText: '',
    name: 'Unknown',
    email: 'Not found',
    phone: 'Not found',
    skills: [],
    education: [],
    experience: [],
    projects: []
  };
}

function extractName(text) {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  
  for (let i = 0; i < Math.min(8, lines.length); i++) {
    const line = lines[i].trim();
    
    // Skip invalid lines
    if (line.length < 3 || line.length > 100) continue;
    if (/^[0-9]{1,3}[%]/.test(line)) continue;
    if (line.match(/^[0-9]{10,}$/)) continue;
    if (line.includes('@')) continue;
    if (line.includes('Resume') || line.includes('EDUCATION') || line.includes('TECHNICAL') || line.includes('EXPERIENCE') || line.includes('SKILLS')) continue;
    
    // Check if looks like a name
    const words = line.split(/\s+/);
    if (words.length <= 3 && words.every(w => /^[A-Za-z\.]+$/.test(w))) {
      return line;
    }
    
    // Check for uppercase names
    if (/^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(line) && line.length > 5) {
      return line;
    }
  }
  
  return 'Unknown';
}

function extractEmail(text) {
  const emailRegex = /[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(emailRegex);
  
  if (matches) {
    for (const email of matches) {
      if (!email.includes('example') && !email.includes('test') && email.length < 100) {
        return email;
      }
    }
  }
  
  return 'Not found';
}

function extractPhone(text) {
  // Match various phone formats
  const patterns = [
    /\+91[\s\-]?[0-9]{10}/g,           // +91 format
    /0[\s\-]?[0-9]{4}[\s\-]?[0-9]{3}[\s\-]?[0-9]{3}/g, // 0 format
    /[0-9]{3}[\s\-]?[0-9]{3}[\s\-]?[0-9]{4}/g,        // XXX-XXX-XXXX
    /[0-9]{10}/g                          // 10 digits
  ];
  
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) {
      const phone = matches[0].replace(/[\s\-]/g, '');
      if (phone.replace(/0/g, '').length > 0) { // Not all zeros
        return matches[0];
      }
    }
  }
  
  return 'Not found';
}

function extractEducation(text) {
  const eduKeywords = [
    'bachelor', 'b.tech', 'btech', 'b.s.', 'bs', 'b.sc', 'bsc',
    'masters', 'master', 'm.tech', 'mtech', 'm.s.', 'ms', 'm.sc', 'msc',
    'phd', 'ph.d', 'diploma', 'degree', 'university', 'college', 'institute', 'school',
    'srmist', 'srm', 'iit', 'nit', 'cbse', 'icse', 'class xii', 'class x',
    'cgpa', 'gpa', 'percentage', 'aiml', 'ai-ml', 'cse', 'it'
  ];
  
  const lines = text.split('\n');
  const education = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.length > 8 && line.length < 300) {
      const lowerLine = line.toLowerCase();
      
      // Check if line contains education keywords
      if (eduKeywords.some(kw => lowerLine.includes(kw))) {
        // Add next line if it contains more info (like year, percentage)
        let fullLine = line;
        if (i + 1 < lines.length && lines[i + 1].trim().length > 0) {
          const nextLine = lines[i + 1].trim();
          if (/[0-9]{4}|%|gpa|cgpa/.test(nextLine) && nextLine.length < 100) {
            fullLine = line + ' - ' + nextLine;
          }
        }
        
        if (!education.includes(fullLine)) {
          education.push(fullLine);
        }
      }
    }
  }
  
  return education.slice(0, 10);
}

function extractExperience(text) {
  const expKeywords = [
    'experience', 'worked', 'working', 'developed', 'developing', 'engineer', 'developer',
    'intern', 'internship', 'years', 'months', 'year', 'month',
    'manager', 'lead', 'senior', 'junior', 'jr', 'sr', 'associate',
    'freelance', 'contract', 'full-time', 'full time', 'part-time', 'part time',
    'position', 'role', 'company', 'organization', 'team', 'project',
    'responsibility', 'involved', 'infosys', 'tcs', 'cognifyz', 'codsoft'
  ];
  
  const lines = text.split('\n');
  const experience = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.length > 12 && line.length < 350) {
      const lowerLine = line.toLowerCase();
      
      if (expKeywords.some(kw => lowerLine.includes(kw))) {
        if (!line.match(/^(the|and|or|is|to|for|at|in|on|by|from)\s/i)) {
          if (!experience.includes(line)) {
            experience.push(line);
          }
        }
      }
    }
  }
  
  return experience.slice(0, 15);
}

function extractProjects(text) {
  const projectKeywords = [
    'project', 'developed', 'developing', 'built', 'building', 'created', 'creating',
    'designed', 'designed', 'engineered', 'github', 'gitlab', 'repository',
    'website', 'application', 'app', 'system', 'tool', 'platform', 'software',
    'solution', 'framework', 'library', 'module', 'portfolio', 'hackathon',
    'kisaan', 'voice', 'classifier', 'classifier', 'scanner', 'bot'
  ];
  
  const lines = text.split('\n');
  const projects = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.length > 12 && line.length < 350) {
      const lowerLine = line.toLowerCase();
      
      if (projectKeywords.some(kw => lowerLine.includes(kw))) {
        if (!projects.includes(line)) {
          projects.push(line);
        }
      }
    }
  }
  
  return projects.slice(0, 15);
}
