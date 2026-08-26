"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, HeartPulse, Users, ShieldCheck, FileText, CreditCard,
  CalendarClock, CheckCircle2, Download, Bell, Home, Building2,
  UserPlus, ClipboardList, Wallet, TrendingUp, DollarSign, Lock,
  Clock, ChevronRight, Activity, BedDouble, AlertTriangle, Sparkles,
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

const money = (n: number) => "$" + (n || 0).toLocaleString("en-US");

// ── sample data (invented — NOT real residents) ──────────────
type Status = "Paid" | "Pending" | "Failed";
type Resident = {
  resident: string; home: string; room: string; family: string;
  monthly: number; status: Status; care: string; entity: string;
};
const RESIDENTS: Resident[] = [
  { resident: "Margaret Ellison", home: "Regal Care", room: "4", family: "Diane Ellison", monthly: 6500, status: "Paid", care: "Assisted", entity: "Zephaniah" },
  { resident: "Harold Vance", home: "Regal Care", room: "7", family: "Karen Vance", monthly: 8000, status: "Paid", care: "Memory", entity: "Zephaniah" },
  { resident: "Estelle Brooks", home: "Regal Residence", room: "2", family: "Ryan Brooks", monthly: 7000, status: "Pending", care: "Assisted", entity: "Zephaniah" },
  { resident: "Walter Kim", home: "Regal Residence", room: "5", family: "Grace Kim", monthly: 7500, status: "Paid", care: "Assisted", entity: "Zephaniah" },
  { resident: "Norah Pratt", home: "The Orchard", room: "3", family: "Jim Pratt", monthly: 10000, status: "Paid", care: "Memory", entity: "Nehemiah" },
  { resident: "Raymond Ford", home: "The Orchard", room: "8", family: "Sue Ford", monthly: 12500, status: "Failed", care: "Skilled", entity: "Nehemiah" },
];

const HOME_ICON: Record<string, typeof Home> = {
  "Regal Care": Home, "Regal Residence": Building2, "The Orchard": HeartPulse,
};

// ── little building blocks ───────────────────────────────────
function Panel({
  Icon, title, accent, right, children,
}: {
  Icon: typeof Home; title: string; accent: string;
  right?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ display: "grid", placeItems: "center", width: 30, height: 30, borderRadius: 9, background: accent + "22", color: accent }}>
            <Icon size={16} />
          </span>
          <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: -0.2 }}>{title}</span>
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

function StatTile({
  Icon, label, value, sub, accent,
}: {
  Icon: typeof Home; label: string; value: string; sub?: string; accent: string;
}) {
  return (
    <div style={{ background: C.cardHi, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.sub, fontSize: 12, fontWeight: 700 }}>
        <Icon size={14} style={{ color: accent }} /> {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, letterSpacing: -0.6 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function Bar({ label, value, max, color, right }: { label: string; value: number; max: number; color: string; right: string }) {
  const pct = Math.max(4, Math.round((value / max) * 100));
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
        <span style={{ color: C.sub }}>{label}</span>
        <span style={{ fontWeight: 700 }}>{right}</span>
      </div>
      <div style={{ height: 9, borderRadius: 6, background: C.bg2, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 6 }} />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { c: string; Icon: typeof Home }> = {
    Paid: { c: C.green, Icon: CheckCircle2 },
    Pending: { c: C.amber, Icon: Clock },
    Failed: { c: C.red, Icon: AlertTriangle },
  };
  const { c, Icon } = map[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: c, background: c + "1E", border: `1px solid ${c}44`, borderRadius: 999, padding: "3px 9px" }}>
      <Icon size={12} /> {status}
    </span>
  );
}

function SoftBtn({ Icon, label }: { Icon: typeof Home; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.ink, background: C.cardHi, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 13px", cursor: "pointer" }}>
      <Icon size={14} style={{ color: C.cyan }} /> {label}
    </span>
  );
}

// ── FAMILY VIEW ──────────────────────────────────────────────
function FamilyView() {
  const invoices = [
    { date: "Aug 3, 2026", amount: 6500 },
    { date: "Jul 3, 2026", amount: 6500 },
    { date: "Jun 3, 2026", amount: 6500 },
  ];
  const docs = ["2026 Annual Rate Adjustment Notice", "Residency Agreement", "August 2026 Statement"];
  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr", }}>
      <div style={{ background: `linear-gradient(120deg, ${C.cardHi}, ${C.card})`, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
        <div style={{ fontSize: 13, color: C.sub }}>Welcome back, Diane</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginTop: 3 }}>Margaret Ellison</div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>Regal Care · Room 4 · Assisted living</div>
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <Panel Icon={CreditCard} title="Monthly payment" accent={C.green}>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1 }}>{money(6500)}</div>
          <div style={{ fontSize: 13, color: C.sub, marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
            <CalendarClock size={14} style={{ color: C.cyan }} /> Auto-draft on the 3rd · US bank ••4821
          </div>
          <div style={{ display: "flex", gap: 9, marginTop: 14, flexWrap: "wrap" }}>
            <SoftBtn Icon={CreditCard} label="Update payment method" />
            <SoftBtn Icon={FileText} label="View statements" />
          </div>
        </Panel>

        <Panel Icon={FileText} title="Documents" accent={C.purple}>
          {docs.map((d) => (
            <div key={d} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 13.5 }}>{d}</span>
              <Download size={15} style={{ color: C.cyan }} />
            </div>
          ))}
        </Panel>
      </div>

      <Panel Icon={CheckCircle2} title="Payment history" accent={C.green}>
        {invoices.map((iv) => (
          <div key={iv.date} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 13.5, color: C.sub }}>{iv.date}</span>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{money(iv.amount)}</span>
            <StatusBadge status="Paid" />
          </div>
        ))}
      </Panel>

      <Panel Icon={Bell} title="From the home" accent={C.amber}>
        <div style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.6 }}>
          Flu clinic on October 12, families welcome to attend with residents.<br />
          Our new activities coordinator, Tatjana, starts this month.
        </div>
      </Panel>
    </div>
  );
}

