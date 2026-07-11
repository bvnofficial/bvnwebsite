"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ChevronDown, CircleCheck, Circle, CircleDashed, Clock,
  Users, Music, ShieldCheck, ListChecks, Workflow, Bot, MapPin,
  FileSignature, CreditCard, LayoutDashboard, Sparkles, Megaphone,
  HelpCircle, Building2, UserRound, Tag, ArrowRight, FileText,
  ClipboardList, HandCoins, PartyPopper, Repeat, Handshake, Truck,
  FolderOpen, Layers,
} from "lucide-react";

// ── Brand tokens (TCE × BVN, rose theme) ─────────────────────
const C = {
  bg: "#0A1120", bg2: "#0E1830", card: "#121E3A", cardHi: "#16264A",
  border: "#22324F", ink: "#EAF1FC", sub: "#9FB1D0", muted: "#647697",
  rose: "#FB7185", coral: "#FB923C", amber: "#FBBF24", green: "#34D399",
  cyan: "#22D3EE", blue: "#3B82F6", purple: "#A78BFA", red: "#F87171",
};

const LAST_UPDATED = "11 July 2026";

type Status = "done" | "active" | "todo";
type Item = { label: string; status: Status };
type Phase = {
  code: string; name: string; window: string; objective: string;
  Icon: typeof Users; accent: string; items: Item[];
};

// ── The 13-phase TCE production journey (from their SOP) ──────
type Flow = { Icon: typeof FileText; title: string; owner: string; detail: string; color: string };
const FLOW: Flow[] = [
  { Icon: Handshake, title: "1 · Sales → Contract", owner: "Sales", color: C.rose,
    detail: "Client selects an entertainment package. Contract is generated and signed — client name, event date, venue, event type, package, performance times, pricing, special terms — and saved to the client file. Automated in the CLIENT sub-account." },
  { Icon: CreditCard, title: "2 · Finance", owner: "Finance", color: C.coral,
    detail: "Welcome email from Finance. Deposit invoice issued and collected. Final-payment reminder fires automatically 21 days before the event. Final payment received, and Finance confirms payment status to Production." },
  { Icon: ClipboardList, title: "3 · Production onboarding", owner: "Production", color: C.amber,
    detail: "Production introduces itself and sends the client the welcome email, production contact, stage requirements, technical rider, hospitality rider, electrical + sound requirements, and the production timeline." },
  { Icon: Truck, title: "4 · Venue coordination", owner: "Production", color: C.green,
    detail: "Production gathers venue + venue-production contacts and load-in / load-out details, then requests the Certificate of Insurance (COI), which is issued and delivered to the venue." },
  { Icon: Music, title: "5 · Client portal & music planning", owner: "Production", color: C.cyan,
    detail: "Client gets portal access: the event questionnaire (ceremony, cocktail, reception, first dance, parent dances, intros, grand entrance, must-play, do-not-play, timeline, name pronunciation, announcements, vendor contacts) and the song library. AI can suggest songs here. Client submits final selections." },
  { Icon: Users, title: "6 · Talent booking", owner: "Booking", color: C.blue,
    detail: "Based on the package (e.g. 12-piece band, Chicago), Booking searches the talent database — name, instrument, role, city/state, travel radius, rates, availability, bio, photos, docs, W-9, direct deposit — and assembles the band. AI surfaces the nearest fitting artists." },
  { Icon: FileSignature, title: "7 · Gig offer", owner: "Booking", color: C.purple,
    detail: "Each artist gets a gig offer: date, venue, address, event type, call time, performance times, dress code, parking, hotel, travel, gig pay, notes. On accept, the event drops onto their calendar and confirmation + SMS + email reminders are scheduled." },
  { Icon: UserRound, title: "8 · Talent portal", owner: "Booking", color: C.rose,
    detail: "Each artist's secure portal: upcoming gigs, past gigs, calendar, payments, contracts, tax documents, gig notes, music charts, set lists, production schedule, and contacts." },
  { Icon: ListChecks, title: "9 · Music director prep", owner: "Production + MD", color: C.coral,
    detail: "Once the client finalizes music, Production sends the finalized packet — timeline, set lists, ceremony/cocktail/reception music, first dance, parent dances, intros, must-play, do-not-play, special requests — to the Musical Director, Band Leader, musicians, and vocalists." },
  { Icon: PartyPopper, title: "10 · Event production", owner: "Production", color: C.amber,
    detail: "Production runs load-in, stage setup, sound, lighting, backline, vendor coordination, timeline execution, and client comms. Entertainment performs." },
  { Icon: ClipboardList, title: "11 · Post event", owner: "Production", color: C.green,
    detail: "Production confirms event completion, logs notes, issues, client feedback, photos/videos, and the internal recap. Marking the event complete is what unlocks talent payment." },
  { Icon: HandCoins, title: "12 · Talent payments", owner: "Finance", color: C.cyan,
    detail: "Once the gig is marked complete, an artist invoice / payment record is generated at their own rate. Finance reviews, payment is processed and confirmed, and the history is stored in the Talent Portal." },
  { Icon: Repeat, title: "13 · Client follow-up", owner: "Sales / Marketing", color: C.purple,
    detail: "Thank-you email, review request, photo/video request, testimonial, referral, and future-event follow-up — then the client is added to the CRM nurture campaign." },
];

