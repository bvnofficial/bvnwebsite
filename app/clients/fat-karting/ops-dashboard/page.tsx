"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, TrendingUp, Users, Target, Megaphone, Wrench,
  AlertTriangle, Gauge, Flag, PoundSterling, Zap, Check,
} from "lucide-react";

// Greyscale to black palette
const C = {
  bg: "#0A0A0B", bg2: "#101012", card: "#151517", cardHi: "#1D1D20",
  border: "#2A2A2F", line: "#3A3A40", ink: "#F5F5F7", sub: "#A6A6AD",
  muted: "#6C6C74", white: "#FFFFFF", dim: "#4A4A50",
};

// Lane accents kept greyscale (brightness only)
const LANE = { paid: "#FFFFFF", social: "#C9C9CF", crm: "#8E8E96" };

const RANGES: Record<string, number[]> = {
  "4W": [31, 27, 38, 42],
  "8W": [18, 24, 21, 31, 27, 38, 34, 42],
  "12W": [12, 15, 14, 19, 22, 20, 26, 24, 31, 29, 36, 42],
};

type Tab = "all" | "paid" | "social" | "crm";

function Tile({ Icon, label, value, delta, up }: { Icon: typeof Users; label: string; value: string; delta: string; up?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.cardHi : C.card, border: `1px solid ${hov ? C.line : C.border}`,
        borderRadius: 12, padding: "14px 15px", transition: "all 0.16s", transform: hov ? "translateY(-2px)" : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.muted, fontSize: 11.5, fontWeight: 700 }}>
        <Icon size={14} color={hov ? C.white : C.sub} /> {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, marginTop: 8, letterSpacing: -0.5 }}>{value}</div>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: up ? C.white : C.muted, marginTop: 3 }}>{delta}</div>
    </div>
  );
}

