"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Mail, Megaphone, Upload, FileSpreadsheet, Sparkles, Tags,
  ListFilter, MapPin, MessageSquare, Phone, Send, BarChart3, CheckCircle2,
  XCircle, ChevronRight, Zap, Bot, ShieldCheck,
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  bg: "#0A1120", bg2: "#0E1830", card: "#121E3A", cardHi: "#16264A",
  border: "#22324F", ink: "#EAF1FC", sub: "#9FB1D0", muted: "#647697",
  cyan: "#22D3EE", green: "#34D399", amber: "#FBBF24", coral: "#FB923C",
  purple: "#A78BFA", blue: "#3B82F6", red: "#F87171",
};

// ── Pipeline stages ───────────────────────────────────────────
type Stage = { id: string; num: number; name: string; Icon: typeof Upload; color: string; summary: string; points: string[] };
const stages: Stage[] = [
  { id: "import", num: 1, name: "Import & map fields", Icon: Upload, color: C.cyan,
    summary: "Raw foreclosure lead lists come in as Excel or CSV. First job is a clean, correctly mapped import.",
    points: ["Map every column to the right GHL custom field, no mismatches", "Handle Excel and CSV, and messy exports from different sources", "Tag the import batch with its date and source so nothing is ever lost"] },
  { id: "clean", num: 2, name: "Clean & format", Icon: Sparkles, color: C.blue,
    summary: "Bad data breaks campaigns. Phone and email formatting gets fixed before anything sends.",
    points: ["Standardise every phone number to a valid dialable format", "Lowercase and trim emails, flag anything invalid", "Remove duplicates and drop rows that cannot be contacted"] },
  { id: "tag", num: 3, name: "Tag & organize", Icon: Tags, color: C.purple,
    summary: "Every contact gets tagged so it can be found, segmented, and reported on later.",
    points: ["Apply campaign, county, and import-date tags consistently", "Keep a naming convention so tags stay clean over time", "Set the fields the Smart Lists and workflows depend on"] },
  { id: "lists", num: 4, name: "Smart Lists by county", Icon: ListFilter, color: C.amber,
    summary: "Contacts get organised into Smart Lists by county, campaign, and import date for precise targeting.",
    points: ["Build Smart Lists per county for local, relevant outreach", "Segment by campaign and import batch", "Lists stay live, so new imports flow into the right segment automatically"] },
  { id: "campaigns", num: 5, name: "Launch campaigns", Icon: Send, color: C.green,
    summary: "Once the data is clean and segmented, the SMS, email, and AI voice campaigns go out.",
    points: ["Bulk SMS with opt-out handling built in", "Email campaigns with tracked delivery and opens", "AI voice call campaigns for the contacts who respond better to a call"] },
  { id: "report", num: 6, name: "Daily reporting", Icon: BarChart3, color: C.coral,
    summary: "Every day ends with a clear report: what was imported, cleaned, sent, delivered, and answered.",
    points: ["Daily numbers on imports, sends, delivery, and replies", "Import errors surfaced and resolved same day", "The CRM stays clean, accurate, and ready for the next batch"] },
];

// ── Data cleaning sample ──────────────────────────────────────
type Row = { name: string; phoneRaw: string; phoneClean: string; emailRaw: string; emailClean: string; county: string; ok: boolean; emailBad?: boolean };
const rows: Row[] = [
  { name: "Robert Alvarez", phoneRaw: "(614) 555-0142", phoneClean: "+1 614 555 0142", emailRaw: " Robert.Alvarez@Gmail.Com ", emailClean: "robert.alvarez@gmail.com", county: "Franklin", ok: true },
  { name: "J. Whitmore", phoneRaw: "6145550199", phoneClean: "+1 614 555 0199", emailRaw: "jwhitmore@YAHOO.com", emailClean: "jwhitmore@yahoo.com", county: "Franklin", ok: true },
  { name: "Maria Ruiz", phoneRaw: "937.555.0110", phoneClean: "+1 937 555 0110", emailRaw: "maria ruiz@gmail", emailClean: "flagged: invalid email", county: "Montgomery", ok: true, emailBad: true },
  { name: "D. Chen", phoneRaw: "1-216-555-0133", phoneClean: "+1 216 555 0133", emailRaw: "dchen@outlook.com", emailClean: "dchen@outlook.com", county: "Cuyahoga", ok: true },
  { name: "(no name, dupe)", phoneRaw: "555-0100", phoneClean: "invalid, removed", emailRaw: "—", emailClean: "—", county: "—", ok: false },
];

