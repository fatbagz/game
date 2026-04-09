import { useEffect, useState, useRef, useCallback } from 'react';
import { findDoodleAtPoint, hideDoodle, showDoodle, DoodleType } from '../utils/doodleRegistry';
import MeemInteraction from './MeemInteraction';
import { playGrab, playDrop, playLaugh } from '../utils/audio';

interface CoinData {
  id: number;
  vx: number;
  vy: number;
  scale: number;
}

type Side = 'left' | 'right' | 'top' | 'bottom';

interface RunState {
  id: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  duration: number;
  facingRight: boolean;
  laughing: boolean;
}

interface InteractionState {
  type: DoodleType;
  doodleId: string;
  x: number;
  y: number;
}

let coinId = 0;
let runId = 0;

const MEEM_W = 80;
const MEEM_H = 100;

const MASCOT_URL = 'https://fhfvefrocgtfvfwdhyxw.supabase.co/storage/v1/object/public/lol/meems%20random/cc.PNG';

function pickSide(): Side {
  const sides: Side[] = ['left', 'right', 'top', 'bottom'];
  return sides[Math.floor(Math.random() * sides.length)];
}

function pointOnSide(side: Side): { x: number; y: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  switch (side) {
    case 'left':
      return { x: -MEEM_W - 10, y: Math.random() * (vh - MEEM_H) };
    case 'right':
      return { x: vw + 10, y: Math.random() * (vh - MEEM_H) };
    case 'top':
      return { x: Math.random() * (vw - MEEM_W), y: -MEEM_H - 10 };
    case 'bottom':
      return { x: Math.random() * (vw - MEEM_W), y: vh + 10 };
  }
}

function randomInnerPoint(): { x: number; y: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return {
    x: MEEM_W + Math.random() * (vw - MEEM_W * 3),
    y: MEEM_H + Math.random() * (vh - MEEM_H * 3),
  };
}

function oppositeSidePoint(from: { x: number; y: number }): { x: number; y: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cx = vw / 2;
  const cy = vh / 2;
  const dx = from.x - cx;
  const dy = from.y - cy;
  const exitX = cx - dx * 1.5;
  const exitY = cy - dy * 1.5;
  const pad = 20;
  return {
    x: exitX < -MEEM_W ? -MEEM_W - pad : exitX > vw ? vw + pad : exitX,
    y: exitY < -MEEM_H ? -MEEM_H - pad : exitY > vh ? vh + pad : exitY,
  };
}

const SPEECH_LINES = [
  'catch me if you can!',
  'catch me if you can!',
  'hehe too slow!',
  'you cant catch meem!',
  'catch me if you can!',
];

