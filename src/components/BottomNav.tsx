import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Mic2, User } from "lucide-react";
import { Logo } from "./Logo";

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = [
    { to: "/", icon: <Logo className="h-5 w-10" />, label: "Home", match: (p: string) => p === "/" },
    { to: "/reciters", icon: <Mic2 className="h-5 w-5" />, label: "Reciters", match: (p: string) => p.startsWith("/reciters") },
    { to: "/favorites", icon: <Heart className="h-5 w-5" />, label: "Favorites", match: (p: string) => p.startsWith("/favorites") },
    { to: "/profile", icon: <User className="h-5 w-5" />, label: "Profile", match: (p: string) => p.startsWith("/profile") },
  ];
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 bg-background/95 backdrop-blur border-t border-border">
      <div className="mx-auto max-w-md flex items-center justify-around py-2 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        {items.map((it) => {
          const active = it.match(pathname);
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition ${
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
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
