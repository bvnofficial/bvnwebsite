/* Apex 3D Gate Builder: draw the frontage on a plan, set each piece (fence, swing,
   sliding, cantilever, bifold or pedestrian gate), see it built in 3D part by part,
   and get the quote. Every number comes from the same price book, gate formulas and
   pricing engine as Apex Quote, so it matches the tablet and the CEO dashboard.
   The office sees cost, markup and profit; technicians see customer prices only. */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PRICEBOOK, TEMPLATES, VERSION } from "./data.js";
import { priceQuote, runItem, defaults, money, fmtNum, byId } from "./engine.js";
import { buildTemplates, mergePricebook, teamView } from "./shared.js";

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clone = (o) => JSON.parse(JSON.stringify(o));
const uid = () => Math.random().toString(36).slice(2, 10);
const mm = (n) => `${fmtNum(Math.round(n))} mm`;
const metres = (n) => `${(n / 1000).toLocaleString("en-AU", { maximumFractionDigits: 2 })} m`;

/* ---------------- prices and gate types ---------------- */
let OFFICE = false, PB = teamView(PRICEBOOK), GATES = { custom: [], hidden: [] }, TPLS = [], ONLINE = false;
const rebuildTpls = () => { TPLS = buildTemplates(clone(TEMPLATES), PB, GATES); };
rebuildTpls();
const tplOf = (id) => TPLS.find((t) => t.id === id);
const baseOf = (t) => (t ? t.base || t.id : "gap");
const pieceTypes = () => TPLS.filter((t) => (t.kind === "gate" || t.kind === "fence") && !t.hidden);
const up = (cat) => 1 + ((PB.markup || {})[cat] ?? 0) / 100;
const matOf = (id) => byId(PB.materials, id) || {};
const hwOf = (id) => byId(PB.hardware, id);

async function pull() {
  try {
    const r = await fetch("data.json", { cache: "no-store", credentials: "same-origin" });
    if (r.status === 401) { location.href = "index.html"; return; }
    const j = await r.json();
    OFFICE = !!j.office; ONLINE = true;
    const base = OFFICE ? PRICEBOOK : teamView(PRICEBOOK);
    PB = j.data && j.data.pb ? mergePricebook(j.data.pb, base) : clone(base);
    GATES = (j.data && j.data.gates) || { custom: [], hidden: [] };
  } catch (e) { ONLINE = false; }
  rebuildTpls();
  document.body.classList.toggle("office", OFFICE);
  changed(true);
}

/* ---------------- the design ---------------- */
const KEY3 = "apexq.build3d.v1";
function piece(tpl, len, extra = {}) {
  const t = tplOf(tpl);
  const values = t ? defaults(t) : {};
  if (t && t.inputs.find((i) => i.k === "make")) values.make = "steel";   // parts by parts: priced from the steel up
  return { id: uid(), tpl, values: { ...values, ...extra } };
}
function sample() {
  const xs = [0, 6000, 11000, 12000, 13000, 15000];
  return {
    name: "", client: { name: "", phone: "", address: "" }, discount: 0, flip: false,
    nodes: xs.map((x) => ({ x, z: 0 })),
    secs: [piece("fence", 6000, { infill: "slat", inMat: "slat90", gap: 15 }), piece("slide", 5000, { infill: "slat", inMat: "slat90", gap: 15 }),
      piece("fence", 1000, { infill: "slat", inMat: "slat90", gap: 15 }), piece("ped", 1000, { infill: "slat", inMat: "slat90", gap: 15 }),
      piece("fence", 2000, { infill: "slat", inMat: "slat90", gap: 15 })],
    sel: 1,
  };
}
function loadDesign() {
  try { const d = JSON.parse(localStorage.getItem(KEY3)); if (d && Array.isArray(d.nodes) && Array.isArray(d.secs) && d.secs.length === Math.max(0, d.nodes.length - 1)) return d; } catch (e) { /* new one */ }
  return sample();
}
let D = loadDesign();
let saveT;
const saveDesign = () => { clearTimeout(saveT); saveT = setTimeout(() => { try { localStorage.setItem(KEY3, JSON.stringify(D)); } catch (e) { /* full */ } }, 250); };

const segLen = (i) => { const a = D.nodes[i], b = D.nodes[i + 1]; return Math.hypot(b.x - a.x, b.z - a.z); };
const lenKey = (t) => (t && t.kind === "fence" ? "Len" : "W");
function syncLens() { D.secs.forEach((s, i) => { const t = tplOf(s.tpl); if (t) s.values[lenKey(t)] = Math.round(segLen(i)); }); }
/* change one piece's length: everything after it moves along with it */
function setLen(i, L) {
  L = Math.max(100, Math.round(L));
  const a = D.nodes[i], b = D.nodes[i + 1], cur = segLen(i) || 1;
  const ux = (b.x - a.x) / cur, uz = (b.z - a.z) / cur, dx = ux * (L - cur), dz = uz * (L - cur);
  for (let k = i + 1; k < D.nodes.length; k++) { D.nodes[k].x += dx; D.nodes[k].z += dz; }
}

/* ---------------- pricing ---------------- */
let P = null, LINES = new Map(), ROWS = new Map();
function price() {
  syncLens();
  const items = D.secs.filter((s) => tplOf(s.tpl)).map((s) => ({ id: s.id, tpl: s.tpl, values: s.values }));
  P = priceQuote({ items, discount: D.discount }, TPLS, PB);
  LINES = new Map(P.lines.map((l) => [l.id, l]));
  ROWS = new Map();
  for (const l of P.lines) ROWS.set(l.id, partRows(l));
}
/* one row per part, so a piece's rows add up to exactly what the quote charges for it */
function partRows(l) {
  const r = l.r, s = PB.settings, rows = [];
  let mats = 0;
  for (const c of r.cuts) {
    const m = matOf(c.mat), perM = (m.cost || 0) / ((m.stock || 6500) / 1000), cost = (c.len / 1000) * c.qty * perM;
    mats += cost;
    rows.push({ key: "cut:" + c.label, grp: "Steel and aluminium", name: c.label, spec: m.name || c.mat, size: mm(c.len), qty: c.qty, each: (c.len / 1000) * perM, cost, sell: cost * up("materials") });
  }
  for (const sh of r.sheets) {
    const m = matOf(sh.mat), per = ((m.w || 2400) * (m.h || 1200)) / 1e6, n = (sh.area * (1 + (s.sheetWaste || 0) / 100)) / per, cost = n * (m.cost || 0);
    mats += cost;
    rows.push({ key: "sheet:" + sh.label, grp: "Steel and aluminium", name: sh.label, spec: m.name || sh.mat, size: `${sh.area.toFixed(2)} m²`, qty: Math.round(n * 100) / 100, each: m.cost || 0, cost, sell: cost * up("materials") });
  }
  const left = l.cost.materials - mats;
  if (Math.abs(left) > 0.5) rows.push({ key: "waste", grp: "Steel and aluminium", name: "Full lengths and offcuts", spec: "Steel is bought in full lengths for the whole job", size: "", qty: 1, each: left, cost: left, sell: left * up("materials") });
  for (const h of r.items) {
    const x = hwOf(h.id); if (!x) continue;
    const cat = x.cat === "motor" || x.cat === "access" ? "motors" : "hardware";
    const sellEach = x.sell > 0 ? x.sell : x.cost * up(cat);
    rows.push({ key: "item:" + h.id, grp: cat === "motors" ? "Motor and access" : x.cat === "fab" ? "Fabricator" : "Hardware", name: x.name, spec: x.part || "", size: "", qty: h.qty, each: x.cost, cost: x.cost * h.qty, sell: sellEach * h.qty });
  }
  for (const lb of r.labour) {
    const rate = byId(PB.labour, lb.rate); if (!rate) continue;
    const crew = lb.crew || 1, cost = rate.rate * lb.hours * crew, sell = rate.sell > 0 ? rate.sell * lb.hours * crew : cost * up("labour");
    rows.push({ key: "lab:" + lb.name, grp: "Labour", name: lb.name, spec: crew > 1 ? `${crew} people` : "", size: `${fmtNum(lb.hours)} h`, qty: lb.hours * crew, each: rate.rate, cost, sell });
  }
  if (l.cost.finish > 0) {
    const f = byId(PB.finishes, r.finish) || {};
    rows.push({ key: "finish", grp: "Finish", name: f.name || "Finish", spec: l.r.env.colour || "", size: `${(+r.area).toFixed(1)} m², ${fmtNum(r.kg)} kg`, qty: 1, each: l.cost.finish, cost: l.cost.finish, sell: l.cost.finish * up("finish") });
  }
  for (const d of r.direct) {
    const c = d.cat in l.cost ? d.cat : "other", cost = d.price ? d.amount / up(c) : d.amount;
    rows.push({ key: "direct", grp: "Other", name: d.fabq ? "Fabricator's quote" : "Own line", spec: "", size: "", qty: 1, each: cost, cost, sell: d.price ? d.amount : cost * up(c) });
  }
  const sum = rows.reduce((a, x) => a + x.sell, 0);
  if (Math.abs(l.sell - sum) > 1) rows.push({ key: "other", grp: "Other", name: "Other", spec: "", size: "", qty: 1, each: 0, cost: 0, sell: l.sell - sum });
  return rows;
}

