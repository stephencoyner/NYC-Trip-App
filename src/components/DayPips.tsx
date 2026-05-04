import React from "react";
import { DAYS } from "../data/itinerary";

type Props = {
  active: number;
  todayIndex: number;
  onSelect: (i: number) => void;
};

// Vertical math: center-aligned with the FAB.
// FAB bottom = safe-area + 16px, height 56  → center at safe-area + 44.
// Pip bottom = safe-area + 30px, height 28  → center at safe-area + 44.
const PIPS_BOTTOM = "calc(env(safe-area-inset-bottom, 0px) + 30px)";

export function DayPips({ active, todayIndex, onSelect }: Props) {
  return (
    <nav
      aria-label="Day"
      className="no-print fixed left-1/2 -translate-x-1/2 z-30"
      style={{ bottom: PIPS_BOTTOM }}
    >
      <div className="flex h-7 items-center gap-3 rounded-full bg-paper px-4 ring-1 ring-ink/70">
        {DAYS.map((d, i) => {
          const isToday = i === todayIndex;
          const isActive = i === active;
          return (
            <button
              key={d.id}
              onClick={() => onSelect(i)}
              aria-label={`${d.weekday}, ${d.ordinal}`}
              className="relative flex h-7 w-6 items-center justify-center"
            >
              <span
                className={[
                  "block rounded-full transition-all duration-200 ease-ios",
                  isToday ? "bg-accent" : isActive ? "bg-ink" : "bg-transparent ring-1 ring-ink/40",
                  isActive ? "h-2.5 w-2.5" : "h-1.5 w-1.5",
                ].join(" ")}
              />
              {isToday && !isActive && (
                <span className="absolute -bottom-0.5 text-[8px] font-mono text-accent">·</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
