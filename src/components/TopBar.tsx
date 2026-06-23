import { Link } from "@tanstack/react-router";
import { Search, Info } from "lucide-react";
import { Logo } from "./Logo";

export function TopBar({ centerLogo = true }: { centerLogo?: boolean }) {
  return (
    <header className="flex items-center justify-between px-5 pt-4 pb-3">
      <Link to="/search" className="text-foreground/90 p-1" aria-label="Search">
        <Search className="h-6 w-6" />
      </Link>
      {centerLogo ? (
        <Link to="/" aria-label="Home" className="flex h-8 w-16 items-center justify-center text-foreground">
          <Logo className="h-7 w-14 shrink-0" />
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
