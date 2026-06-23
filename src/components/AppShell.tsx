import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { TopBar } from "./TopBar";
import { useAudioEngine } from "@/hooks/use-audio";

export function AppShell({ children }: { children: ReactNode }) {
  useAudioEngine();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-md min-h-screen pb-24 relative pt-14">
        <TopBar />
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