/* ---------------- 3D ---------------- */
const view = { open: 0, openTo: 0, ex: 0, exTo: 0, under: false, dims: true, partSel: null };
let renderer, scene, camera, controls, world, groundMat, hoverEl;
const BOX = new THREE.BoxGeometry(1, 1, 1), CYL = new THREE.CylinderGeometry(1, 1, 1, 20);
const std = (o) => new THREE.MeshStandardMaterial({ roughness: .55, metalness: .25, ...o });
const M = {
  galv: std({ color: 0xa9aeb3, metalness: .8, roughness: .35 }), black: std({ color: 0x16181b, roughness: .6 }), steel: std({ color: 0x2c2f33, metalness: .5, roughness: .45 }),
  concrete: std({ color: 0xb9b4aa, roughness: .95, metalness: 0 }), wall: std({ color: 0xe0d2b4, roughness: .95, metalness: 0 }), wood: std({ color: 0x8b6a4c, roughness: .8, metalness: 0 }),
  led: std({ color: 0x0c3a1c, emissive: 0x35d07f, emissiveIntensity: 1 }), beam: new THREE.MeshBasicMaterial({ color: 0xff2a1a, transparent: true, opacity: .7 }),
  solar: std({ color: 0x0e2240, metalness: .5, roughness: .2 }), keys: std({ color: 0x9aa0a6, metalness: .7, roughness: .3 }),
  hl: std({ color: 0xff3b1f, emissive: 0xd61d09, emissiveIntensity: .55, roughness: .4 }),
};
/* Dulux powder coat colours most asked for in Perth */
export const COLOURS = {
  "Monument": 0x323233, "Woodland Grey": 0x4a4b45, "Surfmist": 0xe4e2d5, "Basalt": 0x6d6c6e, "Satin Black": 0x151617, "Night Sky": 0x1f1f20,
  "Pearl White": 0xece9e0, "Dover White": 0xf1eee4, "Dune": 0xb1ada3, "Paperbark": 0xcabfa4, "Shale Grey": 0xbdbfba, "Windspray": 0x888b8a,
  "Ironstone": 0x3e434c, "Jasper": 0x6a5d53, "Deep Ocean": 0x364152, "Manor Red": 0x5e1d0e, "Cottage Green": 0x304c3c, "Pale Eucalypt": 0x7c846a,
  "Classic Cream": 0xe9dcb8, "Evening Haze": 0xc5c2aa, "Wilderness": 0x65705b, "Gully": 0x857e73, "Terrain": 0x67432e, "Bluegum": 0x969799,
};
const matCache = new Map();
function coatMat(env) {
  const fin = env.finish || "powder";
  let key, colour;
  if (fin === "galv") { key = "galv"; colour = 0xa9aeb3; }
  else if (fin === "none") { key = "raw"; colour = 0x5d5f61; }
  else {
    const name = Object.keys(COLOURS).find((k) => k.toLowerCase() === String(env.colour || "").trim().toLowerCase());
    colour = name ? COLOURS[name] : 0x323233; key = "pc" + colour;
  }
  if (!matCache.has(key)) matCache.set(key, std({ color: colour, metalness: fin === "galv" ? .8 : fin === "none" ? .6 : .2, roughness: fin === "galv" ? .35 : .5 }));
  return matCache.get(key);
}
const meshTex = (() => {
  const c = document.createElement("canvas"); c.width = c.height = 64;
  const g = c.getContext("2d"); g.clearRect(0, 0, 64, 64); g.strokeStyle = "#fff"; g.lineWidth = 5;
  g.beginPath(); g.moveTo(0, 2); g.lineTo(64, 2); g.moveTo(2, 0); g.lineTo(2, 64); g.stroke();
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
})();

/* every mesh knows which piece and which part it belongs to, so a tap finds its row */
let PMAP = new Map();   // "secId|key" -> meshes
function tag(m, sec, key, ex) {
  m.userData = { sec, key, base: m.position.clone(), ex: ex ? new THREE.Vector3(ex[0] / 1000, ex[1] / 1000, ex[2] / 1000) : null, mat: m.material };
  const k = sec + "|" + key; if (!PMAP.has(k)) PMAP.set(k, []); PMAP.get(k).push(m);
  return m;
}
/* a box in millimetres */
function B(par, sec, key, mat, x0, y0, z0, x1, y1, z1, ex) {
  const m = new THREE.Mesh(BOX, mat); m.castShadow = true; m.receiveShadow = true;
  m.scale.set(Math.max(Math.abs(x1 - x0), .5) / 1000, Math.max(Math.abs(y1 - y0), .5) / 1000, Math.max(Math.abs(z1 - z0), .5) / 1000);
  m.position.set((x0 + x1) / 2000, (y0 + y1) / 2000, (z0 + z1) / 2000);
  par.add(m); return key ? tag(m, sec, key, ex) : m;
}
function C(par, sec, key, mat, r, x, y0, y1, z, ex) {   // an upright round part
  const m = new THREE.Mesh(CYL, mat); m.castShadow = true;
  m.scale.set(r / 1000, Math.max(Math.abs(y1 - y0), .5) / 1000, r / 1000); m.position.set(x / 1000, (y0 + y1) / 2000, z / 1000);
  par.add(m); return key ? tag(m, sec, key, ex) : m;
}
const EX = { post: [0, 0, 650], under: [0, -500, 0], infill: [0, 0, -450], frame: [0, 0, 0], hw: [0, 200, 350], motor: [0, 0, -900], track: [0, -300, 0], top: [0, 300, 0] };

/* infill between x0..x1, y0..y1 (mm, leaf space) */
function infill(par, id, e, mat, x0, y0, x1, y1, nV, nH) {
  const ip = matOf(e.inMat).dim || 25, W = x1 - x0, H = y1 - y0;
  if (W <= 0 || H <= 0) return;
  if (e.infill === "picket" || e.infill === "palisade") {
    const n = Math.max(0, Math.round(nV)); if (!n) return;
    const g = (W - n * ip) / (n + 1);
    for (let i = 0; i < n; i++) {
      const x = x0 + g + i * (ip + g);
      if (e.infill === "palisade") {
        B(par, id, "cut:Pickets", mat, x, y0, -3, x + ip, y1 - 40, 12, EX.infill);
        const tip = new THREE.Mesh(new THREE.ConeGeometry(ip / 1400, .09, 4), mat); tip.rotation.y = Math.PI / 4;
        tip.position.set((x + ip / 2) / 1000, (y1 - 40) / 1000 + .045, .004); par.add(tip); tag(tip, id, "cut:Pickets", EX.infill);
      } else B(par, id, "cut:Pickets", mat, x, y0, -ip / 2, x + ip, y1, ip / 2, EX.infill);
    }
  } else if (e.infill === "slat") {
    const n = Math.max(0, Math.round(nH)); if (!n) return;
    const g = (H - n * ip) / (n + 1);
    for (let i = 0; i < n; i++) { const y = y0 + g + i * (ip + g); B(par, id, "cut:Slats", mat, x0, y, -8, x1, y + ip, 8, EX.infill); }
  } else if (e.infill === "mesh") {
    const t = meshTex.clone(); t.needsUpdate = true; t.repeat.set(W / 50, H / 50);
    const mm2 = new THREE.MeshStandardMaterial({ color: mat.color, map: t, alphaMap: t, transparent: true, alphaTest: .4, side: THREE.DoubleSide, metalness: .3, roughness: .5 });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(W / 1000, H / 1000), mm2);
    m.position.set((x0 + x1) / 2000, (y0 + y1) / 2000, 0); par.add(m); tag(m, id, "sheet:Mesh", EX.infill);
  } else B(par, id, "sheet:Sheet", mat, x0, y0, -2, x1, y1, 2, EX.infill);
}
/* a framed leaf, origin at its bottom left, length along +x */
function leaf(par, id, e, mat, o) {
  const { w, h, f } = o, d = o.d || f, bh = o.bottom ? o.bottom.h : f;
  B(par, id, o.kStile, mat, 0, 0, -d / 2, f, h, d / 2, EX.frame);
  B(par, id, o.kStile, mat, w - f, 0, -d / 2, w, h, d / 2, EX.frame);
  if (o.bottom) B(par, id, o.bottom.key, o.bottom.mat || mat, o.bottom.full ? 0 : f, 0, -o.bottom.d / 2, o.bottom.full ? w : w - f, bh, o.bottom.d / 2, o.bottom.ex || EX.frame);
  else B(par, id, o.kRail, mat, f, 0, -d / 2, w - f, f, d / 2, EX.frame);
  B(par, id, o.kTop || o.kRail, mat, f, h - f, -d / 2, w - f, h, d / 2, EX.frame);
  if (o.mid) B(par, id, o.kMid || o.kRail, mat, f, h / 2 - f / 2, -d / 2, w - f, h / 2 + f / 2, d / 2, EX.frame);
  for (let i = 0; i < (o.midStiles || 0); i++) { const x = (w * (i + 1)) / (o.midStiles + 1); B(par, id, o.kMidStile, mat, x - f / 2, bh, -d / 2, x + f / 2, h - f, d / 2, EX.frame); }
  infill(par, id, e, mat, f, bh, w - f, h - f, o.nV ?? e.nV, o.nH ?? e.nH);
}
/* a post standing at x, z with its footing, base plate and cap */
function post(par, id, e, mat, key, x, z, top) {
  const pd = matOf(e.postMat).dim || 100, ground = e.mount !== "plate", bot = ground ? -(+e.embed || 600) : 0;
  B(par, id, key, mat, x - pd / 2, bot, z - pd / 2, x + pd / 2, top, z + pd / 2, EX.post);
  B(par, id, "item:cap", M.black, x - pd / 2 - 4, top, z - pd / 2 - 4, x + pd / 2 + 4, top + 8, z + pd / 2 + 4, EX.top);
  if (ground) C(par, id, "item:concrete", M.concrete, pd * 1.7, x, bot - 100, -5, z, EX.under);
  else {
    B(par, id, "item:baseplate", M.galv, x - 125, 0, z - 125, x + 125, 10, z + 125, EX.post);
    for (const [ax, az] of [[-95, -95], [95, -95], [-95, 95], [95, 95]]) C(par, id, "item:anchor", M.galv, 7, x + ax, -110, 22, z + az, EX.under);
  }
}
function motorBox(par, id, key, x, z, w = 300, dpt = 240) {
  B(par, id, null, M.concrete, x - 40, -10, z - 40, x + w + 40, 40, z + dpt + 40);
  B(par, id, key, M.steel, x, 40, z, x + w, 420, z + dpt, EX.motor);
  B(par, id, key, M.led, x + 30, 330, z + dpt, x + 70, 360, z + dpt + 6, EX.motor);
}
const itemKey = (e, id) => "item:" + (typeof e[id] === "string" ? e[id] : id);
function access(par, id, e, W, side) {   // beams across the opening, keypad on the street side, solar on a pole inside
  const on = e.on || (e.auto && e.auto !== "none") || (e.motor && e.motor !== "none");
  if (!on) return;
  if (e.eyes) for (const x of [-60, W]) { B(par, id, "item:eyes", M.black, x, 420, 120, x + 60, 620, 180, EX.hw); }
  if (e.eyes) B(par, id, "item:eyes", M.beam, 0, 510, 145, W, 522, 155, EX.hw);
  if (e.keypad) {
    const kx = side < 0 ? W + 900 : -900;
    C(par, id, "item:keypad", M.steel, 40, kx, 0, 1150, 1300, EX.hw);
    B(par, id, "item:keypad", M.steel, kx - 90, 1100, 1240, kx + 90, 1400, 1340, EX.hw);
    B(par, id, "item:keypad", M.keys, kx - 70, 1140, 1340, kx + 70, 1360, 1352, EX.hw);
  }
  if (e.solar) {
    const sx = side < 0 ? W + 1400 : -1400;
    C(par, id, "item:solar", M.galv, 40, sx, 0, 2300, -1500, EX.hw);
    const p = B(par, id, "item:solar", M.solar, sx - 450, 2300, -1820, sx + 450, 2330, -1180, EX.hw); p.rotation.x = .5;
  }
}

