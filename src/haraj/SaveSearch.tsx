import { useState } from "react";
import { Bell, X, Zap, CalendarClock, Smartphone, Check } from "lucide-react";
import { critChips, critName, type Crit } from "./search";
import { addAlert, showToast } from "./alerts";
import { cars as carsLabel } from "./data";

const radio = (on: boolean) =>
  `flex-1 flex items-start gap-3 rounded-xl border p-3.5 text-start transition-colors ${on ? "border-secondary/50 bg-secondary/[0.14]" : "border-white/[0.08] hover:bg-white/[0.04]"}`;

/** "Alert me about new listings" – saves the whole search, filters included. */
export function SaveSearchDialog({ crit, count, onClose }: { crit: Crit; count: number; onClose: () => void }) {
  const [name, setName] = useState(critName(crit));
  const [freq, setFreq] = useState<"instant" | "daily">("instant");
  const [push, setPush] = useState(true);
  const chips = critChips(crit);
  const onlyBrand = chips.length === 1;

  const save = () => {
    addAlert({ name: name.trim() || critName(crit), crit, source: "search", freq, push });
    onClose();
    showToast({ text: `تم حفظ التنبيه «${name.trim() || critName(crit)}»`, to: "/haraj/alerts", linkLabel: "إدارة التنبيهات" });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-[2px]" onClick={onClose}>
      <div className="w-[520px] max-w-[92vw] rounded-2xl border border-white/[0.08] bg-background-card shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-text-primary"><Bell size={19} /></span>
            <div>
              <div className="text-[19px] font-bold text-white">نبّهني بالعروض الجديدة</div>
              <div className="text-[13px] text-secondary/60">نرسل لك كل عرض جديد يطابق هذا البحث</div>
            </div>
          </div>
          <button onClick={onClose} className="text-secondary/50 hover:text-secondary"><X size={20} /></button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div>
            <div className="mb-2 text-[13px] text-secondary/70">البحث الذي سنتابعه لك</div>
            <div className="flex flex-wrap gap-1.5">
              {chips.map((c) => (
                <span key={c} className="rounded-md border border-secondary/45 bg-secondary/[0.17] px-2.5 py-1 text-[13.5px] font-medium text-secondary/95">{c}</span>
              ))}
            </div>
            <div className="mt-2 text-[13px] text-secondary/55">
              {onlyBrand ? "بدون فلاتر ستصلك كل سيارات تويوتا الجديدة. أضف فلتراً لتقليل التنبيهات." : `يطابقه الآن ${carsLabel(count)}. سننبهك بالجديد فقط.`}
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-[13px] text-secondary/70">اسم التنبيه</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="h-11 w-full rounded-[10px] border border-secondary-input-gray bg-background px-3 text-[15px] text-text-regular outline-none focus:border-secondary" />
          </label>

          <div>
            <div className="mb-2 text-[13px] text-secondary/70">متى ننبهك؟</div>
            <div className="flex gap-2">
              <button onClick={() => setFreq("instant")} className={radio(freq === "instant")}>
                <Zap size={18} className="mt-0.5 shrink-0 text-[rgb(var(--action))]" />
                <span><span className="block text-[14.5px] font-medium text-white">فوراً</span><span className="block text-[12.5px] text-secondary/60">أول ما يُنشر العرض</span></span>
              </button>
              <button onClick={() => setFreq("daily")} className={radio(freq === "daily")}>
                <CalendarClock size={18} className="mt-0.5 shrink-0 text-secondary" />
                <span><span className="block text-[14.5px] font-medium text-white">ملخص يومي</span><span className="block text-[12.5px] text-secondary/60">رسالة واحدة الساعة 8 مساءً</span></span>
              </button>
            </div>
          </div>

          <button onClick={() => setPush(!push)} className="flex w-full items-center gap-3 rounded-xl border border-white/[0.08] px-3.5 py-3 text-start">
            <Smartphone size={18} className="text-secondary" />
            <span className="flex-1"><span className="block text-[14.5px] text-white">إشعار على الجوال أيضاً</span><span className="block text-[12.5px] text-secondary/60">بالإضافة إلى إشعارات حراج</span></span>
            <span className={`flex h-5 w-5 items-center justify-center rounded border ${push ? "border-text-primary bg-text-primary text-background" : "border-secondary-input-gray"}`}>{push && <Check size={13} />}</span>
          </button>
        </div>

        <div className="flex gap-2 border-t border-white/[0.08] px-6 py-4">
          <button onClick={save} className="h-11 flex-1 rounded-[10px] bg-primary font-medium text-white hover:bg-primary-darker">حفظ التنبيه</button>
          <button onClick={onClose} className="h-11 rounded-[10px] border border-secondary-input-gray px-6 text-secondary">إلغاء</button>
        </div>
      </div>
    </div>
  );
}
