import { Link } from "@tanstack/react-router";
import { Heart, Play, Pause } from "lucide-react";
import { SURAHS, approxDuration } from "@/lib/quran-data";
import { usePlayer, formatTime } from "@/stores/player";
import { useFavorites } from "@/stores/persisted";

export function SurahListItem({ id }: { id: number }) {
  const surah = SURAHS[id - 1];
  const isActive = usePlayer((s) => s.surahId === id && s.ayahId == null);
  const isPlaying = usePlayer((s) => s.isPlaying) && isActive;
  const currentTime = usePlayer((s) => s.currentTime);
  const play = usePlayer((s) => s.play);
  const toggle = usePlayer((s) => s.toggle);
  const isFav = useFavorites((s) => s.ids.includes(id));
  const toggleFav = useFavorites((s) => s.toggle);

  const onPlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isActive) toggle();
    else play(id, null);
  };

  return (
    <Link
      to="/surah/$id"
      params={{ id: String(id) }}
      className="flex items-center gap-3 px-5 py-3 active:bg-surface rounded-2xl"
    >
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground truncate">
          {String(surah.id).padStart(2, "0")} Sura {surah.name}
        </h4>
        <p className={`text-sm mt-0.5 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
          {isActive ? `${formatTime(currentTime)} / ${approxDuration(surah.ayahs)}` : approxDuration(surah.ayahs)}
        </p>
      </div>
      <button
        onClick={onPlay}
        aria-label={isPlaying ? "Pause" : "Play"}
        className="p-2 rounded-full bg-surface hover:bg-muted transition"
      >
        {isPlaying ? (
          <Pause className={`h-6 w-6 transition ${isActive ? "text-primary" : "text-muted-foreground"}`} />
        ) : (
          <Play className="h-6 w-6 text-muted-foreground transition" />
        )}
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFav(id);
        }}
        aria-label="Favorite"
        className="p-2 rounded-full bg-surface hover:bg-muted transition"
      >
        <Heart
          className={`h-6 w-6 transition ${
            isFav ? "fill-primary text-primary" : "text-muted-foreground"
          }`}
        />
      </button>
    </Link>
  );
}
