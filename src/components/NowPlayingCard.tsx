import { Link } from "@tanstack/react-router";
import { usePlayer, formatTime } from "@/stores/player";
import { getSurah } from "@/lib/quran-data";
import { SurahCoverArt } from "./SurahCoverArt";

export function NowPlayingCard() {
  const surahId = usePlayer((s) => s.surahId);
  const currentTime = usePlayer((s) => s.currentTime);
  if (surahId == null) return null;
  const surah = getSurah(surahId);
  if (!surah) return null;
  return (
    <Link
      to="/player"
      className="mx-5 mb-6 block rounded-3xl bg-primary text-primary-foreground p-5 relative overflow-hidden shadow-lg shadow-primary/20"
    >
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-80">Now Playing</p>
          <h3 className="text-xl font-bold font-display mt-1">
            {String(surah.id).padStart(2, "0")} Sura {surah.name}
          </h3>
          <p className="text-sm font-semibold opacity-80 mt-6">{formatTime(currentTime)}</p>
        </div>
        <SurahCoverArt
          surahId={surahId}
          showName={false}
          className="h-20 w-20 rounded-full ring-2 ring-primary-foreground/30"
        />
      </div>
      <svg
        aria-hidden
        className="absolute -right-4 -top-4 opacity-30"
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
