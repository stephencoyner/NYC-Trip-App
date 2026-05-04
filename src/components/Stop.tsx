import React, { useEffect, useRef, useState } from "react";
import { Stop as StopT, Day } from "../data/itinerary";
import { Capture, getBlob } from "../lib/storage";
import { fmtTimeMono24 } from "../lib/time";
import { googleMapsPlaceUrl } from "../lib/maps";
import { blobToFile, canShareFiles, captureFilename, shareFiles } from "../lib/photos";
import { PhotoFrame } from "./PhotoFrame";
import { MapSnippet } from "./MapSnippet";
import { StarFixed } from "./StarRating";
import { PauseIcon, PlayIcon, SaveIcon } from "./icons";

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
        "relative pl-[76px] pr-5 py-5",
      ].join(" ")}
    >
      {/* Spine node circle */}
      <span
        aria-hidden
        className={[
          "absolute left-[60px] top-7 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper",
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
          className="absolute left-[60px] top-7 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-accent/40"
        />
      )}

      {/* Time block — left gutter, right-aligned, with breathing room before the spine */}
      <div className="absolute left-1 top-5 w-[44px] text-right whitespace-nowrap">
        <div className={["font-mono text-[11px] tracking-tight", dim ? "text-ink-2/60" : "text-ink-2"].join(" ")}>
          {fmtTimeMono24(startDate)}
        </div>
        {endDate && (
          <div className={["font-mono text-[10px]", dim ? "text-ink-2/40" : "text-ink-2/70"].join(" ")}>
            {fmtTimeMono24(endDate)}
          </div>
        )}
      </div>

      <header className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <h2 className={["font-serif text-[22px] leading-[1.15] tracking-tight", dim ? "text-ink-2" : "text-ink"].join(" ")}>
            {stop.title}
          </h2>
          <div className="mt-1 smallcaps text-ink-2/90">
            {stop.neighborhood}
            {stop.address && (
              <>
                <span className="px-1.5 text-rule">·</span>
                <a
                  href={googleMapsPlaceUrl({
                    geo: stop.geo,
                    address: stop.address,
                    title: stop.title,
                    neighborhood: stop.neighborhood,
                  })}
                  target="_blank"
                  rel="noreferrer"
                  className="normal-case tracking-normal font-mono text-[10.5px] underline decoration-rule decoration-1 underline-offset-[3px] hover:text-ink active:text-ink"
                >
                  {stop.address}
                </a>
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
        <p className={["mt-3 font-serif italic text-[16.5px] leading-[1.5] max-w-[34ch]", dim ? "text-ink-2/70" : "text-ink"].join(" ")}>
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
          <MapSnippet
            lat={stop.geo.lat}
            lng={stop.geo.lng}
            address={stop.address}
            title={stop.title}
            neighborhood={stop.neighborhood}
            label={stop.neighborhood}
          />
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
  async function savePhotoToPhotos() {
    if (!c.photoBlobKey) return;
    const blob = await getBlob(c.photoBlobKey);
    if (!blob) return;
    const file = blobToFile(blob, captureFilename(c.dayId, c.stopId, "photo"));
    await shareFiles([file]);
  }

  const showSave = !!c.photoBlobKey && canShareFiles();

  return (
    <div className="space-y-1">
      {c.photoBlobKey && <PhotoFrame blobKey={c.photoBlobKey} ratio="square" />}
      <div className="flex items-center justify-between">
        {c.rating !== undefined ? <StarFixed value={c.rating} /> : <span />}
        <div className="flex items-center gap-2">
          {showSave && (
            <button
              type="button"
              onClick={savePhotoToPhotos}
              aria-label="Save to Photos"
              className="text-ink-2/80 hover:text-ink active:opacity-70 -my-1 -mx-1 p-1"
            >
              <SaveIcon size={12} />
            </button>
          )}
          <span className="font-mono text-[10px] text-ink-2/80">
            {new Date(c.ts).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>
      {c.note && (
        <p className="font-serif italic text-[13.5px] leading-snug text-ink-2">{c.note}</p>
      )}
      {c.voiceBlobKey && <VoicePlayer blobKey={c.voiceBlobKey} />}
    </div>
  );
}

function VoicePlayer({ blobKey }: { blobKey: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let revoked: string | undefined;
    let cancelled = false;
    getBlob(blobKey).then((blob) => {
      if (cancelled) return;
      if (blob) {
        const u = URL.createObjectURL(blob);
        revoked = u;
        setUrl(u);
      }
    });
    return () => {
      cancelled = true;
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [blobKey]);

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) el.pause();
    else el.play().catch((err) => console.error("[voice] playback failed:", err));
  }

  if (!url) return null;

  const dur =
    duration && isFinite(duration)
      ? `${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, "0")}`
      : "";

  return (
    <div className="mt-1 inline-flex items-center gap-2">
      <audio
        ref={audioRef}
        src={url}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onLoadedMetadata={(e) => setDuration((e.currentTarget as HTMLAudioElement).duration)}
        preload="metadata"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause voice memo" : "Play voice memo"}
        className={[
          "flex h-7 w-7 items-center justify-center rounded-full ring-1 transition-colors duration-150 ease-ios active:scale-95",
          playing ? "ring-accent text-accent" : "ring-ink/40 text-ink",
        ].join(" ")}
      >
        {playing ? <PauseIcon size={11} /> : <PlayIcon size={11} className="ml-[1px]" />}
      </button>
      <span className="font-mono text-[11px] text-ink-2 leading-none">
        voice memo{dur && ` · ${dur}`}
      </span>
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
