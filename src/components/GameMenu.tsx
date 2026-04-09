import { useState, useRef, useEffect, useCallback } from 'react';
import { Home, Trophy, Flame, Crown, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SKINS, type SkinDef, drawSkinPreview } from '../utils/gameSkins';

interface LeaderEntry {
  display_name: string;
  best_score: number;
  current_streak: number;
}

interface GameMenuProps {
  memberId: string;
  memberName: string;
  streak: number;
  onStartGame: (skin: SkinDef) => void;
}

function SkinCard({
  skin,
  selected,
  onSelect,
}: {
  skin: SkinDef;
  selected: boolean;
  onSelect: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 64, 64);
    drawSkinPreview(ctx, 32, 34, 48, skin);
  }, [skin]);

  return (
    <button
      onClick={onSelect}
      className="flex flex-col items-center gap-1 transition-all"
      style={{
        padding: '8px 6px',
        borderRadius: 12,
        border: selected ? '2.5px solid #4a9ad4' : '2px solid rgba(100,160,220,0.15)',
        background: selected ? 'rgba(74,154,212,0.08)' : 'rgba(255,255,255,0.5)',
        cursor: 'pointer',
        transform: selected ? 'scale(1.05)' : 'scale(1)',
        boxShadow: selected ? '0 4px 12px rgba(74,154,212,0.2)' : 'none',
        minWidth: 72,
      }}
    >
      <canvas
        ref={canvasRef}
        width={64}
        height={64}
        style={{ width: 48, height: 48 }}
      />
      <span
        className="font-hand"
        style={{
          fontSize: '0.7rem',
          color: selected ? '#3a80b8' : '#8a9aaa',
          fontWeight: selected ? 700 : 400,
        }}
      >
        {skin.name}
      </span>
    </button>
  );
}

