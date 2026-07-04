"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Mail, Megaphone, GraduationCap, PlayCircle, FileText, Music,
  Download, CheckCircle2, Circle, ChevronRight, BookOpen, Award, ShieldCheck,
  ListChecks, Sparkles, Palette, ArrowRight, FileCheck,
} from "lucide-react";

// ── Base tokens ───────────────────────────────────────────────
const C = {
  bg: "#0A1120", bg2: "#0E1830", card: "#121E3A", cardHi: "#16264A",
  border: "#22324F", ink: "#EAF1FC", sub: "#9FB1D0", muted: "#647697",
  green: "#34D399", amber: "#F5A623",
};

// ── Brands ────────────────────────────────────────────────────
type BrandId = "aaa" | "psy";
const BRANDS: Record<BrandId, { name: string; short: string; tagline: string; mark: string; accent: string; accent2: string }> = {
  aaa: { name: "Advanced Aesthetics Academy", short: "Aesthetics Academy", tagline: "CPD-accredited aesthetics training & wellness", mark: "AA", accent: "#E85D75", accent2: "#F5A623" },
  psy: { name: "PsyFortis®", short: "PsyFortis", tagline: "CPD-accredited psychological resilience programmes", mark: "PF", accent: "#2DD4BF", accent2: "#22D3EE" },
};

// ── Course data ───────────────────────────────────────────────
type LType = "video" | "pdf" | "audio";
type Lesson = { title: string; type: LType; meta: string; resources?: { name: string; type: "PDF" | "MP3" | "ZIP" }[] };
type Module = { name: string; lessons: Lesson[] };
type Course = { id: string; brand: BrandId; title: string; blurb: string; modules: Module[] };

const COURSES: Course[] = [
  {
    id: "aaa-foundation", brand: "aaa", title: "Foundation in Facial Aesthetics",
    blurb: "The accredited starting point: anatomy, safety, consultation and core injection technique.",
    modules: [
      { name: "Module 1 · Anatomy & Safety", lessons: [
        { title: "Facial Anatomy Essentials", type: "video", meta: "14:20", resources: [{ name: "Anatomy Reference Guide", type: "PDF" }] },
        { title: "Contraindications & Client Safety", type: "pdf", meta: "8 pages", resources: [{ name: "Safety Checklist", type: "PDF" }] },
        { title: "The Consultation Conversation", type: "audio", meta: "MP3 · 11:40" },
      ] },
      { name: "Module 2 · Core Technique", lessons: [
        { title: "Injection Technique Basics", type: "video", meta: "22:10", resources: [{ name: "Technique Worksheet", type: "PDF" }, { name: "Practice Log", type: "PDF" }] },
        { title: "Aftercare Protocol", type: "pdf", meta: "5 pages", resources: [{ name: "Client Aftercare Handout", type: "PDF" }] },
      ] },
    ],
  },
  {
    id: "aaa-fillers", brand: "aaa", title: "Advanced Dermal Fillers",
    blurb: "For qualified practitioners: advanced assessment, product selection and complication management.",
    modules: [
      { name: "Module 1 · Advanced Assessment", lessons: [
        { title: "Full-Face Assessment", type: "video", meta: "18:05" },
        { title: "Product Selection Guide", type: "pdf", meta: "12 pages", resources: [{ name: "Product Matrix", type: "PDF" }] },
      ] },
      { name: "Module 2 · Advanced Delivery", lessons: [
        { title: "Cannula Technique", type: "video", meta: "26:30" },
        { title: "Managing Complications", type: "audio", meta: "MP3 · 19:15", resources: [{ name: "Emergency Protocol", type: "PDF" }] },
      ] },
    ],
  },
  {
    id: "psy-resilience", brand: "psy", title: "Building Psychological Resilience",
    blurb: "The core PsyFortis programme: understanding resilience and building practical daily capacity.",
    modules: [
      { name: "Module 1 · Foundations", lessons: [
        { title: "What Resilience Really Is", type: "video", meta: "12:45" },
        { title: "The Stress Response", type: "audio", meta: "MP3 · 15:20", resources: [{ name: "Stress Response Diagram", type: "PDF" }] },
        { title: "Resilience Self-Assessment", type: "pdf", meta: "Interactive", resources: [{ name: "Self-Assessment Workbook", type: "PDF" }] },
      ] },
      { name: "Module 2 · Practical Tools", lessons: [
        { title: "Grounding Techniques", type: "video", meta: "9:50", resources: [{ name: "Grounding Audio Pack", type: "MP3" }] },
        { title: "Your Daily Resilience Plan", type: "pdf", meta: "6 pages", resources: [{ name: "Daily Plan Template", type: "PDF" }] },
      ] },
    ],
  },
  {
    id: "psy-pressure", brand: "psy", title: "Resilience for High-Pressure Roles",
    blurb: "For professionals in emotionally demanding environments: managing load, recovery and team resilience.",
    modules: [
      { name: "Module 1 · Understanding Pressure", lessons: [
        { title: "Emotional Load at Work", type: "video", meta: "16:10" },
        { title: "Burnout Warning Signs", type: "pdf", meta: "7 pages", resources: [{ name: "Warning Signs Checklist", type: "PDF" }] },
      ] },
      { name: "Module 2 · Building Capacity", lessons: [
        { title: "Recovery Routines", type: "audio", meta: "MP3 · 13:35" },
        { title: "Building Team Resilience", type: "video", meta: "20:00", resources: [{ name: "Team Resilience Toolkit", type: "ZIP" }] },
      ] },
    ],
  },
];

