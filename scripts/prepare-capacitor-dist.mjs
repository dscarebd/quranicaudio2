#!/usr/bin/env node
// Renders "/" via the built SSR bundle, writes dist/client/index.html,
// then flattens dist/client/* into dist/ and removes dist/server for Capacitor.
import { existsSync, rmSync, readdirSync, renameSync, cpSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(process.cwd(), "dist");
const clientDir = join(root, "client");
const serverDir = join(root, "server");
const serverEntry = join(serverDir, "index.mjs");

if (!existsSync(clientDir)) {
  console.error("[prepare-capacitor-dist] Missing dist/client. Run `vite build` first.");
  process.exit(1);
}

// --- Step 1: render "/" with the SSR bundle and save as dist/client/index.html
if (!existsSync(join(clientDir, "index.html"))) {
  if (!existsSync(serverEntry)) {
    console.error(`[prepare-capacitor-dist] Missing ${serverEntry}; cannot render index.html.`);
    process.exit(1);
  }

  console.log("[prepare-capacitor-dist] Rendering / via SSR bundle...");
  try {
    const mod = await import(pathToFileURL(serverEntry).href);
    const handler = mod.default ?? mod;
    if (typeof handler?.fetch !== "function") {
      throw new Error("Server bundle has no .fetch export");
    }
    const ctx = { waitUntil: () => {}, passThroughOnException: () => {} };
    const env = {};
    const res = await handler.fetch(new Request("http://localhost/"), env, ctx);
    if (res.status >= 500) {
      throw new Error(`SSR responded ${res.status}`);
    }
    let html = await res.text();
    // Strip any inline server-only hydration state that references absolute Worker URLs.
    // (Asset references like /assets/... are fine — Capacitor serves from the file root.)
    writeFileSync(join(clientDir, "index.html"), html, "utf8");
    console.log(`[prepare-capacitor-dist] Wrote dist/client/index.html (${html.length} bytes).`);
  } catch (err) {
    console.error("[prepare-capacitor-dist] SSR render failed:", err);
    process.exit(1);
  }
}

// --- Step 2: remove server bundle — not needed for the mobile app.
if (existsSync(serverDir)) {
  rmSync(serverDir, { recursive: true, force: true });
}

// --- Step 3: move every entry from dist/client/* into dist/*
for (const entry of readdirSync(clientDir)) {
  const from = join(clientDir, entry);
  const to = join(root, entry);
  if (existsSync(to)) {
    rmSync(to, { recursive: true, force: true });
  }
  try {
    renameSync(from, to);
  } catch {
    cpSync(from, to, { recursive: true });
    rmSync(from, { recursive: true, force: true });
  }
}

rmSync(clientDir, { recursive: true, force: true });

// Nitro writes deployment-only metadata at dist/. These are not needed for a
// static Capacitor bundle and can make the output look like a server build.
for (const entry of ["nitro.json", "package.json", "package-lock.json"]) {
  const path = join(root, entry);
  if (existsSync(path)) {
    rmSync(path, { force: true });
  }
}

if (!existsSync(join(root, "index.html"))) {
  console.error("[prepare-capacitor-dist] Failed: dist/index.html not present after flatten.");
  process.exit(1);
}

console.log("[prepare-capacitor-dist] dist/ flattened for Capacitor (index.html at dist/index.html).");
