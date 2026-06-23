import { Link } from "@tanstack/react-router";
import { Shuffle, Repeat, Repeat1 } from "lucide-react";
import { usePlayer, formatTime } from "@/stores/player";
import { getSurah } from "@/lib/quran-data";
import { SurahCoverArt } from "./SurahCoverArt";
import { cn } from "@/lib/utils";

export function NowPlayingCard() {
  const surahId = usePlayer((s) => s.surahId);
  const currentTime = usePlayer((s) => s.currentTime);
  const shuffle = usePlayer((s) => s.shuffle);
  const repeat = usePlayer((s) => s.repeat);
  const toggleShuffle = usePlayer((s) => s.toggleShuffle);
  const cycleRepeat = usePlayer((s) => s.cycleRepeat);
  if (surahId == null) return null;
  const surah = getSurah(surahId);
  if (!surah) return null;

  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Link
      to="/player"
      className="mx-5 mb-6 block rounded-3xl bg-primary text-primary-foreground p-5 relative overflow-hidden shadow-lg shadow-primary/20"
    >
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium opacity-80">Now Playing</p>
          <h3 className="text-xl font-bold font-display mt-1 truncate">
            {String(surah.id).padStart(2, "0")} Sura {surah.name}
          </h3>
          <div className="flex items-center gap-3 mt-6">
            <p className="text-sm font-semibold opacity-80">{formatTime(currentTime)}</p>
            <button
              type="button"
              aria-label={shuffle ? "Disable shuffle" : "Enable shuffle"}
              aria-pressed={shuffle}
              onClick={(e) => {
                stop(e);
                toggleShuffle();
              }}
              className={cn(
                "h-8 w-8 inline-flex items-center justify-center rounded-full transition-colors",
                shuffle
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "text-primary-foreground/70 hover:text-primary-foreground"
              )}
            >
              <Shuffle size={16} />
            </button>
            <button
              type="button"
              aria-label={`Repeat: ${repeat}`}
              onClick={(e) => {
                stop(e);
                cycleRepeat();
              }}
              className={cn(
                "h-8 w-8 inline-flex items-center justify-center rounded-full transition-colors",
                repeat !== "off"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "text-primary-foreground/70 hover:text-primary-foreground"
              )}
            >
              {repeat === "one" ? <Repeat1 size={16} /> : <Repeat size={16} />}
            </button>
          </div>
        </div>
        <SurahCoverArt
          surahId={surahId}
          showName={false}
          className="h-20 w-20 rounded-full ring-2 ring-primary-foreground/30"
        />
      </div>
      <svg
        aria-hidden
        className="absolute -right-4 -top-4 opacity-30 pointer-events-none"
        width="120"
        height="120"
        viewBox="0 0 100 100"
      >
        <path d="M10 90 Q30 10 50 50 Q70 90 90 10" stroke="white" strokeWidth="2" fill="none" />
        <path d="M0 80 Q25 20 50 60 Q75 100 100 30" stroke="white" strokeWidth="1.5" fill="none" />
      </svg>
    </Link>
  );
}
