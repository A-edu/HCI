import { useMemo, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MapPin, Navigation, CalendarDays, Gauge, Fuel, SlidersHorizontal, Video, Search, MessagesSquare, Map as MapIcon, X, ChevronDown, ChevronLeft, PackageOpen, Info, ArrowUpDown, Check } from "lucide-react";
import { HarajLayout, Photo, chipOn } from "./HarajLayout";
import { Img } from "./asset";
import { IcPin, IcClock, IcRiyal, Avatar } from "./icons";
import { LISTINGS, CITIES, fmt, timeAgo, cars as carsLabel, type Car, type Part } from "./data";

const cars = LISTINGS.filter((l): l is Car => l.kind === "car");
const parts = LISTINGS.filter((l): l is Part => l.kind === "part");
const YEARS = Array.from({ length: 2027 - 1980 + 1 }, (_, i) => 2027 - i);

type F = { ymin?: number; ymax?: number; kmax?: number; unknown: boolean; city?: string; fuel?: string; sort: string };

function readFilters(q: URLSearchParams): F {
  const n = (k: string) => (q.get(k) ? Number(q.get(k)) : undefined);
  return { ymin: n("ymin"), ymax: n("ymax"), kmax: n("kmax"), unknown: q.get("unknown") === "1", city: q.get("city") || undefined, fuel: q.get("fuel") || undefined, sort: q.get("sort") || "new" };
}

function apply(f: F, list: Car[] = cars) {
  return list.filter((c) =>
    (f.ymin === undefined || c.year >= f.ymin) &&
    (f.ymax === undefined || c.year <= f.ymax) &&
    (f.kmax === undefined || (c.km === null ? f.unknown : c.km <= f.kmax)) &&
    (!f.city || c.city === f.city) &&
    (!f.fuel || c.fuel === f.fuel)
  );
}

const sorters: Record<string, { label: string; fn: (a: Car, b: Car) => number }> = {
  new: { label: "الأحدث", fn: (a, b) => a.ago - b.ago },
  km: { label: "الأقل ممشى", fn: (a, b) => (a.km ?? 1e12) - (b.km ?? 1e12) },
  year: { label: "الأحدث موديلاً", fn: (a, b) => b.year - a.year },
  price: { label: "الأقل سعراً", fn: (a, b) => (a.price ?? 1e12) - (b.price ?? 1e12) },
};

// Haraj's own filter-pill styles
const pillBase = "flex h-10 shrink-0 cursor-pointer select-none items-center gap-1.5 rounded-xl border text-sm transition-all duration-300 active:scale-[0.97] px-3";
const pillOff = "border-white/[0.08] bg-transparent text-secondary/55 hover:border-white/20 hover:bg-white/[0.05] hover:text-secondary/75";
const pillOn = "border-secondary/45 bg-secondary/[0.17] text-secondary/95";
const popCls = "absolute top-full mt-2 right-0 z-40 overflow-hidden text-base rounded-xl bg-gradient-to-b from-background-darker/[0.96] to-background-darker/[0.92] backdrop-blur-2xl border border-white/[0.08] shadow-[0_10px_28px_-8px_rgba(0,0,0,0.6)]";
const optCls = "mb-1 flex min-h-[36px] w-full cursor-pointer items-center gap-3 rounded-[10px] px-[14px] py-[7px] text-[14px] text-secondary/70 hover:text-secondary hover:bg-white/[0.05]";
const box = (on: boolean) => `flex h-4 w-4 shrink-0 items-center justify-center rounded border ${on ? "border-text-primary bg-text-primary text-background" : "border-secondary-input-gray"}`;
const applyBtn = "w-full h-10 rounded-[10px] bg-primary text-white font-medium hover:bg-primary-darker disabled:opacity-40";
const sel = "mt-1 w-full h-10 rounded-[10px] bg-background border border-secondary-input-gray px-2 outline-none text-[14px] text-text-regular focus:border-secondary";

function Pop({ open, onClose, w = 300, left, children }: { open: boolean; onClose: () => void; w?: number; left?: boolean; children: ReactNode }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className={`${popCls} ${left ? "!right-auto left-0" : ""}`} style={{ width: w }}><div className="p-3">{children}</div></div>
    </>
  );
}

