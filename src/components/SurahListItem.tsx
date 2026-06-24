import { useNavigate } from "@tanstack/react-router";
import { Heart, Play, Pause } from "lucide-react";
import { SURAHS } from "@/lib/quran-data";
import { usePlayer } from "@/stores/player";
import { useFavorites } from "@/stores/persisted";
import { useT, surahName, localizeNum, surahType, surahMeaning } from "@/lib/i18n";

export function SurahListItem({ id }: { id: number }) {
  const surah = SURAHS[id - 1];
  const isActive = usePlayer((s) => s.surahId === id && s.ayahId == null);
  const isPlaying = usePlayer((s) => s.isPlaying) && isActive;
  const currentTime = usePlayer((s) => s.currentTime);
  const play = usePlayer((s) => s.play);
  const toggle = usePlayer((s) => s.toggle);
  const isFav = useFavorites((s) => s.ids.includes(id));
  const toggleFav = useFavorites((s) => s.toggle);
  const { lang, t } = useT();
  const navigate = useNavigate();

  const onPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isActive) toggle();
    else play(id, null);
  };

  const onOpen = () => {
    navigate({ to: "/surah/$id", params: { id: String(id) } });
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="flex items-center gap-3 px-5 py-3 active:bg-surface rounded-2xl cursor-pointer"
    >
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground truncate">
          {localizeNum(String(surah.id).padStart(2, "0"), lang)} {t("sura")} {surahName(surah, lang)}
        </h4>
        <p className={`text-sm mt-0.5 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
          {surahMeaning(surah, lang)} · {surahType(surah, lang)}
        </p>
      </div>
      <button
        type="button"
        onClick={onPlay}
        aria-label={isPlaying ? t("pause") : t("play")}
        className="p-2 rounded-full bg-surface hover:bg-muted transition"
      >
        {isPlaying ? (
          <Pause className={`h-6 w-6 transition ${isActive ? "text-primary" : "text-muted-foreground"}`} />
        ) : (
          <Play className="h-6 w-6 text-muted-foreground transition" />
        )}
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleFav(id);
        }}
        aria-label={t("favorite")}
        className="p-2 rounded-full bg-surface hover:bg-muted transition"
      >
        <Heart
          className={`h-6 w-6 transition ${
            isFav ? "fill-primary text-primary" : "text-muted-foreground"
          }`}
        />
      </button>
    </div>
  );
}
