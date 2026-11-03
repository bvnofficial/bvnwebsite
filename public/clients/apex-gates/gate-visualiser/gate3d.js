/* Apex Gate Visualiser: 3D engine.
   Real 3D gates (three.js) placed into the customer's own photo. The four corners the customer marks
   are a rectangle of known size (opening width x gate height), so we can work out where the camera
   stood and how wide its lens was, then render the gate from exactly that viewpoint.
   World units are metres: X across the opening (0 = left post), Y up, Z towards the street (property is -Z). */
import * as THREE from "three";

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(1);
renderer.setClearColor(0x000000, 0);
const pmrem = new THREE.PMREMGenerator(renderer);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 1, 0.05, 300);
const hemi = new THREE.HemisphereLight(0xdfe9f5, 0x8a8478, 0.7);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.bias = -0.0005;
sun.shadow.normalBias = 0.02;
sun.shadow.radius = 5;
scene.add(hemi, sun, sun.target);

/* ---------- materials ---------- */
const std = (o) => new THREE.MeshStandardMaterial({ envMapIntensity: .9, ...o });
const MAT = {
  paint: std({ color: 0x34383d, metalness: .35, roughness: .48 }),
  paintBack: std({ color: 0x34383d, metalness: .35, roughness: .48 }),
  bollard: std({ color: 0xa9aeb3, metalness: .75, roughness: .28 }),
  galv: std({ color: 0xa7acb1, metalness: .85, roughness: .36 }),
  steel: std({ color: 0x2a2d31, metalness: .45, roughness: .5 }),
  black: std({ color: 0x17191c, metalness: .1, roughness: .75 }),
  concrete: std({ color: 0xbdb8ae, metalness: 0, roughness: .95 }),
  red: std({ color: 0xc2210f, metalness: .1, roughness: .42 }),
  white: std({ color: 0xf2f2ee, metalness: .1, roughness: .42 }),
  reflect: std({ color: 0xf2c230, metalness: .2, roughness: .25 }),
  amber: std({ color: 0x5a3a00, emissive: 0xffa000, emissiveIntensity: 0, roughness: .3 }),
  lamp: std({ color: 0xd9d4c8, emissive: 0xffd28a, emissiveIntensity: 0, roughness: .35 }),
  ledGreen: std({ color: 0x0c3a1c, emissive: 0x35d07f, emissiveIntensity: 1.2 }),
  ledRed: std({ color: 0x3a0c0c, emissive: 0xff3b2f, emissiveIntensity: 1.2 }),
  keypad: std({ color: 0x9aa0a6, metalness: .8, roughness: .3 }),
  glass: std({ color: 0x0f1a24, metalness: .2, roughness: .1 }),
  // invisible: writes depth only, so the real wall and ground in the photo hide what is behind or below them
  occ: new THREE.MeshBasicMaterial({ colorWrite: false }),
  wallShow: std({ color: 0xe6ddcb, roughness: .9 }),
  groundShow: std({ color: 0xd8d6d0, roughness: 1 }),
  zoneOk: new THREE.MeshBasicMaterial({ color: 0x1f9d55, transparent: true, opacity: .32, depthTest: false, depthWrite: false }),
  zoneBad: new THREE.MeshBasicMaterial({ color: 0xd61d09, transparent: true, opacity: .32, depthTest: false, depthWrite: false }),
};

const BOX = new THREE.BoxGeometry(1, 1, 1);
const CYL = new THREE.CylinderGeometry(1, 1, 1, 28);
function mesh(geo, mat, parent, shadow = true) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = shadow; m.receiveShadow = shadow;
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
// a cylinder between two points (for ram arms)
const UP = new THREE.Vector3(0, 1, 0);
function rod(m, a, b, r) {
  const d = new THREE.Vector3().subVectors(b, a), len = d.length();
  m.position.copy(a).addScaledVector(d, .5);
  m.scale.set(r, len, r);
  m.quaternion.setFromUnitVectors(UP, d.normalize());
}

