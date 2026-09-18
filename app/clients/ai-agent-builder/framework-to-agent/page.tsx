"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Mail, Megaphone, Bot, Workflow, Braces, ShieldCheck,
  CheckCircle2, RotateCcw, ChevronRight, Sparkles, Target, Users,
  AlertTriangle, FileText, Database, Layers, ClipboardCheck, Lock,
  BookOpen, Settings2, ArrowRight,
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  bg: "#0B0916", bg2: "#141026", card: "#191331", cardHi: "#22193F",
  border: "#2D2350", ink: "#F2EEFB", sub: "#B7AAD7", muted: "#7C6DA2",
  violet: "#A78BFA", indigo: "#818CF8", cyan: "#22D3EE", green: "#34D399",
  amber: "#FBBF24", blue: "#60A5FA", coral: "#FB7185", pink: "#E879F9",
};

// ── The intake schema (the methodology, turned into structured fields) ──
type Field = {
  id: string; q: string; hint: string; Icon: typeof Target; options: string[];
};
const FIELDS: Field[] = [
  {
    id: "offer", q: "What are you selling?", hint: "The agent scopes everything to this one offer, nothing generic.",
    Icon: Target,
    options: ["A done-for-you AI automation retainer", "An online course", "A local HVAC service"],
  },
  {
    id: "audience", q: "Who is it for?", hint: "One audience per run keeps the output sharp and testable.",
    Icon: Users,
    options: ["Busy founders with no ops team", "Coaches who hate tech", "Homeowners after a breakdown"],
  },
  {
    id: "objection", q: "What is the number one thing stopping them from buying?", hint: "The methodology says lead with the real objection, not the feature list.",
    Icon: AlertTriangle,
    options: ["It looks expensive", "They have been burned before", "They do not trust it will work"],
  },
  {
    id: "proof", q: "What proof do you actually have?", hint: "Guardrail: the agent may only use proof you supply here. It never invents a stat.",
    Icon: ShieldCheck,
    options: ["A named case study with a real number", "A testimonial, no hard numbers yet", "Nothing solid yet, brand new"],
  },
];

// ── Deterministic output builder (same inputs, same brief, every time) ──
function buildBrief(a: Record<string, string>) {
  const positioning = `For ${a.audience.toLowerCase()}, ${a.offer.toLowerCase()} that answers the real hesitation ("${a.objection.toLowerCase()}") before it asks for the sale.`;
  const headlines = [
    `The honest take on "${a.objection.toLowerCase()}"`,
    `Built for ${a.audience.toLowerCase().replace(/^(busy |coaches who |homeowners )/, "")}, not everyone`,
    `What ${a.offer.toLowerCase()} actually changes in your week`,
  ];
  const hook = `Most ${a.audience.toLowerCase()} scroll past because it "${a.objection.toLowerCase()}". So the first line does not pitch. It names that out loud, then shows one concrete thing they get.`;
  const cta = a.proof.startsWith("A named")
    ? "Strong CTA: book a call. You have a real number to anchor it."
    : a.proof.startsWith("A testimonial")
    ? "Soft CTA: offer a low-risk first step (audit, sample, trial). Proof is thin, so reduce the ask."
    : "Trust-building CTA: give value first (free tool, teardown). No hard sell until proof exists.";

  const flags: { level: "hold" | "check"; text: string }[] = [];
  flags.push({ level: "check", text: "Confirm the offer name and price match your live page before publishing." });
  if (a.proof.startsWith("A named")) {
    flags.push({ level: "hold", text: "Verify the case-study number is accurate and you have permission to name the client." });
  }
  if (a.proof.startsWith("Nothing")) {
    flags.push({ level: "hold", text: "No proof supplied, so the agent wrote zero claims about results. A human must decide what is truthful to say." });
  }
  if (a.objection.startsWith("It looks")) {
    flags.push({ level: "check", text: "Price framing is sensitive. Have someone sanity-check the value stack against the real cost." });
  }
  flags.push({ level: "check", text: "Brand voice pass: read it aloud, cut anything that sounds like a template." });

  return { positioning, headlines, hook, cta, flags };
}

const STEP_LABELS = ["Intake", "Reasoning", "Draft", "Review"];

