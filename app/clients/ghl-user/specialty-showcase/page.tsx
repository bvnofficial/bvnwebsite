"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Workflow, GitBranch, Filter, Layers, Send,
  Calendar, PhoneCall, Terminal, Cable, Bot, Star, GraduationCap,
  BarChart3, Globe, MapPin, Clock, CheckCircle2, Sparkles,
  Briefcase, Award, Quote, ImageOff,
} from "lucide-react";

// Brand tokens (BVN client-proposal palette)
const C = {
  bg: "#0A1120",
  bg2: "#0E1830",
  card: "#121E3A",
  cardHi: "#16264A",
  border: "#22324F",
  ink: "#EAF1FC",
  sub: "#9FB1D0",
  muted: "#647697",
  cyan: "#22D3EE",
  green: "#34D399",
  amber: "#FBBF24",
  coral: "#FB923C",
  purple: "#A78BFA",
  blue: "#3B82F6",
  rose: "#FB7185",
  red: "#F87171",
};

// ─────────────────────────────────────────────────────────────
// Section wrapper
function Section({
  eyebrow, title, sub, children,
}: {
  eyebrow: string; title: string; sub?: string; children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      style={{ marginTop: 64 }}
    >
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: C.coral }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 800, margin: "8px 0 6px", letterSpacing: -0.4 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 660, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. Specialty explorer (the centerpiece: click a specialty, read the depth)
type Spec = {
  id: string;
  Icon: typeof Workflow;
  name: string;
  tag: string;
  detail: string;
  color: string;
};

const SPECIALTIES: Spec[] = [
  {
    id: "workflows",
    Icon: GitBranch,
    name: "Workflows and automation",
    tag: "Branching, not linear drips",
    detail:
      "Advanced multi step workflows with real conditional branching, wait steps, if and else logic, goal events, and internal notifications. I build the new lead, urgent lead, nurture, review, referral, and handoff flows a business actually runs on, tested with sample contacts before anything goes live. I suppress automation on sensitive terminal events so a human reviews them first.",
    color: C.coral,
  },
  {
    id: "pipelines",
    Icon: Filter,
    name: "Pipelines and CRM architecture",
    tag: "Stage is the source of truth",
    detail:
      "Pipelines designed with clear entry and exit criteria so the stage is the single source of truth and reporting stays accurate without anyone updating a spreadsheet. I have shipped 9 stage family inquiry pipelines, 5 stage professional relationship pipelines, and multi division boards, plus the tag taxonomy, custom fields, and custom values that hold it all together.",
    color: C.cyan,
  },
  {
    id: "subaccounts",
    Icon: Layers,
    name: "Sub accounts and snapshots",
    tag: "Reusable, resellable builds",
    detail:
      "Sub account builds from scratch: roles, naming conventions, custom fields and values, and a clean foundation before a single workflow is drawn. One sub account with a Which Location field usually beats many sub accounts for one multi site business. I save finished builds as reusable snapshots so a proven system can be redeployed in minutes.",
    color: C.purple,
  },
  {
    id: "funnels",
    Icon: Globe,
    name: "Funnels and landing pages",
    tag: "Built to convert, mobile first",
    detail:
      "Funnels, landing pages, and forms built inside GoHighLevel and wired straight into the CRM. Meta lead forms and native forms drop a tagged contact into the pipeline in seconds, because speed to lead is the whole game with paid traffic. I also build funnels in React, Next.js, Shopify, and WordPress when a client needs something beyond the native builder.",
    color: C.blue,
  },
  {
    id: "messaging",
    Icon: Send,
    name: "SMS, email, and deliverability",
    tag: "A2P and domain authentication",
    detail:
      "SMS and email sequences with merge fields, timed for the client time zone. I set up A2P 10DLC registration and email authentication with SPF, DKIM, and DMARC on a custom domain, and I start that in week one because the external approval can take one to three weeks. I know Australian A2P rules differ from the United States and I plan around it.",
    color: C.green,
  },
  {
    id: "calendars",
    Icon: Calendar,
    name: "Calendars and booking",
    tag: "Two way sync, no show recovery",
    detail:
      "Native GoHighLevel calendars with two way Google sync, reminders at 24 hours and 1 hour, round robin routing, and a no show branch that re offers a time automatically. Booking is the moment intent is hottest, so the auto reply and the calendar link fire the instant a lead comes in.",
    color: C.amber,
  },
  {
    id: "cli",
    Icon: Terminal,
    name: "GHL CLI and API",
    tag: "I build programmatically",
    detail:
      "This is what most GHL users cannot do. I run a GoHighLevel CLI that drives the CRM from the terminal across 11 command groups, plus Python builders that turn a markdown email sequence document into a live workflow through the internal API. That means I build faster, version my work, and repeat a proven system without clicking through the same screens a hundred times.",
    color: C.rose,
  },
  {
    id: "integrations",
    Icon: Cable,
    name: "Integrations and webhooks",
    tag: "Custom relays when no app exists",
    detail:
      "REST API integrations and webhooks connecting GoHighLevel to the tools a business already uses. When no native marketplace app exists, I write a custom Node or Python webhook relay, for example a live two way sync between a field service platform and GHL. I have also integrated ServiceTitan and ServiceM8 with GHL to build workflows on top of them.",
    color: C.cyan,
  },
  {
    id: "aivoice",
    Icon: Bot,
    name: "AI voice and missed call text back",
    tag: "Answer and recover every lead",
    detail:
      "AI voice agents and missed call text back built inside GoHighLevel, so no lead goes cold because a call was missed. I wire the AI to read from a living knowledge base and hand off to a human at the right moment, with a draft, approve, send safety net where the stakes are high.",
    color: C.coral,
  },
  {
    id: "reviews",
    Icon: Star,
    name: "Reviews, referrals, and affiliates",
    tag: "Reputation and word of mouth",
    detail:
      "Review request engines that fire at the right stage, partner and referral systems, and full affiliate programs with tracking, all inside GoHighLevel. These are the flywheel workflows that keep a happy customer working for the business long after the sale.",
    color: C.amber,
  },
  {
    id: "memberships",
    Icon: GraduationCap,
    name: "Memberships and courses",
    tag: "Two brands, one clean space",
    detail:
      "Membership sites and course experiences inside GoHighLevel with modules, resources, and progress tracking, including clean brand separation when two brands share one environment. Onboarding and drip release handled by workflow so the learner journey runs itself.",
    color: C.purple,
  },
  {
    id: "reporting",
    Icon: BarChart3,
    name: "Reporting and dashboards",
    tag: "The numbers an owner reads",
    detail:
      "Reporting dashboards an owner will actually open: leads, booked calls, show up rate, conversion, and cost per booked call by campaign. Every build ships with a one page stage card, an SOP, and a walkthrough so the team can run it without me standing over them.",
    color: C.blue,
  },
];

function SpecialtyExplorer() {
  const [activeId, setActiveId] = useState<string>(SPECIALTIES[0].id);
  const active = SPECIALTIES.find((s) => s.id === activeId) ?? SPECIALTIES[0];

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {SPECIALTIES.map((s) => {
          const on = s.id === activeId;
          return (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                color: on ? C.bg : C.sub,
                background: on ? s.color : C.card,
                border: `1px solid ${on ? s.color : C.border}`,
                borderRadius: 999, padding: "8px 13px", transition: "all 0.16s",
              }}
            >
              <s.Icon size={14} /> {s.name}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{
            background: C.bg2, border: `1px solid ${C.border}`,
            borderLeft: `3px solid ${active.color}`, borderRadius: 16,
            padding: "22px 22px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center",
              background: "rgba(255,255,255,0.04)", border: `1px solid ${active.color}`,
            }}>
              <active.Icon size={20} color={active.color} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{active.name}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: active.color, marginTop: 2 }}>{active.tag}</div>
            </div>
          </div>
          <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: 0 }}>{active.detail}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. Real GHL builds (described, not cross linked, to keep this page a dead end)
