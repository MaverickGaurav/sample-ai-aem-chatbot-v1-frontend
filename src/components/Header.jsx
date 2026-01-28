// frontend/src/components/Header.jsx
import React from 'react';
import { Settings, Moon, Sun, Sparkles } from 'lucide-react';

export default function Header({ darkMode, setDarkMode, showSettings, setShowSettings, theme }) {
  return (
    <div className={`${theme.card} border-b sticky top-0 z-50 shadow-lg`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              A Demo bot!
            </h1>
            <p className={`text-sm ${theme.subtext}`}>AI-Powered AEM Analysis & Compliance</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2.5 rounded-lg ${theme.input} border transition-all hover:scale-105 active:scale-95`}
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2.5 rounded-lg ${theme.input} border transition-all hover:scale-105 active:scale-95`}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