// ── The three portals (aligned to SOP core systems) ──────────
type Portal = { Icon: typeof UserRound; name: string; sub: string; color: string; bullets: string[] };
const PORTALS: Portal[] = [
  {
    Icon: UserRound, name: "Client portal", sub: "GHL — Client sub-account", color: C.rose,
    bullets: [
      "Booking form + questionnaire: ceremony, cocktail, reception, first dance, parent dances, intros, timeline, name pronunciation, vendor contacts",
      "Must-play / do-not-play, special announcements, and their Spotify playlist",
      "Their live gig sheet + run of show (client view of the same event record) and final music selections",
      "Contract, deposit + final invoices, COI, and documents in one place",
    ],
  },
  {
    Icon: Music, name: "Talent portal", sub: "GHL — Talent sub-account", color: C.cyan,
    bullets: [
      "Assigned to a gig → that event's gig sheet, run of show, stage plot, and music appear automatically under the gig",
      "Gig offer accept / decline; event info: pay, role, venue, call time, dress code, parking, lineup, emergency contact",
      "Set list (song, key, vocalist) + charts, backing tracks, audio, video and Spotify links from Drive",
      "Upcoming + past gigs, calendar (auto-added), payments, contracts, tax docs (W-9, direct deposit)",
    ],
  },
  {
    Icon: LayoutDashboard, name: "Admin command center", sub: "Across both sub-accounts", color: C.amber,
    bullets: [
      "Sees every event's full materials across Sales, Finance, Production, and Booking",
      "Generates the gig sheet + run of show from the form data; controls artist-facing vs internal files",
      "Talent database search + AI nearest-band matching to assemble the band",
      "Contracts, deposit / 21-day final reminders, music-director packet, and the completed-gig payout list",
    ],
  },
];

// ── Event info: one record, every portal ─────────────────────
type EventStep = { Icon: typeof FileText; title: string; color: string; body: string };
const EVENTFLOW: EventStep[] = [
  { Icon: ClipboardList, title: "Captured once, from the client", color: C.rose,
    body: "The booking form and questionnaire gather the event details, so the information is entered a single time and never re-typed into a document." },
  { Icon: FileText, title: "Gig sheet + run of show generated in GHL", color: C.coral,
    body: "GHL builds the gig sheet and run of show from those fields — consistent every event, live-updating, and exportable as a branded PDF. No sheet is made by hand." },
  { Icon: FolderOpen, title: "Media linked from Google Drive", color: C.amber,
    body: "Stage plots, charts, backing tracks, MP3s, video and Spotify links stay as files in the event's Drive folder (named EVENT INFO-[date] [location] [type]) and are surfaced in the portal." },
  { Icon: Users, title: "Auto-appears when a musician is assigned", color: C.cyan,
    body: "The moment an artist is chosen for the gig, that event's gig sheet, run of show, stage plot, and music appear in their portal under the gig. Only assigned artists see it." },
  { Icon: Layers, title: "One record, a role-based view for each side", color: C.green,
    body: "Client, talent, and admin all read the same event record: the client sees their view, the artist sees the gig sheet + resources, and admin sees everything and controls what is artist-facing vs internal." },
];

