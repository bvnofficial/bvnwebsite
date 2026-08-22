"use client";

import { html } from "./content";

export default function RaetzerGrowthConsolePage() {
  return (
    <iframe
      title="Raetzer PLLC — Private Capital Growth Console"
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
