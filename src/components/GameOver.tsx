import { useState, useEffect } from 'react';
import { DoodleButton, DoodlePanel, MeemTitle } from './DoodleUI';
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
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  const handleSubmitScore = async () => {
    if (!playerName.trim() || submitting) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('leaderboard')
        .insert({
          player_name: playerName.trim(),
          score: score,
          level_reached: level
        });

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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20 p-4">
      <DoodlePanel bordered className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">💀</div>
        <MeemTitle size="lg">GAME OVER</MeemTitle>
        <p className="text-black text-base font-medium mb-6 mt-2">rekt on level {level}</p>

        <div className="bg-white border-3 border-black p-6 mb-6" style={{ borderRadius: '12px' }}>
          <div className="text-sm font-bold mb-1">final score</div>
          <div className="text-5xl font-bold meem-text-blue">{score}</div>
        </div>

        {!submitted ? (
          <div className="mb-6">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="your name"
              maxLength={20}
              className="w-full px-4 py-3 border-3 border-black font-medium text-center text-base mb-3"
              style={{ borderRadius: '12px' }}
            />
            <DoodleButton
              onClick={handleSubmitScore}
              disabled={!playerName.trim() || submitting}
              size="md"
            >
              {submitting ? 'submitting...' : 'submit to leaderboard'}
            </DoodleButton>
          </div>
        ) : (
          <div className="mb-6 text-green-600 font-bold text-lg">
            score submitted!
          </div>
        )}

        <div className="space-y-3">
          <DoodleButton onClick={onRetry} size="md">
            retry
          </DoodleButton>
          <DoodleButton onClick={onMainMenu} size="sm">
            main menu
          </DoodleButton>
        </div>
      </DoodlePanel>
    </div>
  );
}
