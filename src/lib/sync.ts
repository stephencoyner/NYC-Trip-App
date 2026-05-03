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
