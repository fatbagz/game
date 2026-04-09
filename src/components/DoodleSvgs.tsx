interface DoodleProps {
  className?: string;
  style?: React.CSSProperties;
  size?: number;
}

export function RocketDoodle({ className = '', style, size = 70 }: DoodleProps) {
  return (
    <svg viewBox="0 0 60 80" width={size} height={size * (80 / 60)} className={className} style={style}>
      <path d="M 30,5 C 22,20 18,35 18,55 L 42,55 C 42,35 38,20 30,5 Z" fill="#eee" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 18,45 C 10,55 8,62 12,65 L 18,55 Z" fill="#e04040" stroke="#333" strokeWidth="2" strokeLinecap="round" />
      <path d="M 42,45 C 50,55 52,62 48,65 L 42,55 Z" fill="#e04040" stroke="#333" strokeWidth="2" strokeLinecap="round" />
      <circle cx="30" cy="35" r="6" fill="#88bbee" stroke="#333" strokeWidth="2" />
      <path d="M 22,55 C 24,68 26,75 30,78 C 34,75 36,68 38,55" fill="#f08030" stroke="#e06020" strokeWidth="1.5" />
      <path d="M 26,55 C 27,65 29,70 30,72 C 31,70 33,65 34,55" fill="#f0d040" stroke="none" />
      <line x1="8" y1="20" x2="14" y2="25" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5" y1="30" x2="12" y2="32" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="46" y1="22" x2="53" y2="18" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="48" y1="32" x2="55" y2="30" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function LamboDoodle({ className = '', style, size = 100 }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 60" width={size} height={size * (60 / 120)} className={className} style={style}>
      <path
        d="M 15,40 L 20,25 C 25,18 35,12 55,12 L 80,12 C 90,12 98,18 102,25 L 108,40"
        fill="#f0d040"
        stroke="#333"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M 10,40 L 112,40 L 115,45 L 8,45 Z" fill="#e8c020" stroke="#333" strokeWidth="2.5" />
      <rect x="35" y="16" width="18" height="14" rx="2" fill="#aaddff" stroke="#333" strokeWidth="2" />
      <rect x="58" y="16" width="22" height="14" rx="2" fill="#aaddff" stroke="#333" strokeWidth="2" />
      <circle cx="28" cy="48" r="8" fill="#555" stroke="#333" strokeWidth="2.5" />
      <circle cx="28" cy="48" r="4" fill="#888" stroke="#333" strokeWidth="1.5" />
      <circle cx="92" cy="48" r="8" fill="#555" stroke="#333" strokeWidth="2.5" />
      <circle cx="92" cy="48" r="4" fill="#888" stroke="#333" strokeWidth="1.5" />
      <line x1="15" y1="38" x2="25" y2="38" stroke="#333" strokeWidth="1.5" />
      <line x1="95" y1="38" x2="108" y2="38" stroke="#333" strokeWidth="1.5" />
    </svg>
  );
}

export function ChartDoodle({ className = '', style, size = 80 }: DoodleProps) {
  return (
    <svg viewBox="0 0 80 60" width={size} height={size * (60 / 80)} className={className} style={style}>
      <line x1="10" y1="50" x2="70" y2="50" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="10" y1="50" x2="10" y2="8" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
      <polyline
        points="12,42 22,38 30,45 38,30 45,35 52,18 60,22 68,8"
        fill="none"
        stroke="#22aa44"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon points="65,5 70,8 68,14 62,12" fill="#22aa44" stroke="#22aa44" strokeWidth="1" />
      <text x="68" y="6" fontFamily="'Patrick Hand', cursive" fontSize="10" fill="#333" transform="rotate(-20 68 6)">$</text>
    </svg>
  );
}

