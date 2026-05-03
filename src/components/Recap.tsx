import React, { useEffect, useState } from "react";
import { DAYS, TRIP } from "../data/itinerary";
import { Capture, storageEstimate } from "../lib/storage";
import { PhotoFrame } from "./PhotoFrame";
import { StarFixed } from "./StarRating";

type Props = { captures: Capture[]; onClose: () => void };

export function Recap({ captures, onClose }: Props) {
  const [storage, setStorage] = useState<{ usedMB: number; quotaMB: number } | undefined>();
  useEffect(() => {
    storageEstimate().then(setStorage);
  }, [captures.length]);

  const ratings = captures.map((c) => c.rating || 0).filter(Boolean);
  const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

  // "Best of": top-rated stop and most-photographed stop.
  const byStop: Record<string, Capture[]> = {};
  captures.forEach((c) => {
    byStop[c.stopId] ||= [];
    byStop[c.stopId].push(c);
  });
  const allStops = DAYS.flatMap((d) => d.stops);
  const stopFor = (id: string) => allStops.find((s) => s.id === id);

  const topStopId = Object.entries(byStop)
    .map(([id, cs]) => [id, cs.reduce((a, c) => Math.max(a, c.rating || 0), 0)] as const)
    .sort((a, b) => b[1] - a[1])[0]?.[0];
  const mostPhotosId = Object.entries(byStop)
    .map(([id, cs]) => [id, cs.filter((c) => c.photoBlobKey).length] as const)
    .sort((a, b) => b[1] - a[1])[0]?.[0];
  const longestNote = captures
    .filter((c) => c.note)
    .sort((a, b) => (b.note?.length || 0) - (a.note?.length || 0))[0];

  const allCompanions = Array.from(
    new Set(captures.flatMap((c) => c.companions || []))
  );

  return (
    <article className="min-h-screen bg-paper">
      <div className="no-print sticky top-0 z-30 flex items-center justify-between bg-paper/85 px-5 py-3 ring-1 ring-rule/40 backdrop-blur-[2px]">
        <button onClick={onClose} className="font-mono text-[12px] text-ink-2">
          ← back to today
        </button>
        <button onClick={() => window.print()} className="btn-text">
          Print
        </button>
      </div>

      {/* Cover spread */}
      <section className="print-page relative px-8 pt-20 pb-16 text-center">
        <span className="smallcaps text-ink-2">A trip · {TRIP.startDate} → {TRIP.endDate}</span>
        <h1 className="mt-6 font-serif italic font-light leading-[0.98] text-[64px] sm:text-[88px]">
          New York,
          <br />
          <span className="not-italic">in May.</span>
        </h1>
        <div className="mx-auto mt-12 max-w-md">
          <PhotoFrame
            blobKey={captures.find((c) => c.photoBlobKey)?.photoBlobKey}
            ratio="wide"
          />
        </div>
        {/* Tea-stain ring, off-axis, used once. */}
        <svg
          aria-hidden
          className="pointer-events-none absolute right-6 bottom-10 opacity-50"
          width="96"
          height="96"
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="36" fill="none" stroke="#8a6a3a" strokeWidth="1.2" />
          <circle cx="50" cy="50" r="33" fill="none" stroke="#8a6a3a" strokeWidth="0.5" opacity="0.5" />
        </svg>
      </section>

      {/* Per-day spreads */}
      {DAYS.map((d) => {
        const dayCaps = captures.filter((c) => c.dayId === d.id);
        const dayStops = d.stops.filter((s) => dayCaps.some((c) => c.stopId === s.id));
        const dayAvg = dayCaps.length
          ? dayCaps.map((c) => c.rating || 0).filter(Boolean).reduce((a, b) => a + b, 0) /
            (dayCaps.filter((c) => c.rating).length || 1)
          : 0;
        return (
          <section key={d.id} className="print-page border-t border-rule/60 px-8 py-12">
            <header className="mb-8 flex items-baseline justify-between">
              <h2 className="font-serif italic text-[28px] sm:text-[36px]">
                {d.weekday}
              </h2>
              <span className="smallcaps text-ink-2">
                {d.ordinal}
              </span>
            </header>
            {dayStops.length === 0 && (
              <p className="font-serif italic text-ink-2">— a quiet day —</p>
            )}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {dayStops.map((s) => {
                const sc = dayCaps.filter((c) => c.stopId === s.id);
                const photo = sc.find((c) => c.photoBlobKey);
                const note = sc.find((c) => c.note);
                const rating = Math.max(...sc.map((c) => c.rating || 0));
                return (
                  <article key={s.id}>
                    {photo && <PhotoFrame blobKey={photo.photoBlobKey} ratio="wide" />}
                    <h3 className="mt-3 font-serif text-[22px] leading-snug">{s.title}</h3>
                    <div className="mt-1 smallcaps text-ink-2">{s.neighborhood}</div>
                    {rating > 0 && (
                      <div className="mt-2"><StarFixed value={rating} size={16} /></div>
                    )}
                    {note?.note && (
                      <p className="mt-2 font-serif italic text-[15px] text-ink-2 leading-snug max-w-[34ch]">
                        {note.note}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
            {dayCaps.length > 0 && (
              <footer className="mt-8 font-mono text-[11px] text-ink-2">
                {dayStops.length} stop{dayStops.length === 1 ? "" : "s"}
                {dayAvg > 0 && (
                  <>
                    <span className="px-2 text-rule">·</span>
                    avg {dayAvg.toFixed(1)}
                  </>
                )}
              </footer>
            )}
          </section>
        );
      })}

      {/* Back-cover spread */}
      <section className="print-page border-t border-rule/60 px-8 py-16">
        <h2 className="font-serif italic text-[32px] mb-8">A few things</h2>
        <dl className="space-y-6 max-w-prose">
          {topStopId && (
            <div>
              <dt className="smallcaps text-ink-2">Best of</dt>
              <dd className="mt-1 font-serif text-[20px]">{stopFor(topStopId)?.title}</dd>
            </div>
          )}
          {mostPhotosId && mostPhotosId !== topStopId && (
            <div>
              <dt className="smallcaps text-ink-2">Most photographed</dt>
              <dd className="mt-1 font-serif text-[20px]">{stopFor(mostPhotosId)?.title}</dd>
            </div>
          )}
          {longestNote?.note && (
            <div>
              <dt className="smallcaps text-ink-2">Note to self</dt>
              <dd className="mt-2 font-serif italic text-[20px] leading-snug max-w-[36ch] before:content-['“'] before:mr-1 before:text-ink-2">
                {longestNote.note}
              </dd>
            </div>
          )}
          {allCompanions.length > 0 && (
            <div>
              <dt className="smallcaps text-ink-2">With</dt>
              <dd className="mt-1 font-serif text-[18px]">{allCompanions.join(", ")}</dd>
            </div>
          )}
          <div>
            <dt className="smallcaps text-ink-2">Average</dt>
            <dd className="mt-1"><StarFixed value={Math.round(avg * 2) / 2} size={20} /></dd>
          </div>
          {storage && (
            <div>
              <dt className="smallcaps text-ink-2">On this device</dt>
              <dd className="mt-1 font-mono text-[12px] text-ink-2">
                {storage.usedMB.toFixed(1)} MB used
                {storage.quotaMB > 0 && (
                  <> · {Math.round((storage.usedMB / storage.quotaMB) * 100)}% of {Math.round(storage.quotaMB)} MB</>
                )}
              </dd>
            </div>
          )}
        </dl>
      </section>
    </article>
  );
}
