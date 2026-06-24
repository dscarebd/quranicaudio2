import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { RECITERS } from "@/lib/reciters";
import { useReciterSelection } from "@/stores/persisted";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
import { useT } from "@/lib/i18n";


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
  const { t } = useT();

  return (
    <AppShell>
      <TopBar />
      <header className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display">{t("reciters")}</h1>
            <p className="text-xs text-muted-foreground">
              {RECITERS.length} {t("renownedVoices")}
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          {t("recitersHint")}
        </p>
      </header>

      <ul className="px-5 space-y-2 mt-2 pb-6">
        {RECITERS.map((r) => {
          const active = r.id === selected;
          return (
            <li key={r.id}>
              <button
                onClick={() => setReciter(r.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition active:scale-[0.98] ${
                  active
                    ? "bg-primary/15 ring-1 ring-primary"
                    : "bg-surface hover:bg-surface-2"
                }`}
              >
                <img
                  src={r.image}
                  alt={r.name}
                  loading="lazy"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover bg-surface-2 ring-2 ring-border"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                  }}
                />

                <div className="flex-1 text-left min-w-0">
                  <p className={`font-semibold truncate ${active ? "text-primary" : ""}`}>
                    {r.name}
                  </p>
                  <p className="arabic text-sm text-muted-foreground">{r.arabic}</p>
                </div>

                {active && (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
