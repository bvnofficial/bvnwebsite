/* Apex Gate Builder: 3D engine.
   A generated street frontage the customer builds on: a driveway gate, a pedestrian gate, then fencing
   between piers, each dragged along the boundary. No photo, so every customer sees the same true view.
   World units are metres: X along the frontage (0 = left end), Y up, Z towards the street (property is -Z).
   The boundary line is z = 0. */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/* ---------- textures drawn on a canvas, so nothing extra to download ---------- */
function canvasTex(w, h, draw, repeat = true) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}
const rnd = (a, b) => a + Math.random() * (b - a);
const TEX = {
  // herringbone clay pavers, like most Perth driveways (one tile = 1.2 m)
  pavers: canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = "#8f4a33"; g.fillRect(0, 0, w, h);
    const u = w / 12;
    for (let i = -14; i < 14; i++) for (let j = -14; j < 14; j++) {
      const x = (i + j) * u * 2, y = (j - i) * u * 2;
      [[x, y, u * 4, u * 2], [x + u * 2, y + u * 2, u * 2, u * 4]].forEach(([a, b, c, d]) => {
        const k = rnd(-14, 14);
        g.fillStyle = `rgb(${172 + k},${92 + k * .6},${64 + k * .4})`;
        g.fillRect(a + 1.5, b + 1.5, c - 3, d - 3);
      });
    }
  }),
  grass: canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = "#6f8f3e"; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) { const k = rnd(-22, 22); g.fillStyle = `rgba(${96 + k},${128 + k},${52 + k * .5},.55)`; g.fillRect(rnd(0, w), rnd(0, h), 2, rnd(2, 5)); }
  }),
  concrete: canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = "#c9c5bc"; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 1800; i++) { const k = rnd(-16, 16); g.fillStyle = `rgba(${190 + k},${186 + k},${178 + k},.5)`; g.fillRect(rnd(0, w), rnd(0, h), 2, 2); }
    g.fillStyle = "rgba(0,0,0,.18)"; g.fillRect(0, 0, w, 2);
  }),
  asphalt: canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = "#4a4c50"; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 3000; i++) { const k = rnd(-18, 18); g.fillStyle = `rgba(${78 + k},${80 + k},${84 + k},.6)`; g.fillRect(rnd(0, w), rnd(0, h), 2, 2); }
  }),
  brick: canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = "#d8cfc2"; g.fillRect(0, 0, w, h);
    const bh = h / 12, bw = w / 3.5;
    for (let r = 0; r < 12; r++) for (let c = -1; c < 5; c++) {
      const k = rnd(-18, 18), x = c * bw + (r % 2 ? bw / 2 : 0);
      g.fillStyle = `rgb(${150 + k},${74 + k * .6},${50 + k * .4})`;
      g.fillRect(x + 2, r * bh + 2, bw - 4, bh - 4);
    }
  }),
  limestone: canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = "#e3d6b8"; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 1400; i++) { const k = rnd(-20, 14); g.fillStyle = `rgba(${214 + k},${200 + k},${168 + k},.6)`; g.fillRect(rnd(0, w), rnd(0, h), rnd(2, 5), rnd(2, 4)); }
    g.strokeStyle = "rgba(120,100,70,.35)"; g.lineWidth = 2;
    for (let y = 0; y <= h; y += h / 3) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    for (let r = 0; r < 3; r++) for (let x = (r % 2) * w / 4; x < w; x += w / 2) { g.beginPath(); g.moveTo(x, r * h / 3); g.lineTo(x, (r + 1) * h / 3); g.stroke(); }
  }),
};
const texCache = new Map();
function tiled(key, rx, ry) { // a copy of a texture with its own repeat, cached by size
  const k = `${key}:${rx.toFixed(2)}:${ry.toFixed(2)}`;
  if (!texCache.has(k)) { const t = TEX[key].clone(); t.repeat.set(rx, ry); t.needsUpdate = true; texCache.set(k, t); }
  return texCache.get(k);
}

