import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import logoAsset from "@/assets/logo.png.asset.json";
import { useLanguage } from "@/stores/language";
import { useT } from "@/lib/i18n";

export function TopBar() {
  const lang = useLanguage((s) => s.lang);
  const setLang = useLanguage((s) => s.setLang);
  const { t } = useT();

  return (
    <header
      className="sticky top-0 z-30 grid grid-cols-2 items-center px-5 pb-4 bg-primary border-b border-primary-foreground/15"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 1rem)" }}
    >
      <Link to="/" aria-label={t("home")} className="flex h-9 items-center justify-self-start">
        <img
          src={logoAsset.url}
          alt="Logo"
          className="h-8 w-auto object-contain brightness-0 invert"
          draggable={false}
        />
      </Link>
      <div
        role="group"
        aria-label={t("language")}
        className="inline-flex items-center justify-self-end rounded-full bg-primary-foreground/15 p-0.5 text-xs font-semibold"
      >
        {(["en", "bn"] as const).map((l) => {
          const active = lang === l;
          return (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={active}
              className={`px-2.5 h-7 rounded-full transition-colors ${
                active
                  ? "bg-primary-foreground text-primary"
                  : "text-primary-foreground/80"
              }`}
            >
              <span lang={l}>{l === "en" ? "EN" : "বাং"}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
