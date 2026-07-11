"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Sparkles, CalendarDays, MapPin, Users, Wallet,
  Music, ListMusic, Ban, CheckCircle2, Send, Bot, FileText, PartyPopper,
  Heart, Building2, Check,
} from "lucide-react";

// ── TCE × BVN palette (rose theme) ───────────────────────────
const C = {
  bg: "#0A1120", bg2: "#0E1830", card: "#121E3A", cardHi: "#16264A",
  border: "#22324F", ink: "#EAF1FC", sub: "#9FB1D0", muted: "#647697",
  rose: "#FB7185", coral: "#FB923C", amber: "#FBBF24", green: "#34D399",
  cyan: "#22D3EE", blue: "#3B82F6", purple: "#A78BFA",
};

type FormData = {
  name: string; email: string; phone: string;
  eventType: string; date: string; venue: string; guests: string; budget: string;
  pkg: string; genres: string[];
  ceremony: string; cocktail: string; reception: string;
  firstDance: string; parentDances: string;
  mustPlay: string; doNotPlay: string; spotify: string; notes: string;
};

const EMPTY: FormData = {
  name: "", email: "", phone: "",
  eventType: "", date: "", venue: "", guests: "", budget: "",
  pkg: "", genres: [],
  ceremony: "", cocktail: "", reception: "",
  firstDance: "", parentDances: "",
  mustPlay: "", doNotPlay: "", spotify: "", notes: "",
};

const EVENT_TYPES = ["Wedding", "Corporate event", "Gala / social", "Private celebration"];
const BUDGETS = ["Under $3k", "$3k – $5k", "$5k – $8k", "$8k – $12k", "$12k+", "Prefer to discuss"];
const PACKAGES = ["Full band (12-piece)", "Band (6–8 piece)", "Trio / small ensemble", "Solo / duo", "DJ", "Not sure yet"];
const GENRES = ["Soul", "Motown", "Jazz", "Funk", "R&B", "Top 40", "Pop", "Acoustic", "Latin", "Classical"];

const STEPS = ["Your event", "Entertainment", "Your songs", "Review"];

