import React, { useState } from 'react';
import Header from './components/Header';
import ModeSelector from './components/ModeSelector';
import Chat from './components/Chat';
import FileUpload from './components/FileUpload';
import AEMPagePicker from './components/AEMPagePicker';
import ComplianceReport from './components/ComplianceReport';
import SettingsPanel from './components/SettingsPanel';
import ThemeSelector from './components/ThemeSelector';
import ImageGeneration from './components/ImageGeneration';
import AssetBrowser from './components/AssetBrowser';
import TagManager from './components/TagManager';
import WorkflowManager from './components/WorkflowManager';
import LivePreview from './components/LivePreview';
import VersionComparison from './components/VersionComparison';
import { useChat } from './hooks/useChat';
import { useAEM } from './hooks/useAEM';
import { CHAT_MODES } from './utils/constants';
import themes from './themes';

function App() {
  const [currentTheme, setCurrentTheme] = useState('aurora');
  const [showSettings, setShowSettings] = useState(false);
  const [currentMode, setCurrentMode] = useState(CHAT_MODES.CHAT);
  const [settings, setSettings] = useState({
    model: 'gemma3',
    temperature: 0.7,
    aemHost: 'http://localhost:4502',
    apiUrl: 'http://localhost:8000'
  });
  const [selectedAsset, setSelectedAsset] = useState(null);

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

  const theme = themes[currentTheme] || themes.dark;

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
        darkMode={currentTheme === 'dark'}
        setDarkMode={(isDark) => setCurrentTheme(isDark ? 'dark' : 'light')}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        theme={theme}
      />

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-start justify-end pt-20 p-6">
          <div className="w-full max-w-md space-y-4">
            <SettingsPanel
              settings={settings}
              setSettings={setSettings}
              theme={theme}
            />
            <ThemeSelector
              currentTheme={currentTheme}
              onThemeChange={setCurrentTheme}
              theme={theme}
            />
          </div>
        </div>
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
            <FileUpload
              settings={settings}
              theme={theme}
            />
          )}

          {currentMode === CHAT_MODES.WEB && (
            <Chat
              messages={messages}
              loading={loading}
              onSendMessage={handleSendMessage}
              onClearChat={clearChat}
              onExportChat={exportChat}
              theme={theme}
              placeholder="Ask a question about web content..."
            />
          )}

          {currentMode === CHAT_MODES.AEM && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                <ImageGeneration
                  settings={settings}
                  theme={theme}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AssetBrowser
                  theme={theme}
                  settings={settings}
                  onSelectAsset={setSelectedAsset}
                />

                <LivePreview
                  pagePath={selectedAsset?.path}
                  theme={theme}
                />
              </div>

              {complianceResults && complianceResults.length > 0 && (
                <ComplianceReport
                  results={complianceResults}
                  onExport={exportResults}
                  onClear={clearResults}
                  theme={theme}
                />
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TagManager theme={theme} />
                <WorkflowManager 
                  theme={theme} 
                  selectedPages={selectedPages}
                />
              </div>

              <VersionComparison
                asset={selectedAsset}
                theme={theme}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;