/* ---------- materials ---------- */
const std = (o) => new THREE.MeshStandardMaterial({ roughness: .8, metalness: 0, ...o });
const MAT = {
  drive: std({ color: 0xecebe6, metalness: .35, roughness: .45 }),
  driveBack: std({ color: 0xecebe6, metalness: .35, roughness: .45 }),
  ped: std({ color: 0xecebe6, metalness: .35, roughness: .45 }),
  fence: std({ color: 0xecebe6, metalness: .35, roughness: .45 }),
  galv: std({ color: 0xa7acb1, metalness: .85, roughness: .36 }),
  steel: std({ color: 0x2a2d31, metalness: .45, roughness: .5 }),
  black: std({ color: 0x17191c, roughness: .7 }),
  ledGreen: std({ color: 0x0c3a1c, emissive: 0x35d07f, emissiveIntensity: 1.2 }),
  concretePad: std({ color: 0xbdb8ae, roughness: .95 }),
  houseWall: std({ color: 0xefe6d6, roughness: .9 }),
  houseTrim: std({ color: 0xd9cdb8, roughness: .85 }),
  roof: std({ color: 0x5b5f63, roughness: .7 }),
  garage: std({ color: 0xe9e4da, roughness: .6 }),
  glass: std({ color: 0x23313d, metalness: .3, roughness: .15 }),
  door: std({ color: 0x6b4b34, roughness: .6 }),
  kerb: std({ color: 0xb8b3a9, roughness: .9 }),
  line: std({ color: 0xf2f2ee, roughness: .6 }),
  zoneOk: new THREE.MeshBasicMaterial({ color: 0x1f9d55, transparent: true, opacity: .28, depthWrite: false }),
  zoneBad: new THREE.MeshBasicMaterial({ color: 0xd61d09, transparent: true, opacity: .32, depthWrite: false }),
  pick: new THREE.MeshBasicMaterial({ color: 0xd61d09, transparent: true, opacity: .0, depthWrite: false }),
  beam: new THREE.MeshBasicMaterial({ color: 0xff2a1a, transparent: true, opacity: .75, depthWrite: false }),
  beamHead: std({ color: 0x1a1c1f, emissive: 0xff2a1a, emissiveIntensity: .6 }),
  screen: std({ color: 0x0b1726, emissive: 0x3a7bd5, emissiveIntensity: .9, roughness: .2 }),
  keys: std({ color: 0x9aa0a6, metalness: .7, roughness: .3 }),
  solar: std({ color: 0x0e2240, metalness: .5, roughness: .25, emissive: 0x0a1a33, emissiveIntensity: .3 }),
  lamp: std({ color: 0xfff3d6, emissive: 0xffd28a, emissiveIntensity: 1.4 }),
};
export const FINISHES = {
  cream: { name: "Cream render", color: 0xe9dcc3 },
  white: { name: "White render", color: 0xf1efe9 },
  grey: { name: "Grey render", color: 0x9c9d9b },
  charcoal: { name: "Charcoal render", color: 0x4b4d50 },
  brick: { name: "Face brick", tex: "brick" },
  limestone: { name: "Limestone", tex: "limestone" },
};
const pierMats = {};
function pierMat(finish, sx, sy) {
  const f = FINISHES[finish] || FINISHES.cream;
  if (!f.tex) return pierMats[finish] || (pierMats[finish] = std({ color: f.color, roughness: .92 }));
  return std({ map: tiled(f.tex, sx, sy), roughness: .95 });
}
const capMat = {};
function pierCapMat(finish) {
  const f = FINISHES[finish] || FINISHES.cream;
  const c = new THREE.Color(f.tex === "brick" ? 0xcfc6b8 : f.tex === "limestone" ? 0xe9dfc8 : f.color).multiplyScalar(.93);
  return capMat[finish] || (capMat[finish] = std({ color: c, roughness: .85 }));
}

/* ---------- geometry helpers ---------- */
const BOX = new THREE.BoxGeometry(1, 1, 1);
const CYL = new THREE.CylinderGeometry(1, 1, 1, 24);
function mesh(geo, mat, parent, shadow = true) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = shadow; m.receiveShadow = true;
  parent.add(m); return m;
}
function box(parent, mat, x0, y0, z0, x1, y1, z1, shadow) {
  const m = mesh(BOX, mat, parent, shadow);
  m.scale.set(Math.abs(x1 - x0) || 1e-4, Math.abs(y1 - y0) || 1e-4, Math.abs(z1 - z0) || 1e-4);
  m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  return m;
}
function cyl(parent, mat, r, h, x, y, z, axis = "y") {
  const m = mesh(CYL, mat, parent);
  m.scale.set(r, h, r); m.position.set(x, y, z);
  if (axis === "x") m.rotation.z = Math.PI / 2;
  if (axis === "z") m.rotation.x = Math.PI / 2;
  return m;
}
const UP = new THREE.Vector3(0, 1, 0);
function rod(m, a, b, r) {
  const d = new THREE.Vector3().subVectors(b, a), len = d.length();
  m.position.copy(a).addScaledVector(d, .5);
  m.scale.set(r, len, r);
  m.quaternion.setFromUnitVectors(UP, d.normalize());
}
function flat(parent, mat, x0, z0, x1, z1, y = 0) { // a ground strip
  const m = mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), mat, parent, false);
  m.rotation.x = -Math.PI / 2; m.position.set((x0 + x1) / 2, y, (z0 + z1) / 2);
  return m;
}

