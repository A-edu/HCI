import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Car as CarIcon, Wrench, Truck, Bike, Building2, Home, Smartphone, Sofa, PawPrint, Package, HandHelping, ShoppingBag, ArrowLeft, AlertTriangle, CircleCheck, Info, ArrowRight, Search } from "lucide-react";
import { HarajLayout } from "./HarajLayout";
import { PostRow } from "./Filters";
import { MODELS, CITIES, fmt, type Car, type Fuel, type Trans } from "./data";

const W = "https://thumb.wikimedia.org/wikipedia/commons/thumb/";
const PREVIEW_IMG: Record<string, string> = {
  "يارس": W + "8/85/2017_Toyota_Yaris_L_5-door%2C_front_right%2C_08-25-2024.jpg/330px-2017_Toyota_Yaris_L_5-door%2C_front_right%2C_08-25-2024.jpg",
  "كامري": W + "4/4d/Toyota_Camry_AXVH80_2.5_HEV_Platinum_White_Pearl_Mica_05.jpg/330px-Toyota_Camry_AXVH80_2.5_HEV_Platinum_White_Pearl_Mica_05.jpg",
  "كورولا": W + "f/f1/2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg/330px-2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg",
  "هايلكس": W + "7/74/Toyota_Hilux_2.4_E_4x2_2014.jpg/330px-Toyota_Hilux_2.4_E_4x2_2014.jpg",
  "لاندكروزر": W + "6/6d/2021_Toyota_Land_Cruiser_300_3.4_ZX_%28Colombia%29_front_view_04.png/330px-2021_Toyota_Land_Cruiser_300_3.4_ZX_%28Colombia%29_front_view_04.png",
};
const YEARS = Array.from({ length: 2026 - 1980 + 1 }, (_, i) => 2026 - i);
const NOW = 2026;
const input = "h-12 w-full rounded-[10px] bg-background border border-secondary-input-gray px-3 outline-none focus:border-secondary text-[15px] text-text-regular";
const lbl = "block text-[14px] text-secondary mb-2";

function Seg<T extends string>({ value, onChange, opts }: { value: T; onChange: (v: T) => void; opts: T[] }) {
  return (
    <div className="flex rounded-[10px] border border-secondary-input-gray overflow-hidden">
      {opts.map((o) => (
        <button key={o} type="button" onClick={() => onChange(o)} className={`flex-1 h-12 text-[14px] ${value === o ? "bg-secondary/[0.17] text-secondary/95" : "bg-background text-secondary/55"}`}>{o}</button>
      ))}
    </div>
  );
}

