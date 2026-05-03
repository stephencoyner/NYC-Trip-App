import React from "react";
import { Stop as StopT, Day } from "../data/itinerary";
import { Capture } from "../lib/storage";
import { fmtTimeMono24 } from "../lib/time";
import { PhotoFrame } from "./PhotoFrame";
import { MapSnippet } from "./MapSnippet";
import { StarFixed } from "./StarRating";

type State = "past" | "current" | "future";

type Props = {
  stop: StopT;
  day: Day;
  state: State;
  startDate: Date;
  endDate?: Date;
  captures: Capture[];
  onOpenSwap?: (s: StopT) => void;
};

export function Stop({ stop, state, startDate, endDate, captures, onOpenSwap }: Props) {
  const dim = state === "past";
  const ringed = state === "current";

  return (
    <article
      className={[
        "relative pl-10 pr-5 py-5",
        dim ? "opacity-55" : "",
      ].join(" ")}
    >
      {/* Spine node circle */}
      <span
        aria-hidden
        className={[
          "absolute left-[20px] top-7 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper",
          ringed
            ? "ring-2 ring-accent"
            : state === "past"
            ? "ring-1 ring-ink-2 bg-ink-2"
            : "ring-1 ring-rule",
        ].join(" ")}
      />
      {ringed && (
        <span
          aria-hidden
          className="absolute left-[20px] top-7 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-accent/40"
        />
      )}

      {/* Time block — left edge */}
      <div className="absolute left-0 top-5 -translate-x-2 w-9 text-right">
        <div className="font-mono text-[11px] tracking-tight text-ink-2">
          {fmtTimeMono24(startDate)}
        </div>
        {endDate && (
          <div className="font-mono text-[10px] text-ink-2/70">
            {fmtTimeMono24(endDate)}
          </div>
        )}
      </div>

      <header className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-serif text-[22px] leading-[1.15] tracking-tight">
            {stop.title}
          </h2>
          <div className="mt-1 smallcaps text-ink-2/90">
            {stop.neighborhood}
            {stop.address && (
              <>
                <span className="px-1.5 text-rule">·</span>
                <span className="normal-case tracking-normal font-mono text-[10.5px]">
                  {stop.address}
                </span>
              </>
            )}
          </div>
        </div>
        {stop.reservation && (
          <span className="shrink-0 self-start mt-1 font-mono text-[10px] text-ink-2 ring-1 ring-rule px-1.5 py-0.5">
            № {stop.reservation.number}
          </span>
        )}
      </header>

      {stop.note && (
        <p className="mt-3 font-serif italic text-[16.5px] leading-[1.5] text-ink max-w-[34ch]">
          {stop.note}
        </p>
      )}
      {stop.metaNote && (
        <p className="mt-2 font-serif text-[14.5px] leading-snug text-ink-2 max-w-[34ch] before:content-['—_'] before:text-ink-2/70">
          {stop.metaNote}
        </p>
      )}

      {stop.geo && (
        <div className="mt-4 max-w-[420px]">
          <MapSnippet lat={stop.geo.lat} lng={stop.geo.lng} label={stop.neighborhood} />
        </div>
      )}

      {captures.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2 max-w-[420px]">
          {captures.slice(0, 4).map((c) => (
            <CaptureCard key={c.id} c={c} />
          ))}
        </div>
      )}

      <footer className="mt-3 flex items-center gap-3 font-mono text-[10.5px] text-ink-2">
        {durationText(startDate, endDate) && (
          <span>{durationText(startDate, endDate)}</span>
        )}
        {stop.alternates && stop.alternates.length > 0 && (
          <button
            onClick={() => onOpenSwap?.(stop)}
            className="underline decoration-rule underline-offset-[3px] hover:text-ink"
          >
            · {stop.alternates.length} alternates
          </button>
        )}
      </footer>
    </article>
  );
}

function CaptureCard({ c }: { c: Capture }) {
  return (
    <div className="space-y-1">
      <PhotoFrame blobKey={c.photoBlobKey} ratio="square" />
      <div className="flex items-center justify-between">
        {c.rating !== undefined ? <StarFixed value={c.rating} /> : <span />}
        <span className="font-mono text-[10px] text-ink-2/80">
          {new Date(c.ts).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
      {c.note && (
        <p className="font-serif italic text-[13.5px] leading-snug text-ink-2">{c.note}</p>
      )}
    </div>
  );
}

function durationText(start: Date, end?: Date): string | null {
  if (!end) return null;
  const m = Math.round((end.getTime() - start.getTime()) / 60000);
  if (m <= 0) return null;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const r = m % 60;
    return r === 0 ? `${h} hr${h > 1 ? "s" : ""}` : `${h}h ${r}m`;
  }
  return `${m} min`;
}
