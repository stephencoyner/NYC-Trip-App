import React from "react";
import { googleMapsPlaceUrl, hasMapbox, staticMapUrl } from "../lib/maps";

type Props = {
  lat?: number;
  lng?: number;
  address?: string;
  title?: string;
  neighborhood?: string;
  label?: string;
};

export function MapSnippet({ lat, lng, address, title, neighborhood, label }: Props) {
  const haveCoords = typeof lat === "number" && typeof lng === "number";
  const mapboxSrc = haveCoords ? staticMapUrl({ lat: lat!, lng: lng!, zoom: 15 }) : null;
  const href = googleMapsPlaceUrl({
    geo: haveCoords ? { lat: lat!, lng: lng! } : undefined,
    address,
    title,
    neighborhood,
  });

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open ${title || address || "this place"} in Google Maps`}
      className="relative block h-[120px] w-full overflow-hidden bg-paper-2 ring-1 ring-rule/70 active:opacity-90 transition-opacity duration-150 ease-ios"
    >
      {mapboxSrc ? (
        <img
          src={mapboxSrc}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            filter: "saturate(0.55) sepia(0.16) brightness(0.97) contrast(0.96)",
            mixBlendMode: "multiply",
          }}
        />
      ) : haveCoords ? (
        <SvgGrid lat={lat!} lng={lng!} />
      ) : (
        <SvgGrid lat={40.71} lng={-73.99} />
      )}

      {/* "You are here" needle — single source of truth, regardless of map source. */}
      <svg
        viewBox="0 0 24 24"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[68%] text-accent"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 2v18" />
        <path d="M12 2l4 6h-8z" fill="currentColor" />
      </svg>

      {label && (
        <span className="absolute bottom-1 right-2 smallcaps text-ink-2/80 mix-blend-multiply">
          {label}
        </span>
      )}
      {!hasMapbox() && (
        <span className="absolute bottom-1 left-2 font-mono text-[9px] text-ink-2/60 mix-blend-multiply">
          tap for maps
        </span>
      )}
    </a>
  );
}

function SvgGrid({ lat, lng }: { lat: number; lng: number }) {
  const seed = Math.floor((lat * 1000 + lng * 1000) * 17) % 1000;
  const rng = (n: number) => {
    const x = (seed * (n + 7)) % 9301;
    return ((x * 9301 + 49297) % 233280) / 233280;
  };
  const lines = Array.from({ length: 14 }, (_, i) => {
    const horizontal = i % 2 === 0;
    const offset = (rng(i) * 0.9 + 0.05) * 100;
    return horizontal ? (
      <line key={i} x1="0" y1={offset} x2="100" y2={offset} />
    ) : (
      <line key={i} x1={offset} y1="0" x2={offset} y2="100" />
    );
  });
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full text-rule"
      aria-hidden
    >
      <rect x="0" y="0" width="100" height="100" fill="currentColor" opacity="0.08" />
      <g stroke="currentColor" strokeWidth="0.4" opacity="0.55">
        {lines}
      </g>
      <rect x="58" y="20" width="22" height="14" fill="currentColor" opacity="0.18" />
    </svg>
  );
}