export function DogDoodle({ className = '', style, size = 60 }: DoodleProps) {
  return (
    <svg viewBox="0 0 60 50" width={size} height={size * (50 / 60)} className={className} style={style}>
      <ellipse cx="30" cy="30" rx="18" ry="12" fill="#e8c888" stroke="#333" strokeWidth="2.5" />
      <ellipse cx="50" cy="25" rx="10" ry="8" fill="#e8c888" stroke="#333" strokeWidth="2.5" />
      <circle cx="52" cy="23" r="2.5" fill="#333" />
      <circle cx="51" cy="22" r="1" fill="white" />
      <ellipse cx="55" cy="26" rx="4" ry="3" fill="#d4a060" stroke="#333" strokeWidth="1.5" />
      <path d="M 45,18 C 42,10 46,8 50,14" fill="#e8c888" stroke="#333" strokeWidth="2" />
      <path d="M 52,17 C 55,10 60,10 58,18" fill="#e8c888" stroke="#333" strokeWidth="2" />
      <line x1="14" y1="35" x2="14" y2="48" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="22" y1="37" x2="22" y2="48" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="35" y1="37" x2="35" y2="48" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="42" y1="35" x2="42" y2="48" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 12,32 C 5,30 2,35 6,38" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function MoneyBagDoodle({ className = '', style, size = 60 }: DoodleProps) {
  return (
    <svg viewBox="0 0 50 60" width={size} height={size * (60 / 50)} className={className} style={style}>
      <path
        d="M 18,18 C 12,25 8,35 8,42 C 8,52 15,56 25,56 C 35,56 42,52 42,42 C 42,35 38,25 32,18 Z"
        fill="#e8c850"
        stroke="#333"
        strokeWidth="2.5"
      />
      <path d="M 18,18 C 20,12 22,8 25,5 C 28,8 30,12 32,18" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="18" y1="18" x2="32" y2="18" stroke="#333" strokeWidth="2" />
      <text x="25" y="42" textAnchor="middle" fontFamily="'Patrick Hand', cursive" fontSize="20" fontWeight="bold" fill="#333">$</text>
      <line x1="18" y1="28" x2="22" y2="32" stroke="#c8a830" strokeWidth="1.5" opacity="0.5" />
      <line x1="15" y1="35" x2="19" y2="39" stroke="#c8a830" strokeWidth="1.5" opacity="0.5" />
      <line x1="32" y1="28" x2="36" y2="32" stroke="#c8a830" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

export function DiamondDoodle({ className = '', style, size = 50 }: DoodleProps) {
  return (
    <svg viewBox="0 0 50 50" width={size} height={size} className={className} style={style}>
      <polygon points="25,3 45,18 25,48 5,18" fill="#88ddff" stroke="#333" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="5" y1="18" x2="45" y2="18" stroke="#333" strokeWidth="2" />
      <line x1="25" y1="3" x2="15" y2="18" stroke="#333" strokeWidth="1.5" />
      <line x1="25" y1="3" x2="35" y2="18" stroke="#333" strokeWidth="1.5" />
      <line x1="15" y1="18" x2="25" y2="48" stroke="#333" strokeWidth="1.5" />
      <line x1="35" y1="18" x2="25" y2="48" stroke="#333" strokeWidth="1.5" />
      <line x1="10" y1="18" x2="20" y2="30" stroke="#66bbdd" strokeWidth="1" opacity="0.5" />
      <line x1="30" y1="18" x2="35" y2="28" stroke="#66bbdd" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

export function StarDoodle({ className = '', style, size = 35 }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className} style={style}>
      <polygon
        points="20,2 25,15 38,15 27,24 31,38 20,30 9,38 13,24 2,15 15,15"
        fill="#f0d040"
        stroke="#333"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CoinDoodle({ className = '', style, size = 40 }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className} style={style}>
      <circle cx="20" cy="20" r="17" fill="#f0d040" stroke="#333" strokeWidth="2.5" />
      <circle cx="20" cy="20" r="13" fill="#e8c830" stroke="#333" strokeWidth="1.5" />
      <text x="20" y="25" textAnchor="middle" fontFamily="'Patrick Hand', cursive" fontSize="11" fontWeight="bold" fill="#333">M</text>
    </svg>
  );
}

export function ArrowDoodle({ className = '', style, size = 40 }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 30" width={size} height={size * (30 / 40)} className={className} style={style}>
      <path d="M 5,20 C 10,18 18,15 25,10" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="25,3 35,10 25,15" fill="#333" />
    </svg>
  );
}

export function TinyRocket({ className = '', style, size = 25 }: DoodleProps) {
  return (
    <svg viewBox="0 0 20 30" width={size} height={size * 1.5} className={className} style={style}>
      <path d="M 10,2 C 6,10 5,18 5,22 L 15,22 C 15,18 14,10 10,2 Z" fill="#ddd" stroke="#333" strokeWidth="1.5" />
      <path d="M 7,22 L 10,28 L 13,22" fill="#e06030" stroke="#333" strokeWidth="1" />
    </svg>
  );
}

export function TinyCoin({ className = '', style, size = 20 }: DoodleProps) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} className={className} style={style}>
      <circle cx="10" cy="10" r="8" fill="#f0d040" stroke="#333" strokeWidth="1.5" />
      <text x="10" y="14" textAnchor="middle" fontFamily="'Patrick Hand', cursive" fontSize="8" fill="#333">$</text>
    </svg>
  );
}

export function TinyStar({ className = '', style, size = 18 }: DoodleProps) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} className={className} style={style}>
      <polygon
        points="10,1 12.5,7.5 19,7.5 14,12 16,19 10,15 4,19 6,12 1,7.5 7.5,7.5"
        fill="#f0d040"
        stroke="#333"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export function TinyArrow({ className = '', style, size = 22 }: DoodleProps) {
  return (
    <svg viewBox="0 0 20 15" width={size} height={size * 0.75} className={className} style={style}>
      <path d="M 2,10 L 14,5" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
      <polygon points="14,1 19,6 13,8" fill="#333" />
    </svg>
  );
}

export function QuestionMark({ className = '', style, size = 25 }: DoodleProps) {
  return (
    <svg viewBox="0 0 20 30" width={size} height={size * 1.5} className={className} style={style}>
      <path d="M 6,8 C 6,3 14,2 15,7 C 16,10 10,12 10,17" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="10" cy="23" r="2" fill="#333" />
    </svg>
  );
}

export function Squiggle({ className = '', style, size = 40 }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 10" width={size} height={size * 0.25} className={className} style={style}>
      <path d="M 2,5 C 8,0 12,10 18,5 C 24,0 28,10 35,5" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
