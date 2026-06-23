import { Link } from "@tanstack/react-router";
import { Search, Info } from "lucide-react";
import logoAsset from "@/assets/logo.png.asset.json";

export function TopBar({ centerLogo = true }: { centerLogo?: boolean }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-5 pb-3 bg-primary border-b border-primary-foreground/15" style={{ paddingTop: "calc(env(safe-area-inset-top) + 1rem)" }}>
      <Link to="/search" className="text-primary-foreground/90 p-1" aria-label="Search">
        <Search className="h-6 w-6" />
      </Link>
      {centerLogo ? (
        <Link to="/" aria-label="Home" className="flex h-8 items-center justify-center">
          <img
            src={logoAsset.url}
            alt="Logo"
            className="h-7 w-auto object-contain brightness-0 invert"
            draggable={false}
          />
        </Link>
      ) : (
        <span />
      )}
      <button className="text-primary-foreground/80 p-1" aria-label="Info">
        <Info className="h-6 w-6" />
      </button>
    </header>
  );
}
