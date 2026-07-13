"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Layers, Boxes, Workflow, Bot, Database,
  CreditCard, FolderOpen, MonitorSmartphone, MessageSquare, ClipboardList,
  Megaphone, Sparkles, ChevronDown, CircleCheck, Handshake, CalendarClock,
  Users, MapPin, PartyPopper, HandCoins, Repeat, Building2,
} from "lucide-react";

// ── TCE × BVN palette (rose theme) ───────────────────────────
const C = {
  bg: "#0A1120", bg2: "#0E1830", card: "#121E3A", cardHi: "#16264A",
  border: "#22324F", ink: "#EAF1FC", sub: "#9FB1D0", muted: "#647697",
  rose: "#FB7185", coral: "#FB923C", amber: "#FBBF24", green: "#34D399",
  cyan: "#22D3EE", blue: "#3B82F6", purple: "#A78BFA",
};

// ── The stack, in layers ─────────────────────────────────────
type Layer = {
  Icon: typeof Layers; name: string; app: string; color: string;
  role: string; also?: string;
};
const LAYERS: Layer[] = [
  {
    Icon: Building2, name: "Backbone / CRM & portals", app: "GoHighLevel", color: C.rose,
    role: "Two sub-accounts (Client + Talent) run the portals, pipelines, contracts, deposit + final invoicing, the 21-day reminder, SMS/email, calendars, and the core workflows. It already does most of your SOP out of the box.",
    also: "This is the system of record — everything else plugs into it.",
  },
  {
    Icon: Workflow, name: "Orchestration / the glue", app: "Make.com (+ n8n)", color: C.coral,
    role: "Watches for GHL events (form submit, tag change, gig marked complete) and moves data between GHL, the AI, and the database. Make for most flows; n8n where logic gets heavy (geo-matching).",
    also: "Zapier only if a specific app connects better there.",
  },
  {
    Icon: Bot, name: "AI models", app: "Claude (primary)", color: C.purple,
    role: "Parses a messy client brief into clean tags, suggests songs on the client side, and answers questions from your own docs on the talent side. Called from Make/n8n with a grounded system prompt.",
    also: "OpenAI as a drop-in alternative per task.",
  },
  {
    Icon: Database, name: "Data & grounding", app: "Supabase", color: C.cyan,
    role: "Postgres + vector store. Holds the song library and SOP docs for the AI to retrieve from (so answers are grounded), and runs the distance maths for nearest-band matching.",
    also: "Airtable as a lighter no-code option if you prefer a spreadsheet UI.",
  },
  {
    Icon: CreditCard, name: "Payments", app: "Stripe", color: C.green,
    role: "Client deposits and final balance via GHL's Stripe integration. Talent payouts are tracked only and paid manually to the direct deposit on file — exactly as you asked, gated to completed gigs.",
  },
  {
    Icon: FolderOpen, name: "Files & resources", app: "Google Workspace / Drive", color: C.amber,
    role: "Your existing home for charts, backing tracks, and audio (SOP Step 5). The talent portal links straight to it, and automation files the music-director packet there.",
  },
  {
    Icon: MonitorSmartphone, name: "Custom UI (only where needed)", app: "Lovable / Bolt.new / Replit", color: C.blue,
    role: "GHL-native first. Where its portal can't give the polish — the admin command center, the AI matching board — I build a lightweight custom view reading from the GHL API and Supabase.",
  },
  {
    Icon: MessageSquare, name: "Comms & alerts", app: "GoHighLevel SMS/email + Slack", color: C.rose,
    role: "Native GHL SMS + email handles confirmations, the scheduled reminders, and the announcements that replace WhatsApp — one system, and it runs on Twilio under the hood. Slack pings the internal team on new bookings and payouts due.",
    also: "A standalone Twilio account only if we ever need voice or WhatsApp at scale. (US SMS needs A2P 10DLC registration in GHL.)",
  },
  {
    Icon: ClipboardList, name: "Project tracking", app: "ClickUp / Notion + this workspace", color: C.coral,
    role: "The build itself is tracked here on the milestones page as the shared source of truth, with ClickUp or Notion for internal task detail and SOP documentation.",
  },
];

