import { getSurah } from "@/lib/quran-data";

/**
 * Deterministic gradient + Arabic-name cover art for each surah.
 * No external images — keeps the app lightweight and offline-ready.
 */
export function SurahCoverArt({
  surahId,
  className = "",
  showName = true,
}: {
  surahId: number;
  className?: string;
  showName?: boolean;
}) {
  const surah = getSurah(surahId);
  // Pick two hues spaced around the wheel for a unique gradient per surah.
  const h1 = (surahId * 37) % 360;
  const h2 = (h1 + 60) % 360;
  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center ${className}`}
      style={{
        background: `linear-gradient(135deg, oklch(0.35 0.12 ${h1}), oklch(0.22 0.08 ${h2}))`,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.25), transparent 50%), radial-gradient(circle at 70% 80%, rgba(0,0,0,0.4), transparent 50%)",
        }}
      />
      {showName && surah && (
        <div className="relative z-10 text-center px-3">
          <div className="arabic text-white/95 text-3xl font-bold drop-shadow">
            {surah.arabic}
          </div>
          <div className="text-white/70 text-[10px] mt-1 uppercase tracking-widest">
            {String(surahId).padStart(3, "0")}
          </div>
        </div>
      )}
    </div>
  );
}
