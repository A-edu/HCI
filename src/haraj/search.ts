import { LISTINGS, fmt, type Car } from "./data";

export const allCars = LISTINGS.filter((l): l is Car => l.kind === "car");

/** A search: Toyota cars narrowed by these fields (all optional). */
export type Crit = { model?: string; ymin?: number; ymax?: number; kmax?: number; unknown?: boolean; city?: string; fuel?: string };
export type F = Crit & { unknown: boolean; sort: string };

export function readFilters(q: URLSearchParams): F {
  const n = (k: string) => (q.get(k) ? Number(q.get(k)) : undefined);
  return {
    model: q.get("model") || undefined,
    ymin: n("ymin"), ymax: n("ymax"), kmax: n("kmax"),
    unknown: q.get("unknown") === "1",
    city: q.get("city") || undefined, fuel: q.get("fuel") || undefined,
    sort: q.get("sort") || "new",
  };
}

export function apply(f: Crit, list: Car[] = allCars) {
  return list.filter((c) =>
    (!f.model || c.model === f.model) &&
    (f.ymin === undefined || c.year >= f.ymin) &&
    (f.ymax === undefined || c.year <= f.ymax) &&
    (f.kmax === undefined || (c.km === null ? !!f.unknown : c.km <= f.kmax)) &&
    (!f.city || c.city === f.city) &&
    (!f.fuel || c.fuel === f.fuel)
  );
}

/** Only the fields that narrow the search (drops sort, empty values). */
export function critOf(f: Crit): Crit {
  const c: Crit = {};
  if (f.model) c.model = f.model;
  if (f.ymin !== undefined) c.ymin = f.ymin;
  if (f.ymax !== undefined) c.ymax = f.ymax;
  if (f.kmax !== undefined) c.kmax = f.kmax;
  if (f.kmax !== undefined && f.unknown) c.unknown = true;
  if (f.city) c.city = f.city;
  if (f.fuel) c.fuel = f.fuel;
  return c;
}

export const critKey = (c: Crit) => JSON.stringify(critOf(c), Object.keys(critOf(c)).sort());

export function critQuery(c: Crit) {
  const q = new URLSearchParams();
  Object.entries(critOf(c)).forEach(([k, v]) => q.set(k, v === true ? "1" : String(v)));
  return q.toString();
}

export function yearLabel(c: Crit) {
  return c.ymin && c.ymax ? (c.ymin === c.ymax ? `${c.ymin}` : `${c.ymin} – ${c.ymax}`) : c.ymin ? `${c.ymin} وأحدث` : c.ymax ? `حتى ${c.ymax}` : null;
}

/** Human-readable chips for a search, e.g. ["تويوتا", "موديل 2025", "الممشى حتى 50,000 كم"]. */
export function critChips(c: Crit): string[] {
  const out = [c.model ? `تويوتا ${c.model}` : "تويوتا"];
  const y = yearLabel(c);
  if (y) out.push(`موديل ${y}`);
  if (c.kmax !== undefined) out.push(`الممشى حتى ${fmt(c.kmax)} كم`);
  if (c.fuel) out.push(c.fuel);
  if (c.city) out.push(c.city);
  return out;
}

/** A short default name for a saved search, e.g. "تويوتا 2025 · حتى 50 ألف كم". */
export function critName(c: Crit) {
  const parts = [c.model ? c.model : "تويوتا"];
  const y = yearLabel(c);
  if (y) parts.push(y);
  let s = parts.join(" ");
  const extra: string[] = [];
  if (c.kmax !== undefined) extra.push(`حتى ${c.kmax >= 1000 ? `${fmt(c.kmax / 1000)} ألف` : fmt(c.kmax)} كم`);
  if (c.city) extra.push(c.city);
  if (c.fuel) extra.push(c.fuel);
  if (extra.length) s += " · " + extra.join(" · ");
  return s;
}