// ── How one booking flows through the stack ──────────────────
type Step = { Icon: typeof Handshake; title: string; app: string; color: string; detail: string };
const FLOW: Step[] = [
  { Icon: Handshake, title: "Client submits form", app: "GoHighLevel", color: C.rose,
    detail: "Booking / questionnaire lands in the Client sub-account as a contact + opportunity, with event type, location, package, and music preferences." },
  { Icon: Workflow, title: "Automation fires", app: "Make.com", color: C.coral,
    detail: "A scenario triggers on the new submission and orchestrates the next steps — no one has to kick it off by hand." },
  { Icon: MapPin, title: "Match nearest bands", app: "Supabase", color: C.cyan,
    detail: "Geocode the venue, filter the talent database by genre + travel radius + availability, and rank a shortlist by distance and fit." },
  { Icon: Bot, title: "AI assists", app: "Claude", color: C.purple,
    detail: "Turns the free-text brief into clean tags for the match, and powers the client-side song suggestions — grounded so it respects the do-not-play list." },
  { Icon: Users, title: "Admin assembles the band", app: "GHL / custom view", color: C.blue,
    detail: "The ranked shortlist appears in the command center; admin assigns the band and generates the proposal / contract." },
  { Icon: CalendarClock, title: "Gig offers + calendars", app: "GHL + Google", color: C.green,
    detail: "Each artist gets a gig offer to accept/decline; on accept it drops onto their calendar and schedules SMS + email reminders." },
  { Icon: CreditCard, title: "Invoicing", app: "Stripe via GHL", color: C.amber,
    detail: "Deposit invoice out, final-payment reminder auto-fires 21 days before the event, payments tracked against the booking." },
  { Icon: PartyPopper, title: "Event runs", app: "GHL", color: C.rose,
    detail: "Production packet distributed, event performed, then marked complete in the pipeline." },
  { Icon: HandCoins, title: "Payout list", app: "GHL / Supabase", color: C.cyan,
    detail: "Only after complete, each artist appears on the payout list at their own rate — paid manually, then marked paid." },
  { Icon: Repeat, title: "Follow-up + nurture", app: "GoHighLevel", color: C.purple,
    detail: "Thank-you, review, referral, and future-event follow-up automations, then the client enters the CRM nurture." },
];

// ── Tool-by-job table ────────────────────────────────────────
const TABLE: { job: string; app: string; why: string }[] = [
  { job: "Client & talent portals, pipelines, contracts, invoicing, calendars", app: "GoHighLevel", why: "Does 80% of the SOP natively; two sub-accounts keep client + talent cleanly separated." },
  { job: "Connecting everything + triggering the AI", app: "Make.com / n8n", why: "Visual, reliable orchestration; n8n for heavier custom logic." },
  { job: "Song suggestions, brief parsing, Q&A assistants", app: "Claude", why: "Strong instruction-following and safe, grounded output." },
  { job: "Song library + SOP grounding + band matching", app: "Supabase", why: "Postgres for the data + vector search for retrieval + distance maths." },
  { job: "Client deposits & final balance", app: "Stripe", why: "Integrates with GHL; handles the deposit → final flow." },
  { job: "Charts, backing tracks, audio, packets", app: "Google Drive", why: "Already your resource home; portal links straight to it." },
  { job: "Polished admin command center / matching board", app: "Lovable / Bolt.new", why: "Custom UI only where GHL's native view isn't enough." },
  { job: "Internal team alerts", app: "Slack", why: "New booking + payout-due pings where the team already works." },
];

