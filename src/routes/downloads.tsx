import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Download, Play, Pause, Trash2, ChevronLeft, HardDrive } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { SURAHS } from "@/lib/quran-data";
import { RECITERS, getReciter } from "@/lib/reciters";
import {
  getAllCached,
  removeCachedSurah,
  removeReciterDownloads,
} from "@/lib/offline-download";
import { usePlayer } from "@/stores/player";
import { useReciterSelection } from "@/stores/persisted";
import { useT, surahName, localizeNum } from "@/lib/i18n";

export const Route = createFileRoute("/downloads")({
  head: () => ({
    meta: [
      { title: "Downloads — Quran Audio" },
      { name: "description", content: "Manage surahs saved for offline listening." },
    ],
  }),
  component: DownloadsPage,
});

function DownloadsPage() {
  const { t, lang } = useT();
  const [cached, setCached] = useState<Record<string, number[]> | null>(null);

  const refresh = useCallback(async () => {
    const all = await getAllCached();
    setCached(all);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const totalSurahs = cached
    ? Object.values(cached).reduce((sum, ids) => sum + ids.length, 0)
    : 0;
  const reciterEntries = cached
    ? Object.entries(cached).filter(([, ids]) => ids.length > 0)
    : [];

  return (
    <AppShell>
      <div className="flex items-center gap-2 px-5 pt-4 pb-2">
        <Link
          to="/profile"
          className="p-2 -ml-2 rounded-full hover:bg-muted transition"
          aria-label={t("back")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold font-display flex-1">{t("downloads")}</h1>
      </div>

      {cached === null ? (
        <div className="px-5 py-10 text-center text-sm text-muted-foreground">
          {t("downloading")}
        </div>
      ) : reciterEntries.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="mx-5 mb-4 rounded-2xl bg-primary/5 border border-primary/10 px-4 py-3 flex items-center gap-3">
            <HardDrive className="h-5 w-5 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">
                {localizeNum(totalSurahs, lang)} {t("surahsCount")} ·{" "}
                {localizeNum(reciterEntries.length, lang)} {t("reciters")}
              </div>
              <div className="text-xs text-muted-foreground">{t("downloadsHint")}</div>
            </div>
          </div>

          <div className="flex flex-col gap-4 pb-6">
            {reciterEntries.map(([reciterId, ids]) => (
              <ReciterGroup
                key={reciterId}
                reciterId={reciterId}
                ids={ids}
                onChanged={refresh}
              />
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}

function EmptyState() {
  const { t } = useT();
  return (
    <div className="px-8 py-16 flex flex-col items-center text-center gap-4">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
        <Download className="h-10 w-10 text-primary" />
      </div>
      <div>
        <h2 className="text-lg font-bold font-display">{t("noDownloads")}</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          {t("noDownloadsHint")}
        </p>
      </div>
      <Button asChild className="rounded-xl mt-2">
        <Link to="/">{t("goHome")}</Link>
      </Button>
    </div>
  );
}

function ReciterGroup({
  reciterId,
  ids,
  onChanged,
}: {
  reciterId: string;
  ids: number[];
  onChanged: () => void;
}) {
  const { t, lang } = useT();
  const reciter = getReciter(reciterId);
  const isKnown = RECITERS.some((r) => r.id === reciterId);
  const setReciter = useReciterSelection((s) => s.setReciter);
  const currentSurahId = usePlayer((s) => s.surahId);
  const isPlaying = usePlayer((s) => s.isPlaying);
  const currentAyah = usePlayer((s) => s.ayahId);
  const play = usePlayer((s) => s.play);
  const toggle = usePlayer((s) => s.toggle);
  const globalReciter = useReciterSelection((s) => s.reciterId);

  const onPlay = (surahId: number) => {
    if (globalReciter !== reciterId) setReciter(reciterId);
    const isActive =
      currentSurahId === surahId && currentAyah == null && globalReciter === reciterId;
    if (isActive) toggle();
    else play(surahId, null);
  };

  const onRemoveOne = async (surahId: number) => {
    await removeCachedSurah(reciterId, surahId);
    onChanged();
  };

  const onRemoveAll = async () => {
    if (!confirm(`${t("removeAll")} — ${reciter.name}?`)) return;
    await removeReciterDownloads(reciterId);
    onChanged();
  };

  if (!isKnown) return null;

  return (
    <section>
      <div className="px-5 mb-2 flex items-center gap-3">
        <img
          src={reciter.image}
          alt={reciter.name}
          loading="lazy"
          className="h-10 w-10 rounded-full object-cover bg-muted"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold font-display truncate">{reciter.name}</h3>
          <p className="text-xs text-muted-foreground">
            {localizeNum(ids.length, lang)} {t("surahsCount")}
          </p>
        </div>
        <button
          onClick={onRemoveAll}
          className="text-xs font-semibold text-destructive px-2 py-1 rounded-lg hover:bg-destructive/10 transition"
        >
          {t("removeAll")}
        </button>
      </div>

      <div className="mx-5 rounded-2xl bg-surface border border-border overflow-hidden divide-y divide-border">
        {ids.map((id) => {
          const surah = SURAHS[id - 1];
          if (!surah) return null;
          const isActive =
            globalReciter === reciterId &&
            currentSurahId === id &&
            currentAyah == null;
          const showPause = isActive && isPlaying;
          return (
            <div key={id} className="flex items-center gap-3 px-4 py-3">
              <span className="w-7 text-xs font-bold text-muted-foreground tabular-nums">
                {localizeNum(id, lang)}
              </span>
              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm font-semibold truncate ${
                    isActive ? "text-primary" : ""
                  }`}
                >
                  {surahName(surah, lang)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {localizeNum(surah.ayahs, lang)} {t("ayahs")}
                </div>
              </div>
              <button
                onClick={() => onPlay(id)}
                aria-label={showPause ? t("pause") : t("play")}
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition"
              >
                {showPause ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => onRemoveOne(id)}
                aria-label={t("removeDownload")}
                className="p-2 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
