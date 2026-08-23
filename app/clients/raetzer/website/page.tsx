"use client";

// Embed the client's live site so the preview is always the real, current draft:
// exact styling, correct sizing, and a fully working menu. A static snapshot is
// kept at /raetzer-website/index.html as a fallback if the live sandbox is down.
export default function RaetzerWebsitePage() {
  return (
    <iframe
      title="Raetzer PLLC — Website"
      src="https://raetzer.marblism.me/"
      style={{
        display: "block",
        width: "100%",
        height: "100vh",
        border: "none",
        background: "#ffffff",
      }}
    />
  );
}
