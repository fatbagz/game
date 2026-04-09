import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { stopMusic, isMusicPlaying, startMusic } from '../utils/audio';

export default function MusicToggle() {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const sync = () => setPlaying(isMusicPlaying());
    sync();
    const id = setInterval(sync, 500);
    return () => clearInterval(id);
  }, []);

  const toggle = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isMusicPlaying()) {
      stopMusic();
      setPlaying(false);
    } else {
      startMusic();
      setPlaying(true);
    }
  };

  return (
    <button
      onClick={toggle}
      onTouchStart={toggle}
      className="music-toggle-inline font-hand flex items-center gap-1"
      aria-label={playing ? 'Mute music' : 'Play music'}
    >
      {playing ? <Volume2 size={15} /> : <VolumeX size={15} />}
    </button>
  );
}
