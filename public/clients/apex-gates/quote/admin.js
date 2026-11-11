/* Simon's CEO dashboard: every quote the technicians made and what Apex makes
   on it, plus the one place prices, markup, equipment, materials and gate types
   are changed. Saving sends it to the server, and every tablet picks it up the
   next time it opens. Technicians cannot open it. */
import { PRICEBOOK, TEMPLATES } from "./data.js";
import { runItem, priceQuote, defaults, money, byId } from "./engine.js";
import { drawItem } from "./draw.js";
import { buildTemplates, mergePricebook, priceExtras, stageOf, GROUPS, groupOf } from "./shared.js";

const $ = (s, el = document) => el.querySelector(s);
const clone = (o) => JSON.parse(JSON.stringify(o));
const uid = () => Math.random().toString(36).slice(2, 8);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const I = (p, w = 2) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const ICON = {
  tick: I('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 3), plus: I('<path d="M12 5v14M5 12h14"/>', 2.6), bin: I('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
  warn: I('<path d="M12 3l10 18H2zM12 10v5M12 18h.01"/>', 2.2), pen: I('<path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4"/>'), back: I('<path d="M19 12H5M11 6l-6 6 6 6"/>', 2.4),
  lock: I('<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'), eye: I('<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
  hide: I('<path d="M3 3l18 18M10.6 6.1A10 10 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-3.2 3.9M6.6 6.6C3.8 8.3 2 12 2 12s3.5 6 10 6c1.7 0 3.2-.4 4.5-1"/>'),
  undo: I('<path d="M9 14L4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3"/>'),
};

const st = { office: false, loaded: false, work: null, dirty: false, updated: null, tab: "quotes", quotes: null, qfilter: "all", shelf: "steel", find: "", gate: null, err: "", history: null, saving: false };

async function api(body) {
  const r = await fetch("data.json", { method: body ? "POST" : "GET", headers: body ? { "content-type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined, credentials: "same-origin", cache: "no-store" });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || "Something went wrong");
  return j;
}
async function load() {
  try {
    const j = await api();
    st.office = j.office;
    st.work = j.data && j.data.pb ? { pb: mergePricebook(j.data.pb, PRICEBOOK), gates: j.data.gates || { custom: [], hidden: [] } } : { pb: clone(PRICEBOOK), gates: { custom: [], hidden: [] } };
    st.updated = j.data?.updated || null;
    st.serverOk = j.ok !== false;
  } catch (e) { st.err = e.message; st.work = { pb: clone(PRICEBOOK), gates: { custom: [], hidden: [] } }; }
  st.loaded = true; render();
}
const pb = () => st.work.pb;
const tpls = () => buildTemplates(TEMPLATES, pb(), st.work.gates);
function changed() { st.dirty = true; renderBar(); }
function say(t) { const el = $("#saved"); el.textContent = t; el.classList.add("on"); clearTimeout(el.t); el.t = setTimeout(() => el.classList.remove("on"), 2600); }

/* ---------- screens ---------- */
function render() {
  const m = $("#main");
  document.querySelectorAll(".nav button").forEach((b) => b.classList.toggle("on", b.dataset.v === st.tab));
  $(".nav").classList.toggle("hide", !st.office);
  if (!st.loaded) { m.innerHTML = `<p class="muted">Loading...</p>`; return; }
  if (!st.office) { m.innerHTML = viewLogin(); renderBar(); return; }
  if (st.tab === "quotes") { m.innerHTML = viewQuotes(); if (!st.quotes && !st.qloading) loadQuotes(); }
  if (st.tab === "prices") m.innerHTML = viewPrices();
  if (st.tab === "add") m.innerHTML = viewAdd();
  if (st.tab === "kits") m.innerHTML = viewKits();
  if (st.tab === "jobs") { m.innerHTML = viewJobsBoard(); if (!st.jobs && !st.jloading) loadJobs(); }
  if (st.tab === "stock") { m.innerHTML = viewStock(); if (!st.stock && !st.sloading) loadStock(); }
  if (st.tab === "gates") m.innerHTML = st.gate ? viewGateEditor() : viewGates();
  if (st.tab === "company") m.innerHTML = viewCompany();
  renderBar();
}
function renderBar() {
  const bar = $("#dock");
  if (!st.office) { bar.classList.add("hide"); return; }
  bar.classList.remove("hide");
  bar.innerHTML = `<div class="in office">${st.dirty
    ? `<div class="state warnc">${ICON.warn}<span>You have changes that are <b>not saved yet</b></span></div><button class="btn green" data-act="save" ${st.saving ? "disabled" : ""}>${ICON.tick}${st.saving ? "Saving..." : "Save for everyone"}</button>`
    : `<div class="state okc">${ICON.tick}<span>Everything is saved${st.updated ? `, last on ${new Date(st.updated).toLocaleString("en-AU", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}` : ""}</span></div><a class="btn ghost" href="index.html" style="text-decoration:none">${ICON.back}Back to quoting</a>`}</div>`;
}

function viewLogin() {
  return `<div class="card pad" style="max-width:560px;margin:30px auto">
    <h1 class="big-t" style="display:flex;gap:12px;align-items:center"><span style="width:44px;color:var(--red)">${ICON.lock}</span>CEO only</h1>
    <p style="font-size:19px;margin:0 0 16px">This is Simon's dashboard: every quote and what Apex makes on it, and where prices and markup are set. Technicians cannot open it.</p>
    <div class="fld"><label>CEO password</label><input id="opw" type="password" autocomplete="current-password"></div>
    ${st.err ? `<div class="warn" style="margin-top:12px">${ICON.warn}<div>${esc(st.err)}</div></div>` : ""}
    <button class="btn red wide" style="margin-top:16px" data-act="login">Open the dashboard</button>
    <a class="btn ghost wide" href="index.html" style="margin-top:10px;text-decoration:none">${ICON.back}Back to quoting</a></div>`;
}

/* what the team keeps adding on finished jobs, so the gate types can be fixed */
async function loadLearn() {
  try { st.learn = (await api({ action: "learn" })).stats || {}; } catch (e) { st.learn = {}; }
  render();
}
function learnPanel() {
  if (!st.learn) { if (!st.lloading) { st.lloading = true; loadLearn(); } return ""; }
  const T = tpls(), rows = [];
  for (const [tid, s] of Object.entries(st.learn)) {
    const name = byId(T, tid)?.name || tid;
    const often = Object.values(s.extras).filter((e) => e.n >= 2 && e.n / s.jobs >= 0.3).sort((a, b) => b.n - a.n);
    const parts = often.map((e) => `${esc(e.name || byId(pb().hardware, e.id)?.name || e.id)} (${e.n} of ${s.jobs})`);
    if (s.jobs >= 2 && s.fab / s.jobs >= 0.5) parts.push(`${(s.fab / s.jobs).toFixed(1)} more workshop hours`);
    if (s.jobs >= 2 && s.install / s.jobs >= 0.5) parts.push(`${(s.install / s.jobs).toFixed(1)} more hours on site`);
    if (parts.length) rows.push(`<div class="qr learn"><b>${esc(name)}</b><span>${parts.join(", ")}</span></div>`);
  }
  if (!rows.length) return `<section class="card pad" style="margin-top:16px"><h2 class="qh">What the team keeps adding</h2><p class="muted" style="margin:0">Nothing yet. When technicians finish jobs, the extras they add show up here, and their tablets start asking about them on the next job.</p></section>`;
  return `<section class="card pad" style="margin-top:16px"><h2 class="qh">What the team keeps adding</h2><p class="muted" style="margin:-4px 0 10px">From finished jobs. If something is on most jobs, put it in that gate type on the Gates tab so it is quoted from the start.</p><div class="qtable">${rows.join("")}</div></section>`;
}

/* every quote from every tablet, priced with the real costs */
async function loadQuotes() {
  st.qloading = true;
  try { st.quotes = (await api({ action: "quotes" })).list || []; const k = await api({ action: "stock-full" }); st.stock = k.stock; st.bills = k.bills || []; } catch (e) { st.quotes = st.quotes || []; say(e.message); }
  st.qloading = false; render();
}
const STATUS = { draft: "Still working", sent: "Sent", won: "Going ahead", lost: "Said no" };
const STAGE = { won: "Going ahead", made: "Made", fitted: "Put in", invoiced: "Invoiced", paid: "Paid" };
const stageName = (q) => (q.status === "won" ? STAGE[stageOf(q)] : STATUS[q.status] || "Still working");
const stageKey = (q) => (q.status === "won" ? stageOf(q) : q.status || "draft");
function viewQuotes() {
  const head = `<h1 class="big-t">Quotes and profit</h1><p class="hello" style="margin-top:-10px">Every quote the technicians make, with what Apex makes on it. Only you see this.</p>`;
  if (!st.quotes) return head + `<p class="muted">Loading the quotes...</p>`;
  const T = tpls();
  const rows = st.quotes.map((q) => {
    let P; try { P = priceQuote(q, T, pb()); } catch (e) { return null; }
    // a job's extras change both what the customer pays and what Apex makes
    const E = priceExtras(q.job, pb()), g = 1 + pb().settings.gst / 100;
    const quoted = P.exGst - P.tot.cost, makes = quoted + E.sell - E.cost, ex = P.exGst + E.sell;
    // supplier bills logged against this job replace the price book's guess for materials and parts
    const billed = (st.bills || []).filter((b) => b.qid === q.id).reduce((a, b) => a + (b.total || 0), 0);
    const real = billed ? ex - ((P.tot.byCat.labour || {}).cost || 0) - E.cost - billed : null;
    return { q, inc: ex * g, makes, quoted, billed, real, extras: E.lines.length, margin: ex ? makes / ex : 0, what: q.items.map((it) => it.name || byId(T, it.tpl)?.name || "Item").join(", ") };
  }).filter(Boolean).sort((a, b) => (b.q.updated || 0) - (a.q.updated || 0));
  const since = new Date(); since.setDate(1); since.setHours(0, 0, 0, 0);
  const month = rows.filter((r) => (r.q.created || 0) >= since.getTime());
  const won = month.filter((r) => r.q.status === "won");
  const sum = (list, k) => list.reduce((a, r) => a + r[k], 0);
  const avg = month.length ? sum(month, "makes") / Math.max(1, month.reduce((a, r) => a + r.inc / (1 + pb().settings.gst / 100), 0)) : 0;
  const kpi = (label, value, sub) => `<div class="kpi"><small>${label}</small><b>${value}</b>${sub ? `<span>${sub}</span>` : ""}</div>`;
  const kpis = `<div class="kpis">
    ${kpi("Quotes this month", month.length, `${won.length} going ahead`)}
    ${kpi("Quoted this month", money(sum(month, "inc")), "customer prices with GST")}
    ${kpi("Apex makes on them", money(sum(month, "makes")), `${(avg * 100).toFixed(0)}% on average`)}
    ${kpi("Won this month", money(sum(won, "inc")), `Apex makes ${money(sum(won, "makes"))}`)}
    ${kpi("Waiting to be paid", money(sum(rows.filter((r) => stageKey(r.q) === "invoiced"), "inc")), `${rows.filter((r) => stageKey(r.q) === "invoiced").length} invoice${rows.filter((r) => stageKey(r.q) === "invoiced").length === 1 ? "" : "s"} out`)}
  </div>`;
  const techs = {};
  for (const r of month) { const k = r.q.tech || "No name given"; const t = (techs[k] ||= { n: 0, won: 0, inc: 0, makes: 0 }); t.n++; t.inc += r.inc; t.makes += r.makes; if (r.q.status === "won") t.won++; }
  const techList = Object.entries(techs).sort((a, b) => b[1].makes - a[1].makes);
  const team = techList.length ? `<section class="card pad" style="margin-top:16px"><h2 class="qh">Each technician this month</h2>
    <div class="qtable"><div class="qr qh2"><span>Name</span><span>Quotes</span><span>Going ahead</span><span>Quoted</span><span>Apex makes</span></div>
    ${techList.map(([n, t]) => `<div class="qr"><b>${esc(n)}</b><span>${t.n}</span><span>${t.won}</span><span>${money(t.inc)}</span><span class="ok">${money(t.makes)}</span></div>`).join("")}</div></section>` : "";
  const show = rows.filter((r) => st.qfilter === "all" || stageKey(r.q) === st.qfilter || (st.qfilter === "jobs" && r.q.status === "won" && stageKey(r.q) !== "paid"));
  const filt = `<div class="segrow" style="margin:22px 0 12px">${[["all", "All"], ["draft", "Still working"], ["sent", "Sent"], ["jobs", "Jobs on the go"], ["invoiced", "Invoiced"], ["paid", "Paid"], ["lost", "Said no"]].map(([v, l]) => `<button class="${st.qfilter === v ? "on" : ""}" data-act="qf" data-v="${v}">${l}</button>`).join("")}</div>`;
  const list = show.length ? `<div class="qtable big"><div class="qr qh2"><span>Customer</span><span>Who quoted</span><span>Where it is up to</span><span>Customer pays</span><span>Apex makes</span></div>
    ${show.map((r) => `<div class="qr"><div><b>${esc(r.q.client?.name || "No name yet")}</b><small>${esc(r.q.no || "")} · ${new Date(r.q.updated || r.q.created).toLocaleDateString("en-AU", { day: "numeric", month: "short" })} · ${esc(r.what)}</small></div>
      <span>${esc(r.q.tech || "No name given")}</span><span><i class="pill ${r.q.status} ${stageKey(r.q)}">${stageName(r.q)}</i></span><span>${money(r.inc)}</span>
      <span class="${r.margin * 100 < pb().settings.minMargin ? "low" : "ok"}">${money(r.makes)}<small>${(r.margin * 100).toFixed(0)}%${r.extras ? ` · quoted ${money(r.quoted)}` : ""}${r.billed ? ` · after real bills ${money(r.real)}` : ""}</small></span></div>`).join("")}</div>`
    : `<p class="muted">${rows.length ? "No quotes here." : "No quotes yet. They show up here as soon as a technician starts one on their tablet."}</p>`;
  const low = st.stock ? Object.entries(st.stock.items || {}).filter(([, v]) => v.min > 0 && v.qty <= v.min) : [];
  const lowNote = low.length ? `<div class="warn" style="margin:12px 0">${ICON.warn}<div><b>Running low:</b> ${low.map(([id, v]) => `${esc(itemName(id))} (${v.qty} left)`).join(", ")}. <button class="linkbtn" data-act="tab" data-v="stock">Open Stock</button></div></div>` : "";
  const byGroup = GROUPS.map(([k, l]) => { const rs = month.filter((r) => groupOf(r.q) === k); return [l, rs.length, sum(rs, "inc"), sum(rs, "makes"), rs.filter((r) => r.q.status === "won").length]; }).filter((g) => g[1]);
  const groups = byGroup.length ? `<section class="card pad" style="margin-top:16px"><h2 class="qh">Where the money comes from this month</h2>
    <div class="qtable"><div class="qr qh2"><span>Kind of job</span><span>Quotes</span><span>Going ahead</span><span>Quoted</span><span>Apex makes</span></div>
    ${byGroup.map((g) => `<div class="qr"><b>${g[0]}</b><span>${g[1]}</span><span>${g[4]}</span><span>${money(g[2])}</span><span class="ok">${money(g[3])}</span></div>`).join("")}</div></section>` : "";
  return head + lowNote + kpis + groups + team + learnPanel() + filt + list + `<button class="btn ghost small" style="margin-top:16px" data-act="qreload">Check for new quotes</button>`;
}

/* prices */
const SHELVES = [
  ["steel", "Steel", (p) => p.materials.filter((m) => !m.sheet), "materials", "cost"],
  ["sheet", "Mesh and sheet", (p) => p.materials.filter((m) => m.sheet), "materials", "cost"],
  ["parts", "Gate parts", (p) => p.hardware.filter((h) => !["motor", "access", "misc", "fab"].includes(h.cat)), "hardware", "cost"],
  ["fab", "Fabricators", (p) => p.hardware.filter((h) => h.cat === "fab"), "hardware", "cost"],
  ["motors", "Motors and remotes", (p) => p.hardware.filter((h) => h.cat === "motor" || h.cat === "access"), "hardware", "cost"],
  ["site", "Travel and hire", (p) => p.hardware.filter((h) => h.cat === "misc"), "hardware", "cost"],
  ["labour", "Our team per hour", (p) => p.labour, "labour", "rate"],
  ["paint", "Paint and galvanising", (p) => p.finishes.filter((f) => f.id !== "none"), "finishes", "perM2"],
  ["addon", "Markup (office only)", () => [], "", ""],
];
function viewPrices() {
  const sh = SHELVES.find((s) => s[0] === st.shelf) || SHELVES[0];
  const find = st.find.toLowerCase();
  let rows;
  if (sh[0] === "addon") {
    const lab = { materials: "Steel and sheet", hardware: "Gate parts", motors: "Motors and remotes", labour: "Our team's time", finish: "Paint and galvanising", other: "Other" };
    rows = Object.keys(pb().markup).map((k) => `<div class="prow"><div><b>${lab[k] || k}</b><small>Added on top of what it costs Apex</small></div><div class="money-in"><input data-mk="${k}" inputmode="decimal" value="${pb().markup[k]}"><em>%</em></div></div>`).join("");
  } else if (sh[0] === "paint") {
    rows = sh[2](pb()).map((f) => `<div class="prow wide"><div><b>${esc(f.name)}</b><small>Smallest charge for a job</small></div>
      <div class="pair">${f.perM2 || !f.perKg ? `<div class="money-in"><span>$</span><input data-list="finishes" data-id="${f.id}" data-f="perM2" inputmode="decimal" value="${f.perM2}"><em>m²</em></div>` : ""}
      ${f.perKg ? `<div class="money-in"><span>$</span><input data-list="finishes" data-id="${f.id}" data-f="perKg" inputmode="decimal" value="${f.perKg}"><em>kg</em></div>` : ""}
      <div class="money-in"><span>min $</span><input data-list="finishes" data-id="${f.id}" data-f="min" inputmode="decimal" value="${f.min}"></div></div></div>`).join("");
  } else {
    rows = sh[2](pb()).filter((x) => !find || x.name.toLowerCase().includes(find)).map((x) => {
      const note = sh[3] === "materials" && !x.sheet ? `${(x.stock / 1000).toLocaleString("en-AU")} m length` : sh[3] === "labour" ? "per hour" : x.sell > 0 ? `Customer price from AroFlo${x.part ? ", part " + x.part : ""}` : x.note || "";
      return `<div class="prow ${sh[3] === "hardware" ? "wide" : ""}"><div><b>${esc(x.name)}</b>${note ? `<small>${esc(note)}</small>` : ""}
        ${x.added ? `<button class="linkbtn" data-act="remove" data-list="${sh[3]}" data-id="${x.id}">${ICON.bin}Remove</button>` : ""}</div>
        <div class="pair">${sh[3] === "hardware" && x.cat !== "fab" ? `<button class="offer ${x.offer ? "on" : ""}" data-act="offer" data-id="${x.id}">${x.offer ? ICON.tick : ""}Offer on gates</button>` : ""}
        <div class="money-in"><span>$</span><input data-list="${sh[3]}" data-id="${x.id}" data-f="${x.sell > 0 ? "sell" : sh[4]}" inputmode="decimal" value="${x.sell > 0 ? x.sell : x[sh[4]]}"></div></div></div>`;
    }).join("") || `<p class="muted">Nothing matches.</p>`;
  }
  const secret = sh[0] === "addon" ? `<div class="okmsg" style="margin-bottom:14px">${ICON.lock}Only you see these numbers. Technicians' tablets get every price with this already added, so they only ever see what the customer pays. They never see what Apex pays or how much is added on.</div>` : "";
  return `<h1 class="big-t">Prices</h1><p class="hello" style="margin-top:-10px">What things cost Apex, before GST. Change a number, then press <b>Save for everyone</b> at the bottom.</p>
  <div class="shelves">${SHELVES.map((s) => `<button class="shelf ${s[0] === sh[0] ? "on" : ""}" data-act="shelf" data-v="${s[0]}"><b>${s[1]}</b></button>`).join("")}</div>
  ${["addon", "paint"].includes(sh[0]) ? "" : `<div class="pbar"><div class="fld"><input data-find placeholder="Search ${sh[1].toLowerCase()}" value="${esc(st.find)}"></div><button class="btn dark small" data-act="rise">Prices went up by a %</button><button class="btn ghost small" data-act="tab" data-v="add">${ICON.plus}Add new</button></div>`}
  ${sh[3] === "hardware" ? `<p class="muted" style="margin:0 0 12px">"Offer on gates" puts the item in an Extras tab on every gate, so the team can add it.</p>` : ""}
  ${secret}<div class="plist">${rows}</div>`;
}

/* bring in Apex's stock and clients from AroFlo CSV exports */
function parseCSV(text) {
  const rows = []; let row = [], f = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; continue; }
    if (c === '"') q = true;
    else if (c === ",") { row.push(f); f = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(f); rows.push(row); row = []; f = ""; }
    else f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  const head = (rows.shift() || []).map((h) => h.replace(/^\uFEFF/, "").trim());
  return rows.filter((r) => r.some((x) => x.trim())).map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] || "").trim()])));
}
const numv = (v) => parseFloat(String(v || "").replace(/[^0-9.\-]/g, "")) || 0;
const slug = (t) => String(t).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 40);
/* which shelf an AroFlo item belongs on, from its name */
function aroCat(name) {
  const n = name.toLowerCase();
  if (/labou?r|call ?out|per hour|hourly|service|maintenance|attendance|inspection|diagnos/.test(n)) return "misc";
  if (/r[e]?mote|mitto|swipe|transmitter|tx\d|keypad|key pad|reader|intercom|prox|card|fob|receiver|photo ?eye|beam|sensor|loop|detector|push ?button|key ?switch|antenna|aerial|gsm|wifi|smart controller|battery|batteries|solar/.test(n)) return "access";
  if (/travel|delivery|freight|fuel|commission|program|site visit|testing|disposal|removal/.test(n)) return "misc";
  if (/motor|operator|opener|gate kit|\bkit\b|\bd5\b|\bd10\b|\bd20\b|robus|\bats\b|barrier|boom|turnstile|unigate|vantage|icaro|deimos|ares|\bfaac\b|\bbft\b|centurion|ditec|nice /.test(n)) return "motor";
  return "part";
}
function importStock(rows) {
  const p = pb(), up = (c) => 1 + ((p.markup || {})[c === "motor" ? "motors" : c === "access" ? "motors" : "hardware"] || 0) / 100;
  const keep = p.hardware.filter((h) => !h.aroflo);
  const seen = new Set(keep.map((h) => h.id)), out = [], skipped = [];
  for (const r of rows) {
    const name = r["Item Name *"] || r["Item Name"] || "";
    const price = numv(r["Price *"] || r["Price"]), cost = numv(r["Supplier Cost"]);
    if (!name || price <= 0 || /^(credit|exclu|discount|less )/i.test(name)) { skipped.push(name); continue; }
    const cat = aroCat(name);
    let id = "af_" + slug(r["Part No"] || name); while (seen.has(id)) id += "_2";
    seen.add(id);
    // AroFlo holds the sell price (before GST); keep it exact, with the real cost when there is one
    out.push({ id, cat, name, cost: Math.round((cost > 0 ? cost : price / up(cat)) * 100) / 100, sell: price, part: r["Part No"] || "", note: (r["Supplier Name"] || "").slice(0, 40), aroflo: true, added: true });
  }
  p.hardware = keep.concat(out);
  const by = (c) => out.filter((x) => x.cat === c).length;
  st.stockMsg = `Brought in ${out.length} items: ${by("motor")} motors and kits, ${by("access")} remotes, readers and access, ${by("part")} gate parts, ${by("misc")} service, labour and travel. Left out ${skipped.length} with no price, credits or exclusions.`;
  changed(); render();
}
async function importClients(rows) {
  const list = rows.filter((r) => (r["Company Name *"] || r["Company Name"]) && r["Status *"] !== "False").map((r) => ({
    code: r["Client Code"] || "", name: r["Company Name *"] || r["Company Name"],
    contact: [r["Contact First Name"], r["Contact Last Name"]].filter(Boolean).join(" "),
    address: [r["Street 1 *"] || r["Street 1"], r["Street 2"], r["Suburb"], r["Postcode"]].filter(Boolean).join(", "),
    phone: r["Mobile"] || r["Contact Mobile"] || r["Phone"] || r["Contact Phone"] || "",
    email: r["Email"] || r["Contact Email"] || "", terms: r["Account Type *"] || "",
  }));
  try { await api({ action: "clients-save", list }); st.clientMsg = `Brought in ${list.length.toLocaleString("en-AU")} clients. The team can now search them on every quote.`; }
  catch (e) { st.clientMsg = "Could not save the clients: " + e.message; }
  render();
}
/* jobs from the old system: one row per job (the export repeats a job once per part) */
const JOB_STEPS = ["Booked", "Dispatched", "Waiting for parts", "Done, office to check", "Ready to invoice", "Invoiced"];
function jobGroup(type, desc) {
  const t = `${type} ${desc}`.toLowerCase();
  if (/callout|call out|repair|fault|urgent/.test(t)) return "callout";
  if (/service|maintenance|pm extra/.test(t)) return "service";
  if (/install|new motor|supply & install/.test(t)) return "install";
  if (/supply only|pick ?up|drop ?off/.test(t)) return "supply";
  return "";
}
function stepOf(status) {
  const s = String(status).toLowerCase();
  if (/finish|complete/.test(s)) return "Done, office to check";
  if (/dispatch|progress|started/.test(s)) return "Dispatched";
  if (/parts|hold|wait/.test(s)) return "Waiting for parts";
  if (/invoic/.test(s)) return "Invoiced";
  return "Booked";
}
async function importJobs(rows) {
  const seen = new Map();
  for (const r of rows) {
    const code = r["Job Code"]; const date = r["Start Date *"] || "";
    if (!code || !/\d{1,2}-[A-Za-z]{3}-\d{4}/.test(date)) continue; // the export has broken rows from notes; keep only real jobs
    if (seen.has(code)) continue;
    const type = r["Job Type *"] || "", desc = r["Service Description"] || "";
    seen.set(code, { code, client: r["Client Name *"] || "", type, status: stepOf(r["Job Status *"]), date, time: r["Start Time *"] || "", tech: (r["Fieldworker Name"] || "").replace(/\s+/g, " ").trim(),
      desc, address: [r["Street 1"], r["Suburb"]].filter(Boolean).join(", "), phone: r["Mobile"] || r["Phone"] || "", group: jobGroup(type, desc) });
  }
  const list = [...seen.values()];
  try { await api({ action: "jobs-save", list, merge: true }); st.jobMsg = `Brought in ${list.length} current jobs. They are on the Jobs tab.`; st.jobs = null; }
  catch (e) { st.jobMsg = "Could not save the jobs: " + e.message; }
  render();
}
async function loadJobs() {
  st.jloading = true;
  try { st.jobs = (await api({ action: "jobs" })).list || []; if (!st.quotes) st.quotes = (await api({ action: "quotes" })).list || []; } catch (e) { st.jobs = []; say(e.message); }
  st.jloading = false; render();
}
function viewJobsBoard() {
  if (!st.jobs) return `<h1 class="big-t">Jobs</h1><p class="muted">Loading the jobs...</p>`;
  const f = st.jfilter || "open";
  const fromQuotes = (st.quotes || []).filter((q) => q.status === "won").map((q) => ({ quote: true, code: q.no, client: q.client?.name || "", type: (GROUPS.find((g) => g[0] === groupOf(q)) || [])[1] || "", status: ({ won: "Booked", made: "Made in the workshop", fitted: "Done, office to check", invoiced: "Invoiced", paid: "Paid" })[stageOf(q)], date: new Date(q.updated || q.created).toLocaleDateString("en-AU"), tech: q.tech || "", desc: q.items.map((i) => i.name).join(", "), address: q.client?.address || "" }));
  const all = st.jobs.concat(fromQuotes);
  const open = (j) => !["Invoiced", "Paid"].includes(j.status);
  const show = all.filter((j) => (f === "open" ? open(j) : f === "all" ? true : j.status === f));
  const count = (s) => all.filter((j) => j.status === s).length;
  const chips = [["open", `Not finished (${all.filter(open).length})`], ...JOB_STEPS.map((s) => [s, `${s} (${count(s)})`]), ["all", "All"]];
  return `<h1 class="big-t">Jobs</h1><p class="hello" style="margin-top:-10px">Every job, from the old system and from Apex Quote. When a technician finishes, it moves to "Done, office to check". Check the time, parts and photos, then move it to "Ready to invoice".</p>
  <div class="segrow" style="margin:6px 0 14px;flex-wrap:wrap">${chips.map(([v, l]) => `<button class="${f === v ? "on" : ""}" data-act="jf" data-v="${esc(v)}">${esc(l)}</button>`).join("")}</div>
  <div class="jobcards">${show.map((j) => `<div class="card pad jobc"><div class="jh"><b>${esc(j.client || "No client")}</b><span class="pill">${esc(j.code)}</span></div>
    <small>${esc([j.date, j.time].filter(Boolean).join(" "))}${j.tech ? " · " + esc(j.tech) : ""}${j.type ? " · " + esc(j.type) : ""}</small>
    ${j.address ? `<small>${esc(j.address)}</small>` : ""}<p>${esc(String(j.desc).slice(0, 220))}</p>
    ${j.quote ? `<span class="muted">${esc(j.status)}, moves on the tablet</span>` : `<select data-js="${esc(j.code)}">${JOB_STEPS.map((s) => `<option ${s === j.status ? "selected" : ""}>${s}</option>`).join("")}</select>`}</div>`).join("") || `<p class="muted">No jobs here. Bring in the current jobs on Add new, from AroFlo.</p>`}</div>`;
}
function viewImport() {
  return `<section class="card pad" style="margin-bottom:16px"><h2 class="qh">${ICON.plus}Bring in from AroFlo</h2>
    <p class="muted" style="margin-top:-6px">Export from AroFlo as CSV, then pick the file here. Prices come in exactly as AroFlo has them, before GST.</p>
    <div class="two"><label class="filebox"><b>Stock items</b><small>InventoryItems.csv</small><input type="file" accept=".csv,text/csv" data-imp="stock"></label>
      <label class="filebox"><b>Clients</b><small>Clients.csv</small><input type="file" accept=".csv,text/csv" data-imp="clients"></label>
      <label class="filebox"><b>Current jobs</b><small>Jobs.csv</small><input type="file" accept=".csv,text/csv" data-imp="jobs"></label></div>
    ${st.stockMsg ? `<div class="okmsg" style="margin-top:12px">${ICON.tick}<span>${esc(st.stockMsg)} Press <b>Save for everyone</b> to send the stock to the tablets.</span></div>` : ""}
    ${st.clientMsg ? `<div class="okmsg" style="margin-top:12px">${ICON.tick}<span>${esc(st.clientMsg)}</span></div>` : ""}
    ${st.jobMsg ? `<div class="okmsg" style="margin-top:12px">${ICON.tick}<span>${esc(st.jobMsg)}</span></div>` : ""}</section>`;
}

