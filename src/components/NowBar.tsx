import React from "react";
import { Day, Stop as StopT } from "../data/itinerary";
import { parseNY } from "../lib/time";
import { fmtTime, fmtMeridiem } from "../lib/time";

type Props = { day: Day; now: Date };

export function NowBar({ day, now }: Props) {
  const items = day.stops.map((s) => ({
    s,
    start: parseNY(s.start),
    end: s.end ? parseNY(s.end) : undefined,
  }));

  const current = items.find(
    ({ start, end }) => now >= start && now <= (end ?? new Date(start.getTime() + 30 * 60_000))
  );

  let next: typeof items[number] | undefined;
  let progressToNext = 0;
  if (!current) {
    next = items.find(({ start }) => start > now);
    if (next) {
      const prev = items
        .slice()
        .reverse()
        .find(({ end, start }) => (end ?? start) < now);
      const span = next.start.getTime() - (prev?.end?.getTime() ?? prev?.start.getTime() ?? next.start.getTime() - 30 * 60_000);
      const elapsed = now.getTime() - (prev?.end?.getTime() ?? prev?.start.getTime() ?? now.getTime());
      progressToNext = span > 0 ? Math.max(0, Math.min(1, elapsed / span)) : 0;
    }
  }

  if (!current && !next) return null;

  if (current) {
    const until = current.end ?? current.start;
    return (
      <div className="sticky top-0 z-20 mx-4 mt-2 rounded-sm bg-paper-2/95 p-3 ring-1 ring-rule/60">
        <div className="smallcaps text-accent">RIGHT NOW</div>
        <div className="mt-1 font-serif text-[19px] leading-snug">
          {current.s.title}
        </div>
        <div className="mt-1 font-mono text-[11px] text-ink-2">
          until {fmtTime(until)}{fmtMeridiem(until)}
        </div>
        {current.s.note && (
          <p className="mt-2 font-serif italic text-[14.5px] text-ink-2 leading-snug">
            {current.s.note}
          </p>
        )}
      </div>
    );
  }

  if (next) {
    const minsToNext = Math.max(0, Math.round((next.start.getTime() - now.getTime()) / 60000));
    return (
      <div className="sticky top-0 z-20 mx-4 mt-2 rounded-sm bg-paper-2/95 p-3 ring-1 ring-rule/60">
        <div className="smallcaps text-ink-2">UP NEXT · {minsToNext} MIN AWAY</div>
        <div className="mt-1 font-serif text-[19px] leading-snug">{next.s.title}</div>
        <div className="mt-1 font-mono text-[11px] text-ink-2">
          {fmtTime(next.start)}{fmtMeridiem(next.start)}
        </div>
        <div className="mt-2 h-px w-full bg-rule/50">
          <div
            className="h-px bg-accent transition-all duration-500 ease-ios"
            style={{ width: `${(progressToNext * 100).toFixed(0)}%` }}
          />
        </div>
      </div>
    );
  }
  return null;
}
