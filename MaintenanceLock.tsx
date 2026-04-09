import { Link } from 'react-router-dom';
import { Home, Wrench } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

const MEEM_IMAGE_URL =
  'https://fhfvefrocgtfvfwdhyxw.supabase.co/storage/v1/object/public/lol/meems%20random/meem_character_transparent_v2.png';

interface MaintenanceLockProps {
  title?: string;
  subtitle?: string;
}

function OrbitingMascot({ radius, duration }: { radius: number; duration: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [size] = useState(52);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.style.setProperty('--orbit-r', `${radius}px`);
    el.style.setProperty('--orbit-dur', `${duration}s`);
  }, [radius, duration]);

  return (
    <div className="maintenance-orbit-track" style={{ marginTop: -size / 2, marginLeft: -size / 2 }}>
      <div
        ref={trackRef}
        className="maintenance-orbit-mascot"
        style={
          { '--orbit-r': `${radius}px`, '--orbit-dur': `${duration}s` } as React.CSSProperties
        }
      >
        <img
          src={MEEM_IMAGE_URL}
          alt="Meem"
          style={{
            width: size,
            height: Math.round(size * 1.15),
            objectFit: 'contain',
            display: 'block',
            filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.18))',
          }}
        />
      </div>
    </div>
  );
}

export default function MaintenanceLock({
  title = 'UNDER MEEM MAINTENANCE',
  subtitle = 'Getting some upgrades. Back soon — stay based.',
}: MaintenanceLockProps) {
  const [orbitRadius, setOrbitRadius] = useState(130);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function measure() {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      setOrbitRadius(Math.max(100, w / 2 + 36));
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(250,250,245,0.96)',
        backdropFilter: 'blur(6px)',
        backgroundImage:
          'repeating-linear-gradient(transparent 0px, transparent 31px, #a3c4df 31px, #a3c4df 32px)',
        padding: '2rem 1.25rem',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 480,
          minHeight: 220,
        }}
      >
        <OrbitingMascot radius={orbitRadius} duration={3.6} />

        <div
          ref={containerRef}
          className="maintenance-card-pulse"
          style={{
            position: 'relative',
            zIndex: 2,
            background: '#fff',
            border: '3px solid #333',
            borderRadius: 0,
            padding: 'clamp(20px, 5vw, 32px) clamp(16px, 5vw, 32px)',
            maxWidth: 320,
            width: '100%',
            textAlign: 'center',
            boxShadow: '5px 5px 0 #1a8cff, 5px 5px 0 2px #333',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              background: '#1a8cff',
              border: '2.5px solid #333',
              borderRadius: '50%',
              marginBottom: 12,
            }}
          >
            <Wrench size={22} color="#fff" />
          </div>

          <h1
            className="hooey-title"
            style={{
              fontSize: 'clamp(1.1rem, 5vw, 1.55rem)',
              lineHeight: 1.2,
              marginBottom: 10,
              letterSpacing: '0.01em',
            }}
          >
            {title}
          </h1>

          <p
            className="font-hand"
            style={{
              color: '#555',
              fontSize: 'clamp(0.88rem, 3.2vw, 1rem)',
              lineHeight: 1.55,
              marginBottom: 20,
              fontFamily: "'Patrick Hand', cursive",
            }}
          >
            {subtitle}
          </p>

          <Link
            to="/"
            className="sketch-btn flex items-center gap-2 justify-center"
            style={{
              textDecoration: 'none',
              fontSize: 'clamp(0.92rem, 3.5vw, 1.1rem)',
              padding: '10px 24px',
              display: 'inline-flex',
            }}
          >
            <Home size={16} />
            BACK TO HOME
          </Link>
        </div>
      </div>

      <p
        style={{
          fontFamily: "'Patrick Hand', cursive",
          color: '#aaa',
          fontSize: 'clamp(0.7rem, 2.5vw, 0.82rem)',
          marginTop: 'clamp(100px, 20vw, 140px)',
          textAlign: 'center',
          letterSpacing: '0.03em',
        }}
      >
        meem is working overtime
      </p>
    </div>
  );
}
