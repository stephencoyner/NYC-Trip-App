import React from "react";
import { Stop } from "../data/itinerary";
import { BottomSheet } from "./BottomSheet";

type Props = {
  open: boolean;
  onClose: () => void;
  stop?: Stop;
  currentSwap?: string; // alternate id currently swapped in
  onSwap: (alternateId: string) => void;
  onClear: () => void;
};

export function SwapSheet({ open, onClose, stop, currentSwap, onSwap, onClear }: Props) {
  return (
    <BottomSheet open={open} onClose={onClose} title={<>Or instead…</>}>
      {stop && (
        <>
          <div className="mb-4">
            <div className="smallcaps text-ink-2">Current pick</div>
            <div className={["mt-1 font-serif text-[18px]", currentSwap ? "line-through text-ink-2" : ""].join(" ")}>
              {stop.title}
            </div>
            <div className="mt-1 font-mono text-[11px] text-ink-2">{stop.neighborhood}</div>
          </div>

          <div className="space-y-6">
            {(stop.alternates || []).map((alt) => {
              const active = currentSwap === alt.id;
              return (
                <article key={alt.id} className="border-t border-rule/60 pt-4">
                  <h3 className="font-serif text-[20px] leading-tight">{alt.title}</h3>
                  <div className="mt-1 smallcaps text-ink-2">{alt.neighborhood}</div>
                  <p className="mt-2 font-serif italic text-[15px] leading-snug text-ink-2 max-w-[36ch]">
                    {alt.reason}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-ink-2">{alt.delta}</span>
                    {active ? (
                      <button onClick={onClear} className="btn-text">
                        Undo swap
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onSwap(alt.id);
                          onClose();
                        }}
                        className="btn-text"
                      >
                        Swap in
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </BottomSheet>
  );
}
