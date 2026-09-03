// Feed engine for the PH Outage Tracker (/apps/outage-tracker).
// All feeds are fetched server-side with a short timeout and a safe fallback,
// so the dashboard always renders even when an upstream API is slow or down.

import { getPowerLive, getGridAlerts } from "./scrapers";
import { getRailLive } from "./rail";
import { getProviders, type ProviderStatus } from "./internet";
import { getWater } from "./water";
import { getQuakes } from "./quakes";

export type EventType = "flood" | "rail" | "power" | "internet" | "water" | "quake";
export type Severity = "info" | "warning" | "severe";

export interface OutageEvent {
  id: string;
  type: EventType;
  title: string;
  region: string;
  lat: number;
  lng: number;
  severity: Severity;
  status: "active" | "resolved";
  source_name: string;
  source_url: string;
  started_at: string;
  sample: boolean;
}

export interface InternetHealth {
  label: string;
  status: "normal" | "degraded" | "outage";
  score: number;
  source_name: string;
  source_url: string;
  live: boolean;
}

async function fetchWithTimeout(url: string, ms: number): Promise<Response | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { "User-Agent": "bvn-outage-tracker/1.0" } });
    return res.ok ? res : null;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

// --- Internet: IODA (Georgia Tech) national signal for the Philippines ---
export async function getInternetHealth(): Promise<InternetHealth> {
  const fallback: InternetHealth = {
    label: "PH internet: no live signal (placeholder)",
    status: "normal",
    score: 96,
    source_name: "IODA (Georgia Tech)",
    source_url: "https://ioda.inetintel.cc.gatech.edu/country/PH",
    live: false,
  };
  const now = Math.floor(Date.now() / 1000);
  const from = now - 60 * 60 * 6;
  const url = `https://api.ioda.inetintel.cc.gatech.edu/v2/outages/alerts?from=${from}&until=${now}&entityType=country&entityCode=PH`;
  const res = await fetchWithTimeout(url, 4000);
  if (!res) return fallback;
  try {
    const data: any = await res.json();
    const alerts: any[] = data?.data ?? [];
    const activeAlerts = alerts.filter((a) => a?.level && a.level !== "normal");
    if (activeAlerts.length === 0) {
      return { ...fallback, label: "PH internet: normal (live)", live: true };
    }
    const severe = activeAlerts.some((a) => a.level === "critical");
    return {
      label: severe ? "PH internet: outage detected (live)" : "PH internet: degraded (live)",
      status: severe ? "outage" : "degraded",
      score: severe ? 40 : 72,
      source_name: "IODA (Georgia Tech)",
      source_url: "https://ioda.inetintel.cc.gatech.edu/country/PH",
      live: true,
    };
  } catch {
    return fallback;
  }
}

// --- Flood: NASA POWER rainfall sampled at anchor cities across all regions ---
const FLOOD_CITIES: { name: string; lat: number; lng: number }[] = [
  { name: "Metro Manila", lat: 14.6, lng: 121.0 },
  { name: "Baguio", lat: 16.41, lng: 120.59 },
  { name: "Laoag", lat: 18.2, lng: 120.59 },
  { name: "Vigan", lat: 17.57, lng: 120.39 },
  { name: "Dagupan", lat: 16.04, lng: 120.34 },
  { name: "Tuguegarao", lat: 17.61, lng: 121.73 },
  { name: "Ilagan", lat: 17.13, lng: 121.89 },
  { name: "San Fernando (Pampanga)", lat: 15.03, lng: 120.69 },
  { name: "Cabanatuan", lat: 15.49, lng: 120.97 },
  { name: "Olongapo", lat: 14.83, lng: 120.28 },
  { name: "Antipolo", lat: 14.59, lng: 121.18 },
  { name: "Calamba", lat: 14.21, lng: 121.16 },
  { name: "Batangas City", lat: 13.76, lng: 121.06 },
  { name: "Lucena", lat: 13.93, lng: 121.62 },
  { name: "Calapan", lat: 13.41, lng: 121.18 },
  { name: "Puerto Princesa", lat: 9.74, lng: 118.74 },
  { name: "Naga", lat: 13.62, lng: 123.18 },
  { name: "Legazpi", lat: 13.14, lng: 123.74 },
  { name: "Sorsogon", lat: 12.97, lng: 124.01 },
  { name: "Iloilo", lat: 10.72, lng: 122.56 },
  { name: "Bacolod", lat: 10.68, lng: 122.95 },
  { name: "Cebu", lat: 10.32, lng: 123.9 },
  { name: "Dumaguete", lat: 9.31, lng: 123.31 },
  { name: "Tacloban", lat: 11.24, lng: 125.0 },
  { name: "Ormoc", lat: 11.01, lng: 124.61 },
  { name: "Zamboanga", lat: 6.92, lng: 122.08 },
  { name: "Dipolog", lat: 8.59, lng: 123.34 },
  { name: "Cagayan de Oro", lat: 8.48, lng: 124.65 },
  { name: "Iligan", lat: 8.23, lng: 124.24 },
  { name: "Davao", lat: 7.19, lng: 125.46 },
  { name: "Tagum", lat: 7.45, lng: 125.81 },
  { name: "General Santos", lat: 6.11, lng: 125.17 },
  { name: "Koronadal", lat: 6.5, lng: 124.85 },
  { name: "Cotabato City", lat: 7.22, lng: 124.25 },
  { name: "Butuan", lat: 8.95, lng: 125.53 },
  { name: "Surigao", lat: 9.79, lng: 125.49 },
];

