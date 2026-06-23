import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Check, Download, Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { RECITERS } from "@/lib/reciters";
import { useReciterSelection } from "@/stores/persisted";
import { AppShell } from "@/components/AppShell";
import {
  downloadReciter,
  clearReciterCache,
  getCachedSurahCount,
  type DownloadHandle,
  type DownloadProgress,
} from "@/lib/offline-download";

export const Route = createFileRoute("/reciters")({
  head: () => ({
    meta: [
      { title: "Choose Reciter — Quran Audio" },
      { name: "description", content: "Pick from 15 renowned Quran reciters." },
    ],
  }),
  component: RecitersPage,
});

function RecitersPage() {
  const navigate = useNavigate();
  const selected = useReciterSelection((s) => s.reciterId);
  const setReciter = useReciterSelection((s) => s.setReciter);

  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const [handle, setHandle] = useState<DownloadHandle | null>(null);
  const [cachedCount, setCachedCount] = useState(0);
  const [swReady, setSwReady] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((r) => setSwReady(!!r?.active));
    }
  }, []);

  useEffect(() => {
    let alive = true;
    getCachedSurahCount(selected).then((n) => alive && setCachedCount(n));
    return () => {
      alive = false;
    };
  }, [selected, progress?.completed]);

  const startDownload = () => {
    if (handle) return;
    setProgress({ total: 114, completed: 0, failed: 0, currentSurah: null });
    const h = downloadReciter(selected, setProgress);
    setHandle(h);
    h.promise.finally(() => setHandle(null));
  };

  const cancelDownload = () => {
    handle?.cancel();
    setHandle(null);
  };

  const clearCache = async () => {
    await clearReciterCache();
    setCachedCount(0);
    setProgress(null);
  };

  const selectedReciter = RECITERS.find((r) => r.id === selected);
  const pct = progress ? Math.round((progress.completed / progress.total) * 100) : 0;

  return (
    <AppShell>
      <header className="flex items-center justify-between px-5 pt-4 pb-2">
        <button
          onClick={() => navigate({ to: "/" })}
          className="h-10 w-10 rounded-full bg-surface flex items-center justify-center"
          aria-label="Back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold font-display">Reciters</h1>
        <span className="w-10" />
      </header>

      <p className="px-5 text-sm text-muted-foreground mt-1 mb-4">
        Choose your reciter — your selection applies to every surah you play.
      </p>

      {/* Offline download panel */}
      <div className="mx-5 mb-4 p-4 rounded-2xl bg-surface">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
            <Download className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">Offline downloads</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {selectedReciter?.name} · {cachedCount}/114 saved
            </p>
          </div>
        </div>

        {progress && (
          <div className="mt-3">
            <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-200"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 tabular-nums">
              {progress.completed}/{progress.total}
              {progress.failed > 0 && ` · ${progress.failed} failed`}
              {progress.currentSurah && ` · Surah ${progress.currentSurah}`}
            </p>
          </div>
        )}

        <div className="mt-3 flex gap-2">
          {handle ? (
            <button
              onClick={cancelDownload}
              className="flex-1 h-10 rounded-full bg-surface-2 text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Cancel
            </button>
          ) : (
            <button
              onClick={startDownload}
              disabled={!swReady}
              className="flex-1 h-10 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 transition disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {cachedCount >= 114 ? "Re-download all" : "Download all 114"}
            </button>
          )}
          {cachedCount > 0 && !handle && (
            <button
              onClick={clearCache}
              className="h-10 w-10 rounded-full bg-surface-2 flex items-center justify-center active:scale-95 transition"
              aria-label="Clear cached audio"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        {!swReady && (
          <p className="text-[11px] text-muted-foreground mt-2">
            Offline caching activates on the published app. Open the deployed URL to download.
          </p>
        )}
      </div>

      <ul className="px-5 space-y-2">
        {RECITERS.map((r) => {
          const active = r.id === selected;
          return (
            <li key={r.id}>
              <button
                onClick={() => setReciter(r.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition ${
                  active ? "bg-primary/15 ring-1 ring-primary" : "bg-surface"
                }`}
              >
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold ${
                    active ? "bg-primary text-primary-foreground" : "bg-surface-2 text-foreground"
                  }`}
                >
                  {r.name
                    .split(" ")
                    .slice(0, 2)
                    .map((p) => p[0])
                    .join("")}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold truncate">{r.name}</p>
                  <p className="arabic text-sm text-muted-foreground">{r.arabic}</p>
                </div>
                {active && <Check className="h-5 w-5 text-primary" />}
              </button>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
