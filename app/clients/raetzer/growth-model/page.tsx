"use client";

import { html } from "./content";

export default function RaetzerGrowthModelPage() {
  return (
    <iframe
      title="Raetzer PLLC — Raise Readiness Growth Model"
      srcDoc={html}
      style={{
        display: "block",
        width: "100%",
        height: "100vh",
        border: "none",
        background: "#EAEDF2",
      }}
    />
  );
}
