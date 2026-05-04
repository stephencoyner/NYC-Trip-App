import React, { useEffect, useState } from "react";
import { BottomSheet } from "./BottomSheet";
import { addUserStop, type UserStop } from "../lib/userStops";
import type { StopKind } from "../data/itinerary";

const KINDS: { id: StopKind; label: string }[] = [
  { id: "meal", label: "meal" },
  { id: "coffee", label: "coffee" },
  { id: "walk", label: "walk" },
  { id: "shop", label: "shop" },
  { id: "bar", label: "bar" },
  { id: "show", label: "show" },
  { id: "museum", label: "museum" },
  { id: "transit", label: "transit" },
];

type Props = {
  open: boolean;
  onClose: () => void;
  dayId: string;
  dayDate: string; // "YYYY-MM-DD" — anchors the time on the right calendar day
  defaultStartHHMM: string; // device-local "HH:MM"
  onSaved: () => void;
};

export function AddPlaceSheet({ open, onClose, dayId, dayDate, defaultStartHHMM, onSaved }: Props) {
  const [title, setTitle] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [kind, setKind] = useState<StopKind>("meal");
  const [start, setStart] = useState(defaultStartHHMM);
  const [end, setEnd] = useState("");

  useEffect(() => {
    if (!open) return;
    setTitle("");
    setNeighborhood("");
    setAddress("");
    setNote("");
    setKind("meal");
    setStart(defaultStartHHMM);
    setEnd("");
  }, [open, defaultStartHHMM]);

  async function save() {
    const id = `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const stop: UserStop = {
      id,
      dayId,
      createdAt: Date.now(),
      start: `${dayDate}T${start}`,
      end: end ? `${dayDate}T${end}` : undefined,
      title: title.trim() || "Untitled stop",
      neighborhood: neighborhood.trim(),
      kind,
      address: address.trim() || undefined,
      note: note.trim() || undefined,
    };
    await addUserStop(stop);
    onSaved();
    onClose();
  }

  const canSave = title.trim().length > 0 && /^\d{2}:\d{2}$/.test(start);

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={<>Add a place</>}
      height="min(88vh, 760px)"
      footer={
        <button
          type="button"
          onClick={save}
          disabled={!canSave}
          className={[
            "block w-full py-3.5 text-center font-serif text-[18px] tracking-tight transition-colors duration-150 ease-ios",
            canSave
              ? "bg-ink text-paper active:bg-ink/90"
              : "bg-paper-2 text-ink-2/60 cursor-not-allowed",
          ].join(" ")}
        >
          Add to today
        </button>
      }
    >
      <div className="space-y-5">
        <Field label="What is it" required>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Devoción · cortado"
            className="w-full bg-transparent border-b border-ink/40 focus:border-ink focus:outline-none py-2 font-serif italic text-[18px] placeholder:text-ink-2/50"
            autoFocus
          />
        </Field>

        <Field label="Kind">
          <div className="-mx-1 flex flex-wrap gap-2">
            {KINDS.map((k) => {
              const on = kind === k.id;
              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setKind(k.id)}
                  className={[
                    "rounded-full px-3 py-1 text-[12.5px] ring-1 transition-colors",
                    on ? "bg-ink text-paper ring-ink" : "ring-ink/30 text-ink-2",
                  ].join(" ")}
                >
                  {k.label}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Neighborhood">
          <input
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            placeholder="Park Slope"
            className="w-full bg-transparent border-b border-ink/40 focus:border-ink focus:outline-none py-2 font-serif text-[16.5px] placeholder:text-ink-2/50"
          />
        </Field>

        <Field label="Address (optional)">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="441 7th Ave, Brooklyn"
            className="w-full bg-transparent border-b border-ink/40 focus:border-ink focus:outline-none py-2 font-mono text-[14px] placeholder:text-ink-2/50"
          />
        </Field>

        <Field label="Note (optional)">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Why this place"
            rows={2}
            className="w-full bg-transparent border-b border-ink/40 focus:border-ink focus:outline-none py-2 font-serif italic text-[16px] placeholder:text-ink-2/50 resize-none"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Start">
            <input
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full bg-transparent border-b border-ink/40 focus:border-ink focus:outline-none py-2 font-mono text-[16px]"
            />
          </Field>
          <Field label="End (optional)">
            <input
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full bg-transparent border-b border-ink/40 focus:border-ink focus:outline-none py-2 font-mono text-[16px]"
            />
          </Field>
        </div>
      </div>
    </BottomSheet>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="smallcaps text-ink-2 mb-1 block">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      {children}
    </label>
  );
}
