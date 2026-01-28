import React, { useState, useRef } from 'react';
import { Upload, FileText } from 'lucide-react';

export default function FileUpload({ settings, theme }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', settings.model);

    try {
      const response = await fetch(`${settings.apiUrl}/api/file/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`${theme.card} border rounded-2xl p-6 shadow-lg`}>
      <h3 className="text-lg font-semibold mb-4">Upload File for Analysis</h3>
      
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center ${theme.input} cursor-pointer hover:border-blue-500 transition-all`}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm mb-2">Click to upload or drag and drop</p>
        <p className={`text-xs ${theme.subtext}`}>PDF, DOCX, TXT (Max 10MB)</p>
        <input 
          ref={fileInputRef} 
          type="file" 
          className="hidden" 
          accept=".pdf,.docx,.txt" 
          onChange={handleFileSelect} 
        />
      </div>

      {file && (
        <div className="mt-4 flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <span className="text-sm">{file.name}</span>
          </div>
          <button 
            onClick={handleUpload} 
            disabled={uploading} 
            className={`${theme.button} text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50`}
          >
            {uploading ? 'Uploading...' : 'Analyze'}
          </button>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
          <p className="text-sm font-semibold mb-2">Analysis Complete</p>
          {result.metadata && (
            <div className="text-xs space-y-1">
              <p>Words: {result.metadata.word_count}</p>
              <p>Characters: {result.metadata.character_count}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}