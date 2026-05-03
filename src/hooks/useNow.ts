import { useEffect, useState } from "react";

/** Returns a Date that re-renders every `intervalMs` (default 30s). */
export function useNow(intervalMs: number = 30_000): Date {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