/* ---------- each kind of piece, in its own local space (x along the line, -z inside) ---------- */
const BUILD = {
  swing(g, s, e, mat, ped) {
    const L = ped ? 1 : +e.L || 1, W = e.W, f = e.f, leafW = e.leafW, leafH = e.leafH, pd = matOf(e.postMat).dim || 100, top = e.H + (+e.postAbove || 0);
    const hp = L === 2 ? [-pd / 2, W + pd / 2] : [-pd / 2], cp = L === 2 ? [] : [W + pd / 2];
    for (let i = 0; i < e.posts; i++) post(g, s.id, e, mat, "cut:Hinge posts", hp[i] ?? -pd * (i + 1.2), 0, top);
    for (let i = 0; i < e.catchPosts; i++) post(g, s.id, e, mat, "cut:Catch posts", cp[i] ?? W + pd * (i + 1.2), 0, top);
    const leaves = [];
    for (let i = 0; i < L; i++) {
      const sgn = i === 0 ? 1 : -1, hinge = new THREE.Group(); hinge.position.set((sgn === 1 ? 15 : W - 15) / 1000, (ped ? 50 : e.gc || 50) / 1000, 0); g.add(hinge);
      const inner = new THREE.Group(); if (sgn === -1) inner.scale.x = -1; hinge.add(inner);
      leaf(inner, s.id, e, mat, { w: leafW, h: leafH, f, kStile: "cut:Stiles", kRail: "cut:Rails", mid: !!e.mid });
      const hk = itemKey(e, "hinge");
      for (const y of [150, leafH - 250]) C(inner, s.id, hk, M.black, 16, -10, y, y + 110, 0, EX.hw);
      B(inner, s.id, itemKey(e, "lock"), M.black, leafW - 130, 950, -45, leafW - 20, 1100, 45, EX.hw);
      if (L === 2 && i === 1) C(inner, s.id, "item:dropbolt", M.galv, 8, leafW - 60, -40, 500, -35, EX.hw);
      B(g, s.id, "item:stop", M.black, (i === 0 ? leafW : W - leafW) - 30, 0, -60, (i === 0 ? leafW : W - leafW) + 30, 45, 0, EX.hw);
      const motor = e.motor && e.motor !== "none" ? e.motor : null;
      let ram = null;
      if (motor && e.auto === "linear") { ram = new THREE.Mesh(CYL, M.galv); ram.castShadow = true; g.add(ram); tag(ram, s.id, "item:" + motor, EX.motor); }
      if (motor && e.auto === "under") B(g, s.id, "item:" + motor, M.steel, (sgn === 1 ? 0 : W - 450), -380, -420, (sgn === 1 ? 450 : W), -20, -40, EX.under);
      leaves.push({ hinge, sgn, ram });
    }
    access(g, s.id, e, W, 1);
    const UPV = new THREE.Vector3(0, 1, 0);
    return (o) => leaves.forEach(({ hinge, sgn, ram }) => {
      const phi = o * 1.45; hinge.rotation.y = sgn * phi;
      if (!ram) return;
      const base = new THREE.Vector3((sgn === 1 ? -pd / 2 : W + pd / 2) / 1000, .55, -(pd / 2 + 180) / 1000);
      const tip = new THREE.Vector3(.55 * sgn, 0, 0).applyAxisAngle(UPV, sgn * phi).add(new THREE.Vector3(hinge.position.x, .55, -.05));
      const d = new THREE.Vector3().subVectors(tip, base), len = d.length();
      ram.position.copy(base).addScaledVector(d, .5); ram.scale.set(.028, len, .028); ram.quaternion.setFromUnitVectors(UPV, d.normalize());
      ram.userData.base = ram.position.clone();
    });
  },
  ped(g, s, e, mat) { return BUILD.swing(g, s, e, mat, true); },
  slide(g, s, e, mat) {
    const inner = new THREE.Group(); g.add(inner);
    if (e.dir === "right") { inner.scale.x = -1; inner.position.x = e.W / 1000; }
    const W = e.W, over = e.over || 100, L = e.leafL, z = -(matOf(e.postMat).dim || 100) / 2 - 90, bot = matOf(e.bottom), pd = matOf(e.postMat).dim || 100, top = e.H + (+e.postAbove || 0);
    const trackEnd = W + over + 150, trackStart = trackEnd - e.trackLen;
    B(inner, s.id, "cut:Ground track", M.galv, trackStart, 0, z - 12, trackEnd, 25, z + 12, EX.track);
    for (const x of [trackStart, trackEnd - 60]) B(inner, s.id, "item:endstop", M.black, x, 25, z - 30, x + 60, 110, z + 30, EX.hw);
    const lf = new THREE.Group(); lf.position.z = z / 1000; inner.add(lf);
    const body = new THREE.Group(); body.position.set(-over / 1000, .06, 0); lf.add(body);
    leaf(body, s.id, e, mat, { w: L, h: e.leafH, f: e.f, kStile: "cut:End stiles", kTop: "cut:Top rail", kMid: "cut:Middle rail", kMidStile: "cut:Middle stiles", mid: !!e.mid, midStiles: e.midStiles, bottom: { key: "cut:Bottom rail", h: bot.dim || 75, d: bot.depth || 50 } });
    const nW = L > 6000 ? 3 : 2;
    for (let i = 0; i < nW; i++) { const x = nW === 2 ? [300, L - 300][i] : [300, L / 2, L - 300][i]; const w = new THREE.Mesh(CYL, M.black); w.rotation.x = Math.PI / 2; w.scale.set(.05, .03, .05); w.position.set(x / 1000, -.005, 0); body.add(w); tag(w, s.id, "item:wheel", EX.track); }
    const on = e.motor && e.motor !== "none";
    if (on) B(body, s.id, "item:rack", M.galv, 0, (bot.dim || 75) + 5, -(bot.depth || 50) / 2 - 22, Math.ceil(L / 1000) * 1000 > L ? L : L, (bot.dim || 75) + 35, -(bot.depth || 50) / 2 - 2, EX.hw);
    for (let i = 0; i < e.posts; i++) post(inner, s.id, e, mat, "cut:Support posts", -pd / 2 - i * pd * 2.2, z - (bot.depth || 50) / 2 - pd / 2 - 40, top);
    for (let i = 0; i < e.catchPosts; i++) post(inner, s.id, e, mat, "cut:Catch posts", W + pd / 2 + 40 + i * pd * 1.5, z, top);
    for (let i = 0; i < e.guides; i++) B(inner, s.id, "item:guide", M.black, -pd - 20 - i * 400, e.H - 260, z - 60, -20 - i * 400, e.H - 140, z + 60, EX.hw);
    for (let i = 0; i < e.catchBr; i++) B(inner, s.id, "item:catchbr", M.black, W + 20, 700 + i * 500, z - 50, W + 120, 900 + i * 500, z + 50, EX.hw);
    if (on) motorBox(inner, s.id, "item:" + e.motor, -700, z - 520);
    if (on && e.battery) B(inner, s.id, "item:battery", M.black, -660, 60, z - 230, -540, 160, z - 160, EX.hw);
    access(g, s.id, e, W, e.dir === "right" ? -1 : 1);
    return (o) => { lf.position.x = -o * (W + over); };
  },
  cant(g, s, e, mat) {
    const inner = new THREE.Group(); g.add(inner);
    if (e.dir === "right") { inner.scale.x = -1; inner.position.x = e.W / 1000; }
    const W = e.W, L = e.leafL, pd = matOf(e.postMat).dim || 125, z = -pd / 2 - 110, top = e.H + (+e.postAbove || 0) - 200;
    const lf = new THREE.Group(); lf.position.z = z / 1000; inner.add(lf);
    const body = new THREE.Group(); body.position.set((W - L) / 1000, .12, 0); lf.add(body);
    leaf(body, s.id, e, mat, { w: L, h: e.leafH, f: e.f, kStile: "cut:End stiles", kTop: "cut:Top rail", kMidStile: "cut:Middle stiles", midStiles: e.midStiles, bottom: { key: "cut:Cantilever track", h: 110, d: 90, mat: M.galv, full: true, ex: EX.track } });
    const xs = [-300, -Math.max(900, e.tail - 300)];
    for (let i = 0; i < e.posts; i++) { const x = xs[i] ?? xs[1] - (i - 1) * 600; post(inner, s.id, e, mat, "cut:Carriage posts", x, z - 45 - pd / 2 - 30, top); }
    for (const x of xs) B(inner, s.id, "item:carriage", M.black, x - 160, 40, z - 60, x + 160, 140, z + 60, EX.hw);
    for (let i = 0; i < e.catchPosts; i++) post(inner, s.id, e, mat, "cut:Catch posts", W + pd / 2 + 40 + i * pd * 1.5, z, top);
    for (let i = 0; i < e.guides; i++) B(inner, s.id, "item:guide", M.black, -420 - i * 300, e.H - 260, z - 70, -300 - i * 300, e.H - 140, z + 70, EX.hw);
    for (let i = 0; i < e.catchBr; i++) B(inner, s.id, "item:catchbr", M.black, W + 20, 700 + i * 500, z - 50, W + 120, 900 + i * 500, z + 50, EX.hw);
    const on = e.motor && e.motor !== "none";
    if (on) { B(body, s.id, "item:rack", M.galv, 0, 115, -67, L, 145, -47, EX.hw); motorBox(inner, s.id, "item:" + e.motor, xs[0] - 700, z - 560); }
    if (on && e.battery) B(inner, s.id, "item:battery", M.black, xs[0] - 660, 60, z - 270, xs[0] - 540, 160, z - 200, EX.hw);
    access(g, s.id, e, W, e.dir === "right" ? -1 : 1);
    return (o) => { lf.position.x = -o * W; };
  },
  bifold(g, s, e, mat) {
    const L = +e.L || 2, W = e.W, pw = e.panelW, pd = matOf(e.postMat).dim || 100, top = e.H + (+e.postAbove || 0);
    const hp = L === 2 ? [-pd / 2, W + pd / 2] : [-pd / 2], cp = L === 2 ? [] : [W + pd / 2];
    for (let i = 0; i < e.posts; i++) post(g, s.id, e, mat, "cut:Hinge posts", hp[i] ?? -pd * (i + 1.2), 0, top);
    for (let i = 0; i < e.catchPosts; i++) post(g, s.id, e, mat, "cut:Catch posts", cp[i] ?? W + pd * (i + 1.2), 0, top);
    const sides = [];
    for (let i = 0; i < L; i++) {
      const sgn = i === 0 ? 1 : -1, hinge = new THREE.Group(); hinge.position.set((sgn === 1 ? 15 : W - 15) / 1000, .05, 0); g.add(hinge);
      const inner = new THREE.Group(); if (sgn === -1) inner.scale.x = -1; hinge.add(inner);
      leaf(inner, s.id, e, mat, { w: pw, h: e.leafH, f: e.f, kStile: "cut:Stiles", kRail: "cut:Rails" });
      const joint = new THREE.Group(); joint.position.x = (pw + 10) / 1000; inner.add(joint);
      leaf(joint, s.id, e, mat, { w: pw, h: e.leafH, f: e.f, kStile: "cut:Stiles", kRail: "cut:Rails" });
      for (const y of [150, e.leafH - 250]) { C(inner, s.id, "item:adjhinge", M.black, 16, -10, y, y + 110, 0, EX.hw); C(inner, s.id, "item:adjhinge", M.black, 16, pw + 5, y, y + 110, 0, EX.hw); }
      C(joint, s.id, "item:dropbolt", M.galv, 8, pw - 60, -40, 500, -35, EX.hw);
      if (e.auto !== "none" && e.auto) B(g, s.id, "item:m_bifold", M.steel, sgn === 1 ? -pd - 60 : W + 60, e.H - 420, -pd / 2 - 260, sgn === 1 ? -60 : W + pd + 60, e.H - 120, -pd / 2 - 20, EX.motor);
      sides.push({ hinge, joint, sgn });
    }
    B(g, s.id, "item:dlatch", M.black, W / 2 - 60, 950, -45, W / 2 + 60, 1100, 45, EX.hw);
    access(g, s.id, e, W, 1);
    return (o) => sides.forEach(({ hinge, joint, sgn }) => { const p = o * 1.35; hinge.rotation.y = sgn * p; joint.rotation.y = -2 * p; });
  },
  fence(g, s, e, mat) {
    const pd = e.pd || 100, wall = +e.wallH || 0, top = e.pierH, rails = Math.max(2, +e.rails || 2), y0 = wall + 50, f = e.f || 25, rh = matOf(e.frame).dim || 50;
    if (wall > 0) B(g, s.id, "wall", M.wall, 0, 0, -110, e.Len, wall, 110);
    const ip = matOf(e.inMat).dim || 25, perBay = Math.ceil((e.bayW - e.gap) / (ip + e.gap));
    let x = 0;
    const fencePost = (px) => post(g, s.id, { ...e, embed: wall > 0 ? 0 : e.embed, mount: wall > 0 ? "plate" : e.mount }, mat, "cut:Fence posts", px + pd / 2, 0, top);
    if (!e.ends) { fencePost(0); x = pd; }
    for (let b = 0; b < e.bays; b++) {
      for (let r = 0; r < rails; r++) {
        const y = y0 + (r * (top - y0 - rh)) / (rails - 1);
        B(g, s.id, "cut:Rails", mat, x, y, -f / 2, x + e.bayW, y + rh, f / 2, EX.frame);
        for (const bx of [x, x + e.bayW - 40]) B(g, s.id, "item:bracket", M.galv, bx, y - 10, f / 2, bx + 40, y + rh + 10, f / 2 + 4, EX.hw);
      }
      infill(g, s.id, e, mat, x, y0, x + e.bayW, top, perBay, e.nH);
      x += e.bayW;
      if (b < e.bays - 1 || !e.ends) { fencePost(x); x += pd; }
    }
    return () => {};
  },
};

