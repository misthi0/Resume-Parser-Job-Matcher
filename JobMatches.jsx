import React, { useState } from 'react';

function JobMatches({ matches, darkMode }) {
  const [expandedJob, setExpandedJob] = useState(null);
  const [filterMinScore, setFilterMinScore] = useState(0);

  const filteredMatches = matches.filter(job => job.matchScore >= filterMinScore);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 shadow`}>
        <label className="block text-sm font-semibold mb-2">Filter by minimum match score:</label>
        <input
          type="range"
          min="0"
          max="100"
          value={filterMinScore}
          onChange={(e) => setFilterMinScore(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-sm mt-2">Showing {filteredMatches.length} jobs (Score: {filterMinScore}+)</div>
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((job) => (
            <div
              key={job.id}
              className={`${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} rounded-lg p-6 shadow cursor-pointer transition border-l-4 border-blue-600`}
              onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{job.company}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 text-xs rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      📍 {job.location}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      📊 {job.experience_level}
                    </span>
                  </div>
                </div>
                <div className={`text-center ${getScoreBgColor(job.matchScore)} rounded-lg p-4`}>
                  <div className={`text-3xl font-bold ${getScoreColor(job.matchScore)}`}>
                    {job.matchScore}%
                  </div>
                  <p className="text-xs font-semibold mt-1">Match</p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-2 rounded text-center`}>
                  <p className="text-xs font-semibold">Skills</p>
                  <p className="text-lg font-bold text-blue-600">{job.matchBreakdown.skills}%</p>
                </div>
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-2 rounded text-center`}>
                  <p className="text-xs font-semibold">Experience</p>
                  <p className="text-lg font-bold text-purple-600">{job.matchBreakdown.experience}%</p>
                </div>
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-2 rounded text-center`}>
                  <p className="text-xs font-semibold">Education</p>
                  <p className="text-lg font-bold text-green-600">{job.matchBreakdown.education}%</p>
                </div>
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-2 rounded text-center`}>
                  <p className="text-xs font-semibold">Keywords</p>
                  <p className="text-lg font-bold text-orange-600">{job.matchBreakdown.keywords}%</p>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedJob === job.id && (
                <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Skills Required:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Description:</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                      {job.description}
                    </p>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Salary Range:</h4>
                    <p className="text-lg font-bold text-green-600">{job.salary_range}</p>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold">
                    Apply Now
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 text-center`}>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No jobs match your criteria. Try lowering the filter score.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobMatches;
