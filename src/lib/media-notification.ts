/**
 * Bridges the web MediaSession API to a real Android MediaStyle notification
 * via `capacitor-music-controls-plugin-arena`. On non-native platforms all
 * calls become no-ops, so the browser's built-in MediaSession (already wired
 * in use-audio) keeps working in the PWA.
 *
 * The plugin actually posts a foreground-service MediaStyle notification on
 * Android — that is what surfaces the play/pause/next/prev tile in the
 * notification panel and on the lock screen.
 */
import { Capacitor } from "@capacitor/core";
import { CapacitorMusicControls } from "capacitor-music-controls-plugin-arena";

const isNative = Capacitor.isNativePlatform?.() ?? false;

export type NotifMetadata = {
  title: string;
  artist: string;
  album: string;
  artwork: { src: string; sizes: string; type: string }[];
};

type Action =
  | "play"
  | "pause"
  | "previoustrack"
  | "nexttrack"
  | "seekbackward"
  | "seekforward"
  | "seekto"
  | "stop";

type Handler =
  | ((details: { seekTime?: number; seekOffset?: number }) => void)
  | null;

// ---- internal state ---------------------------------------------------------
const handlers: Partial<Record<Action, Handler>> = {};
let listenerRegistered = false;
let created = false;
let lastMeta: NotifMetadata | null = null;
let lastIsPlaying = false;
let lastDuration = 0;

const EVENT_TO_ACTION: Record<string, Action> = {
  "music-controls-play": "play",
  "music-controls-pause": "pause",
  "music-controls-next": "nexttrack",
  "music-controls-previous": "previoustrack",
  "music-controls-skip-forward": "seekforward",
  "music-controls-skip-backward": "seekbackward",
  "music-controls-seek-to": "seekto",
  "music-controls-destroy": "stop",
  "music-controls-media-button-play": "play",
  "music-controls-media-button-pause": "pause",
  "music-controls-media-button-play-pause": "play",
  "music-controls-media-button-next": "nexttrack",
  "music-controls-media-button-previous": "previoustrack",
  "music-controls-headset-unplugged": "pause",
  "music-controls-pause-event": "pause",
  "music-controls-play-event": "play",
};

async function ensureListener() {
  if (listenerRegistered || !isNative) return;
  listenerRegistered = true;
  try {
    await CapacitorMusicControls.addListener("controlsNotification", (info: unknown) => {
      try {
        const raw =
          typeof info === "string"
            ? info
            : (info as { message?: string })?.message ?? "";
        const parsed: { message?: string; seekTo?: number } =
          typeof raw === "string" && raw.trim().startsWith("{")
            ? JSON.parse(raw)
            : { message: String(raw) };
        const action = parsed.message ? EVENT_TO_ACTION[parsed.message] : undefined;
        if (!action) return;
        const h = handlers[action];
        if (h) h({ seekTime: parsed.seekTo });
      } catch (err) {
        console.warn("[media-notification] listener parse error", err);
      }
    });
  } catch (err) {
    console.warn("[media-notification] addListener failed", err);
  }
}

function coverFromArtwork(meta: NotifMetadata): string | undefined {
  // Prefer the largest artwork URL.
  return meta.artwork[0]?.src;
}

async function createOrUpdate() {
  if (!isNative || !lastMeta) return;
  const cover = coverFromArtwork(lastMeta);
  const info = {
    track: lastMeta.title,
    artist: lastMeta.artist,
    album: lastMeta.album,
    cover,
    isPlaying: lastIsPlaying,
    dismissable: true,
    hasPrev: true,
    hasNext: true,
    hasClose: true,
    hasScrubbing: true,
    duration: lastDuration > 0 ? Math.floor(lastDuration) : undefined,
    ticker: lastMeta.title,
  };
  try {
    if (!created) {
      await ensureListener();
      await CapacitorMusicControls.create(info);
      created = true;
    } else {
      try {
        await CapacitorMusicControls.updateMetadata(info);
      } catch {
        // Older builds may not support updateMetadata — recreate.
        await CapacitorMusicControls.destroy();
        await CapacitorMusicControls.create(info);
      }
    }
  } catch (err) {
    console.warn("[media-notification] create/update failed", err);
  }
}

// ---- public API (shape kept identical to previous bridge) -------------------

export async function setNotificationMetadata(meta: NotifMetadata) {
  if (!isNative) return;
  lastMeta = meta;
  await createOrUpdate();
}

export async function setNotificationPlaybackState(
  state: "none" | "paused" | "playing",
) {
  if (!isNative) return;
  if (state === "none") {
    if (created) {
      try {
        await CapacitorMusicControls.destroy();
      } catch (err) {
        console.warn("[media-notification] destroy failed", err);
      }
      created = false;
    }
    return;
  }
  lastIsPlaying = state === "playing";
  if (!created) {
    await createOrUpdate();
    return;
  }
  try {
    await CapacitorMusicControls.updateIsPlaying({ isPlaying: lastIsPlaying });
  } catch (err) {
    console.warn("[media-notification] updateIsPlaying failed", err);
  }
}

export async function setNotificationPosition(opts: {
  duration: number;
  position: number;
  playbackRate: number;
}) {
  if (!isNative) return;
  const durationChanged = Math.abs(opts.duration - lastDuration) > 1;
  lastDuration = opts.duration;
  if (!created) return;
  try {
    await CapacitorMusicControls.updateElapsed({
      elapsed: Math.max(0, Math.floor(opts.position)),
      isPlaying: lastIsPlaying,
    });
  } catch (err) {
    console.warn("[media-notification] updateElapsed failed", err);
  }
  if (durationChanged) {
    // Refresh duration shown on the scrubber.
    await createOrUpdate();
  }
}

export async function setNotificationActionHandler(
  action: Action,
  handler: Handler,
) {
  if (!isNative) return;
  if (handler) handlers[action] = handler;
  else delete handlers[action];
  await ensureListener();
}
