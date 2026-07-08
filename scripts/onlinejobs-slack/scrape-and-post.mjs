// OnlineJobs.ph -> classify -> Slack.
// Runs hourly via .github/workflows/onlinejobs-slack.yml.
//
// Env:
//   SLACK_BOT_TOKEN    xoxb- token with chat:write; enables per-category channel
//                      routing via config.json slack.channelByCategory
//   SLACK_WEBHOOK_URL  fallback: post everything to one incoming-webhook channel
//   ANTHROPIC_API_KEY  optional: classify with Claude instead of keywords
//   CLAUDE_MODEL       optional model override (default claude-opus-4-8)
//   STATE_FILE         path to the seen-jobs JSON (default .state/seen.json)
//   DRY_RUN            "1" = scrape + classify but only log, no Slack posts
//
// No SLACK_* credentials and no DRY_RUN => runs as a dry run so a
// misconfigured workflow never fails silently mid-schedule.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(fs.readFileSync(path.join(here, "config.json"), "utf8"));

const STATE_FILE = process.env.STATE_FILE || ".state/seen.json";
const DRY_RUN = process.env.DRY_RUN === "1" || (!process.env.SLACK_BOT_TOKEN && !process.env.SLACK_WEBHOOK_URL);
// "bot" delivers to each job's category channel; "webhook" ignores the channel
// and delivers everything to the webhook's single bound channel.
const AUTH_MODE = process.env.SLACK_BOT_TOKEN ? "bot" : process.env.SLACK_WEBHOOK_URL ? "webhook" : "none";
const MAX_AGE_MS = (config.maxAgeHours ?? 2) * 3600_000;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

// ---------- scrape ----------

function decodeEntities(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#039;|&apos;/g, "'").replace(/&nbsp;/g, " ");
}

function stripTags(s) {
  return decodeEntities(s.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, " "))
    .replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, "\n").trim();
}

function parseJobs(html) {
  const jobs = [];
  for (const chunk of html.split("<!-- Start -->").slice(1)) {
    const card = chunk.split("<!-- End -->")[0];
    const urlMatch = card.match(/href="\/jobseekers\/job\/([^"]+)"/);
    if (!urlMatch) continue;
    const slug = urlMatch[1];
    const id = (slug.match(/(\d+)$/) || [])[1] || slug;

    const titleMatch = card.match(/<h4[^>]*>([\s\S]*?)<\/h4>/);
    let title = "", jobType = "";
    if (titleMatch) {
      const badge = titleMatch[1].match(/<span class="badge[^"]*"[^>]*>([^<]*)<\/span>/);
      jobType = badge ? badge[1].trim() : "";
      title = stripTags(titleMatch[1].replace(/<span class="badge[\s\S]*?<\/span>/, ""));
    }

    const postedMatch = card.match(/data-temp-2="([^"]+)"/); // UTC timestamp
    const postedUtc = postedMatch ? new Date(postedMatch[1].replace(" ", "T") + "Z") : null;

    const salaryMatch = card.match(/<dd class="col">([^<]*)<\/dd>/);
    const descMatch = card.match(/<div class="desc[^"]*">([\s\S]*?)<\/div>/);
    const tagBlock = card.match(/<div class="job-tag">([\s\S]*?)<\/div>/);
    const tags = tagBlock
      ? [...tagBlock[1].matchAll(/<a[^>]*class='badge'[^>]*>([^<]*)<\/a>/g)].map((m) => decodeEntities(m[1]).trim())
      : [];

    jobs.push({
      id,
      url: `https://www.onlinejobs.ph/jobseekers/job/${slug}`,
      title,
      jobType,
      postedUtc,
      salary: salaryMatch ? decodeEntities(salaryMatch[1]).trim() : "",
      snippet: descMatch ? stripTags(descMatch[1]).replace(/See More$/i, "").trim() : "",
      tags,
    });
  }
  return jobs;
}

async function fetchPage(offset) {
  const keyword = (config.search?.keyword || "").trim();
  const base = "https://www.onlinejobs.ph/jobseekers/jobsearch";
  const url = `${base}${offset ? `/${offset}` : ""}?sort=latest${keyword ? `&jobkeyword=${encodeURIComponent(keyword)}` : ""}`;
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html" } });
  if (!res.ok) throw new Error(`Fetch ${url} failed: HTTP ${res.status}`);
  return parseJobs(await res.text());
}

