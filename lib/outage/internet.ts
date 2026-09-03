// Per-provider internet status (Converge, PLDT, Globe, DITO, Sky) from free
// Google News RSS outage reports. Each provider defaults to "operational" and
// flips to "reported"/"outage" when a recent, telecom-context report matches.

export type ProviderState = "operational" | "reported" | "outage";

export interface ProviderStatus {
  name: string;
  state: ProviderState;
  note?: string; // headline of the most recent report
  source_url?: string;
  at?: string; // ISO of the report
}

const PROVIDERS: { name: string; match: string[] }[] = [
  { name: "PLDT", match: ["pldt"] },
  { name: "Globe", match: ["globe telecom", "globe fiber", "globe at home", "globe"] },
  { name: "Converge", match: ["converge"] },
  { name: "DITO", match: ["dito telecommunity", "dito"] },
  { name: "Sky", match: ["sky fiber", "sky broadband", "sky cable"] },
];

// Must contain telecom context AND an incident verb; must NOT be sports/corporate.
const TELECOM = ["internet", "broadband", "fiber", "data service", "network", "connectivity", "service"];
const INCIDENT = ["outage", "down", "restored", "disruption", "interruption", "walang internet", "no internet", "fiber cut", "service loss"];
const NOISE = [
  "pvl", "volley", "hitter", "spiker", "champ", "upset", "league", "cup", "invitational", "stun", "game",
  "chairman", "steps down", "board", "chair", "aims to", "establishes", "always on", "keeps", "push",
  "earnings", "revenue", "profit", "stock", "shares", "partnership", "launch", "unveils", "expands",
];

const RECENCY_DAYS = 5;

const QUERY =
  '("Converge ICT" OR Converge OR PLDT OR Globe OR DITO OR "Sky Fiber" OR "Sky Broadband") ' +
  "(internet OR broadband OR fiber OR network OR connectivity OR \"data service\") " +
  '(outage OR down OR restored OR disruption OR interruption OR "walang internet") when:7d';
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

export async function getProviders(): Promise<ProviderStatus[]> {
  const base: Record<string, ProviderStatus> = {};
  for (const p of PROVIDERS) base[p.name] = { name: p.name, state: "operational" };

  const xml = await fetchText(RSS_URL, 5000);
  if (!xml) return Object.values(base);

  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
  const cutoff = Date.now() - RECENCY_DAYS * 24 * 60 * 60 * 1000;

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
    if (!TELECOM.some((k) => low.includes(k))) continue;
    if (!INCIDENT.some((k) => low.includes(k))) continue;

    const provider = PROVIDERS.find((p) => p.match.some((m) => low.includes(m)));
    if (!provider) continue;

    const cur = base[provider.name];
    // Keep the most recent report per provider.
    if (cur.at && published && +new Date(cur.at) >= +published) continue;

    const resolved = low.includes("restored") || low.includes("back to normal") || low.includes("resolves");
    const hardDown = low.includes("outage") || low.includes(" down") || low.includes("walang internet") || low.includes("no internet");
    base[provider.name] = {
      name: provider.name,
      state: resolved ? "operational" : hardDown ? "outage" : "reported",
      note: title.length > 130 ? title.slice(0, 127) + "…" : title,
      source_url: linkM ? decode(linkM[1]) : "https://news.google.com",
      at: published && !isNaN(+published) ? published.toISOString() : new Date().toISOString(),
    };
  }

  return PROVIDERS.map((p) => base[p.name]);
}
