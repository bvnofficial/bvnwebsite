import Link from "next/link";

// Brand tokens (BVN client-proposal palette)
const C = {
  bg: "#0A1120",
  bg2: "#0E1830",
  card: "#121E3A",
  border: "#22324F",
  ink: "#EAF1FC",
  sub: "#9FB1D0",
  muted: "#647697",
  orange: "#E86010",
  green: "#34D399",
};

export default function IntroPage() {
  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 22px 100px" }}>
        {/* Top bar */}
        <div style={{ marginBottom: 30 }}>
          <a
            href="https://www.bvnofficial.com"
            style={{ display: "inline-flex", alignItems: "center", gap: 7, color: C.sub, textDecoration: "none", fontSize: 13, fontWeight: 700 }}
          >
            ← BVN Official
          </a>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 26 }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: C.orange }}>
            Introduction
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.1, margin: "8px 0 12px", letterSpacing: -0.6 }}>
            Hi, I am Benjamin Yson.
          </h1>
          <p style={{ fontSize: 16.5, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 680 }}>
            A short introduction and a walk through my skill set, GoHighLevel and CRM automation, AI systems and
            chatbots, and full web development. I am a one-person operation, so the person in this video is the person
            who builds everything.
          </p>
        </div>

        {/* Video */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, overflow: "hidden" }}>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            controls
            preload="metadata"
            playsInline
            style={{ width: "100%", display: "block", background: "#000" }}
          >
            <source src="/intro/benjamin-intro.mp4" type="video/mp4" />
            Your browser does not support the video tag. You can view my work at bvnofficial.com/case-studies.
          </video>
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 26 }}>
          <Link
            href="/case-studies"
            style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.orange, borderRadius: 999, padding: "11px 18px" }}
          >
            See my work →
          </Link>
          <Link
            href="/benjaminyson"
            style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5, fontWeight: 700, color: C.ink, textDecoration: "none", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 999, padding: "11px 18px" }}
          >
            Portfolio and CV →
          </Link>
        </div>

        {/* Contact */}
        <div style={{ marginTop: 34, fontSize: 12.5, color: C.muted, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          Benjamin Yson · BVN Official
          <span style={{ color: C.border }}>|</span>
          <span>WhatsApp +63 981 655 6555</span>
          <span style={{ color: C.border }}>|</span>
          <span>bvn@bvnofficial.com</span>
        </div>
      </div>
    </div>
  );
}
