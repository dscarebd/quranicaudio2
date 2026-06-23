import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ChevronLeft, Gauge, Heart, Moon, Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Mic2, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { usePlayer, formatTime } from "@/stores/player";
import { getSurah } from "@/lib/quran-data";
import { useFavorites, useReciterSelection } from "@/stores/persisted";
import { RECITERS, getReciter } from "@/lib/reciters";
import { SurahCoverArt } from "@/components/SurahCoverArt";
import { AppShell } from "@/components/AppShell";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 1.75, 2];
const SLEEP_OPTIONS: { label: string; value: number | "end-of-track" | null }[] = [
  { label: "Off", value: null },
  { label: "End of track", value: "end-of-track" },
  { label: "5 min", value: 5 },
  { label: "10 min", value: 10 },
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "60 min", value: 60 },
];

export const Route = createFileRoute("/player")({
  head: () => ({ meta: [{ title: "Now Playing — Quran Audio" }] }),
  component: PlayerPage,
});

function PlayerPage() {
  const navigate = useNavigate();
  const surahId = usePlayer((s) => s.surahId);
  const ayahId = usePlayer((s) => s.ayahId);
  const isPlaying = usePlayer((s) => s.isPlaying);
  const currentTime = usePlayer((s) => s.currentTime);
  const duration = usePlayer((s) => s.duration);
  const shuffle = usePlayer((s) => s.shuffle);
  const repeat = usePlayer((s) => s.repeat);
  const toggle = usePlayer((s) => s.toggle);
  const seek = usePlayer((s) => s.seek);
  const next = usePlayer((s) => s.next);
  const prev = usePlayer((s) => s.prev);
  const toggleShuffle = usePlayer((s) => s.toggleShuffle);
  const cycleRepeat = usePlayer((s) => s.cycleRepeat);
  const playbackRate = usePlayer((s) => s.playbackRate);
  const setPlaybackRate = usePlayer((s) => s.setPlaybackRate);
  const sleepMode = usePlayer((s) => s.sleepMode);
  const sleepEndsAt = usePlayer((s) => s.sleepEndsAt);
  const setSleepTimer = usePlayer((s) => s.setSleepTimer);
  const isFav = useFavorites((s) => surahId != null && s.ids.includes(surahId));
  const toggleFav = useFavorites((s) => s.toggle);

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (sleepMode !== "minutes") return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [sleepMode]);
  const sleepRemaining =
    sleepMode === "minutes" && sleepEndsAt ? Math.max(0, sleepEndsAt - now) : 0;
  const sleepLabel =
    sleepMode === "off"
      ? null
      : sleepMode === "end-of-track"
        ? "End of track"
        : formatTime(sleepRemaining / 1000);

  // Avoid SSR/hydration blink: zustand store is client-only, so the server
  // always renders surahId == null. Wait for mount before deciding what to show.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <AppShell>
        <div className="px-5 pt-20" />
      </AppShell>
    );
  }

  if (surahId == null) {
    return (
      <AppShell>
        <div className="px-5 pt-20 text-center text-muted-foreground animate-in fade-in duration-300">
          <p>No track playing.</p>
          <Link to="/" className="text-primary font-semibold mt-4 inline-block">Go home</Link>
        </div>
      </AppShell>
    );
  }
  const surah = getSurah(surahId)!;

  return (
    <AppShell>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <header className="flex items-center justify-between px-5 pt-4 pb-2">
        <button
          onClick={() => navigate({ to: "/" })}
          className="h-10 w-10 rounded-full bg-surface flex items-center justify-center transition-transform active:scale-90"
          aria-label="Back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold font-display">Now playing</h1>
        <div className="w-10" />
      </header>

      <div className="px-5 mt-6">
        <SurahCoverArt surahId={surahId} className="w-full aspect-square rounded-3xl shadow-2xl shadow-primary/10 transition-transform duration-500" />
      </div>

      <div className="px-5 mt-6 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold font-display truncate">
            {String(surah.id).padStart(2, "0")} Sura {surah.name}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {ayahId != null ? `Ayah ${ayahId} / ${surah.ayahs}` : `${surah.ayahs} verses · ${surah.type}`}
          </p>
        </div>
        <button
          onClick={() => toggleFav(surahId)}
          aria-label="Favorite"
          className="p-2 transition-transform active:scale-75"
        >
          <Heart className={`h-7 w-7 transition-colors duration-200 ${isFav ? "fill-primary text-primary" : "text-muted-foreground"}`} />
        </button>
      </div>

      <div className="px-5 mt-4">
        <ReciterSwitcher />
      </div>

      <div className="px-5 mt-6">
        <input
          type="range"
          min={0}
          max={Math.max(duration, 0.1)}
          step={0.1}
          value={Math.min(currentTime, duration || currentTime)}
          onChange={(e) => seek(Number(e.target.value))}
          className="w-full accent-primary cursor-pointer"
        />
        <div className="flex justify-between text-sm text-muted-foreground mt-1 tabular-nums">
          <span>{formatTime(currentTime)}</span>
          <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
        </div>
        {sleepMode === "minutes" && sleepEndsAt && (
          <div className="text-center text-xs text-muted-foreground mt-1">
            Sleep at{" "}
            {new Date(sleepEndsAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>

      <div className="px-5 mt-10 flex items-center justify-between">
        <button onClick={cycleRepeat} aria-label="Repeat" className="text-muted-foreground p-2 transition-transform active:scale-90">
          {repeat === "one" ? (
            <Repeat1 className="h-6 w-6 text-primary" />
          ) : (
            <Repeat className={`h-6 w-6 transition-colors ${repeat === "all" ? "text-primary" : ""}`} />
          )}
        </button>
        <button onClick={prev} aria-label="Previous" className="text-foreground p-2 transition-transform active:scale-90">
          <SkipBack className="h-8 w-8 fill-current" />
        </button>
        <button
          onClick={toggle}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="h-20 w-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl shadow-primary/30 active:scale-95 transition-transform duration-150"
        >
          {isPlaying ? <Pause className="h-9 w-9" /> : <Play className="h-9 w-9 ml-1" />}
        </button>
        <button onClick={next} aria-label="Next" className="text-foreground p-2 transition-transform active:scale-90">
          <SkipForward className="h-8 w-8 fill-current" />
        </button>
        <button onClick={toggleShuffle} aria-label="Shuffle" className="text-muted-foreground p-2 transition-transform active:scale-90">
          <Shuffle className={`h-6 w-6 transition-colors ${shuffle ? "text-primary" : ""}`} />
        </button>
      </div>

      <div className="px-5 mt-8 flex items-center justify-center gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={`flex items-center gap-2 h-10 px-4 rounded-full bg-surface text-sm font-medium transition-all active:scale-95 ${playbackRate !== 1 ? "text-primary" : "text-foreground"}`}
              aria-label="Playback speed"
            >
              <Gauge className="h-4 w-4" />
              {playbackRate}x
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="center">
            <p className="text-xs text-muted-foreground px-2 pb-2">Playback speed</p>
            <div className="grid grid-cols-3 gap-1">
              {SPEED_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setPlaybackRate(s)}
                  className={`h-9 rounded-md text-sm font-medium transition ${
                    playbackRate === s
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-surface"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button
              className={`flex items-center gap-2 h-10 px-4 rounded-full bg-surface text-sm font-medium ${sleepMode !== "off" ? "text-primary" : "text-foreground"}`}
              aria-label="Sleep timer"
            >
              <Moon className="h-4 w-4" />
              {sleepLabel ?? "Sleep"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="center">
            <p className="text-xs text-muted-foreground px-2 pb-2">Sleep timer</p>
            <div className="flex flex-col">
              {SLEEP_OPTIONS.map((opt) => {
                const active =
                  (opt.value === null && sleepMode === "off") ||
                  (opt.value === "end-of-track" && sleepMode === "end-of-track") ||
                  (typeof opt.value === "number" &&
                    sleepMode === "minutes" &&
                    sleepEndsAt != null &&
                    Math.abs((sleepEndsAt - Date.now()) / 60_000 - opt.value) < 1);
                return (
                  <button
                    key={opt.label}
                    onClick={() => setSleepTimer(opt.value)}
                    className={`text-left px-3 h-9 rounded-md text-sm transition ${
                      active
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "hover:bg-surface"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      </div>

    </AppShell>
  );
}

function ReciterSwitcher() {
  const selectedId = useReciterSelection((s) => s.reciterId);
  const setReciter = useReciterSelection((s) => s.setReciter);
  const reciter = getReciter(selectedId);
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="w-full flex items-center gap-3 p-3 rounded-2xl bg-surface transition active:scale-[0.98]">
          <img
            src={reciter.image}
            alt={reciter.name}
            loading="lazy"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover bg-surface-2 ring-2 ring-border"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
            }}
          />
          <div className="flex-1 text-left min-w-0">
            <p className="text-xs text-muted-foreground">Reciter</p>
            <p className="font-semibold text-sm truncate">{reciter.name}</p>
          </div>
          <Mic2 className="h-4 w-4 text-muted-foreground" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl pb-8">
        <SheetHeader className="text-left mb-4">
          <SheetTitle className="font-display">Choose Reciter</SheetTitle>
        </SheetHeader>
        <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {RECITERS.map((r) => {
            const active = r.id === selectedId;
            return (
              <li key={r.id}>
                <button
                  onClick={() => {
                    setReciter(r.id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl transition active:scale-[0.98] ${
                    active
                      ? "bg-primary/15 ring-1 ring-primary"
                      : "bg-surface hover:bg-surface-2"
                  }`}
                >
                  <img
                    src={r.image}
                    alt={r.name}
                    loading="lazy"
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover bg-surface-2 ring-2 ring-border"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                    }}
                  />
                  <div className="flex-1 text-left min-w-0">
                    <p className={`font-semibold text-sm truncate ${active ? "text-primary" : ""}`}>
                      {r.name}
                    </p>
                    <p className="arabic text-xs text-muted-foreground">{r.arabic}</p>
                  </div>
                  {active && (
                    <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
