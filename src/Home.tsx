import { Link } from "react-router-dom";

const flows = [
  { who: "Abdulaziz", site: "Saudi Post (SPL)", title: "حاسبة الأسعار البريدية", to: "/spl/calculator", ready: true },
  { who: "Mohammed", site: "Saudi Post (SPL)", title: "الشحن للمنشآت", to: "/spl/business", ready: true },
  { who: "Abdullah", site: "Haraj", title: "البحث والفلاتر", to: "/haraj/filters", ready: true },
  { who: "Ahmed", site: "Haraj", title: "تنبيهات البحث", to: "/haraj/alerts", ready: false },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-10">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-1">SWE482 – Prototypes</h1>
        <p className="text-slate-500 mb-8">اختر النموذج</p>
        <div className="grid grid-cols-2 gap-4">
          {flows.map((f) =>
            f.ready ? (
              <Link key={f.to} to={f.to} className="rounded-xl bg-white border border-slate-200 p-5 hover:border-slate-400 transition">
                <div className="text-xs text-slate-500" dir="ltr">{f.who} · {f.site}</div>
                <div className="text-lg font-semibold mt-1">{f.title}</div>
              </Link>
            ) : (
              <div key={f.to} className="rounded-xl bg-white/60 border border-dashed border-slate-200 p-5 text-slate-400">
                <div className="text-xs" dir="ltr">{f.who} · {f.site}</div>
                <div className="text-lg font-semibold mt-1">{f.title}</div>
                <div className="text-xs mt-1">قريباً</div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