export function SpecTags({ c }: { c: Car }) {
  const t = "inline-flex h-6 items-center gap-1 rounded-md border border-secondary-darker/20 bg-blue-50/[0.04] px-2 text-[13px] text-secondary-darker";
  return (
    <div className="flex flex-wrap gap-1.5">
      <span className={t}><CalendarDays size={13} />{c.year}</span>
      {c.km === null
        ? <span className="inline-flex h-6 items-center gap-1 rounded-md border border-[rgb(var(--action))]/30 bg-[rgb(var(--action))]/[0.08] px-2 text-[13px] text-[rgb(var(--action))]"><Gauge size={13} />الممشى غير مذكور</span>
        : <span className={t}><Gauge size={13} />{c.km === 0 ? "جديدة" : `${fmt(c.km)} كم`}</span>}
      {c.trans && <span className={t}>{c.trans}</span>}
      {c.fuel && <span className={t}><Fuel size={13} />{c.fuel}</span>}
    </div>
  );
}

export function PostRow({ c, to }: { c: Car; to: string }) {
  return (
    <div className="bg-background-card even:bg-background/40 mb-[7px] box-border grid min-h-24 w-full cursor-pointer grid-flow-col grid-cols-2 justify-between gap-2 rounded-lg p-[2px] ps-2">
      <div className="col-span-full flex flex-col justify-between pt-2">
        <Link to={to} className="text-text-title w-full pb-1">
          <h3 className="flex flex-1 items-baseline gap-2 overflow-hidden whitespace-nowrap text-lg font-medium"><span className="overflow-hidden text-ellipsis">{c.title}</span></h3>
        </Link>
        <SpecTags c={c} />
        <div className="flex w-full justify-between pb-2 pt-2">
          <div className="flex flex-wrap-reverse items-end gap-7">
            <span className="inline-flex items-center gap-1 h-5 hover:text-text-primary whitespace-nowrap"><span className="flex h-5 w-4 items-center justify-center"><IcPin /></span>{c.city}</span>
            <div className="flex h-5 items-center gap-1"><IcClock className="text-[13px]" /><span> {timeAgo(c.ago)}</span></div>
            <span className="hover:text-text-primary flex h-5 items-center gap-1.5 md:text-sm mt-1"><Avatar name={c.seller} /><span className="whitespace-nowrap">{c.seller}</span></span>
          </div>
          {c.price ? (
            <div dir="ltr" className="flex items-center font-semibold rounded-lg px-2 py-0.5 text-base bg-secondary/[0.10] text-text-primary mb-2 me-4">
              <span className="tabular-nums">{fmt(c.price)}</span><IcRiyal className="fill-text-primary ms-0.5 h-[1.5rem] -translate-y-px" />
            </div>
          ) : <div />}
        </div>
      </div>
      <div>
        <Link to={to}><Photo src={c.img} alt={c.title} className="rounded-[11px] h-[130px] w-[130px]" /></Link>
      </div>
    </div>
  );
}

const SIDE_LOGOS = ["toyota-logo", "nissan-logo", "ford-logo", "lexus-icon", "chevrolet-logo", "mercedes-logo", "gmc-logo", "bmw-logo", "dodge-logo"];

export function Sidebar() {
  return (
    <div className="col-span-1 min-w-0 pb-8 pt-1.5">
      <div className="mt-0.5 flex flex-col gap-2">
        <div className="overflow-hidden rounded-xl border bg-gradient-to-b border-white/[0.08] from-blue-50/[0.04] to-blue-50/[0.02]">
          <div className="flex flex-col items-center gap-3 px-5 pb-4 pt-5 text-center">
            <div className="text-[22px] font-bold text-secondary tracking-wide">سكوب</div>
            <p className="text-secondary/60 text-[0.75rem] leading-relaxed tracking-wide">نقاشات وأسئلة ومقالات من المجتمع حول هذا القسم</p>
            <button type="button" className="mt-0.5 rounded-full border px-5 py-1.5 text-xs font-medium border-secondary/30 bg-secondary/[0.10] text-secondary hover:bg-secondary/[0.16]">تصفح النقاشات</button>
          </div>
        </div>
        <div className="border-secondary-input-gray text-secondary w-full border-b pb-4 pt-4">
          <span className="flex w-full items-center justify-between font-bold">تنقل السريع<ChevronDown size={16} /></span>
          <div className="py-4"><div className="border-secondary-input-gray border-t pt-4">
            <div className="grid grid-cols-3 gap-2">
              {SIDE_LOGOS.map((l) => (
                <span key={l} className="flex w-full items-center justify-center border p-2 rounded text-[#aaa] h-[78px] border-secondary-input-gray hover:border-secondary">
                  <Img src={`https://v8-cdn.haraj.com.sa/assets/images/svg/${l}.svg`} alt="" width={60} height={60} className="max-h-[52px] w-auto" />
                </span>
              ))}
            </div>
          </div></div>
        </div>
      </div>
    </div>
  );
}

