"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Trophy, Activity, CheckCircle2, Clock,
  Layers, Globe, MapPin, Sparkles, LayoutDashboard,
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

type Status = "won" | "active" | "completed" | "pending";

const STATUS: Record<Status, { label: string; color: string }> = {
  won: { label: "Won", color: C.green },
  active: { label: "Active Build", color: C.cyan },
  completed: { label: "Delivered", color: C.blue },
  pending: { label: "Pending", color: C.amber },
};

type Client = {
  name: string;
  region: string;
  scope: string;
  blurb: string;
  href: string;
  status: Status;
  accent: string;
  value?: string;
  tags: string[];
};

const CLIENTS: Client[] = [
  {
    name: "RE Wholesale GHL Command Center (application)",
    region: "Real estate wholesale, GHL",
    scope: "GHL Funnels + Multi-channel Automation",
    blurb:
      "Interactive GHL command center for a real estate wholesale business: the motivated seller journey across email, SMS, RVM, and AI voice, the seller and buyer/investor pipelines, AI assisted workflows (GPT personalization, conversation summary, intent detection, routing), email deliverability and sending health, and real GHL proof. Built with Claude Code.",
    href: "/clients/re-wholesale/ghl-command-center",
    status: "pending",
    accent: C.green,
    tags: ["GoHighLevel", "Real Estate", "AI Workflows", "Deliverability"],
  },
  {
    name: "Property Data Pipeline (application)",
    region: "AI real estate platform, contract",
    scope: "API Integration + Web Scraping",
    blurb:
      "Interactive property data pipeline architecture: API research and integration, scalable ingestion, a Scrapy/Selenium/Playwright scraping framework, ETL normalization into a unified property data model, automated sync, plus two real shipped projects (AI job scraper, two way API relay) and the tech stack. Built with Claude Code.",
    href: "/clients/data-pipeline/property-intelligence",
    status: "pending",
    accent: C.purple,
    tags: ["Python", "Web Scraping", "API Integration", "ETL"],
  },
  {
    name: "Real Estate CRM Automation (application)",
    region: "Real estate team, CRM buildout",
    scope: "CRM + Zapier + Slack + Geo-fencing",
    blurb:
      "Interactive real estate CRM and automation command center: lead action plans for online, open house, new construction, and past client leads, Slack channels and alerts, a Zapier integration map (CRM, forms, Slack, Canva, ChatGPT), a geo-fencing and location advertising handoff, and real CRM proof. Leans on real Chime and geo-fencing experience. Built with Claude Code.",
    href: "/clients/real-estate-ops/crm-automation",
    status: "pending",
    accent: C.blue,
    tags: ["Chime", "Zapier", "Slack", "Geo-fencing"],
  },
  {
    name: "Construction n8n Blueprint (application)",
    region: "Small construction business",
    scope: "n8n Job Pipeline Automation",
    blurb:
      "Interactive n8n automation blueprint for a construction business: the job pipeline from enquiry to invoice automated stage by stage, customer service automations (confirmations, reminders, on the way updates, review requests), an n8n integration map around their existing job management software, and real GHL proof. Built with Claude Code.",
    href: "/clients/construction-ops/n8n-blueprint",
    status: "pending",
    accent: C.amber,
    tags: ["n8n", "Automation", "Construction", "Customer Service"],
  },
  {
    name: "AI Ops Automation Portfolio (application)",
    region: "AI ops role, US EST exec support",
    scope: "AI + Automation Portfolio",
    blurb:
      "Interactive AI operations and automation portfolio: four real automations built (GHL conditional onboarding, two way webhook relay, cold email to CRM, AI job scraper to Slack), the vague request to shipped solution process, the weekly AI and automation tool stack, SOP samples, and real GHL proof. Built with Claude Code.",
    href: "/clients/ai-ops/automation-portfolio",
    status: "pending",
    accent: C.cyan,
    tags: ["Automation", "AI", "n8n/Make/Zapier", "SOPs"],
  },
  {
    name: "Business Fuzion Growth Center (application)",
    region: "Marketing agency, GHL + Ads + SEO",
    scope: "Growth Marketing Command Center",
    blurb:
      "Interactive growth marketing command center: the full lead gen loop across paid ads, funnels, GHL automation, pipelines, reputation, and reporting, the four disciplines (social, ads, GHL, SEO), an advanced GHL capability grid, the paid advertising framework, and real Regal GHL proof. Built with Claude Code.",
    href: "/clients/business-fuzion/growth-command-center",
    status: "pending",
    accent: C.coral,
    tags: ["GoHighLevel", "Paid Ads", "SEO", "Social Media"],
  },
  {
    name: "Talent Agency Deal Ops (application)",
    region: "Talent management, UK",
    scope: "Deal Lifecycle Automation",
    blurb:
      "Interactive deal operations command center for a boutique talent agency: the six stage brand deal lifecycle with automatic chasing and escalation, the Monday to Friday weekly rhythm that runs itself, an escalation panel that only surfaces what is stuck, an honest recommended stack (Airtable + Make/n8n), and real GHL branching and pipeline proof. Built with Claude Code.",
    href: "/clients/talent-agency/deal-ops",
    status: "pending",
    accent: C.amber,
    tags: ["Automation", "Airtable", "Make/n8n", "Deal Ops"],
  },
  {
    name: "Wellness Technical Partner (application)",
    region: "Health and wellness brand",
    scope: "Full Stack + Integrations + Portal",
    blurb:
      "Interactive technical partner showcase for a wellness brand: a website rebuild plan, a live integration hub connecting payments, scheduling, forms, CRM, email, and third party APIs, an automations panel, and a member and client portal (programs, bookings, billing). Built with Claude Code.",
    href: "/clients/wellness-partner/technical-partner",
    status: "pending",
    accent: C.rose,
    tags: ["Full Stack", "Integrations", "Automation", "Client Portal"],
  },
  {
    name: "FB Legacy Implementation Roadmap (application)",
    region: "Ops foundation project, 30 to 60 days",
    scope: "Project Coordinator + SOPs + Google Workspace",
    blurb:
      "Interactive 30 to 60 day operational foundation roadmap for a Project Coordinator role: the three phases from discovery and planning to implementation to training and handover, a sample org skeleton, a Google Drive folder blueprint, and an SOP library. Built with Claude Code.",
    href: "/clients/fb-legacy/implementation-roadmap",
    status: "pending",
    accent: C.purple,
    tags: ["Operations", "SOPs", "Google Workspace", "Systems"],
  },
  {
    name: "Ro Movers Growth System (application)",
    region: "Moving company, US",
    scope: "GHL + WordPress + Funnel + SEO",
    blurb:
      "Interactive growth and ops system for a moving company: a quote to booked move lead funnel in GHL, the owner-operator contractor portal (availability, document uploads with expiry tracking, company updates), the full build stack from WordPress to SEO, and a monthly blog and content engine. Built with Claude Code.",
    href: "/clients/ro-movers/growth-system",
    status: "pending",
    accent: C.blue,
    tags: ["GoHighLevel", "WordPress", "Funnels", "SEO"],
  },
  {
    name: "Land Finance Lead Engine (application)",
    region: "Real estate finance, US",
    scope: "GHL Lead Lifecycle Engine",
    blurb:
      "Interactive lead lifecycle: cold email from Instantly into GHL, tagging and segmentation, speed to lead, multi step nurture, and three clean exits (converted, disqualified, long term nurture) so no lead hits a dead end, plus a lead flow monitor. Built with Claude Code.",
    href: "/clients/land-finance/lead-engine",
    status: "pending",
    accent: C.green,
    tags: ["GoHighLevel", "Lead lifecycle", "Instantly", "Claude Code"],
  },
  {
    name: "Automation Ops Architect (application)",
    region: "Workflow automation biz, Australia",
    scope: "Business Operating System",
    blurb:
      "Interactive operating system blueprint for a workflow automation agency: a live ROI and time savings calculator, the sprint delivery pipeline from discovery to QA, an opportunity scoring framework, the company structure and roles, the ops hub, and the B2B setter/closer pipeline.",
    href: "/clients/automation-ops/operating-system",
    status: "pending",
    accent: C.coral,
    tags: ["Operations", "Systems design", "ROI", "SOPs"],
  },
  {
    name: "PRYNT Digital (application)",
    region: "US marketing agency, PH team",
    scope: "SEO and AI Search Visibility",
    blurb:
      "Interactive SEO showcase: an on page, technical, local, and AI search audit with scores, a monthly SEO reporting dashboard, the full GHL match, and an honest note on Duda. Leans on real AI search optimization work.",
    href: "/clients/prynt-digital/seo-ai-search",
    status: "pending",
    accent: C.green,
    tags: ["SEO", "AI search", "GoHighLevel", "Reporting"],
  },
  {
    name: "Webinar Ops GHL Specialist (application)",
    region: "GHL + Claude Code role",
    scope: "Webinar Operations Command Center",
    blurb:
      "Interactive webinar engine: the full GHL sequence from registration to confirmation, reminders, live, the attended and no show branch, and re engagement, plus a performance dashboard. Built with Claude Code, so it answers both the webinar and the AI build questions.",
    href: "/clients/webinar-ops/command-center",
    status: "pending",
    accent: C.purple,
    tags: ["GoHighLevel", "Webinars", "Claude Code", "Reporting"],
  },
  {
    name: "Yorkshire Canine Academy (application)",
    region: "Dog training business, UK",
    scope: "Weekly Ops and Performance Report",
    blurb:
      "Interactive weekly report and ops dashboard: campaign performance, email sequence open/click/conversion, a closer leaderboard, deliverability flags, plus GHL to Airtable automation health and the Airtable CRM base. Doubles as the sample weekly report the post asked for.",
    href: "/clients/yorkshire-canine-academy/weekly-ops-report",
    status: "pending",
    accent: C.amber,
    tags: ["GoHighLevel", "Airtable", "Make/Zapier", "Reporting"],
  },
  {
    name: "Our Home Care Solutions (application)",
    region: "Home care agency, GHL",
    scope: "Recruiting and Onboarding CRM",
    blurb:
      "Interactive GHL recruiting and onboarding CRM: a live 13 stage recruitment pipeline board you advance applicants through with automation firing at each stage, the employee management, referral and internal task pipelines, the CRM foundation, and the onboarding and compliance flow, backed by real care operator GHL screenshots.",
    href: "/clients/our-home-care/recruiting-crm",
    status: "pending",
    accent: C.blue,
    tags: ["GoHighLevel", "Recruitment", "Onboarding", "Healthcare"],
  },
  {
    name: "StretchTo.You (application)",
    region: "Mobile stretching startup",
    scope: "SaaS Platform Prototype",
    blurb:
      "Interactive product prototype: a live credit based membership dashboard where completing a session deducts a credit, a tap to pay flow tied to memberships, a recommended stack, customer, therapist and admin portals, and the future two app multi city marketplace vision.",
    href: "/clients/stretchto-you/platform-prototype",
    status: "pending",
    accent: C.rose,
    tags: ["SaaS", "Next.js", "Supabase", "Stripe"],
  },
  {
    name: "Business Results Mastery (application)",
    region: "GHL agency, Canada",
    scope: "GHL Build System",
    blurb:
      "Interactive agency build system: empty sub account to live via snapshots, A2P + deliverability, AI booking, list hygiene, conversion tracking, Meta sync and reporting, plus a deliverability and A2P rejection playbook and the real Regal GHL screenshots.",
    href: "/clients/business-results-mastery/ghl-build-system",
    status: "pending",
    accent: C.green,
    tags: ["GoHighLevel", "Snapshots", "A2P", "Deliverability"],
  },
  {
    name: "GHL Specialist (application)",
    region: "GHL agency role, U.S. founder",
    scope: "Cross Platform Automation Stack",
    blurb:
      "Interactive automation stack: a lead's journey across GHL, n8n, Instantly, Stripe, Google Workspace, and Facebook Lead Ads, an integrations explorer for webhooks, API keys and JSON, and a reliability panel hitting the post's no loops, no double fires success criteria.",
    href: "/clients/ghl-specialist/automation-stack",
    status: "pending",
    accent: C.coral,
    tags: ["GoHighLevel", "n8n", "Instantly", "Webhooks"],
  },
  {
    name: "STR AI Operating System (application)",
    region: "Short term rental, hospitality",
    scope: "AI Operating System Blueprint",
    blurb:
      "Interactive blueprint for an internal AI operating system: 8 department agents over a Supabase knowledge layer with vector search, a live assistant routing demo, role based security and guardrails, and a phased roadmap. Answers the post's how would you build it question.",
    href: "/clients/str-hospitality/ai-operating-system",
    status: "pending",
    accent: C.purple,
    tags: ["AI agents", "Supabase", "RAG", "Security"],
  },
  {
    name: "GHL User (application)",
    region: "GoHighLevel role, Eastern time",
    scope: "GHL Specialty Showcase",
    blurb:
      "An interactive resume for a part time GoHighLevel role: years since 2019, full work history, reference ready builds, and a click through explorer of every GHL specialty from branching workflows and pipeline architecture to sub accounts, the GHL CLI, and AI voice.",
    href: "/clients/ghl-user/specialty-showcase",
    status: "pending",
    accent: C.coral,
    tags: ["GoHighLevel", "Specialty explorer", "Work history", "References"],
  },
  {
    name: "Moonstar Media",
    region: "Content agency, UK property",
    scope: "GHL + Meta Lead Funnel",
    blurb:
      "Interactive lead funnel: Meta lead form to CRM, a live enquiry to won pipeline, a 5 step follow up sequence, booking flow, and a reporting dashboard for leads, booked calls, show up rate and conversion.",
    href: "/clients/moonstar-media/lead-funnel",
    status: "pending",
    accent: C.blue,
    tags: ["GoHighLevel", "Meta Lead Forms", "Funnel", "Reporting"],
  },
  {
    name: "TintGard",
    region: "Window tinting, Brisbane QLD",
    scope: "GHL Workflow Build",
    blurb:
      "Flagship live build. Four pipelines, ServiceM8 to GHL sync via a custom webhook relay, A2P SMS, AI voice agent, review and affiliate engines.",
    href: "/clients/tintgard/workflow",
    status: "won",
    accent: C.cyan,
    value: "A$2,500 milestone",
    tags: ["GoHighLevel", "ServiceM8", "Webhook relay", "AI voice"],
  },
  {
    name: "Regal Care Homes",
    region: "Residential care, Simi Valley CA",
    scope: "GHL CRM Pitch",
    blurb:
      "Won on an interactive React pitch app. A 9 stage family inquiry pipeline, 13 workflows, 7 email batches, partner referral system, and an AI assistant.",
    href: "/benjaminyson",
    status: "won",
    accent: C.green,
    value: "$3,000 fixed",
    tags: ["GoHighLevel", "RCFE compliance", "Pitch app"],
  },
  {
    name: "Hypersonic Wholesale",
    region: "Amazon FBA, Riverside Pet",
    scope: "Automation Milestones",
    blurb:
      "Four automation engines from voice and knowledge capture to pipeline and PO plumbing, on a phased roadmap with a live build checklist.",
    href: "/clients/hypersonic/milestones",
    status: "active",
    accent: C.blue,
    value: "£500 scope + care",
    tags: ["GoHighLevel", "Notion", "Fathom", "WhatsApp API"],
  },
  {
    name: "Warm Up Guys",
    region: "Comedy tour team",
    scope: "Inbound SMS Workflow",
    blurb:
      "Paid task delivered. Inbound texts become complete contact records with location captured naturally, no forms, all inside GoHighLevel.",
    href: "/clients/warmupguys/smsworkflow-paidtask",
    status: "completed",
    accent: C.coral,
    tags: ["GoHighLevel", "SMS", "Geo capture"],
  },
  {
    name: "Referral Pro",
    region: "Agent referral network",
    scope: "Agent Portal Demo",
    blurb:
      "A working WordPress agent referral portal: secure per agent dashboards, Clio status sync, year to date 1099 totals, and a Twilio SMS on Hired.",
    href: "/clients/referral-pro/portal",
    status: "pending",
    accent: C.blue,
    tags: ["WordPress", "Clio", "Twilio"],
  },
  {
    name: "Smart Forms",
    region: "Lead capture",
    scope: "AI Guided Form Flow",
    blurb:
      "A multi step form flow with conditional logic and a live AI step that generates a tailored plan, built in WordPress with the OpenAI API.",
    href: "/clients/smart-forms/flow",
    status: "pending",
    accent: C.purple,
    tags: ["WordPress", "Elementor", "OpenAI"],
  },
  {
    name: "Evolving Financial Solutions",
    region: "Financial services",
    scope: "GHL Journey Blueprint",
    blurb:
      "The full client journey from first lead to long term member, the automations and AI at each stage, a Skool membership flow, and a 90 day roadmap.",
    href: "/clients/efs/blueprint",
    status: "pending",
    accent: C.green,
    tags: ["GoHighLevel", "Skool", "SOPs"],
  },
  {
    name: "The BNS Companies",
    region: "Real estate",
    scope: "Real Estate Command Center",
    blurb:
      "Buyer and seller pipelines, an event and webinar registration funnel with reminder automations, and a lead source ROI reporting dashboard.",
    href: "/clients/bns/command-center",
    status: "pending",
    accent: C.amber,
    tags: ["GoHighLevel", "Funnels", "Reporting"],
  },
  {
    name: "PsyFortis & Advanced Aesthetics",
    region: "Two brand academy",
    scope: "Course Experience Demo",
    blurb:
      "A sample course and membership learner experience for two brands in one environment: clean brand separation, modules, resources, and progress tracking.",
    href: "/clients/psyfortis-aaa/courses",
    status: "pending",
    accent: C.rose,
    tags: ["GoHighLevel", "Memberships", "Courses"],
  },
];

