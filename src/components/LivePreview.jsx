// frontend/src/components/LivePreview.jsx
import React from 'react';
import { ExternalLink, Maximize2 } from 'lucide-react';

export default function LivePreview({ theme, pagePath }) {
  // Check if pagePath already includes the host
  const isFullUrl = pagePath && (pagePath.startsWith('http://') || pagePath.startsWith('https://'));
  
  // Extract the actual path without host if it's a full URL
  let actualPath = pagePath;
  if (isFullUrl) {
    try {
      const url = new URL(pagePath);
      actualPath = url.pathname;
    } catch (e) {
      actualPath = pagePath;
    }
  }
  
  // For iframe preview - direct to the asset
  const previewUrl = pagePath 
    ? `http://localhost:4502${actualPath}`
    : null;
  
  // For open in new tab - use assetdetails.html
  const openUrl = pagePath
    ? `http://localhost:4502/assetdetails.html${actualPath}?wcmmode=disabled`
    : null;

  return (
    <div className={`${theme.card} border rounded-2xl p-6 shadow-lg`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Live Preview</h3>
        {openUrl && (
          <a
            href={openUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${theme.button} text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2`}
          >
            <ExternalLink className="w-4 h-4" />
            Open
          </a>
        )}
      </div>

      {previewUrl ? (
        <div className="relative" style={{ height: '600px' }}>
          <iframe
            src={previewUrl}
            className="w-full h-full rounded-lg border"
            title="Page Preview"
          />
        </div>
      ) : (
        <div className="h-96 flex items-center justify-center border rounded-lg">
          <div className="text-center">
            <Maximize2 className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className={theme.subtext}>Select a page to preview</p>
          </div>
        </div>
      )}
    </div>
  );
}
