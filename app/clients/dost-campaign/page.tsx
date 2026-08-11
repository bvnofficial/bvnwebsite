"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Mail, Megaphone, LayoutDashboard, CalendarDays, ListChecks,
  BadgeCheck, Film, FileText, Image as ImageIcon, TrendingUp, Eye, ThumbsUp,
  Users, CheckCircle2, PlayCircle, Facebook, Youtube, Instagram,
  Music2, Printer, Gift, Mic, Sparkles,
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  bg: "#0A1428", bg2: "#0F1D3A", card: "#132449", cardHi: "#182C57",
  border: "#27396A", ink: "#EAF1FF", sub: "#9DB2DD", muted: "#6076A3",
  blue: "#3B82F6", sky: "#38BDF8", gold: "#FBBF24", orange: "#F97316",
  green: "#34D399", red: "#F87171", violet: "#A78BFA",
};

const projMeta: Record<string, { color: string }> = {
  STARBOOKS: { color: C.gold }, ONEOwl: { color: C.sky },
};
const platMeta: Record<string, { Icon: typeof Facebook; color: string }> = {
  Facebook: { Icon: Facebook, color: "#60A5FA" },
  YouTube: { Icon: Youtube, color: "#F87171" },
  TikTok: { Icon: Music2, color: "#22D3EE" },
  Instagram: { Icon: Instagram, color: "#F472B6" },
};
const typeMeta: Record<string, { Icon: typeof Film; color: string }> = {
  Video: { Icon: Film, color: C.orange },
  Reel: { Icon: PlayCircle, color: C.violet },
  Graphic: { Icon: ImageIcon, color: C.sky },
  Article: { Icon: FileText, color: C.green },
  Podcast: { Icon: Mic, color: C.gold },
  Print: { Icon: Printer, color: C.blue },
  Contest: { Icon: Gift, color: C.red },
};
type Status = "Published" | "Scheduled" | "In review" | "In production";
const statusColor: Record<Status, string> = {
  Published: C.green, Scheduled: C.sky, "In review": C.gold, "In production": C.muted,
};

type Item = { project: keyof typeof projMeta; date: string; title: string; platform: keyof typeof platMeta; type: keyof typeof typeMeta; status: Status };
const calendar: Item[] = [
  { project: "STARBOOKS", date: "Mon, Jan 6", title: "STARBOOKS kiosk in the barrio — feature", platform: "YouTube", type: "Video", status: "Scheduled" },
  { project: "STARBOOKS", date: "Tue, Jan 7", title: "5 free science reads for students", platform: "Facebook", type: "Graphic", status: "In review" },
  { project: "ONEOwl", date: "Wed, Jan 8", title: "Meet Project ONEOwl — launch reel", platform: "TikTok", type: "Reel", status: "In production" },
  { project: "STARBOOKS", date: "Thu, Jan 9", title: "How a teacher uses STARBOOKS offline", platform: "Instagram", type: "Reel", status: "Scheduled" },
  { project: "ONEOwl", date: "Fri, Jan 10", title: "ONEOwl explainer — what it does", platform: "YouTube", type: "Video", status: "In review" },
  { project: "STARBOOKS", date: "Sat, Jan 11", title: "Science trivia Saturday", platform: "Facebook", type: "Contest", status: "Scheduled" },
  { project: "ONEOwl", date: "Mon, Jan 13", title: "ONEOwl x students infographic", platform: "Instagram", type: "Graphic", status: "In production" },
];

type Deliv = { project: keyof typeof projMeta; category: string; title: string; type: keyof typeof typeMeta; status: Status };
const deliverables: Deliv[] = [
  { project: "STARBOOKS", category: "Production", title: "Q1 feature video — nationwide reach", type: "Video", status: "Published" },
  { project: "STARBOOKS", category: "Production", title: "January reels batch (8)", type: "Reel", status: "In production" },
  { project: "STARBOOKS", category: "Design", title: "Infographic series — S&T facts", type: "Graphic", status: "In review" },
  { project: "STARBOOKS", category: "Audio", title: "Podcast ep. 1 — the story of STARBOOKS", type: "Podcast", status: "Scheduled" },
  { project: "STARBOOKS", category: "Print", title: "Deployment posters & tarpaulins", type: "Print", status: "In production" },
  { project: "ONEOwl", category: "Production", title: "ONEOwl launch video", type: "Video", status: "In review" },
  { project: "ONEOwl", category: "Production", title: "Short-form reels batch (6)", type: "Reel", status: "In production" },
  { project: "ONEOwl", category: "Design", title: "Brand social kit & templates", type: "Graphic", status: "Published" },
  { project: "ONEOwl", category: "Engagement", title: "Launch online contest", type: "Contest", status: "Scheduled" },
];