/* ---------- a gate leaf: origin at its bottom left, length along +X, centred on Z ---------- */
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
    box(g, mat, f, Lh / 2 - .02, -.02, Lw - f, Lh / 2 + .02, .02);
    for (let x = f + .04; x + .025 < Lw - f; x += .11) box(g, mat, x, f, -.0125, x + .025, Lh - f, .0125);
  } else if (style === "palisade") {
    box(g, mat, 0, .28, -.03, Lw, .34, .01); box(g, mat, 0, Lh - .44, -.03, Lw, Lh - .38, .01);
    const tip = new THREE.Shape(); tip.moveTo(0, 0); tip.lineTo(.065, 0); tip.lineTo(.0325, .12); tip.closePath();
    const tipGeo = new THREE.ExtrudeGeometry(tip, { depth: .012, bevelEnabled: false });
    for (let x = .04; x + .065 < Lw - .02; x += .15) {
      box(g, mat, x, .05, .012, x + .065, Lh - .12, .024);
      box(g, mat, x + .02, .05, .006, x + .045, Lh - .12, .012);           // the folded middle of the pale
      const t = mesh(tipGeo, mat, g); t.position.set(x, Lh - .12, .012);
    }
  } else if (style === "mesh") {
    frame();
    for (let x = f + .1; x < Lw - f; x += .1) box(g, mat, x, f, -.003, x + .006, Lh - f, .003);
    for (let y = f + .1; y < Lh - f; y += .1) box(g, mat, f, y, .003, Lw - f, y + .006, .009);
  } else { // solid sheet with pressed ribs
    frame();
    box(g, mat, f, f, -.002, Lw - f, Lh - f, .002);
    for (let y = f + .2; y < Lh - f - .05; y += .2) box(g, mat, f, y, .002, Lw - f, y + .012, .006);
  }
  return g;
}

/* ---------- each gate type: build once, then animate(o) moves it (o = 0 closed, 1 open) ---------- */
function posts(g, W, Hm) {
  box(g, MAT.steel, -.1, 0, -.12, 0, Hm + .1, -.02); box(g, MAT.steel, -.11, Hm + .1, -.13, .01, Hm + .12, -.01);
  box(g, MAT.steel, W, 0, -.12, W + .1, Hm + .1, -.02); box(g, MAT.steel, W - .01, Hm + .1, -.13, W + .11, Hm + .12, -.01);
}
function motorBox(g, x0, z0) {
  box(g, MAT.concrete, x0 - .06, -.02, z0 - .06, x0 + .36, .04, z0 + .3);
  box(g, MAT.steel, x0, .04, z0, x0 + .3, .4, z0 + .24);
  box(g, MAT.steel, x0 - .01, .4, z0 - .01, x0 + .31, .43, z0 + .25);
  box(g, MAT.ledGreen, x0 + .03, .34, z0 + .241, x0 + .06, .36, z0 + .245, false);
}

