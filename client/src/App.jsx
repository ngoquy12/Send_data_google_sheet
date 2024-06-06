import React from "react";
import { Routes, Route } from "react-router-dom";
import Timekeeping from "./pages/Timekeeping";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/cham-cong" element={<Timekeeping />} />
      </Routes>
    </>
  );
}
