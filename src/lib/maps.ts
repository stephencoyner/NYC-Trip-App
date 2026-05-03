// Mapbox + Google Maps deep-link helpers.
// Mapbox is optional: when VITE_MAPBOX_TOKEN is set we render a real static
// map; otherwise we fall back to the in-house SVG grid in MapSnippet.

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

export function hasMapbox(): boolean {
  return !!MAPBOX_TOKEN && MAPBOX_TOKEN.length > 0;
}

type StaticMapOpts = {
  lat: number;
  lng: number;
  zoom?: number;
  width?: number;
  height?: number;
  /** When true, ask Mapbox to draw its own teardrop pin. We default to false
   *  and overlay a custom needle in the React component. */
  serverPin?: boolean;
};

export function staticMapUrl(opts: StaticMapOpts): string | null {
  if (!hasMapbox()) return null;
  const { lat, lng, zoom = 15, width = 640, height = 260, serverPin = false } = opts;
  const overlay = serverPin ? `pin-s+9a2a1f(${lng},${lat})/` : "";
  const w = Math.min(Math.round(width), 1280);
  const h = Math.min(Math.round(height), 1280);
  return (
    `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/` +
    `${overlay}${lng},${lat},${zoom}/${w}x${h}@2x?access_token=${MAPBOX_TOKEN}`
  );
}

type Place = {
  geo?: { lat: number; lng: number };
  address?: string;
  title?: string;
  neighborhood?: string;
};

function placeQuery(p: Place): string {
  if (p.geo) return `${p.geo.lat},${p.geo.lng}`;
  const parts = [p.title, p.address, p.neighborhood].filter(Boolean);
  return encodeURIComponent(parts.join(", "));
}

export function googleMapsPlaceUrl(p: Place): string {
  return `https://www.google.com/maps/search/?api=1&query=${placeQuery(p)}`;
}

export function googleMapsDirectionsUrl(opts: {
  origin: Place;
  destination: Place;
  mode?: "walking" | "driving" | "transit" | "bicycling";
}): string {
  const o = placeQuery(opts.origin);
  const d = placeQuery(opts.destination);
  const m = opts.mode || "walking";
  return `https://www.google.com/maps/dir/?api=1&origin=${o}&destination=${d}&travelmode=${m}`;
}

/** Heuristic: read mode from a "fromPrev" string like "30 min · F train" or "8 min walk". */
export function inferMode(text: string): "walking" | "driving" | "transit" {
  const t = text.toLowerCase();
  if (/\b(cab|lyft|uber|drive|driving|car)\b/.test(t)) return "driving";
  if (/\b(walk|walking|foot|block|blocks)\b/.test(t)) return "walking";
  if (/(train|subway|bus|ferry|metro|q70|f to|l to|e to|7 to|m to|r to|n\/|q\/|f\/|l\/)/.test(t))
    return "transit";
  return "walking";
}