function build(cfg) {
  const { type, style, W, Hm, extras } = cfg;
  const g = new THREE.Group();
  const out = { group: g, animate: () => {}, zone: null, parts: [], beacon: null, lamps: [] };
  const paint = MAT.paint;

  if (type === "sliding") {
    const L = W + .3, travel = W + .1;
    box(g, MAT.galv, -.3, 0, -.25, 2 * W + .6, .022, -.19);                    // ground track
    const lf = new THREE.Group(); g.add(lf);
    lf.add(leaf(L, Hm - .06, style, paint)); lf.children[0].position.set(0, .06, 0);
    box(lf, MAT.galv, .05, .07, -.05, L - .05, .1, -.03);                         // gear rack
    [.35, L - .35].forEach((x) => { cyl(lf, MAT.black, .05, .03, x, .055, 0, "z"); });
    lf.position.z = -.22;
    posts(g, W, Hm);
    box(g, MAT.steel, W + .18, 0, -.42, W + .24, Hm, -.36);                    // guide post
    motorBox(g, W + .45, -.62);
    out.animate = (o) => { lf.position.x = -.15 + o * travel; };
    out.zone = { x0: W + .12, x1: W + L + .25, need: L + .25, kind: "slide", H: Hm };
    out.parts = [["Gate leaf", `${L.toFixed(2)} m x ${Hm.toFixed(2)} m on a ground track`], ["Track", `${(2 * W + .9).toFixed(1)} m galvanised track`],
      ["Motor", "Sliding gate motor on a concrete pad, gear rack on the gate"], ["Posts", "2 steel posts, 1 guide post"]];
  } else if (type === "cantilever") {
    const L = W * 1.43, body = W + .2, travel = W + .2;
    const lf = new THREE.Group(); g.add(lf);
    const front = leaf(body, Hm - .26, style, paint); front.position.set(0, .26, 0); lf.add(front);
    box(lf, paint, 0, .1, -.04, L, .26, .04);                                     // bottom beam that rides the rollers
    box(lf, paint, body, Hm - .05, -.025, L, Hm, .025); box(lf, paint, L - .05, .26, -.025, L, Hm - .05, .025);
    const br = box(lf, paint, 0, 0, -.015, 1, .05, .015);                         // tail brace
    const bx0 = body, bx1 = L - .05, by0 = .26, by1 = Hm - .05;
    br.scale.set(Math.hypot(bx1 - bx0, by1 - by0), .05, .03);
    br.position.set((bx0 + bx1) / 2, (by0 + by1) / 2, 0); br.rotation.z = Math.atan2(by1 - by0, bx1 - bx0);
    lf.position.z = -.24;
    [W + .3, W + .3 + W * .32].forEach((x) => {
      box(g, MAT.concrete, x - .2, -.02, -.5, x + .2, .03, .0);
      box(g, MAT.galv, x - .12, .03, -.36, x + .12, .1, -.12);
      [-.07, .07].forEach((dx) => cyl(g, MAT.black, .045, .06, x + dx, .1, -.24, "z"));
    });
    posts(g, W, Hm);
    motorBox(g, W + .62 + W * .32, -.7);
    out.animate = (o) => { lf.position.x = -.1 + o * travel; };
    out.zone = { x0: W + .12, x1: W + L + .25, need: L + .25, kind: "slide", H: Hm };
    out.parts = [["Gate leaf", `${L.toFixed(2)} m long (opening plus counterweight tail), ${Hm.toFixed(2)} m high`],
      ["Rollers", "2 roller carriages on concrete footings, no track across the driveway"], ["Motor", "Cantilever gate motor on a concrete pad"], ["Posts", "2 steel posts"]];
  } else if (type === "telescopic") {
    const la = W * .56, ha = Hm - .06;
    box(g, MAT.galv, -.3, 0, -.36, 1.6 * W + .5, .022, -.3);
    box(g, MAT.galv, -.3, 0, -.25, 1.6 * W + .5, .022, -.19);
    const A = leaf(la, ha, style, MAT.paintBack), B = leaf(la, ha, style, paint);
    A.position.set(0, .06, -.33); B.position.set(W - la, .06, -.22); g.add(A, B);
    posts(g, W, Hm);
    motorBox(g, W + .5, -.75);
    out.animate = (o) => { A.position.x = -.05 + o * W; B.position.x = W - la + o * la; };
    out.zone = { x0: W + .12, x1: W + la + .25, need: la + .25, kind: "slide", H: Hm };
    out.parts = [["Gate leaves", `2 leaves, ${la.toFixed(2)} m x ${ha.toFixed(2)} m each, stacking as they open`], ["Track", "Twin galvanised tracks"],
      ["Motor", "Telescopic sliding gate motor with a synchronising cable"], ["Posts", "2 steel posts"]];
  } else if (type === "swing" || type === "bifold") {
    posts(g, W, Hm);
    const double = W > 3.5 || type === "bifold";
    const L = double ? W / 2 - .02 : W - .03, sides = double ? [1, -1] : [cfg.dir === -1 ? -1 : 1];
    const leaves = [];
    sides.forEach((s) => {
      const hinge = new THREE.Group(); hinge.position.set(s === 1 ? 0 : W, .04, -.07); g.add(hinge);
      const inner = new THREE.Group(); hinge.add(inner); if (s === -1) inner.scale.x = -1;
      const ram = cyl(g, MAT.galv, .03, 1, 0, 0, 0);
      [.25, Hm - .35].forEach((y) => box(inner, MAT.black, -.03, y, -.04, .05, y + .1, .04));
      if (type === "swing") {
        inner.add(leaf(L, Hm - .04, style, paint));
        leaves.push({ s, hinge, ram, fold: null });
      } else {
        const half = L / 2, p1 = leaf(half - .01, Hm - .04, style, paint), joint = new THREE.Group(), p2 = leaf(half - .01, Hm - .04, style, paint);
        inner.add(p1); joint.position.x = half; inner.add(joint); joint.add(p2);
        leaves.push({ s, hinge, ram, fold: joint });
      }
    });
    if (extras.safety) motorBox(g, -.55, -.75);
    out.animate = (o) => {
      const phi = o * (type === "swing" ? 1.45 : 1.35);
      leaves.forEach(({ s, hinge, ram, fold }) => {
        hinge.rotation.y = s * phi;
        if (fold) fold.rotation.y = -2 * phi;
        // ram arm from a bracket on the post to a point 0.5 m along the leaf
        const base = new THREE.Vector3(s === 1 ? -.05 : W + .05, .55, -.38);
        const tip = new THREE.Vector3(.5, .51, 0); tip.x *= s; tip.applyAxisAngle(UP, s * phi);
        tip.add(new THREE.Vector3(hinge.position.x, 0, -.07)).setY(.55);
        rod(ram, base, tip, .028);
      });
    };
    out.zone = { r: type === "bifold" ? L / 2 : L, sides, W, kind: "swing", need: type === "bifold" ? L / 2 : L };
    out.parts = [["Gate leaves", `${double ? "2 leaves" : "1 leaf"}${type === "bifold" ? " folding in half" : ""}, ${(type === "bifold" ? L / 2 : L).toFixed(2)} m per ${type === "bifold" ? "panel" : "leaf"}, ${(Hm - .04).toFixed(2)} m high`],
      ["Motors", `${sides.length} ${type === "bifold" ? "bi-fold" : "swing"} gate ram${sides.length > 1 ? "s" : ""}`], ["Hinges", `${sides.length * 2} heavy duty hinges`], ["Posts", "2 steel posts"]];
  } else if (type === "boom") {
    box(g, MAT.concrete, -.02, -.02, -.25, .49, .03, .22);
    box(g, paint, .05, .03, -.2, .42, 1.03, .17);
    box(g, paint, .04, 1.03, -.21, .43, 1.07, .18);
    box(g, MAT.black, .12, .86, .171, .35, .95, .175, false);
    const light = box(g, MAT.ledRed, .17, .885, .176, .3, .925, .18, false);
    const arm = new THREE.Group(); arm.position.set(.235, .93, .23); g.add(arm);
    const len = W - .3, seg = .45;
    for (let s = 0; s < len; s += seg) cyl(arm, Math.round(s / seg) % 2 ? MAT.red : MAT.white, .045, Math.min(seg, len - s), s + Math.min(seg, len - s) / 2, 0, 0, "x");
    cyl(arm, MAT.black, .05, .06, len + .03, 0, 0, "x");
    box(arm, MAT.steel, -.14, -.08, -.03, .14, .08, .03);
    box(g, MAT.steel, W - .2, 0, .19, W - .12, .82, .27);
    box(g, MAT.steel, W - .26, .82, .19, W - .06, .86, .27);
    out.animate = (o) => { arm.rotation.z = o * 1.52; light.material = o > .97 ? MAT.ledGreen : MAT.ledRed; };
    out.parts = [["Boom", `${len.toFixed(1)} m boom arm with red and white reflective bands`], ["Cabinet", "Boom gate cabinet on a concrete pad, with traffic light"], ["Rest post", "Boom rest post with fork"]];
  } else if (type === "bollards") {
    const n = Math.max(2, Math.round(W / 1.4) + 1), r = .135, span = W - .5;
    const ringGeo = new THREE.RingGeometry(r + .004, r + .075, 40);
    const bs = [];
    for (let i = 0; i < n; i++) {
      const cx = .25 + span * (n === 1 ? .5 : i / (n - 1));
      const ring = mesh(ringGeo, MAT.galv, g); ring.rotation.x = -Math.PI / 2; ring.position.set(cx, .004, 0); ring.castShadow = false;
      const b = new THREE.Group(); b.position.set(cx, 0, 0); g.add(b);
      cyl(b, MAT.bollard, r, .95, 0, -.475, 0);
      cyl(b, MAT.reflect, r + .002, .08, 0, -.16, 0);
      cyl(b, MAT.bollard, r * .98, .012, 0, .006, 0);
      const ledGeo = new THREE.TorusGeometry(r * .78, .012, 8, 40);
      const led = mesh(ledGeo, MAT.amber, b, false); led.rotation.x = Math.PI / 2; led.position.y = .013;
      bs.push(b);
    }
    out.animate = (o) => { const top = .95 * (1 - o * .99); bs.forEach((b) => { b.position.y = top; }); };
    out.parts = [["Bollards", `${n} automatic rising bollards, 273 mm diameter, 950 mm high`], ["Control", "Hydraulic power unit and control cabinet"]];
  }

  // extras on gates with posts
  const panel = !["boom", "bollards"].includes(type);
  if (panel && extras.safety) {
    [[-.02, 1], [W + .02, -1]].forEach(([x, s]) => box(g, MAT.black, x - .03 * s, .45, -.16, x + .02 * s, .55, -.12));
    const bx = W + .05;
    const dome = mesh(new THREE.SphereGeometry(.07, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), MAT.amber, g, false);
    dome.position.set(bx, Hm + .12, -.07);
    box(g, MAT.black, bx - .06, Hm + .12, -.13, bx + .06, Hm + .135, -.01);
    out.beacon = MAT.amber;
    out.parts.push(["Safety", "Photo electric safety beams and a flashing warning light"]);
  }
  if (panel && extras.keypad) {
    const x = W - .35, z = 1.6;
    box(g, MAT.concrete, x - .15, -.02, z - .15, x + .15, .03, z + .15);
    box(g, MAT.steel, x - .04, .03, z - .04, x + .04, 1.15, z + .04);
    box(g, MAT.keypad, x - .09, 1.05, z - .03, x + .09, 1.3, z + .07);
    box(g, MAT.glass, x - .06, 1.15, z + .071, x + .06, 1.26, z + .075, false);
    out.parts.push(["Access", "Keypad and intercom post at driver height"]);
  }
  if (panel && extras.lights) {
    [-.05, W + .05].forEach((x) => {
      box(g, MAT.black, x - .07, Hm + .12, -.14, x + .07, Hm + .14, 0);
      box(g, MAT.lamp, x - .055, Hm + .14, -.125, x + .055, Hm + .32, -.015, false);
      box(g, MAT.black, x - .075, Hm + .32, -.145, x + .075, Hm + .35, .005);
      const pl = new THREE.PointLight(0xffc77a, 0, 6, 1.6); pl.position.set(x, Hm + .23, .1); g.add(pl);
      out.lamps.push(pl);
    });
    out.parts.push(["Lighting", "2 post top lights"]);
  }
  out.parts.push(["Colour", cfg.colourName]);
  if (panel && cfg.style) out.parts.splice(1, 0, ["Infill", cfg.styleName]);
  return out;
}

