import { useState, useRef, useEffect } from 'react';
import { X, Maximize2 } from 'lucide-react';
import { getAssetUrl } from '../utils/memePool';

interface DraggableAsset {
  id: string;
  path: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AssetEditorProps {
  canvasWidth: number;
  canvasHeight: number;
  assets: DraggableAsset[];
  onAssetsChange: (assets: DraggableAsset[]) => void;
}

export default function AssetEditor({ canvasWidth, canvasHeight, assets, onAssetsChange }: AssetEditorProps) {
  const [draggingAssetId, setDraggingAssetId] = useState<string | null>(null);
  const [resizingAssetId, setResizingAssetId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const addAsset = (path: string) => {
    const newAsset: DraggableAsset = {
      id: Date.now().toString(),
      path,
      x: canvasWidth / 2 - 40,
      y: canvasHeight / 2 - 40,
      width: 80,
      height: 80,
    };
    onAssetsChange([...assets, newAsset]);
  };

  const removeAsset = (id: string) => {
    onAssetsChange(assets.filter(a => a.id !== id));
  };

  const handleMouseDown = (e: React.MouseEvent, assetId: string, isResize: boolean) => {
    e.preventDefault();
    if (isResize) {
      setResizingAssetId(assetId);
    } else {
      setDraggingAssetId(assetId);
      const asset = assets.find(a => a.id === assetId);
      if (asset) {
        setDragOffset({
          x: e.clientX - asset.x,
          y: e.clientY - asset.y,
        });
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      if (draggingAssetId) {
        const newAssets = assets.map(a => {
          if (a.id === draggingAssetId) {
            return {
              ...a,
              x: Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, canvasWidth - a.width)),
              y: Math.max(0, Math.min(e.clientY - rect.top - dragOffset.y, canvasHeight - a.height)),
            };
          }
          return a;
        });
        onAssetsChange(newAssets);
      } else if (resizingAssetId) {
        const asset = assets.find(a => a.id === resizingAssetId);
        if (asset) {
          const newWidth = Math.max(40, e.clientX - rect.left - asset.x);
          const newHeight = Math.max(40, e.clientY - rect.top - asset.y);
          const newAssets = assets.map(a => {
            if (a.id === resizingAssetId) {
              return {
                ...a,
                width: Math.min(newWidth, canvasWidth - a.x),
                height: Math.min(newHeight, canvasHeight - a.y),
              };
            }
            return a;
          });
          onAssetsChange(newAssets);
        }
      }
    };

    const handleMouseUp = () => {
      setDraggingAssetId(null);
      setResizingAssetId(null);
    };

    if (draggingAssetId || resizingAssetId) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingAssetId, resizingAssetId, assets, dragOffset, canvasWidth, canvasHeight, onAssetsChange]);

  return (
    <div className="w-full">

      <div
        ref={containerRef}
        className="relative w-full mx-auto"
        style={{
          border: '4px solid #333',
          background: '#111',
          maxWidth: canvasWidth,
          aspectRatio: `${canvasWidth} / ${canvasHeight}`,
          transform: 'rotate(0.3deg)',
          boxShadow: '8px 8px 0 rgba(0,0,0,0.2)',
          overflow: 'hidden',
        }}
      >
        {assets.map((asset) => (
          <div
            key={asset.id}
            onMouseDown={(e) => handleMouseDown(e, asset.id, false)}
            className="absolute group cursor-move"
            style={{
              left: `${(asset.x / canvasWidth) * 100}%`,
              top: `${(asset.y / canvasHeight) * 100}%`,
              width: `${(asset.width / canvasWidth) * 100}%`,
              height: `${(asset.height / canvasHeight) * 100}%`,
            }}
          >
            <img
              src={getAssetUrl(asset.path)}
              alt="asset"
              className="w-full h-full object-contain pointer-events-none select-none"
              draggable={false}
            />
            <div className="absolute inset-0 border-2 border-yellow-400 opacity-0 group-hover:opacity-50 transition-opacity pointer-events-none" />

            <button
              onClick={() => removeAsset(asset.id)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              title="Delete asset"
            >
              <X size={14} />
            </button>

            <div
              onMouseDown={(e) => handleMouseDown(e, asset.id, true)}
              className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600 cursor-nwse-resize"
              title="Resize asset"
            >
              <Maximize2 size={14} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