/* a text label that always faces the camera */
function label(text, sub) {
  const c = document.createElement("canvas"), g = c.getContext("2d"), scale = 2;
  g.font = `700 ${26 * scale}px Inter, system-ui, sans-serif`;
  const w = Math.max(g.measureText(text).width, sub ? (g.font = `500 ${20 * scale}px Inter, sans-serif`, g.measureText(sub).width) : 0) + 34 * scale;
  c.width = w; c.height = (sub ? 78 : 50) * scale;
  g.fillStyle = "rgba(23,23,26,.86)"; g.beginPath(); g.roundRect(0, 0, c.width, c.height, 12 * scale); g.fill();
  g.fillStyle = "#fff"; g.font = `700 ${26 * scale}px Inter, system-ui, sans-serif`; g.textBaseline = "middle"; g.fillText(text, 17 * scale, 25 * scale);
  if (sub) { g.fillStyle = "#ff8a73"; g.font = `500 ${20 * scale}px Inter, sans-serif`; g.fillText(sub, 17 * scale, 58 * scale); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true }));
  sp.scale.set(c.width / 340, c.height / 340, 1); sp.renderOrder = 10; return sp;
}

let animators = [], selBox = null;
function build3d() {
  if (!scene) return;
  if (world) { scene.remove(world); world.traverse((o) => { if (o.material && o.material.map && o.isSprite) { o.material.map.dispose(); o.material.dispose(); } if (o.geometry && o.geometry !== BOX && o.geometry !== CYL) o.geometry.dispose(); }); }
  world = new THREE.Group(); scene.add(world); PMAP = new Map(); animators = []; selBox = null;
  D.secs.forEach((s, i) => {
    const a = D.nodes[i], b = D.nodes[i + 1], L = segLen(i); if (L < 50) return;
    const g = new THREE.Group(); g.position.set(a.x / 1000, 0, a.z / 1000); g.rotation.y = -Math.atan2(b.z - a.z, b.x - a.x);
    if (D.flip) g.scale.z = -1;
    g.userData.sec = s.id; world.add(g);
    const t = tplOf(s.tpl), line = LINES.get(s.id);
    if (!t || !line) {   // an open gap: just a marker on the ground
      const m = B(g, s.id, null, new THREE.MeshBasicMaterial({ color: 0xd61d09, transparent: true, opacity: .25 }), 0, 1, -40, L, 6, 40); m.castShadow = false;
    } else {
      const e = { ...line.r.env, id: s.id }, mat = coatMat(e);
      try { const fn = BUILD[baseOf(t)] || BUILD.fence; animators.push(fn(g, s, e, mat) || (() => {})); } catch (err) { console.error(err); }
      if (view.dims) {
        const h = (e.H || e.pierH || 1800) / 1000;
        const sp = label(`${t.name}`, `${metres(L)} x ${metres(e.H || e.pierH || 0)}`); sp.position.set(L / 2000, h + .55, 0); g.add(sp);
      }
    }
    if (i === D.sel) { selBox = new THREE.BoxHelper(g, 0xd61d09); world.add(selBox); }
  });
  groundMat.opacity = view.under ? .35 : 1; groundMat.transparent = view.under; groundMat.depthWrite = !view.under;
  applyPartSel(); applyOpen(true);
}
function applyOpen(force) { animators.forEach((f) => f(view.open)); if (force) applyEx(); if (selBox) selBox.update(); }
function applyEx() {
  world && world.traverse((o) => { if (o.userData && o.userData.ex && o.userData.base) o.position.copy(o.userData.base).addScaledVector(o.userData.ex, view.ex); });
}
function applyPartSel() {
  for (const [, list] of PMAP) for (const m of list) m.material = m.userData.mat;
  if (!view.partSel) return;
  for (const m of PMAP.get(view.partSel) || []) m.material = M.hl;
}

function mount3d(el) {
  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  el.appendChild(renderer.domElement);
  scene = new THREE.Scene(); scene.background = new THREE.Color(0xdfe5ea); scene.fog = new THREE.Fog(0xdfe5ea, 60, 140);
  camera = new THREE.PerspectiveCamera(40, 1, .05, 400);
  controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true; controls.maxPolarAngle = Math.PI * .495; controls.minDistance = 1; controls.maxDistance = 90;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8f80, 1.25));
  const sun = new THREE.DirectionalLight(0xffffff, 2.1); sun.position.set(-12, 20, 14); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, far: 80 }); scene.add(sun); scene.add(sun.target);
  groundMat = new THREE.MeshStandardMaterial({ color: 0xc7c2b6, roughness: .95 });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), groundMat); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; ground.userData.ground = true; scene.add(ground);
  const grid = new THREE.GridHelper(200, 200, 0x9a968c, 0xb3aea3); grid.position.y = .002; grid.material.transparent = true; grid.material.opacity = .45; scene.add(grid);
  hoverEl = $("#tip");
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const pick = (ev) => {
    const r = renderer.domElement.getBoundingClientRect(); ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = world ? ray.intersectObjects(world.children, true).find((h) => h.object.userData && h.object.userData.key && h.object.visible) : null;
    return hit ? hit.object.userData : null;
  };
  let down = null;
  renderer.domElement.addEventListener("pointerdown", (e) => { down = [e.clientX, e.clientY]; });
  renderer.domElement.addEventListener("pointerup", (e) => {
    if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return;
    const u = pick(e);
    if (u) { const i = D.secs.findIndex((s) => s.id === u.sec); if (i >= 0) D.sel = i; view.partSel = u.sec + "|" + u.key; ui.tab = "parts"; ui.scope = "piece"; changed(false); scrollToRow(); }
    else { view.partSel = null; applyPartSel(); renderPanel(); }
  });
  let hoverT = 0;
  renderer.domElement.addEventListener("pointermove", (e) => {
    if (e.buttons) { hoverEl.hidden = true; return; }
    const now = performance.now(); if (now - hoverT < 50) return; hoverT = now;
    const u = pick(e); if (!u) { hoverEl.hidden = true; return; }
    const row = (ROWS.get(u.sec) || []).find((r) => r.key === u.key), s = D.secs.find((x) => x.id === u.sec), t = s && tplOf(s.tpl);
    const r = renderer.domElement.getBoundingClientRect();
    hoverEl.innerHTML = row ? `<b>${esc(row.name)}</b><span>${esc([row.spec, row.size].filter(Boolean).join(", "))}</span><span>${t ? esc(t.name) + ", " : ""}${fmtNum(row.qty)} ${row.grp === "Labour" ? "hours" : "off"}${row.sell ? ", " + money(row.sell) : ""}</span>` : `<b>${u.key === "wall" ? "Wall (by others)" : esc(u.key.replace(/^\w+:/, ""))}</b>`;
    hoverEl.style.left = e.clientX - r.left + 14 + "px"; hoverEl.style.top = e.clientY - r.top + 14 + "px"; hoverEl.hidden = false;
  });
  renderer.domElement.addEventListener("pointerleave", () => { hoverEl.hidden = true; });
  new ResizeObserver(size3d).observe(el); size3d();
  fit("three");
  const tick = () => { requestAnimationFrame(tick); step(); };
  window.__gateBuilder = { step: (n = 1) => { for (let i = 0; i < n; i++) step(); }, view, fit, act, changed, design: () => D, priced: () => P, rows: () => ROWS, three: () => ({ camera, scene, world, controls, PMAP }) };
  const step = () => {
    let moved = false;
    if (Math.abs(view.open - view.openTo) > .001) { view.open += Math.sign(view.openTo - view.open) * Math.min(.018, Math.abs(view.openTo - view.open)); moved = true; }
    if (Math.abs(view.ex - view.exTo) > .001) { view.ex += (view.exTo - view.ex) * .14; applyEx(); }
    if (moved) applyOpen();
    if (fly) { fly.t = Math.min(1, fly.t + .045); const k = 1 - Math.pow(1 - fly.t, 3); camera.position.lerpVectors(fly.p0, fly.p1, k); controls.target.lerpVectors(fly.t0, fly.t1, k); if (fly.t >= 1) fly = null; }
    controls.update(); renderer.render(scene, camera);
  };
  tick();
}
function size3d() { const el = renderer.domElement.parentElement, w = el.clientWidth, h = el.clientHeight; if (!w || !h) return; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); }
let fly = null;
function bounds() {
  const xs = D.nodes.map((n) => n.x / 1000), zs = D.nodes.map((n) => n.z / 1000);
  if (!xs.length) return { cx: 0, cz: 0, span: 10 };
  const x0 = Math.min(...xs), x1 = Math.max(...xs), z0 = Math.min(...zs), z1 = Math.max(...zs);
  return { cx: (x0 + x1) / 2, cz: (z0 + z1) / 2, span: Math.max(4, x1 - x0, z1 - z0) };
}
function fit(how = "three") {
  if (!camera) return;
  const b = bounds(), t1 = new THREE.Vector3(b.cx, .9, b.cz), d = b.span * .62 + 2.5, inside = D.flip ? -1 : 1;
  const p1 = how === "top" ? new THREE.Vector3(b.cx, d * 1.5, b.cz + .01) : how === "front" ? new THREE.Vector3(b.cx, 1.6, b.cz + d * inside)
    : how === "inside" ? new THREE.Vector3(b.cx, 1.8, b.cz - d * inside) : new THREE.Vector3(b.cx - d * .45, d * .42, b.cz + d * .8 * inside);
  if (how === "piece" && D.sel != null && D.nodes[D.sel + 1]) {
    const a = D.nodes[D.sel], c = D.nodes[D.sel + 1], L = segLen(D.sel) / 1000, mx = (a.x + c.x) / 2000, mz = (a.z + c.z) / 2000;
    const nx = -(c.z - a.z) / (segLen(D.sel) || 1) * inside, nz = (c.x - a.x) / (segLen(D.sel) || 1) * inside, dd = L * 1.1 + 2.5;
    fly = { t: 0, p0: camera.position.clone(), t0: controls.target.clone(), p1: new THREE.Vector3(mx + nx * dd - (c.x - a.x) / (segLen(D.sel) || 1) * dd * .35, dd * .45 + .8, mz + nz * dd), t1: new THREE.Vector3(mx, .9, mz) };
    return;
  }
  fly = { t: 0, p0: camera.position.clone(), t0: controls.target.clone(), p1, t1 };
  if (!camera.position.lengthSq()) { camera.position.copy(p1); controls.target.copy(t1); fly = null; }
}