/* ---------- the slide back or swing area, drawn on the ground on top of everything ---------- */
function zoneMesh(z, ok) {
  const mat = ok ? MAT.zoneOk : MAT.zoneBad;
  const g = new THREE.Group();
  if (z.kind === "slide") {
    // a see through panel where the open gate will sit, shown over the wall
    const m = mesh(new THREE.PlaneGeometry(z.x1 - z.x0, z.H), mat, g, false);
    m.position.set((z.x0 + z.x1) / 2, z.H / 2, -.22); m.renderOrder = 10;
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), new THREE.LineBasicMaterial({ color: ok ? 0x1f9d55 : 0xd61d09, depthTest: false, transparent: true }));
    edge.position.copy(m.position); edge.renderOrder = 11; g.add(edge);
  } else {
    // a quarter circle inside the property at each hinge (the plane's +Y becomes -Z once laid flat)
    z.sides.forEach((s) => {
      const m = mesh(new THREE.CircleGeometry(z.r, 40, s === 1 ? 0 : Math.PI / 2, Math.PI / 2), mat, g, false);
      m.rotation.x = -Math.PI / 2; m.renderOrder = 10;
      m.position.set(s === 1 ? 0 : z.W, .01, -.07);
    });
  }
  return g;
}

/* ---------- scene state ---------- */
const root = new THREE.Group(); scene.add(root);
const fixed = new THREE.Group(); scene.add(fixed);
let built = null, builtKey = "", zone = null;

