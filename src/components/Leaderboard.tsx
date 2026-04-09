import { useState, useEffect } from 'react';
import { supabase } from '../game/supabaseClient';
import type { LeaderboardEntry } from '../game/types';

interface LeaderboardProps {
  onBack: () => void;
}

const RANK_LABELS = ['1st', '2nd', '3rd'];

export function Leaderboard({ onBack }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('leaderboard')
          .select('*')
          .order('score', { ascending: false })
          .limit(10);
        if (error) throw error;
        setEntries(data || []);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-auto"
      style={{ fontFamily: "'Patrick Hand', cursive", padding: '16px' }}
    >
      <div style={{ maxWidth: 520, margin: '0 auto', paddingBottom: 40 }}>
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
            transform: 'rotate(-0.2deg)',
          }}
        >
          <h2
            className="hooey-title"
            style={{ fontSize: 'clamp(1.6rem, 6vw, 2.2rem)', marginBottom: 24, textAlign: 'center' }}
          >
            LEADERBOARD
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#888', fontSize: '1.1rem' }}>
              loading...
            </div>
          ) : entries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: 8 }}>no scores yet</p>
              <p style={{ fontSize: '0.85rem', color: '#aaa' }}>be the first to set a record</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {entries.map((entry, index) => {
                const rot = ((index * 5) % 5 - 2) * 0.35;
                const isTop3 = index < 3;

                return (
                  <div
                    key={entry.id}
                    style={{
                      background: isTop3 ? '#333' : '#fff',
                      color: isTop3 ? '#fafaf5' : '#333',
                      border: '2.5px solid #333',
                      borderRadius: 10,
                      padding: '12px 16px',
                      boxShadow: isTop3 ? '4px 4px 0 rgba(0,0,0,0.18)' : '2px 2px 0 rgba(0,0,0,0.08)',
                      transform: `rotate(${rot}deg)`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        fontSize: isTop3 ? '1.1rem' : '0.9rem',
                        fontWeight: 700,
                        minWidth: 36,
                        color: isTop3 ? '#ffd700' : '#888',
                      }}
                    >
                      {RANK_LABELS[index] || `${index + 1}`}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{entry.player_name}</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.65 }}>level {entry.level_reached}</div>
                    </div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: '1.3rem',
                        color: isTop3 ? '#ffd700' : '#333',
                      }}
                    >
                      {entry.score}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
