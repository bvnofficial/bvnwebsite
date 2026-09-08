"use client";

import Link from "next/link";
import {
  ArrowLeft, TrendingUp, Users, Target, Megaphone, Wrench,
  AlertTriangle, CheckCircle2, Gauge, Flag, PoundSterling, Zap,
} from "lucide-react";

const C = {
  bg: "#0A0F1E", bg2: "#0E1830", card: "#121E3A", cardHi: "#16264A",
  border: "#22324F", ink: "#EAF1FC", sub: "#9FB1D0", muted: "#647697",
  orange: "#E86010", amber: "#FBBF24", green: "#34D399", blue: "#3B82F6",
  purple: "#A78BFA", red: "#F87171", cyan: "#22D3EE",
};

function Tile({ Icon, label, value, delta, color }: { Icon: typeof Users; label: string; value: string; delta?: string; color: string }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${color}`, borderRadius: 12, padding: "14px 15px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.muted, fontSize: 11.5, fontWeight: 700 }}>
        <Icon size={14} color={color} /> {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, marginTop: 8, letterSpacing: -0.5 }}>{value}</div>
      {delta && <div style={{ fontSize: 11.5, fontWeight: 700, color: delta.startsWith("-") ? C.red : C.green, marginTop: 3 }}>{delta}</div>}
    </div>
  );
}

function Panel({ Icon, title, color, rows }: { Icon: typeof Users; title: string; color: string; rows: [string, string][] }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
        <Icon size={17} color={color} />
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

const LEADS = [18, 24, 21, 31, 27, 38, 34, 42];

export default function FklOpsDashboard() {
  const max = Math.max(...LEADS);
  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "30px 20px 80px" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
          <a href="https://www.bvnofficial.com" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: C.sub, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
            <ArrowLeft size={15} /> BVN Official
          </a>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.orange, background: "rgba(232,96,16,0.12)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Live preview · sample data
          </span>
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <Flag size={22} color={C.orange} />
          <h1 style={{ fontSize: 27, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>FAT Karting League · Operations Dashboard</h1>
        </div>
        <p style={{ fontSize: 14, color: C.sub, margin: "0 0 22px", maxWidth: 720 }}>
          One screen for the whole operation, so you never log into six platforms to know how things are tracking. This is a preview populated with sample numbers. The live version updates on its own from your ad accounts and HubSpot.
        </p>

        {/* Stat tiles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 18 }}>
          <Tile Icon={Users} label="Parent leads, this week" value="42" delta="+18% vs last week" color={C.orange} />
          <Tile Icon={PoundSterling} label="Cost per lead" value="£11.40" delta="-9% vs last week" color={C.green} />
          <Tile Icon={Target} label="Season passes, MTD" value="27" delta="+6 this week" color={C.amber} />
          <Tile Icon={TrendingUp} label="Social followers" value="8,410" delta="+412 (30d)" color={C.blue} />
          <Tile Icon={Zap} label="Avg lead follow-up" value="6 min" delta="target under 10" color={C.cyan} />
          <Tile Icon={Gauge} label="Ad spend pacing" value="On track" delta="£1,640 of £1,800" color={C.purple} />
        </div>

        {/* Chart */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px", marginBottom: 18 }}>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: C.ink, marginBottom: 4 }}>Qualified parent leads, last 8 weeks</div>
          <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 14 }}>Trending up as campaigns and content compound</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 130 }}>
            {LEADS.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.sub }}>{v}</div>
                <div style={{ width: "100%", height: `${(v / max) * 100}%`, background: i === LEADS.length - 1 ? C.orange : "rgba(232,96,16,0.45)", borderRadius: "5px 5px 0 0", minHeight: 6 }} />
                <div style={{ fontSize: 10, color: C.muted }}>W{i + 1}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Lane panels */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginBottom: 18 }}>
          <Panel Icon={Megaphone} title="Paid media (Meta + Google)" color={C.orange} rows={[
            ["Spend this month", "£1,640"],
            ["Cost per lead", "£11.40"],
            ["Cost per season pass", "£58"],
            ["Best campaign", "UK · Pathway to F4"],
            ["Click-through rate", "2.7%"],
          ]} />
          <Panel Icon={TrendingUp} title="Organic social" color={C.blue} rows={[
            ["Reach (30d)", "184,000"],
            ["Engagement rate", "5.9%"],
            ["Follower growth", "+412 (30d)"],
            ["Top post", "Tech Tuesday: 60mph EV kart"],
            ["Community reply time", "under 1 hr"],
          ]} />
          <Panel Icon={Wrench} title="HubSpot / CRM" color={C.green} rows={[
            ["Contacts", "3,120"],
            ["New leads (wk)", "42"],
            ["Enquiry to booked", "31%"],
            ["Database health", "Clean, 98% valid"],
            ["Follow-up speed", "6 min avg"],
          ]} />
        </div>

        {/* Needs attention */}
        <div style={{ background: C.bg2, border: `1px solid ${C.orange}`, borderRadius: 14, padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
            <AlertTriangle size={17} color={C.orange} />
            <span style={{ fontSize: 14.5, fontWeight: 800, color: C.ink }}>Needs your attention this week</span>
          </div>
          {[
            ["Germany hub launch content needs sign-off before Thursday", C.amber],
            ["3 season pass enquiries stalled at 'awaiting parent call', chasing today", C.orange],
            ["Meta 'US-TX awareness' ad set below target, pausing and reallocating", C.red],
            ["Weekly report sent Monday 9am UK, monthly review booked", C.green],
          ].map(([t, col]) => (
            <div key={t as string} style={{ display: "flex", alignItems: "flex-start", gap: 9, padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
              <CheckCircle2 size={15} color={col as string} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: C.sub, lineHeight: 1.5 }}>{t}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 26, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 12, color: C.muted }}>
            Built by Benjamin Yson · BVN Official · sample data for preview
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/book" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.orange, borderRadius: 999, padding: "9px 16px" }}>
              Book a call
            </Link>
            <Link href="/case-studies" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.ink, textDecoration: "none", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 999, padding: "9px 16px" }}>
              More of my work
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
