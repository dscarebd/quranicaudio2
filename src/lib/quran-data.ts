// Static metadata for all 114 surahs. Ayah counts use the standard Hafs reading.
export type Surah = {
  id: number;
  name: string;        // English transliteration
  arabic: string;      // Arabic name
  meaning: string;     // English meaning
  ayahs: number;
  type: "Meccan" | "Medinan";
};

export const SURAHS: Surah[] = [
  { id: 1, name: "Al Fatiha", arabic: "الفاتحة", meaning: "The Opening", ayahs: 7, type: "Meccan" },
  { id: 2, name: "Al Baqara", arabic: "البقرة", meaning: "The Cow", ayahs: 286, type: "Medinan" },
  { id: 3, name: "Al Imran", arabic: "آل عمران", meaning: "Family of Imran", ayahs: 200, type: "Medinan" },
  { id: 4, name: "An Nisa", arabic: "النساء", meaning: "The Women", ayahs: 176, type: "Medinan" },
  { id: 5, name: "Al Maeda", arabic: "المائدة", meaning: "The Table Spread", ayahs: 120, type: "Medinan" },
  { id: 6, name: "Al Anam", arabic: "الأنعام", meaning: "The Cattle", ayahs: 165, type: "Meccan" },
  { id: 7, name: "Al Araf", arabic: "الأعراف", meaning: "The Heights", ayahs: 206, type: "Meccan" },
  { id: 8, name: "Al Anfal", arabic: "الأنفال", meaning: "The Spoils of War", ayahs: 75, type: "Medinan" },
  { id: 9, name: "At Tawba", arabic: "التوبة", meaning: "The Repentance", ayahs: 129, type: "Medinan" },
  { id: 10, name: "Yunus", arabic: "يونس", meaning: "Jonah", ayahs: 109, type: "Meccan" },
  { id: 11, name: "Hud", arabic: "هود", meaning: "Hud", ayahs: 123, type: "Meccan" },
  { id: 12, name: "Yusuf", arabic: "يوسف", meaning: "Joseph", ayahs: 111, type: "Meccan" },
  { id: 13, name: "Ar Rad", arabic: "الرعد", meaning: "The Thunder", ayahs: 43, type: "Medinan" },
  { id: 14, name: "Ibrahim", arabic: "إبراهيم", meaning: "Abraham", ayahs: 52, type: "Meccan" },
  { id: 15, name: "Al Hijr", arabic: "الحجر", meaning: "The Rocky Tract", ayahs: 99, type: "Meccan" },
  { id: 16, name: "An Nahl", arabic: "النحل", meaning: "The Bee", ayahs: 128, type: "Meccan" },
  { id: 17, name: "Al Isra", arabic: "الإسراء", meaning: "The Night Journey", ayahs: 111, type: "Meccan" },
  { id: 18, name: "Al Kahf", arabic: "الكهف", meaning: "The Cave", ayahs: 110, type: "Meccan" },
  { id: 19, name: "Maryam", arabic: "مريم", meaning: "Mary", ayahs: 98, type: "Meccan" },
  { id: 20, name: "Ta Ha", arabic: "طه", meaning: "Ta-Ha", ayahs: 135, type: "Meccan" },
  { id: 21, name: "Al Anbiya", arabic: "الأنبياء", meaning: "The Prophets", ayahs: 112, type: "Meccan" },
  { id: 22, name: "Al Hajj", arabic: "الحج", meaning: "The Pilgrimage", ayahs: 78, type: "Medinan" },
  { id: 23, name: "Al Muminun", arabic: "المؤمنون", meaning: "The Believers", ayahs: 118, type: "Meccan" },
  { id: 24, name: "An Nur", arabic: "النور", meaning: "The Light", ayahs: 64, type: "Medinan" },
  { id: 25, name: "Al Furqan", arabic: "الفرقان", meaning: "The Criterion", ayahs: 77, type: "Meccan" },
  { id: 26, name: "Ash Shuara", arabic: "الشعراء", meaning: "The Poets", ayahs: 227, type: "Meccan" },
  { id: 27, name: "An Naml", arabic: "النمل", meaning: "The Ant", ayahs: 93, type: "Meccan" },
  { id: 28, name: "Al Qasas", arabic: "القصص", meaning: "The Stories", ayahs: 88, type: "Meccan" },
  { id: 29, name: "Al Ankabut", arabic: "العنكبوت", meaning: "The Spider", ayahs: 69, type: "Meccan" },
  { id: 30, name: "Ar Rum", arabic: "الروم", meaning: "The Romans", ayahs: 60, type: "Meccan" },
  { id: 31, name: "Luqman", arabic: "لقمان", meaning: "Luqman", ayahs: 34, type: "Meccan" },
  { id: 32, name: "As Sajda", arabic: "السجدة", meaning: "The Prostration", ayahs: 30, type: "Meccan" },
  { id: 33, name: "Al Ahzab", arabic: "الأحزاب", meaning: "The Confederates", ayahs: 73, type: "Medinan" },
  { id: 34, name: "Saba", arabic: "سبأ", meaning: "Sheba", ayahs: 54, type: "Meccan" },
  { id: 35, name: "Fatir", arabic: "فاطر", meaning: "Originator", ayahs: 45, type: "Meccan" },
  { id: 36, name: "Ya Sin", arabic: "يس", meaning: "Ya-Sin", ayahs: 83, type: "Meccan" },
  { id: 37, name: "As Saffat", arabic: "الصافات", meaning: "Those Ranged in Ranks", ayahs: 182, type: "Meccan" },
  { id: 38, name: "Sad", arabic: "ص", meaning: "Sad", ayahs: 88, type: "Meccan" },
  { id: 39, name: "Az Zumar", arabic: "الزمر", meaning: "The Groups", ayahs: 75, type: "Meccan" },
  { id: 40, name: "Ghafir", arabic: "غافر", meaning: "The Forgiver", ayahs: 85, type: "Meccan" },
  { id: 41, name: "Fussilat", arabic: "فصلت", meaning: "Explained in Detail", ayahs: 54, type: "Meccan" },
  { id: 42, name: "Ash Shura", arabic: "الشورى", meaning: "The Consultation", ayahs: 53, type: "Meccan" },
  { id: 43, name: "Az Zukhruf", arabic: "الزخرف", meaning: "The Gold Adornments", ayahs: 89, type: "Meccan" },
  { id: 44, name: "Ad Dukhan", arabic: "الدخان", meaning: "The Smoke", ayahs: 59, type: "Meccan" },
  { id: 45, name: "Al Jathiya", arabic: "الجاثية", meaning: "The Kneeling", ayahs: 37, type: "Meccan" },
  { id: 46, name: "Al Ahqaf", arabic: "الأحقاف", meaning: "The Curved Sand-hills", ayahs: 35, type: "Meccan" },
  { id: 47, name: "Muhammad", arabic: "محمد", meaning: "Muhammad", ayahs: 38, type: "Medinan" },
  { id: 48, name: "Al Fath", arabic: "الفتح", meaning: "The Victory", ayahs: 29, type: "Medinan" },
  { id: 49, name: "Al Hujurat", arabic: "الحجرات", meaning: "The Dwellings", ayahs: 18, type: "Medinan" },
  { id: 50, name: "Qaf", arabic: "ق", meaning: "Qaf", ayahs: 45, type: "Meccan" },
  { id: 51, name: "Adh Dhariyat", arabic: "الذاريات", meaning: "The Winds that Scatter", ayahs: 60, type: "Meccan" },
  { id: 52, name: "At Tur", arabic: "الطور", meaning: "The Mount", ayahs: 49, type: "Meccan" },
  { id: 53, name: "An Najm", arabic: "النجم", meaning: "The Star", ayahs: 62, type: "Meccan" },
  { id: 54, name: "Al Qamar", arabic: "القمر", meaning: "The Moon", ayahs: 55, type: "Meccan" },
  { id: 55, name: "Ar Rahman", arabic: "الرحمن", meaning: "The Most Merciful", ayahs: 78, type: "Medinan" },
  { id: 56, name: "Al Waqia", arabic: "الواقعة", meaning: "The Inevitable", ayahs: 96, type: "Meccan" },
  { id: 57, name: "Al Hadid", arabic: "الحديد", meaning: "The Iron", ayahs: 29, type: "Medinan" },
  { id: 58, name: "Al Mujadila", arabic: "المجادلة", meaning: "The Pleading Woman", ayahs: 22, type: "Medinan" },
  { id: 59, name: "Al Hashr", arabic: "الحشر", meaning: "The Gathering", ayahs: 24, type: "Medinan" },
  { id: 60, name: "Al Mumtahina", arabic: "الممتحنة", meaning: "The Woman to be Examined", ayahs: 13, type: "Medinan" },
  { id: 61, name: "As Saff", arabic: "الصف", meaning: "The Row", ayahs: 14, type: "Medinan" },
  { id: 62, name: "Al Jumua", arabic: "الجمعة", meaning: "Friday", ayahs: 11, type: "Medinan" },
  { id: 63, name: "Al Munafiqun", arabic: "المنافقون", meaning: "The Hypocrites", ayahs: 11, type: "Medinan" },
  { id: 64, name: "At Taghabun", arabic: "التغابن", meaning: "Mutual Loss & Gain", ayahs: 18, type: "Medinan" },
  { id: 65, name: "At Talaq", arabic: "الطلاق", meaning: "The Divorce", ayahs: 12, type: "Medinan" },
  { id: 66, name: "At Tahrim", arabic: "التحريم", meaning: "The Prohibition", ayahs: 12, type: "Medinan" },
  { id: 67, name: "Al Mulk", arabic: "الملك", meaning: "Dominion", ayahs: 30, type: "Meccan" },
  { id: 68, name: "Al Qalam", arabic: "القلم", meaning: "The Pen", ayahs: 52, type: "Meccan" },
  { id: 69, name: "Al Haqqa", arabic: "الحاقة", meaning: "The Inevitable", ayahs: 52, type: "Meccan" },
  { id: 70, name: "Al Maarij", arabic: "المعارج", meaning: "The Ways of Ascent", ayahs: 44, type: "Meccan" },
  { id: 71, name: "Nuh", arabic: "نوح", meaning: "Noah", ayahs: 28, type: "Meccan" },
  { id: 72, name: "Al Jinn", arabic: "الجن", meaning: "The Jinn", ayahs: 28, type: "Meccan" },
  { id: 73, name: "Al Muzzammil", arabic: "المزمل", meaning: "The Enshrouded One", ayahs: 20, type: "Meccan" },
  { id: 74, name: "Al Muddathir", arabic: "المدثر", meaning: "The Cloaked One", ayahs: 56, type: "Meccan" },
  { id: 75, name: "Al Qiyama", arabic: "القيامة", meaning: "The Resurrection", ayahs: 40, type: "Meccan" },
  { id: 76, name: "Al Insan", arabic: "الإنسان", meaning: "Man", ayahs: 31, type: "Medinan" },
  { id: 77, name: "Al Mursalat", arabic: "المرسلات", meaning: "Those Sent Forth", ayahs: 50, type: "Meccan" },
  { id: 78, name: "An Naba", arabic: "النبأ", meaning: "The Great News", ayahs: 40, type: "Meccan" },
  { id: 79, name: "An Naziat", arabic: "النازعات", meaning: "Those Who Pull Out", ayahs: 46, type: "Meccan" },
  { id: 80, name: "Abasa", arabic: "عبس", meaning: "He Frowned", ayahs: 42, type: "Meccan" },
  { id: 81, name: "At Takwir", arabic: "التكوير", meaning: "Wound Round", ayahs: 29, type: "Meccan" },
  { id: 82, name: "Al Infitar", arabic: "الإنفطار", meaning: "The Cleaving", ayahs: 19, type: "Meccan" },
  { id: 83, name: "Al Mutaffifin", arabic: "المطففين", meaning: "Defrauding", ayahs: 36, type: "Meccan" },
  { id: 84, name: "Al Inshiqaq", arabic: "الإنشقاق", meaning: "The Splitting Asunder", ayahs: 25, type: "Meccan" },
  { id: 85, name: "Al Buruj", arabic: "البروج", meaning: "The Stars", ayahs: 22, type: "Meccan" },
  { id: 86, name: "At Tariq", arabic: "الطارق", meaning: "The Night-Comer", ayahs: 17, type: "Meccan" },
  { id: 87, name: "Al Ala", arabic: "الأعلى", meaning: "The Most High", ayahs: 19, type: "Meccan" },
  { id: 88, name: "Al Ghashiya", arabic: "الغاشية", meaning: "The Overwhelming", ayahs: 26, type: "Meccan" },
  { id: 89, name: "Al Fajr", arabic: "الفجر", meaning: "The Dawn", ayahs: 30, type: "Meccan" },
  { id: 90, name: "Al Balad", arabic: "البلد", meaning: "The City", ayahs: 20, type: "Meccan" },
  { id: 91, name: "Ash Shams", arabic: "الشمس", meaning: "The Sun", ayahs: 15, type: "Meccan" },
  { id: 92, name: "Al Lail", arabic: "الليل", meaning: "The Night", ayahs: 21, type: "Meccan" },
  { id: 93, name: "Ad Duha", arabic: "الضحى", meaning: "The Forenoon", ayahs: 11, type: "Meccan" },
  { id: 94, name: "Ash Sharh", arabic: "الشرح", meaning: "The Opening Forth", ayahs: 8, type: "Meccan" },
  { id: 95, name: "At Tin", arabic: "التين", meaning: "The Fig", ayahs: 8, type: "Meccan" },
  { id: 96, name: "Al Alaq", arabic: "العلق", meaning: "The Clot", ayahs: 19, type: "Meccan" },
  { id: 97, name: "Al Qadr", arabic: "القدر", meaning: "The Night of Decree", ayahs: 5, type: "Meccan" },
  { id: 98, name: "Al Bayyina", arabic: "البينة", meaning: "The Clear Evidence", ayahs: 8, type: "Medinan" },
  { id: 99, name: "Az Zalzala", arabic: "الزلزلة", meaning: "The Earthquake", ayahs: 8, type: "Medinan" },
  { id: 100, name: "Al Adiyat", arabic: "العاديات", meaning: "The Runners", ayahs: 11, type: "Meccan" },
  { id: 101, name: "Al Qaria", arabic: "القارعة", meaning: "The Striking Hour", ayahs: 11, type: "Meccan" },
  { id: 102, name: "At Takathur", arabic: "التكاثر", meaning: "Piling Up", ayahs: 8, type: "Meccan" },
  { id: 103, name: "Al Asr", arabic: "العصر", meaning: "The Time", ayahs: 3, type: "Meccan" },
  { id: 104, name: "Al Humaza", arabic: "الهمزة", meaning: "The Slanderer", ayahs: 9, type: "Meccan" },
  { id: 105, name: "Al Fil", arabic: "الفيل", meaning: "The Elephant", ayahs: 5, type: "Meccan" },
  { id: 106, name: "Quraish", arabic: "قريش", meaning: "Quraish", ayahs: 4, type: "Meccan" },
  { id: 107, name: "Al Maun", arabic: "الماعون", meaning: "Small Kindnesses", ayahs: 7, type: "Meccan" },
  { id: 108, name: "Al Kawthar", arabic: "الكوثر", meaning: "Abundance", ayahs: 3, type: "Meccan" },
  { id: 109, name: "Al Kafirun", arabic: "الكافرون", meaning: "The Disbelievers", ayahs: 6, type: "Meccan" },
  { id: 110, name: "An Nasr", arabic: "النصر", meaning: "The Help", ayahs: 3, type: "Medinan" },
  { id: 111, name: "Al Masad", arabic: "المسد", meaning: "The Palm Fibre", ayahs: 5, type: "Meccan" },
  { id: 112, name: "Al Ikhlas", arabic: "الإخلاص", meaning: "Sincerity", ayahs: 4, type: "Meccan" },
  { id: 113, name: "Al Falaq", arabic: "الفلق", meaning: "The Daybreak", ayahs: 5, type: "Meccan" },
  { id: 114, name: "An Nas", arabic: "الناس", meaning: "Mankind", ayahs: 6, type: "Meccan" },
];

export const getSurah = (id: number) => SURAHS.find((s) => s.id === id);

// Approximate full-surah durations (mm:ss) for display in the list.
// Real audio elements override this once metadata loads.
export const approxDuration = (ayahs: number) => {
  const seconds = Math.max(20, Math.round(ayahs * 12));
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
};
