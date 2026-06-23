import { useEffect, useRef } from "react";
import { usePlayer } from "@/stores/player";
import { useReciterSelection, useRecents, usePlaybackPositions } from "@/stores/persisted";
import { getReciter } from "@/lib/reciters";
import { fullSurahUrl, ayahAudioUrl } from "@/lib/audio-urls";
import { getSurah } from "@/lib/quran-data";

/**
 * Single global audio engine. Mount once at the app shell.
 * Reads target track from usePlayer + reciter store, writes time/duration back.
 */
export function useAudioEngine() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const didMountRef = useRef(false);
  const lastPushedSurahRef = useRef<number | null>(null);
  const surahId = usePlayer((s) => s.surahId);
  const ayahId = usePlayer((s) => s.ayahId);
  const isPlaying = usePlayer((s) => s.isPlaying);
  const repeat = usePlayer((s) => s.repeat);
  const playbackRate = usePlayer((s) => s.playbackRate);
  const reciterId = useReciterSelection((s) => s.reciterId);
  const pushRecent = useRecents((s) => s.push);

  // Apply playback rate
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  // Sleep timer poll
  useEffect(() => {
    const id = setInterval(() => usePlayer.getState().clearSleepIfNeeded(), 1000);
    return () => clearInterval(id);
  }, []);

  // Build / replace source whenever track or reciter changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "auto";
    }
    const audio = audioRef.current;
    if (surahId == null) {
      audio.pause();
      audio.removeAttribute("src");
      return;
    }
    const reciter = getReciter(reciterId);
    const url =
      ayahId != null
        ? ayahAudioUrl(reciter, surahId, ayahId)
        : fullSurahUrl(reciter, surahId);
    audio.src = url;
    audio.load();
    audio.playbackRate = usePlayer.getState().playbackRate;

    // Resume from saved position (full-surah playback only)
    if (ayahId == null) {
      const saved = usePlaybackPositions.getState().get(reciterId, surahId);
      if (saved > 2) {
        const applyResume = () => {
          try {
            if (audio.duration && saved < audio.duration - 3) {
              audio.currentTime = saved;
              usePlayer.getState().setTime(saved);
            }
          } catch { /* ignore */ }
          audio.removeEventListener("loadedmetadata", applyResume);
        };
        audio.addEventListener("loadedmetadata", applyResume);
      }
    }

    if (isPlaying) audio.play().catch(() => {});
    // Only push to recents on real user-initiated track changes:
    // - skip the first mount (restored state shouldn't re-push)
    // - skip pushes that come from reciterId changes alone (same surah)
    if (didMountRef.current && lastPushedSurahRef.current !== surahId) {
      lastPushedSurahRef.current = surahId;
      pushRecent(surahId);
    } else {
      didMountRef.current = true;
      lastPushedSurahRef.current = surahId;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surahId, ayahId, reciterId]);

  // Play / pause state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(() => usePlayer.setState({ isPlaying: false }));
    else audio.pause();
  }, [isPlaying]);

  // Wire up listeners once
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    let lastSaved = 0;
    const onTime = () => {
      // Honor any pending seek
      const seek = usePlayer.getState().consumeSeek();
      if (seek != null && Math.abs(audio.currentTime - seek) > 0.4) {
        audio.currentTime = seek;
      }
      const t = audio.currentTime;
      usePlayer.getState().setTime(t);
      // Persist position (full-surah only) every ~3s
      const { surahId: sid, ayahId: aid } = usePlayer.getState();
      if (sid != null && aid == null && t - lastSaved >= 3) {
        lastSaved = t;
        usePlaybackPositions.getState().save(useReciterSelection.getState().reciterId, sid, t);
      }
    };
    const onMeta = () => usePlayer.getState().setDuration(audio.duration || 0);
    const onEnd = () => {
      const { surahId: sid, ayahId: aid, repeat: r, next, sleepMode } = usePlayer.getState();
      // Clear resume point on natural completion of a full surah
      if (sid != null && aid == null) {
        usePlaybackPositions.getState().clear(useReciterSelection.getState().reciterId, sid);
        lastSaved = 0;
      }
      if (sleepMode === "end-of-track") {
        usePlayer.setState({ isPlaying: false, sleepMode: "off", sleepEndsAt: null });
        return;
      }
      if (r === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }
      // verse-by-verse: advance until last ayah of surah
      const { shuffle } = usePlayer.getState();
      if (aid != null && sid != null && !shuffle) {
        const surah = getSurah(sid);
        if (surah && aid >= surah.ayahs) {
          if (r === "all") {
            usePlayer.getState().play(sid, 1);
          } else {
            usePlayer.setState({ isPlaying: false, currentTime: 0 });
          }
          return;
        }
      }
      next();
    };
    const onPlay = () => usePlayer.getState().setPlaying(true);
    const onPause = () => usePlayer.getState().setPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("durationchange", onMeta);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("durationchange", onMeta);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  // React to seek requests from UI scrubber
  useEffect(() => {
    const unsub = usePlayer.subscribe((state, prev) => {
      if (state._seekRequest !== prev._seekRequest && state._seekRequest != null) {
        const audio = audioRef.current;
        if (audio) audio.currentTime = state._seekRequest;
        usePlayer.getState().consumeSeek();
      }
    });
    return unsub;
  }, []);

  // Media Session: lock screen / notification metadata
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    if (surahId == null) {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.playbackState = "none";
      return;
    }
    const surah = getSurah(surahId);
    const reciter = getReciter(reciterId);
    const title = surah
      ? ayahId != null
        ? `${surah.name} · Ayah ${ayahId}`
        : `${surah.id}. ${surah.name}`
      : "Quran";
    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist: reciter?.name ?? "Reciter",
      album: surah ? `${surah.arabic} — ${surah.meaning}` : "Holy Quran",
    });
  }, [surahId, ayahId, reciterId]);

  // Media Session: playback state + action handlers
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [isPlaying]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    const safe = (action: MediaSessionAction, handler: MediaSessionActionHandler | null) => {
      try {
        ms.setActionHandler(action, handler);
      } catch {
        /* unsupported action */
      }
    };
    safe("play", () => {
      audioRef.current?.play().catch(() => {});
      usePlayer.getState().setPlaying(true);
    });
    safe("pause", () => {
      audioRef.current?.pause();
      usePlayer.getState().setPlaying(false);
    });
    safe("previoustrack", () => usePlayer.getState().prev());
    safe("nexttrack", () => usePlayer.getState().next());
    safe("seekbackward", (details) => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.currentTime = Math.max(0, audio.currentTime - (details.seekOffset ?? 10));
    });
    safe("seekforward", (details) => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + (details.seekOffset ?? 10));
    });
    safe("seekto", (details) => {
      const audio = audioRef.current;
      if (!audio || details.seekTime == null) return;
      audio.currentTime = details.seekTime;
    });
    safe("stop", () => {
      audioRef.current?.pause();
      usePlayer.getState().setPlaying(false);
    });
    return () => {
      const actions: MediaSessionAction[] = [
        "play", "pause", "previoustrack", "nexttrack",
        "seekbackward", "seekforward", "seekto", "stop",
      ];
      actions.forEach((a) => safe(a, null));
    };
  }, []);

  // Media Session: position state for scrubbing on lock screen
  const currentTime = usePlayer((s) => s.currentTime);
  const duration = usePlayer((s) => s.duration);
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    if (!("setPositionState" in navigator.mediaSession)) return;
    if (!duration || !isFinite(duration)) return;
    try {
      navigator.mediaSession.setPositionState({
        duration,
        position: Math.min(currentTime, duration),
        playbackRate,
      });
    } catch {
      /* ignore */
    }
  }, [currentTime, duration, playbackRate]);

  // touch repeat so React keeps deps fresh
  void repeat;
}
