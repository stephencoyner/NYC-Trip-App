// Hand-drawn-feeling line glyphs. 1.25px stroke. Match the type's weight.
import React from "react";

type Props = { size?: number; className?: string; strokeWidth?: number };

const base = (sw = 1.25): React.SVGProps<SVGSVGElement> => ({
  fill: "none",
  stroke: "currentColor",
  strokeWidth: sw,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

export const SunIcon = ({ size = 14, className, strokeWidth }: Props) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...base(strokeWidth)}>
    <circle cx="12" cy="12" r="3.5" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
  </svg>
);

export const PartCloudIcon = ({ size = 14, className, strokeWidth }: Props) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...base(strokeWidth)}>
    <circle cx="9" cy="9" r="3" />
    <path d="M9 5V4M5 9H4M6 6 5 5M13 6l1-1" />
    <path d="M8 17h9a3 3 0 0 0 0-6 4 4 0 0 0-7.6-1" />
  </svg>
);

export const CloudIcon = ({ size = 14, className, strokeWidth }: Props) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...base(strokeWidth)}>
    <path d="M7 17h11a3.5 3.5 0 0 0 0-7 5 5 0 0 0-9.6-1A4 4 0 0 0 7 17z" />
  </svg>
);

export const RainIcon = ({ size = 14, className, strokeWidth }: Props) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...base(strokeWidth)}>
    <path d="M7 14h11a3.5 3.5 0 0 0 0-7 5 5 0 0 0-9.6-1A4 4 0 0 0 7 14z" />
    <path d="M9 17l-1 3M13 17l-1 3M17 17l-1 3" />
  </svg>
);

export const CameraIcon = ({ size = 18, className, strokeWidth }: Props) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...base(strokeWidth)}>
    <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
    <circle cx="12" cy="13.5" r="3.5" />
  </svg>
);

export const PenIcon = ({ size = 18, className, strokeWidth }: Props) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...base(strokeWidth)}>
    <path d="M4 20h4l10-10-4-4L4 16v4z" />
    <path d="M14 6l4 4" />
  </svg>
);

export const StarOutline = ({ size = 18, className, strokeWidth }: Props) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...base(strokeWidth)}>
    <path d="m12 3.5 2.7 5.7 6.3.9-4.5 4.4 1 6.3L12 17.8 6.5 20.8l1-6.3L3 10.1l6.3-.9z" />
  </svg>
);

export const MicIcon = ({ size = 16, className, strokeWidth }: Props) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...base(strokeWidth)}>
    <rect x="9" y="3" width="6" height="12" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
  </svg>
);

export const PlusIcon = ({ size = 14, className, strokeWidth }: Props) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...base(strokeWidth)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const CloseIcon = ({ size = 16, className, strokeWidth }: Props) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...base(strokeWidth)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const ChevronLeft = ({ size = 16, className, strokeWidth }: Props) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...base(strokeWidth)}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

export const ChevronRight = ({ size = 16, className, strokeWidth }: Props) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...base(strokeWidth)}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);

export const ArrowDownIcon = ({ size = 14, className, strokeWidth }: Props) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...base(strokeWidth)}>
    <path d="M12 4v15M6 13l6 6 6-6" />
  </svg>
);

export const NeedleIcon = ({ size = 18, className, strokeWidth }: Props) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...base(strokeWidth)}>
    <path d="M12 3v18M12 3l3 5h-6z" />
  </svg>
);

export function WeatherGlyph({ glyph, size = 14, className }: { glyph: "sun" | "cloud" | "rain" | "part"; size?: number; className?: string }) {
  if (glyph === "sun") return <SunIcon size={size} className={className} />;
  if (glyph === "rain") return <RainIcon size={size} className={className} />;
  if (glyph === "part") return <PartCloudIcon size={size} className={className} />;
  return <CloudIcon size={size} className={className} />;
}
