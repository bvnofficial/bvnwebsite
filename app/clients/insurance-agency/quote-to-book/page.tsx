"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Mail, Megaphone, ShieldCheck, Car, Home, Truck, HeartPulse,
  FileText, CalendarCheck, MessageSquare, BarChart3, CheckCircle2,
  ChevronRight, X, Send, Phone, Database, Zap, GitBranch,
  UserPlus, Target,
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  bg: "#070E1C", bg2: "#0C1730", card: "#0F1E3D", cardHi: "#13264C",
  border: "#22345C", ink: "#EAF1FF", sub: "#9FB4DB", muted: "#5E739C",
  blue: "#3B82F6", sky: "#38BDF8", green: "#34D399", amber: "#FBBF24",
  violet: "#A78BFA", coral: "#FB7185", teal: "#2DD4BF",
};

// ── Insurance lines ───────────────────────────────────────────
type Line = { id: string; label: string; Icon: typeof Car; est: string; color: string };
const lines: Line[] = [
  { id: "auto", label: "Auto", Icon: Car, est: "$92 to $140 / mo", color: C.sky },
  { id: "home", label: "Home", Icon: Home, est: "$110 to $185 / mo", color: C.green },
  { id: "truck", label: "Commercial Trucking", Icon: Truck, est: "$680 to $1,150 / mo", color: C.amber },
  { id: "life", label: "Life", Icon: HeartPulse, est: "$34 to $70 / mo", color: C.coral },
];

const slots = ["Tomorrow 9:30 AM", "Tomorrow 1:00 PM", "Thu 11:15 AM"];

// ── What the system fires after a quote request ───────────────
type Fire = { Icon: typeof FileText; t: string; d: string; color: string };
const sequence: Fire[] = [
  { Icon: UserPlus, t: "Lead captured in the CRM", d: "Name, line, and contact land in GoHighLevel, tagged and time stamped, the moment the form is sent.", color: C.blue },
  { Icon: FileText, t: "Instant quote estimate", d: "An estimate range is returned on the page right away, so the lead never leaves empty handed.", color: C.sky },
  { Icon: CalendarCheck, t: "Appointment offered", d: "Open times from the calendar are shown so the lead can book a call with an agent in one tap.", color: C.green },
  { Icon: MessageSquare, t: "SMS and email follow up", d: "A timed sequence goes out automatically, with reminders and a nudge if they do not book.", color: C.violet },
  { Icon: BarChart3, t: "Tracked to conversion", d: "The lead, the appointment, and the sale are all counted so you can see what every funnel is worth.", color: C.amber },
];

// ── Sample pipeline ───────────────────────────────────────────
type Status = "New" | "Quoted" | "Booked" | "Follow up";
const statusColor: Record<Status, string> = {
  New: C.sky, Quoted: C.amber, Booked: C.green, "Follow up": C.violet,
};
type Lead = { name: string; line: string; status: Status; premium: string; source: string; note: string };
const pipeline: Lead[] = [
  { name: "Dwayne P.", line: "Commercial Trucking", status: "Booked", premium: "$920 / mo", source: "Google ad", note: "5 truck fleet, booked Thu 11:15 for a full policy review." },
  { name: "Maria G.", line: "Auto", status: "Quoted", premium: "$118 / mo", source: "Landing page", note: "Quote sent, SMS reminder scheduled for this afternoon." },
  { name: "The Ruiz Family", line: "Home", status: "Follow up", premium: "$150 / mo", source: "Facebook ad", note: "Opened the email twice, follow up call queued for tomorrow." },
  { name: "Andre B.", line: "Life", status: "New", premium: "Estimating", source: "Referral", note: "Just came in, first SMS goes out in the first minute." },
  { name: "Coastal Haulers", line: "Commercial Trucking", status: "Booked", premium: "$1,040 / mo", source: "Google ad", note: "12 vehicles, booked a fleet quote call for tomorrow 1:00." },
];

