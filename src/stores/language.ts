import { create } from "zustand";

export type Lang = "en" | "bn";

const KEY = "qa-language";
const isBrowser = typeof window !== "undefined";

const read = (): Lang => {
  if (!isBrowser) return "en";
  try {
    const raw = localStorage.getItem(KEY);
    return raw === "bn" ? "bn" : "en";
  } catch {
    return "en";
  }
};

type State = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
};

export const useLanguage = create<State>((set, get) => ({
  lang: read(),
  setLang: (l) => {
    set({ lang: l });
    if (isBrowser) {
      try { localStorage.setItem(KEY, l); } catch { /* ignore */ }
    }
  },
  toggle: () => get().setLang(get().lang === "en" ? "bn" : "en"),
}));
