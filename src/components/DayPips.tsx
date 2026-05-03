import React from "react";
import { DAYS } from "../data/itinerary";

type Props = {
  active: number;
  todayIndex: number;
  onSelect: (i: number) => void;
};

export function DayPips({ active, todayIndex, onSelect }: Props) {
  return (
    <nav
      aria-label="Day"
      className="no-print fixed bottom-0 inset-x-0 z-30 flex justify-center pb-[max(env(safe-area-inset-bottom),12px)] pt-3"
    >
      <div className="flex items-center gap-3 rounded-full bg-paper/80 px-4 py-2 backdrop-blur-[2px]">
        {DAYS.map((d, i) => {
          const isToday = i === todayIndex;
          const isActive = i === active;
          return (
            <button
              key={d.id}
              onClick={() => onSelect(i)}
              aria-label={`${d.weekday}, ${d.ordinal}`}
              className="relative flex h-9 w-7 items-center justify-center"
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
