import React from "react";

export const ALL_MOODS = [
  "quiet",
  "loud",
  "delicious",
  "worth it",
  "overrated",
  "crowded",
  "transporting",
  "hungry",
  "wandering",
  "with rain",
  "golden hour",
  "again next time",
];

type Props = {
  selected: string[];
  recent?: string[];
  onToggle: (m: string) => void;
};

export function MoodChips({ selected, recent = [], onToggle }: Props) {
  // Recent moods float to the front of the list, then the rest, deduped.
  const ordered = [
    ...recent.filter((m) => ALL_MOODS.includes(m)),
    ...ALL_MOODS.filter((m) => !recent.includes(m)),
  ];
  return (
    <div className="-mx-6 px-6 overflow-x-auto no-scrollbar">
      <div className="flex w-max gap-2 py-1">
        {ordered.map((m) => {
          const on = selected.includes(m);
          return (
            <button
              key={m}
              onClick={() => onToggle(m)}
              className={[
                "shrink-0 rounded-full px-3 py-1.5 text-[13px] tracking-tight ring-1 transition-colors duration-150 ease-ios",
                on
                  ? "bg-accent-soft/60 ring-ink/40 text-ink"
                  : "bg-transparent ring-ink/30 text-ink-2 hover:text-ink",
              ].join(" ")}
            >
              {m}
            </button>
          );
        })}
      </div>
    </div>
  );
}
