// Static metadata for all 114 surahs. Ayah counts use the standard Hafs reading.
export type Surah = {
  id: number;
  name: string;        // English transliteration
  arabic: string;      // Arabic name
  bangla: string;      // Bangla name
  meaning: string;     // English meaning
  banglaMeaning: string; // Bangla meaning
  ayahs: number;
  type: "Meccan" | "Medinan";
};

export const SURAHS: Surah[] = [
  { id: 1, name: "Al Fatiha", arabic: "الفاتحة", bangla: "আল-ফাতিহা", meaning: "The Opening", banglaMeaning: "উদ্বোধন", ayahs: 7, type: "Meccan" },
  { id: 2, name: "Al Baqara", arabic: "البقرة", bangla: "আল-বাকারা", meaning: "The Cow", banglaMeaning: "গবাদি পশু", ayahs: 286, type: "Medinan" },
  { id: 3, name: "Al Imran", arabic: "آل عمران", bangla: "আলে-ইমরান", meaning: "Family of Imran", banglaMeaning: "ইমরান পরিবার", ayahs: 200, type: "Medinan" },
  { id: 4, name: "An Nisa", arabic: "النساء", bangla: "আন-নিসা", meaning: "The Women", banglaMeaning: "নারী", ayahs: 176, type: "Medinan" },
  { id: 5, name: "Al Maeda", arabic: "المائدة", bangla: "আল-মায়িদাহ", meaning: "The Table Spread", banglaMeaning: "খাদ্যের দস্তরখানা", ayahs: 120, type: "Medinan" },
  { id: 6, name: "Al Anam", arabic: "الأنعام", bangla: "আল-আনআম", meaning: "The Cattle", banglaMeaning: "গবাদি পশু", ayahs: 165, type: "Meccan" },
  { id: 7, name: "Al Araf", arabic: "الأعراف", bangla: "আল-আরাফ", meaning: "The Heights", banglaMeaning: "উচ্চস্থান", ayahs: 206, type: "Meccan" },
  { id: 8, name: "Al Anfal", arabic: "الأنفال", bangla: "আল-আনফাল", meaning: "The Spoils of War", banglaMeaning: "যুদ্ধলব্ধ সম্পদ", ayahs: 75, type: "Medinan" },
  { id: 9, name: "At Tawba", arabic: "التوبة", bangla: "আত-তাওবা", meaning: "The Repentance", banglaMeaning: "তাওবা", ayahs: 129, type: "Medinan" },
  { id: 10, name: "Yunus", arabic: "يونس", bangla: "ইউনুস", meaning: "Jonah", banglaMeaning: "ইউনুস", ayahs: 109, type: "Meccan" },
  { id: 11, name: "Hud", arabic: "هود", bangla: "হুদ", meaning: "Hud", banglaMeaning: "হুদ", ayahs: 123, type: "Meccan" },
  { id: 12, name: "Yusuf", arabic: "يوسف", bangla: "ইউসুফ", meaning: "Joseph", banglaMeaning: "ইউসুফ", ayahs: 111, type: "Meccan" },
  { id: 13, name: "Ar Rad", arabic: "الرعد", bangla: "আর-রাদ", meaning: "The Thunder", banglaMeaning: "বজ্র", ayahs: 43, type: "Medinan" },
  { id: 14, name: "Ibrahim", arabic: "إبراهيم", bangla: "ইবরাহিম", meaning: "Abraham", banglaMeaning: "ইবরাহিম", ayahs: 52, type: "Meccan" },
  { id: 15, name: "Al Hijr", arabic: "الحجر", bangla: "আল-হিজর", meaning: "The Rocky Tract", banglaMeaning: "পাথুরে প্রদেশ", ayahs: 99, type: "Meccan" },
  { id: 16, name: "An Nahl", arabic: "النحل", bangla: "আন-নাহল", meaning: "The Bee", banglaMeaning: "মৌমাছি", ayahs: 128, type: "Meccan" },
  { id: 17, name: "Al Isra", arabic: "الإسراء", bangla: "আল-ইসরা", meaning: "The Night Journey", banglaMeaning: "রাত্রির ভ্রমণ", ayahs: 111, type: "Meccan" },
  { id: 18, name: "Al Kahf", arabic: "الكهف", bangla: "আল-কাহফ", meaning: "The Cave", banglaMeaning: "গুহা", ayahs: 110, type: "Meccan" },
  { id: 19, name: "Maryam", arabic: "مريم", bangla: "মারইয়াম", meaning: "Mary", banglaMeaning: "মারইয়াম", ayahs: 98, type: "Meccan" },
  { id: 20, name: "Ta Ha", arabic: "طه", bangla: "ত্বা-হা", meaning: "Ta-Ha", banglaMeaning: "ত্বা-হা", ayahs: 135, type: "Meccan" },
  { id: 21, name: "Al Anbiya", arabic: "الأنبياء", bangla: "আল-আম্বিয়া", meaning: "The Prophets", banglaMeaning: "নবীগণ", ayahs: 112, type: "Meccan" },
  { id: 22, name: "Al Hajj", arabic: "الحج", bangla: "আল-হাজ্জ", meaning: "The Pilgrimage", banglaMeaning: "হজ্জ", ayahs: 78, type: "Medinan" },
  { id: 23, name: "Al Muminun", arabic: "المؤمنون", bangla: "আল-মুমিনুন", meaning: "The Believers", banglaMeaning: "মুমিন", ayahs: 118, type: "Meccan" },
  { id: 24, name: "An Nur", arabic: "النور", bangla: "আন-নূর", meaning: "The Light", banglaMeaning: "আলো", ayahs: 64, type: "Medinan" },
  { id: 25, name: "Al Furqan", arabic: "الفرقان", bangla: "আল-ফুরকান", meaning: "The Criterion", banglaMeaning: "মানদণ্ড", ayahs: 77, type: "Meccan" },
  { id: 26, name: "Ash Shuara", arabic: "الشعراء", bangla: "আশ-শুআরা", meaning: "The Poets", banglaMeaning: "কবিগণ", ayahs: 227, type: "Meccan" },
  { id: 27, name: "An Naml", arabic: "النمل", bangla: "আন-নামল", meaning: "The Ant", banglaMeaning: "পিপীলিকা", ayahs: 93, type: "Meccan" },
  { id: 28, name: "Al Qasas", arabic: "القصص", bangla: "আল-কাসাস", meaning: "The Stories", banglaMeaning: "কাহিনী", ayahs: 88, type: "Meccan" },
  { id: 29, name: "Al Ankabut", arabic: "العنكبوت", bangla: "আল-আনকাবুত", meaning: "The Spider", banglaMeaning: "মাকড়সা", ayahs: 69, type: "Meccan" },
  { id: 30, name: "Ar Rum", arabic: "الروم", bangla: "আর-রূম", meaning: "The Romans", banglaMeaning: "রোমান", ayahs: 60, type: "Meccan" },
  { id: 31, name: "Luqman", arabic: "لقمان", bangla: "লুকমান", meaning: "Luqman", banglaMeaning: "লুকমান", ayahs: 34, type: "Meccan" },
  { id: 32, name: "As Sajda", arabic: "السجدة", bangla: "আস-সাজদা", meaning: "The Prostration", banglaMeaning: "সিজদা", ayahs: 30, type: "Meccan" },
  { id: 33, name: "Al Ahzab", arabic: "الأحزاب", bangla: "আল-আহযাব", meaning: "The Confederates", banglaMeaning: "মিত্রবর্গ", ayahs: 73, type: "Medinan" },
  { id: 34, name: "Saba", arabic: "سبأ", bangla: "সাবা", meaning: "Sheba", banglaMeaning: "সাবা", ayahs: 54, type: "Meccan" },
  { id: 35, name: "Fatir", arabic: "فاطر", bangla: "ফাতির", meaning: "Originator", banglaMeaning: "সৃষ্টিকর্তা", ayahs: 45, type: "Meccan" },
  { id: 36, name: "Ya Sin", arabic: "يس", bangla: "ইয়াসীন", meaning: "Ya-Sin", banglaMeaning: "ইয়াসীন", ayahs: 83, type: "Meccan" },
  { id: 37, name: "As Saffat", arabic: "الصافات", bangla: "আস-সাফফাত", meaning: "Those Ranged in Ranks", banglaMeaning: "সারিবদ্ধরা", ayahs: 182, type: "Meccan" },
  { id: 38, name: "Sad", arabic: "ص", bangla: "সাদ", meaning: "Sad", banglaMeaning: "সাদ", ayahs: 88, type: "Meccan" },
  { id: 39, name: "Az Zumar", arabic: "الزمر", bangla: "আয-যুমার", meaning: "The Groups", banglaMeaning: "দলগুলো", ayahs: 75, type: "Meccan" },
  { id: 40, name: "Ghafir", arabic: "غافر", bangla: "গাফির", meaning: "The Forgiver", banglaMeaning: "ক্ষমাশীল", ayahs: 85, type: "Meccan" },
  { id: 41, name: "Fussilat", arabic: "فصلت", bangla: "ফুসসিলাত", meaning: "Explained in Detail", banglaMeaning: "সুস্পষ্ট বিবরণ", ayahs: 54, type: "Meccan" },
  { id: 42, name: "Ash Shura", arabic: "الشورى", bangla: "আশ-শূরা", meaning: "The Consultation", banglaMeaning: "পরামর্শ", ayahs: 53, type: "Meccan" },
  { id: 43, name: "Az Zukhruf", arabic: "الزخرف", bangla: "আয-যুখরুফ", meaning: "The Gold Adornments", banglaMeaning: "সোনার অলংকার", ayahs: 89, type: "Meccan" },
  { id: 44, name: "Ad Dukhan", arabic: "الدخان", bangla: "আদ-দুখান", meaning: "The Smoke", banglaMeaning: "ধোঁয়া", ayahs: 59, type: "Meccan" },
  { id: 45, name: "Al Jathiya", arabic: "الجاثية", bangla: "আল-জাসিয়া", meaning: "The Kneeling", banglaMeaning: "নতজানু", ayahs: 37, type: "Meccan" },
  { id: 46, name: "Al Ahqaf", arabic: "الأحقاف", bangla: "আল-আহকাফ", meaning: "The Curved Sand-hills", banglaMeaning: "বালুর পাহাড়", ayahs: 35, type: "Meccan" },
  { id: 47, name: "Muhammad", arabic: "محمد", bangla: "মুহাম্মাদ", meaning: "Muhammad", banglaMeaning: "মুহাম্মাদ", ayahs: 38, type: "Medinan" },
  { id: 48, name: "Al Fath", arabic: "الفتح", bangla: "আল-ফাতহ", meaning: "The Victory", banglaMeaning: "বিজয়", ayahs: 29, type: "Medinan" },
  { id: 49, name: "Al Hujurat", arabic: "الحجرات", bangla: "আল-হুজুরাত", meaning: "The Dwellings", banglaMeaning: "ঘরবাড়ি", ayahs: 18, type: "Medinan" },
  { id: 50, name: "Qaf", arabic: "ق", bangla: "কাফ", meaning: "Qaf", banglaMeaning: "কাফ", ayahs: 45, type: "Meccan" },
  { id: 51, name: "Adh Dhariyat", arabic: "الذاريات", bangla: "আয-যারিয়াত", meaning: "The Winds that Scatter", banglaMeaning: "বিক্ষেপকারী বাতাস", ayahs: 60, type: "Meccan" },
  { id: 52, name: "At Tur", arabic: "الطور", bangla: "আত-তূর", meaning: "The Mount", banglaMeaning: "পাহাড়", ayahs: 49, type: "Meccan" },
  { id: 53, name: "An Najm", arabic: "النجم", bangla: "আন-নাজম", meaning: "The Star", banglaMeaning: "নক্ষত্র", ayahs: 62, type: "Meccan" },
  { id: 54, name: "Al Qamar", arabic: "القمر", bangla: "আল-কামার", meaning: "The Moon", banglaMeaning: "চন্দ্র", ayahs: 55, type: "Meccan" },
  { id: 55, name: "Ar Rahman", arabic: "الرحمن", bangla: "আর-রহমান", meaning: "The Most Merciful", banglaMeaning: "পরম দয়ালু", ayahs: 78, type: "Medinan" },
  { id: 56, name: "Al Waqia", arabic: "الواقعة", bangla: "আল-ওয়াকিয়া", meaning: "The Inevitable", banglaMeaning: "অনিবার্য ঘটনা", ayahs: 96, type: "Meccan" },
  { id: 57, name: "Al Hadid", arabic: "الحديد", bangla: "আল-হাদীদ", meaning: "The Iron", banglaMeaning: "লোহা", ayahs: 29, type: "Medinan" },
  { id: 58, name: "Al Mujadila", arabic: "المجادلة", bangla: "আল-মুজাদিলা", meaning: "The Pleading Woman", banglaMeaning: "আপত্তিকারিণী", ayahs: 22, type: "Medinan" },
  { id: 59, name: "Al Hashr", arabic: "الحشر", bangla: "আল-হাশর", meaning: "The Gathering", banglaMeaning: "সমাবেশ", ayahs: 24, type: "Medinan" },
  { id: 60, name: "Al Mumtahina", arabic: "الممتحنة", bangla: "আল-মুমতাহিনা", meaning: "The Woman to be Examined", banglaMeaning: "পরীক্ষিতা", ayahs: 13, type: "Medinan" },
  { id: 61, name: "As Saff", arabic: "الصف", bangla: "আস-সাফ", meaning: "The Row", banglaMeaning: "সারি", ayahs: 14, type: "Medinan" },
  { id: 62, name: "Al Jumua", arabic: "الجمعة", bangla: "আল-জুমুআ", meaning: "Friday", banglaMeaning: "জুমুআ", ayahs: 11, type: "Medinan" },
  { id: 63, name: "Al Munafiqun", arabic: "المنافقون", bangla: "আল-মুনাফিকুন", meaning: "The Hypocrites", banglaMeaning: "মুনাফিক", ayahs: 11, type: "Medinan" },
  { id: 64, name: "At Taghabun", arabic: "التغابن", bangla: "আত-তাগাবুন", meaning: "Mutual Loss & Gain", banglaMeaning: "পরস্পরের প্রতারণা", ayahs: 18, type: "Medinan" },
  { id: 65, name: "At Talaq", arabic: "الطلاق", bangla: "আত-তালাক", meaning: "The Divorce", banglaMeaning: "তালাক", ayahs: 12, type: "Medinan" },
  { id: 66, name: "At Tahrim", arabic: "التحريم", bangla: "আত-তাহরিম", meaning: "The Prohibition", banglaMeaning: "হারামকরণ", ayahs: 12, type: "Medinan" },
  { id: 67, name: "Al Mulk", arabic: "الملك", bangla: "আল-মুলক", meaning: "Dominion", banglaMeaning: "রাজত্ব", ayahs: 30, type: "Meccan" },
  { id: 68, name: "Al Qalam", arabic: "القلم", bangla: "আল-কলম", meaning: "The Pen", banglaMeaning: "কলম", ayahs: 52, type: "Meccan" },
  { id: 69, name: "Al Haqqa", arabic: "الحاقة", bangla: "আল-হাক্কা", meaning: "The Inevitable", banglaMeaning: "নিশ্চিত ঘটনা", ayahs: 52, type: "Meccan" },
  { id: 70, name: "Al Maarij", arabic: "المعارج", bangla: "আল-মাআরিজ", meaning: "The Ways of Ascent", banglaMeaning: "উন্নয়নের পথ", ayahs: 44, type: "Meccan" },
  { id: 71, name: "Nuh", arabic: "نوح", bangla: "নূহ", meaning: "Noah", banglaMeaning: "নূহ", ayahs: 28, type: "Meccan" },
  { id: 72, name: "Al Jinn", arabic: "الجن", bangla: "আল-জিন", meaning: "The Jinn", banglaMeaning: "জিন", ayahs: 28, type: "Meccan" },
  { id: 73, name: "Al Muzzammil", arabic: "المزمل", bangla: "আল-মুযযাম্মিল", meaning: "The Enshrouded One", banglaMeaning: "কম্বলপোষক", ayahs: 20, type: "Meccan" },
  { id: 74, name: "Al Muddathir", arabic: "المدثر", bangla: "আল-মুদ্দাসসির", meaning: "The Cloaked One", banglaMeaning: "বস্ত্রাচ্ছাদিত", ayahs: 56, type: "Meccan" },
  { id: 75, name: "Al Qiyama", arabic: "القيامة", bangla: "আল-কিয়ামাহ", meaning: "The Resurrection", banglaMeaning: "পুনরুত্থান", ayahs: 40, type: "Meccan" },
  { id: 76, name: "Al Insan", arabic: "الإنسان", bangla: "আল-ইনসান", meaning: "Man", banglaMeaning: "মানুষ", ayahs: 31, type: "Medinan" },
  { id: 77, name: "Al Mursalat", arabic: "المرسلات", bangla: "আল-মুরসালাত", meaning: "Those Sent Forth", banglaMeaning: "প্রেরিত", ayahs: 50, type: "Meccan" },
  { id: 78, name: "An Naba", arabic: "النبأ", bangla: "আন-নাবা", meaning: "The Great News", banglaMeaning: "মহাসংবাদ", ayahs: 40, type: "Meccan" },
  { id: 79, name: "An Naziat", arabic: "النازعات", bangla: "আন-নাযিআত", meaning: "Those Who Pull Out", banglaMeaning: "হিমশিম খাওয়ানো", ayahs: 46, type: "Meccan" },
  { id: 80, name: "Abasa", arabic: "عبس", bangla: "আবাসা", meaning: "He Frowned", banglaMeaning: "তিনি ভ্রু কুঁচকালেন", ayahs: 42, type: "Meccan" },
  { id: 81, name: "At Takwir", arabic: "التكوير", bangla: "আত-তাকভীর", meaning: "Wound Round", banglaMeaning: "পাকানো", ayahs: 29, type: "Meccan" },
  { id: 82, name: "Al Infitar", arabic: "الإنفطار", bangla: "আল-ইনফিতার", meaning: "The Cleaving", banglaMeaning: "বিদীর্ণ", ayahs: 19, type: "Meccan" },
  { id: 83, name: "Al Mutaffifin", arabic: "المطففين", bangla: "আল-মুতাফফিফীন", meaning: "Defrauding", banglaMeaning: "কম দেওয়া", ayahs: 36, type: "Meccan" },
  { id: 84, name: "Al Inshiqaq", arabic: "الإنشقاق", bangla: "আল-ইনশিকাক", meaning: "The Splitting Asunder", banglaMeaning: "বিদারণ", ayahs: 25, type: "Meccan" },
  { id: 85, name: "Al Buruj", arabic: "البروج", bangla: "আল-বুরুজ", meaning: "The Stars", banglaMeaning: "নক্ষত্রপুঞ্জ", ayahs: 22, type: "Meccan" },
  { id: 86, name: "At Tariq", arabic: "الطارق", bangla: "আত-তারিক", meaning: "The Night-Comer", banglaMeaning: "আগন্তুক", ayahs: 17, type: "Meccan" },
  { id: 87, name: "Al Ala", arabic: "الأعلى", bangla: "আল-আলা", meaning: "The Most High", banglaMeaning: "সর্বোচ্চ", ayahs: 19, type: "Meccan" },
  { id: 88, name: "Al Ghashiya", arabic: "الغاشية", bangla: "আল-গাশিয়া", meaning: "The Overwhelming", banglaMeaning: "বিপর্যয়", ayahs: 26, type: "Meccan" },
  { id: 89, name: "Al Fajr", arabic: "الفجر", bangla: "আল-ফাজর", meaning: "The Dawn", banglaMeaning: "ভোর", ayahs: 30, type: "Meccan" },
  { id: 90, name: "Al Balad", arabic: "البلد", bangla: "আল-বালাদ", meaning: "The City", banglaMeaning: "নগর", ayahs: 20, type: "Meccan" },
  { id: 91, name: "Ash Shams", arabic: "الشمس", bangla: "আশ-শামস", meaning: "The Sun", banglaMeaning: "সূর্য", ayahs: 15, type: "Meccan" },
  { id: 92, name: "Al Lail", arabic: "الليل", bangla: "আল-লাইল", meaning: "The Night", banglaMeaning: "রাত", ayahs: 21, type: "Meccan" },
  { id: 93, name: "Ad Duha", arabic: "الضحى", bangla: "আদ-দুহা", meaning: "The Forenoon", banglaMeaning: "পূর্বাহ্ন", ayahs: 11, type: "Meccan" },
  { id: 94, name: "Ash Sharh", arabic: "الشرح", bangla: "আশ-শারহ", meaning: "The Opening Forth", banglaMeaning: "প্রশস্তকরণ", ayahs: 8, type: "Meccan" },
  { id: 95, name: "At Tin", arabic: "التين", bangla: "আত-তীন", meaning: "The Fig", banglaMeaning: "ডুমুর", ayahs: 8, type: "Meccan" },
  { id: 96, name: "Al Alaq", arabic: "العلق", bangla: "আল-আলাক", meaning: "The Clot", banglaMeaning: "রক্তপিন্ড", ayahs: 19, type: "Meccan" },
  { id: 97, name: "Al Qadr", arabic: "القدر", bangla: "আল-কদর", meaning: "The Night of Decree", banglaMeaning: "শান্তির রাত", ayahs: 5, type: "Meccan" },
  { id: 98, name: "Al Bayyina", arabic: "البينة", bangla: "আল-বায়্যিনা", meaning: "The Clear Evidence", banglaMeaning: "স্পষ্ট প্রমাণ", ayahs: 8, type: "Medinan" },
  { id: 99, name: "Az Zalzala", arabic: "الزلزلة", bangla: "আয-যিলযাল", meaning: "The Earthquake", banglaMeaning: "ভূমিকম্প", ayahs: 8, type: "Medinan" },
  { id: 100, name: "Al Adiyat", arabic: "العاديات", bangla: "আল-আদিয়াত", meaning: "The Runners", banglaMeaning: "দ্রুতগামী", ayahs: 11, type: "Meccan" },
  { id: 101, name: "Al Qaria", arabic: "القارعة", bangla: "আল-কারিআ", meaning: "The Striking Hour", banglaMeaning: "আঘাত", ayahs: 11, type: "Meccan" },
  { id: 102, name: "At Takathur", arabic: "التكاثر", bangla: "আত-তাকাসুর", meaning: "Piling Up", banglaMeaning: "বাহুবল", ayahs: 8, type: "Meccan" },
  { id: 103, name: "Al Asr", arabic: "العصر", bangla: "আল-আসর", meaning: "The Time", banglaMeaning: "সময়", ayahs: 3, type: "Meccan" },
  { id: 104, name: "Al Humaza", arabic: "الهمزة", bangla: "আল-হুমাযা", meaning: "The Slanderer", banglaMeaning: "পরনিন্দাকারী", ayahs: 9, type: "Meccan" },
  { id: 105, name: "Al Fil", arabic: "الفيل", bangla: "আল-ফীল", meaning: "The Elephant", banglaMeaning: "হাতি", ayahs: 5, type: "Meccan" },
  { id: 106, name: "Quraish", arabic: "قريش", bangla: "কুরাইশ", meaning: "Quraish", banglaMeaning: "কুরাইশ", ayahs: 4, type: "Meccan" },
  { id: 107, name: "Al Maun", arabic: "الماعون", bangla: "আল-মাঊন", meaning: "Small Kindnesses", banglaMeaning: "সামান্য সাহায্য", ayahs: 7, type: "Meccan" },
  { id: 108, name: "Al Kawthar", arabic: "الكوثر", bangla: "আল-কাওসার", meaning: "Abundance", banglaMeaning: "প্রাচুর্য", ayahs: 3, type: "Meccan" },
  { id: 109, name: "Al Kafirun", arabic: "الكافرون", bangla: "আল-কাফিরুন", meaning: "The Disbelievers", banglaMeaning: "কাফির", ayahs: 6, type: "Meccan" },
  { id: 110, name: "An Nasr", arabic: "النصر", bangla: "আন-নাসর", meaning: "The Help", banglaMeaning: "সাহায্য", ayahs: 3, type: "Medinan" },
  { id: 111, name: "Al Masad", arabic: "المسد", bangla: "আল-মাসাদ", meaning: "The Palm Fibre", banglaMeaning: "রশি", ayahs: 5, type: "Meccan" },
  { id: 112, name: "Al Ikhlas", arabic: "الإخلاص", bangla: "আল-ইখলাস", meaning: "Sincerity", banglaMeaning: "একনিষ্ঠতা", ayahs: 4, type: "Meccan" },
  { id: 113, name: "Al Falaq", arabic: "الفلق", bangla: "আল-ফালাক", meaning: "The Daybreak", banglaMeaning: "ভোর", ayahs: 5, type: "Meccan" },
  { id: 114, name: "An Nas", arabic: "الناس", bangla: "আন-নাস", meaning: "Mankind", banglaMeaning: "মানুষ", ayahs: 6, type: "Meccan" },
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