export default function Filters() {
  const [q, setQ] = useSearchParams();
  const f = readFilters(q);
  const [open, setOpen] = useState<string | null>(null);
  const [dy, setDy] = useState<{ min?: number; max?: number }>({});
  const [dk, setDk] = useState<{ max?: number; unknown: boolean; custom: string }>({ unknown: false, custom: "" });

  const set = (patch: Record<string, string | number | undefined | boolean>) => {
    const n = new URLSearchParams(q);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === undefined || v === "" || v === false) n.delete(k);
      else n.set(k, v === true ? "1" : String(v));
    });
    setQ(n);
    setOpen(null);
  };

  const results = useMemo(() => apply(f).sort(sorters[f.sort]?.fn ?? sorters.new.fn), [q.toString()]); // eslint-disable-line
  const hiddenUnknown = f.kmax !== undefined && !f.unknown ? apply({ ...f, unknown: true }).filter((c) => c.km === null).length : 0;
  const hasYear = f.ymin !== undefined || f.ymax !== undefined;
  const partsMatch = hasYear ? parts.filter((p) => p.fits[1] >= (f.ymin ?? 0) && p.fits[0] <= (f.ymax ?? 9999)).length : 0;

  const yearLabel = f.ymin && f.ymax ? (f.ymin === f.ymax ? `${f.ymin}` : `${f.ymin} – ${f.ymax}`) : f.ymin ? `${f.ymin} وأحدث` : f.ymax ? `حتى ${f.ymax}` : null;
  const chips: { label: string; clear: Record<string, undefined> }[] = [];
  if (yearLabel) chips.push({ label: `موديل ${yearLabel}`, clear: { ymin: undefined, ymax: undefined } });
  if (f.kmax !== undefined) chips.push({ label: `الممشى حتى ${fmt(f.kmax)} كم`, clear: { kmax: undefined, unknown: undefined } });
  if (f.fuel) chips.push({ label: f.fuel, clear: { fuel: undefined } });
  if (f.city) chips.push({ label: f.city, clear: { city: undefined } });

  const previewY = apply({ ...f, ymin: dy.min, ymax: dy.max }).length;
  const kmDraft = dk.custom ? Number(dk.custom.replace(/,/g, "")) : dk.max;
  const previewK = kmDraft ? apply({ ...f, kmax: kmDraft, unknown: dk.unknown }).length : 0;

  const toggle = (k: string, init?: () => void) => { init?.(); setOpen(open === k ? null : k); };

  return (
    <HarajLayout title="سيارات تويوتا" activeBrand="تويوتا">
      <div className="mx-auto grid grid-cols-4 content-start gap-4 max-w-7xl pt-1 px-2 ps-6 xl:px-0">
        <Sidebar />

        <div className="col-span-3 box-border grid min-w-0 content-start gap-2 pt-0">
          {/* filter bar (Haraj layout, redesigned behaviour) */}
          <div className="flex w-full min-w-0 items-center gap-1.5 text-sm lg:text-base py-2">
            <div className="flex flex-1 items-center gap-1.5">
              <div className="relative flex h-10 shrink-0 items-stretch rounded-xl border border-white/[0.08]">
                <button onClick={() => toggle("city")} className={`flex items-center justify-center gap-2 px-3 min-w-[140px] rounded-s-xl text-sm ${f.city ? "bg-secondary/[0.17] text-secondary/95" : "text-secondary/55 hover:bg-white/[0.05]"}`}>
                  <MapPin size={15} /><span>{f.city ?? "المنطقة"}</span><ChevronDown size={14} />
                </button>
                <span className="w-px self-stretch bg-white/[0.10]" />
                <button className="flex items-center gap-1.5 px-4 text-[0.9rem] text-secondary/40 bg-white/[0.03] rounded-e-xl"><Navigation size={14} />القريب</button>
                <Pop open={open === "city"} onClose={() => setOpen(null)} w={240}>
                  <div className="custom-scroll max-h-60 overflow-auto">
                    {["كل المناطق", ...CITIES].map((c) => (
                      <button key={c} onClick={() => set({ city: c === "كل المناطق" ? undefined : c })} className={optCls}>
                        <span className={box((f.city ?? "كل المناطق") === c)}>{(f.city ?? "كل المناطق") === c && <Check size={11} />}</span>{c}
                      </button>
                    ))}
                  </div>
                </Pop>
              </div>

              {/* MODEL YEAR — minor fix: real from/to range on the car's year field */}
              <div className="relative">
                <button onClick={() => toggle("year", () => setDy({ min: f.ymin, max: f.ymax }))} className={`${pillBase} ${yearLabel ? pillOn : pillOff}`}>
                  <CalendarDays size={15} /><span>{yearLabel ? `موديل ${yearLabel}` : "موديل"}</span><ChevronDown size={14} />
                </button>
                <Pop open={open === "year"} onClose={() => setOpen(null)} w={330}>
                  <div className="px-1 pt-1 text-[14px] font-bold text-secondary">سنة الصنع</div>
                  <div className="px-1 text-[12px] text-secondary/50 mb-3">من مواصفات السيارة، وليس من عنوان العرض</div>
                  <div className="flex flex-wrap gap-1.5 mb-3 px-1">
                    {([["2025 فقط", 2025, 2025], ["2024 وأحدث", 2024, undefined], ["2020 وأحدث", 2020, undefined]] as const).map(([l, a, b]) => (
                      <button key={l} onClick={() => setDy({ min: a, max: b })} className={`${dy.min === a && dy.max === b ? chipOn : "whitespace-nowrap rounded-md border px-2.5 py-0.5 border-secondary-darker/20 bg-blue-50/[0.04] text-secondary-darker"} h-8 text-[13px]`}>{l}</button>
                    ))}
                  </div>
                  <div className="flex gap-2 px-1">
                    {(["min", "max"] as const).map((k) => (
                      <label key={k} className="flex-1 text-[12px] text-secondary/60">{k === "min" ? "من" : "إلى"}
                        <select value={dy[k] ?? ""} onChange={(e) => setDy({ ...dy, [k]: e.target.value ? Number(e.target.value) : undefined })} className={sel}>
                          <option value="">الكل</option>
                          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </label>
                    ))}
                  </div>
                  <div className="p-1 pt-3"><button onClick={() => set({ ymin: dy.min, ymax: dy.max })} disabled={!previewY} className={applyBtn}>{previewY ? `عرض ${carsLabel(previewY)}` : "لا توجد نتائج"}</button></div>
                </Pop>
              </div>

              <div className="relative flex h-10 items-stretch rounded-xl border border-white/[0.08]">
                {/* MILEAGE — major fix: only real mileage values */}
                <button onClick={() => toggle("km", () => setDk({ max: f.kmax, unknown: f.unknown, custom: "" }))} className={`flex items-center gap-1.5 whitespace-nowrap px-3 text-sm font-medium rounded-s-xl ${f.kmax !== undefined ? "bg-secondary/[0.17] text-secondary/95" : "text-secondary/55 hover:bg-white/[0.06]"}`}>
                  <Gauge size={16} />{f.kmax !== undefined ? `حتى ${fmt(f.kmax)} كم` : "الممشى"}
                </button>
                <button onClick={() => toggle("fuel")} className={`flex items-center gap-1.5 whitespace-nowrap px-3 text-sm font-medium border-s border-white/[0.10] ${f.fuel ? "bg-secondary/[0.17] text-secondary/95" : "text-secondary/55 hover:bg-white/[0.06]"}`}>
                  <Fuel size={16} />{f.fuel ?? "الوقود"}
                </button>
                <button className="flex items-center gap-1.5 whitespace-nowrap px-3 text-sm font-medium border-s border-white/[0.10] text-secondary/55 rounded-e-xl hover:bg-white/[0.06]"><SlidersHorizontal size={16} />المزيد</button>
                <Pop open={open === "km"} onClose={() => setOpen(null)} w={330}>
                  <div className="px-1 pt-1 text-[14px] font-bold text-secondary mb-3">الممشى</div>
                  {[20000, 50000, 100000, 150000].map((k) => (
                    <button key={k} onClick={() => setDk({ ...dk, max: k, custom: "" })} className={optCls}>
                      <span className={`${box(!dk.custom && dk.max === k)} rounded-full`}>{!dk.custom && dk.max === k && <Check size={11} />}</span>حتى {fmt(k)} كم
                    </button>
                  ))}
                  <div className="mx-1 mt-1 flex items-center h-10 rounded-[10px] bg-background border border-secondary-input-gray px-3 gap-2 text-[14px]">
                    <span className="text-secondary/60">حتى</span>
                    <input value={dk.custom} onChange={(e) => setDk({ ...dk, custom: e.target.value.replace(/[^\d,]/g, "") })} placeholder="رقم آخر" className="flex-1 min-w-0 bg-transparent outline-none text-text-regular" dir="ltr" />
                    <span className="text-secondary/60">كم</span>
                  </div>
                  <label className="mx-1 mt-3 flex items-start gap-2 text-[13px] text-secondary/70 cursor-pointer">
                    <input type="checkbox" checked={dk.unknown} onChange={() => setDk({ ...dk, unknown: !dk.unknown })} className="mt-1 accent-[#46a6f0]" />
                    إظهار السيارات التي لم يذكر بائعها الممشى
                  </label>
                  <div className="p-1 pt-3"><button disabled={!kmDraft || !previewK} onClick={() => set({ kmax: kmDraft, unknown: dk.unknown })} className={applyBtn}>{kmDraft ? (previewK ? `عرض ${carsLabel(previewK)}` : "لا توجد نتائج") : "اختر الممشى"}</button></div>
                </Pop>
                <Pop open={open === "fuel"} onClose={() => setOpen(null)} w={220}>
                  {["الكل", "بنزين", "ديزل", "هايبرد"].map((t) => (
                    <button key={t} onClick={() => set({ fuel: t === "الكل" ? undefined : t })} className={optCls}><span className={box((f.fuel ?? "الكل") === t)}>{(f.fuel ?? "الكل") === t && <Check size={11} />}</span>{t}</button>
                  ))}
                </Pop>
              </div>

              <button className={`${pillBase} ${pillOff}`}><Video size={15} />فيديوهات فقط</button>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              {[Search, MessagesSquare, MapIcon].map((I, i) => (
                <button key={i} className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-blue-50/[0.04] text-secondary/70"><I size={16} /></button>
              ))}
            </div>
          </div>

          {/* result summary (new) */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[15px] text-secondary font-bold ms-1 me-2">{carsLabel(results.length)} تويوتا</span>
            {chips.map((c) => (
              <button key={c.label} onClick={() => set(c.clear)} className={`${chipOn} h-8 flex items-center gap-1.5 text-[13px]`}>{c.label}<X size={13} /></button>
            ))}
            {chips.length > 0 && <button onClick={() => setQ(new URLSearchParams())} className="text-[13px] text-secondary/50 hover:text-secondary underline">مسح الكل</button>}
            <div className="relative ms-auto">
              <button onClick={() => toggle("sort")} className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-[13px] text-secondary/60 hover:text-secondary"><ArrowUpDown size={14} />{sorters[f.sort]?.label}<ChevronDown size={13} /></button>
              <Pop open={open === "sort"} onClose={() => setOpen(null)} w={200} left>
                {Object.entries(sorters).map(([k, s]) => (
                  <button key={k} onClick={() => set({ sort: k === "new" ? undefined : k })} className={optCls}><span className={`${box(f.sort === k)} rounded-full`}>{f.sort === k && <Check size={11} />}</span>{s.label}</button>
                ))}
              </Pop>
            </div>
          </div>

          {(partsMatch > 0 || hiddenUnknown > 0) && (
            <div className="space-y-1.5">
              {partsMatch > 0 && (
                <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-blue-50/[0.03] px-4 py-2.5 text-[14px]">
                  <span className="flex items-center gap-2 text-secondary/80"><PackageOpen size={16} />{partsMatch === 1 ? "عرض قطع غيار واحد يناسب" : `${partsMatch} عروض قطع غيار وإكسسوارات تناسب`} تويوتا {yearLabel}، في قسمها الخاص</span>
                  <span className="text-text-primary flex items-center gap-1 cursor-pointer">قطع غيار وملحقات<ChevronLeft size={15} /></span>
                </div>
              )}
              {hiddenUnknown > 0 && (
                <div className="flex items-center justify-between rounded-xl border border-[rgb(var(--action))]/25 bg-[rgb(var(--action))]/[0.06] px-4 py-2.5 text-[14px]">
                  <span className="flex items-center gap-2 text-[rgb(var(--action))]/90"><Info size={16} />أخفينا {hiddenUnknown === 1 ? "سيارة واحدة" : carsLabel(hiddenUnknown)} لم يذكر بائعها الممشى</span>
                  <button onClick={() => set({ unknown: true })} className="text-[rgb(var(--action))] underline">إظهارها</button>
                </div>
              )}
            </div>
          )}

          <div className="box-border w-full relative">
            {results.length === 0 && <div className="rounded-lg bg-background-card p-12 text-center text-secondary/60">لا توجد عروض تطابق بحثك</div>}
            {results.map((c) => <PostRow key={c.id} c={c} to={`/haraj/listing/${c.id}?back=${encodeURIComponent(q.toString())}`} />)}
          </div>
        </div>
      </div>
    </HarajLayout>
  );
}