// ── ADMIN VIEW ───────────────────────────────────────────────
function AdminView() {
  const [name, setName] = useState("");
  const [waitlist, setWaitlist] = useState(true);
  const tags = ["new-inquiry", ...(waitlist ? ["vacancy-opt-in"] : [])];
  const forms = [
    { Icon: ClipboardList, label: "Intake form" },
    { Icon: FileText, label: "Care plan" },
    { Icon: AlertTriangle, label: "Incident report" },
    { Icon: HeartPulse, label: "Medication log" },
  ];
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 700, color: C.green, background: C.green + "18", border: `1px solid ${C.green}44`, borderRadius: 999, padding: "6px 12px", width: "fit-content" }}>
        <ShieldCheck size={14} /> HIPAA-secured tier · staff access only
      </div>

      <Panel Icon={Users} title="Resident records" accent={C.blue} right={<span style={{ fontSize: 12, color: C.muted }}>{RESIDENTS.length} shown</span>}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 620 }}>
            <thead>
              <tr style={{ color: C.muted, textAlign: "left", fontSize: 12 }}>
                <th style={{ padding: "6px 8px", fontWeight: 700 }}>Resident</th>
                <th style={{ padding: "6px 8px", fontWeight: 700 }}>Home</th>
                <th style={{ padding: "6px 8px", fontWeight: 700 }}>Room</th>
                <th style={{ padding: "6px 8px", fontWeight: 700 }}>Responsible party</th>
                <th style={{ padding: "6px 8px", fontWeight: 700 }}>Care</th>
                <th style={{ padding: "6px 8px", fontWeight: 700 }}>Billing</th>
              </tr>
            </thead>
            <tbody>
              {RESIDENTS.map((r) => {
                const HI = HOME_ICON[r.home] || Home;
                return (
                  <tr key={r.resident} style={{ borderTop: `1px solid ${C.border}` }}>
                    <td style={{ padding: "10px 8px", fontWeight: 700 }}>{r.resident}</td>
                    <td style={{ padding: "10px 8px", color: C.sub }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><HI size={13} style={{ color: C.cyan }} /> {r.home}</span>
                    </td>
                    <td style={{ padding: "10px 8px", color: C.sub }}>{r.room}</td>
                    <td style={{ padding: "10px 8px", color: C.sub }}>{r.family}</td>
                    <td style={{ padding: "10px 8px", color: C.sub }}>{r.care}</td>
                    <td style={{ padding: "10px 8px" }}><StatusBadge status={r.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <Panel Icon={UserPlus} title="Quick add a lead" accent={C.coral}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Family or resident name"
            style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", color: C.ink, fontSize: 14, outline: "none" }}
          />
          <label style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 12, fontSize: 13.5, color: C.sub, cursor: "pointer" }}>
            <input type="checkbox" checked={waitlist} onChange={(e) => setWaitlist(e.target.checked)} />
            Add to the vacancy waiting list
          </label>
          <div style={{ marginTop: 12, fontSize: 12, color: C.muted }}>Tags applied automatically:</div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 7 }}>
            {tags.map((t) => (
              <span key={t} style={{ fontSize: 12, fontWeight: 700, color: C.cyan, background: C.cyan + "1A", border: `1px solid ${C.cyan}44`, borderRadius: 999, padding: "3px 10px" }}>{t}</span>
            ))}
          </div>
          <div style={{ marginTop: 14 }}><SoftBtn Icon={UserPlus} label={name ? `Add ${name}` : "Add contact"} /></div>
        </Panel>

        <Panel Icon={FileText} title="Forms and records" accent={C.purple}>
          <div style={{ display: "grid", gap: 9 }}>
            {forms.map((f) => (
              <div key={f.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.cardHi, border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 13px", cursor: "pointer" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, fontWeight: 600 }}>
                  <f.Icon size={15} style={{ color: C.cyan }} /> {f.label}
                </span>
                <ChevronRight size={15} style={{ color: C.muted }} />
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel Icon={CalendarClock} title="Staff tasks" accent={C.amber}>
        <div style={{ display: "grid", gap: 9, fontSize: 13.5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, color: C.sub }}><Clock size={14} style={{ color: C.amber }} /> Send 90-day rate notice to the Brooks family · due in 7 days</div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, color: C.sub }}><Clock size={14} style={{ color: C.amber }} /> Retry failed payment for Raymond Ford · The Orchard</div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, color: C.sub }}><Clock size={14} style={{ color: C.amber }} /> Follow up on 2 new waiting-list inquiries</div>
        </div>
      </Panel>
    </div>
  );
}

