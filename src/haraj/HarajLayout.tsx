import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BellRing, Heart, Settings, LogOut, Store, CircleCheck } from "lucide-react";
import { useAlerts, notesOf, markSeen, markAllSeen, useToast, type Note } from "./alerts";
import { critQuery } from "./search";
import { setFavicon } from "../favicon";
import { fmt, timeAgo } from "./data";
import { Img } from "./asset";
import "./haraj.css";
import { IcEnvelope, IcBell, IcSun, IcCaretDown, IcSearch, IcPlus, Avatar, HarajLogo } from "./icons";

const CDN = "https://v8-cdn.haraj.com.sa/icons/home/new/";
const CATS: [string, string][] = [
  ["الرئيسية", "h_icon_dark"], ["سيارات", "cars-dark"], ["أجهزة", "devices-dark"], ["عقار ديل", "realestate-dark"],
  ["اثاث", "furniture-dark"], ["خدمات", "services-dark"], ["ازياء", "fashion-dark"], ["حيوانات", "animals-dark"],
  ["وظائف", "jobs-dark"], ["العاب", "games-dark"], ["تدريب", "coach-dark"], ["اطعمة", "food-dark"],
];
const BRANDS = ["تويوتا", "هيونداي", "نيسان", "فورد", "كيا", "شيفروليه", "لكزس", "قطع غيار وملحقات", "شاحنات ومعدات ثقيلة", "دبابات", "مرسيدس", "جي ام سي", "ايسوزو", "هوندا", "بي ام دبليو", "مازدا", "ميتسوبيشي"];
const MODELS = ["كامري", "لاندكروزر", "هايلوكس", "كورولا", "يارس", "باص", "فورتشنر", "شاص", "افالون", "ربع", "راف فور", "برادو", "اف جي", "كرسيدا", "انوفا", "اوربان كروزر", "فيلوز", "اوريون"];

export const chipOn = "whitespace-nowrap rounded-md border px-2.5 py-0.5 transition-all duration-300 active:scale-[0.97] font-medium border-secondary/45 bg-secondary/[0.17] text-secondary/95";
export const chipOff = "whitespace-nowrap rounded-md border px-2.5 py-0.5 transition-all duration-300 active:scale-[0.97] border-secondary-darker/20 bg-blue-50/[0.04] text-secondary-darker hover:bg-blue-50/[0.08]";

