import { useEffect, useRef } from "react";
import { usePlayer } from "@/stores/player";
import { useReciterSelection, useRecents } from "@/stores/persisted";
import { getReciter } from "@/lib/reciters";
import { fullSurahUrl, ayahAudioUrl } from "@/lib/audio-urls";
import { getSurah } from "@/lib/quran-data";

/**
 * Single global audio engine. Mount once at the app shell.
 * Reads target track from usePlayer + reciter store, writes time/duration back.
 */
export function useAudioEngine() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const surahId = usePlayer((s) => s.surahId);
  const ayahId = usePlayer((s) => s.ayahId);
  const isPlaying = usePlayer((s) => s.isPlaying);
  const repeat = usePlayer((s) => s.repeat);
  const reciterId = useReciterSelection((s) => s.reciterId);
  const pushRecent = useRecents((s) => s.push);

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
    if (isPlaying) audio.play().catch(() => {});
    pushRecent(surahId);
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
    const onTime = () => {
      // Honor any pending seek
      const seek = usePlayer.getState().consumeSeek();
      if (seek != null && Math.abs(audio.currentTime - seek) > 0.4) {
        audio.currentTime = seek;
      }
      usePlayer.getState().setTime(audio.currentTime);
    };
    const onMeta = () => usePlayer.getState().setDuration(audio.duration || 0);
    const onEnd = () => {
      const { surahId: sid, ayahId: aid, repeat: r, next } = usePlayer.getState();
      if (r === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }
      // verse-by-verse: advance until last ayah of surah
      if (aid != null && sid != null) {
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

  // touch repeat so React keeps deps fresh
  void repeat;
}
