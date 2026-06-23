import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Home, Settings, Users } from "lucide-react";
import { useT } from "@/lib/i18n";

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useT();
  const items = [
    { to: "/", icon: <Home className="h-5 w-5" />, label: t("home"), match: (p: string) => p === "/" },
    { to: "/reciters", icon: <Users className="h-5 w-5" />, label: t("reciters"), match: (p: string) => p.startsWith("/reciters") },
    { to: "/favorites", icon: <Heart className="h-5 w-5" />, label: t("favorites"), match: (p: string) => p.startsWith("/favorites") },
    { to: "/profile", icon: <Settings className="h-5 w-5" />, label: t("settings"), match: (p: string) => p.startsWith("/profile") },
  ];
  return (
    <nav className="fixed bottom-4 left-4 right-4 z-30 mx-auto max-w-md bg-surface/95 backdrop-blur rounded-[2rem] border border-border shadow-lg">
      <div className="grid grid-cols-4 py-2 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        {items.map((it) => {
          const active = it.match(pathname);
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-2xl transition ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {it.icon}
              <span className="text-[10px] font-medium">{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
