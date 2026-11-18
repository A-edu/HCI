import { useSyncExternalStore } from "react";
import type { Car } from "./data";
import { apply, critKey, type Crit } from "./search";

/** A saved search ("تنبيه") or a followed "similar listings" set. Kept in the browser so it survives reloads. */
export type Alert = {
  id: string;
  name: string;
  crit: Crit;
  source: "search" | "similar";
  freq: "instant" | "daily";
  push: boolean;
  active: boolean;
  created: number;
  seen: string[]; // listing ids the user has already opened from a notification
};

const KEY = "hj-alerts-v1";
// Listings posted within this many minutes count as having arrived after the search was saved.
export const FRESH_MIN = 60;

function load(): Alert[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
let state: Alert[] = load();
const subs = new Set<() => void>();
function save(next: Alert[]) {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* private mode: keep in memory */ }
  subs.forEach((f) => f());
}
const subscribe = (f: () => void) => { subs.add(f); return () => subs.delete(f); };

export function useAlerts() {
  return useSyncExternalStore(subscribe, () => state);
}

export const findByCrit = (crit: Crit, source?: Alert["source"]) =>
  state.find((a) => critKey(a.crit) === critKey(crit) && (!source || a.source === source));

export function addAlert(a: Omit<Alert, "id" | "created" | "seen" | "active">) {
  const al: Alert = { ...a, id: Math.random().toString(36).slice(2, 9), created: Date.now(), seen: [], active: true };
  save([al, ...state]);
  return al;
}
export const updateAlert = (id: string, patch: Partial<Alert>) => save(state.map((a) => (a.id === id ? { ...a, ...patch } : a)));
export const removeAlert = (id: string) => save(state.filter((a) => a.id !== id));
export const markSeen = (id: string, carId: string) =>
  save(state.map((a) => (a.id === id && !a.seen.includes(carId) ? { ...a, seen: [...a.seen, carId] } : a)));
/** Opening a listing reads it in every alert that matched it. */
export const markCarSeen = (carId: string) => {
  if (!state.some((a) => !a.seen.includes(carId) && freshFor(a).some((c) => c.id === carId))) return;
  save(state.map((a) => (!a.seen.includes(carId) && freshFor(a).some((c) => c.id === carId) ? { ...a, seen: [...a.seen, carId] } : a)));
};
export const markAllSeen = () => save(state.map((a) => ({ ...a, seen: freshFor(a).map((c) => c.id) })));
export const resetAlerts = () => save([]);

export const matchesFor = (a: Alert) => apply(a.crit);
export const freshFor = (a: Alert): Car[] => matchesFor(a).filter((c) => c.ago <= FRESH_MIN).sort((x, y) => x.ago - y.ago);

export type Note = { alert: Alert; car: Car; unread: boolean };
export function notesOf(alerts: Alert[]): Note[] {
  const seenCar = new Set<string>();
  return alerts
    .filter((a) => a.active)
    .flatMap((a) => freshFor(a).map((car) => ({ alert: a, car, unread: !a.seen.includes(car.id) })))
    .filter((n) => !seenCar.has(n.car.id) && !!seenCar.add(n.car.id)) // one notification per listing
    .sort((x, y) => x.car.ago - y.car.ago);
}

/* ── toast ── */
export type Toast = { text: string; to?: string; linkLabel?: string } | null;
let toast: Toast = null;
let timer: number | undefined;
const tsubs = new Set<() => void>();
export function showToast(t: NonNullable<Toast>) {
  toast = t; tsubs.forEach((f) => f());
  window.clearTimeout(timer);
  timer = window.setTimeout(() => { toast = null; tsubs.forEach((f) => f()); }, 4500);
}
export function useToast() {
  return useSyncExternalStore((f) => { tsubs.add(f); return () => tsubs.delete(f); }, () => toast);
}
