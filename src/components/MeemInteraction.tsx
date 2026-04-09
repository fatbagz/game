import { useEffect, useState, useRef, useCallback } from 'react';
import { DoodleType } from '../utils/doodleRegistry';
import { playCarVroom, playRocketLaunch, playDogBark, playDiamondSparkle } from '../utils/audio';
import { MeemDrinksBeer, MeemSmokes, MeemShoots, MeemWearsGlasses, MeemDrivesLambo, MeemDrivesCarWithImage } from './AssetInteractions';

const MEEM_W = 65;
const MEEM_H = 100;

interface MeemInteractionProps {
  type: DoodleType;
  startX: number;
  startY: number;
  onComplete: () => void;
}

interface AnimPos {
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

function randomEdgePoint(): { x: number; y: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const side = Math.floor(Math.random() * 4);
  switch (side) {
    case 0: return { x: -120, y: Math.random() * vh };
    case 1: return { x: vw + 120, y: Math.random() * vh };
    case 2: return { x: Math.random() * vw, y: -120 };
    default: return { x: Math.random() * vw, y: vh + 120 };
  }
}

function MeemInCar({ startX, startY, onComplete }: Omit<MeemInteractionProps, 'type'>) {
  const [pos, setPos] = useState<AnimPos>({ x: startX, y: startY, rotation: 0, scale: 1 });
  const [phase, setPhase] = useState<'mount' | 'drive' | 'exit'>('mount');
  const animRef = useRef(0);
  const startRef = useRef(0);
  const waypointsRef = useRef<{ x: number; y: number }[]>([]);
  const exitPointRef = useRef({ x: 0, y: 0 });
  const currentPosRef = useRef({ x: startX, y: startY });

  useEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const points = [];
    for (let i = 0; i < 3; i++) {
      points.push({
        x: 40 + Math.random() * (vw - 120),
        y: 40 + Math.random() * (vh - 120),
      });
    }
    waypointsRef.current = points;
    exitPointRef.current = randomEdgePoint();

    playCarVroom();
    const t = setTimeout(() => setPhase('drive'), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase === 'mount') return;

    const allPoints = phase === 'drive'
      ? [{ x: startX, y: startY }, ...waypointsRef.current]
      : [{ x: currentPosRef.current.x, y: currentPosRef.current.y }, exitPointRef.current];

    const totalDur = phase === 'drive' ? 3500 : 1500;
    startRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / totalDur, 1);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      const segCount = allPoints.length - 1;
      const segPos = eased * segCount;
      const segIdx = Math.min(Math.floor(segPos), segCount - 1);
      const segT = segPos - segIdx;

      const from = allPoints[segIdx];
      const to = allPoints[segIdx + 1];
      const cx = from.x + (to.x - from.x) * segT;
      const cy = from.y + (to.y - from.y) * segT;