// ── How we work together ─────────────────────────────────────
const PROCESS: { k: string; v: string }[] = [
  { k: "Shared source of truth", v: "This milestones workspace stays live and updated as each item moves — you always see exactly where the build is." },
  { k: "Weekly cadence", v: "A short weekly check-in to review progress, unblock decisions, and confirm the next phase's priorities." },
  { k: "Ship in phases", v: "Each phase delivers something usable — client side, then talent side, then AI — so value shows up early, not all at the end." },
  { k: "Communication", v: "Slack or email for day-to-day, with anything decided written back into the workspace so nothing lives only in a chat." },
  { k: "Access I'll need", v: "Both GHL sub-accounts, the talent database, the Google Drive resource folders, and the Stripe account (or whoever owns it)." },
];

// ── Alternatives considered ──────────────────────────────────
const ROUTES: { name: string; stack: string; best: string; trade: string; pick: boolean; color: string }[] = [
  { name: "GHL-centric", stack: "GoHighLevel + Make/n8n + Claude + Supabase + Stripe", best: "Fastest launch, lowest cost, your team can manage it, one source of truth.", trade: "You work within GHL's UI for most screens.", pick: true, color: C.green },
  { name: "No-code app builders", stack: "Bubble / Softr / Base44 / Lovable on Airtable or Supabase", best: "More custom look than GHL, still fast, little code.", trade: "Rebuilds what GHL gives free (auth, invoicing, comms); more pieces to maintain.", pick: false, color: C.amber },
  { name: "Full custom code", stack: "Next.js + Node + Supabase + Stripe + Clerk on Vercel", best: "Total control, fully bespoke, built to scale.", trade: "Most time and money, and needs a developer forever. The $15–30k agency route.", pick: false, color: C.coral },
  { name: "Off-the-shelf event tool", stack: "HoneyBook / Dubsado / 17hats", best: "Instant client CRM, proposals, contracts, payments.", trade: "Client-side only — no talent portal, band matching, or gig sheets, which is TCE's whole edge.", pick: false, color: C.rose },
];

const ALTS: { fn: string; opts: string }[] = [
  { fn: "Backbone / portals", opts: "GoHighLevel · Bubble · Softr · custom Next.js" },
  { fn: "Data / backend", opts: "Supabase · Firebase · Airtable" },
  { fn: "Automation", opts: "Make · n8n · Zapier · Pipedream" },
  { fn: "AI models", opts: "Claude · OpenAI · Gemini" },
  { fn: "AI search / memory", opts: "Supabase pgvector · Pinecone · Weaviate" },
  { fn: "E-signature", opts: "GHL native · DocuSign · PandaDoc · Dropbox Sign" },
  { fn: "Payments", opts: "Stripe · Square · PayPal · GHL payments" },
  { fn: "Proposals", opts: "GHL · PandaDoc · Qwilr · Better Proposals" },
  { fn: "Forms / questionnaire", opts: "GHL · Fillout · Typeform · Jotform" },
  { fn: "Scheduling", opts: "GHL calendars · Calendly · Cal.com" },
  { fn: "Comms (SMS + email)", opts: "GHL native · Twilio · SendGrid" },
  { fn: "Files / documents", opts: "Google Drive · Dropbox" },
];

