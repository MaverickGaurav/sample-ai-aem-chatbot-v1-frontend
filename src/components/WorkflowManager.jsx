// frontend/src/components/WorkflowManager.jsx
import React, { useState, useEffect } from 'react';
import { Play, Clock } from 'lucide-react';
import api from '../services/api';

export default function WorkflowManager({ theme, selectedPages }) {
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      const response = await api.get('/workflow/list');
      if (response.data.success) {
        setWorkflows(response.data.workflows || []);
      }
    } catch (error) {
      console.error('Failed to load workflows:', error);
      // Fallback to common AEM workflows if API fails
      setWorkflows([
        { path: '/var/workflow/models/dam/update_asset', title: 'DAM Update Asset' },
        { path: '/var/workflow/models/dam/dam-autotag-assets', title: 'Auto-tag Assets' },
        { path: '/etc/workflow/models/request_for_activation', title: 'Request for Activation' },
        { path: '/etc/workflow/models/request_for_deactivation', title: 'Request for Deactivation' },
        { path: '/etc/workflow/models/wcm-translation/create_language_copy', title: 'Create Language Copy' }
      ]);
    }
  };

  const startWorkflow = async () => {
    if (!selectedWorkflow || !selectedPages || selectedPages.length === 0) return;

    setLoading(true);
    try {
      for (const pagePath of selectedPages) {
        await api.post('/workflow/start', {
          page_path: pagePath,
          workflow_model: selectedWorkflow
        });
      }
      alert('Workflows started successfully!');
    } catch (error) {
      alert('Failed to start workflows');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${theme.card} border rounded-2xl p-6 shadow-lg`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Play className="w-5 h-5" />
        Workflow Manager
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Workflow</label>
          <select
            value={selectedWorkflow}
            onChange={(e) => setSelectedWorkflow(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg ${theme.input} border`}
          >
            <option value="">Choose a workflow...</option>
            {workflows.map((wf, idx) => (
              <option key={idx} value={wf.path}>{wf.title}</option>
            ))}
          </select>
        </div>

        <div className={`p-3 rounded-lg ${theme.input} border`}>
          <p className="text-sm font-medium mb-2">Selected Pages:</p>
          {selectedPages && selectedPages.length > 0 ? (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {selectedPages.map((page, idx) => (
                <p key={idx} className={`text-xs ${theme.subtext} truncate`}>
                  • {page}
                </p>
              ))}
            </div>
          ) : (
            <p className={`text-xs ${theme.subtext}`}>
              No pages selected. Select pages from AEM Page Picker above.
            </p>
          )}
        </div>

        <button
          onClick={startWorkflow}
          disabled={!selectedWorkflow || !selectedPages?.length || loading}
          className={`w-full ${theme.button} text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50`}
        >
          {loading ? (
            <>
              <Clock className="w-5 h-5 animate-spin" />
              Starting Workflows...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Start Workflow
            </>
          )}
        </button>
      </div>
    </div>
  );
}
