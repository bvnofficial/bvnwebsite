// Free rail feed: Google News RSS for Philippine rail service items (no API key).
// Items are date-filtered, keyword-gated to real disruptions/resolutions, assigned
// to a line, and classified by severity. Falls back to sample data if none found.

import type { OutageEvent, Severity } from "./sources";

const LINE_ANCHOR: Record<string, { region: string; lat: number; lng: number }> = {
  "MRT-3": { region: "EDSA (MRT-3)", lat: 14.5866, lng: 121.0567 },
  "LRT-1": { region: "LRT-1 corridor", lat: 14.5435, lng: 120.9936 },
  "LRT-2": { region: "LRT-2 corridor", lat: 14.6216, lng: 121.0516 },
  PNR: { region: "PNR (Tutuban)", lat: 14.6045, lng: 120.9757 },
};

const DISRUPTION = [
  "suspend",
  "limited operation",
  "partial operation",
  "unloading",
  "service interruption",
  "glitch",
  "technical",
  "stalled",
  "fault",
  "delay",
  "breakdown",
  "disruption",
];
const RESOLUTION = ["resume", "normal operation", "restored", "back to normal"];
const NOISE = [
  "free train",
  "free ride",
  "privatization",
  "privatisation",
  "waiting room",
  "unveiled",
  "expressed interest",
  "lawsuit",
  "shareholder",
  "stockholder",
  "class action",
  "securities",
  "pentair",
];

const RECENCY_DAYS = 10;

// encodeURIComponent turns the colon in Google's `when:` operator into %3A,
// which silently breaks the date filter. Restore the literal colon after encoding.
const RSS_QUERY =
  '("MRT-3" OR "LRT-1" OR "LRT-2" OR "Philippine National Railways") ' +
  '(suspended OR "limited operations" OR "partial operations" OR unloading OR ' +
  '"service interruption" OR glitch OR technical OR stalled OR fault OR resumes ' +
  "OR breakdown OR disruption) when:14d";
const RSS_URL =
  "https://news.google.com/rss/search?q=" +
  encodeURIComponent(RSS_QUERY).replace(/%3A/g, ":") +
  "&hl=en-PH&gl=PH&ceid=PH:en";

async function fetchText(url: string, ms: number): Promise<string | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "Mozilla/5.0 (bvn-outage-tracker)" },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

function decode(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function detectLine(title: string): string | null {
  const t = title.toLowerCase();
  if (t.includes("mrt-3") || t.includes("mrt3") || t.includes("mrt 3")) return "MRT-3";
  if (t.includes("lrt-2") || t.includes("lrt2") || t.includes("lrt 2")) return "LRT-2";
  if (t.includes("lrt-1") || t.includes("lrt1") || t.includes("lrt 1")) return "LRT-1";
  if (t.includes("philippine national railways") || /\bpnr\b/.test(t)) return "PNR";
  return null;
}

function classify(title: string): Severity | "resolved" {
  const t = title.toLowerCase();
  if (RESOLUTION.some((k) => t.includes(k))) return "resolved";
  if (t.includes("suspend") || t.includes("service interruption") || t.includes("stalled"))
    return "severe";
  return "warning";
}

export async function getRailLive(sampleFallback: OutageEvent[]): Promise<OutageEvent[]> {
  const xml = await fetchText(RSS_URL, 5000);
  if (!xml) return sampleFallback;

  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
  const cutoff = Date.now() - RECENCY_DAYS * 24 * 60 * 60 * 1000;
  const out: OutageEvent[] = [];
  const seenLines = new Set<string>();

  for (const raw of items) {
    const titleM = raw.match(/<title>([\s\S]*?)<\/title>/);
    const linkM = raw.match(/<link>([\s\S]*?)<\/link>/);
    const dateM = raw.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    if (!titleM) continue;

    const title = decode(titleM[1]);
    const low = title.toLowerCase();
    const published = dateM ? new Date(dateM[1]) : null;

    if (published && +published < cutoff) continue;
    if (NOISE.some((k) => low.includes(k))) continue;
    const hasSignal =
      DISRUPTION.some((k) => low.includes(k)) || RESOLUTION.some((k) => low.includes(k));
    if (!hasSignal) continue;

    const line = detectLine(title);
    if (!line) continue;
    if (seenLines.has(line)) continue;
    seenLines.add(line);

    const anchor = LINE_ANCHOR[line];
    const verdict = classify(title);
    const severity: Severity = verdict === "resolved" ? "info" : verdict;

    out.push({
      id: `rail-news-${line}-${published ? +published : Date.now()}`,
      type: "rail",
      title: title.length > 140 ? title.slice(0, 137) + "…" : title,
      region: anchor.region,
      lat: anchor.lat,
      lng: anchor.lng,
      severity,
      status: verdict === "resolved" ? "resolved" : "active",
      source_name: "Google News (live)",
      source_url: linkM ? decode(linkM[1]) : "https://news.google.com",
      started_at: published && !isNaN(+published) ? published.toISOString() : new Date().toISOString(),
      sample: false,
    });
  }

  return out.length > 0 ? out : sampleFallback;
}
