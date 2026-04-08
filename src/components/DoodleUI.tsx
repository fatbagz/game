import React from 'react';

interface DoodleButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function DoodleButton({
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  disabled = false
}: DoodleButtonProps) {
  const baseClasses = "w-full font-semibold meem-button cursor-pointer";

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-xl"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} bg-white text-black ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}

interface DoodlePanelProps {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
}

export function DoodlePanel({ children, className = '', bordered = false }: DoodlePanelProps) {
  return (
    <div
      className={`bg-white p-6 ${bordered ? 'border-4 border-black' : ''} ${className}`}
      style={{ borderRadius: '12px' }}
    >
      {children}
    </div>
  );
}

interface DoodleCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

export function DoodleCard({ children, onClick, selected = false, className = '' }: DoodleCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border-3 border-black p-4 transition-all ${
        onClick ? 'cursor-pointer meem-button' : ''
      } ${selected ? 'ring-4 ring-blue-400' : ''} ${className}`}
      style={{ borderRadius: '12px' }}
    >
      {children}
    </div>
  );
}

interface DoodleMeemHeadProps {
  filled: boolean;
}

export function DoodleMeemHead({ filled }: DoodleMeemHeadProps) {
  return (
    <div className="relative inline-block">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
      >
        <circle
          cx="16"
          cy="16"
          r="13"
          fill={filled ? "#FFD700" : "#D1D5DB"}
          stroke="#000000"
          strokeWidth="2.5"
        />
        {filled && (
          <>
            <circle cx="11" cy="14" r="2" fill="#000000" />
            <circle cx="21" cy="14" r="2" fill="#000000" />
            <path
              d="M 10 20 Q 16 24, 22 20"
              stroke="#000000"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    </div>
  );
}

interface DoodleBadgeProps {
  children: React.ReactNode;
  color?: string;
}

export function DoodleBadge({ children, color = '#3B9BFF' }: DoodleBadgeProps) {
  return (
    <span
      className="inline-block px-4 py-2 text-sm font-bold border-3 border-black bg-white"
      style={{
        borderRadius: '12px'
      }}
    >
      {children}
    </span>
  );
}

interface MeemTitleProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function MeemTitle({ children, size = 'lg' }: MeemTitleProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl md:text-5xl',
    xl: 'text-5xl md:text-6xl'
  };

  return (
    <h1 className={`${sizeClasses[size]} font-bold meem-text-blue uppercase`}>
      {children}
    </h1>
  );
}
