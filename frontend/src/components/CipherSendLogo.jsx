/**
 * CipherSend inline SVG logo mark — shield with lock.
 * `size` controls the width/height in pixels (default 32).
 * Using inline SVG keeps it theme-aware and avoids extra network requests.
 */
export default function CipherSendLogo({ size = 32, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      width={size}
      height={size}
      className={className}
      aria-label="CipherSend logo"
      role="img"
    >
      {/* Shield body */}
      <path
        d="M24 2L43 12V28C43 38 34 44.5 24 47C14 44.5 5 38 5 28V12L24 2Z"
        fill="hsl(217 33% 8%)"
        stroke="hsl(142 71% 45%)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Inner dashed highlight */}
      <path
        d="M24 6L39 14.5V27C39 35.5 32 41 24 43.5C16 41 9 35.5 9 27V14.5L24 6Z"
        fill="none"
        stroke="hsl(142 71% 45%)"
        strokeWidth="0.5"
        strokeLinejoin="round"
        strokeDasharray="1.5 2"
        opacity={0.35}
      />
      {/* Lock body */}
      <rect x="15.5" y="24" width="17" height="13" rx="3" fill="hsl(142 71% 45%)" />
      {/* Lock shackle */}
      <path
        d="M19 24V20C19 16.2 29 16.2 29 20V24"
        stroke="hsl(142 71% 45%)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Keyhole circle */}
      <circle cx="24" cy="29.5" r="2.2" fill="hsl(217 33% 8%)" />
      {/* Keyhole slot */}
      <rect x="22.8" y="30.5" width="2.4" height="4" rx="0.8" fill="hsl(217 33% 8%)" />
    </svg>
  );
}
