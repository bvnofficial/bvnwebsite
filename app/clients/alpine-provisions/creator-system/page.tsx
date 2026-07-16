"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Search, Send, FileInput, FileSignature,
  ShoppingCart, Truck, PackageCheck, Upload, CheckCircle2, BarChart3,
  Wallet, Mountain, Bot, ShieldCheck, UserCircle, LockKeyhole,
  Zap, Terminal, Clock, PhoneCall, Code2, Database, Workflow, User,
  Gauge, FileText,
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
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: C.green }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 800, margin: "8px 0 6px", letterSpacing: -0.4 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 660, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. The creator pipeline — answers the workflow question directly
type Step = { Icon: typeof Search; title: string; trigger: string; detail: string; color: string };
const STEPS: Step[] = [
  { Icon: Search, title: "Creator discovered", trigger: "Research + AI scoring", color: C.green,
    detail: "Creators in your categories, hiking, trail running, grooming, hybrid fitness, van life, are researched and entered into the creator CRM with their handles, follower count, category, and audience notes. An AI scoring workflow rates each one against your ideal creator profile, on brand fit, audience relevance, camera presence, and brand safety, so the list is qualified rather than just large. Manual review stays in the loop. No unsafe scraping, no bots." },
  { Icon: Send, title: "Creator contacted", trigger: "Personalized outreach", color: C.cyan,
    detail: "Outreach goes out through Instagram and email, personalized from what the creator actually posts, not copy and paste. Every message is logged against the creator record, duplicates are blocked, and anyone who declines is removed from future contact automatically." },
  { Icon: FileInput, title: "Creator applies", trigger: "Portal link", color: C.blue,
    detail: "When a creator shows interest, an application link fires automatically. They complete their profile in the Alpine portal: contact details, Instagram and TikTok handles, follower count, audience information, and shipping address. The record updates itself, so nobody retypes anything." },
  { Icon: FileSignature, title: "Creator signs", trigger: "Agreement", color: C.purple,
    detail: "An agreement is triggered for signature and tied to the creator record. Onboarding instructions, the campaign brief, scripts, and deadlines are released once it is signed, so no product ships to an unsigned creator." },
  { Icon: ShoppingCart, title: "Shopify order created", trigger: "On signature", color: C.amber,
    detail: "A creator sample order is created in Shopify automatically, with the correct creator and campaign tags applied and the assigned product and scent attached. Guards check for an existing order first, so duplicate or unauthorized shipments are prevented by design." },
  { Icon: Truck, title: "ShipBob ships", trigger: "Fulfillment", color: C.coral,
    detail: "The order flows to ShipBob for fulfillment. The tracking number is captured back by webhook and written to the creator profile, and the creator is notified automatically when the package ships. Fulfillment exceptions raise an alert rather than failing silently." },
  { Icon: PackageCheck, title: "Delivery confirmed", trigger: "Webhook", color: C.rose,
    detail: "Delivery confirmation comes back automatically, notifies the Alpine manager, and starts the clock: the content deadline is set from the delivery date, and reminder sequences are scheduled from that moment." },
  { Icon: Upload, title: "Creator uploads content", trigger: "Secure upload", color: C.green,
    detail: "The creator uploads raw and edited footage, hook variations, and call to action variations straight into the portal, against their brief. Files are organized automatically by creator and campaign, and reminders chase anyone approaching a deadline." },
  { Icon: CheckCircle2, title: "Manager approves", trigger: "QC + review", color: C.cyan,
    detail: "Submissions hit a manager dashboard with a first pass quality check flagging the obvious failures: wrong format, resolution, audio, lighting, product not visible, copyrighted music, watermarks, competitor logos, missing deliverables. Revision requests loop back to the creator. Final creative approval stays with your marketing leadership, and Meta Partnership Ad permissions are collected on approval." },
  { Icon: BarChart3, title: "Sales tracked", trigger: "Attribution", color: C.blue,
    detail: "Each creator gets a unique link and code with UTM parameters, connected to your affiliate platform. Shopify order attribution is reviewed, first time customer orders are identified, and refunds, cancellations, and chargebacks are stripped out so the numbers are honest." },
  { Icon: Wallet, title: "Commission paid", trigger: "Statement", color: C.amber,
    detail: "Eligible commission is calculated from clean attributed sales, a statement is prepared per creator, disputes are flagged rather than guessed at, payouts are coordinated, and every payment record is kept. Accuracy here is the whole game, so this is built to be auditable." },
];

