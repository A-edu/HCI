import { useEffect, useState, type ReactNode, type ChangeEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, ArrowLeft, ArrowRight, Building2, Briefcase, Home, CircleCheck, Link2, CreditCard, Smartphone, Store, Truck } from "lucide-react";
import { SplLayout } from "../SplLayout";
import { CITIES } from "../pricing";
import { BUNDLES, ECOM, PLATFORMS, type Platform } from "./plans";

type BizType = "company" | "freelance" | "family";

const types: { v: BizType; icon: typeof Building2; t: string; need: string; idLabel: string; idPh: string; idRule: RegExp; idErr: string }[] = [
  { v: "company", icon: Building2, t: "شركة أو مؤسسة", need: "الرقم الموحد (700) أو السجل التجاري", idLabel: "الرقم الموحد للمنشأة", idPh: "7001234567", idRule: /^7\d{9}$/, idErr: "الرقم الموحد 10 أرقام ويبدأ بـ 7" },
  { v: "freelance", icon: Briefcase, t: "عمل حر", need: "رقم وثيقة العمل الحر", idLabel: "رقم وثيقة العمل الحر", idPh: "FL-123456789", idRule: /^FL-?\d{6,9}$/i, idErr: "مثال: FL-123456789" },
  { v: "family", icon: Home, t: "أسرة منتجة أو فرد", need: "رقم الهوية الوطنية فقط", idLabel: "رقم الهوية الوطنية", idPh: "1XXXXXXXXX", idRule: /^[12]\d{9}$/, idErr: "رقم الهوية 10 أرقام ويبدأ بـ 1 أو 2" },
];

const field = "h-11 w-full border bg-white px-3 text-[15px] outline-none focus:border-spl-teal focus:ring-2 focus:ring-spl-sky/30";
const lbl = "block text-[13px] font-semibold text-spl-deep mb-2";

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label className={lbl}>{label}</label>
      {children}
      {error ? <p className="text-red-600 text-[12px] mt-1">{error}</p> : hint ? <p className="text-slate-500 text-[12px] mt-1">{hint}</p> : null}
    </div>
  );
}

