#!/usr/bin/env node
// Post-build validator: ensures dist/ is a flat static SPA folder suitable for Capacitor.
import { existsSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(process.cwd(), "dist");

function log(msg) {
  console.log(`[prepare-capacitor-dist] ${msg}`);
}

if (!existsSync(root)) {
  console.error("[prepare-capacitor-dist] FAILED: dist/ does not exist. Run vite build first.");
  process.exit(1);
}

// Defensive cleanup in case any legacy SSR output sneaks in.
for (const stale of ["client", "server", "nitro.json", "_worker.js"]) {
  const p = join(root, stale);
  if (existsSync(p)) {
    rmSync(p, { recursive: true, force: true });
    log(`Removed stale ${stale}`);
  }
}

if (!existsSync(join(root, "index.html"))) {
  console.error("[prepare-capacitor-dist] FAILED: dist/index.html missing.");
  process.exit(1);
}
if (!existsSync(join(root, "assets"))) {
  console.error("[prepare-capacitor-dist] FAILED: dist/assets/ missing.");
  process.exit(1);
}

log("dist/ is a flat SPA build (index.html + assets/). Ready for Capacitor.");
