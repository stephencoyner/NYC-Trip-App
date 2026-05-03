import React, { useEffect, useRef, useState } from "react";
import { CloseIcon } from "./icons";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  height?: string; // e.g., "min(70vh, 640px)"
  /** Slot rendered as a sticky action bar at the bottom of the sheet (e.g., a big Save). */
  footer?: React.ReactNode;
};

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  height = "min(82vh, 760px)",
  footer,
}: Props) {
  const [drag, setDrag] = useState(0);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    if (!open) {
      setDrag(0);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function handleStart(e: React.PointerEvent) {
    startY.current = e.clientY;
  }
  function handleMove(e: React.PointerEvent) {
    if (startY.current == null) return;
    const dy = e.clientY - startY.current;
    if (dy > 0) setDrag(dy);
  }
  function handleEnd() {
    if (drag > 120) onClose();
    setDrag(0);
    startY.current = null;
  }

  return (
    <div
      className={[
        "fixed inset-0 z-50 transition-opacity duration-200 ease-ios",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className="absolute inset-0 bg-ink/35 backdrop-blur-[1px]"
        style={{ WebkitBackdropFilter: "blur(1px)" }}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="absolute inset-x-0 bottom-0 flex flex-col bg-paper ring-1 ring-rule/70 transition-transform duration-220 ease-ios"
        style={{
          height,
          transform: open ? `translateY(${drag}px)` : "translateY(100%)",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
        }}
      >
        {/* Drag handle (still works for fine pointers) */}
        <div
          onPointerDown={handleStart}
          onPointerMove={handleMove}
          onPointerUp={handleEnd}
          onPointerCancel={handleEnd}
          className="flex flex-col items-center pt-3 pb-1 cursor-grab touch-none select-none shrink-0"
        >
          <div className="h-1 w-9 rounded-full bg-rule" />
        </div>

        {/* Header: title + explicit close button */}
        <div className="relative flex items-start justify-between gap-3 px-6 pt-1 pb-2 shrink-0">
          {title ? (
            <div className="font-serif italic text-[20px] leading-snug text-ink min-w-0 pr-10">
              {title}
            </div>
          ) : (
            <span />
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-0 flex h-10 w-10 items-center justify-center rounded-full text-ink-2 hover:text-ink active:scale-[0.95] transition-transform duration-150 ease-ios"
          >
            <CloseIcon size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">{children}</div>

        {/* Sticky action bar */}
        {footer && (
          <div className="shrink-0 border-t border-rule/50 bg-paper px-6 py-3 pb-[max(env(safe-area-inset-bottom),12px)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
