import React, { useState } from 'react';
import { Wand2, Download, Sparkles } from 'lucide-react';
import api from '../services/api';

export default function ImageGeneration({ settings, theme }) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  
  const styles = [
    { id: 'realistic', name: 'Realistic' },
    { id: 'artistic', name: 'Digital Art' },
    { id: 'cartoon', name: 'Cartoon' },
    { id: 'anime', name: 'Anime' },
    { id: 'sketch', name: 'Sketch' },
    { id: 'oil_painting', name: 'Oil Painting' },
    { id: 'watercolor', name: 'Watercolor' },
    { id: 'cyberpunk', name: 'Cyberpunk' }
  ];

  const generateImage = async () => {
    if (!prompt.trim() || loading) return;
    
    setLoading(true);
    try {
      const response = await api.post('/image/generate', {
        prompt,
        style,
        width: 512,
        height: 512
      });
      
      if (response.data.success) {
        setGeneratedImage(response.data);
      }
    } catch (error) {
      console.error('Image generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${theme.card} border rounded-2xl p-6 shadow-lg`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Wand2 className="w-5 h-5" />
        AI Image Generation
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className={`w-full px-4 py-3 rounded-lg ${theme.input} border resize-none`}
            rows="3"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Style</label>
          <div className="grid grid-cols-4 gap-2">
            {styles.map(s => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  style === s.id
                    ? 'bg-blue-500 text-white'
                    : `${theme.input} border`
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
        
        <button
          onClick={generateImage}
          disabled={loading || !prompt.trim()}
          className={`w-full ${theme.button} text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50`}
        >
          {loading ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Generate Image
            </>
          )}
        </button>
        
        {generatedImage && (
          <div className="mt-6">
            <img
              src={`${settings.apiUrl}/uploads/generated_images/${generatedImage.file_name}`}
              alt="Generated"
              className="w-full rounded-lg shadow-lg"
            />
            <button
              className={`mt-2 w-full ${theme.input} border px-4 py-2 rounded-lg flex items-center justify-center gap-2`}
            >
              <Download className="w-4 h-4" />
              Download Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}