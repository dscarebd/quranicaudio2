import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SurahListItem } from "@/components/SurahListItem";
import { SURAHS } from "@/lib/quran-data";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Search — Listen Quran" }] }),
  component: SearchPage,
});

function SearchPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const { t } = useT();
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return SURAHS;
    return SURAHS.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.meaning.toLowerCase().includes(term) ||
        String(s.id).includes(term) ||
        s.arabic.includes(term) ||
        s.bangla.includes(q.trim()),
    );
  }, [q]);

  return (
    <AppShell>
      <header className="flex items-center gap-3 px-5 pt-4 pb-2">
        <button
          onClick={() => navigate({ to: "/" })}
          className="h-10 w-10 rounded-full bg-surface flex items-center justify-center"
          aria-label={t("back")}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 flex items-center gap-2 px-4 h-11 rounded-full bg-surface">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("searchSurahs")}
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </header>
      <div className="mt-4">
        {results.length === 0 ? (
          <p className="px-5 py-10 text-center text-muted-foreground">{t("noResults")} "{q}".</p>
        ) : (
          results.map((s) => <SurahListItem key={s.id} id={s.id} />)
        )}
      </div>
    </AppShell>
  );
}
