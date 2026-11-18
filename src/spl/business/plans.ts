// SME bundle prices are SPL's published ones (splonline.com.sa/ar/smes-platform).
// E-commerce and contract terms are illustrative for the prototype.

export type Volume = "lt20" | "20to75" | "75to250" | "250to500" | "gt500";
export type Platform = "salla" | "zid" | "own" | "social";
export type PlanKind = "sme" | "ecom" | "contract";

export const VOLUMES: { value: Volume; label: string; mid: number }[] = [
  { value: "lt20", label: "أقل من 20", mid: 15 },
  { value: "20to75", label: "20 – 75", mid: 50 },
  { value: "75to250", label: "75 – 250", mid: 150 },
  { value: "250to500", label: "250 – 500", mid: 350 },
  { value: "gt500", label: "أكثر من 500", mid: 700 },
];

export const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "salla", label: "سلة" },
  { value: "zid", label: "زد" },
  { value: "own", label: "متجر إلكتروني خاص" },
  { value: "social", label: "إنستقرام / واتساب" },
];

export const BUNDLES = [
  { id: "found", name: "باقة التأسيس", shipments: 20, total: 599, per: 29.95 },
  { id: "grow", name: "باقة النمو", shipments: 50, total: 1299, per: 25.98 },
  { id: "lead", name: "باقة الريادة", shipments: 75, total: 1649, per: 21.99 },
  { id: "biz", name: "باقة الأعمال", shipments: 250, total: 4999, per: 20 },
] as const;

export const ECOM = { per: 19, codFee: 1.5 }; // SAR per parcel, % of collected amount

export interface Recommendation {
  kind: PlanKind;
  title: string;
  why: string;
  priceLine: string;
  priceUnit: string;
  monthly?: string;
  features: string[];
  cta: string;
  bundleId?: string;
  alt?: { kind: PlanKind; text: string; bundleId?: string };
}

export function pickBundle(v: Volume) {
  if (v === "lt20") return BUNDLES[0];
  if (v === "20to75") return BUNDLES[2];
  return BUNDLES[3];
}

export function recommend(v: Volume, cod: boolean, platform: Platform): Recommendation {
  const mid = VOLUMES.find((x) => x.value === v)!.mid;
  const platformName = PLATFORMS.find((p) => p.value === platform)!.label;
  const hasStore = platform !== "social";

  if (v === "gt500") {
    return {
      kind: "contract",
      title: "عقد شحن مباشر للمنشآت",
      why: "لأنك ترسل أكثر من 500 شحنة شهرياً، تحصل على أسعار تفاوضية ومدير حساب مخصص.",
      priceLine: "أسعار خاصة",
      priceUnit: "حسب حجم شحناتك",
      features: [
        "مدير حساب مخصص",
        "استلام يومي من مستودعك",
        cod ? "الدفع عند الاستلام وتحويل المبالغ أسبوعياً" : "شحن داخلي ودولي",
        hasStore ? `ربط مباشر مع ${platformName}` : "ربط عبر API",
        "إدارة المرتجعات",
      ],
      cta: "اطلب عرض سعر",
    };
  }

  if (cod || (hasStore && v !== "lt20")) {
    return {
      kind: "ecom",
      title: "خدمة التجارة الإلكترونية",
      why: cod
        ? "لأنك تحتاج الدفع عند الاستلام" + (hasStore ? ` وتبيع على ${platformName}، نربط متجرك ونحصّل المبالغ نيابة عنك.` : "، نحصّل المبالغ من عملائك ونحوّلها لحسابك.")
        : `لأنك تبيع على ${platformName}، تُنشأ الشحنات تلقائياً من طلبات متجرك.`,
      priceLine: `${ECOM.per} ريال`,
      priceUnit: "للطرد",
      monthly: `≈ ${(ECOM.per * mid).toLocaleString("en-US")} ريال شهرياً لـ ${mid} طرد`,
      features: [
        hasStore ? `ربط متجرك على ${platformName} بنقرة` : "إنشاء الشحنات من حسابك في سبل",
        cod ? `الدفع عند الاستلام (رسوم ${ECOM.codFee}% من المبلغ المحصّل)` : "دفع مسبق أو عند الاستلام",
        "توصيل للباب أو لفروع سبل أو محطات الطرود",
        "إدارة المرتجعات",
        "تنبيهات للعميل بحالة الشحنة",
      ],
      cta: "ابدأ التسجيل",
      alt: cod ? undefined : { kind: "sme", bundleId: pickBundle(v).id, text: `أو اشترِ ${pickBundle(v).name} مسبقاً بسعر ${pickBundle(v).per} ريال للطرد (بدون ربط المتجر)` },
    };
  }

  const b = pickBundle(v);
  return {
    kind: "sme",
    title: b.name,
    why: v === "lt20"
      ? "تشحن أقل من 20 شحنة شهرياً، فأصغر باقة تكفيك لعدة أشهر (صالحة لسنة)."
      : `تكفي شحناتك الشهرية، وسعر الطرد فيها أقل من الشحن الفردي (54 ريال).`,
    priceLine: `${b.per} ريال`,
    priceUnit: "للطرد",
    monthly: `${b.shipments} شحنة بـ ${b.total.toLocaleString("en-US")} ريال · صالحة لسنة`,
    features: [
      "شحن داخل المملكة حتى 20 كجم للطرد",
      "توصيل لباب المستلم",
      "تتبع الشحنات",
      "إعادة رصيد الشحنة إذا لم تُرسل",
    ],
    cta: "ابدأ التسجيل",
    bundleId: b.id,
  };
}
