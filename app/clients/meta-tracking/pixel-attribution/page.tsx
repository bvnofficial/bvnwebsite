"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Code2, CheckCircle2, Building2, FileInput,
  Users, Target, MousePointerClick, PlayCircle, ThumbsUp, Activity,
  ClipboardCheck, FileText, Zap, Terminal, Clock, PhoneCall, Globe,
  Repeat, ScanEye,
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
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: C.blue }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 800, margin: "8px 0 6px", letterSpacing: -0.4 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 660, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. The setup flow (interactive)
type Step = { Icon: typeof Code2; title: string; trigger: string; detail: string; color: string };
const STEPS: Step[] = [
  { Icon: Code2, title: "Install the Pixel", trigger: "GHL sites and funnels", color: C.blue,
    detail: "I place your Meta Pixel base code across the GoHighLevel sites and funnels, either in the account tracking code so it loads everywhere or funnel by funnel where you need finer control. Done once, correctly, so nothing double fires." },
  { Icon: ScanEye, title: "Verify it fires", trigger: "Events Manager", color: C.cyan,
    detail: "I confirm the Pixel is actually firing using Meta Events Manager Test Events and the Pixel Helper, page by page, so you are not guessing. If a page is not tracking, we find it now, not after you have spent on ads." },
  { Icon: Building2, title: "Connect Business Manager", trigger: "Assets linked", color: C.purple,
    detail: "I connect your Meta Business Manager and make sure the Pixel, ad account, page, and Instagram are all linked with the right permissions, so audiences and tracking have everything they need to work." },
  { Icon: FileInput, title: "Wire Lead Forms into GHL", trigger: "Facebook to CRM", color: C.green,
    detail: "I connect your Facebook Lead Forms so a submission flows straight into GoHighLevel as a contact, tagged and dropped into the right pipeline, so a lead from an ad lands in the CRM in seconds with no manual export." },
  { Icon: Users, title: "Build the audiences", trigger: "Custom and retargeting", color: C.amber,
    detail: "I build the full audience library: website visitors, lead form opened, lead form submitted, video viewers, and Facebook and Instagram engagement, then the retargeting audiences that let you follow up with people who already showed interest." },
  { Icon: Activity, title: "Verify conversion tracking", trigger: "Events confirmed", color: C.coral,
    detail: "I confirm your conversion events are registering in Events Manager, so when a lead or booking happens Meta actually records it. This is what lets the ad platform optimize and what makes your reporting trustworthy." },
  { Icon: Repeat, title: "Test the lead flow", trigger: "End to end", color: C.rose,
    detail: "I run a real test lead from Facebook all the way into GoHighLevel and watch it land, so we prove the whole chain works before your budget is live, not after." },
  { Icon: FileText, title: "Hand over the document", trigger: "What was done", color: C.blue,
    detail: "You get a simple, clear document showing exactly what was installed, connected, and tested, with the audiences created and how the tracking is wired, so you and your team know what is running and can screen share through it with me." },
];

function SetupFlow() {
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
                flexShrink: 0, width: 150, textAlign: "left", cursor: "pointer",
                background: on ? C.cardHi : C.card, border: `1px solid ${on ? st.color : C.border}`,
                borderRadius: 12, padding: "12px 12px", transition: "all 0.16s",
              }}
            >
              <st.Icon size={16} color={st.color} />
              <div style={{ fontSize: 11, fontWeight: 800, color: st.color, marginTop: 6 }}>0{idx + 1}</div>
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
// 2. The audience library
const AUDIENCES = [
  { Icon: Globe, title: "Website visitors", body: "Everyone who lands on your GHL sites and funnels, captured so you can retarget them across Facebook and Instagram.", color: C.blue },
  { Icon: MousePointerClick, title: "Lead form opened", body: "People who opened your Facebook Lead Form but did not finish. Warm and worth a second nudge.", color: C.cyan },
  { Icon: FileInput, title: "Lead form submitted", body: "People who actually submitted, ideal for exclusion, lookalikes, and tailored follow up sequences.", color: C.green },
  { Icon: PlayCircle, title: "Video viewers", body: "Segmented by how much of your video they watched, so you can retarget your most engaged viewers first.", color: C.amber },
  { Icon: ThumbsUp, title: "Facebook and Instagram engagement", body: "Anyone who engaged with your page or profile, a rich warm pool for retargeting campaigns.", color: C.coral },
  { Icon: Target, title: "Retargeting audiences", body: "Built on top of the above, the audiences that let your ads chase people who already raised their hand.", color: C.purple },
];

