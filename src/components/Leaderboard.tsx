import { useState, useEffect } from 'react';
import { DoodleButton, DoodlePanel, MeemTitle } from './DoodleUI';
import { supabase } from '../game/supabaseClient';
import type { LeaderboardEntry } from '../game/types';

interface LeaderboardProps {
  onBack: () => void;
}

export function Leaderboard({ onBack }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
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
  };

  return (
    <div className="min-h-screen p-4 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <DoodleButton onClick={onBack} size="sm">
            back
          </DoodleButton>
        </div>

        <DoodlePanel bordered className="mb-6">
          <MeemTitle size="lg">LEADERBOARD</MeemTitle>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-xl font-medium">loading...</div>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-xl font-medium">no scores yet!</div>
              <div className="text-sm mt-2">be the first to set a record!</div>
            </div>
          ) : (
            <div className="space-y-3 mt-6">
              {entries.map((entry, index) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-4 p-4 bg-white border-3 border-black"
                  style={{ borderRadius: '12px' }}
                >
                  <div className="text-2xl font-bold w-8">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg">{entry.player_name}</div>
                    <div className="text-sm text-gray-600">level {entry.level_reached}</div>
                  </div>
                  <div className="text-2xl font-bold meem-text-blue">
                    {entry.score}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DoodlePanel>
      </div>
    </div>
  );
}
