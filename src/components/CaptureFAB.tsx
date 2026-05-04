import React from "react";
import { PlusIcon } from "./icons";

type Props = { onClick: () => void };

const FAB_BOTTOM = "calc(env(safe-area-inset-bottom, 0px) + 16px)";

export function CaptureFAB({ onClick }: Props) {
  return (
    <button
      onClick={() => {
        onClick();
        if ("vibrate" in navigator) navigator.vibrate?.(8);
      }}
      aria-label="New entry"
      className="no-print fixed right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-paper ring-1 ring-ink/70 active:scale-[0.97] transition-transform duration-150 ease-ios"
      style={{ bottom: FAB_BOTTOM }}
    >
      <PlusIcon size={22} strokeWidth={1.5} className="text-ink" />
    </button>
  );
}
