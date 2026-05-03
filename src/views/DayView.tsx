import React, { useEffect, useMemo, useRef, useState } from "react";
import { Day, DAYS, Stop } from "../data/itinerary";
import { Capture, clearSwap, loadSwaps, saveSwap } from "../lib/storage";
import { dayKey, parseNY } from "../lib/time";
import { Masthead } from "../components/Masthead";
import { Timeline } from "../components/Timeline";
import { NowBar } from "../components/NowBar";
import { CaptureFAB } from "../components/CaptureFAB";
import { CaptureSheet } from "../components/CaptureSheet";
import { SwapSheet } from "../components/SwapSheet";
import { useCaptures } from "../hooks/useCaptures";

type Props = {
  now: Date;
  activeDayIndex: number;
  setActiveDayIndex: (i: number) => void;
  todayIndex: number;
  onOpenRecap: () => void;
};

export function DayView({ now, activeDayIndex, setActiveDayIndex, todayIndex, onOpenRecap }: Props) {
  const day = DAYS[activeDayIndex];
  const isToday = activeDayIndex === todayIndex;
  const { captures, add: _addCap } = useCaptures();
  void _addCap;

  const [captureOpen, setCaptureOpen] = useState(false);
  const [captureStop, setCaptureStop] = useState<Stop | undefined>();
  const [swapStop, setSwapStop] = useState<Stop | undefined>();
  const [swaps, setSwaps] = useState<Record<string, string>>({});

  useEffect(() => {
    loadSwaps().then(setSwaps);
  }, []);

  // Pick the stop most relevant to the moment for capture.
  const relevantStop = useMemo<Stop | undefined>(() => {
    if (!isToday) return day.stops[0];
    const items = day.stops.map((s) => ({ s, start: parseNY(s.start), end: s.end ? parseNY(s.end) : undefined }));
    const cur = items.find(({ start, end }) => now >= start && now <= (end ?? new Date(start.getTime() + 30 * 60_000)));
    if (cur) return cur.s;
    const past = items.slice().reverse().find(({ start }) => start <= now);
    return past?.s ?? items[0]?.s;
  }, [day, isToday, now]);

  // Day-swipe gestures.
  const touchX = useRef<number | null>(null);
  function onTouchStart(e: React.TouchEvent) {
    touchX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 80) {
      if (dx < 0 && activeDayIndex < DAYS.length - 1) setActiveDayIndex(activeDayIndex + 1);
      else if (dx > 0 && activeDayIndex > 0) setActiveDayIndex(activeDayIndex - 1);
    }
    touchX.current = null;
  }

  const greeting = greetingFor(now);

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="relative pb-32"
    >
      <Masthead day={day} isToday={isToday} dayIndex={activeDayIndex} total={DAYS.length} />

      {isToday && greeting && (
        <p className="px-6 -mt-2 mb-2 font-serif italic text-ink-2 text-[15px]">{greeting}</p>
      )}
      {!isToday && (
        <p className="px-6 -mt-2 mb-2 font-serif italic text-ink-2 text-[15px]">
          {relativeLabel(day.date, now)}
        </p>
      )}

      {isToday && <NowBar day={day} now={now} />}

      <Timeline
        day={day}
        now={now}
        isToday={isToday}
        captures={captures}
        onOpenSwap={(s) => setSwapStop(s)}
      />

      {/* Recap link, only on or after the last day */}
      {activeDayIndex >= DAYS.length - 1 && (
        <div className="mt-12 mb-24 px-6 text-center">
          <button onClick={onOpenRecap} className="btn-text">
            See the trip as a book
          </button>
        </div>
      )}

      <CaptureFAB
        onClick={() => {
          setCaptureStop(relevantStop);
          setCaptureOpen(true);
        }}
      />

      <CaptureSheet
        open={captureOpen}
        onClose={() => setCaptureOpen(false)}
        stop={captureStop}
        dayId={day.id}
        onSaved={() => {
          // captures hook re-fetches via state; nothing else to do.
        }}
      />

      <SwapSheet
        open={!!swapStop}
        onClose={() => setSwapStop(undefined)}
        stop={swapStop}
        currentSwap={swapStop ? swaps[swapStop.id] : undefined}
        onSwap={async (altId) => {
          if (!swapStop) return;
          const next = { ...swaps, [swapStop.id]: altId };
          setSwaps(next);
          await saveSwap(swapStop.id, altId);
        }}
        onClear={async () => {
          if (!swapStop) return;
          const next = { ...swaps };
          delete next[swapStop.id];
          setSwaps(next);
          await clearSwap(swapStop.id);
        }}
      />
    </div>
  );
}

function greetingFor(now: Date): string {
  const h = now.getHours();
  if (h < 9) return "Coffee first.";
  if (h < 12) return "Morning. Take it slow.";
  if (h < 14) return "Lunch hour.";
  if (h < 17) return "The afternoon.";
  if (h < 19) return "Golden hour, if there is one.";
  return "Tonight.";
}

function relativeLabel(activeDate: string, now: Date): string {
  // Compare calendar days in NY (matches dayKey logic).
  const today = dayKey(now);
  if (activeDate === today) return "";
  const diff = Math.round(
    (new Date(`${activeDate}T12:00:00-04:00`).getTime() -
      new Date(`${today}T12:00:00-04:00`).getTime()) /
      86_400_000
  );
  if (diff === 1) return "Tomorrow.";
  if (diff === -1) return "Yesterday.";
  if (diff > 1 && diff <= 6) return `In ${diff} days.`;
  if (diff < -1 && diff >= -6) return `${Math.abs(diff)} days ago.`;
  if (diff > 6) return "Soon.";
  return "Past.";
}
