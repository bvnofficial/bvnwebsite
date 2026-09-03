"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Waves, TrainFront, Zap, Wifi, Droplets, Activity, Search, RefreshCw,
  AlertTriangle, MapPin, Link2, Check,
} from "lucide-react";

type EventType = "flood" | "rail" | "power" | "internet" | "water" | "quake";
type Severity = "info" | "warning" | "severe";

interface OutageEvent {
  id: string; type: EventType; title: string; region: string;
  lat: number; lng: number; severity: Severity; status: "active" | "resolved";
  source_name: string; source_url: string; started_at: string; sample: boolean;
}
interface InternetHealth {
  label: string; status: "normal" | "degraded" | "outage"; score: number;
  source_name: string; source_url: string; live: boolean;
}
interface ProviderStatus {
  name: string; state: "operational" | "reported" | "outage";
  note?: string; source_url?: string; at?: string;
}
interface Payload {
  events: OutageEvent[]; internet: InternetHealth; providers: ProviderStatus[]; generated_at: string;
}

// Types that appear as map pins (internet is shown as the ISP strip instead).
const TYPE_META: Record<Exclude<EventType, "internet">, { label: string; color: string; Icon: any }> = {
  flood: { label: "Baha / Flood", color: "#3b82f6", Icon: Waves },
  rail: { label: "Tren / Rail", color: "#a855f7", Icon: TrainFront },
  power: { label: "Kuryente / Power", color: "#f59e0b", Icon: Zap },
  water: { label: "Tubig / Water", color: "#06b6d4", Icon: Droplets },
  quake: { label: "Lindol / Quake", color: "#f43f5e", Icon: Activity },
};
const PIN_TYPES: Exclude<EventType, "internet">[] = ["flood", "rail", "power", "water", "quake"];

// Location zoom presets.
const AREAS: { id: string; name: string; c: [number, number]; z: number }[] = [
  { id: "ph", name: "Buong Pilipinas", c: [12.4, 122.0], z: 6 },
  { id: "metro-manila", name: "Metro Manila", c: [14.58, 121.0], z: 11 },
  { id: "rizal", name: "Rizal", c: [14.6, 121.2], z: 11 },
  { id: "cavite", name: "Cavite", c: [14.4, 120.9], z: 11 },
  { id: "laguna", name: "Laguna", c: [14.2, 121.3], z: 10 },
  { id: "bulacan", name: "Bulacan", c: [14.85, 120.9], z: 10 },
  { id: "pampanga", name: "Pampanga", c: [15.05, 120.68], z: 10 },
  { id: "baguio", name: "Baguio / Benguet", c: [16.41, 120.59], z: 11 },
  { id: "bicol", name: "Bicol (Legazpi/Naga)", c: [13.4, 123.4], z: 8 },
  { id: "cebu", name: "Cebu", c: [10.32, 123.9], z: 10 },
  { id: "iloilo", name: "Iloilo / Bacolod", c: [10.7, 122.75], z: 9 },
  { id: "tacloban", name: "Tacloban (E. Visayas)", c: [11.24, 125.0], z: 10 },
  { id: "davao", name: "Davao", c: [7.19, 125.46], z: 10 },
  { id: "cdo", name: "Cagayan de Oro", c: [8.48, 124.65], z: 11 },
  { id: "zamboanga", name: "Zamboanga", c: [6.92, 122.08], z: 11 },
  { id: "gensan", name: "General Santos", c: [6.11, 125.17], z: 11 },
];

declare global { interface Window { L: any } }

function loadLeaflet(): Promise<any> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return;
    if (window.L) return resolve(window.L);
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css"; link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    const s = document.createElement("script");
    s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    s.onload = () => resolve(window.L);
    document.body.appendChild(s);
  });
}

