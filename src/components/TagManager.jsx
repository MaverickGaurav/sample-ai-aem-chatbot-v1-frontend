// frontend/src/components/TagManager.jsx
import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../services/api';

export default function TagManager({ theme }) {
  const [tags, setTags] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [namespace, setNamespace] = useState('default');
  const [showCreate, setShowCreate] = useState(false);
  const [newTag, setNewTag] = useState({ id: '', title: '', description: '' });

  useEffect(() => {
    loadTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace]);

  const loadTags = async () => {
    try {
      const response = await api.post('/tags/list', { namespace });
      if (response.data.success) {
        setTags(response.data.tags || []);
      }
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  };

  const createTag = async () => {
    try {
      await api.post('/tags/create', {
        namespace,
        tag_id: newTag.id,
        title: newTag.title,
        description: newTag.description
      });
      setNewTag({ id: '', title: '', description: '' });
      setShowCreate(false);
      loadTags();
    } catch (error) {
      alert('Failed to create tag');
    }
  };

  return (
    <div className={`${theme.card} border rounded-2xl p-6 shadow-lg`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Tag Manager
        </h3>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className={`${theme.button} text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2`}
        >
          <Plus className="w-4 h-4" />
          New Tag
        </button>
      </div>

      {showCreate && (
        <div className="mb-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 space-y-3">
          <input
            type="text"
            placeholder="Tag ID"
            value={newTag.id}
            onChange={(e) => setNewTag({ ...newTag, id: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg ${theme.input} border text-sm`}
          />
          <input
            type="text"
            placeholder="Tag Title"
            value={newTag.title}
            onChange={(e) => setNewTag({ ...newTag, title: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg ${theme.input} border text-sm`}
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newTag.description}
            onChange={(e) => setNewTag({ ...newTag, description: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg ${theme.input} border text-sm`}
          />
          <button
            onClick={createTag}
            className={`w-full ${theme.button} text-white px-4 py-2 rounded-lg text-sm`}
          >
            Create Tag
          </button>
        </div>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {tags.map((tag, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg ${theme.input} border flex justify-between items-center`}
          >
            <div>
              <p className="font-medium text-sm">{tag.title}</p>
              <p className={`text-xs ${theme.subtext}`}>{tag.path}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-1.5 hover:bg-blue-500/20 rounded">
                <Edit2 className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-red-500/20 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
