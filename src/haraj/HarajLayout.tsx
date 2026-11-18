import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
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
  return (
    <>
      <div className="h-[54px] bg-gradient-to-bl from-primary-darker to-primary" />
      <div className="sticky top-0 z-[60] mx-auto box-border h-14 w-full pt-2 bg-primary">
        <div className="mx-auto flex h-10 w-full max-w-7xl items-center px-3 md:px-4" dir="ltr">
          <div className="flex h-8 w-fit items-center gap-2 pe-2">
            <button className="inline-flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-full p-1.5 pe-4 bg-primary-darker text-text-on-primary hover:text-white transition-colors">
              <Avatar name="F" />
              <span className="max-w-[12ch] overflow-hidden text-ellipsis pt-1 text-[15px]">fahad.s</span>
              <IcCaretDown className="text-[13px]" />
            </button>
            <div className="flex h-full items-center gap-1">
              <ul className="flex h-full list-none gap-1">
                <li className="relative h-full bg-primary-darker rounded-md">
                  <span className="flex h-full items-center justify-center px-2.5 text-white">
                    <IcEnvelope className="text-[13px]" /><span className="text-sm ms-2"> الرسائل</span>
                  </span>
                </li>
                <li className="relative h-full bg-primary-darker rounded-md">
                  <span className="flex h-full items-center justify-center px-2.5 text-white">
                    <IcBell className="text-[13px]" /><span className="text-sm ms-2"> الإشعارات</span>
                  </span>
                  <div className="bg-danger absolute end-0 top-0 z-20 flex aspect-square h-2 rounded-full" />
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
              <img src={`${CDN}${icon}.svg`} alt={label} width={35} height={35} className="h-[35px] w-[35px] object-contain" />
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
  useEffect(() => { document.title = `${title} | موقع حراج`; }, [title]);
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
    </div>
  );
}

export function Photo({ src, alt, className = "" }: { src?: string; alt: string; className?: string }) {
  return src
    ? <img src={src} alt={alt} loading="lazy" className={`object-cover object-center ${className}`} />
    : <div className={`bg-background-darker ${className}`} />;
}