export default function TceBookingForm() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [d, setD] = useState<FormData>(EMPTY);

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) => setD((p) => ({ ...p, [k]: v }));
  const toggleGenre = (g: string) =>
    setD((p) => ({ ...p, genres: p.genres.includes(g) ? p.genres.filter((x) => x !== g) : [...p.genres, g] }));

  const pct = Math.round(((step + 1) / STEPS.length) * 100);

  if (done) return <SuccessScreen d={d} />;

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 90px" }}>
        {/* Nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <Link href="/clients/tce-entertainment/portals" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
            <ArrowLeft size={15} /> The 3 portals
          </Link>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.rose, background: "rgba(251,113,133,0.12)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Sample form — nothing is sent
          </span>
        </div>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: C.rose, fontSize: 12, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <Sparkles size={14} /> Troy Curtis Entertainment
          </div>
          <h1 style={{ fontSize: 30, lineHeight: 1.15, margin: "12px 0 8px", fontWeight: 800, letterSpacing: -0.5 }}>
            Tell us about your event
          </h1>
          <p style={{ color: C.sub, fontSize: 15, maxWidth: 620, margin: 0, lineHeight: 1.6 }}>
            A few quick questions and our team designs the perfect entertainment for your day. This is the client&apos;s entry
            point — in the live platform it lives in GoHighLevel and feeds everything automatically.
          </p>
        </div>

        {/* Progress */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, gap: 6 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ flex: 1, textAlign: "center", fontSize: 11.5, fontWeight: 700, color: i <= step ? C.rose : C.muted }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  {i < step ? <Check size={12} /> : <span style={{ width: 6, height: 6, borderRadius: 99, background: i === step ? C.rose : C.muted, display: "inline-block" }} />}
                  {s}
                </span>
              </div>
            ))}
          </div>
          <div style={{ height: 7, background: C.bg2, borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${C.rose}, ${C.coral})`, borderRadius: 99, transition: "width .4s ease" }} />
          </div>
        </div>

        {/* Card */}
        <div style={{ marginTop: 20, background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: "22px 20px" }}>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.22 }}>
              {step === 0 && (
                <Group title="Your event" Icon={CalendarDays} color={C.rose}>
                  <Text label="Your name(s)" value={d.name} onChange={(v) => set("name", v)} placeholder="e.g. Sarah & James" />
                  <Row>
                    <Text label="Email" value={d.email} onChange={(v) => set("email", v)} placeholder="you@email.com" />
                    <Text label="Phone" value={d.phone} onChange={(v) => set("phone", v)} placeholder="+1 …" />
                  </Row>
                  <Choice label="Event type" Icon={PartyPopper} options={EVENT_TYPES} value={d.eventType} onChange={(v) => set("eventType", v)} />
                  <Row>
                    <Text label="Event date" value={d.date} onChange={(v) => set("date", v)} placeholder="14 Feb 2027" Icon={CalendarDays} />
                    <Text label="Guest count" value={d.guests} onChange={(v) => set("guests", v)} placeholder="180" Icon={Users} />
                  </Row>
                  <Text label="Venue / location" value={d.venue} onChange={(v) => set("venue", v)} placeholder="Venue name, city" Icon={MapPin} />
                  <Choice label="Estimated budget" Icon={Wallet} options={BUDGETS} value={d.budget} onChange={(v) => set("budget", v)} />
                </Group>
              )}

              {step === 1 && (
                <Group title="Your entertainment" Icon={Music} color={C.coral}>
                  <Choice label="What are you after?" Icon={Building2} options={PACKAGES} value={d.pkg} onChange={(v) => set("pkg", v)} />
                  <div>
                    <FieldLabel Icon={Music}>Music styles (pick any)</FieldLabel>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {GENRES.map((g) => {
                        const on = d.genres.includes(g);
                        return (
                          <button key={g} type="button" onClick={() => toggleGenre(g)}
                            style={{ cursor: "pointer", fontSize: 13, fontWeight: 700, padding: "7px 13px", borderRadius: 99, border: `1px solid ${on ? C.coral : C.border}`, background: on ? C.coral + "22" : C.bg2, color: on ? C.ink : C.sub }}>
                            {on ? "✓ " : ""}{g}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <Text label="Ceremony music" value={d.ceremony} onChange={(v) => set("ceremony", v)} placeholder="Processional, vows, recessional…" />
                  <Text label="Cocktail hour vibe" value={d.cocktail} onChange={(v) => set("cocktail", v)} placeholder="e.g. jazz standards, bossa nova" />
                  <Text label="Reception vibe" value={d.reception} onChange={(v) => set("reception", v)} placeholder="e.g. Motown into Top 40 dance set" />
                </Group>
              )}

              {step === 2 && (
                <Group title="Your songs" Icon={ListMusic} color={C.purple}>
                  <Row>
                    <Text label="First dance" value={d.firstDance} onChange={(v) => set("firstDance", v)} placeholder="Song — artist" Icon={Heart} />
                    <Text label="Parent dances" value={d.parentDances} onChange={(v) => set("parentDances", v)} placeholder="Song(s)" />
                  </Row>
                  <Area label="Must-play songs" value={d.mustPlay} onChange={(v) => set("mustPlay", v)} placeholder="One per line…" color={C.green} Icon={CheckCircle2} />
                  <Area label="Do-not-play songs" value={d.doNotPlay} onChange={(v) => set("doNotPlay", v)} placeholder="One per line…" color={C.rose} Icon={Ban} />
                  <Text label="Spotify playlist link" value={d.spotify} onChange={(v) => set("spotify", v)} placeholder="https://open.spotify.com/playlist/…" Icon={ListMusic} />
                  <Area label="Anything else we should know?" value={d.notes} onChange={(v) => set("notes", v)} placeholder="Timeline notes, name pronunciations, special announcements, vendor contacts…" />
                </Group>
              )}

              {step === 3 && <Review d={d} />}
            </motion.div>
          </AnimatePresence>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 22 }}>
            <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
              style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5, fontWeight: 700, color: step === 0 ? C.muted : C.sub, background: "transparent", border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 18px", cursor: step === 0 ? "default" : "pointer", opacity: step === 0 ? 0.5 : 1 }}>
              <ArrowLeft size={15} /> Back
            </button>
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={() => setStep((s) => s + 1)}
                style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5, fontWeight: 800, color: C.bg, background: C.rose, border: "none", borderRadius: 10, padding: "11px 20px", cursor: "pointer" }}>
                Continue <ArrowRight size={15} />
              </button>
            ) : (
              <button type="button" onClick={() => setDone(true)}
                style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5, fontWeight: 800, color: C.bg, background: C.green, border: "none", borderRadius: 10, padding: "11px 20px", cursor: "pointer" }}>
                <Send size={15} /> Submit booking
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// ── Success screen ───────────────────────────────────────────
function SuccessScreen({ d }: { d: FormData }) {
  const next = [
    { Icon: FileText, t: "Your details become an event record", b: "Everything you entered lands in the platform as one event, no re-typing.", c: C.rose },
    { Icon: FileText, t: "Gig sheet + run of show generate automatically", b: "Built from your answers, ready for the band and consistent every time.", c: C.coral },
    { Icon: Bot, t: "AI matches the nearest bands to your music", b: "We rank the bands that fit your style and are closest to your venue.", c: C.amber },
    { Icon: CheckCircle2, t: "Troy's team sends your proposal", b: "You review the band and package, then approve to lock your date.", c: C.green },
  ];
  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 20px 90px", textAlign: "center" }}>
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 16 }}
          style={{ width: 74, height: 74, borderRadius: 99, background: C.green + "1F", border: `1px solid ${C.green}`, display: "grid", placeItems: "center", margin: "0 auto 20px" }}>
          <CheckCircle2 size={38} color={C.green} />
        </motion.div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px" }}>Thank you{d.name ? `, ${d.name}` : ""}!</h1>
        <p style={{ color: C.sub, fontSize: 15, lineHeight: 1.6, margin: "0 auto", maxWidth: 520 }}>
          Your event details are in. Here is exactly what happens next behind the scenes.
        </p>

        <div style={{ display: "grid", gap: 10, marginTop: 28, textAlign: "left" }}>
          {next.map((n, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.1 }}
              style={{ display: "flex", gap: 13, alignItems: "flex-start", background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${n.c}`, borderRadius: 14, padding: "14px 16px" }}>
              <span style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 10, background: n.c + "1F", display: "grid", placeItems: "center" }}>
                <n.Icon size={17} color={n.c} />
              </span>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 800 }}><span style={{ color: n.c, marginRight: 7 }}>{i + 1}.</span>{n.t}</div>
                <div style={{ fontSize: 13, color: C.sub, marginTop: 3, lineHeight: 1.55 }}>{n.b}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: 26, fontSize: 12.5, color: C.muted, lineHeight: 1.6 }}>
          This is a sample. In the live platform this form lives in GoHighLevel and triggers all of the above automatically.
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 20 }}>
          <Link href="/clients/tce-entertainment/portals" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, background: C.rose, borderRadius: 999, padding: "10px 18px", textDecoration: "none" }}>
            See the portals <ArrowRight size={14} />
          </Link>
          <Link href="/clients/tce-entertainment/milestones" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.sub, border: `1px solid ${C.border}`, borderRadius: 999, padding: "10px 18px", textDecoration: "none" }}>
            The build plan
          </Link>
        </div>
      </div>
    </main>
  );
}

