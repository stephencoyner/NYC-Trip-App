import React from "react";
import { Day, TRIP } from "../data/itinerary";
import { WeatherGlyph } from "./icons";

type Props = { day: Day; isToday: boolean; dayIndex: number; total: number };

export function Masthead({ day, isToday, dayIndex, total }: Props) {
  return (
    <header className="relative px-6 pt-12 pb-6">
      {isToday && (
        <span
          className="absolute right-5 top-8 select-none origin-center -rotate-3 px-2 py-[2px] text-2xs tracking-widest text-accent ring-1 ring-accent/50"
          style={{ background: "rgba(154,42,31,0.06)" }}
        >
          TODAY
        </span>
      )}

      <div className="smallcaps text-ink-2 mb-2">
        <span>{TRIP.city}</span>
        <span className="px-2 text-rule">·</span>
        <span>Day {dayIndex + 1} of {total}</span>
        <span className="px-2 text-rule">·</span>
        <span className="inline-flex items-center gap-1">
          <WeatherGlyph glyph={day.weather.glyph} size={12} className="text-ink-2" />
          {day.weather.tempF}°
        </span>
      </div>

      <h1 className="font-serif italic font-light leading-[1.02] tracking-tight text-[44px] sm:text-[56px]">
        {day.weekday},
        <br />
        <span className="not-italic font-normal">{day.ordinal}</span>
      </h1>

      {day.subtitle && (
        <p className="mt-3 font-serif text-ink-2 text-[17px] leading-snug max-w-[28ch]">
          {day.subtitle}
        </p>
      )}
    </header>
  );
}