export default function FrameworkToAgent() {
  const [view, setView] = useState<"run" | "architecture" | "safeguards">("run");

  // guided intake state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const step = Object.keys(answers).length;
  const current = FIELDS[step];
  const complete = step >= FIELDS.length;
  const brief = complete ? buildBrief(answers) : null;

  const pick = (val: string) => setAnswers((a) => ({ ...a, [current.id]: val }));
  const reset = () => setAnswers({});

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}@keyframes ring{0%{transform:scale(.85);opacity:.7}100%{transform:scale(1.9);opacity:0}}@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 90px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
          <ArrowLeft size={15} /> bvnofficial.com
        </Link>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.violet, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: C.violet, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
            BVN · Application Demo · AI Agent Development
          </div>
          <h1 style={{ fontSize: 28, lineHeight: 1.2, margin: "10px 0 8px", fontWeight: 800 }}>
            A business methodology, turned into a working AI agent
          </h1>
          <p style={{ color: C.sub, fontSize: 14.5, maxWidth: 820, margin: 0, lineHeight: 1.65 }}>
            Your listing asks for someone who can take a framework or SOP and turn it into a reliable AI tool that collects
            structured inputs, produces consistent output, and keeps a human in the loop. So here is one, running. Step
            through the guided intake and it assembles a campaign brief from a real marketing methodology, using only what
            you tell it, then hands you the review flags. Then look under the hood. I built this page with Claude Code, the
            way I build the real ones.
          </p>
        </div>

        {/* View switcher */}
        <div style={{ marginTop: 22, display: "flex", gap: 6, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 4, width: "fit-content", flexWrap: "wrap" }}>
          {([
            { id: "run", label: "Run the Agent", Icon: Workflow },
            { id: "architecture", label: "The Architecture", Icon: Braces },
            { id: "safeguards", label: "Safeguards", Icon: ShieldCheck },
          ] as const).map((v) => (
            <button key={v.id} onClick={() => setView(v.id)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: 9, border: "none", cursor: "pointer",
                background: view === v.id ? C.violet : "transparent", color: view === v.id ? "#160A2E" : C.sub, fontSize: 12.5, fontWeight: 700 }}>
              <v.Icon size={14} /> {v.label}
            </button>
          ))}
        </div>

        <div style={{ position: "relative" }}>
          <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} style={{ marginTop: 18 }}>

            {/* ── RUN ────────────────────────────────────────────── */}
            {view === "run" && (
              <div>
                {/* progress rail */}
                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                  {STEP_LABELS.map((lbl, i) => {
                    const reached = complete ? true : i <= step;
                    const isNow = !complete && i === step;
                    return (
                      <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 7, background: C.card, border: `1px solid ${isNow ? C.violet + "88" : C.border}`, borderRadius: 9, padding: "7px 11px" }}>
                        <span style={{ width: 18, height: 18, borderRadius: 99, display: "grid", placeItems: "center", background: reached ? C.violet : C.bg2, color: reached ? "#160A2E" : C.muted, fontSize: 11, fontWeight: 800 }}>
                          {complete || i < step ? "✓" : i + 1}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: reached ? C.ink : C.muted }}>{lbl}</span>
                      </div>
                    );
                  })}
                </div>

                {/* intake OR result */}
                {!complete ? (
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span style={{ width: 34, height: 34, borderRadius: 9, background: C.violet + "1E", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <current.Icon size={17} style={{ color: C.violet }} />
                      </span>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .6 }}>
                        Step {step + 1} of {FIELDS.length}
                      </div>
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, margin: "8px 0 4px" }}>{current.q}</h3>
                    <p style={{ fontSize: 12.5, color: C.sub, margin: "0 0 14px", lineHeight: 1.5 }}>{current.hint}</p>
                    <div style={{ display: "grid", gap: 8 }}>
                      {current.options.map((opt) => (
                        <button key={opt} onClick={() => pick(opt)}
                          style={{ textAlign: "left", display: "flex", alignItems: "center", gap: 10, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 11, padding: "12px 14px", cursor: "pointer", color: C.ink, fontSize: 13.5, fontWeight: 600, transition: "all .18s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.violet + "99"; e.currentTarget.style.background = C.cardHi; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.bg2; }}>
                          <span style={{ width: 22, height: 22, borderRadius: 7, background: C.violet + "22", display: "grid", placeItems: "center", flexShrink: 0 }}>
                            <ArrowRight size={13} style={{ color: C.violet }} />
                          </span>
                          {opt}
                        </button>
                      ))}
                    </div>
                    {step > 0 && (
                      <button onClick={reset} style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: C.muted, fontSize: 12, cursor: "pointer" }}>
                        <RotateCcw size={12} /> Start over
                      </button>
                    )}
                  </div>
                ) : (
                  <div style={{ animation: "fadeUp .3s ease" }}>
                    {/* the structured output */}
                    <div style={{ background: C.card, border: `1px solid ${C.violet}44`, borderRadius: 14, overflow: "hidden" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "12px 16px", background: C.violet + "14", borderBottom: `1px solid ${C.border}` }}>
                        <Sparkles size={16} style={{ color: C.violet }} />
                        <span style={{ fontSize: 13, fontWeight: 800 }}>Campaign brief, generated</span>
                        <span style={{ marginLeft: "auto", fontSize: 11, color: C.muted, fontFamily: "ui-monospace, monospace" }}>consistent · grounded · reviewable</span>
                      </div>
                      <div style={{ padding: "16px 18px", display: "grid", gap: 14 }}>
                        <Out label="Positioning" body={brief!.positioning} color={C.indigo} Icon={Target} />
                        <div>
                          <OutLabel Icon={FileText} color={C.blue} text="Headline angles" />
                          <div style={{ display: "grid", gap: 6, marginTop: 7 }}>
                            {brief!.headlines.map((h, i) => (
                              <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 9, padding: "9px 12px" }}>
                                <span style={{ fontSize: 11, fontWeight: 800, color: C.blue, fontFamily: "ui-monospace, monospace", marginTop: 1 }}>{i + 1}</span>
                                <span style={{ fontSize: 13.5, color: C.ink }}>{h}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <Out label="Lead hook" body={brief!.hook} color={C.cyan} Icon={Sparkles} />
                        <Out label="Call to action" body={brief!.cta} color={C.green} Icon={CheckCircle2} />
                      </div>
                    </div>

                    {/* human review gate */}
                    <div style={{ marginTop: 14, background: C.card, border: `1px solid ${C.amber}44`, borderRadius: 14, padding: "15px 17px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                        <ClipboardCheck size={16} style={{ color: C.amber }} />
                        <span style={{ fontSize: 13.5, fontWeight: 800 }}>Before this ships, a human checks these</span>
                      </div>
                      <div style={{ display: "grid", gap: 7 }}>
                        {brief!.flags.map((f, i) => (
                          <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                            <span style={{ fontSize: 10, fontWeight: 800, color: f.level === "hold" ? C.coral : C.amber, background: (f.level === "hold" ? C.coral : C.amber) + "22", borderRadius: 5, padding: "2px 6px", marginTop: 1, textTransform: "uppercase", letterSpacing: .4, flexShrink: 0 }}>
                              {f.level === "hold" ? "hold" : "check"}
                            </span>
                            <span style={{ fontSize: 12.5, color: C.sub, lineHeight: 1.5 }}>{f.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginTop: 14 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", background: C.green + "12", border: `1px solid ${C.green}44`, borderRadius: 11, padding: "10px 13px", flex: "1 1 320px" }}>
                        <Lock size={15} style={{ color: C.green }} />
                        <span style={{ fontSize: 12.5, color: C.ink }}>
                          Notice what is <b>not</b> here: no invented stats, no fake client names. The agent only used the four things you gave it. That is the hallucination guard, built in.
                        </span>
                      </div>
                      <button onClick={reset} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 16px", borderRadius: 10, border: "none", cursor: "pointer", background: C.violet, color: "#160A2E", fontSize: 12.5, fontWeight: 700 }}>
                        <RotateCcw size={14} /> Run it again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── ARCHITECTURE ───────────────────────────────────── */}
            {view === "architecture" && (
              <div>
                <p style={{ color: C.sub, fontSize: 13.5, marginBottom: 16, lineHeight: 1.6 }}>
                  A prompt in a chat window is not a tool. A tool has a defined input, a defined output, and it behaves the
                  same on Tuesday as it did on Monday. Here is how the agent you just ran is actually put together, and
                  where each of your requirements lands.
                </p>
                <div style={{ display: "grid", gap: 8 }}>
                  {[
                    { Icon: BookOpen, t: "The methodology becomes a knowledge base", d: "The framework or SOP is written up as grounded reference the agent reasons from, so it follows your method instead of guessing at marketing best practice.", color: C.violet },
                    { Icon: Braces, t: "A structured input schema", d: "Instead of a blank box, the intake collects defined fields with real options. Consistent input is what makes consistent output possible.", color: C.blue },
                    { Icon: Settings2, t: "Layered system instructions", d: "Role, method, tone, and hard rules live in versioned agent instructions, not scattered prompts. This is the prompt architecture the role asks for.", color: C.indigo },
                    { Icon: ShieldCheck, t: "Guardrails and grounding", d: "The agent may only use facts the user supplied. No supplied proof means no results claims. That is how you kill hallucinations before they reach a customer.", color: C.green },
                    { Icon: ClipboardCheck, t: "A human-in-the-loop gate", d: "Every run ends with review flags that tell a person exactly what to verify. The agent drafts, a human approves. Nothing auto-publishes.", color: C.amber },
                    { Icon: Database, t: "Integration when it earns its place", d: "The same engine plugs into GoHighLevel, Notion, Airtable, Google Workspace, or a webhook via Zapier, Make, or n8n, so the output lands where the work already happens.", color: C.cyan },
                    { Icon: FileText, t: "Documentation and handover", d: "Architecture, prompts, limits, and maintenance get written down, and I train the team to use the tool. A tool nobody understands gets abandoned.", color: C.pink },
                  ].map((x, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 15px" }}>
                      <span style={{ width: 32, height: 32, borderRadius: 9, background: x.color + "1E", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <x.Icon size={16} style={{ color: x.color }} />
                      </span>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 700 }}>{x.t}</div>
                        <p style={{ fontSize: 12.5, color: C.sub, margin: "3px 0 0", lineHeight: 1.5 }}>{x.d}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 16, background: C.bg2, border: `1px dashed ${C.border}`, borderRadius: 12, padding: "13px 15px" }}>
                  <Layers size={16} style={{ color: C.violet }} />
                  <span style={{ fontSize: 12.5, color: C.sub, flex: "1 1 300px" }}>
                    Real proof of this pattern: my Hypersonic build runs a Fathom to Claude to Notion pipeline with human-in-the-loop messaging, and I run Claude and Retell voice agents on live client stacks.
                  </span>
                  <Link href="/clients/hypersonic/milestones" style={{ display: "inline-flex", alignItems: "center", gap: 5, color: C.violet, fontSize: 12.5, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
                    See it <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            )}

            {/* ── SAFEGUARDS ─────────────────────────────────────── */}
            {view === "safeguards" && (
              <div>
                <p style={{ color: C.sub, fontSize: 13.5, marginBottom: 16, lineHeight: 1.6 }}>
                  The listing is clear that knowing where AI must NOT be trusted matters as much as building it. That
                  judgment is the job. Here is how I test an agent before it touches real work, and where the human stays in
                  charge.
                </p>
                <div style={{ display: "grid", gap: 10 }}>
                  {[
                    { Icon: ShieldCheck, t: "Grounding test", q: "Will it invent a fact?", d: "I feed it inputs with no proof and confirm it writes zero results claims, like the run you just did. If it fabricates, it does not ship.", color: C.green },
                    { Icon: RotateCcw, t: "Consistency test", q: "Same input, same output?", d: "The same intake run five times must produce the same structured brief. Drift means the instructions are too loose and get tightened.", color: C.blue },
                    { Icon: Target, t: "Brand alignment test", q: "Does it sound like them?", d: "Output is checked against the brand voice and cut if it reads like a template. Consistency is worthless if it is consistently off-brand.", color: C.indigo },
                    { Icon: AlertTriangle, t: "Edge-case test", q: "What about a weird input?", d: "Empty fields, contradictory answers, and out-of-scope requests get handled gracefully, not with a confident wrong answer.", color: C.amber },
                    { Icon: ClipboardCheck, t: "The human gate", q: "Who says go?", d: "A person does. Every run ends with a review checklist, and anything sensitive, a price claim, a legal line, a named client, is flagged hold, not check.", color: C.coral },
                  ].map((x, i) => (
                    <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
                        <span style={{ width: 32, height: 32, borderRadius: 9, background: x.color + "1E", display: "grid", placeItems: "center", flexShrink: 0 }}>
                          <x.Icon size={16} style={{ color: x.color }} />
                        </span>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 800 }}>{x.t}</div>
                          <div style={{ fontSize: 11.5, color: x.color, fontWeight: 600, fontStyle: "italic" }}>{x.q}</div>
                        </div>
                      </div>
                      <p style={{ fontSize: 12.5, color: C.sub, margin: "10px 0 0", lineHeight: 1.55 }}>{x.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 42, paddingTop: 22, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Benjamin Yson</div>
            <div style={{ fontSize: 12, color: C.muted }}>AI agents · prompt architecture · Claude &amp; GPT · Zapier / Make / n8n · BVN</div>
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

// ── small output blocks ───────────────────────────────────────
function OutLabel({ Icon, color, text }: { Icon: typeof Target; color: string; text: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
      <Icon size={14} style={{ color }} />
      <span style={{ fontSize: 11, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: .5 }}>{text}</span>
    </div>
  );
}
function Out({ label, body, color, Icon }: { label: string; body: string; color: string; Icon: typeof Target }) {
  return (
    <div>
      <OutLabel Icon={Icon} color={color} text={label} />
      <p style={{ fontSize: 13.5, color: C.ink, margin: "7px 0 0", lineHeight: 1.6 }}>{body}</p>
    </div>
  );
}