function Pipeline() {
  const [i, setI] = useState(0);
  const s = STEPS[i];
  return (
    <div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10, marginBottom: 16 }}>
        {STEPS.map((st, idx) => {
          const on = idx === i;
          return (
            <button
              key={st.title}
              onClick={() => setI(idx)}
              style={{
                flexShrink: 0, width: 148, textAlign: "left", cursor: "pointer",
                background: on ? C.cardHi : C.card, border: `1px solid ${on ? st.color : C.border}`,
                borderRadius: 12, padding: "12px 12px", transition: "all 0.16s",
              }}
            >
              <st.Icon size={16} color={st.color} />
              <div style={{ fontSize: 11, fontWeight: 800, color: st.color, marginTop: 6 }}>
                {String(idx + 1).padStart(2, "0")}
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: on ? C.ink : C.sub, marginTop: 2, lineHeight: 1.25 }}>{st.title}</div>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={s.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${s.color}`, borderRadius: 16, padding: "22px 22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}` }}>
              <s.Icon size={20} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{s.title}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: s.color, marginTop: 2 }}>
                <Zap size={12} /> {s.trigger}
              </div>
            </div>
          </div>
          <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: 0 }}>{s.detail}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. Creator portal
const PORTAL = [
  { Icon: UserCircle, title: "Profile and audience", body: "Creators enter their contact details, Instagram and TikTok handles, follower count, and audience information once, and it flows straight to the CRM.", color: C.green },
  { Icon: FileSignature, title: "Agreements and briefs", body: "Sign the agreement, read the campaign instructions, and pull scripts and production briefs, all in one place.", color: C.cyan },
  { Icon: LockKeyhole, title: "Secure uploads", body: "Authenticated, mobile friendly uploads for raw and edited content, organized automatically by creator and campaign.", color: C.blue },
  { Icon: Truck, title: "Shipping visibility", body: "Creators see their assigned product, shipping status, and tracking without messaging a manager to ask.", color: C.amber },
  { Icon: CheckCircle2, title: "Revisions and approval", body: "Revision requests and approval status are visible to the creator, so the feedback loop is clear and nothing stalls in a DM.", color: C.coral },
  { Icon: Wallet, title: "Sales and commission", body: "Attributed sales and commission earned, visible to the creator. Transparency here is what keeps good creators engaged.", color: C.purple },
];

// ─────────────────────────────────────────────────────────────
// 3. Safe by design
const SAFE = [
  { Icon: ShieldCheck, title: "No unsafe automation", body: "No Instagram bots, no unauthorized scraping, nothing that puts your accounts at risk. Outreach stays human supervised, and everything respects platform policy.", color: C.green },
  { Icon: Bot, title: "AI where it belongs", body: "AI scores and categorizes creators and drafts personalized openers from real content. A person still decides who gets contacted.", color: C.purple },
  { Icon: FileText, title: "Documented, not tribal", body: "Every workflow, integration, and process documented in plain language, so Alpine owns the system rather than depending on me.", color: C.cyan },
];

// ─────────────────────────────────────────────────────────────
// 4. Systems I personally built
const BUILT = [
  {
    Icon: Bot, title: "AI job pipeline", color: C.green,
    what: "Python scrapers pull listings on a schedule, a large language model reads and scores each one against my criteria, and the strong matches are pushed into Slack. It runs in the cloud on its own.",
    role: "I built all of it: the scrapers, the LLM scoring prompts, the Slack integration, and the cloud schedule. This is the same shape as scoring creators against your ideal profile.",
  },
  {
    Icon: Wallet, title: "Payments and credits portal", color: C.amber,
    what: "A working authenticated portal on my own site with a credits wallet, balance, top ups, and multiple live payment methods, backed by a real database schema.",
    role: "I designed the schema, built the wallet logic and the gated portal, and integrated the payment providers and checkout. Same building blocks as a creator portal: auth, profiles, records, and money.",
  },
  {
    Icon: Database, title: "GoHighLevel CRM build", color: C.rose,
    what: "A complete CRM: pipelines, published follow up automations, an intake and routing workflow library, and a board moving contacts from first touch to won, fully documented.",
    role: "Sole builder. Real screenshots from that live account are further down this page.",
  },
];

// ─────────────────────────────────────────────────────────────
// 5. Stack
const STACK = [
  { Icon: Code2, title: "Web", body: "React, Next.js, TypeScript, HTML and CSS for the portal and dashboards.", color: C.blue },
  { Icon: Workflow, title: "Automation", body: "Make, Zapier, n8n, webhooks, and custom code when a workflow tool runs out of room.", color: C.green },
  { Icon: Database, title: "Data", body: "PostgreSQL, Supabase, MongoDB, Airtable, and Google Sheets.", color: C.amber },
  { Icon: ShoppingCart, title: "Commerce", body: "Shopify and e-commerce operations, order tags, APIs, and fulfillment integrations.", color: C.coral },
  { Icon: Bot, title: "AI", body: "OpenAI and Claude APIs, prompt engineering for scoring, categorizing, and drafting.", color: C.purple },
  { Icon: Gauge, title: "Reporting", body: "Weekly reporting built around outcomes, response rate, usable content rate, revenue, not task counts.", color: C.cyan },
];

