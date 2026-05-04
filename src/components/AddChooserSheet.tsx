import React from "react";
import { BottomSheet } from "./BottomSheet";

type Props = {
  open: boolean;
  onClose: () => void;
  onChoosePlace: () => void;
  onChooseCapture: () => void;
};

export function AddChooserSheet({ open, onClose, onChoosePlace, onChooseCapture }: Props) {
  return (
    <BottomSheet open={open} onClose={onClose} title={<>What are you adding?</>} height="auto">
      <div className="divide-y divide-rule/40">
        <button
          type="button"
          onClick={onChoosePlace}
          className="block w-full text-left py-5 active:opacity-70"
        >
          <div className="font-serif italic text-[22px] text-ink leading-tight">Add a place</div>
          <div className="mt-1 font-serif text-[14px] text-ink-2 leading-snug max-w-[34ch]">
            A spontaneous stop on the timeline. Inserts at the current time.
          </div>
        </button>
        <button
          type="button"
          onClick={onChooseCapture}
          className="block w-full text-left py-5 active:opacity-70"
        >
          <div className="font-serif italic text-[22px] text-ink leading-tight">Document this moment</div>
          <div className="mt-1 font-serif text-[14px] text-ink-2 leading-snug max-w-[34ch]">
            Photo, note, half-star, mood, voice memo.
          </div>
        </button>
      </div>
    </BottomSheet>
  );
}
