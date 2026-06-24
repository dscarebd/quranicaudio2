// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

// Auto-flatten dist/ into a single static folder after every production build,
// regardless of whether the build was started via `npm run build` or `vite build`.
function flattenDistPlugin() {
  let ran = false;
  const run = () =>
    new Promise<void>((res) => {
      if (ran) return res();
      ran = true;
      const dist = resolve(process.cwd(), "dist");
      // Wait briefly for nitro to finish writing dist/server before flattening.
      const deadline = Date.now() + 30_000;
      const waitForNitro = () => {
        const serverReady = existsSync(resolve(dist, "server", "index.mjs"));
        const alreadyFlat = existsSync(dist) && !existsSync(resolve(dist, "client")) && !existsSync(resolve(dist, "server"));
        if (serverReady || alreadyFlat || Date.now() > deadline) {
          const child = spawn(process.execPath, [resolve(process.cwd(), "scripts/prepare-capacitor-dist.mjs")], { stdio: "inherit" });
          child.on("exit", (code) => {
            if (code !== 0) process.exitCode = code ?? 1;
            res();
          });
          return;
        }
        setTimeout(waitForNitro, 200);
      };
      waitForNitro();
    });
  return {
    name: "lovable:flatten-dist",
    apply: "build" as const,
    enforce: "post" as const,
    closeBundle: {
      order: "post" as const,
      sequential: true,
      handler: () => {
        console.log("[lovable:flatten-dist] closeBundle fired");
        return run();
      },
    },
  };

}



export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      flattenDistPlugin(),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: null,
        filename: "sw.js",
        devOptions: { enabled: false },
        manifest: false,
        workbox: {
          navigateFallback: null,
          navigateFallbackDenylist: [/^\/~oauth/, /^\/api\//],
          globPatterns: ["**/*.{js,css,html,svg,png,ico,webmanifest}"],
          runtimeCaching: [
            {
              // Full-surah MP3 hosts (server1..serverN.mp3quran.net)
              urlPattern: ({ url }) => /\.mp3quran\.net$/.test(url.hostname),
              handler: "CacheFirst",
              options: {
                cacheName: "quran-audio-full",
                cacheableResponse: { statuses: [0, 200, 206] },
                rangeRequests: true,
                expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 90 },
              },
            },
            {
              // Per-ayah MP3 host
              urlPattern: ({ url }) => url.hostname === "everyayah.com",
              handler: "CacheFirst",
              options: {
                cacheName: "quran-audio-ayah",
                cacheableResponse: { statuses: [0, 200, 206] },
                rangeRequests: true,
                expiration: { maxEntries: 2000, maxAgeSeconds: 60 * 60 * 24 * 90 },
              },
            },
            {
              // HTML navigations: serve cached shell instantly, refresh in background
              urlPattern: ({ request }) => request.mode === "navigate",
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "html-shell",
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
            {
              // Google Fonts stylesheet + files
              urlPattern: ({ url }) => url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com",
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "google-fonts",
                expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              },
            },
            {
              // Quran text / metadata APIs
              urlPattern: ({ url }) => url.hostname === "api.alquran.cloud" || url.hostname === "api.quran.com",
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "quran-api",
                expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
          ],
        },
      }),
    ],
  },
});
