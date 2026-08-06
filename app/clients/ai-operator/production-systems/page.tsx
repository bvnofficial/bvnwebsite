"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Globe, FileText, Bot, Send, Cloud, Zap,
  Terminal, Clock, PhoneCall, CheckCircle2, ShieldCheck, Scale,
  Database, Code2, ListChecks, AlertTriangle, Sparkles,
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
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: C.purple }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 800, margin: "8px 0 6px", letterSpacing: -0.4 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 660, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. The workflow (interactive)
type Step = { Icon: typeof Globe; title: string; trigger: string; detail: string; color: string };
const STEPS: Step[] = [
  { Icon: Cloud, title: "Scheduled trigger", trigger: "Unattended", color: C.purple,
    detail: "The whole thing runs on a schedule in the cloud, with no one pressing a button and no dependence on my computer being on. This is the difference between a prototype an operator runs by hand and a system the business can rely on." },
  { Icon: Globe, title: "Crawl and extract", trigger: "Python", color: C.blue,
    detail: "Python pulls the source content on each run and extracts the fields that matter into a clean, consistent shape. Messy input becomes structured data before the model ever sees it, because a model given tidy input makes far fewer mistakes." },
  { Icon: Bot, title: "Score against a rubric", trigger: "LLM", color: C.green,
    detail: "Each item is passed to the LLM with a fixed scoring rubric and a required output format. The model does not free-associate a verdict, it answers against defined criteria, which is what makes the result consistent from run to run and a wrong score explainable rather than mysterious." },
  { Icon: Send, title: "Route the strong matches", trigger: "Slack", color: C.amber,
    detail: "Only items that clear the bar are routed onward into Slack, formatted to be read in seconds on a phone. The noise is filtered out, so the person on the receiving end gets a short list of things that matter, not a dump to wade through." },
];