// ---------- classify ----------

const CATEGORY_NAMES = [...Object.keys(config.categories), "Other"];

function classifyByKeywords(job) {
  const haystacks = [
    [` ${job.title.toLowerCase()} `, 3],
    [` ${job.tags.join(" ").toLowerCase()} `, 2],
    [` ${job.snippet.toLowerCase().slice(0, 600)} `, 1],
  ];
  let best = "Other", bestScore = 0;
  for (const [category, keywords] of Object.entries(config.categories)) {
    let score = 0;
    for (const kw of keywords) {
      for (const [text, weight] of haystacks) if (text.includes(kw)) score += weight;
    }
    if (score > bestScore) { best = category; bestScore = score; }
  }
  return best;
}

async function classifyWithClaude(jobs) {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();
  const model = process.env.CLAUDE_MODEL || "claude-opus-4-8";

  const listing = jobs.map((j) => ({
    id: j.id, title: j.title, tags: j.tags, snippet: j.snippet.slice(0, 400),
  }));

  const response = await client.messages.create({
    model,
    max_tokens: 4096,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "low",
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            classifications: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  category: { type: "string", enum: CATEGORY_NAMES },
                },
                required: ["id", "category"],
                additionalProperties: false,
              },
            },
          },
          required: ["classifications"],
          additionalProperties: false,
        },
      },
    },
    system:
      "You classify freelance job postings from onlinejobs.ph into exactly one category each. " +
      "Pick the category that best matches the core skill being hired for. Use \"Other\" only when nothing fits.",
    messages: [{ role: "user", content: JSON.stringify(listing) }],
  });

  const text = response.content.find((b) => b.type === "text")?.text ?? "{}";
  const byId = new Map(JSON.parse(text).classifications.map((c) => [c.id, c.category]));
  return jobs.map((j) => byId.get(j.id) || classifyByKeywords(j));
}

async function classifyAll(jobs) {
  if (process.env.ANTHROPIC_API_KEY && jobs.length) {
    try {
      const categories = await classifyWithClaude(jobs);
      console.log(`Classified ${jobs.length} job(s) with Claude.`);
      return categories;
    } catch (err) {
      console.warn(`Claude classification failed (${err.message}); falling back to keywords.`);
    }
  }
  return jobs.map(classifyByKeywords);
}

// ---------- slack ----------

function jobBlocks(job, category) {
  const facts = [
    job.jobType && `*${job.jobType}*`,
    job.salary && `:moneybag: ${job.salary}`,
    `:label: ${category}`,
    job.postedUtc && `posted ${job.postedUtc.toISOString().slice(0, 16).replace("T", " ")} UTC`,
  ].filter(Boolean).join("  ·  ");

  const blocks = [
    { type: "section", text: { type: "mrkdwn", text: `*<${job.url}|${job.title || "Untitled job"}>*\n${facts}` } },
  ];
  if (job.snippet) {
    blocks.push({ type: "section", text: { type: "mrkdwn", text: `>${job.snippet.slice(0, 300).replace(/\n/g, " ")}${job.snippet.length > 300 ? "…" : ""}` } });
  }
  if (job.tags.length) {
    blocks.push({ type: "context", elements: [{ type: "mrkdwn", text: `Skills: ${job.tags.join(", ")}` }] });
  }
  return blocks;
}

function channelFor(category) {
  return config.slack.channelByCategory?.[category] || config.slack.defaultChannel;
}

async function postViaBotToken(channel, text, blocks) {
  const res = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ channel, text, blocks, unfurl_links: false }),
  });
  const body = await res.json();
  return body.ok ? null : body.error; // null on success, else Slack's error code
}

