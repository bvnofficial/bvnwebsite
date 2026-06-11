import { ImageResponse } from "next/og";

export const runtime = "edge";

// Brand accent palette — keep in sync with lib/og.ts theme keys
const THEMES: Record<string, string> = {
  orange: "#E86010",
  blue: "#60A5FA",
  green: "#34D399",
  rose: "#FB7185",
  yellow: "#FBBF24",
  purple: "#A78BFA",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const title = (searchParams.get("title") || "Global Marketing & Operations Automation Agency").slice(0, 130);
  const eyebrow = (searchParams.get("eyebrow") || "BVN").slice(0, 42);
  const accent = THEMES[searchParams.get("theme") || "orange"] ?? THEMES.orange;

  // Scale the title down for longer strings so it never overflows the canvas
  const titleSize = title.length > 78 ? 52 : title.length > 48 ? 62 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0F1E",
          padding: "72px 80px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Decorative accent shapes (solid + opacity — Satori-safe, no gradients) */}
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -180,
            width: 720,
            height: 720,
            borderRadius: 9999,
            background: accent,
            opacity: 0.12,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -60,
            right: 60,
            width: 320,
            height: 320,
            borderRadius: 9999,
            background: accent,
            opacity: 0.1,
            display: "flex",
          }}
        />

        {/* Top: wordmark */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 800, color: "#fff", letterSpacing: -1 }}>
            BVN
          </div>
          <div
            style={{
              width: 13,
              height: 13,
              borderRadius: 9999,
              background: accent,
              marginLeft: 12,
              marginTop: 10,
              display: "flex",
            }}
          />
        </div>

        {/* Middle: eyebrow + title */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1010 }}>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 700,
              color: accent,
              textTransform: "uppercase",
              letterSpacing: 4,
              marginBottom: 26,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: titleSize,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.12,
              letterSpacing: -1.5,
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom: url + accent bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 28, color: "rgba(255,255,255,0.55)", letterSpacing: 0.5 }}>
            bvnofficial.com
          </div>
          <div style={{ display: "flex", width: 140, height: 6, borderRadius: 9999, background: accent }} />
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
