"use client";

// Serve the local copy of the client's site: faithful to the live draft, but
// with the real working Readiness Assessment embedded in the page (every "take
// the assessment" CTA scrolls to it) and the builder analytics stripped. This
// also works offline from the Desktop package.
export default function RaetzerWebsitePage() {
  return (
    <iframe
      title="Raetzer PLLC — Website"
      src="/raetzer-website/index.html"
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