// ── GHL account structure ────────────────────────────────────
type Sub = { Icon: typeof Building2; name: string; holds: string; color: string; rows: string[] };
const SUBS: Sub[] = [
  {
    Icon: Building2, name: "Sub-account 1 — CLIENTS", holds: "Powers the client portal", color: C.rose,
    rows: [
      "Contacts = clients & leads; contract + package on file",
      "Event questionnaire + song library + music selections",
      "Pipeline: Sales → Contract → Deposit → Onboarding → Music → Booked → Event → Follow-up",
      "Deposit + final invoicing, 21-day reminder, COI + documents",
    ],
  },
  {
    Icon: Building2, name: "Sub-account 2 — TALENT", holds: "Powers the talent portal", color: C.cyan,
    rows: [
      "Contacts = artists, tagged by band, instrument / role, and location",
      "Profile: city/state, travel radius, rate, availability, bio, photos",
      "Gig offers, calendar, set lists, charts, production schedule",
      "Payments, contracts, W-9 + direct deposit on file",
    ],
  },
];

// ── Phased build milestones ──────────────────────────────────
const phases: Phase[] = [
  {
    code: "Phase 0", name: "Discovery & foundation", window: "Week 1",
    Icon: ShieldCheck, accent: C.rose,
    objective: "Lock the data model and access so nothing is rebuilt later. Map the existing SOP and event Drive onto the two sub-accounts, and confirm the talent database, tags, rates, and gig-sheet fields the whole system runs on.",
    items: [
      { label: "Access to both GHL sub-accounts (or create Client + Talent sub-accounts)", status: "todo" },
      { label: "Import / confirm talent database: name, instrument, role, city/state, travel radius, rate, availability, bio, photos, W-9, direct deposit", status: "todo" },
      { label: "Confirm band names + instrument/role tag taxonomy for tagging every artist", status: "todo" },
      { label: "Map the current Gig Sheet + Run of Show fields to GHL custom fields (venue, timeline, dances, must/do-not-play, dress code, call time, parking)", status: "todo" },
      { label: "Confirm Drive folder-per-event convention (EVENT INFO-[date] [location] [type]) + which files are artist-facing vs internal/locked", status: "todo" },
      { label: "Confirm music sources handled: uploaded MP3 files AND Spotify playlist links", status: "todo" },
      { label: "Confirm packages, pricing, and contract terms from the Sales SOP", status: "todo" },
    ],
  },
  {
    code: "Phase 1", name: "Client side — Sales, Finance, gig-sheet data", window: "Weeks 1–2",
    Icon: Handshake, accent: C.coral,
    objective: "SOP Phases 1–2. Package selection to signed contract, the gig-sheet + run-of-show fields on the event record, and the finance automation: deposit invoice, collection, and the 21-day final-payment reminder.",
    items: [
      { label: "Package selection + contract generation (name, date, venue, type, package, times, pricing, terms)", status: "todo" },
      { label: "Client pipeline stages + client file", status: "todo" },
      { label: "Gig sheet + run of show custom fields on the event record (the single source the portals read)", status: "todo" },
      { label: "Finance: welcome email, deposit invoice, deposit collection", status: "todo" },
      { label: "Auto final-payment reminder 21 days before event + payment confirmation to Production", status: "todo" },
    ],
  },
  {
    code: "Phase 2", name: "Client portal — music planning & their event", window: "Weeks 2–3",
    Icon: Music, accent: C.purple,
    objective: "SOP Phases 3–5. Production onboarding docs, the client portal questionnaire + Spotify playlist, and the client's own view of their gig sheet and run of show.",
    items: [
      { label: "Production onboarding: welcome, contact, stage/technical/hospitality riders, electrical + sound, timeline", status: "todo" },
      { label: "Client portal questionnaire (ceremony → reception, must-play / do-not-play, timeline, name pronunciation, vendor contacts)", status: "todo" },
      { label: "Song library + Spotify playlist + client music selections capture", status: "todo" },
      { label: "Client view of their gig sheet + run of show (their side of the shared event record)", status: "todo" },
      { label: "Venue coordination + COI request / tracking (Phase 4)", status: "todo" },
    ],
  },
  {
    code: "Phase 3", name: "Talent side — booking, offers, auto-materials", window: "Weeks 3–4",
    Icon: Users, accent: C.cyan,
    objective: "SOP Phases 6–8 plus Troy's ask: when an artist is chosen, the event's materials appear in their portal automatically. Talent search, gig offers, calendar, reminders, and the full talent portal.",
    items: [
      { label: "Talent database search + assemble band from package", status: "todo" },
      { label: "Gig offer (date, venue, call time, dress code, parking, hotel, travel, pay) with accept / decline", status: "todo" },
      { label: "On accept: calendar add + confirmation + scheduled SMS & email reminders", status: "todo" },
      { label: "On assignment: auto-surface the event's gig sheet, run of show, stage plot, and music into the artist's portal", status: "todo" },
      { label: "Artist-facing vs internal visibility rules (hide locked internal docs like Reminders + Vendor Guidelines)", status: "todo" },
      { label: "Talent portal: upcoming/past gigs, calendar, payments, contracts, tax docs, charts, set lists, PDFs + video/music links", status: "todo" },
    ],
  },
  {
    code: "Phase 4", name: "AI layer + music director packet", window: "Weeks 4–5",
    Icon: Bot, accent: C.green,
    objective: "SOP Phase 9 plus the AI. Nearest-band matching, client-side song suggestions, both-side Q&A, and the finalized music-director packet distribution.",
    items: [
      { label: "AI nearest-band matching: package + location + travel radius + availability → ranked shortlist", status: "todo" },
      { label: "Client-side AI: song / playlist suggestions (open LLM) + questionnaire help", status: "todo" },
      { label: "Talent-side AI: answers artist questions (schedule, gig details, pay, resources)", status: "todo" },
      { label: "Music-director packet auto-compiled + sent to MD, band leader, musicians, vocalists", status: "todo" },
    ],
  },
  {
    code: "Phase 5", name: "Command center, PDF, launch", window: "Weeks 5–6",
    Icon: LayoutDashboard, accent: C.amber,
    objective: "SOP Phases 10–13. The admin command center over one event record, generated PDFs, the WhatsApp replacement, post-event recap, completed-gig payouts, follow-up, and launch on the TCE website.",
    items: [
      { label: "Admin command center: unified view of every event + assign band + generate proposal/contract", status: "todo" },
      { label: "Generate branded gig-sheet / run-of-show PDF from GHL data, saved to the event + its Drive folder", status: "todo" },
      { label: "Role-based views verified: client, talent, and admin all read the one event record", status: "todo" },
      { label: "Move all artist comms into the portal + native GHL SMS/email (replace WhatsApp per Troy)", status: "todo" },
      { label: "Post-event recap + mark complete (unlocks talent payment)", status: "todo" },
      { label: "Payout list: per-artist rate, completed-gigs only, manual pay + history to Talent Portal", status: "todo" },
      { label: "Client follow-up (thank-you, review, referral) + CRM nurture", status: "todo" },
      { label: "TCE-branded site with Client + Talent logins + Admin entry; end-to-end test + handover", status: "todo" },
    ],
  },
];