const groundOcc = box(fixed, MAT.occ, -60, -6, -60, 60, 0, 60, false); groundOcc.renderOrder = -10;
const walls = new THREE.Group(); fixed.add(walls);
const shadowGround = mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShadowMaterial({ opacity: .45 }), fixed, false);
shadowGround.rotation.x = -Math.PI / 2; shadowGround.receiveShadow = true; shadowGround.position.y = .002;
const showGround = mesh(new THREE.CircleGeometry(1, 64), MAT.groundShow, fixed, false);
showGround.rotation.x = -Math.PI / 2; showGround.receiveShadow = true; showGround.position.y = -.001;

function sync(cfg) {
  const key = JSON.stringify([cfg.type, cfg.style, cfg.W, cfg.Hm, cfg.dir, cfg.extras, cfg.wall, cfg.colourName, cfg.space]);
  MAT.paint.color.set(cfg.col);
  MAT.paintBack.color.set(cfg.col).multiplyScalar(.82);
  MAT.bollard.color.set(cfg.col);
  if (key === builtKey) return;
  builtKey = key;
  if (built) root.remove(built.group);
  built = build(cfg);
  root.add(built.group);
  // mirror gates that open to the left
  root.scale.x = cfg.dir === -1 && cfg.type !== "swing" ? -1 : 1;
  root.position.x = root.scale.x === -1 ? cfg.W : 0;
  if (cfg.type === "swing" || cfg.type === "bifold") { root.scale.x = 1; root.position.x = 0; }
  if (zone) root.remove(zone);
  zone = null;
  if (built.zone) {
    const need = built.zone.need, W = cfg.W;
    const room = { long: W * 1.6, full: W * 1.05, half: W * .55 }[cfg.space] || .6;
    built.zoneOk = built.zone.kind === "swing" ? true : need <= room + .35;
    built.zoneNeed = need;
    zone = zoneMesh(built.zone, built.zoneOk); root.add(zone);
  }
  // walls each side of the opening (hide a sliding gate as it runs behind them)
  walls.clear();
  const wl = [box(walls, MAT.occ, cfg.W + .12, 0, -.12, cfg.W * 3.8 + 2, cfg.Hm + .05, .06, false), box(walls, MAT.occ, -cfg.W * 2.8 - 2, 0, -.12, -.12, cfg.Hm + .05, .06, false)];
  wl.forEach((w) => { w.renderOrder = -9; });
  walls.visible = cfg.wall !== "open";
  const S = cfg.W * 3 + 30;
  shadowGround.scale.set(S, S, 1); shadowGround.position.x = cfg.W / 2;
  // sun high and to the front left, so the street face of the gate is lit and its shadow falls into the property
  sun.target.position.set(cfg.W / 2, 0, 0);
  sun.position.set(cfg.W / 2 - 4, 9, 5);
  const ext = cfg.W * 1.8 + 4;
  Object.assign(sun.shadow.camera, { left: -ext, right: ext, top: ext, bottom: -ext, near: .5, far: 40 });
  sun.shadow.camera.updateProjectionMatrix();
}

