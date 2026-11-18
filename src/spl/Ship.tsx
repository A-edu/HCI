import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Check, ArrowLeft, ArrowRight, Store, Truck, MapPin, Package, FileText, CreditCard, Smartphone, CircleCheck, Copy } from "lucide-react";
import { SplLayout } from "./SplLayout";
import { arrival, fmtKg } from "./pricing";
import { useShipment } from "./shipment";

const PICKUP_FEE = 15;
const field =
  "h-11 w-full border bg-white px-3 text-[15px] outline-none focus:border-spl-teal focus:ring-2 focus:ring-spl-sky/30";

type Party = { name: string; phone: string; addr: string };
const empty: Party = { name: "", phone: "", addr: "" };

function validate(p: Party) {
  const e: Partial<Record<keyof Party, string>> = {};
  if (p.name.trim().length < 3) e.name = "أدخل الاسم الكامل";
  if (!/^5\d{8}$/.test(p.phone.replace(/\s/g, ""))) e.phone = "رقم الجوال يبدأ بـ 5 ويتكون من 9 أرقام";
  if (!/^[A-Za-z]{4}\d{4}$/.test(p.addr.replace(/\s/g, ""))) e.addr = "العنوان المختصر: 4 أحرف و4 أرقام، مثل RRRD2929";
  return e;
}

function PartyCard({ title, city, value, onChange, errors }: {
  title: string; city: string; value: Party; onChange: (p: Party) => void; errors: Partial<Record<keyof Party, string>>;
}) {
  const lbl = "block text-[13px] font-semibold text-spl-deep mb-2";
  return (
    <div className="bg-white border border-spl-line shadow-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[17px] font-bold text-spl-deep">{title}</h3>
        <span className="text-[13px] text-slate-500 flex items-center gap-1"><MapPin size={14} /> {city}</span>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2">
          <label className={lbl}>الاسم</label>
          <input className={`${field} ${errors.name ? "border-red-500" : "border-spl-line"}`} value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })} placeholder="الاسم الكامل" />
          {errors.name && <p className="text-red-600 text-[12px] mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className={lbl}>رقم الجوال</label>
          <div className={`flex border ${errors.phone ? "border-red-500" : "border-spl-line"}`}>
            <input className="h-11 flex-1 min-w-0 px-3 outline-none text-[15px]" dir="ltr" value={value.phone}
              onChange={(e) => onChange({ ...value, phone: e.target.value })} placeholder="5XXXXXXXX" />
            <span className="px-3 flex items-center bg-spl-bg text-slate-500 text-[14px] border-r border-spl-line" dir="ltr">+966</span>
          </div>
          {errors.phone && <p className="text-red-600 text-[12px] mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className={lbl}>العنوان الوطني المختصر</label>
          <input className={`${field} uppercase ${errors.addr ? "border-red-500" : "border-spl-line"}`} dir="ltr" value={value.addr}
            onChange={(e) => onChange({ ...value, addr: e.target.value })} placeholder="RRRD2929" />
          {errors.addr
            ? <p className="text-red-600 text-[12px] mt-1">{errors.addr}</p>
            : <p className="text-slate-500 text-[12px] mt-1">تجده في تطبيق سبل أو في خدمة العنوان الوطني</p>}
        </div>
      </div>
    </div>
  );
}

const steps = ["المرسل والمستلم", "التسليم والدفع", "تم إنشاء الشحنة"];

