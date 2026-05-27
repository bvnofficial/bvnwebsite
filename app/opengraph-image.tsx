import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BVN — Marketing & Operations Automation Agency Philippines";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0A0F1E 0%, #1B3060 60%, #0A0F1E 100%)",
          position: "relative",
          overflow: "hidden",
          fontFamily: "sans-serif",
        }}
      >
        {/* Grid background pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(232,96,16,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(232,96,16,0.07) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Orange glow top */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "400px",
            background: "radial-gradient(ellipse, rgba(232,96,16,0.35) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0px",
            position: "relative",
            zIndex: 10,
            padding: "0 80px",
            textAlign: "center",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(232,96,16,0.15)",
              border: "1px solid rgba(232,96,16,0.4)",
              borderRadius: "100px",
              padding: "8px 24px",
              marginBottom: "28px",
            }}
          >
            <span style={{ color: "#F5A623", fontSize: "16px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              BVN Official
            </span>
          </div>

          {/* BVN Wordmark */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              marginBottom: "20px",
            }}
          >
            <span
              style={{
                fontSize: "120px",
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "-4px",
                lineHeight: 1,
              }}
            >
              BVN
            </span>
            <div
              style={{
                width: "16px",
                height: "80px",
                background: "linear-gradient(180deg, #E86010, #F5A623)",
                borderRadius: "8px",
                marginLeft: "12px",
                marginBottom: "8px",
                alignSelf: "flex-end",
              }}
            />
          </div>

          {/* Tagline */}
          <p
            style={{
              fontSize: "28px",
              color: "rgba(255,255,255,0.85)",
              fontWeight: 600,
              margin: "0 0 16px 0",
              lineHeight: 1.3,
            }}
          >
            Marketing & Operations Automation Agency
          </p>

          <p
            style={{
              fontSize: "20px",
              color: "rgba(255,255,255,0.5)",
              fontWeight: 400,
              margin: "0 0 40px 0",
            }}
          >
            Helping Philippine businesses scale faster, smarter, and stronger.
          </p>

          {/* Pills row */}
          <div style={{ display: "flex", gap: "16px" }}>
            {["Social Media", "SEO", "AI Automation", "CRM", "HR & Payroll"].map((tag) => (
              <div
                key={tag}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "100px",
                  padding: "8px 20px",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "15px",
                  fontWeight: 600,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #E86010, #F5A623, #E86010)",
          }}
        />

        {/* URL bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            right: "48px",
            color: "rgba(255,255,255,0.35)",
            fontSize: "16px",
            fontWeight: 500,
          }}
        >
          bvnofficial.com
        </div>
      </div>
    ),
    { ...size }
  );
}
