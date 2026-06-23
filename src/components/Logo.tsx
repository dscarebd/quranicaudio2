export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 22 Q16 4 32 14 Q48 4 62 22 Q48 16 32 24 Q16 16 2 22 Z"
        fill="currentColor"
      />
      <path d="M30 14 L32 6 L34 14 Z" fill="currentColor" />
    </svg>
  );
}
