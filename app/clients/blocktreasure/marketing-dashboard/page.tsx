"use client";

import { html } from "./content";

export default function BlockTreasureMarketingDashboardPage() {
  return (
    <iframe
      title="Block Treasure N.V. · Campaign Dashboard"
      srcDoc={html}
      allow="clipboard-write"
      style={{
        display: "block",
        width: "100%",
        height: "100vh",
        border: "none",
        background: "#070B14",
      }}
    />
  );
}
