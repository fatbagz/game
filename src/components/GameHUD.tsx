interface GameHUDProps {
  score: number;
  lives: number;
  level: number;
}

function RingDonut({ filled }: { filled: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}>
      <circle cx="16" cy="16" r="12" fill={filled ? '#FFB6C1' : '#ccc'} stroke="#333" strokeWidth="2.5" />
      <circle cx="16" cy="16" r="5" fill="#fff" stroke="#333" strokeWidth="2" />
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

function HUDPill({ label, value, rotation }: { label: string; value: React.ReactNode; rotation: string }) {
  return (
    <div
      style={{
        background: 'rgba(250,250,245,0.95)',
        border: '2.5px solid #333',
        borderRadius: 10,
        padding: '6px 14px',
        boxShadow: '3px 3px 0 rgba(0,0,0,0.12)',
        transform: `rotate(${rotation})`,
        fontFamily: "'Patrick Hand', cursive",
        minWidth: 70,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '0.65rem', color: '#888', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#333', lineHeight: 1.1 }}>{value}</div>
    </div>
  );
}

export function GameHUD({ score, lives, level }: GameHUDProps) {
  const maxLives = 3;

  return (
    <div className="fixed top-0 left-0 right-0 z-10 pointer-events-none">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 16px', gap: 8, flexWrap: 'wrap' }}>
        <HUDPill label="level" value={level} rotation="-0.8deg" />
        <HUDPill label="score" value={score} rotation="0.5deg" />
        <div
          style={{
            background: 'rgba(250,250,245,0.95)',
            border: '2.5px solid #333',
            borderRadius: 10,
            padding: '6px 14px',
            boxShadow: '3px 3px 0 rgba(0,0,0,0.12)',
            transform: 'rotate(0.7deg)',
            fontFamily: "'Patrick Hand', cursive",
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.65rem', color: '#888', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>lives</div>
          <div style={{ display: 'flex', gap: 3 }}>
            {Array.from({ length: maxLives }).map((_, i) => (
              <RingDonut key={i} filled={i < lives} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
