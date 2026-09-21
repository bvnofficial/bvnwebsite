"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, CheckCircle2, Loader2, Globe, MessageCircle, Video } from "lucide-react";

// Availability (kept in sync with /api/book).
const TZ_OFFSET = 8;      // Asia/Manila, no DST
const OPEN_HOUR = 9;
const CLOSE_HOUR = 18;    // last slot 17:30
const SLOT_MIN = 30;
const WINDOW_DAYS = 21;

type Slot = { iso: string; label: string };
type Day = { key: string; label: string; slots: Slot[] };

// Build the bookable days/slots starting tomorrow (Manila), Mon–Fri only.
function buildDays(tz: string): Day[] {
  const days: Day[] = [];
  const now = Date.now();
  const minStart = now + 20 * 60 * 60 * 1000; // ~1 day ahead
  const dayFmt = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "short", day: "numeric", timeZone: tz });
  const timeFmt = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit", timeZone: tz });

  // Iterate calendar days in Manila from today to +WINDOW_DAYS.
  const manNow = new Date(now + TZ_OFFSET * 3600 * 1000);
  for (let i = 0; i <= WINDOW_DAYS; i++) {
    const y = manNow.getUTCFullYear();
    const mo = manNow.getUTCMonth();
    const d = manNow.getUTCDate() + i;
    const probe = new Date(Date.UTC(y, mo, d, 12 - TZ_OFFSET, 0)); // midday Manila
    const dow = new Date(probe.getTime() + TZ_OFFSET * 3600 * 1000).getUTCDay();
    if (dow === 0 || dow === 6) continue; // skip weekends
    const slots: Slot[] = [];
    for (let h = OPEN_HOUR; h < CLOSE_HOUR; h++) {
      for (let m = 0; m < 60; m += SLOT_MIN) {
        const slotUtc = new Date(Date.UTC(y, mo, d, h - TZ_OFFSET, m));
        if (slotUtc.getTime() < minStart) continue;
        slots.push({ iso: slotUtc.toISOString(), label: timeFmt.format(slotUtc) });
      }
    }
    if (!slots.length) continue;
    const anchor = new Date(Date.UTC(y, mo, d, 12 - TZ_OFFSET, 0));
    days.push({ key: `${y}-${mo}-${d}`, label: dayFmt.format(anchor), slots });
  }
  return days;
}

