// ---------------------------------------------------------------------------
// sync-brain.mjs — the vault -> Command Center "Brain feed" bridge.
//
// Scans the CLAUDE BRAIN vault, finds the most recently touched notes, and
// writes them to data/command-center-brain.json, which the /command dashboard
// shows as "Brain — recent". Run it locally, then redeploy so the dashboard
// reflects what you actually worked on. This is what makes it "learn" daily.
//
//   node scripts/sync-brain.mjs
//   BRAIN_VAULT_PATH="D:\\path\\to\\vault" node scripts/sync-brain.mjs
// ---------------------------------------------------------------------------

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, sep } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "data", "command-center-brain.json");

const VAULT =
  process.env.BRAIN_VAULT_PATH || "C:\\Users\\bevin\\Desktop\\CLAUDE BRAIN";

const SKIP_DIRS = new Set([".obsidian", "_Reference", "90-meta"]);
const SKIP_FILES = new Set(["README.md", "START HERE.md", "MEMORY.md", "CLAUDE.md"]);
const MAX = 10;

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    let st;
    try { st = statSync(full); } catch { continue; }
    if (st.isDirectory()) {
      if (SKIP_DIRS.has(name) || name.startsWith(".")) continue;
      walk(full, acc);
    } else if (name.endsWith(".md") && !SKIP_FILES.has(name)) {
      acc.push({ full, mtime: st.mtimeMs });
    }
  }
  return acc;
}

function kindFor(rel) {
  const parts = rel.split(sep);
  if (parts[0] === "30-projects" && parts[1] === "People") return "person";
  if (parts[0] === "30-projects") return "project";
  if (parts[0] === "40-skills") return "skill";
  if (parts[0] === "10-content") return "content";
  if (parts.length === 1) return "memory";
  return "note";
}

function titleOf(full, fallback) {
  try {
    const head = readFileSync(full, "utf-8").split("\n").slice(0, 12);
    const h = head.find((l) => l.startsWith("# "));
    if (h) return h.replace(/^#\s+/, "").trim();
  } catch {}
  return fallback;
}

function main() {
  let files;
  try {
    files = walk(VAULT);
  } catch (e) {
    console.error(`Cannot read vault at ${VAULT}. Set BRAIN_VAULT_PATH. (${e.message})`);
    process.exit(1);
  }
  const items = files
    .sort((a, b) => b.mtime - a.mtime)
    .slice(0, MAX)
    .map(({ full, mtime }) => {
      const rel = relative(VAULT, full);
      return {
        title: titleOf(full, rel.replace(/\.md$/, "").split(sep).pop()),
        path: rel.split(sep).join("/"),
        kind: kindFor(rel),
        updated: new Date(mtime).toISOString().slice(0, 10),
      };
    });

  writeFileSync(OUT, JSON.stringify(items, null, 2) + "\n", "utf-8");
  console.log(`Wrote ${items.length} recent notes to ${OUT.replace(join(__dirname, ".."), ".")}`);
}

main();
