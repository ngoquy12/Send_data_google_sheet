import React from "react";
import "./index.css";

export default function Loader() {
  return (
    <div
      className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
    >
      <span className="loader"></span>
    </div>
  );
}