// ── OWNER VIEW ───────────────────────────────────────────────
function OwnerView() {
  const homes = [
    { name: "Regal Care", filled: 6, beds: 6 },
    { name: "Regal Residence", filled: 5, beds: 6 },
    { name: "The Orchard", filled: 4, beds: 5 },
  ];
  const totalBeds = homes.reduce((s, h) => s + h.beds, 0);
  const filled = homes.reduce((s, h) => s + h.filled, 0);
  const mrr = 142000, collected = 128500, outstanding = 13500;
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 700, color: C.amber, background: C.amber + "18", border: `1px solid ${C.amber}44`, borderRadius: 999, padding: "6px 12px", width: "fit-content" }}>
        <Lock size={14} /> Owner exclusive
      </div>

      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
        <StatTile Icon={BedDouble} label="Occupancy" value={`${Math.round((filled / totalBeds) * 100)}%`} sub={`${filled} of ${totalBeds} beds filled`} accent={C.cyan} />
        <StatTile Icon={Wallet} label="Monthly recurring" value={money(mrr)} sub="across both entities" accent={C.green} />
        <StatTile Icon={DollarSign} label="Collected this month" value={money(collected)} sub={`${money(outstanding)} outstanding`} accent={C.blue} />
        <StatTile Icon={TrendingUp} label="Waiting list" value="9" sub="+3 this month" accent={C.coral} />
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <Panel Icon={Building2} title="Revenue by entity" accent={C.green}>
          <Bar label="Zephaniah · Regal Care + Residence" value={92000} max={142000} color={C.green} right={money(92000)} />
          <Bar label="Nehemiah · The Orchard" value={50000} max={142000} color={C.cyan} right={money(50000)} />
        </Panel>

        <Panel Icon={CheckCircle2} title="Billing status" accent={C.blue}>
          <Bar label="Paid" value={13} max={17} color={C.green} right="13" />
          <Bar label="Pending" value={3} max={17} color={C.amber} right="3" />
          <Bar label="Failed" value={1} max={17} color={C.red} right="1" />
        </Panel>
      </div>

      <Panel Icon={Home} title="Occupancy by home" accent={C.purple}>
        {homes.map((h) => (
          <Bar key={h.name} label={h.name} value={h.filled} max={h.beds} color={C.purple} right={`${h.filled}/${h.beds}`} />
        ))}
      </Panel>

      <Panel Icon={Activity} title="Recent activity" accent={C.cyan}>
        <div style={{ display: "grid", gap: 10, fontSize: 13.5, color: C.sub }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}><CheckCircle2 size={14} style={{ color: C.green }} /> Payment received · Kim family · {money(7500)}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}><UserPlus size={14} style={{ color: C.coral }} /> New waiting-list inquiry · The Orchard</div>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}><AlertTriangle size={14} style={{ color: C.red }} /> Payment failed · Ford family · retry scheduled</div>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}><FileText size={14} style={{ color: C.purple }} /> Rate notice generated · Brooks family</div>
        </div>
      </Panel>
    </div>
  );
}

