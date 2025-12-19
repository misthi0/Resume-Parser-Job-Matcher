import React from 'react';

function ResumePreview({ data, darkMode }) {
  const calculateResumeScore = () => {
    let score = 0;
    if (data.name && data.name !== 'Unknown') score += 15;
    if (data.email && data.email !== 'Not found') score += 15;
    if (data.phone && data.phone !== 'Not found') score += 10;
    if (data.skills && data.skills.length > 0) score += 20;
    if (data.education && data.education.length > 0) score += 20;
    if (data.experience && data.experience.length > 0) score += 15;
    if (data.projects && data.projects.length > 0) score += 5;
    return score;
  };

  const score = calculateResumeScore();
  const scoreColor = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Resume Score Card */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow`}>
        <h3 className="text-lg font-semibold mb-4">Resume Score</h3>
        <div className={`text-5xl font-bold ${scoreColor}`}>{score}</div>
        <div className="w-full bg-gray-300 rounded-full h-3 mt-4">
          <div
            className={`h-3 rounded-full ${score >= 80 ? 'bg-green-600' : score >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Complete your resume for better job matches
        </p>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Personal Info */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow`}>
          <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
          <div className="space-y-3">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Name</p>
              <p className="font-semibold">{data.name}</p>
            </div>
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
              <p className="font-semibold">{data.email}</p>
            </div>
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone</p>
              <p className="font-semibold">{data.phone}</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow`}>
          <h3 className="text-xl font-semibold mb-4">Skills ({data.skills.length})</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.length > 0 ? (
              data.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No skills detected</p>
            )}
          </div>
        </div>

        {/* Education */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow`}>
          <h3 className="text-xl font-semibold mb-4">Education</h3>
          <ul className="space-y-2">
            {data.education.length > 0 ? (
              data.education.map((edu, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1">🎓</span>
                  <p>{edu}</p>
                </li>
              ))
            ) : (
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No education found</p>
            )}
          </ul>
        </div>

        {/* Experience */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow`}>
          <h3 className="text-xl font-semibold mb-4">Experience</h3>
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {data.experience.length > 0 ? (
              data.experience.map((exp, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-purple-600 mt-1">💼</span>
                  <p>{exp}</p>
                </li>
              ))
            ) : (
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No experience found</p>
            )}
          </ul>
        </div>

        {/* Projects */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow`}>
          <h3 className="text-xl font-semibold mb-4">Projects</h3>
          <ul className="space-y-2">
            {data.projects.length > 0 ? (
              data.projects.map((project, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-green-600 mt-1">🚀</span>
                  <p>{project}</p>
                </li>
              ))
            ) : (
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No projects found</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ResumePreview;
