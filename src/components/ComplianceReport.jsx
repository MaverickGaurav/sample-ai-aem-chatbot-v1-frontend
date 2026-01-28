import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ComplianceReport({ results, onExport, onClear, theme }) {
  const [selectedResult, setSelectedResult] = useState(null);

  if (!results || results.length === 0) return null;

  const getGradeColor = (grade) => {
    const colors = {
      'A': 'bg-green-500',
      'B': 'bg-blue-500',
      'C': 'bg-yellow-500',
      'D': 'bg-orange-500',
      'F': 'bg-red-500'
    };
    return colors[grade] || 'bg-gray-500';
  };

  return (
    <div className={`${theme.card} border rounded-2xl p-6 shadow-lg`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Compliance Results</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => onExport('csv')} 
            className={`px-4 py-2 rounded-lg ${theme.input} border text-sm`}
          >
            Export CSV
          </button>
          <button 
            onClick={() => onExport('pdf')} 
            className={`px-4 py-2 rounded-lg ${theme.input} border text-sm`}
          >
            Export PDF
          </button>
          <button 
            onClick={onClear} 
            className={`px-4 py-2 rounded-lg ${theme.input} border text-sm`}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result, idx) => (
          <div 
            key={idx} 
            className={`p-4 rounded-xl border cursor-pointer hover:border-blue-500 transition-all ${theme.input}`}
            onClick={() => setSelectedResult(result)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm truncate">{result.page_title}</span>
              <span className={`px-2 py-1 rounded text-xs font-bold ${getGradeColor(result.grade)} text-white`}>
                {result.grade}
              </span>
            </div>
            <p className={`text-xs ${theme.subtext} truncate mb-3`}>{result.page_path}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Score:</span>
                <span className="font-semibold">{result.overall_score.toFixed(1)}%</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-500">
                  {result.high_priority_issues} High
                </span>
                <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-500">
                  {result.medium_priority_issues} Med
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-500">
                  {result.low_priority_issues} Low
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedResult && (
        <div className="mt-6 p-6 rounded-xl border">
          <h4 className="text-lg font-semibold mb-4">{selectedResult.page_title}</h4>
          {selectedResult.categories.map((category, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-medium">{category.name}</h5>
                <span className="text-sm">{category.score.toFixed(1)}%</span>
              </div>
              <div className="space-y-2">
                {category.checks.map((check, checkIdx) => (
                  <div 
                    key={checkIdx} 
                    className={`p-3 rounded-lg ${check.passed ? 'bg-green-500/10' : 'bg-red-500/10'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {check.passed ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="font-medium text-sm">{check.name}</span>
                    </div>
                    {!check.passed && check.issues && check.issues.length > 0 && (
                      <p className="text-xs ml-6 text-red-400">{check.issues.join(', ')}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}