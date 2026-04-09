import { useEffect, useState, useRef, useCallback } from 'react';
import { playGulp, playSmoke, playGunshot, playCoolShades, playCarVroom } from '../utils/audio';
import ferrariImg from '../assets/items-assets/ferrari.png';
import chopperImg from '../assets/items-assets/chopper.png';
import lamboImg from '../assets/items-assets/lambo.png';

const MEEM_W = 65;
const MEEM_H = 100;

interface InteractionProps {
  startX: number;
  startY: number;
  onComplete: () => void;
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

function MeemHead({ expression }: { expression: 'happy' | 'chill' | 'tough' | 'drunk' }) {
  const mouthPath = {
    happy: "M 85,152 C 90,185 125,198 140,192 C 160,185 178,172 175,148 C 170,140 150,138 130,142 C 110,145 90,142 85,152 Z",
    chill: "M 95,155 C 100,170 120,178 135,175 C 150,172 165,165 168,152 C 155,148 110,148 95,155 Z",
    tough: "M 100,160 C 115,150 145,150 160,160 C 150,148 110,148 100,160 Z",
    drunk: "M 90,158 C 100,180 130,188 150,178 C 162,170 170,155 165,148 C 148,158 108,160 90,158 Z",
  };

  const eyeStyle = expression === 'chill' || expression === 'drunk';

  return (
    <g style={{ transformOrigin: '130px 140px' }}>
      <path d="M 65,120 C 60,70 80,38 130,35 C 180,32 205,65 208,115 C 212,165 190,195 130,198 C 70,200 62,170 65,120 Z" fill="#f5d8a8" stroke="#333" strokeWidth="3" strokeLinecap="round" />
      <path d="M 55,95 C 58,45 90,18 135,15 C 178,13 210,35 212,80 L 210,95 C 208,98 200,100 195,98 L 70,98 C 62,100 56,98 55,95 Z" fill="#4488cc" stroke="#333" strokeWidth="3" />
      <path d="M 55,93 L 25,100 C 20,102 18,108 23,110 L 55,103" fill="#4488cc" stroke="#333" strokeWidth="3" />
      <path d="M 65,92 C 62,90 56,92 55,95 L 53,100 C 52,108 58,110 62,106 Z" fill="#333" stroke="#333" strokeWidth="1" />
      <ellipse cx="58" cy="130" rx="8" ry="12" fill="#f5d8a8" stroke="#333" strokeWidth="2.5" />
      <ellipse cx="212" cy="127" rx="8" ry="12" fill="#f5d8a8" stroke="#333" strokeWidth="2.5" />
      <ellipse cx="100" cy="118" rx="22" ry="24" fill="white" stroke="#333" strokeWidth="3" />
      <ellipse cx="168" cy="115" rx="24" ry="26" fill="white" stroke="#333" strokeWidth="3" />
      {eyeStyle ? (
        <>
          <line x1="88" y1="115" x2="112" y2="120" stroke="#333" strokeWidth="3" strokeLinecap="round" />
          <line x1="156" y1="112" x2="180" y2="117" stroke="#333" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="105" cy="120" r="8" fill="#333" />
          <circle cx="173" cy="117" r="9" fill="#333" />
          <circle cx="102" cy="117" r="3" fill="white" />
          <circle cx="170" cy="114" r="3.5" fill="white" />
        </>
      )}
      <path d={mouthPath[expression]} fill="#222" stroke="#333" strokeWidth="2.5" />
      {(expression === 'happy' || expression === 'drunk') && (
        <path d="M 105,178 C 112,198 128,202 142,198 C 155,192 162,180 158,170 C 145,182 115,184 105,178 Z" fill="#e06080" stroke="#cc4060" strokeWidth="1.5" />
      )}
    </g>
  );
}

function MeemBody({ expression, children }: { expression: 'happy' | 'chill' | 'tough' | 'drunk'; children?: React.ReactNode }) {
  return (
    <svg viewBox="0 0 260 400" width={MEEM_W} height={MEEM_H} style={{ overflow: 'visible' }}>
      <g>
        <g className="float-bob-group">
          <MeemHead expression={expression} />
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
          {children}
        </g>
        <g style={{ transformOrigin: '108px 305px' }}>
          <path d="M 108,305 L 100,360 L 95,365" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
          <path d="M 80,362 C 82,358 92,355 100,360 L 95,368 C 88,370 80,368 80,362 Z" fill="#555" stroke="#333" strokeWidth="2.5" />
        </g>
        <g style={{ transformOrigin: '152px 305px' }}>
          <path d="M 152,305 L 160,360 L 165,365" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
          <path d="M 180,362 C 178,358 168,355 160,360 L 165,368 C 172,370 180,368 180,362 Z" fill="#555" stroke="#333" strokeWidth="2.5" />
        </g>
      </g>
    </svg>
  );
}

export function MeemDrinksBeer({ startX, startY, onComplete }: InteractionProps) {
  const [phase, setPhase] = useState<'grab' | 'drink' | 'burp' | 'exit'>('grab');
  const [gulpCount, setGulpCount] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => { setPhase('drink'); playGulp(); }, 500);
    const t2 = setTimeout(() => { setGulpCount(1); playGulp(); }, 1200);
    const t3 = setTimeout(() => { setGulpCount(2); playGulp(); }, 1900);
    const t4 = setTimeout(() => setPhase('burp'), 2800);
    const t5 = setTimeout(() => setPhase('exit'), 4200);
    const t6 = setTimeout(() => onComplete(), 5200);
    return () => { [t1, t2, t3, t4, t5, t6].forEach(clearTimeout); };
  }, [onComplete]);

  const wobble = phase === 'burp' ? Math.sin(Date.now() * 0.01) * 3 : 0;
  const isDrinking = phase === 'drink';

  return (
    <div className="meem-interaction-wrapper" style={{ transform: `translate(${startX + wobble}px, ${startY}px)` }}>
      <div style={{ position: 'relative' }}>
        {phase === 'drink' && (
          <div style={{ position: 'absolute', top: -28, left: '50%', transform: 'translateX(-50%)', fontFamily: "'Patrick Hand', cursive", fontSize: '0.75rem', color: '#e8a020', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            *GULP GULP*
          </div>
        )}
        {phase === 'burp' && (
          <div style={{ position: 'absolute', top: -28, left: '50%', transform: 'translateX(-50%)', fontFamily: "'Patrick Hand', cursive", fontSize: '0.85rem', color: '#60a040', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            BUUURP!!
          </div>
        )}
        <div className="floating-meem-body">
          <svg viewBox="0 0 260 400" width={MEEM_W} height={MEEM_H} style={{ overflow: 'visible' }}>
            <g>
              <g className="float-bob-group">
                <MeemHead expression={phase === 'burp' ? 'drunk' : 'happy'} />
                {isDrinking && (
                  <g transform="translate(155, 120) rotate(30)">
                    <rect x="0" y="0" width="22" height="35" rx="3" fill="#d4a030" stroke="#333" strokeWidth="2" />
                    <rect x="-2" y="-3" width="26" height="7" rx="2" fill="#eee" stroke="#333" strokeWidth="1.5" />
                    <rect x="2" y={4 + gulpCount * 10} width="18" height={28 - gulpCount * 10} rx="1.5" fill="#e8a030" opacity="0.6" />
                    <ellipse cx="11" cy="-1" rx="10" ry="4" fill="white" opacity="0.6" />
                  </g>
                )}
                <path d="M 100,195 C 105,210 95,215 85,220 L 80,265 C 82,268 90,270 130,270 C 170,270 178,268 180,265 L 175,220 C 165,215 155,210 160,195" fill="white" stroke="#333" strokeWidth="3" />
                <path d="M 85,265 L 88,300 C 90,303 100,305 130,305 C 160,305 170,303 172,300 L 175,265" fill="#4488cc" stroke="#333" strokeWidth="3" />
                <g className="float-arm-left" style={{ transformOrigin: '85px 220px' }}>
                  <path d="M 85,220 C 70,235 50,248 38,255" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                  <ellipse cx="35" cy="258" rx="8" ry="6" fill="#f5d8a8" stroke="#333" strokeWidth="2" transform="rotate(-15 35 258)" />
                </g>
                <g className="float-arm-right" style={{
                  transformOrigin: '175px 220px',
                  transform: isDrinking ? 'rotate(-55deg)' : undefined,
                  transition: 'transform 0.3s ease',
                }}>
                  <path d="M 175,220 C 190,232 205,240 215,243" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                  <ellipse cx="218" cy="246" rx="8" ry="6" fill="#f5d8a8" stroke="#333" strokeWidth="2" transform="rotate(15 218 246)" />
                </g>
              </g>
              <g style={{ transformOrigin: '108px 305px' }}>
                <path d="M 108,305 L 100,360 L 95,365" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                <path d="M 80,362 C 82,358 92,355 100,360 L 95,368 C 88,370 80,368 80,362 Z" fill="#555" stroke="#333" strokeWidth="2.5" />
              </g>
              <g style={{ transformOrigin: '152px 305px' }}>
                <path d="M 152,305 L 160,360 L 165,365" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                <path d="M 180,362 C 178,358 168,355 160,360 L 165,368 C 172,370 180,368 180,362 Z" fill="#555" stroke="#333" strokeWidth="2.5" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

export function MeemSmokes({ startX, startY, onComplete, variant }: InteractionProps & { variant: 'cigar' | 'joint' }) {
  const [phase, setPhase] = useState<'light' | 'puff' | 'exhale' | 'exit'>('light');
  const [smokePuffs, setSmokePuffs] = useState<{ id: number; x: number; y: number }[]>([]);
  const puffIdRef = useRef(0);

  useEffect(() => {
    const t1 = setTimeout(() => { setPhase('puff'); playSmoke(); }, 600);
    const t2 = setTimeout(() => setPhase('exhale'), 2000);
    const t3 = setTimeout(() => setPhase('exit'), 4500);
    const t4 = setTimeout(() => onComplete(), 5500);
    return () => { [t1, t2, t3, t4].forEach(clearTimeout); };
  }, [onComplete]);

  useEffect(() => {
    if (phase !== 'puff' && phase !== 'exhale') return;
    const tipX = variant === 'cigar' ? 195 : 188;
    const tipY = 148;
    const interval = setInterval(() => {
      const id = puffIdRef.current++;
      setSmokePuffs(prev => [...prev.slice(-8), {
        id,
        x: tipX + (Math.random() - 0.5) * 10,
        y: tipY - Math.random() * 8,
      }]);
      setTimeout(() => {
        setSmokePuffs(prev => prev.filter(p => p.id !== id));
      }, 1800);
    }, 200);
    return () => clearInterval(interval);
  }, [phase, variant]);

  const label = variant === 'joint' ? 'joint' : 'cigar';
  const color = variant === 'joint' ? '#60a040' : '#8b6914';

  return (
    <div className="meem-interaction-wrapper" style={{ transform: `translate(${startX}px, ${startY}px)` }}>
      <div style={{ position: 'relative' }}>
        {phase === 'light' && (
          <div style={{ position: 'absolute', top: -28, left: '50%', transform: 'translateX(-50%)', fontFamily: "'Patrick Hand', cursive", fontSize: '0.7rem', color, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            *lights {label}*
          </div>
        )}
        {phase === 'puff' && (
          <div style={{ position: 'absolute', top: -28, left: '50%', transform: 'translateX(-50%)', fontFamily: "'Patrick Hand', cursive", fontSize: '0.75rem', color, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            *PUFF PUFF*
          </div>
        )}
        {phase === 'exhale' && (
          <div style={{ position: 'absolute', top: -28, left: '50%', transform: 'translateX(-50%)', fontFamily: "'Patrick Hand', cursive", fontSize: '0.85rem', color, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            ahhh yeaaa...
          </div>
        )}

        {smokePuffs.map(puff => (
          <div
            key={puff.id}
            style={{
              position: 'absolute',
              left: puff.x / 260 * MEEM_W,
              top: puff.y / 400 * MEEM_H - 10,
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'rgba(180,180,180,0.7)',
              animation: 'smokeTipRise 1.8s ease-out forwards',
              pointerEvents: 'none',
            }}
          />
        ))}

        <style>{`
          @keyframes smokeTipRise {
            0% { transform: scale(0.4) translateY(0) translateX(0); opacity: 0.8; }
            30% { transform: scale(1.0) translateY(-12px) translateX(5px); opacity: 0.5; }
            60% { transform: scale(1.8) translateY(-28px) translateX(10px); opacity: 0.3; }
            100% { transform: scale(3.0) translateY(-50px) translateX(15px); opacity: 0; }
          }
        `}</style>

        <div className="floating-meem-body">
          <svg viewBox="0 0 260 400" width={MEEM_W} height={MEEM_H} style={{ overflow: 'visible' }}>
            <g>
              <g className="float-bob-group">
                <MeemHead expression="chill" />
                <g transform="translate(152, 155) rotate(-12)">
                  <rect x="0" y="-3" width={variant === 'cigar' ? 42 : 34} height="6" rx="2.5" fill={variant === 'joint' ? '#e8e0c8' : '#8b6914'} stroke="#333" strokeWidth="1.5" />
                  {variant === 'cigar' && (
                    <rect x="-1" y="-4.5" width="8" height="9" rx="1.5" fill="#bbb" stroke="#333" strokeWidth="1" />
                  )}
                  {variant === 'joint' && (
                    <rect x="-1" y="-3.5" width="5" height="7" rx="1" fill="#fff" stroke="#ccc" strokeWidth="0.8" opacity="0.7" />
                  )}
                  <circle cx={variant === 'cigar' ? 42 : 34} cy="0" r="4" fill="#e04020" opacity="0.9">
                    <animate attributeName="r" values="3;5;3" dur="0.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="0.8s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={variant === 'cigar' ? 44 : 36} cy="-2" r="2" fill="#f0d040" opacity="0.6">
                    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="0.5s" repeatCount="indefinite" />
                  </circle>
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
              <g style={{ transformOrigin: '108px 305px' }}>
                <path d="M 108,305 L 100,360 L 95,365" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                <path d="M 80,362 C 82,358 92,355 100,360 L 95,368 C 88,370 80,368 80,362 Z" fill="#555" stroke="#333" strokeWidth="2.5" />
              </g>
              <g style={{ transformOrigin: '152px 305px' }}>
                <path d="M 152,305 L 160,360 L 165,365" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                <path d="M 180,362 C 178,358 168,355 160,360 L 165,368 C 172,370 180,368 180,362 Z" fill="#555" stroke="#333" strokeWidth="2.5" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

export function MeemShoots({ startX, startY, onComplete }: InteractionProps) {
  const [phase, setPhase] = useState<'aim' | 'fire' | 'blowoff' | 'exit'>('aim');
  const [shots, setShots] = useState(0);
  const [muzzleFlash, setMuzzleFlash] = useState(false);
  const [bullets, setBullets] = useState<{ id: number; x: number; y: number }[]>([]);
  const bulletIdRef = useRef(0);

  useEffect(() => {
    const t1 = setTimeout(() => { setPhase('fire'); }, 600);
    const fireShot = (delay: number, shotNum: number) => {
      return setTimeout(() => {
        playGunshot();
        setShots(shotNum);
        setMuzzleFlash(true);
        setTimeout(() => setMuzzleFlash(false), 80);
        const id = bulletIdRef.current++;
        setBullets(prev => [...prev, { id, x: 0, y: 0 }]);
        setTimeout(() => setBullets(prev => prev.filter(b => b.id !== id)), 800);
      }, delay);
    };
    const s1 = fireShot(800, 1);
    const s2 = fireShot(1400, 2);
    const s3 = fireShot(2000, 3);
    const t2 = setTimeout(() => setPhase('blowoff'), 2800);
    const t3 = setTimeout(() => setPhase('exit'), 4000);
    const t4 = setTimeout(() => onComplete(), 5000);
    return () => { [t1, s1, s2, s3, t2, t3, t4].forEach(clearTimeout); };
  }, [onComplete]);

  const recoil = phase === 'fire' && muzzleFlash ? -4 : 0;

  return (
    <div className="meem-interaction-wrapper" style={{ transform: `translate(${startX + recoil}px, ${startY}px)` }}>
      <div style={{ position: 'relative' }}>
        {phase === 'aim' && (
          <div style={{ position: 'absolute', top: -28, left: '50%', transform: 'translateX(-50%)', fontFamily: "'Patrick Hand', cursive", fontSize: '0.7rem', color: '#e04040', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            *takes aim*
          </div>
        )}
        {phase === 'fire' && (
          <div style={{ position: 'absolute', top: -28, left: '50%', transform: 'translateX(-50%)', fontFamily: "'Patrick Hand', cursive", fontSize: '0.85rem', color: '#e04040', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            BANG BANG!! ({shots}/3)
          </div>
        )}
        {phase === 'blowoff' && (
          <div style={{ position: 'absolute', top: -28, left: '50%', transform: 'translateX(-50%)', fontFamily: "'Patrick Hand', cursive", fontSize: '0.75rem', color: '#666', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            *blows smoke off barrel*
          </div>
        )}

        {bullets.map(b => (
          <div
            key={b.id}
            style={{
              position: 'absolute',
              top: 10,
              right: -10,
              width: 8,
              height: 4,
              borderRadius: 2,
              background: '#e8a020',
              border: '1px solid #c08010',
              animation: 'bulletFly 0.8s linear forwards',
              pointerEvents: 'none',
            }}
          />
        ))}

        <style>{`
          @keyframes bulletFly {
            0% { transform: translateX(0); opacity: 1; }
            100% { transform: translateX(250px); opacity: 0; }
          }
        `}</style>

        <div className="floating-meem-body">
          <svg viewBox="0 0 260 400" width={MEEM_W} height={MEEM_H} style={{ overflow: 'visible' }}>
            <g>
              <g className="float-bob-group">
                <MeemHead expression="tough" />
                <path d="M 100,195 C 105,210 95,215 85,220 L 80,265 C 82,268 90,270 130,270 C 170,270 178,268 180,265 L 175,220 C 165,215 155,210 160,195" fill="white" stroke="#333" strokeWidth="3" />
                <path d="M 85,265 L 88,300 C 90,303 100,305 130,305 C 160,305 170,303 172,300 L 175,265" fill="#4488cc" stroke="#333" strokeWidth="3" />
                <g className="float-arm-left" style={{ transformOrigin: '85px 220px' }}>
                  <path d="M 85,220 C 70,235 50,248 38,255" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                  <ellipse cx="35" cy="258" rx="8" ry="6" fill="#f5d8a8" stroke="#333" strokeWidth="2" transform="rotate(-15 35 258)" />
                </g>
                <g className="float-arm-right" style={{
                  transformOrigin: '175px 220px',
                  transform: 'rotate(-50deg)',
                  transition: 'transform 0.3s ease',
                }}>
                  <path d="M 175,220 C 190,232 205,240 215,243" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                  <ellipse cx="218" cy="246" rx="8" ry="6" fill="#f5d8a8" stroke="#333" strokeWidth="2" transform="rotate(15 218 246)" />
                  <g transform="translate(220, 235) rotate(-20)">
                    <rect x="0" y="-4" width="25" height="8" rx="2" fill="#555" stroke="#333" strokeWidth="2" />
                    <rect x="-8" y="-6" width="10" height="12" rx="2" fill="#666" stroke="#333" strokeWidth="1.5" />
                    <rect x="0" y="2" width="8" height="6" rx="1" fill="#444" stroke="#333" strokeWidth="1" />
                    {muzzleFlash && (
                      <g transform="translate(25, 0)">
                        <circle cx="5" cy="0" r="8" fill="#f0d040" opacity="0.9" />
                        <circle cx="5" cy="0" r="4" fill="white" opacity="0.8" />
                      </g>
                    )}
                    {phase === 'blowoff' && (
                      <g transform="translate(25, -2)" opacity="0.5">
                        <ellipse cx="8" cy="0" rx="6" ry="3" fill="#ccc">
                          <animate attributeName="cx" values="8;20" dur="1s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.5;0" dur="1s" repeatCount="indefinite" />
                        </ellipse>
                      </g>
                    )}
                  </g>
                </g>
              </g>
              <g style={{ transformOrigin: '108px 305px' }}>
                <path d="M 108,305 L 100,360 L 95,365" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                <path d="M 80,362 C 82,358 92,355 100,360 L 95,368 C 88,370 80,368 80,362 Z" fill="#555" stroke="#333" strokeWidth="2.5" />
              </g>
              <g style={{ transformOrigin: '152px 305px' }}>
                <path d="M 152,305 L 160,360 L 165,365" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                <path d="M 180,362 C 178,358 168,355 160,360 L 165,368 C 172,370 180,368 180,362 Z" fill="#555" stroke="#333" strokeWidth="2.5" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

export function MeemWearsGlasses({ startX, startY, onComplete }: InteractionProps) {
  const [phase, setPhase] = useState<'puton' | 'pose' | 'exit'>('puton');

  useEffect(() => {
    const t1 = setTimeout(() => { setPhase('pose'); playCoolShades(); }, 700);
    const t2 = setTimeout(() => setPhase('exit'), 3800);
    const t3 = setTimeout(() => onComplete(), 4800);
    return () => { [t1, t2, t3].forEach(clearTimeout); };
  }, [onComplete]);

  return (
    <div className="meem-interaction-wrapper" style={{ transform: `translate(${startX}px, ${startY}px)` }}>
      <div style={{ position: 'relative' }}>
        {phase === 'puton' && (
          <div style={{ position: 'absolute', top: -28, left: '50%', transform: 'translateX(-50%)', fontFamily: "'Patrick Hand', cursive", fontSize: '0.7rem', color: '#333', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            *puts on shades*
          </div>
        )}
        {phase === 'pose' && (
          <div style={{ position: 'absolute', top: -28, left: '50%', transform: 'translateX(-50%)', fontFamily: "'Patrick Hand', cursive", fontSize: '0.85rem', color: '#333', fontWeight: 'bold', whiteSpace: 'nowrap', textShadow: '1px 1px 0 rgba(255,255,255,0.8)' }}>
            DEAL WITH IT.
          </div>
        )}

        <div className="floating-meem-body">
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

                  {phase === 'pose' && (
                    <g>
                      <rect x="75" y="105" width="50" height="28" rx="4" fill="#222" stroke="#111" strokeWidth="2" opacity="0.85" />
                      <rect x="140" y="102" width="55" height="30" rx="4" fill="#222" stroke="#111" strokeWidth="2" opacity="0.85" />
                      <line x1="125" y1="118" x2="140" y2="115" stroke="#111" strokeWidth="2.5" />
                      <line x1="75" y1="115" x2="58" y2="120" stroke="#111" strokeWidth="2" />
                      <line x1="195" y1="112" x2="212" y2="118" stroke="#111" strokeWidth="2" />
                      <line x1="82" y1="110" x2="118" y2="110" stroke="#444" strokeWidth="1" opacity="0.3" />
                      <line x1="148" y1="107" x2="188" y2="107" stroke="#444" strokeWidth="1" opacity="0.3" />
                    </g>
                  )}

                  <path d="M 95,155 C 100,170 120,178 135,175 C 150,172 165,165 168,152 C 155,148 110,148 95,155 Z" fill="#222" stroke="#333" strokeWidth="2.5" />
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
              <g style={{ transformOrigin: '108px 305px' }}>
                <path d="M 108,305 L 100,360 L 95,365" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                <path d="M 80,362 C 82,358 92,355 100,360 L 95,368 C 88,370 80,368 80,362 Z" fill="#555" stroke="#333" strokeWidth="2.5" />
              </g>
              <g style={{ transformOrigin: '152px 305px' }}>
                <path d="M 152,305 L 160,360 L 165,365" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                <path d="M 180,362 C 178,358 168,355 160,360 L 165,368 C 172,370 180,368 180,362 Z" fill="#555" stroke="#333" strokeWidth="2.5" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

const CAR_IMAGE_MAP: Record<string, string> = {
  ferrari: ferrariImg,
  chopper: chopperImg,
  lambo: lamboImg,
};

export function MeemDrivesCarWithImage({ startX, startY, onComplete, carType }: InteractionProps & { carType: 'ferrari' | 'chopper' | 'lambo' }) {
  const [pos, setPos] = useState({ x: startX, y: startY, facingRight: true });
  const [phase, setPhase] = useState<'mount' | 'drive' | 'exit'>('mount');
  const animRef = useRef(0);
  const startRef = useRef(0);
  const waypointsRef = useRef<{ x: number; y: number }[]>([]);
  const exitPointRef = useRef({ x: 0, y: 0 });
  const currentPosRef = useRef({ x: startX, y: startY });
  const stableComplete = useCallback(onComplete, [onComplete]);

  const carImg = CAR_IMAGE_MAP[carType];
  const carW = carType === 'lambo' ? 100 : carType === 'ferrari' ? 90 : 85;
  const carH = carType === 'lambo' ? 50 : carType === 'ferrari' ? 46 : 44;
  const labelText = carType === 'ferrari' ? 'VRROOOOM!!' : carType === 'chopper' ? 'CHOPPA!!' : 'LAMBO TIME!!';

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
      const goingRight = to.x >= from.x;

      currentPosRef.current = { x: cx, y: cy };
      setPos({ x: cx, y: cy, facingRight: goingRight });

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else if (phase === 'drive') {
        setPhase('exit');
      } else {
        stableComplete();
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, startX, startY, stableComplete]);

  return (
    <div className="meem-interaction-wrapper" style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}>
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
          {phase === 'mount' ? 'VROOM!' : labelText}
        </div>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={carImg}
            alt={carType}
            draggable={false}
            style={{
              width: carW,
              height: carH,
              objectFit: 'contain',
              transform: `scaleX(${pos.facingRight ? 1 : -1})`,
              filter: 'drop-shadow(3px 4px 8px rgba(0,0,0,0.4))',
              display: 'block',
            }}
          />
          {phase !== 'mount' && (
            <div style={{
              position: 'absolute',
              left: pos.facingRight ? -2 : 'auto',
              right: pos.facingRight ? 'auto' : -2,
              top: '40%',
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              opacity: 0.6,
            }}>
              {[0, 1].map(i => (
                <div
                  key={i}
                  style={{
                    width: 14 - i * 4,
                    height: 2,
                    background: '#aaa',
                    borderRadius: 1,
                    animation: `speedLine${i} 0.15s linear infinite`,
                  }}
                />
              ))}
            </div>
          )}
          <style>{`
            @keyframes speedLine0 { 0% { transform: scaleX(1); opacity: 0.6; } 50% { transform: scaleX(1.5); opacity: 0.3; } 100% { transform: scaleX(1); opacity: 0.6; } }
            @keyframes speedLine1 { 0% { transform: scaleX(1.4); opacity: 0.4; } 50% { transform: scaleX(0.8); opacity: 0.2; } 100% { transform: scaleX(1.4); opacity: 0.4; } }
          `}</style>
          <div style={{
            position: 'absolute',
            top: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg viewBox="0 0 260 200" width={30} height={23} style={{ overflow: 'visible' }}>
              <g style={{ transformOrigin: '130px 140px' }}>
                <path d="M 65,120 C 60,70 80,38 130,35 C 180,32 205,65 208,115 C 212,165 190,195 130,198 C 70,200 62,170 65,120 Z" fill="#f5d8a8" stroke="#333" strokeWidth="5" />
                <path d="M 55,95 C 58,45 90,18 135,15 C 178,13 210,35 212,80 L 210,95 L 70,98 C 62,100 56,98 55,95 Z" fill="#4488cc" stroke="#333" strokeWidth="5" />
                <ellipse cx="100" cy="118" rx="22" ry="24" fill="white" stroke="#333" strokeWidth="5" />
                <ellipse cx="168" cy="115" rx="24" ry="26" fill="white" stroke="#333" strokeWidth="5" />
                <circle cx="108" cy="122" r="8" fill="#333" />
                <circle cx="176" cy="119" r="9" fill="#333" />
                <circle cx="105" cy="119" r="3" fill="white" />
                <circle cx="173" cy="116" r="3.5" fill="white" />
                <path d="M 90,155 C 100,175 130,180 145,175 C 160,170 170,158 168,148 C 155,160 105,162 90,155 Z" fill="#222" stroke="#333" strokeWidth="4" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MeemDrivesLambo({ startX, startY, onComplete }: InteractionProps) {
  const [pos, setPos] = useState({ x: startX, y: startY, facingRight: true });
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

  const stableComplete = useCallback(onComplete, [onComplete]);

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
      const goingRight = to.x >= from.x;

      currentPosRef.current = { x: cx, y: cy };
      setPos({ x: cx, y: cy, facingRight: goingRight });

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else if (phase === 'drive') {
        setPhase('exit');
      } else {
        stableComplete();
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, startX, startY, stableComplete]);

  return (
    <div className="meem-interaction-wrapper" style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', fontFamily: "'Patrick Hand', cursive", fontSize: '0.75rem', color: '#e8c020', fontWeight: 'bold', whiteSpace: 'nowrap', textShadow: '1px 1px 0 rgba(0,0,0,0.15)' }}>
          {phase === 'mount' ? 'VROOM!' : 'LAMBO TIME!!'}
        </div>
        <svg viewBox="0 0 180 90" width={120} height={60} style={{ overflow: 'visible', transform: `scaleX(${pos.facingRight ? 1 : -1})` }}>
          <g>
            <path d="M 20,55 L 25,35 C 30,25 45,18 75,18 L 110,18 C 120,18 130,25 135,35 L 140,55" fill="#f0d040" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 15,55 L 145,55 L 148,60 L 12,60 Z" fill="#e8c020" stroke="#333" strokeWidth="2.5" />
            <rect x="50" y="22" width="18" height="14" rx="2" fill="#aaddff" stroke="#333" strokeWidth="2" />
            <rect x="73" y="22" width="22" height="14" rx="2" fill="#aaddff" stroke="#333" strokeWidth="2" />
            <g transform="translate(78, 8) scale(0.22)">
              <path d="M 65,120 C 60,70 80,38 130,35 C 180,32 205,65 208,115 C 212,165 190,195 130,198 C 70,200 62,170 65,120 Z" fill="#f5d8a8" stroke="#333" strokeWidth="4" />
              <path d="M 55,95 C 58,45 90,18 135,15 C 178,13 210,35 212,80 L 210,95 L 70,98 C 62,100 56,98 55,95 Z" fill="#4488cc" stroke="#333" strokeWidth="4" />
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
          {phase !== 'mount' && (
            <g opacity="0.5">
              <line x1="-5" y1="50" x2="-25" y2="50" stroke="#999" strokeWidth="2" strokeDasharray="4 3">
                <animate attributeName="x2" values="-25;-45" dur="0.2s" repeatCount="indefinite" />
              </line>
              <line x1="-5" y1="60" x2="-20" y2="60" stroke="#999" strokeWidth="1.5" strokeDasharray="3 3">
                <animate attributeName="x2" values="-20;-35" dur="0.15s" repeatCount="indefinite" />
              </line>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
