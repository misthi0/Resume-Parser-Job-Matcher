import React, { useState, useRef } from 'react';

function ResumeUpload({ onUpload, loading, darkMode }) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files[0]) {
      onUpload(files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border-2 border-dashed p-12`}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center cursor-pointer transition ${
          dragActive ? 'bg-blue-50 border-blue-400' : ''
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleChange}
          disabled={loading}
          className="hidden"
        />
        <div className="text-6xl mb-4">📄</div>
        <h2 className="text-2xl font-bold mb-2">Drag and Drop Your Resume</h2>
        <p className={`text-center mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          or click to select. Supported formats: PDF, DOCX
        </p>
        <button
          onClick={handleClick}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Select File'}
        </button>
        <p className={`text-sm mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Maximum file size: 10MB
        </p>
      </div>
    </div>
  );
}

export default ResumeUpload;