// ── Open questions still needed from Troy ────────────────────
const OPEN: { q: string; why: string }[] = [
  { q: "Do the two GHL sub-accounts exist yet, and is there a talent database to import (or do we build it)?", why: "Decides whether Phase 0 is a migration or a clean build." },
  { q: "Is the Drive folder-per-event naming consistent across all events (like EVENT INFO-07.11.26 NJ Wedding)?", why: "Consistent naming is what lets the automation map each gig to its folder and auto-surface files." },
  { q: "For Drive access: link-based sharing to start, or the Google Drive API for tighter per-artist control?", why: "Sets how assigned artists open the gig sheet, stage plot, and media in their portal." },
  { q: "Payment processor for client deposits + final balance — Stripe, GHL payments, other?", why: "Wires the Finance automation (Phase 2) and the 21-day reminder." },
  { q: "Talent payouts — bank/direct deposit via the W-9 on file, or another method?", why: "Sets how the completed-gig payout list is actioned (Phase 12)." },
  { q: "Who owns COI / insurance issuance, and can we trigger the request from the platform?", why: "Automates Phase 4 venue coordination cleanly." },
];

function statusIcon(s: Status, accent: string) {
  if (s === "done") return <CircleCheck size={18} style={{ color: C.green }} />;
  if (s === "active") return <CircleDashed size={18} style={{ color: accent }} className="bvn-spin-slow" />;
  return <Circle size={18} style={{ color: C.muted }} />;
}

