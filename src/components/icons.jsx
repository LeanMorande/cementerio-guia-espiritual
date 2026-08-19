/* =====================================================================
   COMPONENTS / icons.jsx — iconos SVG inline.
   ===================================================================== */

const base = (p) => ({
  width: p.s || 20,
  height: p.s || 20,
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": "true",
});

export const Ic = {
  Play: (p) => (
    <svg {...base(p)}>
      <path d="M8 5.5v13l11-6.5z" />
    </svg>
  ),
  Pause: (p) => (
    <svg {...base(p)}>
      <path d="M7 5h3.6v14H7zM13.4 5H17v14h-3.6z" />
    </svg>
  ),
  Back10: (p) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.5 7A7.5 7.5 0 1 1 5 14" />
      <path d="M3.5 5.5v4.5H8" />
    </svg>
  ),
  ChR: (p) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9.5 6 6 6-6 6" />
    </svg>
  ),
  ChL: (p) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="m14.5 6-6 6 6 6" />
    </svg>
  ),
  Close: (p) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  ),
  Note: (p) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V6l10-2v11" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="16.5" cy="15" r="2.5" />
    </svg>
  ),
  Img: (p) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <circle cx="9" cy="10" r="1.8" />
      <path d="m5 19 5.5-5.5 3 3L17 13l4 4" />
    </svg>
  ),
  Cross: (p) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M12 3v18M7 8.5h10" />
    </svg>
  ),
  Qr: (p) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM21 14h.01M14 21h.01M18 18h3v3h-3z" />
    </svg>
  ),
  Gear: (p) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19 12a7 7 0 0 0-.15-1.45l2-1.55-2-3.45-2.35.95a7 7 0 0 0-2.5-1.45L13.6 2.6h-3.2L10 5.1a7 7 0 0 0-2.5 1.45l-2.35-.95-2 3.45 2 1.55A7 7 0 0 0 5 12c0 .49.05.97.15 1.45l-2 1.55 2 3.45 2.35-.95a7 7 0 0 0 2.5 1.45l.4 2.5h3.2l.4-2.5a7 7 0 0 0 2.5-1.45l2.35.95 2-3.45-2-1.55c.1-.48.15-.96.15-1.45Z" />
    </svg>
  ),
};
