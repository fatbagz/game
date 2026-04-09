import { useState, useMemo } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET = 'lol';

function pub(path: string): string {
  const encoded = path.split('/').map(s => encodeURIComponent(s)).join('/');
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encoded}`;
}

const MEEM_IMAGES = [
  'meems memes/download.png',
  'meems memes/download (1).png',
  'meems memes/download (2).png',
  'meems memes/download (3).png',
  'meems memes/download (4).png',
  'meems memes/download (5).png',
];

const FUNNY_CAPTIONS = [
  'wen lambo? asking for a friend',
  'bought the dip. it kept dipping.',
  'my portfolio is 100% meem and 0% regret',
  'financial advisor said diversify. i said no.',
  'mom im a crypto investor now',
  'diamond hands activated',
  'this IS the roadmap',
  'trust the process they said',
  'number go up technology',
  'i am the whale now',
  'sold my car for more meem',
  'retirement plan: meem',
  'not a scam btw (trust me bro)',
  'me pretending to work while checking charts',
  'the boys when meem pumps 2%',
  'built different. not smarter. just different.',
  'told my therapist about meem',
  'this is fine. everything is fine.',
  'woke up and chose meem',
  'my last 2 brain cells buying meem',
  'lambo or food stamps no in between',
  'just vibing honestly',
  'me explaining meem at thanksgiving',
  'still early. probably.',
  'the real friends were the meems we made',
  'chart go up = happy. chart go down = buy more.',
  'professional degen hours',
  'they laughed. then they aped in.',
  'down bad but spirits high',
  'this coin has changed my life (not financially)',
];

const ROTATIONS = [-1.2, 0.8, -0.5, 1.1, -0.3, 0.6, -0.8, 1.3, -0.4];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface MemeCardProps {
  imagePath: string;
  caption: string;
  rotation: number;
}

function MemeCard({ imagePath, caption, rotation }: MemeCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div
      className="meme-panel relative overflow-hidden"
      style={{
        transform: `rotate(${rotation}deg)`,
        borderRadius: 6,
        border: '3px solid #333',
        background: '#f5f0e8',
        aspectRatio: '1',
      }}
    >
      {!errored && (
        <img
          src={pub(imagePath)}
          alt={`MEEM solana meme coin - ${caption}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}
      {!loaded && !errored && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: '#f5f0e8' }}
        >
          <span className="font-hand" style={{ color: '#999' }}>loading...</span>
        </div>
      )}
      {errored && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: '#f5f0e8' }}
        >
          <span className="font-hand" style={{ color: '#ccc', fontSize: '0.75rem' }}>image not found</span>
        </div>
      )}
      <div
        className="absolute bottom-0 left-0 right-0 px-3 py-4"
        style={{
          background: 'linear-gradient(transparent 0%, rgba(0,0,0,0.85) 60%)',
        }}
      >
        <p
          className="hooey-title-sm text-center uppercase"
          style={{
            fontSize: 'clamp(0.95rem, 4vw, 1.4rem)',
            lineHeight: 1.25,
            letterSpacing: '0.5px',
          }}
        >
          {caption}
        </p>
      </div>
    </div>
  );
}

interface MemeSectionProps {
  visible: boolean;
}

export default function MemeSection({ visible }: MemeSectionProps) {
  const memes = useMemo(() => {
    const shuffled = shuffle(MEEM_IMAGES).slice(0, 6);
    const shuffledCaptions = shuffle(FUNNY_CAPTIONS);
    return shuffled.map((img, i) => ({
      image: img,
      caption: shuffledCaptions[i % shuffledCaptions.length],
    }));
  }, []);

  if (!visible) return null;

  return (
    <div className="mt-16 w-full">
      <h2
        className="hooey-title text-4xl md:text-5xl mb-8 text-center"
        style={{
          transform: 'rotate(-1deg)',
          textDecoration: 'underline',
          textDecorationStyle: 'wavy',
          textUnderlineOffset: '6px',
          textDecorationColor: '#000',
        }}
      >
        MEEM MEMES
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {memes.map((m, i) => (
          <MemeCard
            key={`${m.image}-${i}`}
            imagePath={m.image}
            caption={m.caption}
            rotation={ROTATIONS[i % ROTATIONS.length]}
          />
        ))}
      </div>
    </div>
  );
}
