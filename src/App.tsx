import React, { useEffect, useMemo, useState } from "react";
import { DAYS, TRIP } from "./data/itinerary";
import { dayKey, parseNY } from "./lib/time";
import { useNow } from "./hooks/useNow";
import { DayView } from "./views/DayView";
import { DayPips } from "./components/DayPips";
import { useCaptures } from "./hooks/useCaptures";
import { Recap } from "./components/Recap";

export default function App() {
  const now = useNow(30_000);

  // The active day defaults to "today if in trip, otherwise day 1."
  const todayIndex = useMemo(() => {
    const k = dayKey(now);
    const i = DAYS.findIndex((d) => d.date === k);
    return i;
  }, [now]);

  const [active, setActive] = useState<number>(() => {
    const k = dayKey(new Date());
    const i = DAYS.findIndex((d) => d.date === k);
    return i >= 0 ? i : 0;
  });

  // Auto-fade to recap after the trip ends.
  const tripEnded = now > parseNY(`${TRIP.endDate}T23:59`);
  const [recapOpen, setRecapOpen] = useState(false);
  useEffect(() => {
    if (tripEnded) setRecapOpen(true);
  }, [tripEnded]);

  const { captures } = useCaptures();

  useEffect(() => {
    document.documentElement.setAttribute("lang", "en");
  }, []);

  if (recapOpen) {
    return <Recap captures={captures} onClose={() => setRecapOpen(false)} />;
  }

  return (
    <main className="mx-auto max-w-[640px]">
      <DayView
        now={now}
        activeDayIndex={active}
        setActiveDayIndex={setActive}
        todayIndex={todayIndex}
        onOpenRecap={() => setRecapOpen(true)}
      />
      <DayPips
        active={active}
        todayIndex={todayIndex}
        onSelect={setActive}
      />
    </main>
  );
}
