// frontend/src/hooks/useChat.js
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import api from '../services/api';

export function useChat(settings) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AEM Compliance Assistant. How can I help you today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const [conversationId] = useState(() => uuidv4());

  const sendMessage = async (message, mode) => {
    if (!message.trim() || loading) return null;

    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await api.post('/chat', {
        message,
        mode,
        model: settings.model,
        temperature: settings.temperature,
        conversation_id: conversationId
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.message
      };

      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
      
      return response.data;
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `Error: ${error.response?.data?.message || error.message || 'Failed to send message'}`
      };
      setMessages(prev => [...prev, errorMessage]);
      setLoading(false);
      return null;
    }
  };

  const clearChat = async () => {
    try {
      await api.post(`/conversation/clear/${conversationId}`);
      setMessages([
        { role: 'assistant', content: 'Chat cleared. How can I help you?' }
      ]);
    } catch (error) {
      console.error('Failed to clear chat:', error);
    }
  };

  const exportChat = () => {
    const chatText = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    messages,
    loading,
    sendMessage,
    clearChat,
    exportChat
  };
}
