import { getAvailableAssets, getAssetUrl } from '../utils/memePool';

interface AssetPanelProps {
  onAssetSelect: (path: string) => void;
}

export default function AssetPanel({ onAssetSelect }: AssetPanelProps) {
  const availableAssets = getAvailableAssets();

  return (
    <div className="w-full bg-white rounded border-2 border-gray-300 p-3 mt-4">
      <h3 className="font-hand text-sm font-bold mb-2" style={{ color: '#333' }}>
        AVAILABLE ASSETS
      </h3>
      <p className="font-hand text-xs mb-3" style={{ color: '#666' }}>
        Click to add to meme, then drag & resize
      </p>
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-2">
        {availableAssets.map((asset) => (
          <button
            key={asset.path}
            onClick={() => onAssetSelect(asset.path)}
            className="relative group overflow-hidden rounded border-2 border-gray-300 hover:border-blue-500 transition-all hover:shadow-md active:scale-95"
            title={asset.tags.join(', ')}
          >
            <img
              src={getAssetUrl(asset.path)}
              alt={asset.tags.join(', ')}
              className="w-full aspect-square object-contain bg-white p-1.5 group-hover:scale-110 transition-transform"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
