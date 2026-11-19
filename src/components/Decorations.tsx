/** Decorative gold/ink flourishes. Purely visual — hidden from assistive tech. */

export function CanvasFlourish({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 400"
      className={className}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMaxYMin slice"
    >
      <defs>
        <linearGradient id="cf-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde3bb" />
          <stop offset="45%" stopColor="#f3ab58" />
          <stop offset="100%" stopColor="#dd8a2a" />
        </linearGradient>
        <linearGradient id="cf-gold-soft" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#fdf1e2" />
          <stop offset="100%" stopColor="#f6c489" />
        </linearGradient>
        <linearGradient id="cf-ink" x1="0.15" y1="0" x2="0.95" y2="1">
          <stop offset="0%" stopColor="#1c1612" />
          <stop offset="100%" stopColor="#090706" />
        </linearGradient>
      </defs>

      {/* pale peach swoosh, furthest from the corner */}
      <path
        d="M10 -12C150 140 240 194 380 252c140 58 240 104 420 180V-12z"
        fill="url(#cf-gold-soft)"
        opacity="0.6"
      />
      {/* ink mass filling the corner */}
      <path
        d="M130 -12C250 110 330 150 470 205c140 55 220 95 330 160V-12z"
        fill="url(#cf-ink)"
      />
      {/* heavy gold ribbon riding the ink edge */}
      <path
        d="M140 -8C250 118 322 159 452 215c130 56 208 96 348 165"
        stroke="url(#cf-gold)"
        strokeWidth="17"
        fill="none"
        strokeLinecap="round"
      />
      {/* trailing thinner ribbon */}
      <path
        d="M95 -8C210 128 288 174 420 231c132 57 212 99 365 169"
        stroke="url(#cf-gold)"
        strokeWidth="5"
        fill="none"
        opacity="0.7"
        strokeLinecap="round"
      />
      {/* filament inside the ink */}
      <path
        d="M300 -12c100 102 170 142 280 192 110 50 160 85 220 120"
        stroke="url(#cf-gold)"
        strokeWidth="2.6"
        fill="none"
        opacity="0.85"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SidebarFlourish({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 150" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="sf-gold" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#dd8a2a" />
          <stop offset="55%" stopColor="#f3b063" />
          <stop offset="100%" stopColor="#fde2bb" />
        </linearGradient>
      </defs>
      <path
        d="M-20 96c62-12 90-54 158-56 54-2 84 22 132 18v102H-20z"
        fill="url(#sf-gold)"
        opacity="0.92"
      />
      <path
        d="M-20 72c66-14 96-54 164-56 52-2 82 22 126 18"
        stroke="url(#sf-gold)"
        strokeWidth="4"
        fill="none"
        opacity="0.5"
        strokeLinecap="round"
      />
      <path
        d="M-20 48c70-16 100-52 170-54 50-2 78 20 120 16"
        stroke="url(#sf-gold)"
        strokeWidth="2"
        fill="none"
        opacity="0.26"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function QuoteFlourish({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 220" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="qf-gold" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#d98f35" />
          <stop offset="50%" stopColor="#f3b063" />
          <stop offset="100%" stopColor="#fbe0b6" />
        </linearGradient>
      </defs>
      <path
        d="M-20 196c72-10 108-56 180-58 56-2 86 24 128 20 44-4 70-34 118-40 36-4 68 6 114 2v108H-20z"
        fill="url(#qf-gold)"
        opacity="0.22"
      />
      <path
        d="M-20 172c76-12 112-56 186-58 58-2 88 24 132 20"
        stroke="url(#qf-gold)"
        strokeWidth="3"
        fill="none"
        opacity="0.55"
        strokeLinecap="round"
      />
      <path
        d="M330 -16c44 34 34 62 76 86 30 17 70 12 128 6"
        stroke="url(#qf-gold)"
        strokeWidth="3"
        fill="none"
        opacity="0.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Hand-drawn underline swash used beneath "2027" and the quote. */
export function Swash({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 34" className={className} aria-hidden="true" focusable="false">
      <path
        d="M6 22c40 10 92 10 128-2 18-6 28-14 22-18-6-4-20 4-14 12 6 8 40 14 72 6"
        stroke="currentColor"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Rays around the "today" dot in the calendar. */
export function SunburstRays({ className = "" }: { className?: string }) {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      {rays.map((deg) => (
        <line
          key={deg}
          x1="32"
          y1="2.5"
          x2="32"
          y2="10"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
    </svg>
  );
}