/* ---------------- the plan you draw on ---------------- */
const PV = { s: .05, ox: 40, oy: 120, mode: "select", drag: null, hover: null, mouse: null, fitted: false };
let cv, cx;
const toPx = (p) => [p.x * PV.s + PV.ox, p.z * PV.s + PV.oy];
const toMm = (x, y) => ({ x: (x - PV.ox) / PV.s, z: (y - PV.oy) / PV.s });
const snap = (v, step = 50) => Math.round(v / step) * step;
const TYPE_COL = { fence: "#6c727a", swing: "#d61d09", ped: "#e0821a", slide: "#1f6fd6", cant: "#7a3fd6", bifold: "#1f9d55", gap: "#b9b4aa" };
function fitPlan() {
  if (!cv) return;
  const w = cv.clientWidth, h = cv.clientHeight;
  if (!D.nodes.length) { PV.s = .04; PV.ox = w / 2; PV.oy = h / 2; return; }
  const xs = D.nodes.map((n) => n.x), zs = D.nodes.map((n) => n.z);
  const x0 = Math.min(...xs) - 1500, x1 = Math.max(...xs) + 1500, z0 = Math.min(...zs) - 3000, z1 = Math.max(...zs) + 3000;
  PV.s = Math.min(w / (x1 - x0), h / (z1 - z0)); PV.ox = w / 2 - ((x0 + x1) / 2) * PV.s; PV.oy = h / 2 - ((z0 + z1) / 2) * PV.s;
}
function drawPlan() {
  if (!cv) return;
  const dpr = devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight;
  if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
  const g = cx; g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
  g.fillStyle = "#fbfbfa"; g.fillRect(0, 0, w, h);
  // grid every metre, heavier every 5
  const step = PV.s * 1000 < 12 ? 5000 : 1000, a = toMm(0, 0), b = toMm(w, h);
  for (let x = Math.floor(a.x / step) * step; x < b.x; x += step) { const px = x * PV.s + PV.ox; g.strokeStyle = x % 5000 === 0 ? "#e1e2e5" : "#eeeff1"; g.lineWidth = 1; g.beginPath(); g.moveTo(px, 0); g.lineTo(px, h); g.stroke(); }
  for (let z = Math.floor(a.z / step) * step; z < b.z; z += step) { const py = z * PV.s + PV.oy; g.strokeStyle = z % 5000 === 0 ? "#e1e2e5" : "#eeeff1"; g.beginPath(); g.moveTo(0, py); g.lineTo(w, py); g.stroke(); }
  const inside = D.flip ? -1 : 1;
  D.secs.forEach((s, i) => {
    const A = D.nodes[i], Bn = D.nodes[i + 1], L = segLen(i) || 1, [x0, y0] = toPx(A), [x1, y1] = toPx(Bn);
    const ux = (Bn.x - A.x) / L, uz = (Bn.z - A.z) / L, nx = uz * inside, nz = -ux * inside;   // n points inside the property
    const t = tplOf(s.tpl), base = baseOf(t), col = TYPE_COL[base] || "#444", sel = i === D.sel;
    const v = (LINES.get(s.id) || {}).r ? LINES.get(s.id).r.env : s.values;
    g.lineCap = "round";
    if (sel) { g.strokeStyle = "rgba(214,29,9,.18)"; g.lineWidth = 16; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
    g.strokeStyle = col; g.lineWidth = base === "fence" ? 4 : base === "gap" ? 2 : 5; g.setLineDash(base === "gap" ? [6, 6] : []);
    g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); g.setLineDash([]);
    const P2 = (mmAlong, mmIn) => [(A.x + ux * mmAlong + nx * mmIn) * PV.s + PV.ox, (A.z + uz * mmAlong + nz * mmIn) * PV.s + PV.oy];
    g.strokeStyle = col; g.lineWidth = 1.4; g.setLineDash([4, 4]);
    if (base === "swing" || base === "ped" || base === "bifold") {
      const leaves = base === "ped" ? 1 : +v.L || 1, r = base === "bifold" ? L / leaves / 2 : L / leaves;
      const arc = (hx, dirSign) => { g.beginPath(); for (let k = 0; k <= 20; k++) { const ang = (k / 20) * Math.PI / 2; const [px, py] = P2(hx + dirSign * Math.cos(ang) * r, Math.sin(ang) * r); k ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke(); };
      arc(0, 1); if (leaves === 2) arc(L, -1);
    } else if (base === "slide" || base === "cant") {
      const run = base === "slide" ? (v.leafL || L + 200) : (v.leafL || L * 1.45), dir = v.dir === "right" ? 1 : -1, off = 250;
      const [ax, ay] = P2(dir < 0 ? -run + L : L, off), [bx, by] = P2(dir < 0 ? 0 : run, off);
      g.beginPath(); g.moveTo(...P2(dir < 0 ? L : 0, off)); g.lineTo(ax, ay); g.moveTo(...P2(dir < 0 ? 0 : L, off)); g.lineTo(bx, by); g.stroke();
      g.setLineDash([]); g.lineWidth = 2; const [hx, hy] = P2(dir < 0 ? L * .25 : L * .75, off + 350), [tx, ty] = P2(dir < 0 ? L * .25 - 900 : L * .75 + 900, off + 350);
      g.beginPath(); g.moveTo(hx, hy); g.lineTo(tx, ty); g.stroke();
      const ang = Math.atan2(ty - hy, tx - hx); g.beginPath(); g.moveTo(tx, ty); g.lineTo(tx - 8 * Math.cos(ang - .5), ty - 8 * Math.sin(ang - .5)); g.moveTo(tx, ty); g.lineTo(tx - 8 * Math.cos(ang + .5), ty - 8 * Math.sin(ang + .5)); g.stroke();
    }
    g.setLineDash([]);
    // length label on the street side
    const [lx, ly] = P2(L / 2, -700 - 260 / Math.max(PV.s * 20, .4));
    const txt = metres(L), name = t ? t.name.replace(" gate", "") : "Opening";
    g.font = "600 11.5px Inter, system-ui, sans-serif"; const tw = Math.max(g.measureText(txt).width, g.measureText(name).width) + 12;
    g.fillStyle = sel ? "#d61d09" : "#fff"; g.strokeStyle = sel ? "#d61d09" : "#d6d8dc"; g.lineWidth = 1;
    g.beginPath(); g.roundRect(lx - tw / 2, ly - 16, tw, 32, 6); g.fill(); g.stroke();
    g.fillStyle = sel ? "#fff" : "#17171a"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, lx, ly - 6);
    g.font = "500 10px Inter, system-ui, sans-serif"; g.fillStyle = sel ? "#ffe1db" : col; g.fillText(name, lx, ly + 7);
  });
  // street label
  if (D.nodes.length > 1) {
    const A = D.nodes[0], Bn = D.nodes[D.nodes.length - 1], L = Math.hypot(Bn.x - A.x, Bn.z - A.z) || 1, ux = (Bn.x - A.x) / L, uz = (Bn.z - A.z) / L;
    const sx = (A.x + Bn.x) / 2 - uz * (D.flip ? -1 : 1) * -2400, sz = (A.z + Bn.z) / 2 + ux * (D.flip ? -1 : 1) * 2400;
    const [px, py] = toPx({ x: sx, z: sz }); g.font = "800 11px Archivo, Inter, sans-serif"; g.fillStyle = "#a3a6ab"; g.textAlign = "center"; g.fillText("STREET SIDE", px, py);
    const [qx, qy] = toPx({ x: (A.x + Bn.x) / 2 + uz * (D.flip ? -1 : 1) * -2400, z: (A.z + Bn.z) / 2 - ux * (D.flip ? -1 : 1) * 2400 }); g.fillText("PROPERTY", qx, qy);
  }
  // nodes (posts)
  D.nodes.forEach((n, i) => {
    const [x, y] = toPx(n), hot = PV.hover === i || (PV.drag && PV.drag.node === i);
    g.fillStyle = hot ? "#d61d09" : "#17171a"; g.fillRect(x - 5, y - 5, 10, 10);
    if (hot) { g.strokeStyle = "#d61d09"; g.lineWidth = 2; g.strokeRect(x - 9, y - 9, 18, 18); }
  });
  // rubber band while drawing
  if (PV.mode === "draw" && PV.mouse && D.nodes.length) {
    const last = D.nodes[D.nodes.length - 1], p = PV.mouse, [x0, y0] = toPx(last), [x1, y1] = toPx(p), L = Math.hypot(p.x - last.x, p.z - last.z);
    g.strokeStyle = "#d61d09"; g.lineWidth = 2; g.setLineDash([7, 5]); g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); g.setLineDash([]);
    g.fillStyle = "#d61d09"; g.font = "700 12px Inter, sans-serif"; g.textAlign = "left"; g.fillText(metres(L), x1 + 10, y1 - 10);
  }
  if (PV.mode === "draw") { g.fillStyle = "#d61d09"; g.font = "600 12px Inter, sans-serif"; g.textAlign = "left"; g.fillText(D.nodes.length ? "Tap to add the next piece. Double tap or press Done to stop." : "Tap where the frontage starts.", 12, 20); }
}
function nearNode(px, py) { let best = -1, bd = 14; D.nodes.forEach((n, i) => { const [x, y] = toPx(n); const d = Math.hypot(x - px, y - py); if (d < bd) { bd = d; best = i; } }); return best; }
function nearSeg(px, py) {
  let best = -1, bd = 14;
  D.secs.forEach((s, i) => {
    const [x0, y0] = toPx(D.nodes[i]), [x1, y1] = toPx(D.nodes[i + 1]), dx = x1 - x0, dy = y1 - y0, l2 = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((px - x0) * dx + (py - y0) * dy) / l2)), d = Math.hypot(px - (x0 + t * dx), py - (y0 + t * dy));
    if (d < bd) { bd = d; best = i; }
  });
  return best;
}
/* snap a point to 50 mm, and square it up with the last post when it is nearly straight */
function snapPt(p, from) {
  let q = { x: snap(p.x), z: snap(p.z) };
  if (from) {
    const dx = q.x - from.x, dz = q.z - from.z, ang = Math.atan2(dz, dx), L = Math.hypot(dx, dz);
    const near = Math.round(ang / (Math.PI / 4)) * (Math.PI / 4);
    if (Math.abs(ang - near) < .07) { const Ls = snap(L); q = { x: from.x + Math.cos(near) * Ls, z: from.z + Math.sin(near) * Ls }; q.x = Math.round(q.x); q.z = Math.round(q.z); }
  }
  return q;
}
function mountPlan(el) {
  cv = el; cx = cv.getContext("2d");
  const pos = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  let lastTap = 0;
  cv.addEventListener("pointerdown", (e) => {
    const [px, py] = pos(e); cv.setPointerCapture(e.pointerId);
    if (PV.mode === "draw") {
      const now = Date.now();
      const lastPx = D.nodes.length ? toPx(D.nodes[D.nodes.length - 1]) : null;
      if (now - lastTap < 400 && D.nodes.length > 1 && lastPx && Math.hypot(lastPx[0] - px, lastPx[1] - py) < 18) { setMode("select"); return; }
      lastTap = now;
      const p = snapPt(toMm(px, py), D.nodes[D.nodes.length - 1]);
      if (D.nodes.length && Math.hypot(p.x - D.nodes[D.nodes.length - 1].x, p.z - D.nodes[D.nodes.length - 1].z) < 200) return;
      D.nodes.push(p);
      if (D.nodes.length > 1) { D.secs.push(newPiece(ui.next, segLen(D.nodes.length - 2))); D.sel = D.secs.length - 1; }
      changed(true); return;
    }
    const n = nearNode(px, py);
    if (n >= 0) { PV.drag = { node: n }; return; }
    const sgi = nearSeg(px, py);
    if (sgi >= 0) { D.sel = sgi; view.partSel = null; ui.tab = "piece"; changed(false); fit("piece"); return; }
    PV.drag = { pan: [px, py, PV.ox, PV.oy] };
  });
  cv.addEventListener("pointermove", (e) => {
    const [px, py] = pos(e);
    if (PV.mode === "draw") { PV.mouse = snapPt(toMm(px, py), D.nodes[D.nodes.length - 1]); drawPlan(); return; }
    if (PV.drag && PV.drag.pan) { const [sx, sy, ox, oy] = PV.drag.pan; PV.ox = ox + px - sx; PV.oy = oy + py - sy; drawPlan(); return; }
    if (PV.drag && PV.drag.node != null) {
      const i = PV.drag.node, from = D.nodes[i - 1] || D.nodes[i + 1];
      const p = snapPt(toMm(px, py), from); D.nodes[i] = p; PV.drag.moved = true; changed(true, true); return;
    }
    const h = nearNode(px, py); if (h !== PV.hover) { PV.hover = h; cv.style.cursor = h >= 0 ? "grab" : nearSeg(px, py) >= 0 ? "pointer" : "default"; drawPlan(); }
  });
  cv.addEventListener("pointerup", () => { if (PV.drag && PV.drag.moved) changed(true); PV.drag = null; });
  cv.addEventListener("wheel", (e) => {
    e.preventDefault(); const [px, py] = pos(e), before = toMm(px, py);
    PV.s = Math.min(.6, Math.max(.008, PV.s * (e.deltaY < 0 ? 1.12 : 1 / 1.12)));
    PV.ox = px - before.x * PV.s; PV.oy = py - before.z * PV.s; drawPlan();
  }, { passive: false });
  new ResizeObserver(() => { if (!PV.fitted) { fitPlan(); PV.fitted = true; } drawPlan(); }).observe(cv);
}
function newPiece(tpl, len) {
  const p = tpl === "gap" ? { id: uid(), tpl: "gap", values: {} } : piece(tpl, len);
  const prev = D.secs[D.sel] || D.secs[D.secs.length - 1];
  if (prev && tplOf(tpl)) carryLook(prev, p);
  return p;
}
/* the look of one piece carried to another: infill, colour, finish and height */
const LOOK = ["infill", "inMat", "gap", "finish", "colour", "mount", "crew"];
function carryLook(from, to) {
  const t = tplOf(to.tpl); if (!t) return;
  for (const k of LOOK) if (k in from.values && t.inputs.find((i) => i.k === k)) to.values[k] = from.values[k];
  const h = from.values.H ?? from.values.pierH;
  if (h) { if (t.inputs.find((i) => i.k === "H")) to.values.H = Math.min(h, (t.inputs.find((i) => i.k === "H") || {}).max || h); if (t.inputs.find((i) => i.k === "pierH")) to.values.pierH = h; }
}
function setMode(m) {
  PV.mode = m; PV.mouse = null;
  if (m === "select" && D.secs.length === 0 && D.nodes.length === 1) D.nodes = [];
  renderTools(); drawPlan();
}

