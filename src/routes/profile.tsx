import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";

import { useFavorites, useRecents, useReciterSelection } from "@/stores/persisted";
import { usePlayer } from "@/stores/player";
import { getReciter } from "@/lib/reciters";
import { ChevronRight, Mic2, Heart, Clock, Gauge, Repeat, Shuffle, Trash2 } from "lucide-react";


export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Quran Audio" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const reciterId = useReciterSelection((s) => s.reciterId);
  
  const favorites = useFavorites((s) => s.ids);
  const recents = useRecents((s) => s.ids);
  const reciter = getReciter(reciterId);

  const shuffle = usePlayer((s) => s.shuffle);
  const repeat = usePlayer((s) => s.repeat);
  const playbackRate = usePlayer((s) => s.playbackRate);
  const toggleShuffle = usePlayer((s) => s.toggleShuffle);
  const cycleRepeat = usePlayer((s) => s.cycleRepeat);
  const setPlaybackRate = usePlayer((s) => s.setPlaybackRate);

  const rates = [0.75, 1, 1.25, 1.5, 2];

  const clearRecents = () => {
    localStorage.removeItem("q_recents");
    location.reload();
  };
  const clearFavorites = () => {
    localStorage.removeItem("q_favorites");
    location.reload();
  };

  return (
    <AppShell>
      <TopBar />

      {/* User card */}
      <div className="mx-5 mb-6 rounded-3xl bg-surface border border-border p-5 flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold font-display">
          Q
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">Listener</div>
          <div className="text-xs text-muted-foreground">
            {favorites.length} favorites · {recents.length} recently played
          </div>
        </div>
      </div>

      {/* Reciter */}
      <Section title="Playback">
        <Link
          to="/reciters"
          className="flex items-center gap-3 px-5 py-4 hover:bg-muted/50 transition"
        >
          <Mic2 className="h-5 w-5 text-primary" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">Reciter</div>
            <div className="text-xs text-muted-foreground truncate">{reciter.name}</div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>

        <Row
          icon={<Shuffle className="h-5 w-5 text-primary" />}
          label="Shuffle"
          value={shuffle ? "On" : "Off"}
          onClick={toggleShuffle}
        />
        <Row
          icon={<Repeat className="h-5 w-5 text-primary" />}
          label="Repeat"
          value={repeat === "off" ? "Off" : repeat === "one" ? "One" : "All"}
          onClick={cycleRepeat}
        />
        <div className="px-5 py-4 flex items-center gap-3">
          <Gauge className="h-5 w-5 text-primary" />
          <div className="flex-1 text-sm font-medium">Playback speed</div>
          <div className="flex gap-1">
            {rates.map((r) => (
              <button
                key={r}
                onClick={() => setPlaybackRate(r)}
                className={`text-xs px-2 py-1 rounded-lg font-medium transition ${
                  playbackRate === r
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {r}x
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Library */}
      <Section title="Library">
        <Link
          to="/favorites"
          className="flex items-center gap-3 px-5 py-4 hover:bg-muted/50 transition"
        >
          <Heart className="h-5 w-5 text-primary" />
          <div className="flex-1 text-sm font-medium">Favorites</div>
          <div className="text-xs text-muted-foreground">{favorites.length}</div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
        <div className="px-5 py-4 flex items-center gap-3">
          <Clock className="h-5 w-5 text-primary" />
          <div className="flex-1 text-sm font-medium">Recently played</div>
          <div className="text-xs text-muted-foreground">{recents.length}</div>
        </div>
      </Section>

      {/* Data */}
      <Section title="Data">
        <button
          onClick={clearRecents}
          className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted/50 transition text-left"
        >
          <Trash2 className="h-5 w-5 text-destructive" />
          <div className="flex-1 text-sm font-medium">Clear recently played</div>
        </button>
        <button
          onClick={clearFavorites}
          className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted/50 transition text-left"
        >
          <Trash2 className="h-5 w-5 text-destructive" />
          <div className="flex-1 text-sm font-medium">Clear favorites</div>
        </button>
      </Section>

    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="px-5 mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      <div className="mx-5 rounded-3xl bg-surface border border-border overflow-hidden divide-y divide-border">
        {children}
      </div>
    </section>
  );
}

function Row({
  icon,
  label,
  value,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted/50 transition text-left"
    >
      {icon}
      <div className="flex-1 text-sm font-medium">{label}</div>
      <div className="text-xs text-muted-foreground">{value}</div>
    </button>
  );
}
