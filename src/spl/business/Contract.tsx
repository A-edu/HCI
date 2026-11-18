import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, CircleCheck, Check } from "lucide-react";
import { SplLayout } from "../SplLayout";
import { VOLUMES } from "./plans";

const field = "h-11 w-full border border-spl-line bg-white px-3 text-[15px] outline-none focus:border-spl-teal focus:ring-2 focus:ring-spl-sky/30";
const lbl = "block text-[13px] font-semibold text-spl-deep mb-2";

export default function Contract() {
  const [qs] = useSearchParams();
  const [sent, setSent] = useState(false);
  const [f, setF] = useState({ company: "", cr: "", monthly: "700", contact: "", phone: "", email: "", cod: qs.get("cod") !== "false", intl: false });
  const [tried, setTried] = useState(false);
  const ok = f.company.trim().length > 1 && /^7\d{9}$/.test(f.cr.trim()) && f.contact.trim().length > 2 && /^5\d{8}$/.test(f.phone.trim()) && /\S+@\S+\.\S+/.test(f.email);
  const vol = VOLUMES.find((v) => v.value === qs.get("volume"))?.label;

  return (
    <SplLayout section="business" title="طلب عرض سعر"
      crumbs={[{ label: "الأعمال", to: "/spl/business" }, { label: "أرسل شحنات منشأتك", to: "/spl/business/ship" }, { label: "طلب عرض سعر" }]}>
      <section className="max-w-3xl mx-auto px-6 pt-6">
        <h1 className="text-[30px] font-bold text-spl-deep">طلب عرض سعر لعقد شحن مباشر</h1>
        <p className="text-slate-600 mt-1">للمنشآت التي ترسل أكثر من 500 شحنة شهرياً. يتواصل معك مدير حساب خلال يومي عمل.</p>

        <div className="mt-8 bg-white border border-spl-line shadow-card p-8">
          {sent ? (
            <div className="text-center py-4">
              <CircleCheck size={60} className="mx-auto text-emerald-600" />
              <h2 className="text-[24px] font-bold text-spl-deep mt-4">استلمنا طلبك</h2>
              <p className="text-slate-600 mt-2">رقم الطلب <b dir="ltr">B2B-26-04812</b>. سيتواصل معك مدير حساب خلال يومي عمل على <span dir="ltr">+966 {f.phone}</span>.</p>
              <div className="mt-6 max-w-md mx-auto text-right bg-spl-skysoft/60 p-5 space-y-2 text-[14px]">
                <div className="font-bold text-spl-deep">جهّز للاجتماع</div>
                {["متوسط عدد الشحنات ووزنها", "المدن التي تشحن لها أكثر", "مواقع المستودعات لجدولة الاستلام"].map((x) => (
                  <div key={x} className="flex gap-2"><Check size={16} className="text-emerald-600 mt-0.5" /> {x}</div>
                ))}
              </div>
              <Link to="/spl/business" className="inline-flex mt-8 h-12 px-8 items-center border border-spl-deep text-spl-deep font-bold">صفحة الأعمال</Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-5">
                <div><label className={lbl}>اسم المنشأة</label><input className={field} value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} /></div>
                <div>
                  <label className={lbl}>الرقم الموحد (700)</label>
                  <input className={field} dir="ltr" placeholder="7001234567" value={f.cr} onChange={(e) => setF({ ...f, cr: e.target.value })} />
                  {tried && !/^7\d{9}$/.test(f.cr.trim()) && <p className="text-red-600 text-[12px] mt-1">الرقم الموحد 10 أرقام ويبدأ بـ 7</p>}
                </div>
                <div>
                  <label className={lbl}>عدد الشحنات الشهرية</label>
                  <input className={field} dir="ltr" value={f.monthly} onChange={(e) => setF({ ...f, monthly: e.target.value })} />
                  {vol && <p className="text-slate-500 text-[12px] mt-1">من إجابتك: {vol} شحنة</p>}
                </div>
                <div>
                  <label className={lbl}>تحتاج</label>
                  <div className="flex gap-4 h-11 items-center text-[14px]">
                    <label className="flex items-center gap-2"><input type="checkbox" checked={f.cod} onChange={() => setF({ ...f, cod: !f.cod })} className="w-4 h-4 accent-[#2e6475]" /> الدفع عند الاستلام</label>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={f.intl} onChange={() => setF({ ...f, intl: !f.intl })} className="w-4 h-4 accent-[#2e6475]" /> شحن دولي</label>
                  </div>
                </div>
                <div><label className={lbl}>اسم المسؤول</label><input className={field} value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} /></div>
                <div>
                  <label className={lbl}>رقم الجوال</label>
                  <div className="flex border border-spl-line">
                    <input className="h-11 flex-1 min-w-0 px-3 outline-none" dir="ltr" placeholder="5XXXXXXXX" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
                    <span className="px-3 flex items-center bg-spl-bg text-slate-500 text-[14px] border-r border-spl-line" dir="ltr">+966</span>
                  </div>
                </div>
                <div className="col-span-2"><label className={lbl}>البريد الإلكتروني للعمل</label><input className={field} dir="ltr" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
              </div>
              {tried && !ok && <p className="text-red-600 text-[13px] mt-4">أكمل الحقول المطلوبة بشكل صحيح.</p>}
              <div className="mt-8 flex justify-between">
                <Link to="/spl/business/ship" className="h-12 px-4 flex items-center gap-2 text-spl-deep font-semibold"><ArrowRight size={18} /> رجوع</Link>
                <button onClick={() => { setTried(true); if (ok) setSent(true); }} className="h-12 px-10 bg-spl-sky text-white font-bold">أرسل الطلب</button>
              </div>
            </>
          )}
        </div>
      </section>
    </SplLayout>
  );
}
