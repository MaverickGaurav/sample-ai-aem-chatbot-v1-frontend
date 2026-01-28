import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export default function AEMPagePicker({ pages, selectedPages, loadingPages, loadingCompliance, onQueryPages, onSelectPage, onRunCompliance, theme }) {
  const [path, setPath] = useState('/content');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPages = pages.filter(page => 
    page.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${theme.card} border rounded-2xl p-6 shadow-lg`}>
      <h3 className="text-lg font-semibold mb-4">AEM Page Selector</h3>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="/content/mysite"
          className={`flex-1 px-4 py-2 rounded-lg ${theme.input} border`}
        />
        <button 
          onClick={() => onQueryPages(path)} 
          disabled={loadingPages} 
          className={`${theme.button} text-white px-6 py-2 rounded-lg disabled:opacity-50`}
        >
          {loadingPages ? 'Loading...' : 'Query Pages'}
        </button>
      </div>

      {pages.length > 0 && (
        <>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search pages..."
            className={`w-full px-4 py-2 rounded-lg ${theme.input} border mb-3`}
          />
          
          <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
            {filteredPages.map(page => (
              <div 
                key={page.path} 
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedPages.includes(page.path) 
                    ? 'bg-blue-500/20 border-blue-500' 
                    : `${theme.input} hover:border-blue-400`
                }`}
                onClick={() => onSelectPage(page.path)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{page.title}</p>
                    <p className={`text-xs ${theme.subtext}`}>{page.path}</p>
                  </div>
                  {selectedPages.includes(page.path) && (
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">{selectedPages.length} page(s) selected</span>
            <button 
              onClick={() => onRunCompliance()} 
              disabled={selectedPages.length === 0 || loadingCompliance} 
              className={`${theme.button} text-white px-6 py-2 rounded-lg disabled:opacity-50`}
            >
              {loadingCompliance ? 'Checking...' : 'Run Compliance Check'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}