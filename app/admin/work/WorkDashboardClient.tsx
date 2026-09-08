"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, LayoutDashboard, CalendarDays, Users, CheckSquare, Square,
  Wallet, Briefcase, Plus, X, CircleDot, AlertTriangle, Trash2,
} from "lucide-react";
import type {
  ClientCard, MoneyLine, AgendaItem, SeedTask, FunnelStage, Health,
} from "@/data/work-dashboard";

interface Props {
  adminEmail: string;
  clients: ClientCard[];
  money: MoneyLine[];
  agenda: AgendaItem[];
  seedTasks: SeedTask[];
  jobFunnel: FunnelStage[];
  jobNotes: string[];
}

interface CustomTask {
  id: string;
  text: string;
}

const DONE_KEY = "bvn.work.doneTasks";
const CUSTOM_KEY = "bvn.work.customTasks";

const healthDot: Record<Health, string> = {
  green: "bg-emerald-400",
  yellow: "bg-amber-400",
  red: "bg-red-400",
};
const healthLabel: Record<Health, string> = {
  green: "On track",
  yellow: "Needs attention",
  red: "Blocked",
};

function money$(n: number) {
  return "$" + n.toLocaleString();
}

export default function WorkDashboardClient({
  adminEmail, clients, money, agenda, seedTasks, jobFunnel, jobNotes,
}: Props) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [custom, setCustom] = useState<CustomTask[]>([]);
  const [newTask, setNewTask] = useState("");
  const [hydrated, setHydrated] = useState(false);

  // Load persisted state once on mount.
  useEffect(() => {
    try {
      const d = localStorage.getItem(DONE_KEY);
      const c = localStorage.getItem(CUSTOM_KEY);
      if (d) setDone(JSON.parse(d));
      if (c) setCustom(JSON.parse(c));
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  // Persist whenever they change (after hydration so we don't clobber).
  useEffect(() => {
    if (hydrated) localStorage.setItem(DONE_KEY, JSON.stringify(done));
  }, [done, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));
  }, [custom, hydrated]);

  function toggle(id: string) {
    setDone((prev) => ({ ...prev, [id]: !prev[id] }));
  }
  function addTask() {
    const text = newTask.trim();
    if (!text) return;
    setCustom((prev) => [...prev, { id: "c-" + Date.now(), text }]);
    setNewTask("");
  }
  function removeCustom(id: string) {
    setCustom((prev) => prev.filter((t) => t.id !== id));
    setDone((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  const allTasks = useMemo(
    () => [
      ...seedTasks.map((t) => ({ ...t, custom: false as const })),
      ...custom.map((t) => ({
        id: t.id, text: t.text, client: undefined as string | undefined,
        priority: "normal" as const, custom: true as const,
      })),
    ],
    [seedTasks, custom]
  );

  const openCount = allTasks.filter((t) => !done[t.id]).length;

  // KPIs.
  const owed = money
    .filter((m) => m.status === "owed" && m.amount)
    .reduce((s, m) => s + (m.amount || 0), 0);
  const upcoming = money
    .filter((m) => m.status === "upcoming" && m.amount)
    .reduce((s, m) => s + (m.amount || 0), 0);
  const paid = money
    .filter((m) => m.status === "paid" && m.amount)
    .reduce((s, m) => s + (m.amount || 0), 0);
  const needsAttention = clients.filter((c) => c.health !== "green").length;

  const today = new Date().toLocaleDateString("en-AU", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const sortedAgenda = [...agenda].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="min-h-screen bg-navy-dark pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Header */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-accent font-semibold text-white/40 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={13} /> Back to admin
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Image src="/bvn-logo.png" alt="BVN" width={40} height={40} />
          <div>
            <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-heading font-bold text-white">
              Work HQ <LayoutDashboard size={20} className="text-orange" />
            </h1>
            <p className="text-sm text-white/40 font-body">{today}</p>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <Kpi label="Owed now" value={money$(owed)} accent="text-amber-400" />
          <Kpi label="Open tasks" value={String(openCount)} accent="text-orange" />
          <Kpi label="Active clients" value={String(clients.length)} sub={`${needsAttention} need attention`} />
          <Kpi label="Upcoming revenue" value={money$(upcoming)} accent="text-emerald-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left column: tasks + agenda */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            {/* Today's tasks */}
            <Card icon={<CheckSquare size={14} className="text-orange" />} title="Today's tasks">
              <ul className="space-y-1.5">
                {allTasks.map((t) => {
                  const isDone = !!done[t.id];
                  return (
                    <li key={t.id} className="flex items-start gap-2 group">
                      <button
                        onClick={() => toggle(t.id)}
                        className="mt-0.5 shrink-0 text-white/50 hover:text-orange transition-colors"
                        aria-label={isDone ? "Mark incomplete" : "Mark complete"}
                      >
                        {isDone ? <CheckSquare size={16} className="text-orange" /> : <Square size={16} />}
                      </button>
                      <span className={`flex-1 text-sm font-body leading-snug ${isDone ? "text-white/30 line-through" : "text-white/80"}`}>
                        {t.priority === "high" && !isDone && (
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange mr-1.5 align-middle" />
                        )}
                        {t.text}
                        {t.client && <span className="text-white/30"> · {t.client}</span>}
                      </span>
                      {t.custom && (
                        <button
                          onClick={() => removeCustom(t.id)}
                          className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition"
                          aria-label="Delete task"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className="flex items-center gap-2 mt-4">
                <input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  placeholder="Add a task"
                  className="flex-1 bg-navy-dark border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/25 font-body focus:outline-none focus:border-orange/60"
                />
                <button
                  onClick={addTask}
                  className="shrink-0 bg-orange/90 hover:bg-orange text-white rounded-lg p-1.5 transition"
                  aria-label="Add task"
                >
                  <Plus size={16} />
                </button>
              </div>
            </Card>

            {/* Agenda */}
            <Card icon={<CalendarDays size={14} className="text-orange" />} title="Agenda">
              {sortedAgenda.length === 0 ? (
                <p className="text-sm text-white/30 font-body">No dated items yet.</p>
              ) : (
                <ul className="space-y-2.5">
                  {sortedAgenda.map((a, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="shrink-0 text-center w-11">
                        <div className="text-[10px] font-accent uppercase text-white/30">
                          {new Date(a.date).toLocaleDateString("en-AU", { month: "short" })}
                        </div>
                        <div className="text-base font-heading font-bold text-white/70 leading-none">
                          {new Date(a.date).getDate()}
                        </div>
                      </div>
                      <div className="flex-1 border-l border-white/10 pl-3">
                        <p className={`text-sm font-body leading-snug ${a.done ? "text-white/40" : "text-white/85"}`}>
                          {a.title}
                        </p>
                        {a.client && <span className="text-xs text-white/30">{a.client}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          {/* Middle + right: clients, money, jobs */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Active clients */}
            <Card icon={<Users size={14} className="text-orange" />} title="Active clients">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {clients.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/clients/${c.slug}`}
                    className="block bg-navy-dark border border-white/10 rounded-xl p-4 hover:border-orange/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-sm font-heading font-bold text-white">{c.name}</h3>
                      <span className="flex items-center gap-1.5 text-[10px] font-accent uppercase tracking-wide text-white/40">
                        <span className={`w-2 h-2 rounded-full ${healthDot[c.health]}`} />
                        {healthLabel[c.health]}
                      </span>
                    </div>
                    <p className="text-xs text-white/55 font-body leading-snug mb-2">{c.milestone}</p>
                    <p className="flex items-start gap-1.5 text-xs text-white/80 font-body">
                      <CircleDot size={12} className="text-orange mt-0.5 shrink-0" />
                      {c.nextAction}
                    </p>
                    {c.blocked && (
                      <p className="flex items-start gap-1.5 text-xs text-amber-400/90 font-body mt-1.5">
                        <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                        {c.blocked}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Money */}
              <Card icon={<Wallet size={14} className="text-orange" />} title="Money">
                <div className="flex gap-2 mb-4">
                  <Stat label="Paid" value={money$(paid)} tone="text-emerald-400" />
                  <Stat label="Owed" value={money$(owed)} tone="text-amber-400" />
                  <Stat label="Upcoming" value={money$(upcoming)} tone="text-white/70" />
                </div>
                <ul className="space-y-2">
                  {money.map((m, i) => (
                    <li key={i} className="flex items-center justify-between text-sm">
                      <span className="font-body text-white/70">
                        <span className="text-white/40">{m.client}</span> · {m.label}
                        {m.note && <span className="block text-xs text-white/30">{m.note}</span>}
                      </span>
                      <span className={`font-accent font-semibold ${
                        m.status === "paid" ? "text-emerald-400"
                          : m.status === "owed" ? "text-amber-400" : "text-white/50"
                      }`}>
                        {m.amount ? money$(m.amount) : "TBD"}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Job pipeline */}
              <Card icon={<Briefcase size={14} className="text-orange" />} title="Job pipeline">
                <ul className="space-y-2 mb-4">
                  {jobFunnel.map((s, i) => {
                    const max = Math.max(...jobFunnel.map((x) => x.count), 1);
                    const pct = Math.round((s.count / max) * 100);
                    return (
                      <li key={i}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-body text-white/60">{s.label}</span>
                          <span className="font-accent font-bold text-white/80">{s.count}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full bg-orange/70 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <ul className="space-y-1 border-t border-white/10 pt-3">
                  {jobNotes.map((n, i) => (
                    <li key={i} className="text-xs text-white/40 font-body leading-snug">{n}</li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-white/20 font-body mt-10">
          Work HQ · private to {adminEmail} · edit content in data/work-dashboard.ts
        </p>
      </div>
    </div>
  );
}

// --- small presentational helpers -----------------------------------------
function Kpi({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="bg-navy-surface border border-white/10 rounded-2xl p-4">
      <p className="text-[10px] font-accent font-bold uppercase tracking-widest text-white/40 mb-1">{label}</p>
      <p className={`text-2xl font-heading font-bold ${accent || "text-white"}`}>{value}</p>
      {sub && <p className="text-[11px] text-white/30 font-body mt-0.5">{sub}</p>}
    </div>
  );
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-navy-surface border border-white/10 rounded-2xl p-5">
      <h2 className="flex items-center gap-2 text-xs font-accent font-bold text-white/50 uppercase tracking-widest mb-4">
        {icon} {title}
      </h2>
      {children}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="flex-1 bg-navy-dark border border-white/10 rounded-xl p-2.5 text-center">
      <p className="text-[9px] font-accent uppercase tracking-wide text-white/30">{label}</p>
      <p className={`text-sm font-heading font-bold ${tone}`}>{value}</p>
    </div>
  );
}
