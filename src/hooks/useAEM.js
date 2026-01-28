// frontend/src/hooks/useAEM.js
import { useState } from 'react';
import api from '../services/api';

export function useAEM(settings) {
  const [pages, setPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [complianceResults, setComplianceResults] = useState(null);
  const [loadingPages, setLoadingPages] = useState(false);
  const [loadingCompliance, setLoadingCompliance] = useState(false);

  const queryPages = async (path = '/content', depth = 3) => {
    setLoadingPages(true);
    try {
      const response = await api.post('/aem/query', { path, depth });
      if (response.data.success) {
        setPages(response.data.pages || []);
      } else {
        console.error('Failed to query pages:', response.data.error);
      }
    } catch (error) {
      console.error('Error querying pages:', error);
    } finally {
      setLoadingPages(false);
    }
  };

  const selectPage = (pagePath) => {
    setSelectedPages(prev => {
      if (prev.includes(pagePath)) {
        return prev.filter(p => p !== pagePath);
      } else {
        return [...prev, pagePath];
      }
    });
  };

  const runComplianceCheck = async (categories = null) => {
    if (selectedPages.length === 0) {
      alert('Please select at least one page');
      return;
    }

    setLoadingCompliance(true);
    try {
      const response = await api.post('/aem/compliance/check', {
        page_paths: selectedPages,
        categories,
        model: settings.model
      });

      setComplianceResults(response.data.results);
    } catch (error) {
      console.error('Error running compliance check:', error);
      alert('Failed to run compliance check');
    } finally {
      setLoadingCompliance(false);
    }
  };

  const exportResults = async (format = 'csv') => {
    if (!complianceResults) return;

    try {
      const response = await api.post('/aem/compliance/export', {
        format,
        results: complianceResults,
        include_details: true
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `compliance-report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting results:', error);
      alert('Failed to export results');
    }
  };

  const clearResults = () => {
    setComplianceResults(null);
    setSelectedPages([]);
  };

  return {
    pages,
    selectedPages,
    complianceResults,
    loadingPages,
    loadingCompliance,
    queryPages,
    selectPage,
    runComplianceCheck,
    exportResults,
    clearResults
  };
}
