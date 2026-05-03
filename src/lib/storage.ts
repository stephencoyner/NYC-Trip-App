import { get, set, del, keys } from "idb-keyval";

export type Capture = {
  id: string;
  stopId: string;
  dayId: string;
  ts: number; // epoch ms when captured
  photoBlobKey?: string; // key in IndexedDB
  note?: string;
  rating?: number; // 0..5 in 0.5 steps
  moods?: string[];
  companions?: string[];
  voiceBlobKey?: string;
};

const CAPTURES_KEY = "captures-v1";
const SETTINGS_KEY = "settings-v1";
const SWAPS_KEY = "swaps-v1";
const RECENT_MOODS_KEY = "recent-moods-v1";

export type Settings = {
  companions: string[];
};

export async function loadCaptures(): Promise<Capture[]> {
  return (await get(CAPTURES_KEY)) || [];
}

export async function saveCaptures(c: Capture[]) {
  await set(CAPTURES_KEY, c);
}

export async function addCapture(c: Capture) {
  const all = await loadCaptures();
  all.push(c);
  await saveCaptures(all);
}

export async function updateCapture(id: string, patch: Partial<Capture>) {
  const all = await loadCaptures();
  const i = all.findIndex((x) => x.id === id);
  if (i >= 0) {
    all[i] = { ...all[i], ...patch };
    await saveCaptures(all);
  }
}

export async function deleteCapture(id: string) {
  const all = await loadCaptures();
  await saveCaptures(all.filter((x) => x.id !== id));
}

export async function putBlob(key: string, blob: Blob) {
  await set(key, blob);
}
export async function getBlob(key: string): Promise<Blob | undefined> {
  return await get(key);
}

export async function loadSettings(): Promise<Settings> {
  return (await get(SETTINGS_KEY)) || { companions: [] };
}
export async function saveSettings(s: Settings) {
  await set(SETTINGS_KEY, s);
}

export async function loadSwaps(): Promise<Record<string, string>> {
  return (await get(SWAPS_KEY)) || {};
}
export async function saveSwap(stopId: string, alternateId: string) {
  const s = await loadSwaps();
  s[stopId] = alternateId;
  await set(SWAPS_KEY, s);
}
export async function clearSwap(stopId: string) {
  const s = await loadSwaps();
  delete s[stopId];
  await set(SWAPS_KEY, s);
}

export async function loadRecentMoods(): Promise<string[]> {
  return (await get(RECENT_MOODS_KEY)) || [];
}
export async function pushRecentMoods(moods: string[]) {
  const prev = await loadRecentMoods();
  const merged = [...moods, ...prev.filter((m) => !moods.includes(m))].slice(0, 8);
  await set(RECENT_MOODS_KEY, merged);
}

export { keys, del };

/** Ask the browser to keep our IndexedDB data even under disk pressure.
 *  Safari grants this silently to installed PWAs; Chrome shows a prompt. */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.storage?.persist) return false;
  try {
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

/** Returns { usedMB, quotaMB } or undefined if the API is unavailable. */
export async function storageEstimate(): Promise<{ usedMB: number; quotaMB: number } | undefined> {
  if (typeof navigator === "undefined" || !navigator.storage?.estimate) return undefined;
  try {
    const est = await navigator.storage.estimate();
    const usedMB = Math.round(((est.usage ?? 0) / 1024 / 1024) * 10) / 10;
    const quotaMB = Math.round(((est.quota ?? 0) / 1024 / 1024) * 10) / 10;
    return { usedMB, quotaMB };
  } catch {
    return undefined;
  }
}
