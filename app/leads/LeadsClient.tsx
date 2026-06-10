"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Search, Mail, MapPin, Clock, CheckCircle2, XCircle,
  Send, Check, AlertCircle, Inbox, RefreshCw, MessageCircle, Loader2, Phone,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────
export type SentLead = {
  business: string;
  contactName?: string;
  email: string;
  phone?: string;
  dateSent: string;
  batch: string;
  service: string;
  serviceUrl: string;
  location: string;
  subject: string;
  signal: string;
  followUpDue: string | null;
};
export type PendingLead = {
  business: string;
  email: string;
  phone?: string;
  service: string;
  serviceUrl: string;
  location: string;
  subject: string;
  signal: string;
  emailSource: string;
  queuedIn: string;
};
export type LeadsData = {
  generatedAt: string;
  followUpDays: number;
  stats: { sent: number; pending: number };
  sent: SentLead[];
  pending: PendingLead[];
};

type Status = "new" | "followed-up" | "replied" | "closed";
type StatusMap = Record<string, Status>;
const STORE_KEY = "bvn-leads-status";

const STATUS_META: Record<Status, { label: string; cls: string }> = {
  "new": { label: "Awaiting reply", cls: "bg-white/10 text-white/70 border-white/15" },
  "followed-up": { label: "Followed up", cls: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  "replied": { label: "Replied", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  "closed": { label: "Closed", cls: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
};

const today = () => new Date().toISOString().slice(0, 10);
const serviceLabel = (s: string) => (s ? s.split("/").pop()!.replace(/-/g, " ") : "what we discussed");
const waDigits = (phone: string) => (phone || "").replace(/[^\d]/g, "");

function waLink(phone: string, business: string, contactName: string | undefined, service: string) {
  const who = contactName ? ` ${contactName}` : "";
  const msg =
    `Hi${who}, this is Bevin from BVN (bvnofficial.com). I emailed you about ${serviceLabel(service)} for ${business} — ` +
    `happy to share a quick example if useful. Worth a short chat?`;
  return `https://wa.me/${waDigits(phone)}?text=${encodeURIComponent(msg)}`;
}

// ── Component ─────────────────────────────────────────────────────
export default function LeadsClient({ data }: { data: LeadsData }) {
  const [statuses, setStatuses] = useState<StatusMap>({});
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "due" | "replied" | "closed" | "pending">("all");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) setStatuses(JSON.parse(raw));
    } catch {}
  }, []);
  const setStatus = (email: string, s: Status) => {
    setStatuses((prev) => {
      const next = { ...prev, [email.toLowerCase()]: s };
      try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };
  const statusOf = (email: string): Status => statuses[email.toLowerCase()] || "new";

  const isDue = (l: SentLead) => {
    const s = statusOf(l.email);
    return s === "new" && !!l.followUpDue && l.followUpDue <= today();
  };

  const counts = useMemo(() => {
    let due = 0, replied = 0, closed = 0;
    for (const l of data.sent) {
      const s = statusOf(l.email);
      if (s === "replied") replied++;
      else if (s === "closed") closed++;
      if (isDue(l)) due++;
    }
    return { sent: data.sent.length, due, replied, closed, pending: data.pending.length };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, statuses]);

  const filteredSent = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.sent.filter((l) => {
      if (q && !(l.business.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || (l.location || "").toLowerCase().includes(q))) return false;
      const s = statusOf(l.email);
      if (filter === "due") return isDue(l);
      if (filter === "replied") return s === "replied";
      if (filter === "closed") return s === "closed";
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.sent, query, filter, statuses]);

  const tabs: { id: typeof filter; label: string; n: number }[] = [
    { id: "all", label: "All sent", n: counts.sent },
    { id: "due", label: "Follow-up due", n: counts.due },
    { id: "replied", label: "Replied", n: counts.replied },
    { id: "closed", label: "Closed", n: counts.closed },
    { id: "pending", label: "Pending email", n: counts.pending },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 md:px-10 py-4 border-b border-white/10 bg-[#0A0F1E]/80 backdrop-blur-xl sticky top-0 z-20">
        <Link href="/dashboard" className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-accent font-semibold transition-colors">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange/20 flex items-center justify-center">
            <Send size={14} className="text-orange" />
          </div>
          <span className="text-white/85 text-sm font-accent font-semibold">Lead Tracker</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-white/30 text-xs">
          <RefreshCw size={11} />
          {data.generatedAt ? new Date(data.generatedAt).toLocaleString() : "—"}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <h1 className="font-heading font-extrabold text-2xl md:text-3xl mb-1">Sent &amp; Follow-up Emails</h1>
        <p className="text-white/45 text-sm mb-6">
          Every cold email BVN has sent. Send a follow-up or message on WhatsApp in one click. Status is saved in your browser.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-7">
          {[
            { label: "Total sent", val: counts.sent, icon: Send, cls: "text-white" },
            { label: "Follow-up due", val: counts.due, icon: Clock, cls: "text-orange" },
            { label: "Replied", val: counts.replied, icon: CheckCircle2, cls: "text-emerald-400" },
            { label: "Closed", val: counts.closed, icon: XCircle, cls: "text-rose-400" },
            { label: "Pending email", val: counts.pending, icon: Inbox, cls: "text-blue-300" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5">
              <div className="flex items-center gap-1.5 text-white/40 text-[11px] font-accent font-semibold uppercase tracking-wider mb-1">
                <s.icon size={12} /> {s.label}
              </div>
              <div className={`font-heading font-extrabold text-2xl ${s.cls}`}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search business, email, or location…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-orange/50 transition-colors"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-accent font-semibold border transition-colors ${
                  filter === t.id ? "bg-orange/20 border-orange/50 text-orange" : "bg-white/[0.03] border-white/10 text-white/55 hover:text-white hover:border-white/25"
                }`}
              >
                {t.label} <span className="opacity-60">{t.n}</span>
              </button>
            ))}
          </div>
        </div>

        {/* PENDING tab */}
        {filter === "pending" ? (
          <div className="space-y-2.5">
            {data.pending.length === 0 && <Empty text="No pending leads — every draft has a verified email." />}
            {data.pending.map((l, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="font-heading font-bold text-white">{l.business}</span>
                  <ServiceChip service={l.service} url={l.serviceUrl} />
                  <span className="inline-flex items-center gap-1 text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/25 rounded-full px-2 py-0.5">
                    <AlertCircle size={11} /> email needed
                  </span>
                  {l.phone && (
                    <a href={waLink(l.phone, l.business, "", l.service)} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-2 py-0.5 hover:bg-emerald-500/20 transition-colors">
                      <MessageCircle size={11} /> WhatsApp
                    </a>
                  )}
                </div>
                {l.location && <div className="flex items-center gap-1 text-white/40 text-xs mb-1"><MapPin size={11} /> {l.location}</div>}
                <p className="text-white/55 text-sm mb-1">{l.signal}</p>
                <p className="text-white/35 text-xs">Find email: {l.emailSource}</p>
              </div>
            ))}
          </div>
        ) : (
          /* SENT table */
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <thead>
                  <tr className="bg-white/[0.04] text-white/40 text-[11px] uppercase tracking-wider font-accent">
                    <th className="text-left font-semibold px-4 py-3">Business</th>
                    <th className="text-left font-semibold px-4 py-3">Service</th>
                    <th className="text-left font-semibold px-4 py-3">Sent</th>
                    <th className="text-left font-semibold px-4 py-3">Follow-up</th>
                    <th className="text-left font-semibold px-4 py-3">Status</th>
                    <th className="text-right font-semibold px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSent.length === 0 && (
                    <tr><td colSpan={6}><Empty text="No leads match this view." /></td></tr>
                  )}
                  {filteredSent.map((l) => {
                    const due = isDue(l);
                    const st = statusOf(l.email);
                    return (
                      <tr key={l.email} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3 align-top">
                          <div className="font-semibold text-white">{l.business}</div>
                          <a href={`mailto:${l.email}`} className="inline-flex items-center gap-1 text-white/45 text-xs hover:text-orange transition-colors">
                            <Mail size={11} /> {l.email}
                          </a>
                          {l.phone && (
                            <a href={`tel:${l.phone}`} className="flex items-center gap-1 text-white/30 text-xs mt-0.5 hover:text-white/60 transition-colors">
                              <Phone size={10} /> {l.phone}
                            </a>
                          )}
                          {l.location && <div className="flex items-center gap-1 text-white/30 text-xs mt-0.5"><MapPin size={10} /> {l.location}</div>}
                        </td>
                        <td className="px-4 py-3 align-top"><ServiceChip service={l.service} url={l.serviceUrl} /></td>
                        <td className="px-4 py-3 align-top text-white/55 whitespace-nowrap">{l.dateSent || "—"}</td>
                        <td className="px-4 py-3 align-top whitespace-nowrap">
                          {l.followUpDue ? (
                            due ? (
                              <span className="inline-flex items-center gap-1 text-orange text-xs font-semibold bg-orange/10 border border-orange/30 rounded-full px-2 py-0.5">
                                <Clock size={11} /> due {l.followUpDue}
                              </span>
                            ) : (
                              <span className="text-white/40 text-xs">{l.followUpDue}</span>
                            )
                          ) : <span className="text-white/25 text-xs">—</span>}
                        </td>
                        <td className="px-4 py-3 align-top">
                          <select
                            value={st}
                            onChange={(e) => setStatus(l.email, e.target.value as Status)}
                            className={`text-xs rounded-lg border px-2 py-1 outline-none cursor-pointer ${STATUS_META[st].cls}`}
                          >
                            <option value="new">Awaiting reply</option>
                            <option value="followed-up">Followed up</option>
                            <option value="replied">Replied</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <div className="flex items-center justify-end gap-2">
                            {l.phone && (
                              <a href={waLink(l.phone, l.business, l.contactName, l.service)} target="_blank" rel="noopener noreferrer"
                                title="Message on WhatsApp"
                                className="inline-flex items-center gap-1.5 text-xs font-accent font-semibold text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 hover:border-emerald-400/60 bg-emerald-500/10 rounded-lg px-2.5 py-1.5 transition-colors">
                                <MessageCircle size={13} /> WhatsApp
                              </a>
                            )}
                            <FollowUpButton lead={l} onSent={() => setStatus(l.email, "followed-up")} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-white/25 text-xs mt-5">
          Follow-ups send from bvn@bvnofficial.com (cc&apos;d to bvn@) and are recorded in your Sent folder. WhatsApp opens a pre-filled chat — you hit send.
        </p>
      </div>
    </div>
  );
}

// ── Send-follow-up button with inline confirm ─────────────────────
function FollowUpButton({ lead, onSent }: { lead: SentLead; onSent: () => void }) {
  const [state, setState] = useState<"idle" | "confirm" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState("");

  async function send() {
    setState("sending");
    setErr("");
    try {
      const res = await fetch("/api/leads-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: lead.email, business: lead.business, contactName: lead.contactName || "", service: lead.service }),
      });
      if (res.ok) {
        setState("sent");
        onSent();
      } else {
        const j = await res.json().catch(() => ({}));
        setErr(j.error || "Send failed");
        setState("error");
      }
    } catch {
      setErr("Network error");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-accent font-semibold text-emerald-300 border border-emerald-500/30 bg-emerald-500/10 rounded-lg px-2.5 py-1.5">
        <Check size={13} /> Follow-up sent
      </span>
    );
  }
  if (state === "sending") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-accent font-semibold text-white/60 border border-white/10 rounded-lg px-2.5 py-1.5">
        <Loader2 size={13} className="animate-spin" /> Sending…
      </span>
    );
  }
  if (state === "confirm") {
    return (
      <span className="inline-flex items-center gap-1">
        <button onClick={send}
          className="inline-flex items-center gap-1.5 text-xs font-accent font-semibold text-white bg-orange hover:bg-orange/90 rounded-lg px-2.5 py-1.5 transition-colors">
          <Send size={12} /> Confirm send
        </button>
        <button onClick={() => setState("idle")} title="Cancel"
          className="text-white/40 hover:text-white border border-white/10 rounded-lg px-2 py-1.5 transition-colors">
          <XCircle size={13} />
        </button>
      </span>
    );
  }
  return (
    <span className="inline-flex flex-col items-end gap-0.5">
      <button onClick={() => setState("confirm")}
        title="Send a follow-up email now"
        className="inline-flex items-center gap-1.5 text-xs font-accent font-semibold text-white/70 hover:text-orange border border-white/10 hover:border-orange/40 rounded-lg px-2.5 py-1.5 transition-colors">
        <Send size={13} /> Send follow-up
      </button>
      {state === "error" && <span className="text-rose-400 text-[10px] max-w-[160px] text-right">{err}</span>}
    </span>
  );
}

function ServiceChip({ service, url }: { service: string; url: string }) {
  if (!service) return <span className="text-white/25 text-xs">—</span>;
  const label = service.replace(/^(marketing|operations)\//, "").replace(/-/g, " ");
  const branch = service.startsWith("operations") ? "Ops" : "Mktg";
  const inner = (
    <span className="inline-flex items-center gap-1 text-[11px] font-accent font-semibold rounded-full px-2 py-0.5 border bg-white/[0.05] border-white/15 text-white/70 capitalize">
      <span className={branch === "Ops" ? "text-blue-300" : "text-orange"}>{branch}</span> · {label}
    </span>
  );
  return url ? <a href={url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">{inner}</a> : inner;
}

function Empty({ text }: { text: string }) {
  return <div className="text-center text-white/35 text-sm py-10">{text}</div>;
}
