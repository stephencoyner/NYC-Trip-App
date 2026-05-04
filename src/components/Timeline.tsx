import React from "react";
import { Day, Stop as StopT } from "../data/itinerary";
import { Capture } from "../lib/storage";
import { parseNY } from "../lib/time";
import { googleMapsDirectionsUrl, inferMode } from "../lib/maps";
import { Stop } from "./Stop";

type Props = {
  day: Day;
  now: Date;
  isToday: boolean;
  captures: Capture[];
  onOpenSwap?: (s: StopT) => void;
  onEditCapture?: (c: Capture) => void;
};

export function Timeline({ day, now, isToday, captures, onOpenSwap, onEditCapture }: Props) {
  const items = day.stops.map((s) => ({
    stop: s,
    start: parseNY(s.start),
    end: s.end ? parseNY(s.end) : undefined,
  }));

  function classifyState(start: Date, end?: Date): "past" | "current" | "future" {
    if (!isToday) return "future";
    const e = end ?? new Date(start.getTime() + 30 * 60_000);
    if (now > e) return "past";
    if (now >= start && now <= e) return "current";
    return "future";
  }

  const currentIdx = isToday
    ? items.findIndex(({ start, end }) => classifyState(start, end) === "current")
    : -1;

  return (
    <div className="relative">
      {/* The dashed spine */}
      <div className="pointer-events-none absolute left-[60px] top-0 bottom-0 w-px spine" aria-hidden />

      <ol className="divide-y divide-rule/40">
        {items.map(({ stop, start, end }, i) => {
          const state = classifyState(start, end);
          const next = items[i + 1];
          const stopCaptures = captures.filter((c) => c.stopId === stop.id);
          return (
            <li key={stop.id} className="relative">
              <Stop
                stop={stop}
                day={day}
                state={state}
                startDate={start}
                endDate={end}
                captures={stopCaptures}
                onOpenSwap={onOpenSwap}
                onEditCapture={onEditCapture}
              />

              {/* Now-line, drawn at the bottom of the current stop (so it sits inside its block) */}
              {state === "current" && (
                <NowLine now={now} start={start} end={end} />
              )}

              {next && next.stop.fromPrev && (
                <BetweenLabel from={stop} to={next.stop} text={next.stop.fromPrev || ""} />
              )}
            </li>
          );
        })}
      </ol>

      {/* Empty-state for unscheduled time (after last stop) */}
      {currentIdx === -1 && isToday && (
        <p className="px-6 py-6 font-mono text-[11px] text-ink-2 italic">— wandering —</p>
      )}
    </div>
  );
}

function NowLine({ now, start, end }: { now: Date; start: Date; end?: Date }) {
  const e = end ?? new Date(start.getTime() + 30 * 60_000);
  const total = e.getTime() - start.getTime();
  const t = Math.max(0, Math.min(1, (now.getTime() - start.getTime()) / total));
  return (
    <div
      className="pointer-events-none absolute left-0 right-0 z-10 flex items-center"
      style={{ top: `calc(${(t * 100).toFixed(2)}% + 24px)` }}
      aria-hidden
    >
      <span className="ml-[60px] -translate-x-1/2 h-2 w-2 rounded-full bg-accent" />
      <span className="flex-1 h-[1.5px] bg-accent" />
      <span className="smallcaps text-accent pr-4">NOW</span>
    </div>
  );
}

function BetweenLabel({ from, to, text }: { from: StopT; to: StopT; text: string }) {
  if (!text || text === "—") return null;
  const url = googleMapsDirectionsUrl({
    origin: { geo: from.geo, address: from.address, title: from.title, neighborhood: from.neighborhood },
    destination: { geo: to.geo, address: to.address, title: to.title, neighborhood: to.neighborhood },
    mode: inferMode(text),
  });
  return (
    <div className="relative pl-[76px] pr-5 py-2">
      <span aria-hidden className="absolute left-[60px] top-0 bottom-0 w-px spine" />
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-baseline gap-1 font-mono text-[10.5px] text-ink-2/80 underline decoration-rule decoration-1 underline-offset-[3px] hover:text-ink active:text-ink"
      >
        — {text} →
      </a>
    </div>
  );
}