const BUILDS = [
  {
    name: "Residential care operator",
    where: "Simi Valley, California",
    color: C.green,
    body: "A full GoHighLevel CRM won on an interactive pitch. A 9 stage family inquiry pipeline and a 5 stage professional relationship pipeline, 13 workflows, 7 email batches written from scratch, a partner and referral system, and an AI assistant. RCFE senior care, so HIPAA and a signed BAA on the Enterprise tier were part of the plan.",
    tags: ["Pipelines", "13 workflows", "HIPAA aware"],
  },
  {
    name: "Window tinting company",
    where: "Brisbane, Australia",
    color: C.cyan,
    body: "A flagship live build in the client account through the public API. Four pipelines with 7 stage journeys, 15 custom fields in folders, custom values, 20 tags, and calendars. A custom Node and Python webhook relay syncs a field service platform to GHL because no native app existed. A2P SMS, email deliverability, an AI voice agent, missed call text back, a review engine, and an affiliate program.",
    tags: ["Webhook relay", "A2P", "AI voice"],
  },
  {
    name: "Amazon wholesale operator",
    where: "United States",
    color: C.blue,
    body: "Four automation engines on a phased roadmap: a voice and knowledge core that turns call recordings into a living knowledge base, a scrape and synthesise spine, a draft, approve, send messaging layer with a human in the loop, and pipeline and purchase order plumbing across GoHighLevel, Notion, Amazon Seller Central, and WhatsApp Business API.",
    tags: ["Multi engine", "Notion", "WhatsApp API"],
  },
  {
    name: "Live comedy tour team",
    where: "United States",
    color: C.coral,
    body: "A paid task delivered end to end. A three workflow inbound SMS system where AI extracts the location from a text before asking, a soft one time zip ask capped once every 30 days, silent enrichment on high AI confidence, and a location based broadcast the moment a tour stop is created. Contacts auto tag as tour radius eligible.",
    tags: ["Inbound SMS", "Geo capture", "AI extraction"],
  },
];