/* add new equipment and materials */
function viewAdd() {
  const seg = (name, opts, cur) => `<div class="segrow">${opts.map(([v, l]) => `<button class="${cur === v ? "on" : ""}" data-act="aseg" data-n="${name}" data-v="${v}">${l}</button>`).join("")}</div>`;
  const a = (st.addH ||= { cat: "hinge", name: "", cost: "", note: "", offer: false });
  const m = (st.addM ||= { cat: "frame", name: "", cost: "", len: 6.5, size: "", kgm: "", w: 2400, h: 1200, kgm2: "" });
  const sheet = m.cat === "sheet";
  return `<h1 class="big-t">Add something new</h1>
  ${viewImport()}
  <div class="addgrid">
  <section class="card pad">
    <h2 class="qh">Equipment or a part</h2><p class="muted" style="margin-top:-6px">Motors, remotes, hinges, locks, intercoms, hire and so on.</p>
    <p class="lbl">What kind</p>${seg("h.cat", [["hinge", "Gate part"], ["motor", "Motor"], ["access", "Remote or access"], ["misc", "Travel or hire"]], a.cat)}
    <div class="fld"><label>What is it called</label><input data-add="h.name" value="${esc(a.name)}" placeholder="For example: Video intercom with 2 screens"></div>
    <div class="two"><div class="fld"><label>What it costs Apex ($, before GST)</label><input data-add="h.cost" inputmode="decimal" value="${esc(a.cost)}"></div>
      <div class="fld"><label>A short note (optional)</label><input data-add="h.note" value="${esc(a.note)}" placeholder="For example: up to 800 kg"></div></div>
    <button class="tick ${a.offer ? "on" : ""}" data-act="aoffer" style="margin-top:12px"><span class="bx">${ICON.tick}</span><span><b>Offer it on every gate</b><small>It shows in an Extras tab so the team can add it</small></span></button>
    <button class="btn red wide" style="margin-top:14px" data-act="addh">${ICON.plus}Add it</button>
  </section>
  <section class="card pad">
    <h2 class="qh">Steel, mesh or sheet</h2><p class="muted" style="margin-top:-6px">New sizes of tube, pickets, slats, posts or sheets.</p>
    <p class="lbl">What kind</p>${seg("m.cat", [["frame", "Frame tube"], ["infill", "Pickets or slats"], ["post", "Post"], ["sheet", "Mesh or sheet"]], m.cat)}
    <div class="fld"><label>What is it called</label><input data-add="m.name" value="${esc(m.name)}" placeholder="${sheet ? "For example: Perforated sheet 2400 x 1200" : "For example: SHS 75 x 75 x 3.0"}"></div>
    <div class="two"><div class="fld"><label>Cost to Apex for ${sheet ? "one sheet" : "one full length"} ($)</label><input data-add="m.cost" inputmode="decimal" value="${esc(m.cost)}"></div>
      ${sheet ? `<div class="fld"><label>Weight (kg per m², optional)</label><input data-add="m.kgm2" inputmode="decimal" value="${esc(m.kgm2)}"></div>`
        : `<div class="fld"><label>Length it comes in (metres)</label><input data-add="m.len" inputmode="decimal" value="${esc(m.len)}"></div>`}</div>
    ${sheet ? `<div class="two"><div class="fld"><label>Sheet width (mm)</label><input data-add="m.w" inputmode="decimal" value="${esc(m.w)}"></div><div class="fld"><label>Sheet height (mm)</label><input data-add="m.h" inputmode="decimal" value="${esc(m.h)}"></div></div>`
      : `<div class="two"><div class="fld"><label>Size across (mm)</label><input data-add="m.size" inputmode="decimal" value="${esc(m.size)}" placeholder="75"></div><div class="fld"><label>Weight (kg per metre, optional)</label><input data-add="m.kgm" inputmode="decimal" value="${esc(m.kgm)}"></div></div>`}
    <button class="btn red wide" style="margin-top:14px" data-act="addm">${ICON.plus}Add it</button>
  </section></div>
  <p class="muted">New steel shows up in the frame, infill and post choices. New gate types are added on the <b>Gates</b> tab.</p>`;
}

