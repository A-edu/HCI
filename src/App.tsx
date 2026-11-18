import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Calculator from "./spl/Calculator";
import Ship from "./spl/Ship";
import { ShipmentProvider } from "./spl/shipment";
import Business from "./spl/business/Business";
import ShipForBusiness from "./spl/business/ShipForBusiness";
import Signup from "./spl/business/Signup";
import Contract from "./spl/business/Contract";
import HarajFilters from "./haraj/Filters";
import HarajListing from "./haraj/Listing";
import HarajPost from "./haraj/Post";

export default function App() {
  return (
    <ShipmentProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/spl/calculator" element={<Calculator />} />
        <Route path="/spl/calculator/ship" element={<Ship />} />
        <Route path="/spl/business" element={<Business />} />
        <Route path="/spl/business/ship" element={<ShipForBusiness />} />
        <Route path="/spl/business/signup" element={<Signup />} />
        <Route path="/spl/business/contract" element={<Contract />} />
        <Route path="/haraj/filters" element={<HarajFilters />} />
        <Route path="/haraj/listing/:id" element={<HarajListing />} />
        <Route path="/haraj/post" element={<HarajPost />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ShipmentProvider>
  );
}
