import { create } from "zustand";

export type RepeatMode = "off" | "all" | "one";

export type SleepMode = "off" | "end-of-track" | "minutes";

export type PlayerState = {
  surahId: number | null;
  ayahId: number | null; // null = playing full surah
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  shuffle: boolean;
  repeat: RepeatMode;
  playbackRate: number;
  sleepMode: SleepMode;
  sleepEndsAt: number | null; // epoch ms when timer fires (minutes mode)
  // Imperative actions wired up by use-audio
  play: (surahId: number, ayahId?: number | null) => void;
  toggle: () => void;
  setTime: (t: number) => void;
  setDuration: (d: number) => void;
  setPlaying: (p: boolean) => void;
  seek: (t: number) => void;
  next: () => void;
  prev: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setPlaybackRate: (r: number) => void;
  setSleepTimer: (minutes: number | "end-of-track" | null) => void;
  clearSleepIfNeeded: () => void;
  _seekRequest: number | null;
  consumeSeek: () => number | null;
};

export const usePlayer = create<PlayerState>((set, get) => ({
  surahId: null,
  ayahId: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  shuffle: false,
  repeat: "off",
  playbackRate: 1,
  sleepMode: "off",
  sleepEndsAt: null,
  _seekRequest: null,
  play: (surahId, ayahId = null) =>
    set({ surahId, ayahId, isPlaying: true, currentTime: 0, duration: 0 }),
  toggle: () => set({ isPlaying: !get().isPlaying }),
  setTime: (t) => set({ currentTime: t }),
  setDuration: (d) => set({ duration: d }),
  setPlaying: (p) => set({ isPlaying: p }),
  seek: (t) => set({ _seekRequest: t, currentTime: t }),
  consumeSeek: () => {
    const v = get()._seekRequest;
    if (v !== null) set({ _seekRequest: null });
    return v;
  },
  next: () => {
    const { surahId, ayahId, shuffle } = get();
    if (surahId == null) return;
    if (ayahId != null) {
      set({ ayahId: ayahId + 1, currentTime: 0, duration: 0, isPlaying: true });
    } else {
      const nextId = shuffle
        ? Math.floor(Math.random() * 114) + 1
        : Math.min(114, surahId + 1);
      set({ surahId: nextId, currentTime: 0, duration: 0, isPlaying: true });
    }
  },
  prev: () => {
    const { surahId, ayahId } = get();
    if (surahId == null) return;
    if (ayahId != null && ayahId > 1) {
      set({ ayahId: ayahId - 1, currentTime: 0, duration: 0, isPlaying: true });
    } else {
      set({
        surahId: Math.max(1, surahId - 1),
        currentTime: 0,
        duration: 0,
        isPlaying: true,
      });
    }
  },
  toggleShuffle: () => set({ shuffle: !get().shuffle }),
  cycleRepeat: () => {
    const order: RepeatMode[] = ["off", "all", "one"];
    set({ repeat: order[(order.indexOf(get().repeat) + 1) % order.length] });
  },
  setPlaybackRate: (r) => set({ playbackRate: r }),
  setSleepTimer: (m) => {
    if (m == null) {
      set({ sleepMode: "off", sleepEndsAt: null });
    } else if (m === "end-of-track") {
      set({ sleepMode: "end-of-track", sleepEndsAt: null });
    } else {
      set({ sleepMode: "minutes", sleepEndsAt: Date.now() + m * 60_000 });
    }
  },
  clearSleepIfNeeded: () => {
    const { sleepMode, sleepEndsAt } = get();
    if (sleepMode === "minutes" && sleepEndsAt != null && Date.now() >= sleepEndsAt) {
      set({ isPlaying: false, sleepMode: "off", sleepEndsAt: null });
    }
  },
}));

export const formatTime = (s: number) => {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
};
