"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Mail, Megaphone, Globe, ShoppingCart, CalendarClock, Users,
  Sparkles, Wand2, CheckCircle2, ChevronRight, ChevronLeft, Copy, RefreshCw,
  Layers, Code2, FormInput, Palette, Smartphone, Bot, ListChecks, ArrowRight,
  Figma, Zap,
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  bg: "#0A1120", bg2: "#0E1830", card: "#121E3A", cardHi: "#16264A",
  border: "#22324F", ink: "#EAF1FC", sub: "#9FB1D0", muted: "#647697",
  cyan: "#22D3EE", green: "#34D399", amber: "#FBBF24", coral: "#FB923C",
  purple: "#A78BFA", blue: "#3B82F6",
};

// ── Form model ────────────────────────────────────────────────
type TypeId = "website" | "store" | "booking" | "membership";
const TYPES: { id: TypeId; label: string; blurb: string; Icon: typeof Globe }[] = [
  { id: "website", label: "Marketing Website", blurb: "Pages, lead capture, content", Icon: Globe },
  { id: "store", label: "Online Store", blurb: "Products, checkout, payments", Icon: ShoppingCart },
  { id: "booking", label: "Booking System", blurb: "Services, calendars, reminders", Icon: CalendarClock },
  { id: "membership", label: "Membership / Community", blurb: "Tiers, gated content, logins", Icon: Users },
];

const TYPE_META: Record<TypeId, {
  dynamicLabel: string; dynamicOptions: string[];
  approach: string; features: string[];
}> = {
  website: {
    dynamicLabel: "How many pages do you need?",
    dynamicOptions: ["1 to 5", "6 to 15", "16+"],
    approach: "A fast, responsive WordPress build in Elementor, structured around clear guided paths to your main call to action, with lead forms wired to your CRM.",
    features: ["Responsive multi page layout", "Lead capture forms with conditional logic", "SEO friendly structure", "Enquiry and contact flow"],
  },
  store: {
    dynamicLabel: "How many products roughly?",
    dynamicOptions: ["Under 25", "25 to 200", "200+"],
    approach: "WooCommerce on WordPress with a conversion focused checkout, Stripe payments, and automated order and stock handling so the busywork runs itself.",
    features: ["Product catalog", "Secure Stripe checkout", "Order and inventory tracking", "Abandoned cart recovery"],
  },
  booking: {
    dynamicLabel: "How big is the team taking bookings?",
    dynamicOptions: ["Just me", "Small team", "Large team"],
    approach: "A booking flow with real calendar availability, automated email and SMS reminders, and clean guided steps so customers book in under a minute.",
    features: ["Service catalog", "Calendar and availability", "Automated email and SMS reminders", "Staff scheduling"],
  },
  membership: {
    dynamicLabel: "How many membership tiers?",
    dynamicOptions: ["1", "2 to 3", "4+"],
    approach: "A membership platform with tiered access, gated content, member logins, and recurring billing, all managed inside WordPress.",
    features: ["Tiered access levels", "Gated content", "Member logins and profiles", "Recurring billing"],
  },
};

const GOALS = ["More leads", "More sales", "Save time with automation", "Better user experience"];
const GOAL_FEATURE: Record<string, string> = {
  "More leads": "Optimized lead forms with smart conditional logic",
  "More sales": "Conversion focused checkout with upsell prompts",
  "Save time with automation": "Automated workflows, notifications, and handoffs",
  "Better user experience": "Guided, step by step user journeys",
};
const TIMELINES = ["ASAP", "2 to 4 weeks", "1 to 2 months", "Flexible"];

type Form = {
  type: TypeId | "";
  business: string;
  dynamic: string;
  detail: string;
  goal: string;
  timeline: string;
  mustHave: string;
};
const EMPTY: Form = { type: "", business: "", dynamic: "", detail: "", goal: "", timeline: "", mustHave: "" };

type Brief = { headline: string; approach: string; features: string[]; phases: { name: string; note: string }[]; aiNote: string };