// ─────────────────────────────────────────────────────────────
// 3. Experience timeline (answers YEARS + work history)
const TIMELINE = [
  { when: "Since 2019", title: "GoHighLevel, from the launch", body: "Started building on GoHighLevel the year the platform launched. Six plus years hands on, building systems, not just administering them.", color: C.coral },
  { when: "2020 to 2026", title: "BVN Digital, Operations and Marketing Manager", body: "My own solo operation. Built the brand, the website, and every client system and automation myself. GoHighLevel, web development, and AI automation for clients across the United States, United Kingdom, and Australia.", color: C.cyan },
  { when: "2015 to 2019", title: "Filipino Creazione De Mano, Operations and Marketing Manager", body: "End to end operations: inventory, production coordination, supplier management, order processing, and working with artisans. Where the operator discipline behind my automation work was formed.", color: C.blue },
  { when: "2013 to 2015", title: "Creative8 Marketing Solutions, Operations and Marketing Head", body: "Marketing strategy, brand positioning, client acquisition, campaign planning, and lead generation.", color: C.purple },
];

const CREDS = [
  "Google Ads Search Certified",
  "HubSpot Inbound Marketing Certified",
  "Lean Six Sigma White Belt",
  "BS Business Administration, Marketing",
];

// ─────────────────────────────────────────────────────────────
// 4. References (reference ready work; contact details on request)
const REFERENCES = [
  { sector: "Window tinting, Australia", speak: "Can speak to a full live GoHighLevel build, the custom sync, and delivery against milestones.", color: C.cyan },
  { sector: "Residential care, California", speak: "Can speak to the CRM strategy, the pitch that won the work, and the pipeline and workflow design.", color: C.green },
  { sector: "Amazon wholesale, United States", speak: "Can speak to multi engine automation, the phased roadmap, and working across a modern stack.", color: C.blue },
];

// ─────────────────────────────────────────────────────────────
// 5. Proof gallery (real GHL screenshots, graceful fallback until dropped)
const PROOF = [
  { src: "/proof/regal-03-workflow-builder-branching.png", cap: "Live workflow builder with a conditional branch and timed steps" },
  { src: "/proof/regal-04-pipelines-list.png", cap: "Three pipelines built to spec: 6, 9 and 5 stages" },
  { src: "/proof/regal-05-opportunities-kanban.png", cap: "Opportunity board tracking leads from inquiry to approved" },
  { src: "/proof/regal-02-family-workflows.png", cap: "Published workflows across a full client journey" },
];

