import { Link } from "@tanstack/react-router";
import { Search, Info } from "lucide-react";
import logoAsset from "@/assets/logo.png.asset.json";

export function TopBar({ centerLogo = true }: { centerLogo?: boolean }) {
  return (
    <header className="flex items-center justify-between px-5 pt-4 pb-3 bg-surface sticky top-0 z-50">
      <Link to="/search" className="text-foreground/90 p-1" aria-label="Search">
        <Search className="h-6 w-6" />
      </Link>
      {centerLogo ? (
        <Link to="/" aria-label="Home" className="flex h-8 items-center justify-center">
          <img
            src={logoAsset.url}
            alt="Logo"
            className="h-7 w-auto object-contain dark:invert"
            draggable={false}
          />
        </Link>
      ) : (
        <span />
      )}
      <button className="text-foreground/80 p-1" aria-label="Info">
        <Info className="h-6 w-6" />
      </button>
    </header>
  );
}
