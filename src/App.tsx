import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Calculator from "./spl/Calculator";
import Ship from "./spl/Ship";
import { ShipmentProvider } from "./spl/shipment";

export default function App() {
  return (
    <ShipmentProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/spl/calculator" element={<Calculator />} />
        <Route path="/spl/calculator/ship" element={<Ship />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ShipmentProvider>
  );
}