/* ---------- a panel of infill: origin at its bottom left, length along +X, centred on Z ---------- */
function leaf(Lw, Lh, style, mat) {
  const g = new THREE.Group(), f = .05, d = .05;
  const frame = () => {
    box(g, mat, 0, 0, -d / 2, Lw, f, d / 2); box(g, mat, 0, Lh - f, -d / 2, Lw, Lh, d / 2);
    box(g, mat, 0, f, -d / 2, f, Lh - f, d / 2); box(g, mat, Lw - f, f, -d / 2, Lw, Lh - f, d / 2);
  };
  if (style === "slat") {
    frame();
    for (let y = f + .012; y + .085 < Lh - f + .001; y += .105) box(g, mat, f, y, -.009, Lw - f, y + .085, .009);
  } else if (style === "picket") {
    frame();
    box(g, mat, f, Lh - .2, -.02, Lw - f, Lh - .16, .02);
    for (let x = f + .04; x + .025 < Lw - f; x += .11) box(g, mat, x, f, -.0125, x + .025, Lh - f, .0125);
  } else if (style === "palisade") {
    box(g, mat, 0, .28, -.03, Lw, .34, .01); box(g, mat, 0, Lh - .44, -.03, Lw, Lh - .38, .01);
    const tip = new THREE.Shape(); tip.moveTo(0, 0); tip.lineTo(.065, 0); tip.lineTo(.0325, .12); tip.closePath();
    const tipGeo = new THREE.ExtrudeGeometry(tip, { depth: .012, bevelEnabled: false });
    for (let x = .04; x + .065 < Lw - .02; x += .15) {
      box(g, mat, x, .05, .012, x + .065, Lh - .12, .024);
      const t = mesh(tipGeo, mat, g); t.position.set(x, Lh - .12, .012);
    }
  } else if (style === "mesh") {
    frame();
    for (let x = f + .1; x < Lw - f; x += .1) box(g, mat, x, f, -.003, x + .006, Lh - f, .003, false);
    for (let y = f + .1; y < Lh - f; y += .1) box(g, mat, f, y, .003, Lw - f, y + .006, .009, false);
  } else if (style === "batten") { // wide vertical aluminium battens with small gaps, a modern look
    frame();
    for (let x = f + .015; x + .065 < Lw - f + .001; x += .085) box(g, mat, x, f, -.012, x + .065, Lh - f, .012);
  } else { // solid sheet with pressed ribs
    frame();
    box(g, mat, f, f, -.002, Lw - f, Lh - f, .002);
    for (let y = f + .2; y < Lh - f - .05; y += .2) box(g, mat, f, y, .002, Lw - f, y + .012, .006);
  }
  return g;
}
function motorBox(g, x0, z0) {
  box(g, MAT.concretePad, x0 - .06, -.01, z0 - .06, x0 + .36, .04, z0 + .3);
  box(g, MAT.steel, x0, .04, z0, x0 + .3, .4, z0 + .24);
  box(g, MAT.steel, x0 - .01, .4, z0 - .01, x0 + .31, .43, z0 + .25);
  box(g, MAT.ledGreen, x0 + .03, .34, z0 - .005, x0 + .06, .36, z0, false);
}

/* ---------- the driveway gate in its opening: local x 0..W between the piers ---------- */
function driveGate(d, pierDepth) {
  const { type, style, W, H, auto } = d;
  const g = new THREE.Group(), mat = MAT.drive;
  const out = { group: g, animate: () => {}, zone: null };
  const back = -(pierDepth / 2 + .1);         // sliding leaves run just inside the piers
  if (type === "sliding" || type === "cantilever" || type === "telescopic") {
    const inner = new THREE.Group(); g.add(inner);
    if (d.dir === -1) { inner.scale.x = -1; inner.position.x = W; }   // slide to the left: mirror it
    if (type === "sliding") {
      const L = W + .3;
      box(inner, MAT.galv, -.3, 0, back - .03, 2 * W + .6, .022, back + .03, false);
      const lf = new THREE.Group(); inner.add(lf);
      const p = leaf(L, H - .06, style, mat); p.position.y = .06; lf.add(p);
      [.35, L - .35].forEach((x) => cyl(lf, MAT.black, .05, .03, x, .055, 0, "z"));
      lf.position.z = back;
      if (auto) { box(lf, MAT.galv, .05, .07, -.05, L - .05, .1, -.03); motorBox(inner, W + .5, back - .45); }
      out.animate = (o) => { lf.position.x = -.15 + o * (W + .1); };
      out.zone = { x0: W, x1: W + L + .2, H, z: back };
    } else if (type === "cantilever") {
      const L = W * 1.43, body = W + .2;
      const lf = new THREE.Group(); inner.add(lf);
      const front = leaf(body, H - .26, style, mat); front.position.y = .26; lf.add(front);
      box(lf, mat, 0, .1, -.04, L, .26, .04);
      box(lf, mat, body, H - .05, -.025, L, H, .025); box(lf, mat, L - .05, .26, -.025, L, H - .05, .025);
      const br = box(lf, mat, 0, 0, -.015, 1, .05, .015);
      const bx0 = body, bx1 = L - .05, by0 = .26, by1 = H - .05;
      br.scale.set(Math.hypot(bx1 - bx0, by1 - by0), .05, .03);
      br.position.set((bx0 + bx1) / 2, (by0 + by1) / 2, 0); br.rotation.z = Math.atan2(by1 - by0, bx1 - bx0);
      lf.position.z = back - .02;
      [W + .4, W + .4 + W * .32].forEach((x) => {
        box(inner, MAT.concretePad, x - .2, -.01, back - .26, x + .2, .03, back + .14, false);
        box(inner, MAT.galv, x - .12, .03, back - .14, x + .12, .1, back + .1);
      });
      if (auto) motorBox(inner, W + .7 + W * .32, back - .5);
      out.animate = (o) => { lf.position.x = -.1 + o * (W + .2); };
      out.zone = { x0: W, x1: W + L + .2, H, z: back };
    } else {
      const la = W * .56, ha = H - .06;
      box(inner, MAT.galv, -.3, 0, back - .14, 1.6 * W + .5, .022, back - .08, false);
      box(inner, MAT.galv, -.3, 0, back - .03, 1.6 * W + .5, .022, back + .03, false);
      const A = leaf(la, ha, style, MAT.driveBack), B = leaf(la, ha, style, mat);
      A.position.set(0, .06, back - .11); B.position.set(W - la, .06, back); inner.add(A, B);
      if (auto) motorBox(inner, W + .5, back - .55);
      out.animate = (o) => { A.position.x = -.05 + o * W; B.position.x = W - la + o * la; };
      out.zone = { x0: W, x1: W + la + .2, H, z: back };
    }
    if (d.dir === -1 && out.zone) out.zone = { ...out.zone, x0: -(out.zone.x1 - W), x1: 0 };
    out.zone.slide = true;
  } else { // swing or bifold, opening into the property
    const double = type === "bifold" ? d.leaves !== 1 : d.leaves === 2;
    const L = double ? W / 2 - .02 : W - .03;
    const sides = double ? [1, -1] : [d.hinge === "right" ? -1 : 1];
    const leaves = [];
    sides.forEach((s) => {
      const hinge = new THREE.Group(); hinge.position.set(s === 1 ? .01 : W - .01, .04, 0); g.add(hinge);
      const inner = new THREE.Group(); hinge.add(inner); if (s === -1) inner.scale.x = -1;
      [.25, H - .35].forEach((y) => box(inner, MAT.black, -.03, y, -.04, .05, y + .1, .04));
      const ram = auto ? cyl(g, MAT.galv, .03, 1, 0, 0, 0) : null;
      if (type === "swing") {
        inner.add(leaf(L, H - .04, style, mat));
        leaves.push({ s, hinge, ram, fold: null });
      } else {
        const half = L / 2, p1 = leaf(half - .01, H - .04, style, mat), joint = new THREE.Group(), p2 = leaf(half - .01, H - .04, style, mat);
        inner.add(p1); joint.position.x = half; inner.add(joint); joint.add(p2);
        leaves.push({ s, hinge, ram, fold: joint });
      }
    });
    out.animate = (o) => {
      const phi = o * (type === "swing" ? 1.45 : 1.35);
      leaves.forEach(({ s, hinge, ram, fold }) => {
        hinge.rotation.y = s * phi;
        if (fold) fold.rotation.y = -2 * phi;
        if (!ram) return;
        // ram arm from a bracket behind the pier to a point 0.5 m along the leaf
        const base = new THREE.Vector3(s === 1 ? -.08 : W + .08, .55, -(pierDepth / 2 + .12));
        const tip = new THREE.Vector3(.5, 0, 0); tip.x *= s; tip.applyAxisAngle(UP, s * phi);
        tip.add(new THREE.Vector3(hinge.position.x, .55, -.06));
        rod(ram, base, tip, .028);
      });
    };
    out.zone = { swing: true, r: type === "bifold" ? L / 2 + .05 : L, sides, W };
  }
  return out;
}

