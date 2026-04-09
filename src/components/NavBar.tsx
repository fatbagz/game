import { Link, useLocation } from 'react-router-dom';
import { Home, Image, Gamepad2, Users, Map } from 'lucide-react';
import { TelegramIcon, XIcon } from './ButtonIcons';
import MusicToggle from './MusicToggle';

const NAV_ITEMS = [
  { path: '/', label: 'HOME', icon: Home, mobileLabel: 'HOME' },
  { path: '/memes', label: 'MEEM LAB', icon: Image, mobileLabel: 'MEEM\nLAB' },
  { path: '/game', label: 'GAME', icon: Gamepad2, mobileLabel: 'GAME' },
  { path: '/memebers-club', label: 'MEMBERS CLUB', icon: Users, mobileLabel: 'MEMBERS\nCLUB' },
  { path: '/roadmap', label: 'ROADMAP', icon: Map, mobileLabel: 'ROAD\nMAP' },
];

const SOCIAL_LINKS = [
  { href: 'https://t.me/MEEMfrends', icon: TelegramIcon, label: 'Telegram' },
  { href: 'https://x.com/meem_sol?s=21', icon: XIcon, label: 'X' },
];

export default function NavBar() {
  const location = useLocation();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(250, 250, 245, 0.92)',
        backdropFilter: 'blur(8px)',
        borderBottom: '3px solid #333',
      }}
    >
      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-1 sm:py-2 flex items-center gap-1">
        <Link to="/" className="flex items-center gap-1 no-underline shrink-0">
          <svg viewBox="0 0 40 40" width={28} height={28}>
            <circle cx="20" cy="20" r="17" fill="#f0d040" stroke="#333" strokeWidth="2.5" />
            <circle cx="20" cy="20" r="13" fill="#e8c830" stroke="#333" strokeWidth="1.5" />
            <text
              x="20" y="25"
              textAnchor="middle"
              fontFamily="'Patrick Hand', cursive"
              fontSize="12"
              fontWeight="bold"
              fill="#333"
            >
              M
            </text>
          </svg>
          <span
            className="hooey-title-sm hidden sm:inline"
            style={{ fontSize: '1.4rem', letterSpacing: '0.04em' }}
          >
            MEEM
          </span>
        </Link>

        <div className="flex items-center flex-1 justify-center gap-0.5 sm:gap-1">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="font-hand flex flex-col sm:flex-row items-center gap-0 sm:gap-1.5 no-underline transition-all duration-150"
                style={{
                  fontSize: 'clamp(0.55rem, 2.2vw, 1.1rem)',
                  color: active ? '#333' : '#888',
                  fontWeight: active ? 700 : 400,
                  background: active ? 'rgba(0,0,0,0.05)' : 'transparent',
                  border: active ? '2px solid #333' : '2px solid transparent',
                  transform: active ? 'rotate(-0.5deg)' : 'none',
                  padding: '4px 6px',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  whiteSpace: 'pre-line',
                }}
              >
                <Icon size={14} className="shrink-0" style={{ display: 'block' }} />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden" style={{ whiteSpace: 'pre-line' }}>{item.mobileLabel}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <MusicToggle />
          {SOCIAL_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="flex items-center justify-center p-1.5 transition-all duration-150"
                style={{
                  border: '2px solid #ccc',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#333';
                  e.currentTarget.style.transform = 'rotate(-2deg) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#ccc';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <Icon size={16} />
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