const TYPE_ICON: Record<LType, typeof PlayCircle> = { video: PlayCircle, pdf: FileText, audio: Music };
const lessonId = (cid: string, m: number, l: number) => `${cid}-${m}-${l}`;

// ── Component ──────────────────────────────────────────────────
export default function PsyfortisAaaCourses() {
  const [brandId, setBrandId] = useState<BrandId>("aaa");
  const [courseId, setCourseId] = useState<string | null>(null);
  const [active, setActive] = useState<{ m: number; l: number }>({ m: 0, l: 0 });
  const [done, setDone] = useState<Set<string>>(new Set());

  const brand = BRANDS[brandId];
  const A = brand.accent, A2 = brand.accent2;
  const catalog = COURSES.filter((c) => c.brand === brandId);
  const course = COURSES.find((c) => c.id === courseId) ?? null;

  const flat = useMemo(() => {
    if (!course) return [] as { m: number; l: number; id: string }[];
    const out: { m: number; l: number; id: string }[] = [];
    course.modules.forEach((mod, m) => mod.lessons.forEach((_, l) => out.push({ m, l, id: lessonId(course.id, m, l) })));
    return out;
  }, [course]);

  const total = flat.length;
  const completeCount = flat.filter((f) => done.has(f.id)).length;

  function switchBrand(b: BrandId) { setBrandId(b); setCourseId(null); }
  function openCourse(id: string) { setCourseId(id); setActive({ m: 0, l: 0 }); }
  function markCompleteNext() {
    if (!course) return;
    const id = lessonId(course.id, active.m, active.l);
    setDone((prev) => new Set(prev).add(id));
    const idx = flat.findIndex((f) => f.m === active.m && f.l === active.l);
    const nxt = flat[idx + 1];
    if (nxt) setActive({ m: nxt.m, l: nxt.l });
  }

  const activeLesson = course?.modules[active.m]?.lessons[active.l];
  const LIcon = activeLesson ? TYPE_ICON[activeLesson.type] : PlayCircle;

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
      <div style={{ maxWidth: 940, margin: "0 auto", padding: "28px 20px 90px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
          <ArrowLeft size={15} /> bvnofficial.com
        </Link>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: A, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: A, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
            BVN · Application Demo · Aesthetics Academy & PsyFortis
          </div>
          <h1 style={{ fontSize: 28, lineHeight: 1.2, margin: "10px 0 8px", fontWeight: 800 }}>
            Two brands, one platform, zero mixing
          </h1>
          <p style={{ color: C.sub, fontSize: 14.5, maxWidth: 720, margin: 0, lineHeight: 1.65 }}>
            You need nine Thinkific courses rebuilt in GoHighLevel across two separate brands that share one
            environment, with a clean learner experience and no cross contamination. So I built a sample of exactly
            that. Switch the brand below and watch the branding and courses change completely. Open a course and click
            through the real learner experience: modules, lessons, video, PDF and MP3 resources, and progress.
          </p>
        </div>

        {/* Brand switcher */}
        <div style={{ marginTop: 22, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontSize: 12, color: C.muted, fontWeight: 700, letterSpacing: .5, textTransform: "uppercase" }}>
            <Palette size={13} /> Active brand · switch to prove clean separation
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {(Object.keys(BRANDS) as BrandId[]).map((id) => {
              const b = BRANDS[id]; const on = brandId === id;
              return (
                <button key={id} onClick={() => switchBrand(id)}
                  style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 15px", borderRadius: 12, cursor: "pointer", flex: "1 1 240px",
                    border: `1px solid ${on ? b.accent : C.border}`, background: on ? b.accent + "16" : C.bg2, textAlign: "left" }}>
                  <span style={{ width: 40, height: 40, borderRadius: 11, background: `linear-gradient(135deg, ${b.accent}, ${b.accent2})`, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 14, color: "#0a0e14", flexShrink: 0 }}>{b.mark}</span>
                  <span>
                    <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: on ? C.ink : C.sub }}>{b.name}</span>
                    <span style={{ display: "block", fontSize: 11.5, color: C.muted, marginTop: 2 }}>{b.tagline}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Catalog or player */}
        <AnimatePresence mode="wait">
          {!course ? (
            <motion.div key={"cat-" + brandId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} style={{ marginTop: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ width: 30, height: 30, borderRadius: 9, background: A + "1A", display: "grid", placeItems: "center" }}>
                  <GraduationCap size={17} style={{ color: A }} />
                </span>
                <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>{brand.short} · course catalog</h2>
              </div>
              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                {catalog.map((c) => {
                  const lessons = c.modules.reduce((s, m) => s + m.lessons.length, 0);
                  return (
                    <button key={c.id} onClick={() => openCourse(c.id)}
                      style={{ textAlign: "left", cursor: "pointer", background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
                      <div style={{ height: 6, background: `linear-gradient(90deg, ${A}, ${A2})` }} />
                      <div style={{ padding: "16px 18px" }}>
                        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{c.title}</div>
                        <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.55, margin: "0 0 12px" }}>{c.blurb}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: C.muted }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Layers2 /> {c.modules.length} modules</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><BookOpen size={13} /> {lessons} lessons</span>
                          <span style={{ marginLeft: "auto", color: A, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>Open <ChevronRight size={13} /></span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div key={"course-" + course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} style={{ marginTop: 18 }}>
              {/* Course header + progress */}
              <div style={{ background: C.card, border: `1px solid ${A}44`, borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
                <button onClick={() => setCourseId(null)} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: C.sub, fontSize: 12.5, cursor: "pointer", marginBottom: 10 }}>
                  <ArrowLeft size={13} /> Back to {brand.short} catalog
                </button>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>{course.title}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1, height: 8, background: C.bg2, borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${total ? (completeCount / total) * 100 : 0}%`, height: "100%", background: `linear-gradient(90deg, ${A}, ${A2})`, borderRadius: 99, transition: "width .3s" }} />
                  </div>
                  <span style={{ fontSize: 12.5, color: C.sub, whiteSpace: "nowrap" }}>{completeCount} / {total} complete</span>
                </div>
              </div>

              <div style={{ display: "grid", gap: 14, gridTemplateColumns: "minmax(0, 260px) 1fr" }}>
                {/* Sidebar */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "14px 12px", alignSelf: "start" }}>
                  {course.modules.map((mod, m) => (
                    <div key={m} style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: .4, textTransform: "uppercase", padding: "0 8px 6px" }}>{mod.name}</div>
                      {mod.lessons.map((les, l) => {
                        const id = lessonId(course.id, m, l);
                        const on = active.m === m && active.l === l;
                        const isDone = done.has(id);
                        const Ic = TYPE_ICON[les.type];
                        return (
                          <button key={l} onClick={() => setActive({ m, l })}
                            style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", textAlign: "left", cursor: "pointer",
                              padding: "9px 8px", borderRadius: 9, border: "none", marginBottom: 2,
                              background: on ? A + "16" : "transparent" }}>
                            {isDone ? <CheckCircle2 size={15} style={{ color: A, flexShrink: 0 }} /> : <Circle size={15} style={{ color: C.muted, flexShrink: 0 }} />}
                            <span style={{ flex: 1, fontSize: 12.5, color: on ? C.ink : C.sub, fontWeight: on ? 600 : 400, lineHeight: 1.35 }}>{les.title}</span>
                            <Ic size={13} style={{ color: on ? A : C.muted, flexShrink: 0 }} />
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Lesson view */}
                {activeLesson && (
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px 20px" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: A, background: A + "16", border: `1px solid ${A}3A`, borderRadius: 8, padding: "4px 9px", textTransform: "uppercase", letterSpacing: .5, marginBottom: 12 }}>
                      <LIcon size={12} /> {activeLesson.type} · {activeLesson.meta}
                    </div>
                    <h3 style={{ fontSize: 19, fontWeight: 800, margin: "0 0 14px" }}>{activeLesson.title}</h3>

                    {/* Media placeholder */}
                    <div style={{ borderRadius: 12, border: `1px solid ${C.border}`, background: C.bg2, height: activeLesson.type === "audio" ? 76 : 180, display: "grid", placeItems: "center", marginBottom: 16, position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(500px 200px at 50% 0%, ${A}18, transparent 70%)` }} />
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 1 }}>
                        <LIcon size={activeLesson.type === "audio" ? 26 : 40} style={{ color: A }} />
                        <span style={{ fontSize: 12.5, color: C.sub }}>
                          {activeLesson.type === "video" ? "Video lesson" : activeLesson.type === "pdf" ? "PDF lesson" : "Audio lesson"} · rebuilt from Thinkific
                        </span>
                      </div>
                    </div>

                    {/* Resources */}
                    {activeLesson.resources && activeLesson.resources.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: .4, textTransform: "uppercase", marginBottom: 8 }}>Downloadable resources</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {activeLesson.resources.map((r, i) => (
                            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, color: C.ink, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 9, padding: "8px 12px" }}>
                              <Download size={13} style={{ color: A }} /> {r.name} <span style={{ fontFamily: "monospace", fontSize: 10, color: C.muted }}>{r.type}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <button onClick={markCompleteNext}
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, border: "none", cursor: "pointer",
                        background: `linear-gradient(135deg, ${A}, ${A2})`, color: "#0a0e14", fontSize: 13.5, fontWeight: 700 }}>
                      {done.has(lessonId(course.id, active.m, active.l)) ? "Completed · go to next" : "Mark complete & continue"} <ArrowRight size={15} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Learner journey test */}
        <Section title="My learner-journey test, before any course is signed off" Icon={ListChecks} accent={A}>
          <p style={{ color: C.sub, fontSize: 13.5, marginTop: -4, marginBottom: 14, lineHeight: 1.6 }}>
            You said accuracy matters more than speed and every button, download and link must be tested. Agreed.
            Nothing gets handed over until it passes this, walked through as a real learner would.
          </p>
          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
            {[
              "Every video plays and is the correct one",
              "Every PDF and MP3 downloads and opens",
              "Every button and link goes where it should",
              "Modules and lessons are in the right order",
              "Branding and formatting match the source exactly",
              "No content or assets bleed between the two brands",
              "Progress and completion track correctly",
              "Mobile and desktop both look clean",
              "Full enrol-to-finish run as a test learner",
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", background: C.card, border: `1px solid ${C.border}`, borderRadius: 11, padding: "11px 13px" }}>
                <FileCheck size={15} style={{ color: A, flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 13, color: C.ink, lineHeight: 1.45 }}>{t}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Migration process */}
        <Section title="How I migrate each course from Thinkific" Icon={ArrowRight} accent={A}>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            {[
              { n: "1", t: "Audit the source", d: "Map every module, lesson, video, PDF, MP3 and download in the Thinkific course first." },
              { n: "2", t: "Structure in GHL", d: "Rebuild the module and lesson structure cleanly inside the correct brand's environment." },
              { n: "3", t: "Upload and brand", d: "Add all assets, match the branding and formatting, keep the two brands fully separate." },
              { n: "4", t: "Test and sign off", d: "Run the full learner-journey test above, then report issues or improvements." },
            ].map((s) => (
              <div key={s.n} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 15 }}>
                <span style={{ width: 28, height: 28, borderRadius: 8, background: A + "1E", color: A, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 13, marginBottom: 9 }}>{s.n}</span>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>{s.t}</div>
                <p style={{ fontSize: 12.5, color: C.sub, margin: "4px 0 0", lineHeight: 1.5 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <div style={{ marginTop: 42, paddingTop: 22, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Benjamin Yson</div>
            <div style={{ fontSize: 12, color: C.muted }}>GoHighLevel · Course & Membership Builds · BVN</div>
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
function Layers2() {
  return <Award size={13} />;
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