const approvalsSeed = [
  { id: "a1", project: "STARBOOKS" as const, title: "5 free science reads for students", type: "Graphic" as const, note: "Social card set for Facebook, ready for your sign-off." },
  { id: "a2", project: "ONEOwl" as const, title: "ONEOwl explainer — what it does", type: "Video" as const, note: "90-second explainer video, final cut for review." },
  { id: "a3", project: "STARBOOKS" as const, title: "Podcast ep. 1 script", type: "Podcast" as const, note: "Script and shot list for the first episode." },
];

export default function DostCommandCenter() {
  const [tab, setTab] = useState<"overview" | "calendar" | "deliverables" | "approvals">("overview");
  const [proj, setProj] = useState<"All" | "STARBOOKS" | "ONEOwl">("All");
  const [approved, setApproved] = useState<string[]>([]);

  const match = (p: string) => proj === "All" || p === proj;
  const cal = calendar.filter((c) => match(c.project));
  const dels = deliverables.filter((d) => match(d.project));
  const apps = approvalsSeed.filter((a) => match(a.project));

  const kpis = useMemo(() => ({
    published: deliverables.filter((d) => d.status === "Published").length,
    production: deliverables.filter((d) => d.status === "In production").length,
    review: deliverables.filter((d) => d.status === "In review").length,
    pending: approvalsSeed.length - approved.length,
  }), [approved.length]);

  const Chip = ({ s }: { s: Status }) => (
    <span style={{ fontSize: 10.5, fontWeight: 700, color: statusColor[s], background: statusColor[s] + "1E", border: `1px solid ${statusColor[s]}3A`, borderRadius: 6, padding: "2px 8px", whiteSpace: "nowrap" }}>{s}</span>
  );

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 20px 90px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
          <ArrowLeft size={15} /> bvnofficial.com
        </Link>

        {/* Header with logos */}
        <div style={{ marginTop: 18, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <span style={{ background: "#fff", borderRadius: 12, padding: "8px 10px", display: "inline-flex", alignItems: "center", height: 46, boxSizing: "border-box" }}>
                <img src="/clients/dost-campaign/dost-stii.svg" alt="DOST-STII" style={{ height: 30, width: "auto", display: "block" }} />
              </span>
              <span style={{ background: "#fff", borderRadius: 12, padding: "8px 12px", display: "inline-flex", alignItems: "center", height: 46, boxSizing: "border-box" }}>
                <img src="/clients/dost-campaign/starbooks.png" alt="STARBOOKS" style={{ height: 26, width: "auto", display: "block" }} />
              </span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, letterSpacing: 1, textTransform: "uppercase" }}>Campaign Command Center</div>
              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>FY 2027 · Content Production & Promotion</div>
            </div>
          </div>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: C.green, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
            <span style={{ fontSize: 13, color: C.sub }}>Live workspace for DOST-STII, prepared by BVN Official. One place to see every deliverable, the calendar, analytics, approvals, and reports.</span>
          </div>
        </div>

        {/* Tabs + project filter */}
        <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 6, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 4, flexWrap: "wrap" }}>
            {([
              { id: "overview", label: "Overview", Icon: LayoutDashboard },
              { id: "calendar", label: "Content Calendar", Icon: CalendarDays },
              { id: "deliverables", label: "Deliverables", Icon: ListChecks },
              { id: "approvals", label: "Approvals", Icon: BadgeCheck },
            ] as const).map((v) => (
              <button key={v.id} onClick={() => setTab(v.id)}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: 9, border: "none", cursor: "pointer",
                  background: tab === v.id ? C.blue : "transparent", color: tab === v.id ? "#04102B" : C.sub, fontSize: 12.5, fontWeight: 700 }}>
                <v.Icon size={14} /> {v.label}
                {v.id === "approvals" && kpis.pending > 0 && <span style={{ fontSize: 9.5, fontWeight: 800, color: "#04102B", background: C.gold, borderRadius: 99, padding: "1px 6px" }}>{kpis.pending}</span>}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 5, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 4 }}>
            {(["All", "STARBOOKS", "ONEOwl"] as const).map((p) => (
              <button key={p} onClick={() => setProj(p)}
                style={{ padding: "6px 11px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 11.5, fontWeight: 700,
                  background: proj === p ? (p === "All" ? C.sub : projMeta[p].color) : "transparent", color: proj === p ? "#0A1428" : C.sub }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} style={{ marginTop: 16 }}>

            {/* OVERVIEW */}
            {tab === "overview" && (
              <div>
                <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", marginBottom: 14 }}>
                  {[
                    { k: "Published", v: kpis.published, s: "deliverables live", c: C.green, Icon: CheckCircle2 },
                    { k: "In production", v: kpis.production, s: "being created", c: C.sky, Icon: PlayCircle },
                    { k: "In review", v: kpis.review, s: "with your team", c: C.gold, Icon: Eye },
                    { k: "Awaiting approval", v: kpis.pending, s: "need sign-off", c: C.orange, Icon: BadgeCheck },
                  ].map((m, i) => (
                    <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 13, padding: "14px 15px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .4 }}>{m.k}</span>
                        <m.Icon size={15} style={{ color: m.c }} />
                      </div>
                      <div style={{ fontSize: 26, fontWeight: 800, color: m.c, marginTop: 6 }}>{m.v}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{m.s}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", marginBottom: 14 }}>
                  {([
                    { name: "STARBOOKS", pct: 34, done: 1, total: 5, note: "Flagship digital S&T library promotion" },
                    { name: "ONEOwl", pct: 22, done: 1, total: 4, note: "DOST Project ONEOwl content & promotion" },
                  ] as const).map((p) => (
                    <div key={p.name} style={{ background: C.card, border: `1px solid ${projMeta[p.name].color}44`, borderRadius: 14, padding: "15px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: projMeta[p.name].color }}>{p.name}</span>
                        <span style={{ fontSize: 12, color: C.sub }}>{p.done}/{p.total} tracks live</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{p.note}</div>
                      <div style={{ height: 8, background: C.bg2, borderRadius: 99, overflow: "hidden", marginTop: 11 }}>
                        <div style={{ height: "100%", width: `${p.pct}%`, background: projMeta[p.name].color, borderRadius: 99 }} />
                      </div>
                      <div style={{ fontSize: 11, color: C.sub, marginTop: 5 }}>{p.pct}% of the FY 2027 plan delivered</div>
                    </div>
                  ))}
                </div>

                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "15px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 13 }}>
                    <TrendingUp size={16} style={{ color: C.gold }} />
                    <span style={{ fontSize: 13.5, fontWeight: 800 }}>Reach & engagement (illustrative)</span>
                  </div>
                  <div style={{ display: "grid", gap: 11 }}>
                    {[
                      { p: "Facebook", reach: 420000, max: 420000, c: platMeta.Facebook.color },
                      { p: "YouTube", reach: 265000, max: 420000, c: platMeta.YouTube.color },
                      { p: "TikTok", reach: 338000, max: 420000, c: platMeta.TikTok.color },
                      { p: "Instagram", reach: 152000, max: 420000, c: platMeta.Instagram.color },
                    ].map((r, i) => (
                      <div key={i}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                          <span style={{ color: C.sub }}>{r.p}</span>
                          <span style={{ color: C.ink, fontWeight: 700 }}>{(r.reach / 1000).toFixed(0)}K reach</span>
                        </div>
                        <div style={{ height: 7, background: C.bg2, borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${(r.reach / r.max) * 100}%`, background: r.c, borderRadius: 99 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                    {[
                      { Icon: Users, k: "Total reach", v: "1.18M" },
                      { Icon: ThumbsUp, k: "Engagement rate", v: "6.4%" },
                      { Icon: Eye, k: "Video views", v: "742K" },
                    ].map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <s.Icon size={15} style={{ color: C.gold }} />
                        <span style={{ fontSize: 12, color: C.muted }}>{s.k}</span>
                        <span style={{ fontSize: 13.5, fontWeight: 800 }}>{s.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CALENDAR */}
            {tab === "calendar" && (
              <div>
                <p style={{ color: C.sub, fontSize: 13, marginBottom: 12, lineHeight: 1.6 }}>Every scheduled post and video, across both projects and all platforms, in one calendar.</p>
                <div style={{ display: "grid", gap: 8 }}>
                  {cal.map((c, i) => {
                    const pl = platMeta[c.platform]; const ty = typeMeta[c.type];
                    return (
                      <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "11px 14px" }}>
                        <div style={{ width: 74, flexShrink: 0, fontSize: 11.5, fontWeight: 700, color: C.sub }}>{c.date}</div>
                        <span style={{ width: 30, height: 30, borderRadius: 8, background: ty.color + "1E", display: "grid", placeItems: "center", flexShrink: 0 }}>
                          <ty.Icon size={15} style={{ color: ty.color }} />
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                            <span style={{ fontSize: 10.5, fontWeight: 700, color: projMeta[c.project].color }}>{c.project}</span>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: C.muted }}><pl.Icon size={11} style={{ color: pl.color }} /> {c.platform}</span>
                            <span style={{ fontSize: 11, color: C.muted }}>· {c.type}</span>
                          </div>
                        </div>
                        <Chip s={c.status} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* DELIVERABLES */}
            {tab === "deliverables" && (
              <div>
                <p style={{ color: C.sub, fontSize: 13, marginBottom: 12, lineHeight: 1.6 }}>The full production tracker: every deliverable in the FY 2027 package and exactly where it stands.</p>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
                  {dels.map((d, i) => {
                    const ty = typeMeta[d.type];
                    return (
                      <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 15px", borderTop: i ? `1px solid ${C.border}` : "none" }}>
                        <span style={{ width: 32, height: 32, borderRadius: 8, background: ty.color + "1E", display: "grid", placeItems: "center", flexShrink: 0 }}>
                          <ty.Icon size={15} style={{ color: ty.color }} />
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{d.title}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                            <span style={{ fontSize: 10.5, fontWeight: 700, color: projMeta[d.project].color }}>{d.project}</span>
                            <span style={{ fontSize: 11, color: C.muted }}>· {d.category}</span>
                          </div>
                        </div>
                        <Chip s={d.status} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* APPROVALS */}
            {tab === "approvals" && (
              <div>
                <p style={{ color: C.sub, fontSize: 13, marginBottom: 12, lineHeight: 1.6 }}>Content waiting for your sign-off. Approve in one click, and it moves straight into scheduling.</p>
                <div style={{ display: "grid", gap: 9 }}>
                  {apps.map((a) => {
                    const ty = typeMeta[a.type]; const isDone = approved.includes(a.id);
                    return (
                      <div key={a.id} style={{ display: "flex", gap: 12, alignItems: "center", background: C.card, border: `1px solid ${isDone ? C.green + "55" : C.border}`, borderRadius: 13, padding: "13px 15px" }}>
                        <span style={{ width: 34, height: 34, borderRadius: 9, background: ty.color + "1E", display: "grid", placeItems: "center", flexShrink: 0 }}>
                          <ty.Icon size={16} style={{ color: ty.color }} />
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 13, fontWeight: 700 }}>{a.title}</span>
                            <span style={{ fontSize: 10.5, fontWeight: 700, color: projMeta[a.project].color }}>{a.project}</span>
                          </div>
                          <div style={{ fontSize: 11.5, color: C.muted, marginTop: 3 }}>{a.note}</div>
                        </div>
                        {isDone ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: C.green, flexShrink: 0 }}>
                            <CheckCircle2 size={16} /> Approved
                          </span>
                        ) : (
                          <button onClick={() => setApproved((s) => [...s, a.id])}
                            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9, border: "none", cursor: "pointer",
                              background: C.green, color: "#04150E", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
                            <BadgeCheck size={14} /> Approve
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                {apps.length > 0 && apps.every((a) => approved.includes(a.id)) && (
                  <div style={{ display: "flex", gap: 9, alignItems: "center", background: C.green + "12", border: `1px solid ${C.green}44`, borderRadius: 12, padding: "12px 15px", marginTop: 12 }}>
                    <Sparkles size={16} style={{ color: C.green }} />
                    <span style={{ fontSize: 13, color: C.ink }}>All caught up. Approved content moves into the calendar and publishes on schedule.</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700 }}>Prepared by BVN Official for DOST-STII</div>
            <div style={{ fontSize: 11.5, color: C.muted }}>Client Command Center · Content Production & Promotion · FY 2027</div>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="mailto:bvn@bvnofficial.com" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
              <Mail size={14} /> bvn@bvnofficial.com
            </a>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
              <Megaphone size={14} /> bvnofficial.com
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