function pose(cfg, t, opts) {
  built.animate(t);
  const moving = t > .001 && t < .999;
  const blink = moving && Math.floor(performance.now() / 350) % 2 === 0;
  MAT.amber.emissiveIntensity = cfg.type === "bollards" ? 1.6 : built.beacon ? (blink ? 3 : .05) : 0;
  MAT.lamp.emissiveIntensity = opts.night ? 2.2 : 0;
  built.lamps.forEach((l) => { l.intensity = opts.night ? 4 : 0; });
  if (zone) zone.visible = !!opts.zone;
}

/* ---------- light from the photo ---------- */
let envFor = null, envTex = null;
function useEnvironment(img) {
  if (envFor === img) return;
  envFor = img;
  if (envTex) envTex.dispose();
  envTex = null;
  if (!img) { scene.environment = null; return; }
  const tex = new THREE.CanvasTexture(img); tex.mapping = THREE.EquirectangularReflectionMapping; tex.colorSpace = THREE.SRGBColorSpace;
  envTex = pmrem.fromEquirectangular(tex).texture; tex.dispose();
  scene.environment = envTex;
}
function lightFrom(light, night) {
  const k = light ? Math.min(1.25, Math.max(.35, light.lum / .55)) : 1;
  sun.intensity = night ? .05 : 2.4 * k;
  hemi.intensity = night ? .06 : .75 * k;
  if (light) hemi.groundColor.setRGB(light.r / 255, light.g / 255, light.b / 255, THREE.SRGBColorSpace);
  renderer.toneMappingExposure = night ? .9 : 1.05;
}

/* ---------- camera from the four corners ---------- */
function solve3(A, b) { // Gaussian elimination, A is n x n
  const n = b.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    if (Math.abs(M[c][c]) < 1e-12) return null;
    for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  return M.map((r, i) => r[n] / r[i]);
}
function rodrigues(w) {
  const th = Math.hypot(w[0], w[1], w[2]);
  if (th < 1e-12) return [1, 0, 0, 0, 1, 0, 0, 0, 1];
  const [x, y, z] = w.map((v) => v / th), c = Math.cos(th), s = Math.sin(th), C = 1 - c;
  return [c + x * x * C, x * y * C - z * s, x * z * C + y * s, y * x * C + z * s, c + y * y * C, y * z * C - x * s, z * x * C - y * s, z * y * C + x * s, c + z * z * C];
}
const mul3 = (A, B) => { const R = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) R.push(A[i * 3] * B[j] + A[i * 3 + 1] * B[3 + j] + A[i * 3 + 2] * B[6 + j]); return R; };

