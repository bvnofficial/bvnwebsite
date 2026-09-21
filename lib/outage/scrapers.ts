// Meralco scheduled interruptions (Luzon) + NGCP grid alerts (all three grids).
// Falls back to sample data if a scrape yields nothing.

import type { OutageEvent, Severity } from "./sources";

const MM_CITY_COORDS: Record<string, [number, number]> = {
  manila: [14.5995, 120.9842],
  "quezon city": [14.676, 121.0437],
  makati: [14.5547, 121.0244],
  "makati city": [14.5547, 121.0244],
  pasig: [14.5764, 121.0851],
  "pasig city": [14.5764, 121.0851],
  marikina: [14.6507, 121.1029],
  "marikina city": [14.6507, 121.1029],
  caloocan: [14.6577, 120.9842],
  "caloocan city": [14.6577, 120.9842],
  taguig: [14.5176, 121.0509],
  "taguig city": [14.5176, 121.0509],
  paranaque: [14.4793, 121.0198],
  "paranaque city": [14.4793, 121.0198],
  mandaluyong: [14.5794, 121.0359],
  "mandaluyong city": [14.5794, 121.0359],
  "las pinas": [14.4499, 120.9827],
  "las pinas city": [14.4499, 120.9827],
  valenzuela: [14.7011, 120.9833],
  "valenzuela city": [14.7011, 120.9833],
  malabon: [14.6626, 120.9569],
  "malabon city": [14.6626, 120.9569],
  navotas: [14.6667, 120.9417],
  "navotas city": [14.6667, 120.9417],
  "san juan": [14.6019, 121.0355],
  "san juan city": [14.6019, 121.0355],
  pasay: [14.5378, 120.9896],
  "pasay city": [14.5378, 120.9896],
  pateros: [14.5456, 121.0669],
  muntinlupa: [14.3814, 121.0497],
  "muntinlupa city": [14.3814, 121.0497],
};

const MAINT_URL = "https://company.meralco.com.ph/news-and-advisories/maintenance-schedule";

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
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

interface ParsedEntry {
  title: string;
  slug: string;
  date: string;
  city: string;
  area: string;
}

function parseEntries(htmlText: string): ParsedEntry[] {
  const linkRe = /maintenance-schedule\/([a-z0-9-]+)"[^>]*>([^<]{6,140})<\/a>/g;
  const seen = new Set<string>();
  const out: ParsedEntry[] = [];
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(htmlText))) {
    const slug = m[1];
    const title = decode(m[2]);
    if (!/20\d\d/.test(title)) continue;
    if (seen.has(title)) continue;
    seen.add(title);

    const parsed = title.match(
      /^([A-Za-z]+\s+\d+(?:\s*-\s*\d+)?,\s*20\d\d)\s*-\s*([^(]+?)\s*(?:\(([^)]+)\))?$/
    );
    if (!parsed) continue;
    out.push({
      title,
      slug,
      date: parsed[1].trim(),
      city: parsed[2].trim(),
      area: (parsed[3] || "").trim(),
    });
  }
  return out;
}

// From "September 4 - 5, 2026" derive the last day so past interruptions auto-resolve.
function endOfInterruption(dateStr: string): Date | null {
  const y = dateStr.match(/20\d\d/);
  const month = dateStr.match(/[A-Za-z]+/);
  const days = dateStr.match(/\b(\d{1,2})\b/g);
  if (!y || !month || !days) return null;
  const lastDay = Math.max(...days.map((d) => parseInt(d, 10)));
  const d = new Date(`${month[0]} ${lastDay}, ${y[0]} 23:59:59`);
  return isNaN(+d) ? null : d;
}

