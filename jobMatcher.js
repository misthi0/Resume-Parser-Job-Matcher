import { calculateSkillMatch } from './skillExtractor.js';

export function matchJobs(jobs, resumeData) {
  try {
    const { skills = [], experience = [], education = [], rawText = '' } = resumeData;
    
    if (!Array.isArray(jobs)) {
      console.error('Invalid jobs array');
      return [];
    }

    const scoredJobs = jobs.map(job => {
      const skillMatch = calculateSkillMatch(skills || [], job.skills || []) / 100;
      const experienceMatch = calculateExperienceMatch(experience || [], job.experience_level || 'mid') / 100;
      const educationMatch = calculateEducationMatch(education || [], job.education_requirement || []) / 100;
      const keywordMatch = calculateKeywordMatch(rawText, job.description || '') / 100;

      const totalScore = (
        (skillMatch * 0.40) +
        (experienceMatch * 0.25) +
        (educationMatch * 0.15) +
        (keywordMatch * 0.20)
      ) * 100;

      return {
        ...job,
        matchScore: Math.round(totalScore),
        matchBreakdown: {
          skills: Math.round(skillMatch * 100),
          experience: Math.round(experienceMatch * 100),
          education: Math.round(educationMatch * 100),
          keywords: Math.round(keywordMatch * 100)
        }
      };
    });

    return scoredJobs.sort((a, b) => b.matchScore - a.matchScore);
  } catch (error) {
    console.error('Job matching error:', error);
    return [];
  }
}

function calculateExperienceMatch(resumeExp, jobExpLevel) {
  const expMap = {
    'entry': 0,
    'junior': 1,
    'mid': 2,
    'senior': 3,
    'lead': 4,
    'executive': 5
  };

  const resumeLevel = resumeExp.length / 2;
  const jobLevel = expMap[jobExpLevel?.toLowerCase()] || 2;

  const diff = Math.abs(resumeLevel - jobLevel);
  return Math.max(0, 100 - (diff * 15));
}

function calculateEducationMatch(resumeEdu, jobEdu) {
  if (!jobEdu || jobEdu.length === 0) return 100;
  if (resumeEdu.length === 0) return 30;

  const resumeText = resumeEdu.join(' ').toLowerCase();
  const jobText = jobEdu.join(' ').toLowerCase();

  const keywords = ['bachelor', 'master', 'phd', 'degree'];
  let match = 0;

  keywords.forEach(keyword => {
    if (resumeText.includes(keyword) && jobText.includes(keyword)) {
      match += 25;
    }
  });

  return Math.min(100, match || 50);
}

function calculateKeywordMatch(resumeText, jobDescription) {
  const keywords = jobDescription.toLowerCase().split(/[\s,]+/).filter(w => w.length > 3);
  const resumeWords = resumeText.toLowerCase().split(/[\s,]+/);

  const matches = keywords.filter(keyword => resumeWords.some(word => word.includes(keyword)));
  return (matches.length / keywords.length) * 100;
}