// ── Counties ──────────────────────────────────────────────────
const counties = [
  { name: "Franklin", n: 842 }, { name: "Montgomery", n: 496 }, { name: "Cuyahoga", n: 288 },
  { name: "Hamilton", n: 134 }, { name: "Summit", n: 82 },
];

// ── Campaigns ─────────────────────────────────────────────────
const channels = {
  sms: {
    label: "SMS", Icon: MessageSquare, color: C.green,
    body: "Hi {{first_name}}, this is [Organisation], a nonprofit that helps homeowners in {{county}} County facing foreclosure understand their options, at no cost. Reply YES to learn more, or STOP to opt out.",
    stats: [{ k: "Sent", v: "1,790" }, { k: "Delivered", v: "97%" }, { k: "Replies", v: "63" }],
  },
  email: {
    label: "Email", Icon: Mail, color: C.blue,
    body: "Subject: You may have more options than you think\n\nA short, respectful email letting the homeowner know free nonprofit help is available in their county, what it covers, and how to reach a real person. Clear unsubscribe in the footer.",
    stats: [{ k: "Sent", v: "1,612" }, { k: "Opened", v: "41%" }, { k: "Clicks", v: "128" }],
  },
  voice: {
    label: "AI Voice", Icon: Phone, color: C.purple,
    body: "An AI voice call places a warm, compliant message introducing the nonprofit's free foreclosure help and how to call back. Contacts who answer can be routed to a live team member or booked in.",
    stats: [{ k: "Calls", v: "1,790" }, { k: "Connected", v: "512" }, { k: "Callbacks", v: "47" }],
  },
} as const;
type ChannelId = keyof typeof channels;

