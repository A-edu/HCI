export type ShipType = "parcel" | "docs";
export type Dest = "domestic" | "intl";

export interface Service {
  id: string;
  name: string;
  days: number;
  price: number;
  features: string[];
  tracked: boolean;
}

export const CITIES = [
  "الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "الأحساء",
  "القصيم", "حائل", "تبوك", "أبها", "خميس مشيط", "جازان", "نجران", "الباحة", "الجوف", "عرعر",
];

export const COUNTRIES = [
  { name: "الإمارات", zone: 1 }, { name: "الكويت", zone: 1 }, { name: "البحرين", zone: 1 },
  { name: "قطر", zone: 1 }, { name: "عُمان", zone: 1 }, { name: "مصر", zone: 2 },
  { name: "الأردن", zone: 2 }, { name: "المملكة المتحدة", zone: 3 }, { name: "الولايات المتحدة", zone: 3 },
];

export const LIMITS = { parcel: 30, docs: 2 } as const;
export const VOLUMETRIC_DIVISOR = 5000; // cm³ per kg

const extraKg = (kg: number, base: number) => Math.max(0, Math.ceil(kg - base));

/** Domestic prices: 2 kg values match SPL's live calculator; other weights are illustrative tiers. */
export function quote(type: ShipType, dest: Dest, kg: number, zone = 1): Service[] {
  if (dest === "intl") {
    const z = [0, 1, 1.6, 2.4][zone];
    return [
      { id: "intl-eco", name: "طرد دولي اقتصادي", days: 10 + zone * 2, price: Math.round((120 + 25 * extraKg(kg, 1)) * z), tracked: true,
        features: ["تتبع الشحنة", "تخليص جمركي"] },
      { id: "intl-exp", name: "اكسبرس دولي", days: 3 + zone, price: Math.round((210 + 45 * extraKg(kg, 1)) * z), tracked: true,
        features: ["تتبع لحظي", "توصيل للباب", "تخليص جمركي"] },
    ];
  }
  if (type === "docs") {
    const regular = kg <= 0.1 ? 9 : kg <= 0.5 ? 15 : kg <= 1 ? 22 : 33;
    return [
      { id: "mail", name: "البريد العادي", days: 6, price: regular, tracked: false,
        features: ["بدون تتبع", "تسليم على العنوان الوطني"] },
      { id: "registered", name: "البريد المسجل", days: 6, price: regular + 6, tracked: true,
        features: ["تتبع الشحنة", "توقيع عند الاستلام"] },
      { id: "exp-docs", name: "مستندات اكسبرس", days: 5, price: 95, tracked: true,
        features: ["تتبع لحظي", "توصيل للباب"] },
    ];
  }
  return [
    { id: "eco", name: "طرد اقتصادي", days: 6, price: 54 + 6 * extraKg(kg, 5), tracked: true,
      features: ["تتبع الشحنة", "توصيل للباب"] },
    { id: "exp", name: "طرد اكسبرس", days: 5, price: 95 + 10 * extraKg(kg, 5), tracked: true,
      features: ["تتبع لحظي", "توصيل للباب", "أولوية في المعالجة"] },
    { id: "exp-plus", name: "اكسبرس بلس", days: 3, price: 141 + 15 * extraKg(kg, 5), tracked: true,
      features: ["تتبع لحظي", "توصيل للباب", "أولوية قصوى"] },
  ];
}

/** Cheapest tracked service = best value; lowest days = fastest. */
export function tagsFor(list: Service[]): Record<string, string> {
  const tracked = list.filter((s) => s.tracked);
  const best = [...tracked].sort((a, b) => a.price - b.price)[0];
  const fastest = [...list].sort((a, b) => a.days - b.days || a.price - b.price)[0];
  const t: Record<string, string> = {};
  if (best) t[best.id] = "أفضل قيمة";
  if (fastest && fastest.id !== best?.id) t[fastest.id] = "الأسرع";
  return t;
}

export function arrival(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("ar-SA-u-ca-gregory-nu-latn", { weekday: "long", day: "numeric", month: "long" });
}

export const fmtKg = (kg: number) =>
  (Math.round(kg * 1000) / 1000).toLocaleString("en-US", { maximumFractionDigits: 3 });