const sampleFloods: OutageEvent[] = [
  {
    id: "flood-marikina-1",
    type: "flood",
    title: "Marikina River monitoring, low-lying barangays advised",
    region: "Marikina",
    lat: 14.6507,
    lng: 121.1029,
    severity: "warning",
    status: "active",
    source_name: "PAGASA (sample)",
    source_url: "https://www.pagasa.dost.gov.ph/flood",
    started_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    sample: true,
  },
];

function ymd(d: Date): string {
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(
    d.getUTCDate()
  ).padStart(2, "0")}`;
}

async function rainForCity(city: { name: string; lat: number; lng: number }): Promise<OutageEvent | null> {
  const start = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000);
  const url =
    `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=PRECTOTCORR&community=RE` +
    `&longitude=${city.lng}&latitude=${city.lat}&start=${ymd(start)}&end=${ymd(new Date())}&format=JSON`;
  const res = await fetchWithTimeout(url, 6000);
  if (!res) return null;
  try {
    const data: any = await res.json();
    const series: Record<string, number> = data?.properties?.parameter?.PRECTOTCORR ?? {};
    const dates = Object.keys(series).filter((d) => series[d] >= 0);
    if (dates.length === 0) return null;
    const latest = dates[dates.length - 1];
    const mm = series[latest];
    const sev: Severity = mm > 30 ? "severe" : mm > 10 ? "warning" : "info";
    return {
      id: `flood-nasa-${city.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`,
      type: "flood",
      title: `Rainfall ${mm.toFixed(1)} mm in ${city.name} (${latest})`,
      region: city.name,
      lat: city.lat,
      lng: city.lng,
      severity: sev,
      status: mm > 10 ? "active" : "resolved",
      source_name: "NASA POWER (live)",
      source_url: "https://power.larc.nasa.gov",
      started_at: new Date().toISOString(),
      sample: false,
    };
  } catch {
    return null;
  }
}

export async function getFloods(): Promise<OutageEvent[]> {
  const results = await Promise.all(FLOOD_CITIES.map((c) => rainForCity(c)));
  const live = results.filter((e): e is OutageEvent => e !== null);
  return live.length > 0 ? live : sampleFloods;
}

// --- Rail: LIVE via Google News RSS (free), sample as fallback ---
const sampleRail: OutageEvent[] = [
  {
    id: "rail-mrt3-1",
    type: "rail",
    title: "MRT-3: normal operations, North Ave to Taft",
    region: "EDSA (MRT-3)",
    lat: 14.5866,
    lng: 121.0567,
    severity: "info",
    status: "active",
    source_name: "MRT-3 (sample)",
    source_url: "https://dotrmrt3.gov.ph",
    started_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    sample: true,
  },
];

export async function getRail(): Promise<OutageEvent[]> {
  return getRailLive(sampleRail);
}

// --- Power: LIVE Meralco (Luzon) schedule + NGCP grid alerts ---
const samplePower: OutageEvent[] = [
  {
    id: "power-makati-1",
    type: "power",
    title: "Meralco: scheduled maintenance interruption (sample)",
    region: "Makati",
    lat: 14.5547,
    lng: 121.0244,
    severity: "warning",
    status: "active",
    source_name: "Meralco (sample)",
    source_url: "https://company.meralco.com.ph/news-and-advisories/maintenance-schedule",
    started_at: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    sample: true,
  },
];

export async function getPower(): Promise<OutageEvent[]> {
  return getPowerLive(samplePower);
}

export type Payload = {
  events: OutageEvent[];
  internet: InternetHealth;
  providers: ProviderStatus[];
  generated_at: string;
};

// In-memory TTL cache; a warm lambda reuses it so upstreams are hit at most once per TTL.
const CACHE_TTL_MS = 60 * 1000;
let cache: { at: number; data: Payload } | null = null;

async function buildPayload(): Promise<Payload> {
  const [floods, rail, power, grid, water, quakes, internet, providers] = await Promise.all([
    getFloods(),
    getRail(),
    getPower(),
    getGridAlerts(),
    getWater(),
    getQuakes(),
    getInternetHealth(),
    getProviders(),
  ]);
  const events = [...floods, ...rail, ...power, ...grid, ...water, ...quakes];
  return { events, internet, providers, generated_at: new Date().toISOString() };
}

export async function getAllEvents(): Promise<Payload> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.data;
  const data = await buildPayload();
  cache = { at: Date.now(), data };
  return data;
}
