import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../utils/seo';
import StoryText from '../components/StoryText';
import MemeSection from '../components/MemeSection';
import HandDrawnButton from '../components/HandDrawnButton';
import ScatteredDoodles from '../components/ScatteredDoodles';
import StoryDoodles from '../components/StoryDoodles';
import CryptoChartBg from '../components/CryptoChartBg';
import FaqSection from '../components/FaqSection';
import { PumpFunIcon, TelegramIcon, XIcon } from '../components/ButtonIcons';
import NavBar from '../components/NavBar';
import FloatingMeem from '../components/FloatingMeem';
import MeemClubSignup from '../components/MeemClubSignup';
import FloatingAssets from '../components/FloatingAssets';
import { startMusic } from '../utils/audio';

const MEEM_CHARACTER_URL = 'https://fhfvefrocgtfvfwdhyxw.supabase.co/storage/v1/object/public/lol/meems%20random/meem_character_transparent_v2.png';

const LAUNCH_DATE = new Date('2026-04-10T00:00:00Z');

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, launched: false });
  useEffect(() => {
    const calc = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, launched: true });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        launched: false,
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [target]);
  return timeLeft;
}

function HomeCountdown({ visible }: { visible: boolean }) {
  const { days, hours, minutes, seconds, launched } = useCountdown(LAUNCH_DATE);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.85)',
        border: '2.5px solid #333',
        borderRadius: 8,
        padding: '16px 20px',
        boxShadow: '4px 4px 0 rgba(0,0,0,0.10)',
        transform: visible ? 'rotate(0.4deg) translateY(0)' : 'rotate(0.4deg) translateY(-60px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.6s cubic-bezier(0.34,1.4,0.64,1), opacity 0.5s ease',
        textAlign: 'center',
        maxWidth: 320,
        width: '100%',
        margin: '0 auto',
      }}
    >
      <p className="font-hand" style={{ color: '#888', fontSize: '0.78rem', marginBottom: 8, letterSpacing: '0.08em' }}>
        {launched ? 'meem has launched' : 'launch in'}
      </p>
      {launched ? (
        <p className="font-hand" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#222' }}>meem is live</p>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'flex-end' }}>
            {[{ v: days, label: 'days' }, { v: hours, label: 'hrs' }, { v: minutes, label: 'min' }, { v: seconds, label: 'sec' }].map(({ v, label }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 48 }}>
                <div
                  style={{
                    background: '#333',
                    color: '#fafaf5',
                    fontFamily: "'Patrick Hand', cursive",
                    fontWeight: 700,
                    fontSize: 'clamp(1.3rem, 4.5vw, 1.8rem)',
                    lineHeight: 1,
                    padding: '7px 8px',
                    borderRadius: 4,
                    minWidth: 48,
                    textAlign: 'center',
                    boxShadow: '2px 2px 0 rgba(0,0,0,0.18)',
                  }}
                >
                  {pad(v)}
                </div>
                <span className="font-hand" style={{ color: '#888', fontSize: '0.68rem', marginTop: 4 }}>{label}</span>
              </div>
            ))}
          </div>
          <p className="font-hand" style={{ color: '#aaa', fontSize: '0.72rem', marginTop: 8 }}>april 10th, 2026</p>
        </>
      )}
    </div>
  );
}

type Phase = 'idle' | 'walking' | 'arrived' | 'bubble' | 'title' | 'subtitle' | 'ready' | 'story' | 'done';

function hasSeenIntro(): boolean {
  return sessionStorage.getItem('meem_intro_seen') === 'true';
}

function markIntroSeen() {
  sessionStorage.setItem('meem_intro_seen', 'true');
}

