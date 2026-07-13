"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, UserRound, Music, Lock, Mail, KeyRound,
  ShieldCheck, Check, Sparkles, Calendar, ChevronRight,
} from "lucide-react";

// ── TCE real brand tokens ────────────────────────────────────
const C = {
  cream: "#FFF6F2", paper: "#FFFFFF", warm: "#FBF3EA", warm2: "#FFF4E6",
  gold: "#C99A0C", goldDark: "#9C7708", ink: "#141210", text: "#3B3531",
  sub: "#6E6660", muted: "#A79E96", border: "#ECE2D6", dark: "#141210",
};
const SERIF = "'Playfair Display', Georgia, serif";
const SANS = "'Raleway', system-ui, sans-serif";
const SCRIPT = "'Great Vibes', cursive";

type Who = "client" | "artist";

export default function TceWebsite() {
  const [who, setWho] = useState<Who>("client");
  const isClient = who === "client";

  return (
    <main style={{ background: C.cream, color: C.text, minHeight: "100vh", fontFamily: SANS }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Raleway:wght@300;400;500;600;700&family=Great+Vibes&display=swap');
        ::selection { background: ${C.gold}33; }
      `}</style>

      {/* Demo bar */}
      <div style={{ background: C.dark, color: "#EFE7DC" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "8px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <Link href="/clients/tce-entertainment/branded-portal" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#EFE7DC", fontSize: 12, textDecoration: "none", fontFamily: SANS }}>
            <ArrowLeft size={13} /> Branded portal
          </Link>
          <span style={{ fontSize: 10.5, letterSpacing: 1, textTransform: "uppercase", color: C.gold, fontFamily: SANS }}>Sample — website & secure logins</span>
        </div>
      </div>

      {/* Nav */}
      <header style={{ background: C.paper, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "16px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
          <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 600, letterSpacing: 2, color: C.ink }}>
            TROY CURTIS <span style={{ color: C.gold }}>ENTERTAINMENT</span>
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
            {["Weddings", "Corporate", "Talent", "About"].map((n) => (
              <span key={n} style={{ fontFamily: SANS, fontSize: 12.5, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: C.sub }}>{n}</span>
            ))}
            <button onClick={() => setWho("client")}
              style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: isClient ? "#FFF" : C.ink, background: isClient ? C.gold : "transparent", border: `1px solid ${C.gold}`, borderRadius: 2, padding: "8px 14px", cursor: "pointer" }}>
              Client Login
            </button>
            <button onClick={() => setWho("artist")}
              style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: !isClient ? "#FFF" : C.ink, background: !isClient ? C.ink : "transparent", border: `1px solid ${C.ink}`, borderRadius: 2, padding: "8px 14px", cursor: "pointer" }}>
              Artist Login
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: C.warm2, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "56px 22px 48px", textAlign: "center" }}>
          <div style={{ fontFamily: SCRIPT, fontSize: 34, color: C.gold, lineHeight: 1 }}>where music meets the moment</div>
          <h1 style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 600, color: C.ink, margin: "10px 0 14px", letterSpacing: -0.5, lineHeight: 1.1 }}>
            Unforgettable entertainment,<br />effortlessly managed
          </h1>
          <p style={{ fontFamily: SANS, fontSize: 15, color: C.sub, maxWidth: 560, margin: "0 auto 24px", lineHeight: 1.7 }}>
            From your first enquiry to your last dance, everything lives in one secure place. Plan your event, choose your
            music, and follow every detail through your private portal.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/clients/tce-entertainment/booking-form" style={{ fontFamily: SANS, fontSize: 12.5, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: "#FFF", background: C.gold, borderRadius: 2, padding: "13px 26px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Plan your event <ArrowRight size={15} />
            </Link>
            <a href="#login" style={{ fontFamily: SANS, fontSize: 12.5, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: C.ink, background: "transparent", border: `1px solid ${C.ink}`, borderRadius: 2, padding: "13px 26px", textDecoration: "none" }}>
              Portal login
            </a>
          </div>
        </div>
      </section>

      {/* Two logins */}
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "50px 22px 10px" }}>
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <div style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: C.gold }}>Two secure logins</div>
          <h2 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 600, color: C.ink, margin: "6px 0 0" }}>One website, the right portal for each person</h2>
        </div>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          <LoginCard who="client" active={isClient} onPick={() => setWho("client")}
            Icon={UserRound} title="Client Portal"
            points={["Your proposal, package & add-ons", "Contract, signing & payments", "Questionnaire & your playlist", "Timeline, documents & updates"]} />
          <LoginCard who="artist" active={!isClient} onPick={() => setWho("artist")}
            Icon={Music} title="Artist Portal"
            points={["Gig offers to accept or decline", "Call times, wardrobe & travel", "Set lists, charts & music", "Your calendar, pay & documents"]} />
        </div>
      </section>

      {/* Login screen */}
      <section id="login" style={{ maxWidth: 1080, margin: "0 auto", padding: "36px 22px 20px" }}>
        <div style={{ display: "grid", gap: 22, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", alignItems: "center" }}>
          {/* Login card */}
          <AnimatePresence mode="wait">
            <motion.div key={who} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
              style={{ background: C.paper, border: `1px solid ${C.border}`, borderTop: `3px solid ${isClient ? C.gold : C.ink}`, borderRadius: 4, padding: "28px 26px", maxWidth: 420, margin: "0 auto", width: "100%", boxShadow: "0 12px 40px rgba(20,18,16,0.06)" }}>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 600, letterSpacing: 1.5, color: C.ink }}>TROY CURTIS <span style={{ color: C.gold }}>ENTERTAINMENT</span></div>
                <div style={{ fontFamily: SANS, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: isClient ? C.gold : C.sub, marginTop: 8, fontWeight: 700 }}>
                  {isClient ? "Client Sign In" : "Artist Sign In"}
                </div>
              </div>

              <label style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: C.sub }}>Email</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${C.border}`, borderRadius: 3, padding: "11px 12px", marginTop: 6, marginBottom: 14, background: C.warm }}>
                <Mail size={15} color={C.muted} />
                <span style={{ fontFamily: SANS, fontSize: 13.5, color: C.muted }}>{isClient ? "sarah@email.com" : "marcus@email.com"}</span>
              </div>

              <button style={{ width: "100%", fontFamily: SANS, fontSize: 12.5, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: "#FFF", background: isClient ? C.gold : C.ink, border: "none", borderRadius: 3, padding: "13px 0", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <KeyRound size={15} /> Email me a secure link
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0" }}>
                <span style={{ flex: 1, height: 1, background: C.border }} />
                <span style={{ fontFamily: SANS, fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>or password</span>
                <span style={{ flex: 1, height: 1, background: C.border }} />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${C.border}`, borderRadius: 3, padding: "11px 12px", marginBottom: 14, background: C.warm }}>
                <Lock size={15} color={C.muted} />
                <span style={{ fontFamily: SANS, fontSize: 13.5, color: C.muted, letterSpacing: 2 }}>••••••••</span>
              </div>

              <Link href="/clients/tce-entertainment/branded-portal" style={{ width: "100%", boxSizing: "border-box", fontFamily: SANS, fontSize: 12.5, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: isClient ? C.gold : C.ink, background: "transparent", border: `1px solid ${isClient ? C.gold : C.ink}`, borderRadius: 3, padding: "12px 0", cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                Sign in <ChevronRight size={15} />
              </Link>

              <div style={{ fontFamily: SANS, fontSize: 11, color: C.muted, textAlign: "center", marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6, justifyContent: "center", width: "100%" }}>
                <ShieldCheck size={12} color={C.gold} /> Secure. You only ever see your own {isClient ? "event" : "gigs"}.
              </div>
            </motion.div>
          </AnimatePresence>

          {/* How login works */}
          <div>
            <div style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: C.gold }}>How it works</div>
            <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, color: C.ink, margin: "6px 0 16px" }}>Secure, simple, and private by design</h2>
            {[
              { Icon: KeyRound, t: "One-tap or password", b: "Sign in with a secure magic link sent to your email, or a normal email and password. No hassle." },
              { Icon: ShieldCheck, t: "You only see your own", b: "Clients see only their event. Artists see only their gigs. Nobody ever crosses into the other side." },
              { Icon: Sparkles, t: "Right on the website", b: "Both logins live on the TCE site, fully branded, so it feels like part of your world, not an outside tool." },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 13, alignItems: "flex-start", marginBottom: 14 }}>
                <span style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 3, background: C.warm2, border: `1px solid ${C.border}`, display: "grid", placeItems: "center" }}>
                  <r.Icon size={17} color={C.gold} />
                </span>
                <div>
                  <div style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 600, color: C.ink }}>{r.t}</div>
                  <div style={{ fontFamily: SANS, fontSize: 13, color: C.sub, lineHeight: 1.55, marginTop: 2 }}>{r.b}</div>
                </div>
              </div>
            ))}
            <div style={{ fontFamily: SANS, fontSize: 12.5, color: C.sub, background: C.warm, border: `1px solid ${C.border}`, borderRadius: 4, padding: "12px 14px", lineHeight: 1.6, display: "flex", gap: 8, alignItems: "flex-start" }}>
              <Check size={14} color={C.gold} style={{ flexShrink: 0, marginTop: 2 }} />
              Built on GoHighLevel&apos;s secure client portal, white-labeled to a TCE domain like portal.troycurtisentertainment.com.
            </div>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section style={{ maxWidth: 1080, margin: "30px auto 0", padding: "0 22px 56px" }}>
        <div style={{ background: C.dark, borderRadius: 6, padding: "34px 26px", textAlign: "center" }}>
          <div style={{ fontFamily: SCRIPT, fontSize: 26, color: C.gold }}>let&apos;s make it unforgettable</div>
          <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, color: "#FBF5EC", margin: "4px 0 16px" }}>Ready to start planning?</h2>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/clients/tce-entertainment/booking-form" style={{ fontFamily: SANS, fontSize: 12.5, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: C.ink, background: C.gold, borderRadius: 2, padding: "13px 26px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Calendar size={15} /> Start your booking
            </Link>
            <Link href="/clients/tce-entertainment/branded-portal" style={{ fontFamily: SANS, fontSize: 12.5, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: "#FBF5EC", background: "transparent", border: "1px solid #6E655B", borderRadius: 2, padding: "13px 26px", textDecoration: "none" }}>
              Explore the portal
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: C.dark, color: "#B8ADA0", borderTop: "1px solid #2A2621" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "22px", display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: SERIF, fontSize: 15, letterSpacing: 1.5, color: "#EFE7DC" }}>TROY CURTIS <span style={{ color: C.gold }}>ENTERTAINMENT</span></div>
          <div style={{ fontFamily: SANS, fontSize: 11.5 }}>Sample by Benjamin Yson · BVN · styled in the TCE brand</div>
        </div>
      </footer>
    </main>
  );
}

function LoginCard({ who, active, onPick, Icon, title, points }: { who: Who; active: boolean; onPick: () => void; Icon: typeof UserRound; title: string; points: string[] }) {
  const accent = who === "client" ? C.gold : C.ink;
  return (
    <div style={{ background: active ? C.warm2 : C.paper, border: `1px solid ${active ? accent + "66" : C.border}`, borderTop: `3px solid ${accent}`, borderRadius: 4, padding: "22px 22px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
        <span style={{ width: 40, height: 40, borderRadius: 4, background: C.paper, border: `1px solid ${C.border}`, display: "grid", placeItems: "center" }}>
          <Icon size={19} color={accent} />
        </span>
        <div style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 600, color: C.ink }}>{title}</div>
      </div>
      <div style={{ display: "grid", gap: 8, marginBottom: 18 }}>
        {points.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontFamily: SANS, fontSize: 13, color: C.sub, lineHeight: 1.5 }}>
            <Check size={14} color={accent} style={{ flexShrink: 0, marginTop: 2 }} /> {p}
          </div>
        ))}
      </div>
      <button onClick={onPick}
        style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: "#FFF", background: accent, border: "none", borderRadius: 2, padding: "11px 20px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
        {who === "client" ? "Client Login" : "Artist Login"} <ArrowRight size={14} />
      </button>
    </div>
  );
}
