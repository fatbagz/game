import { useState, useEffect, useRef } from 'react';
import { generateLevel } from '../game/levelGenerator';

const SUPABASE_STORAGE_URL = 'https://nttpiddjkjkkyglusfga.supabase.co/storage/v1/object/public/assets';
const BACKGROUND_INDICES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const TOTAL_LEVELS = 50;

function getBgIndexForLevel(levelId: number): number {
  const level = generateLevel(levelId);
  return BACKGROUND_INDICES[level.backgroundIndex % BACKGROUND_INDICES.length];
}

function getBgUrl(levelId: number): string {
  const idx = getBgIndexForLevel(levelId);
  return `${SUPABASE_STORAGE_URL}/Game-backround-assets/Level%20(${idx}).png`;
}

interface LevelPreviewCardProps {
  levelId: number;
  isUnlocked: boolean;
  isSelected: boolean;
  onClick: () => void;
}

function LevelPreviewCard({ levelId, isUnlocked, isSelected, onClick }: LevelPreviewCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgUrl = getBgUrl(levelId);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const level = generateLevel(levelId);
    const W = canvas.width;
    const H = canvas.height;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const imgAspect = img.naturalWidth / img.naturalHeight;
      const drawH = H;
      const drawW = imgAspect * drawH;
      ctx.drawImage(img, 0, 0, drawW, drawH);

      if (!isUnlocked) {
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(0, 0, W, H);
        return;
      }

      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(0, 0, W, H);

      const scaleX = W / level.width;
      const scaleY = H / level.height;
      const scale = Math.min(scaleX, scaleY);

      ctx.save();
      ctx.scale(scale, scale);

      for (const platform of level.platforms) {
        if (platform.type === 'springboard') {
          ctx.fillStyle = '#FF6B6B';
        } else if (platform.type === 'floating_block') {
          ctx.fillStyle = '#8B5CF6';
        } else {
          ctx.fillStyle = 'rgba(255,255,255,0.75)';
        }
        ctx.beginPath();
        ctx.roundRect(platform.x, platform.y, platform.width, platform.height, 4 / scale);
        ctx.fill();
      }

      ctx.fillStyle = '#FFD700';
      for (const c of level.collectibles) {
        ctx.beginPath();
        ctx.arc(c.position.x + 8, c.position.y + 8, 5 / scale, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#EF4444';
      for (const e of level.enemies) {
        ctx.beginPath();
        ctx.arc(e.position.x + 12, e.position.y + 12, 7 / scale, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#22C55E';
      ctx.beginPath();
      ctx.roundRect(level.goalPosition.x, level.goalPosition.y, 30 / scale, 30 / scale, 4 / scale);
      ctx.fill();

      ctx.fillStyle = '#3B9BFF';
      ctx.beginPath();
      ctx.arc(level.startPosition.x + 12, level.startPosition.y + 12, 8 / scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };
    img.onerror = () => {
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, W, H);

      if (!isUnlocked) {
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(0, 0, W, H);
      }
    };
    img.src = bgUrl;
  }, [levelId, isUnlocked, bgUrl]);

  return (
    <button
      onClick={onClick}
      disabled={!isUnlocked}
      className={`relative group overflow-hidden transition-all duration-200 ${
        isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'
      } ${isSelected ? 'ring-4 ring-yellow-400 ring-offset-2' : ''}`}
      style={{
        borderRadius: '10px',
        border: isSelected ? '3px solid #FFD700' : '3px solid #000',
        transform: isSelected ? 'scale(1.06)' : undefined,
        boxShadow: isSelected
          ? '0 0 0 3px #FFD700, 4px 4px 0 #000'
          : isUnlocked
          ? '4px 4px 0 #000'
          : '2px 2px 0 #555',
      }}
    >
      <canvas
        ref={canvasRef}
        width={160}
        height={100}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          imageRendering: 'auto',
        }}
      />

      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-1"
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(2px)' }}
      >
        <span className="text-white font-bold text-xs" style={{ fontFamily: 'monospace' }}>
          LVL {levelId}
        </span>
        {!isUnlocked && <span className="text-sm">🔒</span>}
        {isUnlocked && (
          <span className="text-yellow-300 text-xs font-bold">PLAY</span>
        )}
      </div>

      {isUnlocked && (
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          style={{ background: 'rgba(0,0,0,0.35)' }}
        >
          <div
            className="bg-white text-black font-bold text-xs px-3 py-1"
            style={{ borderRadius: '6px', border: '2px solid #000' }}
          >
            START
          </div>
        </div>
      )}
    </button>
  );
}

interface LevelSelectProps {
  levelUnlocked: number;
  onSelectLevel: (level: number) => void;
  onBack: () => void;
}

export function LevelSelect({ levelUnlocked, onSelectLevel, onBack }: LevelSelectProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleCardClick = (levelId: number, isUnlocked: boolean) => {
    if (!isUnlocked) return;
    if (selected === levelId) {
      onSelectLevel(levelId);
    } else {
      setSelected(levelId);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}>
      <div className="flex items-center justify-between px-6 py-4 border-b-4 border-black bg-white">
        <button
          onClick={onBack}
          className="font-bold text-black px-4 py-2 bg-white border-3 border-black meem-button text-sm"
          style={{ borderRadius: '8px', boxShadow: '3px 3px 0 #000' }}
        >
          BACK
        </button>
        <h1 className="text-3xl md:text-4xl font-bold meem-text-blue uppercase tracking-widest">
          LEVEL SELECT
        </h1>
        <div
          className="px-4 py-2 bg-white border-3 border-black font-bold text-sm"
          style={{ borderRadius: '8px', boxShadow: '3px 3px 0 #000' }}
        >
          {levelUnlocked} / {TOTAL_LEVELS}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
          {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).map((levelId) => {
            const isUnlocked = levelId <= levelUnlocked;
            return (
              <LevelPreviewCard
                key={levelId}
                levelId={levelId}
                isUnlocked={isUnlocked}
                isSelected={selected === levelId}
                onClick={() => handleCardClick(levelId, isUnlocked)}
              />
            );
          })}
        </div>
      </div>

      {selected !== null && selected <= levelUnlocked && (
        <div className="px-6 py-4 bg-white border-t-4 border-black flex items-center justify-between gap-4">
          <div className="font-bold text-lg">
            Level {selected} selected — tap again or press Play
          </div>
          <button
            onClick={() => onSelectLevel(selected)}
            className="px-8 py-3 bg-yellow-400 text-black font-bold text-lg border-3 border-black meem-button"
            style={{ borderRadius: '10px', boxShadow: '4px 4px 0 #000' }}
          >
            PLAY
          </button>
        </div>
      )}
    </div>
  );
}
