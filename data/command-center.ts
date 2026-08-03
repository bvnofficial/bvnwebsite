// ---------------------------------------------------------------------------
// BVN Command Center — data source for the private /command dashboard.
//
// This is the "brain -> command center" bridge. Today it is edited by hand
// (like work-dashboard.ts). In Phase 2 a local sync script reads the CLAUDE
// BRAIN Obsidian vault and regenerates this file, so the dashboard "learns"
// every day. Keep figures honest: unknowns stay null/empty, not invented.
// ---------------------------------------------------------------------------

export type Health = "green" | "yellow" | "red";

// Who I am — used to score how relevant a scraped job is.
export interface CommandProfile {
  name: string;
  headline: string;
  targetRoles: string[];
  // Lowercased keywords the job scraper matches against a post.
  keywords: string[];
}

// A client moving through lock -> close -> deliver.
export type PipelineStage =
  | "lead"        // spotted, not contacted
  | "contacted"   // reached out / applied
  | "proposal"    // demo or proposal sent
  | "negotiation" // talking terms
  | "won"         // closed, not started
  | "active"      // in delivery
  | "done";       // completed

export interface PipelineClient {
  name: string;
  slug: string;               // maps to /clients/<slug> when public
  stage: PipelineStage;
  health: Health;
  next: string;               // the single next action to move it forward
  value?: number | null;      // engagement value if known
}

// A scraped job opportunity (fed by the Slack / OnlineJobs scraper).
export type JobStatus = "new" | "drafted" | "applied" | "replied" | "passed";

export interface JobLead {
  id: string;
  title: string;
  source: string;             // e.g. "OnlineJobs.ph", "Slack", "Upwork"
  postedAt: string | null;    // ISO date
  url?: string;
  relevance: number;          // 0-100, how well it matches my profile
  tags: string[];             // matched keywords
  status: JobStatus;
  snippet?: string;
}

// A recently touched note in the brain (surfaced so the dashboard "learns").
export interface BrainItem {
  title: string;
  path: string;               // vault-relative path
  kind: "client" | "person" | "project" | "note" | "skill" | "memory";
  updated: string;            // ISO date
}

// -- Profile ----------------------------------------------------------------
export const profile: CommandProfile = {
  name: "Benjamin Vincent Yson",
  headline: "AI Automation, GoHighLevel & Modern Web",
  targetRoles: [
    "GoHighLevel Implementation Specialist",
    "AI Automation Engineer",
    "Web Developer (Next.js / React)",
    "CRM / Marketing Automation",
  ],
  keywords: [
    "gohighlevel", "ghl", "ai automation", "ai agent", "chatbot", "voice ai",
    "make.com", "n8n", "zapier", "crm", "workflow", "automation",
    "next.js", "react", "web development", "web app", "supabase",
    "a2p", "snapshot", "funnel", "landing page", "api integration",
  ],
};

// -- Client pipeline (lock & close) -----------------------------------------
export const pipeline: PipelineClient[] = [
  { name: "Regal Homes", slug: "regal-senior-living", stage: "active", health: "yellow",
    next: "Get Don's test call done, then collect M2 payment ($750)", value: 2500 },
  { name: "TintGard", slug: "tintgard", stage: "active", health: "yellow",
    next: "Finish Make reverse-leg sync, activate the 12 Draft GHL workflows", value: null },
  { name: "Troy Curtis Entertainment", slug: "tce-entertainment", stage: "active", health: "green",
    next: "Progress build toward the proposal->review master workflow", value: null },
  { name: "SimpleLeads / Epping Fencing", slug: "efs", stage: "active", health: "green",
    next: "Continue GHL workflow build for Epping", value: null },
  { name: "ProGard Films", slug: "progardfilms", stage: "active", health: "yellow",
    next: "Replace placeholder content, finalise ownership handover", value: null },
  { name: "Warm Up Guys", slug: "warm-up-guys", stage: "proposal", health: "green",
    next: "Follow up on the client-workflows ops-console demo", value: null },
];

// -- Jobs feed (scraper feeds the top of this) ------------------------------
// Seeded with the one real live opportunity; the scraper appends new leads.
export const jobs: JobLead[] = [
  {
    id: "wug-ghl-impl",
    title: "GoHighLevel Implementation Specialist — comedy / live-entertainment clients",
    source: "Direct",
    postedAt: "2026-08-01",
    relevance: 96,
    tags: ["gohighlevel", "ghl", "snapshot", "a2p", "automation", "funnel"],
    status: "drafted",
    snippet:
      "Customize existing snapshots/CRMs, client onboarding (sub-accounts, DNS, deliverability, A2P), workflows and funnels. 20 hrs/week, path to full-time.",
  },
];

// -- Brain feed (recently touched notes) ------------------------------------
// Regenerated from the vault by the Phase 2 sync script.
export const brain: BrainItem[] = [
  { title: "TintGard OS Audit Report", path: "30-projects/TintGard/TintGard OS Audit Report.md", kind: "note", updated: "2026-08-03" },
  { title: "TCE SOP", path: "30-projects/TCE/TCE SOP.md", kind: "note", updated: "2026-08-03" },
  { title: "Solar Proposal Comparison", path: "30-projects/Solar/Solar Proposal Comparison.md", kind: "note", updated: "2026-08-03" },
  { title: "Warm Up Guys", path: "30-projects/Warm Up Guys/Warm Up Guys.md", kind: "project", updated: "2026-08-03" },
  { title: "Benjamin Vincent Yson", path: "30-projects/People/Benjamin Vincent Yson.md", kind: "person", updated: "2026-08-03" },
];

// -- Today ------------------------------------------------------------------
export interface TodayItem {
  id: string;
  text: string;
  priority: "high" | "normal";
  client?: string;
}

export const today: TodayItem[] = [
  { id: "regal-test-call", text: "Chase Don for the AI receptionist test call", client: "Regal", priority: "high" },
  { id: "regal-collect-m2", text: "Collect Regal M2 payment ($750) once test call passes", client: "Regal", priority: "high" },
  { id: "wug-followup", text: "Follow up with Warm Up Guys on the ops-console demo", client: "Warm Up Guys", priority: "high" },
  { id: "tintgard-workflows", text: "Activate the 12 Draft GHL workflows", client: "TintGard", priority: "normal" },
];
