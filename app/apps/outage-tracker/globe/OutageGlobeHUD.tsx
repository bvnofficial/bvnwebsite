"use client";

// Full-page "God's Eye" style 3D globe for the PH Outage Tracker.
// CesiumJS from CDN, 100% key-free: Esri World Imagery (satellite, no key) +
// flat ellipsoid terrain + Cesium's own starfield. All the HUD chrome is a DOM
// overlay. Visual homage to bilawalsidhu/gods-eye-view (MIT), branded for BVN.

import { useEffect, useRef, useState } from "react";

type Severity = "info" | "warning" | "severe";
interface Ev {
  id: string; type: string; title: string; region: string;
  lat: number; lng: number; severity: Severity;
  source_name: string; source_url: string; started_at: string; sample: boolean;
  status?: "active" | "resolved";
}
interface Payload { events: Ev[]; providers?: any[]; generated_at: string }

const CAT: { type: string; label: string; color: string }[] = [
  { type: "flood", label: "Baha / Flood", color: "#3b82f6" },
  { type: "storm", label: "Bagyo / Storm", color: "#6366f1" },
  { type: "power", label: "Kuryente / Power", color: "#f59e0b" },
  { type: "water", label: "Tubig / Water", color: "#06b6d4" },
  { type: "quake", label: "Lindol / Quake", color: "#f43f5e" },
  { type: "rail", label: "Tren / Rail", color: "#a855f7" },
];
const COLOR: Record<string, string> = Object.fromEntries(CAT.map((c) => [c.type, c.color]));
const LABEL: Record<string, string> = Object.fromEntries(CAT.map((c) => [c.type, c.label]));
const PIN_TYPES = CAT.map((c) => c.type);
const PH = { lon: 122.5, lat: 12.6, alt: 3_800_000 };

const CESIUM_VERSION = "1.124.0";
const CESIUM_BASE = `https://unpkg.com/cesium@${CESIUM_VERSION}/Build/Cesium/`;
let cesiumPromise: Promise<any> | null = null;
function loadCesium(): Promise<any> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if ((window as any).Cesium) return Promise.resolve((window as any).Cesium);
  if (cesiumPromise) return cesiumPromise;
  cesiumPromise = new Promise((resolve) => {
    (window as any).CESIUM_BASE_URL = CESIUM_BASE;
    if (!document.getElementById("cesium-css")) {
      const l = document.createElement("link");
      l.id = "cesium-css"; l.rel = "stylesheet"; l.href = CESIUM_BASE + "Widgets/widgets.css";
      document.head.appendChild(l);
    }
    if (!document.getElementById("geh-fonts")) {
      const f = document.createElement("link");
      f.id = "geh-fonts"; f.rel = "stylesheet";
      f.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Share+Tech+Mono&display=swap";
      document.head.appendChild(f);
    }
    const s = document.createElement("script");
    s.id = "cesium-js"; s.src = CESIUM_BASE + "Cesium.js";
    s.onload = () => resolve((window as any).Cesium);
    document.body.appendChild(s);
  });
  return cesiumPromise;
}

function utmZone(lon: number): number { return Math.floor((lon + 180) / 6) + 1; }
function bandLetter(lat: number): string {
  const bands = "CDEFGHJKLMNPQRSTUVWX";
  const i = Math.floor((lat + 80) / 8);
  return bands[Math.max(0, Math.min(bands.length - 1, i))] || "P";
}
function fmtCoord(v: number, pos: string, neg: string): string {
  const d = Math.abs(v);
  const deg = Math.floor(d);
  const min = Math.floor((d - deg) * 60);
  const sec = (((d - deg) * 60 - min) * 60).toFixed(1);
  return `${deg}°${String(min).padStart(2, "0")}'${sec}"${v >= 0 ? pos : neg}`;
}

