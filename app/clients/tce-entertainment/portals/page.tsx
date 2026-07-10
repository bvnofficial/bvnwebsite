"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, UserRound, Music, LayoutDashboard, Sparkles,
  MapPin, CalendarDays, CalendarCheck, CalendarClock, Bot, Star,
  CircleCheck, CircleDashed, Wallet, FileText, Send, Tag, Guitar,
  Mic2, Users, ClipboardList, ListMusic, FileSignature, Ban, CheckCircle2,
  Clock, Car, Shirt, Phone, FolderOpen, HandCoins, Handshake,
} from "lucide-react";

// ── TCE × BVN palette (rose theme) ───────────────────────────
const C = {
  bg: "#0A1120", bg2: "#0E1830", card: "#121E3A", cardHi: "#16264A",
  border: "#22324F", ink: "#EAF1FC", sub: "#9FB1D0", muted: "#647697",
  rose: "#FB7185", coral: "#FB923C", amber: "#FBBF24", green: "#34D399",
  cyan: "#22D3EE", blue: "#3B82F6", purple: "#A78BFA",
};

type Tab = "client" | "musician" | "admin";
const TABS: { id: Tab; label: string; Icon: typeof UserRound; color: string }[] = [
  { id: "client", label: "Client portal", Icon: UserRound, color: C.rose },
  { id: "musician", label: "Talent portal", Icon: Music, color: C.cyan },
  { id: "admin", label: "Admin command center", Icon: LayoutDashboard, color: C.amber },
];

export default function TcePortals() {
  const [tab, setTab] = useState<Tab>("client");
  const active = TABS.find((t) => t.id === tab)!;

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "28px 20px 90px" }}>
        {/* Back */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <Link href="/clients/tce-entertainment/milestones" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
            <ArrowLeft size={15} /> Milestones & checklist
          </Link>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.rose, background: "rgba(251,113,133,0.12)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Sample — built from your SOP
          </span>
        </div>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: C.rose, fontSize: 12, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <Sparkles size={14} /> Troy Curtis Entertainment · Booking Platform
          </div>
          <h1 style={{ fontSize: 33, lineHeight: 1.14, margin: "12px 0 8px", fontWeight: 800, letterSpacing: -0.5 }}>
            Three portals, one system
          </h1>
          <p style={{ color: C.sub, fontSize: 15, maxWidth: 720, margin: 0, lineHeight: 1.6 }}>
            A sample of each side of the platform, drawn straight from your Production and Artist Platform SOPs. Clients plan
            their music, artists manage their gigs and resources, and admin runs the whole journey from one command center.
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
          {TABS.map((t) => {
            const on = t.id === tab;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", background: on ? t.color + "1F" : C.card, border: `1px solid ${on ? t.color : C.border}`, color: on ? C.ink : C.sub, borderRadius: 12, padding: "10px 16px", fontSize: 13.5, fontWeight: 700, transition: "all .16s" }}>
                <t.Icon size={16} color={t.color} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Browser chrome frame */}
        <div style={{ marginTop: 18, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderBottom: `1px solid ${C.border}`, background: C.card }}>
            <span style={{ width: 10, height: 10, borderRadius: 99, background: "#F87171" }} />
            <span style={{ width: 10, height: 10, borderRadius: 99, background: "#FBBF24" }} />
            <span style={{ width: 10, height: 10, borderRadius: 99, background: "#34D399" }} />
            <span style={{ marginLeft: 10, fontSize: 12, color: C.muted, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <active.Icon size={12} color={active.color} /> app.troycurtisentertainment.com / {tab}
            </span>
          </div>
          <div style={{ padding: "22px 20px" }}>
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}>
                {tab === "client" && <ClientView />}
                {tab === "musician" && <MusicianView />}
                {tab === "admin" && <AdminView />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 34, paddingTop: 22, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 13, color: C.muted }}>Sample built by Benjamin Yson · BVN — illustrative data</div>
          <Link href="/clients/tce-entertainment/milestones" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: C.rose, fontSize: 13, textDecoration: "none", fontWeight: 700 }}>
            See the build plan <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
}