function solveCamera(P, w, h, W, Hm) {
  // homography from the opening (metres) to pixels
  const A = [], b = [], X = [[0, 0], [W, 0], [W, Hm], [0, Hm]];
  X.forEach(([x, y], i) => {
    const [u, v] = P[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
  });
  const hv = solve3(A, b); if (!hv) return null;
  const Hm3 = [hv[0], hv[1], hv[2], hv[3], hv[4], hv[5], hv[6], hv[7], 1];
  const cx = w / 2, cy = h / 2, S = Math.max(w, h);
  const col = (j) => [Hm3[j] - cx * Hm3[6 + j], Hm3[3 + j] - cy * Hm3[6 + j], Hm3[6 + j]];
  const h1 = col(0), h2 = col(1), h3 = col(2);
  let f0 = .8 * S;
  const den = h1[2] * h2[2];
  if (Math.abs(den) > 1e-12) { const f2 = -(h1[0] * h2[0] + h1[1] * h2[1]) / den; if (f2 > 0) f0 = Math.min(2.2 * S, Math.max(.55 * S, Math.sqrt(f2))); }
  const init = (f) => {
    const kb = (v) => [v[0] / f, v[1] / f, v[2]];
    let r1 = kb(h1), r2 = kb(h2), t = kb(h3);
    let lam = 2 / (Math.hypot(...r1) + Math.hypot(...r2));
    if (t[2] * lam < 0) lam = -lam;
    r1 = r1.map((v) => v * lam); r2 = r2.map((v) => v * lam); t = t.map((v) => v * lam);
    const n1 = Math.hypot(...r1); r1 = r1.map((v) => v / n1);
    const d = r1[0] * r2[0] + r1[1] * r2[1] + r1[2] * r2[2]; r2 = r2.map((v, i) => v - d * r1[i]);
    const n2 = Math.hypot(...r2); r2 = r2.map((v) => v / n2);
    const r3 = [r1[1] * r2[2] - r1[2] * r2[1], r1[2] * r2[0] - r1[0] * r2[2], r1[0] * r2[1] - r1[1] * r2[0]];
    return { R: [r1[0], r2[0], r3[0], r1[1], r2[1], r3[1], r1[2], r2[2], r3[2]], t };
  };
  const { R: R0, t: t0 } = init(f0);
  const W3 = X.map(([x, y]) => [x, y, 0]);
  const unpack = (p) => ({ f: f0 * Math.exp(p[0]), R: mul3(rodrigues([p[1], p[2], p[3]]), R0), t: [t0[0] + p[4], t0[1] + p[5], t0[2] + p[6]] });
  const resid = (p) => {
    const { f, R, t } = unpack(p), r = [];
    W3.forEach((Xw, i) => {
      const x = R[0] * Xw[0] + R[1] * Xw[1] + R[2] * Xw[2] + t[0], y = R[3] * Xw[0] + R[4] * Xw[1] + R[5] * Xw[2] + t[1], z = R[6] * Xw[0] + R[7] * Xw[1] + R[8] * Xw[2] + t[2];
      r.push(cx + f * x / z - P[i][0], cy + f * y / z - P[i][1]);
    });
    r.push(p[0] * S * .03);   // gentle pull towards the first lens guess, so a front on photo stays sensible
    return r;
  };
  let p = [0, 0, 0, 0, 0, 0, 0], mu = 1e-3, r = resid(p), cost = r.reduce((s, v) => s + v * v, 0);
  for (let it = 0; it < 80; it++) {
    const J = r.map(() => []);
    for (let k = 0; k < 7; k++) { const q = p.slice(); q[k] += 1e-6; const rq = resid(q); rq.forEach((v, i) => { J[i][k] = (v - r[i]) / 1e-6; }); }
    const JtJ = [...Array(7)].map((_, a) => [...Array(7)].map((_, c) => J.reduce((s, row) => s + row[a] * row[c], 0)));
    const Jtr = [...Array(7)].map((_, a) => J.reduce((s, row, i) => s + row[a] * r[i], 0));
    let improved = false;
    for (let tries = 0; tries < 8 && !improved; tries++) {
      const A2 = JtJ.map((row, a) => row.map((v, c) => v + (a === c ? mu * (v + 1e-9) : 0)));
      const d = solve3(A2, Jtr.map((v) => -v)); if (!d) { mu *= 10; continue; }
      const q = p.map((v, i) => v + d[i]), rq = resid(q), cq = rq.reduce((s, v) => s + v * v, 0);
      if (cq < cost) { p = q; r = rq; cost = cq; mu = Math.max(1e-7, mu / 4); improved = true; } else mu *= 8;
    }
    if (!improved || cost < 1e-4) break;
  }
  const sol = unpack(p);
  return { ...sol, cx, cy };
}

const camFor = { key: "", sol: null };
function placeCamera(P, w, h, W, Hm) {
  const key = JSON.stringify([P.map((p) => p.map((v) => Math.round(v * 10))), w, h, W, Hm]);
  if (camFor.key !== key) { camFor.key = key; camFor.sol = solveCamera(P, w, h, W, Hm); }
  const s = camFor.sol; if (!s) return false;
  const { f, R, t } = s;
  const C = new THREE.Vector3(-(R[0] * t[0] + R[3] * t[1] + R[6] * t[2]), -(R[1] * t[0] + R[4] * t[1] + R[7] * t[2]), -(R[2] * t[0] + R[5] * t[1] + R[8] * t[2]));
  const xA = new THREE.Vector3(R[0], R[1], R[2]), yA = new THREE.Vector3(-R[3], -R[4], -R[5]), zA = new THREE.Vector3(-R[6], -R[7], -R[8]);
  camera.position.copy(C);
  camera.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(xA, yA, zA));
  camera.fov = 2 * Math.atan(h / 2 / f) * 180 / Math.PI;
  camera.aspect = w / h;
  camera.near = .05; camera.far = 300;
  camera.updateProjectionMatrix();
  return true;
}

