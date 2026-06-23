// 15 reciters available. Each has:
//  - mp3quranBase: base URL for full-surah MP3s — append "NNN.mp3"
//  - everyayahFolder: folder name on everyayah.com for verse-by-verse MP3s
export type Reciter = {
  id: string;
  name: string;
  arabic: string;
  mp3quranBase: string;
  everyayahFolder: string;
};

export const RECITERS: Reciter[] = [
  {
    id: "alafasy",
    name: "Mishary Rashid Alafasy",
    arabic: "مشاري راشد العفاسي",
    mp3quranBase: "https://server8.mp3quran.net/afs/",
    everyayahFolder: "Alafasy_128kbps",
  },
  {
    id: "abdulbasit",
    name: "Abdul Basit Abdus Samad",
    arabic: "عبد الباسط عبد الصمد",
    mp3quranBase: "https://server7.mp3quran.net/basit/",
    everyayahFolder: "AbdulSamad_64kbps_QuranExplorer.Com",
  },
  {
    id: "sudais",
    name: "Abdurrahmaan As-Sudais",
    arabic: "عبد الرحمن السديس",
    mp3quranBase: "https://server11.mp3quran.net/sds/",
    everyayahFolder: "Abdurrahmaan_As-Sudais_192kbps",
  },
  {
    id: "shuraim",
    name: "Saud Al-Shuraim",
    arabic: "سعود الشريم",
    mp3quranBase: "https://server7.mp3quran.net/shur/",
    everyayahFolder: "Saood_ash-Shuraym_128kbps",
  },
  {
    id: "husary",
    name: "Mahmoud Khalil Al-Husary",
    arabic: "محمود خليل الحصري",
    mp3quranBase: "https://server13.mp3quran.net/husr/",
    everyayahFolder: "Husary_128kbps",
  },
  {
    id: "minshawi",
    name: "Mohamed Siddiq Al-Minshawi",
    arabic: "محمد صديق المنشاوي",
    mp3quranBase: "https://server10.mp3quran.net/minsh/",
    everyayahFolder: "Minshawy_Murattal_128kbps",
  },
  {
    id: "muaiqly",
    name: "Maher Al Muaiqly",
    arabic: "ماهر المعيقلي",
    mp3quranBase: "https://server12.mp3quran.net/maher/",
    everyayahFolder: "MaherAlMuaiqly128kbps",
  },
  {
    id: "ajamy",
    name: "Ahmad Al-Ajamy",
    arabic: "أحمد العجمي",
    mp3quranBase: "https://server10.mp3quran.net/ajm/",
    everyayahFolder: "ahmed_ibn_ali_al_ajamy_128kbps",
  },
  {
    id: "ghamdi",
    name: "Saad Al-Ghamdi",
    arabic: "سعد الغامدي",
    mp3quranBase: "https://server7.mp3quran.net/s_gmd/",
    everyayahFolder: "Ghamadi_40kbps",
  },
  {
    id: "matrood",
    name: "Abdullah Al-Matrood",
    arabic: "عبد الله المطرود",
    mp3quranBase: "https://server8.mp3quran.net/mtrod/",
    everyayahFolder: "Abdullaah_3awwaad_Al-Juhaynee_128kbps",
  },
  {
    id: "hudhaify",
    name: "Ali Al-Hudhaify",
    arabic: "علي الحذيفي",
    mp3quranBase: "https://server7.mp3quran.net/hthfi/",
    everyayahFolder: "Hudhaify_128kbps",
  },
  {
    id: "shaatri",
    name: "Abu Bakr Al-Shatri",
    arabic: "أبو بكر الشاطري",
    mp3quranBase: "https://server11.mp3quran.net/shatri/",
    everyayahFolder: "Abu_Bakr_Ash-Shaatree_128kbps",
  },
  {
    id: "basfar",
    name: "Abdullah Basfar",
    arabic: "عبد الله بصفر",
    mp3quranBase: "https://server7.mp3quran.net/basfer/",
    everyayahFolder: "Abdullah_Basfar_192kbps",
  },
  {
    id: "juhany",
    name: "Abdullah Awwad Al-Juhany",
    arabic: "عبد الله عواد الجهني",
    mp3quranBase: "https://server13.mp3quran.net/jhn/",
    everyayahFolder: "Abdullaah_3awwaad_Al-Juhaynee_128kbps",
  },
  {
    id: "rifai",
    name: "Hani Ar-Rifai",
    arabic: "هاني الرفاعي",
    mp3quranBase: "https://server8.mp3quran.net/rifai/",
    everyayahFolder: "Hani_Rifai_192kbps",
  },
];

export const getReciter = (id: string) =>
  RECITERS.find((r) => r.id === id) ?? RECITERS[0];
