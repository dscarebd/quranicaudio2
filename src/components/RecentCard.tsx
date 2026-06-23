import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { SURAHS, approxDuration } from "@/lib/quran-data";
import { usePlayer } from "@/stores/player";
import { SurahCoverArt } from "./SurahCoverArt";

export function RecentCard({ id }: { id: number }) {
  const surah = SURAHS[id - 1];
  const play = usePlayer((s) => s.play);
  const isActive = usePlayer((s) => s.surahId === id);
  return (
    <Link
      to="/surah/$id"
      params={{ id: String(id) }}
      className="shrink-0 w-44"
    >
      <div className="relative rounded-2xl overflow-hidden">
        <SurahCoverArt surahId={id} className="h-44 w-44 rounded-2xl" />
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            play(id, null);
          }}
          aria-label="Play"
          className={`absolute bottom-3 right-3 h-11 w-11 rounded-full flex items-center justify-center shadow-lg ${
            isActive ? "bg-primary text-primary-foreground" : "bg-black/55 text-white backdrop-blur"
          }`}
        >
          <Play className="h-5 w-5 ml-0.5" />
        </button>
      </div>
      <h4 className="mt-3 font-semibold truncate">
        {String(surah.id).padStart(2, "0")} Sura {surah.name}
      </h4>
      <p className="text-sm text-muted-foreground">{approxDuration(surah.ayahs)}</p>
    </Link>
  );
}
