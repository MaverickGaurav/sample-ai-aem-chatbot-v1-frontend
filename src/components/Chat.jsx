import React, { useState, useRef, useEffect } from 'react';
import { Send, Download, RotateCcw, Bot, User, Globe } from 'lucide-react';

export default function Chat({ messages, loading, onSendMessage, onClearChat, onExportChat, theme, placeholder = "Type your message...", showWebIndicator = false }) {
  const [input, setInput] = useState('');
  const [searchEngine, setSearchEngine] = useState('google');
  const messagesEndRef = useRef(null);

  const searchEngines = [
    { id: 'google', name: 'Google' },
    { id: 'bing', name: 'Bing' },
    { id: 'duckduckgo', name: 'DuckDuckGo' },
    { id: 'brave', name: 'Brave Search' }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    await onSendMessage(input);
    setInput('');
  };

  return (
    <div className={`${theme.card} border rounded-2xl shadow-lg overflow-hidden`}>
      <div className="p-4 border-b border-current/10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold">Conversation</h3>
          {showWebIndicator && (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              <select
                value={searchEngine}
                onChange={(e) => setSearchEngine(e.target.value)}
                className={`px-3 py-1 rounded-lg ${theme.input} border text-sm`}
              >
                {searchEngines.map(engine => (
                  <option key={engine.id} value={engine.id}>{engine.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={onClearChat} className={`px-3 py-1.5 rounded-lg ${theme.input} border text-sm flex items-center gap-2`}>
            <RotateCcw className="w-4 h-4" />
            Clear
          </button>
          <button onClick={onExportChat} className={`px-3 py-1.5 rounded-lg ${theme.input} border text-sm flex items-center gap-2`}>
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div className={`max-w-2xl px-4 py-3 rounded-xl ${msg.role === 'user' ? 'bg-blue-600/20 border border-blue-500/30' : 'bg-slate-700/30 border border-slate-600/30'}`}>
              <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            </div>
            <div className="px-4 py-3 rounded-xl bg-slate-700/30 border border-slate-600/30">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-current/10">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={placeholder}
            className={`flex-1 px-4 py-3 rounded-lg ${theme.input} border resize-none outline-none`}
            rows="2"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={`${theme.button} text-white px-6 rounded-lg flex items-center gap-2 disabled:opacity-50`}
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