export default function OutageGlobeHUD() {
  const elRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any>(null);
  const dataMapRef = useRef<Record<string, Ev>>({});
  const cloudLayerRef = useRef<any>(null);
  const [data, setData] = useState<Payload | null>(null);
  const [active, setActive] = useState<Set<string>>(new Set(PIN_TYPES));
  const [selected, setSelected] = useState<Ev | null>(null);
  const [cam, setCam] = useState({ lat: PH.lat, lon: PH.lon, alt: PH.alt });
  const [clock, setClock] = useState("");
  const [ready, setReady] = useState(false);
  const [clouds, setClouds] = useState(false);

  // live UTC clock
  useEffect(() => {
    const t = setInterval(() => {
      const d = new Date();
      setClock(d.toISOString().slice(0, 19).replace("T", "  ") + "Z");
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // fetch + poll feeds
  useEffect(() => {
    let stop = false;
    async function load() {
      try {
        const r = await fetch("/api/outage", { cache: "no-store" });
        const j = await r.json();
        if (!stop) setData(j);
      } catch { /* keep last */ }
    }
    load();
    const id = setInterval(load, 60000);
    return () => { stop = true; clearInterval(id); };
  }, []);

  // init viewer
  useEffect(() => {
    let cancelled = false;
    loadCesium().then((Cesium) => {
      if (cancelled || !Cesium || !elRef.current || viewerRef.current) return;
      try { Cesium.Ion.defaultAccessToken = ""; } catch { /* older */ }
      const viewer = new Cesium.Viewer(elRef.current, {
        baseLayer: new Cesium.ImageryLayer(
          new Cesium.UrlTemplateImageryProvider({
            url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            maximumLevel: 18,
            credit: "Esri · Maxar · Earthstar Geographics",
          })
        ),
        baseLayerPicker: false, geocoder: false, timeline: false, animation: false,
        homeButton: false, sceneModePicker: false, navigationHelpButton: false,
        fullscreenButton: false, selectionIndicator: false, infoBox: false,
      });
      viewer.scene.backgroundColor = Cesium.Color.fromCssColorString("#03050a");
      viewer.scene.globe.enableLighting = false;
      viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString("#0b1a2b");
      viewer.scene.skyAtmosphere.show = true;
      viewer.scene.globe.showGroundAtmosphere = true;
      viewer.scene.fog.enabled = true;
      try { viewer.cesiumWidget.creditContainer.style.display = "none"; } catch { /* noop */ }
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(PH.lon, PH.lat, PH.alt),
      });

      // Keyless 3D terrain (Re:Earth / Mapterhorn, CC BY 4.0); flat if unreachable.
      Cesium.CesiumTerrainProvider.fromUrl("https://terrain.reearth.land/cesium-mesh/ellipsoid")
        .then((tp: any) => { if (viewerRef.current) viewerRef.current.terrainProvider = tp; })
        .catch(() => { /* keep flat ellipsoid */ });

      // decorative "orbital pass" line near PH
      viewer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([100, -12, 150, 32]),
          width: 1.4,
          material: Cesium.Color.fromCssColorString("#ff3b3b").withAlpha(0.45),
        },
      });

      // click to select
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction((m: any) => {
        const picked = viewer.scene.pick(m.position);
        const id = picked && picked.id && picked.id.id;
        const ev = id ? dataMapRef.current[id] : null;
        setSelected(ev || null);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // camera readout
      viewer.camera.percentageChanged = 0.05;
      const onCam = () => {
        const c = viewer.camera.positionCartographic;
        if (c) setCam({
          lat: Cesium.Math.toDegrees(c.latitude),
          lon: Cesium.Math.toDegrees(c.longitude),
          alt: c.height,
        });
      };
      viewer.camera.changed.addEventListener(onCam);

      viewerRef.current = viewer;
      setReady(true);
    });
    return () => {
      cancelled = true;
      if (viewerRef.current) { try { viewerRef.current.destroy(); } catch { /* gone */ } viewerRef.current = null; }
    };
  }, []);

  // (re)build markers when data or active layers change
  useEffect(() => {
    const viewer = viewerRef.current;
    const Cesium = (window as any).Cesium;
    if (!viewer || !Cesium || !ready) return;
    // clear only point entities (keep the decorative polyline)
    const toRemove = viewer.entities.values.filter((e: any) => e.point);
    toRemove.forEach((e: any) => viewer.entities.remove(e));
    const map: Record<string, Ev> = {};
    const events = (data?.events ?? []).filter((e) => e.type !== "internet" && active.has(e.type) && e.lat != null && e.lng != null);
    for (const e of events) {
      map[e.id] = e;
      const css = e.severity === "severe" ? "#ff4d4d" : COLOR[e.type] || "#93c5fd";
      const color = Cesium.Color.fromCssColorString(css);
      const point: any = {
        pixelSize: e.severity === "severe" ? 15 : e.severity === "warning" ? 10 : 7,
        color: color.withAlpha(0.9),
        outlineColor: Cesium.Color.fromCssColorString("#f0a63c").withAlpha(0.8),
        outlineWidth: e.severity === "info" ? 1 : 2,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      };
      if (e.severity === "severe") {
        point.pixelSize = new Cesium.CallbackProperty(() => {
          const t = (Date.now() % 1400) / 1400;
          return 13 + 6 * Math.sin(t * Math.PI * 2);
        }, false);
      }
      const ent: any = { id: e.id, position: Cesium.Cartesian3.fromDegrees(e.lng, e.lat), point };
      if (e.severity !== "info") {
        ent.label = {
          text: e.region,
          font: "12px 'Share Tech Mono', monospace",
          fillColor: Cesium.Color.fromCssColorString("#dbeafe"),
          showBackground: true,
          backgroundColor: Cesium.Color.fromCssColorString("#03050a").withAlpha(0.55),
          backgroundPadding: new Cesium.Cartesian2(6, 3),
          pixelOffset: new Cesium.Cartesian2(0, -16),
          scale: 0.9,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 6_000_000),
        };
      }
      viewer.entities.add(ent);
    }
    dataMapRef.current = map;
  }, [data, active, ready]);

  function toggle(t: string) {
    setActive((prev) => { const n = new Set(prev); n.has(t) ? n.delete(t) : n.add(t); return n; });
  }
  function recenter() {
    const viewer = viewerRef.current; const Cesium = (window as any).Cesium;
    if (viewer && Cesium) viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(PH.lon, PH.lat, PH.alt), duration: 1.4 });
  }
  function toggleClouds() {
    const viewer = viewerRef.current; const Cesium = (window as any).Cesium;
    if (!viewer || !Cesium) return;
    if (cloudLayerRef.current) {
      viewer.imageryLayers.remove(cloudLayerRef.current, true);
      cloudLayerRef.current = null; setClouds(false);
    } else {
      // NASA GIBS near-real-time satellite (VIIRS true colour, yesterday UTC for availability).
      const day = new Date(Date.now() - 24 * 3600 * 1000).toISOString().slice(0, 10);
      const prov = new Cesium.UrlTemplateImageryProvider({
        url: `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/${day}/250m/{z}/{y}/{x}.jpg`,
        tilingScheme: new Cesium.GeographicTilingScheme(),
        maximumLevel: 8,
        credit: "NASA GIBS / EOSDIS (VIIRS SNPP)",
      });
      const layer = new Cesium.ImageryLayer(prov);
      layer.alpha = 0.62;
      viewer.imageryLayers.add(layer);
      cloudLayerRef.current = layer; setClouds(true);
    }
  }
  function flyTo(e: Ev) {
    const viewer = viewerRef.current; const Cesium = (window as any).Cesium;
    if (viewer && Cesium) viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(e.lng, e.lat, 450_000), duration: 1.4 });
    setSelected(e);
  }

  const events = data?.events ?? [];
  const counts: Record<string, number> = {};
  for (const c of CAT) counts[c.type] = events.filter((e) => e.type === c.type).length;
  const alerts = events.filter((e) => e.type !== "internet" && e.severity !== "info" && e.status !== "resolved");
  const severe = alerts.filter((e) => e.severity === "severe").length;
  const grid = `${utmZone(cam.lon)}${bandLetter(cam.lat)}`;

  return (
    <div className="geh-root">
      <style dangerouslySetInnerHTML={{ __html: `
        .geh-root{position:fixed;inset:0;z-index:60;background:#03050a;overflow:hidden;font-family:'Share Tech Mono',ui-monospace,monospace;color:#cfe3ff}
        .geh-canvas{position:absolute;inset:0}
        .geh-canvas canvas{outline:none}
        .geh-overlay{position:absolute;inset:0;pointer-events:none}
        .geh-frame{position:absolute;inset:14px;border:1px solid rgba(240,166,60,.18);border-radius:4px}
        .geh-corner{position:absolute;width:26px;height:26px;border:2px solid rgba(240,166,60,.75)}
        .geh-tl{top:8px;left:8px;border-right:none;border-bottom:none}
        .geh-tr{top:8px;right:8px;border-left:none;border-bottom:none}
        .geh-bl{bottom:8px;left:8px;border-right:none;border-top:none}
        .geh-br{bottom:8px;right:8px;border-left:none;border-top:none}
        .geh-grid{position:absolute;inset:0;opacity:.10;background-image:linear-gradient(rgba(120,180,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(120,180,255,.5) 1px,transparent 1px);background-size:44px 44px}
        .geh-scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,0) 0 2px,rgba(0,0,0,.12) 2px 3px)}
        .geh-panel{position:absolute;pointer-events:auto;background:rgba(5,9,16,.72);border:1px solid rgba(240,166,60,.22);border-radius:5px;backdrop-filter:blur(3px);box-shadow:0 0 24px rgba(0,0,0,.5) inset}
        .geh-title{font-family:'Orbitron',sans-serif;letter-spacing:.22em;color:#f4f7ff;font-weight:700}
        .geh-amber{color:#f0a63c}
        .geh-red{color:#ff5555}
        .geh-mut{color:#7f93ad}
        .geh-lbl{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#7f93ad}
        .geh-row{display:flex;align-items:center;gap:8px;width:100%;padding:6px 10px;background:none;border:none;border-top:1px solid rgba(255,255,255,.05);cursor:pointer;text-align:left}
        .geh-row:hover{background:rgba(120,180,255,.06)}
        .geh-dot{width:9px;height:9px;border-radius:50%;flex:0 0 auto;box-shadow:0 0 8px currentColor}
        .geh-chk{margin-left:auto;font-size:10px;letter-spacing:.1em}
        .geh-btn{pointer-events:auto;font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#cfe3ff;background:rgba(5,9,16,.75);border:1px solid rgba(240,166,60,.3);border-radius:4px;padding:7px 12px;cursor:pointer}
        .geh-btn:hover{border-color:rgba(240,166,60,.7);color:#fff}
        @keyframes gehpulse{0%,100%{opacity:1}50%{opacity:.3}}
        .geh-rec{animation:gehpulse 1.1s ease-in-out infinite}
        .geh-vign{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.55) 100%)}
      ` }} />

      <div ref={elRef} className="geh-canvas" />

      <div className="geh-overlay">
        <div className="geh-vign" />
        <div className="geh-grid" />
        <div className="geh-scan" />
        <div className="geh-frame" />
        <div className="geh-corner geh-tl" /><div className="geh-corner geh-tr" />
        <div className="geh-corner geh-bl" /><div className="geh-corner geh-br" />

        {/* top-left identity */}
        <div style={{ position: "absolute", top: 26, left: 30 }}>
          <div className="geh-title" style={{ fontSize: 22 }}>◎ BVN ORBITAL WATCH</div>
          <div style={{ fontSize: 11, letterSpacing: ".16em", marginTop: 4 }}>
            <span className="geh-amber">CLASSIFIED</span> <span className="geh-mut">{"//"}</span> PH-OUTAGE-GRID <span className="geh-mut">{"//"}</span> <span style={{ color: "#7fe0a0" }}>LIVE</span>
          </div>
          <div className="geh-mut" style={{ fontSize: 11, letterSpacing: ".14em", marginTop: 6 }}>
            MONITORING PHILIPPINES · <span className="geh-amber">{alerts.length}</span> ACTIVE ALERTS{severe ? <> · <span className="geh-red">{severe} SEVERE</span></> : null}
          </div>
        </div>

        {/* top-right status */}
        <div style={{ position: "absolute", top: 26, right: 30, textAlign: "right" }}>
          <div style={{ fontSize: 12, letterSpacing: ".14em" }}>
            <span className="geh-red geh-rec">● REC</span> <span style={{ marginLeft: 8 }}>{clock || "----.--.--"}</span>
          </div>
          <div className="geh-mut" style={{ fontSize: 11, letterSpacing: ".14em", marginTop: 6 }}>
            PH PASS · ORBIT NORMAL
          </div>
          <div className="geh-mut" style={{ fontSize: 11, letterSpacing: ".14em", marginTop: 4 }}>
            SRC: {data ? "NASA · PAGASA · MERALCO · USGS" : "ACQUIRING…"}
          </div>
        </div>

        {/* left layers panel */}
        <div className="geh-panel" style={{ top: 120, left: 22, width: 214, paddingBottom: 6 }}>
          <div className="geh-lbl" style={{ padding: "9px 10px 7px" }}>Layers · Sensors</div>
          {CAT.map((c) => {
            const on = active.has(c.type);
            return (
              <button key={c.type} className="geh-row" onClick={() => toggle(c.type)} style={{ opacity: on ? 1 : 0.42 }}>
                <span className="geh-dot" style={{ background: c.color, color: c.color }} />
                <span style={{ fontSize: 12, color: on ? "#e6f0ff" : "#7f93ad" }}>{c.label}</span>
                <span className="geh-chk" style={{ color: on ? "#7fe0a0" : "#55657a" }}>{counts[c.type] ?? 0} {on ? "◉" : "○"}</span>
              </button>
            );
          })}
        </div>

        {/* right scope / selection panel */}
        <div className="geh-panel" style={{ top: 120, right: 22, width: 236 }}>
          <div className="geh-lbl" style={{ padding: "9px 10px 7px" }}>{selected ? "Selection" : "Scope"}</div>
          {selected ? (
            <div style={{ padding: "2px 12px 12px" }}>
              <div style={{ fontSize: 13, color: "#fff", lineHeight: 1.4 }}>{selected.title}</div>
              <div style={{ marginTop: 8, fontSize: 11, letterSpacing: ".08em" }}>
                <div><span className="geh-mut">TYPE </span><span className="geh-amber">{(LABEL[selected.type] || selected.type).toUpperCase()}</span></div>
                <div style={{ marginTop: 3 }}><span className="geh-mut">AREA </span>{selected.region}</div>
                <div style={{ marginTop: 3 }}><span className="geh-mut">LEVEL </span><span className={selected.severity === "severe" ? "geh-red" : ""}>{selected.severity.toUpperCase()}</span></div>
                <div style={{ marginTop: 3 }}><span className="geh-mut">FEED </span>{selected.source_name} · {selected.sample ? "sample" : "live"}</div>
              </div>
              <a href={selected.source_url} target="_blank" rel="noreferrer" className="geh-btn" style={{ display: "inline-block", marginTop: 10 }}>SOURCE ↗</a>
            </div>
          ) : (
            <div style={{ padding: "2px 12px 12px", fontSize: 11, letterSpacing: ".08em", lineHeight: 1.7 }}>
              <div><span className="geh-mut">ACTIVE ALERTS </span><span className="geh-amber">{alerts.length}</span></div>
              <div><span className="geh-mut">SEVERE </span><span className="geh-red">{severe}</span></div>
              <div><span className="geh-mut">TRACKED PINS </span>{events.filter((e) => e.type !== "internet").length}</div>
              <div><span className="geh-mut">UPDATED </span>{data ? "60s cycle" : "…"}</div>
              <div className="geh-mut" style={{ marginTop: 8 }}>Click a marker to lock a selection.</div>
            </div>
          )}
        </div>

        {/* bottom-left readout */}
        <div style={{ position: "absolute", bottom: 26, left: 30, fontSize: 11, letterSpacing: ".12em" }}>
          <div><span className="geh-mut">GRID </span><span className="geh-amber">{grid}</span> <span className="geh-mut">· ALT </span>{(cam.alt / 1000).toFixed(0)} KM</div>
          <div style={{ marginTop: 4 }}>{fmtCoord(cam.lat, "N", "S")}  {fmtCoord(cam.lon, "E", "W")}</div>
          <div className="geh-mut" style={{ marginTop: 4, fontSize: 10 }}>CESIUM · ESRI · MAXAR · EARTHSTAR — data for public awareness, not an official emergency source</div>
        </div>

        {/* bottom-center controls */}
        <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 10 }}>
          <button className="geh-btn" onClick={recenter}>◎ Philippines</button>
          <button className="geh-btn" onClick={toggleClouds}
            style={{ borderColor: clouds ? "rgba(127,212,230,.8)" : undefined, color: clouds ? "#7fd4e6" : undefined }}>
            ☁ Live Clouds {clouds ? "◉" : "○"}
          </button>
          <a className="geh-btn" href="/apps/outage-tracker">↩ Exit to 2D</a>
        </div>

        {/* alert ticker bottom-right */}
        <div className="geh-panel" style={{ bottom: 22, right: 22, width: 236, maxHeight: 168, overflowY: "auto", pointerEvents: "auto" }}>
          <div className="geh-lbl" style={{ padding: "9px 10px 6px" }}>Warnings · Babala</div>
          {alerts.length === 0 ? (
            <div style={{ padding: "0 12px 12px", fontSize: 11, color: "#7fe0a0" }}>Walang aktibong babala.</div>
          ) : alerts.slice(0, 20).map((a) => (
            <button key={a.id} className="geh-row" onClick={() => flyTo(a)}>
              <span className="geh-dot" style={{ background: a.severity === "severe" ? "#ff4d4d" : COLOR[a.type], color: a.severity === "severe" ? "#ff4d4d" : COLOR[a.type] }} />
              <span style={{ fontSize: 11, color: "#dbe7f5", lineHeight: 1.3, flex: 1 }}>{a.region}</span>
              {a.severity === "severe" && <span className="geh-red" style={{ fontSize: 9 }}>SEV</span>}
            </button>
          ))}
        </div>

        {!ready && (
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <div className="geh-amber" style={{ fontSize: 13, letterSpacing: ".2em" }}>ACQUIRING ORBITAL FEED…</div>
          </div>
        )}
      </div>
    </div>
  );
}