export async function getPowerLive(sampleFallback: OutageEvent[]): Promise<OutageEvent[]> {
  const htmlText = await fetchText(MAINT_URL, 5000);
  if (!htmlText) return sampleFallback;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const entries = parseEntries(htmlText);
  const events: OutageEvent[] = [];
  for (const e of entries) {
    const coords = MM_CITY_COORDS[e.city.toLowerCase()];
    if (!coords) continue;

    const end = endOfInterruption(e.date);
    if (end && +end < +startOfToday) continue; // auto-resolve past

    const started = new Date(`${e.date.replace(/\s*-\s*\d+,/, ",")} 00:00:00`);
    const startedIso = isNaN(+started) ? new Date().toISOString() : started.toISOString();

    events.push({
      id: `power-meralco-${e.slug}`,
      type: "power",
      title: `Meralco scheduled interruption: ${e.area ? e.area + ", " : ""}${e.city} (${e.date})`,
      region: e.area ? `${e.area}, ${e.city}` : e.city,
      // Jitter within the city so multiple barangays do not stack on one point.
      lat: coords[0] + (Math.random() - 0.5) * 0.03,
      lng: coords[1] + (Math.random() - 0.5) * 0.03,
      severity: "warning" as Severity,
      status: "active",
      source_name: "Meralco (live)",
      source_url: `https://company.meralco.com.ph/news-and-advisories/maintenance-schedule/${e.slug}`,
      started_at: startedIso,
      sample: false,
    });
  }
  return events.length > 0 ? events : sampleFallback;
}

// --- NGCP grid alerts (yellow/red) for all three grids via Google News RSS ---
const GRID_QUERY =
  'NGCP ("yellow alert" OR "red alert") (Luzon OR Visayas OR Mindanao OR grid) when:3d';
const GRID_URL =
  "https://news.google.com/rss/search?q=" +
  encodeURIComponent(GRID_QUERY).replace(/%3A/g, ":") +
  "&hl=en-PH&gl=PH&ceid=PH:en";

const GRID_CENTROID: Record<string, { region: string; lat: number; lng: number }> = {
  luzon: { region: "Luzon grid (NGCP)", lat: 15.5, lng: 121.0 },
  visayas: { region: "Visayas grid (NGCP)", lat: 10.7, lng: 123.5 },
  mindanao: { region: "Mindanao grid (NGCP)", lat: 7.5, lng: 125.0 },
};

export async function getGridAlerts(): Promise<OutageEvent[]> {
  const xml = await fetchText(GRID_URL, 5000);
  if (!xml) return [];
  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
  const cutoff = Date.now() - 3 * 24 * 60 * 60 * 1000;
  const out: OutageEvent[] = [];
  const seenGrids = new Set<string>();

  for (const raw of items) {
    const titleM = raw.match(/<title>([\s\S]*?)<\/title>/);
    const linkM = raw.match(/<link>([\s\S]*?)<\/link>/);
    const dateM = raw.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    if (!titleM) continue;
    const title = decode(titleM[1]);
    const low = title.toLowerCase();
    const published = dateM ? new Date(dateM[1]) : null;
    if (published && +published < cutoff) continue;
    if (!low.includes("alert") || !low.includes("ngcp")) continue;

    const grid = low.includes("visayas")
      ? "visayas"
      : low.includes("mindanao")
      ? "mindanao"
      : low.includes("luzon")
      ? "luzon"
      : null;
    if (!grid || seenGrids.has(grid)) continue;
    seenGrids.add(grid);

    const c = GRID_CENTROID[grid];
    const red = low.includes("red alert");
    out.push({
      id: `power-ngcp-${grid}-${published ? +published : Date.now()}`,
      type: "power",
      title: title.length > 140 ? title.slice(0, 137) + "…" : title,
      region: c.region,
      lat: c.lat,
      lng: c.lng,
      severity: red ? "severe" : "warning",
      status: "active",
      source_name: "NGCP via Google News (live)",
      source_url: linkM ? decode(linkM[1]) : "https://news.google.com",
      started_at: published && !isNaN(+published) ? published.toISOString() : new Date().toISOString(),
      sample: false,
    });
  }
  return out;
}
