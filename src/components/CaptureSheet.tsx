import React, { useEffect, useRef, useState } from "react";
import { Stop } from "../data/itinerary";
import { Capture, addCapture, putBlob, pushRecentMoods, loadRecentMoods, loadSettings, saveSettings, requestPersistentStorage } from "../lib/storage";
import { pushCapture } from "../lib/sync";
import { useAuth } from "../hooks/useAuth";
import { BottomSheet } from "./BottomSheet";
import { StarRating } from "./StarRating";
import { MoodChips } from "./MoodChips";
import { MicIcon, PlusIcon } from "./icons";
import { PhotoFrame } from "./PhotoFrame";

type Props = {
  open: boolean;
  onClose: () => void;
  stop?: Stop;
  dayId?: string;
  onSaved: () => void;
};

export function CaptureSheet({ open, onClose, stop, dayId, onSaved }: Props) {
  const { user } = useAuth();
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [moods, setMoods] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [companions, setCompanions] = useState<string[]>([]);
  const [allCompanions, setAllCompanions] = useState<string[]>([]);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [recording, setRecording] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const recChunks = useRef<BlobPart[]>([]);

  useEffect(() => {
    if (!open) return;
    setPhotoBlob(null);
    setPhotoUrl((u) => {
      if (u) URL.revokeObjectURL(u);
      return null;
    });
    setNote("");
    setRating(0);
    setMoods([]);
    setVoiceBlob(null);
    setCompanions([]);
    loadRecentMoods().then(setRecent);
    loadSettings().then((s) => setAllCompanions(s.companions));
  }, [open]);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhotoBlob(f);
    setPhotoUrl((u) => {
      if (u) URL.revokeObjectURL(u);
      return URL.createObjectURL(f);
    });
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recChunks.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = (e) => recChunks.current.push(e.data);
      mr.onstop = () => {
        const b = new Blob(recChunks.current, { type: "audio/webm" });
        setVoiceBlob(b);
        stream.getTracks().forEach((t) => t.stop());
      };
      recRef.current = mr;
      mr.start();
      setRecording(true);
      setTimeout(() => {
        if (recRef.current?.state === "recording") {
          recRef.current.stop();
          setRecording(false);
        }
      }, 30_000);
    } catch {
      // permission denied — silent
    }
  }
  function stopRecording() {
    if (recRef.current?.state === "recording") recRef.current.stop();
    setRecording(false);
  }

  async function addCompanion() {
    const name = window.prompt("Add a companion (first name)?");
    if (!name) return;
    const trimmed = name.trim();
    if (!trimmed) return;
    const next = Array.from(new Set([...allCompanions, trimmed]));
    setAllCompanions(next);
    setCompanions((c) => Array.from(new Set([...c, trimmed])));
    await saveSettings({ companions: next });
  }

  async function save() {
    if (!stop || !dayId) return;
    const id = `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const photoKey = photoBlob ? `photo_${id}` : undefined;
    const voiceKey = voiceBlob ? `voice_${id}` : undefined;
    if (photoBlob && photoKey) await putBlob(photoKey, photoBlob);
    if (voiceBlob && voiceKey) await putBlob(voiceKey, voiceBlob);
    const cap: Capture = {
      id,
      stopId: stop.id,
      dayId,
      ts: Date.now(),
      photoBlobKey: photoKey,
      voiceBlobKey: voiceKey,
      note: note.trim() || undefined,
      rating: rating || undefined,
      moods: moods.length ? moods : undefined,
      companions: companions.length ? companions : undefined,
    };
    await addCapture(cap);
    if (moods.length) await pushRecentMoods(moods);
    // Ask the browser to keep this data through disk pressure / inactivity.
    // First save is a deliberate user gesture, which is when persist() is most likely granted.
    void requestPersistentStorage();
    // Mirror to Supabase if signed in. Fire-and-forget — local save is what
    // the user feels; the cloud copy follows in the background.
    // Don't swallow errors silently — log them so the browser console
    // makes failures visible.
    if (user) {
      void pushCapture(cap, user.id).catch((err) => {
        console.error("[sync] pushCapture failed:", err);
      });
    }
    if ("vibrate" in navigator) navigator.vibrate?.(8);
    onSaved();
    onClose();
  }

  const canSave = !!photoBlob || note.trim().length > 0 || rating > 0 || moods.length > 0 || !!voiceBlob;

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={
        <span>
          A small thing about <em className="not-italic font-serif text-ink">{stop?.title ?? "this stop"}</em>
        </span>
      }
      height="min(88vh, 800px)"
      footer={
        <button
          onClick={save}
          disabled={!canSave}
          className={[
            "block w-full py-3.5 text-center font-serif text-[18px] tracking-tight transition-colors duration-150 ease-ios",
            canSave
              ? "bg-ink text-paper active:bg-ink/90"
              : "bg-paper-2 text-ink-2/60 cursor-not-allowed",
          ].join(" ")}
        >
          Save this entry
        </button>
      }
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={onFile}
      />

      <div className="grid grid-cols-[120px_1fr] gap-4 items-start">
        <button
          onClick={() => fileRef.current?.click()}
          className="block aspect-square w-full p-2 ring-1 ring-rule/70 bg-paper-2 text-ink-2 hover:text-ink"
        >
          {photoUrl ? (
            <img src={photoUrl} className="block h-full w-full object-cover" alt="" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 font-serif italic text-[13px]">
              <PlusIcon size={16} />
              <span>add photo</span>
            </div>
          )}
        </button>
        <div className="space-y-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What was it like?"
            rows={4}
            className="block w-full bg-transparent font-serif italic text-[16px] leading-snug placeholder:text-ink-2/70 focus:outline-none resize-none"
          />
          <div className="h-px bg-rule/70" />
          <div className="flex items-center gap-3">
            <button
              onClick={recording ? stopRecording : startRecording}
              className={["inline-flex items-center gap-1.5 text-[12px]", recording ? "text-accent" : "text-ink-2"].join(" ")}
            >
              <MicIcon size={14} />
              <span className="font-mono tracking-tight">
                {recording ? "recording…" : voiceBlob ? "voice memo saved" : "voice memo"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <section className="mt-6">
        <div className="smallcaps text-ink-2 mb-2">Rating</div>
        <StarRating value={rating} onChange={setRating} />
      </section>

      <section className="mt-6">
        <div className="smallcaps text-ink-2 mb-2">Mood</div>
        <MoodChips
          selected={moods}
          recent={recent}
          onToggle={(m) => setMoods((cur) => (cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m]))}
        />
      </section>

      <section className="mt-6">
        <div className="smallcaps text-ink-2 mb-2">With</div>
        <div className="flex flex-wrap items-center gap-2">
          {allCompanions.map((p) => {
            const on = companions.includes(p);
            return (
              <button
                key={p}
                onClick={() => setCompanions((c) => (c.includes(p) ? c.filter((x) => x !== p) : [...c, p]))}
                className={[
                  "rounded-full px-3 py-1 text-[12.5px] ring-1 transition-colors",
                  on ? "bg-ink text-paper ring-ink" : "ring-ink/30 text-ink-2",
                ].join(" ")}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={addCompanion}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12px] ring-1 ring-ink/30 text-ink-2"
          >
            <PlusIcon size={12} /> add person
          </button>
        </div>
      </section>

      <section className="mt-6">
        <div className="smallcaps text-ink-2 mb-1">At</div>
        <div className="font-serif text-[16px]">{stop?.title}</div>
      </section>

    </BottomSheet>
  );
}