// ── PAGE ─────────────────────────────────────────────────────
type Role = "family" | "admin" | "owner";
const ROLES: { key: Role; label: string; Icon: typeof Home; accent: string; blurb: string }[] = [
  { key: "family", label: "Family", Icon: Users, accent: C.green, blurb: "What a resident's family sees when they log in" },
  { key: "admin", label: "Admin / Staff", Icon: ClipboardList, accent: C.blue, blurb: "A faster workspace for records and forms" },
  { key: "owner", label: "Owner", Icon: ShieldCheck, accent: C.amber, blurb: "An exclusive view across every home" },
];

export default function RegalPortalDemo() {
  const [role, setRole] = useState<Role>("family");
  const active = ROLES.find((r) => r.key === role)!;

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh", fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 80px" }}>
        <Link href="/clients" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: C.sub, textDecoration: "none" }}>
          <ArrowLeft size={15} /> All demos
        </Link>

        {/* header */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: 12, background: C.cyan + "22", color: C.cyan }}>
              <HeartPulse size={22} />
            </span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: C.coral }}>Application Demo · Regal Care Homes</div>
              <h1 style={{ fontSize: 28, fontWeight: 800, margin: "2px 0 0", letterSpacing: -0.6 }}>Family &amp; Staff Portal</h1>
            </div>
          </div>
          <p style={{ fontSize: 15, color: C.sub, maxWidth: 680, lineHeight: 1.6, marginTop: 12 }}>
            One login, three experiences. Families manage their own billing, staff get a faster place to work, and the owner sees the whole operation. Switch roles below to see each view.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 700, color: C.muted, background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 11px", marginTop: 12 }}>
            <ShieldCheck size={13} style={{ color: C.green }} /> Sample data only · no real resident information
          </div>
        </div>

        {/* role switcher */}
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", marginTop: 26 }}>
          {ROLES.map((r) => {
            const on = r.key === role;
            return (
              <button
                key={r.key}
                onClick={() => setRole(r.key)}
                style={{
                  textAlign: "left", cursor: "pointer",
                  background: on ? C.cardHi : C.card,
                  border: `1px solid ${on ? r.accent : C.border}`,
                  borderRadius: 14, padding: "13px 15px", color: C.ink,
                  boxShadow: on ? `0 0 0 3px ${r.accent}22` : "none",
                  transition: "all .15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ display: "grid", placeItems: "center", width: 28, height: 28, borderRadius: 8, background: r.accent + "22", color: r.accent }}>
                    <r.Icon size={15} />
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 800 }}>{r.label}</span>
                </div>
                <div style={{ fontSize: 12.5, color: C.muted, marginTop: 7, lineHeight: 1.45 }}>{r.blurb}</div>
              </button>
            );
          })}
        </div>

        {/* active view */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, color: active.accent, fontSize: 13, fontWeight: 800 }}>
            <active.Icon size={16} /> {active.label} view
          </div>
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
          >
            {role === "family" && <FamilyView />}
            {role === "admin" && <AdminView />}
            {role === "owner" && <OwnerView />}
          </motion.div>
        </div>

        {/* footer / phased note */}
        <div style={{ marginTop: 48, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 800, color: C.cyan }}>
            <Sparkles size={16} /> How this would roll out
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.65, marginTop: 10 }}>
            Phase one ships the fast, safe wins: family billing self-service, wired to the payment system already in place, plus the owner dashboard built on billing and occupancy data. Phase two adds the staff records workspace on properly compliant, BAA-covered infrastructure, since that tier handles protected health information and needs its own secure foundation.
          </p>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginTop: 10 }}>
            Built by BVN. This is a working concept with sample data, not a live system.
          </p>
        </div>
      </div>
    </main>
  );
}
