import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Menu, MapPin, Search, ChevronLeft, Home } from "lucide-react";
import { setFavicon } from "../favicon";

export function SplLayout({ children, crumbs, section = "individuals", title }: {
  children: ReactNode;
  crumbs: { label: string; to?: string }[];
  section?: "individuals" | "business";
  title?: string;
}) {
  useEffect(() => {
    setFavicon("/favicons/spl.png");
    document.title = `${title ?? crumbs[crumbs.length - 1]?.label ?? "سبل"} | البريد السعودي | سبل`;
  }, [title, crumbs]);
  const tab = (on: boolean) => `px-4 flex items-center ${on ? "bg-white/10 font-semibold text-white" : "text-white/70 hover:text-white"}`;
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* utility bar */}
      <div className="bg-spl-ink text-white text-[13px]">
        <div className="max-w-6xl mx-auto px-6 h-9 flex items-center justify-between">
          <div className="flex h-full">
            <Link to="/spl/calculator" className={tab(section === "individuals")}>الأفراد</Link>
            <Link to="/spl/business" className={tab(section === "business")}>الأعمال</Link>
            <span className={tab(false)}>الخدمات الحكومية</span>
          </div>
          <div className="flex items-center gap-5 text-white/85">
            <span>مساعدة</span>
            <MapPin size={16} />
            <Search size={16} />
            <span dir="ltr">English</span>
          </div>
        </div>
      </div>

      {/* main header */}
      <header className="border-b border-spl-line">
        <div className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Menu className="text-spl-deep" size={26} />
            <Link to={section === "business" ? "/spl/business" : "/spl/calculator"} aria-label="سبل - البريد السعودي">
              <img src="/spl-logo.png" alt="سبل" className="h-11 w-auto" />
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 h-9 border border-spl-deep text-spl-deep text-sm font-semibold">دخول</button>
            <button className="px-3 h-9 text-spl-deep text-sm">تسجيل</button>
          </div>
        </div>
      </header>

      {/* breadcrumb */}
      <div className="max-w-6xl mx-auto w-full px-6 pt-4 flex items-center gap-2 text-[13px] text-slate-500">
        <Home size={15} />
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-2">
            <ChevronLeft size={14} />
            {c.to ? <Link to={c.to} className="hover:text-spl-teal">{c.label}</Link> : <span>{c.label}</span>}
          </span>
        ))}
      </div>

      <main className="flex-1">{children}</main>

      <footer className="bg-spl-ink text-white/80 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-4 gap-8 text-sm">
          <div>
            <div className="text-white font-semibold mb-3">سبل</div>
            <div className="space-y-2"><div>عن المؤسسة</div><div>فروعنا</div><div>المركز الإعلامي</div></div>
          </div>
          <div>
            <div className="text-white font-semibold mb-3">خدمات</div>
            <div className="space-y-2"><div>تتبع الشحنات</div><div>العنوان الوطني</div><div>حاسبة الأسعار</div></div>
          </div>
          <div>
            <div className="text-white font-semibold mb-3">الأعمال</div>
            <div className="space-y-2"><Link to="/spl/business/ship" className="block hover:text-white">الشحن للمنشآت</Link><div>التجارة الإلكترونية</div><div>الغرف البريدية</div></div>
          </div>
          <div>
            <div className="text-white font-semibold mb-3">تواصل معنا</div>
            <div className="space-y-2"><div>الرقم المجاني 19992</div><div>مركز العناية بالعملاء</div></div>
          </div>
        </div>
        <div className="border-t border-white/10 text-center text-xs py-4 text-white/50">© 2026 جميع الحقوق محفوظة البريد السعودي | سبل</div>
      </footer>
    </div>
  );
}

export function Segmented<T extends string>({
  value, onChange, options, size = "md",
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode }[];
  size?: "sm" | "md";
}) {
  return (
    <div className="inline-flex border border-spl-deep/30 bg-white">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={[
            "flex items-center gap-2 font-semibold transition",
            size === "sm" ? "px-3 h-8 text-[13px]" : "px-5 h-11 text-[15px]",
            value === o.value ? "bg-spl-deep text-white" : "text-spl-deep hover:bg-spl-skysoft",
          ].join(" ")}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
