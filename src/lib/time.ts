// Times are stored canonically in NY wall-clock (the trip happens there),
// but rendered in the user's device timezone — so a 7am-PT user pre-trip sees
// "08:20 PDT" for an 11:20 NY breakfast. Day boundaries (which day of the trip
// you're on) stay anchored to NY so "Day 3 / Wednesday" tracks the itinerary.

import { formatInTimeZone } from "date-fns-tz";
import { format } from "date-fns";

export const TRIP_TZ = "America/New_York";

/** IANA zone for the user's device (e.g., "America/Los_Angeles"). */
export function deviceTZ(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || TRIP_TZ;
  } catch {
    return TRIP_TZ;
  }
}

/** Short abbreviation for the device zone today (e.g., "PDT", "EDT", "JST"). */
export function deviceTZAbbr(d: Date = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZoneName: "short",
    }).formatToParts(d);
    return parts.find((p) => p.type === "timeZoneName")?.value || "";
  } catch {
    return "";
  }
}

/** Whole-hour offset between NY and the device. NY +N → device is N hours behind NY. */
export function offsetFromNYHours(d: Date = new Date()): number {
  const ny = Number(formatInTimeZone(d, TRIP_TZ, "X")) || 0; // unused but kept for clarity
  void ny;
  // Compute via formatted strings to avoid DST math headaches.
  const nyDate = new Date(formatInTimeZone(d, TRIP_TZ, "yyyy-MM-dd'T'HH:mm:ssXXX"));
  const localDate = new Date(d.getTime());
  return Math.round((localDate.getTime() - nyDate.getTime()) / 3_600_000);
}

/** Parse a "2026-05-04T11:20" string as NY wall-clock and return a real Date. */
export function parseNY(local: string): Date {
  // May 2026 is EDT (-04:00). Trip is fully inside DST so this is safe.
  return new Date(`${local}:00-04:00`);
}

/** 12-hour time, e.g., "11:20", in the device's zone. */
export function fmtTime(d: Date): string {
  return format(d, "h:mm");
}

/** 24-hour mono time, e.g., "18:42", in the device's zone. */
export function fmtTimeMono24(d: Date): string {
  return format(d, "HH:mm");
}

/** "am" / "pm" in the device's zone. */
export function fmtMeridiem(d: Date): string {
  return format(d, "a").toLowerCase();
}

/** Day key in NY ("yyyy-MM-dd") — anchors "what day of the trip" to NY. */
export function dayKey(d: Date): string {
  return formatInTimeZone(d, TRIP_TZ, "yyyy-MM-dd");
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/** True when the device is in the same zone as NY. */
export function deviceIsInNY(d: Date = new Date()): boolean {
  return deviceTZ() === TRIP_TZ || offsetFromNYHours(d) === 0;
}
