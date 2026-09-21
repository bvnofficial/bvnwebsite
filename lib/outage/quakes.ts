// Earthquakes in/near the Philippines from the free USGS FDSN API (GeoJSON).
// Reliable, structured, no key. Severity scales with magnitude.

import type { OutageEvent, Severity } from "./sources";

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

const URL =
  "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson" +
  "&minlatitude=4&maxlatitude=21&minlongitude=116&maxlongitude=127" +
  "&minmagnitude=2.5&orderby=time&limit=25";

async function fetchJson(url: string, ms: number): Promise<any | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { "User-Agent": "bvn-outage-tracker/1.0" } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

export async function getQuakes(): Promise<OutageEvent[]> {
  const start = isoDaysAgo(3);
  const data = await fetchJson(`${URL}&starttime=${start}`, 5000);
  if (!data?.features) return [];
  const out: OutageEvent[] = [];
  for (const f of data.features) {
    const p = f.properties || {};
    const g = f.geometry || {};
    const coords = g.coordinates || [];
    const mag: number = typeof p.mag === "number" ? p.mag : 0;
    if (coords.length < 2) continue;
    const sev: Severity = mag >= 6 ? "severe" : mag >= 4.5 ? "warning" : "info";
    const place = (p.place || "Philippines").replace(/^\d+\s*km\s*/i, "");
    out.push({
      id: `quake-${f.id}`,
      type: "quake",
      title: `Magnitude ${mag.toFixed(1)} earthquake — ${p.place || "Philippines"}`,
      region: place,
      lat: coords[1],
      lng: coords[0],
      severity: sev,
      status: "active",
      source_name: "USGS (live)",
      source_url: p.url || "https://earthquake.usgs.gov",
      started_at: p.time ? new Date(p.time).toISOString() : new Date().toISOString(),
      sample: false,
    });
    if (out.length >= 12) break;
  }
  return out;
}
