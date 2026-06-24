// Pre-cache all 114 surahs for a reciter by fetching each URL.
// The service worker's CacheFirst rule for the audio hosts intercepts and
// stores them. We use mode: "no-cors" so opaque responses still populate
// the cache when the CDN doesn't send CORS headers.

import { getReciter, type Reciter } from "./reciters";
import { fullSurahUrl } from "./audio-urls";
import { SURAHS } from "./quran-data";

export type DownloadProgress = {
  total: number;
  completed: number;
  failed: number;
  currentSurah: number | null;
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
  const state: DownloadProgress = {
    total: urls.length,
    completed: 0,
    failed: 0,
    currentSurah: null,
  };
  let cancelled = false;
  const controllers: AbortController[] = [];

  const run = async () => {
    let cursor = 0;
    const worker = async () => {
      while (!cancelled) {
        const i = cursor++;
        if (i >= urls.length) return;
        const { id, url } = urls[i];
        state.currentSurah = id;
        const ctrl = new AbortController();
        controllers.push(ctrl);
        try {
          // no-cors: opaque response — workbox CacheFirst with statuses [0,200] still caches it.
          await fetch(url, { mode: "no-cors", signal: ctrl.signal, cache: "reload" });
          state.completed += 1;
        } catch {
          if (!cancelled) state.failed += 1;
        }
        onProgress({ ...state });
      }
    };
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    state.currentSurah = null;
    onProgress({ ...state });
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
