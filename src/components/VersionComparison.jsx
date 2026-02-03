// frontend/src/components/VersionComparison.jsx
import React, { useState, useEffect } from 'react';
import { GitCompare } from 'lucide-react';
import api from '../services/api';

export default function VersionComparison({ theme, asset }) {
  const [versions, setVersions] = useState([]);
  const [version1, setVersion1] = useState('');
  const [version2, setVersion2] = useState('');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const pagePath = asset?.path;

  useEffect(() => {
    if (pagePath) {
      loadVersions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagePath]);

  const loadVersions = async () => {
    try {
      const response = await api.post('/version/list', { page_path: pagePath });
      if (response.data.success) {
        setVersions(response.data.versions || []);
      }
    } catch (error) {
      console.error('Failed to load versions:', error);
      // Fallback to mock versions for demo
      setVersions([
        { name: '1.0', label: 'Version 1.0 - Initial' },
        { name: '1.1', label: 'Version 1.1 - Updated' },
        { name: '1.2', label: 'Version 1.2 - Latest' }
      ]);
    }
  };

  const compareVersions = async () => {
    if (!version1 || !version2) return;

    setLoading(true);
    try {
      const response = await api.post('/version/compare', {
        page_path: pagePath,
        version1,
        version2
      });

      if (response.data.success) {
        setComparison(response.data);
      }
    } catch (error) {
      alert('Comparison failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${theme.card} border rounded-2xl p-6 shadow-lg`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <GitCompare className="w-5 h-5" />
        Version Comparison
      </h3>

      {!pagePath ? (
        <div className="text-center py-8">
          <p className={theme.subtext}>Select an asset to compare versions</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-sm font-medium mb-1">Asset:</p>
            <p className={`text-xs ${theme.subtext} truncate`}>{pagePath}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Version 1</label>
          <select
            value={version1}
            onChange={(e) => setVersion1(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg ${theme.input} border`}
          >
            <option value="">Select version...</option>
            {versions.map((v, idx) => (
              <option key={idx} value={v.name}>{v.label || v.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Version 2</label>
          <select
            value={version2}
            onChange={(e) => setVersion2(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg ${theme.input} border`}
          >
            <option value="">Select version...</option>
            {versions.map((v, idx) => (
              <option key={idx} value={v.name}>{v.label || v.name}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={compareVersions}
        disabled={!version1 || !version2 || loading}
        className={`w-full ${theme.button} text-white px-4 py-3 rounded-lg disabled:opacity-50`}
      >
        {loading ? 'Comparing...' : 'Compare Versions'}
      </button>

      {comparison && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${theme.input} border max-h-96 overflow-y-auto`}>
            <h4 className="font-semibold mb-2">Version 1</h4>
            <div className="text-sm whitespace-pre-wrap">{comparison.version1.content}</div>
          </div>
          <div className={`p-4 rounded-lg ${theme.input} border max-h-96 overflow-y-auto`}>
            <h4 className="font-semibold mb-2">Version 2</h4>
            <div className="text-sm whitespace-pre-wrap">{comparison.version2.content}</div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
