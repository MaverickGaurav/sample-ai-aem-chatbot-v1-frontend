import React from 'react';

export default function SettingsPanel({ settings, setSettings, theme }) {
  return (
    <div className={`max-w-7xl mx-auto px-6 py-4 ${theme.card} border-b`}>
      <h3 className="text-lg font-semibold mb-4">Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Model</label>
          <input 
            type="text" 
            value={settings.model} 
            onChange={(e) => setSettings({...settings, model: e.target.value})}
            className={`w-full px-4 py-2 rounded-lg ${theme.input} border outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="gemma:2b"
          />
          <p className={`text-xs ${theme.subtext} mt-1`}>e.g., gemma:2b, llama2, mistral</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Temperature: {settings.temperature.toFixed(1)}
          </label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={settings.temperature}
            onChange={(e) => setSettings({...settings, temperature: parseFloat(e.target.value)})}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs mt-1">
            <span className={theme.subtext}>Focused (0.0)</span>
            <span className={theme.subtext}>Creative (1.0)</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">AEM Host</label>
          <input 
            type="text" 
            value={settings.aemHost} 
            onChange={(e) => setSettings({...settings, aemHost: e.target.value})}
            className={`w-full px-4 py-2 rounded-lg ${theme.input} border outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="http://localhost:4502"
          />
          <p className={`text-xs ${theme.subtext} mt-1`}>Only needed for AEM features</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">API URL</label>
          <input 
            type="text" 
            value={settings.apiUrl} 
            onChange={(e) => setSettings({...settings, apiUrl: e.target.value})}
            className={`w-full px-4 py-2 rounded-lg ${theme.input} border outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="http://localhost:5000"
          />
          <p className={`text-xs ${theme.subtext} mt-1`}>Backend server URL</p>
        </div>
      </div>
    </div>
  );
}