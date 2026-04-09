interface HandDrawnButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  rotation?: number;
  icon?: React.ReactNode;
}

export default function HandDrawnButton({ children, href, onClick, className = '', rotation = 0, icon }: HandDrawnButtonProps) {
  const style: React.CSSProperties = {
    transform: `rotate(${rotation}deg)`,
  };

  const svgOverlay = (
    <svg
      viewBox="0 0 200 60"
      style={{
        position: 'absolute',
        top: -4,
        left: -4,
        right: -4,
        bottom: -4,
        width: 'calc(100% + 8px)',
        height: 'calc(100% + 8px)',
        pointerEvents: 'none',
      }}
      preserveAspectRatio="none"
    >
      <path
        d="M 4,8 C 2,4 8,2 12,3 L 188,5 C 194,4 198,8 196,12 L 198,48 C 199,54 194,58 188,57 L 12,55 C 6,56 2,52 3,48 Z"
        fill="none"
        stroke="#333"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  const content = (
    <>
      {icon && <span className="inline-flex mr-2" style={{ verticalAlign: 'middle' }}>{icon}</span>}
      {children}
      {svgOverlay}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`sketch-btn ${className}`}
        style={style}
      >
        {content}
      </a>
    );
  }

  return (
    <button className={`sketch-btn ${className}`} style={style} onClick={onClick}>
      {content}
    </button>
  );
}
