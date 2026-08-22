"use client";

import { html } from "./content";

export default function RaetzerGrowthConsolePage() {
  return (
    <iframe
      title="Raetzer PLLC — Private Capital Growth Console"
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
