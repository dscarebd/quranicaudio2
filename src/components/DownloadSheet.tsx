import { useEffect, useMemo, useRef, useState } from "react";
import { Download, X, Check, Loader2, Search } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { RECITERS } from "@/lib/reciters";
import { SURAHS } from "@/lib/quran-data";
import { useReciter } from "@/stores/persisted";
import { useT, surahName, localizeNum } from "@/lib/i18n";
import {
  downloadSelected,
  type DownloadHandle,
  type DownloadProgress,
} from "@/lib/offline-download";
import { cn } from "@/lib/utils";

export function DownloadSheet() {
  const { t, lang } = useT();
  const currentReciter = useReciter((s) => s.id);
  const [open, setOpen] = useState(false);
  const [reciterId, setReciterId] = useState(currentReciter);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [query, setQuery] = useState("");
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const [isDone, setIsDone] = useState(false);
  const handleRef = useRef<DownloadHandle | null>(null);

  useEffect(() => {
    if (open) setReciterId(currentReciter);
  }, [open, currentReciter]);

  useEffect(() => {
    return () => {
      handleRef.current?.cancel();
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SURAHS;
    return SURAHS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.bangla.includes(query.trim()) ||
        String(s.id).includes(q),
    );
  }, [query]);

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((s) => selected.has(s.id));

  const isDownloading = progress !== null && !isDone;

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllFiltered = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      filtered.forEach((s) => next.add(s.id));
      return next;
    });
  };

  const clearAll = () => setSelected(new Set());

  const start = () => {
    if (!reciterId || selected.size === 0) return;
    setIsDone(false);
    const ids = [...selected].sort((a, b) => a - b);
    setProgress({ total: ids.length, completed: 0, failed: 0, currentSurah: ids[0] });
    const handle = downloadSelected(reciterId, ids, (p) => setProgress({ ...p }));
    handleRef.current = handle;
    handle.promise.then((final) => {
      setProgress({ ...final });
      setIsDone(true);
      handleRef.current = null;
    });
  };

  const cancel = () => {
    handleRef.current?.cancel();
    handleRef.current = null;
    setProgress(null);
    setIsDone(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next && isDownloading) {
      // Don't allow closing mid-download — user must cancel or wait
      return;
    }
    if (!next) {
      // reset after closing
      setProgress(null);
      setIsDone(false);
      setQuery("");
      setSelected(new Set());
    }
    setOpen(next);
  };

  const percent = progress
    ? Math.round(((progress.completed + progress.failed) / progress.total) * 100)
    : 0;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <button
          className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition active:scale-95 hover:bg-primary/15"
          aria-label={t("downloadForOffline")}
        >
          <Download className="h-3.5 w-3.5" strokeWidth={2.5} />
          {t("download")}
        </button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="h-[88vh] rounded-t-3xl p-0 flex flex-col gap-0"
      >
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-border/50">
          <SheetTitle className="text-xl font-display font-bold flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            {t("downloadForOffline")}
          </SheetTitle>
        </SheetHeader>

        {!isDownloading && !isDone && (
          <>
            {/* Reciter */}
            <div className="px-5 pt-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                {t("selectReciter")}
              </label>
              <Select value={reciterId} onValueChange={setReciterId}>
                <SelectTrigger className="w-full h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {RECITERS.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Surah selection */}
            <div className="px-5 pt-4 pb-2 flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("selectSurahs")}
              </label>
              <span className="text-xs font-bold text-primary">
                {localizeNum(selected.size, lang)} {t("selectedCount")}
              </span>
            </div>

            <div className="px-5 flex gap-2 mb-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("searchSurahs")}
                  className="pl-9 h-10 rounded-xl"
                />
              </div>
              <button
                onClick={allFilteredSelected ? clearAll : selectAllFiltered}
                className="rounded-xl bg-secondary px-3 text-xs font-semibold whitespace-nowrap transition active:scale-95 hover:bg-secondary/70"
              >
                {allFilteredSelected ? t("clear") : t("selectAll")}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-4">
              <div className="flex flex-col gap-1">
                {filtered.map((s) => {
                  const isSel = selected.has(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggle(s.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 transition text-left",
                        isSel ? "bg-primary/10" : "hover:bg-secondary/60",
                      )}
                    >
                      <Checkbox
                        checked={isSel}
                        className="pointer-events-none"
                      />
                      <span className="w-7 text-xs font-bold text-muted-foreground tabular-nums">
                        {localizeNum(s.id, lang)}
                      </span>
                      <span className="flex-1 font-semibold text-sm truncate">
                        {surahName(s, lang)}
                      </span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {localizeNum(s.ayahs, lang)} {t("ayahs")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border/50 px-5 py-4 bg-background">
              <Button
                onClick={start}
                disabled={selected.size === 0 || !reciterId}
                className="w-full h-12 rounded-xl text-base font-bold"
              >
                <Download className="h-4 w-4 mr-2" />
                {t("startDownload")}
                {selected.size > 0 && (
                  <span className="ml-1 opacity-80">
                    ({localizeNum(selected.size, lang)})
                  </span>
                )}
              </Button>
            </div>
          </>
        )}

        {/* Progress / Done state */}
        {(isDownloading || isDone) && progress && (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
            <div
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center",
                isDone ? "bg-primary/15" : "bg-primary/10",
              )}
            >
              {isDone ? (
                <Check className="h-10 w-10 text-primary" strokeWidth={3} />
              ) : (
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-display font-bold">
                {isDone ? t("downloadComplete") : t("downloading")}
              </h3>
              <p className="text-sm text-muted-foreground tabular-nums">
                {localizeNum(progress.completed, lang)} / {localizeNum(progress.total, lang)}
                {progress.failed > 0 && (
                  <span className="text-destructive ml-2">
                    · {localizeNum(progress.failed, lang)} {t("failedCount")}
                  </span>
                )}
              </p>
            </div>

            <div className="w-full max-w-xs">
              <Progress value={percent} className="h-2" />
            </div>

            {isDone ? (
              <Button
                onClick={() => handleOpenChange(false)}
                className="w-full max-w-xs h-12 rounded-xl font-bold"
              >
                <Check className="h-4 w-4 mr-2" />
                {t("done")}
              </Button>
            ) : (
              <Button
                onClick={cancel}
                variant="outline"
                className="w-full max-w-xs h-12 rounded-xl font-bold"
              >
                <X className="h-4 w-4 mr-2" />
                {t("cancel")}
              </Button>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