/* ---------------- the side panel ---------------- */
const ui = { tab: "piece", scope: "piece", next: "fence" };
function inputHtml(t, s, i) {
  const v = s.values[i.k] ?? i.def, id = `in_${i.k}`;
  if (i.type === "num") return `<label class="fld"><span>${esc(i.label)}</span><div class="numw"><input type="number" inputmode="decimal" id="${id}" data-k="${i.k}" value="${esc(v)}" min="${i.min ?? ""}" max="${i.max ?? ""}" step="${i.step ?? (i.unit === "mm" ? 10 : 1)}"><em>${esc(i.unit === "mm" ? "mm" : i.unit || "")}</em></div></label>`;
  if (i.type === "bool") return `<label class="tog"><input type="checkbox" data-k="${i.k}" ${v ? "checked" : ""}><i></i><span>${esc(i.label)}</span></label>`;
  if (i.type === "text") {
    if (i.k === "colour") return `<label class="fld"><span>${esc(i.label)}</span><input list="colours" data-k="${i.k}" value="${esc(v)}"></label><div class="sw">${Object.entries(COLOURS).slice(0, 16).map(([n, c]) => `<button title="${n}" data-colour="${n}" class="${String(v).toLowerCase() === n.toLowerCase() ? "on" : ""}" style="background:#${c.toString(16).padStart(6, "0")}"></button>`).join("")}</div>`;
    return `<label class="fld"><span>${esc(i.label)}</span><input data-k="${i.k}" value="${esc(v)}"></label>`;
  }
  if (i.type === "mat") return `<label class="fld"><span>${esc(i.label)}</span><select data-k="${i.k}">${PB.materials.filter((m) => m.cat === i.filter).map((m) => `<option value="${m.id}" ${m.id === v ? "selected" : ""}>${esc(m.name)}</option>`).join("")}</select></label>`;
  if (i.type === "seg") return `<div class="fld"><span>${esc(i.label)}</span><div class="seg">${i.opts.map(([k, l]) => `<button data-k="${i.k}" data-v="${esc(k)}" class="${String(k) === String(v) ? "on" : ""}">${esc(l)}</button>`).join("")}</div></div>`;
  return "";
}
function pieceTab() {
  const s = D.secs[D.sel];
  if (!s) return `<div class="empty"><b>Draw the frontage first</b><p>Press Draw, tap where the frontage starts, then tap at each corner, gate or post. Every piece starts as fencing; tap a piece to make it a gate.</p></div>`;
  const t = tplOf(s.tpl), L = segLen(D.sel), line = LINES.get(s.id);
  const types = pieceTypes().map((x) => `<button data-type="${x.id}" class="${x.id === s.tpl ? "on" : ""}"><i style="background:${TYPE_COL[baseOf(x)] || "#444"}"></i>${esc(x.name)}</button>`).join("") + `<button data-type="gap" class="${s.tpl === "gap" ? "on" : ""}"><i style="background:${TYPE_COL.gap}"></i>Opening only</button>`;
  let h = `<div class="phead"><div><small>Piece ${D.sel + 1} of ${D.secs.length}</small><h2>${esc(t ? t.name : "Opening only")}</h2></div>${line ? `<div class="pp"><b>${money(line.sell)}</b><small>ex GST</small></div>` : ""}</div>
    <div class="types">${types}</div>
    <div class="fld"><span>${t && t.kind === "fence" ? "Run length" : "Opening width"} (from the drawing)</span><div class="numw big"><input type="number" id="seglen" value="${Math.round(L)}" step="50" min="100"><em>mm</em></div></div>
    <div class="acts"><button class="btn sm" data-a="split">Split in two</button><button class="btn sm" data-a="putgate">Put a gate in the middle</button><button class="btn sm" data-a="look">Same look on every piece</button><button class="btn sm ghost" data-a="del">Remove this piece</button></div>`;
  if (!t) return h;
  const lim = t.inputs.find((i) => i.k === lenKey(t));
  if (lim && (L < (lim.min || 0) || L > (lim.max || 1e9))) h += `<p class="warn">This ${t.name.toLowerCase()} is ${metres(L)} wide. It suits ${metres(lim.min)} to ${metres(lim.max)}.</p>`;
  if (line) for (const w of line.r.warnings) h += `<p class="warn">${esc(w)}</p>`;
  if (line) h += `<p class="kg">About <b>${fmtNum(line.r.kg)} kg</b> of steel, ${(+line.r.area).toFixed(1)} m² to coat.</p>`;
  let grp = null;
  for (const i of t.inputs) {
    if (i.k === lenKey(t)) continue;
    if (i.k === "fabq" && s.values.make !== "fab") continue;
    if (i.group && i.group !== grp) { grp = i.group; h += `<h4>${esc(grp)}</h4>`; }
    h += inputHtml(t, s, i);
  }
  return h;
}
function rowsHtml(list, office) {
  let h = "", grp = null;
  for (const { r, sec, t } of list) {
    if (r.grp !== grp) { grp = r.grp; h += `<tr class="g"><td colspan="${office ? 5 : 4}">${esc(grp)}</td></tr>`; }
    const k = sec + "|" + r.key, on = view.partSel === k;
    h += `<tr data-part="${esc(k)}" class="${on ? "on" : ""}"><td><b>${esc(r.name)}</b>${r.spec ? `<small>${esc(r.spec)}</small>` : ""}${t ? `<small class="pc">${esc(t)}</small>` : ""}</td><td>${esc(r.size)}</td><td class="n">${fmtNum(r.qty)}</td>${office ? `<td class="n cost">${money(r.cost, true)}</td>` : ""}<td class="n">${money(r.sell, true)}</td></tr>`;
  }
  return h;
}
function partsTab() {
  if (!P || !P.lines.length) return `<div class="empty"><b>No parts yet</b><p>Make a piece a fence or gate to see its parts.</p></div>`;
  const s = D.secs[D.sel], one = ui.scope === "piece" && s && LINES.get(s.id);
  const order = ["Steel and aluminium", "Fabricator", "Hardware", "Motor and access", "Finish", "Labour", "Other"];
  let list = [];
  if (one) list = (ROWS.get(s.id) || []).map((r) => ({ r, sec: s.id }));
  else for (const sec of D.secs) { const t = tplOf(sec.tpl); for (const r of ROWS.get(sec.id) || []) list.push({ r, sec: sec.id, t: t ? `Piece ${D.secs.indexOf(sec) + 1}, ${t.name}` : "" }); }
  list.sort((a, b) => order.indexOf(a.r.grp) - order.indexOf(b.r.grp));
  const sum = list.reduce((a, x) => a + x.r.sell, 0), cost = list.reduce((a, x) => a + x.r.cost, 0);
  return `<div class="scope"><button data-scope="piece" class="${ui.scope === "piece" ? "on" : ""}">This piece</button><button data-scope="all" class="${ui.scope === "all" ? "on" : ""}">Whole job</button></div>
    <p class="hint">Tap a part to light it up in 3D. Tap a part in 3D to find it here.</p>
    <table class="parts"><thead><tr><th>Part</th><th>Size</th><th class="n">Qty</th>${OFFICE ? `<th class="n">Cost</th>` : ""}<th class="n">Price</th></tr></thead><tbody>${rowsHtml(list, OFFICE)}</tbody>
    <tfoot><tr><td colspan="3">${one ? "This piece" : "All pieces"}, ex GST</td>${OFFICE ? `<td class="n cost">${money(cost)}</td>` : ""}<td class="n">${money(sum)}</td></tr></tfoot></table>`;
}
function cutsTab() {
  if (!P || (!P.packs.length && !P.sheetPacks.length)) return `<div class="empty"><b>No steel on this job</b><p>Pieces made by the fabricator have no cut list. Set "Who makes it" to Apex makes it to see one.</p></div>`;
  let h = `<p class="hint">Every cut for the whole job, packed into full lengths with a ${PB.settings.kerf} mm saw cut. Hover a cut to see what it is.</p>`;
  for (const pk of P.packs) {
    h += `<div class="pack"><div class="ph"><b>${esc(pk.mat.name)}</b><span>${pk.bars.length} x ${metres(pk.mat.stock)}${OFFICE ? `, ${money(pk.cost)}` : ""}, ${(pk.waste * 100).toFixed(0)}% offcut</span></div>`;
    pk.bars.forEach((bar, bi) => {
      h += `<div class="bar" title="Length ${bi + 1}">${bar.cuts.map((c) => `<i style="width:${(c.len / pk.mat.stock) * 100}%" title="${esc(c.label)} ${fmtNum(c.len)} mm"><span>${fmtNum(c.len)}</span></i>`).join("")}</div>`;
    });
    const tally = new Map(); for (const bar of pk.bars) for (const c of bar.cuts) { const k = c.label + "|" + c.len; tally.set(k, (tally.get(k) || 0) + 1); }
    h += `<table class="parts small"><tbody>${[...tally].map(([k, n]) => { const [l, len] = k.split("|"); return `<tr><td>${esc(l)}</td><td class="n">${fmtNum(+len)} mm</td><td class="n">${n} off</td></tr>`; }).join("")}</tbody></table></div>`;
  }
  for (const sp of P.sheetPacks) h += `<div class="pack"><div class="ph"><b>${esc(sp.mat.name)}</b><span>${sp.count} sheet${sp.count > 1 ? "s" : ""} for ${sp.area.toFixed(2)} m²${OFFICE ? `, ${money(sp.cost)}` : ""}</span></div></div>`;
  return h;
}
function quoteTab() {
  if (!P || !P.lines.length) return `<div class="empty"><b>Nothing to quote yet</b></div>`;
  const pieces = P.lines.map((l) => `<tr><td><b>${esc(l.name)}</b><small>${esc(l.desc)}</small></td>${OFFICE ? `<td class="n cost">${money(l.costTotal)}</td>` : ""}<td class="n">${money(l.sell)}</td></tr>`).join("");
  const cats = [["materials", "Steel and aluminium"], ["hardware", "Hardware"], ["motors", "Motors and access"], ["finish", "Finish"], ["labour", "Labour"], ["other", "Other"]];
  const maxD = OFFICE ? 50 : +(PB.settings.maxDisc ?? 10);
  return `<div class="fld"><span>Customer</span><input data-c="name" value="${esc(D.client.name)}" placeholder="Name"></div>
    <div class="row2"><input data-c="phone" value="${esc(D.client.phone)}" placeholder="Phone" inputmode="tel"><input data-c="address" value="${esc(D.client.address)}" placeholder="Site address"></div>
    <table class="parts"><thead><tr><th>Piece</th>${OFFICE ? `<th class="n">Cost</th>` : ""}<th class="n">Price</th></tr></thead><tbody>${pieces}</tbody></table>
    ${OFFICE ? `<table class="parts small"><thead><tr><th>Where the money goes</th><th class="n">Cost</th><th class="n">Charged</th><th class="n">Markup</th></tr></thead><tbody>${cats.filter(([k]) => P.tot.byCat[k] && P.tot.byCat[k].cost).map(([k, n]) => `<tr><td>${n}</td><td class="n">${money(P.tot.byCat[k].cost)}</td><td class="n">${money(P.tot.byCat[k].sell)}</td><td class="n">${PB.markup[k] ?? 0}%</td></tr>`).join("")}</tbody></table>` : ""}
    <div class="fld"><span>Discount (up to ${maxD}%)</span><div class="numw"><input type="number" id="disc" value="${D.discount || 0}" min="0" max="${maxD}" step="1"><em>%</em></div></div>
    <div class="tot">
      ${P.disc ? `<div><span>Discount</span><b>${P.disc}%</b></div>` : ""}
      <div><span>Total ex GST</span><b>${money(P.exGst)}</b></div>
      <div><span>GST</span><b>${money(P.gst)}</b></div>
      <div class="big"><span>Total inc GST</span><b>${money(P.inc)}</b></div>
      ${OFFICE ? `<div class="prof"><span>Apex makes</span><b>${money(P.exGst - P.tot.cost)} (${(P.margin * 100).toFixed(1)}%)</b></div><div class="prof"><span>Cost to Apex</span><b>${money(P.tot.cost)}</b></div>` : ""}
      <div class="sm"><span>Steel weight</span><b>${fmtNum(Math.round(P.kg))} kg</b></div>
    </div>
    ${P.warnings.map((w) => `<p class="warn">${esc(w)}</p>`).join("")}${P.errors.map((w) => `<p class="warn err">${esc(w)}</p>`).join("")}
    <div class="acts col"><button class="btn red" data-a="toquote">Open it in Apex Quote</button><button class="btn" data-a="print">Print the parts list</button><button class="btn" data-a="csv">Download the parts (CSV)</button></div>
    ${ONLINE ? "" : `<p class="warn">Offline: using the starting prices on this device.</p>`}`;
}
function renderPanel() {
  const tabs = [["piece", "Piece"], ["parts", "Parts"], ["cuts", "Cut list"], ["quote", "Quote"]];
  $("#tabs").innerHTML = tabs.map(([k, l]) => `<button data-tab="${k}" class="${ui.tab === k ? "on" : ""}">${l}</button>`).join("");
  const body = ui.tab === "piece" ? pieceTab() : ui.tab === "parts" ? partsTab() : ui.tab === "cuts" ? cutsTab() : quoteTab();
  const el = $("#panel"), keep = el.scrollTop, focus = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.k || document.activeElement.id : null;
  el.innerHTML = body; el.scrollTop = keep;
  if (focus) { const f = el.querySelector(`[data-k="${focus}"]`) || el.querySelector("#" + focus); if (f && f.tagName === "INPUT" && f.type !== "checkbox") { f.focus(); try { const n = f.value.length; f.setSelectionRange && f.type !== "number" && f.setSelectionRange(n, n); } catch (e) { /* number inputs */ } } }
  $("#total").innerHTML = P && P.lines.length ? `<b>${money(P.inc)}</b><small>inc GST${OFFICE ? `, ${(P.margin * 100).toFixed(0)}% margin` : ""}</small>` : "";
}
function renderTools() {
  $("#ptools").innerHTML = `<button class="${PV.mode === "select" ? "on" : ""}" data-m="select">Move</button><button class="${PV.mode === "draw" ? "on" : ""}" data-m="draw">${PV.mode === "draw" ? "Done" : "Draw"}</button>
    <select id="next" title="Next piece you draw">${pieceTypes().map((t) => `<option value="${t.id}" ${ui.next === t.id ? "selected" : ""}>Next: ${esc(t.name)}</option>`).join("")}<option value="gap" ${ui.next === "gap" ? "selected" : ""}>Next: Opening only</option></select>
    <button data-a="undo" title="Take off the last post">Undo</button><button data-a="flip" title="Swap the street and property sides">Flip side</button><button data-a="fitplan">Fit</button><button data-a="new" class="dang">Start again</button>`;
}
function scrollToRow() { requestAnimationFrame(() => { const r = $("#panel tr.on"); if (r) r.scrollIntoView({ block: "center", behavior: "smooth" }); }); }