export default function TceMilestones() {
  const [open, setOpen] = useState<string>("Phase 0");
  const [flowI, setFlowI] = useState(0);
  const f = FLOW[flowI];

  const { pct, done, total } = useMemo(() => {
    const all = phases.flatMap((p) => p.items);
    const score = all.reduce((a, i) => a + (i.status === "done" ? 1 : i.status === "active" ? 0.5 : 0), 0);
    return {
      pct: Math.round((score / all.length) * 100),
      done: all.filter((i) => i.status === "done").length,
      total: all.length,
    };
  }, []);

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <style>{`
        .bvn-spin-slow { animation: bvnspin 2.2s linear infinite; }
        @keyframes bvnspin { to { transform: rotate(360deg); } }
        .bvn-pulse { animation: bvnpulse 1.8s ease-in-out infinite; }
        @keyframes bvnpulse { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
      `}</style>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 20px 90px" }}>
        {/* Back */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <Link href="/clients/tce-entertainment/booking-platform" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
            <ArrowLeft size={15} /> Booking platform overview
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <Link href="/clients/tce-entertainment/build-stack" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none", fontWeight: 700 }}>
              Build stack <ArrowRight size={14} />
            </Link>
            <Link href="/clients/tce-entertainment/portals" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.rose, fontSize: 13, textDecoration: "none", fontWeight: 700 }}>
              See the 3 portals <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.rose, fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase" }}>
            <span className="bvn-pulse" style={{ width: 8, height: 8, borderRadius: 99, background: C.rose, display: "inline-block" }} />
            TCE Entertainment · Client Build Workspace
          </div>
          <h1 style={{ fontSize: 33, lineHeight: 1.14, margin: "12px 0 8px", fontWeight: 800, letterSpacing: -0.5 }}>
            Booking platform — workflow, milestones & checklist
          </h1>
          <p style={{ color: C.sub, fontSize: 15, maxWidth: 720, margin: 0, lineHeight: 1.6 }}>
            Built directly from your Production SOP, Artist Platform SOP, your live event Drive, and Troy&apos;s notes. Two
            GoHighLevel sub-accounts, three portals reading one shared event record, an AI matching and song layer, and an
            admin command center — mapped step for step to your existing 13-phase journey across Sales, Finance, Production,
            and Booking. This is the shared source of truth, updated as each item moves.
          </p>
        </div>

        {/* Status row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 22 }}>
          <div style={{ flex: "1 1 260px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ color: C.sub, fontSize: 13 }}>Overall build</span>
              <span style={{ fontSize: 22, fontWeight: 800 }}>{pct}%</span>
            </div>
            <div style={{ height: 9, background: C.bg2, borderRadius: 99, marginTop: 10, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${C.rose}, ${C.coral})`, borderRadius: 99, transition: "width .6s ease" }} />
            </div>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>
              {done} of {total} items complete · status: <span style={{ color: C.amber }}>Planning — awaiting kickoff</span>
            </div>
          </div>

          <div style={{ flex: "1 1 200px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
            <div style={{ color: C.sub, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
              <Layers size={15} /> Scope
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 8, lineHeight: 1.5 }}>Booking platform + AI</div>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>Client · Talent · Admin portals</div>
          </div>

          <div style={{ flex: "1 1 200px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
            <div style={{ color: C.sub, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
              <Clock size={15} /> Last updated
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 8 }}>{LAST_UPDATED}</div>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>Updated as each checklist item moves</div>
          </div>
        </div>

        {/* GHL structure */}
        <Section title="How it's structured — 2 GHL sub-accounts, 3 portals" Icon={Building2} accent={C.rose}>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {SUBS.map((s) => (
              <div key={s.name} style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${s.color}`, borderRadius: 16, padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 36, height: 36, borderRadius: 10, background: s.color + "1F", display: "grid", placeItems: "center" }}>
                    <s.Icon size={18} style={{ color: s.color }} />
                  </span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>{s.holds}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gap: 7, marginTop: 14 }}>
                  {s.rows.map((r, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: C.sub, lineHeight: 1.5 }}>
                      <Tag size={13} style={{ color: s.color, flexShrink: 0, marginTop: 3 }} /> {r}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", marginTop: 12 }}>
            {PORTALS.map((p) => (
              <div key={p.name} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${p.color}`, borderRadius: 14, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                  <p.Icon size={17} style={{ color: p.color }} />
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 800 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{p.sub}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  {p.bullets.map((b, i) => (
                    <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start", fontSize: 12.5, color: C.sub, lineHeight: 1.5 }}>
                      <CircleCheck size={13} style={{ color: p.color, flexShrink: 0, marginTop: 2 }} /> {b}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Event info: one record, every portal */}
        <Section title="Gig sheet & resources — one record, every portal" Icon={Layers} accent={C.green}>
          <p style={{ color: C.sub, fontSize: 13.5, marginTop: -4, marginBottom: 16 }}>
            The gig sheet is not made by hand. It is built in GHL from the information the client already gives you, the Drive
            media is linked to it, and the whole package appears automatically for the assigned musician, the client, and admin —
            each seeing their own view of the same event.
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            {EVENTFLOW.map((e, i) => (
              <div key={i} style={{ display: "flex", gap: 13, alignItems: "flex-start", background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${e.color}`, borderRadius: 14, padding: "14px 16px" }}>
                <span style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 10, background: e.color + "1F", display: "grid", placeItems: "center" }}>
                  <e.Icon size={17} style={{ color: e.color }} />
                </span>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 800, color: C.ink }}>
                    <span style={{ color: e.color, marginRight: 7 }}>{i + 1}.</span>{e.title}
                  </div>
                  <div style={{ fontSize: 13, color: C.sub, marginTop: 3, lineHeight: 1.55 }}>{e.body}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* The 13-phase workflow */}
        <Section title="Your workflow — the 13-phase journey, automated" Icon={Workflow} accent={C.coral}>
          <p style={{ color: C.sub, fontSize: 13.5, marginTop: -4, marginBottom: 16 }}>
            Straight from your Production SOP: Sales to follow-up, with the owning department on each step and where the AI and
            automation take the manual work off your team. Tap each phase.
          </p>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10, marginBottom: 14 }}>
            {FLOW.map((st, idx) => {
              const on = idx === flowI;
              return (
                <button key={st.title} onClick={() => setFlowI(idx)}
                  style={{ flexShrink: 0, width: 128, textAlign: "left", cursor: "pointer", background: on ? C.cardHi : C.card, border: `1px solid ${on ? st.color : C.border}`, borderRadius: 12, padding: "11px 11px", transition: "all .16s" }}>
                  <st.Icon size={15} color={st.color} />
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: on ? C.ink : C.sub, marginTop: 8, lineHeight: 1.25 }}>{st.title}</div>
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
                    <Users size={12} /> Owner: {f.owner}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0 }}>{f.detail}</p>
            </motion.div>
          </AnimatePresence>
        </Section>

        {/* Phases / milestones */}
        <Section title="Milestones — the phased build" Icon={ListChecks} accent={C.amber}>
          <p style={{ color: C.sub, fontSize: 13.5, marginTop: -4, marginBottom: 16 }}>
            Sequenced by dependency and mapped to your SOP phases: lock the data model, build the client side (Sales → Finance
            → music planning), then the talent side, layer the AI on top, and finish with the command center and launch.
          </p>
          <div style={{ display: "grid", gap: 12 }}>
            {phases.map((p) => {
              const isOpen = open === p.code;
              const pDone = p.items.filter((i) => i.status === "done").length;
              return (
                <div key={p.code} style={{ background: C.card, border: `1px solid ${isOpen ? p.accent + "66" : C.border}`, borderRadius: 16, overflow: "hidden" }}>
                  <button onClick={() => setOpen(isOpen ? "" : p.code)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", color: C.ink }}>
                    <span style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 12, background: p.accent + "1F", display: "grid", placeItems: "center" }}>
                      <p.Icon size={20} style={{ color: p.accent }} />
                    </span>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: p.accent }}>{p.code}</span>
                        <span style={{ fontSize: 11, color: C.muted }}>· {p.window}</span>
                      </span>
                      <span style={{ display: "block", fontSize: 16, fontWeight: 700, marginTop: 2 }}>{p.name}</span>
                    </span>
                    <span style={{ flexShrink: 0, fontSize: 12, color: C.muted, marginRight: 4 }}>{pDone}/{p.items.length}</span>
                    <ChevronDown size={18} style={{ color: C.sub, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .25s" }} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
                        <div style={{ padding: "0 18px 18px" }}>
                          <div style={{ padding: "12px 14px", background: C.bg2, borderRadius: 12, marginBottom: 14, border: `1px solid ${C.border}`, fontSize: 13, color: C.sub, lineHeight: 1.55 }}>
                            {p.objective}
                          </div>
                          <div style={{ display: "grid", gap: 8 }}>
                            {p.items.map((it, idx) => (
                              <div key={idx} style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "8px 4px" }}>
                                <span style={{ flexShrink: 0, marginTop: 1 }}>{statusIcon(it.status, p.accent)}</span>
                                <span style={{ fontSize: 14, color: C.ink, lineHeight: 1.5 }}>{it.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Open questions */}
        <Section title="What I still need from you" Icon={HelpCircle} accent={C.cyan}>
          <p style={{ color: C.sub, fontSize: 13.5, marginTop: -4, marginBottom: 16 }}>
            Your SOP answers most of it. These few unblock the rest — especially the talent database and where the resources live.
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            {OPEN.map((o, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 99, background: C.cyan + "1A", color: C.cyan, fontSize: 12, fontWeight: 800, display: "grid", placeItems: "center", marginTop: 1 }}>{i + 1}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, lineHeight: 1.45 }}>{o.q}</div>
                    <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4, lineHeight: 1.5 }}>Why it matters: {o.why}</div>
                  </div>
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
            <Link href="/clients/tce-entertainment/portals" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: C.rose, fontSize: 13, textDecoration: "none", fontWeight: 700 }}>
              <Sparkles size={15} /> See the 3 portals
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
function Section({ title, Icon, accent, children }: { title: string; Icon: typeof Users; accent: string; children: React.ReactNode }) {
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
