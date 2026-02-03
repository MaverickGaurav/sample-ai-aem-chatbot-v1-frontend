import React, { useState } from 'react';
import { Folder, FileText, Image, Film, Search, Download } from 'lucide-react';
import api from '../services/api';

export default function AssetBrowser({ theme, settings, onSelectAsset }) {
  const [assets, setAssets] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [currentPath, setCurrentPath] = useState('/content/dam');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const aemHost = settings?.aemHost || 'http://localhost:4502';

  // Remove the useEffect that auto-loads assets on mount

  const loadAssets = async (path) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const response = await api.post('/aem/assets/browse', {
        path: path,
        depth: 1,
        limit: 100
      });

      if (response.data.success) {
        setAssets(response.data.assets || []);
      }
    } catch (error) {
      console.error('Failed to load assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchAssets = async () => {
    if (!searchTerm.trim()) {
      loadAssets(currentPath);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const response = await api.post('/aem/assets/search', {
        keyword: searchTerm,
        path: currentPath
      });

      if (response.data.success) {
        setAssets(response.data.results || []);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAssetIcon = (type) => {
    switch (type) {
      case 'image':
        return <Image className="w-5 h-5 text-blue-500" />;
      case 'video':
        return <Film className="w-5 h-5 text-purple-500" />;
      case 'document':
        return <FileText className="w-5 h-5 text-green-500" />;
      default:
        return <Folder className="w-5 h-5 text-yellow-500" />;
    }
  };

  const handleAssetClick = (asset) => {
    const assetWithHost = {
      ...asset,
      path: asset.path.startsWith('http') ? asset.path : `${aemHost}${asset.path}`,
      thumbnail: asset.thumbnail ? `${aemHost}${asset.thumbnail}` : null,
      downloadUrl: `${aemHost}${asset.path}`
    };
    setSelectedAsset(assetWithHost);
    if (onSelectAsset) {
      onSelectAsset(assetWithHost);
    }
  };

  const handleDownload = async () => {
    if (!selectedAsset) return;
    
    try {
      // Create a download link
      const link = document.createElement('a');
      link.href = selectedAsset.downloadUrl || selectedAsset.path;
      link.download = selectedAsset.title || 'asset';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className={`${theme.card} border rounded-2xl p-6 shadow-lg`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Folder className="w-5 h-5" />
        DAM Asset Browser
      </h3>

      {/* Path breadcrumb */}
      <div className={`px-3 py-2 rounded-lg ${theme.input} border mb-4 text-sm`}>
        {currentPath}
      </div>

      {/* Search bar */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchAssets()}
          placeholder="Search assets..."
          className={`flex-1 px-4 py-2 rounded-lg ${theme.input} border`}
        />
        <button
          onClick={searchAssets}
          className={`${theme.button} text-white px-4 py-2 rounded-lg flex items-center gap-2`}
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>

      {/* Asset grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className={`mt-2 text-sm ${theme.subtext}`}>Loading assets...</p>
          </div>
        ) : !hasSearched ? (
          <div className="col-span-full text-center py-8">
            <Search className="w-12 h-12 mx-auto opacity-30 mb-2" />
            <p className={theme.subtext}>Click search to browse assets</p>
          </div>
        ) : assets.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Folder className="w-12 h-12 mx-auto opacity-30 mb-2" />
            <p className={theme.subtext}>No assets found</p>
          </div>
        ) : (
          assets.map((asset, idx) => {
            // Use proper AEM thumbnail rendition path
            const getThumbnailUrl = () => {
              if (asset.thumbnail) {
                return `${aemHost}${asset.thumbnail}`;
              }
              // Fallback to asset path with rendition for images
              if (asset.type === 'image' && asset.path) {
                return `${aemHost}${asset.path}/_jcr_content/renditions/cq5dam.thumbnail.140.100.png`;
              }
              return null;
            };
            
            const thumbnailUrl = getThumbnailUrl();
            const assetPath = `${aemHost}${asset.path}`;
            
            return (
            <div
              key={idx}
              onClick={() => handleAssetClick(asset)}
              className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                selectedAsset?.path === assetPath
                  ? 'border-blue-500 bg-blue-500/10'
                  : `${theme.input} hover:border-blue-400`
              }`}
            >
              <div className="aspect-square bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg mb-2 flex items-center justify-center overflow-hidden relative">
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt={asset.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      const fallback = parent.querySelector('.fallback-icon');
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`fallback-icon absolute inset-0 ${thumbnailUrl ? 'hidden' : 'flex'} items-center justify-center`}>
                  {getAssetIcon(asset.type)}
                </div>
              </div>
              <p className="text-xs font-medium truncate">{asset.title}</p>
              <p className={`text-xs ${theme.subtext} truncate`}>{asset.format || asset.type}</p>
            </div>
            );
          })
        )}
      </div>

      {/* Selected asset details */}
      {selectedAsset && assets.length > 0 && (
        <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <h4 className="font-semibold mb-2">Selected Asset</h4>
          <p className="text-sm mb-1"><strong>Path:</strong> {selectedAsset.path}</p>
          <p className="text-sm mb-1"><strong>Type:</strong> {selectedAsset.type}</p>
          <p className="text-sm mb-3"><strong>Format:</strong> {selectedAsset.format}</p>
          <button
            onClick={handleDownload}
            className={`mt-3 ${theme.button} text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2`}
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      )}
    </div>
  );
}
