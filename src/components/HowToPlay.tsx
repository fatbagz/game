interface HowToPlayProps {
  onBack: () => void;
}

const SECTIONS = [
  {
    title: 'move meem',
    content: ['left arrow / A = go left', 'right arrow / D = go right', 'SPACE / W = jump'],
  },
  {
    title: 'the goal',
    content: ['run to the end of each level', 'reach the golden goal flag', 'dont fall off the map'],
  },
  {
    title: 'coins',
    content: ['collect coins for points', 'more coins = more rich', 'buy lambo eventually'],
  },
  {
    title: 'enemies',
    content: ['enemies patrol platforms', 'touch = lose a life', '3 lives. then rekt.'],
  },
  {
    title: 'donuts',
    content: ['donuts restore a life', 'they float above platforms', 'very important. collect donuts.'],
  },
  {
    title: 'pro tips',
    content: ['timing is everything', 'watch enemy patrol patterns', 'use springboards to reach high platforms', 'wagmi'],
  },
];

export function HowToPlay({ onBack }: HowToPlayProps) {
  return (
    <div
      className="fixed inset-0 overflow-auto"
      style={{ fontFamily: "'Patrick Hand', cursive", padding: '16px' }}
    >
      <div style={{ maxWidth: 560, margin: '0 auto', paddingBottom: 40 }}>
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
            transform: 'rotate(0.25deg)',
          }}
        >
          <h2
            className="hooey-title"
            style={{ fontSize: 'clamp(1.6rem, 6vw, 2.2rem)', marginBottom: 24, textAlign: 'center' }}
          >
            HOW TO PLAY
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SECTIONS.map((section, i) => {
              const rot = ((i * 3) % 5 - 2) * 0.4;
              return (
                <div
                  key={section.title}
                  style={{
                    background: '#fff',
                    border: '2.5px solid #333',
                    borderRadius: 10,
                    padding: '14px 18px',
                    boxShadow: '3px 3px 0 rgba(0,0,0,0.08)',
                    transform: `rotate(${rot}deg)`,
                  }}
                >
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#333', marginBottom: 8 }}>
                    {section.title}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {section.content.map((line) => (
                      <p key={line} style={{ fontSize: '0.9rem', color: '#555', lineHeight: 1.5 }}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
