import { useRef, useEffect, useState } from 'react';

const IMAGE_URL = 'https://fhfvefrocgtfvfwdhyxw.supabase.co/storage/v1/object/public/lol/meems%20random/meem_character_transparent_v2.png';

interface MeemCharacterProps {
  isWalking?: boolean;
  isScratching?: boolean;
  className?: string;
  size?: number;
  mousePos?: { x: number; y: number };
  containerRef?: React.RefObject<HTMLDivElement>;
}

export default function MeemCharacter({
  isWalking,
  className = '',
  size = 220,
}: MeemCharacterProps) {
  const [bobOffset, setBobOffset] = useState(0);
  const [tiltDeg, setTiltDeg] = useState(0);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    let raf: number;
    const animate = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = (now - startRef.current) / 1000;
      const bob = Math.sin(elapsed * (isWalking ? 5.5 : 1.8)) * (isWalking ? 5 : 3);
      const tilt = Math.sin(elapsed * (isWalking ? 4 : 1.2)) * (isWalking ? 2.5 : 1.2);
      setBobOffset(bob);
      setTiltDeg(tilt);
      frameRef.current = raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isWalking]);

  const height = Math.round(size * 1.15);

  return (
    <div
      className={className}
      style={{
        display: 'inline-block',
        transform: `translateY(${bobOffset}px) rotate(${tiltDeg}deg)`,
        transition: 'filter 0.3s ease',
      }}
    >
      <img
        src={IMAGE_URL}
        alt="Meem"
        style={{
          width: size,
          height: height,
          objectFit: 'contain',
          display: 'block',
          background: 'transparent',
        }}
      />
    </div>
  );
}
