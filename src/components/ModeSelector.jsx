// frontend/src/components/ModeSelector.jsx
import React from 'react';
import { MessageSquare, Upload, Globe, Layout } from 'lucide-react';
import { CHAT_MODES } from '../utils/constants';

export default function ModeSelector({ currentMode, onModeChange, theme }) {
  const modes = [
    { id: CHAT_MODES.CHAT, label: 'Chat', icon: MessageSquare, description: 'General conversation' },
    { id: CHAT_MODES.FILE, label: 'File Upload', icon: Upload, description: 'Analyze documents' },
    { id: CHAT_MODES.WEB, label: 'Web Search', icon: Globe, description: 'Search the web' },
    { id: CHAT_MODES.AEM, label: 'AEM', icon: Layout, description: 'AEM compliance & analysis' }
  ];

  return (
    <div className={`${theme.card} border rounded-2xl p-4 shadow-lg`}>
      <h3 className={`text-sm font-semibold ${theme.subtext} mb-3`}>SELECT MODE</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;
          
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`p-4 rounded-xl border-2 transition-all hover:scale-105 active:scale-95 ${
                isActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : `${theme.input} border-transparent hover:border-blue-400/50`
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`p-3 rounded-lg ${isActive ? 'bg-blue-500' : theme.input}`}>
                  <Icon className={`w-6 h-6 ${isActive ? 'text-white' : theme.text}`} />
                </div>
                <div className="text-center">
                  <div className={`font-semibold ${isActive ? 'text-blue-500' : theme.text}`}>
                    {mode.label}
                  </div>
                  <div className={`text-xs ${theme.subtext}`}>{mode.description}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
