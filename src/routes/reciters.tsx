import { createFileRoute } from "@tanstack/react-router";
import { Check, Pin, PinOff } from "lucide-react";
import { RECITERS } from "@/lib/reciters";
import { useReciterSelection, usePinnedReciters } from "@/stores/persisted";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
import { useT } from "@/lib/i18n";
import { useMemo } from "react";

export const Route = createFileRoute("/reciters")({
  head: () => ({
    meta: [
      { title: "Choose Reciter — Listen Quran" },
      { name: "description", content: "Pick from renowned Quran reciters." },
    ],
  }),
  component: RecitersPage,
});

function RecitersPage() {
  const selected = useReciterSelection((s) => s.reciterId);
  const setReciter = useReciterSelection((s) => s.setReciter);
  const pinnedIds = usePinnedReciters((s) => s.ids);
  const togglePin = usePinnedReciters((s) => s.toggle);
  const { t } = useT();

  const orderedReciters = useMemo(() => {
    const pinnedSet = new Set(pinnedIds);
    const pinned = pinnedIds
      .map((id) => RECITERS.find((r) => r.id === id))
      .filter((r): r is (typeof RECITERS)[number] => Boolean(r));
    const rest = RECITERS.filter((r) => !pinnedSet.has(r.id));
    return { pinned, rest };
  }, [pinnedIds]);

  const renderItem = (r: (typeof RECITERS)[number], isPinned: boolean) => {
    const active = r.id === selected;
    return (
      <li key={r.id}>
        <div
          className={`w-full flex items-center gap-3 p-4 rounded-2xl transition ${
            active
              ? "bg-primary/15 ring-1 ring-primary"
              : "bg-surface hover:bg-surface-2"
          }`}
        >
          <button
            onClick={() => setReciter(r.id)}
            className="flex items-center gap-4 flex-1 min-w-0 text-left active:scale-[0.98] transition"
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
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Check className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePin(r.id);
            }}
            aria-label={isPinned ? "Unpin reciter" : "Pin reciter to top"}
            className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 transition ${
              isPinned
                ? "bg-primary/20 text-primary"
                : "bg-surface-2 text-muted-foreground hover:text-foreground"
            }`}
          >
            {isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
          </button>
        </div>
      </li>
    );
  };

  return (
    <AppShell>
      <TopBar />
      <div className="px-5 pt-5 pb-3">
        <p className="text-sm text-muted-foreground">{t("recitersHint")}</p>
      </div>

      {orderedReciters.pinned.length > 0 && (
        <>
          <div className="px-5 pt-2 pb-1 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Pin className="h-3 w-3" />
            <span>Pinned</span>
          </div>
          <ul className="px-5 space-y-2 mt-1 pb-3">
            {orderedReciters.pinned.map((r) => renderItem(r, true))}
          </ul>
          <div className="px-5 pt-2 pb-1 text-xs uppercase tracking-wider text-muted-foreground">
            All reciters
          </div>
        </>
      )}

      <ul className="px-5 space-y-2 mt-2 pb-6">
        {orderedReciters.rest.map((r) => renderItem(r, false))}
      </ul>
    </AppShell>
  );
}
