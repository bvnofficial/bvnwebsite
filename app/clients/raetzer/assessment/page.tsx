"use client";

import { html } from "./content";

export default function RaetzerAssessmentPage() {
  return (
    <iframe
      title="Raetzer PLLC — Private Capital Raise Readiness Assessment"
      srcDoc={html}
      style={{
        display: "block",
        width: "100%",
        height: "100vh",
        border: "none",
        background: "#ECEEF2",
      }}
    />
  );
}
