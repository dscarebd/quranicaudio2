import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { useLanguage } from "../stores/language";

const ROOT_ROUTES = new Set(["/", "/reciters", "/favorites", "/downloads", "/profile"]);
const EXIT_WINDOW_MS = 2000;

export function useAndroidBackButton() {
  const lang = useLanguage((s) => s.lang);
  const armedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    let removeListener: (() => void) | null = null;
    let appPlugin: typeof import("@capacitor/app").App | null = null;

    (async () => {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor.isNativePlatform()) return;
        const { App } = await import("@capacitor/app");
        if (cancelled) return;
        appPlugin = App;

        const handle = await App.addListener("backButton", ({ canGoBack }) => {
          const path = window.location.pathname;
          const isRoot = ROOT_ROUTES.has(path);

          if (!isRoot && (canGoBack || window.history.length > 1)) {
            window.history.back();
            return;
          }

          if (armedRef.current) {
            if (timerRef.current) clearTimeout(timerRef.current);
            armedRef.current = false;
            appPlugin?.exitApp();
            return;
          }

          armedRef.current = true;
          toast(
            lang === "bn"
              ? "প্রস্থান করতে আবার ব্যাক চাপুন"
              : "Press back again to exit",
          );
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => {
            armedRef.current = false;
            timerRef.current = null;
          }, EXIT_WINDOW_MS);
        });

        removeListener = () => {
          void handle.remove();
        };
      } catch {
        /* not running under Capacitor or plugin missing — no-op */
      }
    })();

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      removeListener?.();
    };
  }, [lang]);
}
