import { useState, useEffect, useRef, useCallback } from 'react';
import { RocketDoodle, DiamondDoodle } from './DoodleSvgs';

const FLANKED_LINES = new Set([
  'so now it is meem',
  'if meem hits 1 billion market cap',
  'welcome to meem',
]);

const STORY_LINES = [
  'hello',
  '',
  'my name is meem',
  '',
  'one day i tried to make a meme coin',
  'but i spelt meme wrong',
  'so now it is meem',
  '',
  'one morning i woke up',
  'and there was a donut on my desk',
  'i ate it',
  '',
  'then there was another donut',
  'i ate that too',
  '',
  'then devski appeared',
  'he said',
  '"meem this is called liquidity"',
  'i said ok',
  '',
  'then emperor showed up',
  'he had no idea what was going on either',
  'but he nodded like he did',
  '',
  'we sat there',
  'eating donuts',
  'watching charts',
  '',
  'devski kept pressing buttons',
  'emperor kept saying "this is bullish"',
  'i kept eating',
  '',
  'crypto twitter told me',
  'this is how empires are built',
  '',
  'so i made a coin',
  'devski said number go up',
  'emperor said trust the process',
  'i said wen donut',
  '',
  'if meem hits 1 billion market cap',
  'we buy a lambo',
  'fill it with donuts',
  '',
  'if meem goes to zero',
  'devski disappears',
  'emperor writes a speech',
  'and i eat the last donut',
  '',
  'welcome to meem',
];

interface StoryTextProps {
  active: boolean;
  onLineComplete?: (lineIndex: number) => void;
  onDone?: () => void;
  skipAnimation?: boolean;
  autoScroll?: boolean;
}

function WritingMeem({ charX }: { charX: number }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `calc(50% + ${charX}px)`,
        bottom: -6,
        transition: 'left 0.06s linear',
        zIndex: 2,
      }}
    >
      <svg viewBox="0 0 40 50" width={24} height={30} style={{ overflow: 'visible' }}>
        <circle cx="20" cy="16" r="12" fill="#f5d8a8" stroke="#333" strokeWidth="1.8" />
        <path d="M 10,12 C 12,4 20,1 24,1 C 28,1 34,4 35,11 L 10,12 Z" fill="#4488cc" stroke="#333" strokeWidth="1.5" />
        <ellipse cx="16" cy="15" rx="3.5" ry="4" fill="white" stroke="#333" strokeWidth="1.2" />
        <ellipse cx="26" cy="14" rx="4" ry="4.5" fill="white" stroke="#333" strokeWidth="1.2" />
        <circle cx="17" cy="16" r="1.5" fill="#333" />
        <circle cx="27" cy="15" r="1.8" fill="#333" />
        <path d="M 14,22 C 17,26 23,26 26,22" fill="#222" stroke="#333" strokeWidth="1" />
        <line x1="32" y1="22" x2="40" y2="38" stroke="#c89040" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="40" y1="38" x2="42" y2="42" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="42" cy="43" r="1" fill="#333" />
      </svg>
    </div>
  );
}

export default function StoryText({ active, onLineComplete, onDone, skipAnimation, autoScroll }: StoryTextProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>(
    skipAnimation ? STORY_LINES : []
  );
  const [currentLine, setCurrentLine] = useState(skipAnimation ? STORY_LINES.length : 0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isDone, setIsDone] = useState(!!skipAnimation);
  const doneRef = useRef(!!skipAnimation);
  const [writingX, setWritingX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastLineRef = useRef<HTMLDivElement>(null);

  const notifyDone = useCallback(() => {
    if (!doneRef.current) {
      doneRef.current = true;
      setIsDone(true);
      onDone?.();
    }
  }, [onDone]);

  useEffect(() => {
    if (skipAnimation) {
      STORY_LINES.forEach((_, i) => onLineComplete?.(i));
      notifyDone();
    }
  }, [skipAnimation, onLineComplete, notifyDone]);

  useEffect(() => {
    if (!active || isDone || skipAnimation) return;

    if (currentLine >= STORY_LINES.length) {
      notifyDone();
      return;
    }

    const line = STORY_LINES[currentLine];

    if (line === '') {
      const timeout = setTimeout(() => {
        setDisplayedLines(prev => [...prev, '']);
        onLineComplete?.(currentLine);
        setCurrentLine(prev => prev + 1);
        setCurrentChar(0);
        setWritingX(0);
      }, 200);
      return () => clearTimeout(timeout);
    }

    if (currentChar === 0) {
      setDisplayedLines(prev => [...prev, '']);
      setWritingX(0);
    }

    if (currentChar < line.length) {
      const speed = 22 + Math.random() * 18;
      const timeout = setTimeout(() => {
        setDisplayedLines(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = line.substring(0, currentChar + 1);
          return updated;
        });
        setCurrentChar(prev => prev + 1);
        setWritingX(prev => prev + 8);
      }, speed);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      onLineComplete?.(currentLine);
      setCurrentLine(prev => prev + 1);
      setCurrentChar(0);
      setWritingX(0);
    }, 150);
    return () => clearTimeout(timeout);
  }, [active, currentLine, currentChar, isDone, onLineComplete, skipAnimation, notifyDone]);

  useEffect(() => {
    if (!autoScroll || !active || isDone) return;
    if (lastLineRef.current) {
      lastLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [displayedLines.length, autoScroll, active, isDone]);

  if (!active && displayedLines.length === 0) return null;

  const isCurrentlyWriting = active && !isDone && currentLine < STORY_LINES.length && STORY_LINES[currentLine] !== '' && currentChar > 0;

  return (
    <div ref={containerRef} className="mt-6 text-center relative" style={{ paddingBottom: 8 }}>
      {displayedLines.map((line, i) => {
        const isFlanked = FLANKED_LINES.has(line);
        const isLast = i === displayedLines.length - 1;
        return (
          <div
            key={i}
            ref={isLast ? lastLineRef : undefined}
            className="relative w-full"
          >
            <p
              className="font-hand"
              style={{
                color: '#333',
                lineHeight: '1.45',
                fontSize: 'clamp(1.1rem, 3.5vw, 1.5rem)',
                letterSpacing: '0.01em',
                textShadow: '0.5px 0.5px 0 rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: isFlanked ? '10px' : '0',
                minHeight: line === '' ? '0.6rem' : undefined,
                marginBottom: line === '' ? '0.2rem' : '0.1rem',
                paddingTop: 0,
                paddingBottom: 0,
              }}
            >
              {isFlanked && (
                <RocketDoodle size={20} style={{ flexShrink: 0, transform: 'rotate(-15deg)' }} />
              )}
              <span>
                {line}
                {isLast && !isDone && line !== '' && (
                  <span className="cursor-blink" />
                )}
              </span>
              {isFlanked && (
                <DiamondDoodle size={18} style={{ flexShrink: 0, transform: 'rotate(10deg)' }} />
              )}
            </p>
            {isCurrentlyWriting && isLast && (
              <WritingMeem charX={Math.min(writingX, 200)} />
            )}
          </div>
        );
      })}
    </div>
  );
}
