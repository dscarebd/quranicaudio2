import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { RECITERS } from "@/lib/reciters";
import { useReciterSelection } from "@/stores/persisted";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";

export const Route = createFileRoute("/reciters")({
  head: () => ({
    meta: [
      { title: "Choose Reciter — Quran Audio" },
      { name: "description", content: "Pick from 15 renowned Quran reciters." },
    ],
  }),
  component: RecitersPage,
});

function RecitersPage() {
  const selected = useReciterSelection((s) => s.reciterId);
  const setReciter = useReciterSelection((s) => s.setReciter);

  return (
    <AppShell>
      <TopBar />

      <p className="px-5 text-sm text-muted-foreground mt-1 mb-4">
        Choose your reciter — your selection applies to every surah you play.
      </p>

      <ul className="px-5 space-y-2">
        {RECITERS.map((r) => {
          const active = r.id === selected;
          return (
            <li key={r.id}>
              <button
                onClick={() => setReciter(r.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition ${
                  active ? "bg-primary/15 ring-1 ring-primary" : "bg-surface"
                }`}
              >
                <img
                  src={r.image}
                  alt={r.name}
                  loading="lazy"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover bg-surface-2"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                  }}
                />

                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold truncate">{r.name}</p>
                  <p className="arabic text-sm text-muted-foreground">{r.arabic}</p>
                </div>
                {active && <Check className="h-5 w-5 text-primary" />}
              </button>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
