import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Dest, Service, ShipType } from "./pricing";

export interface Shipment {
  type: ShipType;
  dest: Dest;
  from: string;
  to: string;
  chargeableKg: number;
  service: Service;
}

const Ctx = createContext<{ shipment: Shipment | null; setShipment: (s: Shipment | null) => void }>({
  shipment: null,
  setShipment: () => {},
});

const KEY = "spl-shipment";

export function ShipmentProvider({ children }: { children: ReactNode }) {
  const [shipment, setShipment] = useState<Shipment | null>(() => {
    try { return JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch { return null; }
  });
  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify(shipment)); } catch { /* ignore */ }
  }, [shipment]);
  return <Ctx.Provider value={{ shipment, setShipment }}>{children}</Ctx.Provider>;
}

export const useShipment = () => useContext(Ctx);
