/* Apex Quote, the easy version. One screen: the gate picture in the middle,
   picture tiles to change it, and the price drawn so anyone can read it.
   It uses the same engine, price book and saved jobs as the full tool. */
import { PRICEBOOK, TEMPLATES, VERSION } from "./data.js";
import { runItem, priceQuote, defaults, money, fmtNum, byId } from "./engine.js";
import { drawItem, steelColour } from "./draw.js";
import { buildTemplates, mergePricebook, offered } from "./shared.js";

const KEY = "apexq.v1";
const $ = (s, el = document) => el.querySelector(s);
const clone = (o) => JSON.parse(JSON.stringify(o));
const uid = () => Math.random().toString(36).slice(2, 10);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const dateStr = (t) => new Date(t).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

/* ---------- saved on this device, shared with the full tool ---------- */
function newQuote(d) {
  return { id: uid(), no: `Q-${d.nextNo++}`, created: Date.now(), updated: Date.now(), status: "draft",
    client: { name: "", phone: "", email: "", address: "" }, tech: d.lastTech || "", notes: "", discount: 0,
    items: [], sel: null, showPrices: true, showDrawings: true, signature: null };
}
function fresh() {
  const d = { v: VERSION, pb: clone(PRICEBOOK), templates: clone(TEMPLATES), quotes: [], nextNo: 1001, current: null, pbUpdated: Date.now(), lastTech: "" };
  const q = newQuote(d); d.quotes.push(q); d.current = q.id; return d;
}
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY));
    if (d && d.pb && d.templates) {
      for (const t of TEMPLATES) if (!d.templates.find((x) => x.id === t.id)) d.templates.push(clone(t));
      for (const k of Object.keys(PRICEBOOK.settings)) if (!(k in d.pb.settings)) d.pb.settings[k] = PRICEBOOK.settings[k];
      if (!d.quotes.length) { const q = newQuote(d); d.quotes.push(q); d.current = q.id; }
      return d;
    }
  } catch (e) { /* start fresh */ }
  return fresh();
}
let db = load();
let saveT;
function save() {
  const q = Q(); if (q) q.updated = Date.now();
  clearTimeout(saveT);
  saveT = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { say("Could not save on this device"); } }, 200);
}
const Q = () => db.quotes.find((q) => q.id === db.current) || db.quotes[0];
/* the office's shared prices and gate types, loaded from the server */
let TPLS = [];
const rebuild = () => { db.gates = db.gates || { custom: [], hidden: [] }; TPLS = buildTemplates(db.templates, db.pb, db.gates); };
rebuild();
const tplOf = (id) => TPLS.find((t) => t.id === id);
const price = (q = Q()) => priceQuote(q, TPLS, db.pb);
const sync = { state: "loading", at: 0 };
async function pull() {
  try {
    const r = await fetch("data.json", { cache: "no-store", credentials: "same-origin" });
    const j = await r.json();
    sync.office = !!j.office;
    if (j.data && j.data.pb) {
      if (j.data.updated !== db.serverUpdated) {
        db.pb = mergePricebook(j.data.pb, PRICEBOOK); db.gates = j.data.gates || { custom: [], hidden: [] }; db.serverUpdated = j.data.updated;
        rebuild(); save();
      }
      sync.state = "ok"; sync.at = j.data.updated;
    } else sync.state = j.ok ? "none" : "off";
  } catch (e) { sync.state = "off"; }
  if (!document.querySelector("input:focus, textarea:focus")) redraw();
}
function say(t) { const el = $("#saved"); el.textContent = t; el.classList.add("on"); clearTimeout(el.t); el.t = setTimeout(() => el.classList.remove("on"), 2200); }