function pedGate(p) {
  const g = new THREE.Group(), s = p.hinge === "right" ? -1 : 1;
  const hinge = new THREE.Group(); hinge.position.set(s === 1 ? .01 : p.W - .01, .05, 0); g.add(hinge);
  const inner = new THREE.Group(); hinge.add(inner); if (s === -1) inner.scale.x = -1;
  inner.add(leaf(p.W - .03, p.H - .06, p.style, MAT.ped));
  [.2, p.H - .3].forEach((y) => box(inner, MAT.black, -.03, y, -.04, .05, y + .08, .04));
  box(inner, MAT.black, p.W - .16, 1.0, -.07, p.W - .07, 1.12, .07);      // lock box and handle
  return { group: g, animate: (o) => { hinge.rotation.y = s * o * 1.4; } };
}

/* ---------- the extras on the quote: beams, keypad, intercom, solar, lights ----------
   Each is its own group so a newly added one can drop into place. */
function extrasFor(st, ph) {
  const e = st.extras || {}, out = {};
  if (!st.drive.on) return out;
  const pw = st.pier.w, x0 = st.drive.x, W = st.drive.W, front = pw / 2;
  if (e.beams) {
    const g = new THREE.Group();
    [x0 - .07, x0 + W].forEach((x) => box(g, MAT.beamHead, x, .42, front, x + .07, .62, front + .07));
    box(g, MAT.beam, x0, .51, front + .03, x0 + W, .525, front + .045, false);
    out.beams = g;
  }
  if (e.keypad) {
    // a gooseneck post on the verge, reachable from a car window
    const g = new THREE.Group(), px = x0 - pw - .55, pz = 1.25;
    box(g, MAT.concretePad, px - .18, -.01, pz - .18, px + .18, .04, pz + .18);
    cyl(g, MAT.steel, .045, 1.15, px, .6, pz);
    rod(cyl(g, MAT.steel, .035, 1, 0, 0, 0), new THREE.Vector3(px, 1.15, pz), new THREE.Vector3(px + .38, 1.32, pz), .035);
    box(g, MAT.steel, px + .3, 1.12, pz - .06, px + .5, 1.42, pz + .06);
    box(g, MAT.keys, px + .32, 1.16, pz + .06, px + .48, 1.38, pz + .075, false);
    out.keypad = g;
  }
  if (e.intercom) {
    const g = new THREE.Group(), pier = st.ped.on ? st.ped.x - pw : x0 - pw, cx = pier + pw / 2;
    box(g, MAT.steel, cx - .1, 1.25, front, cx + .1, 1.62, front + .04);
    box(g, MAT.screen, cx - .07, 1.42, front + .04, cx + .07, 1.56, front + .05, false);
    box(g, MAT.keys, cx - .03, 1.3, front + .04, cx + .03, 1.36, front + .05, false);
    out.intercom = g;
  }
  if (e.solar) {
    const g = new THREE.Group(), px = x0 + W + pw + 1.3, pz = -1.6;
    cyl(g, MAT.galv, .04, 2.3, px, 1.15, pz);
    const panel = box(g, MAT.solar, -.45, -.02, -.32, .45, .02, .32);
    panel.position.set(px, 2.35, pz); panel.rotation.x = .55;
    out.solar = g;
  }
  if (e.lights) {
    const g = new THREE.Group();
    layout(st).piers.forEach((x) => box(g, MAT.lamp, x + pw / 2 - .07, ph + .1, -.07, x + pw / 2 + .07, ph + .26, .07, false));
    out.lights = g;
  }
  return out;
}
let seenExtras = null;
const pops = [];