// ─────────────────────────────────────────────────────────────
export default function AlpineProvisionsCreatorSystem() {
  const heroStats = useMemo(
    () => [
      { k: "Pipeline", v: "Discovered to paid" },
      { k: "Portal", v: "Auth + uploads" },
      { k: "Fulfillment", v: "Shopify + ShipBob" },
      { k: "Automation", v: "Safe and documented" },
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
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.green, background: "rgba(52,211,153,0.12)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.green }}>
            <Mountain size={15} /> Mountain Creator System
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            From creator discovered
            <span style={{ color: C.green }}> to commission paid, one system.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 700, lineHeight: 1.6 }}>
            You asked how I would build and manage the creator workflow. Rather than write you a paragraph, I built the
            answer. Every stage below is the system I would build for Alpine, from research and AI scoring through
            Shopify and ShipBob fulfillment to clean, auditable commission payments. Click through it.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 26, marginTop: 24 }}>
            {heroStats.map((s) => (
              <div key={s.k}>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{s.v}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{s.k}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <Section eyebrow="The workflow" title="Every stage, built and automated" sub="This is the exact pipeline from your post, stage by stage, with how I would build each one. Tap through it.">
          <Pipeline />
        </Section>

        <Section eyebrow="The creator portal" title="An Alpine-branded experience creators actually enjoy" sub="Mobile friendly, professional, and simple. Creators self serve instead of filling your inbox, and every action updates the CRM behind it.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {PORTAL.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${p.color}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <p.Icon size={18} color={p.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{p.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{p.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Account safety" title="Automation that will not put Alpine at risk" sub="Your post drew a clear line, and I agree with it. Speed is worthless if it costs you your accounts or your brand.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {SAFE.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <s.Icon size={18} color={s.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{s.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{s.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Systems I personally built" title="Not theory. Things I have shipped." sub="Each of these maps directly onto a piece of what Alpine needs, and I built every one of them myself.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {BUILT.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${b.color}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <b.Icon size={18} color={b.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{b.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: "0 0 12px", lineHeight: 1.55 }}>{b.what}</p>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px" }}>
                  <User size={14} color={b.color} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 800, color: b.color, textTransform: "uppercase", letterSpacing: 0.6 }}>My exact role</div>
                    <p style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.5, margin: "3px 0 0" }}>{b.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="The stack" title="What I would build it with" sub="Custom code where the portal needs it, no-code where it is faster, matched to the job rather than forcing one tool.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {STACK.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <s.Icon size={18} color={s.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{s.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{s.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Proof" title="A live system I built and run" sub="Screenshots from the live GoHighLevel account behind a CRM I built, so the work is real rather than described.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <ProofShot src="/proof/regal-01-workflow-library.png" caption="A documented workflow library inside a live account." />
            <ProofShot src="/proof/regal-04-pipelines-list.png" caption="Pipelines moving contacts from first touch to won." />
            <ProofShot src="/proof/regal-02-family-workflows.png" caption="Published automations firing on their own." />
            <ProofShot src="/proof/regal-05-opportunities-kanban.png" caption="The board in day to day use." />
          </div>
        </Section>

        {/* Close */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginTop: 56, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "26px 24px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <Terminal size={18} color={C.green} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>I am not an agency. I built all of this myself.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 750 }}>
            Your post says you will not accept work completed primarily by another person, and I respect that, because
            everything here is mine. I take an unclear process, organize it, build it, and operate it. One person, from
            the idea to the deploy, documented so you own it. I built this page with Claude Code as my tool.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/clients/how-i-build/experience" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.green, borderRadius: 999, padding: "10px 16px" }}>
              More systems I built <ArrowRight size={14} />
            </Link>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.ink, textDecoration: "none", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 999, padding: "10px 16px" }}>
              Portfolio and CV <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Contact */}
        <div style={{ marginTop: 34, textAlign: "center", fontSize: 12.5, color: C.muted, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <CheckCircle2 size={14} color={C.green} /> Benjamin Yson · BVN Official
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><PhoneCall size={13} /> +63 981 655 6555</span>
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Full time, long term</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Proof (real GHL screenshots)
function ProofShot({ src, caption }: { src: string; caption: string }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
      {err ? (
        <div style={{ height: 200, display: "grid", placeItems: "center", background: C.bg2, color: C.muted, fontSize: 12.5, textAlign: "center", padding: "0 20px" }}>
          Screenshot from a live GoHighLevel account
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={caption}
          onError={() => setErr(true)}
          style={{ width: "100%", display: "block", borderBottom: `1px solid ${C.border}` }}
        />
      )}
      <div style={{ padding: "12px 14px", fontSize: 12.5, color: C.sub }}>{caption}</div>
    </div>
  );
}
