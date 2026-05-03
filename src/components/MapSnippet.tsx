import React from "react";

type Props = { lat: number; lng: number; label?: string };

// Static, monochrome map snippet rendered inline as SVG.
// No external service needed. The point is "a sense of place," not navigation.
export function MapSnippet({ lat, lng, label }: Props) {
  // Pseudo-random but deterministic street pattern from lat/lng.
  const seed = Math.floor((lat * 1000 + lng * 1000) * 17) % 1000;
  const rng = (n: number) => {
    let x = (seed * (n + 7)) % 9301;
    return ((x * 9301 + 49297) % 233280) / 233280;
  };
  const lines = Array.from({ length: 14 }, (_, i) => {
    const horizontal = i % 2 === 0;
    const offset = (rng(i) * 0.9 + 0.05) * 100;
    return horizontal
      ? <line key={i} x1="0" y1={offset} x2="100" y2={offset} />
      : <line key={i} x1={offset} y1="0" x2={offset} y2="100" />;
  });

  return (
    <div className="relative h-[120px] w-full overflow-hidden bg-paper-2 ring-1 ring-rule/70">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full text-rule">
        <rect x="0" y="0" width="100" height="100" fill="currentColor" opacity="0.08" />
        <g stroke="currentColor" strokeWidth="0.4" opacity="0.55">{lines}</g>
        {/* park-like patch */}
        <rect x="58" y="20" width="22" height="14" fill="currentColor" opacity="0.18" />
      </svg>
      {/* You-are-here needle, hand-drawn style */}
      <svg
        viewBox="0 0 24 24"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-accent"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v18" />
        <path d="M12 2l4 6h-8z" fill="currentColor" />
      </svg>
      {label && (
        <span className="absolute bottom-1 right-2 smallcaps text-ink-2/80 mix-blend-multiply">
          {label}
        </span>
      )}
    </div>
  );
}