function timeAgo(iso: string): string {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const PROVIDER_DOT: Record<ProviderStatus["state"], string> = {
  operational: "#22c55e", reported: "#f59e0b", outage: "#ef4444",
};
const PROVIDER_LABEL: Record<ProviderStatus["state"], string> = {
  operational: "No reports", reported: "Issue reported", outage: "Outage reported",
};

export default function OutageMap() {
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const [data, setData] = useState<Payload | null>(null);
  const [active, setActive] = useState<Set<string>>(new Set(PIN_TYPES));
  const [issuesOnly, setIssuesOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [loc, setLoc] = useState("ph");
  const [mapReady, setMapReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const didInit = useRef(false);

  // Read deep-link params once on mount.
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    const p = new URLSearchParams(window.location.search);
    const t = p.get("type");
    if (t) {
      const set = new Set(t.split(",").filter((x) => (PIN_TYPES as string[]).includes(x)));
      if (set.size) setActive(set);
    }
    if (p.get("issues") === "1") setIssuesOnly(true);
    if (p.get("q")) setQuery(p.get("q") as string);
    const l = p.get("loc");
    if (l && AREAS.some((a) => a.id === l)) setLoc(l);
  }, []);

  // Write deep-link params when filters change.
  useEffect(() => {
    if (!didInit.current) return;
    const p = new URLSearchParams();
    if (active.size && active.size < PIN_TYPES.length) p.set("type", Array.from(active).join(","));
    if (issuesOnly) p.set("issues", "1");
    if (query.trim()) p.set("q", query.trim());
    if (loc !== "ph") p.set("loc", loc);
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [active, issuesOnly, query, loc]);

  // Init map.
  useEffect(() => {
    let cancelled = false;
    loadLeaflet().then((L) => {
      if (cancelled || mapRef.current || !L) return;
      const map = L.map("bvn-outage-map", { zoomControl: true, scrollWheelZoom: false }).setView([12.4, 122.0], 6);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "&copy; OpenStreetMap" }).addTo(map);
      mapRef.current = map;
      layerRef.current = L.layerGroup().addTo(map);
      map.whenReady(() => { map.invalidateSize(); setMapReady(true); });
      window.addEventListener("resize", () => map.invalidateSize());
    });
    return () => { cancelled = true; };
  }, []);

  // Apply location preset (also handles a deep-linked ?loc=).
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const a = AREAS.find((x) => x.id === loc);
    if (a) mapRef.current.setView(a.c, a.z, { animate: true });
  }, [loc, mapReady]);

  // Fetch + poll.
  useEffect(() => {
    let stop = false;
    async function load() {
      try {
        const res = await fetch("/api/outage", { cache: "no-store" });
        const json = await res.json();
        if (!stop) setData(json);
      } catch { /* keep last good */ } finally { if (!stop) setLoading(false); }
    }
    load();
    const id = setInterval(load, 60000);
    return () => { stop = true; clearInterval(id); };
  }, []);

  const events = useMemo(() => data?.events ?? [], [data]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events
      .filter((e) => e.type !== "internet")
      .filter((e) => active.has(e.type))
      .filter((e) => (issuesOnly ? e.severity !== "info" && e.status === "active" : true))
      .filter((e) => (q ? (e.title + " " + e.region).toLowerCase().includes(q) : true));
  }, [events, active, issuesOnly, query]);

  useEffect(() => {
    const L = window.L;
    if (!L || !mapReady || !layerRef.current) return;
    layerRef.current.clearLayers();
    for (const e of visible) {
      if (e.type === "internet") continue;
      const color = e.severity === "severe" ? "#ef4444" : TYPE_META[e.type as Exclude<EventType, "internet">].color;
      const marker = L.circleMarker([e.lat, e.lng], {
        radius: e.severity === "severe" ? 11 : e.severity === "warning" ? 8 : 6,
        color, fillColor: color, fillOpacity: 0.7, weight: 2,
      });
      const meta = TYPE_META[e.type as Exclude<EventType, "internet">];
      marker.bindPopup(
        `<strong>${e.title}</strong><br/><span style="color:#555">${meta.label} · ${e.region} · ${e.severity.toUpperCase()}</span><br/><span style="color:#555">${e.source_name}${e.sample ? " · sample" : " · live"} · ${timeAgo(e.started_at)}</span><br/><a href="${e.source_url}" target="_blank" rel="noreferrer">source</a>`
      );
      try { marker.addTo(layerRef.current); } catch { /* pane not ready */ }
    }
  }, [visible, mapReady]);

  function toggle(t: string) {
    setActive((prev) => { const n = new Set(prev); if (n.has(t)) n.delete(t); else n.add(t); return n; });
  }
  function focus(e: OutageEvent) { mapRef.current?.setView([e.lat, e.lng], 11, { animate: true }); }
  function copyLink() {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true); setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard blocked */ }
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = { flood: 0, rail: 0, power: 0, water: 0, quake: 0 };
    for (const e of events) if (e.type in c) c[e.type]++;
    return c;
  }, [events]);

  const providers = data?.providers ?? [];
  const net = data?.internet;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      {/* header */}
      <div className="flex flex-wrap items-center gap-3 border-b border-white/10 px-4 py-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
          <MapPin size={13} /> BVN Philippines Outage Tracker
        </span>
        {net && (
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: net.status === "normal" ? "#22c55e" : net.status === "degraded" ? "#f59e0b" : "#ef4444" }} />
            {net.label} · {net.score}/100
          </span>
        )}
        <button onClick={copyLink} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 hover:border-white/25">
          {copied ? <Check size={12} className="text-emerald-400" /> : <Link2 size={12} />}
          {copied ? "Copied!" : "Copy link"}
        </button>
        <span className="ml-auto inline-flex items-center gap-1 text-xs text-slate-400">
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          {data ? `Updated ${timeAgo(data.generated_at)} · 60s` : "Loading…"}
        </span>
      </div>

      {/* provider strip */}
      {providers.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-white/[0.02] px-4 py-2.5">
          <span className="text-xs font-semibold text-slate-400">ISP status:</span>
          {providers.map((p) => {
            const inner = (<>
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: PROVIDER_DOT[p.state] }} />
              <span className="text-slate-200">{p.name}</span>
              <span className="text-slate-500">· {PROVIDER_LABEL[p.state]}</span>
            </>);
            return p.source_url && p.state !== "operational" ? (
              <a key={p.name} href={p.source_url} target="_blank" rel="noreferrer" title={p.note}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs hover:border-white/25">{inner}</a>
            ) : (
              <span key={p.name} title={p.note} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs">{inner}</span>
            );
          })}
        </div>
      )}

      {/* controls */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        <select value={loc} onChange={(e) => setLoc(e.target.value)}
          className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white outline-none focus:border-white/30">
          {AREAS.map((a) => (<option key={a.id} value={a.id} className="bg-slate-800 text-white">📍 {a.name}</option>))}
        </select>
        {PIN_TYPES.map((t) => {
          const { label, color, Icon } = TYPE_META[t];
          const on = active.has(t);
          return (
            <button key={t} onClick={() => toggle(t)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${on ? "border-white/25 bg-white/10 text-white" : "border-white/10 bg-transparent text-slate-500"}`}>
              <Icon size={13} style={{ color: on ? color : "#64748b" }} />
              {label} <span className="text-slate-500">({counts[t]})</span>
            </button>
          );
        })}
        <button onClick={() => setIssuesOnly((v) => !v)}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${issuesOnly ? "border-red-500/40 bg-red-500/15 text-red-300" : "border-white/10 bg-transparent text-slate-500"}`}>
          <AlertTriangle size={13} /> Issues only
        </button>
        <div className="relative ml-auto">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search city, barangay, line…"
            className="w-52 rounded-full border border-white/10 bg-white/5 py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-slate-500 outline-none focus:border-white/30" />
        </div>
      </div>

      {/* body */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px]">
        <div id="bvn-outage-map" className="h-[380px] w-full bg-slate-200 lg:h-[560px]" />
        <div className="max-h-[560px] overflow-y-auto border-t border-white/10 lg:border-l lg:border-t-0">
          {visible.length === 0 && (
            <div className="p-4 text-sm text-slate-400">{loading ? "Loading live feeds…" : "Walang tugmang alerto sa mga filter na ito."}</div>
          )}
          {visible.slice().sort((a, b) => +new Date(b.started_at) - +new Date(a.started_at)).map((e) => (
            <button key={e.id} onClick={() => focus(e)} className="block w-full border-b border-white/10 px-4 py-3 text-left hover:bg-white/5">
              <div className="flex items-center gap-2">
                <span className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-900" style={{ background: TYPE_META[e.type as Exclude<EventType, "internet">].color }}>{e.type}</span>
                <span className="rounded border border-white/15 px-1.5 py-0.5 text-[10px] text-slate-400">{e.sample ? "sample" : "live"}</span>
                <span className="ml-auto text-[11px] text-slate-500">{timeAgo(e.started_at)}</span>
              </div>
              <div className="mt-1.5 text-[13px] leading-snug text-slate-100">{e.title}</div>
              <div className="mt-1 text-[11px] text-slate-400">
                {e.region} · <span className={e.severity === "severe" ? "font-semibold text-red-400" : ""}>{e.severity.toUpperCase()}</span> · {e.source_name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/10 px-4 py-2.5 text-[11px] text-slate-400">
        {PIN_TYPES.map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: TYPE_META[t].color }} />{TYPE_META[t].label}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "#ef4444" }} /> Severe</span>
        <a href="https://company.meralco.com.ph/guest-dashboard/brownout" target="_blank" rel="noreferrer" className="text-orange-400 hover:underline">
          Meralco live outage map ↗
        </a>
        <span className="ml-auto">Data: NASA POWER, IODA, Meralco, NGCP, USGS, Google News. Hindi opisyal na emergency source.</span>
      </div>
    </div>
  );
}
