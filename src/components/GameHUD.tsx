interface GameHUDProps {
  score: number;
  lives: number;
  level: number;
}

function RingDonut({ filled }: { filled: boolean }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))' }}>
      <circle cx="16" cy="16" r="12" fill={filled ? '#FFB6C1' : '#d0d0d0'} stroke="#000" strokeWidth="2" />
      <circle cx="16" cy="16" r="5" fill="#fff" stroke="#000" strokeWidth="2" />
      {filled && (
        <>
          <circle cx="10" cy="10" r="1.5" fill="#FF69B4" />
          <circle cx="18" cy="8" r="1.5" fill="#FFD700" />
          <circle cx="22" cy="14" r="1.5" fill="#87CEEB" />
          <circle cx="20" cy="20" r="1.5" fill="#FF69B4" />
          <circle cx="12" cy="22" r="1.5" fill="#98FB98" />
          <circle cx="8" cy="18" r="1.5" fill="#FFD700" />
        </>
      )}
    </svg>
  );
}

export function GameHUD({ score, lives, level }: GameHUDProps) {
  const maxLives = 3;

  return (
    <div className="fixed top-0 left-0 right-0 z-10 pointer-events-none">
      <div className="flex justify-between items-start p-3 md:p-4 flex-wrap gap-2">
        <div className="bg-white border-3 border-black px-4 py-2" style={{ borderRadius: '12px' }}>
          <div className="text-xs font-bold text-black">level</div>
          <div className="text-2xl font-bold text-black">{level}</div>
        </div>

        <div className="bg-white border-3 border-black px-4 py-2" style={{ borderRadius: '12px' }}>
          <div className="text-xs font-bold meem-text-blue">score</div>
          <div className="text-2xl font-bold meem-text-blue">{score}</div>
        </div>

        <div className="bg-white border-3 border-black px-4 py-2" style={{ borderRadius: '12px' }}>
          <div className="text-xs font-bold text-black mb-1">lives</div>
          <div className="flex gap-1">
            {Array.from({ length: maxLives }).map((_, i) => (
              <RingDonut key={i} filled={i < lives} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