      const angle = Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI);

      currentPosRef.current = { x: cx, y: cy };
      setPos({ x: cx, y: cy, rotation: angle, scale: 1 });

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else if (phase === 'drive') {
        setPhase('exit');
      } else {
        onComplete();
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, startX, startY, onComplete]);

  return (
    <div
      className="meem-interaction-wrapper"
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.rotation}deg)`,
      }}
    >
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: -30,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Patrick Hand', cursive",
          fontSize: '0.75rem',
          color: '#e8c020',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          textShadow: '1px 1px 0 rgba(0,0,0,0.15)',
        }}>
          {phase === 'mount' ? 'VROOM!' : 'BRRRRR!!'}
        </div>
        <svg viewBox="0 0 180 90" width={120} height={60} style={{ overflow: 'visible' }}>
          <g>
            <path
              d="M 20,55 L 25,35 C 30,25 45,18 75,18 L 110,18 C 120,18 130,25 135,35 L 140,55"
              fill="#f0d040" stroke="#333" strokeWidth="2.5" strokeLinecap="round"
            />
            <path d="M 15,55 L 145,55 L 148,60 L 12,60 Z" fill="#e8c020" stroke="#333" strokeWidth="2.5" />
            <rect x="50" y="22" width="18" height="14" rx="2" fill="#aaddff" stroke="#333" strokeWidth="2" />
            <rect x="73" y="22" width="22" height="14" rx="2" fill="#aaddff" stroke="#333" strokeWidth="2" />

            <g transform="translate(78, 8) scale(0.22)">
              <path
                d="M 65,120 C 60,70 80,38 130,35 C 180,32 205,65 208,115 C 212,165 190,195 130,198 C 70,200 62,170 65,120 Z"
                fill="#f5d8a8" stroke="#333" strokeWidth="4"
              />
              <path
                d="M 55,95 C 58,45 90,18 135,15 C 178,13 210,35 212,80 L 210,95 L 70,98 C 62,100 56,98 55,95 Z"
                fill="#4488cc" stroke="#333" strokeWidth="4"
              />
              <ellipse cx="100" cy="118" rx="22" ry="24" fill="white" stroke="#333" strokeWidth="4" />
              <ellipse cx="168" cy="115" rx="24" ry="26" fill="white" stroke="#333" strokeWidth="4" />
              <circle cx="108" cy="122" r="8" fill="#333" />
              <circle cx="176" cy="119" r="9" fill="#333" />
              <circle cx="105" cy="119" r="3" fill="white" />
              <circle cx="173" cy="116" r="3.5" fill="white" />
              <path d="M 90,155 C 100,175 130,180 145,175 C 160,170 170,158 168,148 C 155,160 105,162 90,155 Z" fill="#222" stroke="#333" strokeWidth="3" />
            </g>

            <circle cx="35" cy="64" r="10" fill="#555" stroke="#333" strokeWidth="2.5">
              <animateTransform attributeName="transform" type="rotate" values="0 35 64;360 35 64" dur="0.3s" repeatCount="indefinite" />
            </circle>
            <circle cx="125" cy="64" r="10" fill="#555" stroke="#333" strokeWidth="2.5">
              <animateTransform attributeName="transform" type="rotate" values="0 125 64;360 125 64" dur="0.3s" repeatCount="indefinite" />
            </circle>
          </g>

          {phase === 'drive' && (
            <g opacity="0.5">
              <line x1="-5" y1="50" x2="-25" y2="50" stroke="#999" strokeWidth="2" strokeDasharray="4 3">
                <animate attributeName="x1" values="-5;-15" dur="0.2s" repeatCount="indefinite" />
                <animate attributeName="x2" values="-25;-45" dur="0.2s" repeatCount="indefinite" />
              </line>
              <line x1="-5" y1="60" x2="-20" y2="60" stroke="#999" strokeWidth="1.5" strokeDasharray="3 3">
                <animate attributeName="x1" values="-5;-12" dur="0.15s" repeatCount="indefinite" />
                <animate attributeName="x2" values="-20;-35" dur="0.15s" repeatCount="indefinite" />
              </line>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

function MeemOnRocket({ startX, startY, onComplete }: Omit<MeemInteractionProps, 'type'>) {
  const [pos, setPos] = useState<AnimPos>({ x: startX, y: startY, rotation: 0, scale: 1 });
  const [phase, setPhase] = useState<'rumble' | 'launch' | 'gone'>('rumble');
  const animRef = useRef(0);
  const startRef = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setPhase('launch');
      playRocketLaunch();
    }, 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase === 'rumble') return;
    if (phase === 'gone') {
      onComplete();
      return;
    }

    startRef.current = performance.now();
    const dur = 2000;

    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / dur, 1);
      const eased = t * t * t;

      const targetY = -300;
      const targetX = startX + (Math.random() > 0.5 ? 100 : -100) * eased;

      setPos({
        x: startX + (targetX - startX) * eased,
        y: startY + (targetY - startY) * eased,
        rotation: -5 + Math.sin(elapsed * 0.02) * 5,
        scale: 1 + eased * 0.3,
      });

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setPhase('gone');
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, startX, startY, onComplete]);

  const shakeX = phase === 'rumble' ? Math.sin(Date.now() * 0.05) * 3 : 0;

  return (
    <div
      className="meem-interaction-wrapper"
      style={{
        transform: `translate(${pos.x + shakeX}px, ${pos.y}px) rotate(${pos.rotation}deg) scale(${pos.scale})`,
      }}
    >
      <div style={{ position: 'relative' }}>
        {phase === 'rumble' && (
          <div style={{
            position: 'absolute',
            top: -25,
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'Patrick Hand', cursive",
            fontSize: '0.7rem',
            color: '#e04040',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
          }}>
            3... 2... 1...
          </div>
        )}
        {phase === 'launch' && (
          <div style={{
            position: 'absolute',
            top: -25,
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'Patrick Hand', cursive",
            fontSize: '0.85rem',
            color: '#e04040',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
          }}>
            TO THE MOON!!
          </div>
        )}

        <svg viewBox="0 0 80 140" width={60} height={105} style={{ overflow: 'visible' }}>
          <g>
            <path d="M 40,5 C 30,25 26,45 26,75 L 54,75 C 54,45 50,25 40,5 Z" fill="#eee" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 26,60 C 18,72 16,80 20,83 L 26,72 Z" fill="#e04040" stroke="#333" strokeWidth="2" />
            <path d="M 54,60 C 62,72 64,80 60,83 L 54,72 Z" fill="#e04040" stroke="#333" strokeWidth="2" />
            <circle cx="40" cy="42" r="8" fill="#88bbee" stroke="#333" strokeWidth="2" />

            <g transform="translate(28, 18) scale(0.18)">
              <path
                d="M 65,120 C 60,70 80,38 130,35 C 180,32 205,65 208,115 C 212,165 190,195 130,198 C 70,200 62,170 65,120 Z"
                fill="#f5d8a8" stroke="#333" strokeWidth="5"
              />
              <path
                d="M 55,95 C 58,45 90,18 135,15 C 178,13 210,35 212,80 L 210,95 L 70,98 C 62,100 56,98 55,95 Z"
                fill="#4488cc" stroke="#333" strokeWidth="5"
              />
              <ellipse cx="100" cy="118" rx="22" ry="24" fill="white" stroke="#333" strokeWidth="5" />
              <ellipse cx="168" cy="115" rx="24" ry="26" fill="white" stroke="#333" strokeWidth="5" />
              <circle cx="105" cy="115" r="9" fill="#333" />
              <circle cx="175" cy="112" r="10" fill="#333" />
              <circle cx="102" cy="112" r="3.5" fill="white" />
              <circle cx="172" cy="109" r="4" fill="white" />
              <path d="M 95,155 C 105,170 130,175 145,170 C 155,165 165,155 162,148 C 150,158 108,158 95,155 Z" fill="#222" stroke="#333" strokeWidth="3" />
            </g>

            {phase === 'launch' && (
              <g>
                <path d="M 32,75 C 35,90 37,105 40,115 C 43,105 45,90 48,75" fill="#f08030" stroke="#e06020" strokeWidth="1.5">
                  <animate attributeName="d" values="M 32,75 C 35,90 37,105 40,115 C 43,105 45,90 48,75;M 30,75 C 34,95 38,110 40,125 C 42,110 46,95 50,75;M 32,75 C 35,90 37,105 40,115 C 43,105 45,90 48,75" dur="0.2s" repeatCount="indefinite" />
                </path>
                <path d="M 35,75 C 37,88 39,98 40,105 C 41,98 43,88 45,75" fill="#f0d040" stroke="none">
                  <animate attributeName="d" values="M 35,75 C 37,88 39,98 40,105 C 41,98 43,88 45,75;M 34,75 C 36,92 39,103 40,112 C 41,103 44,92 46,75;M 35,75 C 37,88 39,98 40,105 C 41,98 43,88 45,75" dur="0.15s" repeatCount="indefinite" />
                </path>
              </g>
            )}

            {phase === 'rumble' && (
              <g opacity="0.4">
                <path d="M 32,78 C 35,88 37,95 40,100 C 43,95 45,88 48,78" fill="#f08030" stroke="none">
                  <animate attributeName="opacity" values="0.3;0.6;0.3" dur="0.3s" repeatCount="indefinite" />
                </path>
              </g>
            )}
          </g>
        </svg>
      </div>
    </div>
  );
}

function DogChasesMeem({ startX, startY, onComplete }: Omit<MeemInteractionProps, 'type'>) {
  const [meemPos, setMeemPos] = useState({ x: startX, y: startY });
  const [dogPos, setDogPos] = useState({ x: startX - 60, y: startY + 10 });
  const [facingRight, setFacingRight] = useState(true);
  const animRef = useRef(0);
  const startRef = useRef(0);
  const waypointsRef = useRef<{ x: number; y: number }[]>([]);
  const barkRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pts = [];
    for (let i = 0; i < 4; i++) {
      pts.push({
        x: 30 + Math.random() * (vw - 100),
        y: 30 + Math.random() * (vh - 100),
      });
    }
    const exitPt = randomEdgePoint();
    pts.push(exitPt);
    waypointsRef.current = pts;
    playDogBark();
    barkRef.current = setInterval(() => playDogBark(), 1200);
    return () => clearInterval(barkRef.current);
  }, []);

  useEffect(() => {
    if (waypointsRef.current.length === 0) return;

    startRef.current = performance.now();
    const totalDur = 4000;
    const allPts = [{ x: startX, y: startY }, ...waypointsRef.current];

    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / totalDur, 1);

      const segCount = allPts.length - 1;
      const segPos = t * segCount;
      const segIdx = Math.min(Math.floor(segPos), segCount - 1);
      const segT = segPos - segIdx;

      const from = allPts[segIdx];
      const to = allPts[segIdx + 1];
      const mx = from.x + (to.x - from.x) * segT;
      const my = from.y + (to.y - from.y) * segT;

      setFacingRight(to.x > from.x);

      const dogDelay = 0.08;
      const dt = Math.max(0, t - dogDelay);
      const dSegPos = dt * segCount;
      const dSegIdx = Math.min(Math.floor(dSegPos), segCount - 1);
      const dSegT = dSegPos - dSegIdx;
      const dFrom = allPts[dSegIdx];
      const dTo = allPts[dSegIdx + 1];
      const dx = dFrom.x + (dTo.x - dFrom.x) * dSegT;
      const dy = dFrom.y + (dTo.y - dFrom.y) * dSegT;

      const bounce = -Math.abs(Math.sin(t * Math.PI * 10)) * 10;

      setMeemPos({ x: mx, y: my + bounce });
      setDogPos({ x: dx, y: dy });

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        clearInterval(barkRef.current);
        onComplete();
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [startX, startY, onComplete]);

  return (
    <>
      <div
        className="meem-interaction-wrapper"
        style={{ transform: `translate(${meemPos.x}px, ${meemPos.y}px)` }}
      >
        <div style={{
          position: 'absolute',
          top: -25,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Patrick Hand', cursive",
          fontSize: '0.7rem',
          color: '#e06080',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
        }}>
          AHHH!!
        </div>
        <div
          className="floating-meem-body roaming-running"
          style={{ transform: `scaleX(${facingRight ? 1 : -1})` }}
        >
          <svg viewBox="0 0 260 400" width={MEEM_W} height={MEEM_H} style={{ overflow: 'visible' }}>
            <g>
              <g className="float-bob-group">
                <g style={{ transformOrigin: '130px 140px' }}>
                  <path d="M 65,120 C 60,70 80,38 130,35 C 180,32 205,65 208,115 C 212,165 190,195 130,198 C 70,200 62,170 65,120 Z" fill="#f5d8a8" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 55,95 C 58,45 90,18 135,15 C 178,13 210,35 212,80 L 210,95 C 208,98 200,100 195,98 L 70,98 C 62,100 56,98 55,95 Z" fill="#4488cc" stroke="#333" strokeWidth="3" />
                  <path d="M 55,93 L 25,100 C 20,102 18,108 23,110 L 55,103" fill="#4488cc" stroke="#333" strokeWidth="3" />
                  <path d="M 65,92 C 62,90 56,92 55,95 L 53,100 C 52,108 58,110 62,106 Z" fill="#333" stroke="#333" strokeWidth="1" />
                  <ellipse cx="58" cy="130" rx="8" ry="12" fill="#f5d8a8" stroke="#333" strokeWidth="2.5" />
                  <ellipse cx="212" cy="127" rx="8" ry="12" fill="#f5d8a8" stroke="#333" strokeWidth="2.5" />
                  <ellipse cx="100" cy="118" rx="22" ry="24" fill="white" stroke="#333" strokeWidth="3" />
                  <ellipse cx="168" cy="115" rx="24" ry="26" fill="white" stroke="#333" strokeWidth="3" />
                  <circle cx="95" cy="115" r="9" fill="#333" />
                  <circle cx="180" cy="112" r="10" fill="#333" />
                  <circle cx="92" cy="112" r="3.5" fill="white" />
                  <circle cx="177" cy="109" r="4" fill="white" />
                  <path d="M 100,160 C 115,150 145,150 160,160 C 150,148 110,148 100,160 Z" fill="#222" stroke="#333" strokeWidth="2.5" />
                </g>

                <path d="M 100,195 C 105,210 95,215 85,220 L 80,265 C 82,268 90,270 130,270 C 170,270 178,268 180,265 L 175,220 C 165,215 155,210 160,195" fill="white" stroke="#333" strokeWidth="3" />
                <path d="M 85,265 L 88,300 C 90,303 100,305 130,305 C 160,305 170,303 172,300 L 175,265" fill="#4488cc" stroke="#333" strokeWidth="3" />
                <g className="float-arm-left" style={{ transformOrigin: '85px 220px' }}>
                  <path d="M 85,220 C 70,235 50,248 38,255" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                  <ellipse cx="35" cy="258" rx="8" ry="6" fill="#f5d8a8" stroke="#333" strokeWidth="2" transform="rotate(-15 35 258)" />
                </g>
                <g className="float-arm-right" style={{ transformOrigin: '175px 220px' }}>
                  <path d="M 175,220 C 190,232 205,240 215,243" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                  <ellipse cx="218" cy="246" rx="8" ry="6" fill="#f5d8a8" stroke="#333" strokeWidth="2" transform="rotate(15 218 246)" />
                </g>
              </g>
              <g className="run-leg-left" style={{ transformOrigin: '108px 305px' }}>
                <path d="M 108,305 L 100,360 L 95,365" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                <path d="M 80,362 C 82,358 92,355 100,360 L 95,368 C 88,370 80,368 80,362 Z" fill="#555" stroke="#333" strokeWidth="2.5" />
              </g>
              <g className="run-leg-right" style={{ transformOrigin: '152px 305px' }}>
                <path d="M 152,305 L 160,360 L 165,365" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                <path d="M 180,362 C 178,358 168,355 160,360 L 165,368 C 172,370 180,368 180,362 Z" fill="#555" stroke="#333" strokeWidth="2.5" />
              </g>
            </g>
          </svg>
        </div>
      </div>

      <div
        className="meem-interaction-wrapper"
        style={{ transform: `translate(${dogPos.x}px, ${dogPos.y}px) scaleX(${facingRight ? 1 : -1})` }}
      >
        <svg viewBox="0 0 60 50" width={50} height={42} style={{ overflow: 'visible' }}>
          <ellipse cx="30" cy="30" rx="18" ry="12" fill="#e8c888" stroke="#333" strokeWidth="2.5" />
          <ellipse cx="50" cy="25" rx="10" ry="8" fill="#e8c888" stroke="#333" strokeWidth="2.5" />
          <circle cx="52" cy="23" r="2.5" fill="#333" />
          <circle cx="51" cy="22" r="1" fill="white" />
          <ellipse cx="55" cy="26" rx="4" ry="3" fill="#d4a060" stroke="#333" strokeWidth="1.5" />
          <path d="M 45,18 C 42,10 46,8 50,14" fill="#e8c888" stroke="#333" strokeWidth="2" />
          <path d="M 52,17 C 55,10 60,10 58,18" fill="#e8c888" stroke="#333" strokeWidth="2" />
          <g style={{ transformOrigin: '14px 35px' }}>
            <line x1="14" y1="35" x2="14" y2="48" stroke="#333" strokeWidth="2.5" strokeLinecap="round">
              <animate attributeName="y2" values="48;42;48" dur="0.15s" repeatCount="indefinite" />
            </line>
          </g>
          <g style={{ transformOrigin: '22px 37px' }}>
            <line x1="22" y1="37" x2="22" y2="48" stroke="#333" strokeWidth="2.5" strokeLinecap="round">
              <animate attributeName="y2" values="42;48;42" dur="0.15s" repeatCount="indefinite" />
            </line>
          </g>
          <g style={{ transformOrigin: '35px 37px' }}>
            <line x1="35" y1="37" x2="35" y2="48" stroke="#333" strokeWidth="2.5" strokeLinecap="round">
              <animate attributeName="y2" values="48;42;48" dur="0.15s" repeatCount="indefinite" />
            </line>
          </g>
          <g style={{ transformOrigin: '42px 35px' }}>
            <line x1="42" y1="35" x2="42" y2="48" stroke="#333" strokeWidth="2.5" strokeLinecap="round">
              <animate attributeName="y2" values="42;48;42" dur="0.15s" repeatCount="indefinite" />
            </line>
          </g>
          <path d="M 12,32 C 5,30 2,35 6,38" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round">
            <animate attributeName="d" values="M 12,32 C 5,30 2,35 6,38;M 12,32 C 5,28 2,32 6,36;M 12,32 C 5,30 2,35 6,38" dur="0.2s" repeatCount="indefinite" />
          </path>
        </svg>
        <div style={{
          position: 'absolute',
          top: -18,
          left: '50%',
          transform: `translateX(-50%) scaleX(${facingRight ? 1 : -1})`,
          fontFamily: "'Patrick Hand', cursive",
          fontSize: '0.65rem',
          color: '#c08040',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
        }}>
          WOOF! WOOF!
        </div>
      </div>
    </>
  );
}

function DiamondHands({ startX, startY, onComplete }: Omit<MeemInteractionProps, 'type'>) {
  const [phase, setPhase] = useState<'grab' | 'show' | 'exit'>('grab');
  const [pos, setPos] = useState({ x: startX, y: startY });
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);
  const animRef = useRef(0);
  const startRef = useRef(0);
  const posRef = useRef({ x: startX, y: startY });

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase('show');
      playDiamondSparkle();
      const sp = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 80,
        y: (Math.random() - 0.5) * 60,
        delay: Math.random() * 0.5,
      }));
      setSparkles(sp);
    }, 500);
    const t2 = setTimeout(() => setPhase('exit'), 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (phase !== 'exit') return;

    startRef.current = performance.now();
    const exitPt = randomEdgePoint();
    const dur = 1500;
    const fromX = posRef.current.x;
    const fromY = posRef.current.y;

    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / dur, 1);
      const eased = t * t;

      const nx = fromX + (exitPt.x - fromX) * eased;
      const ny = fromY + (exitPt.y - fromY) * eased;
      posRef.current = { x: nx, y: ny };
      setPos({ x: nx, y: ny });

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, onComplete]);

  const bounce = phase === 'show' ? -Math.abs(Math.sin(Date.now() * 0.003)) * 6 : 0;

  return (
    <div
      className="meem-interaction-wrapper"
      style={{
        transform: `translate(${pos.x}px, ${pos.y + bounce}px)`,
      }}
    >
      <div style={{ position: 'relative' }}>
        {phase === 'show' && (
          <div style={{
            position: 'absolute',
            top: -30,
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'Patrick Hand', cursive",
            fontSize: '0.85rem',
            color: '#2090cc',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            textShadow: '1px 1px 0 rgba(255,255,255,0.8)',
            animation: 'countdownPop 0.4s ease-out forwards',
          }}>
            DIAMOND HANDS!!
          </div>
        )}

        {phase === 'show' && sparkles.map(sp => (
          <div
            key={sp.id}
            style={{
              position: 'absolute',
              left: `calc(50% + ${sp.x}px)`,
              top: `calc(50% + ${sp.y}px)`,
              width: 6,
              height: 6,
              background: '#88ddff',
              borderRadius: '50%',
              boxShadow: '0 0 6px 2px rgba(136,221,255,0.6)',
              animation: `diamondSparkle 0.8s ease-in-out ${sp.delay}s infinite`,
            }}
          />
        ))}

        <div className={`floating-meem-body ${phase === 'exit' ? 'roaming-running' : ''}`}>
          <svg viewBox="0 0 260 400" width={MEEM_W} height={MEEM_H} style={{ overflow: 'visible' }}>
            <g>
              <g className="float-bob-group">
                <g style={{ transformOrigin: '130px 140px' }}>
                  <path d="M 65,120 C 60,70 80,38 130,35 C 180,32 205,65 208,115 C 212,165 190,195 130,198 C 70,200 62,170 65,120 Z" fill="#f5d8a8" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 55,95 C 58,45 90,18 135,15 C 178,13 210,35 212,80 L 210,95 C 208,98 200,100 195,98 L 70,98 C 62,100 56,98 55,95 Z" fill="#4488cc" stroke="#333" strokeWidth="3" />
                  <path d="M 55,93 L 25,100 C 20,102 18,108 23,110 L 55,103" fill="#4488cc" stroke="#333" strokeWidth="3" />
                  <path d="M 65,92 C 62,90 56,92 55,95 L 53,100 C 52,108 58,110 62,106 Z" fill="#333" stroke="#333" strokeWidth="1" />
                  <ellipse cx="58" cy="130" rx="8" ry="12" fill="#f5d8a8" stroke="#333" strokeWidth="2.5" />
                  <ellipse cx="212" cy="127" rx="8" ry="12" fill="#f5d8a8" stroke="#333" strokeWidth="2.5" />
                  <ellipse cx="100" cy="118" rx="22" ry="24" fill="white" stroke="#333" strokeWidth="3" />
                  <ellipse cx="168" cy="115" rx="24" ry="26" fill="white" stroke="#333" strokeWidth="3" />
                  <circle cx="105" cy="120" r="8" fill="#333" />
                  <circle cx="173" cy="117" r="9" fill="#333" />
                  <circle cx="102" cy="117" r="3" fill="white" />
                  <circle cx="170" cy="114" r="3.5" fill="white" />
                  <path d="M 85,152 C 90,185 125,198 140,192 C 160,185 178,172 175,148 C 170,140 150,138 130,142 C 110,145 90,142 85,152 Z" fill="#222" stroke="#333" strokeWidth="2.5" />
                  <path d="M 105,178 C 112,198 128,202 142,198 C 155,192 162,180 158,170 C 145,182 115,184 105,178 Z" fill="#e06080" stroke="#cc4060" strokeWidth="1.5" />
                </g>

                <path d="M 100,195 C 105,210 95,215 85,220 L 80,265 C 82,268 90,270 130,270 C 170,270 178,268 180,265 L 175,220 C 165,215 155,210 160,195" fill="white" stroke="#333" strokeWidth="3" />
                <path d="M 85,265 L 88,300 C 90,303 100,305 130,305 C 160,305 170,303 172,300 L 175,265" fill="#4488cc" stroke="#333" strokeWidth="3" />

                <g className="float-arm-left" style={{
                  transformOrigin: '85px 220px',
                  transform: phase === 'show' ? 'rotate(-60deg)' : undefined,
                  transition: 'transform 0.3s ease',
                }}>
                  <path d="M 85,220 C 70,235 50,248 38,255" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                  <g transform="translate(20, 245)">
                    <polygon points="15,0 28,10 15,32 2,10" fill="#88ddff" stroke="#333" strokeWidth="2" strokeLinejoin="round" />
                    <line x1="2" y1="10" x2="28" y2="10" stroke="#333" strokeWidth="1.5" />
                    <line x1="15" y1="0" x2="9" y2="10" stroke="#333" strokeWidth="1" />
                    <line x1="15" y1="0" x2="21" y2="10" stroke="#333" strokeWidth="1" />
                    <line x1="9" y1="10" x2="15" y2="32" stroke="#333" strokeWidth="1" />
                    <line x1="21" y1="10" x2="15" y2="32" stroke="#333" strokeWidth="1" />
                  </g>
                </g>

                <g className="float-arm-right" style={{
                  transformOrigin: '175px 220px',
                  transform: phase === 'show' ? 'rotate(60deg)' : undefined,
                  transition: 'transform 0.3s ease',
                }}>
                  <path d="M 175,220 C 190,232 205,240 215,243" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                  <g transform="translate(203, 232)">
                    <polygon points="15,0 28,10 15,32 2,10" fill="#88ddff" stroke="#333" strokeWidth="2" strokeLinejoin="round" />
                    <line x1="2" y1="10" x2="28" y2="10" stroke="#333" strokeWidth="1.5" />
                    <line x1="15" y1="0" x2="9" y2="10" stroke="#333" strokeWidth="1" />
                    <line x1="15" y1="0" x2="21" y2="10" stroke="#333" strokeWidth="1" />
                    <line x1="9" y1="10" x2="15" y2="32" stroke="#333" strokeWidth="1" />
                    <line x1="21" y1="10" x2="15" y2="32" stroke="#333" strokeWidth="1" />
                  </g>
                </g>
              </g>

              {phase === 'exit' ? (
                <>
                  <g className="run-leg-left" style={{ transformOrigin: '108px 305px' }}>
                    <path d="M 108,305 L 100,360 L 95,365" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 80,362 C 82,358 92,355 100,360 L 95,368 C 88,370 80,368 80,362 Z" fill="#555" stroke="#333" strokeWidth="2.5" />
                  </g>
                  <g className="run-leg-right" style={{ transformOrigin: '152px 305px' }}>
                    <path d="M 152,305 L 160,360 L 165,365" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 180,362 C 178,358 168,355 160,360 L 165,368 C 172,370 180,368 180,362 Z" fill="#555" stroke="#333" strokeWidth="2.5" />
                  </g>
                </>
              ) : (
                <>
                  <g style={{ transformOrigin: '108px 305px' }}>
                    <path d="M 108,305 L 100,360 L 95,365" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 80,362 C 82,358 92,355 100,360 L 95,368 C 88,370 80,368 80,362 Z" fill="#555" stroke="#333" strokeWidth="2.5" />
                  </g>
                  <g style={{ transformOrigin: '152px 305px' }}>
                    <path d="M 152,305 L 160,360 L 165,365" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 180,362 C 178,358 168,355 160,360 L 165,368 C 172,370 180,368 180,362 Z" fill="#555" stroke="#333" strokeWidth="2.5" />
                  </g>
                </>
              )}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function MeemInteraction({ type, startX, startY, onComplete }: MeemInteractionProps) {
  const stableComplete = useCallback(onComplete, [onComplete]);

  switch (type) {
    case 'car':
      return <MeemInCar startX={startX} startY={startY} onComplete={stableComplete} />;
    case 'rocket':
      return <MeemOnRocket startX={startX} startY={startY} onComplete={stableComplete} />;
    case 'dog':
      return <DogChasesMeem startX={startX} startY={startY} onComplete={stableComplete} />;
    case 'diamond':
    case 'chain':
      return <DiamondHands startX={startX} startY={startY} onComplete={stableComplete} />;
    case 'beer':
      return <MeemDrinksBeer startX={startX} startY={startY} onComplete={stableComplete} />;
    case 'cigar':
      return <MeemSmokes startX={startX} startY={startY} onComplete={stableComplete} variant="cigar" />;
    case 'joint':
      return <MeemSmokes startX={startX} startY={startY} onComplete={stableComplete} variant="joint" />;
    case 'gun':
    case 'ak':
      return <MeemShoots startX={startX} startY={startY} onComplete={stableComplete} />;
    case 'glasses':
    case 'thug':
    case 'thugset':
      return <MeemWearsGlasses startX={startX} startY={startY} onComplete={stableComplete} />;
    case 'lambo':
      return <MeemDrivesCarWithImage startX={startX} startY={startY} onComplete={stableComplete} carType="lambo" />;
    case 'chopper':
      return <MeemDrivesCarWithImage startX={startX} startY={startY} onComplete={stableComplete} carType="chopper" />;
    case 'ferrari':
      return <MeemDrivesCarWithImage startX={startX} startY={startY} onComplete={stableComplete} carType="ferrari" />;
    default:
      return null;
  }
}
