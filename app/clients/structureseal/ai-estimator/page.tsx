"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Mail, Megaphone, Droplets, Calculator, FileText, LayoutDashboard,
  Building2, CheckCircle2, ChevronRight, Sparkles, TrendingUp, Layers, Send,
  Ruler, ClipboardList,
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  bg: "#08111C", bg2: "#0E1B2C", card: "#122236", cardHi: "#162B44",
  border: "#213850", ink: "#EAF4FF", sub: "#9EBAD3", muted: "#5E7893",
  teal: "#2DD4BF", cyan: "#22D3EE", blue: "#3B82F6", green: "#34D399",
  amber: "#FBBF24", violet: "#A78BFA", slate: "#94A3B8",
};

// ── Job types (AUD unit costs per m²) ─────────────────────────
type JobType = {
  id: string; label: string; std: string; unit: { prep: number; membrane: number; labour: number; detail: number }; setup: number; disposal: number; scope: string[];
};
const types: JobType[] = [
  { id: "bathroom", label: "Bathroom / Wet Area", std: "AS 3740",
    unit: { prep: 20, membrane: 42, labour: 65, detail: 24 }, setup: 220, disposal: 120,
    scope: ["Prepare the wet area substrate and floor waste", "Apply waterproofing membrane to floors and walls to AS 3740", "Detail penetrations, junctions, and hobs", "Leave the area ready for tiling"] },
  { id: "balcony", label: "Balcony / Deck", std: "AS 4654",
    unit: { prep: 22, membrane: 48, labour: 58, detail: 20 }, setup: 280, disposal: 180,
    scope: ["Remove existing coatings and prepare the substrate", "Install external waterproofing membrane to AS 4654", "Detail all corners, drains, and penetrations", "Prime and finish ready for tiling or topping"] },
  { id: "roof", label: "Roof / Podium", std: "AS 4654",
    unit: { prep: 26, membrane: 62, labour: 60, detail: 22 }, setup: 350, disposal: 260,
    scope: ["Prepare and clean the roof or podium surface", "Install the waterproofing membrane system", "Detail upstands, drains, and penetrations", "Provide a UV stable or trafficable finish as specified"] },
  { id: "tanking", label: "Basement Tanking", std: "remedial",
    unit: { prep: 30, membrane: 75, labour: 72, detail: 26 }, setup: 420, disposal: 300,
    scope: ["Prepare the basement walls and floor", "Apply the tanking waterproofing system", "Detail cove joints and penetrations", "Provide drainage recommendations"] },
  { id: "remedial", label: "Remedial / Leak Repair", std: "remedial",
    unit: { prep: 35, membrane: 55, labour: 80, detail: 34 }, setup: 300, disposal: 200,
    scope: ["Investigate and identify the leak source", "Remove the failed waterproofing and prepare the area", "Reinstate the membrane and all detailing", "Water test and confirm the repair"] },
];
const complexity = [
  { id: "standard", label: "Standard", mult: 1.0 },
  { id: "complex", label: "Complex access", mult: 1.35 },
  { id: "severe", label: "Heavy remedial", mult: 1.7 },
];
const MARGIN = 0.35;
const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-AU");

// ── Pipeline sample ───────────────────────────────────────────
const pipeline = [
  { stage: "New lead", color: C.cyan, jobs: [{ n: "Manly roof podium remedial", v: "Est. pending" }] },
  { stage: "Quoted", color: C.amber, jobs: [{ n: "Bondi apartment balcony", v: "$6,400" }, { n: "Parramatta basement tanking", v: "$24,800" }] },
  { stage: "Won", color: C.green, jobs: [{ n: "Surry Hills bathrooms x3", v: "$11,200" }, { n: "Chatswood office wet areas", v: "$18,500" }] },
];

