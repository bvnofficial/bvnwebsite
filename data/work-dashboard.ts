// ---------------------------------------------------------------------------
// Work HQ data — the single source of truth for the admin work dashboard.
// Edit this file to update what shows on /admin/work. Concrete money figures
// only appear where they are actually known; unknowns stay null (shown as TBD).
// ---------------------------------------------------------------------------

export type Health = "green" | "yellow" | "red";

export interface ClientCard {
  slug: string;              // maps to /clients/<slug>
  name: string;
  health: Health;            // green ok, yellow needs attention, red blocked
  milestone: string;         // where the engagement is right now
  nextAction: string;        // the single next thing to do
  blocked?: string;          // set when something external is holding it up
}

export interface MoneyLine {
  client: string;
  label: string;
  amount: number | null;     // null = amount not fixed yet
  status: "paid" | "owed" | "upcoming";
  note?: string;
}

export interface AgendaItem {
  date: string;              // ISO yyyy-mm-dd
  title: string;
  client?: string;
  done?: boolean;
}

export interface SeedTask {
  id: string;                // stable id, used for localStorage completion
  text: string;
  client?: string;
  priority: "high" | "normal";
}

export interface FunnelStage {
  label: string;
  count: number;
}

// --- Active clients --------------------------------------------------------
export const clients: ClientCard[] = [
  {
    slug: "regal-senior-living",
    name: "Regal Senior Living",
    health: "yellow",
    milestone: "M2 live — AI receptionist deployed, call-summary workflow published",
    nextAction: "Get Don's test call done, then collect M2 payment",
  },
  {
    slug: "tintgard",
    name: "TintGard",
    health: "yellow",
    milestone: "CEO dashboard shipped and password gated; car booking flow live",
    nextAction: "Finish Make reverse-leg sync mapping and activate the Draft workflows",
    blocked: "12 GHL workflows still Draft with 0 enrolled",
  },
  {
    slug: "tce-entertainment",
    name: "Troy Curtis Entertainment",
    health: "green",
    milestone: "AI booking platform, 9-module scope agreed, plan and demo live",
    nextAction: "Progress build toward proposal to review master workflow",
  },
  {
    slug: "efs",
    name: "SimpleLeads / Epping Fencing",
    health: "green",
    milestone: "Hannah dashboard plus budget and zoning GHL build mapped",
    nextAction: "Continue GHL workflow build for Epping",
  },
  {
    slug: "progardfilms",
    name: "ProGard Films",
    health: "yellow",
    milestone: "Next.js plus Supabase plus Stripe store in progress",
    nextAction: "Replace placeholder content and finalise ownership handover plan",
  },
];

// --- Money ----------------------------------------------------------------
// Only Regal has firm figures in memory (2,500 total, 40 / 30 / 30 split).
export const money: MoneyLine[] = [
  { client: "Regal", label: "M1 — setup", amount: 1000, status: "paid" },
  {
    client: "Regal",
    label: "M2 — AI receptionist live",
    amount: 750,
    status: "owed",
    note: "Awaiting Don's test call before collecting",
  },
  { client: "Regal", label: "M3 — final", amount: 750, status: "upcoming" },
  { client: "TintGard", label: "Retainer / project", amount: null, status: "owed", note: "Confirm invoicing via Xero" },
  { client: "TCE", label: "Engagement", amount: null, status: "upcoming", note: "Pricing after discovery call" },
];

// --- Agenda (dated) --------------------------------------------------------
// Real dated facts are seeded here. Add your own events from the dashboard.
export const agenda: AgendaItem[] = [
  { date: "2026-07-11", title: "RE Wholesale GoHighLevel role completed", client: "RE Wholesale", done: true },
  { date: "2026-07-29", title: "Regal call-summary workflow published", client: "Regal", done: true },
];

// --- Today's tasks (seed) --------------------------------------------------
export const seedTasks: SeedTask[] = [
  { id: "regal-comms", text: "Send the 3 staged Regal comms", client: "Regal", priority: "high" },
  { id: "regal-test-call", text: "Chase Don for the AI receptionist test call", client: "Regal", priority: "high" },
  { id: "regal-collect-m2", text: "Collect Regal M2 payment (750) once test call passes", client: "Regal", priority: "high" },
  { id: "tintgard-sync", text: "Finish Make reverse-leg sync mapping", client: "TintGard", priority: "normal" },
  { id: "tintgard-workflows", text: "Activate the 12 Draft GHL workflows", client: "TintGard", priority: "normal" },
  { id: "seo-gsc", text: "Submit GSC token, Bing submit, then redeploy for AI search visibility", priority: "normal" },
  { id: "commit-work", text: "Commit the uncommitted admin, client-gate and tracker edits", priority: "normal" },
];

// --- Job pipeline funnel ---------------------------------------------------
// Update these counts as the funnel moves. Scraper feeds the top of funnel.
export const jobFunnel: FunnelStage[] = [
  { label: "Scraped this week", count: 0 },
  { label: "Applications sent", count: 0 },
  { label: "Replies", count: 0 },
  { label: "Interviews", count: 0 },
  { label: "Hired / completed", count: 1 },
];

export const jobNotes = [
  "Classifier runs hourly in the cloud (onlinejobs plus Slack pipeline).",
  "RE Wholesale GoHighLevel role: hired and completed on 2026-07-11.",
];