let buildT;
function changed(rebuild3d = true, quick = false) {
  price(); saveDesign(); drawPlan(); renderPanel();
  if (!rebuild3d) { if (scene) build3d(); return; }
  clearTimeout(buildT); buildT = setTimeout(build3d, quick ? 90 : 10);
}

/* ---------------- actions ---------------- */
function act(a) {
  const i = D.sel, s = D.secs[i];
  if (a === "split" && s) {
    const A = D.nodes[i], Bn = D.nodes[i + 1], mid = { x: Math.round((A.x + Bn.x) / 2), z: Math.round((A.z + Bn.z) / 2) };
    D.nodes.splice(i + 1, 0, mid); const c = clone(s); c.id = uid(); D.secs.splice(i + 1, 0, c);
  }
  if (a === "putgate" && s) {
    const L = segLen(i), want = Math.min(Math.max(L - 1000, 600), 4000), A = D.nodes[i], Bn = D.nodes[i + 1], ux = (Bn.x - A.x) / L, uz = (Bn.z - A.z) / L, st = (L - want) / 2;
    if (L < 1200) return say("This piece is too short to put a gate in");
    const p1 = { x: Math.round(A.x + ux * st), z: Math.round(A.z + uz * st) }, p2 = { x: Math.round(A.x + ux * (st + want)), z: Math.round(A.z + uz * (st + want)) };
    D.nodes.splice(i + 1, 0, p1, p2);
    const gate = newPiece(want < 1500 ? "ped" : "swing", want), right = clone(s); right.id = uid(); carryLook(s, gate);
    D.secs.splice(i + 1, 0, gate, right); D.sel = i + 1;
  }
  if (a === "del" && s) {
    if (D.secs.length === 1) { D.nodes = []; D.secs = []; D.sel = 0; }
    else {
      const A = D.nodes[i], Bn = D.nodes[i + 1], dx = Bn.x - A.x, dz = Bn.z - A.z;
      for (let k = i + 2; k < D.nodes.length; k++) { D.nodes[k].x -= dx; D.nodes[k].z -= dz; }
      D.nodes.splice(i + 1, 1); D.secs.splice(i, 1); D.sel = Math.max(0, Math.min(i, D.secs.length - 1));
    }
  }
  if (a === "look" && s) { for (const o of D.secs) if (o !== s) carryLook(s, o); say("Copied the infill, colour, finish and height to every piece"); }
  if (a === "undo") { if (D.secs.length) { D.secs.pop(); D.nodes.pop(); if (D.nodes.length === 1) D.nodes = []; D.sel = Math.max(0, D.secs.length - 1); } }
  if (a === "flip") D.flip = !D.flip;
  if (a === "fitplan") { fitPlan(); drawPlan(); fit("three"); return; }
  if (a === "new") { if (!confirm("Start a new drawing? This one will be cleared.")) return; const c = D.client; D = { ...sample(), nodes: [], secs: [], sel: 0, client: c }; setMode("draw"); }
  if (a === "print") return printParts();
  if (a === "csv") return csv();
  if (a === "toquote") return toQuote();
  view.partSel = null;
  changed(true); fitPlan(); drawPlan();
}
let sayT;
function say(t) { const el = $("#say"); el.textContent = t; el.classList.add("on"); clearTimeout(sayT); sayT = setTimeout(() => el.classList.remove("on"), 2600); }

