import { useState, useCallback, useEffect, useRef } from 'react';
import { registerDoodle, unregisterDoodle, DoodleType } from '../utils/doodleRegistry';
import { RocketDoodle, DiamondDoodle } from './DoodleSvgs';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET = 'lol';

function pub(path: string): string {
  const encoded = path.split('/').map(s => encodeURIComponent(s)).join('/');
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encoded}`;
}

type AssetKind = 'img' | 'rocket' | 'diamond';

interface AssetConfig {
  id: string;
  type: DoodleType;
  kind: AssetKind;
  src?: string;
  side: 'left' | 'right';
  rotate: string;
  size: number;
  topPx: number;
}

/* 🔥 FINAL SPACING */
const GAP = 145;
const START = 75; // moved up exactly one GAP (220 → 75)

function row(n: number) {
  return START + GAP * n;
}

const assets: AssetConfig[] = [
  { id: 'asset-cigar',       type: 'cigar',   kind: 'img',     src: pub('meem assets/cigar.PNG'),      side: 'left',  rotate: '-12deg', size: 44, topPx: row(0) },
  { id: 'asset-glasses-r0',  type: 'thug',    kind: 'img',     src: pub('meem assets/sunglasses.PNG'), side: 'right', rotate: '5deg',   size: 38, topPx: row(0) },

  { id: 'asset-chain',       type: 'chain',   kind: 'img',     src: pub('meem assets/chain2.PNG'),     side: 'left',  rotate: '-6deg',  size: 42, topPx: row(1) },
  { id: 'asset-rocket-r1',   type: 'rocket',  kind: 'rocket',                                          side: 'right', rotate: '10deg',  size: 38, topPx: row(1) },

  { id: 'asset-diamond-l2',  type: 'diamond', kind: 'diamond',                                         side: 'left',  rotate: '-8deg',  size: 32, topPx: row(2) },
  { id: 'asset-beer',        type: 'beer',    kind: 'img',     src: pub('meem assets/beer.PNG'),       side: 'right', rotate: '6deg',   size: 48, topPx: row(2) },

  { id: 'asset-rocket-l3',   type: 'rocket',  kind: 'rocket',                                          side: 'left',  rotate: '-12deg', size: 36, topPx: row(3) },
  { id: 'asset-ferrari',     type: 'ferrari', kind: 'img',     src: pub('meem assets/ferrari.PNG'),    side: 'right', rotate: '-4deg',  size: 64, topPx: row(3) },

  { id: 'asset-lambo',       type: 'ferrari', kind: 'img',     src: pub('meem assets/lambo.PNG'),      side: 'left',  rotate: '4deg',   size: 70, topPx: row(4) },
  { id: 'asset-diamond-r4',  type: 'diamond', kind: 'diamond',                                         side: 'right', rotate: '12deg',  size: 32, topPx: row(4) },

  { id: 'asset-spliff',      type: 'cigar',   kind: 'img',     src: pub('meem assets/spliff.PNG'),     side: 'left',  rotate: '5deg',   size: 42, topPx: row(5) },
  { id: 'asset-pistol',      type: 'thug',    kind: 'img',     src: pub('meem assets/pistol.PNG'),     side: 'right', rotate: '8deg',   size: 40, topPx: row(5) },

  { id: 'asset-ak',          type: 'thug',    kind: 'img',     src: pub('meem assets/ak.PNG'),         side: 'left',  rotate: '-8deg',  size: 50, topPx: row(6) },
  { id: 'asset-rocket-r6',   type: 'rocket',  kind: 'rocket',                                          side: 'right', rotate: '15deg',  size: 34, topPx: row(6) },

  { id: 'asset-diamond-l7',  type: 'diamond', kind: 'diamond',                                         side: 'left',  rotate: '8deg',   size: 30, topPx: row(7) },
  { id: 'asset-glasses-r7',  type: 'thug',    kind: 'img',     src: pub('meem assets/sunglasses.PNG'), side: 'right', rotate: '-5deg',  size: 38, topPx: row(7) },
];

const floatKeyframes = `
@keyframes floatingAsset {
  0%, 100% { transform: var(--base-rotate) translateY(0); }
  50% { transform: var(--base-rotate) translateY(-8px); }
}
@keyframes assetPop {
  0% { transform: scale(1); }
  40% { transform: scale(1.25) rotate(8deg); }
  70% { transform: scale(0.9) rotate(-4deg); }
  100% { transform: scale(1) rotate(0deg); }
}
`;

function AssetItem({ asset, idx }: { asset: AssetConfig; idx: number }) {
  const ref = useRef<HTMLDivElement & HTMLImageElement>(null);
  const [popped, setPopped] = useState(false);
  const [loaded, setLoaded] = useState(asset.kind !== 'img');
  const duration = 5 + (idx % 3) * 0.8;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    registerDoodle({ id: asset.id, type: asset.type, element: el });
    return () => unregisterDoodle(asset.id);
  }, [asset.id, asset.type]);

  const handleTap = useCallback(() => {
    setPopped(true);
    setTimeout(() => setPopped(false), 400);
  }, []);

  const posStyle: React.CSSProperties =
    asset.side === 'left' ? { left: '2%' } : { right: '2%' };

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    top: asset.topPx,
    ...posStyle,
    opacity: loaded ? 1 : 0,
    pointerEvents: 'auto',
    cursor: 'pointer',
    ['--base-rotate' as string]: `rotate(${asset.rotate})`,
    transform: `rotate(${asset.rotate})`,
    animation: popped
      ? 'assetPop 0.4s ease-out forwards'
      : `floatingAsset ${duration}s ease-in-out infinite`,
    animationDelay: popped ? '0s' : `${idx * 0.4}s`,
    filter: 'drop-shadow(3px 4px 6px rgba(0,0,0,0.35))',
    WebkitTapHighlightColor: 'transparent',
    transition: 'opacity 0.4s ease',
  };

  if (asset.kind === 'rocket') {
    return (
      <div ref={ref as any} onClick={handleTap} style={{ ...baseStyle, width: asset.size }}>
        <RocketDoodle size={asset.size} />
      </div>
    );
  }

  if (asset.kind === 'diamond') {
    return (
      <div ref={ref as any} onClick={handleTap} style={{ ...baseStyle, width: asset.size }}>
        <DiamondDoodle size={asset.size} />
      </div>
    );
  }

  return (
    <img
      ref={ref as any}
      src={asset.src}
      alt=""
      draggable={false}
      onClick={handleTap}
      onLoad={() => setLoaded(true)}
      style={{ ...baseStyle, width: asset.size }}
    />
  );
}

export default function FloatingAssets() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: `${START + GAP * 8 + 300}px`,
        zIndex: 30,
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      <style>{floatKeyframes}</style>
      {assets.map((asset, idx) => (
        <AssetItem key={asset.id} asset={asset} idx={idx} />
      ))}
    </div>
  );
}