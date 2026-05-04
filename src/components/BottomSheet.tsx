import React, { useEffect, useRef, useState } from "react";
import { CloseIcon } from "./icons";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  height?: string; // CSS value: "min(72vh, 720px)" or "auto"
  footer?: React.ReactNode;
};

function isInteractive(t: EventTarget | null): boolean {
  if (!t || !(t instanceof HTMLElement)) return false;
  return !!t.closest("button, a, input, textarea, select, label, [role='slider']");
}

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
  const lastY = useRef<number | null>(null);
  const lastT = useRef<number>(0);
  const velocity = useRef<number>(0);
  const draggingRef = useRef<boolean>(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const startScrollTop = useRef<number>(0);

  useEffect(() => {
    if (!open) {
      setDrag(0);
      draggingRef.current = false;
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function startDrag(clientY: number) {
    startY.current = clientY;
    lastY.current = clientY;
    lastT.current = performance.now();
    velocity.current = 0;
    draggingRef.current = true;
  }

  function moveDrag(clientY: number) {
    if (!draggingRef.current || startY.current == null) return;
    const dy = clientY - startY.current;
    if (dy > 0) setDrag(dy);
    const now = performance.now();
    if (lastT.current && lastY.current != null) {
      const dt = Math.max(1, now - lastT.current);
      velocity.current = (clientY - lastY.current) / dt;
    }
    lastY.current = clientY;
    lastT.current = now;
  }

  function endDrag() {
    if (!draggingRef.current) return;
    const fastFlick = drag > 30 && velocity.current > 0.5;
    if (drag > 120 || fastFlick) {
      onClose();
    }
    setDrag(0);
    startY.current = null;
    lastY.current = null;
    velocity.current = 0;
    draggingRef.current = false;
  }

  // Header drag: any non-interactive area in the pinned top region.
  const headerHandlers = {
    onPointerDown: (e: React.PointerEvent) => {
      if (isInteractive(e.target)) return;
      startDrag(e.clientY);
    },
    onPointerMove: (e: React.PointerEvent) => moveDrag(e.clientY),
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
  };

  // Content drag: only kicks in if the scroll position is at the top
  // and the user is pulling down. Otherwise native scroll wins.
  const contentHandlers = {
    onTouchStart: (e: React.TouchEvent) => {
      const el = scrollRef.current;
      startScrollTop.current = el?.scrollTop ?? 0;
      // Only arm a potential drag if we're already at the top.
      if (startScrollTop.current <= 0) {
        startDrag(e.touches[0].clientY);
      } else {
        draggingRef.current = false;
      }
    },
    onTouchMove: (e: React.TouchEvent) => {
      // If scroll moved away from top mid-gesture, abandon drag and
      // let native scroll continue.
      const el = scrollRef.current;
      if ((el?.scrollTop ?? 0) > 0) {
        draggingRef.current = false;
        startY.current = null;
        setDrag(0);
        return;
      }
      moveDrag(e.touches[0].clientY);
    },
    onTouchEnd: endDrag,
    onTouchCancel: endDrag,
  };

  const isAuto = height === "auto";

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
          height: isAuto ? "auto" : height,
          maxHeight: isAuto ? "min(82vh, 760px)" : undefined,
          transform: open ? `translateY(${drag}px)` : "translateY(100%)",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
        }}
      >
        {/* Pinned top region: drag handle + title + close */}
        <div
          {...headerHandlers}
          className="shrink-0 bg-paper border-b border-rule/40 cursor-grab touch-none select-none"
        >
          <div className="flex flex-col items-center pt-3 pb-1">
            <div className="h-1 w-9 rounded-full bg-rule" />
          </div>

          <div className="relative flex items-start justify-between gap-3 px-6 pt-1 pb-3">
            {title ? (
              <div className="font-serif italic text-[20px] leading-snug text-ink min-w-0 pr-12">
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
        </div>

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          {...contentHandlers}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 py-4"
        >
          {children}
        </div>

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