function sizeTo(ctx, w, h) {
  const k = ctx.getTransform().a || 1;
  let pw = Math.round(w * k), ph = Math.round(h * k);
  const cap = 2048 / Math.max(pw, ph); if (cap < 1) { pw = Math.round(pw * cap); ph = Math.round(ph * cap); }
  const c = renderer.domElement;
  if (c.width !== pw || c.height !== ph) renderer.setSize(pw, ph, false);
}

/* gate drawn into the photo. P = the four corners in canvas units (w x h) */
function draw(ctx, w, h, P, cfg, t, opts = {}) {
  sync(cfg);
  if (!placeCamera(P, w, h, cfg.W, cfg.Hm)) return false;
  useEnvironment(opts.photo || null);
  lightFrom(opts.light, opts.night);
  pose(cfg, t, opts);
  walls.visible = cfg.wall !== "open"; walls.children.forEach((m) => { m.material = MAT.occ; });
  groundOcc.visible = true; showGround.visible = false; shadowGround.visible = true;
  renderer.setClearColor(0x000000, 0);
  sizeTo(ctx, w, h);
  renderer.render(scene, camera);
  ctx.drawImage(renderer.domElement, 0, 0, w, h);
  return true;
}

/* free 3D view, turned by the customer */
function drawOrbit(ctx, w, h, cfg, t, yaw, pitch, opts = {}) {
  sync(cfg);
  useEnvironment(opts.photo || null);
  lightFrom(null, opts.night);
  pose(cfg, t, opts);
  const W = cfg.W, slide = ["sliding", "cantilever", "telescopic"].includes(cfg.type);
  const target = new THREE.Vector3(W / 2 + (slide ? W * (opts.thumb ? .2 : .3) * (cfg.dir === -1 ? -1 : 1) : 0), cfg.Hm * .4, -.3);
  const R = (opts.thumb ? W * 1.3 + 1 : W * 2 + 3) * Math.max(1, 1.5 / (w / h));
  camera.position.set(target.x + R * Math.sin(yaw) * Math.cos(pitch), target.y + R * Math.sin(pitch), target.z + R * Math.cos(yaw) * Math.cos(pitch));
  camera.fov = 38; camera.aspect = w / h; camera.near = .05; camera.far = 300; camera.updateProjectionMatrix();
  camera.lookAt(target);
  walls.visible = cfg.wall !== "open"; walls.children.forEach((m) => { m.material = MAT.wallShow; });
  groundOcc.visible = false; shadowGround.visible = false; showGround.visible = true;
  showGround.scale.set(R * 2.2, R * 2.2, 1); showGround.position.set(target.x, -.001, 0);
  renderer.setClearColor(opts.night ? 0x0b1220 : 0xe9ecef, 1);
  sizeTo(ctx, w, h);
  renderer.render(scene, camera);
  ctx.drawImage(renderer.domElement, 0, 0, w, h);
  renderer.setClearColor(0x000000, 0);
  return true;
}

function thumb(cfg, w = 240, h = 150) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const t = cfg.type === "bollards" ? 0 : cfg.type === "boom" ? .08 : .3;
  drawOrbit(c.getContext("2d"), w, h, { ...cfg, extras: {}, wall: "open" }, t, -.45, .2, { thumb: true });
  return c.toDataURL("image/jpeg", .82);
}

function info() { return built ? { parts: built.parts, zoneOk: built.zoneOk, zoneNeed: built.zoneNeed, zone: built.zone } : null; }

window.Gate3D = { draw, drawOrbit, thumb, info };
window.dispatchEvent(new Event("gate3d-ready"));
