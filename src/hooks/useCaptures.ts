import { useCallback, useEffect, useState } from "react";
import { Capture, loadCaptures, saveCaptures } from "../lib/storage";

export function useCaptures() {
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadCaptures().then((c) => {
      setCaptures(c);
      setReady(true);
    });
  }, []);

  const persist = useCallback(async (next: Capture[]) => {
    setCaptures(next);
    await saveCaptures(next);
  }, []);

  const add = useCallback(
    async (c: Capture) => {
      await persist([...captures, c]);
    },
    [captures, persist]
  );

  const remove = useCallback(
    async (id: string) => {
      await persist(captures.filter((x) => x.id !== id));
    },
    [captures, persist]
  );

  const update = useCallback(
    async (id: string, patch: Partial<Capture>) => {
      await persist(captures.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    },
    [captures, persist]
  );

  return { captures, ready, add, remove, update };
}
