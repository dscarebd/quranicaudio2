#!/usr/bin/env node
// Flattens dist/ into a single static folder for Capacitor / offline use.
// Idempotent: safe to run multiple times. If dist/ is already flat, exits 0.
import { existsSync, rmSync, readdirSync, renameSync, cpSync, writeFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(process.cwd(), "dist");
const clientDir = join(root, "client");
const serverDir = join(root, "server");
const serverEntry = join(serverDir, "index.mjs");

function log(msg) {
  console.log(`[prepare-capacitor-dist] ${msg}`);
}

const NITRO_FILES = ["nitro.json", "package.json", "package-lock.json"];

function cleanupNitroMetadata() {
  for (const entry of NITRO_FILES) {
    const path = join(root, entry);
    if (existsSync(path)) rmSync(path, { force: true });
  }
}

function assertFlat() {
  if (existsSync(clientDir) || existsSync(serverDir)) {
    console.error("[prepare-capacitor-dist] FAILED: dist/client or dist/server still present.");
    process.exit(1);
  }
  if (!existsSync(join(root, "index.html"))) {
    console.error("[prepare-capacitor-dist] FAILED: dist/index.html missing.");
    process.exit(1);
  }
}

if (!existsSync(root)) {
  log("dist/ does not exist yet — nothing to do.");
  process.exit(0);
}

// Already flat? Just cleanup metadata and exit.
if (!existsSync(clientDir) && !existsSync(serverDir)) {
  cleanupNitroMetadata();
  if (existsSync(join(root, "index.html"))) {
    log("dist/ is already flat. Skipping.");
    process.exit(0);
  }
  console.error("[prepare-capacitor-dist] dist/ is flat but has no index.html — unknown state.");
  process.exit(1);
}

// --- Step 1: render "/" with the SSR bundle and save as dist/client/index.html
if (existsSync(clientDir) && !existsSync(join(clientDir, "index.html"))) {
  if (!existsSync(serverEntry)) {
    console.error(`[prepare-capacitor-dist] Missing ${serverEntry}; cannot render index.html.`);
    process.exit(1);
  }

  log("Rendering / via SSR bundle...");
  try {
    const mod = await import(pathToFileURL(serverEntry).href);
    const handler = mod.default ?? mod;
    if (typeof handler?.fetch !== "function") throw new Error("Server bundle has no .fetch export");
    const res = await handler.fetch(new Request("http://localhost/"), {}, { waitUntil: () => {}, passThroughOnException: () => {} });
    if (res.status >= 500) throw new Error(`SSR responded ${res.status}`);
    const html = await res.text();
    writeFileSync(join(clientDir, "index.html"), html, "utf8");
    log(`Wrote dist/client/index.html (${html.length} bytes).`);
  } catch (err) {
    console.error("[prepare-capacitor-dist] SSR render failed:", err);
    process.exit(1);
  }
}

// --- Step 2: drop the server bundle
if (existsSync(serverDir)) {
  rmSync(serverDir, { recursive: true, force: true });
  log("Removed dist/server/");
}

// --- Step 3: flatten dist/client/* -> dist/*
if (existsSync(clientDir)) {
  for (const entry of readdirSync(clientDir)) {
    const from = join(clientDir, entry);
    const to = join(root, entry);
    if (existsSync(to)) rmSync(to, { recursive: true, force: true });
    try {
      renameSync(from, to);
    } catch {
      cpSync(from, to, { recursive: true });
      rmSync(from, { recursive: true, force: true });
    }
  }
  rmSync(clientDir, { recursive: true, force: true });
  log("Flattened dist/client/ -> dist/");
}

cleanupNitroMetadata();
assertFlat();
log("dist/ is a single flat static folder.");
