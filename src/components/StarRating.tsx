import React, { useState } from "react";

// Letterboxd-style split-half star.
// Each star is two clickable halves. Tap left half = .5, tap right half = full.
type Props = { value: number; onChange?: (v: number) => void; size?: number; readOnly?: boolean };

export function StarRating({ value, onChange, size = 28 }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;

  return (
    <div
      className="inline-flex items-center gap-1"
      onMouseLeave={() => setHover(null)}
      role="slider"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={5}
    >
      {[1, 2, 3, 4, 5].map((i) => {
        const leftFilled = display >= i - 0.5;
        const rightFilled = display >= i;
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star fillLeft={leftFilled} fillRight={rightFilled} size={size} />
            {/* Tap targets */}
            <button
              aria-label={`${i - 0.5} stars`}
              className="absolute inset-y-0 left-0 w-1/2"
              style={{ minWidth: 22, minHeight: 22 }}
              onMouseEnter={() => setHover(i - 0.5)}
              onClick={() => {
                if (value === i - 0.5) onChange?.(0);
                else onChange?.(i - 0.5);
              }}
            />
            <button
              aria-label={`${i} stars`}
              className="absolute inset-y-0 right-0 w-1/2"
              style={{ minWidth: 22, minHeight: 22 }}
              onMouseEnter={() => setHover(i)}
              onClick={() => {
                if (value === i) onChange?.(0);
                else onChange?.(i);
              }}
            />
          </span>
        );
      })}
    </div>
  );
}

export function StarFixed({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <div className="inline-flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          fillLeft={value >= i - 0.5}
          fillRight={value >= i}
          size={size}
        />
      ))}
    </div>
  );
}

function Star({ fillLeft, fillRight, size }: { fillLeft: boolean; fillRight: boolean; size: number }) {
  // Two halves drawn separately so a half-star is honest.
  const path =
    "M12 3.5 14.7 9.2 21 10.1 16.5 14.5 17.5 20.8 12 17.8z"; // right half (mirrored below)
  const leftPath = "M12 3.5 9.3 9.2 3 10.1 7.5 14.5 6.5 20.8 12 17.8z";
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <g
        fill="transparent"
        stroke="var(--rule)"
        strokeWidth="1.1"
        strokeLinejoin="round"
      >
        <path d={leftPath} fill={fillLeft ? "var(--accent)" : "transparent"} stroke={fillLeft ? "var(--accent)" : "var(--rule)"} />
        <path d={path} fill={fillRight ? "var(--accent)" : "transparent"} stroke={fillRight ? "var(--accent)" : "var(--rule)"} />
      </g>
    </svg>
  );
}
