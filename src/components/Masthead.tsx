import React from "react";
import { Day, TRIP } from "../data/itinerary";
import { WeatherGlyph } from "./icons";
import { deviceIsInNY, deviceTZAbbr, offsetFromNYHours } from "../lib/time";
import { useAuth } from "../hooks/useAuth";

type Props = {
  day: Day;
  isToday: boolean;
  dayIndex: number;
  total: number;
  onOpenAuth?: () => void;
};

export function Masthead({ day, isToday, dayIndex, total, onOpenAuth }: Props) {
  const inNY = deviceIsInNY();
  const abbr = deviceTZAbbr();
  const off = offsetFromNYHours();
  const offLabel = off === 0 ? "" : off > 0 ? `NY −${off}` : `NY +${Math.abs(off)}`;
  const { user, supabaseEnabled } = useAuth();
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

      {!inNY && abbr && (
        <p className="mt-4 smallcaps text-ink-2/80">
          Times in {abbr}
          {offLabel && (
            <>
              <span className="px-2 text-rule">·</span>
              {offLabel}
            </>
          )}
        </p>
      )}

      {supabaseEnabled && onOpenAuth && (
        <button
          onClick={onOpenAuth}
          className="mt-4 smallcaps text-ink-2/70 underline decoration-rule decoration-1 underline-offset-[3px] active:text-ink"
        >
          {user ? (
            <>
              <span className="text-accent">●</span>
              <span className="px-2 text-rule">·</span>
              Backed up
            </>
          ) : (
            <>
              <span className="text-ink-2/50">○</span>
              <span className="px-2 text-rule">·</span>
              Not backed up · sign in
            </>
          )}
        </button>
      )}
    </header>
  );
}
