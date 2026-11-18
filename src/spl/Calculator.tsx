import { useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Package, FileText, ArrowLeft, Check, X, Ruler, Info, AlertTriangle, Truck, Clock, Boxes } from "lucide-react";
import { SplLayout, Segmented } from "./SplLayout";
import {
  CITIES, COUNTRIES, LIMITS, VOLUMETRIC_DIVISOR, arrival, fmtKg, quote, tagsFor,
  type Dest, type ShipType,
} from "./pricing";
import { useShipment } from "./shipment";

type Unit = "kg" | "g";

const label = "block text-[13px] font-semibold text-spl-deep mb-2";
const field =
  "h-11 w-full border border-spl-line bg-white px-3 text-[15px] outline-none focus:border-spl-teal focus:ring-2 focus:ring-spl-sky/30";

export default function Calculator() {
  const nav = useNavigate();
  const { setShipment } = useShipment();
  const resultsRef = useRef<HTMLDivElement>(null);

  const [type, setType] = useState<ShipType>("parcel");
  const [dest, setDest] = useState<Dest>("domestic");
  const [from, setFrom] = useState("الرياض");
  const [to, setTo] = useState("جدة");
  const [country, setCountry] = useState(COUNTRIES[0].name);
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<Unit>("kg");
  const [dims, setDims] = useState({ l: "", w: "", h: "" });
  const [shown, setShown] = useState(false);
  const [sort, setSort] = useState<"price" | "speed">("price");
  const [selected, setSelected] = useState<string | null>(null);

  const w = parseFloat(weight);
  const kg = isNaN(w) ? 0 : unit === "kg" ? w : w / 1000;
  const l = parseFloat(dims.l), wd = parseFloat(dims.w), h = parseFloat(dims.h);
  const hasDims = type === "parcel" && l > 0 && wd > 0 && h > 0;
  const volKg = hasDims ? Math.ceil(((l * wd * h) / VOLUMETRIC_DIVISOR) * 10) / 10 : 0;
  const chargeable = Math.max(kg, volKg);
  const byVolume = hasDims && volKg > kg;
  const limit = dest === "intl" ? LIMITS.parcel : LIMITS[type];

  // ---- error prevention ----
  let error: string | null = null;
  let hint: { text: string; action: string; apply: () => void } | null = null;
  if (w > 0) {
    if (unit === "g" && w <= 30)
      hint = { text: `أدخلت ${weight} جرام، أي ما يعادل ${fmtKg(kg)} كجم. هل تقصد ${weight} كجم؟`, action: `نعم، ${weight} كجم`, apply: () => setUnit("kg") };
    else if (unit === "kg" && w >= 100 && type === "parcel")
      hint = { text: `${weight} كجم وزن كبير جداً لطرد. هل تقصد ${weight} جرام؟`, action: `نعم، ${weight} جرام`, apply: () => setUnit("g") };
    if (dest === "domestic" && type === "docs" && kg > LIMITS.docs)
      error = "المستندات حتى 2 كجم فقط.";
    else if (chargeable > limit)
      error = byVolume ? `حجم الطرد يعادل ${fmtKg(volKg)} كجم، والحد الأقصى ${limit} كجم.` : `الحد الأقصى لوزن الطرد ${limit} كجم.`;
  }
  const valid = w > 0 && !error;

  const zone = COUNTRIES.find((c) => c.name === country)?.zone ?? 1;
  const services = useMemo(() => {
    if (!valid) return [];
    const list = quote(type, dest, chargeable, zone);
    return [...list].sort((a, b) => (sort === "price" ? a.price - b.price || a.days - b.days : a.days - b.days || a.price - b.price));
  }, [valid, type, dest, chargeable, zone, sort]);
  const tags = useMemo(() => tagsFor(services), [services]);
  const chosen = services.find((s) => s.id === selected) || null;

  const calc = () => {
    setShown(true);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const ship = () => {
    if (!chosen) return;
    setShipment({
      type, dest, from, to: dest === "intl" ? country : to,
      chargeableKg: chargeable, service: chosen,
    });
    nav("/spl/calculator/ship");
  };

  const route = dest === "intl" ? `${from} ← ${country}` : `${from} ← ${to}`;

  return (
    <SplLayout crumbs={[{ label: "حاسبة الأسعار البريدية" }]}>
      <section className="max-w-6xl mx-auto px-6 pt-6">
        <h1 className="text-[34px] font-bold text-spl-deep">حاسبة الأسعار البريدية</h1>
        <p className="text-slate-600 mt-2 text-[15px]">اعرف تكلفة شحنتك ومدة التوصيل، واختر الخدمة الأنسب ثم اشحنها مباشرة.</p>

        {/* ---------- form ---------- */}
        <div className="mt-8 bg-white shadow-card border border-spl-line">
          <div className="grid grid-cols-12 gap-x-8 gap-y-7 p-8">
            <div className="col-span-6">
              <span className={label}>ماذا ترسل؟</span>
              <Segmented
                value={type}
                onChange={(v) => { setType(v); }}
                options={[
                  { value: "parcel", label: <><Package size={18} /> طرد</> },
                  { value: "docs", label: <><FileText size={18} /> مستندات ورسائل</> },
                ]}
              />
            </div>
            <div className="col-span-6">
              <span className={label}>وجهة الشحنة</span>
              <Segmented
                value={dest}
                onChange={setDest}
                options={[
                  { value: "domestic", label: "السعودية (داخلي)" },
                  { value: "intl", label: "دولي" },
                ]}
              />
            </div>

            <div className="col-span-6">
              <label className={label}>من</label>
              <select className={field} value={from} onChange={(e) => setFrom(e.target.value)}>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-span-6">
              <label className={label}>إلى</label>
              {dest === "domestic" ? (
                <select className={field} value={to} onChange={(e) => setTo(e.target.value)}>
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              ) : (
                <select className={field} value={country} onChange={(e) => setCountry(e.target.value)}>
                  {COUNTRIES.map((c) => <option key={c.name}>{c.name}</option>)}
                </select>
              )}
            </div>

            {/* weight */}
            <div className="col-span-6">
              <label className={label} htmlFor="weight">وزن الشحنة</label>
              <div className={`flex border ${error ? "border-red-500" : "border-spl-line"} focus-within:border-spl-teal focus-within:ring-2 focus-within:ring-spl-sky/30`}>
                <input
                  id="weight"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  placeholder="مثال: 2"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="h-11 flex-1 px-3 text-[15px] outline-none bg-white"
                />
                <div className="flex items-center gap-1 px-1.5 bg-spl-bg border-r border-spl-line">
                  {(["kg", "g"] as Unit[]).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      className={`h-8 px-3 text-[13px] font-semibold ${unit === u ? "bg-spl-deep text-white" : "text-spl-deep"}`}
                    >
                      {u === "kg" ? "كجم" : "جرام"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="min-h-[22px] mt-2 text-[13px]">
                {hint ? (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 px-3 py-2 flex items-center gap-3">
                    <AlertTriangle size={15} className="shrink-0" />
                    <span>{hint.text}</span>
                    <button className="font-semibold underline whitespace-nowrap" onClick={hint.apply}>{hint.action}</button>
                  </div>
                ) : error ? (
                  <div className="text-red-600 flex items-center gap-2">
                    <AlertTriangle size={15} /> {error}
                    {dest === "domestic" && type === "docs" && kg > LIMITS.docs && (
                      <button className="underline font-semibold" onClick={() => setType("parcel")}>أرسلها كطرد</button>
                    )}
                  </div>
                ) : w > 0 ? (
                  <span className="text-slate-500">الوزن: {fmtKg(kg)} كجم</span>
                ) : (
                  <span className="text-slate-400">الحد الأقصى: {limit} كجم {type === "docs" && dest === "domestic" ? "للمستندات" : "للطرد"}</span>
                )}
              </div>
            </div>

            {/* dimensions */}
            {type === "parcel" && (
              <div className="col-span-6">
                <span className={label}>مقاسات الطرد <span className="font-normal text-slate-400">(سم، اختياري)</span></span>
                <div className="flex items-center gap-2">
                  {([["l", "الطول"], ["w", "العرض"], ["h", "الارتفاع"]] as const).map(([k, ph], i) => (
                    <div key={k} className="flex items-center gap-2 flex-1">
                      <input
                        type="number"
                        min={0}
                        placeholder={ph}
                        value={dims[k]}
                        onChange={(e) => setDims({ ...dims, [k]: e.target.value })}
                        className={field + " text-center"}
                      />
                      {i < 2 && <X size={14} className="text-slate-400 shrink-0" />}
                    </div>
                  ))}
                </div>
                <div className="text-[13px] text-slate-500 mt-2 flex items-center gap-1.5">
                  <Ruler size={14} /> الطرود الكبيرة الخفيفة تُحتسب حسب حجمها
                </div>
              </div>
            )}
          </div>

          {/* chargeable + action */}
          <div className="border-t border-spl-line bg-spl-bg px-8 py-5 flex items-center justify-between gap-6">
            <div className="text-[14px]">
              {w > 0 && !error ? (
                <div className="flex items-center gap-2">
                  <Info size={16} className="text-spl-teal" />
                  <span>الوزن المحتسب:</span>
                  <b className="text-spl-deep text-[16px]">{fmtKg(chargeable)} كجم</b>
                  <span className="text-slate-500">
                    {byVolume
                      ? `(حسب الحجم ${l}×${wd}×${h} سم، لأنه أكبر من الوزن الفعلي ${fmtKg(kg)} كجم)`
                      : type === "parcel" && !hasDims
                        ? "(حسب الوزن الفعلي. أضف المقاسات للحصول على سعر أدق)"
                        : "(حسب الوزن الفعلي)"}
                  </span>
                </div>
              ) : (
                <span className="text-slate-500">{error ? "عدّل الوزن لعرض الأسعار" : "أدخل الوزن لعرض الأسعار"}</span>
              )}
            </div>
            <button
              onClick={calc}
              disabled={!valid}
              className="h-12 px-10 bg-spl-sky text-white text-[16px] font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-95"
            >
              احسب السعر
            </button>
          </div>
        </div>
      </section>

      {/* ---------- results ---------- */}
      {shown && (
        <section ref={resultsRef} className="max-w-6xl mx-auto px-6 pt-10 scroll-mt-4">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="text-[22px] font-bold text-spl-deep">
                {type === "parcel" || dest === "intl" ? "الخدمات المتاحة لطردك" : "الخدمات المتاحة لمستنداتك"}
              </h2>
              {valid && (
                <div className="mt-2 inline-flex items-center gap-3 text-[13px] bg-spl-skysoft text-spl-deep px-3 py-1.5">
                  <span>{type === "parcel" ? "طرد" : "مستندات"}</span>·
                  <span>{fmtKg(chargeable)} كجم</span>·
                  <span>{route}</span>
                </div>
              )}
            </div>
            {valid && (
              <div className="flex items-center gap-3 text-[13px] text-slate-600">
                ترتيب حسب
                <Segmented size="sm" value={sort} onChange={setSort}
                  options={[{ value: "price", label: "الأقل سعراً" }, { value: "speed", label: "الأسرع" }]} />
              </div>
            )}
          </div>

          {!valid ? (
            <div className="border border-dashed border-spl-line p-8 text-center text-slate-500">عدّل بيانات الشحنة لعرض الأسعار</div>
          ) : (
            <div className={`grid gap-5 ${services.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
              {services.map((s) => {
                const on = selected === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelected(s.id)}
                    className={`relative flex flex-col justify-start text-right bg-white border-2 p-6 transition shadow-card ${on ? "border-spl-sky" : "border-transparent hover:border-spl-line"}`}
                  >
                    {tags[s.id] && (
                      <span className={`absolute -top-3 right-5 text-[12px] font-bold px-3 py-1 ${tags[s.id] === "الأسرع" ? "bg-spl-deep text-white" : "bg-emerald-600 text-white"}`}>
                        {tags[s.id]}
                      </span>
                    )}
                    <div className="flex items-start justify-between">
                      <div className="text-[18px] font-bold text-spl-deep">{s.name}</div>
                      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${on ? "bg-spl-sky border-spl-sky" : "border-slate-300"}`}>
                        {on && <Check size={14} className="text-white" />}
                      </span>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-[34px] font-bold text-spl-price leading-none">{s.price}</span>
                      <span className="text-spl-price font-semibold">ريال</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-[14px] text-spl-ink">
                      <Clock size={16} className="text-spl-teal" />
                      يصل خلال {s.days} أيام
                    </div>
                    <div className="text-[13px] text-slate-500 mt-1 mr-6">تقريباً {arrival(s.days)}</div>
                    <ul className="mt-5 pt-4 border-t border-spl-line space-y-2 text-[14px]">
                      {s.features.map((f) => (
                        <li key={f} className={`flex items-center gap-2 ${f.startsWith("بدون") ? "text-slate-400" : ""}`}>
                          {f.startsWith("بدون") ? <X size={15} /> : <Check size={15} className="text-emerald-600" />} {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          )}

          {/* bundles tip */}
          {valid && dest === "domestic" && type === "parcel" && (
            <Link to="/spl/business/ship" className="mt-6 flex items-center justify-between bg-spl-skysoft border border-spl-sky/40 px-6 py-4 group">
              <div className="flex items-center gap-4">
                <Boxes className="text-spl-teal" size={28} />
                <div>
                  <div className="font-bold text-spl-deep">تشحن أكثر من 20 طرداً؟</div>
                  <div className="text-[14px] text-slate-600">باقات المنشآت تبدأ من 20 ريال للطرد الواحد.</div>
                </div>
              </div>
              <span className="flex items-center gap-2 text-spl-teal font-semibold">
                اعرف الباقات <ArrowLeft size={18} className="group-hover:-translate-x-1 transition" />
              </span>
            </Link>
          )}
          <div className="h-28" />
        </section>
      )}

      {/* sticky ship bar */}
      {shown && chosen && valid && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-spl-line shadow-[0_-6px_20px_rgba(22,50,58,0.10)] z-20">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Truck className="text-spl-teal" size={28} />
              <div>
                <div className="font-bold text-spl-deep">{chosen.name} · {chosen.price} ريال</div>
                <div className="text-[13px] text-slate-500">{route} · يصل تقريباً {arrival(chosen.days)}</div>
              </div>
            </div>
            <button onClick={ship} className="h-12 px-10 bg-spl-sky text-white font-bold text-[16px] flex items-center gap-2 hover:brightness-95">
              اشحن الآن <ArrowLeft size={18} />
            </button>
          </div>
        </div>
      )}
    </SplLayout>
  );
}
