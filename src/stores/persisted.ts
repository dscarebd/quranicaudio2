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
