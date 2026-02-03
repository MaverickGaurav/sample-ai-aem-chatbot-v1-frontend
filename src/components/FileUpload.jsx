import React, { useState, useRef } from 'react';
import { Upload, FileText } from 'lucide-react';

export default function FileUpload({ settings, theme }) {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [task, setTask] = useState('qa');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const tasks = [
    { id: 'qa', name: 'Question & Answer' },
    { id: 'summarize', name: 'Summarize' },
    { id: 'analyze', name: 'Analyze' },
    { id: 'extract', name: 'Extract Key Info' },
    { id: 'translate', name: 'Translate' }
  ];

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('question', question);
    formData.append('task', task);
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
      <h3 className="text-lg font-semibold mb-4">Upload & Analyze File</h3>
      
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center ${theme.input} cursor-pointer`}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm mb-2">Click to upload file</p>
        <input 
          ref={fileInputRef} 
          type="file" 
          className="hidden" 
          onChange={(e) => setFile(e.target.files[0])} 
        />
      </div>

      {file && (
        <div className="mt-4 space-y-4">
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <FileText className="w-5 h-5 inline mr-2" />
            {file.name}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Task</label>
            <select
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg ${theme.input} border`}
            >
              {tasks.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          
          {task === 'qa' && (
            <div>
              <label className="block text-sm font-medium mb-2">Your Question</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about the file..."
                className={`w-full px-4 py-2 rounded-lg ${theme.input} border`}
              />
            </div>
          )}
          
          <button 
            onClick={handleUpload} 
            disabled={uploading} 
            className={`w-full ${theme.button} text-white px-4 py-2 rounded-lg`}
          >
            {uploading ? 'Processing...' : 'Process File'}
          </button>
        </div>
      )}

      {result && (
        <div className={`mt-4 p-4 rounded-lg border ${result.error ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
          {result.error ? (
            <>
              <p className="text-sm font-semibold mb-2 text-red-500">Error:</p>
              <p className="text-sm whitespace-pre-wrap">{result.error}</p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold mb-2 text-green-500">Result:</p>
              <p className="text-sm whitespace-pre-wrap">{result.answer || result.summary || result.result || JSON.stringify(result, null, 2)}</p>
              {result.metadata && (
                <div className="mt-3 pt-3 border-t border-current/20">
                  <p className="text-xs font-semibold mb-1">Metadata:</p>
                  <p className="text-xs opacity-70">{JSON.stringify(result.metadata, null, 2)}</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}