function Header() {
  const alerts = useAlerts();
  const notes = notesOf(alerts);
  const unread = notes.filter((n) => n.unread).length;
  const [open, setOpen] = useState<"bell" | "user" | null>(null);
  const nav = useNavigate();
  const go = (n: Note) => {
    markSeen(n.alert.id, n.car.id);
    setOpen(null);
    nav(`/haraj/listing/${n.car.id}?from=search&back=${encodeURIComponent(critQuery(n.alert.crit))}`);
  };
  const menuItem = "flex w-full items-center gap-3 px-4 py-2.5 text-[14.5px] text-secondary/85 hover:bg-white/[0.05]";

  return (
    <>
      <div className="h-[54px] bg-gradient-to-bl from-primary-darker to-primary" />
      <div className="sticky top-0 z-[60] mx-auto box-border h-14 w-full pt-2 bg-primary">
        <div className="mx-auto flex h-10 w-full max-w-7xl items-center px-3 md:px-4" dir="ltr">
          <div className="flex h-8 w-fit items-center gap-2 pe-2">
            <div className="relative">
              <button onClick={() => setOpen(open === "user" ? null : "user")} className="inline-flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-full p-1.5 pe-4 bg-primary-darker text-text-on-primary hover:text-white transition-colors">
                <Avatar name="F" />
                <span className="max-w-[12ch] overflow-hidden text-ellipsis pt-1 text-[15px]">fahad.s</span>
                <IcCaretDown className="text-[13px]" />
              </button>
              {open === "user" && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpen(null)} />
                  <div dir="rtl" className="absolute left-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-white/[0.08] bg-background-darker py-1.5 shadow-[0_10px_28px_-8px_rgba(0,0,0,0.6)]">
                    <span className={menuItem}><Store size={16} />المتجر</span>
                    <Link to="/haraj/alerts" onClick={() => setOpen(null)} className={`${menuItem} text-text-primary`}>
                      <BellRing size={16} /><span className="flex-1">التنبيهات والمتابعة</span>
                      {alerts.length > 0 && <span className="rounded-full bg-secondary/[0.17] px-2 text-[12px] text-secondary">{alerts.length}</span>}
                    </Link>
                    <span className={menuItem}><Heart size={16} />المفضلة</span>
                    <span className={menuItem}><Settings size={16} />الإعدادات</span>
                    <span className={menuItem}><LogOut size={16} />خروج</span>
                  </div>
                </>
              )}
            </div>
            <div className="flex h-full items-center gap-1">
              <ul className="flex h-full list-none gap-1">
                <li className="relative h-full bg-primary-darker rounded-md">
                  <span className="flex h-full items-center justify-center px-2.5 text-white">
                    <IcEnvelope className="text-[13px]" /><span className="text-sm ms-2"> الرسائل</span>
                  </span>
                </li>
                <li className="relative h-full bg-primary-darker rounded-md">
                  <button onClick={() => setOpen(open === "bell" ? null : "bell")} className="flex h-full items-center justify-center px-2.5 text-white">
                    <IcBell className="text-[13px]" /><span className="text-sm ms-2"> الإشعارات</span>
                  </button>
                  {unread > 0
                    ? <div className="bg-danger absolute -end-1.5 -top-1.5 z-20 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[11px] font-bold text-white">{unread}</div>
                    : alerts.length === 0 && <div className="bg-danger absolute end-0 top-0 z-20 flex aspect-square h-2 rounded-full" />}
                  {open === "bell" && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setOpen(null)} />
                      <div dir="rtl" className="absolute left-0 top-full z-50 mt-2 w-[400px] overflow-hidden rounded-xl border border-white/[0.08] bg-background-darker shadow-[0_10px_28px_-8px_rgba(0,0,0,0.6)]">
                        <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
                          <span className="font-bold text-secondary">الإشعارات</span>
                          {unread > 0 && <button onClick={markAllSeen} className="text-[13px] text-text-primary">تعليم الكل كمقروء</button>}
                        </div>
                        <div className="custom-scroll max-h-[420px] overflow-auto">
                          {notes.length === 0 && (
                            <div className="px-6 py-8 text-center text-[14px] text-secondary/60">
                              لا توجد إشعارات جديدة
                              {alerts.length === 0 && <div className="mt-1 text-[12.5px] text-secondary/45">فعّل تنبيه بحث من صفحة النتائج ليصلك كل عرض جديد</div>}
                            </div>
                          )}
                          {notes.map((n) => (
                            <button key={n.alert.id + n.car.id} onClick={() => go(n)} className={`flex w-full gap-3 border-b border-white/[0.05] px-4 py-3 text-start hover:bg-white/[0.04] ${n.unread ? "bg-primary/[0.07]" : ""}`}>
                              <Photo src={n.car.img} alt="" className="h-14 w-14 shrink-0 rounded-lg" />
                              <span className="min-w-0 flex-1">
                                <span className="block text-[12px] text-secondary/60">عرض جديد يطابق «{n.alert.name}»</span>
                                <span className="block truncate text-[14.5px] font-medium text-text-title">{n.car.title}</span>
                                <span className="block text-[12.5px] text-secondary/60">{n.car.city} · {n.car.km === 0 ? "جديدة" : n.car.km !== null ? `${fmt(n.car.km)} كم` : "الممشى غير مذكور"}{n.car.price ? ` · ${fmt(n.car.price)} ريال` : ""} · {timeAgo(n.car.ago)}</span>
                              </span>
                              {n.unread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-text-primary" />}
                            </button>
                          ))}
                        </div>
                        <Link to="/haraj/alerts" onClick={() => setOpen(null)} className="block border-t border-white/[0.08] py-3 text-center text-[14px] text-text-primary hover:bg-white/[0.04]">إدارة التنبيهات</Link>
                      </div>
                    </>
                  )}
                </li>
              </ul>
              <button className="bg-primary-darker text-white flex h-full items-center justify-center rounded-md px-2.5 text-sm" aria-label="Toggle theme"><IcSun /></button>
            </div>
          </div>
          <div className="h-full w-full" />
          <Link to="/haraj/filters" className="block"><HarajLogo className="h-fit w-28 fill-white" /></Link>
        </div>
      </div>
    </>
  );
}

function ToastBar() {
  const t = useToast();
  if (!t) return null;
  return (
    <div className="fixed bottom-6 left-1/2 z-[90] -translate-x-1/2">
      <div className="flex items-center gap-4 rounded-xl border border-white/[0.10] bg-background-darker px-5 py-3.5 text-[14.5px] text-white shadow-[0_12px_32px_-8px_rgba(0,0,0,0.7)]">
        <CircleCheck size={18} className="text-text-title" />
        <span>{t.text}</span>
        {t.to && <Link to={t.to} className="font-medium text-text-primary hover:underline">{t.linkLabel}</Link>}
      </div>
    </div>
  );
}

