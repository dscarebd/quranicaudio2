import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";


import { useFavorites, useRecents, useReciterSelection } from "@/stores/persisted";
import { usePlayer } from "@/stores/player";
import { getReciter } from "@/lib/reciters";
import { ChevronRight, Mic2, Heart, Clock, Gauge, Repeat, Shuffle, Trash2, Pencil, Check, X } from "lucide-react";


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
      {/* User card */}
      <UserCard favoritesCount={favorites.length} recentsCount={recents.length} />


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

const PROFILE_KEY = "q_profile";

type ProfileData = { name: string; avatar: string | null };

function loadProfile(): ProfileData {
  if (typeof window === "undefined") return { name: "Listener", avatar: null };
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return { name: "Listener", avatar: null, ...JSON.parse(raw) };
  } catch {}
  return { name: "Listener", avatar: null };
}

function UserCard({ favoritesCount, recentsCount }: { favoritesCount: number; recentsCount: number }) {
  const [profile, setProfile] = useState<ProfileData>({ name: "Listener", avatar: null });
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  const persist = (next: ProfileData) => {
    setProfile(next);
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    } catch {}
  };

  const onPickImage = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      persist({ ...profile, avatar: typeof reader.result === "string" ? reader.result : null });
    };
    reader.readAsDataURL(file);
  };

  const startEdit = () => {
    setDraftName(profile.name);
    setEditing(true);
  };
  const saveEdit = () => {
    const name = draftName.trim().slice(0, 40) || "Listener";
    persist({ ...profile, name });
    setEditing(false);
  };
  const cancelEdit = () => setEditing(false);

  return (
    <div className="mx-5 mb-6 rounded-3xl bg-surface border border-border p-5 flex items-center gap-4">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="relative h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold font-display overflow-hidden shrink-0"
        aria-label="Change profile picture"
      >
        {profile.avatar ? (
          <img src={profile.avatar} alt="Profile" className="h-full w-full object-cover" />
        ) : (
          (profile.name || "Q").charAt(0).toUpperCase()
        )}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPickImage(f);
          e.target.value = "";
        }}
      />
      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") cancelEdit();
              }}
              maxLength={40}
              className="flex-1 min-w-0 bg-muted rounded-lg px-2 py-1 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary"
            />
            <button onClick={saveEdit} aria-label="Save" className="p-1 rounded-md hover:bg-muted">
              <Check className="h-4 w-4 text-primary" />
            </button>
            <button onClick={cancelEdit} aria-label="Cancel" className="p-1 rounded-md hover:bg-muted">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="font-semibold truncate">{profile.name}</div>
            <button onClick={startEdit} aria-label="Edit name" className="p-1 rounded-md hover:bg-muted">
              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        )}
        <div className="text-xs text-muted-foreground">
          {favoritesCount} favorites · {recentsCount} recently played
        </div>
      </div>
    </div>
  );
}
