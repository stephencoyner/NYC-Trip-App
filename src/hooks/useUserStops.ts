import { useCallback, useEffect, useState } from "react";
import { loadUserStops, type UserStop } from "../lib/userStops";
import { backfillUserStops, pullUserStops } from "../lib/sync";
import { useAuth } from "./useAuth";

export function useUserStops() {
  const { user } = useAuth();
  const [stops, setStops] = useState<UserStop[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadUserStops().then((s) => {
      setStops(s);
      setReady(true);
    });
  }, []);

  // When the user signs in, push anything local-only and pull anything
  // the server has that we don't.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      await backfillUserStops(user.id);
      await pullUserStops(user.id);
      if (cancelled) return;
      const fresh = await loadUserStops();
      setStops(fresh);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const refresh = useCallback(async () => {
    setStops(await loadUserStops());
  }, []);

  return { stops, ready, refresh };
}