const FILTERS: { key: Status | "all"; label: string; icon: typeof Trophy }[] = [
  { key: "all", label: "All", icon: Layers },
  { key: "won", label: "Won", icon: Trophy },
  { key: "active", label: "Active", icon: Activity },
  { key: "completed", label: "Delivered", icon: CheckCircle2 },
  { key: "pending", label: "Pending", icon: Clock },
];

export default function CommandCenterClient() {
  const [filter, setFilter] = useState<Status | "all">("all");

  const stats = useMemo(() => {
    const by = (s: Status) => CLIENTS.filter((c) => c.status === s).length;
    return {
      total: CLIENTS.length,
      won: by("won"),
      active: by("active"),
      pending: by("pending"),
    };
  }, []);

  const shown = useMemo(
    () => (filter === "all" ? CLIENTS : CLIENTS.filter((c) => c.status === filter)),
    [filter],
  );

  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "72px 22px 96px" }}>
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase",
              color: C.coral, background: "rgba(251,146,60,0.10)",
              border: `1px solid ${C.border}`, borderRadius: 999, padding: "6px 14px",
            }}
          >
            <LayoutDashboard size={14} /> BVN Command Center
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "18px 0 12px", letterSpacing: -0.5 }}>
            Every build, in one place.
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 660, lineHeight: 1.6 }}>
            Live builds, paid tasks, and interactive application demos. Each one is a real, working
            system you can open and click through. Pending items are awaiting the client go ahead.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 14, margin: "34px 0 26px",
          }}
        >
          {[
            { label: "Total builds", value: stats.total, color: C.ink },
            { label: "Won", value: stats.won, color: C.green },
            { label: "Active", value: stats.active, color: C.cyan },
            { label: "Pending", value: stats.pending, color: C.amber },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 16, padding: "18px 20px",
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 26 }}>
          {FILTERS.map(({ key, label, icon: Icon }) => {
            const on = filter === key;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  fontSize: 13, fontWeight: 700, cursor: "pointer",
                  color: on ? C.bg : C.sub,
                  background: on ? C.coral : C.card,
                  border: `1px solid ${on ? C.coral : C.border}`,
                  borderRadius: 999, padding: "8px 15px", transition: "all 0.18s",
                }}
              >
                <Icon size={14} /> {label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <motion.div
          layout
          style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 18,
          }}
        >
          <AnimatePresence mode="popLayout">
            {shown.map((c) => {
              const st = STATUS[c.status];
              return (
                <motion.div
                  key={c.name}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.22 }}
                >
                  <Link href={c.href} style={{ textDecoration: "none" }}>
                    <div
                      className="cc-card"
                      style={{
                        position: "relative", height: "100%",
                        background: C.card, border: `1px solid ${C.border}`,
                        borderRadius: 18, padding: "20px 20px 18px",
                        display: "flex", flexDirection: "column",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute", top: 0, left: 0, right: 0, height: 3,
                          background: c.accent, opacity: 0.9,
                        }}
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: c.accent, textTransform: "uppercase", letterSpacing: 0.8 }}>
                            {c.scope}
                          </div>
                          <div style={{ fontSize: 19, fontWeight: 800, color: C.ink, marginTop: 4 }}>
                            {c.name}
                          </div>
                        </div>
                        <span
                          style={{
                            flexShrink: 0, fontSize: 11, fontWeight: 800, color: st.color,
                            background: "rgba(255,255,255,0.04)",
                            border: `1px solid ${st.color}`, borderRadius: 999, padding: "4px 10px",
                          }}
                        >
                          {st.label}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.muted, fontSize: 12.5, marginTop: 8 }}>
                        <MapPin size={13} /> {c.region}
                      </div>

                      <p style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.55, margin: "12px 0 14px", flexGrow: 1 }}>
                        {c.blurb}
                      </p>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                        {c.tags.map((t) => (
                          <span
                            key={t}
                            style={{
                              fontSize: 11, fontWeight: 600, color: C.sub,
                              background: C.cardHi, border: `1px solid ${C.border}`,
                              borderRadius: 7, padding: "3px 8px",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: c.value ? C.ink : C.muted }}>
                          {c.value ?? "Demo"}
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 700, color: c.accent }}>
                          Open <ArrowUpRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            marginTop: 40, padding: "20px 22px", borderRadius: 16,
            background: C.bg2, border: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
          }}
        >
          <Sparkles size={18} color={C.coral} />
          <span style={{ fontSize: 13.5, color: C.sub }}>
            Every demo here was built and deployed by one person, Benjamin Yson, end to end.
          </span>
          <Link
            href="/benjaminyson"
            style={{
              marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 13, fontWeight: 700, color: C.ink, textDecoration: "none",
              background: C.coral, borderRadius: 999, padding: "9px 16px",
            }}
          >
            View portfolio <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>

      <style>{`
        .cc-card { transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease; }
        .cc-card:hover { transform: translateY(-4px); border-color: ${C.coral}; box-shadow: 0 18px 40px -18px rgba(0,0,0,0.7); }
      `}</style>
    </div>
  );
}
