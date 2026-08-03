"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, LayoutDashboard, Users, Briefcase, Brain, CheckSquare, Square,
  TrendingUp, CircleDot, ExternalLink, Zap, Home, Wrench, Calendar,
  StickyNote, Timer, Play, Pause, RotateCcw,
  FileText, Copy, X, Loader2, AlertTriangle, Check,
} from "lucide-react";
import type {
  CommandProfile, PipelineClient, JobLead, BrainItem, TodayItem, Health, PipelineStage,
} from "@/data/command-center";
import BvnAssistant from "./BvnAssistant";

interface Props {
  adminEmail: string;
  profile: CommandProfile;
  pipeline: PipelineClient[];
  jobs: JobLead[];
  brain: BrainItem[];
  today: TodayItem[];
}

type TabId = "home" | "clients" | "leads" | "productivity";

const healthDot: Record<Health, string> = {
  green: "bg-emerald-400",
  yellow: "bg-amber-400",
  red: "bg-red-400",
};

const stageLabel: Record<PipelineStage, string> = {
  lead: "Lead", contacted: "Contacted", proposal: "Proposal",
  negotiation: "Negotiation", won: "Won", active: "Active", done: "Done",
};

const stageTone: Record<PipelineStage, string> = {
  lead: "text-white/50 bg-white/5",
  contacted: "text-sky-300 bg-sky-500/10",
  proposal: "text-violet-300 bg-violet-500/10",
  negotiation: "text-amber-300 bg-amber-500/10",
  won: "text-emerald-300 bg-emerald-500/10",
  active: "text-orange bg-orange/10",
  done: "text-white/40 bg-white/5",
};

const jobStatusTone: Record<JobLead["status"], string> = {
  new: "text-sky-300 bg-sky-500/10 border-sky-500/20",
  drafted: "text-violet-300 bg-violet-500/10 border-violet-500/20",
  applied: "text-amber-300 bg-amber-500/10 border-amber-500/20",
  replied: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
  passed: "text-white/40 bg-white/5 border-white/10",
};

// Handy shortcuts into the tools that already live on the site.
const TOOLS = [
  { label: "Invoice", href: "/apps/invoice-generator" },
  { label: "Proposal", href: "/apps/proposal-generator" },
  { label: "Contract", href: "/apps/contract-generator" },
  { label: "Onboarding kit", href: "/apps/onboarding-kit-generator" },
  { label: "QR code", href: "/apps/qr-code-generator" },
  { label: "UTM builder", href: "/apps/utm-builder" },
  { label: "Leads inbox", href: "/leads" },
  { label: "Case studies", href: "/case-studies" },
];