function Workflow() {
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
                flexShrink: 0, width: 160, textAlign: "left", cursor: "pointer",
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
// Language vs data vs logic
const SPLIT = [
  { Icon: Bot, title: "Language, to the model", body: "Reading, summarizing, classifying, drafting. The judgement calls that are genuinely about understanding text. This is where the model earns its place.", color: C.purple },
  { Icon: Database, title: "Data, from the source", body: "Anything that must be exact, a policy number, a figure, a status, is retrieved from the system that owns it and handed to the model, never recalled from memory.", color: C.green },
  { Icon: Code2, title: "Logic, in code", body: "Fixed rules, thresholds, and routing live in code where they run the same way every time, not in a model that can phrase itself differently on two runs.", color: C.amber },
];

// Reliability
const RELIABILITY = [
  { Icon: ListChecks, title: "A test set of known questions", body: "A fixed set of questions with known-correct answers, re-run whenever the source content or the prompt changes, so a regression is caught before a manager sees it.", color: C.green },
  { Icon: AlertTriangle, title: "Track the error rate", body: "Wrong or outdated answers are logged and counted, so accuracy is a number that trends, not a feeling. You cannot reduce what you do not measure.", color: C.amber },
  { Icon: ShieldCheck, title: "Honest about the risk", body: "Every system ships with a plain statement of what it can be trusted with and what still needs a human check. No claim of perfect accuracy, because that claim is always false.", color: C.cyan },
];

// ─────────────────────────────────────────────────────────────
export default function AiOperatorProductionSystems() {
  const heroStats = useMemo(
    () => [
      { k: "Runs", v: "Unattended, cloud" },
      { k: "Consistency", v: "Rubric-scored" },
      { k: "Built with", v: "Claude" },
      { k: "On accuracy", v: "Honest, checked" },
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
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.purple, background: "rgba(167,139,250,0.12)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.purple }}>
            <Sparkles size={15} /> A real production AI system, shown in full
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            The workflow, the prompt structure, and the output,
            <span style={{ color: C.purple }}> not a slide about one.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 700, lineHeight: 1.6 }}>
            You asked to see something real: the workflow, the prompt structure, and the output, built with Claude. This
            is a system I built and run, an unattended pipeline that crawls, extracts, scores content with an LLM against
            a fixed rubric, and routes only what matters into Slack. Here it is, from the trigger to the finished output.
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

        <Section eyebrow="The workflow" title="What runs, in order, unattended" sub="Four stages, on a schedule, in the cloud. Tap each one.">
          <Workflow />
        </Section>

        {/* Prompt structure */}
        <Section eyebrow="The prompt structure" title="Why the output is consistent" sub="This is the part most people skip and the part that decides whether an assistant is trustworthy. The model answers against a fixed rubric and a required shape, not from a vibe.">
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 20px" }}>
            <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 12 }}>
              Simplified shape of the scoring prompt. The point is that the model is told exactly what to judge and exactly how to answer.
            </div>
            <pre style={{ margin: 0, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 16px", overflowX: "auto", fontSize: 12.5, lineHeight: 1.7, color: C.sub }}>
{`SYSTEM
You score one item against a fixed rubric.
Answer ONLY from the item text provided.
If a field is not stated, return "unknown" — do not guess.

RUBRIC (score each 0-3)
  fit         how well it matches the target profile
  clarity     how clearly the requirement is stated
  effort      how much work it realistically implies

OUTPUT (strict JSON, nothing else)
  { "fit": n, "clarity": n, "effort": n,
    "total": n, "reason": "one short sentence" }`}
            </pre>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginTop: 16 }}>
              <MiniPoint color={C.green} title="Answer from source, not memory">Told to answer only from the item and to return unknown rather than guess, which is how you stop confident wrong answers.</MiniPoint>
              <MiniPoint color={C.amber} title="A rubric, not an opinion">Fixed criteria mean the same item scores the same way twice, and a score can be explained by its parts.</MiniPoint>
              <MiniPoint color={C.blue} title="Strict output shape">A required JSON shape means the next step can trust the result, and a malformed answer is caught immediately.</MiniPoint>
            </div>
          </div>
        </Section>

        {/* The output */}
        <Section eyebrow="The output" title="What actually lands in Slack" sub="A busy person does not want raw model text. They want a finished, skimmable result. So the output is formatted for the phone.">
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px 18px", maxWidth: 460 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, color: C.muted, fontSize: 12, fontWeight: 700 }}>
              <Send size={13} color={C.purple} /> Slack · strong-matches
            </div>
            <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.green}`, borderRadius: 12, padding: "14px 14px" }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.ink, marginBottom: 4 }}>Strong match · score 9/9</div>
              <div style={{ fontSize: 12.5, color: C.sub, lineHeight: 1.55 }}>
                fit 3 · clarity 3 · effort 3<br />
                <span style={{ color: C.muted }}>Reason:</span> clear scope, direct fit, sensible workload.
              </div>
              <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: C.purple }}>
                <ArrowRight size={12} /> Open source item
              </div>
            </div>
            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 12 }}>
              Illustrative of the format. Weak items never reach here, which is the whole point.
            </div>
          </div>
        </Section>

        {/* Built with Claude */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginTop: 40, background: "rgba(167,139,250,0.07)", border: `1px solid ${C.purple}`, borderRadius: 16, padding: "22px 22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
            <Terminal size={17} color={C.purple} />
            <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>Built with Claude, and this is why it matters for you</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.62, margin: 0, maxWidth: 800 }}>
            I work in Claude every day, through the API and in Claude Code, which is where I built this page. The reason
            Claude specifically is a good foundation for an internal assistant: it is strong at following a structured
            system prompt and staying grounded in the source material you give it, rather than drifting into its own
            memory. That single property is what turns a knowledge assistant from a demo into something a district
            manager can actually trust on a phone between store visits. Ground it in the current policy, tell it to cite
            the source and to say unknown rather than guess, and the confident-but-wrong answer mostly goes away.
          </p>
        </motion.div>

        <Section eyebrow="How I keep it honest" title="Language to the model, data from source, logic in code" sub="Most bad AI systems fail because they ask the model to do a job that was never a language job. The skill is knowing which is which.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {SPLIT.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${s.color}`, borderRadius: 14, padding: "18px 18px" }}
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

        <Section eyebrow="Reliability" title="Catch the wrong answer before a manager sees it" sub="You said you are not looking for someone who claims perfect accuracy. Neither am I. Here is how I handle the risk instead.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {RELIABILITY.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <r.Icon size={18} color={r.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{r.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{r.body}</p>
              </motion.div>
            ))}
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
            <Scale size={18} color={C.purple} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>Prototypes into systems is exactly the job.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 760 }}>
            You have working prototypes built by operators, and you want them turned into reliable, documented,
            company-wide systems. That is the gap I close: taking something that works when one person babysits it and
            making it run unattended, consistently, with the risk measured and written down. I am one person, I build it
            myself, and I document it so someone else could maintain it. I would happily screen share this system live
            and walk you through the real code and the Claude environment I work in.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/clients/how-i-build/experience" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.purple, borderRadius: 999, padding: "10px 16px" }}>
              More systems I built <ArrowRight size={14} />
            </Link>
            <Link href="/case-studies" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.ink, textDecoration: "none", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 999, padding: "10px 16px" }}>
              Full portfolio <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Contact */}
        <div style={{ marginTop: 34, textAlign: "center", fontSize: 12.5, color: C.muted, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <CheckCircle2 size={14} color={C.green} /> Benjamin Yson · BVN Official
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><PhoneCall size={13} /> +63 981 655 6555</span>
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Built with Claude</span>
        </div>
      </div>
    </div>
  );
}

function MiniPoint({ color, title, children }: { color: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 12px" }}>
      <div style={{ fontSize: 12.5, fontWeight: 800, color, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 12, color: C.sub, lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}