async function postToSlack(job, category) {
  const fallbackText = `${job.title} — ${category} — ${job.url}`;
  const blocks = jobBlocks(job, category);

  if (process.env.SLACK_BOT_TOKEN) {
    const target = channelFor(category);
    let error = await postViaBotToken(target, fallbackText, blocks);
    // Don't drop a job if its category channel is missing/inaccessible —
    // fall back to the default channel so nothing is silently lost.
    const recoverable = ["channel_not_found", "not_in_channel", "is_archived"];
    if (error && target !== config.slack.defaultChannel && recoverable.includes(error)) {
      console.warn(`Channel ${target} unavailable (${error}); posting to ${config.slack.defaultChannel} instead.`);
      error = await postViaBotToken(config.slack.defaultChannel, fallbackText, blocks);
    }
    if (error) throw new Error(`chat.postMessage failed for ${target}: ${error}`);
  } else if (process.env.SLACK_WEBHOOK_URL) {
    const res = await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: fallbackText, blocks }),
    });
    if (!res.ok) throw new Error(`Webhook post failed: HTTP ${res.status} ${await res.text()}`);
  }
}

// ---------- state ----------

function loadSeen() {
  try {
    return new Set(JSON.parse(fs.readFileSync(STATE_FILE, "utf8")).seen);
  } catch {
    return new Set();
  }
}

function saveSeen(seen) {
  const trimmed = [...seen].slice(-3000); // keep the most recent IDs only
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify({ seen: trimmed, updatedAt: new Date().toISOString() }));
}

// ---------- main ----------

const routingConfigured = Object.keys(config.slack.channelByCategory || {}).length > 0;
console.log(`Auth mode: ${AUTH_MODE}${DRY_RUN ? " (dry run)" : ""}.`);
if (AUTH_MODE === "webhook" && routingConfigured && !DRY_RUN) {
  console.warn(
    "WARNING: per-category routing is configured, but only SLACK_WEBHOOK_URL is set. " +
      "A webhook posts to its single bound channel, so ALL jobs will land there regardless of category. " +
      "Set SLACK_BOT_TOKEN (repository secret) to route jobs to their category channels.",
  );
}

const pages = Math.max(1, config.search?.pages ?? 2);
const all = [];
for (let p = 0; p < pages; p++) all.push(...await fetchPage(p * 30));
console.log(`Scraped ${all.length} job(s) across ${pages} page(s).`);

const seen = loadSeen();
const cutoff = Date.now() - MAX_AGE_MS;
const freshAll = all
  .filter((j) => !seen.has(j.id))
  .filter((j) => j.postedUtc && j.postedUtc.getTime() >= cutoff);
// maxPostsPerRun null/0 = no cap (post every fresh job).
const cap = config.maxPostsPerRun;
const fresh = cap && cap > 0 ? freshAll.slice(0, cap) : freshAll;

console.log(`${fresh.length} new job(s) after dedup + ${config.maxAgeHours}h freshness filter.`);

if (fresh.length) {
  const categories = await classifyAll(fresh);
  const tally = {}; // channel -> count, for a routing summary at the end
  let posted = 0;
  const failures = [];
  for (let i = 0; i < fresh.length; i++) {
    const job = fresh[i], category = categories[i];
    // In webhook mode delivery ignores the category and goes to the webhook's
    // single channel — reflect that in the tally so it shows real delivery.
    const channel = AUTH_MODE === "webhook" ? "(single webhook channel)" : channelFor(category);
    tally[channel] = (tally[channel] || 0) + 1;
    if (DRY_RUN) {
      console.log(`[dry-run] ${channel} | ${category} | ${job.title} | ${job.salary} | ${job.url}`);
      seen.add(job.id);
      continue;
    }
    try {
      await postToSlack(job, category);
      seen.add(job.id); // only mark seen once actually delivered
      posted++;
      await new Promise((r) => setTimeout(r, 1100)); // Slack chat.postMessage rate limit ~1/s
    } catch (err) {
      failures.push(`${job.id}: ${err.message}`);
      console.error(`Failed to post ${job.url}: ${err.message}`);
    }
  }
  console.log(DRY_RUN ? "Dry run complete — nothing posted to Slack." : `Posted ${posted}/${fresh.length} job(s) to Slack.`);
  const summary = Object.entries(tally).sort((a, b) => b[1] - a[1]).map(([c, n]) => `${c}: ${n}`).join(", ");
  console.log(`By channel — ${summary}`);
  if (failures.length === fresh.length && fresh.length > 0) {
    saveSeen(seen);
    throw new Error(`Every Slack post failed:\n${failures.join("\n")}`);
  }
}

saveSeen(seen);