function generateBrief(f: Form): Brief {
  const t = TYPE_META[f.type as TypeId];
  const biz = f.business.trim() || "your platform";
  const features = [...t.features];
  if (f.goal && GOAL_FEATURE[f.goal]) features.push(GOAL_FEATURE[f.goal]);
  if (f.mustHave.trim()) features.push(`Your must have: ${f.mustHave.trim()}`);
  const pace =
    f.timeline === "ASAP" ? "a tight, sprint style schedule with the highest impact pieces first"
    : f.timeline === "Flexible" ? "a relaxed pace that prioritizes polish and testing"
    : `a paced plan targeting your ${f.timeline} window`;
  return {
    headline: `Here is a tailored plan for ${biz}.`,
    approach: t.approach,
    features,
    phases: [
      { name: "Phase 1 · Foundation", note: "WordPress and Elementor setup, page structure, and the guided form scaffold." },
      { name: "Phase 2 · Core build", note: `The ${f.goal ? f.goal.toLowerCase() : "core"} features above, with Gravity Forms conditional logic and the AI step wired in.` },
      { name: "Phase 3 · Polish and launch", note: `Responsive QA, custom CSS and JS refinements, and launch, on ${pace}.` },
    ],
    aiNote: f.mustHave.trim()
      ? `Because you flagged "${f.mustHave.trim()}" as a must have, I would design the first user flow around it so it is front and center, not bolted on later.`
      : "Tell me a must have feature on the previous step and the plan reshapes around it. That is the AI reading your inputs, not a fixed template.",
  };
}

const STEPS = ["Project basics", "The details", "Goals and priorities", "Your AI plan"];

