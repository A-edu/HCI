import { Link } from "react-router-dom";
import { Truck, ShoppingCart, Boxes, Building2, Mail, MapPinned, ArrowLeft, Calculator, Headphones } from "lucide-react";
import { SplLayout } from "../SplLayout";

const services = [
  { icon: Truck, title: "أرسل شحنات منشأتك", desc: "اختر خطة الشحن المناسبة لعدد شحناتك: باقات مسبقة الدفع، أو ربط متجرك، أو عقد مباشر.", link: "اختر خطة الشحن المناسبة", to: "/spl/business/ship", main: true },
  { icon: ShoppingCart, title: "التجارة الإلكترونية", desc: "اربط متجرك على سلة أو زد، مع الدفع عند الاستلام وإدارة المرتجعات.", link: "اعرف كيف تربط متجرك", to: "/spl/business/ship" },
  { icon: Boxes, title: "باقات الشحن المسبقة (SMEs)", desc: "من 20 إلى 250 شحنة، بسعر يبدأ من 20 ريال للطرد. صالحة لسنة.", link: "شاهد أسعار الباقات", to: "/spl/business/ship#compare" },
  { icon: Building2, title: "عنوان الأعمال المعتمد", desc: "عنوان وطني موحد لمنشأتك يسهّل وصول الشحنات والمراسلات.", link: "سجّل عنوان منشأتك" },
  { icon: Mail, title: "الغرفة البريدية", desc: "ندير بريد مكتبك الوارد والصادر داخل مقر منشأتك.", link: "اعرف تفاصيل الغرفة البريدية" },
  { icon: MapPinned, title: "الناشر التجاري", desc: "وثّق مواقع فروعك على خرائط قوقل وتابع تقييمات عملائك.", link: "اعرف عن الناشر التجاري" },
];

export default function Business() {
  return (
    <SplLayout section="business" crumbs={[{ label: "الأعمال" }]}>
      {/* hero */}
      <section className="max-w-6xl mx-auto px-6 pt-6">
        <div className="bg-spl-ink text-white px-12 py-12 flex items-center justify-between gap-10 relative overflow-hidden">
          <div className="absolute -left-16 -bottom-24 w-72 h-72 rounded-full bg-spl-sky/15" />
          <div className="absolute left-40 -top-20 w-40 h-40 rounded-full bg-spl-sky/10" />
          <div className="relative max-w-xl">
            <div className="text-spl-sky font-semibold text-[14px] mb-3">سبل للأعمال</div>
            <h1 className="text-[36px] font-bold leading-tight">حلول الشحن والبريد لمنشأتك</h1>
            <p className="text-white/75 mt-3 text-[16px]">من متجر صغير يرسل 20 طلباً في الشهر إلى شركة تشحن آلاف الطلبات، اختر ما يناسبك وابدأ اليوم.</p>
            <div className="mt-8 flex items-center gap-3">
              <Link to="/spl/business/ship" className="h-12 px-8 bg-spl-sky text-white font-bold flex items-center gap-2 hover:brightness-95">
                ابدأ الشحن لمنشأتك <ArrowLeft size={18} />
              </Link>
              <Link to="/spl/calculator" className="h-12 px-6 border border-white/40 text-white font-semibold flex items-center gap-2 hover:bg-white/10">
                <Calculator size={18} /> احسب سعر شحنة
              </Link>
            </div>
          </div>
          <div className="relative grid grid-cols-2 gap-3 text-center shrink-0">
            {[["+580", "فرعاً حول المملكة"], ["30 ألف", "شحنة يومياً"], ["146", "مدينة وقرية"], ["20 ريال", "سعر الطرد في الباقات"]].map(([n, l]) => (
              <div key={l} className="bg-white/5 border border-white/10 px-6 py-4 w-40">
                <div className="text-[24px] font-bold text-spl-sky">{n}</div>
                <div className="text-[12px] text-white/70 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* services */}
      <section className="max-w-6xl mx-auto px-6 pt-12">
        <h2 className="text-[24px] font-bold text-spl-deep">ماذا تحتاج منشأتك؟</h2>
        <div className="mt-6 grid grid-cols-3 gap-5">
          {services.map((s) => {
            const Icon = s.icon;
            const body = (
              <>
                <div className={`w-12 h-12 flex items-center justify-center ${s.main ? "bg-spl-sky text-white" : "bg-spl-skysoft text-spl-teal"}`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-[18px] font-bold text-spl-deep mt-5">{s.title}</h3>
                <p className="text-[14px] text-slate-600 mt-2 flex-1">{s.desc}</p>
                <span className="mt-5 text-spl-teal font-semibold text-[14px] flex items-center gap-2">
                  {s.link} <ArrowLeft size={16} className="group-hover:-translate-x-1 transition" />
                </span>
              </>
            );
            const cls = `group flex flex-col bg-white border p-6 shadow-card ${s.main ? "border-spl-sky border-2" : "border-spl-line"}`;
            return s.to ? <Link key={s.title} to={s.to} className={cls}>{body}</Link> : <div key={s.title} className={cls}>{body}</div>;
          })}
        </div>

        <div className="mt-8 flex items-center gap-4 bg-spl-bg border border-spl-line px-6 py-4 text-[14px]">
          <Headphones className="text-spl-teal" size={22} />
          <span>تحتاج مساعدة في اختيار الخدمة؟ فريق مبيعات الأعمال على الرقم المجاني <b dir="ltr">19992</b></span>
        </div>
      </section>
    </SplLayout>
  );
}
