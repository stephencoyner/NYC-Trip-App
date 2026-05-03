import React from "react";
import { CameraIcon } from "./icons";

type Props = { onClick: () => void };

export function CaptureFAB({ onClick }: Props) {
  return (
    <button
      onClick={() => {
        onClick();
        if ("vibrate" in navigator) navigator.vibrate?.(8);
      }}
      aria-label="Capture"
      className="no-print fixed bottom-[72px] right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-paper ring-1 ring-ink/70 active:scale-[0.97] transition-transform duration-150 ease-ios"
    >
      <CameraIcon size={22} className="text-ink" />
    </button>
  );
}
