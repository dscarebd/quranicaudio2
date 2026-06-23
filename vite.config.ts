// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
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
              // HTML navigations: always try network first
              urlPattern: ({ request }) => request.mode === "navigate",
              handler: "NetworkFirst",
              options: { cacheName: "html-shell" },
            },
          ],
        },
      }),
    ],
  },
});