export default function FloatingMeem() {
  const [run, setRun] = useState<RunState | null>(null);
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [wiggle, setWiggle] = useState(false);
  const [interaction, setInteraction] = useState<InteractionState | null>(null);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);

  const animRef = useRef<number>(0);
  const startTimeRef = useRef(0);
  const coinTimerRef = useRef<ReturnType<typeof setInterval>>();
  const runTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const speechTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const currentPosRef = useRef({ x: 0, y: 0 });
  const meemRef = useRef<HTMLDivElement>(null);
  const dragPosRef = useRef({ x: 0, y: 0 });
  const clientPosRef = useRef({ x: 0, y: 0 });

  const startNewRun = useCallback(() => {
    const entrySide = pickSide();
    const from = pointOnSide(entrySide);

    const doPassThrough = Math.random() > 0.4;
    let to: { x: number; y: number };
    let dur: number;

    if (doPassThrough) {
      const inner = randomInnerPoint();
      to = oppositeSidePoint(inner);
      dur = 6000 + Math.random() * 5000;
    } else {
      to = pointOnSide(pickSide());
      dur = 5000 + Math.random() * 4000;
    }

    const facingRight = to.x > from.x;
    const willLaugh = Math.random() > 0.3;

    setRun({
      id: runId++,
      fromX: from.x,
      fromY: from.y,
      toX: to.x,
      toY: to.y,
      duration: dur,
      facingRight,
      laughing: willLaugh,
    });
    setProgress(0);
    startTimeRef.current = performance.now();
  }, []);

  const startRunFromPos = useCallback((fromX: number, fromY: number) => {
    const exitSide = pickSide();
    const to = pointOnSide(exitSide);
    const dur = 4500 + Math.random() * 3000;
    const facingRight = to.x > fromX;

    setRun({
      id: runId++,
      fromX,
      fromY,
      toX: to.x,
      toY: to.y,
      duration: dur,
      facingRight,
      laughing: Math.random() > 0.3,
    });
    setProgress(0);
    startTimeRef.current = performance.now();
  }, []);

  useEffect(() => {
    if (!run || dragging || interaction) {
      setSpeechBubble(null);
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
      return;
    }

    const scheduleBubble = () => {
      const delay = 2000 + Math.random() * 4000;
      speechTimerRef.current = setTimeout(() => {
        const line = SPEECH_LINES[Math.floor(Math.random() * SPEECH_LINES.length)];
        setSpeechBubble(line);
        setTimeout(() => setSpeechBubble(null), 2200);
        scheduleBubble();
      }, delay);
    };

    scheduleBubble();

    return () => {
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    };
  }, [run, dragging, interaction]);

  useEffect(() => {
    const initialDelay = setTimeout(() => startNewRun(), 1500);
    return () => clearTimeout(initialDelay);
  }, [startNewRun]);

  useEffect(() => {
    if (!run || dragging || interaction) return;

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const p = Math.min(elapsed / run.duration, 1);
      setProgress(p);

      if (p < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        runTimeoutRef.current = setTimeout(() => {
          startNewRun();
        }, 1500 + Math.random() * 3000);
      }
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      if (runTimeoutRef.current) clearTimeout(runTimeoutRef.current);
    };
  }, [run, startNewRun, dragging, interaction]);

  useEffect(() => {
    if (!run || dragging || interaction) return;

    coinTimerRef.current = setInterval(() => {
      const c: CoinData = {
        id: coinId++,
        vx: (Math.random() - 0.5) * 100,
        vy: -(Math.random() * 50 + 60),
        scale: 0.6 + Math.random() * 0.4,
      };
      setCoins(prev => [...prev.slice(-4), c]);
      setTimeout(() => setCoins(prev => prev.filter(cc => cc.id !== c.id)), 1600);
    }, 800);

    return () => clearInterval(coinTimerRef.current);
  }, [run, dragging, interaction]);

  const handleGrabStart = useCallback((clientX: number, clientY: number) => {
    if (interaction) return;
    cancelAnimationFrame(animRef.current);
    if (runTimeoutRef.current) clearTimeout(runTimeoutRef.current);
    if (coinTimerRef.current) clearInterval(coinTimerRef.current);

    const pos = currentPosRef.current;
    dragOffsetRef.current = {
      x: clientX - pos.x,
      y: clientY - pos.y,
    };
    setDragPos({ x: pos.x, y: pos.y });
    dragPosRef.current = { x: pos.x, y: pos.y };
    clientPosRef.current = { x: clientX, y: clientY };
    setDragging(true);
    setWiggle(true);
    playGrab();
    playLaugh();
  }, [interaction]);

  const handleGrabMove = useCallback((clientX: number, clientY: number) => {
    const newX = clientX - dragOffsetRef.current.x;
    const newY = clientY - dragOffsetRef.current.y;
    setDragPos({ x: newX, y: newY });
    dragPosRef.current = { x: newX, y: newY };
    clientPosRef.current = { x: clientX, y: clientY };
  }, []);

  const handleGrabEnd = useCallback(() => {
    setDragging(false);
    setWiggle(false);
    playDrop();

    const pos = dragPosRef.current;
    const dropX = clientPosRef.current.x;
    const dropY = clientPosRef.current.y;

    const hit = findDoodleAtPoint(dropX, dropY);

    if (hit) {
      hideDoodle(hit.id);
      setInteraction({ type: hit.type, doodleId: hit.id, x: pos.x, y: pos.y });
    } else {
      setTimeout(() => startRunFromPos(pos.x, pos.y), 300 + Math.random() * 700);
    }
  }, [startRunFromPos]);

  const handleInteractionComplete = useCallback(() => {
    if (interaction) {
      showDoodle(interaction.doodleId);
    }
    setInteraction(null);
    setTimeout(() => startNewRun(), 500 + Math.random() * 1000);
  }, [interaction, startNewRun]);

  useEffect(() => {
    if (!dragging) return;

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleGrabMove(e.clientX, e.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const t = e.touches[0];
      handleGrabMove(t.clientX, t.clientY);
    };
    const onMouseUp = () => handleGrabEnd();
    const onTouchEnd = () => handleGrabEnd();

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [dragging, handleGrabEnd, handleGrabMove]);

  if (interaction) {
    return (
      <MeemInteraction
        type={interaction.type}
        startX={interaction.x}
        startY={interaction.y}
        onComplete={handleInteractionComplete}
      />
    );
  }

  if (!run && !dragging) return null;

  let x: number, y: number, bounceY: number;

  if (dragging) {
    x = dragPos.x;
    y = dragPos.y;
    bounceY = 0;
  } else if (run) {
    const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const t = easeInOut(progress);
    x = run.fromX + (run.toX - run.fromX) * t;
    y = run.fromY + (run.toY - run.fromY) * t;
    bounceY = -Math.abs(Math.sin(progress * Math.PI * 3)) * 8;
  } else {
    return null;
  }

  currentPosRef.current = { x, y };

  const facingRight = run?.facingRight ?? true;
  const laughing = dragging ? false : (run?.laughing ?? false);

  return (
    <div
      ref={meemRef}
      className="roaming-meem-wrapper"
      style={{
        transform: `translate(${x}px, ${y + (bounceY || 0)}px)${wiggle ? ' rotate(-8deg)' : ''}`,
        cursor: dragging ? 'grabbing' : 'grab',
        pointerEvents: 'auto',
        transition: wiggle ? 'transform 0.1s ease' : undefined,
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleGrabStart(e.clientX, e.clientY);
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
        const t = e.touches[0];
        handleGrabStart(t.clientX, t.clientY);
      }}
    >
      <div className="floating-coins-area">
        {coins.map(coin => (
          <div
            key={coin.id}
            className="floating-coin"
            style={{
              '--coin-vx': `${coin.vx}px`,
              '--coin-vy': `${coin.vy}px`,
              '--coin-scale': coin.scale,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {speechBubble && !dragging && (
        <div className="meem-speech-bubble">
          <span>{speechBubble}</span>
          <div className="meem-speech-tail" />
        </div>
      )}

      {laughing && !speechBubble && (
        <div className="roam-laugh-bubbles">
          <span className="roam-laugh-text rl-1">HA</span>
          <span className="roam-laugh-text rl-2">HA</span>
          <span className="roam-laugh-text rl-3">LOL</span>
        </div>
      )}

      {dragging && (
        <div
          style={{
            position: 'absolute',
            top: -28,
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'Patrick Hand', cursive",
            fontSize: '0.8rem',
            color: '#e06080',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            textShadow: '1px 1px 0 rgba(255,255,255,0.8)',
            animation: 'countdownPop 0.4s ease-out forwards',
          }}
        >
          HEY!! PUT ME DOWN!
        </div>
      )}

      <div
        className={`floating-meem-body`}
        style={{
          transform: `scaleX(${facingRight ? 1 : -1})${dragging ? ' scale(1.15)' : ''}`,
          transition: dragging ? 'transform 0.15s ease' : undefined,
        }}
      >
        <div
          style={{
            animation: dragging
              ? 'none'
              : laughing
              ? 'meemRunLaughShake 0.7s ease-in-out infinite'
              : 'meemRunTilt 0.6s ease-in-out infinite',
            transformOrigin: 'bottom center',
          }}
        >
          <img
            src={MASCOT_URL}
            alt="MEEM solana meme coin mascot running"
            style={{
              width: MEEM_W,
              height: MEEM_H,
              objectFit: 'contain',
              display: 'block',
              userSelect: 'none',
              pointerEvents: 'none',
              animation: dragging
                ? 'none'
                : 'meemRunSquash 0.6s ease-in-out infinite',
              transformOrigin: 'bottom center',
            }}
          />
        </div>
        <div
          style={{
            width: MEEM_W * 0.7,
            height: 6,
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.18) 0%, transparent 70%)',
            margin: '0 auto',
            animation: dragging ? 'none' : 'meemRunShadow 0.6s ease-in-out infinite',
            transformOrigin: 'center',
          }}
        />
      </div>
    </div>
  );
}