// ── Component ──────────────────────────────────────────────────
export default function SmartFormsFlow() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(EMPTY);
  const [generating, setGenerating] = useState(false);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [copied, setCopied] = useState(false);

  const set = (k: keyof Form, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const typeMeta = form.type ? TYPE_META[form.type] : null;
  const typeLabel = TYPES.find((t) => t.id === form.type)?.label ?? "";

  const canNext =
    step === 0 ? form.type !== "" && form.business.trim() !== "" :
    step === 1 ? form.dynamic !== "" :
    step === 2 ? form.goal !== "" && form.timeline !== "" :
    true;

  function next() {
    if (step === 2) {
      setStep(3);
      setGenerating(true);
      setBrief(null);
      window.setTimeout(() => {
        setBrief(generateBrief(form));
        setGenerating(false);
      }, 1500);
      return;
    }
    setStep((s) => Math.min(3, s + 1));
  }
  function back() { setStep((s) => Math.max(0, s - 1)); }
  function regenerate() {
    setGenerating(true); setBrief(null);
    window.setTimeout(() => { setBrief(generateBrief(form)); setGenerating(false); }, 1100);
  }
  function restart() { setForm(EMPTY); setBrief(null); setStep(0); }
  function copyBrief() {
    if (!brief) return;
    const text = [
      brief.headline, "", brief.approach, "",
      "Recommended features:", ...brief.features.map((x) => `- ${x}`), "",
      "Plan:", ...brief.phases.map((p) => `${p.name}: ${p.note}`), "",
      brief.aiNote,
    ].join("\n");
    navigator.clipboard?.writeText(text);
    setCopied(true); window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}} @keyframes blink{0%,80%,100%{opacity:.25}40%{opacity:1}}`}</style>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px 90px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
          <ArrowLeft size={15} /> bvnofficial.com
        </Link>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.purple, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: C.purple, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
            BVN · Application Demo · Smart Forms
          </div>
          <h1 style={{ fontSize: 29, lineHeight: 1.2, margin: "10px 0 8px", fontWeight: 800 }}>
            An AI guided form flow — try it
          </h1>
          <p style={{ color: C.sub, fontSize: 14.5, maxWidth: 720, margin: 0, lineHeight: 1.65 }}>
            Your post asks for AI features, Gravity Forms style flows, custom UI, and guided user journeys.
            So rather than list those skills, I built a working one you can click. Walk through the steps below.
            Notice how step two changes based on your first answer (that is conditional logic), and how the last
            step reads everything you entered and generates a tailored plan (that is the AI step).
          </p>
        </div>

        {/* Progress */}
        <div style={{ marginTop: 26, display: "flex", gap: 8 }}>
          {STEPS.map((label, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{ height: 5, borderRadius: 99, background: i <= step ? C.purple : C.border, transition: "background .3s" }} />
              <div style={{ fontSize: 11, marginTop: 7, color: i === step ? C.purple : C.muted, fontWeight: i === step ? 700 : 400 }}>
                {i + 1}. {label}
              </div>
            </div>
          ))}
        </div>

        {/* Wizard card */}
        <div style={{ marginTop: 18, background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, overflow: "hidden" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22 }}
              style={{ padding: "26px 26px 22px" }}
            >
              {/* STEP 0 */}
              {step === 0 && (
                <>
                  <StepHead n={1} title="What are you building?" />
                  <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", marginBottom: 20 }}>
                    {TYPES.map((t) => {
                      const on = form.type === t.id;
                      return (
                        <button key={t.id} onClick={() => set("type", t.id)}
                          style={{ textAlign: "left", cursor: "pointer", background: on ? C.purple + "18" : C.bg2, border: `1px solid ${on ? C.purple + "99" : C.border}`, borderRadius: 14, padding: 15 }}>
                          <span style={{ width: 34, height: 34, borderRadius: 9, background: (on ? C.purple : C.muted) + "22", display: "grid", placeItems: "center", marginBottom: 9 }}>
                            <t.Icon size={17} style={{ color: on ? C.purple : C.sub }} />
                          </span>
                          <div style={{ fontSize: 14, fontWeight: 700, color: on ? C.ink : C.sub }}>{t.label}</div>
                          <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{t.blurb}</div>
                        </button>
                      );
                    })}
                  </div>
                  <Field label="What is the business or project called?">
                    <input value={form.business} onChange={(e) => set("business", e.target.value)} placeholder="e.g. Northside Studio" style={inputStyle} />
                  </Field>
                </>
              )}

              {/* STEP 1 — conditional */}
              {step === 1 && typeMeta && (
                <>
                  <StepHead n={2} title="A few details" />
                  <div style={{ display: "flex", gap: 9, alignItems: "flex-start", background: C.amber + "12", border: `1px solid ${C.amber}3A`, borderRadius: 12, padding: "11px 14px", marginBottom: 18 }}>
                    <Zap size={15} style={{ color: C.amber, flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.5 }}>
                      This step changed because you chose <strong style={{ color: C.amber }}>{typeLabel}</strong>. In Gravity Forms this is conditional logic, fields appear and adapt based on earlier answers, so users only ever see what is relevant to them.
                    </span>
                  </div>
                  <Field label={typeMeta.dynamicLabel}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {typeMeta.dynamicOptions.map((o) => {
                        const on = form.dynamic === o;
                        return (
                          <button key={o} onClick={() => set("dynamic", o)}
                            style={{ cursor: "pointer", padding: "9px 15px", borderRadius: 10, fontSize: 13, fontWeight: on ? 700 : 400, border: `1px solid ${on ? C.purple + "99" : C.border}`, background: on ? C.purple + "1E" : C.bg2, color: on ? C.purple : C.sub }}>
                            {o}
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                  <Field label="Anything specific you need? (optional)">
                    <textarea value={form.detail} onChange={(e) => set("detail", e.target.value)} placeholder="Tell us in a sentence or two..." rows={3} style={{ ...inputStyle, resize: "vertical" as const }} />
                  </Field>
                </>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <>
                  <StepHead n={3} title="Goals and priorities" />
                  <Field label="What is the main goal?">
                    <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                      {GOALS.map((g) => {
                        const on = form.goal === g;
                        return (
                          <button key={g} onClick={() => set("goal", g)}
                            style={{ cursor: "pointer", textAlign: "left", padding: "11px 14px", borderRadius: 11, fontSize: 13, fontWeight: on ? 700 : 400, border: `1px solid ${on ? C.purple + "99" : C.border}`, background: on ? C.purple + "1A" : C.bg2, color: on ? C.ink : C.sub }}>
                            {g}
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                  <Field label="Ideal timeline?">
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {TIMELINES.map((tl) => {
                        const on = form.timeline === tl;
                        return (
                          <button key={tl} onClick={() => set("timeline", tl)}
                            style={{ cursor: "pointer", padding: "9px 15px", borderRadius: 10, fontSize: 13, fontWeight: on ? 700 : 400, border: `1px solid ${on ? C.purple + "99" : C.border}`, background: on ? C.purple + "1E" : C.bg2, color: on ? C.purple : C.sub }}>
                            {tl}
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                  <Field label="One must-have feature (optional)">
                    <input value={form.mustHave} onChange={(e) => set("mustHave", e.target.value)} placeholder="e.g. members can book a call from their dashboard" style={inputStyle} />
                  </Field>
                </>
              )}

              {/* STEP 3 — AI result */}
              {step === 3 && (
                <>
                  <StepHead n={4} title="Your AI generated plan" Icon={Wand2} />
                  {generating && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "34px 0" }}>
                      <span style={{ width: 46, height: 46, borderRadius: 13, background: C.purple + "1E", display: "grid", placeItems: "center", marginBottom: 14 }}>
                        <Bot size={22} style={{ color: C.purple }} />
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.sub, fontSize: 14 }}>
                        Reading your answers and drafting a plan
                        <span style={{ display: "inline-flex", gap: 3 }}>
                          {[0, 1, 2].map((d) => (
                            <span key={d} style={{ width: 5, height: 5, borderRadius: 99, background: C.purple, animation: `blink 1.2s ${d * 0.2}s infinite` }} />
                          ))}
                        </span>
                      </div>
                    </div>
                  )}
                  {brief && !generating && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <div style={{ background: C.purple + "12", border: `1px solid ${C.purple}3A`, borderRadius: 14, padding: "16px 18px", marginBottom: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <Sparkles size={16} style={{ color: C.purple }} />
                          <span style={{ fontSize: 15, fontWeight: 800 }}>{brief.headline}</span>
                        </div>
                        <p style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.6, margin: 0 }}>{brief.approach}</p>
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <Label icon={ListChecks}>Recommended features</Label>
                        <div style={{ display: "grid", gap: 7 }}>
                          {brief.features.map((f, i) => (
                            <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 12px" }}>
                              <CheckCircle2 size={15} style={{ color: C.green, flexShrink: 0, marginTop: 1 }} />
                              <span style={{ fontSize: 13, color: C.ink, lineHeight: 1.5 }}>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <Label icon={Layers}>Suggested plan</Label>
                        <div style={{ display: "grid", gap: 7 }}>
                          {brief.phases.map((p, i) => (
                            <div key={i} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 14px" }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: C.purple }}>{p.name}</div>
                              <div style={{ fontSize: 12.5, color: C.sub, marginTop: 3, lineHeight: 1.5 }}>{p.note}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 9, alignItems: "flex-start", background: C.blue + "12", border: `1px solid ${C.blue}3A`, borderRadius: 12, padding: "12px 15px", marginBottom: 18 }}>
                        <Bot size={16} style={{ color: C.blue, flexShrink: 0, marginTop: 1 }} />
                        <span style={{ fontSize: 13, color: C.ink, lineHeight: 1.55 }}>{brief.aiNote}</span>
                      </div>

                      <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
                        <button onClick={copyBrief} style={btn(C.green)}>
                          <Copy size={14} /> {copied ? "Copied" : "Copy the plan"}
                        </button>
                        <button onClick={regenerate} style={btn(C.purple)}>
                          <RefreshCw size={14} /> Regenerate
                        </button>
                        <button onClick={restart} style={{ ...btn(C.muted), marginLeft: "auto" }}>
                          Start over
                        </button>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Nav footer */}
          {step < 3 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 26px", borderTop: `1px solid ${C.border}`, background: C.bg2 }}>
              <button onClick={back} disabled={step === 0}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none", cursor: step === 0 ? "default" : "pointer", color: step === 0 ? C.muted : C.sub, fontSize: 13, opacity: step === 0 ? 0.4 : 1 }}>
                <ChevronLeft size={16} /> Back
              </button>
              <button onClick={next} disabled={!canNext}
                style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 10, border: "none", cursor: canNext ? "pointer" : "default", background: canNext ? C.purple : C.cardHi, color: canNext ? "#0a0e14" : C.muted, fontSize: 13.5, fontWeight: 700 }}>
                {step === 2 ? "Generate my plan" : "Continue"} <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        <p style={{ fontSize: 12, color: C.muted, marginTop: 12, lineHeight: 1.6 }}>
          Honest note: the AI step here runs instantly in your browser so you can click it freely with no wait and no
          cost. In your real platform this is a server side call to the OpenAI API, with keys kept on the server and
          usage rate handled, so no key ever touches the browser. The form logic, conditional steps, and UI are exactly
          what I would build.
        </p>

        {/* How it maps to your post */}
        <Section title="How this maps to what you asked for" Icon={ListChecks} accent={C.purple}>
          <div style={{ display: "grid", gap: 8 }}>
            {[
              { Icon: FormInput, t: "Gravity Forms customization", d: "The conditional step above is Gravity Forms logic. I extend it with hooks and filters (gform_ actions) for custom validation, multi step flows, and data routing." },
              { Icon: Bot, t: "AI features", d: "The generate step is an OpenAI API call in production, prompt engineered around the user's form inputs, returned into the page cleanly." },
              { Icon: Layers, t: "Elementor page building", d: "Every screen here is the kind of layout I build and style in Elementor, then extend with custom code where Elementor stops." },
              { Icon: Code2, t: "Custom JS and CSS", d: "The wizard behavior, transitions, progress bar, and adaptive fields are custom JavaScript and CSS on top of WordPress." },
              { Icon: Smartphone, t: "Responsive, high performing", d: "Resize this page, it holds together on phone, tablet, and desktop. Clean and fast is the default, not an afterthought." },
              { Icon: Figma, t: "Figma to live", d: "Give me the Figma and I build it pixel accurate, then wire the logic and AI behind it. This demo is that same process." },
            ].map((x, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 15px" }}>
                <span style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 8, background: C.purple + "1A", display: "grid", placeItems: "center" }}>
                  <x.Icon size={15} style={{ color: C.purple }} />
                </span>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{x.t}</div>
                  <p style={{ fontSize: 13, color: C.sub, margin: "3px 0 0", lineHeight: 1.55 }}>{x.d}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <div style={{ marginTop: 44, paddingTop: 22, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Benjamin Yson</div>
            <div style={{ fontSize: 12, color: C.muted }}>Full-Stack · WordPress · AI Integration · BVN</div>
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

// ── Small pieces ─────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%", background: C.bg2, color: C.ink, border: `1px solid ${C.border}`,
  borderRadius: 10, padding: "11px 13px", fontSize: 13.5, outline: "none", fontFamily: "inherit",
};
function btn(color: string): React.CSSProperties {
  return { display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 15px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700, border: `1px solid ${color}55`, background: color + "16", color };
}
function StepHead({ n, title, Icon }: { n: number; title: string; Icon?: typeof Wand2 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 18 }}>
      <span style={{ width: 30, height: 30, borderRadius: 9, background: C.purple + "1E", display: "grid", placeItems: "center", flexShrink: 0 }}>
        {Icon ? <Icon size={16} style={{ color: C.purple }} /> : <span style={{ fontSize: 13, fontWeight: 800, color: C.purple }}>{n}</span>}
      </span>
      <h2 style={{ fontSize: 19, fontWeight: 800, margin: 0 }}>{title}</h2>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: C.sub, marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  );
}
function Label({ icon: Icon, children }: { icon: typeof ListChecks; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: .5, textTransform: "uppercase", marginBottom: 9 }}>
      <Icon size={13} /> {children}
    </div>
  );
}
function Section({ title, Icon, accent, children }: { title: string; Icon: typeof ListChecks; accent: string; children: React.ReactNode }) {
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
