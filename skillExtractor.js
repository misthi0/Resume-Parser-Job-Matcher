const COMMON_SKILLS = [
  // Languages - High Priority
  'python', 'java', 'javascript', 'typescript', 'c++', 'cpp', 'c#', 'csharp', 'php', 'ruby', 'go', 'rust', 'kotlin', 'swift',
  'sql', 'html', 'css', 'html5', 'css3', 'c', 'bash', 'shell', 'r', 'scala',
  
  // Frontend Frameworks & Libraries
  'react', 'react.js', 'vue', 'vue.js', 'angular', 'next.js', 'nextjs', 'gatsby', 'svelte',
  'tailwind', 'tailwind css', 'bootstrap', 'material ui', 'webpack', 'vite',
  
  // Backend & Servers
  'nodejs', 'node.js', 'express', 'express.js', 'django', 'flask', 'fastapi', 'spring', 'spring boot',
  'ruby on rails', 'asp.net', 'nest.js', 'nestjs', 'tomcat', 'apache',
  
  // Databases
  'sql', 'mysql', 'postgres', 'postgresql', 'mongodb', 'nosql', 'firebase', 'dynamodb', 'redis',
  'cassandra', 'elasticsearch', 'oracle', 'sqlite', 'mariadb', 'data structures',
  
  // Cloud & DevOps
  'aws', 'amazon web services', 'azure', 'microsoft azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'k8s',
  'jenkins', 'gitlab', 'github', 'ci/cd', 'circleci', 'travis', 'ansible', 'terraform', 'aws s3',
  
  // Version Control
  'git', 'github', 'gitlab', 'bitbucket', 'svn', 'mercurial',
  
  // AI/ML & Data Science - High Priority
  'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'sklearn', 'numpy', 'pandas', 'matplotlib', 'seaborn',
  'nlp', 'natural language processing', 'computer vision', 'opencv', 'cv', 'machine learning', 'ml',
  'deep learning', 'llm', 'large language model', 'langchain', 'langgraph', 'generative ai',
  'chatgpt', 'openai', 'pinecone', 'vector database', 'transformers', 'hugging face',
  'lstm', 'cnn', 'rnn', 'bert', 'gpt', 'neural network', 'neural networks',
  
  // Testing & Quality
  'pytest', 'unittest', 'jest', 'mocha', 'chai', 'rspec', 'jira', 'testing', 'unit test', 'integration test',
  'e2e', 'end-to-end', 'qa', 'quality assurance', 'selenium', 'playwright',
  
  // Development Practices
  'agile', 'scrum', 'kanban', 'waterfall', 'api', 'rest', 'restful', 'graphql', 'websockets',
  'microservices', 'oop', 'object-oriented', 'functional programming', 'design patterns', 'solid',
  'mvc', 'mvvm', 'clean code', 'refactoring',
  
  // Build & Package Managers
  'npm', 'yarn', 'pip', 'maven', 'gradle', 'cargo', 'composer', 'gems', 'bundler', 'poetry',
  
  // Other Tools & Platforms
  'linux', 'ubuntu', 'windows', 'macos', 'unix',
  'figma', 'adobe xd', 'adobe', 'photoshop', 'illustrator',
  'salesforce', 'sharepoint', 'excel', 'power bi', 'tableau', 'looker',
  'slack', 'confluence', 'asana', 'monday', 'trello',
  'jupyter', 'jupyter notebook', 'anaconda', 'colab', 'google colab',
  'streamlit', 'gradio', 'fastapi', 'flask',
  'whisper', 'stt', 'speech-to-text', 'text-to-speech', 'tts',
  
  // Security & Authentication
  'oauth', 'jwt', 'bcrypt', 'authentication', 'authorization', 'security', 'encryption', 'ssl', 'https',
  'cors', 'csrf', 'xss', 'sql injection', 'penetration testing',
  
  // Soft Skills
  'leadership', 'communication', 'teamwork', 'team work', 'collaboration', 'management', 'problem solving',
  'critical thinking', 'analytical', 'creativity', 'time management', 'presentation', 'documentation',
  'design', 'ux', 'user experience', 'ui', 'user interface',
  
  // Additional High-Value Skills
  'data analysis', 'data visualization', 'big data', 'hadoop', 'spark', 'etl',
  'blockchain', 'web3', 'solidity', 'smart contracts',
  'mobile development', 'ios', 'android', 'react native', 'flutter', 'xamarin',
  'performance optimization', 'debugging', 'troubleshooting', 'optimization',
  'algorithm', 'data structure', 'algorithms', 'dsa',
  'web development', 'full stack', 'fullstack', 'backend development', 'frontend development',
  'database design', 'database management', 'sql design',
  'api development', 'api design', 'rest api', 'restful api',
  'code review', 'version control', 'source control',
  'deployment', 'devops', 'infrastructure', 'server', 'hosting',
  'scm', 'configuration management', 'ci/cd pipeline', 'automation',
  'robotics', 'iot', 'internet of things', 'embedded systems', 'arduino',
  'hackathon', 'competitive programming', 'open source', 'contribution'
];

export function extractSkills(text) {
  if (!text || typeof text !== 'string' || text.length < 10) {
    console.warn('No valid text for skill extraction');
    return [];
  }
  
  const lowerText = text.toLowerCase();
  const foundSkills = new Set();

  // Sort skills by length (longest first) to match specific phrases first
  const sortedSkills = [...COMMON_SKILLS].sort((a, b) => b.length - a.length);

  for (const skill of sortedSkills) {
    try {
      // Use word boundary matching for better accuracy
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      if (regex.test(lowerText)) {
        foundSkills.add(skill.toLowerCase());
      }
    } catch (e) {
      console.error('Error checking skill:', skill, e.message);
    }
  }

  const result = Array.from(foundSkills);
  console.log('🎯 Detected skills:', result.length, 'skills');
  return result;
}

export function calculateSkillMatch(resumeSkills, jobSkills) {
  if (!Array.isArray(resumeSkills) || !Array.isArray(jobSkills)) {
    return 0;
  }
  
  if (jobSkills.length === 0) {
    return 100;
  }

  const resumeSkillsLower = resumeSkills.map(s => String(s).toLowerCase());
  const jobSkillsLower = jobSkills.map(s => String(s).toLowerCase());
  
  const matched = jobSkillsLower.filter(skill => 
    resumeSkillsLower.some(rSkill => rSkill.includes(skill) || skill.includes(rSkill))
  );

  return (matched.length / jobSkillsLower.length) * 100;
}