// ── Review step ──────────────────────────────────────────────
function Review({ d }: { d: FormData }) {
  const rows: [string, string][] = [
    ["Name", d.name], ["Email", d.email], ["Phone", d.phone],
    ["Event type", d.eventType], ["Date", d.date], ["Venue", d.venue],
    ["Guests", d.guests], ["Budget", d.budget], ["Package", d.pkg],
    ["Music styles", d.genres.join(", ")],
    ["Ceremony", d.ceremony], ["Cocktail", d.cocktail], ["Reception", d.reception],
    ["First dance", d.firstDance], ["Parent dances", d.parentDances],
    ["Must-play", d.mustPlay], ["Do-not-play", d.doNotPlay],
    ["Spotify", d.spotify], ["Notes", d.notes],
  ];
  return (
    <Group title="Review your details" Icon={CheckCircle2} color={C.green}>
      <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
        {rows.map(([k, v], i) => (
          <div key={k} style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 12, padding: "10px 14px", borderTop: i === 0 ? "none" : `1px solid ${C.border}` }}>
            <span style={{ fontSize: 12.5, color: C.muted }}>{k}</span>
            <span style={{ fontSize: 13, color: v ? C.ink : C.muted, fontWeight: v ? 600 : 400, whiteSpace: "pre-line", wordBreak: "break-word" }}>{v || "—"}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4, lineHeight: 1.55 }}>
        Looks good? Submit and see what the platform does next.
      </div>
    </Group>
  );
}

// ── Field building blocks ────────────────────────────────────
function Group({ title, Icon, color, children }: { title: string; Icon: typeof Music; color: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
        <span style={{ width: 34, height: 34, borderRadius: 10, background: color + "1F", display: "grid", placeItems: "center" }}>
          <Icon size={17} color={color} />
        </span>
        <span style={{ fontSize: 17, fontWeight: 800 }}>{title}</span>
      </div>
      <div style={{ display: "grid", gap: 14 }}>{children}</div>
    </div>
  );
}

function FieldLabel({ Icon, children }: { Icon?: typeof Music; children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12.5, fontWeight: 700, color: C.sub, marginBottom: 6, display: "inline-flex", alignItems: "center", gap: 6 }}>
      {Icon && <Icon size={13} color={C.muted} />} {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10,
  padding: "11px 13px", color: C.ink, fontSize: 14, outline: "none", boxSizing: "border-box",
};

function Text({ label, value, onChange, placeholder, Icon }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; Icon?: typeof Music }) {
  return (
    <div>
      <FieldLabel Icon={Icon}>{label}</FieldLabel>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
    </div>
  );
}

function Area({ label, value, onChange, placeholder, color, Icon }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; color?: string; Icon?: typeof Music }) {
  return (
    <div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: color || C.sub, marginBottom: 6, display: "inline-flex", alignItems: "center", gap: 6 }}>
        {Icon && <Icon size={13} color={color || C.muted} />} {label}
      </div>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }} />
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{children}</div>;
}

function Choice({ label, Icon, options, value, onChange }: { label: string; Icon?: typeof Music; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <FieldLabel Icon={Icon}>{label}</FieldLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map((o) => {
          const on = value === o;
          return (
            <button key={o} type="button" onClick={() => onChange(o)}
              style={{ cursor: "pointer", fontSize: 13, fontWeight: 700, padding: "8px 14px", borderRadius: 10, border: `1px solid ${on ? C.rose : C.border}`, background: on ? C.rose + "22" : C.bg2, color: on ? C.ink : C.sub }}>
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
