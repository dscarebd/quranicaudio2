import { Link } from "@tanstack/react-router";
import { Play, Trash2 } from "lucide-react";
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { SURAHS, approxDuration } from "@/lib/quran-data";
import { usePlayer } from "@/stores/player";
import { useRecents } from "@/stores/persisted";
import { SurahCoverArt } from "./SurahCoverArt";
import { useT, surahName } from "@/lib/i18n";

const DISMISS_DISTANCE = 110;

export function RecentCard({ id }: { id: number }) {
  const surah = SURAHS[id - 1];
  const play = usePlayer((s) => s.play);
  const isActive = usePlayer((s) => s.surahId === id);
  const remove = useRecents((s) => s.remove);
  const { lang, t } = useT();

  const y = useMotionValue(0);
  const cardOpacity = useTransform(y, [-DISMISS_DISTANCE, -20, 0], [0.2, 1, 1]);
  const hintOpacity = useTransform(y, [-DISMISS_DISTANCE, -30, 0], [1, 0.4, 0]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y < -DISMISS_DISTANCE || info.velocity.y < -600) {
      remove(id);
    }
  };

  return (
    <div className="shrink-0 w-44 relative">
      <motion.div
        aria-hidden
        style={{ opacity: hintOpacity }}
        className="pointer-events-none absolute inset-x-0 -top-1 flex flex-col items-center gap-1 text-xs text-destructive font-medium"
      >
        <Trash2 className="h-4 w-4" />
        {t("remove")}
      </motion.div>
      <motion.div
        drag="y"
        dragDirectionLock
        dragConstraints={{ top: -DISMISS_DISTANCE - 20, bottom: 0 }}
        dragElastic={{ top: 0.6, bottom: 0 }}
        style={{ y, opacity: cardOpacity }}
        onDragEnd={onDragEnd}
        whileTap={{ cursor: "grabbing" }}
      >
        <Link
          to="/surah/$id"
          params={{ id: String(id) }}
          className="block"
          draggable={false}
        >
          <div className="relative rounded-2xl overflow-hidden">
            <SurahCoverArt surahId={id} className="h-44 w-44 rounded-2xl" />
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                play(id, null);
              }}
              aria-label={t("play")}
              className={`absolute bottom-3 right-3 h-11 w-11 rounded-full flex items-center justify-center shadow-lg ${
                isActive ? "bg-primary text-primary-foreground" : "bg-black/55 text-white backdrop-blur"
              }`}
            >
              <Play className="h-5 w-5 ml-0.5" />
            </button>
          </div>
          <h4 className="mt-3 font-semibold truncate">
            {String(surah.id).padStart(2, "0")} {t("sura")} {surahName(surah, lang)}
          </h4>
          <p className="text-sm text-muted-foreground">{approxDuration(surah.ayahs)}</p>
        </Link>
      </motion.div>
    </div>
  );
}
