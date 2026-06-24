#!/usr/bin/env node
// Flattens dist/client/* into dist/ and removes dist/server for Capacitor.
import { existsSync, rmSync, readdirSync, renameSync, statSync, cpSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(process.cwd(), "dist");
const clientDir = join(root, "client");
const serverDir = join(root, "server");

if (!existsSync(clientDir) || !existsSync(join(clientDir, "index.html"))) {
  console.error(`[prepare-capacitor-dist] Missing ${join(clientDir, "index.html")}. Run \`vite build\` first.`);
  process.exit(1);
}

// Remove server bundle — not needed for the mobile app.
if (existsSync(serverDir)) {
  rmSync(serverDir, { recursive: true, force: true });
}

// Move every entry from dist/client/* into dist/*
for (const entry of readdirSync(clientDir)) {
  const from = join(clientDir, entry);
  const to = join(root, entry);
  if (existsSync(to)) {
    rmSync(to, { recursive: true, force: true });
  }
  try {
    renameSync(from, to);
  } catch {
    // Cross-device or permission fallback: copy then delete.
    cpSync(from, to, { recursive: true });
    rmSync(from, { recursive: true, force: true });
  }
}

rmSync(clientDir, { recursive: true, force: true });

if (!existsSync(join(root, "index.html"))) {
  console.error("[prepare-capacitor-dist] Failed: dist/index.html not present after flatten.");
  process.exit(1);
}

console.log("[prepare-capacitor-dist] dist/ flattened for Capacitor (index.html at dist/index.html).");
