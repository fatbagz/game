import { useState, useEffect } from 'react';
import { Trophy, Download, ChevronDown, X, Send, ExternalLink, Medal } from 'lucide-react';
import { supabase, storageUrl } from '../lib/supabase';

const PRIZES = [
  { place: 1, label: '1st Place', sol: '0.3 SOL', color: '#f0d040', icon: '🥇' },
  { place: 2, label: '2nd Place', sol: '0.2 SOL', color: '#aaa', icon: '🥈' },
  { place: 3, label: '3rd Place', sol: '0.1 SOL', color: '#cd7f32', icon: '🥉' },
];

interface CharacterImage {
  name: string;
  url: string;
  label: string;
}

interface CompetitionEntry {
  id: string;
  member_name: string;
  x_handle: string;
  post_url: string;
  character_used: string;
  views: number;
  likes: number;
  shares: number;
  placement: number | null;
  created_at: string;
}

interface MemeCompetitionProps {
  memberId: string | null;
  memberName: string;
}

export default function MemeCompetition({ memberId, memberName }: MemeCompetitionProps) {
  const [characters, setCharacters] = useState<CharacterImage[]>([]);
  const [loadingChars, setLoadingChars] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedChar, setSelectedChar] = useState<CharacterImage | null>(null);
  const [showCharDropdown, setShowCharDropdown] = useState(false);
  const [xHandle, setXHandle] = useState('');
  const [postUrl, setPostUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [winners, setWinners] = useState<CompetitionEntry[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadCharacters();
    loadWinners();
  }, []);

  async function loadCharacters() {
    setLoadingChars(true);
    const { data } = await supabase.storage.from('meme-generator').list('character', { limit: 100 });
    if (data) {
      const imgs: CharacterImage[] = data
        .filter(f => f.name && /\.(png|jpg|jpeg|webp)$/i.test(f.name))
        .map(f => ({
          name: f.name,
          url: storageUrl('meme-generator', `character/${f.name}`),
          label: f.name.replace(/\.[^.]+$/, '').replace(/image\s*[-–]\s*/i, '').replace(/image\s*/i, '').replace(/[()]/g, '').trim() || f.name,
        }));
      setCharacters(imgs);
    }
    setLoadingChars(false);
  }

  async function loadWinners() {
    const { data } = await supabase
      .from('meme_competition')
      .select('*')
      .not('placement', 'is', null)
      .order('placement', { ascending: true })
      .limit(3);
    if (data) setWinners(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!selectedChar) { setError('Please select a character you used'); return; }
    if (!xHandle.trim()) { setError('Please enter your X handle'); return; }
    if (!postUrl.trim()) { setError('Please enter your post URL'); return; }

    setSubmitting(true);
    const { error: dbErr } = await supabase.from('meme_competition').insert({
      member_id: memberId || 'anonymous',
      member_name: memberName || xHandle,
      x_handle: xHandle.trim().replace(/^@/, ''),
      post_url: postUrl.trim(),
      character_used: selectedChar.name,
    });

    if (dbErr) {
      setError('Something went wrong. Try again!');
    } else {
      setSubmitted(true);
    }
    setSubmitting(false);
  }

  async function handleDownload(char: CharacterImage) {
    try {
      const res = await fetch(char.url);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meem-character-${char.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(char.url, '_blank');
    }
  }

  return (
    <div className="w-full max-w-lg mt-10">
      <div
        className="px-5 py-5"
        style={{
          border: '3px solid #333',
          background: 'rgba(255,255,255,0.85)',
          boxShadow: '6px 6px 0 rgba(0,0,0,0.12)',
          transform: 'rotate(-0.3deg)',
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={22} style={{ color: '#f0d040' }} />
          <span className="hooey-title" style={{ fontSize: '1.4rem' }}>BEST MEEM COMPETITION</span>
        </div>
        <p className="font-hand" style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1rem' }}>
          make the funniest meem meme & win SOL prizes!
        </p>

        <div className="grid grid-cols-3 gap-2 mb-5">
          {PRIZES.map(p => (
            <div
              key={p.place}
              className="flex flex-col items-center gap-1 py-3 px-2"
              style={{
                border: `2px solid ${p.color}`,
                background: `${p.color}18`,
                transform: p.place === 1 ? 'rotate(-0.5deg) scale(1.04)' : p.place === 2 ? 'rotate(0.3deg)' : 'rotate(-0.2deg)',
              }}
            >
              <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{p.icon}</span>
              <span className="hooey-title" style={{ fontSize: '0.85rem' }}>{p.label}</span>
              <span className="hooey-title" style={{ fontSize: '0.95rem' }}>{p.sol}</span>
            </div>
          ))}
        </div>

        <div
          className="mb-5 px-4 py-3"
          style={{ border: '2px dashed #ccc', background: 'rgba(255,255,255,0.5)' }}
        >
          <p className="hooey-title mb-2" style={{ fontSize: '0.95rem' }}>HOW TO ENTER</p>
          <ol className="font-hand flex flex-col gap-1.5" style={{ fontSize: '0.85rem', color: '#555', paddingLeft: '1.1rem', listStyle: 'decimal' }}>
            <li>Follow <a href="https://x.com/meem_sol" target="_blank" rel="noopener noreferrer" style={{ color: '#1da1f2', textDecoration: 'underline' }}>@meem_sol</a> on X</li>
            <li>Share our website on your profile</li>
            <li>Download a MEEM character below & create your meme</li>
            <li>Post it to our <a href="https://t.me" target="_blank" rel="noopener noreferrer" style={{ color: '#0088cc', textDecoration: 'underline' }}>Telegram group</a> & tag an admin</li>
            <li>Submit your entry below with your post link</li>
          </ol>
          <p className="font-hand mt-2" style={{ fontSize: '0.78rem', color: '#999' }}>
            winner judged by views + likes + shares. admin approves all entries.
          </p>
        </div>

        <div className="mb-5">
          <button
            type="button"
            onClick={() => setShowCharDropdown(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3"
            style={{
              border: '2px solid #333',
              background: showCharDropdown ? '#f5f5f5' : '#fff',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
          >
            <span className="hooey-title" style={{ fontSize: '0.95rem' }}>DOWNLOAD MEEM CHARACTERS</span>
            <ChevronDown
              size={18}
              style={{
                flexShrink: 0,
                transform: showCharDropdown ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>

          {showCharDropdown && (
            <div
              style={{
                border: '2px solid #333',
                borderTop: 'none',
                background: '#fff',
                padding: '12px',
              }}
            >
              {loadingChars ? (
                <div className="font-hand text-center py-4" style={{ color: '#999', fontSize: '0.85rem' }}>loading characters...</div>
              ) : (
                <div
                  className="grid gap-2"
                  style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))' }}
                >
                  {characters.map(char => (
                    <div
                      key={char.name}
                      className="flex flex-col items-center"
                      style={{ border: '2px solid #eee', background: '#fafafa', padding: '4px' }}
                    >
                      <img
                        src={char.url}
                        alt={char.label}
                        style={{ width: '100%', aspectRatio: '1', objectFit: 'contain', display: 'block' }}
                        loading="lazy"
                      />
                      <button
                        onClick={() => handleDownload(char)}
                        className="font-hand flex items-center gap-1 w-full justify-center mt-1"
                        style={{
                          fontSize: '0.65rem',
                          background: '#333',
                          color: '#fff',
                          border: 'none',
                          padding: '3px 4px',
                          cursor: 'pointer',
                        }}
                      >
                        <Download size={10} /> save
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {winners.length > 0 && (
          <div className="mb-5">
            <p className="hooey-title mb-2" style={{ fontSize: '0.95rem' }}>CURRENT WINNERS</p>
            <div className="flex flex-col gap-2">
              {winners.map(w => (
                <div
                  key={w.id}
                  className="flex items-center gap-3 px-3 py-2"
                  style={{ border: '2px solid #f0d040', background: 'rgba(240,208,64,0.08)' }}
                >
                  <Medal size={18} style={{ color: '#f0d040', flexShrink: 0 }} />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-hand font-bold" style={{ fontSize: '0.9rem', color: '#333' }}>@{w.x_handle}</span>
                    <span className="font-hand" style={{ fontSize: '0.75rem', color: '#888' }}>
                      {w.views} views · {w.likes} likes · {w.shares} shares
                    </span>
                  </div>
                  <span className="font-hand font-bold" style={{ fontSize: '0.8rem', color: '#b8a000' }}>
                    #{w.placement}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!showForm && !submitted && (
          <button
            onClick={() => setShowForm(true)}
            className="sketch-btn w-full flex items-center justify-center gap-2"
            style={{ fontSize: '1rem' }}
          >
            <Send size={15} />
            SUBMIT YOUR ENTRY
          </button>
        )}

        {showForm && !submitted && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="hooey-title" style={{ fontSize: '1rem' }}>SUBMIT ENTRY</p>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div className="relative">
              <p className="font-hand mb-1" style={{ fontSize: '0.8rem', color: '#555' }}>Which MEEM character did you use?</p>
              <button
                type="button"
                onClick={() => setShowDropdown(v => !v)}
                className="w-full flex items-center gap-2 px-3 py-2"
                style={{
                  border: '2px solid #333',
                  background: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                {selectedChar ? (
                  <>
                    <img src={selectedChar.url} alt="" style={{ width: 32, height: 32, objectFit: 'contain', flexShrink: 0 }} />
                    <span className="font-hand flex-1" style={{ fontSize: '0.85rem', color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {selectedChar.label || selectedChar.name}
                    </span>
                  </>
                ) : (
                  <span className="font-hand flex-1" style={{ fontSize: '0.85rem', color: '#aaa' }}>select character...</span>
                )}
                <ChevronDown size={16} style={{ flexShrink: 0, transform: showDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {showDropdown && (
                <div
                  className="absolute left-0 right-0 z-50 overflow-y-auto"
                  style={{
                    top: '100%',
                    border: '2px solid #333',
                    borderTop: 'none',
                    background: '#fff',
                    maxHeight: '260px',
                    boxShadow: '4px 4px 0 rgba(0,0,0,0.1)',
                  }}
                >
                  {characters.map(char => (
                    <button
                      key={char.name}
                      type="button"
                      onClick={() => { setSelectedChar(char); setShowDropdown(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2"
                      style={{
                        background: selectedChar?.name === char.name ? 'rgba(0,0,0,0.06)' : 'transparent',
                        border: 'none',
                        borderBottom: '1px solid #eee',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <img src={char.url} alt="" style={{ width: 36, height: 36, objectFit: 'contain', flexShrink: 0 }} />
                      <span className="font-hand" style={{ fontSize: '0.82rem', color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {char.label || char.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="font-hand mb-1" style={{ fontSize: '0.8rem', color: '#555' }}>Your X handle</p>
              <input
                type="text"
                value={xHandle}
                onChange={e => setXHandle(e.target.value)}
                placeholder="@yourhandle"
                className="font-hand w-full px-3 py-2"
                style={{
                  border: '2px solid #333',
                  background: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <p className="font-hand mb-1" style={{ fontSize: '0.8rem', color: '#555' }}>Link to your meme post (X / Telegram)</p>
              <input
                type="url"
                value={postUrl}
                onChange={e => setPostUrl(e.target.value)}
                placeholder="https://x.com/yourpost"
                className="font-hand w-full px-3 py-2"
                style={{
                  border: '2px solid #333',
                  background: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>

            {error && (
              <p className="font-hand" style={{ fontSize: '0.82rem', color: '#cc2222', background: 'rgba(204,34,34,0.06)', padding: '8px 12px', border: '1.5px solid #cc2222' }}>
                {error}
              </p>
            )}

            <div className="flex flex-col gap-2">
              <p className="font-hand" style={{ fontSize: '0.75rem', color: '#888' }}>
                by submitting you confirm you follow @meem_sol, shared our site, and posted in our Telegram tagging an admin
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="sketch-btn flex items-center justify-center gap-2"
                style={{ fontSize: '0.95rem', opacity: submitting ? 0.6 : 1 }}
              >
                <Send size={14} />
                {submitting ? 'SUBMITTING...' : 'SUBMIT ENTRY'}
              </button>
            </div>
          </form>
        )}

        {submitted && (
          <div
            className="flex flex-col items-center gap-2 py-5 px-4"
            style={{ border: '2px solid #22aa44', background: 'rgba(34,170,68,0.06)' }}
          >
            <Trophy size={28} style={{ color: '#22aa44' }} />
            <p className="hooey-title text-center" style={{ fontSize: '1.1rem', color: '#22aa44' }}>ENTRY SUBMITTED!</p>
            <p className="font-hand text-center" style={{ fontSize: '0.85rem', color: '#555' }}>
              an admin will review & approve your entry. good luck!
            </p>
            <a
              href="https://x.com/meem_sol"
              target="_blank"
              rel="noopener noreferrer"
              className="font-hand flex items-center gap-1.5 mt-1"
              style={{ fontSize: '0.8rem', color: '#1da1f2', textDecoration: 'underline' }}
            >
              <ExternalLink size={13} /> view @meem_sol on X
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