export default function Signup() {
  const [qs] = useSearchParams();
  const plan = qs.get("plan") === "sme" ? "sme" : "ecom";
  const [step, setStep] = useState(0);
  const [biz, setBiz] = useState<BizType | null>(null);
  const [f, setF] = useState({ id: "", store: "", contact: "", phone: "", email: "", city: "الرياض", addr: "" });
  const [tried, setTried] = useState(false);
  const [platform, setPlatform] = useState<Platform>((qs.get("platform") as Platform) || "salla");
  const [connected, setConnected] = useState(false);
  const [cod, setCod] = useState(qs.get("cod") !== "false");
  const [handover, setHandover] = useState<"pickup" | "branch">("pickup");
  const [bundle, setBundle] = useState(qs.get("bundle") || "lead");
  const [pay, setPay] = useState<"mada" | "apple" | "card">("mada");

  useEffect(() => { window.scrollTo(0, 0); }, [step]);

  const t = types.find((x) => x.v === biz);
  const errs: Partial<Record<keyof typeof f, string>> = {};
  if (t && !t.idRule.test(f.id.trim())) errs.id = t.idErr;
  if (f.store.trim().length < 2) errs.store = "أدخل اسم المتجر أو النشاط";
  if (f.contact.trim().length < 3) errs.contact = "أدخل اسم المسؤول";
  if (!/^5\d{8}$/.test(f.phone.trim())) errs.phone = "رقم الجوال يبدأ بـ 5 ويتكون من 9 أرقام";
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) errs.email = "أدخل بريداً إلكترونياً صحيحاً";
  if (!/^[A-Za-z]{4}\d{4}$/.test(f.addr.trim())) errs.addr = "4 أحرف و4 أرقام، مثل RRRD2929";
  const e = tried ? errs : {};

  const steps = ["نوع نشاطك", "بيانات المنشأة", plan === "ecom" ? "ربط المتجر" : "الباقة والدفع", "جاهز"];
  const b = BUNDLES.find((x) => x.id === bundle) ?? BUNDLES[2];
  const pName = PLATFORMS.find((p) => p.value === platform)!.label;

  const set = (k: keyof typeof f) => (ev: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: ev.target.value });

  return (
    <SplLayout
      section="business"
      title="تسجيل منشأة"
      crumbs={[{ label: "الأعمال", to: "/spl/business" }, { label: "أرسل شحنات منشأتك", to: "/spl/business/ship" }, { label: "تسجيل منشأة" }]}
    >
      <section className="max-w-4xl mx-auto px-6 pt-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[30px] font-bold text-spl-deep">تسجيل منشأتك في سبل</h1>
            <p className="text-slate-600 mt-1">
              الخطة: <b className="text-spl-deep">{plan === "ecom" ? "خدمة التجارة الإلكترونية" : b.name}</b>
              {" · "}<Link to="/spl/business/ship" className="text-spl-teal text-[14px]">تغيير</Link>
            </p>
          </div>
        </div>

        <ol className="mt-6 flex items-center gap-2">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-bold ${i < step ? "bg-emerald-600 text-white" : i === step ? "bg-spl-deep text-white" : "bg-spl-bg text-slate-400 border border-spl-line"}`}>
                {i < step ? <Check size={16} /> : i + 1}
              </span>
              <span className={`text-[14px] ${i === step ? "font-bold text-spl-deep" : "text-slate-500"}`}>{s}</span>
              {i < steps.length - 1 && <span className="w-10 h-px bg-spl-line mx-1" />}
            </li>
          ))}
        </ol>

        <div className="mt-8 bg-white border border-spl-line shadow-card p-8">
          {/* step 1: business type */}
          {step === 0 && (
            <>
              <h2 className="text-[20px] font-bold text-spl-deep">ما نوع نشاطك؟</h2>
              <p className="text-[14px] text-slate-500 mt-1">نطلب فقط المستند الذي يناسب نشاطك. لا تحتاج سجلاً تجارياً للبدء.</p>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {types.map((x) => {
                  const Icon = x.icon;
                  const on = biz === x.v;
                  return (
                    <button key={x.v} onClick={() => setBiz(x.v)} className={`text-right border-2 p-5 flex flex-col justify-start ${on ? "border-spl-sky bg-spl-skysoft/50" : "border-spl-line hover:border-spl-teal"}`}>
                      <div className="flex items-center justify-between">
                        <Icon size={26} className="text-spl-teal" />
                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${on ? "bg-spl-sky border-spl-sky" : "border-slate-300"}`}>{on && <Check size={12} className="text-white" />}</span>
                      </div>
                      <div className="font-bold text-spl-deep mt-4 text-[16px]">{x.t}</div>
                      <div className="text-[13px] text-slate-500 mt-2">المطلوب: {x.need}</div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-8 flex justify-between">
                <Link to="/spl/business/ship" className="h-12 px-4 flex items-center gap-2 text-spl-deep font-semibold"><ArrowRight size={18} /> رجوع</Link>
                <button disabled={!biz} onClick={() => setStep(1)} className="h-12 px-10 bg-spl-sky text-white font-bold flex items-center gap-2 disabled:opacity-40">متابعة <ArrowLeft size={18} /></button>
              </div>
            </>
          )}

          {/* step 2: details */}
          {step === 1 && t && (
            <>
              <h2 className="text-[20px] font-bold text-spl-deep">بيانات المنشأة</h2>
              <div className="mt-6 grid grid-cols-2 gap-5">
                <Field label={t.idLabel} error={e.id}>
                  <input className={`${field} ${e.id ? "border-red-500" : "border-spl-line"}`} dir="ltr" placeholder={t.idPh} value={f.id} onChange={set("id")} />
                </Field>
                <Field label="اسم المتجر أو النشاط" error={e.store}>
                  <input className={`${field} ${e.store ? "border-red-500" : "border-spl-line"}`} placeholder="مثال: عود الريم" value={f.store} onChange={set("store")} />
                </Field>
                <Field label="اسم المسؤول" error={e.contact}>
                  <input className={`${field} ${e.contact ? "border-red-500" : "border-spl-line"}`} placeholder="الاسم الكامل" value={f.contact} onChange={set("contact")} />
                </Field>
                <Field label="رقم الجوال" error={e.phone}>
                  <div className={`flex border ${e.phone ? "border-red-500" : "border-spl-line"}`}>
                    <input className="h-11 flex-1 min-w-0 px-3 outline-none text-[15px]" dir="ltr" placeholder="5XXXXXXXX" value={f.phone} onChange={set("phone")} />
                    <span className="px-3 flex items-center bg-spl-bg text-slate-500 text-[14px] border-r border-spl-line" dir="ltr">+966</span>
                  </div>
                </Field>
                <Field label="البريد الإلكتروني" error={e.email}>
                  <input className={`${field} ${e.email ? "border-red-500" : "border-spl-line"}`} dir="ltr" placeholder="name@example.com" value={f.email} onChange={set("email")} />
                </Field>
                <Field label="مدينة استلام الشحنات">
                  <select className={`${field} border-spl-line`} value={f.city} onChange={set("city")}>{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
                </Field>
                <Field label="العنوان الوطني المختصر لموقعك" error={e.addr} hint="من هنا يستلم المندوب شحناتك">
                  <input className={`${field} uppercase ${e.addr ? "border-red-500" : "border-spl-line"}`} dir="ltr" placeholder="RRRD2929" value={f.addr} onChange={set("addr")} />
                </Field>
              </div>
              <div className="mt-8 flex justify-between">
                <button onClick={() => setStep(0)} className="h-12 px-4 flex items-center gap-2 text-spl-deep font-semibold"><ArrowRight size={18} /> رجوع</button>
                <button onClick={() => { setTried(true); if (!Object.keys(errs).length) setStep(2); }} className="h-12 px-10 bg-spl-sky text-white font-bold flex items-center gap-2">متابعة <ArrowLeft size={18} /></button>
              </div>
            </>
          )}

          {/* step 3a: connect store */}
          {step === 2 && plan === "ecom" && (
            <>
              <h2 className="text-[20px] font-bold text-spl-deep">اربط متجرك</h2>
              <p className="text-[14px] text-slate-500 mt-1">بعد الربط تُنشأ شحنة تلقائياً لكل طلب جديد في متجرك.</p>
              <div className="mt-6 flex gap-3">
                {PLATFORMS.map((p) => (
                  <button key={p.value} onClick={() => { setPlatform(p.value); setConnected(false); }}
                    className={`h-11 px-5 border text-[15px] font-semibold ${platform === p.value ? "bg-spl-deep border-spl-deep text-white" : "border-spl-line text-spl-deep"}`}>{p.label}</button>
                ))}
              </div>
              <div className="mt-5 border border-spl-line p-5 flex items-center justify-between">
                {platform === "social" ? (
                  <div className="text-[14px] text-slate-600">بدون متجر؟ ستُنشئ الشحنات من حسابك في سبل أو برفع ملف Excel بالطلبات.</div>
                ) : connected ? (
                  <div className="flex items-center gap-3 text-emerald-700 font-semibold"><CircleCheck size={22} /> تم ربط متجر «{f.store}» على {pName}</div>
                ) : (
                  <>
                    <div className="flex items-center gap-3"><Link2 className="text-spl-teal" /><span className="font-semibold">اربط متجرك على {pName}</span></div>
                    <button onClick={() => setConnected(true)} className="h-10 px-6 bg-spl-deep text-white font-semibold">ربط المتجر</button>
                  </>
                )}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <label className={`border-2 p-5 cursor-pointer ${cod ? "border-spl-sky bg-spl-skysoft/50" : "border-spl-line"}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-spl-deep">الدفع عند الاستلام</span>
                    <input type="checkbox" checked={cod} onChange={() => setCod(!cod)} className="w-5 h-5 accent-[#2e6475]" />
                  </div>
                  <div className="text-[13px] text-slate-500 mt-2">رسوم {ECOM.codFee}% من المبلغ المحصّل، وتحويل أسبوعي لحسابك</div>
                </label>
                <div className="border border-spl-line p-5">
                  <div className="font-bold text-spl-deep mb-3">كيف نستلم الشحنات؟</div>
                  <div className="flex gap-2">
                    {([["pickup", "من موقعي", Truck], ["branch", "أسلّمها في الفرع", Store]] as const).map(([v, l, I]) => (
                      <button key={v} onClick={() => setHandover(v)} className={`flex-1 h-10 border text-[14px] font-semibold flex items-center justify-center gap-2 ${handover === v ? "bg-spl-deep border-spl-deep text-white" : "border-spl-line text-spl-deep"}`}><I size={16} /> {l}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-spl-bg p-4 text-[14px] flex justify-between">
                <span>سعر الطرد: <b>{ECOM.per} ريال</b> · تدفع شهرياً حسب عدد الشحنات</span>
                <span className="text-slate-500">لا رسوم تسجيل</span>
              </div>

              <div className="mt-8 flex justify-between">
                <button onClick={() => setStep(1)} className="h-12 px-4 flex items-center gap-2 text-spl-deep font-semibold"><ArrowRight size={18} /> رجوع</button>
                <button disabled={platform !== "social" && !connected} onClick={() => setStep(3)} className="h-12 px-10 bg-spl-sky text-white font-bold disabled:opacity-40">إنشاء الحساب</button>
              </div>
            </>
          )}

          {/* step 3b: bundle + pay */}
          {step === 2 && plan === "sme" && (
            <>
              <h2 className="text-[20px] font-bold text-spl-deep">اختر الباقة</h2>
              <div className="mt-6 grid grid-cols-4 gap-3">
                {BUNDLES.map((x) => (
                  <button key={x.id} onClick={() => setBundle(x.id)} className={`text-right border-2 p-4 flex flex-col justify-start ${bundle === x.id ? "border-spl-sky bg-spl-skysoft/50" : "border-spl-line"}`}>
                    <div className="font-bold text-spl-deep">{x.name}</div>
                    <div className="text-[13px] text-slate-500 mt-1">{x.shipments} شحنة</div>
                    <div className="text-[22px] font-bold text-spl-price mt-3">{x.total.toLocaleString("en-US")} <span className="text-[13px]">ريال</span></div>
                    <div className="text-[12px] text-slate-500">{x.per} ريال للطرد</div>
                  </button>
                ))}
              </div>
              <h3 className="font-bold text-spl-deep mt-8 mb-3">طريقة الدفع</h3>
              <div className="grid grid-cols-3 gap-3">
                {([["mada", "مدى", CreditCard], ["apple", "Apple Pay", Smartphone], ["card", "بطاقة ائتمانية", CreditCard]] as const).map(([v, l, I]) => (
                  <label key={v} className={`flex items-center gap-3 border p-4 cursor-pointer ${pay === v ? "border-spl-sky" : "border-spl-line"}`}>
                    <input type="radio" checked={pay === v} onChange={() => setPay(v)} className="accent-[#2e6475]" />
                    <I size={18} className="text-spl-teal" /><span className="font-semibold">{l}</span>
                  </label>
                ))}
              </div>
              <div className="mt-8 flex justify-between">
                <button onClick={() => setStep(1)} className="h-12 px-4 flex items-center gap-2 text-spl-deep font-semibold"><ArrowRight size={18} /> رجوع</button>
                <button onClick={() => setStep(3)} className="h-12 px-10 bg-spl-sky text-white font-bold">ادفع {b.total.toLocaleString("en-US")} ريال</button>
              </div>
            </>
          )}

          {/* done */}
          {step === 3 && (
            <div className="text-center py-4">
              <CircleCheck size={64} className="mx-auto text-emerald-600" />
              <h2 className="text-[26px] font-bold text-spl-deep mt-4">حساب «{f.store}» جاهز</h2>
              <p className="text-slate-600 mt-2">
                {plan === "ecom"
                  ? `تم تفعيل خدمة التجارة الإلكترونية${platform !== "social" ? ` وربط متجرك على ${pName}` : ""}${cod ? " مع الدفع عند الاستلام" : ""}.`
                  : `تمت إضافة ${b.name} (${b.shipments} شحنة) إلى رصيدك، صالحة حتى نوفمبر 2027.`}
              </p>
              <div className="mt-8 max-w-lg mx-auto text-right bg-spl-skysoft/60 p-5 space-y-2 text-[14px]">
                <div className="font-bold text-spl-deep mb-1">الخطوات التالية</div>
                {plan === "ecom" ? (
                  <>
                    <div className="flex gap-2"><Check size={16} className="text-emerald-600 mt-0.5" /> الطلبات الجديدة في متجرك تتحول إلى شحنات تلقائياً</div>
                    <div className="flex gap-2"><Check size={16} className="text-emerald-600 mt-0.5" /> {handover === "pickup" ? `يمر المندوب يومياً على موقعك (${f.addr.toUpperCase()})` : "سلّم الشحنات في أقرب فرع"}</div>
                    {cod && <div className="flex gap-2"><Check size={16} className="text-emerald-600 mt-0.5" /> تصلك المبالغ المحصّلة كل أسبوع</div>}
                  </>
                ) : (
                  <>
                    <div className="flex gap-2"><Check size={16} className="text-emerald-600 mt-0.5" /> أنشئ شحنة من حسابك واطبع البوليصة أو اعرض الباركود</div>
                    <div className="flex gap-2"><Check size={16} className="text-emerald-600 mt-0.5" /> سلّم الطرد في أي فرع من فروع سبل</div>
                  </>
                )}
              </div>
              <div className="mt-8 flex justify-center gap-3">
                <button className="h-12 px-8 bg-spl-sky text-white font-bold">أنشئ أول شحنة</button>
                <Link to="/spl/business" className="h-12 px-8 flex items-center border border-spl-deep text-spl-deep font-bold">صفحة الأعمال</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </SplLayout>
  );
}