export default function HomePage() {
  useSEO({
    title: 'MEEM Coin | New Solana Meme Coin Launching Soon',
    description: 'MEEM is a new Solana meme coin launching soon. Join early and don\'t miss the hype.',
    canonical: 'https://meem.lol/',
  });

  const skipIntro = hasSeenIntro();

  const [countdown, setCountdown] = useState(skipIntro ? 0 : 3);
  const [started, setStarted] = useState(skipIntro);
  const [phase, setPhase] = useState<Phase>(skipIntro ? 'done' : 'idle');
  const [showTitle, setShowTitle] = useState(skipIntro);
  const [showSubtitle, setShowSubtitle] = useState(skipIntro);
  const [showBubble, setShowBubble] = useState(skipIntro);
  const [showCountdown, setShowCountdown] = useState(skipIntro);
  const [showPlayButton, setShowPlayButton] = useState(skipIntro);
  const [completedLines, setCompletedLines] = useState<number[]>(skipIntro ? Array.from({ length: 60 }, (_, i) => i) : []);
  const [showStory, setShowStory] = useState(false);
  const [storyStarted, setStoryStarted] = useState(skipIntro);
  const [storyDone, setStoryDone] = useState(skipIntro);
  const storyRef = useRef<HTMLDivElement>(null);
  const belowStoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (started) return;
    if (countdown <= 0) {
      setStarted(true);
      return;
    }
    const t = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, started]);

  useEffect(() => {
    if (!started || skipIntro) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setPhase('walking'), 200));
    timers.push(setTimeout(() => setPhase('arrived'), 1800));
    timers.push(setTimeout(() => {
      setPhase('bubble');
      setShowBubble(true);
    }, 2400));
    timers.push(setTimeout(() => {
      setPhase('title');
      setShowTitle(true);
    }, 3200));
    timers.push(setTimeout(() => {
      setPhase('subtitle');
      setShowSubtitle(true);
    }, 3800));
    timers.push(setTimeout(() => {
      setShowCountdown(true);
    }, 4600));
    timers.push(setTimeout(() => {
      setPhase('ready');
      setShowPlayButton(true);
    }, 5400));

    return () => timers.forEach(clearTimeout);
  }, [started, skipIntro]);

  useEffect(() => {
    if (storyStarted && !storyDone) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [storyStarted, storyDone]);

  const handlePlayStory = useCallback(() => {
    if (!showPlayButton && !skipIntro) return;
    setShowStory(true);
    setStoryStarted(true);
    setStoryDone(false);
    setCompletedLines([]);
    setPhase('story');
    startMusic();
  }, [showPlayButton, skipIntro]);

  const handleLineComplete = useCallback((lineIndex: number) => {
    setCompletedLines(prev => [...prev, lineIndex]);
  }, []);

  const handleStoryDone = useCallback(() => {
    setStoryDone(true);
    setPhase('done');
    markIntroSeen();
    document.body.style.overflow = 'auto';
    setTimeout(() => {
      belowStoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
  }, []);

  const handleSkip = useCallback(() => {
    setPhase('done');
    setShowBubble(true);
    setShowTitle(true);
    setShowSubtitle(true);
    setShowCountdown(true);
    setShowPlayButton(true);
    setShowStory(true);
    setStoryStarted(true);
    setStoryDone(true);
    document.body.style.overflow = 'auto';
    markIntroSeen();
  }, []);

  if (!started) {
    return (
      <div className="notebook">
        <div className="countdown-overlay">
          <div className="countdown-number" key={countdown}>
            {countdown}
          </div>
        </div>
      </div>
    );
  }

  const meemHasArrived = ['arrived', 'bubble', 'title', 'subtitle', 'ready', 'story', 'done'].includes(phase);
  const isWalking = phase === 'walking';
  const showContent = phase !== 'idle';

  const meemTranslateX = isWalking
    ? 'translateX(-10%)'
    : meemHasArrived || skipIntro
    ? 'translateX(0%)'
    : 'translateX(-130%)';

  const isStoryActive = storyStarted && !storyDone;

  return (
    <div className="relative">
      <div className="relative z-10">
        <div className="notebook">
          <CryptoChartBg visible={showContent} />
          <ScatteredDoodles visible={showContent} />
          <FloatingAssets />
          <NavBar />
          {!skipIntro && phase !== 'done' && !storyStarted && (
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 z-50 font-hand text-sm px-3 py-2 bg-white border-2 border-gray-300 rounded shadow"
              style={{ transform: 'rotate(-1deg)' }}
            >
              SKIP INTRO
            </button>
          )}
          {(!storyStarted || storyDone) && <FloatingMeem />}

          <div className="notebook-content" style={{ paddingTop: 80 }}>
            <div className="flex flex-col items-center">
              <div
                className="px-4 py-2 mb-3"
                style={{
                  border: '2.5px solid #333',
                  background: 'rgba(255,255,255,0.7)',
                  transform: 'rotate(0.5deg)',
                  boxShadow: '4px 4px 0 rgba(0,0,0,0.1)',
                }}
              >
                <p className="font-hand text-center" style={{ color: '#888', fontSize: '0.95rem' }}>
                  <span style={{ fontWeight: 700, color: '#333' }}>CA:</span>{' '}
                  <span style={{ color: '#999', fontStyle: 'italic' }}>Coming Soon</span>
                </p>
              </div>

              {showContent && (
                <div
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    marginBottom: 10,
                  }}
                >
                  <Link to="/roadmap" style={{ textDecoration: 'none' }}>
                    <div
                      style={{
                        background: '#fff',
                        border: '2.5px solid #333',
                        borderRadius: 14,
                        padding: '10px 16px',
                        position: 'relative',
                        boxShadow: '3px 3px 0 rgba(0,0,0,0.12)',
                        transform: 'rotate(-1.5deg)',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = 'rotate(-1.5deg) scale(1.04)';
                        (e.currentTarget as HTMLDivElement).style.boxShadow = '5px 5px 0 rgba(0,0,0,0.18)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = 'rotate(-1.5deg)';
                        (e.currentTarget as HTMLDivElement).style.boxShadow = '3px 3px 0 rgba(0,0,0,0.12)';
                      }}
                    >
                      <p
                        className="font-hand"
                        style={{
                          fontSize: '0.9rem',
                          color: '#333',
                          lineHeight: 1.5,
                          whiteSpace: 'nowrap',
                          textAlign: 'center',
                        }}
                      >
                        check out the roadmap
                        <br />
                        <span style={{ fontWeight: 700 }}>to meem masterplan</span>
                      </p>
                      <div style={{ position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderTop: '11px solid #333' }} />
                      <div style={{ position: 'absolute', bottom: -7, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '9px solid #fff' }} />
                    </div>
                  </Link>
                </div>
              )}

              <div
                style={{
                  width: '100%',
                  maxWidth: 300,
                  margin: '0 auto 8px',
                  position: 'relative',
                  transform: meemTranslateX,
                  opacity: showContent ? 1 : 0,
                  transition: isWalking
                    ? 'transform 1.4s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s ease'
                    : meemHasArrived
                    ? 'transform 0.55s cubic-bezier(0.34,1.5,0.64,1), opacity 0.4s ease'
                    : 'none',
                  animation: meemHasArrived
                    ? 'heroMeemFloat 3.8s cubic-bezier(0.45,0.05,0.55,0.95) infinite'
                    : undefined,
                  transformOrigin: 'bottom center',
                }}
              >
                {(showBubble || skipIntro) && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -10,
                      right: -20,
                      background: '#fff',
                      border: '2.5px solid #333',
                      borderRadius: 12,
                      padding: '8px 14px',
                      boxShadow: '3px 3px 0 rgba(0,0,0,0.12)',
                      transform: 'rotate(2deg)',
                      zIndex: 10,
                      animation: skipIntro ? undefined : 'bubblePopIn 0.45s cubic-bezier(0.34,1.7,0.64,1) forwards',
                      opacity: skipIntro ? 1 : 0,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <p className="font-hand" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#333' }}>
                      gm frens 🐸
                    </p>
                    <div style={{
                      position: 'absolute',
                      bottom: -9,
                      left: 18,
                      width: 0, height: 0,
                      borderLeft: '8px solid transparent',
                      borderRight: '8px solid transparent',
                      borderTop: '10px solid #333',
                    }} />
                    <div style={{
                      position: 'absolute',
                      bottom: -6,
                      left: 19,
                      width: 0, height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '8px solid #fff',
                    }} />
                  </div>
                )}
                <img
                  src={MEEM_CHARACTER_URL}
                  alt="MEEM solana meme coin character mascot with sunglasses"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.22))',
                    animation: meemHasArrived
                      ? 'heroMeemBreath 2.6s ease-in-out infinite'
                      : undefined,
                    transformOrigin: 'bottom center',
                  }}
                />
              </div>

              {(showTitle || skipIntro) && (
                <h1
                  className="mt-4 hooey-title text-center"
                  style={{
                    fontSize: 'clamp(2.8rem, 9vw, 4.5rem)',
                    lineHeight: 1.1,
                  }}
                >
                  {'MEEM'.split('').map((letter, i) => (
                    <span
                      key={`meem-${i}`}
                      style={{
                        display: 'inline-block',
                        animation: skipIntro
                          ? undefined
                          : 'dropInBounce 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards',
                        animationDelay: `${i * 0.08}s`,
                        opacity: skipIntro ? 1 : 0,
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                </h1>
              )}

              {(showSubtitle || skipIntro) && (
                <p
                  className="hooey-title-sm text-center mt-1"
                  style={{
                    fontSize: 'clamp(1.4rem, 5vw, 2rem)',
                    display: 'inline-block',
                    animation: skipIntro
                      ? undefined
                      : 'dropInBounce 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards',
                    animationDelay: '0.1s',
                    opacity: skipIntro ? 1 : 0,
                  }}
                >
                  $MEEM ON SOLANA
                </p>
              )}

              <div style={{ width: '100%', maxWidth: 340, marginTop: 16, marginBottom: 8, padding: '0 16px' }}>
                <HomeCountdown visible={skipIntro || showCountdown} />
              </div>

              {(showSubtitle || skipIntro) && (
                <div style={{ marginTop: 12, marginBottom: 8 }}>
                  <button
                    onClick={handlePlayStory}
                    disabled={!showPlayButton && !skipIntro}
                    style={{
                      fontFamily: "'Patrick Hand', cursive",
                      fontSize: 'clamp(0.95rem, 3vw, 1.15rem)',
                      fontWeight: 700,
                      color: showPlayButton || skipIntro ? '#fafaf5' : '#aaa',
                      background: showPlayButton || skipIntro ? '#333' : '#ddd',
                      border: '2.5px solid #333',
                      borderRadius: 8,
                      padding: '12px 24px',
                      cursor: showPlayButton || skipIntro ? 'pointer' : 'not-allowed',
                      boxShadow: showPlayButton || skipIntro ? '4px 4px 0 rgba(0,0,0,0.18)' : '2px 2px 0 rgba(0,0,0,0.08)',
                      transform: 'rotate(-0.8deg)',
                      transition: 'all 0.3s ease',
                      letterSpacing: '0.03em',
                    }}
                    onMouseEnter={(e) => {
                      if (showPlayButton || skipIntro) {
                        (e.currentTarget as HTMLButtonElement).style.transform = 'rotate(-0.8deg) scale(1.04)';
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = '6px 6px 0 rgba(0,0,0,0.22)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = 'rotate(-0.8deg)';
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = showPlayButton || skipIntro ? '4px 4px 0 rgba(0,0,0,0.18)' : '2px 2px 0 rgba(0,0,0,0.08)';
                    }}
                  >
                    play meems story
                  </button>
                </div>
              )}

              <div ref={storyRef} />

              <div ref={belowStoryRef} />

              {(storyDone || skipIntro) && (
                <>
                  <MemeSection visible={true} />
                  <FaqSection visible={true} />
                  <MeemClubSignup visible={true} />

                  <div className="mt-12 flex flex-wrap gap-6 justify-center">
                    <HandDrawnButton href="https://pump.fun/" rotation={-1.5} icon={<PumpFunIcon />}>
                      BUY MEEM
                    </HandDrawnButton>
                    <HandDrawnButton href="https://t.me/MEEMfrends" rotation={1} icon={<TelegramIcon />}>
                      JOIN TELEGRAM
                    </HandDrawnButton>
                    <HandDrawnButton href="https://x.com/meem_sol?s=21" rotation={-0.5} icon={<XIcon />}>
                      FOLLOW ON X
                    </HandDrawnButton>
                  </div>

                  <p
                    className="mt-12 font-hand text-sm text-center"
                    style={{ color: '#999' }}
                  >
                    this is not financial advice. meem is not responsible for anything.
                    <br />
                    we are all just vibing.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showStory && !storyDone && (
        <StoryOverlay
          active={storyStarted}
          onLineComplete={handleLineComplete}
          onDone={handleStoryDone}
          completedLines={completedLines}
        />
      )}
    </div>
  );
}

function StoryOverlay({
  active,
  onLineComplete,
  onDone,
  completedLines,
}: {
  active: boolean;
  onLineComplete: (i: number) => void;
  onDone: () => void;
  completedLines: number[];
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        background: 'rgba(250,250,245,0.98)',
        backdropFilter: 'blur(8px)',
        animation: 'storyOverlayIn 0.5s cubic-bezier(0.34,1.1,0.64,1) forwards',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 580,
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '56px 20px 80px',
          scrollBehavior: 'smooth',
        }}
      >
        <div
          style={{
            backgroundImage: 'repeating-linear-gradient(transparent 0px, transparent 31px, #a3c4df 31px, #a3c4df 32px)',
            borderRadius: 12,
            border: '2.5px solid #ccc',
            padding: '28px 24px 40px',
            position: 'relative',
          }}
        >
          <StoryText
            active={active}
            onLineComplete={onLineComplete}
            onDone={onDone}
            autoScroll={true}
          />
          <StoryDoodles completedLines={completedLines} />
        </div>
      </div>
    </div>
  );
}
