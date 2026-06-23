import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { NowPlayingCard } from "@/components/NowPlayingCard";
import { RecentCard } from "@/components/RecentCard";
import { SurahListItem } from "@/components/SurahListItem";
import { SURAHS } from "@/lib/quran-data";
import { useRecents } from "@/stores/persisted";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Quran Audio — Listen to all 114 Surahs" },
      { name: "description", content: "Stream the Holy Quran with 15 renowned reciters. Verse by verse, full surah, offline." },
      { property: "og:title", content: "Quran Audio" },
      { property: "og:description", content: "Listen to all 114 Surahs with 15 reciters." },
      { name: "theme-color", content: "#0a0a0a" },
    ],
  }),
  component: Home,
});

function Home() {
  const recents = useRecents((s) => s.ids);
  const FALLBACK = [1, 5, 18, 36, 67, 55];
  const seen = new Set<number>();
  const recentList: number[] = [];
  for (const id of [...recents, ...FALLBACK]) {
    if (seen.has(id)) continue;
    seen.add(id);
    recentList.push(id);
    if (recentList.length >= 10) break;
  }
  return (
    <AppShell>
      <NowPlayingCard />

      <section>
        <h2 className="text-2xl font-bold font-display px-5 mb-3">Recently Played</h2>
        <div className="flex gap-4 overflow-x-auto px-5 pb-2 no-scrollbar">
          {recentList.map((id) => (
            <RecentCard key={id} id={id} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between px-5 mb-2">
          <h2 className="text-2xl font-bold font-display">All Surah</h2>
          <button className="text-primary font-semibold text-sm">Download all</button>
        </div>
        <div className="flex flex-col">
          {SURAHS.map((s) => (
            <SurahListItem key={s.id} id={s.id} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