/* ---------- stock on the shelf and supplier bills ---------- */
async function loadStock() {
  st.sloading = true;
  try { const j = await api({ action: "stock-full" }); st.stock = j.stock; st.bills = j.bills || []; if (!st.quotes) st.quotes = (await api({ action: "quotes" })).list || []; } catch (e) { st.stock = { items: {}, log: [] }; st.bills = []; say(e.message); }
  st.sloading = false; render();
}
const itemName = (id) => (pb().hardware.find((h) => h.id === id) || {}).name || id;
function openJobs() { return (st.quotes || []).filter((q) => q.status === "won" && !(q.job && q.job.paid)); }
function fileData(file) {
  return new Promise((ok, bad) => {
    if (file.type === "application/pdf") { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = () => bad(new Error("Could not read that file")); r.readAsDataURL(file); return; }
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => { const k = Math.min(1, 2000 / Math.max(img.width, img.height)), c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url); ok(c.toDataURL("image/jpeg", 0.85)); };
    img.onerror = () => bad(new Error("Could not read that photo")); img.src = url;
  });
}
function viewStock() {
  if (!st.stock) return `<h1 class="big-t">Stock</h1><p class="muted">Loading the stock...</p>`;
  const items = st.stock.items || {};
  const low = Object.entries(items).filter(([, v]) => v.min > 0 && v.qty <= v.min);
  const find = (st.sfind || "").toLowerCase();
  const tracked = Object.keys(items);
  const shown = find ? pb().hardware.filter((h) => h.name.toLowerCase().includes(find) || (h.part || "").toLowerCase().includes(find)).slice(0, 40) : pb().hardware.filter((h) => tracked.includes(h.id));
  const lowCard = `<section class="card pad ${low.length ? "lowcard" : ""}"><h2 class="qh">${low.length ? ICON.warn : ICON.tick}${low.length ? `${low.length} thing${low.length === 1 ? " is" : "s are"} running low` : "Nothing is running low"}</h2>
    ${low.map(([id, v]) => `<div class="prow ro"><b>${esc(itemName(id))}</b><span class="pv">${v.qty} left, warn at ${v.min}</span></div>`).join("")}
    <p class="muted" style="margin:8px 0 0">When a technician finishes a job, the parts they used come off here. You see it as soon as something drops to its warning level.</p></section>`;
  const b = st.bill;
  const billCard = `<section class="card pad" style="margin-top:16px"><h2 class="qh">${ICON.plus}A supplier bill</h2>
    ${!b ? `<p class="muted" style="margin-top:-6px">Take a photo of the bill, or pick the PDF the supplier emailed. The helper reads every line and matches it to your stock. You check it, then save.</p>
      <div class="two"><label class="filebox"><b>Photo or PDF of the bill</b><small>${st.billBusy ? "Reading it..." : "Tap to choose"}</small><input type="file" accept="image/*,application/pdf" data-bill></label>
      <button class="filebox" data-act="billtype"><b>Type it in</b><small>No photo? Add the lines yourself</small></button></div>
      ${st.billErr ? `<div class="warn" style="margin-top:12px">${ICON.warn}<div>${esc(st.billErr)}</div></div>` : ""}`
    : `<div class="two"><div class="fld"><label>Supplier</label><input data-bf="supplier" value="${esc(b.supplier)}"></div><div class="fld"><label>Bill number</label><input data-bf="no" value="${esc(b.no)}"></div></div>
      <div class="fld" style="margin-top:10px"><label>For which job (so it counts in that job's real cost)</label><select data-bf="qid"><option value="">Not for a job, stock for the shelf</option>${openJobs().map((q) => `<option value="${q.id}" ${b.qid === q.id ? "selected" : ""}>${esc(q.no)} ${esc(q.client?.name || "")}</option>`).join("")}</select></div>
      <div class="billlines">${b.lines.map((l, n) => `<div class="bl"><div class="fld"><label>What</label><input data-bl="${n}" data-f="desc" value="${esc(l.desc)}"></div>
        <div class="fld"><label>How many</label><input data-bl="${n}" data-f="qty" inputmode="decimal" value="${l.qty}"></div>
        <div class="fld"><label>Each, before GST</label><input data-bl="${n}" data-f="unit" inputmode="decimal" value="${l.unit}"></div>
        <div class="fld"><label>Same as our item</label><select data-bl="${n}" data-f="id"><option value="">Not in our list</option>${pb().hardware.filter((h) => h.cat !== "misc").map((h) => `<option value="${h.id}" ${h.id === l.id ? "selected" : ""}>${esc(h.name)}</option>`).join("")}</select></div>
        <button class="linkbtn" data-act="billrow" data-n="${n}">${ICON.bin}</button></div>`).join("")}</div>
      <button class="btn ghost small" data-act="billadd">${ICON.plus}Another line</button>
      <p style="font-size:20px;margin:14px 0"><b>Total ${money(b.lines.reduce((a, l) => a + (+l.qty || 0) * (+l.unit || 0), 0), true)}</b> before GST</p>
      <button class="tick ${b.addStock ? "on" : ""}" data-act="billtog" data-v="addStock"><span class="bx">${ICON.tick}</span><span><b>Put it on the shelf</b><small>Adds the matched items to the stock counts</small></span></button>
      <button class="tick ${b.updateCost ? "on" : ""}" data-act="billtog" data-v="updateCost" style="margin-top:8px"><span class="bx">${ICON.tick}</span><span><b>Use these as our new costs</b><small>Updates what each matched item costs Apex</small></span></button>
      <div style="display:flex;gap:10px;margin-top:14px"><button class="btn green" data-act="billsave">${ICON.tick}Save the bill</button><button class="btn ghost" data-act="billcancel">Cancel</button></div>`}
  </section>`;
  const list = `<section class="card pad" style="margin-top:16px"><h2 class="qh">On the shelf</h2>
    <div class="pbar"><div class="fld"><input data-sfind placeholder="Search to add something to the shelf" value="${esc(st.sfind || "")}"></div></div>
    ${shown.map((h) => { const v = items[h.id]; return `<div class="prow wide"><div><b>${esc(h.name)}</b><small>${v ? (v.min > 0 && v.qty <= v.min ? "Running low" : "On the shelf") : "Not counted yet"}</small></div>
      <div class="pair"><div class="money-in"><span>count</span><input data-sq="${h.id}" inputmode="decimal" value="${v ? v.qty : ""}"></div><div class="money-in"><span>warn at</span><input data-sm="${h.id}" inputmode="decimal" value="${v ? v.min : ""}"></div></div></div>`; }).join("") || `<p class="muted">${find ? "Nothing matches." : "Nothing counted yet. Search above for the motors, wheels and rollers you keep, and type how many you have."}</p>`}</section>`;
  const bills = (st.bills || []).length ? `<section class="card pad" style="margin-top:16px"><h2 class="qh">Recent bills</h2>${st.bills.slice(0, 15).map((x) => `<div class="prow ro"><div><b>${esc(x.supplier || "Supplier")} ${esc(x.no)}</b><small>${new Date(x.at).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}${x.job ? " · " + esc(x.job) : ""}</small></div><span class="pv">${money(x.total, true)}</span></div>`).join("")}</section>` : "";
  return `<h1 class="big-t">Stock</h1>${lowCard}${billCard}${list}${bills}`;
}
async function readBillFile(file) {
  st.billBusy = true; st.billErr = ""; render();
  try {
    const data = await fileData(file);
    const j = await api({ action: "bill-read", file: data, stock: pb().hardware.filter((h) => h.cat !== "misc").map((h) => ({ id: h.id, name: h.name, part: h.part || "" })) });
    st.bill = { ...j.bill, addStock: true, updateCost: false };
  } catch (e) { st.billErr = e.message; }
  st.billBusy = false; render();
}

/* kits: set up once, every part can still be changed on a quote */
const kitSell = (x) => {
  const p = pb(), up = (c) => 1 + ((p.markup || {})[c] || 0) / 100;
  if (x.kind === "hours") { const l = p.labour.find((l) => l.id === x.id); return l ? (l.sell > 0 ? l.sell : l.rate * up("labour")) : 0; }
  const h = p.hardware.find((h) => h.id === x.id); if (!h) return 0;
  return h.sell > 0 ? h.sell : h.cost * up(h.cat === "motor" || h.cat === "access" ? "motors" : "hardware");
};
function viewKits() {
  const kits = (pb().kits ||= []);
  if (st.kit) return viewKitEditor(kits.find((k) => k.id === st.kit));
  return `<h1 class="big-t">Kits</h1><p class="hello" style="margin-top:-10px">A kit is a package you sell often, like a motor with remotes, keypad and beams. The team adds it to a quote with one tap, then takes out or adds anything for that job.</p>
  <button class="btn red" data-act="kitnew" style="margin-bottom:16px">${ICON.plus}Make a new kit</button>
  <div class="gtypes">${kits.map((k) => {
    const total = (k.items || []).reduce((a, x) => a + kitSell(x) * (+x.qty || 0), 0);
    return `<div class="card gtype"><div class="gx"><b>${esc(k.name)}</b><small>${esc(k.note || "")}</small>
      <small>${(k.items || []).length} things · ${money(total)} before GST</small>
      <div style="display:flex;gap:8px;margin-top:10px"><button class="btn ghost small" data-act="kitedit" data-id="${k.id}">${ICON.pen}Change</button><button class="btn ghost small" data-act="kitdel" data-id="${k.id}">${ICON.bin}Delete</button></div></div></div>`;
  }).join("") || `<p class="muted">No kits yet.</p>`}</div>`;
}
function viewKitEditor(k) {
  if (!k) { st.kit = null; return viewKits(); }
  const p = pb();
  const opts = (x) => x.kind === "hours"
    ? p.labour.map((l) => `<option value="${l.id}" ${l.id === x.id ? "selected" : ""}>${esc(l.name)}</option>`).join("")
    : [["motor", "Motors"], ["access", "Remotes and access"], ["part", "Parts"], ["misc", "Service and travel"]].map(([c, lab]) => `<optgroup label="${lab}">${p.hardware.filter((h) => (c === "part" ? !["motor", "access", "misc"].includes(h.cat) : h.cat === c)).map((h) => `<option value="${h.id}" ${h.id === x.id ? "selected" : ""}>${esc(h.name)}</option>`).join("")}</optgroup>`).join("");
  const total = k.items.reduce((a, x) => a + kitSell(x) * (+x.qty || 0), 0);
  return `<button class="btn ghost small" data-act="kitback" style="margin-bottom:14px">${ICON.back}All kits</button>
  <h1 class="big-t">${esc(k.name || "New kit")}</h1>
  <section class="card pad"><div class="two"><div class="fld"><label>Name the team sees</label><input data-kit="name" value="${esc(k.name)}"></div>
    <div class="fld"><label>Short note</label><input data-kit="note" value="${esc(k.note || "")}" placeholder="For example: motor, 2 remotes, keypad and beams"></div></div>
    <p class="lbl" style="margin-top:16px">What is in it</p>
    ${k.items.map((x, n) => `<div class="partrow"><select data-ki="${n}" data-f="id">${opts(x)}</select>
      <input data-ki="${n}" data-f="qty" inputmode="decimal" value="${x.qty}" style="width:90px"><span class="muted">${x.kind === "hours" ? "hours" : "x"} · ${money(kitSell(x) * (+x.qty || 0))}</span>
      <button class="linkbtn" data-act="kitrow" data-n="${n}">${ICON.bin}</button></div>`).join("")}
    <div style="display:flex;gap:8px;margin-top:12px"><button class="btn ghost small" data-act="kitadd" data-v="item">${ICON.plus}A part</button><button class="btn ghost small" data-act="kitadd" data-v="hours">${ICON.plus}Time</button></div>
    <div class="okmsg" style="margin-top:16px">${ICON.tick}The customer pays ${money(total)} before GST for the whole kit.</div>
  </section>
  <button class="btn green wide" data-act="kitback" style="margin-top:14px">${ICON.tick}Done. Press Save for everyone at the bottom when you are finished</button>`;
}

/* gate types */
function card(t) {
  const pic = t.draw !== "none" ? drawItem(t, runItem(t, defaults(t), pb()), pb()) : "";
  return `<div class="card gtype ${t.hidden ? "off" : ""}"><div class="pp">${pic}</div><div class="gx"><b>${esc(t.name)}</b><small>${t.custom ? "Added by the office" : "Built in"}${t.hidden ? " · hidden from the team" : ""}</small>
    <div class="acts"><button class="btn ghost small" data-act="hidegate" data-id="${t.id}">${t.hidden ? ICON.eye + "Show it" : ICON.hide + "Hide it"}</button>
    ${t.custom ? `<button class="btn dark small" data-act="editgate" data-id="${t.id}">${ICON.pen}Change</button><button class="btn ghost small" data-act="delgate" data-id="${t.id}">${ICON.bin}Delete</button>` : `<button class="btn ghost small" data-act="newgate" data-base="${t.id}">${ICON.plus}Make a version</button>`}</div></div></div>`;
}
function viewGates() {
  const all = tpls();
  return `<h1 class="big-t">Gates and other things to quote</h1>
  <p class="hello" style="margin-top:-10px">Add your own gate types with their own sizes, look and parts, or hide ones the team does not use.</p>
  <button class="btn red" data-act="newgate" data-base="swing" style="margin:6px 0 20px">${ICON.plus}Add a new gate type</button>
  ${all.some((t) => t.custom) ? `<h2 class="sub-t">Added by the office</h2><div class="gtypes">${all.filter((t) => t.custom).map(card).join("")}</div>` : ""}
  <h2 class="sub-t">Built in</h2><div class="gtypes">${all.filter((t) => !t.custom).map(card).join("")}</div>`;
}
function field(i, v) {
  if (i.type === "num") return `<div class="fld"><label>${esc(i.label)}${i.unit ? ` (${esc(i.unit)})` : ""}</label><input data-gd="${i.k}" data-type="num" inputmode="decimal" value="${v}"></div>`;
  if (i.type === "seg") return `<div class="fld"><label>${esc(i.label)}</label><select data-gd="${i.k}" data-type="${typeof i.def === "number" ? "num" : "str"}">${i.opts.map(([o, l]) => `<option value="${esc(o)}" ${o == v ? "selected" : ""}>${esc(l)}</option>`).join("")}</select></div>`;
  if (i.type === "mat") return `<div class="fld"><label>${esc(i.label)}</label><select data-gd="${i.k}" data-type="str">${pb().materials.filter((m) => m.cat === i.filter).map((m) => `<option value="${m.id}" ${m.id === v ? "selected" : ""}>${esc(m.name)}</option>`).join("")}</select></div>`;
  if (i.type === "bool") return `<div class="fld"><label>${esc(i.label)}</label><select data-gd="${i.k}" data-type="num"><option value="1" ${+v ? "selected" : ""}>Yes</option><option value="0" ${+v ? "" : "selected"}>No</option></select></div>`;
  if (i.type === "text") return `<div class="fld"><label>${esc(i.label)}</label><input data-gd="${i.k}" data-type="str" value="${esc(v)}"></div>`;
  return "";
}
function viewGateEditor() {
  const g = st.gate, base = TEMPLATES.find((t) => t.id === g.base);
  const preview = buildTemplates(TEMPLATES, pb(), { custom: [{ ...g, id: "preview" }] }).find((t) => t.id === "preview");
  let pic = "", priceTxt = "";
  if (preview) {
    const P = priceQuote({ items: [{ id: "p", tpl: "preview", values: defaults(preview) }], discount: 0 }, [preview], pb());
    pic = preview.draw !== "none" ? drawItem(preview, P.lines[0]?.r, pb()) : "";
    priceTxt = money((P.lines[0]?.sell || 0) * (1 + pb().settings.gst / 100));
  }
  const bases = TEMPLATES.filter((t) => t.kind === "gate" || t.kind === "fence");
  return `<button class="btn ghost small" data-act="closegate" style="margin-bottom:14px">${ICON.back}Back to the list</button>
  <h1 class="big-t">${g.isNew ? "New gate type" : "Change gate type"}</h1>
  <div class="gedit">
    <div class="gprev card"><div class="grid">${pic}</div><div class="pricebar"><div><small>Price at these sizes, with GST</small><b>${priceTxt}</b></div></div></div>
    <div>
      <section class="card pad"><h2 class="qh">Name</h2>
        <div class="fld"><label>What the team sees</label><input data-g="name" value="${esc(g.name)}" placeholder="For example: Pool gate 1200"></div>
        <div class="fld" style="margin-top:10px"><label>One line about it</label><input data-g="blurb" value="${esc(g.blurb)}" placeholder="For example: Self closing, pool safe"></div>
        <p class="lbl">It is a kind of</p><div class="segrow">${bases.map((t) => `<button class="${g.base === t.id ? "on" : ""}" data-act="gbase" data-v="${t.id}">${esc(t.name)}</button>`).join("")}</div>
      </section>
      <section class="card pad"><h2 class="qh">Starting sizes and look</h2><p class="muted" style="margin-top:-6px">The team can still change these on each quote.</p>
        <div class="two">${base.inputs.map((i) => field(i, g.defaults[i.k] ?? i.def)).join("")}</div></section>
      <section class="card pad"><h2 class="qh">Parts that always come with it</h2><p class="muted" style="margin-top:-6px">On top of the usual parts for a ${esc(base.name.toLowerCase())}.</p>
        ${(g.parts || []).map((x, n) => `<div class="partrow"><select data-part="${n}" data-f="id">${pb().hardware.map((h) => `<option value="${h.id}" ${h.id === x.id ? "selected" : ""}>${esc(h.name)} (${money(h.cost)})</option>`).join("")}</select>
          <input data-part="${n}" data-f="qty" inputmode="decimal" value="${x.qty}" aria-label="How many"><button class="linkbtn" data-act="delpart" data-n="${n}">${ICON.bin}</button></div>`).join("") || `<p class="muted">None yet.</p>`}
        <button class="btn ghost small" data-act="addpart">${ICON.plus}Add a part</button>
        <div class="two" style="margin-top:16px"><div class="fld"><label>Extra hours on site</label><input data-g="hours" inputmode="decimal" value="${g.hours || 0}"></div><div class="fld"><label>Extra hours in the workshop</label><input data-g="shopHours" inputmode="decimal" value="${g.shopHours || 0}"></div></div>
      </section>
      <button class="btn green wide" data-act="keepgate">${ICON.tick}${g.isNew ? "Add this gate type" : "Keep these changes"}</button>
    </div>
  </div>`;
}

/* company details and history */
function viewCompany() {
  const s = pb().settings;
  const f = (k, label, type = "text") => `<div class="fld"><label>${label}</label><input data-set="${k}" data-type="${type}" ${type === "num" ? 'inputmode="decimal"' : ""} value="${esc(s[k])}"></div>`;
  return `<h1 class="big-t">Company and quote details</h1>
  <section class="card pad"><h2 class="qh">On every quote</h2><div class="two">${f("company", "Company name")}${f("abn", "ABN")}${f("phone", "Phone")}${f("email", "Email")}${f("web", "Website")}${f("address", "Address")}</div>
    <div class="fld" style="margin-top:12px"><label>Terms at the bottom of the quote</label><textarea data-set="terms" data-type="text" rows="4">${esc(s.terms)}</textarea></div></section>
  <section class="card pad" style="margin-top:16px"><h2 class="qh">Numbers</h2><div class="two">${f("gst", "GST %", "num")}${f("deposit", "Deposit asked for %", "num")}${f("validity", "Quote is good for (days)", "num")}${f("minMargin", "Warn when Apex makes under %", "num")}${f("maxDisc", "Most discount a technician can give %", "num")}${f("round", "Round totals to the nearest $", "num")}${f("kerf", "Saw cut (mm)", "num")}${f("invoiceDays", "Invoices are due in (days)", "num")}</div>
    <div class="two" style="margin-top:12px">${f("payCard", "Card payment link (from Square or Stripe)")}${f("payPaypal", "PayPal.me link (for example https://paypal.me/apexgates)")}${f("payLater", "Pay over time link (Afterpay or Zip, through Square or Stripe)")}</div>
    <p class="muted" style="margin:6px 0 0">These show as Pay buttons on the link the customer gets. Leave one empty to hide it.</p>
    <div class="fld" style="margin-top:12px"><label>How customers pay (printed on every invoice, for example bank name, BSB and account)</label><textarea data-set="payHow" data-type="text" rows="3">${esc(s.payHow)}</textarea></div></section>
  <section class="card pad" style="margin-top:16px"><h2 class="qh">Sample data</h2><p class="muted" style="margin-top:-6px">The sample jobs (customers named "Sample:"), the sample supplier bill and the sample shelf counts were put in to show how everything works. Remove them before the team starts using it for real.</p>
    <button class="btn ghost small" data-act="clearsamples">${ICON.bin}Remove the sample data</button></section>
  <section class="card pad" style="margin-top:16px"><h2 class="qh">${ICON.undo}Undo a save</h2><p class="muted" style="margin-top:-6px">Every save is kept. Go back to an earlier one if something went wrong.</p>
    ${st.history ? (st.history.length ? `<div class="hist">${st.history.map((n) => `<div class="prow ro"><b>${esc(histDate(n))}</b><button class="btn ghost small" data-act="restore" data-n="${esc(n)}">Go back to this</button></div>`).join("")}</div>` : `<p class="muted">No earlier saves yet.</p>`) : `<button class="btn ghost small" data-act="history">Show earlier saves</button>`}
  </section>
  <section class="card pad" style="margin-top:16px"><h2 class="qh">More</h2><div style="display:flex;gap:10px;flex-wrap:wrap">
    <a class="btn ghost small" href="full.html" style="text-decoration:none">Full tool (cut lists and formulas)</a>
    <button class="btn ghost small" data-act="logout">${ICON.lock}Sign out of the CEO dashboard on this device</button></div></section>`;
}
const histDate = (n) => { const m = n.match(/^(\d{4})-(\d\d)-(\d\d)T(\d\d)-(\d\d)/); return m ? new Date(Date.UTC(+m[1], m[2] - 1, +m[3], +m[4], +m[5])).toLocaleString("en-AU", { weekday: "short", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" }) : n; };

/* ---------- actions ---------- */
document.addEventListener("change", async (e) => {
  const el = e.target;
  if (el.dataset && el.dataset.bill !== undefined && el.files && el.files[0]) { readBillFile(el.files[0]); return; }
  if (el.dataset && el.dataset.bf) { st.bill[el.dataset.bf] = el.value; return; }
  if (el.dataset && el.dataset.js) {
    const j = st.jobs.find((x) => x.code === el.dataset.js); if (j) j.status = el.value;
    try { await api({ action: "job-status", code: el.dataset.js, status: el.value }); say("Moved to " + el.value); } catch (e) { say(e.message); }
    render(); return;
  }
  if (el.dataset && el.dataset.bl) { const l = st.bill.lines[+el.dataset.bl]; l[el.dataset.f] = el.dataset.f === "qty" || el.dataset.f === "unit" ? parseFloat(el.value) || 0 : el.value; render(); return; }
  if (el.dataset && (el.dataset.sq || el.dataset.sm)) {
    const id = el.dataset.sq || el.dataset.sm, v = el.value.trim() === "" ? null : parseFloat(el.value) || 0;
    try { const j = await api({ action: "stock-set", id, qty: el.dataset.sq ? v : undefined, min: el.dataset.sm ? v : undefined }); st.stock.items = j.items; say("Saved"); } catch (e) { say(e.message); }
    render(); return;
  }
  if (el.dataset && (el.dataset.kit || el.dataset.ki)) {
    const k = pb().kits.find((k) => k.id === st.kit); if (!k) return;
    if (el.dataset.kit) k[el.dataset.kit] = el.value;
    else { const x = k.items[+el.dataset.ki]; if (el.dataset.f === "qty") x.qty = Math.max(0, parseFloat(el.value) || 0); else x.id = el.value; }
    changed(); render(); return;
  }
  if (!el.dataset || !el.dataset.imp || !el.files || !el.files[0]) return;
  const rows = parseCSV(await el.files[0].text());
  if (el.dataset.imp === "stock") importStock(rows); else if (el.dataset.imp === "jobs") importJobs(rows); else importClients(rows);
});
document.addEventListener("click", async (e) => {
  const b = e.target.closest("[data-act]"); if (!b) return;
  const a = b.dataset.act;
  if (a === "tab") { st.tab = b.dataset.v; st.gate = null; render(); scrollTo(0, 0); }
  if (a === "login") {
    try { await api({ action: "login", password: $("#opw").value }); st.err = ""; await load(); } catch (err) { st.err = err.message; render(); }
  }
  if (a === "logout") { await api({ action: "logout" }).catch(() => {}); location.href = "index.html"; }
  if (a === "shelf") { st.shelf = b.dataset.v; st.find = ""; render(); }
  if (a === "billtype") { st.bill = { supplier: "", no: "", date: "", qid: "", lines: [{ desc: "", qty: 1, unit: 0, id: "" }], addStock: true, updateCost: false }; render(); }
  if (a === "billadd") { st.bill.lines.push({ desc: "", qty: 1, unit: 0, id: "" }); render(); }
  if (a === "billrow") { st.bill.lines.splice(+b.dataset.n, 1); render(); }
  if (a === "billtog") { st.bill[b.dataset.v] = !st.bill[b.dataset.v]; render(); }
  if (a === "billcancel") { st.bill = null; render(); }
  if (a === "billsave") {
    const bl = st.bill, q = (st.quotes || []).find((x) => x.id === bl.qid);
    try {
      const j = await api({ action: "bill-save", addStock: bl.addStock, bill: { ...bl, job: q ? `${q.no} ${q.client?.name || ""}`.trim() : "" } });
      if (bl.updateCost) { let n = 0; for (const l of bl.lines) { const h = pb().hardware.find((h) => h.id === l.id); if (h && +l.unit > 0) { h.cost = +l.unit; n++; } } if (n) changed(); }
      st.bill = null; st.stock = null; st.quotes = null; say(bl.updateCost ? "Bill saved. Press Save for everyone to send the new costs" : "Bill saved"); render();
    } catch (e) { say(e.message); }
  }
  if (a === "kitnew") { const k = { id: "k" + uid(), name: "New kit", note: "", items: [] }; (pb().kits ||= []).push(k); st.kit = k.id; changed(); render(); }
  if (a === "kitedit") { st.kit = b.dataset.id; render(); scrollTo(0, 0); }
  if (a === "kitback") { st.kit = null; render(); scrollTo(0, 0); }
  if (a === "kitdel" && confirm("Delete this kit? Quotes already made keep their prices.")) { pb().kits = pb().kits.filter((k) => k.id !== b.dataset.id); changed(); render(); }
  if (a === "kitadd") { const k = pb().kits.find((k) => k.id === st.kit); k.items.push(b.dataset.v === "hours" ? { kind: "hours", id: "install", qty: 1 } : { kind: "item", id: pb().hardware[0].id, qty: 1 }); changed(); render(); }
  if (a === "kitrow") { const k = pb().kits.find((k) => k.id === st.kit); k.items.splice(+b.dataset.n, 1); changed(); render(); }
  if (a === "qf") { st.qfilter = b.dataset.v; render(); }
  if (a === "jf") { st.jfilter = b.dataset.v; render(); }
  if (a === "clearsamples" && confirm("Remove all the sample jobs, the sample bill and the sample shelf counts?")) {
    try { const j = await api({ action: "samples-clear" }); st.quotes = null; st.stock = null; st.bills = null; st.learn = null; st.lloading = false; say(`Removed ${j.removed} sample jobs and the sample stock`); } catch (e) { say(e.message); }
  }
  if (a === "qreload") { st.quotes = null; st.learn = null; st.lloading = false; render(); }
  if (a === "rise") {
    const p = parseFloat(prompt("By how much did these prices go up? Type a number, for example 5 for 5%", "5"));
    if (!p) return;
    const sh = SHELVES.find((s) => s[0] === st.shelf);
    sh[2](pb()).forEach((x) => (x[sh[4]] = Math.round(x[sh[4]] * (1 + p / 100) * 100) / 100));
    changed(); render(); say(`${sh[1]} up ${p}%. Press Save for everyone to keep it`);
  }
  if (a === "offer") { const h = byId(pb().hardware, b.dataset.id); h.offer = !h.offer; changed(); render(); }
  if (a === "remove" && confirm("Remove this from the price list?")) { pb()[b.dataset.list] = pb()[b.dataset.list].filter((x) => x.id !== b.dataset.id); changed(); render(); }
  if (a === "aseg") { const [o, k] = b.dataset.n.split("."); (o === "h" ? st.addH : st.addM)[k] = b.dataset.v; render(); }
  if (a === "aoffer") { st.addH.offer = !st.addH.offer; render(); }
  if (a === "addh") {
    const h = st.addH, cost = parseFloat(h.cost);
    if (!h.name.trim() || isNaN(cost)) return say("Please fill in the name and the cost");
    pb().hardware.push({ id: "x" + uid(), cat: h.cat, name: h.name.trim(), cost, note: h.note.trim(), offer: h.offer, added: true });
    st.addH = null; changed(); st.tab = "prices"; st.shelf = { motor: "motors", access: "motors", misc: "site" }[h.cat] || "parts"; render(); scrollTo(0, document.body.scrollHeight); say(`${h.name} added. Press Save for everyone to keep it`);
  }
  if (a === "addm") {
    const m = st.addM, cost = parseFloat(m.cost);
    if (!m.name.trim() || isNaN(cost)) return say("Please fill in the name and the cost");
    const id = "m" + uid();
    if (m.cat === "sheet") pb().materials.push({ id, cat: "sheet", name: m.name.trim(), w: +m.w || 2400, h: +m.h || 1200, kgm2: +m.kgm2 || 5, cost, sheet: true, added: true });
    else {
      const dim = +m.size || 50;
      pb().materials.push({ id, cat: m.cat, name: m.name.trim(), dim, perim: dim * 4, kgm: +m.kgm || Math.round(dim * 0.06 * 100) / 100, stock: Math.round((+m.len || 6.5) * 1000), cost, added: true });
    }
    st.addM = null; changed(); st.tab = "prices"; st.shelf = m.cat === "sheet" ? "sheet" : "steel"; render(); scrollTo(0, document.body.scrollHeight); say(`${m.name} added. Press Save for everyone to keep it`);
  }
  if (a === "hidegate") {
    const h = new Set(st.work.gates.hidden || []); h.has(b.dataset.id) ? h.delete(b.dataset.id) : h.add(b.dataset.id);
    st.work.gates.hidden = [...h]; changed(); render();
  }
  if (a === "newgate") { const base = TEMPLATES.find((t) => t.id === b.dataset.base); st.gate = { isNew: true, id: "g" + uid(), name: "", blurb: "", base: base.id, defaults: {}, parts: [], hours: 0, shopHours: 0 }; render(); scrollTo(0, 0); }
  if (a === "editgate") { st.gate = clone(st.work.gates.custom.find((g) => g.id === b.dataset.id)); render(); scrollTo(0, 0); }
  if (a === "delgate" && confirm("Delete this gate type? Quotes that already use it will lose it.")) { st.work.gates.custom = st.work.gates.custom.filter((g) => g.id !== b.dataset.id); changed(); render(); }
  if (a === "closegate") { st.gate = null; render(); }
  if (a === "gbase") { st.gate.base = b.dataset.v; st.gate.defaults = {}; render(); }
  if (a === "addpart") { st.gate.parts.push({ id: pb().hardware[0].id, qty: 1 }); render(); }
  if (a === "delpart") { st.gate.parts.splice(+b.dataset.n, 1); render(); }
  if (a === "keepgate") {
    const g = st.gate;
    if (!g.name.trim()) return say("Please give the gate type a name");
    const list = st.work.gates.custom || (st.work.gates.custom = []);
    const clean = { id: g.id, name: g.name.trim(), blurb: g.blurb.trim(), base: g.base, defaults: g.defaults, parts: g.parts.filter((x) => +x.qty > 0), hours: +g.hours || 0, shopHours: +g.shopHours || 0 };
    const at = list.findIndex((x) => x.id === g.id); at >= 0 ? (list[at] = clean) : list.push(clean);
    st.gate = null; changed(); render(); scrollTo(0, 0); say(`${clean.name} ready. Press Save for everyone to keep it`);
  }
  if (a === "history") { try { st.history = (await api({ action: "history" })).list; } catch (err) { say(err.message); st.history = []; } render(); }
  if (a === "restore" && confirm("Go back to this save? It replaces the prices and gates everyone uses.")) {
    try { const j = await api({ action: "restore", name: b.dataset.n }); st.work = { pb: mergePricebook(j.data.pb, PRICEBOOK), gates: j.data.gates || { custom: [], hidden: [] } }; st.updated = j.data.updated; st.dirty = false; st.history = null; render(); say("Done. Everyone now has that version"); }
    catch (err) { say(err.message); }
  }
  if (a === "save") {
    st.saving = true; renderBar();
    try { const j = await api({ action: "save", data: { pb: pb(), gates: st.work.gates } }); st.updated = j.updated; st.dirty = false; say("Saved. Every tablet will use these now"); }
    catch (err) { say("Could not save: " + err.message); }
    st.saving = false; renderBar();
  }
});
document.addEventListener("change", (e) => {
  const el = e.target, num = (v) => { const n = parseFloat(v); return isNaN(n) ? null : n; };
  if (el.dataset.list) { const x = byId(pb()[el.dataset.list], el.dataset.id), v = num(el.value); if (x && v !== null) { x[el.dataset.f] = v; changed(); } }
  if (el.dataset.mk) { const v = num(el.value); if (v !== null) { pb().markup[el.dataset.mk] = v; changed(); } }
  if (el.dataset.set) { const v = el.dataset.type === "num" ? num(el.value) : el.value; if (v !== null) { pb().settings[el.dataset.set] = v; changed(); } }
  if (el.dataset.gd) { st.gate.defaults[el.dataset.gd] = el.dataset.type === "num" ? num(el.value) ?? 0 : el.value; render(); }
  if (el.dataset.part) { const x = st.gate.parts[+el.dataset.part]; x[el.dataset.f] = el.dataset.f === "qty" ? num(el.value) ?? 0 : el.value; render(); }
  if (el.dataset.g && ["hours", "shopHours"].includes(el.dataset.g)) render();
});
document.addEventListener("input", (e) => {
  const el = e.target;
  if (el.dataset.add) { const [o, k] = el.dataset.add.split("."); (o === "h" ? st.addH : st.addM)[k] = el.value; }
  if (el.dataset.g) st.gate[el.dataset.g] = el.value;
  if (el.matches("[data-sfind]")) { st.sfind = el.value; const pos = el.selectionStart; render(); const n = $("[data-sfind]"); n.focus(); n.setSelectionRange(pos, pos); }
  if (el.matches("[data-find]")) { st.find = el.value; const pos = el.selectionStart; render(); const n = $("[data-find]"); n.focus(); n.setSelectionRange(pos, pos); }
});
document.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.id === "opw") $("[data-act=login]").click(); });
window.addEventListener("beforeunload", (e) => { if (st.dirty) { e.preventDefault(); e.returnValue = ""; } });

render();
load();
