// All time math is done in NY local time. The trip is in May 2026.
// Device timezone is irrelevant — we hardcode America/New_York.

import { formatInTimeZone, toZonedTime } from "date-fns-tz";

export const TZ = "America/New_York";

export function nowNY(): Date {
  return toZonedTime(new Date(), TZ);
}

/** Parse a "2026-05-04T11:20" string as NY local time and return a Date. */
export function parseNY(local: string): Date {
  // Treat the input as wall-clock NY time. We append the offset the trip falls in (DST in May → -04:00).
  return new Date(`${local}:00-04:00`);
}

export function fmtTime(d: Date): string {
  return formatInTimeZone(d, TZ, "h:mm");
}

export function fmtTimeMono24(d: Date): string {
  return formatInTimeZone(d, TZ, "HH:mm");
}

export function fmtMeridiem(d: Date): string {
  return formatInTimeZone(d, TZ, "a").toLowerCase();
}

export function dayKey(d: Date): string {
  return formatInTimeZone(d, TZ, "yyyy-MM-dd");
}

export function minutesSinceStartOfDay(d: Date): number {
  const h = parseInt(formatInTimeZone(d, TZ, "H"), 10);
  const m = parseInt(formatInTimeZone(d, TZ, "m"), 10);
  return h * 60 + m;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}
