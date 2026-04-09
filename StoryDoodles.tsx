import {
  RocketDoodle,
  DiamondDoodle,
  ArrowDoodle,
} from './DoodleSvgs';

type Side = 'left' | 'right';

interface DoodleConfig {
  triggerLine: number;
  Component: React.FC<{ className?: string; style?: React.CSSProperties; size?: number }>;
  top: string;
  offset: string;
  side: Side;
  size: number;
}

const DOODLE_MAP: DoodleConfig[] = [
  { triggerLine: 2,  Component: RocketDoodle,  top: '0px',   offset: '-80px',  side: 'right', size: 55 },
  { triggerLine: 4,  Component: DiamondDoodle, top: '60px',  offset: '-60px',  side: 'left',  size: 40 },
  { triggerLine: 6,  Component: ArrowDoodle,   top: '160px', offset: '-70px',  side: 'left',  size: 35 },
  { triggerLine: 8,  Component: RocketDoodle,  top: '200px', offset: '-80px',  side: 'right', size: 50 },
  { triggerLine: 10, Component: DiamondDoodle, top: '270px', offset: '-80px',  side: 'left',  size: 45 },
  { triggerLine: 12, Component: ArrowDoodle,   top: '340px', offset: '-90px',  side: 'right', size: 40 },
  { triggerLine: 15, Component: RocketDoodle,  top: '420px', offset: '-85px',  side: 'left',  size: 55 },
  { triggerLine: 18, Component: DiamondDoodle, top: '490px', offset: '-75px',  side: 'right', size: 38 },
  { triggerLine: 21, Component: ArrowDoodle,   top: '560px', offset: '-85px',  side: 'left',  size: 35 },
];

interface StoryDoodlesProps {
  completedLines: number[];
}

export default function StoryDoodles({ completedLines }: StoryDoodlesProps) {
  return (
    <div className="hidden md:block">
      {DOODLE_MAP.map((doodle, i) => {
        const isVisible = completedLines.includes(doodle.triggerLine);
        if (!isVisible) return null;

        const { Component, top, offset, side, size } = doodle;
        const posStyle: React.CSSProperties = {
          position: 'absolute',
          top,
          ...(side === 'left' ? { left: offset } : { right: offset }),
        };

        return (
          <div key={i} style={posStyle} className="doodle-pop">
            <Component size={size} />
          </div>
        );
      })}
    </div>
  );
}
