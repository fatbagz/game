const MEEM_QUOTES = [
  "number go up",
  "wen donut",
  "meem happy",
  "wagmi fren",
  "to the moon",
  "ngmi without meem",
  "gm gm",
  "probably nothing",
  "few understand",
];

interface LevelCompleteProps {
  level: number;
  score: number;
  onNextLevel: () => void;
  onMainMenu: () => void;
  hasNextLevel: boolean;
}

export function LevelComplete({ level, score, onNextLevel, onMainMenu, hasNextLevel }: LevelCompleteProps) {
  const quote = MEEM_QUOTES[level % MEEM_QUOTES.length];
  const isLegend = level === 50;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-20 p-4"
      style={{
        background: 'rgba(250,250,245,0.88)',
        backdropFilter: 'blur(6px)',
        fontFamily: "'Patrick Hand', cursive",
      }}
    >
      <div
        style={{
          background: '#fafaf5',
          border: '2.5px solid #333',
          borderRadius: 16,
          padding: '36px 40px',
          boxShadow: '8px 8px 0 rgba(0,0,0,0.13)',
          transform: 'rotate(0.4deg)',
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          animation: 'bubblePopIn 0.45s cubic-bezier(0.34,1.7,0.64,1) forwards',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: 8 }}>
          {isLegend ? '🏆' : '⭐'}
        </div>

        <h2
          className="hooey-title"
          style={{ fontSize: 'clamp(1.6rem, 6vw, 2.4rem)', marginBottom: 6 }}
        >
          {isLegend ? 'LEGEND!' : 'LEVEL COMPLETE'}
        </h2>

        <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: 20 }}>
          {isLegend ? 'all 50 levels. WAGMI.' : `level ${level} cleared`}
        </p>

        <div
          style={{
            background: '#fff',
            border: '2.5px solid #333',
            borderRadius: 10,
            padding: '16px 20px',
            marginBottom: 16,
            boxShadow: '3px 3px 0 rgba(0,0,0,0.08)',
            transform: 'rotate(-0.5deg)',
          }}
        >
          <div style={{ fontSize: '0.72rem', color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>total score</div>
          <div style={{ fontSize: '2.8rem', fontWeight: 700, color: '#333', lineHeight: 1 }}>{score}</div>
        </div>

        <div
          style={{
            background: 'rgba(255,255,255,0.6)',
            border: '2px solid #ccc',
            borderRadius: 8,
            padding: '8px 14px',
            marginBottom: 24,
            transform: 'rotate(0.8deg)',
          }}
        >
          <p style={{ fontSize: '0.85rem', color: '#888', fontStyle: 'italic' }}>
            meem says: "{quote}"
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {hasNextLevel && (
            <button
              onClick={onNextLevel}
              className="sketch-btn"
              style={{ fontSize: '1.05rem', transform: 'rotate(-0.8deg)', width: '100%', padding: '12px 20px' }}
            >
              start level {level + 1}
            </button>
          )}
          <button
            onClick={onMainMenu}
            className="sketch-btn"
            style={{ fontSize: '0.9rem', transform: 'rotate(0.6deg)', width: '100%', padding: '10px 20px', background: '#fff' }}
          >
            main menu
          </button>
        </div>
      </div>
    </div>
  );
}
