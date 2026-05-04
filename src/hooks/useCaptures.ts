import { useCallback, useEffect, useState } from "react";
import { Capture, loadCaptures, saveCaptures } from "../lib/storage";
import { backfill, pullCaptures } from "../lib/sync";
import { useAuth } from "./useAuth";

export function useCaptures() {
  const { user } = useAuth();
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadCaptures().then((c) => {
      setCaptures(c);
      setReady(true);
    });
  }, []);

  // When the user signs in (or returns from a magic-link redirect),
  // backfill any local-only captures and pull anything new from the server.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      await backfill(user.id);
      await pullCaptures(user.id);
      if (cancelled) return;
      const fresh = await loadCaptures();
      setCaptures(fresh);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

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

  // Re-read from IndexedDB. Called after a CaptureSheet save so the new
  // entry shows up immediately without a manual refresh.
  const refresh = useCallback(async () => {
    const fresh = await loadCaptures();
    setCaptures(fresh);
  }, []);

  return { captures, ready, add, remove, update, refresh };
}