export default function CommandCenterClient({
  adminEmail, profile, pipeline, jobs, brain, today,
}: Props) {
  // Active tab, persisted so a refresh keeps you where you were.
  const [tab, setTab] = useState<TabId>("home");
  useEffect(() => {
    try {
      const t = localStorage.getItem("bvn-command-tab") as TabId | null;
      if (t) setTab(t);
    } catch {}
  }, []);
  function goTab(t: TabId) {
    setTab(t);
    try { localStorage.setItem("bvn-command-tab", t); } catch {}
  }

  // Today tasks: completion persisted in localStorage (same pattern as Work HQ).
  const [done, setDone] = useState<Record<string, boolean>>({});
  useEffect(() => {
    try {
      const raw = localStorage.getItem("bvn-command-today");
      if (raw) setDone(JSON.parse(raw));
    } catch {}
  }, []);
  function toggle(id: string) {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem("bvn-command-today", JSON.stringify(next)); } catch {}
      return next;
    });
  }

  // Quick notes scratchpad (Productivity tab), persisted locally.
  const [notes, setNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);
  useEffect(() => {
    try { setNotes(localStorage.getItem("bvn-command-notes") || ""); } catch {}
  }, []);
  function saveNotes(v: string) {
    setNotes(v);
    try { localStorage.setItem("bvn-command-notes", v); } catch {}
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 1200);
  }

  // Focus timer (Productivity tab). Simple, self-contained countdown.
  const [secs, setSecs] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (running && secs > 0) {
      tick.current = setInterval(() => setSecs((s) => (s <= 1 ? 0 : s - 1)), 1000);
    }
    return () => { if (tick.current) clearInterval(tick.current); };
  }, [running, secs]);
  useEffect(() => { if (secs === 0) setRunning(false); }, [secs]);
  const mmss = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
  function setPreset(mins: number) { setRunning(false); setSecs(mins * 60); }

  // Application drafting (draft only — never auto-sends).
  const [draftFor, setDraftFor] = useState<JobLead | null>(null);
  const [draftText, setDraftText] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [draftErr, setDraftErr] = useState("");
  const [copied, setCopied] = useState(false);

  async function draftApplication(job: JobLead) {
    setDraftFor(job); setDraftText(""); setDraftErr(""); setCopied(false); setDrafting(true);
    try {
      const res = await fetch("/api/command/draft-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: job.title, source: job.source, snippet: job.snippet, url: job.url }),
      });
      const d = await res.json();
      if (res.ok && d.draft) setDraftText(d.draft);
      else setDraftErr(d.error || "Could not draft the application.");
    } catch {
      setDraftErr("Network error. Please try again.");
    } finally {
      setDrafting(false);
    }
  }
  function copyDraft() {
    navigator.clipboard.writeText(draftText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const activeClients = pipeline.filter((c) => c.stage === "active").length;
  const openJobs = jobs.filter((j) => j.status !== "passed").length;
  const applied = jobs.filter((j) => j.status === "applied" || j.status === "replied").length;
  const openTasks = today.filter((t) => !done[t.id]).length;

  const stats = [
    { icon: Users, label: "Active clients", value: activeClients, tone: "text-orange", tab: "clients" as TabId },
    { icon: Briefcase, label: "Open job leads", value: openJobs, tone: "text-sky-400", tab: "leads" as TabId },
    { icon: TrendingUp, label: "Applied / replied", value: applied, tone: "text-emerald-400", tab: "leads" as TabId },
    { icon: CheckSquare, label: "Tasks left today", value: openTasks, tone: "text-amber-400", tab: "home" as TabId },
  ];

  const today0 = useMemo(
    () => new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
    []
  );

  const highTasks = today.filter((t) => t.priority === "high" && !done[t.id]);

  // Grounding context handed to the BVN assistant (free, client-side model).
  const bvnContext = useMemo(() => {
    const clients = pipeline.map((c) => `- ${c.name} [${c.stage}, ${c.health}]: ${c.next}`).join("\n");
    const tasks = today.map((t) => `- (${t.priority}) ${t.text}${t.client ? ` [${t.client}]` : ""}`).join("\n");
    return `CLIENTS / PIPELINE:\n${clients}\n\nTODAY'S TASKS:\n${tasks}\n\nTARGET ROLES: ${profile.targetRoles.join("; ")}`;
  }, [pipeline, today, profile]);

  const tabs: { id: TabId; label: string; icon: typeof Home }[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "clients", label: "Clients", icon: Users },
    { id: "leads", label: "Client Leads", icon: Briefcase },
    { id: "productivity", label: "Productivity", icon: Wrench },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1E] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Header */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-accent font-semibold text-white/40 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={13} /> Back to admin
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <Image src="/bvn-logo.png" alt="BVN" width={40} height={40} />
          <div>
            <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-heading font-bold text-white">
              BVN Command Center <Zap size={20} className="text-orange" />
            </h1>
            <p className="text-sm text-white/40 font-body">
              {today0} · {profile.headline}
            </p>
          </div>
        </div>

        {/* Tab nav */}
        <div className="flex flex-wrap gap-1.5 mb-6 border-b border-white/10 pb-3">
          {tabs.map((t) => {
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => goTab(t.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-accent font-semibold transition-colors ${
                  on
                    ? "bg-orange/15 border border-orange/30 text-orange"
                    : "bg-white/5 border border-white/10 text-white/50 hover:text-white/80"
                }`}
              >
                <t.icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Stat tiles — clickable, jump to the relevant tab */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {stats.map((s) => (
            <button
              key={s.label}
              onClick={() => goTab(s.tab)}
              className="text-left bg-[#111827] border border-white/10 rounded-2xl p-4 hover:border-white/25 transition-colors"
            >
              <div className="flex items-center gap-1.5 text-white/40 text-[11px] font-accent uppercase tracking-wider mb-1">
                <s.icon size={12} /> {s.label}
              </div>
              <p className={`text-2xl font-heading font-bold ${s.tone}`}>{s.value}</p>
            </button>
          ))}
        </div>

        {/* ============================ HOME ============================ */}
        {tab === "home" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Today */}
              <section className="bg-[#111827] border border-white/10 rounded-2xl p-6">
                <h2 className="flex items-center gap-2 text-sm font-accent font-bold text-white/50 uppercase tracking-widest mb-4">
                  <CheckSquare size={14} className="text-orange" /> Today — what needs doing
                </h2>
                {today.length === 0 ? (
                  <p className="text-sm text-white/40 font-body">Nothing queued for today.</p>
                ) : (
                  <ul className="space-y-2">
                    {today.map((t) => {
                      const isDone = !!done[t.id];
                      return (
                        <li key={t.id}>
                          <button
                            onClick={() => toggle(t.id)}
                            className="w-full flex items-start gap-2.5 text-left group"
                          >
                            {isDone
                              ? <CheckSquare size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                              : <Square size={16} className="mt-0.5 shrink-0 text-white/30 group-hover:text-white/60" />}
                            <span className={`text-sm font-body leading-snug ${isDone ? "text-white/30 line-through" : "text-white/80"}`}>
                              {t.text}
                              {t.priority === "high" && !isDone && (
                                <span className="ml-2 text-[10px] font-accent uppercase tracking-wider text-orange">high</span>
                              )}
                              {t.client && <span className="ml-2 text-[11px] text-white/30">· {t.client}</span>}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>

              {/* Google Calendar — mount point (connect later) */}
              <section className="bg-[#111827] border border-white/10 rounded-2xl p-6">
                <h2 className="flex items-center gap-2 text-sm font-accent font-bold text-white/50 uppercase tracking-widest mb-3">
                  <Calendar size={14} className="text-orange" /> Schedule
                </h2>
                <div className="rounded-xl bg-white/[0.02] border border-dashed border-white/15 p-4">
                  <p className="text-sm text-white/70 font-body">Google Calendar is not connected yet.</p>
                  <p className="text-xs text-white/40 font-body mt-1 leading-relaxed">
                    Once connected, today&apos;s events auto populate here, and you can create tasks and alarms
                    straight from the command center. This needs your Google Cloud OAuth credentials to switch on.
                  </p>
                  <button
                    disabled
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 text-xs font-accent font-semibold cursor-not-allowed"
                  >
                    <Calendar size={12} /> Connect Google Calendar
                  </button>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              {/* Quick status: high-priority focus */}
              <section className="bg-gradient-to-br from-orange/10 to-[#111827] border border-orange/20 rounded-2xl p-6">
                <h2 className="flex items-center gap-2 text-sm font-accent font-bold text-white/60 uppercase tracking-widest mb-3">
                  <Zap size={14} className="text-orange" /> Focus now
                </h2>
                {highTasks.length === 0 ? (
                  <p className="text-sm text-white/50 font-body">No high-priority tasks open. You are clear.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {highTasks.map((t) => (
                      <li key={t.id} className="flex items-start gap-2 text-sm text-white/85 font-body">
                        <CircleDot size={13} className="text-orange mt-1 shrink-0" />
                        <span>{t.text}{t.client && <span className="text-white/40"> · {t.client}</span>}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Brain feed */}
              <section className="bg-[#111827] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="flex items-center gap-2 text-sm font-accent font-bold text-white/50 uppercase tracking-widest">
                    <Brain size={14} className="text-orange" /> Brain — recent
                  </h2>
                  <span className="text-[11px] font-body text-white/30">CLAUDE BRAIN vault</span>
                </div>
                <ul className="space-y-1.5">
                  {brain.map((b) => (
                    <li key={b.path} className="flex items-center gap-2 text-sm">
                      <LayoutDashboard size={13} className="text-white/25 shrink-0" />
                      <span className="text-white/80 font-body truncate">{b.title}</span>
                      <span className="text-[10px] font-accent uppercase tracking-wider text-white/30">{b.kind}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* BVN assistant — voice + chat, grounded in the command-center state */}
            <div className="lg:col-span-2">
              <BvnAssistant context={bvnContext} />
            </div>
          </div>
        )}

        {/* ============================ CLIENTS ============================ */}
        {tab === "clients" && (
          <section className="bg-[#111827] border border-white/10 rounded-2xl p-6">
            <h2 className="flex items-center gap-2 text-sm font-accent font-bold text-white/50 uppercase tracking-widest mb-4">
              <Users size={14} className="text-orange" /> Clients — lock &amp; close
            </h2>
            <div className="grid md:grid-cols-2 gap-2.5">
              {pipeline.map((c) => (
                <div key={c.slug} className="flex items-start gap-3 rounded-xl bg-white/[0.02] border border-white/5 p-3">
                  <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${healthDot[c.health]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-heading font-semibold text-white">{c.name}</p>
                      <span className={`text-[10px] font-accent uppercase tracking-wider px-2 py-0.5 rounded-md ${stageTone[c.stage]}`}>
                        {stageLabel[c.stage]}
                      </span>
                      {typeof c.value === "number" && (
                        <span className="text-[11px] font-body text-emerald-400/80">${c.value.toLocaleString()}</span>
                      )}
                    </div>
                    <p className="text-xs text-white/50 font-body mt-0.5">{c.next}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================= CLIENT LEADS ========================= */}
        {tab === "leads" && (
          <section className="bg-[#111827] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 text-sm font-accent font-bold text-white/50 uppercase tracking-widest">
                <Briefcase size={14} className="text-orange" /> Client leads
              </h2>
              <span className="text-[11px] font-body text-white/30">fed by Slack scraper</span>
            </div>
            {jobs.length === 0 ? (
              <p className="text-sm text-white/40 font-body">
                No leads pass the relevance bar yet. The scraper runs hourly and feeds matching posts here after the next sync.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {jobs.map((j) => (
                  <div key={j.id} className="rounded-xl bg-white/[0.02] border border-white/5 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-heading font-semibold text-white leading-snug">{j.title}</p>
                      <span className={`shrink-0 text-[10px] font-accent uppercase tracking-wider px-2 py-0.5 rounded-md border ${jobStatusTone[j.status]}`}>
                        {j.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] font-body text-white/40">
                      <span className="inline-flex items-center gap-1 text-orange/90"><CircleDot size={11} /> {j.relevance}% match</span>
                      <span>· {j.source}</span>
                      {j.postedAt && <span>· {new Date(j.postedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>}
                      {j.url && (
                        <a href={j.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-sky-400 hover:text-sky-300">
                          open <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                    {j.snippet && <p className="text-xs text-white/50 font-body mt-1.5 leading-snug">{j.snippet}</p>}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {j.tags.map((t) => (
                        <span key={t} className="text-[10px] font-accent bg-orange/10 border border-orange/20 text-orange/90 px-1.5 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                    <button
                      onClick={() => draftApplication(j)}
                      className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange/10 border border-orange/25 text-orange text-[11px] font-accent font-semibold hover:bg-orange/20 transition-all"
                    >
                      <FileText size={11} /> Draft application
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ======================== PRODUCTIVITY ======================== */}
        {tab === "productivity" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Quick notes */}
            <section className="bg-[#111827] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="flex items-center gap-2 text-sm font-accent font-bold text-white/50 uppercase tracking-widest">
                  <StickyNote size={14} className="text-orange" /> Quick notes
                </h2>
                {notesSaved && <span className="text-[11px] font-accent text-emerald-400">saved</span>}
              </div>
              <textarea
                value={notes}
                onChange={(e) => saveNotes(e.target.value)}
                placeholder="Jot anything. Saved on this device automatically."
                className="w-full h-56 rounded-xl bg-black/20 border border-white/10 p-3 text-sm text-white/85 font-body placeholder-white/25 focus:outline-none focus:border-orange/40 resize-none"
              />
            </section>

            <div className="space-y-6">
              {/* Focus timer */}
              <section className="bg-[#111827] border border-white/10 rounded-2xl p-6">
                <h2 className="flex items-center gap-2 text-sm font-accent font-bold text-white/50 uppercase tracking-widest mb-4">
                  <Timer size={14} className="text-orange" /> Focus timer
                </h2>
                <p className="text-5xl font-heading font-bold text-white text-center tabular-nums mb-4">{mmss}</p>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <button
                    onClick={() => setRunning((r) => !r)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange text-white text-xs font-accent font-semibold hover:bg-orange-light transition-all"
                  >
                    {running ? <><Pause size={13} /> Pause</> : <><Play size={13} /> Start</>}
                  </button>
                  <button
                    onClick={() => setPreset(25)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs font-accent font-semibold hover:text-white transition-colors"
                  >
                    <RotateCcw size={13} /> Reset
                  </button>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  {[15, 25, 50].map((m) => (
                    <button
                      key={m}
                      onClick={() => setPreset(m)}
                      className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/50 text-[11px] font-accent hover:text-white transition-colors"
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </section>

              {/* Tool shortcuts */}
              <section className="bg-[#111827] border border-white/10 rounded-2xl p-6">
                <h2 className="flex items-center gap-2 text-sm font-accent font-bold text-white/50 uppercase tracking-widest mb-4">
                  <Wrench size={14} className="text-orange" /> Tools
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {TOOLS.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="inline-flex items-center justify-between gap-2 rounded-xl bg-white/[0.02] border border-white/10 px-3 py-2 text-sm font-body text-white/75 hover:border-orange/30 hover:text-white transition-colors"
                    >
                      {t.label} <ExternalLink size={12} className="text-white/30" />
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* Draft application modal — review, then send yourself */}
        {draftFor && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => setDraftFor(null)}
          >
            <div
              className="w-full max-w-2xl bg-[#111827] border border-white/10 rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <h3 className="flex items-center gap-2 text-sm font-heading font-bold text-white">
                    <FileText size={15} className="text-orange" /> Draft application
                  </h3>
                  <p className="text-xs text-white/40 font-body mt-0.5 truncate">{draftFor.title}</p>
                </div>
                <button onClick={() => setDraftFor(null)} className="text-white/40 hover:text-white shrink-0">
                  <X size={18} />
                </button>
              </div>

              <div className="flex items-start gap-2 rounded-xl bg-amber-500/8 border border-amber-500/25 px-3 py-2 mb-3">
                <AlertTriangle size={14} className="text-amber-300 shrink-0 mt-0.5" />
                <p className="text-[11px] text-white/60 font-body leading-relaxed">
                  This is a draft. Review it, then send it yourself. Nothing is sent automatically.
                </p>
              </div>

              {drafting ? (
                <div className="flex items-center justify-center gap-2 text-white/50 text-sm font-body py-10">
                  <Loader2 size={16} className="animate-spin" /> Drafting from your profile…
                </div>
              ) : draftErr ? (
                <p className="text-red-300 text-sm font-body py-6">{draftErr}</p>
              ) : (
                <>
                  <pre className="whitespace-pre-wrap text-sm text-white/85 font-body bg-black/20 border border-white/10 rounded-xl p-4 leading-relaxed">
                    {draftText}
                  </pre>
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={copyDraft}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange text-white text-xs font-heading font-semibold hover:bg-orange-light transition-all"
                    >
                      {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <p className="text-white/25 text-xs font-body mt-6">
          Signed in as {adminEmail}. Data lives in <code className="text-white/40">data/command-center.ts</code>,
          regenerated from the CLAUDE BRAIN vault by the sync step so this dashboard learns every day.
        </p>
      </div>
    </div>
  );
}