/* ---------- fencing: piers along the frontage, panels between them ---------- */
export function layout(st) {
  const pw = st.pier.w, F = st.F;
  const slots = [];
  if (st.drive.on) slots.push({ id: "drive", x: st.drive.x, w: st.drive.W });
  if (st.ped.on) slots.push({ id: "ped", x: st.ped.x, w: st.ped.W });
  slots.sort((a, b) => a.x - b.x);
  const piers = [], panels = [];
  const addPier = (x0) => { if (!piers.some((q) => Math.abs(q - x0) < .02)) piers.push(x0); };
  slots.forEach((s) => { addPier(s.x - pw); addPier(s.x + s.w); });
  const fenceOn = st.fence.style !== "none";
  // the free runs of boundary between gate piers
  const occ = slots.map((s) => [s.x - pw, s.x + s.w + pw]);
  const runs = []; let a = 0;
  occ.forEach(([o0, o1]) => { if (o0 > a) runs.push([a, o0]); a = Math.max(a, o1); });
  if (a < F) runs.push([a, F]);
  if (fenceOn) runs.forEach(([r0, r1]) => {
    let x0 = r0, x1 = r1;
    if (x1 - x0 < .3) return;
    if (r0 <= .001) { addPier(0); x0 += pw; }
    if (r1 >= F - .001) { addPier(F - pw); x1 -= pw; }
    const len = x1 - x0;
    if (len < .25) return;
    const n = Math.max(1, Math.ceil((len + pw) / (st.fence.bay + pw)));
    const pl = (len - (n - 1) * pw) / n;
    for (let i = 0; i < n; i++) {
      const p0 = x0 + i * (pl + pw);
      panels.push([p0, p0 + pl]);
      if (i < n - 1) addPier(p0 + pl);
    }
  });
  piers.sort((p, q) => p - q);
  return { piers, panels, slots };
}

