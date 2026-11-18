import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, BellRing, BellOff, Pencil, Trash2, Search, Plus, Zap, CalendarClock, Smartphone, ChevronLeft, Layers } from "lucide-react";
import { HarajLayout, Photo } from "./HarajLayout";
import { useAlerts, updateAlert, removeAlert, freshFor, matchesFor, markSeen, resetAlerts, showToast, notesOf, type Alert } from "./alerts";
import { critChips, critQuery } from "./search";
import { fmt, timeAgo, cars as carsLabel } from "./data";

const newLabel = (n: number) => (n === 1 ? "عرض جديد" : n === 2 ? "عرضان جديدان" : n <= 10 ? `${n} عروض جديدة` : `${n} عرضاً جديداً`);
const START = "/haraj/search?ymin=2025&ymax=2025&kmax=50000";

function Switch({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button role="switch" aria-checked={on} onClick={onChange} className={`relative h-[22px] w-[40px] shrink-0 rounded-full transition-colors ${on ? "bg-text-title" : "bg-secondary-input-gray/70"}`}>
      <span className={`absolute top-[3px] h-4 w-4 rounded-full bg-white transition-all ${on ? "right-[3px]" : "right-[21px]"}`} />
    </button>
  );
}

function AlertCard({ a }: { a: Alert }) {
  const nav = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(a.name);
  const [confirm, setConfirm] = useState(false);
  const all = matchesFor(a);
  const fresh = freshFor(a);
  const unread = fresh.filter((c) => !a.seen.includes(c.id)).length;
  const results = `/haraj/search?${critQuery(a.crit)}`;

  return (
    <div className={`rounded-2xl border bg-background-card p-5 transition-opacity ${a.active ? "border-white/[0.06]" : "border-white/[0.04] opacity-60"}`}>
      <div className="flex items-start gap-4">
        <span className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${a.active ? "bg-text-title/[0.14] text-text-title" : "bg-white/[0.06] text-secondary/50"}`}>
          {a.active ? <BellRing size={20} /> : <BellOff size={20} />}
        </span>

        <div className="min-w-0 flex-1">
          {editing ? (
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); updateAlert(a.id, { name: name.trim() || a.name }); setEditing(false); }}>
              <input autoFocus value={name} onChange={(e) => setName(e.target.value)} className="h-10 flex-1 rounded-[10px] border border-secondary bg-background px-3 text-[16px] text-white outline-none" />
              <button className="h-10 rounded-[10px] bg-primary px-4 text-white">حفظ</button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <span className="truncate text-[18px] font-bold text-white">{a.name}</span>
              <button onClick={() => setEditing(true)} className="text-secondary/45 hover:text-secondary" aria-label="تعديل الاسم"><Pencil size={15} /></button>
              {a.active && unread > 0 && <span className="rounded-full bg-danger px-2 py-0.5 text-[12px] font-bold text-white">{unread} جديد</span>}
            </div>
          )}

          <div className="mt-2 flex flex-wrap gap-1.5">
            {critChips(a.crit).map((c) => <span key={c} className="rounded-md border border-secondary/35 bg-secondary/[0.12] px-2 py-0.5 text-[13px] text-secondary/90">{c}</span>)}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-secondary/60">
            <span className="flex items-center gap-1.5">
              {a.freq === "instant" ? <Zap size={14} /> : <CalendarClock size={14} />}
              <select value={a.freq} onChange={(e) => updateAlert(a.id, { freq: e.target.value as Alert["freq"] })} className="bg-transparent text-secondary/80 outline-none">
                <option value="instant">فوراً</option>
                <option value="daily">ملخص يومي</option>
              </select>
            </span>
            <button onClick={() => updateAlert(a.id, { push: !a.push })} className="flex items-center gap-1.5 hover:text-secondary">
              <Smartphone size={14} />{a.push ? "إشعارات حراج + الجوال" : "إشعارات حراج فقط"}
            </button>
            <span className="flex items-center gap-1.5"><Layers size={14} />يطابقه الآن {carsLabel(all.length)}</span>
          </div>

          {a.active && fresh.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {fresh.slice(0, 3).map((c) => (
                <button key={c.id} onClick={() => { markSeen(a.id, c.id); nav(`/haraj/listing/${c.id}?from=search&back=${encodeURIComponent(critQuery(a.crit))}`); }} className="flex gap-2 rounded-xl bg-background/60 p-2 text-start hover:bg-background">
                  <Photo src={c.img} alt="" className="h-14 w-14 shrink-0 rounded-lg" />
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-medium text-text-title">{c.title}</span>
                    <span className="block text-[12px] text-secondary/55">{c.city}{c.price ? ` · ${fmt(c.price)}` : ""}</span>
                    <span className="flex items-center gap-1 text-[12px] text-secondary/55">{timeAgo(c.ago)}{!a.seen.includes(c.id) && <span className="h-1.5 w-1.5 rounded-full bg-text-primary" />}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-3">
          <label className="flex items-center gap-2 text-[13px] text-secondary/70">{a.active ? "مفعّل" : "موقوف"}<Switch on={a.active} onChange={() => { updateAlert(a.id, { active: !a.active }); showToast({ text: a.active ? `أوقفت تنبيه «${a.name}»` : `فعّلت تنبيه «${a.name}»` }); }} /></label>
          <Link to={results} className="flex items-center gap-1 text-[14px] text-text-primary hover:underline">عرض النتائج<ChevronLeft size={15} /></Link>
          {confirm ? (
            <span className="flex items-center gap-2 text-[13px]">
              <span className="text-secondary/70">حذف؟</span>
              <button onClick={() => { removeAlert(a.id); showToast({ text: `حذفت «${a.name}»` }); }} className="text-danger">نعم</button>
              <button onClick={() => setConfirm(false)} className="text-secondary/60">لا</button>
            </span>
          ) : (
            <button onClick={() => setConfirm(true)} className="flex items-center gap-1 text-[13px] text-secondary/45 hover:text-danger"><Trash2 size={14} />حذف</button>
          )}
        </div>
      </div>
    </div>
  );
}

function Empty({ icon, title, text, cta }: { icon: ReactNode; title: string; text: string; cta?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/[0.10] px-6 py-10 text-center">
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.05] text-secondary/60">{icon}</span>
      <div className="font-bold text-secondary">{title}</div>
      <div className="mt-1 max-w-md text-[14px] text-secondary/55">{text}</div>
      {cta && <div className="mt-4">{cta}</div>}
    </div>
  );
}

export default function Alerts() {
  const alerts = useAlerts();
  const [q, setQ] = useSearchParams();
  useEffect(() => { if (q.has("reset")) { resetAlerts(); setQ(new URLSearchParams(), { replace: true }); } }, []); // eslint-disable-line
  const searches = alerts.filter((a) => a.source === "search");
  const similar = alerts.filter((a) => a.source === "similar");
  const unread = notesOf(alerts).filter((n) => n.unread).length;

  return (
    <HarajLayout title="التنبيهات والمتابعة" showNav={false}>
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-6">
        <div className="mb-6 flex items-center gap-3">
          <Link to="/haraj/search" className="text-text-primary"><ArrowRight size={26} /></Link>
          <h1 className="text-[26px] font-bold text-white">التنبيهات والمتابعة</h1>
          {unread > 0 && <span className="rounded-full bg-danger px-2.5 py-0.5 text-[13px] font-bold text-white">{newLabel(unread)}</span>}
        </div>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-[19px] font-bold text-secondary">تنبيهات البحث</h2>
              <p className="text-[13.5px] text-secondary/55">يحفظ التنبيه البحث كاملاً بفلاتره، وننبهك بكل عرض جديد يطابقه</p>
            </div>
            <Link to={START} className="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-[14px] font-medium text-white hover:bg-primary-darker"><Plus size={16} />تنبيه جديد</Link>
          </div>
          <div className="space-y-3">
            {searches.length === 0
              ? <Empty icon={<Search size={20} />} title="لا توجد تنبيهات بحث بعد" text="ابحث عن ما تريد، اختر الفلاتر، ثم اضغط «نبّهني بالعروض الجديدة» في أعلى النتائج." cta={<Link to={START} className="text-text-primary hover:underline">ابدأ بحثاً</Link>} />
              : searches.map((a) => <AlertCard key={a.id} a={a} />)}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-3">
            <h2 className="text-[19px] font-bold text-secondary">العروض المشابهة التي تتابعها</h2>
            <p className="text-[13.5px] text-secondary/55">من زر «متابعة العروض المشابهة» في صفحة أي عرض</p>
          </div>
          <div className="space-y-3">
            {similar.length === 0
              ? <Empty icon={<BellRing size={20} />} title="لا تتابع عروضاً مشابهة" text="افتح أي عرض واضغط «متابعة العروض المشابهة» ليصلك الجديد من نفس الطراز والموديل." />
              : similar.map((a) => <AlertCard key={a.id} a={a} />)}
          </div>
        </section>
      </div>
    </HarajLayout>
  );
}