/* ---------- pictures ---------- */
const I = (p, w = 1.9) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const ICON = {
  arrow: I('<path d="M5 12h14M13 6l6 6-6 6"/>', 2.6),
  plus: I('<path d="M12 5v14M5 12h14"/>', 2.6), minus: I('<path d="M5 12h14"/>', 2.6), tick: I('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 3),
  gate: I('<path d="M3 20V5M21 20V5M3 7h8.5v12H3M12.5 7H21v12h-8.5M6 7v12M9 7v12M15 7v12M18 7v12"/>'),
  ruler: I('<path d="M3 16l13-13 5 5-13 13zM7 12l2 2M10 9l2 2M13 6l2 2"/>'),
  look: I('<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M8 4v16M12 4v16M16 4v16"/>'),
  post: I('<path d="M2 20h20M7 4h4v16H7zM6 4h6M15 9h3v11h-3"/>'),
  motor: I('<rect x="3" y="7" width="13" height="10" rx="2"/><path d="M16 12h5M7 11h5M7 14h3M20 9v6"/>'),
  paint: I('<path d="M4 4h13v5H4zM17 6.5h3v5h-8v3M11 14.5h2v6h-2z"/>'),
  remote: I('<rect x="7" y="2" width="10" height="20" rx="3"/><circle cx="12" cy="8" r="2"/><path d="M10 13h4M10 16h4"/>'),
  keypad: I('<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 7h.01M12 7h.01M15 7h.01M9 11h.01M12 11h.01M15 11h.01M9 15h.01M12 15h.01M15 15h.01"/>', 2.6),
  eye: I('<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
  sun: I('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  battery: I('<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 10v4M7 10v4M11 10v4"/>'),
  phone: I('<rect x="4" y="3" width="16" height="18" rx="2"/><rect x="7" y="6" width="10" height="7" rx="1"/><path d="M9 17h6"/>'),
  car: I('<path d="M4 16V11l2-5h12l2 5v5M3 16h18v3H3zM7 19v1M17 19v1M6 11h12"/>'),
  truck: I('<path d="M2 6h11v10H2zM13 9h4l4 4v3h-8M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>'),
  bin: I('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
  copy: I('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>'),
  doc: I('<path d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6"/>'),
  print: I('<path d="M6 9V3h12v6M6 18H4v-7h16v7h-2M7 14h10v7H7z"/>'),
  pen: I('<path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4"/>'),
  list: I('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>', 2.4),
  tag: I('<path d="M3 12V3h9l9 9-9 9zM7.5 7.5h.01"/>', 2.2),
  steel: I('<path d="M3 8h18v3H3zM3 14h18v3H3z"/>'),
  bolt: I('<path d="M12 3l3 2v4l-3 2-3-2V5zM12 11v10M9 15h6M9 18h6"/>'),
  hand: I('<path d="M7 11V5a1.5 1.5 0 0 1 3 0v5M10 10V3.5a1.5 1.5 0 0 1 3 0V10M13 10V4.5a1.5 1.5 0 0 1 3 0V11M16 11V7a1.5 1.5 0 0 1 3 0v7c0 4-3 7-7 7h-1c-3 0-4.5-1.6-6-4l-2.5-4a1.5 1.5 0 0 1 2.5-1.5L7 14"/>'),
  worker: I('<circle cx="12" cy="7" r="3"/><path d="M5 21v-3a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v3M8 5.5h8"/>'),
  coins: I('<ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v4c0 1.7 2.7 3 6 3s6-1.3 6-3V7M9 14v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4c0-1.7-2.7-3-6-3"/>'),
  scale: I('<path d="M12 4v16M6 20h12M5 8h14M5 8l-3 6a3 3 0 0 0 6 0zM19 8l-3 6a3 3 0 0 0 6 0z"/>'),
  warn: I('<path d="M12 3l10 18H2zM12 10v5M12 18h.01"/>', 2.2),
  user: I('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
  folder: I('<path d="M3 6h6l2 2h10v11H3z"/>'),
  fence: I('<path d="M2 20h20M4 20V5M12 20V5M20 20V5M4 9h16M4 16h16M7 9v7M9.5 9v7M14.5 9v7M17 9v7"/>'),
  site: I('<path d="M3 18h18M5 18V9l4-3 4 3v9M15 18v-6h4v6M8 12h2"/>'),
  other: I('<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/>'),
};
const TYPE_ICON = { auto: ICON.motor, site: ICON.truck, custom: ICON.other };

/* plain words for each kind of thing */
const NAMES = {
  swing: ["Swing gate", "Opens like a door"], slide: ["Sliding gate", "Rolls along a track"], cant: ["Cantilever gate", "Slides with no track on the ground"],
  bifold: ["Bifold gate", "Folds in half as it opens"], ped: ["Walk through gate", "Small gate for people"], fence: ["Fence", "Panels between posts"],
  posts: ["Posts only", "Just the posts"], auto: ["Motor and remotes", "For a gate already there"], site: ["Travel and site work", "Travel, removal, crane, bins"],
  custom: ["Something else", "Type your own line"],
};
const WORDS = {
  L: { swing: { 1: ["One gate", ""], 2: ["Two gates", "Meet in the middle"] }, bifold: { 1: ["One side folds", ""], 2: ["Both sides fold", ""] } },
  infill: { picket: ["Pickets", "Upright bars"], slat: ["Slats", "Flat boards across"], palisade: ["Palisade", "Pointed tops"], mesh: ["Mesh", "Wire squares"], sheet: ["Solid", "No gaps at all"] },
  dir: { left: ["Opens to the left", ""], right: ["Opens to the right", ""] },
  postMat: { post100: ["100 mm post", "Standard"], post125: ["125 mm post", "Strong"], post150: ["150 mm post", "Extra strong"] },
  mount: { ground: ["Set in concrete", "Dug into the ground"], plate: ["Bolted down", "Plate on a slab"] },
  auto: { linear: ["Arm motors", "On the back of the gate"], under: ["Underground motors", "Hidden in the ground"], bifold: ["Bifold motors", "Fold it open"], none: ["No motor", "Opens by hand"] },
  motor: {
    none: ["No motor", "Opens by hand"], m_slide600: ["Motor up to 600 kg", "Light gates"], m_slide1000: ["Motor up to 1,000 kg", "Most gates"],
    m_slide2000: ["Motor up to 2,000 kg", "Heavy and commercial"], m_linear1: ["Arm motor, one gate", ""], m_linear2: ["Arm motors, two gates", ""],
    m_under2: ["Underground, two gates", ""], m_bifold: ["Bifold motor", ""],
  },
  finish: { powder: ["Powder coat", "Painted colour"], galv: ["Galvanised", "Silver, no paint"], duplex: ["Galvanised and painted", "Best for the coast"], none: ["Raw steel", "No finish"] },
  ends: { 1: ["Ends on piers", "Brick or rendered piers"], 0: ["Ends on posts", "Steel posts at each end"] },
};
const COLOURS = ["Monument", "Black", "Basalt", "Woodland Grey", "Ironstone", "Deep Ocean", "Wallaby", "Windspray", "Shale Grey", "Dune", "Surfmist", "Classic Cream", "Paperbark", "Jasper", "Manor Red", "Pale Eucalypt", "White"];

/* what shows on screen for each kind of thing; anything not listed sits in "Workshop details" */
const W_GATE = [2400, 3000, 3600, 4000, 4500, 5000, 6000];
const H_ALL = [1200, 1500, 1800, 2000, 2100];
const MOTOR_EXTRAS = { t: "ticks", when: (e) => e.on, list: [["eyes", "Safety eyes", "Stops the gate if a car is in the way", "eye"], ["keypad", "Keypad", "Open with a code", "keypad"], ["solar", "Solar power", "No power at the gate", "sun"], ["battery", "Battery backup", "Works in a power cut", "battery"]], count: ["remotes", "Remotes", "How many remotes", "remote"] };
const POSTS_SEC = (labels) => ["Posts", "post", "What holds the gate up", [
  { t: "counts", list: labels },
  { t: "pick", k: "postMat", label: "How strong", pic: "postsize" },
  { t: "pick", k: "mount", label: "How they are fixed", pic: "mount" },
]];
const COLOUR_SEC = ["Colour", "paint", "What it looks like when it is done", [{ t: "pick", k: "finish", label: "Finish", pic: "finish" }, { t: "colour" }]];
const LOOK_SEC = ["Look", "look", "What goes inside the frame", [{ t: "pick", k: "infill", pic: "infill" }]];
const LAYOUT = {
  swing: [
    ["Size", "ruler", "Measure between the piers or posts", [{ t: "nums", list: [["W", "Width", W_GATE], ["H", "Height", H_ALL]] }, { t: "pick", k: "L", label: "One gate or two", pic: "draw" }]],
    LOOK_SEC, POSTS_SEC([["posts", "Hinge posts", "The gate hangs on these"], ["catchPosts", "Catch posts", "The gate locks onto this"]]),
    ["Motor", "motor", "Does it open by itself", [{ t: "pick", k: "auto", pic: "draw" }, MOTOR_EXTRAS]], COLOUR_SEC,
  ],
  slide: [
    ["Size", "ruler", "Measure between the piers", [{ t: "nums", list: [["W", "Width", W_GATE], ["H", "Height", H_ALL]] }, { t: "pick", k: "dir", label: "Which way it opens (standing on the street)", pic: "dir" }]],
    LOOK_SEC, POSTS_SEC([["posts", "Support posts behind the piers", "Next to the motor"], ["catchPosts", "Catch posts", "The gate closes onto this"], ["guides", "Roller guides", "Keep the gate upright"], ["catchBr", "Catch brackets", "Hold the gate when closed"]]),
    ["Motor", "motor", "Pick a motor strong enough for the gate", [{ t: "pick", k: "motor", pic: "motor" }, MOTOR_EXTRAS]], COLOUR_SEC,
  ],
  cant: [
    ["Size", "ruler", "Measure between the piers", [{ t: "nums", list: [["W", "Width", [4000, 5000, 6000, 7000, 8000]], ["H", "Height", H_ALL]] }, { t: "pick", k: "dir", label: "Which way it opens (standing on the street)", pic: "dir" }]],
    LOOK_SEC, POSTS_SEC([["posts", "Posts for the rollers", "Behind the piers, next to the motor"], ["catchPosts", "Catch posts", "The gate closes onto this"], ["guides", "Roller guides", "Keep the gate upright"], ["catchBr", "Catch brackets", "Hold the gate when closed"]]),
    ["Motor", "motor", "Pick a motor strong enough for the gate", [{ t: "pick", k: "motor", pic: "motor" }, MOTOR_EXTRAS]], COLOUR_SEC,
  ],
  bifold: [
    ["Size", "ruler", "Measure between the piers or posts", [{ t: "nums", list: [["W", "Width", W_GATE], ["H", "Height", H_ALL]] }, { t: "pick", k: "L", label: "How it folds", pic: "draw" }]],
    LOOK_SEC, POSTS_SEC([["posts", "Hinge posts", "The gate hangs on these"], ["catchPosts", "Catch posts", ""]]),
    ["Motor", "motor", "Does it open by itself", [{ t: "pick", k: "auto", pic: "draw" }, MOTOR_EXTRAS]], COLOUR_SEC,
  ],
  ped: [
    ["Size", "ruler", "Measure the gap", [{ t: "nums", list: [["W", "Width", [900, 1000, 1200]], ["H", "Height", H_ALL]] }]],
    LOOK_SEC, POSTS_SEC([["posts", "Hinge posts", "The gate hangs on this"], ["catchPosts", "Catch posts", "The gate locks onto this"]]), COLOUR_SEC,
  ],
  fence: [
    ["Size", "ruler", "Pier height is from the ground. Put 0 for the wall if there is none", [{ t: "nums", list: [["Len", "Length", [5000, 10000, 15000, 20000, 30000]], ["pierH", "Pier height", [1200, 1500, 1800, 2000]], ["wallH", "Wall height", [0, 300, 450, 600]]] }, { t: "pick", k: "ends", label: "How the ends finish", pic: "draw" }]],
    LOOK_SEC, ["Posts", "post", "What holds the panels up", [{ t: "pick", k: "postMat", label: "How strong", pic: "postsize" }, { t: "pick", k: "mount", label: "How they are fixed", pic: "mount" }]], COLOUR_SEC,
  ],
  posts: [
    ["Posts", "post", "How many and how tall", [{ t: "counts", list: [["qty", "How many posts", ""]] }, { t: "nums", list: [["above", "Height above ground", [1200, 1500, 1800, 2000]]] }, { t: "pick", k: "postMat", label: "How strong", pic: "postsize" }, { t: "pick", k: "mount", label: "How they are fixed", pic: "mount" }]],
    COLOUR_SEC,
  ],
  auto: [
    ["Motor", "motor", "For a gate that is already there", [{ t: "pick", k: "motor", pic: "motor" }]],
    ["Extras", "remote", "Tick what they want", [{ t: "ticks", list: [["eyes", "Safety eyes", "Stops the gate if a car is in the way", "eye"], ["keypad", "Keypad", "Open with a code", "keypad"], ["intercom", "Video intercom", "See who is at the gate", "phone"], ["solar", "Solar power", "No power at the gate", "sun"], ["battery", "Battery backup", "Works in a power cut", "battery"], ["loop", "Car sensor", "Opens when a car drives up", "car"]], count: ["remotes", "Remotes", "How many remotes", "remote"] }]],
    ["Time", "worker", "How long to fit it", [{ t: "nums", list: [["hrs", "Hours", [1, 2, 3, 4, 6]]] }]],
  ],
  site: [
    ["Travel and site work", "truck", "Anything extra on the day", [
      { t: "nums", list: [["km", "Travel there and back", [0, 20, 50, 100, 200]], ["remove", "Taking out the old gate", [0, 1, 2, 4]], ["elec", "Electrician", [0, 1, 2, 4]]] },
      { t: "ticks", list: [["crane", "Crane truck", "For heavy gates", "truck"], ["skip", "Skip bin", "For rubbish", "bin"]] },
    ]],
  ],
  custom: [
    ["Your own line", "other", "Anything not listed", [{ t: "text", k: "text", label: "What is it" }, { t: "nums", list: [["unit", "Our cost for one", [50, 100, 250, 500]], ["qty", "How many", [1, 2, 5, 10]]] }, { t: "pick", k: "cat", label: "What kind of cost", pic: "none" }]],
  ],
};
const UNIT = { km: "km", remove: "hours", elec: "hours", hrs: "hours", unit: "dollars", qty: "" };

/* ---------- ui state ---------- */
const ui = { view: "home", tab: 0, shelf: "steel", find: "" };

function item() { const q = Q(); return q.items.find((i) => i.id === q.sel) || q.items[0]; }
function run(it) { const t = tplOf(it.tpl); return t ? runItem(t, it.values, db.pb) : null; }
const namesOf = (t) => NAMES[t.id] || [t.name, t.blurb || ""];
const nameOf = (it) => it.name || (tplOf(it.tpl) ? namesOf(tplOf(it.tpl))[0] : "Item");
/* the tabs for a thing: its base layout, plus the office's extras on gates */
function layoutOf(t) {
  const secs = (LAYOUT[t.base || t.id] || []).slice();
  const ex = t.kind === "gate" ? offered(db.pb) : [];
  if (ex.length) secs.push(["Extras", "plus", "Anything else for this gate", [{ t: "counts", list: ex.map((h) => [`x_${h.id}`, h.name, h.note || money(h.cost) + " each, before markup"]) }]]);
  return secs;
}

function render() {
  if (ui.view === "job" && !Q().items.length) ui.view = "pick";
  const navOn = { home: "home", jobs: "jobs", prices: "prices" }[ui.view];
  document.querySelectorAll(".nav button").forEach((b) => b.classList.toggle("on", b.dataset.view === navOn));
  const m = $("#main");
  if (ui.view === "home") m.innerHTML = viewHome();
  if (ui.view === "pick") m.innerHTML = viewPick();
  if (ui.view === "job") m.innerHTML = viewJob();
  if (ui.view === "quote") m.innerHTML = viewQuote();
  if (ui.view === "jobs") m.innerHTML = viewJobs();
  if (ui.view === "prices") m.innerHTML = viewPrices();
  const dock = $("#dock");
  dock.innerHTML = ui.view === "job" ? `<div class="in"><button class="btn ghost" data-act="view" data-v="pick">${ICON.plus}Add another</button><button class="btn red" data-act="view" data-v="quote">Show the quote ${ICON.arrow}</button></div>` : "";
  dock.classList.toggle("hide", ui.view !== "job");
  scrollFix();
}
let keepY = null;
function scrollFix() { if (keepY !== null) { window.scrollTo(0, keepY); keepY = null; } }
function redraw() { keepY = window.scrollY; render(); }

/* ---------- home ---------- */
function viewHome() {
  const recent = [...db.quotes].filter((q) => q.items.length).sort((a, b) => b.updated - a.updated).slice(0, 3);
  return `<h1 class="big-t">What do you want to do?</h1>
  <div class="homegrid">
    <button class="hometile red" data-act="newjob">${ICON.plus}<b>New quote</b><span>Draw up a gate or fence and get the price</span></button>
    <button class="hometile" data-act="view" data-v="jobs">${ICON.folder}<b>My quotes</b><span>Open one you already started</span></button>
    <button class="hometile" data-act="view" data-v="prices">${ICON.tag}<b>Prices</b><span>Change what steel, motors and labour cost</span></button>
  </div>
  ${recent.length ? `<h2 class="sub-t">Carry on where you left off</h2><div class="jobs">${recent.map((q) => `<button class="card recent" data-act="open" data-id="${q.id}"><span class="rp">${thumb(q.items[0])}</span><span class="rt"><b>${esc(q.client.name || "No name yet")}</b><small>${q.items.map(nameOf).join(", ")}</small></span><span class="amt">${money(price(q).inc)}</span></button>`).join("")}</div>` : ""}`;
}

/* ---------- pick what to add ---------- */
function viewPick() {
  const q = Q();
  return `<h1 class="big-t">What are we quoting?</h1><p class="hello" style="margin-top:-8px">Tap a picture.</p>${typeGrid()}
  ${q.items.length ? `<button class="btn ghost wide" style="margin-top:18px" data-act="view" data-v="job">Go back</button>` : ""}`;
}

/* ---------- the gate screen ---------- */
function thumb(it) {
  const t = tplOf(it.tpl), r = run(it);
  if (t && t.draw !== "none" && r) return drawItem(t, r, db.pb);
  return `<span style="display:block;width:56px;margin:auto;color:#3a3b40">${TYPE_ICON[it.tpl] || ICON.other}</span>`;
}
function viewJob() {
  const q = Q(), P = price(q), it = item();
  const t = tplOf(it.tpl), r = run(it), l = P.lines.find((x) => x.id === it.id);
  const gst = 1 + db.pb.settings.gst / 100;
  const secs = layoutOf(t);
  if (ui.tab >= secs.length) ui.tab = 0;
  const others = q.items.length > 1 ? `<div class="onquote"><span>On this quote:</span>${q.items.map((x) => `<button class="${x.id === it.id ? "on" : ""}" data-act="sel" data-id="${x.id}">${esc(nameOf(x))}</button>`).join("")}</div>` : "";
  const keep = l ? l.sell - l.costTotal : 0;
  return `${others}
  <div class="titlerow"><h1>${esc(nameOf(it))}</h1><button class="linkbtn" data-act="del">${ICON.bin}Take it off</button></div>
  <div class="board">
    <div class="grid">${t.draw !== "none" ? drawItem(t, r, db.pb) : `<div class="nopic">${TYPE_ICON[it.tpl] || ICON.other}</div>`}</div>
    <div class="pricebar"><div><small>Price for the customer, with GST</small><b>${l ? money(l.sell * gst) : "$0"}</b></div>
      ${l && l.sell ? `<div class="makes">${ICON.coins}<span>Apex makes<b>${money(keep)}</b></span></div>` : ""}</div>
    ${r.warnings.length ? `<div class="warn" style="margin:0 16px 16px">${ICON.warn}<div><b>Check this</b><ul>${r.warnings.map((w) => `<li>${esc(w)}</li>`).join("")}</ul></div></div>` : ""}
    ${l && l.sell ? `<details class="where" ${ui.where ? "open" : ""}><summary>Where does the money go?</summary>${moneyPic(l.cost, l.sell)}</details>` : ""}
  </div>
  ${secs.length > 1 ? `<div class="tabs">${secs.map((s, i) => `<button class="${i === ui.tab ? "on" : ""}" data-act="tab" data-i="${i}">${ICON[s[1]] || ""}<b>${s[0]}</b></button>`).join("")}</div>` : ""}
  ${secs[ui.tab] ? section(secs[ui.tab], t, it, r) : ""}
  ${secs.length > 1 && ui.tab < secs.length - 1 ? `<button class="btn dark wide" style="margin-top:16px" data-act="tab" data-i="${ui.tab + 1}">Next: ${secs[ui.tab + 1][0]} ${ICON.arrow}</button>` : ""}`;
}

/* where the money goes, as one bar */
const SLICES = [["materials", "Steel", "steel", "#55575d"], ["hardware", "Gate parts", "bolt", "#9a958a"], ["motors", "Motor and remotes", "motor", "#24466e"], ["labour", "Our team's time", "worker", "#e8a33a"], ["finish", "Paint or galvanising", "paint", "#7a5ea8"], ["other", "Other", "other", "#c9c2b2"]];
function moneyPic(cost, sell) {
  const parts = SLICES.map(([k, label, ic, col]) => ({ label, ic, col, v: cost[k] || 0 })).filter((p) => p.v > 0.5);
  const costTotal = parts.reduce((a, p) => a + p.v, 0), ours = Math.max(0, sell - costTotal), all = costTotal + ours || 1;
  const pct = (v) => ((v / all) * 100).toFixed(2);
  return `<div class="mpic"><div class="mbar" role="img" aria-label="Where the money goes">${parts.map((p) => `<i style="width:${pct(p.v)}%;background:${p.col}"></i>`).join("")}<i style="width:${pct(ours)}%;background:var(--ok)"></i></div>
    <div class="mleg">${parts.map((p) => `<div>${ICON[p.ic]}<em style="background:${p.col}"></em><span>${p.label}</span><b>${money(p.v)}</b></div>`).join("")}
      <div class="ours">${ICON.coins}<em style="background:var(--ok)"></em><span>Apex makes</span><b>${money(ours)}</b></div></div><p class="rule">All before GST</p></div>`;
}

/* ---------- picture tiles ---------- */
function picFor(kind, t, it, k, v, label) {
  if (kind === "draw" && t.draw !== "none") return drawItem(t, runItem(t, { ...it.values, [k]: v }, db.pb), db.pb);
  if (kind === "infill") {
    const c = steelColour(it.values.colour || "Monument"), fr = `<rect x="6" y="6" width="108" height="78" fill="none" stroke="${c}" stroke-width="8"/>`;
    let s = "";
    if (v === "picket") for (let i = 0; i < 8; i++) s += `<rect x="${16 + i * 12.5}" y="10" width="6" height="70" fill="${c}"/>`;
    if (v === "palisade") for (let i = 0; i < 8; i++) s += `<rect x="${16 + i * 12.5}" y="2" width="6" height="78" fill="${c}"/><path d="M${16 + i * 12.5} 2l3-6 3 6z" fill="${c}"/>`;
    if (v === "slat") for (let i = 0; i < 6; i++) s += `<rect x="10" y="${14 + i * 11.5}" width="100" height="7" fill="${c}"/>`;
    if (v === "mesh") { for (let i = 1; i < 10; i++) s += `<path d="M${10 + i * 10} 10V80" stroke="${c}" stroke-width="1.6"/>`; for (let i = 1; i < 7; i++) s += `<path d="M10 ${10 + i * 10}H110" stroke="${c}" stroke-width="1.6"/>`; }
    if (v === "sheet") s += `<rect x="10" y="10" width="100" height="70" fill="${c}" opacity=".85"/>`;
    return `<svg viewBox="0 -8 120 98">${s}${fr}</svg>`;
  }
  if (kind === "dir") {
    const left = v === "left", ax = left ? 30 : 90, tip = left ? 8 : 112;
    return `<svg viewBox="0 0 120 90"><rect x="0" y="74" width="120" height="3" fill="#6e6a60"/><rect x="${left ? 46 : 14}" y="28" width="60" height="42" fill="#3a3b40"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="${(left ? 50 : 18) + i * 11}" y="32" width="6" height="34" fill="#fbf8f1"/>`).join("")}<path d="M${ax + (left ? 34 : -34)} 16H${tip}" stroke="#d61d09" stroke-width="6" stroke-linecap="round"/><path d="M${tip + (left ? 12 : -12)} 6L${tip} 16l${left ? 12 : -12} 10" stroke="#d61d09" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  if (kind === "postsize") { const s = { post100: 34, post125: 44, post150: 56 }[v] || 34; return `<svg viewBox="0 0 120 90"><rect x="${60 - s / 2}" y="${45 - s / 2}" width="${s}" height="${s}" fill="#3a3b40"/><rect x="${60 - s / 2 + 5}" y="${45 - s / 2 + 5}" width="${s - 10}" height="${s - 10}" fill="#fbf8f1"/></svg>`; }
  if (kind === "mount") return v === "ground"
    ? `<svg viewBox="0 0 120 90"><rect x="0" y="50" width="120" height="40" fill="#d8ccb2"/><rect x="40" y="52" width="40" height="34" fill="#a9a59b"/><rect x="53" y="6" width="14" height="76" fill="#3a3b40"/><line x1="0" y1="50" x2="120" y2="50" stroke="#6e6a60" stroke-width="3"/></svg>`
    : `<svg viewBox="0 0 120 90"><rect x="0" y="60" width="120" height="30" fill="#bdb7aa"/><rect x="36" y="54" width="48" height="6" fill="#3a3b40"/><rect x="53" y="6" width="14" height="50" fill="#3a3b40"/><circle cx="42" cy="57" r="3" fill="#d61d09"/><circle cx="78" cy="57" r="3" fill="#d61d09"/></svg>`;
  if (kind === "motor") {
    if (v === "none") return `<div style="width:64px;color:#3a3b40">${ICON.hand}</div>`;
    const kg = { m_slide600: "600", m_slide1000: "1,000", m_slide2000: "2,000" }[v];
    return `<svg viewBox="0 0 120 90"><rect x="22" y="14" width="76" height="62" rx="10" fill="#d61d09"/><rect x="34" y="58" width="52" height="8" rx="4" fill="#fff" opacity=".6"/>${kg ? `<text x="60" y="44" text-anchor="middle" fill="#fff" font-family="Archivo,sans-serif" font-weight="800" font-size="${kg.length > 3 ? 18 : 22}">${kg} kg</text>` : ""}</svg>`;
  }
  if (kind === "finish") {
    const c = steelColour(it.values.colour || "Monument");
    const f = { powder: `<rect width="120" height="90" fill="${c}"/>`, galv: `<rect width="120" height="90" fill="#b9bcbf"/><path d="M0 20 Q30 10 60 25 T120 18M0 55 Q40 45 70 60 T120 50" stroke="#d6d9db" stroke-width="6" fill="none"/>`,
      duplex: `<rect width="120" height="90" fill="#b9bcbf"/><rect x="0" y="0" width="70" height="90" fill="${c}"/>`, none: `<rect width="120" height="90" fill="#5b4a3e"/><circle cx="30" cy="30" r="8" fill="#7a5a43"/><circle cx="80" cy="60" r="11" fill="#7a5a43"/>` }[v] || "";
    return `<svg viewBox="0 0 120 90" style="border-radius:8px">${f}</svg>`;
  }
  return "";
}
function section([title, ic, hint, fields], t, it, r) {
  const env = r.env;
  const body = fields.map((f) => {
    if (f.when && !f.when(env)) return "";
    if (f.t === "pick") {
      const inp = t.inputs.find((i) => i.k === f.k); if (!inp) return "";
      const cur = it.values[f.k] ?? inp.def;
      const opts = inp.opts || (inp.type === "bool" ? [[1, "Yes"], [0, "No"]] : []);
      const tiles = opts.map(([v, lab]) => {
        const w = (WORDS[f.k]?.[t.base || t.id] || WORDS[f.k])?.[v] || [lab, ""];
        const pic = f.pic === "none" ? "" : picFor(f.pic, t, it, f.k, v);
        return `<button class="pick ${pic ? "" : "textonly"} ${cur == v ? "on" : ""}" data-act="set" data-k="${f.k}" data-v="${esc(v)}" data-num="${typeof inp.def === "number" ? 1 : 0}">${pic ? `<div class="pp">${pic}</div>` : ""}<b>${esc(w[0])}</b>${w[1] ? `<small>${esc(w[1])}</small>` : ""}</button>`;
      }).join("");
      const lbl = f.pic === "motor" && env.kg ? `This gate weighs about ${fmtNum(env.kg)} kg. Pick a motor bigger than that` : f.label;
      return `${lbl ? `<p class="lbl">${lbl}</p>` : ""}<div class="picks sm">${tiles}</div>`;
    }
    if (f.t === "nums") {
      return `<div class="nums">${f.list.map(([k, label, quick]) => {
        const inp = t.inputs.find((i) => i.k === k); if (!inp) return "";
        const v = +(it.values[k] ?? inp.def), u = UNIT[k] ?? "mm", step = inp.step || (u === "mm" ? 100 : u === "hours" ? 0.5 : 1);
        const bigStep = u === "mm" ? 100 : step;
        const metres = u === "mm" && v >= 1000 ? `<em> = ${(v / 1000).toLocaleString("en-AU", { maximumFractionDigits: 2 })} metres</em>` : "";
        return `<div class="nb"><b>${label}</b><div class="numrow"><button data-act="bump" data-k="${k}" data-d="${-bigStep}" aria-label="Less">${ICON.minus}</button>
          <input data-num="${k}" inputmode="decimal" value="${v}" aria-label="${label}"><button data-act="bump" data-k="${k}" data-d="${bigStep}" aria-label="More">${ICON.plus}</button></div>
          <div class="unit">${u === "dollars" ? "dollars, before GST" : metres ? `millimetres, that is ${(v / 1000).toLocaleString("en-AU", { maximumFractionDigits: 2 })} metres` : u === "mm" ? "millimetres" : u}</div>
          ${quick ? `<div class="quick">${quick.map((x) => `<button class="${x === v ? "on" : ""}" data-act="set" data-k="${k}" data-v="${x}" data-num="1">${u === "mm" && x >= 1000 ? (x / 1000).toLocaleString("en-AU") + " m" : fmtNum(x)}</button>`).join("")}</div>` : ""}</div>`;
      }).join("")}</div>`;
    }
    if (f.t === "counts") {
      return `<div class="counts" style="margin-bottom:6px">${f.list.map(([k, label, help]) => countRow(t, it, k, label, help)).join("")}</div>`;
    }
    if (f.t === "ticks") {
      return `<div class="ticks" style="margin-top:14px">${f.count ? countRow(t, it, f.count[0], f.count[1], f.count[2], f.count[3]) : ""}${f.list.map(([k, label, help, ico]) => {
        const on = !!+(it.values[k] ?? t.inputs.find((i) => i.k === k)?.def);
        return `<button class="tick ${on ? "on" : ""}" data-act="tog" data-k="${k}"><span class="bx">${ICON.tick}</span><span><b>${label}</b><small>${help}</small></span><span class="ti">${ICON[ico] || ""}</span></button>`;
      }).join("")}</div>`;
    }
    if (f.t === "colour") {
      const fin = it.values.finish ?? "powder"; if (fin === "galv" || fin === "none") return "";
      const cur = String(it.values.colour ?? "Monument").toLowerCase();
      return `<p class="lbl">Colour</p><div class="swatches">${COLOURS.map((c) => `<button class="sw ${cur === c.toLowerCase() ? "on" : ""}" data-act="set" data-k="colour" data-v="${c}"><i style="background:${steelColour(c)}"></i>${c}</button>`).join("")}</div>`;
    }
    if (f.t === "text") return `<div class="fld" style="margin-bottom:12px"><label>${f.label}</label><input data-txt="${f.k}" value="${esc(it.values[f.k] ?? "")}"></div>`;
    return "";
  }).join("");
  return `<section class="card sec"><p class="hint">${hint}</p>${body}</section>`;
}
function countRow(t, it, k, label, help, ico) {
  const inp = t.inputs.find((i) => i.k === k); if (!inp) return "";
  const v = +(it.values[k] ?? inp.def);
  return `<div class="count"><div style="display:flex;gap:12px;align-items:center">${ico ? `<span style="width:40px;flex:none;color:var(--ink2)">${ICON[ico]}</span>` : ""}<div><b>${label}</b>${help ? `<small>${help}</small>` : ""}</div></div>
    <div class="stepper"><button data-act="bump" data-k="${k}" data-d="-1" aria-label="One less">${ICON.minus}</button><output>${v}</output><button data-act="bump" data-k="${k}" data-d="1" aria-label="One more">${ICON.plus}</button></div></div>`;
}
function typeGrid() {
  return `<div class="typegrid">${TPLS.filter((t) => !t.hidden && (NAMES[t.id] || t.custom)).map((t) => {
    const pic = t.draw !== "none" ? drawItem(t, runItem(t, defaults(t), db.pb), db.pb) : `<div style="width:64px;color:#3a3b40">${TYPE_ICON[t.base || t.id] || ICON.other}</div>`;
    return `<button class="pick" data-act="add" data-t="${t.id}"><div class="pp">${pic}</div><b>${esc(namesOf(t)[0])}</b><small>${esc(namesOf(t)[1])}</small></button>`;
  }).join("")}</div>`;
}
/* ---------- the quote for the customer ---------- */
function includes(P) {
  const inc = [], exc = [];
  const has = (f) => P.lines.some(f);
  if (has((l) => l.r.cuts.length)) inc.push("All steel made in our workshop to the sizes shown");
  const fin = [...new Set(P.lines.filter((l) => l.r.finish && l.r.finish !== "none").map((l) => { const f = byId(db.pb.finishes, l.r.finish); return f ? f.name + (l.r.env.colour && l.r.finish !== "galv" ? ` in ${l.r.env.colour}` : "") : ""; }))].filter(Boolean);
  if (fin.length) inc.push(fin.join(", "));
  if (has((l) => l.r.labour.some((x) => x.rate === "install"))) inc.push("Put in by the Apex Gates team, with posts set and gates hung and adjusted");
  if (has((l) => l.r.items.some((h) => byId(db.pb.hardware, h.id)?.cat === "motor"))) inc.push("Motors fitted, set up and tested, and we show you how it works");
  if (has((l) => l.r.items.some((h) => h.id === "remote"))) inc.push("Remotes set up on the day");
  if (has((l) => l.tpl.id === "site" && l.r.env.remove > 0)) inc.push("Taking away the old gate");
  inc.push("Clean up when we finish");
  if (!has((l) => l.r.labour.some((x) => x.rate === "elec"))) exc.push("Power to the gate, by a licensed electrician");
  exc.push("Breaking rock, roots or concrete under the ground", "Council or strata approvals", "Changes once we start making it");
  return { inc, exc };
}
function viewQuote() {
  const q = Q(), P = price(q), s = db.pb.settings, gst = 1 + s.gst / 100;
  const base = P.tot.sell * (1 - P.disc / 100), k = base ? P.exGst / base : 1;
  const shown = P.lines.map((l) => Math.round(l.sell * (1 - P.disc / 100) * k * gst));
  if (shown.length) shown[shown.length - 1] += Math.round(P.inc) - shown.reduce((a, b) => a + b, 0);
  const { inc, exc } = includes(P);
  const valid = q.created + s.validity * 864e5;
  const tickI = ICON.tick, noI = I('<path d="M6 6l12 12M18 6L6 18"/>', 2.6);
  const low = P.margin * 100 < s.minMargin;
  return `<div class="noprint qwrap">
  <button class="btn ghost small" data-act="view" data-v="job" style="margin-bottom:16px">Back to the gate</button>
  <div class="card pad qside">
    <h2 class="qh">${ICON.user}Who is it for?</h2>
    <div class="who">
      <div class="fld"><label>Name</label><input data-c="name" value="${esc(q.client.name)}" placeholder="Customer name"></div>
      <div class="fld"><label>Phone</label><input data-c="phone" inputmode="tel" value="${esc(q.client.phone)}" placeholder="Phone"></div>
      <div class="fld full"><label>Address</label><input data-c="address" value="${esc(q.client.address)}" placeholder="Street and suburb"></div>
    </div>
  </div>
  <div class="card pad qside">
    <h2 class="qh">${ICON.coins}The price</h2>
    <div class="bigtotal"><small>Customer pays, with GST</small><b>${money(P.inc)}</b></div>
    <div class="disc"><span>Discount</span><div class="stepper"><button data-act="disc" data-d="-5" aria-label="Less discount">${ICON.minus}</button><output>${P.disc}%</output><button data-act="disc" data-d="5" aria-label="More discount">${ICON.plus}</button></div></div>
    ${low ? `<div class="warn" style="margin-top:12px">${ICON.warn}<div>Apex only makes ${money(P.exGst - P.tot.cost)} here (${(P.margin * 100).toFixed(0)}%). Aim for ${s.minMargin}% or more.</div></div>` : `<div class="okmsg" style="margin-top:12px">${ICON.tick}Apex makes ${money(P.exGst - P.tot.cost)} on this quote.</div>`}
  </div>
  <div class="card pad qside">
    <h2 class="qh">${ICON.doc}Send it</h2>
    <div class="sendgrid">
      <button class="btn red" data-act="sign">${ICON.pen}${q.signature ? "Sign again" : "Customer signs now"}</button>
      <button class="btn dark" data-act="print">${ICON.print}Print or PDF</button>
      <button class="btn light" data-act="copytext">${ICON.copy}Copy for a text</button>
    </div>
    <p class="lbl" style="font-weight:800;margin:18px 0 8px">Where is it up to?</p><div class="statusbtns">${[["draft", "Still working"], ["sent", "Sent"], ["won", "Going ahead"], ["lost", "Said no"]].map(([st, lab]) => `<button data-act="status" data-v="${st}" class="${q.status === st ? "on" : ""}">${lab}</button>`).join("")}</div>
    <div class="fld" style="margin-top:16px"><label>A note on the quote (you can leave this empty)</label><textarea data-qn rows="2" placeholder="Thanks for having us out today">${esc(q.notes)}</textarea></div>
  </div>
  <h2 class="sub-t" style="text-align:center">This is what the customer sees</h2>
  </div>
  <article class="sheet">
    <div class="sh-top"><div><div class="brandmark">APEX<span> GATES</span></div><p>${esc(s.address)} · ${esc(s.phone)} · ${esc(s.email)}${s.abn ? ` · ABN ${esc(s.abn)}` : ""}</p></div>
      <div class="qno"><b>Quote ${esc(q.no)}</b>${dateStr(q.created)}<br>Good until ${dateStr(valid)}</div></div>
    <p class="forwho">For <b>${esc(q.client.name || "the customer")}</b>${q.client.address ? `, ${esc(q.client.address)}` : ""}${q.client.phone ? ` · ${esc(q.client.phone)}` : ""}</p>
    ${q.notes ? `<div class="note">${esc(q.notes)}</div>` : ""}
    <h2><i>1</i>What we will build</h2>
    ${P.lines.map((l, i) => `<div class="plan">${l.tpl.draw !== "none" ? `<div class="dr">${drawItem(l.tpl, l.r, db.pb)}</div>` : ""}<div class="tx"><div><b>${esc(l.name)}</b><p>${esc(cap(l.desc))}</p></div><div class="pr">${money(shown[i])}</div></div></div>`).join("") || `<p class="muted">Nothing added yet.</p>`}
    <h2><i>2</i>The price</h2>
    <div class="total-box">${P.disc ? `<span>Discount</span><b>${P.disc}% off</b>` : ""}<span>Price before GST</span><b>${money(P.exGst)}</b><span>GST</span><b>${money(P.gst, true)}</b>
      <span class="grand">Total</span><b>${money(P.inc, true)}</b>${s.deposit ? `<span>Deposit to get started (${s.deposit}%)</span><b>${money((P.inc * s.deposit) / 100, true)}</b>` : ""}</div>
    <h2><i>3</i>What is in, and what is not</h2>
    <div class="inex"><ul class="yes">${inc.map((x) => `<li>${tickI}<span>${esc(x)}</span></li>`).join("")}</ul><ul class="no">${exc.map((x) => `<li>${noI}<span>${esc(x)}</span></li>`).join("")}</ul></div>
    <h2><i>4</i>Happy to go ahead?</h2>
    <div class="signrow"><div><div class="line">${q.signature ? `<img src="${q.signature.img}" alt="Signature">` : ""}</div><small>Signed${q.signature ? ` by ${esc(q.signature.name)}` : ""}</small></div>
      <div><div class="line">${q.signature ? dateStr(q.signature.date) : ""}</div><small>Date</small></div></div>
    ${q.signature ? `<div class="stamp">ACCEPTED</div>` : ""}
    <p class="terms">${esc(s.terms)}</p>
  </article>`;
}
function quoteText() {
  const q = Q(), P = price(q), s = db.pb.settings;
  return `${s.company} quote ${q.no}\n${q.client.name ? `For ${q.client.name}\n` : ""}${q.client.address ? `${q.client.address}\n` : ""}\n${P.lines.map((l) => `${l.name}: ${cap(l.desc)}`).join("\n")}\n\nTotal ${money(P.inc, true)} with GST\nGood for ${s.validity} days, subject to a final measure.\n\n${s.company} ${s.phone}`;
}
function openSign() {
  const q = Q(), m = document.createElement("div"); m.className = "pop";
  m.innerHTML = `<div class="card"><h3>Sign to go ahead</h3><p class="muted" style="margin:0">Total ${money(price(q).inc, true)} with GST. Sign in the box with your finger.</p>
    <canvas id="padc"></canvas><div class="fld"><label>Full name</label><input id="signame" value="${esc(q.client.name)}"></div>
    <div class="row"><button class="btn ghost" data-x="clear">Clear</button><button class="btn green" data-x="ok">${ICON.tick}Sign</button></div>
    <button class="btn ghost wide" style="margin-top:12px" data-x="cancel">Cancel</button></div>`;
  document.body.appendChild(m);
  const c = $("#padc"), ctx = c.getContext("2d"), dpr = devicePixelRatio || 1;
  const b0 = c.getBoundingClientRect(); c.width = b0.width * dpr; c.height = b0.height * dpr; ctx.scale(dpr, dpr);
  ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#111";
  let down = false, inked = false, last;
  const pt = (e) => { const b = c.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  c.addEventListener("pointerdown", (e) => { down = true; last = pt(e); c.setPointerCapture(e.pointerId); });
  c.addEventListener("pointermove", (e) => { if (!down) return; const p = pt(e); ctx.beginPath(); ctx.moveTo(...last); ctx.lineTo(...p); ctx.stroke(); last = p; inked = true; });
  c.addEventListener("pointerup", () => (down = false));
  m.addEventListener("click", (e) => {
    const x = e.target.closest("[data-x]")?.dataset.x;
    if (x === "clear") { ctx.clearRect(0, 0, c.width, c.height); inked = false; }
    if (x === "cancel" || e.target === m) m.remove();
    if (x === "ok") {
      if (!inked) return say("Please sign in the box first");
      const name = $("#signame").value.trim(); if (!name) return say("Please type the full name");
      q.signature = { img: c.toDataURL("image/png"), name, date: Date.now() }; q.status = "won";
      if (!q.client.name) q.client.name = name;
      save(); m.remove(); render(); say("Signed. Marked as going ahead");
    }
  });
}

/* ---------- all jobs ---------- */
function viewJobs() {
  const list = [...db.quotes].sort((a, b) => b.updated - a.updated);
  const PL = { draft: "Still working", sent: "Sent", won: "Going ahead", lost: "Said no" };
  const won = db.quotes.filter((q) => q.status === "won");
  return `<h1 class="big-t">My quotes</h1>
  <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:18px"><button class="btn red" data-act="newjob">${ICON.plus}New quote</button>
    <div class="card pad" style="flex:1;min-width:240px;display:flex;align-items:center;gap:14px"><span style="width:40px;color:var(--ok)">${ICON.coins}</span><div><b style="font-size:24px">${money(won.reduce((a, q) => a + price(q).inc, 0))}</b><div class="muted">${won.length} job${won.length === 1 ? "" : "s"} going ahead</div></div></div></div>
  <div class="jobs">${list.map((q) => {
    const P = price(q);
    return `<div class="card jobrow"><div><h3>${esc(q.client.name || "No name yet")}<span class="pill ${q.status}">${PL[q.status]}</span></h3><p>${esc(q.no)} · ${dateStr(q.updated)}${q.client.address ? ` · ${esc(q.client.address)}` : ""}<br>${q.items.map((i) => esc(nameOf(i))).join(", ") || "Nothing added yet"}</p></div>
      <div class="amt">${money(P.inc)}</div>
      <div class="acts"><button class="btn dark small" data-act="open" data-id="${q.id}">Open</button><button class="btn ghost small" data-act="copyjob" data-id="${q.id}">${ICON.copy}Copy</button><button class="btn ghost small" data-act="deljob" data-id="${q.id}">${ICON.bin}Delete</button></div></div>`;
  }).join("")}</div>`;
}

/* ---------- prices ---------- */
const SHELVES = [
  ["steel", "Steel", "steel", () => db.pb.materials.filter((m) => !m.sheet)],
  ["sheet", "Mesh and sheet", "look", () => db.pb.materials.filter((m) => m.sheet)],
  ["parts", "Gate parts", "bolt", () => db.pb.hardware.filter((h) => !["motor", "access", "misc"].includes(h.cat))],
  ["motors", "Motors and remotes", "motor", () => db.pb.hardware.filter((h) => h.cat === "motor" || h.cat === "access")],
  ["site", "Travel and hire", "truck", () => db.pb.hardware.filter((h) => h.cat === "misc")],
  ["labour", "Our team per hour", "worker", () => db.pb.labour],
  ["paint", "Paint and galvanising", "paint", () => db.pb.finishes.filter((f) => f.id !== "none")],
];
function syncLine() {
  if (sync.state === "ok") return `<div class="okmsg">${ICON.tick}These are the office prices, shared by every tablet. Last changed ${new Date(sync.at).toLocaleString("en-AU", { day: "numeric", month: "long", hour: "numeric", minute: "2-digit" })}.</div>`;
  if (sync.state === "none") return `<div class="warn">${ICON.warn}<div>The office has not saved any prices yet, so these are the starting sample prices.</div></div>`;
  if (sync.state === "loading") return `<div class="okmsg">${ICON.tick}Checking for the latest office prices...</div>`;
  return `<div class="warn">${ICON.warn}<div>Could not reach the office prices right now. Showing the last prices this tablet saw.</div></div>`;
}
function viewPrices() {
  const sh = SHELVES.find((s) => s[0] === ui.shelf) || SHELVES[0];
  const find = ui.find.toLowerCase();
  const rows = sh[3]().filter((x) => !find || x.name.toLowerCase().includes(find)).map((x) => {
    const v = sh[0] === "labour" ? `${money(x.rate)} an hour` : sh[0] === "paint" ? (x.perM2 ? `${money(x.perM2)} per m²` : `${money(x.perKg, true)} per kg`) : money(x.cost, x.cost < 20);
    const note = sh[0] === "steel" && x.stock ? `${(x.stock / 1000).toLocaleString("en-AU")} m length` : x.note || "";
    return `<div class="prow ro"><div><b>${esc(x.name)}</b>${note ? `<small>${esc(note)}</small>` : ""}</div><div class="pv">${v}</div></div>`;
  }).join("") || `<p class="muted">Nothing matches.</p>`;
  return `<h1 class="big-t">Prices</h1>
  ${syncLine()}
  <a class="btn dark wide" href="admin.html" style="text-decoration:none;margin:16px 0 20px">${ICON.pen}Change prices or add new things (office)</a>
  <div class="shelves">${SHELVES.map((s) => `<button class="shelf ${s[0] === sh[0] ? "on" : ""}" data-act="shelf" data-v="${s[0]}">${ICON[s[2]]}<b>${s[1]}</b></button>`).join("")}</div>
  <div class="pbar"><div class="fld"><input data-find placeholder="Search ${sh[1].toLowerCase()}" value="${esc(ui.find)}"></div></div>
  <div class="plist">${rows}</div>
  <p class="muted" style="margin-top:22px">What things cost Apex, before GST and before markup.</p>`;
}

/* ---------- actions ---------- */
function setVal(k, v) { const it = item(); if (!it) return; it.values[k] = v; save(); }
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-act]"); if (!b) return;
  const a = b.dataset.act, q = Q(), it = item();
  if (a === "view") { ui.view = b.dataset.v; render(); window.scrollTo(0, 0); }
  if (a === "sel") { q.sel = b.dataset.id; ui.tab = 0; save(); redraw(); }
  if (a === "tab") { ui.tab = +b.dataset.i; redraw(); }
  if (a === "add") {
    const t = tplOf(b.dataset.t), same = q.items.filter((x) => x.tpl === t.id).length;
    const n = { id: uid(), tpl: t.id, name: namesOf(t)[0] + (same ? ` ${same + 1}` : ""), values: defaults(t) };
    q.items.push(n); q.sel = n.id; ui.tab = 0; save(); ui.view = "job"; render(); window.scrollTo(0, 0);
  }
  if (a === "del" && it && confirm(`Take the ${nameOf(it).toLowerCase()} off this quote?`)) { q.items = q.items.filter((x) => x !== it); q.sel = q.items[0]?.id || null; ui.tab = 0; save(); render(); window.scrollTo(0, 0); }
  if (a === "set") { setVal(b.dataset.k, b.dataset.num === "1" ? +b.dataset.v : b.dataset.v); redraw(); }
  if (a === "tog") { const t = tplOf(it.tpl), inp = t.inputs.find((i) => i.k === b.dataset.k); setVal(b.dataset.k, +(it.values[b.dataset.k] ?? inp.def) ? 0 : 1); redraw(); }
  if (a === "bump") {
    const t = tplOf(it.tpl), inp = t.inputs.find((i) => i.k === b.dataset.k);
    let v = +(it.values[b.dataset.k] ?? inp.def) + +b.dataset.d;
    v = Math.min(inp.max ?? 1e9, Math.max(inp.min ?? 0, Math.round(v * 100) / 100));
    setVal(b.dataset.k, v); redraw();
  }
  if (a === "disc") { q.discount = Math.max(0, Math.min(50, (+q.discount || 0) + +b.dataset.d)); save(); redraw(); }
  if (a === "sign") openSign();
  if (a === "print") window.print();
  if (a === "copytext") navigator.clipboard.writeText(quoteText()).then(() => say("Copied. Paste it into a text message"), () => say("Could not copy on this device"));
  if (a === "status") { q.status = b.dataset.v; save(); redraw(); }
  if (a === "newjob") {
    // reuse an empty quote instead of piling up blank ones
    let n = db.quotes.find((x) => !x.items.length && !x.client.name);
    if (!n) { n = newQuote(db); db.quotes.push(n); }
    db.current = n.id; save(); ui.view = "pick"; render(); window.scrollTo(0, 0);
  }
  if (a === "open") { db.current = b.dataset.id; ui.tab = 0; save(); ui.view = "job"; render(); window.scrollTo(0, 0); }
  if (a === "copyjob") { const src = db.quotes.find((x) => x.id === b.dataset.id), n = { ...clone(src), id: uid(), no: `Q-${db.nextNo++}`, created: Date.now(), updated: Date.now(), status: "draft", signature: null }; db.quotes.push(n); save(); redraw(); say("Job copied"); }
  if (a === "deljob" && confirm("Delete this job? This cannot be undone.")) { db.quotes = db.quotes.filter((x) => x.id !== b.dataset.id); if (!db.quotes.length) { const n = newQuote(db); db.quotes.push(n); } if (!db.quotes.find((x) => x.id === db.current)) db.current = db.quotes[0].id; save(); redraw(); }
  if (a === "shelf") { ui.shelf = b.dataset.v; ui.find = ""; render(); }
});
document.addEventListener("change", (e) => {
  const el = e.target;
  if (el.dataset.num) { const v = parseFloat(el.value); if (!isNaN(v)) { setVal(el.dataset.num, v); redraw(); } }
  if (el.dataset.txt) { setVal(el.dataset.txt, el.value); redraw(); }
  if (el.dataset.c) redraw();
});
document.addEventListener("input", (e) => {
  const el = e.target, q = Q();
  if (el.dataset.c) { q.client[el.dataset.c] = el.value; save(); }
  if (el.matches("[data-qn]")) { q.notes = el.value; save(); }
  if (el.matches("[data-find]")) { ui.find = el.value; const pos = el.selectionStart; render(); const n = $("[data-find]"); n.focus(); n.setSelectionRange(pos, pos); }
});
document.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.dataset?.num) e.target.blur(); });
document.addEventListener("toggle", (e) => { if (e.target.matches?.("details.where")) ui.where = e.target.open; }, true);

render();
pull();
window.addEventListener("focus", pull);
