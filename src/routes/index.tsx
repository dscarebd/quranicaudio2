import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import useEmblaCarousel from "embla-carousel-react";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
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
      { name: "theme-color", content: "#fafbff" },
    ],
  }),
  component: Home,
});

function Home() {
  const recents = useRecents((s) => s.ids);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const showRecents = mounted && recents.length > 0;
  const [emblaRef] = useEmblaCarousel({

    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });
  return (
    <AppShell>
      <TopBar />
      <div className="pt-4">
        <NowPlayingCard />
      </div>

      {showRecents && (
        <section>
          <h2 className="text-2xl font-bold font-display px-5 mb-3">Recently Played</h2>
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-4 px-5 pb-2 touch-pan-y">
              {recents.map((id) => (
                <RecentCard key={id} id={id} />
              ))}
            </div>
          </div>
        </section>
      )}



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
