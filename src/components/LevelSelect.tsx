const TOTAL_LEVELS = 50;

interface LevelSelectProps {
  levelUnlocked: number;
  onSelectLevel: (level: number) => void;
  onBack: () => void;
}

export function LevelSelect({ levelUnlocked, onSelectLevel, onBack }: LevelSelectProps) {
  return (
    <div
      className="fixed inset-0 overflow-auto"
      style={{ fontFamily: "'Patrick Hand', cursive", padding: '16px' }}
    >
      <div style={{ maxWidth: 640, margin: '0 auto', paddingBottom: 40 }}>
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={onBack}
            className="sketch-btn"
            style={{ fontSize: '0.95rem', padding: '8px 20px', transform: 'rotate(-0.5deg)' }}
          >
            back
          </button>
        </div>

        <div
          style={{
            background: 'rgba(250,250,245,0.97)',
            border: '2.5px solid #333',
            borderRadius: 16,
            padding: '28px 28px 32px',
            boxShadow: '6px 6px 0 rgba(0,0,0,0.10)',
            transform: 'rotate(0.2deg)',
          }}
        >
          <h2
            className="hooey-title"
            style={{ fontSize: 'clamp(1.6rem, 6vw, 2.2rem)', marginBottom: 8, textAlign: 'center' }}
          >
            LEVEL SELECT
          </h2>

          <div
            style={{
              display: 'inline-block',
              background: '#fff',
              border: '2px solid #333',
              borderRadius: 8,
              padding: '4px 14px',
              fontSize: '0.85rem',
              color: '#555',
              marginBottom: 20,
              transform: 'rotate(-0.4deg)',
              boxShadow: '2px 2px 0 rgba(0,0,0,0.08)',
            }}
          >
            unlocked: {levelUnlocked} / {TOTAL_LEVELS}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(52px, 1fr))',
              gap: 8,
            }}
          >
            {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).map((levelId) => {
              const isUnlocked = levelId <= levelUnlocked;
              const rot = ((levelId * 7) % 5) - 2;

              return (
                <button
                  key={levelId}
                  onClick={() => isUnlocked && onSelectLevel(levelId)}
                  disabled={!isUnlocked}
                  style={{
                    aspectRatio: '1',
                    fontFamily: "'Patrick Hand', cursive",
                    fontWeight: 700,
                    fontSize: '1rem',
                    background: isUnlocked ? '#fff' : '#e8e8e0',
                    color: isUnlocked ? '#333' : '#aaa',
                    border: `2.5px solid ${isUnlocked ? '#333' : '#ccc'}`,
                    borderRadius: 8,
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                    transform: `rotate(${rot * 0.4}deg)`,
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    boxShadow: isUnlocked ? '2px 2px 0 rgba(0,0,0,0.10)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    padding: 4,
                  }}
                  onMouseEnter={(e) => {
                    if (isUnlocked) {
                      (e.currentTarget as HTMLButtonElement).style.transform = `rotate(${rot * 0.4}deg) scale(1.08)`;
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '4px 4px 0 rgba(0,0,0,0.14)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isUnlocked) {
                      (e.currentTarget as HTMLButtonElement).style.transform = `rotate(${rot * 0.4}deg)`;
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '2px 2px 0 rgba(0,0,0,0.10)';
                    }
                  }}
                >
                  <span style={{ fontSize: '0.95rem' }}>{levelId}</span>
                  {!isUnlocked && <span style={{ fontSize: '0.6rem' }}>lock</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
