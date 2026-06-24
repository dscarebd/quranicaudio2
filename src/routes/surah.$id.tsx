import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Heart, Pause, Play, ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";
import { getSurah } from "@/lib/quran-data";
import { usePlayer } from "@/stores/player";
import { useFavorites } from "@/stores/persisted";
import { SurahCoverArt } from "@/components/SurahCoverArt";
import { AppShell } from "@/components/AppShell";
import { useT, surahName, surahType, localizeNum, surahMeaning } from "@/lib/i18n";


type Ayah = { number: number; numberInSurah: number; text: string };
type TranslationLang = "en" | "bn";
const TRANSLATION_EDITION: Record<TranslationLang, string> = {
  en: "en.sahih",
  bn: "bn.bengali",
};


export const Route = createFileRoute("/surah/$id")({
  params: {
    parse: (raw) => ({ id: parseInt(raw.id, 10) }),
    stringify: (parsed) => ({ id: String(parsed.id) }),
  },
  head: ({ params }) => {
    const surah = getSurah(params.id);
    return {
      meta: [
        { title: surah ? `${surah.name} — Quran Audio` : "Surah" },
        { name: "description", content: surah ? `Listen to Surah ${surah.name} (${surah.arabic}) — ${surah.ayahs} verses.` : "" },
      ],
    };
  },
  loader: ({ params }) => {
    const surah = getSurah(params.id);
    if (!surah) throw notFound();
  },
  component: SurahPage,
  notFoundComponent: () => (
    <AppShell>
      <div className="p-8 text-center text-muted-foreground">Surah not found.</div>
    </AppShell>
  ),
  errorComponent: () => (
    <AppShell>
      <div className="p-8 text-center text-muted-foreground">Failed to load surah.</div>
    </AppShell>
  ),
});

function SurahPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const surah = getSurah(id)!;
  const playerSurahId = usePlayer((s) => s.surahId);
  const playerAyahId = usePlayer((s) => s.ayahId);
  const isPlaying = usePlayer((s) => s.isPlaying);
  const play = usePlayer((s) => s.play);
  const toggle = usePlayer((s) => s.toggle);
  const isFav = useFavorites((s) => s.ids.includes(id));
  const toggleFav = useFavorites((s) => s.toggle);

  const [lang, setLang] = useState<TranslationLang>("en");
  const { lang: appLang, t } = useT();
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["surah-text", id, lang],
    queryFn: async (): Promise<{ arabic: Ayah[]; translation: Ayah[] }> => {
      const edition = TRANSLATION_EDITION[lang];
      const res = await fetch(
        `https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,${edition}`,
      );
      const json = await res.json();
      const editions = (json?.data ?? []) as Array<{ ayahs: Ayah[] }>;
      return {
        arabic: editions[0]?.ayahs ?? [],
        translation: editions[1]?.ayahs ?? [],
      };
    },
    staleTime: 1000 * 60 * 60,
  });


  const fullActive = playerSurahId === id && playerAyahId == null;

  return (
    <AppShell>
      <header className="flex items-center justify-between px-5 pt-4 pb-2">
        <button
          onClick={() => navigate({ to: "/" })}
          className="h-10 w-10 rounded-full bg-surface flex items-center justify-center"
          aria-label={t("back")}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold font-display truncate">{t("sura")} {surahName(surah, appLang)}</h1>
        <button onClick={() => toggleFav(id)} aria-label={t("favorite")} className="p-2">
          <Heart className={`h-6 w-6 ${isFav ? "fill-primary text-primary" : "text-muted-foreground"}`} />
        </button>
      </header>

      <div className="px-5 mt-4">
        <SurahCoverArt surahId={id} className="w-full aspect-[16/9] rounded-3xl" />
      </div>

      <div className="px-5 mt-5 flex items-center justify-between">
        <div>
          <div className="arabic text-3xl font-bold text-left">{surah.arabic}</div>
          <p className="text-sm text-muted-foreground mt-1">
            {surahMeaning(surah, appLang)} · {localizeNum(surah.ayahs, appLang)} {t("ayahs")} · {surahType(surah, appLang)}
          </p>
        </div>
        <button
          onClick={() => (fullActive ? toggle() : play(id, null))}
          className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30"
          aria-label={t("play")}
        >
          {fullActive && isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
        </button>
      </div>

      <section className="mt-6 px-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm uppercase tracking-widest text-muted-foreground">{t("verses")}</h3>
          <div className="inline-flex rounded-full bg-surface p-1 text-xs font-semibold">
            {(["en", "bn"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-full transition ${
                  lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                <span lang={l}>{l === "en" ? "English" : "বাংলা"}</span>
              </button>
            ))}
          </div>
        </div>
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-surface animate-pulse" />
            ))}
          </div>
        )}
        <ul className="space-y-2">
          {data?.arabic.map((ayah, idx) => {
            const active = playerSurahId === id && playerAyahId === ayah.numberInSurah;
            const tr = data.translation[idx]?.text;
            return (
              <li key={ayah.number}>
                <button
                  onClick={() => (active ? toggle() : play(id, ayah.numberInSurah))}
                  className={`w-full text-left rounded-2xl p-4 transition ${
                    active ? "bg-primary/15 ring-1 ring-primary" : "bg-surface"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      active ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted-foreground"
                    }`}>
                      {localizeNum(ayah.numberInSurah, appLang)}
                    </span>
                    {active && isPlaying ? (
                      <Pause className="h-4 w-4 text-primary" />
                    ) : (
                      <Play className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <p className="arabic text-2xl leading-loose text-right text-foreground">
                    {ayah.text}
                  </p>
                  {tr && (
                    <p
                      className={`mt-3 text-sm leading-relaxed text-muted-foreground text-left ${
                        lang === "bn" ? "font-bengali" : ""
                      }`}
                      lang={lang}
                    >
                      {tr}
                    </p>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {showTopBtn && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 left-4 z-40 h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center transition-opacity"
          aria-label={t("scrollToTop")}
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </AppShell>
  );
}
