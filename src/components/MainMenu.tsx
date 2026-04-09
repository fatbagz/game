interface MainMenuProps {
  onStartGame: () => void;
  onLevelSelect: () => void;
  onHowToPlay: () => void;
  onLeaderboard: () => void;
  onCharacterSelect: () => void;
}

const MEEM_CHARACTER_URL = 'https://fhfvefrocgtfvfwdhyxw.supabase.co/storage/v1/object/public/lol/meems%20random/meem_character_transparent_v2.png';

const menuButtons = [
  { label: 'START GAME', rotation: '-1.2deg', size: '1.2rem' },
  { label: 'level select', rotation: '0.8deg', size: '1rem' },
  { label: 'character select', rotation: '-0.6deg', size: '1rem' },
  { label: 'leaderboard', rotation: '1deg', size: '1rem' },
  { label: 'how to play', rotation: '-0.4deg', size: '1rem' },
];

export function MainMenu({ onStartGame, onLevelSelect, onHowToPlay, onLeaderboard, onCharacterSelect }: MainMenuProps) {
  const handlers = [onStartGame, onLevelSelect, onCharacterSelect, onLeaderboard, onHowToPlay];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ fontFamily: "'Patrick Hand', cursive", zIndex: 10 }}
    >
      <div
        style={{
          background: 'rgba(250,250,245,0.97)',
          border: '2.5px solid #333',
          borderRadius: 16,
          padding: '36px 40px 40px',
          boxShadow: '8px 8px 0 rgba(0,0,0,0.13)',
          transform: 'rotate(-0.3deg)',
          width: '100%',
          maxWidth: 380,
          margin: '0 16px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 120,
            margin: '0 auto 8px',
            animation: 'heroMeemFloat 3.8s cubic-bezier(0.45,0.05,0.55,0.95) infinite',
          }}
        >
          <img
            src={MEEM_CHARACTER_URL}
            alt="MEEM mascot"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.18))',
            }}
          />
        </div>

        <h1
          className="hooey-title"
          style={{
            fontSize: 'clamp(2.2rem, 7vw, 3.2rem)',
            lineHeight: 1.1,
            marginBottom: 4,
          }}
        >
          {'MEEM'.split('').map((letter, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                animation: 'dropInBounce 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards',
                animationDelay: `${i * 0.08}s`,
                opacity: 0,
              }}
            >
              {letter}
            </span>
          ))}
        </h1>

        <p
          className="hooey-title-sm"
          style={{
            fontSize: 'clamp(1rem, 3.5vw, 1.4rem)',
            marginBottom: 28,
            display: 'inline-block',
            animation: 'dropInBounce 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.35s forwards',
            opacity: 0,
          }}
        >
          RUNNER
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {menuButtons.map((btn, i) => (
            <button
              key={btn.label}
              onClick={handlers[i]}
              className="sketch-btn"
              style={{
                fontSize: btn.size,
                transform: `rotate(${btn.rotation})`,
                width: '100%',
                padding: '12px 20px',
                animation: `dropInBounce 0.5s cubic-bezier(0.34,1.56,0.64,1) ${0.5 + i * 0.07}s forwards`,
                opacity: 0,
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <p
          style={{
            color: '#aaa',
            fontSize: '0.72rem',
            marginTop: 18,
            fontStyle: 'italic',
          }}
        >
          wagmi
        </p>
      </div>
    </div>
  );
}
