import type { Metadata } from "next";
import Link from "next/link";
import { ogImage } from "@/lib/og";

export const metadata: Metadata = {
  title: "Business Plans — Interactive Concepts by BVN",
  description:
    "A growing collection of complete, interactive business plans by BVN — from startup to operations to marketing, each with live financial projections. Built for Filipino entrepreneurs.",
  openGraph: {
    title: "Business Plans — Interactive Concepts by BVN",
    description: "Complete interactive business plans with live financial projections, built for Filipino entrepreneurs.",
    url: "https://www.bvnofficial.com/business",
    type: "website",
    images: [ogImage({ title: "Interactive Business Plans", eyebrow: "Business Plans", theme: "yellow" })],
  },
};

type Plan = {
  href: string;
  emoji: string;
  name: string;
  tagline: string;
  blurb: string;
  tags: string[];
  startup: string;
  accent: string;
  accent2: string;
};

const plans: Plan[] = [
  {
    href: "/business/paresilogan",
    emoji: "🍜",
    name: "PARESILOGAN",
    tagline: "Pares & Tapsilogan ng Bayan",
    blurb: "An affordable, high-volume carinderia combining beef pares and the silog family. All-day and late-night. Complete plan with a live profit calculator.",
    tags: ["Food", "Carinderia", "₱260K startup", "~5mo payback"],
    startup: "₱260K",
    accent: "#B3261E",
    accent2: "#F4B400",
  },
  {
    href: "/business-ideas/sarsa-republika",
    emoji: "🔥",
    name: "Sarsa Republika",
    tagline: "Sarsa ng Pilipino",
    blurb: "Filipino spatchcock rotisserie chicken with 13 signature sauces, served Peri Peri–style in a branded box from a stainless street cart.",
    tags: ["Food", "Street cart", "13 sauces", "Franchise-ready"],
    startup: "₱100K",
    accent: "#C41E3A",
    accent2: "#E8721C",
  },
];

export default function BusinessHubPage() {
  return (
    <div style={{ background: "#FFF7EC", color: "#2A1A0E", minHeight: "100vh" }}>
      {/* Hero */}
      <section
        className="text-center px-6 pt-16 pb-20"
        style={{ background: "linear-gradient(135deg,#5A3018 0%,#3A1F0E 60%,#9A5A2A 100%)", borderBottom: "6px solid #F4B400" }}
      >
        <div className="max-w-3xl mx-auto">
          <div
            className="inline-block font-extrabold uppercase text-xs tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ background: "#F4B400", color: "#5A3018" }}
          >
            🇵🇭 BVN Official · Business Blueprints
          </div>
          <h1 className="font-black mb-3" style={{ fontSize: "clamp(34px,7vw,60px)", color: "#FFD23F", textShadow: "0 3px 0 rgba(0,0,0,.18)" }}>
            Interactive Business Plans
          </h1>
          <p className="max-w-xl mx-auto" style={{ color: "#F6E3C7", fontSize: 16 }}>
            Complete, ready-to-launch business concepts — from startup to operations to marketing — each with live financial projections you can model yourself. Built for the Filipino entrepreneur.
          </p>
        </div>
      </section>

      {/* Plans grid */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((p) => (
            <Link key={p.href} href={p.href} className="group block rounded-2xl overflow-hidden transition-transform hover:-translate-y-1"
              style={{ background: "#FFFAF2", border: "1px solid #E7D6BD", boxShadow: "0 10px 30px rgba(90,48,24,.10)" }}>
              <div className="h-2" style={{ background: `linear-gradient(90deg, ${p.accent}, ${p.accent2})` }} />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: 40 }}>{p.emoji}</span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "#FDEECF", color: "#5A3018", border: "1px solid #E7D6BD" }}>
                    {p.startup} startup
                  </span>
                </div>
                <h2 className="font-black" style={{ fontSize: 26, color: "#5A3018" }}>{p.name}</h2>
                <p className="font-semibold mb-2" style={{ color: p.accent }}>{p.tagline}</p>
                <p className="text-sm mb-4" style={{ color: "#7C6A59" }}>{p.blurb}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.tags.map((t) => (
                    <span key={t} className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "#FDEECF", color: "#5A3018" }}>{t}</span>
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 font-extrabold text-sm" style={{ color: p.accent }}>
                  View full plan
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          ))}

          {/* Coming soon placeholder */}
          <div className="rounded-2xl p-6 flex flex-col items-center justify-center text-center"
            style={{ background: "#FFFAF2", border: "2px dashed #E7D6BD", color: "#7C6A59", minHeight: 220 }}>
            <span style={{ fontSize: 36 }}>✨</span>
            <p className="font-bold mt-2" style={{ color: "#5A3018" }}>More plans coming soon</p>
            <p className="text-sm mt-1">New interactive business blueprints are added here regularly.</p>
          </div>
        </div>
      </div>

      <footer className="text-center py-9 px-4" style={{ background: "#5A3018", color: "#F6E3C7", borderTop: "6px solid #F4B400" }}>
        <p className="font-black tracking-widest mb-1" style={{ color: "#fff", fontSize: 20 }}>BVN OFFICIAL</p>
        <p className="text-xs opacity-80">Interactive Business Blueprints · bvnofficial.com/business</p>
      </footer>
    </div>
  );
}