// ─────────────────────────────────────────────────────────────
// 3. Verify and prove
const VERIFY = [
  { Icon: ScanEye, title: "Pixel actually firing", body: "Checked in Meta Events Manager Test Events and the Pixel Helper, page by page, not assumed.", color: C.cyan },
  { Icon: Activity, title: "Conversion tracking live", body: "Your key events register in Events Manager so Meta can optimize and your numbers can be trusted.", color: C.green },
  { Icon: Repeat, title: "Lead flow tested end to end", body: "A real test lead from Facebook watched all the way into GoHighLevel before your budget goes live.", color: C.rose },
  { Icon: ClipboardCheck, title: "Handover document", body: "A simple, plain language document of everything done, ready to screen share and walk through together.", color: C.blue },
];

// ─────────────────────────────────────────────────────────────
export default function MetaTrackingPixelAttribution() {
  const heroStats = useMemo(
    () => [
      { k: "Pixel", v: "Installed and verified" },
      { k: "Audiences", v: "Full library built" },
      { k: "Lead flow", v: "FB into GHL, tested" },
      { k: "Handover", v: "Documented" },
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
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.blue, background: "rgba(59,130,246,0.12)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.blue }}>
            <Target size={15} /> Meta Pixel, audiences, and lead attribution on GoHighLevel
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            Every click tracked, every lead attributed,
            <span style={{ color: C.blue }}> from Facebook into GoHighLevel.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 690, lineHeight: 1.6 }}>
            You need your Pixel installed and verified, your Business Manager connected, your Lead Forms wired into
            GoHighLevel, your custom and retargeting audiences built, and your conversion tracking proven before a
            dollar of ad spend goes out. That is exactly this job. Here is the whole setup, step by step. Click through it.
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

        <Section eyebrow="The setup" title="From Pixel install to tested lead flow" sub="The full tracking and attribution setup, in the order I run it, built so nothing is assumed and everything is proven. Tap each step.">
          <SetupFlow />
        </Section>

        <Section eyebrow="The audience library" title="Every audience your retargeting needs" sub="Custom and retargeting audiences built once, correctly, so your ads can follow the people who already showed interest instead of starting cold every time.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {AUDIENCES.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${a.color}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <a.Icon size={18} color={a.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{a.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{a.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Verified, not assumed" title="I prove the tracking works before you spend" sub="The difference between a Pixel that is pasted in and one that is actually working is verification. I check every piece and prove the lead flow end to end.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {VERIFY.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <v.Icon size={18} color={v.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{v.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{v.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Screen share callout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginTop: 28, background: "rgba(59,130,246,0.07)", border: `1px solid ${C.blue}`, borderRadius: 16, padding: "20px 22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
            <ClipboardCheck size={17} color={C.blue} />
            <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>I will screen share and walk you through all of it</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 760 }}>
            Your post asks for someone who can screen share and explain the work completed. That is how I close every
            build. I walk you through the Pixel firing in Events Manager, the audiences in your Business Manager, and a
            live test lead landing in GoHighLevel, so you see it working with your own eyes and the handover document
            matches exactly what is on the screen.
          </p>
        </motion.div>

        <Section eyebrow="Proof" title="Real GoHighLevel work" sub="Screenshots from a live GoHighLevel account I built and run, the CRM and automation side that Facebook leads flow into once the Pixel and forms are wired.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <ProofShot src="/proof/regal-04-pipelines-list.png" caption="Pipelines inside GoHighLevel, where a Facebook lead lands and gets worked." />
            <ProofShot src="/proof/regal-02-family-workflows.png" caption="Published workflows that fire the moment a lead form submission arrives." />
            <ProofShot src="/proof/regal-01-workflow-library.png" caption="A documented workflow library, including intake routing from ad leads." />
            <ProofShot src="/proof/regal-05-opportunities-kanban.png" caption="The opportunities board, leads moving from first touch through to won." />
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
            <Terminal size={18} color={C.blue} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>One person, from install to handover.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            BVN is a one person operation, so you deal with the person doing the work, not an account manager passing
            notes. I install the Pixel, connect Business Manager, wire the Lead Forms into GoHighLevel, build every
            audience, verify the tracking, test the lead flow, and hand you a document. I built this page with Claude
            Code to show you how I lay a project out before I touch your account.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.blue, borderRadius: 999, padding: "10px 16px" }}>
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Project based, milestone driven</span>
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
