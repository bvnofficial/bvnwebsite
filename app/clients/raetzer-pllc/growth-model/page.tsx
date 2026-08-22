"use client";

import { html } from "./content";

export default function RaetzerGrowthModelPage() {
  return (
    <iframe
      title="Raetzer PLLC — Raise Readiness Growth Model"
      srcDoc={html}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        border: "none",
        background: "#EAEDF2",
      }}
    />
  );
}