function ProofTile({ src, cap }: { src: string; cap: string }) {
  const [err, setErr] = useState(false);
  return (
    <figure style={{ margin: 0, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
      {err ? (
        <div style={{ display: "grid", placeItems: "center", height: 172, background: C.bg2, borderBottom: `1px solid ${C.border}`, gap: 8 }}>
          <ImageOff size={22} color={C.muted} />
          <span style={{ fontSize: 11.5, color: C.muted, fontWeight: 700, letterSpacing: 0.4 }}>Screenshot from a live GHL account</span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={cap} loading="lazy" onError={() => setErr(true)} style={{ width: "100%", display: "block", borderBottom: `1px solid ${C.border}` }} />
      )}
      <figcaption style={{ fontSize: 12.5, color: C.sub, padding: "10px 12px", lineHeight: 1.4 }}>{cap}</figcaption>
    </figure>
  );
}

// ─────────────────────────────────────────────────────────────
export default function GhlUserShowcase() {
  const heroStats = useMemo(
    () => [
      { k: "On GoHighLevel", v: "since 2019" },
      { k: "Hands on GHL", v: "6+ years" },
      { k: "Cross functional", v: "22+ years" },
      { k: "Eastern time", v: "daily overlap" },
    ],
    [],
  );

  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 22px 100px" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 34 }}>
          <a href="https://www.bvnofficial.com" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: C.sub, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
            <ArrowLeft size={15} /> BVN Official
          </a>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.coral, background: "rgba(251,146,60,0.10)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.coral }}>
            <Workflow size={15} /> GHL User · Benjamin Yson
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            You asked for a GHL user.
            <span style={{ color: C.coral }}> Here is one who builds.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 680, lineHeight: 1.6 }}>
            You asked for years of experience, work history, references, and my areas of specialty in
            GoHighLevel. Rather than send a flat document, here is all of it in one place, interactive,
            the way I would actually build a system for you. Click through it.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 26, marginTop: 24 }}>
            {heroStats.map((s) => (
              <div key={s.k}>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.ink }}>{s.v}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{s.k}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <Section
          eyebrow="Areas of specialty"
          title="My GoHighLevel toolkit, click any one"
          sub="These are the areas I work in every week. Tap a specialty and read exactly what I do there, in real terms, not a bullet list of buzzwords."
        >
          <SpecialtyExplorer />
        </Section>

        <Section
          eyebrow="Not just clicking around"
          title="Real GoHighLevel builds behind the claims"
          sub="Client names stay confidential here, but every system below is real, live, and mine end to end. Full detail and named references are available the moment you ask."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: 14 }}>
            {BUILDS.map((b, i) => (
              <motion.div
                key={b.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${b.color}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 7, color: C.muted, fontSize: 12, marginBottom: 4 }}>
                  <MapPin size={13} /> {b.where}
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, marginBottom: 8 }}>{b.name}</div>
                <p style={{ fontSize: 13, color: C.sub, margin: "0 0 12px", lineHeight: 1.55 }}>{b.body}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {b.tags.map((t) => (
                    <span key={t} style={{ fontSize: 11, fontWeight: 600, color: C.sub, background: C.cardHi, border: `1px solid ${C.border}`, borderRadius: 7, padding: "3px 8px" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section
          eyebrow="Experience and work history"
          title="Where the years come from"
          sub="Six plus years on GoHighLevel sits on top of more than twenty years running marketing and operations. Both matter: I do not just build workflows, I build the system a business runs on."
        >
          <div style={{ display: "grid", gap: 12 }}>
            {TIMELINE.map((t, i) => (
              <motion.div
                key={t.when}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 14, alignItems: "start", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px" }}
              >
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 800, color: t.color }}>
                  <Briefcase size={13} /> {t.when}
                </div>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 800, color: C.ink }}>{t.title}</div>
                  <p style={{ fontSize: 13, color: C.sub, margin: "5px 0 0", lineHeight: 1.5 }}>{t.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
            {CREDS.map((c) => (
              <span key={c} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: C.sub, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 999, padding: "7px 13px" }}>
                <Award size={13} color={C.amber} /> {c}
              </span>
            ))}
          </div>
        </Section>

        <Section
          eyebrow="References"
          title="Reference ready, on request"
          sub="I work under confidentiality, so I keep names off a public page. Tell me you want references and I will introduce you directly to clients who can speak to the work below."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {REFERENCES.map((r, i) => (
              <motion.div
                key={r.sector}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <Quote size={18} color={r.color} />
                <div style={{ fontSize: 14, fontWeight: 800, color: C.ink, margin: "10px 0 6px" }}>{r.sector}</div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{r.speak}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section
          eyebrow="Proof"
          title="This is real, not a template"
          sub="Screenshots from a live GoHighLevel account I built and run. The same standard your build would be delivered to."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {PROOF.map((p) => (
              <ProofTile key={p.src} src={p.src} cap={p.cap} />
            ))}
          </div>
        </Section>

        {/* One man line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginTop: 56, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "26px 24px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <Sparkles size={18} color={C.coral} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>Straight up, BVN is not an agency. It is me.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            I built this page, every workflow it describes, and the CRM behind my real client builds with my
            own hands. No team, no contractors, no handoffs. One person accountable from the first form to the
            final report. For you that means the work moves fast and nothing gets lost in translation.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.coral, borderRadius: 999, padding: "10px 16px" }}>
              Portfolio and CV <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Availability + contact */}
        <div style={{ marginTop: 34, textAlign: "center", fontSize: 12.5, color: C.muted, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <CheckCircle2 size={14} color={C.green} /> Benjamin Yson · BVN Official
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><PhoneCall size={13} /> +63 981 655 6555</span>
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Overlaps Eastern time daily</span>
        </div>
      </div>
    </div>
  );
}