export default function AiEstimator() {
  const [view, setView] = useState<"estimate" | "quote" | "pipeline">("estimate");
  const [typeId, setTypeId] = useState("bathroom");
  const [area, setArea] = useState(12);
  const [cxId, setCxId] = useState("standard");
  const [generated, setGenerated] = useState(false);

  const type = types.find((t) => t.id === typeId)!;
  const cx = complexity.find((c) => c.id === cxId)!;

  const est = useMemo(() => {
    const a = Math.max(0, area || 0);
    const m = cx.mult;
    const prep = type.unit.prep * a * m;
    const membrane = type.unit.membrane * a * m;
    const labour = type.unit.labour * a * m;
    const detail = type.unit.detail * a * m;
    const lines = [
      { name: "Site setup & access", qty: "job", amount: type.setup },
      { name: "Surface preparation", qty: `${a} m²`, amount: prep },
      { name: "Waterproofing membrane (materials)", qty: `${a} m²`, amount: membrane },
      { name: "Application labour", qty: `${a} m²`, amount: labour },
      { name: "Detailing, corners & penetrations", qty: `${a} m²`, amount: detail },
      { name: "Waste disposal", qty: "job", amount: type.disposal },
    ];
    const cost = lines.reduce((s, l) => s + l.amount, 0);
    const quoteEx = cost * (1 + MARGIN);
    const gst = quoteEx * 0.1;
    return { lines, cost, quoteEx, gst, total: quoteEx + gst };
  }, [type, area, cx]);

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 90px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
          <ArrowLeft size={15} /> bvnofficial.com
        </Link>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.teal, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: C.teal, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
            BVN · Application Demo · StructureSeal AI Estimator
          </div>
          <h1 style={{ fontSize: 28, lineHeight: 1.2, margin: "10px 0 8px", fontWeight: 800 }}>
            From job details to a professional waterproofing quote in seconds
          </h1>
          <p style={{ color: C.sub, fontSize: 14.5, maxWidth: 810, margin: 0, lineHeight: 1.65 }}>
            You want a system that estimates jobs faster, produces professional quotes, and manages the pipeline. So I
            built a working slice of exactly that for waterproofing. Enter a job and generate a real, itemised estimate,
            see it turned into a client proposal, then view the CRM pipeline and sales dashboard. The numbers below are
            calculated live, and every rate is configurable to your real pricing.
          </p>
        </div>

        {/* View switcher */}
        <div style={{ marginTop: 22, display: "flex", gap: 6, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 4, width: "fit-content", flexWrap: "wrap" }}>
          {([
            { id: "estimate", label: "Estimate a Job", Icon: Calculator },
            { id: "quote", label: "The Quote", Icon: FileText },
            { id: "pipeline", label: "Pipeline & Insights", Icon: LayoutDashboard },
          ] as const).map((v) => (
            <button key={v.id} onClick={() => setView(v.id)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: 9, border: "none", cursor: "pointer",
                background: view === v.id ? C.teal : "transparent", color: view === v.id ? "#04231E" : C.sub, fontSize: 12.5, fontWeight: 700 }}>
              <v.Icon size={14} /> {v.label}
            </button>
          ))}
        </div>

        <div style={{ position: "relative" }}>
          <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} style={{ marginTop: 18 }}>

            {/* ESTIMATE */}
            {view === "estimate" && (
              <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
                {/* Form */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Job details</div>

                  <div style={{ fontSize: 11, fontWeight: 700, color: C.sub, textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>Type of work</div>
                  <div style={{ display: "grid", gap: 7, marginBottom: 15 }}>
                    {types.map((t) => (
                      <button key={t.id} onClick={() => setTypeId(t.id)}
                        style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 12px", borderRadius: 10, cursor: "pointer", textAlign: "left",
                          background: typeId === t.id ? C.teal + "1E" : C.bg2, border: `1px solid ${typeId === t.id ? C.teal : C.border}`, color: C.ink }}>
                        <Droplets size={15} style={{ color: C.teal, flexShrink: 0 }} />
                        <span style={{ fontSize: 12.5, fontWeight: 600, flex: 1 }}>{t.label}</span>
                        <span style={{ fontSize: 10, color: C.muted, fontFamily: "ui-monospace, monospace" }}>{t.std}</span>
                      </button>
                    ))}
                  </div>

                  <div style={{ fontSize: 11, fontWeight: 700, color: C.sub, textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>Area (m²)</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 15 }}>
                    <Ruler size={16} style={{ color: C.muted }} />
                    <input type="number" value={area} min={0}
                      onChange={(e) => { setArea(parseInt(e.target.value) || 0); }}
                      style={{ flex: 1, boxSizing: "border-box", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 13px", color: C.ink, fontSize: 14, outline: "none" }} />
                  </div>

                  <div style={{ fontSize: 11, fontWeight: 700, color: C.sub, textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>Complexity</div>
                  <div style={{ display: "flex", gap: 7, marginBottom: 16, flexWrap: "wrap" }}>
                    {complexity.map((c) => (
                      <button key={c.id} onClick={() => setCxId(c.id)}
                        style={{ flex: "1 1 90px", padding: "9px 10px", borderRadius: 9, cursor: "pointer", fontSize: 12, fontWeight: 700,
                          background: cxId === c.id ? C.teal : C.bg2, color: cxId === c.id ? "#04231E" : C.sub, border: `1px solid ${cxId === c.id ? C.teal : C.border}` }}>
                        {c.label}
                      </button>
                    ))}
                  </div>

                  <button onClick={() => setGenerated(true)}
                    style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 15px", borderRadius: 11, border: "none", cursor: "pointer",
                      background: C.teal, color: "#04231E", fontSize: 13.5, fontWeight: 800 }}>
                    <Sparkles size={15} /> {generated ? "Recalculate estimate" : "Generate estimate"}
                  </button>
                </div>

                {/* Result */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px" }}>
                  {!generated ? (
                    <div style={{ height: "100%", display: "grid", placeItems: "center", textAlign: "center", padding: "24px 8px" }}>
                      <div>
                        <Calculator size={30} style={{ color: C.muted, marginBottom: 10 }} />
                        <div style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.6, maxWidth: 240 }}>
                          Set the job details and press <b style={{ color: C.ink }}>Generate estimate</b> for a live itemised cost and quote.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 3 }}>{type.label}, {area} m², {cx.label}</div>
                      <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 13 }}>Itemised estimate, generated live</div>
                      <div style={{ display: "grid", gap: 5, marginBottom: 12 }}>
                        {est.lines.map((l, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 12.5, padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
                            <span style={{ color: C.sub }}>{l.name} <span style={{ color: C.muted, fontSize: 11 }}>· {l.qty}</span></span>
                            <span style={{ color: C.ink, fontWeight: 600, fontFamily: "ui-monospace, monospace" }}>{fmt(l.amount)}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "grid", gap: 5, fontSize: 12.5, marginBottom: 12 }}>
                        <Row k="Cost subtotal" v={fmt(est.cost)} muted />
                        <Row k={`Margin (${Math.round(MARGIN * 100)}%)`} v={fmt(est.quoteEx - est.cost)} muted />
                        <Row k="Quote (ex GST)" v={fmt(est.quoteEx)} />
                        <Row k="GST (10%)" v={fmt(est.gst)} muted />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.teal + "16", border: `1px solid ${C.teal}44`, borderRadius: 12, padding: "13px 15px" }}>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: C.teal }}>Recommended quote (inc GST)</span>
                        <span style={{ fontSize: 20, fontWeight: 800, color: C.teal, fontFamily: "ui-monospace, monospace" }}>{fmt(est.total)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* QUOTE */}
            {view === "quote" && (
              <div style={{ background: "#0B1622", border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
                <div style={{ background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`, padding: "18px 20px", color: "#04231E" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}><Building2 size={18} /> StructureSeal</div>
                      <div style={{ fontSize: 12, fontWeight: 600, opacity: .85, marginTop: 2 }}>Waterproofing & Remedial Proposal</div>
                    </div>
                    <div style={{ textAlign: "right", fontSize: 11.5, fontWeight: 600 }}>
                      <div>Quote #SS-2041</div>
                      <div style={{ opacity: .8 }}>Valid 30 days</div>
                    </div>
                  </div>
                </div>
                <div style={{ padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 16, fontSize: 12.5 }}>
                    <div><span style={{ color: C.muted }}>Prepared for</span><div style={{ color: C.ink, fontWeight: 700 }}>Prospective Client</div></div>
                    <div><span style={{ color: C.muted }}>Job</span><div style={{ color: C.ink, fontWeight: 700 }}>{type.label} · {area} m² · {cx.label}</div></div>
                  </div>

                  <div style={{ fontSize: 11, fontWeight: 700, color: C.teal, textTransform: "uppercase", letterSpacing: .5, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><ClipboardList size={13} /> Scope of work</div>
                  <div style={{ display: "grid", gap: 6, marginBottom: 16 }}>
                    {type.scope.map((s, i) => (
                      <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 12.5, color: C.sub }}>
                        <CheckCircle2 size={14} style={{ color: C.teal, flexShrink: 0, marginTop: 2 }} /> {s}
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: 11, fontWeight: 700, color: C.teal, textTransform: "uppercase", letterSpacing: .5, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><Layers size={13} /> Investment</div>
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 15px", marginBottom: 14 }}>
                    <Row k="Total (ex GST)" v={fmt(est.quoteEx)} muted />
                    <Row k="GST (10%)" v={fmt(est.gst)} muted />
                    <div style={{ height: 1, background: C.border, margin: "8px 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 14, fontWeight: 800 }}>Total (inc GST)</span>
                      <span style={{ fontSize: 20, fontWeight: 800, color: C.teal, fontFamily: "ui-monospace, monospace" }}>{fmt(est.total)}</span>
                    </div>
                  </div>

                  <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.6, marginBottom: 14 }}>
                    Terms: 10% deposit to schedule, balance on completion. Workmanship warranty applies. Membrane systems installed to the relevant Australian Standard. This proposal was drafted automatically from the estimate and is ready to send.
                  </div>

                  <button style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 15px", borderRadius: 10, border: "none", cursor: "pointer", background: C.teal, color: "#04231E", fontSize: 12.5, fontWeight: 800 }}>
                    <Send size={14} /> Send to client
                  </button>
                  <span style={{ fontSize: 11, color: C.muted, marginLeft: 10 }}>Would also save to the CRM and start the follow up sequence.</span>
                </div>
              </div>
            )}

            {/* PIPELINE */}
            {view === "pipeline" && (
              <div>
                <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", marginBottom: 16 }}>
                  {[
                    { k: "Open quotes", v: "$31.2K", c: C.amber },
                    { k: "Won this month", v: "$29.7K", c: C.green },
                    { k: "Win rate", v: "48%", c: C.teal },
                    { k: "Avg job value", v: "$12.4K", c: C.blue },
                  ].map((m, i) => (
                    <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 14px" }}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .4 }}>{m.k}</div>
                      <div style={{ fontSize: 21, fontWeight: 800, color: m.c, marginTop: 5 }}>{m.v}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginBottom: 14 }}>
                  {pipeline.map((s) => (
                    <div key={s.stage} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 13, padding: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 800 }}>
                          <span style={{ width: 8, height: 8, borderRadius: 99, background: s.color }} /> {s.stage}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, background: C.card, borderRadius: 6, padding: "2px 8px" }}>{s.jobs.length}</span>
                      </div>
                      <div style={{ display: "grid", gap: 8 }}>
                        {s.jobs.map((j, i) => (
                          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px" }}>
                            <div style={{ fontSize: 12.5, fontWeight: 600 }}>{j.n}</div>
                            <div style={{ fontSize: 11.5, color: s.color, fontWeight: 700, marginTop: 3, fontFamily: "ui-monospace, monospace" }}>{j.v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 11, alignItems: "flex-start", background: C.violet + "10", border: `1px solid ${C.violet}33`, borderRadius: 12, padding: "13px 15px" }}>
                  <TrendingUp size={16} style={{ color: C.violet, flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.violet }}>AI pricing insight</div>
                    <p style={{ fontSize: 12.5, color: C.sub, margin: "3px 0 0", lineHeight: 1.55 }}>
                      Quotes sent within 24 hours are converting noticeably better than slower ones, and heavy remedial jobs carry the healthiest margins. The system flags where to follow up and where pricing has room to move, so estimating gets sharper over time.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 42, paddingTop: 22, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Benjamin Yson</div>
            <div style={{ fontSize: 12, color: C.muted }}>AI Tools · Estimating · CRM · Automation · BVN</div>
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

function Row({ k, v, muted }: { k: string; v: string; muted?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
      <span style={{ fontSize: 12.5, color: muted ? C.muted : C.sub }}>{k}</span>
      <span style={{ fontSize: 12.5, color: muted ? C.sub : C.ink, fontWeight: 700, fontFamily: "ui-monospace, monospace" }}>{v}</span>
    </div>
  );
}