// ── Component ──────────────────────────────────────────────────
export default function HousingCrmLeadOps() {
  const [active, setActive] = useState("import");
  const [raw, setRaw] = useState(true);
  const [channel, setChannel] = useState<ChannelId>("sms");
  const stage = stages.find((s) => s.id === active)!;
  const nextStage = stages[stages.findIndex((s) => s.id === active) + 1];
  const ch = channels[channel];

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
      <div style={{ maxWidth: 940, margin: "0 auto", padding: "28px 20px 90px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
          <ArrowLeft size={15} /> bvnofficial.com
        </Link>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.blue, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: C.blue, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
            BVN · Application Demo · CRM Lead Operations
          </div>
          <h1 style={{ fontSize: 28, lineHeight: 1.2, margin: "10px 0 8px", fontWeight: 800 }}>
            From raw CSV to launched campaign, cleanly
          </h1>
          <p style={{ color: C.sub, fontSize: 14.5, maxWidth: 740, margin: 0, lineHeight: 1.65 }}>
            Your role is owning the lead operations end to end: importing foreclosure lists, fixing the data, tagging
            and organising by county, and launching SMS, email and AI voice campaigns in GoHighLevel. Here is that
            exact pipeline, laid out and interactive. My 2 minute Loom shows the real thing inside GHL. This shows I
            understand the whole process before day one.
          </p>
        </div>

        {/* Pipeline strip */}
        <div style={{ marginTop: 26 }}>
          <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 12px" }}>
            The pipeline — click any step
          </p>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {stages.map((s) => {
              const on = active === s.id;
              return (
                <button key={s.id} onClick={() => setActive(s.id)}
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 12px", borderRadius: 10, cursor: "pointer",
                    border: `1px solid ${on ? s.color + "99" : C.border}`, background: on ? s.color + "18" : C.card,
                    color: on ? s.color : C.sub, fontSize: 12.5, fontWeight: on ? 700 : 400 }}>
                  <s.Icon size={14} /><span style={{ fontSize: 10, opacity: .55 }}>{s.num}</span> {s.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stage detail */}
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} style={{ marginTop: 16 }}>
            <div style={{ background: C.card, border: `1px solid ${stage.color}55`, borderRadius: 18, padding: "20px 22px" }}>
              <div style={{ display: "flex", gap: 13, alignItems: "flex-start", marginBottom: 14 }}>
                <span style={{ width: 40, height: 40, borderRadius: 11, background: stage.color + "1E", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <stage.Icon size={20} style={{ color: stage.color }} />
                </span>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: stage.color }}>Step {stage.num} of {stages.length}</span>
                  <h2 style={{ fontSize: 20, fontWeight: 800, margin: "3px 0 5px" }}>{stage.name}</h2>
                  <p style={{ fontSize: 13.5, color: C.sub, margin: 0, lineHeight: 1.6 }}>{stage.summary}</p>
                </div>
              </div>
              <div style={{ display: "grid", gap: 7 }}>
                {stage.points.map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", background: stage.color + "0C", border: `1px solid ${stage.color}28`, borderRadius: 10, padding: "9px 12px" }}>
                    <CheckCircle2 size={14} style={{ color: stage.color, flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13, color: C.ink, lineHeight: 1.5 }}>{p}</span>
                  </div>
                ))}
              </div>
              {nextStage && (
                <button onClick={() => setActive(nextStage.id)} style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 7, background: "transparent", border: `1px solid ${C.border}`, borderRadius: 9, padding: "8px 14px", color: C.sub, fontSize: 13, cursor: "pointer" }}>
                  <nextStage.Icon size={14} /> Next: {nextStage.name} <ChevronRight size={13} />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Data cleaning in action */}
        <Section title="Data cleaning, the part that makes campaigns actually deliver" Icon={Sparkles} accent={C.blue}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            <div style={{ display: "flex", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 3 }}>
              {[{ id: true, label: "Raw upload" }, { id: false, label: "After my cleanup" }].map((o) => (
                <button key={String(o.id)} onClick={() => setRaw(o.id)}
                  style={{ padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 700,
                    background: raw === o.id ? (o.id ? C.coral : C.green) : "transparent", color: raw === o.id ? "#04102B" : C.sub }}>
                  {o.label}
                </button>
              ))}
            </div>
            <span style={{ fontSize: 12.5, color: C.muted }}>Toggle to see the same list before and after processing.</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <div style={{ minWidth: 640 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.4fr 1.8fr 1fr 0.7fr", gap: 8, padding: "0 6px 8px", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .4 }}>
                <span>Name</span><span>Phone</span><span>Email</span><span>County</span><span style={{ textAlign: "center" }}>Status</span>
              </div>
              {rows.map((r, i) => {
                const removed = !r.ok;
                return (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1.2fr 1.4fr 1.8fr 1fr 0.7fr", gap: 8, alignItems: "center", padding: "10px 6px", borderTop: `1px solid ${C.border}`, opacity: !raw && removed ? 0.45 : 1 }}>
                    <span style={{ fontSize: 12.5, color: C.ink }}>{r.name}</span>
                    <span style={{ fontSize: 12.5, fontFamily: "monospace", color: raw ? C.sub : (removed ? C.red : C.green) }}>{raw ? r.phoneRaw : r.phoneClean}</span>
                    <span style={{ fontSize: 12, fontFamily: "monospace", color: raw ? C.sub : (r.emailBad ? C.amber : (removed ? C.muted : C.green)) }}>{raw ? r.emailRaw : r.emailClean}</span>
                    <span style={{ fontSize: 12.5, color: raw && r.county === "—" ? C.muted : C.ink }}>{raw ? (r.county === "—" ? "unparsed" : r.county) : r.county}</span>
                    <span style={{ textAlign: "center" }}>
                      {raw ? <span style={{ fontSize: 11, color: C.muted }}>raw</span>
                        : removed ? <XCircle size={16} style={{ color: C.red }} />
                        : <CheckCircle2 size={16} style={{ color: C.green }} />}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <p style={{ fontSize: 12, color: C.muted, marginTop: 10, lineHeight: 1.6 }}>
            Phones standardised to a dialable format, emails lowercased and validated, an invalid or duplicate row
            caught and removed, counties parsed. This is the difference between a campaign that lands and one that bounces.
          </p>
        </Section>

        {/* Smart Lists by county */}
        <Section title="Organised into Smart Lists by county" Icon={ListFilter} accent={C.amber}>
          <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
            {counties.map((c) => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 10, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "11px 15px" }}>
                <MapPin size={15} style={{ color: C.amber }} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{c.name} County</div>
                  <div style={{ fontSize: 11.5, color: C.muted }}>{c.n.toLocaleString()} contacts</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: C.muted, marginTop: 12 }}>Also segmented by campaign and import date, so every send hits exactly the right group.</p>
        </Section>

        {/* Campaigns */}
        <Section title="Launch across SMS, email, and AI voice" Icon={Send} accent={C.green}>
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            {(Object.keys(channels) as ChannelId[]).map((id) => {
              const c = channels[id]; const on = channel === id;
              return (
                <button key={id} onClick={() => setChannel(id)}
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 15px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: on ? 700 : 400,
                    border: `1px solid ${on ? c.color + "99" : C.border}`, background: on ? c.color + "18" : C.card, color: on ? c.color : C.sub }}>
                  <c.Icon size={14} /> {c.label}
                </button>
              );
            })}
          </div>
          <div style={{ background: C.card, border: `1px solid ${ch.color}44`, borderRadius: 16, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <ch.Icon size={16} style={{ color: ch.color }} />
              <span style={{ fontSize: 13.5, fontWeight: 700 }}>{ch.label} campaign</span>
              <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: C.green }}><ShieldCheck size={12} /> opt-out compliant</span>
            </div>
            <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", fontSize: 13, color: C.ink, lineHeight: 1.6, whiteSpace: "pre-wrap", marginBottom: 14 }}>
              {ch.body}
            </div>
            <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(3, 1fr)" }}>
              {ch.stats.map((s, i) => (
                <div key={i} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: ch.color }}>{s.v}</div>
                  <div style={{ fontSize: 10.5, color: C.muted, textTransform: "uppercase", letterSpacing: .4, marginTop: 3 }}>{s.k}</div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Daily report */}
        <Section title="The daily report you would get from me" Icon={BarChart3} accent={C.coral}>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
            {[
              { k: "Imported", v: "1,842", Icon: Upload },
              { k: "Clean & valid", v: "1,790", Icon: CheckCircle2 },
              { k: "Removed", v: "52", Icon: XCircle },
              { k: "Tagged", v: "1,790", Icon: Tags },
              { k: "SMS delivered", v: "97%", Icon: MessageSquare },
              { k: "Replies", v: "63", Icon: Zap },
            ].map((m, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 14px" }}>
                <m.Icon size={14} style={{ color: C.coral, marginBottom: 7 }} />
                <div style={{ fontSize: 20, fontWeight: 800 }}>{m.v}</div>
                <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: .4, marginTop: 3 }}>{m.k}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 9, alignItems: "flex-start", background: C.blue + "10", border: `1px solid ${C.blue}30`, borderRadius: 12, padding: "12px 15px" }}>
            <Bot size={16} style={{ color: C.blue, flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 13, color: C.ink, lineHeight: 1.55 }}>
              Same numbers, every day, plus any import errors caught and fixed. You always know the CRM is clean and exactly where each campaign stands.
            </span>
          </div>
        </Section>

        {/* Footer */}
        <div style={{ marginTop: 42, paddingTop: 22, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Benjamin Yson</div>
            <div style={{ fontSize: 12, color: C.muted }}>GoHighLevel · CRM Operations · Campaigns · BVN</div>
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

// ── Section ──────────────────────────────────────────────────
function Section({ title, Icon, accent, children }: { title: string; Icon: typeof Zap; accent: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 40 }}>
      <h2 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 18, fontWeight: 800, margin: "0 0 14px" }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: accent + "1A", display: "grid", placeItems: "center" }}>
          <Icon size={17} style={{ color: accent }} />
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}
