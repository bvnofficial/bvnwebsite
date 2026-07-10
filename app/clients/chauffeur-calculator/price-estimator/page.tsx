"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Car, Zap, MapPin, Navigation, Route,
  KeyRound, Code2, Smartphone, SlidersHorizontal, ClipboardCheck,
  Terminal, Clock, PhoneCall, CheckCircle2, Plug, Sparkles,
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
// PRICING — every value the client can edit lives in this one block.
const PRICING = {
  perMile: 4.8,
  vehicles: [
    { id: "sedan", name: "Luxury Sedan", base: 110, Icon: Car },
    { id: "suv", name: "SUV", base: 145, Icon: Car },
    { id: "esuv", name: "Electric SUV", base: 160, Icon: Zap },
  ],
  surcharges: [
    { id: "standard", label: "Standard day", pct: 0 },
    { id: "weekend", label: "Weekend", pct: 10 },
    { id: "holiday", label: "Holiday", pct: 15 },
  ],
};

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

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
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: C.amber }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 800, margin: "8px 0 6px", letterSpacing: -0.4 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 660, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// The real, working calculator
function Calculator() {
  const [vehicleId, setVehicleId] = useState("sedan");
  const [miles, setMiles] = useState("18");
  const [tolls, setTolls] = useState("0");
  const [surchargeId, setSurchargeId] = useState("standard");

  const vehicle = PRICING.vehicles.find((v) => v.id === vehicleId)!;
  const surcharge = PRICING.surcharges.find((s) => s.id === surchargeId)!;

  const milesNum = Math.max(0, parseFloat(miles) || 0);
  const tollsNum = Math.max(0, parseFloat(tolls) || 0);
  const distanceCost = milesNum * PRICING.perMile;
  const subtotal = vehicle.base + distanceCost;
  const surchargeAmt = subtotal * (surcharge.pct / 100);
  const total = subtotal + surchargeAmt + tollsNum;

  const inputStyle: React.CSSProperties = {
    width: "100%", background: C.bg, color: C.ink, border: `1px solid ${C.border}`,
    borderRadius: 10, padding: "12px 12px", fontSize: 15, outline: "none",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 700, color: C.sub, marginBottom: 7, display: "block",
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
      {/* Inputs */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: "22px 22px" }}>
        {/* Vehicle */}
        <span style={labelStyle}>Select a vehicle</span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8, marginBottom: 18 }}>
          {PRICING.vehicles.map((v) => {
            const on = v.id === vehicleId;
            return (
              <button
                key={v.id}
                onClick={() => setVehicleId(v.id)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  cursor: "pointer", textAlign: "left",
                  background: on ? C.cardHi : C.bg, border: `1px solid ${on ? C.amber : C.border}`,
                  borderRadius: 12, padding: "12px 14px", transition: "all 0.16s",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                  <v.Icon size={18} color={on ? C.amber : C.sub} />
                  <span style={{ fontSize: 14.5, fontWeight: 700, color: on ? C.ink : C.sub }}>{v.name}</span>
                </span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: on ? C.amber : C.muted }}>{money(v.base)} base</span>
              </button>
            );
          })}
        </div>

        {/* Pickup / dropoff (demo inputs) */}
        <span style={labelStyle}><MapPin size={12} style={{ verticalAlign: "-1px", marginRight: 4 }} />Pickup address</span>
        <input style={{ ...inputStyle, marginBottom: 14 }} placeholder="Google Places Autocomplete in production" defaultValue="JFK Airport, New York" />

        <span style={labelStyle}><Navigation size={12} style={{ verticalAlign: "-1px", marginRight: 4 }} />Drop-off address</span>
        <input style={{ ...inputStyle, marginBottom: 14 }} placeholder="Google Places Autocomplete in production" defaultValue="Manhattan, New York" />

        {/* Miles + tolls */}
        <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <span style={labelStyle}><Route size={12} style={{ verticalAlign: "-1px", marginRight: 4 }} />Driving miles</span>
            <input style={inputStyle} value={miles} onChange={(e) => setMiles(e.target.value)} inputMode="decimal" />
          </div>
          <div style={{ flex: 1 }}>
            <span style={labelStyle}>Tolls (optional)</span>
            <input style={inputStyle} value={tolls} onChange={(e) => setTolls(e.target.value)} inputMode="decimal" />
          </div>
        </div>

        {/* Surcharge */}
        <span style={labelStyle}>Day type</span>
        <div style={{ display: "flex", gap: 8 }}>
          {PRICING.surcharges.map((s) => {
            const on = s.id === surchargeId;
            return (
              <button
                key={s.id}
                onClick={() => setSurchargeId(s.id)}
                style={{
                  flex: 1, cursor: "pointer",
                  background: on ? C.cardHi : C.bg, border: `1px solid ${on ? C.amber : C.border}`,
                  borderRadius: 10, padding: "10px 6px", transition: "all 0.16s",
                }}
              >
                <div style={{ fontSize: 12.5, fontWeight: 700, color: on ? C.ink : C.sub }}>{s.label}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: on ? C.amber : C.muted, marginTop: 2 }}>
                  {s.pct === 0 ? "no add" : `+${s.pct}%`}
                </div>
              </button>
            );
          })}
        </div>

        <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.5, marginTop: 16, marginBottom: 0 }}>
          In your live site the pickup and drop-off fields are Google Places Autocomplete, and the driving miles are
          returned automatically by the Google Routes or Distance Matrix API. Here you can type the miles so you can
          watch your exact pricing formula run.
        </p>
      </div>

      {/* Output */}
      <div style={{ background: C.bg2, border: `1px solid ${C.amber}`, borderRadius: 18, padding: "22px 22px", display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: C.amber }}>
          Estimated price
        </div>
        <div style={{ fontSize: 46, fontWeight: 800, color: C.ink, letterSpacing: -1, margin: "6px 0 4px" }}>
          {money(total)}
        </div>
        <div style={{ fontSize: 13, color: C.sub, marginBottom: 20 }}>
          {vehicle.name} · {milesNum} miles · {surcharge.label}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
          <Row label="Base fare" value={money(vehicle.base)} />
          <Row label={`Distance (${milesNum} mi × ${money(PRICING.perMile)})`} value={money(distanceCost)} />
          {surcharge.pct > 0 && <Row label={`${surcharge.label} surcharge (+${surcharge.pct}%)`} value={money(surchargeAmt)} color={C.amber} />}
          {tollsNum > 0 && <Row label="Tolls" value={money(tollsNum)} />}
        </div>

        <div style={{ marginTop: "auto", paddingTop: 18, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>Total estimate</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: C.amber }}>{money(total)}</span>
        </div>

        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6 }}>
          <SlidersHorizontal size={13} /> Every number here is driven by one editable pricing block in the code.
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5 }}>
      <span style={{ color: C.sub }}>{label}</span>
      <span style={{ color: color || C.ink, fontWeight: 700 }}>{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// How it maps to the spec
const SPEC = [
  { Icon: MapPin, title: "Google Places Autocomplete", body: "Pickup and drop-off fields autocomplete real addresses as the customer types, so the inputs are clean and valid.", color: C.amber },
  { Icon: Route, title: "Routes / Distance Matrix API", body: "Accurate driving distance pulled straight from Google, not a straight line estimate, so the miles are real.", color: C.coral },
  { Icon: KeyRound, title: "Your API key, clearly placed", body: "Instructions on exactly where to paste your Google API key, kept in one spot so it is easy to manage and rotate.", color: C.green },
  { Icon: SlidersHorizontal, title: "Pricing in one editable place", body: "Base fares, per mile rate, and surcharges all live in a single block you can update yourself in seconds.", color: C.cyan },
  { Icon: Smartphone, title: "Fully mobile responsive", body: "Works cleanly on desktop and mobile, so a customer can get an instant quote from their phone.", color: C.blue },
  { Icon: Plug, title: "Drops into GoHighLevel", body: "Delivered as clean custom code that embeds into your GoHighLevel site or funnel, tested end to end.", color: C.purple },
];

// ─────────────────────────────────────────────────────────────
export default function ChauffeurCalculatorPriceEstimator() {
  const heroStats = useMemo(
    () => [
      { k: "Formula", v: "Base + miles + surcharge" },
      { k: "Distance", v: "Google Routes API" },
      { k: "Pricing", v: "One editable block" },
      { k: "Fits", v: "GoHighLevel" },
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
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.amber, background: "rgba(251,191,36,0.12)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.amber }}>
            <Sparkles size={15} /> Luxury chauffeur reservation price calculator
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            I did not describe your calculator.
            <span style={{ color: C.amber }}> I built it. Try it now.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 700, lineHeight: 1.6 }}>
            This is a live, working version of the reservation price calculator from your post, running your exact
            pricing: the three vehicles, the base fares, the per mile rate, tolls, and the weekend and holiday
            surcharge. Pick a vehicle, set the miles, and watch the price update instantly.
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

        <Section eyebrow="Live and working" title="Your calculator, running right now" sub="Not a mockup and not a video. This is real code doing the real math from your post. Change anything and the estimate updates instantly.">
          <Calculator />
        </Section>

        <Section eyebrow="Every requirement" title="How it meets your spec, point by point" sub="Your post lists exactly what the calculator needs. Here is how each piece is delivered in the production build on your GoHighLevel site.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {SPEC.map((s, i) => (
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

        {/* Formula callout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginTop: 28, background: "rgba(251,191,36,0.07)", border: `1px solid ${C.amber}`, borderRadius: 16, padding: "20px 22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
            <Code2 size={17} color={C.amber} />
            <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>The exact formula, in clean code</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: "0 0 12px", maxWidth: 760 }}>
            Total price equals base fare, plus driving miles times the per mile rate, plus tolls, plus the weekend or
            holiday surcharge. That is exactly what runs above, and it is organized so you can read and change it
            without touching the logic.
          </p>
          <code style={{ display: "block", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", fontSize: 12.5, color: C.green, overflowX: "auto" }}>
            total = baseFare + (miles × 4.80) + tolls + surcharge%
          </code>
        </motion.div>

        <Section eyebrow="Proof" title="Real GoHighLevel work" sub="Beyond this calculator, screenshots from a live GoHighLevel account I built and run, so you can see I work inside GHL, not just around it.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <ProofShot src="/proof/regal-01-workflow-library.png" caption="A documented workflow library inside a live GoHighLevel account." />
            <ProofShot src="/proof/regal-04-pipelines-list.png" caption="Pipelines built and running in GoHighLevel." />
            <ProofShot src="/proof/regal-02-family-workflows.png" caption="Published automations firing on their own." />
            <ProofShot src="/proof/regal-05-opportunities-kanban.png" caption="An opportunities board managing real contacts end to end." />
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
            <Terminal size={18} color={C.amber} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>You can see the work before you hire me.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 740 }}>
            Most applicants send a list of skills. I sent you a working calculator. BVN is a one person operation, so
            you deal directly with the developer building it, with clean code, clear instructions on where your Google
            API key goes, and pricing you can edit yourself. I built this page with Claude Code, and the production
            version drops straight into your GoHighLevel site, tested and responsive.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.amber, borderRadius: 999, padding: "10px 16px" }}>
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Project based</span>
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
