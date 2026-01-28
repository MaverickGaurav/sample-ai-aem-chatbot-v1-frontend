import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ModeSelector from './components/ModeSelector';
import Chat from './components/Chat';
import FileUpload from './components/FileUpload';
import AEMPagePicker from './components/AEMPagePicker';
import ComplianceReport from './components/ComplianceReport';
import SettingsPanel from './components/SettingsPanel';
import { useChat } from './hooks/useChat';
import { useAEM } from './hooks/useAEM';
import { CHAT_MODES } from './utils/constants';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [currentMode, setCurrentMode] = useState(CHAT_MODES.CHAT);
  const [settings, setSettings] = useState({
    model: 'gemma3',
    temperature: 0.7,
    aemHost: 'http://localhost:4502',
    apiUrl: 'http://localhost:8000'
  });

  // Chat hook
  const {
    messages,
    loading,
    sendMessage,
    clearChat,
    exportChat
  } = useChat(settings);

  // AEM hook
  const {
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
  } = useAEM(settings);

  const theme = {
    bg: darkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100',
    card: darkMode ? 'bg-slate-800/50 backdrop-blur-xl border-slate-700' : 'bg-white/80 backdrop-blur-xl border-slate-200',
    text: darkMode ? 'text-slate-100' : 'text-slate-900',
    subtext: darkMode ? 'text-slate-400' : 'text-slate-600',
    input: darkMode ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400',
    button: darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-600'
  };

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    // Clear mode-specific data when switching
    if (mode !== CHAT_MODES.AEM && complianceResults) {
      clearResults();
    }
  };

  const handleSendMessage = async (message) => {
    const response = await sendMessage(message, currentMode);
    
    // Check if mode should be switched
    if (response && response.suggested_mode && response.suggested_mode !== currentMode) {
      setCurrentMode(response.suggested_mode);
    }
    
    return response;
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} transition-all duration-300`}>
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        theme={theme}
      />

      {showSettings && (
        <SettingsPanel
          settings={settings}
          setSettings={setSettings}
          theme={theme}
        />
      )}

      <div className="max-w-7xl mx-auto px-6 py-6">
        <ModeSelector
          currentMode={currentMode}
          onModeChange={handleModeChange}
          theme={theme}
        />

        <div className="mt-6">
          {currentMode === CHAT_MODES.CHAT && (
            <Chat
              messages={messages}
              loading={loading}
              onSendMessage={handleSendMessage}
              onClearChat={clearChat}
              onExportChat={exportChat}
              theme={theme}
            />
          )}

          {currentMode === CHAT_MODES.FILE && (
            <div>
              <FileUpload
                settings={settings}
                theme={theme}
              />
              <div className="mt-6">
                <Chat
                  messages={messages}
                  loading={loading}
                  onSendMessage={handleSendMessage}
                  onClearChat={clearChat}
                  onExportChat={exportChat}
                  theme={theme}
                  placeholder="Ask a question about your uploaded file..."
                />
              </div>
            </div>
          )}

          {currentMode === CHAT_MODES.WEB && (
            <Chat
              messages={messages}
              loading={loading}
              onSendMessage={handleSendMessage}
              onClearChat={clearChat}
              onExportChat={exportChat}
              theme={theme}
              placeholder="Search the web for information..."
              showWebIndicator={true}
            />
          )}

          {currentMode === CHAT_MODES.AEM && (
            <div className="space-y-6">
              <AEMPagePicker
                pages={pages}
                selectedPages={selectedPages}
                loadingPages={loadingPages}
                loadingCompliance={loadingCompliance}
                onQueryPages={queryPages}
                onSelectPage={selectPage}
                onRunCompliance={runComplianceCheck}
                theme={theme}
              />

              {complianceResults && complianceResults.length > 0 && (
                <ComplianceReport
                  results={complianceResults}
                  onExport={exportResults}
                  onClear={clearResults}
                  theme={theme}
                />
              )}

              <div className="mt-6">
                <Chat
                  messages={messages}
                  loading={loading}
                  onSendMessage={handleSendMessage}
                  onClearChat={clearChat}
                  onExportChat={exportChat}
                  theme={theme}
                  placeholder="Ask me anything about AEM..."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;