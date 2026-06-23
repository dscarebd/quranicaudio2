import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SurahListItem } from "@/components/SurahListItem";
import { useFavorites } from "@/stores/persisted";

export const Route = createFileRoute("/favorites")({
  head: () => ({ meta: [{ title: "Favorites — Quran Audio" }] }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const ids = useFavorites((s) => s.ids);
  return (
    <AppShell>
      <TopBar />
      <h1 className="text-3xl font-bold font-display px-5 mt-2 mb-4">Favorites</h1>
      {ids.length === 0 ? (
        <div className="px-5 py-16 text-center text-muted-foreground">
          <p>No favorites yet.</p>
          <p className="text-sm mt-2">Tap the heart on any surah to save it here.</p>
        </div>
      ) : (
        <ul className="flex flex-col">
          {ids.map((id) => (
            <SurahListItem key={id} id={id} />
          ))}
        </ul>
      )}
    </AppShell>
  );
}
