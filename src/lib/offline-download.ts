// Pre-cache all 114 surahs for a reciter by fetching each URL.
// The service worker's CacheFirst rule for the audio hosts intercepts and
// stores them. We use mode: "no-cors" so opaque responses still populate
// the cache when the CDN doesn't send CORS headers.

import { getReciter, type Reciter } from "./reciters";
import { fullSurahUrl } from "./audio-urls";
import { SURAHS } from "./quran-data";

export type SurahStatus = "pending" | "downloading" | "done" | "error";

export type DownloadProgress = {
  total: number;
  completed: number;
  failed: number;
  currentSurah: number | null;
  statuses: Record<number, SurahStatus>;
};

export type DownloadHandle = {
  promise: Promise<DownloadProgress>;
  cancel: () => void;
};

const CONCURRENCY = 3;

export function downloadReciter(
  reciterId: string,
  onProgress: (p: DownloadProgress) => void,
): DownloadHandle {
  return downloadSelected(reciterId, SURAHS.map((s) => s.id), onProgress);
}

export function downloadSelected(
  reciterId: string,
  surahIds: number[],
  onProgress: (p: DownloadProgress) => void,
): DownloadHandle {
  const reciter: Reciter = getReciter(reciterId);
  const urls = surahIds.map((id) => ({ id, url: fullSurahUrl(reciter, id) }));
  const statuses: Record<number, SurahStatus> = {};
  surahIds.forEach((id) => (statuses[id] = "pending"));
  const state: DownloadProgress = {
    total: urls.length,
    completed: 0,
    failed: 0,
    currentSurah: null,
    statuses,
  };
  let cancelled = false;
  const controllers: AbortController[] = [];

  const emit = () => onProgress({ ...state, statuses: { ...state.statuses } });

  const run = async () => {
    let cursor = 0;
    const worker = async () => {
      while (!cancelled) {
        const i = cursor++;
        if (i >= urls.length) return;
        const { id, url } = urls[i];
        state.currentSurah = id;
        state.statuses[id] = "downloading";
        emit();
        const ctrl = new AbortController();
        controllers.push(ctrl);
        try {
          await fetch(url, { mode: "no-cors", signal: ctrl.signal, cache: "reload" });
          state.completed += 1;
          state.statuses[id] = "done";
        } catch {
          if (!cancelled) {
            state.failed += 1;
            state.statuses[id] = "error";
          }
        }
        emit();
      }
    };
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    state.currentSurah = null;
    emit();
    return state;
  };

  return {
    promise: run(),
    cancel: () => {
      cancelled = true;
      controllers.forEach((c) => {
        try {
          c.abort();
        } catch {
          /* ignore */
        }
      });
    },
  };
}

export async function clearReciterCache(): Promise<void> {
  if (typeof caches === "undefined") return;
  await Promise.allSettled([caches.delete("quran-audio-full"), caches.delete("quran-audio-ayah")]);
}

export async function getCachedSurahCount(reciterId: string): Promise<number> {
  if (typeof caches === "undefined") return 0;
  try {
    const cache = await caches.open("quran-audio-full");
    const reciter = getReciter(reciterId);
    const keys = await cache.keys();
    const prefix = reciter.mp3quranBase;
    return keys.filter((req) => req.url.startsWith(prefix)).length;
  } catch {
    return 0;
  }
}

/** Returns surah ids currently cached for a reciter. */
export async function getCachedSurahIds(reciterId: string): Promise<number[]> {
  if (typeof caches === "undefined") return [];
  try {
    const cache = await caches.open("quran-audio-full");
    const reciter = getReciter(reciterId);
    const keys = await cache.keys();
    const ids = new Set<number>();
    for (const s of SURAHS) {
      const url = fullSurahUrl(reciter, s.id);
      if (keys.some((r) => r.url === url)) ids.add(s.id);
    }
    return [...ids].sort((a, b) => a - b);
  } catch {
    return [];
  }
}

/** Returns a map of reciterId -> cached surah ids, for every reciter that has any. */
export async function getAllCached(): Promise<Record<string, number[]>> {
  if (typeof caches === "undefined") return {};
  const { RECITERS } = await import("./reciters");
  const result: Record<string, number[]> = {};
  try {
    const cache = await caches.open("quran-audio-full");
    const keys = await cache.keys();
    const urlSet = new Set(keys.map((r) => r.url));
    for (const reciter of RECITERS) {
      const ids: number[] = [];
      for (const s of SURAHS) {
        if (urlSet.has(fullSurahUrl(reciter, s.id))) ids.push(s.id);
      }
      if (ids.length > 0) result[reciter.id] = ids;
    }
  } catch {
    /* ignore */
  }
  return result;
}

/** Remove a single cached surah for a reciter. */
export async function removeCachedSurah(reciterId: string, surahId: number): Promise<boolean> {
  if (typeof caches === "undefined") return false;
  try {
    const cache = await caches.open("quran-audio-full");
    const reciter = getReciter(reciterId);
    const url = fullSurahUrl(reciter, surahId);
    return await cache.delete(url);
  } catch {
    return false;
  }
}

/** Remove all cached surahs for a single reciter. */
export async function removeReciterDownloads(reciterId: string): Promise<void> {
  if (typeof caches === "undefined") return;
  try {
    const cache = await caches.open("quran-audio-full");
    const reciter = getReciter(reciterId);
    await Promise.allSettled(
      SURAHS.map((s) => cache.delete(fullSurahUrl(reciter, s.id))),
    );
  } catch {
    /* ignore */
  }
}