function icsFor(iso: string, name: string): string {
  const start = new Date(iso);
  const end = new Date(start.getTime() + SLOT_MIN * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const uid = "bvn-" + start.getTime() + "@bvnofficial.com";
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//BVN//Booking//EN", "BEGIN:VEVENT",
    `UID:${uid}`, `DTSTAMP:${fmt(new Date())}`, `DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`,
    `SUMMARY:Call with Benjamin (BVN)`,
    `DESCRIPTION:30 minute call with Benjamin Vincent Yson (BVN). We will send the meeting link before the call. Questions? WhatsApp +63 981 655 6555.`,
    "ORGANIZER;CN=Benjamin Vincent Yson:mailto:bvn@bvnofficial.com",
    `ATTENDEE;CN=${name}:mailto:noreply@bvnofficial.com`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}

export default function BookPage() {
  const [tz, setTz] = useState("Asia/Manila");
  const [days, setDays] = useState<Day[]>([]);
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [dayKey, setDayKey] = useState("");
  const [slot, setSlot] = useState<Slot | null>(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", notes: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Manila";
    setTz(detected);
    setDays(buildDays(detected));
    fetch("/api/book").then((r) => r.json()).then((d) => {
      if (Array.isArray(d.taken)) setTaken(new Set(d.taken));
    }).catch(() => {});
  }, []);

  const activeDay = useMemo(() => days.find((d) => d.key === dayKey) || days[0], [days, dayKey]);
  useEffect(() => { if (days.length && !dayKey) setDayKey(days[0].key); }, [days, dayKey]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slot) return;
    setStatus("loading"); setError("");
    try {
      const res = await fetch("/api/book", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, slot: slot.iso, tz }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  const downloadIcs = () => {
    if (!slot) return;
    const blob = new Blob([icsFor(slot.iso, form.name)], { type: "text/calendar" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "call-with-benjamin.ics"; a.click();
    URL.revokeObjectURL(a.href);
  };

  const prettyWhen = slot ? new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short", timeZone: tz }).format(new Date(slot.iso)) : "";

  if (status === "success") {
    return (
      <div className="min-h-screen bg-navy-dark flex items-center justify-center px-6 py-20">
        <div className="max-w-lg w-full bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-orange/10 flex items-center justify-center">
              <CheckCircle2 size={36} className="text-orange" />
            </div>
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-white mb-2">You&apos;re booked in</h1>
          <p className="text-white/70 text-base mb-1">{prettyWhen}</p>
          <p className="text-white/50 text-sm mb-6">A 30 minute call with Benjamin. I&apos;ll send the meeting link before we talk.</p>
          <div className="flex flex-col gap-3">
            <button onClick={downloadIcs} className="inline-flex items-center justify-center gap-2 bg-orange text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition">
              <Calendar size={18} /> Add to my calendar
            </button>
            <a href="https://wa.me/639816556555" target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/80 font-semibold px-6 py-3 rounded-xl hover:bg-white/5 transition">
              <MessageCircle size={18} /> Message me on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-dark">
      <section className="relative py-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none opacity-30" />
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange/10 border border-orange/25 text-orange text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            <Video size={12} /> Free 30 minute call
          </div>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white leading-tight mb-4">
            Book a call with <span className="text-gradient">Benjamin</span>
          </h1>
          <p className="text-white/60 text-lg">
            Pick a time that suits you. No cost, no pressure. I&apos;ll show you exactly what I&apos;d build for your business.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-2 text-white/50 text-sm mb-5">
            <Globe size={14} className="text-orange" /> Times shown in your timezone ({tz.replace(/_/g, " ")})
          </div>

          {/* Day picker */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider"><Calendar size={14} className="text-orange" /> Choose a day</div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {days.map((d) => (
                <button key={d.key} onClick={() => { setDayKey(d.key); setSlot(null); }}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl border text-sm font-semibold transition ${d.key === activeDay?.key ? "bg-orange text-white border-orange" : "border-white/15 text-white/70 hover:bg-white/5"}`}>
                  {d.label}
                </button>
              ))}
              {!days.length && <span className="text-white/40 text-sm">Loading available days…</span>}
            </div>
          </div>

          {/* Time picker */}
          {activeDay && (
            <div className="mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider"><Clock size={14} className="text-orange" /> Choose a time</div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {activeDay.slots.map((s) => {
                  const isTaken = taken.has(s.iso);
                  const active = slot?.iso === s.iso;
                  return (
                    <button key={s.iso} disabled={isTaken} onClick={() => setSlot(s)}
                      className={`px-2 py-2.5 rounded-lg border text-sm font-semibold transition ${isTaken ? "border-white/5 text-white/20 line-through cursor-not-allowed" : active ? "bg-orange text-white border-orange" : "border-white/15 text-white/75 hover:bg-white/5"}`}>
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Details form */}
          {slot && (
            <form onSubmit={submit} className="mt-7 border-t border-white/10 pt-6 flex flex-col gap-4">
              <p className="text-white/80 text-sm">Booking <span className="text-orange font-semibold">{prettyWhen}</span></p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider">Your name *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-white outline-none focus:border-orange/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider">Email *</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-white outline-none focus:border-orange/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider">Company</label>
                  <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-white outline-none focus:border-orange/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider">What do you want to talk about?</label>
                  <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-white outline-none focus:border-orange/50" />
                </div>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button type="submit" disabled={status === "loading"}
                className="inline-flex items-center justify-center gap-2 bg-orange text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-60">
                {status === "loading" ? <><Loader2 size={18} className="animate-spin" /> Booking…</> : <>Confirm booking</>}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