function Box({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl bg-background-card p-6">{children}</div>;
}

export default function Post() {
  const [what, setWhat] = useState<"car" | "part" | null>(null);
  const [done, setDone] = useState(false);

  // car fields
  const [brand, setBrand] = useState("تويوتا");
  const [model, setModel] = useState("هايلكس");
  const [year, setYear] = useState(2014);
  const [kmRaw, setKmRaw] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [confirmKm, setConfirmKm] = useState(false);
  const [trans, setTrans] = useState<Trans>("عادي");
  const [fuel, setFuel] = useState<Fuel>("بنزين");
  const [city, setCity] = useState("بيشة");
  const [price, setPrice] = useState("");
  const [auction, setAuction] = useState(false);
  const [desc, setDesc] = useState("");

  // part fields
  const [partName, setPartName] = useState("");
  const [fitModel, setFitModel] = useState("كورولا");
  const [fitFrom, setFitFrom] = useState(2023);
  const [fitTo, setFitTo] = useState(2025);

  const km = isNew ? 0 : kmRaw ? Number(kmRaw.replace(/,/g, "")) : null;
  const age = NOW - year;
  let kmIssue: { level: "error" | "warn"; text: string; fix?: number } | null = null;
  if (!isNew && km !== null) {
    if (km > 1_500_000) kmIssue = { level: "error", text: "الرقم كبير جداً. أدخل الممشى بالكيلومتر." };
    else if (km < 1000 && age >= 1) kmIssue = { level: "warn", text: `أدخلت ${fmt(km)} كم لسيارة ${year}. يبدو أنك كتبت الرقم بالآلاف.`, fix: km * 1000 };
    else if (age >= 4 && km < age * 3000) kmIssue = { level: "warn", text: `${fmt(km)} كم منخفض جداً لسيارة عمرها ${age} سنوات. تأكد من الرقم.` };
  }
  const kmOk = isNew || (km !== null && km >= 0 && (!kmIssue || (kmIssue.level === "warn" && confirmKm)));
  const title = `${brand} ${model} ${year}`;
  const carReady = kmOk;

  const preview: Car = {
    id: "new", kind: "car", brand, model, title, year, km: km ?? null, trans, fuel, color: "#b9bcc2", colorName: "", body: ["لاندكروزر", "برادو", "فورتشنر", "رايز", "اوربان كروزر", "سيكويا", "توسان", "باترول"].includes(model) ? "suv" : model === "هايلكس" ? "pickup" : "sedan",
    city, price: auction || !price ? null : Number(price), ago: 0, seller: "fahad.s", desc,
  };

  const reset = () => { setWhat(null); setDone(false); };

  return (
    <HarajLayout title="إضافة عرض" showNav={false}>
      <div className="max-w-6xl mx-auto px-6 pt-6 pb-16">
        {!what && (
          <div className="max-w-3xl mx-auto rounded-2xl bg-background-card p-6">
            <Link to="/haraj/filters" className="text-text-primary"><ArrowRight size={26} /></Link>
            <h1 className="text-[22px] font-bold text-secondary mt-3">اضافة عرض جديد</h1>
            <div className="text-[14px] text-secondary/70 mb-4">اختر نوع العرض</div>
            {([
              ["car", CarIcon, "عرض سيارة للبيع أو للتنازل"],
              ["part", Wrench, "عرض قطع غيار أو خدمات سيارات أو إكسسوارات سيارات للبيع"],
              [null, Truck, "عرض شاحنة أو معدات ثقيلة للبيع او الإيجار"],
              [null, Bike, "عرض دباب للبيع"],
              [null, Building2, "عرض عقار للبيع"],
              [null, Home, "عرض عقار للإيجار"],
              [null, Smartphone, "عرض جهاز للبيع"],
              [null, Sofa, "عرض أثاث للبيع"],
              [null, PawPrint, "عرض مواشي للبيع"],
              [null, Package, "عرض سلعه غير مصنفه أعلاه"],
              [null, HandHelping, "اضافة خدمة"],
              [null, ShoppingBag, "طلب سلعه"],
            ] as const).map(([v, I, t]) => (
              <button key={t} onClick={() => v && setWhat(v)} className="w-full flex items-center justify-between py-4 border-b border-white/[0.07] last:border-b-0 text-right group">
                <span className="flex items-center gap-3 text-text-primary text-[15px]"><I size={20} className="text-text-primary" />{t}</span>
                <ArrowLeft size={20} className="text-text-primary group-hover:-translate-x-1 transition" />
              </button>
            ))}
          </div>
        )}

        {what && !done && (
          <>
            <button onClick={reset} className="inline-flex items-center gap-2 text-text-primary text-[14px] font-semibold"><ArrowRight size={17} /> تغيير نوع العرض</button>
            <h1 className="text-[26px] font-bold mt-3">{what === "car" ? "بيانات السيارة" : "بيانات القطعة"}</h1>

            <div className="mt-6 grid grid-cols-12 gap-6 items-start">
              <div className="col-span-7 space-y-5">
                {what === "car" ? (
                  <>
                    <Box>
                      <div className="grid grid-cols-3 gap-4">
                        <div><label className={lbl}>الماركة</label>
                          <select className={input} value={brand} onChange={(e) => { setBrand(e.target.value); setModel(MODELS[e.target.value][0]); }}>{Object.keys(MODELS).map((b) => <option key={b}>{b}</option>)}</select></div>
                        <div><label className={lbl}>الطراز</label>
                          <select className={input} value={model} onChange={(e) => setModel(e.target.value)}>{MODELS[brand].map((m) => <option key={m}>{m}</option>)}</select></div>
                        <div><label className={lbl}>سنة الصنع</label>
                          <select className={input} value={year} onChange={(e) => { setYear(Number(e.target.value)); setConfirmKm(false); }}>{YEARS.map((y) => <option key={y}>{y}</option>)}</select></div>
                      </div>
                    </Box>

                    <Box>
                      <label className={lbl} htmlFor="km">الممشى</label>
                      <div className={`flex items-center h-12 rounded-lg bg-background border px-3 gap-2 ${kmIssue?.level === "error" ? "border-red-500" : kmIssue ? "border-amber-400" : "border-secondary-input-gray focus-within:border-secondary"} ${isNew ? "opacity-50" : ""}`}>
                        <input id="km" disabled={isNew} value={isNew ? "0" : kmRaw} dir="ltr" placeholder="مثال: 120,000"
                          onChange={(e) => { const d = e.target.value.replace(/\D/g, ""); setKmRaw(d ? fmt(Number(d)) : ""); setConfirmKm(false); }}
                          className="flex-1 min-w-0 bg-transparent outline-none text-[17px] font-semibold text-right" />
                        <span className="text-secondary/60 text-[14px]">كم</span>
                      </div>
                      <div className="text-[12.5px] text-secondary/60 mt-2">أدخل الرقم كاملاً بالكيلومتر كما في عداد السيارة.</div>
                      <label className="mt-3 flex items-center gap-2 text-[14px] cursor-pointer w-fit">
                        <input type="checkbox" checked={isNew} onChange={() => { setIsNew(!isNew); setConfirmKm(false); }} className="accent-[#46a6f0]" /> السيارة جديدة (صفر كيلو)
                      </label>

                      {kmIssue && (
                        <div className={`mt-4 rounded-lg px-4 py-3 text-[14px] ${kmIssue.level === "error" ? "bg-red-500/10 border border-red-500/40 text-red-200" : "bg-amber-500/10 border border-amber-500/40 text-amber-100"}`}>
                          <div className="flex items-start gap-2"><AlertTriangle size={17} className="mt-0.5 shrink-0" /> <span>{kmIssue.text}</span></div>
                          {kmIssue.fix !== undefined && (
                            <button onClick={() => setKmRaw(fmt(kmIssue!.fix!))} className="mt-3 mr-6 h-9 px-4 rounded-md bg-amber-400 text-background font-bold text-[13px]">
                              نعم، الممشى {fmt(kmIssue.fix)} كم
                            </button>
                          )}
                          {kmIssue.level === "warn" && (
                            <label className="mt-3 mr-6 flex items-center gap-2 cursor-pointer text-[13px]">
                              <input type="checkbox" checked={confirmKm} onChange={() => setConfirmKm(!confirmKm)} className="accent-[#f5b301]" /> الرقم الذي أدخلته صحيح
                            </label>
                          )}
                          <div className="mt-2 mr-6 text-[12px] opacity-80">الممشى يُستخدم في فلاتر البحث، والرقم الخاطئ يُظهر عرضك لمشترين لا يناسبهم.</div>
                        </div>
                      )}
                    </Box>

                    <Box>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className={lbl}>ناقل الحركة</label><Seg value={trans} onChange={setTrans} opts={["أوتوماتيك", "عادي"]} /></div>
                        <div><label className={lbl}>الوقود</label><Seg value={fuel} onChange={setFuel} opts={["بنزين", "ديزل", "هايبرد"]} /></div>
                        <div><label className={lbl}>المدينة</label><select className={input} value={city} onChange={(e) => setCity(e.target.value)}>{CITIES.map((c) => <option key={c}>{c}</option>)}</select></div>
                        <div>
                          <label className={lbl}>السعر</label>
                          <div className={`flex items-center h-11 rounded-lg bg-background border border-secondary-input-gray px-3 gap-2 ${auction ? "opacity-50" : ""}`}>
                            <input disabled={auction} value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))} dir="ltr" className="flex-1 min-w-0 bg-transparent outline-none text-right" placeholder="35000" />
                            <span className="text-secondary/60 text-[13px]">ريال</span>
                          </div>
                          <label className="mt-2 flex items-center gap-2 text-[13px] cursor-pointer w-fit"><input type="checkbox" checked={auction} onChange={() => setAuction(!auction)} className="accent-[#46a6f0]" /> على السوم</label>
                        </div>
                      </div>
                      <div className="mt-4"><label className={lbl}>الوصف</label>
                        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className="w-full rounded-lg bg-background border border-secondary-input-gray p-3 outline-none focus:border-secondary text-[14px]" placeholder="حالة السيارة، الصيانة، الملاحظات…" /></div>
                    </Box>
                  </>
                ) : (
                  <>
                    <div className="rounded-lg bg-primary/10 border border-primary/40 px-4 py-3 text-[14px] flex items-start gap-2">
                      <Info size={17} className="text-text-primary mt-0.5 shrink-0" />
                      <span>تُعرض قطع الغيار في قسم «قطع غيار وملحقات»، ويُقترح عرضك على من يبحث عن سيارة متوافقة، دون أن يختلط بنتائج السيارات.</span>
                    </div>
                    <Box>
                      <label className={lbl}>القطعة</label>
                      <input className={input} value={partName} onChange={(e) => setPartName(e.target.value)} placeholder="مثال: دعاسات قوالب 5D" />
                      <div className="mt-5 font-semibold text-[14px]">تناسب</div>
                      <div className="mt-3 grid grid-cols-4 gap-3">
                        <select className={input} value={brand} onChange={(e) => { setBrand(e.target.value); setFitModel(MODELS[e.target.value][0]); }}>{Object.keys(MODELS).map((b) => <option key={b}>{b}</option>)}</select>
                        <select className={input} value={fitModel} onChange={(e) => setFitModel(e.target.value)}>{MODELS[brand].map((m) => <option key={m}>{m}</option>)}</select>
                        <select className={input} value={fitFrom} onChange={(e) => setFitFrom(Number(e.target.value))}>{YEARS.map((y) => <option key={y} value={y}>من {y}</option>)}</select>
                        <select className={input} value={fitTo} onChange={(e) => setFitTo(Number(e.target.value))}>{YEARS.map((y) => <option key={y} value={y}>إلى {y}</option>)}</select>
                      </div>
                      <div className="mt-5 grid grid-cols-2 gap-4">
                        <div><label className={lbl}>المدينة</label><select className={input} value={city} onChange={(e) => setCity(e.target.value)}>{CITIES.map((c) => <option key={c}>{c}</option>)}</select></div>
                        <div><label className={lbl}>السعر</label><input className={input} dir="ltr" value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))} placeholder="250" /></div>
                      </div>
                    </Box>
                  </>
                )}
                <div className="flex justify-end">
                  <button disabled={what === "car" ? !carReady : !partName.trim()} onClick={() => setDone(true)} className="h-12 px-12 rounded-lg bg-primary font-bold text-[16px] disabled:opacity-40">نشر العرض</button>
                </div>
              </div>

              {/* live preview */}
              <aside className="col-span-5 sticky top-6">
                <div className="text-[13px] text-secondary/60 mb-2">هكذا سيظهر عرضك في نتائج البحث</div>
                {what === "car" ? (
                  <div className="rounded-lg bg-background p-1"><PostRow c={{ ...preview, img: PREVIEW_IMG[model] }} to="#" /></div>
                ) : (
                  <div className="rounded-xl bg-background-card border border-secondary-input-gray p-4">
                    <div className="text-[16px] font-bold text-text-title">{partName || "اسم القطعة"}</div>
                    <div className="mt-2 inline-flex h-7 px-2.5 rounded-md bg-background text-[12.5px] items-center">تناسب {brand} {fitModel} {fitFrom}–{fitTo}</div>
                    <div className="mt-3 text-[12.5px] text-secondary/60">قسم: قطع غيار وملحقات · {city}</div>
                  </div>
                )}
                {what === "car" && (
                  <div className="mt-4 rounded-lg bg-background-card border border-secondary-input-gray p-4 text-[13px] text-secondary/60">
                    <div className="flex items-center gap-2 text-secondary font-semibold mb-1"><Search size={15} /> يظهر عرضك عند البحث عن</div>
                    {brand} · موديل {year} · {km === null ? "— (أدخل الممشى)" : `ممشى حتى ${fmt(Math.ceil(Math.max(km, 1) / 50000) * 50000)} كم`}
                  </div>
                )}
              </aside>
            </div>
          </>
        )}

        {done && (
          <div className="max-w-2xl mx-auto rounded-xl bg-background-card border border-secondary-input-gray p-10 text-center">
            <CircleCheck size={60} className="mx-auto text-text-title" />
            <h2 className="text-[24px] font-bold mt-4">تم نشر عرضك</h2>
            <p className="text-secondary/60 mt-2">
              {what === "car"
                ? `«${title}» يظهر الآن في سيارات ${brand}، ولمن يبحث عن موديل ${year}${km !== null ? ` وممشى ${fmt(km)} كم` : ""}.`
                : `«${partName}» يظهر في قطع غيار وملحقات، ولمن يبحث عن ${brand} ${fitModel} ${fitFrom}–${fitTo}.`}
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link to="/haraj/filters" className="h-11 px-6 rounded-lg bg-primary font-bold flex items-center">العودة لسيارات تويوتا</Link>
              <button onClick={reset} className="h-11 px-6 rounded-lg border border-secondary-input-gray font-bold">إضافة عرض آخر</button>
            </div>
          </div>
        )}
      </div>
    </HarajLayout>
  );
}