export default function TceBuildStack() {
  const [flowI, setFlowI] = useState(0);
  const [openLayer, setOpenLayer] = useState<string>("Backbone / CRM & portals");
  const f = FLOW[flowI];

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 20px 90px" }}>
        {/* Nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <Link href="/clients/tce-entertainment/milestones" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
            <ArrowLeft size={15} /> Milestones & checklist
          </Link>
          <Link href="/clients/tce-entertainment/portals" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.rose, fontSize: 13, textDecoration: "none", fontWeight: 700 }}>
            See the 3 portals <ArrowRight size={14} />
          </Link>
        </div>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: C.rose, fontSize: 12, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <Layers size={14} /> TCE Entertainment · Build Stack
          </div>
          <h1 style={{ fontSize: 33, lineHeight: 1.14, margin: "12px 0 8px", fontWeight: 800, letterSpacing: -0.5 }}>
            How we build it — the stack & workflow
          </h1>
          <p style={{ color: C.sub, fontSize: 15, maxWidth: 720, margin: 0, lineHeight: 1.6 }}>
            Which app does which job, how one booking flows through the whole system, and how we work together week to week.
            The rule: GoHighLevel does the heavy lifting, automation is the glue, AI adds judgment, and custom code appears
            only where it earns its place.
          </p>
        </div>

        {/* The stack in layers */}
        <Section title="The stack, in layers" Icon={Boxes} accent={C.rose}>
          <p style={{ color: C.sub, fontSize: 13.5, marginTop: -4, marginBottom: 16 }}>
            Each layer has one job and a chosen app. Tap to see what it does and the fallback where one exists.
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            {LAYERS.map((l) => {
              const isOpen = openLayer === l.name;
              return (
                <div key={l.name} style={{ background: C.card, border: `1px solid ${isOpen ? l.color + "66" : C.border}`, borderRadius: 14, overflow: "hidden" }}>
                  <button onClick={() => setOpenLayer(isOpen ? "" : l.name)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 13, padding: "14px 16px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", color: C.ink }}>
                    <span style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 11, background: l.color + "1F", display: "grid", placeItems: "center" }}>
                      <l.Icon size={18} style={{ color: l.color }} />
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontSize: 12, color: C.muted, fontWeight: 600 }}>{l.name}</span>
                      <span style={{ display: "block", fontSize: 15.5, fontWeight: 800, color: l.color, marginTop: 1 }}>{l.app}</span>
                    </span>
                    <ChevronDown size={18} style={{ color: C.sub, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .25s", flexShrink: 0 }} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
                        <div style={{ padding: "0 16px 16px 67px" }}>
                          <p style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.6, margin: "0 0 8px" }}>{l.role}</p>
                          {l.also && (
                            <div style={{ fontSize: 12.5, color: C.muted, display: "flex", gap: 7, alignItems: "flex-start" }}>
                              <CircleCheck size={13} style={{ color: l.color, flexShrink: 0, marginTop: 2 }} /> {l.also}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Data flow */}
        <Section title="How one booking flows through the stack" Icon={Workflow} accent={C.coral}>
          <p style={{ color: C.sub, fontSize: 13.5, marginTop: -4, marginBottom: 16 }}>
            The same journey from your SOP, with the app doing the work at each step. Tap through it.
          </p>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10, marginBottom: 14 }}>
            {FLOW.map((st, idx) => {
              const on = idx === flowI;
              return (
                <button key={st.title} onClick={() => setFlowI(idx)}
                  style={{ flexShrink: 0, width: 130, textAlign: "left", cursor: "pointer", background: on ? C.cardHi : C.card, border: `1px solid ${on ? st.color : C.border}`, borderRadius: 12, padding: "11px 11px", transition: "all .16s" }}>
                  <st.Icon size={15} color={st.color} />
                  <div style={{ fontSize: 10.5, fontWeight: 800, color: st.color, marginTop: 6 }}>0{idx + 1}</div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: on ? C.ink : C.sub, marginTop: 2, lineHeight: 1.25 }}>{st.title}</div>
                </button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={f.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
              style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${f.color}`, borderRadius: 16, padding: "20px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${f.color}` }}>
                  <f.Icon size={19} color={f.color} />
                </div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 800 }}>{f.title}</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: f.color, marginTop: 2 }}>
                    <Boxes size={12} /> {f.app}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0 }}>{f.detail}</p>
            </motion.div>
          </AnimatePresence>
        </Section>

        {/* Tool-by-job table */}
        <Section title="Tool by job — the short version" Icon={Boxes} accent={C.amber}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
            {TABLE.map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12, padding: "13px 16px", borderTop: i === 0 ? "none" : `1px solid ${C.border}`, alignItems: "start" }}>
                <div>
                  <div style={{ fontSize: 13.5, color: C.ink, fontWeight: 600, lineHeight: 1.4 }}>{r.job}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 3, lineHeight: 1.45 }}>{r.why}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: C.amber, textAlign: "right" }}>{r.app}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Alternatives */}
        <Section title="Alternatives considered — and why this stack" Icon={Layers} accent={C.purple}>
          <p style={{ color: C.sub, fontSize: 13.5, marginTop: -4, marginBottom: 16 }}>
            There are four honest ways to build all of this. Here is each one, what it is good for, and the trade-off.
          </p>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            {ROUTES.map((r) => (
              <div key={r.name} style={{ background: r.pick ? C.cardHi : C.card, border: `1px solid ${r.pick ? r.color + "88" : C.border}`, borderTop: `3px solid ${r.color}`, borderRadius: 14, padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 15.5, fontWeight: 800, color: C.ink }}>{r.name}</span>
                  {r.pick && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: r.color, background: r.color + "1F", borderRadius: 999, padding: "3px 9px" }}>
                      <CircleCheck size={11} /> Recommended
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: r.color, marginBottom: 10, lineHeight: 1.4 }}>{r.stack}</div>
                <div style={{ fontSize: 12.5, color: C.sub, lineHeight: 1.5, marginBottom: 6 }}>
                  <span style={{ color: C.green, fontWeight: 700 }}>Best for: </span>{r.best}
                </div>
                <div style={{ fontSize: 12.5, color: C.sub, lineHeight: 1.5 }}>
                  <span style={{ color: C.amber, fontWeight: 700 }}>Trade-off: </span>{r.trade}
                </div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: C.muted, margin: "22px 0 10px" }}>
            Component by component
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
            {ALTS.map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "0.8fr 1.4fr", gap: 12, padding: "11px 16px", borderTop: i === 0 ? "none" : `1px solid ${C.border}` }}>
                <div style={{ fontSize: 13, color: C.ink, fontWeight: 700 }}>{r.fn}</div>
                <div style={{ fontSize: 12.5, color: C.sub, textAlign: "right" }}>{r.opts}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.green}`, borderRadius: 12, padding: "14px 16px", fontSize: 13, color: C.sub, lineHeight: 1.6 }}>
            <span style={{ color: C.ink, fontWeight: 700 }}>Bottom line: </span>
            fully custom is the $15–30k agency route and takes far longer, and off-the-shelf event tools only handle the
            client side — they can&apos;t do your talent portal or band matching. GoHighLevel already does about 80% of what
            you need, so we build on that and go custom only where it makes the experience better. Tailored system, without
            the custom price tag or the fragility of running two tools.
          </div>
        </Section>

        {/* How we work */}
        <Section title="How we work together" Icon={Handshake} accent={C.cyan}>
          <div style={{ display: "grid", gap: 10 }}>
            {PROCESS.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 13, alignItems: "flex-start", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px" }}>
                <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: 99, background: C.cyan + "1A", color: C.cyan, fontSize: 12, fontWeight: 800, display: "grid", placeItems: "center", marginTop: 1 }}>{i + 1}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>{p.k}</div>
                  <div style={{ fontSize: 13, color: C.sub, marginTop: 3, lineHeight: 1.55 }}>{p.v}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <div style={{ marginTop: 44, paddingTop: 24, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Benjamin Yson</div>
            <div style={{ fontSize: 13, color: C.muted }}>AI Automation & Applications · BVN</div>
          </div>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            <Link href="/clients/tce-entertainment/milestones" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: C.rose, fontSize: 13, textDecoration: "none", fontWeight: 700 }}>
              <ClipboardList size={15} /> Milestones
            </Link>
            <Link href="/clients/tce-entertainment/portals" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: C.sub, fontSize: 13, textDecoration: "none" }}>
              <Sparkles size={15} /> The 3 portals
            </Link>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: C.sub, fontSize: 13, textDecoration: "none" }}>
              <Megaphone size={15} /> bvnofficial.com
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

// ── Section wrapper ──────────────────────────────────────────
function Section({ title, Icon, accent, children }: { title: string; Icon: typeof Layers; accent: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 40 }}>
      <h2 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 19, fontWeight: 800, margin: "0 0 14px" }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: accent + "1A", display: "grid", placeItems: "center" }}>
          <Icon size={17} style={{ color: accent }} />
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}