export default function QuoteToBook() {
  const [view, setView] = useState<"quote" | "pipeline" | "wiring">("quote");

  // quote funnel state
  const [line, setLine] = useState<string>("truck");
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const chosen = lines.find((l) => l.id === line)!;

  // pipeline modal
  const [openName, setOpenName] = useState<string | null>(null);
  const open = pipeline.find((p) => p.name === openName) ?? null;

  const kpis = useMemo(() => ({
    leads: pipeline.length,
    booked: pipeline.filter((p) => p.status === "Booked").length,
    speed: "< 1 min",
    tracked: "100%",
  }), []);

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 90px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
          <ArrowLeft size={15} /> bvnofficial.com
        </Link>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.sky, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: C.sky, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
            BVN · Application Demo · Insurance Agency
          </div>
          <h1 style={{ fontSize: 28, lineHeight: 1.2, margin: "10px 0 8px", fontWeight: 800 }}>
            The insurance lead system, from quote request to booked appointment
          </h1>
          <p style={{ color: C.sub, fontSize: 14.5, maxWidth: 800, margin: 0, lineHeight: 1.65 }}>
            Your first project is an insurance website that captures quotes, connects to a CRM, books appointments,
            and follows up on its own. So I built a working piece of exactly that. Request a quote below and watch the
            system capture the lead, estimate it, offer a time, and fire the follow up, then open the pipeline and the
            wiring. Commercial trucking is one of the lines, since you already run the trucks.
          </p>
        </div>

        {/* View switcher */}
        <div style={{ marginTop: 22, display: "flex", gap: 6, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 4, width: "fit-content", flexWrap: "wrap" }}>
          {([
            { id: "quote", label: "Request a Quote", Icon: ShieldCheck },
            { id: "pipeline", label: "Lead Pipeline", Icon: Target },
            { id: "wiring", label: "How It Is Wired", Icon: GitBranch },
          ] as const).map((v) => (
            <button key={v.id} onClick={() => setView(v.id)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: 9, border: "none", cursor: "pointer",
                background: view === v.id ? C.blue : "transparent", color: view === v.id ? "#04102B" : C.sub, fontSize: 12.5, fontWeight: 700 }}>
              <v.Icon size={14} /> {v.label}
            </button>
          ))}
        </div>

        <div style={{ position: "relative" }}>
          <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} style={{ marginTop: 18 }}>

            {/* QUOTE FUNNEL */}
            {view === "quote" && (
              <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
                {/* The form */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px 18px 20px" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 3 }}>Request a free quote</div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 15 }}>The same form a visitor fills on your site.</div>

                  <div style={{ fontSize: 11, fontWeight: 700, color: C.sub, textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>What do you need covered?</div>
                  <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr", marginBottom: 15 }}>
                    {lines.map((l) => (
                      <button key={l.id} onClick={() => { setLine(l.id); setSent(false); setPicked(null); }}
                        style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 12px", borderRadius: 11, cursor: "pointer", textAlign: "left",
                          background: line === l.id ? l.color + "1E" : C.bg2, border: `1px solid ${line === l.id ? l.color : C.border}`, color: C.ink }}>
                        <l.Icon size={16} style={{ color: l.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 12.5, fontWeight: 600 }}>{l.label}</span>
                      </button>
                    ))}
                  </div>

                  <div style={{ fontSize: 11, fontWeight: 700, color: C.sub, textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>Your name</div>
                  <input value={name} onChange={(e) => { setName(e.target.value); setSent(false); }} placeholder="e.g. Jordan Miller"
                    style={{ width: "100%", boxSizing: "border-box", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 13px", color: C.ink, fontSize: 13.5, outline: "none", marginBottom: 14 }} />

                  <button onClick={() => setSent(true)}
                    style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 15px", borderRadius: 11, border: "none", cursor: "pointer",
                      background: C.blue, color: "#04102B", fontSize: 13.5, fontWeight: 800 }}>
                    <Send size={15} /> Get my quote
                  </button>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 9, textAlign: "center" }}>Nothing real is sent, this is a demo of the flow.</div>
                </div>

                {/* What fires */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px" }}>
                  {!sent ? (
                    <div style={{ height: "100%", display: "grid", placeItems: "center", textAlign: "center", padding: "24px 8px" }}>
                      <div>
                        <ShieldCheck size={30} style={{ color: C.muted, marginBottom: 10 }} />
                        <div style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.6, maxWidth: 240 }}>
                          Pick a line, add a name, and press <b style={{ color: C.ink }}>Get my quote</b> to watch the system go to work.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: "flex", gap: 9, alignItems: "center", background: chosen.color + "14", border: `1px solid ${chosen.color}44`, borderRadius: 11, padding: "11px 13px", marginBottom: 14 }}>
                        <chosen.Icon size={17} style={{ color: chosen.color }} />
                        <div style={{ fontSize: 13, color: C.ink, lineHeight: 1.4 }}>
                          <b>{name.trim() || "New lead"}</b> requested a <b>{chosen.label}</b> quote. Estimated <b style={{ color: chosen.color }}>{chosen.est}</b>.
                        </div>
                      </div>

                      <div style={{ display: "grid", gap: 8 }}>
                        {sequence.map((s, i) => (
                          <div key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                            <span style={{ width: 30, height: 30, borderRadius: 8, background: s.color + "1E", display: "grid", placeItems: "center", flexShrink: 0 }}>
                              <s.Icon size={15} style={{ color: s.color }} />
                            </span>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                <span style={{ fontSize: 13, fontWeight: 700 }}>{s.t}</span>
                                <CheckCircle2 size={13} style={{ color: C.green }} />
                              </div>
                              <p style={{ fontSize: 12, color: C.sub, margin: "2px 0 0", lineHeight: 1.5 }}>{s.d}</p>

                              {/* appointment picker on the 3rd step */}
                              {i === 2 && (
                                <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 8 }}>
                                  {slots.map((slot) => (
                                    <button key={slot} onClick={() => setPicked(slot)}
                                      style={{ fontSize: 11.5, fontWeight: 700, padding: "6px 11px", borderRadius: 8, cursor: "pointer",
                                        background: picked === slot ? C.green : C.bg2, color: picked === slot ? "#04150E" : C.sub,
                                        border: `1px solid ${picked === slot ? C.green : C.border}` }}>
                                      {picked === slot ? "Booked · " : ""}{slot}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {picked && (
                        <div style={{ display: "flex", gap: 9, alignItems: "center", background: C.green + "14", border: `1px solid ${C.green}44`, borderRadius: 11, padding: "11px 13px", marginTop: 12 }}>
                          <CalendarCheck size={16} style={{ color: C.green }} />
                          <span style={{ fontSize: 12.5, color: C.ink }}><b>{name.trim() || "The lead"}</b> is booked for <b>{picked}</b>. Confirmation and reminders are on the way.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PIPELINE */}
            {view === "pipeline" && (
              <div>
                <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", marginBottom: 16 }}>
                  {[
                    { k: "Live leads", v: kpis.leads, c: C.blue },
                    { k: "Booked", v: kpis.booked, c: C.green },
                    { k: "Speed to lead", v: kpis.speed, c: C.sky },
                    { k: "Leads tracked", v: kpis.tracked, c: C.amber },
                  ].map((m, i) => (
                    <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 14px" }}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .4 }}>{m.k}</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: m.c, marginTop: 5 }}>{m.v}</div>
                    </div>
                  ))}
                </div>

                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.3fr 1fr 1fr 24px", gap: 10, padding: "11px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: .5 }}>
                    <span>Lead</span><span>Line</span><span>Status</span><span>Premium</span><span />
                  </div>
                  {pipeline.map((p, i) => (
                    <button key={p.name} onClick={() => setOpenName(p.name)}
                      style={{ display: "grid", gridTemplateColumns: "1.5fr 1.3fr 1fr 1fr 24px", gap: 10, alignItems: "center", width: "100%", textAlign: "left", cursor: "pointer",
                        background: "transparent", border: "none", padding: "12px 16px", borderTop: i ? `1px solid ${C.border}` : "none" }}>
                      <span>
                        <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink, display: "block" }}>{p.name}</span>
                        <span style={{ fontSize: 11, color: C.muted }}>{p.source}</span>
                      </span>
                      <span style={{ fontSize: 12, color: C.sub }}>{p.line}</span>
                      <span>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: statusColor[p.status], background: statusColor[p.status] + "18", border: `1px solid ${statusColor[p.status]}3A`, borderRadius: 6, padding: "3px 9px" }}>{p.status}</span>
                      </span>
                      <span style={{ fontSize: 12, color: C.sub }}>{p.premium}</span>
                      <ChevronRight size={15} style={{ color: C.muted }} />
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: C.muted, marginTop: 10 }}>Click any lead to see the source, the premium, and the next automated step.</p>
              </div>
            )}

            {/* WIRING */}
            {view === "wiring" && (
              <div>
                <p style={{ color: C.sub, fontSize: 13.5, marginBottom: 16, lineHeight: 1.6 }}>
                  The website is just the front door. The value is the chain behind it that turns a quote request into a
                  booked, tracked, followed up lead without anyone lifting a finger. Here is how I would wire it.
                </p>
                <div style={{ display: "flex", alignItems: "stretch", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
                  {[
                    { Icon: FileText, t: "Quote + capture", d: "WordPress or GHL site with quote and lead forms and insurance landing pages", color: C.sky },
                    { Icon: Database, t: "CRM", d: "GoHighLevel or HubSpot, every lead tagged, timed, and never lost", color: C.blue },
                    { Icon: CalendarCheck, t: "Book + follow up", d: "Calendar booking plus SMS and email sequences and abandoned quote nudges", color: C.green },
                    { Icon: BarChart3, t: "Analytics", d: "Leads, appointments, and conversions tracked so you see what works", color: C.amber },
                  ].map((s, i, arr) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, flex: "1 1 180px" }}>
                      <div style={{ flex: 1, background: C.card, border: `1px solid ${s.color}44`, borderRadius: 12, padding: "12px 14px" }}>
                        <span style={{ width: 28, height: 28, borderRadius: 8, background: s.color + "1E", display: "grid", placeItems: "center", marginBottom: 8 }}>
                          <s.Icon size={15} style={{ color: s.color }} />
                        </span>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{s.t}</div>
                        <div style={{ fontSize: 11.5, color: C.sub, marginTop: 2, lineHeight: 1.45 }}>{s.d}</div>
                      </div>
                      {i < arr.length - 1 && <ChevronRight size={16} style={{ color: C.muted, flexShrink: 0 }} />}
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gap: 8 }}>
                  {[
                    { Icon: ShieldCheck, t: "Insurance agency site + funnel", d: "Modern, mobile first site, quote and lead forms, appointment scheduling, and dedicated landing pages per insurance line." },
                    { Icon: Zap, t: "One person, one connected stack", d: "GoHighLevel, WordPress, Stripe, and the automations all wired by me, so the three businesses run on systems that talk to each other." },
                    { Icon: HeartPulse, t: "Course site + membership too", d: "The same engine sells your transportation courses: landing pages, Stripe checkout, a student area, and abandoned checkout follow ups." },
                    { Icon: Phone, t: "Built and maintained by me", d: "Not an agency. I build it, document it, and maintain it, and I can take on the admin and reporting side when the build work is quiet." },
                  ].map((x, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 15px" }}>
                      <span style={{ width: 30, height: 30, borderRadius: 8, background: C.blue + "1A", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <x.Icon size={15} style={{ color: C.sky }} />
                      </span>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 700 }}>{x.t}</div>
                        <p style={{ fontSize: 12.5, color: C.sub, margin: "3px 0 0", lineHeight: 1.5 }}>{x.d}</p>
                      </div>
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
            <div style={{ fontSize: 12, color: C.muted }}>Websites · Funnels · GoHighLevel · Automation · BVN</div>
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

      {/* Lead detail modal */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpenName(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(3,8,20,0.74)", display: "grid", placeItems: "center", padding: 20, zIndex: 50 }}>
            <motion.div initial={{ scale: 0.94, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 12 }} onClick={(e) => e.stopPropagation()}
              style={{ width: "100%", maxWidth: 440, background: C.card, border: `1px solid ${C.blue}55`, borderRadius: 18, overflow: "hidden" }}>
              <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>{open.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{open.line} &middot; {open.source}</div>
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: statusColor[open.status], background: statusColor[open.status] + "18", border: `1px solid ${statusColor[open.status]}3A`, borderRadius: 6, padding: "3px 9px" }}>{open.status}</span>
                <button onClick={() => setOpenName(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.muted }}><X size={18} /></button>
              </div>
              <div style={{ padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 13px", marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: C.muted }}>Estimated premium</span>
                  <span style={{ fontSize: 13, color: C.ink, fontWeight: 700 }}>{open.premium}</span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: .5, textTransform: "uppercase", marginBottom: 7 }}>Next automated step</div>
                <div style={{ display: "flex", gap: 9, alignItems: "flex-start", background: C.violet + "10", border: `1px solid ${C.violet}33`, borderRadius: 10, padding: "11px 13px" }}>
                  <MessageSquare size={15} style={{ color: C.violet, flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.55 }}>{open.note}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
