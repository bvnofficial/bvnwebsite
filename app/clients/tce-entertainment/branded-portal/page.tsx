"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Calendar, MapPin, Users, Music, ListMusic,
  Ban, Check, Star, Wallet, Guitar, Mic2, Clock, Car, Shirt, FolderOpen,
  Heart, CalendarDays, ChevronRight,
} from "lucide-react";

// ── TCE real brand tokens (from troycurtisentertainment.com) ──
const C = {
  cream: "#FFF6F2",
  paper: "#FFFFFF",
  warm: "#FBF3EA",
  warm2: "#FFF4E6",
  gold: "#C99A0C",
  goldDark: "#9C7708",
  ink: "#141210",
  text: "#3B3531",
  sub: "#6E6660",
  muted: "#A79E96",
  border: "#ECE2D6",
  dark: "#141210",
};
const SERIF = "'Playfair Display', Georgia, serif";
const SANS = "'Raleway', system-ui, sans-serif";
const SCRIPT = "'Great Vibes', cursive";

type Tab = "client" | "artist" | "admin";
const TABS: { id: Tab; label: string }[] = [
  { id: "client", label: "Client Portal" },
  { id: "artist", label: "Artist Portal" },
  { id: "admin", label: "Admin" },
];

export default function TceBrandedPortal() {
  const [tab, setTab] = useState<Tab>("client");

  return (
    <main style={{ background: C.cream, color: C.text, minHeight: "100vh", fontFamily: SANS }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Raleway:wght@300;400;500;600;700&family=Great+Vibes&display=swap');
        ::selection { background: ${C.gold}33; }
      `}</style>

      {/* Top bar */}
      <div style={{ borderBottom: `1px solid ${C.border}`, background: C.paper }}>
        <div style={{ maxWidth: 1040, margin: "0 auto", padding: "13px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <Link href="/clients/tce-entertainment/portals" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 12.5, textDecoration: "none", fontFamily: SANS }}>
            <ArrowLeft size={14} /> Back to demo set
          </Link>
          <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, letterSpacing: 2, color: C.ink }}>
            TROY CURTIS <span style={{ color: C.gold }}>ENTERTAINMENT</span>
          </div>
          <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: C.gold, fontFamily: SANS }}>
            Portal Sample
          </span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: C.warm2, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1040, margin: "0 auto", padding: "38px 22px 30px", textAlign: "center" }}>
          <div style={{ fontFamily: SCRIPT, fontSize: 30, color: C.gold, lineHeight: 1 }}>where music meets the moment</div>
          <h1 style={{ fontFamily: SERIF, fontSize: 38, fontWeight: 600, color: C.ink, margin: "8px 0 10px", letterSpacing: -0.3 }}>
            Your Portal
          </h1>
          <p style={{ fontFamily: SANS, fontSize: 14.5, color: C.sub, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            One secure home for everything — your event, your music, your team. A sample styled in the TCE brand, shown for the
            client, the artist, and the admin.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "0 22px" }}>
        <div style={{ display: "flex", gap: 28, justifyContent: "center", borderBottom: `1px solid ${C.border}`, marginTop: 4 }}>
          {TABS.map((t) => {
            const on = t.id === tab;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "16px 4px", fontFamily: SANS, fontSize: 12.5, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: on ? C.ink : C.muted, borderBottom: `2px solid ${on ? C.gold : "transparent"}`, marginBottom: -1, transition: "all .2s" }}>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "34px 22px 80px" }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}>
            {tab === "client" && <ClientView />}
            {tab === "artist" && <ArtistView />}
            {tab === "admin" && <AdminView />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div style={{ background: C.dark, color: "#EFE7DC" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto", padding: "26px 22px", display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: SERIF, fontSize: 15, letterSpacing: 1.5 }}>TROY CURTIS <span style={{ color: C.gold }}>ENTERTAINMENT</span></div>
          <div style={{ fontFamily: SANS, fontSize: 11.5, color: "#B8ADA0" }}>Sample by Benjamin Yson · BVN · styled in the TCE brand</div>
        </div>
      </div>
    </main>
  );
}

// ═══════════════════════════════════════ CLIENT ══════════════
function ClientView() {
  return (
    <div>
      <SectionTitle eyebrow="Welcome back" title="Sarah & James" note="Wedding · February 14, 2027 · The Grand Ballroom, Miami" />

      {/* Status */}
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", marginBottom: 22 }}>
        <Stat k="Contract" v="Signed" ok />
        <Stat k="Deposit" v="Paid" ok />
        <Stat k="Final balance" v="Due Jan 24" />
        <Stat k="Music planning" v="In progress" />
      </div>

      <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <Card title="Your Celebration" Icon={Calendar}>
          <Field k="Package" v="12-piece band · The Velvet Tones" />
          <Field k="Ceremony" v="4:30 PM · Garden terrace" />
          <Field k="Reception" v="6:00 PM · Grand Ballroom" />
          <Field k="Guests" v="180" />
          <Field k="Genres" v="Soul · Jazz · Motown" last />
        </Card>

        <Card title="Your Music" Icon={Music}>
          <MusicLine label="First dance" v="At Last — Etta James" />
          <MusicLine label="Parent dances" v="Two selected" />
          <div style={{ marginTop: 12 }}>
            <TagBlock Icon={Check} label="Must-play" items={["Uptown Funk", "September", "Signed, Sealed"]} />
            <TagBlock Icon={Ban} label="Do-not-play" items={["Cha Cha Slide", "Macarena"]} />
          </div>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14, fontFamily: SANS, fontSize: 12.5, fontWeight: 600, letterSpacing: 0.6, color: C.goldDark, textDecoration: "none" }}>
            <ListMusic size={14} /> Open Spotify playlist <ChevronRight size={14} />
          </a>
        </Card>
      </div>

      {/* Gig sheet preview */}
      <Card title="Run of Show" Icon={Clock} full>
        <div style={{ display: "grid", gap: 0 }}>
          {[
            ["4:30 PM", "Ceremony — processional & vows"],
            ["5:00 PM", "Cocktail hour — jazz trio"],
            ["6:00 PM", "Grand entrance — Signed, Sealed, Delivered"],
            ["6:15 PM", "First dance — At Last"],
            ["7:30 PM", "Dinner set — Motown standards"],
            ["8:30 PM", "Dance floor — full band"],
          ].map(([t, e], i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: 14, padding: "11px 0", borderTop: i === 0 ? "none" : `1px solid ${C.border}`, alignItems: "baseline" }}>
              <span style={{ fontFamily: SERIF, fontSize: 14, fontWeight: 600, color: C.gold }}>{t}</span>
              <span style={{ fontFamily: SANS, fontSize: 13.5, color: C.text }}>{e}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════ ARTIST ══════════════
function ArtistView() {
  return (
    <div>
      <SectionTitle eyebrow="Artist Portal" title="Marcus Reid" note="Vocalist & Guitarist · The Velvet Tones · Miami, FL" />

      {/* tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
        <Pill Icon={Users} label="The Velvet Tones" />
        <Pill Icon={Mic2} label="Vocalist" />
        <Pill Icon={Guitar} label="Guitarist" />
        <Pill Icon={MapPin} label="Miami · 100 mi radius" />
        <Pill Icon={Wallet} label="Rate $450" />
      </div>

      {/* Gig offer */}
      <Card title="New Gig Offer" Icon={Calendar} full accent>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", marginBottom: 16 }}>
          <Info Icon={CalendarDays} k="Date" v="Feb 14, 2027" />
          <Info Icon={MapPin} k="Venue" v="Grand Ballroom" />
          <Info Icon={Clock} k="Call time" v="4:30 PM" />
          <Info Icon={Shirt} k="Attire" v="Black tie" />
          <Info Icon={Car} k="Parking" v="Valet, comped" />
          <Info Icon={Wallet} k="Gig pay" v="$450" />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <BtnGold>Accept gig</BtnGold>
          <BtnGhost>Decline</BtnGhost>
        </div>
        <div style={{ fontFamily: SANS, fontSize: 11.5, color: C.muted, marginTop: 12, textAlign: "center" }}>
          On accept, this lands on your calendar and your reminders are scheduled automatically.
        </div>
      </Card>

      <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <Card title="Set List & Resources" Icon={ListMusic}>
          {[
            ["At Last", "Key C · Vocal: Marcus"],
            ["Signed, Sealed", "Key Eb · Vocal: Ella"],
            ["September", "Key A · Vocal: Group"],
          ].map(([s, m], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "10px 0", borderTop: i === 0 ? "none" : `1px solid ${C.border}` }}>
              <div>
                <div style={{ fontFamily: SERIF, fontSize: 14.5, color: C.ink, fontWeight: 600 }}>{s}</div>
                <div style={{ fontFamily: SANS, fontSize: 12, color: C.sub }}>{m}</div>
              </div>
              <FolderOpen size={15} color={C.gold} />
            </div>
          ))}
          <div style={{ fontFamily: SANS, fontSize: 11.5, color: C.muted, marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <FolderOpen size={12} /> Charts, backing tracks & audio via Drive
          </div>
        </Card>

        <Card title="My Gigs" Icon={CalendarDays}>
          <GigRow date="Feb 14, 2027" name="Sarah & James Wedding" loc="Grand Ballroom, Miami" status="Upcoming" />
          <GigRow date="Dec 28, 2026" name="NYE Private Party" loc="Star Island, Miami" status="Paid" />
          <GigRow date="Nov 09, 2026" name="Anderson Wedding" loc="Vizcaya, Miami" status="Paid" last />
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════ ADMIN ═══════════════
function AdminView() {
  return (
    <div>
      <SectionTitle eyebrow="Admin" title="Command Center" note="Every event across Sales, Finance, Production & Booking" />

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", marginBottom: 22 }}>
        <BigStat k="New enquiries" v="4" />
        <BigStat k="Booked events" v="11" />
        <BigStat k="Finals due (21d)" v="3" />
        <BigStat k="Payouts due" v="$2,150" />
      </div>

      <Card title="Talent Booking — AI Matched" Icon={MapPin} full>
        <div style={{ fontFamily: SANS, fontSize: 13, color: C.sub, background: C.warm, border: `1px solid ${C.border}`, borderRadius: 4, padding: "11px 14px", marginBottom: 14 }}>
          <b style={{ color: C.ink }}>Sarah M.</b> · Wedding · Feb 14 · Miami · Package: 12-piece · Soul / Jazz
        </div>
        {[
          ["The Velvet Tones", "3.2 mi", "Soul · Jazz · 12pc", 98, true],
          ["Midnight Brass", "7.8 mi", "Jazz · Funk · 10pc", 91, false],
          ["Coastal Strings", "12.4 mi", "Acoustic · Soul · 8pc", 84, false],
        ].map(([band, dist, genre, score, top], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderTop: i === 0 ? "none" : `1px solid ${C.border}` }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: SERIF, fontSize: 15.5, fontWeight: 600, color: C.ink }}>{band as string}</div>
              <div style={{ fontFamily: SANS, fontSize: 12, color: C.sub, display: "flex", gap: 12 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><MapPin size={11} /> {dist as string}</span>
                <span>{genre as string}</span>
              </div>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: SANS, fontSize: 13, fontWeight: 700, color: C.gold }}>
              <Star size={13} /> {score as number}%
            </div>
            {(top as boolean)
              ? <BtnGold small>Assemble</BtnGold>
              : <BtnGhost small>View</BtnGhost>}
          </div>
        ))}
      </Card>

      <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <Card title="Client Journey" Icon={ChevronRight}>
          {[
            ["Sales → Contract", 4], ["Finance — deposit", 3], ["Production onboarding", 2],
            ["Music planning", 5], ["Booked / performing", 11], ["Follow-up", 27],
          ].map(([s, n], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderTop: i === 0 ? "none" : `1px solid ${C.border}` }}>
              <span style={{ fontFamily: SANS, fontSize: 13, color: C.text }}>{s as string}</span>
              <span style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 600, color: C.gold }}>{n as number}</span>
            </div>
          ))}
        </Card>

        <Card title="Payout List — Completed Only" Icon={Wallet}>
          <div style={{ fontFamily: SANS, fontSize: 11.5, color: C.muted, marginBottom: 8, lineHeight: 1.5 }}>
            Each artist at their own rate, released only after the event is marked complete.
          </div>
          {[
            ["Marcus Reid", "$450", true], ["Ella Grant", "$400", true],
            ["Dwayne Cole", "$500", false], ["Nadia Okafor", "$400", false],
          ].map(([name, rate, paid], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "9px 0", borderTop: i === 0 ? "none" : `1px solid ${C.border}` }}>
              <span style={{ fontFamily: SANS, fontSize: 13, color: C.text }}>{name as string}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: SERIF, fontSize: 14, fontWeight: 600, color: C.ink }}>{rate as string}</span>
                <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: (paid as boolean) ? C.gold : C.muted }}>
                  {(paid as boolean) ? "Paid" : "Due"}
                </span>
              </span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════ PIECES ══════════════
function SectionTitle({ eyebrow, title, note }: { eyebrow: string; title: string; note: string }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: C.gold }}>{eyebrow}</div>
      <h2 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 600, color: C.ink, margin: "5px 0 4px", letterSpacing: -0.3 }}>{title}</h2>
      <div style={{ fontFamily: SANS, fontSize: 13.5, color: C.sub }}>{note}</div>
    </div>
  );
}

function Card({ title, Icon, children, full, accent }: { title: string; Icon: typeof Music; children: React.ReactNode; full?: boolean; accent?: boolean }) {
  return (
    <div style={{ background: accent ? C.warm2 : C.paper, border: `1px solid ${C.border}`, borderTop: `2px solid ${C.gold}`, borderRadius: 4, padding: "18px 20px", marginBottom: full ? 18 : 0, gridColumn: full ? "1 / -1" : undefined }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
        <Icon size={16} color={C.gold} />
        <span style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: C.ink }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Field({ k, v, last }: { k: string; v: string; last?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", borderBottom: last ? "none" : `1px solid ${C.border}` }}>
      <span style={{ fontFamily: SANS, fontSize: 12.5, color: C.sub }}>{k}</span>
      <span style={{ fontFamily: SANS, fontSize: 13, color: C.ink, fontWeight: 600, textAlign: "right" }}>{v}</span>
    </div>
  );
}

function MusicLine({ label, v }: { label: string; v: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
      <Heart size={13} color={C.gold} />
      <span style={{ fontFamily: SANS, fontSize: 12, color: C.sub, width: 92 }}>{label}</span>
      <span style={{ fontFamily: SANS, fontSize: 13, color: C.ink, fontWeight: 600 }}>{v}</span>
    </div>
  );
}

function TagBlock({ Icon, label, items }: { Icon: typeof Check; label: string; items: string[] }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: C.sub, display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
        <Icon size={12} color={C.gold} /> {label}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {items.map((it, i) => (
          <span key={i} style={{ fontFamily: SANS, fontSize: 11.5, color: C.text, background: C.warm, border: `1px solid ${C.border}`, borderRadius: 2, padding: "3px 9px" }}>{it}</span>
        ))}
      </div>
    </div>
  );
}

function Pill({ Icon, label }: { Icon: typeof Users; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: SANS, fontSize: 12, fontWeight: 600, color: C.text, background: C.paper, border: `1px solid ${C.gold}55`, borderRadius: 2, padding: "6px 11px" }}>
      <Icon size={12} color={C.gold} /> {label}
    </span>
  );
}

function Info({ Icon, k, v }: { Icon: typeof MapPin; k: string; v: string }) {
  return (
    <div style={{ background: C.paper, border: `1px solid ${C.border}`, borderRadius: 3, padding: "9px 12px" }}>
      <div style={{ fontFamily: SANS, fontSize: 10.5, color: C.sub, display: "inline-flex", alignItems: "center", gap: 5, textTransform: "uppercase", letterSpacing: 0.5 }}><Icon size={11} color={C.gold} /> {k}</div>
      <div style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 600, color: C.ink, marginTop: 3 }}>{v}</div>
    </div>
  );
}

function GigRow({ date, name, loc, status, last }: { date: string; name: string; loc: string; status: string; last?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: last ? "none" : `1px solid ${C.border}` }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: SERIF, fontSize: 14.5, fontWeight: 600, color: C.ink }}>{name}</div>
        <div style={{ fontFamily: SANS, fontSize: 11.5, color: C.sub, display: "inline-flex", alignItems: "center", gap: 4 }}>
          <Calendar size={11} /> {date} · <MapPin size={11} /> {loc}
        </div>
      </div>
      <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: status === "Paid" ? C.muted : C.gold }}>{status}</span>
    </div>
  );
}

function Stat({ k, v, ok }: { k: string; v: string; ok?: boolean }) {
  return (
    <div style={{ background: C.paper, border: `1px solid ${C.border}`, borderRadius: 3, padding: "12px 14px" }}>
      <div style={{ fontFamily: SANS, fontSize: 10.5, color: C.sub, textTransform: "uppercase", letterSpacing: 0.6 }}>{k}</div>
      <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: ok ? C.gold : C.ink, marginTop: 3 }}>{v}</div>
    </div>
  );
}

function BigStat({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ background: C.paper, border: `1px solid ${C.border}`, borderTop: `2px solid ${C.gold}`, borderRadius: 3, padding: "14px 16px" }}>
      <div style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: C.ink }}>{v}</div>
      <div style={{ fontFamily: SANS, fontSize: 11, color: C.sub, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>{k}</div>
    </div>
  );
}

function BtnGold({ children, small }: { children: React.ReactNode; small?: boolean }) {
  return (
    <button style={{ fontFamily: SANS, fontSize: small ? 11.5 : 13, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: "#FFF", background: C.gold, border: "none", borderRadius: 2, padding: small ? "7px 14px" : "11px 22px", cursor: "pointer", flexShrink: 0 }}>
      {children}
    </button>
  );
}

function BtnGhost({ children, small }: { children: React.ReactNode; small?: boolean }) {
  return (
    <button style={{ fontFamily: SANS, fontSize: small ? 11.5 : 13, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: C.ink, background: "transparent", border: `1px solid ${C.ink}`, borderRadius: 2, padding: small ? "6px 13px" : "10px 21px", cursor: "pointer", flexShrink: 0 }}>
      {children}
    </button>
  );
}
