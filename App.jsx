import React, { useState } from 'react';
import ResumeUpload from './components/ResumeUpload';
import ResumePreview from './components/ResumePreview';
import JobMatches from './components/JobMatches';

function App() {
  const [resumeData, setResumeData] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');

  const handleResumeUpload = async (file) => {
    setLoading(true);
    try {
      // Get the backend URL
      const backendUrl = getBackendUrl();
      
      console.log('Uploading file:', file.name);
      const formData = new FormData();
      formData.append('resume', file);
      
      // Parse resume
      console.log('Fetching from:', backendUrl + '/api/parse-resume');
      const response = await fetch(backendUrl + '/api/parse-resume', {
        method: 'POST',
        body: formData,
        mode: 'cors'
      });

      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to parse resume: ' + errorText);
      }

      const data = await response.json();
      console.log('Parsed data:', data);
      console.log('Resume parsed:', data);
      setResumeData(data);
      setActiveTab('preview');

      // Match jobs
      const matchResponse = await fetch(backendUrl + '/api/match-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: data.skills,
          experience: data.experience,
          education: data.education,
          rawText: data.rawText
        })
      });

      if (!matchResponse.ok) {
        throw new Error('Failed to match jobs');
      }

      const matchData = await matchResponse.json();
      setMatches(matchData);
      if (matchData && matchData.length > 0) {
        setActiveTab('matches');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  function getBackendUrl() {
    try {
      const url = new URL(window.location.href);
      // Replace port 5000 with 3001
      url.port = '3001';
      return url.origin;
    } catch (e) {
      return 'http://localhost:3001';
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">Resume Matcher</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 font-semibold ${activeTab === 'upload' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            1. Upload Resume
          </button>
          {resumeData && (
            <>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 font-semibold ${activeTab === 'preview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              >
                2. Preview Data
              </button>
              <button
                onClick={() => setActiveTab('matches')}
                className={`px-4 py-2 font-semibold ${activeTab === 'matches' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              >
                3. Job Matches
              </button>
            </>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'upload' && <ResumeUpload onUpload={handleResumeUpload} loading={loading} darkMode={darkMode} />}
        {activeTab === 'preview' && resumeData && <ResumePreview data={resumeData} darkMode={darkMode} />}
        {activeTab === 'matches' && matches.length > 0 && <JobMatches matches={matches} darkMode={darkMode} />}
      </main>
    </div>
  );
}

export default App;
