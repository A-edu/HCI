import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowRight, Bell, BellRing, Phone, Handshake, Mail, Heart, Share2, Flag } from "lucide-react";
import { HarajLayout, Photo } from "./HarajLayout";
import { Img } from "./asset";
import { IcPin, IcClock, IcRiyal, Avatar } from "./icons";
import { LISTINGS, fmt, timeAgo, type Car } from "./data";
import { critChips, type Crit } from "./search";
import { useEffect } from "react";
import { useAlerts, findByCrit, addAlert, removeAlert, showToast, markCarSeen } from "./alerts";

export default function Listing() {
  const { id } = useParams();
  const [q] = useSearchParams();
  const back = q.get("back") ?? "";
  const from = q.get("from") === "search" ? "search" : "filters";
  const keep = `back=${encodeURIComponent(back)}${from === "search" ? "&from=search" : ""}`;
  useAlerts();
  useEffect(() => { if (id) markCarSeen(id); }, [id]);
  const c = LISTINGS.find((l) => l.id === id && l.kind === "car") as Car | undefined;
  if (!c) return <HarajLayout title="غير موجود" showNav={false}><div className="p-20 text-center">العرض غير موجود</div></HarajLayout>;
  const similar = LISTINGS.filter((l): l is Car => l.kind === "car" && l.id !== c.id && (l.model === c.model || Math.abs(l.year - c.year) <= 1)).slice(0, 6);

  const rows: [string, string][] = [
    ["الماركة", c.brand], ["الطراز", c.model], ["الموديل", String(c.year)],
    ["الممشى", c.km === null ? "غير مذكور" : c.km === 0 ? "جديدة" : `${fmt(c.km)} كم`],
    ["القير", c.trans ?? ""], ["الوقود", c.fuel ?? ""], ["اللون", c.colorName ?? ""], ["المدينة", c.city],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <HarajLayout title={c.title} showNav={false}>
      <div className="mx-auto max-w-7xl px-4 pt-4 pb-10">
        <div className="flex items-center gap-3 text-[13px] text-secondary/60">
          <Link to={`/haraj/${from}${back ? `?${back}` : ""}`} className="text-text-primary"><ArrowRight size={26} /></Link>
          <span>حراج السيارات</span>/<span>تويوتا</span>/<span>{c.model}</span>/<span className="text-secondary/80">{c.title}</span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-5 items-start">
          <div className="col-span-2 space-y-4">
            <div className="rounded-xl bg-background-card p-5">
              <h1 className="text-[26px] font-bold text-text-title">{c.title}</h1>
              <div className="mt-3 flex items-center gap-5 text-[14px]">
                <span className="flex items-center gap-1 text-text-primary"><IcPin />{c.city}</span>
                <span className="flex items-center gap-1"><IcClock className="text-[12px]" /> {timeAgo(c.ago)}</span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <Avatar name={c.seller} size={30} />
                <span className="text-text-primary text-[15px]">{c.seller}</span>
                <span className="rounded-full bg-primary px-3 py-0.5 text-[12px] text-white">متابعة</span>
              </div>
            </div>

            <div className="px-1">
              {c.price && (
                <div dir="ltr" className="inline-flex items-center gap-1 text-[22px] font-bold text-text-primary">
                  <span className="tabular-nums">{fmt(c.price)}</span><IcRiyal className="fill-text-primary h-[1.6rem]" />
                </div>
              )}
            </div>

            {/* structured specs (new) */}
            <div className="rounded-xl border border-white/[0.08] bg-blue-50/[0.03]">
              <div className="px-5 pt-4 pb-2 font-bold text-secondary">مواصفات السيارة</div>
              <dl className="grid grid-cols-4">
                {rows.map(([k, v]) => (
                  <div key={k} className="px-5 py-3 border-t border-white/[0.06]">
                    <dt className="text-[12px] text-secondary/50">{k}</dt>
                    <dd className={`text-[16px] mt-0.5 ${v === "غير مذكور" ? "text-[rgb(var(--action))]" : "text-white/90"}`}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <p className="px-1 text-[20px] leading-[1.9] text-white/90 whitespace-pre-line">{c.desc}</p>

            {(c.imgs ?? [c.img]).map((src, i) => (
              (src ? <Img key={i} src={src} alt={`${c.title} – صورة ${i + 1}`} loading="lazy" className="w-full max-h-[760px] object-contain rounded-lg bg-background-darker" /> : null)
            ))}

            <div className="flex gap-3 pt-2">
              <button className="h-11 px-6 rounded-[10px] border border-secondary-input-gray text-secondary flex items-center gap-2"><Handshake size={17} /> ارسل سومتك</button>
              <button className="h-11 px-8 rounded-[10px] bg-primary text-white flex items-center gap-2"><Phone size={17} /> تواصل</button>
            </div>
            <div className="grid grid-cols-4 rounded-xl border border-white/[0.08] text-[14px] text-secondary/70">
              {([[Mail, "مراسلة"], [Heart, "تفضيل"], [Share2, "مشاركة"], [Flag, "بلاغ"]] as const).map(([I, l]) => (
                <span key={l} className="h-11 flex items-center justify-center gap-1.5 border-s first:border-s-0 border-white/[0.08]"><I size={15} />{l}</span>
              ))}
            </div>
          </div>

          <aside className="col-span-1 space-y-3">
            <FollowSimilar c={c} />
            <div className="rounded-xl bg-background-card p-3">
              <div className="font-bold text-secondary mb-3 px-1">عروض مشابهة</div>
              <div className="grid grid-cols-2 gap-2">
                {similar.map((s) => (
                  <Link key={s.id} to={`/haraj/listing/${s.id}?${keep}`} className="block">
                    <Photo src={s.img} alt={s.title} className="w-full h-[110px] rounded-md" />
                    <div className="mt-1 text-[12.5px] text-secondary/80 line-clamp-1">{s.title}</div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </HarajLayout>
  );
}

/** Follow similar listings: saved for real, says exactly what is followed, and links to where it is managed. */
function FollowSimilar({ c }: { c: Car }) {
  const crit: Crit = { model: c.model, ymin: c.year, ymax: c.year };
  const label = `${c.model} ${c.year}`;
  const followed = findByCrit(crit, "similar");

  if (!followed) {
    return (
      <button
        onClick={() => {
          addAlert({ name: label, crit, source: "similar", freq: "instant", push: true });
          markCarSeen(c.id); // the listing you are on is not "new"
          showToast({ text: `تتابع الآن عروض ${label}. سننبهك بأي عرض جديد`, to: "/haraj/alerts", linkLabel: "إدارة المتابعات" });
        }}
        className="w-full rounded-xl border border-white/[0.08] px-3 py-2.5 text-text-primary hover:bg-white/[0.04]"
      >
        <span className="flex items-center justify-center gap-2"><Bell size={16} /> متابعة العروض المشابهة</span>
        <span className="mt-0.5 block text-[12px] text-secondary/50">تويوتا {label} · ننبهك بالجديد</span>
      </button>
    );
  }
  return (
    <div className="rounded-xl border border-text-title/35 bg-text-title/[0.08] p-3.5">
      <div className="flex items-center gap-2 font-medium text-text-title"><BellRing size={16} />تتابع العروض المشابهة</div>
      <div className="mt-2 flex flex-wrap gap-1">
        {critChips(crit).map((ch) => <span key={ch} className="rounded-md border border-secondary/30 bg-secondary/[0.10] px-2 py-0.5 text-[12px] text-secondary/90">{ch}</span>)}
      </div>
      <div className="mt-2 text-[12.5px] text-secondary/60">سننبهك فوراً بأي عرض جديد يطابقها</div>
      <div className="mt-3 flex items-center justify-between text-[13px]">
        <Link to="/haraj/alerts" className="text-text-primary hover:underline">إدارة المتابعات</Link>
        <button onClick={() => { removeAlert(followed.id); showToast({ text: `ألغيت متابعة ${label}` }); }} className="text-secondary/50 hover:text-secondary">إلغاء المتابعة</button>
      </div>
    </div>
  );
}
