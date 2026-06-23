import type { Reciter } from "./reciters";

const pad3 = (n: number) => String(n).padStart(3, "0");

export const fullSurahUrl = (reciter: Reciter, surahId: number) =>
  `${reciter.mp3quranBase}${pad3(surahId)}.mp3`;

export const ayahAudioUrl = (reciter: Reciter, surahId: number, ayahId: number) =>
  `https://everyayah.com/data/${reciter.everyayahFolder}/${pad3(surahId)}${pad3(ayahId)}.mp3`;
