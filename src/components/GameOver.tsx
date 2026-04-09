import { useState, useEffect } from 'react';
import { supabase } from '../game/supabaseClient';

interface GameOverProps {
  level: number;
  score: number;
  onRetry: () => void;
  onMainMenu: () => void;
}

export function GameOver({ level, score, onRetry, onMainMenu }: GameOverProps) {
  const [playerName, setPlayerName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('meem_player_name');
    if (savedName) setPlayerName(savedName);
  }, []);

  const handleSubmitScore = async () => {
    if (!playerName.trim() || submitting) return;
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('leaderboard')
        .insert({ player_name: playerName.trim(), score, level_reached: level });
      if (error) throw error;
      localStorage.setItem('meem_player_name', playerName.trim());
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting score:', error);
    } finally {
      setSubmitting(false);
    }
  };

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
          transform: 'rotate(-0.4deg)',
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          animation: 'bubblePopIn 0.45s cubic-bezier(0.34,1.7,0.64,1) forwards',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: 8 }}>rekt</div>

        <h2
          className="hooey-title"
          style={{ fontSize: 'clamp(1.8rem, 6vw, 2.6rem)', marginBottom: 6 }}
        >
          GAME OVER
        </h2>

        <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: 20 }}>
          died on level {level}. ngmi.
        </p>

        <div
          style={{
            background: '#fff',
            border: '2.5px solid #333',
            borderRadius: 10,
            padding: '16px 20px',
            marginBottom: 20,
            boxShadow: '3px 3px 0 rgba(0,0,0,0.08)',
            transform: 'rotate(0.5deg)',
          }}
        >
          <div style={{ fontSize: '0.72rem', color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>final score</div>
          <div style={{ fontSize: '2.8rem', fontWeight: 700, color: '#333', lineHeight: 1 }}>{score}</div>
        </div>

        {!submitted ? (
          <div style={{ marginBottom: 20 }}>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitScore()}
              placeholder="your name"
              maxLength={20}
              style={{
                width: '100%',
                padding: '10px 16px',
                border: '2.5px solid #333',
                borderRadius: 8,
                background: '#fff',
                fontFamily: "'Patrick Hand', cursive",
                fontSize: '1rem',
                textAlign: 'center',
                color: '#333',
                marginBottom: 10,
                outline: 'none',
                boxShadow: '3px 3px 0 rgba(0,0,0,0.08)',
              }}
            />
            <button
              onClick={handleSubmitScore}
              disabled={!playerName.trim() || submitting}
              className="sketch-btn"
              style={{
                width: '100%',
                padding: '10px 20px',
                fontSize: '0.95rem',
                transform: 'rotate(-0.5deg)',
                opacity: !playerName.trim() || submitting ? 0.5 : 1,
                cursor: !playerName.trim() || submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? 'submitting...' : 'submit to leaderboard'}
            </button>
          </div>
        ) : (
          <div
            style={{
              marginBottom: 20,
              padding: '12px 16px',
              background: '#fff',
              border: '2px solid #ccc',
              borderRadius: 8,
              color: '#555',
              fontSize: '0.95rem',
            }}
          >
            score submitted! gm fren.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={onRetry}
            className="sketch-btn"
            style={{ fontSize: '1.05rem', transform: 'rotate(-0.6deg)', width: '100%', padding: '12px 20px' }}
          >
            try again
          </button>
          <button
            onClick={onMainMenu}
            className="sketch-btn"
            style={{ fontSize: '0.9rem', transform: 'rotate(0.7deg)', width: '100%', padding: '10px 20px', background: '#fff' }}
          >
            main menu
          </button>
        </div>
      </div>
    </div>
  );
}
