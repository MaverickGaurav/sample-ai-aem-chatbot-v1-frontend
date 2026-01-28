// frontend/src/components/Message.jsx
import React from 'react';
import { Copy, User, Bot, Check } from 'lucide-react';

export default function Message({ message, theme }) {
  const [copied, setCopied] = React.useState(false);
  
  const isUser = message.role === 'user';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-4 animate-fadeIn ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <Bot className="w-6 h-6 text-white" />
        </div>
      )}
      
      <div className={`max-w-3xl px-5 py-4 rounded-2xl border shadow-sm ${
        isUser 
          ? darkMode => darkMode ? 'bg-blue-600/20 border-blue-500/30' : 'bg-blue-50 border-blue-200'
          : darkMode => darkMode ? 'bg-slate-700/30 border-slate-600/30' : 'bg-slate-50 border-slate-200'
      }`}>
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        
        {!isUser && (
          <div className="flex gap-2 mt-3 pt-2 border-t border-current/10">
            <button
              onClick={copyToClipboard}
              className={`p-2 rounded-lg ${theme.input} border hover:scale-105 transition-all text-sm flex items-center gap-2`}
              aria-label="Copy message"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <User className="w-6 h-6 text-white" />
        </div>
      )}
    </div>
  );
}
