"use client";

// 3D globe view for the outage tracker (typhoon / flood focus).
// Loads CesiumJS from CDN, mirroring how OutageMap loads Leaflet — no npm dep,
// no build config. 100% key-free: OpenStreetMap imagery + flat ellipsoid
// terrain, and the Ion token is blanked so Cesium never calls Ion. Inspired by
// bilawalsidhu/gods-eye-view (MIT), rebuilt for this app's feeds.

import { useEffect, useRef } from "react";

type Severity = "info" | "warning" | "severe";

export interface GlobeEvent {
  id: string;
  type: string;
  title: string;
  region: string;
  lat: number;
  lng: number;
  severity: Severity;
  source_name: string;
  source_url: string;
  started_at: string;
  sample: boolean;
}

interface Props {
  events: GlobeEvent[];
  area: { c: [number, number]; z: number };
  focus: { lat: number; lng: number; nonce: number } | null;
  visible: boolean;
}

// Colors mirror OutageMap's TYPE_META so 2D and 3D read the same.
const TYPE_COLOR: Record<string, string> = {
  flood: "#3b82f6", rail: "#a855f7", power: "#f59e0b",
  water: "#06b6d4", quake: "#f43f5e", storm: "#6366f1",
};
const TYPE_LABEL: Record<string, string> = {
  flood: "Baha / Flood", rail: "Tren / Rail", power: "Kuryente / Power",
  water: "Tubig / Water", quake: "Lindol / Quake", storm: "Bagyo / Storm",
};

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
      const link = document.createElement("link");
      link.id = "cesium-css";
      link.rel = "stylesheet";
      link.href = CESIUM_BASE + "Widgets/widgets.css";
      document.head.appendChild(link);
    }
    const s = document.createElement("script");
    s.id = "cesium-js";
    s.src = CESIUM_BASE + "Cesium.js";
    s.onload = () => resolve((window as any).Cesium);
    document.body.appendChild(s);
  });
  return cesiumPromise;
}

// Leaflet zoom -> camera height (metres). z6 shows the whole archipelago,
// z11 a city. Tuned by eye, not exact.
function heightForZoom(z: number): number {
  return 35000 * Math.pow(2, 15 - z);
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string)
  );
}

export default function OutageGlobe({ events, area, focus, visible }: Props) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any>(null);
  const readyRef = useRef(false);

  // Init the viewer once.
  useEffect(() => {
    let cancelled = false;
    loadCesium().then((Cesium) => {
      if (cancelled || !Cesium || !elRef.current || viewerRef.current) return;
      try {
        Cesium.Ion.defaultAccessToken = ""; // never touch Cesium Ion
      } catch { /* older builds */ }
      const viewer = new Cesium.Viewer(elRef.current, {
        baseLayer: new Cesium.ImageryLayer(
          new Cesium.OpenStreetMapImageryProvider({ url: "https://tile.openstreetmap.org/" })
        ),
        baseLayerPicker: false,
        geocoder: false,
        timeline: false,
        animation: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        fullscreenButton: false,
        selectionIndicator: true,
        infoBox: true,
      });
      // Dark, spy-satellite feel; no lighting terminator across the globe.
      viewer.scene.globe.enableLighting = false;
      viewer.scene.backgroundColor = Cesium.Color.fromCssColorString("#05070d");
      viewer.scene.skyAtmosphere.show = true;
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(area.c[1], area.c[0], heightForZoom(area.z)),
      });
      viewerRef.current = viewer;
      readyRef.current = true;
      renderEntities(); // paint whatever we already have
    });
    return () => {
      cancelled = true;
      if (viewerRef.current) {
        try { viewerRef.current.destroy(); } catch { /* already gone */ }
        viewerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function renderEntities() {
    const viewer = viewerRef.current;
    const Cesium = (window as any).Cesium;
    if (!viewer || !Cesium) return;
    viewer.entities.removeAll();
    for (const e of events) {
      if (e.lat == null || e.lng == null) continue;
      const css = e.severity === "severe" ? "#ef4444" : TYPE_COLOR[e.type] || "#94a3b8";
      const color = Cesium.Color.fromCssColorString(css);
      const point: any = {
        pixelSize: e.severity === "severe" ? 16 : e.severity === "warning" ? 11 : 8,
        color,
        outlineColor: Cesium.Color.WHITE.withAlpha(0.65),
        outlineWidth: 2,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      };
      if (e.severity === "severe") {
        point.pixelSize = new Cesium.CallbackProperty(() => {
          const t = (Date.now() % 1400) / 1400;
          return 14 + 6 * Math.sin(t * Math.PI * 2);
        }, false);
      }
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(e.lng, e.lat),
        point,
        name: e.title,
        description:
          `<div style="font-family:system-ui,sans-serif;font-size:13px;line-height:1.5">` +
          `<strong>${escapeHtml(e.title)}</strong><br/>` +
          `${escapeHtml(TYPE_LABEL[e.type] || e.type)} · ${escapeHtml(e.region)} · ${e.severity.toUpperCase()}<br/>` +
          `${escapeHtml(e.source_name)} · ${e.sample ? "sample" : "live"}<br/>` +
          `<a href="${escapeHtml(e.source_url)}" target="_blank" rel="noreferrer">source ↗</a></div>`,
      });
    }
  }

  // Rebuild markers when the visible set changes.
  useEffect(() => {
    if (readyRef.current) renderEntities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  // Fly to the selected location preset.
  useEffect(() => {
    const viewer = viewerRef.current;
    const Cesium = (window as any).Cesium;
    if (!viewer || !Cesium || !readyRef.current) return;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(area.c[1], area.c[0], heightForZoom(area.z)),
      duration: 1.2,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [area.c[0], area.c[1], area.z]);

  // Fly to a single event when the user clicks a card / list row.
  useEffect(() => {
    const viewer = viewerRef.current;
    const Cesium = (window as any).Cesium;
    if (!viewer || !Cesium || !readyRef.current || !focus) return;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(focus.lng, focus.lat, heightForZoom(11)),
      duration: 1.2,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus?.nonce]);

  // Cesium was hidden (display:none) while the 2D map showed; resize on return.
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !visible) return;
    try { viewer.resize(); viewer.scene.requestRender(); } catch { /* not ready */ }
  }, [visible]);

  return <div ref={elRef} className="h-full w-full" />;
}
