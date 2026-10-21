export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const copy = {
  en: {
    dir: "ltr" as const,
    freeShipping: "Delivery across Egypt · Cash on delivery with deposit",
    nav: [
      "New in",
      "Female scrubs",
      "Male scrubs",
      "Lab coats",
      "Instagram",
      "Our quality",
      "Sale",
    ],
    eyebrow: "MEDICAL CLOTHING · MADE IN EGYPT",
    title: "Confidence for every shift.",
    heroBody:
      "Explore medical apparel, find your fit and choose the details that work for your day.",
    shopWomen: "Shop female scrubs",
    shopMen: "Shop male scrubs",
    arrivals: "Scrubs made to move",
    arrivalsBody:
      "The latest KOVA Scrubs designs, ready for the pace of your day.",
    viewAll: "View all",
    add: "Quick add",
    curated: "Wear the difference",
  },
  ar: {
    dir: "rtl" as const,
    freeShipping: "توصيل لجميع أنحاء مصر · الدفع عند الاستلام بمقدم",
    nav: [
      "وصل حديثاً",
      "سكراب حريمي",
      "سكراب رجالي",
      "بالطو طبي",
      "إنستجرام",
      "جودتنا",
      "العروض",
    ],
    eyebrow: "ملابس طبية · صناعة مصرية",
    title: "ثقة في كل شيفت.",
    heroBody:
      "اكتشف الملابس الطبية واختر المقاس والتفاصيل المناسبة ليومك.",
    shopWomen: "تسوقي السكراب الحريمي",
    shopMen: "تسوق السكراب الرجالي",
    arrivals: "سكراب يتحرك معك",
    arrivalsBody: "أحدث تصميمات كوفا سكراب، جاهزة لإيقاع يومك.",
    viewAll: "عرض الكل",
    add: "إضافة سريعة",
    curated: "اشعر بالفرق",
  },
} as const;
