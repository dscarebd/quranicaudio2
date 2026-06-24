import { useLanguage, type Lang } from "@/stores/language";
import type { Surah } from "@/lib/quran-data";

const dict = {
  en: {
    search: "Search",
    home: "Home",
    reciters: "Reciters",
    favorites: "Favorites",
    profile: "Profile",
    settings: "Settings",
    nowPlaying: "Now Playing",
    recentlyPlayed: "Recently Played",
    allSurah: "All Surah",
    downloadAll: "Download all",
    download: "Download",
    downloadForOffline: "Download for offline",
    selectReciter: "Select reciter",
    selectSurahs: "Select surahs",
    selectAll: "Select all",
    clear: "Clear",
    selectedCount: "selected",
    startDownload: "Start download",
    downloading: "Downloading…",
    downloadComplete: "Saved to your device",
    cancel: "Cancel",
    done: "Done",
    failedCount: "failed",
    downloads: "Downloads",
    downloadsHint: "Saved surahs play without internet.",
    noDownloads: "No downloads yet",
    noDownloadsHint: "Tap Download on any surah list to save audio for offline listening.",
    surahsCount: "surahs",
    removeAll: "Remove all",
    removeDownload: "Remove download",
    storage: "Storage",
    selectSurah: "Select a surah to listen",
    play: "Play",
    pause: "Pause",
    shuffle: "Shuffle",
    repeat: "Repeat",
    next: "Next",
    previous: "Previous",
    sura: "Sura",
    ayahs: "verses",
    meccan: "Meccan",
    medinan: "Medinan",
    searchSurahs: "Search surahs",
    noFavorites: "No favorites yet.",
    tapHeartHint: "Tap the heart on any surah to save it here.",
    noTrack: "No track playing.",
    goHome: "Go home",
    back: "Back",
    favorite: "Favorite",
    remove: "Remove",
    info: "Info",
    language: "Language",
    english: "English",
    bangla: "Bangla",
    on: "On",
    off: "Off",
    one: "One",
    all: "All",
    playbackSpeed: "Playback speed",
    sleep: "Sleep",
    sleepTimer: "Sleep timer",
    endOfTrack: "End of track",
    sleepAt: "Sleep at",
    reciter: "Reciter",
    chooseReciter: "Choose Reciter",
    playback: "Playback",
    library: "Library",
    data: "Data",
    recentlyPlayedShort: "Recently played",
    clearRecents: "Clear recently played",
    clearFavorites: "Clear favorites",
    listener: "Listener",
    verses: "Verses",
    noResults: "No surahs match",
    renownedVoices: "renowned voices",
    recitersHint: "Tap a reciter to switch — your choice applies to every surah.",
    tapToListen: "Tap a Surah to start listening",
    scrollToTop: "Scroll to top",
  },
  bn: {
    search: "অনুসন্ধান",
    home: "হোম",
    reciters: "কারী",
    favorites: "প্রিয়",
    profile: "প্রোফাইল",
    settings: "সেটিংস",
    nowPlaying: "এখন চলছে",
    recentlyPlayed: "সাম্প্রতিক শোনা",
    allSurah: "সকল সূরা",
    downloadAll: "সব ডাউনলোড",
    download: "ডাউনলোড",
    downloadForOffline: "অফলাইনের জন্য ডাউনলোড",
    selectReciter: "কারী নির্বাচন করুন",
    selectSurahs: "সূরা নির্বাচন করুন",
    selectAll: "সব নির্বাচন করুন",
    clear: "মুছে ফেলুন",
    selectedCount: "নির্বাচিত",
    startDownload: "ডাউনলোড শুরু করুন",
    downloading: "ডাউনলোড হচ্ছে…",
    downloadComplete: "ডিভাইসে সংরক্ষিত হয়েছে",
    cancel: "বাতিল",
    done: "সম্পন্ন",
    failedCount: "ব্যর্থ",
    downloads: "ডাউনলোড",
    downloadsHint: "সংরক্ষিত সূরা ইন্টারনেট ছাড়াই বাজবে।",
    noDownloads: "এখনও কোনো ডাউনলোড নেই",
    noDownloadsHint: "যেকোনো সূরা তালিকায় ডাউনলোডে ট্যাপ করে অফলাইন শোনার জন্য সংরক্ষণ করুন।",
    surahsCount: "সূরা",
    removeAll: "সব মুছে ফেলুন",
    removeDownload: "ডাউনলোড মুছে ফেলুন",
    storage: "স্টোরেজ",
    selectSurah: "শোনার জন্য একটি সূরা বেছে নিন",
    play: "চালান",
    pause: "থামান",
    shuffle: "এলোমেলো",
    repeat: "পুনরাবৃত্তি",
    next: "পরবর্তী",
    previous: "পূর্ববর্তী",
    sura: "সূরা",
    ayahs: "আয়াত",
    meccan: "মাক্কী",
    medinan: "মাদানী",
    searchSurahs: "সূরা খুঁজুন",
    noFavorites: "এখনও কোনো প্রিয় নেই।",
    tapHeartHint: "যেকোনো সূরার হৃদয় চিহ্নে ট্যাপ করে এখানে সংরক্ষণ করুন।",
    noTrack: "কোনো ট্র্যাক চলছে না।",
    goHome: "হোমে যান",
    back: "ফিরে যান",
    favorite: "প্রিয়",
    remove: "মুছে ফেলুন",
    info: "তথ্য",
    language: "ভাষা",
    english: "ইংরেজি",
    bangla: "বাংলা",
    on: "চালু",
    off: "বন্ধ",
    one: "একটি",
    all: "সব",
    playbackSpeed: "প্লেব্যাক গতি",
    sleep: "স্লিপ",
    sleepTimer: "স্লিপ টাইমার",
    endOfTrack: "ট্র্যাক শেষে",
    sleepAt: "স্লিপ হবে",
    reciter: "কারী",
    chooseReciter: "কারী নির্বাচন করুন",
    playback: "প্লেব্যাক",
    library: "লাইব্রেরি",
    data: "ডেটা",
    recentlyPlayedShort: "সাম্প্রতিক",
    clearRecents: "সাম্প্রতিক মুছে ফেলুন",
    clearFavorites: "প্রিয় মুছে ফেলুন",
    listener: "শ্রোতা",
    verses: "আয়াতসমূহ",
    noResults: "কোনো সূরা মিলেনি",
    renownedVoices: "বিখ্যাত কণ্ঠস্বর",
    recitersHint: "ট্যাপ করে কারী পরিবর্তন করুন — আপনার পছন্দ প্রতিটি সূরায় প্রযোজ্য হবে।",
    tapToListen: "শোনা শুরু করতে একটি সূরায় ট্যাপ করুন",
    scrollToTop: "উপরে যান",
  },
} as const;

export type TKey = keyof (typeof dict)["en"];

export function translate(lang: Lang, key: TKey): string {
  return dict[lang][key] ?? dict.en[key];
}

export function useT() {
  const lang = useLanguage((s) => s.lang);
  return { lang, t: (k: TKey) => translate(lang, k) };
}

export function surahName(surah: Pick<Surah, "name" | "bangla">, lang: Lang): string {
  return lang === "bn" && surah.bangla ? surah.bangla : surah.name;
}

export function surahMeaning(surah: Pick<Surah, "meaning" | "banglaMeaning">, lang: Lang): string {
  return lang === "bn" && surah.banglaMeaning ? surah.banglaMeaning : surah.meaning;
}

export function surahType(s: Surah, lang: Lang): string {
  return s.type === "Meccan" ? translate(lang, "meccan") : translate(lang, "medinan");
}

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBanglaNum(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => BN_DIGITS[parseInt(d, 10)]);
}

export function localizeNum(value: number | string, lang: Lang): string {
  return lang === "bn" ? toBanglaNum(value) : String(value);
}
