import React, { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  height?: string; // e.g., "min(70vh, 640px)"
};

export function BottomSheet({ open, onClose, title, children, height = "min(72vh, 720px)" }: Props) {
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
        className="absolute inset-x-0 bottom-0 bg-paper ring-1 ring-rule/70 transition-transform duration-220 ease-ios"
        style={{
          height,
          transform: open
            ? `translateY(${drag}px)`
            : "translateY(100%)",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
        }}
      >
        <div
          onPointerDown={handleStart}
          onPointerMove={handleMove}
          onPointerUp={handleEnd}
          onPointerCancel={handleEnd}
          className="flex flex-col items-center pt-3 pb-1 cursor-grab touch-none select-none"
        >
          <div className="h-1 w-9 rounded-full bg-rule" />
        </div>
        {title && (
          <div className="px-6 pb-2 pt-1 font-serif italic text-[20px] text-ink">
            {title}
          </div>
        )}
        <div className="overflow-y-auto px-6 pb-8" style={{ maxHeight: `calc(${height} - 80px)` }}>
          {children}
        </div>
      </div>
    </div>
  );
}
