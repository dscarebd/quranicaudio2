import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Check } from "lucide-react";
import { RECITERS } from "@/lib/reciters";
import { useReciterSelection } from "@/stores/persisted";
import { AppShell } from "@/components/AppShell";

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
  const navigate = useNavigate();
  const selected = useReciterSelection((s) => s.reciterId);
  const setReciter = useReciterSelection((s) => s.setReciter);
  return (
    <AppShell>
      <header className="flex items-center justify-between px-5 pt-4 pb-2">
        <button
          onClick={() => navigate({ to: "/" })}
          className="h-10 w-10 rounded-full bg-surface flex items-center justify-center"
          aria-label="Back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold font-display">Reciters</h1>
        <span className="w-10" />
      </header>

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
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold ${
                    active ? "bg-primary text-primary-foreground" : "bg-surface-2 text-foreground"
                  }`}
                >
                  {r.name
                    .split(" ")
                    .slice(0, 2)
                    .map((p) => p[0])
                    .join("")}
                </div>
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
