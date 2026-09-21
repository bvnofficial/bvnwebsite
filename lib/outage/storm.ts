// Typhoon / tropical cyclone signals from free Google News RSS (PAGASA bulletins).
// One entry per named storm; severity scales with category / wind signal.

import type { OutageEvent, Severity } from "./sources";

const RECENCY_DAYS = 4;

const QUERY =
  '(PAGASA OR "tropical cyclone" OR typhoon OR bagyo) ' +
  '("signal no" OR "wind signal" OR landfall OR "tropical storm" OR "tropical depression" OR ' +
  'intensifies OR "super typhoon" OR "storm surge" OR "exits PAR" OR "enters PAR") when:5d';
const RSS_URL =
  "https://news.google.com/rss/search?q=" +
  encodeURIComponent(QUERY).replace(/%3A/g, ":") +
  "&hl=en-PH&gl=PH&ceid=PH:en";

// Storms sit offshore; pin at a representative point east of the archipelago.
const DEFAULT_POS: [number, number] = [15.2, 126.8];
const AREA_POS: Record<string, [number, number]> = {
  luzon: [16.0, 121.2],
  visayas: [10.9, 123.8],
  mindanao: [7.8, 125.2],
  bicol: [13.4, 123.6],
  "northern luzon": [17.5, 121.5],
  batanes: [20.4, 121.9],
  cagayan: [18.0, 121.8],
};

async function fetchText(url: string, ms: number): Promise<string | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { "User-Agent": "Mozilla/5.0 (bvn-outage-tracker)" } });
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

function severityOf(low: string): Severity {
  const sig = low.match(/signal\s*(?:no\.?|number|#)?\s*([1-5])/);
  if (low.includes("super typhoon")) return "severe";
  if (sig && parseInt(sig[1], 10) >= 3) return "severe";
  if (low.includes("dissipat") || low.includes("exits par") || low.includes("weakens into a low") || low.includes("low pressure area")) return "info";
  if (low.includes("typhoon")) return "severe";
  if (low.includes("tropical storm") || low.includes("severe tropical storm") || (sig && parseInt(sig[1], 10) >= 1)) return "warning";
  if (low.includes("tropical depression")) return "warning";
  return "info";
}

// Pull the storm's name for de-duplication (ALL-CAPS PAGASA names, or after a category word).
function stormKey(title: string): string {
  const caps = title.match(/\b([A-Z]{4,10})\b/);
  if (caps && !["PAGASA", "PAR", "LPA", "ITCZ"].includes(caps[1])) return caps[1];
  const after = title.match(/(?:Storm|Typhoon|Depression)\s+([A-Z][a-z]+)/);
  if (after) return after[1].toUpperCase();
  return title.slice(0, 40).toUpperCase();
}

function areaPos(low: string): [number, number] {
  for (const k of Object.keys(AREA_POS)) if (low.includes(k)) return AREA_POS[k];
  return DEFAULT_POS;
}

export async function getStorms(): Promise<OutageEvent[]> {
  const xml = await fetchText(RSS_URL, 5000);
  if (!xml) return [];
  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
  const cutoff = Date.now() - RECENCY_DAYS * 24 * 60 * 60 * 1000;
  const out: OutageEvent[] = [];
  const seen = new Set<string>();

  for (const raw of items) {
    const titleM = raw.match(/<title>([\s\S]*?)<\/title>/);
    const linkM = raw.match(/<link>([\s\S]*?)<\/link>/);
    const dateM = raw.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    if (!titleM) continue;
    const title = decode(titleM[1]);
    const low = title.toLowerCase();
    const published = dateM ? new Date(dateM[1]) : null;
    if (published && +published < cutoff) continue;
    if (!/typhoon|tropical|bagyo|cyclone|signal/.test(low)) continue;

    const key = stormKey(title);
    if (seen.has(key)) continue;
    seen.add(key);

    const pos = areaPos(low);
    out.push({
      id: `storm-${key}-${published ? +published : Date.now()}`,
      type: "storm",
      title: title.length > 150 ? title.slice(0, 147) + "…" : title,
      region: `Bagyo / PAGASA`,
      lat: pos[0] + (Math.random() - 0.5) * 0.3,
      lng: pos[1] + (Math.random() - 0.5) * 0.3,
      severity: severityOf(low),
      status: low.includes("dissipat") || low.includes("exits par") ? "resolved" : "active",
      source_name: "PAGASA via Google News (live)",
      source_url: linkM ? decode(linkM[1]) : "https://www.pagasa.dost.gov.ph",
      started_at: published && !isNaN(+published) ? published.toISOString() : new Date().toISOString(),
      sample: false,
    });
    if (out.length >= 5) break;
  }
  return out;
}
