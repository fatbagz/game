export function PumpFunIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 C12 2 6 8 6 14 C6 17.3 8.7 20 12 20 C15.3 20 18 17.3 18 14 C18 8 12 2 12 2Z" />
      <path d="M12 20 L12 22" />
      <path d="M9 14 C9 14 10 16 12 16 C14 16 15 14 15 14" />
      <circle cx="10" cy="11" r="0.8" fill="#333" />
      <circle cx="14" cy="11" r="0.8" fill="#333" />
    </svg>
  );
}

export function TelegramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12 L22 3 L18 21 L13 14 L18 8 L9 13 L2 12Z" fill="none" />
      <path d="M13 14 L18 21" />
      <path d="M9 13 L13 20" />
    </svg>
  );
}

export function XIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21 L10.5 12.5" />
      <path d="M13.5 11.5 L21 3" />
      <path d="M3 3 L9.5 11" />
      <path d="M14.5 13 L21 21" />
    </svg>
  );
}
