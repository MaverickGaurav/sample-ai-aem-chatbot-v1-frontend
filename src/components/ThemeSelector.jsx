// frontend/src/components/ThemeSelector.jsx
import React from 'react';
import { Palette } from 'lucide-react';
import themes from '../themes';

export default function ThemeSelector({ currentTheme, onThemeChange, theme }) {
  return (
    <div className={`${theme.card} border rounded-2xl p-6 shadow-lg`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Palette className="w-5 h-5" />
        Theme Selector
      </h3>

      <div className="grid grid-cols-1 gap-3">
        {Object.values(themes).map((t) => (
          <button
            key={t.id}
            onClick={() => onThemeChange(t.id)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              currentTheme === t.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-transparent hover:border-blue-400/50'
            } ${theme.input}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className={`text-xs ${theme.subtext}`}>
                  {t.id === 'dark' && 'Classic dark theme'}
                  {t.id === 'light' && 'Clean light theme'}
                  {t.id === 'aurora' && 'Premium glassmorphism'}
                </p>
              </div>
              <div className="flex gap-1">
                <div className={`w-6 h-6 rounded-full ${t.id === 'dark' ? 'bg-slate-800' : t.id === 'light' ? 'bg-white border' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}></div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