export default function GameMenu({ memberName, streak, onStartGame }: GameMenuProps) {
  const [entries, setEntries] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkin, setSelectedSkin] = useState<SkinDef>(
    () => {
      const saved = localStorage.getItem('meem_skin');
      return SKINS.find(s => s.id === saved) || SKINS[0];
    }
  );

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('leaderboard')
      .select('member_id, score')
      .order('score', { ascending: false })
      .limit(10);

    if (!data || data.length === 0) {
      setEntries([]);
      setLoading(false);
      return;
    }

    const memberIds = data.map(r => r.member_id);
    const { data: members } = await supabase
      .from('public_members')
      .select('id, display_name')
      .in('id', memberIds);
    const { data: streaks } = await supabase
      .from('login_streaks')
      .select('member_id, current_streak')
      .in('member_id', memberIds);

    const memberMap = new Map((members || []).map(m => [m.id, m.display_name]));
    const streakMap = new Map((streaks || []).map(s => [s.member_id, s.current_streak]));

    const combined: LeaderEntry[] = data.map(row => ({
      display_name: memberMap.get(row.member_id) || 'anon',
      best_score: row.score,
      current_streak: streakMap.get(row.member_id) || 0,
    }));

    setEntries(combined);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handleSelectSkin = (skin: SkinDef) => {
    setSelectedSkin(skin);
    localStorage.setItem('meem_skin', skin.id);
  };

  const handlePlay = () => {
    onStartGame(selectedSkin);
  };

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto"
      style={{
        background: 'linear-gradient(135deg, #e8f0f8 0%, #dde8f0 50%, #d0dce8 100%)',
        padding: '16px',
      }}
    >
      <div
        className="flex flex-col items-center w-full"
        style={{ maxWidth: 400 }}
      >
        <div className="game-meem-float mb-2">
          <svg viewBox="0 0 80 84" width={64} height={66} style={{ overflow: 'visible' }}>
            <circle cx="40" cy="42" r="30" fill="#f5d8a8" stroke="#333" strokeWidth="2.5" />
            <path d="M 22,32 C 24,15 42,8 50,8 C 58,8 68,15 70,30 L 22,32 Z" fill={selectedSkin.hatColor} stroke="#333" strokeWidth="2.5" />
            <ellipse cx="32" cy="40" rx="8" ry="9" fill="white" stroke="#333" strokeWidth="2" />
            <ellipse cx="54" cy="38" rx="9" ry="10" fill="white" stroke="#333" strokeWidth="2" />
            <circle cx="34" cy="42" r="3.5" fill="#333" />
            <circle cx="56" cy="40" r="4" fill="#333" />
            <circle cx="33" cy="41" r="1.2" fill="white" />
            <circle cx="55" cy="39" r="1.5" fill="white" />
            <path d="M 30,55 C 35,62 45,62 50,55" fill="#222" />
          </svg>
        </div>

        <h1
          className="hooey-title text-center"
          style={{ fontSize: 'clamp(2rem, 7vw, 3rem)', lineHeight: 1.1 }}
        >
          FLAPPY MEEM
        </h1>

        <div className="font-hand flex items-center gap-2 mt-1" style={{ color: '#6a8aaa', fontSize: '0.9rem' }}>
          <span>{memberName}</span>
          {streak > 1 && (
            <span className="flex items-center gap-0.5" style={{ color: '#ff6b35' }}>
              <Flame size={13} />{streak}
            </span>
          )}
        </div>

        <div
          className="w-full mt-4"
          style={{
            background: 'rgba(255,255,255,0.85)',
            borderRadius: 14,
            border: '2px solid rgba(100,160,220,0.15)',
            padding: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          }}
        >
          <p className="font-hand font-bold text-center mb-2" style={{ color: '#4a6a8a', fontSize: '0.8rem' }}>
            CHOOSE YOUR SKIN
          </p>
          <div
            className="flex gap-2 overflow-x-auto pb-2"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {SKINS.map(skin => (
              <SkinCard
                key={skin.id}
                skin={skin}
                selected={selectedSkin.id === skin.id}
                onSelect={() => handleSelectSkin(skin)}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handlePlay}
          className="game-btn-primary flex items-center gap-2 mt-4 game-pulse"
          style={{ fontSize: '1.2rem', padding: '14px 40px' }}
        >
          <Play size={20} /> PLAY
        </button>

        <p className="font-hand text-center mt-2" style={{ color: '#8aa0b8', fontSize: '0.85rem' }}>
          tap or press space to fly
        </p>

        <div
          className="w-full mt-4"
          style={{
            background: 'rgba(15, 25, 40, 0.82)',
            backdropFilter: 'blur(12px)',
            borderRadius: 14,
            border: '1.5px solid rgba(255,255,255,0.1)',
            padding: '12px 14px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Trophy size={14} style={{ color: '#f0d040' }} />
            <span className="hooey-title-sm" style={{ fontSize: '0.85rem' }}>
              LEADERBOARD
            </span>
          </div>

          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }} className="font-hand">loading...</p>
          ) : entries.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }} className="font-hand">no scores yet. be first!</p>
          ) : (
            <div className="flex flex-col gap-0.5">
              {entries.map((entry, i) => {
                const isMe = entry.display_name === memberName;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 font-hand"
                    style={{
                      padding: '4px 8px',
                      borderRadius: 6,
                      background: isMe
                        ? 'rgba(240, 208, 64, 0.12)'
                        : i < 3
                        ? 'rgba(255,255,255,0.04)'
                        : 'transparent',
                      borderLeft: isMe ? '2px solid #f0d040' : '2px solid transparent',
                    }}
                  >
                    <span style={{
                      color: i === 0 ? '#f0d040' : i < 3 ? '#e8c830' : 'rgba(255,255,255,0.35)',
                      width: 20,
                      textAlign: 'right',
                      fontSize: '0.78rem',
                      flexShrink: 0,
                    }}>
                      {i === 0 ? <Crown size={13} style={{ color: '#f0d040' }} /> : `${i + 1}.`}
                    </span>
                    <span
                      className="truncate"
                      style={{
                        color: isMe ? '#f0d040' : 'rgba(255,255,255,0.8)',
                        flex: 1,
                        maxWidth: 120,
                        fontSize: '0.78rem',
                      }}
                    >
                      {entry.display_name}
                    </span>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.82rem' }}>
                      {entry.best_score}
                    </span>
                    {entry.current_streak > 1 && (
                      <span className="flex items-center gap-0.5" style={{ color: '#ff6b35', fontSize: '0.68rem' }}>
                        <Flame size={10} />
                        {entry.current_streak}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Link
          to="/"
          className="font-hand flex items-center gap-1.5 mt-4 mb-4 game-link-subtle"
          style={{ textDecoration: 'none' }}
        >
          <Home size={14} /> back to home
        </Link>
      </div>
    </div>
  );
}
