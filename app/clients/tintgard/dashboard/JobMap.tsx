"use client";

import { useEffect, useRef } from "react";

export type MapJob = { client: string; staff: string; staffColor: string; status: string; start: string; lat: number; lng: number; address: string };

// Load Leaflet from CDN once (no npm dependency; the site sets no CSP).
function loadLeaflet(): Promise<unknown> {
  const w = window as unknown as { L?: unknown };
  if (w.L) return Promise.resolve(w.L);
  return new Promise((resolve, reject) => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css"; link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    const existing = document.getElementById("leaflet-js") as HTMLScriptElement | null;
    if (existing) { existing.addEventListener("load", () => resolve(w.L)); existing.addEventListener("error", reject); return; }
    const s = document.createElement("script");
    s.id = "leaflet-js"; s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    s.onload = () => resolve(w.L); s.onerror = reject;
    document.head.appendChild(s);
  });
}

const esc = (s: string) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function whenShort(str: string) {
  const m = str.match(/(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
  if (!m) return str;
  const [, , Mo, D, H, Mi] = m;
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let hh = +H; const ap = hh >= 12 ? "PM" : "AM"; hh = hh % 12 || 12;
  return `${+D} ${MON[+Mo - 1]} · ${hh}:${Mi} ${ap}`;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function JobMap({ jobs }: { jobs: MapJob[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    loadLeaflet().then((L: any) => {
      if (cancelled || !ref.current) return;
      if (!mapRef.current) {
        mapRef.current = L.map(ref.current, { scrollWheelZoom: false });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" }).addTo(mapRef.current);
      }
      const map = mapRef.current;
      map.eachLayer((layer: any) => { if (layer instanceof L.CircleMarker) map.removeLayer(layer); });
      const pts: [number, number][] = [];
      jobs.forEach((j) => {
        const mk = L.circleMarker([j.lat, j.lng], { radius: 8, color: "#ffffff", weight: 2, fillColor: j.staffColor || "#E11D2A", fillOpacity: 0.95 });
        mk.bindPopup(`<b>${esc(j.client)}</b><br>${esc(j.staff || "Unassigned")} · ${esc(j.status)}<br>${esc(whenShort(j.start))}${j.address ? "<br>" + esc(j.address) : ""}`);
        mk.addTo(map);
        pts.push([j.lat, j.lng]);
      });
      if (pts.length > 1) map.fitBounds(pts, { padding: [34, 34], maxZoom: 13 });
      else if (pts.length === 1) map.setView(pts[0], 12);
      else map.setView([-27.62, 152.95], 10);
      setTimeout(() => map.invalidateSize(), 60);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [jobs]);

  useEffect(() => () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } }, []);

  return <div ref={ref} style={{ height: 340, width: "100%", borderRadius: 12, overflow: "hidden", background: "#EAECEF", zIndex: 0 }} />;
}