/* ---------- the house, the street and the ground ---------- */
function ground(g, st) {
  const F = st.F, L = -14, R = F + 14, back = -26;
  const lawn = mesh(new THREE.PlaneGeometry(R - L, -back), std({ map: tiled("grass", (R - L) / 4, -back / 4), roughness: 1 }), g, false);
  lawn.rotation.x = -Math.PI / 2; lawn.position.set((L + R) / 2, 0, back / 2);
  const verge = mesh(new THREE.PlaneGeometry(R - L, 1.6), std({ map: tiled("grass", (R - L) / 4, .4), roughness: 1 }), g, false);
  verge.rotation.x = -Math.PI / 2; verge.position.set((L + R) / 2, 0, .8);
  flat(g, std({ map: tiled("concrete", (R - L) / 1.2, 1.5 / 1.2) }), L, 1.6, R, 3.1, .004);
  flat(g, std({ map: tiled("grass", (R - L) / 4, .3), roughness: 1 }), L, 3.1, R, 4.2, 0);
  box(g, MAT.kerb, L, 0, 4.2, R, .12, 4.45, false);
  flat(g, std({ map: tiled("asphalt", (R - L) / 3, 9 / 3) }), L, 4.45, R, 16, -.02);
  for (let x = L; x < R; x += 6) flat(g, MAT.line, x, 10.1, x + 3, 10.22, -.015);
  // driveway from the road up to the house, and a path from the pedestrian gate
  const houseZ = -9;
  if (st.drive.on) {
    const x0 = st.drive.x - .2, x1 = st.drive.x + st.drive.W + .2;
    flat(g, std({ map: tiled("pavers", (x1 - x0) / 1.2, (4.45 - houseZ) / 1.2), roughness: .9 }), x0, houseZ, x1, 4.45, .008);
  }
  if (st.ped.on) {
    const x0 = st.ped.x, x1 = st.ped.x + st.ped.W;
    flat(g, std({ map: tiled("pavers", (x1 - x0) / 1.2, -houseZ / 1.2), roughness: .9 }), x0, houseZ, x1, 0, .007);
  }
}
function house(g, st) {
  const F = st.F, hw = Math.min(Math.max(F - 2, 9), 16), cx = F / 2, z0 = -9, depth = 9, hh = 3.1;
  const x0 = cx - hw / 2, x1 = cx + hw / 2;
  box(g, MAT.houseWall, x0, 0, z0 - depth, x1, hh, z0);
  box(g, MAT.houseTrim, x0 - .05, 0, z0 - .05, x1 + .05, .25, z0 + .05);
  // hipped roof
  const roof = mesh(new THREE.ConeGeometry(1, 1, 4, 1), MAT.roof, g);
  roof.rotation.y = Math.PI / 4;
  roof.scale.set((hw + 1) / Math.SQRT2 * 1.0, 2.2, (depth + 1) / Math.SQRT2);
  roof.position.set(cx, hh + 1.1, z0 - depth / 2);
  box(g, MAT.houseTrim, x0 - .5, hh - .12, z0 - depth - .5, x1 + .5, hh + .02, z0 + .5);
  // garage door lined up with the driveway gate, when it fits on the house
  const front = z0 + .01;
  let gx = st.drive.on ? st.drive.x + st.drive.W / 2 : cx - hw / 4;
  gx = Math.min(Math.max(gx, x0 + 2.8), x1 - 2.8);
  box(g, MAT.houseTrim, gx - 2.65, 0, front - .02, gx + 2.65, 2.35, front + .03);
  const door = box(g, MAT.garage, gx - 2.5, 0, front, gx + 2.5, 2.2, front + .05);
  door.castShadow = false;
  for (let y = .44; y < 2.2; y += .44) box(g, MAT.houseTrim, gx - 2.5, y - .015, front + .05, gx + 2.5, y + .015, front + .07, false);
  // front door and windows away from the garage
  const side = gx < cx ? 1 : -1, fx = gx + side * 4.2;
  if (fx > x0 + .8 && fx < x1 - .8) {
    box(g, MAT.door, fx - .5, 0, front, fx + .5, 2.1, front + .06, false);
    [fx + side * 2.2].forEach((wx) => { if (wx > x0 + 1 && wx < x1 - 1) { box(g, MAT.houseTrim, wx - 1.05, .85, front, wx + 1.05, 2.25, front + .05, false); box(g, MAT.glass, wx - .95, .95, front + .02, wx + .95, 2.15, front + .07, false); } });
  }
}

/* ---------- renderer, scene and camera ---------- */
let renderer, scene, camera, controls, sun, root, holder, labelEl;
let gates = {}, zoneGroup = null, state = null, openT = 0, openTarget = 0, onMove = null, dragHint = true;
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

export function mount(el, label, moved) {
  holder = el; labelEl = label; onMove = moved;
  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  el.appendChild(renderer.domElement);
  scene = new THREE.Scene();
  const sky = canvasTex(4, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#7fa7cf"); gr.addColorStop(.55, "#c9dbea"); gr.addColorStop(1, "#eef2f4"); g.fillStyle = gr; g.fillRect(0, 0, w, h); }, false);
  scene.background = sky;
  scene.fog = new THREE.Fog(0xe4ecf1, 38, 90);
  camera = new THREE.PerspectiveCamera(42, 1, .1, 200);
  scene.add(new THREE.HemisphereLight(0xdfe9f5, 0x8a8478, .95));
  sun = new THREE.DirectionalLight(0xfff1dc, 2.6);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -.0004; sun.shadow.normalBias = .03; sun.shadow.radius = 4;
  scene.add(sun, sun.target);
  root = new THREE.Group(); scene.add(root);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = .08;
  controls.maxPolarAngle = Math.PI / 2 - .04; controls.minDistance = 2.5; controls.maxDistance = 45;
  controls.screenSpacePanning = false;
  new ResizeObserver(resize).observe(el); resize();
  dragSetup();
  renderer.setAnimationLoop(frame);
}
function resize() {
  const w = holder.clientWidth, h = holder.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false); renderer.domElement.style.width = w + "px"; renderer.domElement.style.height = h + "px";
  camera.aspect = w / h; camera.updateProjectionMatrix();
}

