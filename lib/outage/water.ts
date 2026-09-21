// Water service interruptions (Maynilad, Manila Water, PrimeWater) from free
// Google News RSS. Keyword-gated to real water-supply incidents; geocoded by the
// city named in the headline, else pinned at a Metro Manila default.

import type { OutageEvent, Severity } from "./sources";

const CITY_COORDS: Record<string, [number, number]> = {
  "metro manila": [14.58, 121.0],
  manila: [14.5995, 120.9842],
  "quezon city": [14.676, 121.0437],
  makati: [14.5547, 121.0244],
  pasig: [14.5764, 121.0851],
  taguig: [14.5176, 121.0509],
  caloocan: [14.6577, 120.9842],
  paranaque: [14.4793, 121.0198],
  "las pinas": [14.4499, 120.9827],
  muntinlupa: [14.3814, 121.0497],
  valenzuela: [14.7011, 120.9833],
  malabon: [14.6626, 120.9569],
  navotas: [14.6667, 120.9417],
  marikina: [14.6507, 121.1029],
  mandaluyong: [14.5794, 121.0359],
  "san juan": [14.6019, 121.0355],
  pasay: [14.5378, 120.9896],
  rizal: [14.6, 121.2],
  antipolo: [14.59, 121.18],
  cavite: [14.4791, 120.8969],
  bacoor: [14.459, 120.929],
  imus: [14.4297, 120.9367],
  dasmarinas: [14.3294, 120.9367],
  laguna: [14.17, 121.24],
  bulacan: [14.7943, 120.8797],
  "san jose del monte": [14.8139, 121.0453],
  cebu: [10.32, 123.9],
  davao: [7.19, 125.46],
  iloilo: [10.72, 122.56],
};

const INCIDENT = [
  "interruption",
  "no water",
  "walang tubig",
  "water service",
  "supply interruption",
  "rationing",
  "low pressure",
  "advisory",
  "restored",
  "service disruption",
];
const NOISE = [
  "stock", "shares", "earnings", "revenue", "ipo", "dividend", "wins award", "globe restores",
  "ownership", "woes persist", "basketball", "cup", "crime water", "acquire", "acquisition",
];

const RECENCY_DAYS = 7;

const QUERY =
  '("Maynilad" OR "Manila Water" OR "PrimeWater") ' +
  '("service interruption" OR "water interruption" OR "no water" OR "walang tubig" OR ' +
  '"supply interruption" OR rationing OR advisory OR restored) when:10d';
const RSS_URL =
  "https://news.google.com/rss/search?q=" +
  encodeURIComponent(QUERY).replace(/%3A/g, ":") +
  "&hl=en-PH&gl=PH&ceid=PH:en";

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

function detectCity(low: string): { key: string; coords: [number, number] } {
  for (const key of Object.keys(CITY_COORDS)) {
    if (low.includes(key)) return { key, coords: CITY_COORDS[key] };
  }
  return { key: "metro manila", coords: CITY_COORDS["metro manila"] };
}

export async function getWater(): Promise<OutageEvent[]> {
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
    // Require water context + an incident phrase (operator name optional in title).
    const hasWater = low.includes("water") || low.includes("tubig");
    const hasIncident = INCIDENT.some((k) => low.includes(k));
    if (!hasWater || !hasIncident) continue;
    if (NOISE.some((k) => low.includes(k))) continue;

    const key = title.slice(0, 60);
    if (seen.has(key)) continue;
    seen.add(key);

    const { key: cityKey, coords } = detectCity(low);
    const restored = low.includes("restored") || low.includes("back to normal");
    const severe = low.includes("no water") || low.includes("walang tubig") || low.includes("rationing");
    const severity: Severity = restored ? "info" : severe ? "severe" : "warning";
    const region = cityKey.replace(/\b\w/g, (c) => c.toUpperCase());

    out.push({
      id: `water-${published ? +published : Date.now()}-${out.length}`,
      type: "water",
      title: title.length > 140 ? title.slice(0, 137) + "…" : title,
      region,
      lat: coords[0] + (Math.random() - 0.5) * 0.04,
      lng: coords[1] + (Math.random() - 0.5) * 0.04,
      severity,
      status: restored ? "resolved" : "active",
      source_name: "Water advisory via Google News (live)",
      source_url: linkM ? decode(linkM[1]) : "https://news.google.com",
      started_at: published && !isNaN(+published) ? published.toISOString() : new Date().toISOString(),
      sample: false,
    });
    if (out.length >= 8) break;
  }
  return out;
}