function SearchRow() {
  return (
    <div className="mx-auto max-w-7xl px-3 md:px-4 flex h-16 items-center gap-2.5 pt-2">
      <div className="flex h-16 flex-1 items-stretch">
        <input placeholder="ابحث عن سلعة" className="flex-1 min-w-0 text-[1.4rem] bg-background rounded-[10px] rounded-e-none ps-4 pt-0.5 outline-none placeholder:text-secondary-darker/70 text-text-regular focus:bg-background-darker" />
        <button className="ms-1 flex w-32 items-center justify-center rounded-e-[10px] bg-background text-white hover:bg-background-darker" aria-label="search"><IcSearch /></button>
      </div>
      <Link to="/haraj/post" className="flex h-16 w-40 items-center justify-center gap-2 rounded-[10px] bg-background text-[rgb(var(--action))] hover:bg-background-darker text-[16px]">
        أضف عرض<IcPlus className="text-[13px]" />
      </Link>
    </div>
  );
}

function Categories({ activeBrand }: { activeBrand?: string }) {
  return (
    <div className="mx-auto max-w-7xl mt-5 pe-7 ps-4 pb-3">
      <div className="tab-scroll mb-1 flex max-w-full flex-nowrap gap-1 overflow-x-auto pb-1 items-center">
        {CATS.map(([label, icon], i) => (
          <div key={label}>
            <span className={`mb-px grid w-[100px] shrink-0 cursor-pointer content-center items-center justify-items-center rounded-lg p-2 ${i === 1 ? "bg-secondary/[0.17] text-secondary/95 font-bold" : "text-secondary-darker hover:text-secondary hover:bg-primary/10"}`}>
              <Img src={`${CDN}${icon}.svg`} alt={label} width={35} height={35} className="h-[35px] w-[35px] object-contain" />
              <div className="line-clamp-1">{label}</div>
            </span>
          </div>
        ))}
      </div>
      {activeBrand && (
        <div className="overflow-hidden space-y-1">
          {[BRANDS, MODELS].map((row, r) => (
            <div key={r} className="tab-scroll mb-1 flex max-w-full flex-nowrap overflow-x-auto gap-1.5">
              {row.map((b) => (
                <div key={b} className={b === activeBrand ? chipOn : chipOff}><span className="flex h-8 items-center justify-center">{b}</span></div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const FOOT = ["حساب و سداد رسوم الموقع", "الاشتراك السنوي للمتجر", "زيادة مشاهدات العروض", "اتفاقية الاستخدام", "خدمة الشراء الموثوق", "توثيق المتجر و إضافة التراخيص", "مركز الأمان", "نظام التقييم", "نظام الخصم", "الحسابات والأرقام الموقوفة", "قائمة السلع والعروض الممنوعة", "الأسئلة الشائعة", "سياسة الخصوصية", "سياسة الملكية الفكرية", "اتصل بنا"];

function Footer() {
  return (
    <footer className="border-t border-secondary-input-gray bg-background">
      <div className="mx-auto max-w-7xl px-5">
        <ul className="my-4 grid grid-cols-3 gap-3 border-b border-secondary-input-gray py-8">
          {FOOT.map((f) => <li key={f}><span className="text-secondary hover:underline cursor-pointer">{f}</span></li>)}
        </ul>
      </div>
      <div className="p-2 text-center"><div className="mx-auto max-w-7xl px-5 py-8 text-secondary-darker text-sm">
        <div>مؤسسة موقع حراج لتقنية المعلومات</div>
      </div></div>
    </footer>
  );
}

export function HarajLayout({ children, title, activeBrand, showNav = true }: { children: ReactNode; title: string; activeBrand?: string; showNav?: boolean }) {
  useEffect(() => { document.title = `${title} | موقع حراج`; setFavicon("/favicons/haraj.svg"); }, [title]);
  return (
    <div className="dark hj-root min-h-screen" dir="rtl">
      <Header />
      <div className="bg-background-card relative w-full">
        <SearchRow />
        {showNav && <Categories activeBrand={activeBrand} />}
        {!showNav && <div className="h-4" />}
      </div>
      <div className="bg-background w-full min-h-[60vh]">{children}</div>
      <Footer />
      <ToastBar />
    </div>
  );
}

export function Photo({ src, alt, className = "" }: { src?: string; alt: string; className?: string }) {
  return src
    ? <Img src={src} alt={alt} loading="lazy" className={`object-cover object-center ${className}`} />
    : <div className={`bg-background-darker ${className}`} />;
}
