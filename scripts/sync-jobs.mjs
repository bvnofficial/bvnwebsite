// ---------------------------------------------------------------------------
// sync-jobs.mjs — the job-scraper -> Command Center bridge.
//
// Reads the local scraper queue (CLAUDE-BVN/job-scraper/queue.json), scores each
// posting against Benjamin's target keywords (GHL / AI automation / web dev),
// keeps the relevant ones, and merges them (dedup by id, preserving any status
// already set) into data/command-center-jobs.json — which the /command dashboard
// reads. Run it locally, then redeploy so the dashboard "learns" the new leads.
//
//   node scripts/sync-jobs.mjs
//   JOB_QUEUE_PATH="D:\\path\\queue.json" node scripts/sync-jobs.mjs   # override
// ---------------------------------------------------------------------------

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, "..");
const OUT = join(REPO, "data", "command-center-jobs.json");

const QUEUE_PATH =
  process.env.JOB_QUEUE_PATH ||
  "C:\\Users\\bevin\\Desktop\\CLAUDE-BVN\\job-scraper\\queue.json";

// Weighted keywords — strong signals score higher. Keep in step with
// profile.keywords in data/command-center.ts.
const STRONG = [
  "gohighlevel", "ghl", "ai automation", "ai agent", "automation engineer",
  "crm", "next.js", "nextjs", "react", "web developer", "web development",
  "web app", "supabase", "n8n", "make.com", "chatbot", "ai chatbot",
];
const WEAK = [
  "automation", "workflow", "funnel", "landing page", "api integration",
  "zapier", "a2p", "snapshot", "voice ai", "webflow", "wordpress", "developer",
];

const THRESHOLD = 30; // keep postings scoring at least this
const MAX_KEEP = 60;  // cap the persisted feed

const SOURCE_LABEL = {
  onlinejobs: "OnlineJobs.ph",
  linkedin: "LinkedIn",
  reddit: "Reddit",
  virtualstaff: "VirtualStaff.ph",
};

// Whole-word match so "react" doesn't hit "reactivation" and "ghl" doesn't hit
// substrings. Treats letters/digits as word chars; handles "next.js"/"make.com".
function hasKw(hay, kw) {
  const esc = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${esc}($|[^a-z0-9])`, "i").test(hay);
}

function scorePosting(p) {
  // Drop the "Company: <name>." boilerplate so company names (e.g. "Linkage Web
  // Development") never trigger a keyword. Score title + the rest of the desc.
  const desc = (p.description || "").replace(/company:[^.]*\.?/i, "");
  const hay = `${p.title || ""} ${desc}`.toLowerCase();
  const matched = [];
  let score = 0;
  for (const kw of STRONG) if (hasKw(hay, kw)) { score += 30; matched.push(kw); }
  for (const kw of WEAK) if (hasKw(hay, kw)) { score += 15; matched.push(kw); }
  return { score: Math.min(100, score), matched: [...new Set(matched)] };
}

function toLead(p, score, matched) {
  return {
    id: p.id,
    title: p.title || "(untitled)",
    source: SOURCE_LABEL[p.source] || p.source || "Unknown",
    postedAt: p.posted_date || null,
    url: p.url || undefined,
    relevance: score,
    tags: matched.slice(0, 6),
    status: "new",
    snippet: (p.description || "").slice(0, 240) || undefined,
  };
}

function main() {
  if (!existsSync(QUEUE_PATH)) {
    console.error(`Queue not found at ${QUEUE_PATH}. Set JOB_QUEUE_PATH to override.`);
    process.exit(1);
  }
  let queue = [];
  try {
    queue = JSON.parse(readFileSync(QUEUE_PATH, "utf-8"));
  } catch (e) {
    console.error("Could not parse queue.json:", e.message);
    process.exit(1);
  }

  // Existing feed (preserve statuses I've already set).
  const existing = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf-8")) : [];
  const byId = new Map(existing.map((j) => [j.id, j]));

  let added = 0;
  for (const p of queue) {
    const { score, matched } = scorePosting(p);
    if (score < THRESHOLD) continue;
    const lead = toLead(p, score, matched);
    if (byId.has(p.id)) {
      const prev = byId.get(p.id);
      byId.set(p.id, { ...lead, status: prev.status }); // keep my status
    } else {
      byId.set(p.id, lead);
      added++;
    }
  }

  const merged = [...byId.values()]
    .sort((a, b) => (b.relevance - a.relevance) || String(b.postedAt).localeCompare(String(a.postedAt)))
    .slice(0, MAX_KEEP);

  writeFileSync(OUT, JSON.stringify(merged, null, 2) + "\n", "utf-8");
  console.log(
    `Scanned ${queue.length} queued postings -> ${merged.length} relevant kept ` +
    `(${added} new). Wrote ${OUT.replace(REPO, ".")}`
  );
}

main();
