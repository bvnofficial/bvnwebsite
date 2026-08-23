"use client";

import { html } from "./content";

export default function RaetzerHubPage() {
  return (
    <iframe
      title="Raetzer Growth System"
      srcDoc={html}
      style={{
        display: "block",
        width: "100%",
        height: "100vh",
        border: "none",
        background: "#0A1020",
      }}
    />
  );
}
