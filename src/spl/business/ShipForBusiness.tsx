import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Check, X, ArrowLeft, Sparkles, ChevronDown } from "lucide-react";
import { SplLayout } from "../SplLayout";
import { BUNDLES, ECOM, PLATFORMS, VOLUMES, recommend, type Platform, type PlanKind, type Volume } from "./plans";

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-11 px-4 border text-[14px] font-semibold transition ${on ? "bg-spl-deep border-spl-deep text-white" : "bg-white border-spl-line text-spl-deep hover:border-spl-teal"}`}
    >
      {children}
    </button>
  );
}

function Question({ n, title, hint, children }: { n: number; title: string; hint?: string; children: ReactNode }) {
  return (
    <div className="py-6 first:pt-0 border-b last:border-b-0 border-spl-line">
      <div className="flex items-center gap-3">
        <span className="w-7 h-7 rounded-full bg-spl-skysoft text-spl-teal text-[13px] font-bold flex items-center justify-center">{n}</span>
        <h3 className="text-[17px] font-bold text-spl-deep">{title}</h3>
      </div>
      {hint && <p className="text-[13px] text-slate-500 mt-1 mr-10">{hint}</p>}
      <div className="mt-4 mr-10 flex flex-wrap gap-3">{children}</div>
    </div>
  );
}

const yes = <Check size={18} className="text-emerald-600 mx-auto" />;
const no = <X size={18} className="text-slate-300 mx-auto" />;

const compareRows: { label: string; cells: Record<PlanKind, ReactNode> }[] = [
  { label: "مناسبة لـ", cells: { sme: "حتى 250 شحنة شهرياً", ecom: "المتاجر الإلكترونية", contract: "أكثر من 500 شحنة شهرياً" } },
  { label: "سعر الطرد", cells: { sme: "20 – 29.95 ريال", ecom: `${ECOM.per} ريال`, contract: "سعر تفاوضي" } },
  { label: "طريقة الدفع", cells: { sme: "مسبقاً (باقة)", ecom: "شهرياً حسب الاستخدام", contract: "فاتورة شهرية" } },
  { label: "الدفع عند الاستلام", cells: { sme: no, ecom: yes, contract: yes } },
  { label: "ربط المتجر (سلة / زد)", cells: { sme: no, ecom: yes, contract: yes } },
  { label: "إدارة المرتجعات", cells: { sme: no, ecom: yes, contract: yes } },
  { label: "الاستلام من موقعك", cells: { sme: "تسلّمها في الفرع", ecom: yes, contract: "استلام يومي" } },
  { label: "المطلوب للتسجيل", cells: { sme: "هوية أو سجل تجاري", ecom: "هوية أو وثيقة عمل حر أو سجل", contract: "سجل تجاري (700)" } },
];

const kinds: { kind: PlanKind; name: string }[] = [
  { kind: "sme", name: "باقات الشحن المسبقة" },
  { kind: "ecom", name: "التجارة الإلكترونية" },
  { kind: "contract", name: "عقد مباشر" },
];

export default function ShipForBusiness() {
  const nav = useNavigate();
  const loc = useLocation();
  const [volume, setVolume] = useState<Volume | null>(null);
  const [cod, setCod] = useState<boolean | null>(null);
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [faq, setFaq] = useState<number | null>(0);

  useEffect(() => {
    if (loc.hash === "#compare") setTimeout(() => document.getElementById("compare")?.scrollIntoView({ behavior: "smooth" }), 100);
    else window.scrollTo(0, 0);
  }, [loc.hash]);

  const rec = useMemo(
    () => (volume && cod !== null && platform ? recommend(volume, cod, platform) : null),
    [volume, cod, platform]
  );
  const answered = [volume, cod, platform].filter((x) => x !== null).length;

  const go = (kind: PlanKind, bundleId?: string) => {
    const q = new URLSearchParams({ plan: kind, volume: volume ?? "", cod: String(!!cod), platform: platform ?? "" });
    if (bundleId) q.set("bundle", bundleId);
    nav(kind === "contract" ? `/spl/business/contract?${q}` : `/spl/business/signup?${q}`);
  };

  return (
    <SplLayout section="business" crumbs={[{ label: "الأعمال", to: "/spl/business" }, { label: "أرسل شحنات منشأتك" }]}>
      <section className="max-w-6xl mx-auto px-6 pt-6">
        <h1 className="text-[34px] font-bold text-spl-deep">أرسل شحنات منشأتك</h1>
        <p className="text-slate-600 mt-2 text-[16px]">أجب عن 3 أسئلة، ونرشّح لك الخطة الأنسب لمنشأتك وسعرها، ثم ابدأ التسجيل مباشرة.</p>

        <div className="mt-8 grid grid-cols-12 gap-8 items-start">
          {/* questions */}
          <div className="col-span-7 bg-white border border-spl-line shadow-card p-8">
            <Question n={1} title="كم شحنة ترسل شهرياً؟" hint="تقريباً، ويمكنك تغييرها لاحقاً">
              {VOLUMES.map((v) => <Chip key={v.value} on={volume === v.value} onClick={() => setVolume(v.value)}>{v.label}</Chip>)}
            </Question>
            <Question n={2} title="هل يدفع عملاؤك عند الاستلام؟" hint="نحصّل المبلغ من عميلك ونحوّله لحسابك">
              <Chip on={cod === true} onClick={() => setCod(true)}>نعم، أحتاج الدفع عند الاستلام</Chip>
              <Chip on={cod === false} onClick={() => setCod(false)}>لا، الدفع مسبق</Chip>
            </Question>
            <Question n={3} title="أين تبيع منتجاتك؟">
              {PLATFORMS.map((p) => <Chip key={p.value} on={platform === p.value} onClick={() => setPlatform(p.value)}>{p.label}</Chip>)}
            </Question>
          </div>

          {/* recommendation */}
          <aside className="col-span-5 sticky top-6">
            {!rec ? (
              <div className="bg-spl-bg border border-dashed border-spl-line p-8 text-center">
                <Sparkles className="mx-auto text-spl-teal" size={30} />
                <div className="font-bold text-spl-deep mt-3">الخطة المقترحة لمنشأتك</div>
                <p className="text-[14px] text-slate-500 mt-2">أجب عن الأسئلة لعرض التوصية وسعرها</p>
                <div className="mt-5 flex items-center justify-center gap-2">
                  {[0, 1, 2].map((i) => <span key={i} className={`h-1.5 w-10 ${i < answered ? "bg-spl-sky" : "bg-spl-line"}`} />)}
                </div>
                <div className="text-[12px] text-slate-400 mt-2">{answered} من 3</div>
              </div>
            ) : (
              <div className="bg-white border-2 border-spl-sky shadow-card">
                <div className="bg-spl-sky text-white px-6 py-2.5 text-[13px] font-bold flex items-center gap-2">
                  <Sparkles size={15} /> نرشّح لك
                </div>
                <div className="p-6">
                  <h2 className="text-[22px] font-bold text-spl-deep">{rec.title}</h2>
                  <p className="text-[14px] text-slate-600 mt-2">{rec.why}</p>
                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="text-[34px] font-bold text-spl-price leading-none">{rec.priceLine}</span>
                    <span className="text-spl-price font-semibold">{rec.priceUnit}</span>
                  </div>
                  {rec.monthly && <div className="text-[13px] text-slate-500 mt-2">{rec.monthly}</div>}
                  <ul className="mt-5 pt-4 border-t border-spl-line space-y-2.5 text-[14px]">
                    {rec.features.map((f) => (
                      <li key={f} className="flex items-start gap-2"><Check size={16} className="text-emerald-600 mt-0.5 shrink-0" /> {f}</li>
                    ))}
                  </ul>
                  <button onClick={() => go(rec.kind, rec.bundleId)} className="mt-6 w-full h-12 bg-spl-sky text-white font-bold text-[16px] flex items-center justify-center gap-2 hover:brightness-95">
                    {rec.cta} <ArrowLeft size={18} />
                  </button>
                  {rec.alt && (
                    <button onClick={() => go("sme", rec.alt!.bundleId)} className="mt-3 w-full text-[13px] text-spl-teal underline">
                      {rec.alt.text}
                    </button>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* comparison */}
      <section id="compare" className="max-w-6xl mx-auto px-6 pt-14 scroll-mt-4">
        <h2 className="text-[24px] font-bold text-spl-deep">قارن جميع الخيارات</h2>
        <p className="text-slate-600 mt-1 text-[14px]">كل خدمات الشحن للمنشآت في مكان واحد.</p>
        <div className="mt-6 border border-spl-line shadow-card bg-white">
          <table className="w-full text-[14px]">
            <thead>
              <tr>
                <th className="w-56" />
                {kinds.map((k) => (
                  <th key={k.kind} className={`p-5 text-center align-top ${rec?.kind === k.kind ? "bg-spl-skysoft" : ""}`}>
                    {rec?.kind === k.kind && <div className="text-[11px] font-bold text-white bg-spl-sky inline-block px-2 py-0.5 mb-2">المقترحة لك</div>}
                    <div className="text-[16px] font-bold text-spl-deep">{k.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareRows.map((r) => (
                <tr key={r.label} className="border-t border-spl-line">
                  <td className="px-6 py-3.5 text-slate-500 font-semibold">{r.label}</td>
                  {kinds.map((k) => (
                    <td key={k.kind} className={`px-4 py-3.5 text-center ${rec?.kind === k.kind ? "bg-spl-skysoft" : ""}`}>{r.cells[k.kind]}</td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-spl-line">
                <td className="px-6 py-3.5 text-slate-500 font-semibold">الباقات</td>
                <td className={`px-4 py-3.5 ${rec?.kind === "sme" ? "bg-spl-skysoft" : ""}`}>
                  <div className="space-y-1 text-[13px]">
                    {BUNDLES.map((b) => (
                      <div key={b.id} className="flex justify-between gap-2"><span>{b.name} ({b.shipments})</span><b>{b.total.toLocaleString("en-US")} ريال</b></div>
                    ))}
                  </div>
                </td>
                <td className={`px-4 py-3.5 text-center text-slate-400 ${rec?.kind === "ecom" ? "bg-spl-skysoft" : ""}`}>—</td>
                <td className={`px-4 py-3.5 text-center text-slate-400 ${rec?.kind === "contract" ? "bg-spl-skysoft" : ""}`}>—</td>
              </tr>
              <tr className="border-t border-spl-line">
                <td />
                {kinds.map((k) => (
                  <td key={k.kind} className={`p-4 ${rec?.kind === k.kind ? "bg-spl-skysoft" : ""}`}>
                    <button onClick={() => go(k.kind)} className={`w-full h-11 font-bold ${rec?.kind === k.kind ? "bg-spl-sky text-white" : "border border-spl-deep text-spl-deep"}`}>
                      {k.kind === "contract" ? "اطلب عرض سعر" : "ابدأ التسجيل"}
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* faq */}
      <section className="max-w-6xl mx-auto px-6 pt-14">
        <h2 className="text-[22px] font-bold text-spl-deep mb-4">أسئلة شائعة</h2>
        {[
          ["ليس لدي سجل تجاري، هل يمكنني التسجيل؟", "نعم. يكفي رقم وثيقة العمل الحر، أو الهوية الوطنية للأسر المنتجة والأفراد. السجل التجاري مطلوب فقط للعقود المباشرة."],
          ["هل يمكنني تغيير الخطة لاحقاً؟", "نعم، يمكنك الانتقال من الباقات إلى خدمة التجارة الإلكترونية أو العقد المباشر في أي وقت من حسابك."],
          ["متى تصلني مبالغ الدفع عند الاستلام؟", "تُحوَّل المبالغ المحصّلة إلى حسابك البنكي أسبوعياً، مع كشف تفصيلي لكل شحنة."],
        ].map(([q, a], i) => (
          <div key={q} className="border-b border-spl-line">
            <button onClick={() => setFaq(faq === i ? null : i)} className="w-full py-4 flex items-center justify-between text-right font-semibold text-spl-deep">
              {q} <ChevronDown size={18} className={`transition ${faq === i ? "rotate-180" : ""}`} />
            </button>
            {faq === i && <p className="pb-4 text-[14px] text-slate-600">{a}</p>}
          </div>
        ))}
        <p className="mt-6 text-[14px] text-slate-500">لم تجد إجابتك؟ <Link to="/spl/business" className="text-spl-teal font-semibold">تواصل مع مبيعات الأعمال</Link></p>
      </section>
    </SplLayout>
  );
}