export function update(st, rebuild = true) {
  state = st;
  MAT.drive.color.set(st.drive.col); MAT.driveBack.color.set(st.drive.col).multiplyScalar(.85);
  MAT.ped.color.set(st.ped.match ? st.drive.col : st.ped.col);
  MAT.fence.color.set(st.fence.match ? st.drive.col : st.fence.col);
  if (!rebuild) return;
  root.clear(); gates = {};
  const pw = st.pier.w, ph = pierHeight(st);
  ground(root, st);
  if (st.house) house(root, st);
  const L = layout(st);
  const fStyle = st.fence.match ? st.drive.style : st.fence.style, fH = st.fence.H, plinth = st.fence.plinth;
  L.panels.forEach(([x0, x1]) => {
    if (plinth > 0) box(root, pierMat(st.pier.finish, (x1 - x0) / 1.4, plinth / 1.4), x0, 0, -.1, x1, plinth, .1);
    const p = leaf(x1 - x0 - .04, fH - plinth - .04, fStyle === "none" ? "picket" : fStyle, MAT.fence);
    p.position.set(x0 + .02, plinth + .02, 0); root.add(p);
  });
  L.piers.forEach((x0) => {
    box(root, pierMat(st.pier.finish, pw / 1.4, ph / 1.4), x0, 0, -pw / 2, x0 + pw, ph, pw / 2);
    box(root, pierCapMat(st.pier.finish), x0 - .04, ph, -pw / 2 - .04, x0 + pw + .04, ph + .06, pw / 2 + .04);
    box(root, pierCapMat(st.pier.finish), x0 + .03, ph + .06, -pw / 2 + .03, x0 + pw - .03, ph + .1, pw / 2 - .03);
  });
  if (st.drive.on) {
    const d = driveGate(st.drive, pw); d.group.position.x = st.drive.x; root.add(d.group);
    gates.drive = d; addPicker(d.group, st.drive.W, st.drive.H, "drive");
  }
  if (st.ped.on) {
    const p = pedGate({ ...st.ped, style: st.ped.match ? st.drive.style : st.ped.style }); p.group.position.x = st.ped.x; root.add(p.group);
    gates.ped = p; addPicker(p.group, st.ped.W, st.ped.H, "ped");
  }
  // the room the gate needs to open, shown on the ground and against the fence
  zoneGroup = new THREE.Group(); root.add(zoneGroup);
  const z = gates.drive && gates.drive.zone;
  if (z) {
    const ok = slideOk(st);
    if (z.slide) {
      const m = mesh(new THREE.PlaneGeometry(z.x1 - z.x0, z.H), ok ? MAT.zoneOk : MAT.zoneBad, zoneGroup, false);
      m.position.set(st.drive.x + (z.x0 + z.x1) / 2, z.H / 2, z.z - .06); m.renderOrder = 5;
      const f = mesh(new THREE.PlaneGeometry(z.x1 - z.x0, .9), ok ? MAT.zoneOk : MAT.zoneBad, zoneGroup, false);
      f.rotation.x = -Math.PI / 2; f.position.set(st.drive.x + (z.x0 + z.x1) / 2, .02, z.z - .2);
    } else {
      z.sides.forEach((s) => {
        const m = mesh(new THREE.CircleGeometry(z.r, 40, s === 1 ? 0 : Math.PI / 2, Math.PI / 2), MAT.zoneOk, zoneGroup, false);
        m.rotation.x = -Math.PI / 2; m.position.set(st.drive.x + (s === 1 ? 0 : z.W), .02, 0);
      });
    }
  }
  zoneGroup.visible = !!st.showZone;
  // extras on the quote; the ones just added grow into place
  const ex = extrasFor(st, ph), now = performance.now();
  Object.entries(ex).forEach(([k, g]) => {
    root.add(g);
    if (seenExtras && !seenExtras[k]) { g.position.y = 1.6; pops.push({ g, s: now }); }
  });
  seenExtras = Object.fromEntries(Object.keys(ex).map((k) => [k, 1]));
  // sun high to the front left, so the street face of the fence is lit
  const ext = st.F / 2 + 16;
  sun.target.position.set(st.F / 2, 0, -2); sun.position.set(st.F / 2 - 8, 16, 10);
  Object.assign(sun.shadow.camera, { left: -ext, right: ext, top: ext, bottom: -ext, near: 1, far: 70 });
  sun.shadow.camera.updateProjectionMatrix();
  Object.values(gates).forEach((g) => g.animate(openT));
}
function addPicker(group, W, H, id) { // an invisible box over the gate that catches clicks and drags
  const m = box(group, MAT.pick, -.05, 0, -.4, W + .05, H + .1, .4, false);
  m.castShadow = false; m.receiveShadow = false; m.userData.pick = id;
}
export function pierHeight(st) {
  const tallest = Math.max(st.drive.on ? st.drive.H : 0, st.ped.on ? st.ped.H : 0, st.fence.style !== "none" ? st.fence.H : 0, 1);
  return st.pier.h > 0 ? Math.max(st.pier.h, tallest) : tallest + .15;
}
/* the fence line a sliding gate runs along when open, worked out from the settings alone */
export function slideNeed(st) {
  const d = st.drive, W = d.W;
  return { sliding: W + .5, cantilever: W * 1.43 + .2, telescopic: W * .56 + .2 }[d.type] || 0;
}
export function slideOk(st) {
  const need = slideNeed(st); if (!need || !st.drive.on) return true;
  const d = st.drive, a = +d.dir === -1 ? d.x - need : d.x + d.W, b = a + need;
  if (a < -.01 || b > st.F + .01) return false;
  if (st.ped.on && st.ped.x < b && st.ped.x + st.ped.W > a) return false;
  return true;
}

