/**
 * Bridges the web MediaSession API to the Android MediaStyle notification
 * via @capgo/capacitor-media-session. On non-native platforms all calls
 * become no-ops, so the browser's built-in MediaSession (already wired in
 * use-audio) keeps working.
 */
import { Capacitor } from "@capacitor/core";
import { MediaSession } from "@capgo/capacitor-media-session";

const isNative = Capacitor.isNativePlatform?.() ?? false;

export type NotifMetadata = {
  title: string;
  artist: string;
  album: string;
  artwork: { src: string; sizes: string; type: string }[];
};

export async function setNotificationMetadata(meta: NotifMetadata) {
  if (!isNative) return;
  try {
    await MediaSession.setMetadata({
      title: meta.title,
      artist: meta.artist,
      album: meta.album,
      artwork: meta.artwork,
    });
  } catch {
    /* ignore */
  }
}

export async function setNotificationPlaybackState(
  state: "none" | "paused" | "playing",
) {
  if (!isNative) return;
  try {
    await MediaSession.setPlaybackState({ playbackState: state });
  } catch {
    /* ignore */
  }
}

export async function setNotificationPosition(opts: {
  duration: number;
  position: number;
  playbackRate: number;
}) {
  if (!isNative) return;
  try {
    await MediaSession.setPositionState(opts);
  } catch {
    /* ignore */
  }
}

type Action =
  | "play"
  | "pause"
  | "previoustrack"
  | "nexttrack"
  | "seekbackward"
  | "seekforward"
  | "seekto"
  | "stop";

export async function setNotificationActionHandler(
  action: Action,
  handler: ((details: { seekTime?: number; seekOffset?: number }) => void) | null,
) {
  if (!isNative) return;
  try {
    // The plugin signature mirrors navigator.mediaSession.setActionHandler.
    await MediaSession.setActionHandler(
      { action },
      handler as never,
    );
  } catch {
    /* ignore unsupported action */
  }
}
