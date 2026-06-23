import { create } from "zustand";

const isBrowser = typeof window !== "undefined";

const read = <T,>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key: string, val: unknown) => {
  if (!isBrowser) return;
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ }
};

/* ---- Favorites ---- */
type FavState = {
  ids: number[];
  toggle: (id: number) => void;
  has: (id: number) => boolean;
};
export const useFavorites = create<FavState>((set, get) => ({
  ids: read<number[]>("q_favorites", []),
  toggle: (id) => {
    const cur = get().ids;
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    set({ ids: next });
    write("q_favorites", next);
  },
  has: (id) => get().ids.includes(id),
}));

/* ---- Recents ---- */
type RecentsState = {
  ids: number[];
  push: (id: number) => void;
};
export const useRecents = create<RecentsState>((set, get) => ({
  ids: read<number[]>("q_recents", []),
  push: (id) => {
    const cur = get().ids.filter((x) => x !== id);
    const next = [id, ...cur].slice(0, 10);
    set({ ids: next });
    write("q_recents", next);
  },
}));

/* ---- Reciter selection ---- */
type ReciterState = {
  reciterId: string;
  setReciter: (id: string) => void;
};
export const useReciterSelection = create<ReciterState>((set) => ({
  reciterId: read<string>("q_reciter", "alafasy"),
  setReciter: (id) => {
    set({ reciterId: id });
    write("q_reciter", id);
  },
}));

/* ---- Playback positions (resume per reciter+surah) ---- */
type PositionsMap = Record<string, number>; // key: `${reciterId}:${surahId}` -> seconds
type PositionsState = {
  map: PositionsMap;
  get: (reciterId: string, surahId: number) => number;
  save: (reciterId: string, surahId: number, seconds: number) => void;
  clear: (reciterId: string, surahId: number) => void;
};
const POS_KEY = "q_positions";
export const usePlaybackPositions = create<PositionsState>((set, get) => ({
  map: read<PositionsMap>(POS_KEY, {}),
  get: (reciterId, surahId) => get().map[`${reciterId}:${surahId}`] ?? 0,
  save: (reciterId, surahId, seconds) => {
    if (!isFinite(seconds) || seconds < 2) return;
    const key = `${reciterId}:${surahId}`;
    const next = { ...get().map, [key]: Math.floor(seconds) };
    set({ map: next });
    write(POS_KEY, next);
  },
  clear: (reciterId, surahId) => {
    const key = `${reciterId}:${surahId}`;
    if (!(key in get().map)) return;
    const next = { ...get().map };
    delete next[key];
    set({ map: next });
    write(POS_KEY, next);
  },
}));