/* ---------- camera views ---------- */
let fly = null;
export function view(name) {
  const st = state, cx = st.drive.on ? st.drive.x + st.drive.W / 2 : st.F / 2;
  const v = {
    street: [[cx, 1.75, 11], [cx, 1.1, 0]],
    above: [[st.F / 2, 17, 9], [st.F / 2, 0, -2.5]],
    inside: [[cx + 1.5, 1.75, -7.5], [cx, 1.1, 0]],
    corner: [[st.F + 4, 4.5, 9], [st.F / 2, .8, -1]],
  }[name] || [[cx, 1.75, 11], [cx, 1.1, 0]];
  fly = { p0: camera.position.clone(), t0: controls.target.clone(), p1: new THREE.Vector3(...v[0]), t1: new THREE.Vector3(...v[1]), s: performance.now() };
}
export function jump(name) { view(name); fly.s = -1e9; }
export function setOpen(o) { openTarget = o ? 1 : 0; }
export function isOpen() { return openTarget === 1; }
export function setZone(on) { if (zoneGroup) zoneGroup.visible = on; }
export function snapshot() { frame(); return renderer.domElement.toDataURL("image/jpeg", .88); }  // draw a fresh frame first

function frame() {
  if (fly) {
    const k = Math.min(1, (performance.now() - fly.s) / 900), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    camera.position.lerpVectors(fly.p0, fly.p1, e); controls.target.lerpVectors(fly.t0, fly.t1, e);
    if (k >= 1) fly = null;
  }
  controls.update();
  if (Math.abs(openT - openTarget) > .001) {
    openT += (openTarget - openT) * .045 + Math.sign(openTarget - openT) * .004;
    openT = Math.min(1, Math.max(0, openT));
    Object.values(gates).forEach((g) => g.animate(openT));
  }
  for (let i = pops.length - 1; i >= 0; i--) {
    // drops in from above with a small bounce
    const k = Math.min(1, (performance.now() - pops[i].s) / 700);
    const b = k < .7 ? 1 - Math.pow(k / .7, 2) : Math.sin(((k - .7) / .3) * Math.PI) * .12;
    pops[i].g.position.y = 1.6 * Math.max(0, b);
    if (k >= 1) { pops[i].g.position.y = 0; pops.splice(i, 1); }
  }
  renderer.render(scene, camera);
  placeLabel();
}
function placeLabel() { // the "drag me" hint floats over the driveway gate until the first drag
  if (!labelEl) return;
  if (!dragHint || !state || !state.drive.on) { labelEl.hidden = true; return; }
  const p = new THREE.Vector3(state.drive.x + state.drive.W / 2, state.drive.H + .55, 0).project(camera);
  if (p.z > 1) { labelEl.hidden = true; return; }
  labelEl.hidden = false;
  labelEl.style.transform = `translate(${(p.x + 1) / 2 * holder.clientWidth}px,${(1 - p.y) / 2 * holder.clientHeight}px) translate(-50%,-100%)`;
}

/* ---------- drag gates along the boundary ---------- */
function hitGround(e) {
  const r = renderer.domElement.getBoundingClientRect();
  ndc.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
  ray.setFromCamera(ndc, camera);
  return ray;
}
function pickAt(e) {
  hitGround(e);
  const hits = ray.intersectObjects(root.children, true).filter((h) => h.object.userData.pick);
  return hits.length ? hits[0].object.userData.pick : null;
}
function dragSetup() {
  const el = renderer.domElement;
  let drag = null;
  el.addEventListener("pointerdown", (e) => {
    const id = pickAt(e); if (!id) return;
    const p = new THREE.Vector3(); if (!ray.ray.intersectPlane(groundPlane, p)) return;
    drag = { id, off: p.x - state[id].x, pid: e.pointerId };
    controls.enabled = false; el.setPointerCapture(e.pointerId); el.style.cursor = "grabbing";
    dragHint = false; e.preventDefault();
  });
  el.addEventListener("pointermove", (e) => {
    if (!drag) { if (e.pointerType === "mouse") el.style.cursor = pickAt(e) ? "grab" : ""; return; }
    hitGround(e);
    const p = new THREE.Vector3(); if (!ray.ray.intersectPlane(groundPlane, p)) return;
    const x = placeable(state, drag.id, p.x - drag.off);
    if (x !== null && Math.abs(x - state[drag.id].x) > .001) { state[drag.id].x = x; onMove && onMove(drag.id, x); }
  });
  const end = () => { if (!drag) return; drag = null; controls.enabled = true; el.style.cursor = ""; onMove && onMove(null); };
  el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end);
}
/* where an item can sit: inside the frontage, never through another gate. Two gates closer than a
   pier share one pier, like a driveway gate and a pedestrian gate either side of a letterbox pier. */
export function placeable(st, id, want) {
  const it = st[id], pw = st.pier.w;
  let x = Math.round(want * 20) / 20;
  x = Math.min(Math.max(x, pw), st.F - pw - it.W);
  const other = id === "drive" ? (st.ped.on ? st.ped : null) : (st.drive.on ? st.drive : null);
  if (!other) return x;
  const right = x >= other.x;                         // which side of the other gate we sit on
  const cur = it.x >= other.x;
  if (right !== cur) return null;                     // no jumping through the other gate
  // space between the two openings: one pier width means a shared pier, two or more means two piers
  const fix = (gap) => gap < pw * 1.5 ? pw : gap < pw * 2 ? pw * 2 : gap;
  if (right) x = other.x + other.W + fix(x - (other.x + other.W));
  else x = other.x - fix(other.x - (x + it.W)) - it.W;
  return Math.min(Math.max(x, pw), st.F - pw - it.W);
}
