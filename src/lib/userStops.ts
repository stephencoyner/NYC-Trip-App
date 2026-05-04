import { get, set } from "idb-keyval";
import type { Stop } from "../data/itinerary";

// Spontaneous stops added on the fly. Same shape as canonical Stop so
// the timeline can render them without any extra component code.
export type UserStop = Stop & {
  dayId: string;
  createdAt: number;
};

const KEY = "user-stops-v1";

export async function loadUserStops(): Promise<UserStop[]> {
  return (await get<UserStop[]>(KEY)) || [];
}

export async function saveUserStops(stops: UserStop[]): Promise<void> {
  await set(KEY, stops);
}

export async function addUserStop(s: UserStop): Promise<void> {
  const all = await loadUserStops();
  all.push(s);
  await saveUserStops(all);
}

export async function deleteUserStop(id: string): Promise<void> {
  const all = await loadUserStops();
  await saveUserStops(all.filter((s) => s.id !== id));
}
