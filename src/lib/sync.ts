// Cloud-mirror layer. Local IndexedDB stays the source of truth; Supabase is a
// belt-and-suspenders backup. Save-path is fire-and-forget so it never slows
// down the capture UX. Pull-path runs once when the user signs in.

import { BUCKET, supabase } from "./supabase";
import {
  Capture,
  getBlob,
  loadCaptures,
  putBlob,
  saveCaptures,
  updateCapture,
} from "./storage";
import {
  loadUserStops,
  markUserStopSynced,
  saveUserStops,
  type UserStop,
} from "./userStops";
import type { StopKind } from "../data/itinerary";

function rowFromCapture(c: Capture, userId: string) {
  return {
    id: c.id,
    user_id: userId,
    day_id: c.dayId,
    stop_id: c.stopId,
    ts: c.ts,
    note: c.note ?? null,
    rating: c.rating ?? null,
    moods: c.moods ?? null,
    companions: c.companions ?? null,
    photo_path: c.photoPath ?? null,
    voice_path: c.voicePath ?? null,
    updated_at: new Date().toISOString(),
  };
}

export async function pushCapture(cap: Capture, userId: string): Promise<void> {
  if (!supabase) return;

  let photoPath = cap.photoPath;
  if (cap.photoBlobKey && !photoPath) {
    const blob = await getBlob(cap.photoBlobKey);
    if (blob) {
      const path = `${userId}/${cap.id}-photo`;
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, blob, { upsert: true, contentType: blob.type || "image/jpeg" });
      if (error) {
        console.error("[sync] photo upload failed:", error);
      } else {
        photoPath = path;
      }
    }
  }

  let voicePath = cap.voicePath;
  if (cap.voiceBlobKey && !voicePath) {
    const blob = await getBlob(cap.voiceBlobKey);
    if (blob) {
      const path = `${userId}/${cap.id}-voice`;
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, blob, { upsert: true, contentType: blob.type || "audio/webm" });
      if (error) {
        console.error("[sync] voice upload failed:", error);
      } else {
        voicePath = path;
      }
    }
  }

  const merged: Capture = { ...cap, photoPath, voicePath };
  const row = rowFromCapture(merged, userId);
  const { error } = await supabase.from("captures").upsert(row);
  if (error) {
    console.error("[sync] captures upsert failed:", error, "row:", row);
    throw error;
  }

  await updateCapture(cap.id, { photoPath, voicePath, synced: true });
}

export async function deleteCaptureRemote(cap: Capture, userId: string): Promise<void> {
  if (!supabase) return;

  const paths = [cap.photoPath, cap.voicePath].filter((p): p is string => !!p);
  if (paths.length) {
    const { error } = await supabase.storage.from(BUCKET).remove(paths);
    if (error) console.error("[sync] capture media delete failed:", error);
  }

  const { error } = await supabase
    .from("captures")
    .delete()
    .eq("id", cap.id)
    .eq("user_id", userId);
  if (error) {
    console.error("[sync] captures delete failed:", error);
    throw error;
  }
}

export async function pullCaptures(userId: string): Promise<number> {
  if (!supabase) return 0;

  const { data, error } = await supabase
    .from("captures")
    .select("*")
    .eq("user_id", userId)
    .order("ts", { ascending: true });
  if (error || !data) return 0;

  const local = await loadCaptures();
  const localIds = new Set(local.map((c) => c.id));
  const additions: Capture[] = [];

  for (const row of data) {
    if (localIds.has(row.id)) continue;
    const cap: Capture = {
      id: row.id,
      dayId: row.day_id,
      stopId: row.stop_id,
      ts: Number(row.ts),
      note: row.note ?? undefined,
      rating: row.rating ?? undefined,
      moods: row.moods ?? undefined,
      companions: row.companions ?? undefined,
      photoPath: row.photo_path ?? undefined,
      voicePath: row.voice_path ?? undefined,
      synced: true,
    };

    if (row.photo_path) {
      const { data: blob } = await supabase.storage.from(BUCKET).download(row.photo_path);
      if (blob) {
        const key = `photo_${row.id}`;
        await putBlob(key, blob);
        cap.photoBlobKey = key;
      }
    }
    if (row.voice_path) {
      const { data: blob } = await supabase.storage.from(BUCKET).download(row.voice_path);
      if (blob) {
        const key = `voice_${row.id}`;
        await putBlob(key, blob);
        cap.voiceBlobKey = key;
      }
    }
    additions.push(cap);
  }

  if (additions.length) {
    await saveCaptures([...local, ...additions]);
  }
  return additions.length;
}

/** On first sign-in, push every un-synced local capture. */
export async function backfill(userId: string): Promise<number> {
  if (!supabase) return 0;
  const local = await loadCaptures();
  let pushed = 0;
  for (const c of local) {
    if (c.synced) continue;
    try {
      await pushCapture(c, userId);
      pushed++;
    } catch {
      // ignore individual failures; user can retry by saving again
    }
  }
  return pushed;
}

// ─────────────────────────────────────────────
// User stops (spontaneous + button additions)
// ─────────────────────────────────────────────

function rowFromUserStop(s: UserStop, userId: string) {
  return {
    id: s.id,
    user_id: userId,
    day_id: s.dayId,
    start_at: s.start,
    end_at: s.end ?? null,
    title: s.title,
    neighborhood: s.neighborhood || null,
    address: s.address ?? null,
    kind: s.kind ?? null,
    note: s.note ?? null,
    meta_note: s.metaNote ?? null,
    geo_lat: s.geo?.lat ?? null,
    geo_lng: s.geo?.lng ?? null,
    from_prev: s.fromPrev ?? null,
    updated_at: new Date().toISOString(),
  };
}

export async function pushUserStop(s: UserStop, userId: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("user_stops").upsert(rowFromUserStop(s, userId));
  if (error) {
    console.error("[sync] user_stops upsert failed:", error, "row:", rowFromUserStop(s, userId));
    throw error;
  }
  await markUserStopSynced(s.id);
}

export async function pullUserStops(userId: string): Promise<number> {
  if (!supabase) return 0;
  const { data, error } = await supabase
    .from("user_stops")
    .select("*")
    .eq("user_id", userId);
  if (error || !data) return 0;

  const local = await loadUserStops();
  const localIds = new Set(local.map((s) => s.id));
  const additions: UserStop[] = [];

  for (const row of data) {
    if (localIds.has(row.id)) continue;
    const s: UserStop = {
      id: row.id,
      dayId: row.day_id,
      createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
      start: row.start_at,
      end: row.end_at ?? undefined,
      title: row.title,
      neighborhood: row.neighborhood || "",
      kind: (row.kind as StopKind) || "meal",
      address: row.address ?? undefined,
      note: row.note ?? undefined,
      metaNote: row.meta_note ?? undefined,
      fromPrev: row.from_prev ?? undefined,
      geo:
        row.geo_lat != null && row.geo_lng != null
          ? { lat: Number(row.geo_lat), lng: Number(row.geo_lng) }
          : undefined,
      synced: true,
    };
    additions.push(s);
  }

  if (additions.length) {
    await saveUserStops([...local, ...additions]);
  }
  return additions.length;
}

export async function backfillUserStops(userId: string): Promise<number> {
  if (!supabase) return 0;
  const local = await loadUserStops();
  let pushed = 0;
  for (const s of local) {
    if (s.synced) continue;
    try {
      await pushUserStop(s, userId);
      pushed++;
    } catch {
      // ignore individual failures
    }
  }
  return pushed;
}
