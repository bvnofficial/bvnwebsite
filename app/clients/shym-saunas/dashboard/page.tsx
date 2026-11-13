"use client";

import { html } from "./content";

export default function ShymSaunasDashboardPage() {
  return (
    <iframe
      title="Shym Saunas · CEO and Marketing Dashboard"
      srcDoc={html}
      allow="clipboard-write"
      style={{
        display: "block",
        width: "100%",
        height: "100vh",
        border: "none",
        background: "#141110",
      }}
    />
  );
}
