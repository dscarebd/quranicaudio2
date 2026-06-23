import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ChevronLeft, Heart, Info, Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward } from "lucide-react";
import { usePlayer, formatTime } from "@/stores/player";
import { getSurah } from "@/lib/quran-data";
import { useFavorites } from "@/stores/persisted";
import { SurahCoverArt } from "@/components/SurahCoverArt";
import { AppShell } from "@/components/AppShell";

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
  const isFav = useFavorites((s) => surahId != null && s.ids.includes(surahId));
  const toggleFav = useFavorites((s) => s.toggle);

  if (surahId == null) {
    return (
      <AppShell>
        <div className="px-5 pt-20 text-center text-muted-foreground">
          <p>No track playing.</p>
          <Link to="/" className="text-primary font-semibold mt-4 inline-block">Go home</Link>
        </div>
      </AppShell>
    );
  }
  const surah = getSurah(surahId)!;

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
        <h1 className="text-lg font-bold font-display">Now playing</h1>
        <button className="h-10 w-10 rounded-full bg-surface flex items-center justify-center" aria-label="Info">
          <Info className="h-5 w-5" />
        </button>
      </header>

      <div className="px-5 mt-6">
        <SurahCoverArt surahId={surahId} className="w-full aspect-square rounded-3xl" />
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
        <button onClick={() => toggleFav(surahId)} aria-label="Favorite" className="p-2">
          <Heart className={`h-7 w-7 ${isFav ? "fill-primary text-primary" : "text-muted-foreground"}`} />
        </button>
      </div>

      <div className="px-5 mt-8">
        <input
          type="range"
          min={0}
          max={Math.max(duration, 0.1)}
          step={0.1}
          value={Math.min(currentTime, duration || currentTime)}
          onChange={(e) => seek(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-sm text-muted-foreground mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="px-5 mt-10 flex items-center justify-between">
        <button onClick={cycleRepeat} aria-label="Repeat" className="text-muted-foreground p-2">
          {repeat === "one" ? (
            <Repeat1 className="h-6 w-6 text-primary" />
          ) : (
            <Repeat className={`h-6 w-6 ${repeat === "all" ? "text-primary" : ""}`} />
          )}
        </button>
        <button onClick={prev} aria-label="Previous" className="text-foreground p-2">
          <SkipBack className="h-8 w-8 fill-current" />
        </button>
        <button
          onClick={toggle}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="h-20 w-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl shadow-primary/30 active:scale-95 transition"
        >
          {isPlaying ? <Pause className="h-9 w-9" /> : <Play className="h-9 w-9 ml-1" />}
        </button>
        <button onClick={next} aria-label="Next" className="text-foreground p-2">
          <SkipForward className="h-8 w-8 fill-current" />
        </button>
        <button onClick={toggleShuffle} aria-label="Shuffle" className="text-muted-foreground p-2">
          <Shuffle className={`h-6 w-6 ${shuffle ? "text-primary" : ""}`} />
        </button>
      </div>
    </AppShell>
  );
}