function allRows() { const out = []; D.secs.forEach((s, i) => { const t = tplOf(s.tpl); for (const r of ROWS.get(s.id) || []) out.push({ piece: `${i + 1}. ${t ? t.name : ""}`, ...r }); }); return out; }
function csv() {
  const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const head = ["Piece", "Group", "Part", "Spec", "Size", "Qty", ...(OFFICE ? ["Cost each", "Cost"] : []), "Price ex GST"];
  const lines = [head.map(q).join(",")].concat(allRows().map((r) => [r.piece, r.grp, r.name, r.spec, r.size, r.qty, ...(OFFICE ? [r.each.toFixed(2), r.cost.toFixed(2)] : []), r.sell.toFixed(2)].map(q).join(",")));
  lines.push("", [q("Total ex GST"), "", "", "", "", "", ...(OFFICE ? ["", P.tot.cost.toFixed(2)] : []), P.exGst.toFixed(2)].join(","), [q("GST"), "", "", "", "", "", ...(OFFICE ? ["", ""] : []), P.gst.toFixed(2)].join(","), [q("Total inc GST"), "", "", "", "", "", ...(OFFICE ? ["", ""] : []), P.inc.toFixed(2)].join(","));
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/csv" }));
  a.download = `Apex gate parts ${(D.client.name || "job").replace(/[^\w ]+/g, "")}.csv`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
function printParts() {
  const shot = renderer ? (renderer.render(scene, camera), renderer.domElement.toDataURL("image/jpeg", .9)) : "";
  const plan = cv ? cv.toDataURL("image/png") : "";
  const rows = allRows();
  let grp = null, piece = null, body = "";
  for (const r of rows) {
    if (r.piece !== piece) { piece = r.piece; grp = null; body += `<tr class="pc"><td colspan="${OFFICE ? 6 : 5}">${esc(piece)}</td></tr>`; }
    if (r.grp !== grp) { grp = r.grp; body += `<tr class="g"><td colspan="${OFFICE ? 6 : 5}">${esc(grp)}</td></tr>`; }
    body += `<tr><td>${esc(r.name)}${r.spec ? ` <small>${esc(r.spec)}</small>` : ""}</td><td>${esc(r.size)}</td><td class="n">${fmtNum(r.qty)}</td>${OFFICE ? `<td class="n">${money(r.cost, true)}</td>` : ""}<td class="n">${money(r.sell, true)}</td><td class="tick"></td></tr>`;
  }
  $("#print").innerHTML = `<h1>Apex Gates, parts list</h1><p>${esc(D.client.name || "")}${D.client.address ? ", " + esc(D.client.address) : ""}. ${new Date().toLocaleDateString("en-AU")}. Internal: not for the customer.</p>
    <div class="imgs">${shot ? `<img src="${shot}">` : ""}${plan ? `<img src="${plan}">` : ""}</div>
    <table><thead><tr><th>Part</th><th>Size</th><th class="n">Qty</th>${OFFICE ? "<th class='n'>Cost</th>" : ""}<th class="n">Price</th><th>Got it</th></tr></thead><tbody>${body}</tbody></table>
    <p class="tot">Total ex GST ${money(P.exGst)}, GST ${money(P.gst)}, total inc GST <b>${money(P.inc)}</b>${OFFICE ? `. Cost ${money(P.tot.cost)}, Apex makes ${money(P.exGst - P.tot.cost)}` : ""}.</p>`;
  setTimeout(() => window.print(), 150);
}
/* hand the drawing to the quoting app on this device as a new quote */
function toQuote() {
  if (!P || !P.lines.length) return say("Nothing to quote yet");
  let db = null;
  try { db = JSON.parse(localStorage.getItem("apexq.v1")); } catch (e) { /* none yet */ }
  if (!db || !db.quotes) db = { v: VERSION, pb: OFFICE ? clone(PB) : teamView(PRICEBOOK), templates: clone(TEMPLATES), quotes: [], nextNo: 1001, current: null, pbUpdated: Date.now(), lastTech: "" };
  const L = D.secs.reduce((a, _, i) => a + segLen(i), 0);
  const q = { id: uid(), no: `Q-${db.nextNo++}`, created: Date.now(), updated: Date.now(), status: "draft", client: { name: D.client.name || "", phone: D.client.phone || "", email: "", address: D.client.address || "" },
    tech: db.lastTech || "", notes: `Drawn in the 3D builder: ${D.secs.length} pieces, ${metres(L)} of frontage.`, discount: +D.discount || 0,
    items: D.secs.filter((s) => tplOf(s.tpl)).map((s) => ({ id: uid(), tpl: s.tpl, name: tplOf(s.tpl).name, values: clone(s.values) })), sel: null, showPrices: true, showDrawings: true, signature: null, build3d: clone(D) };
  db.quotes.unshift(q); db.current = q.id;
  try { localStorage.setItem("apexq.v1", JSON.stringify(db)); sessionStorage.setItem("apexq.open", "job"); } catch (e) { return say("Could not save on this device"); }
  location.href = "index.html";
}

/* ---------------- wiring ---------------- */
function setVal(k, raw) {
  const s = D.secs[D.sel], t = s && tplOf(s.tpl); if (!t) return;
  const i = t.inputs.find((x) => x.k === k); if (!i) return;
  let v = raw;
  if (i.type === "num") { v = +raw; if (!isFinite(v)) return; }
  if (i.type === "bool") v = raw ? 1 : 0;
  if (i.type === "seg" && typeof i.def === "number") v = +raw;
  s.values[k] = v;
}
function wire() {
  $("#tabs").addEventListener("click", (e) => { const b = e.target.closest("[data-tab]"); if (b) { ui.tab = b.dataset.tab; renderPanel(); } });
  const panel = $("#panel");
  panel.addEventListener("click", (e) => {
    const b = e.target.closest("button, tr[data-part]"); if (!b) return;
    if (b.dataset.type) {
      const s = D.secs[D.sel], np = newPiece(b.dataset.type, segLen(D.sel)); np.id = s.id; carryLook(s, np);
      D.secs[D.sel] = np; view.partSel = null; changed(true); return;
    }
    if (b.dataset.k && b.dataset.v !== undefined) { setVal(b.dataset.k, b.dataset.v); changed(true); return; }
    if (b.dataset.colour) { setVal("colour", b.dataset.colour); changed(true); return; }
    if (b.dataset.scope) { ui.scope = b.dataset.scope; renderPanel(); return; }
    if (b.dataset.part) {
      view.partSel = view.partSel === b.dataset.part ? null : b.dataset.part;
      const sec = b.dataset.part.split("|")[0], i = D.secs.findIndex((s) => s.id === sec);
      if (i >= 0 && i !== D.sel) { D.sel = i; build3d(); drawPlan(); }
      applyPartSel(); renderPanel(); if (view.partSel) { view.exTo = Math.max(view.exTo, .35); syncEx(); } return;
    }
    if (b.dataset.a) act(b.dataset.a);
  });
  panel.addEventListener("change", (e) => {
    const el = e.target;
    if (el.id === "seglen") { setLen(D.sel, +el.value); changed(true); fitPlan(); drawPlan(); return; }
    if (el.id === "disc") { const max = OFFICE ? 50 : +(PB.settings.maxDisc ?? 10); D.discount = Math.min(max, Math.max(0, +el.value || 0)); changed(false); return; }
    if (el.dataset.c) { D.client[el.dataset.c] = el.value; saveDesign(); return; }
    if (el.dataset.k) { setVal(el.dataset.k, el.type === "checkbox" ? el.checked : el.value); changed(true); }
  });
  panel.addEventListener("input", (e) => { const el = e.target; if (el.dataset.c) { D.client[el.dataset.c] = el.value; saveDesign(); } });
  $("#ptools").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.m) { setMode(b.dataset.m === "draw" && PV.mode === "draw" ? "select" : b.dataset.m); return; }
    if (b.dataset.a) act(b.dataset.a);
  });
  $("#ptools").addEventListener("change", (e) => { if (e.target.id === "next") ui.next = e.target.value; });
  $("#vtools").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    const v = b.dataset.v;
    if (v === "open") { view.openTo = view.openTo ? 0 : 1; b.classList.toggle("on", !!view.openTo); b.textContent = view.openTo ? "Close gates" : "Open gates"; }
    if (v === "under") { view.under = !view.under; b.classList.toggle("on", view.under); build3d(); }
    if (v === "dims") { view.dims = !view.dims; b.classList.toggle("on", view.dims); build3d(); }
    if (["three", "front", "inside", "top", "piece"].includes(v)) fit(v);
  });
  $("#explode").addEventListener("input", (e) => { view.exTo = +e.target.value / 100; });
  addEventListener("keydown", (e) => {
    if (e.target.matches("input, select, textarea")) return;
    if (e.key === "Escape") setMode("select");
    if ((e.key === "Delete" || e.key === "Backspace") && D.secs[D.sel]) act("del");
    if (e.key === "d") setMode(PV.mode === "draw" ? "select" : "draw");
  });
  $("#colours").innerHTML = Object.keys(COLOURS).map((n) => `<option value="${n}">`).join("");
}
function syncEx() { const el = $("#explode"); if (el) el.value = Math.round(view.exTo * 100); }

wire();
renderTools();
mountPlan($("#plan"));
mount3d($("#three"));
changed(true);
pull();