export default function Ship() {
  const { shipment } = useShipment();
  const [step, setStep] = useState(0);
  const [sender, setSender] = useState<Party>(empty);
  const [receiver, setReceiver] = useState<Party>(empty);
  const [tried, setTried] = useState(false);
  const [handover, setHandover] = useState<"branch" | "pickup">("branch");
  const [pay, setPay] = useState<"mada" | "apple" | "card">("mada");
  const [tracking] = useState(() => `RR${Math.floor(100000000 + Math.random() * 899999999)}SA`);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (!shipment) {
    return (
      <SplLayout crumbs={[{ label: "حاسبة الأسعار البريدية", to: "/spl/calculator" }, { label: "إنشاء شحنة" }]}>
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <p className="text-slate-600 mb-6">لا توجد شحنة محددة.</p>
          <Link to="/spl/calculator" className="inline-flex h-11 px-8 items-center bg-spl-sky text-white font-bold">العودة إلى الحاسبة</Link>
        </div>
      </SplLayout>
    );
  }

  const s = shipment.service;
  const total = s.price + (handover === "pickup" ? PICKUP_FEE : 0);
  const sErr = tried ? validate(sender) : {};
  const rErr = tried ? validate(receiver) : {};
  const next1 = () => {
    setTried(true);
    if (Object.keys(validate(sender)).length || Object.keys(validate(receiver)).length) return;
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <SplLayout crumbs={[{ label: "حاسبة الأسعار البريدية", to: "/spl/calculator" }, { label: "إنشاء شحنة" }]}>
      <section className="max-w-6xl mx-auto px-6 pt-6">
        <h1 className="text-[30px] font-bold text-spl-deep">إنشاء شحنة</h1>

        {/* stepper */}
        <ol className="mt-6 flex items-center gap-3">
          {steps.map((t, i) => (
            <li key={t} className="flex items-center gap-3">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-bold ${i < step ? "bg-emerald-600 text-white" : i === step ? "bg-spl-deep text-white" : "bg-spl-bg text-slate-400 border border-spl-line"}`}>
                {i < step ? <Check size={16} /> : i + 1}
              </span>
              <span className={`text-[15px] ${i === step ? "font-bold text-spl-deep" : "text-slate-500"}`}>{t}</span>
              {i < steps.length - 1 && <span className="w-16 h-px bg-spl-line mx-2" />}
            </li>
          ))}
        </ol>

        <div className="mt-8 grid grid-cols-12 gap-8 items-start">
          <div className="col-span-8 space-y-6">
            {step === 0 && (
              <>
                <PartyCard title="بيانات المرسل" city={shipment.from} value={sender} onChange={setSender} errors={sErr} />
                <PartyCard title="بيانات المستلم" city={shipment.to} value={receiver} onChange={setReceiver} errors={rErr} />
                <div className="flex justify-between">
                  <Link to="/spl/calculator" className="h-12 px-6 flex items-center gap-2 text-spl-deep font-semibold"><ArrowRight size={18} /> رجوع للحاسبة</Link>
                  <button onClick={next1} className="h-12 px-10 bg-spl-sky text-white font-bold flex items-center gap-2">متابعة <ArrowLeft size={18} /></button>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="bg-white border border-spl-line shadow-card p-6">
                  <h3 className="text-[17px] font-bold text-spl-deep mb-4">كيف تسلّم الشحنة؟</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {([
                      { v: "branch", icon: <Store size={22} />, t: "أسلّمها في أقرب فرع", d: "فرع العليا · 1.2 كم · مفتوح حتى 10 م", fee: "مجاناً" },
                      { v: "pickup", icon: <Truck size={22} />, t: "استلام من الباب", d: `يمر المندوب على عنوان المرسل (${sender.addr.toUpperCase()})`, fee: `+${PICKUP_FEE} ريال` },
                    ] as const).map((o) => (
                      <button key={o.v} onClick={() => setHandover(o.v)}
                        className={`text-right border-2 p-5 ${handover === o.v ? "border-spl-sky bg-spl-skysoft/50" : "border-spl-line"}`}>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 font-bold text-spl-deep">{o.icon} {o.t}</span>
                          <span className="text-[13px] font-semibold text-spl-price">{o.fee}</span>
                        </div>
                        <div className="text-[13px] text-slate-500 mt-2">{o.d}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-spl-line shadow-card p-6">
                  <h3 className="text-[17px] font-bold text-spl-deep mb-4">طريقة الدفع</h3>
                  <div className="space-y-3">
                    {([
                      { v: "mada", icon: <CreditCard size={20} />, t: "مدى" },
                      { v: "apple", icon: <Smartphone size={20} />, t: "Apple Pay" },
                      { v: "card", icon: <CreditCard size={20} />, t: "بطاقة ائتمانية (فيزا / ماستركارد)" },
                    ] as const).map((o) => (
                      <label key={o.v} className={`flex items-center gap-3 border p-4 cursor-pointer ${pay === o.v ? "border-spl-sky" : "border-spl-line"}`}>
                        <input type="radio" name="pay" checked={pay === o.v} onChange={() => setPay(o.v)} className="accent-[#2e6475] w-4 h-4" />
                        <span className="text-spl-teal">{o.icon}</span>
                        <span className="font-semibold">{o.t}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={() => setStep(0)} className="h-12 px-6 flex items-center gap-2 text-spl-deep font-semibold"><ArrowRight size={18} /> رجوع</button>
                  <button onClick={() => { setStep(2); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="h-12 px-10 bg-spl-sky text-white font-bold">ادفع {total} ريال</button>
                </div>
              </>
            )}

            {step === 2 && (
              <div className="bg-white border border-spl-line shadow-card p-10 text-center">
                <CircleCheck size={64} className="mx-auto text-emerald-600" />
                <h2 className="text-[26px] font-bold text-spl-deep mt-4">تم إنشاء شحنتك</h2>
                <p className="text-slate-600 mt-2">أرسلنا التفاصيل برسالة نصية إلى <span dir="ltr">+966 {sender.phone}</span></p>
                <div className="mt-6 inline-flex items-center gap-3 bg-spl-bg border border-spl-line px-5 py-3">
                  <span className="text-[13px] text-slate-500">رقم التتبع</span>
                  <b className="text-[20px] tracking-wider text-spl-deep" dir="ltr">{tracking}</b>
                  <Copy size={16} className="text-slate-400" />
                </div>
                <div className="mt-8 text-right max-w-lg mx-auto bg-spl-skysoft/60 p-5">
                  <div className="font-bold text-spl-deep mb-2">الخطوة التالية</div>
                  {handover === "branch"
                    ? <p className="text-[14px] text-slate-700">سلّم الطرد في <b>فرع العليا</b> خلال 3 أيام، وأظهر رقم التتبع أو الباركود للموظف.</p>
                    : <p className="text-[14px] text-slate-700">سيمر المندوب لاستلام الطرد خلال يوم عمل، وسنرسل لك موعد الزيارة.</p>}
                  <p className="text-[14px] text-slate-700 mt-2">الوصول المتوقع: <b>{arrival(s.days + (handover === "pickup" ? 1 : 0))}</b></p>
                </div>
                <div className="mt-8 flex justify-center gap-3">
                  <button className="h-12 px-8 border border-spl-deep text-spl-deep font-bold">تتبع الشحنة</button>
                  <Link to="/spl/calculator" className="h-12 px-8 flex items-center bg-spl-sky text-white font-bold">احسب شحنة جديدة</Link>
                </div>
              </div>
            )}
          </div>

          {/* summary */}
          <aside className="col-span-4 bg-white border border-spl-line shadow-card p-6 sticky top-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[17px] font-bold text-spl-deep">ملخص الشحنة</h3>
              {step < 2 && <Link to="/spl/calculator" className="text-[13px] text-spl-teal font-semibold">تعديل</Link>}
            </div>
            <div className="mt-5 space-y-3 text-[14px]">
              <Row k="الخدمة" v={s.name} />
              <Row k="النوع" v={<span className="flex items-center gap-1">{shipment.type === "parcel" ? <Package size={14} /> : <FileText size={14} />}{shipment.type === "parcel" ? "طرد" : "مستندات"}</span>} />
              <Row k="المسار" v={`${shipment.from} ← ${shipment.to}`} />
              <Row k="الوزن المحتسب" v={`${fmtKg(shipment.chargeableKg)} كجم`} />
              <Row k="الوصول المتوقع" v={arrival(s.days + (handover === "pickup" && step > 0 ? 1 : 0))} />
            </div>
            <div className="mt-5 pt-4 border-t border-spl-line space-y-2 text-[14px]">
              <Row k="سعر الخدمة" v={`${s.price} ريال`} />
              {handover === "pickup" && step > 0 && <Row k="استلام من الباب" v={`${PICKUP_FEE} ريال`} />}
              <div className="flex justify-between items-baseline pt-2">
                <span className="font-bold text-spl-deep">الإجمالي</span>
                <span className="text-[24px] font-bold text-spl-price">{step > 0 ? total : s.price} ريال</span>
              </div>
              <div className="text-[12px] text-slate-500 text-left">شامل ضريبة القيمة المضافة</div>
            </div>
          </aside>
        </div>
      </section>
    </SplLayout>
  );
}

function Row({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">{k}</span>
      <span className="font-semibold text-spl-ink text-left">{v}</span>
    </div>
  );
}