function Panel({ Icon, title, tone, rows }: { Icon: typeof Users; title: string; tone: string; rows: [string, string][] }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
        <Icon size={17} color={tone} />
        <span style={{ fontSize: 14.5, fontWeight: 800, color: C.ink }}>{title}</span>
      </div>
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
          <span style={{ color: C.sub }}>{k}</span>
          <span style={{ color: C.ink, fontWeight: 700 }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

const ATTENTION = [
  "Germany hub launch content needs sign-off before Thursday",
  "3 season pass enquiries stalled at 'awaiting parent call', chasing today",
  "Meta 'US-TX awareness' ad set below target, pausing and reallocating",
  "Weekly report sent Monday 9am UK, monthly review booked",
];

export default function FklOpsDashboard() {
  const [range, setRange] = useState<keyof typeof RANGES>("8W");
  const [tab, setTab] = useState<Tab>("all");
  const [hoverBar, setHoverBar] = useState<number | null>(null);
  const [done, setDone] = useState<Set<number>>(new Set());

  const data = RANGES[range];
  const max = Math.max(...data);

  const toggleDone = (i: number) =>
    setDone((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });

  const showPaid = tab === "all" || tab === "paid";
  const showSocial = tab === "all" || tab === "social";
  const showCrm = tab === "all" || tab === "crm";

  const seg = (label: string, active: boolean, onClick: () => void) => (
    <button key={label} onClick={onClick} style={{
      cursor: "pointer", fontSize: 12, fontWeight: 700,
      color: active ? C.bg : C.sub, background: active ? C.white : "transparent",
      border: `1px solid ${active ? C.white : C.border}`, borderRadius: 8, padding: "6px 12px", transition: "all 0.14s",
    }}>{label}</button>
  );

  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "30px 20px 80px" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
          <a href="https://www.bvnofficial.com" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: C.sub, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
            <ArrowLeft size={15} /> BVN Official
          </a>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.ink, background: C.cardHi, border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Live preview · sample data
          </span>
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <Flag size={22} color={C.white} />
          <h1 style={{ fontSize: 27, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>FAT Karting League · Operations Dashboard</h1>
        </div>
        <p style={{ fontSize: 14, color: C.sub, margin: "0 0 20px", maxWidth: 720 }}>
          One screen for the whole operation. Filter the lanes, change the range, and click anything. This is a preview with sample numbers. The live version updates on its own from your ad accounts and HubSpot.
        </p>

        {/* Lane filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
          {seg("All lanes", tab === "all", () => setTab("all"))}
          {seg("Paid media", tab === "paid", () => setTab("paid"))}
          {seg("Social", tab === "social", () => setTab("social"))}
          {seg("HubSpot / CRM", tab === "crm", () => setTab("crm"))}
        </div>

        {/* Stat tiles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 18 }}>
          <Tile Icon={Users} label="Parent leads, this week" value="42" delta="+18% vs last week" up />
          <Tile Icon={PoundSterling} label="Cost per lead" value="£11.40" delta="-9% vs last week" up />
          <Tile Icon={Target} label="Season passes, MTD" value="27" delta="+6 this week" up />
          <Tile Icon={TrendingUp} label="Social followers" value="8,410" delta="+412 (30d)" up />
          <Tile Icon={Zap} label="Avg lead follow-up" value="6 min" delta="target under 10" up />
          <Tile Icon={Gauge} label="Ad spend pacing" value="On track" delta="£1,640 of £1,800" />
        </div>

        {/* Interactive chart */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px", marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: C.ink }}>Qualified parent leads</div>
              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>
                {hoverBar !== null ? `Week ${hoverBar + 1}: ${data[hoverBar]} leads` : "Hover a bar. Trending up as campaigns and content compound."}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {(Object.keys(RANGES) as (keyof typeof RANGES)[]).map((r) => seg(r, range === r, () => { setRange(r); setHoverBar(null); }))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: data.length > 8 ? 6 : 10, height: 140 }}>
            {data.map((v, i) => {
              const active = hoverBar === i;
              const latest = i === data.length - 1;
              const shade = 120 + Math.round((v / max) * 110); // grey ramp
              return (
                <div key={i} onMouseEnter={() => setHoverBar(i)} onMouseLeave={() => setHoverBar(null)}
                  style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: active ? C.white : "transparent", height: 14 }}>{v}</div>
                  <div style={{
                    width: "100%", height: `${(v / max) * 100}%`, minHeight: 6, borderRadius: "5px 5px 0 0",
                    background: active || latest ? C.white : `rgb(${shade},${shade},${shade + 4})`,
                    transition: "all 0.14s",
                  }} />
                  <div style={{ fontSize: 9.5, color: active ? C.sub : C.muted }}>W{i + 1}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lane panels (filtered) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginBottom: 18 }}>
          {showPaid && <Panel Icon={Megaphone} title="Paid media (Meta + Google)" tone={LANE.paid} rows={[
            ["Spend this month", "£1,640"], ["Cost per lead", "£11.40"], ["Cost per season pass", "£58"],
            ["Best campaign", "UK · Pathway to F4"], ["Click-through rate", "2.7%"],
          ]} />}
          {showSocial && <Panel Icon={TrendingUp} title="Organic social" tone={LANE.social} rows={[
            ["Reach (30d)", "184,000"], ["Engagement rate", "5.9%"], ["Follower growth", "+412 (30d)"],
            ["Top post", "Tech Tuesday: 60mph EV kart"], ["Community reply time", "under 1 hr"],
          ]} />}
          {showCrm && <Panel Icon={Wrench} title="HubSpot / CRM" tone={LANE.crm} rows={[
            ["Contacts", "3,120"], ["New leads (wk)", "42"], ["Enquiry to booked", "31%"],
            ["Database health", "Clean, 98% valid"], ["Follow-up speed", "6 min avg"],
          ]} />}
        </div>

        {/* Needs attention (clickable) */}
        <div style={{ background: C.bg2, border: `1px solid ${C.line}`, borderRadius: 14, padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <AlertTriangle size={17} color={C.white} />
              <span style={{ fontSize: 14.5, fontWeight: 800, color: C.ink }}>Needs your attention this week</span>
            </div>
            <span style={{ fontSize: 11, color: C.muted }}>{done.size} of {ATTENTION.length} cleared · click to tick</span>
          </div>
          {ATTENTION.map((t, i) => {
            const isDone = done.has(i);
            return (
              <button key={t} onClick={() => toggleDone(i)} style={{
                width: "100%", textAlign: "left", cursor: "pointer", background: "transparent",
                border: "none", display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0",
                borderBottom: `1px solid ${C.border}`,
              }}>
                <span style={{
                  width: 17, height: 17, borderRadius: 5, flexShrink: 0, marginTop: 1,
                  border: `1.5px solid ${isDone ? C.white : C.muted}`, background: isDone ? C.white : "transparent",
                  display: "grid", placeItems: "center",
                }}>
                  {isDone && <Check size={12} color={C.bg} strokeWidth={3} />}
                </span>
                <span style={{ fontSize: 13, lineHeight: 1.5, color: isDone ? C.dim : C.sub, textDecoration: isDone ? "line-through" : "none" }}>{t}</span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 26, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 12, color: C.muted }}>Built by Benjamin Yson · BVN Official · sample data for preview</div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/book" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.white, borderRadius: 999, padding: "9px 16px" }}>Book a call</Link>
            <Link href="/case-studies" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.ink, textDecoration: "none", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 999, padding: "9px 16px" }}>More of my work</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