// ═════════════════════════════════════════════════════════════
// CLIENT VIEW — questionnaire + song library + AI + finance
function ClientView() {
  return (
    <div>
      <ViewHead color={C.rose} Icon={UserRound} title="Welcome back, Sarah" sub="Wedding · 14 Feb 2027 · The Grand Ballroom, Miami · 12-piece band" />

      {/* Finance strip */}
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", marginBottom: 14 }}>
        <MiniStat Icon={FileSignature} k="Contract" v="Signed" color={C.green} />
        <MiniStat Icon={Wallet} k="Deposit" v="Paid" color={C.green} />
        <MiniStat Icon={Clock} k="Final balance" v="Due Jan 24" color={C.amber} />
        <MiniStat Icon={Music} k="Music" v="In progress" color={C.rose} />
      </div>

      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {/* Event questionnaire */}
        <Panel title="Event questionnaire" Icon={ClipboardList} color={C.rose}>
          <Field label="Ceremony" value="Canon in D (processional)" />
          <Field label="Cocktail hour" value="Jazz standards set" />
          <Field label="Grand entrance" value="Signed, Sealed, Delivered" />
          <Field label="First dance" value="At Last — Etta James" />
          <Field label="Parent dances" value="2 selected" />
          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            <TagRow Icon={CheckCircle2} label="Must-play" items={["Uptown Funk", "September", "I Wanna Dance…"]} color={C.green} />
            <TagRow Icon={Ban} label="Do-not-play" items={["Cha Cha Slide", "Macarena"]} color={C.rose} />
          </div>
        </Panel>

        {/* AI song helper */}
        <Panel title="AI song assistant" Icon={Bot} color={C.coral}>
          <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.55, marginBottom: 12 }}>
            Ask for ideas for any part of your day — the AI suggests, you add to the library.
          </div>
          <Bubble who="Sarah" color={C.rose} text="Something soulful for the parent dance?" />
          <Bubble who="TCE AI" color={C.coral} text="Lovely for a parent dance: “What a Wonderful World” — Louis Armstrong, “My Girl” — The Temptations, or “Isn’t She Lovely” — Stevie Wonder. Add any to your list?" />
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <div style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 12px", fontSize: 12.5, color: C.muted }}>Ask about songs, sets, or timing…</div>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: C.coral, display: "grid", placeItems: "center" }}><Send size={15} color={C.bg} /></div>
          </div>
        </Panel>
      </div>

      {/* Song library */}
      <Panel title="Song library" Icon={ListMusic} color={C.purple} full>
        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {[
            ["Ceremony", "Canon in D · A Thousand Years", C.rose],
            ["Cocktail", "Jazz standards · Bossa nova", C.cyan],
            ["Reception", "Motown · Funk · Top 40", C.amber],
            ["First dance ideas", "At Last · Adorn · Make You Feel My Love", C.green],
          ].map(([slot, song, col], i) => (
            <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 13px" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: col as string, textTransform: "uppercase", letterSpacing: 0.5 }}>{slot}</div>
              <div style={{ fontSize: 13, color: C.ink, marginTop: 4, lineHeight: 1.4 }}>{song}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// MUSICIAN / TALENT VIEW — gig offer + event info + set list
function MusicianView() {
  return (
    <div>
      <ViewHead color={C.cyan} Icon={Music} title="Marcus Reid" sub="Vocalist & guitarist · The Velvet Tones · Miami, FL" />

      {/* Profile tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
        <TagPill Icon={Users} label="The Velvet Tones" color={C.rose} />
        <TagPill Icon={Mic2} label="Vocalist" color={C.cyan} />
        <TagPill Icon={Guitar} label="Guitarist" color={C.amber} />
        <TagPill Icon={MapPin} label="Miami, FL · 100 mi radius" color={C.green} />
        <TagPill Icon={Wallet} label="Rate $450" color={C.purple} />
      </div>

      {/* Pending gig offer */}
      <Panel title="New gig offer — action needed" Icon={Handshake} color={C.rose} full>
        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", marginBottom: 12 }}>
          <Info Icon={CalendarDays} k="Date" v="14 Feb 2027" />
          <Info Icon={MapPin} k="Venue" v="Grand Ballroom, Miami" />
          <Info Icon={Clock} k="Call time" v="4:30 PM" />
          <Info Icon={Shirt} k="Dress code" v="Black tie" />
          <Info Icon={Car} k="Parking" v="Valet — comped" />
          <Info Icon={Wallet} k="Gig pay" v="$450" />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ flex: 1, fontSize: 13, fontWeight: 800, color: C.bg, background: C.green, border: "none", borderRadius: 10, padding: "10px 0", cursor: "pointer", display: "inline-flex", justifyContent: "center", alignItems: "center", gap: 7 }}>
            <CircleCheck size={15} /> Accept
          </button>
          <button style={{ flex: 1, fontSize: 13, fontWeight: 800, color: C.sub, background: "transparent", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 0", cursor: "pointer" }}>
            Decline
          </button>
        </div>
        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 10, textAlign: "center" }}>
          On accept: added to your calendar, confirmation email + SMS/email reminders scheduled.
        </div>
      </Panel>

      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {/* Set list */}
        <Panel title="Set list & resources" Icon={ListMusic} color={C.amber}>
          {[
            ["At Last", "Key: C", "Vocal: Marcus"],
            ["Signed, Sealed", "Key: Eb", "Vocal: Ella"],
            ["September", "Key: A", "Vocal: Group"],
          ].map(([song, key, vocal], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 12px", marginBottom: 7 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{song}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{key} · {vocal}</div>
              </div>
              <FolderOpen size={15} color={C.amber} />
            </div>
          ))}
          <div style={{ fontSize: 11.5, color: C.muted, marginTop: 6, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <FolderOpen size={12} /> Charts, backing tracks & audio via Google Drive
          </div>
        </Panel>

        {/* Calendar */}
        <Panel title="My calendar" Icon={CalendarDays} color={C.blue}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5 }}>
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i} style={{ textAlign: "center", fontSize: 10, color: C.muted, fontWeight: 700 }}>{d}</div>
            ))}
            {Array.from({ length: 28 }, (_, i) => {
              const day = i + 1;
              const gig = day === 14 || day === 21;
              return (
                <div key={i} style={{ aspectRatio: "1", display: "grid", placeItems: "center", fontSize: 11, borderRadius: 7, background: gig ? C.cyan + "26" : C.bg, border: `1px solid ${gig ? C.cyan : C.border}`, color: gig ? C.cyan : C.sub, fontWeight: gig ? 800 : 500 }}>
                  {day}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 10, fontSize: 11.5, color: C.muted, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, background: C.cyan + "26", border: `1px solid ${C.cyan}` }} /> Gig booked — auto-added on accept
          </div>
        </Panel>
      </div>

      {/* Gigs + payments */}
      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <Panel title="Upcoming & past gigs" Icon={CalendarClock} color={C.green}>
          <Gig date="14 Feb 2027" name="Sarah & James Wedding" loc="Grand Ballroom, Miami" status="Confirmed" col={C.green} />
          <Gig date="28 Dec 2026" name="NYE Private Party" loc="Star Island, Miami" status="Paid" col={C.cyan} />
        </Panel>
        <Panel title="Payments & documents" Icon={HandCoins} color={C.purple}>
          <Field label="NYE Private Party" value="$500 · Paid" />
          <Field label="Anderson Wedding" value="$450 · Paid" />
          <Field label="W-9" value="On file" />
          <Field label="Direct deposit" value="Set up" />
        </Panel>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// ADMIN VIEW — command center
function AdminView() {
  return (
    <div>
      <ViewHead color={C.amber} Icon={LayoutDashboard} title="Command center" sub="Sales · Finance · Production · Booking — all in one view" />

      {/* Stat row */}
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", marginBottom: 14 }}>
        <Stat k="New enquiries" v="4" color={C.rose} />
        <Stat k="Booked events" v="11" color={C.green} />
        <Stat k="Finals due (21d)" v="3" color={C.coral} />
        <Stat k="Payouts due" v="$2,150" color={C.amber} />
      </div>

      {/* Talent database search + AI match */}
      <Panel title="Talent booking — AI matched the nearest bands" Icon={MapPin} color={C.rose} full>
        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 12, fontSize: 13, color: C.sub, lineHeight: 1.55 }}>
          <strong style={{ color: C.ink }}>Sarah M.</strong> · Wedding · 14 Feb 2027 · Miami, FL · Package: <strong style={{ color: C.ink }}>12-piece band</strong> · Soul / Jazz
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {[
            ["The Velvet Tones", "3.2 mi", "Soul · Jazz · 12pc", 98, C.green],
            ["Midnight Brass", "7.8 mi", "Jazz · Funk · 10pc", 91, C.cyan],
            ["Coastal Strings", "12.4 mi", "Acoustic · Soul · 8pc", 84, C.amber],
          ].map(([band, dist, genre, score, col], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: C.bg, border: `1px solid ${i === 0 ? C.green : C.border}`, borderRadius: 10, padding: "11px 14px" }}>
              <span style={{ width: 34, height: 34, borderRadius: 9, background: (col as string) + "22", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <Music size={16} color={col as string} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{band}</div>
                <div style={{ fontSize: 12, color: C.muted, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><MapPin size={11} /> {dist}</span>
                  <span>{genre}</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 800, color: col as string }}>
                <Star size={13} /> {score as number}%
              </div>
              <button style={{ fontSize: 12, fontWeight: 700, color: i === 0 ? C.bg : C.sub, background: i === 0 ? C.green : "transparent", border: `1px solid ${i === 0 ? C.green : C.border}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>
                {i === 0 ? "Assemble band" : "View"}
              </button>
            </div>
          ))}
        </div>
      </Panel>

      {/* Pipeline + payouts */}
      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <Panel title="Client journey pipeline" Icon={FileText} color={C.blue}>
          {[
            ["Sales → Contract", 4, C.rose],
            ["Finance — deposit", 3, C.coral],
            ["Production onboarding", 2, C.amber],
            ["Music planning", 5, C.purple],
            ["Booked / performing", 11, C.green],
            ["Post-event / follow-up", 27, C.cyan],
          ].map(([stage, n, col], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: col as string, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 13, color: C.sub }}>{stage}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: C.ink }}>{n as number}</span>
            </div>
          ))}
        </Panel>

        <Panel title="Payout list — completed gigs only" Icon={Wallet} color={C.amber}>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 10, lineHeight: 1.5 }}>
            Each artist at their own rate. Appears only after the event is marked complete. Paid manually, then marked paid.
          </div>
          {[
            ["Marcus Reid", "Velvet Tones", "$450", true],
            ["Ella Grant", "Velvet Tones", "$400", true],
            ["Dwayne Cole", "Velvet Tones", "$500", false],
            ["Nadia Okafor", "Midnight Brass", "$400", false],
          ].map(([name, band, rate, paid], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{name as string}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{band as string}</div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: C.ink }}>{rate as string}</span>
              {paid ? (
                <span style={{ fontSize: 11, fontWeight: 700, color: C.green, display: "inline-flex", alignItems: "center", gap: 4 }}><CircleCheck size={12} /> Paid</span>
              ) : (
                <span style={{ fontSize: 11, fontWeight: 700, color: C.amber, display: "inline-flex", alignItems: "center", gap: 4 }}><CircleDashed size={12} /> Due</span>
              )}
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// Shared bits
function ViewHead({ color, Icon, title, sub }: { color: string; Icon: typeof UserRound; title: string; sub: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
      <div style={{ width: 48, height: 48, borderRadius: 13, background: color + "1F", border: `1px solid ${color}55`, display: "grid", placeItems: "center", flexShrink: 0 }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.ink }}>{title}</div>
        <div style={{ fontSize: 13, color: C.sub }}>{sub}</div>
      </div>
    </div>
  );
}

function Panel({ title, Icon, color, children, full }: { title: string; Icon: typeof UserRound; color: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: full ? 14 : 0, gridColumn: full ? "1 / -1" : undefined }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Icon size={16} color={color} />
        <span style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
      <span style={{ fontSize: 12.5, color: C.muted }}>{label}</span>
      <span style={{ fontSize: 13, color: C.ink, fontWeight: 600, textAlign: "right" }}>{value}</span>
    </div>
  );
}

function Info({ Icon, k, v }: { Icon: typeof MapPin; k: string; v: string }) {
  return (
    <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 12px" }}>
      <div style={{ fontSize: 11, color: C.muted, display: "inline-flex", alignItems: "center", gap: 5 }}><Icon size={11} /> {k}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginTop: 2 }}>{v}</div>
    </div>
  );
}

function TagRow({ Icon, label, items, color }: { Icon: typeof Tag; label: string; items: string[]; color: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 800, color, textTransform: "uppercase", letterSpacing: 0.5, display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
        <Icon size={12} /> {label}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {items.map((it, i) => (
          <span key={i} style={{ fontSize: 11.5, color: C.sub, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 99, padding: "3px 9px" }}>{it}</span>
        ))}
      </div>
    </div>
  );
}

function TagPill({ Icon, label, color }: { Icon: typeof Tag; label: string; color: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700, color, background: color + "18", border: `1px solid ${color}44`, borderRadius: 99, padding: "5px 10px" }}>
      <Icon size={12} /> {label}
    </span>
  );
}

function Bubble({ who, color, text }: { who: string; color: string; text: string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 10.5, fontWeight: 800, color, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>{who}</div>
      <div style={{ fontSize: 13, color: C.ink, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 12px", lineHeight: 1.5 }}>{text}</div>
    </div>
  );
}

function Gig({ date, name, loc, status, col }: { date: string; name: string; loc: string; status: string; col: string }) {
  const parts = date.split(" ");
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 13px", marginBottom: 8 }}>
      <div style={{ flexShrink: 0, textAlign: "center", width: 52 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: col }}>{parts[0]} {parts[1]}</div>
        <div style={{ fontSize: 10, color: C.muted }}>{parts[2]}</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>{name}</div>
        <div style={{ fontSize: 11.5, color: C.muted, display: "inline-flex", alignItems: "center", gap: 4 }}><MapPin size={11} /> {loc}</div>
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: col }}>{status}</span>
    </div>
  );
}

function Stat({ k, v, color }: { k: string; v: string; color: string }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${color}`, borderRadius: 12, padding: "12px 14px" }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: C.ink }}>{v}</div>
      <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{k}</div>
    </div>
  );
}

function MiniStat({ Icon, k, v, color }: { Icon: typeof MapPin; k: string; v: string; color: string }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ width: 30, height: 30, borderRadius: 8, background: color + "1F", display: "grid", placeItems: "center", flexShrink: 0 }}><Icon size={15} color={color} /></span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 10.5, color: C.muted }}>{k}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{v}</div>
      </div>
    </div>
  );
}
