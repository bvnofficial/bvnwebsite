/* Apex Quote: the internal quoting tool for Apex Gates technicians.
   Everything is saved on this device as it changes; the price book and the
   formulas are shared by every quote on the device and can be exported. */
import { PRICEBOOK, TEMPLATES, VERSION } from "./data.js";
import { runItem, priceQuote, defaults, money, fmtNum, byId, evaluate } from "./engine.js";
import { drawItem } from "./draw.js";

const KEY = "apexq.v1";
const $ = (s, el = document) => el.querySelector(s);
const clone = (o) => JSON.parse(JSON.stringify(o));
const uid = () => Math.random().toString(36).slice(2, 10);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const dateStr = (t) => new Date(t).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });

/* ---------- storage ---------- */
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
  } catch (e) { /* fall through to a fresh start */ }
  return fresh();
}
let db = load();
let saveT;
function save() {
  const q = Q(); if (q) q.updated = Date.now();
  clearTimeout(saveT);
  saveT = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(db)); const s = $("#saved"); s.classList.add("on"); clearTimeout(s.t); s.t = setTimeout(() => s.classList.remove("on"), 1200); }
    catch (e) { toast("Could not save on this device"); }
  }, 250);
}
const Q = () => db.quotes.find((q) => q.id === db.current) || db.quotes[0];
const tplOf = (id) => db.templates.find((t) => t.id === id);
const price = (q = Q()) => priceQuote(q, db.templates, db.pb);
function toast(t) { const el = $("#toast"); el.textContent = t; el.classList.add("on"); clearTimeout(el.t); el.t = setTimeout(() => el.classList.remove("on"), 2400); }

/* ---------- ui state ---------- */
const ui = { tab: "build", book: "materials", search: "", fTpl: "swing", qSearch: "" };
const CATS = { materials: ["Materials", "#3a3b3f"], hardware: ["Hardware", "#8d8e94"], motors: ["Motors and access", "#d61d09"], labour: ["Labour", "#e8a33a"], finish: ["Finish", "#5b7fa6"], other: ["Other", "#b9b8b2"] };
const ICON = {
  swing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 20V5M21 20V5M3 7h8.5v12H3M12.5 7H21v12h-8.5M6 7v12M9 7v12M15 7v12M18 7v12"/></svg>',
  slide: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 20h20M4 6h13v12H4zM7 6v12M10 6v12M13 6v12M19 12h3m-1.5-1.5L22 12l-1.5 1.5"/></svg>',
  cant: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 20h20M2 6h16v10H2zM2 16l4 3M18 16l-4 3M6 6v10M10 6v10M14 6v10"/></svg>',
  bifold: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 20V5M21 20V5M3 7l4 1v11l-4-1M7 8l4-1v12l-4 0M13 7l4 1v11l-4 0M17 8l4-1v12"/></svg>',
  ped: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 20V4M19 20V4M7 6h10v13H7zM10 6v13M14 6v13M15.5 12h.01"/></svg>',
  fence: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 20h20M4 20V5M12 20V5M20 20V5M4 9h16M4 16h16M7 9v7M9.5 9v7M14.5 9v7M17 9v7"/></svg>',
  posts: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 18h20M6 4h3v17H6zM15 4h3v17h-3zM5 4h5M14 4h5"/></svg>',
  auto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="7" width="12" height="10" rx="2"/><path d="M16 12h5M8 11h4M8 14h2M20 8v8"/></svg>',
  site: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 18h18M5 18V9l4-3 4 3v9M15 18v-6h4v6M8 12h2"/></svg>',
  custom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5v14M5 12h14"/><rect x="3" y="3" width="18" height="18" rx="4"/></svg>',
};
const SVG = {
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>',
  bin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 15l6-6 6 6"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6"/></svg>',
  cut: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.1 15.9M14.5 14.5L20 20M8.1 8.1L12 12"/></svg>',
  print: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V3h12v6M6 18H4v-7h16v7h-2M7 14h10v7H7z"/></svg>',
  pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
};

/* which group each input sits in on the editor, and when it is hidden */
const GROUP = {
  W: "Size", H: "Size", L: "Size", dir: "Size", tailPct: "Size", Len: "Size", pierH: "Size", wallH: "Size", bay: "Size", ends: "Size", qty: "Size", above: "Size",
  frame: "Build", bottom: "Build", mid: "Build", rails: "Build", hinge: "Build", lock: "Build",
  infill: "Infill", inMat: "Infill", gap: "Infill",
  posts: "Posts", catchPosts: "Posts", postMat: "Posts", postAbove: "Posts", mount: "Posts", embed: "Posts",
  guides: "Sliding hardware", catchBr: "Sliding hardware",
  auto: "Automation", motor: "Automation", remotes: "Automation", eyes: "Automation", keypad: "Automation", solar: "Automation", battery: "Automation", intercom: "Automation", loop: "Automation", hrs: "Automation",
  finish: "Finish and install", colour: "Finish and install", crew: "Finish and install",
};
function visible(tpl, inp, v) {
  if (["inMat", "gap"].includes(inp.k)) return !["mesh", "sheet"].includes(v.infill);
  if (inp.k === "embed") return v.mount === "ground";
  if (["remotes", "eyes", "keypad", "solar", "battery"].includes(inp.k) && tpl.id !== "auto") {
    const m = v.auto ?? v.motor; return m !== "none";
  }
  if (inp.k === "colour") return v.finish === "powder" || v.finish === "duplex";
  return true;
}

/* ---------- tabs ---------- */
function setTab(t) {
  ui.tab = t;
  document.querySelectorAll(".tabs button").forEach((b) => b.classList.toggle("on", b.dataset.tab === t));
  document.querySelectorAll(".view").forEach((v) => v.classList.toggle("on", v.id === "v-" + t));
  render();
  window.scrollTo({ top: 0 });
}
function render() {
  const q = Q();
  $("#qnoTop").textContent = q.no;
  $("#qclient").textContent = q.client.name || "New quote";
  ({ build: renderBuild, cuts: renderCuts, quote: renderDoc, book: renderBook, formulas: renderFormulas, quotes: renderQuotes })[ui.tab]();
  renderMob();
}

/* ---------- BUILD ---------- */
function renderBuild() {
  const q = Q(), P = price(q);
  if (q.items.length && !q.items.find((i) => i.id === q.sel)) q.sel = q.items[0].id;
  $("#v-build").innerHTML = `
  <aside class="card pad sticky job">
    <p class="sec-t">Job</p>
    <input data-c="name" placeholder="Client name" value="${esc(q.client.name)}" autocomplete="off">
    <div class="two"><input data-c="phone" placeholder="Phone" inputmode="tel" value="${esc(q.client.phone)}"><input data-c="email" placeholder="Email" inputmode="email" value="${esc(q.client.email)}"></div>
    <input data-c="address" placeholder="Site address" value="${esc(q.client.address)}">
    <input data-q="tech" placeholder="Quoted by" value="${esc(q.tech)}" list="techs">
    <datalist id="techs">${[...new Set(db.quotes.map((x) => x.tech).filter(Boolean))].map((t) => `<option value="${esc(t)}">`).join("")}</datalist>
    <p class="sec-t" style="margin-top:14px">Items on this quote</p>
    <div class="items" id="itemsList">${htmlItems(q, P)}</div>
    <p class="sec-t" style="margin-top:16px">Add</p>
    <div class="add">${db.templates.map((t) => `<button data-act="add" data-tpl="${t.id}">${ICON[t.id] || ICON.custom}${esc(t.name)}</button>`).join("")}</div>
  </aside>
  <section class="card" id="editor">${htmlEditor(q, P)}</section>
  <aside class="sum card sticky" id="sum">${htmlSummary(q, P)}</aside>`;
}
function htmlItems(q, P) {
  if (!q.items.length) return `<div class="empty">Nothing on this quote yet. Add a gate, fence or posts below.</div>`;
  return q.items.map((it) => {
    const l = P.lines.find((x) => x.id === it.id), t = tplOf(it.tpl);
    const flag = l && (l.r.warnings.length || l.r.errors.length) ? `<span class="flag">${l.r.errors.length ? "Formula error" : l.r.warnings.length + " check" + (l.r.warnings.length > 1 ? "s" : "")}</span>` : `<span>${esc(cap(l?.desc || ""))}</span>`;
    return `<button class="it ${it.id === q.sel ? "on" : ""}" data-act="sel" data-id="${it.id}"><div class="ic">${ICON[it.tpl] || ICON.custom}</div><div><b>${esc(it.name || t?.name)}</b>${flag}</div><em>${money(l?.sell)}</em></button>`;
  }).join("");
}
function htmlEditor(q, P) {
  const it = q.items.find((i) => i.id === q.sel);
  if (!it) {
    return `<div class="pad" style="padding:40px 28px;text-align:center">
      <h2 style="font-size:26px">Start with the gate</h2>
      <p class="small" style="max-width:460px;margin:8px auto 22px;font-size:14px">Pick what you are quoting. Every size, post and part is worked out as you go, with the cut list, the material order and the price ready at the end.</p>
      <div class="add" style="max-width:520px;margin:0 auto">${db.templates.slice(0, 6).map((t) => `<button data-act="add" data-tpl="${t.id}" style="padding:16px">${ICON[t.id]}${esc(t.name)}</button>`).join("")}</div></div>`;
  }
  const tpl = tplOf(it.tpl), l = P.lines.find((x) => x.id === it.id);
  const groups = {};
  for (const inp of tpl.inputs) {
    if (!visible(tpl, inp, it.values)) continue;
    const g = GROUP[inp.k] || "Details";
    (groups[g] = groups[g] || []).push(field(inp, it.values[inp.k] ?? inp.def));
  }
  const idx = q.items.indexOf(it);
  return `<div class="ed-head">
      <div class="ic" style="width:40px;height:40px;border-radius:10px;background:#f1efea;display:grid;place-items:center">${ICON[it.tpl] || ICON.custom}</div>
      <input data-act="rename" value="${esc(it.name || tpl.name)}" aria-label="Item name">
      <button class="icon-btn" data-act="up" title="Move up" ${idx === 0 ? "disabled" : ""}>${SVG.up}</button>
      <button class="icon-btn" data-act="down" title="Move down" ${idx === q.items.length - 1 ? "disabled" : ""}>${SVG.down}</button>
      <button class="icon-btn" data-act="dup" title="Duplicate">${SVG.copy}</button>
      <button class="icon-btn danger" data-act="del" title="Remove">${SVG.bin}</button>
    </div>
    <div class="drawing ${tpl.draw === "none" ? "hide" : ""}" id="drawing">${htmlDrawing(tpl, l)}</div>
    <div class="groups">${Object.entries(groups).map(([g, f]) => `<div class="grp"><h4>${g}</h4><div class="fields">${f.join("")}</div></div>`).join("")}</div>
    <div class="bd" id="bd">${htmlBreakdown(l)}</div>`;
}
function htmlDrawing(tpl, l) {
  if (!l) return "";
  return `<span class="tag">Front elevation, from outside</span><span class="wt">${l.r.kg ? `About ${fmtNum(Math.round(l.r.kg))} kg of steel` : ""}</span>${drawItem(tpl, l.r, db.pb)}`;
}
function field(inp, v) {
  const lab = `<label>${esc(inp.label)}</label>`;
  if (inp.type === "num") {
    const step = inp.step || (inp.unit === "mm" ? 50 : 1);
    return `<div class="f">${lab}<div class="step"><button data-act="step" data-k="${inp.k}" data-d="${-step}" aria-label="Less">−</button><input type="number" inputmode="decimal" data-k="${inp.k}" value="${v}" step="${step}" min="${inp.min ?? ""}" max="${inp.max ?? ""}"><span class="u">${esc(inp.unit || "")}</span><button data-act="step" data-k="${inp.k}" data-d="${step}" aria-label="More">+</button></div></div>`;
  }
  if (inp.type === "seg") return `<div class="f">${lab}<div class="segs">${inp.opts.map(([val, name]) => `<button data-act="seg" data-k="${inp.k}" data-v="${val}" class="${val == v ? "on" : ""}">${esc(name)}</button>`).join("")}</div></div>`;
  if (inp.type === "bool") return `<div class="f"><span>&nbsp;</span><div class="tog ${v ? "on" : ""}" data-act="bool" data-k="${inp.k}" role="switch" aria-checked="${!!v}" tabindex="0"><i></i>${esc(inp.label)}</div></div>`;
  if (inp.type === "mat") return `<div class="f">${lab}<select data-k="${inp.k}">${db.pb.materials.filter((m) => m.cat === inp.filter).map((m) => `<option value="${m.id}" ${m.id === v ? "selected" : ""}>${esc(m.name)}</option>`).join("")}</select></div>`;
  return `<div class="f">${lab}<input type="text" data-k="${inp.k}" value="${esc(v)}"></div>`;
}
function htmlBreakdown(l) {
  if (!l) return "";
  const r = l.r, pb = db.pb;
  const cuts = r.cuts.map((c) => { const m = byId(pb.materials, c.mat); return `<tr><td>${esc(c.label)}</td><td>${esc(m?.name || c.mat)}</td><td class="n">${fmtNum(c.len)}</td><td class="n">${c.qty}</td><td class="n">${fmtNum(Math.round((c.len * c.qty) / 100) / 10)} m</td></tr>`; }).join("")
    + r.sheets.map((s) => `<tr><td>${esc(s.label)}</td><td>${esc(byId(pb.materials, s.mat)?.name)}</td><td class="n" colspan="2">${s.area.toFixed(2)} m²</td><td></td></tr>`).join("");
  const hw = r.items.map((h) => `<tr><td>${esc(h.name || h.id)}</td><td class="n">${fmtNum(h.qty)}</td><td class="n">${money(h.unit, true)}</td><td class="n">${money(h.unit * h.qty, true)}</td></tr>`).join("");
  const lab = r.labour.map((x) => `<tr><td>${esc(x.name)}</td><td class="n">${x.hours} h${x.crew > 1 ? ` x ${x.crew}` : ""}</td><td class="n">${money(x.unit)}/h</td><td class="n">${money(x.unit * x.hours * (x.crew || 1), true)}</td></tr>`).join("");
  const costRows = Object.entries(l.cost).filter(([, v]) => v > 0).map(([k, v]) => `<tr><td>${CATS[k][0]}</td><td class="n">${money(v, true)}</td><td class="n">${db.pb.markup[k] ?? 0}%</td><td class="n">${money(v * (1 + (db.pb.markup[k] ?? 0) / 100), true)}</td></tr>`).join("");
  const m = l.sell ? (l.sell - l.costTotal) / l.sell : 0;
  const msgs = [...r.errors.map((e) => `<p>${esc(e)}</p>`)].join("") ;
  const warns = r.warnings.map((w) => `<p>${esc(w)}</p>`).join("");
  return `${msgs ? `<div class="warn err" style="margin:12px 0 0">${msgs}</div>` : ""}${warns ? `<div class="warn" style="margin:12px 0 0">${warns}</div>` : ""}
  <details open><summary><span>This item: ${money(l.sell)} ex GST, ${(m * 100).toFixed(0)}% margin</span></summary><div class="scroll"><table class="tbl"><thead><tr><th>Cost</th><th class="n">Cost</th><th class="n">Markup</th><th class="n">Sell</th></tr></thead><tbody>${costRows}</tbody><tfoot><tr><td>Total</td><td class="n">${money(l.costTotal, true)}</td><td></td><td class="n">${money(l.sell, true)}</td></tr></tfoot></table></div></details>
  ${cuts ? `<details><summary><span>Cut list (${r.cuts.reduce((s, c) => s + c.qty, 0)} pieces)</span></summary><div class="scroll"><table class="tbl"><thead><tr><th>Part</th><th>Material</th><th class="n">Length mm</th><th class="n">Qty</th><th class="n">Total</th></tr></thead><tbody>${cuts}</tbody></table></div></details>` : ""}
  ${hw ? `<details><summary><span>Hardware and motors</span></summary><div class="scroll"><table class="tbl"><thead><tr><th>Item</th><th class="n">Qty</th><th class="n">Each</th><th class="n">Cost</th></tr></thead><tbody>${hw}</tbody></table></div></details>` : ""}
  ${lab ? `<details><summary><span>Labour</span></summary><div class="scroll"><table class="tbl"><thead><tr><th>Task</th><th class="n">Hours</th><th class="n">Rate</th><th class="n">Cost</th></tr></thead><tbody>${lab}</tbody></table></div></details>` : ""}
  ${r.area ? `<p class="small" style="margin:10px 2px 0">Coating area about ${r.area.toFixed(1)} m², steel weight about ${fmtNum(Math.round(r.kg))} kg.</p>` : ""}`;
}
function htmlSummary(q, P) {
  const s = db.pb.settings, mPct = P.margin * 100;
  const mc = mPct < s.minMargin ? "var(--bad)" : mPct < s.minMargin + 10 ? "var(--warn)" : "var(--ok)";
  const totalSell = P.tot.sell || 1;
  const cats = Object.entries(P.tot.byCat).filter(([, v]) => v.sell > 0);
  const issues = [...P.errors.map((e) => `<p>${esc(e)}</p>`)].join("");
  const warns = P.warnings.map((w) => `<p>${esc(w)}</p>`).join("");
  return `<div class="sum-in"><div>
    <div class="total"><small>Quote total inc GST</small><b>${money(P.inc)}</b><span>${money(P.exGst)} ex GST + ${money(P.gst)} GST</span></div>
    <div class="rows">
      <div class="row"><span>Our cost</span><b>${money(P.tot.cost)}</b></div>
      <div class="row"><span>Profit</span><b>${money(P.exGst - P.tot.cost)}</b></div>
      ${P.disc ? `<div class="row"><span>Discount</span><b>${P.disc}%</b></div>` : ""}
      <div class="row"><span>Steel weight</span><b>${fmtNum(Math.round(P.kg))} kg</b></div>
    </div>
    <div class="margin"><div class="row" style="padding:0"><span>Margin</span><b style="color:${mc}">${mPct.toFixed(1)}%</b></div>
      <div class="mbar"><i style="width:${Math.max(0, Math.min(100, mPct * 1.6))}%;background:${mc}"></i><em style="left:${Math.min(100, s.minMargin * 1.6)}%" title="Your floor"></em></div></div>
  </div><div>
    <div class="cats" style="padding-top:14px"><p class="sec-t">Where the price goes</p>
      <div class="stack">${cats.map(([k, v]) => `<i style="width:${(v.sell / totalSell) * 100}%;background:${CATS[k][1]}"></i>`).join("")}</div>
      ${cats.map(([k, v]) => `<div class="row" style="--c:${CATS[k][1]}"><span>${CATS[k][0]}</span><b>${money(v.sell)}</b></div>`).join("")}
    </div>
    ${issues ? `<div class="warn err">${issues}</div>` : ""}${warns ? `<div class="warn">${warns}</div>` : ""}
    <label class="disc">Discount <input type="number" inputmode="decimal" data-q="discount" value="${q.discount || 0}" min="0" max="100" step="1"> %</label>
    <div class="acts">
      <button class="btn red" data-act="tab" data-tab="quote">${SVG.doc}Quotation</button>
      <button class="btn line" data-act="tab" data-tab="cuts">${SVG.cut}Cut list and order</button>
    </div>
  </div></div>`;
}
function liveUpdate() {
  const q = Q(), P = price(q);
  const it = q.items.find((i) => i.id === q.sel);
  const l = it && P.lines.find((x) => x.id === it.id);
  if (l) { $("#drawing").innerHTML = htmlDrawing(l.tpl, l); $("#bd").innerHTML = htmlBreakdown(l); }
  $("#itemsList").innerHTML = htmlItems(q, P);
  $("#sum").innerHTML = htmlSummary(q, P);
  renderMob(P);
}
function renderMob(P = price()) {
  $("#mob").innerHTML = `<div><span>${esc(Q().no)} total inc GST</span><b>${money(P.inc)}</b></div><div style="text-align:right"><span>Margin</span><b style="font-size:18px">${(P.margin * 100).toFixed(0)}%</b></div><button class="btn red" data-act="tab" data-tab="quote" style="min-height:40px;padding:8px 14px">Quote</button>`;
}

/* ---------- CUT LIST ---------- */
const PAL = ["#d61d09", "#2f6db5", "#1d8a4a", "#b86e00", "#7b3fb0", "#0f8b8d", "#c2185b", "#5d4037"];
function renderCuts() {
  const q = Q(), P = price(q);
  const col = (id) => PAL[q.items.findIndex((i) => i.id === id) % PAL.length] || "#555";
  const lengths = P.packs.reduce((s, p) => s + p.bars.length, 0);
  const waste = P.packs.reduce((s, p) => s + (p.total - p.used), 0), tot = P.packs.reduce((s, p) => s + p.total, 0);
  const matCost = P.packs.reduce((s, p) => s + p.cost, 0) + P.sheetPacks.reduce((s, p) => s + p.cost, 0);
  // hardware order, combined across every item
  const hw = new Map();
  for (const l of P.lines) for (const h of l.r.items) { const x = hw.get(h.id) || { name: h.name, qty: 0, unit: h.unit }; x.qty += h.qty; hw.set(h.id, x); }
  const legend = q.items.map((i) => `<span><i style="background:${col(i.id)}"></i>${esc(i.name)}</span>`).join("");
  $("#v-cuts").innerHTML = `<div class="wide">
  <div class="page-h"><div><h2>Cut list and material order</h2><p>${esc(q.no)}${q.client.name ? ", " + esc(q.client.name) : ""}. Every cut packed into full stock lengths with a ${db.pb.settings.kerf} mm saw cut.</p></div>
    <div style="display:flex;gap:8px"><button class="btn line" data-act="print" data-view="cuts">${SVG.print}Print for the workshop</button></div></div>
  ${!P.packs.length && !P.sheetPacks.length ? `<div class="card pad empty">Add a gate or fence to see its cut list.</div>` : `
  <div class="kpis">
    <div class="card kpi"><small>Full lengths to order</small><b>${lengths}</b></div>
    <div class="card kpi"><small>Steel used</small><b>${fmtNum(Math.round((tot - waste) / 100) / 10)} m</b></div>
    <div class="card kpi"><small>Offcut</small><b>${tot ? ((waste / tot) * 100).toFixed(1) : 0}%</b></div>
    <div class="card kpi"><small>Material cost</small><b>${money(matCost)}</b></div>
  </div>
  ${P.packs.map((p) => `<div class="card mat">
    <div class="mat-h"><h3>${esc(p.mat.name)}</h3><span>Order <b>${p.bars.length} x ${fmtNum(p.mat.stock)} mm</b> at ${money(p.mat.cost, true)} = <b>${money(p.cost, true)}</b>, offcut ${(p.waste * 100).toFixed(1)}%</span></div>
    <div class="bars">${p.bars.map((b, i) => `<div class="bar"><em>${i + 1}</em><div class="track">${b.cuts.map((c) => `<div class="cut" style="width:${(c.len / p.mat.stock) * 100}%;background:${col(c.item)}" title="${esc(c.label)} ${c.len} mm">${c.len / p.mat.stock > 0.07 ? fmtNum(c.len) : ""}</div>`).join("")}</div><strong>${fmtNum(Math.max(0, Math.round(b.free)))} left</strong></div>`).join("")}</div>
    <div class="scroll" style="padding:0 16px 14px"><table class="tbl"><thead><tr><th>Part</th><th>For</th><th class="n">Length mm</th><th class="n">Qty</th></tr></thead><tbody>
      ${(() => { const m = new Map(); for (const b of p.bars) for (const c of b.cuts) { const k = c.label + "|" + c.len + "|" + c.item; m.set(k, { ...c, n: (m.get(k)?.n || 0) + 1 }); } return [...m.values()].sort((a, b) => b.len - a.len).map((c) => `<tr><td>${esc(c.label)}</td><td><i style="display:inline-block;width:9px;height:9px;border-radius:3px;background:${col(c.item)};margin-right:6px"></i>${esc(q.items.find((i) => i.id === c.item)?.name || "")}</td><td class="n">${fmtNum(c.len)}</td><td class="n">${c.n}</td></tr>`).join(""); })()}
    </tbody></table></div></div>`).join("")}
  ${P.sheetPacks.length ? `<div class="card mat"><div class="mat-h"><h3>Sheets and mesh</h3></div><div class="scroll" style="padding:0 16px 14px"><table class="tbl"><thead><tr><th>Sheet</th><th class="n">Area needed</th><th class="n">Sheets</th><th class="n">Cost</th></tr></thead><tbody>${P.sheetPacks.map((s) => `<tr><td>${esc(s.mat.name)}</td><td class="n">${s.area.toFixed(2)} m²</td><td class="n">${s.count}</td><td class="n">${money(s.cost, true)}</td></tr>`).join("")}</tbody></table></div></div>` : ""}
  ${hw.size ? `<div class="card mat"><div class="mat-h"><h3>Hardware, motors and access</h3><span>Pick list for the whole job</span></div><div class="scroll" style="padding:0 16px 14px"><table class="tbl"><thead><tr><th>Item</th><th class="n">Qty</th><th class="n">Each</th><th class="n">Cost</th></tr></thead><tbody>${[...hw.values()].map((h) => `<tr><td>${esc(h.name)}</td><td class="n">${fmtNum(h.qty)}</td><td class="n">${money(h.unit, true)}</td><td class="n">${money(h.unit * h.qty, true)}</td></tr>`).join("")}</tbody></table></div></div>` : ""}
  <div class="legend card pad" style="padding:12px 16px">${legend}</div>`}
  </div>`;
}

/* ---------- QUOTATION ---------- */
function includes(P) {
  const inc = [], exc = [];
  const has = (f) => P.lines.some(f);
  if (has((l) => l.r.cuts.length)) inc.push("Supply and fabrication of all steelwork to the sizes listed");
  const fin = [...new Set(P.lines.filter((l) => l.r.finish && l.r.finish !== "none").map((l) => { const f = byId(db.pb.finishes, l.r.finish); return f ? f.name + (l.r.env.colour && l.r.finish !== "galv" ? ` in ${l.r.env.colour}` : "") : ""; }))].filter(Boolean);
  if (fin.length) inc.push(fin.join(", "));
  if (has((l) => l.r.labour.some((x) => x.rate === "install"))) inc.push("Installation by the Apex Gates team, with posts set and gates hung and adjusted");
  if (has((l) => l.r.items.some((h) => byId(db.pb.hardware, h.id)?.cat === "motor"))) inc.push("Gate motors fitted, set up and tested, with a run through on handover");
  if (has((l) => l.r.items.some((h) => h.id === "remote"))) inc.push("Remotes programmed on site");
  if (has((l) => l.tpl.id === "site" && l.r.env.remove > 0)) inc.push("Removal of the old gate");
  inc.push("Site clean up on completion");
  if (!has((l) => l.r.labour.some((x) => x.rate === "elec"))) exc.push("Power supply to the gate, by a licensed electrician");
  exc.push("Rock, root or concrete breaking below ground", "Council, strata or building approvals", "Changes to the work once fabrication starts");
  return { inc, exc };
}
function renderDoc() {
  const q = Q(), P = price(q), s = db.pb.settings;
  const disc = P.disc / 100;
  // line prices scaled so they add up exactly to the rounded total
  const base = P.tot.sell * (1 - disc), k = base ? P.exGst / base : 1;
  const shown = P.lines.map((l) => Math.round(l.sell * k));
  let sub = shown.reduce((a, b) => a + b, 0);
  const discAmt = Math.round(sub * disc);
  if (shown.length) { const diff = Math.round(P.exGst) - (sub - discAmt); shown[shown.length - 1] += diff; sub += diff; }
  const { inc, exc } = includes(P);
  const valid = q.created + s.validity * 864e5;
  $("#v-quote").innerHTML = `<div class="doc-wrap">
  <article class="paper" id="paper">
    <header class="ph">
      <div><div class="logo">APEX<span> GATES</span></div><p>${esc(s.address)}<br>${esc(s.phone)} · ${esc(s.email)}<br>${esc(s.web)}${s.abn ? `<br>ABN ${esc(s.abn)}` : ""}</p></div>
      <div class="qmeta"><h1>QUOTATION</h1>${esc(q.no)}<br>Date: ${dateStr(q.created)}<br>Valid until: ${dateStr(valid)}${q.tech ? `<br>Quoted by: ${esc(q.tech)}` : ""}</div>
    </header>
    <div class="parties">
      <div><h4>Prepared for</h4><p><b>${esc(q.client.name || "Client name")}</b>${q.client.phone ? `<br>${esc(q.client.phone)}` : ""}${q.client.email ? `<br>${esc(q.client.email)}` : ""}</p></div>
      <div><h4>Site</h4><p>${esc(q.client.address || "Site address")}</p></div>
    </div>
    ${q.notes ? `<p style="margin:0 0 10px;line-height:1.6">${esc(q.notes)}</p>` : ""}
    <table class="qlines"><thead><tr><th>Description</th>${q.showPrices ? `<th class="n">Price ex GST</th>` : ""}</tr></thead><tbody>
      ${P.lines.map((l, i) => `<tr><td><b>${esc(l.name)}</b><div class="d">${esc(cap(l.desc))}</div>${q.showDrawings && l.tpl.draw !== "none" ? `<div class="pic">${drawItem(l.tpl, l.r, db.pb)}</div>` : ""}</td>${q.showPrices ? `<td class="n">${money(shown[i])}</td>` : ""}</tr>`).join("") || `<tr><td class="small">No items yet.</td></tr>`}
    </tbody></table>
    <div class="qtot">
      ${P.disc ? `<div class="row"><span>Subtotal</span><b>${money(sub)}</b></div><div class="row"><span>Discount ${P.disc}%</span><b>−${money(discAmt)}</b></div>` : ""}
      <div class="row"><span>Total ex GST</span><b>${money(P.exGst)}</b></div>
      <div class="row"><span>GST ${s.gst}%</span><b>${money(P.gst, true)}</b></div>
      <div class="row big"><span>Total inc GST</span><b>${money(P.inc, true)}</b></div>
      ${s.deposit ? `<div class="row"><span>Deposit to start (${s.deposit}%)</span><b>${money((P.inc * s.deposit) / 100, true)}</b></div>` : ""}
    </div>
    <div class="inc"><div><h4>Included</h4><ul>${inc.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div><div><h4>Not included</h4><ul>${exc.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div></div>
    <div class="terms">${esc(s.terms)}</div>
    <div class="accept">
      <div><div class="sigbox">${q.signature ? `<img src="${q.signature.img}" alt="Client signature">` : ""}</div><small>Accepted by ${q.signature ? `<b>${esc(q.signature.name)}</b> on ${dateStr(q.signature.date)}` : "(client signature)"}</small></div>
      <div><div class="sigbox" style="display:flex;align-items:end;padding-bottom:6px">${q.signature ? dateStr(q.signature.date) : ""}</div><small>Date</small></div>
    </div>
  </article>
  <aside class="side">
    <div class="card pad"><p class="sec-t">Send it</p><div style="display:grid;gap:8px">
      <button class="btn red" data-act="sign">${SVG.pen}${q.signature ? "Sign again" : "Client signs on this device"}</button>
      <button class="btn dark" data-act="print" data-view="quote">${SVG.print}Print or save as PDF</button>
      <button class="btn line" data-act="copytext">${SVG.copy}Copy as text for SMS or email</button>
    </div></div>
    <div class="card pad"><p class="sec-t">Show on the quote</p>
      <label class="opt">Price on each line <span class="tog ${q.showPrices ? "on" : ""}" data-act="qopt" data-k="showPrices"><i></i></span></label>
      <label class="opt">Drawings <span class="tog ${q.showDrawings ? "on" : ""}" data-act="qopt" data-k="showDrawings"><i></i></span></label>
      <div class="f" style="margin-top:10px"><label>Note at the top</label><textarea data-q="notes" rows="3" style="border:1px solid var(--line);border-radius:10px;padding:10px;width:100%" placeholder="Thanks for having us out today...">${esc(q.notes)}</textarea></div>
    </div>
    <div class="card pad"><p class="sec-t">Status</p><div class="segs">${["draft", "sent", "won", "lost"].map((st) => `<button data-act="status" data-v="${st}" class="${q.status === st ? "on" : ""}">${cap(st)}</button>`).join("")}</div></div>
  </aside></div>`;
}
function quoteText() {
  const q = Q(), P = price(q), s = db.pb.settings;
  const lines = P.lines.map((l) => `${l.name}: ${cap(l.desc)}`);
  return `${s.company} quotation ${q.no}\n${q.client.name ? `For ${q.client.name}\n` : ""}${q.client.address ? `Site: ${q.client.address}\n` : ""}\n${lines.join("\n")}\n\nTotal ${money(P.inc, true)} inc GST (${money(P.exGst)} ex GST)\nValid for ${s.validity} days, subject to a final site measure.\n\n${q.tech || s.company}\n${s.phone}`;
}

/* ---------- signature pad ---------- */
function openSign() {
  const q = Q(), m = document.createElement("div");
  m.className = "modal";
  m.innerHTML = `<div class="card"><h3>Accept this quote</h3><p class="small">Total ${money(price(q).inc, true)} inc GST. Sign in the box with a finger or stylus.</p>
    <canvas class="pad-c" id="padc"></canvas>
    <input id="signame" placeholder="Full name" value="${esc(q.client.name)}">
    <div class="row2" style="margin-top:12px"><button class="btn line" data-x="clear">Clear</button><button class="btn line" data-x="cancel">Cancel</button><button class="btn red" data-x="ok">Accept and sign</button></div></div>`;
  document.body.appendChild(m);
  const c = $("#padc"), ctx = c.getContext("2d"), dpr = devicePixelRatio || 1;
  const fit = () => { const b = c.getBoundingClientRect(); c.width = b.width * dpr; c.height = b.height * dpr; ctx.scale(dpr, dpr); ctx.lineWidth = 2.6; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#111"; };
  fit();
  let down = false, inked = false, last;
  const pt = (e) => { const b = c.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  c.addEventListener("pointerdown", (e) => { down = true; last = pt(e); c.setPointerCapture(e.pointerId); });
  c.addEventListener("pointermove", (e) => { if (!down) return; const p = pt(e); ctx.beginPath(); ctx.moveTo(...last); ctx.lineTo(...p); ctx.stroke(); last = p; inked = true; });
  c.addEventListener("pointerup", () => (down = false));
  m.addEventListener("click", (e) => {
    const x = e.target.dataset.x;
    if (x === "clear") { ctx.clearRect(0, 0, c.width, c.height); inked = false; }
    if (x === "cancel" || e.target === m) m.remove();
    if (x === "ok") {
      if (!inked) return toast("Please sign in the box first");
      const name = $("#signame").value.trim(); if (!name) return toast("Please add the full name");
      q.signature = { img: c.toDataURL("image/png"), name, date: Date.now() }; q.status = "won";
      if (!q.client.name) q.client.name = name;
      save(); m.remove(); render(); toast("Signed and marked as won");
    }
  });
}

/* ---------- PRICE BOOK ---------- */
const BOOK = [["materials", "Materials"], ["hardware", "Hardware and motors"], ["labour", "Labour"], ["finishes", "Finishes"], ["settings", "Markup and settings"]];
function renderBook() {
  const pb = db.pb, f = ui.search.toLowerCase();
  const inp = (path, v, cls = "", type = "text") => `<input ${type === "number" ? 'type="number" inputmode="decimal" step="any"' : ""} class="${cls}" data-pb="${path}" value="${esc(v)}">`;
  const del = (list, i) => `<button class="icon-btn danger" data-act="pbdel" data-list="${list}" data-i="${i}" title="Remove">${SVG.bin}</button>`;
  const match = (x) => !f || JSON.stringify(x).toLowerCase().includes(f);
  let body = "";
  if (ui.book === "materials") {
    body = `<table class="tbl"><thead><tr><th>Material</th><th>Type</th><th class="n">Size mm</th><th class="n">Coat mm</th><th class="n">kg per m</th><th class="n">Stock length mm</th><th class="n">Cost per length</th><th class="n">Per metre</th><th></th></tr></thead><tbody>
    ${pb.materials.map((m, i) => !match(m) ? "" : `<tr><td>${inp(`materials.${i}.name`, m.name)}<div class="small" style="font-family:ui-monospace,monospace">${esc(m.id)}</div></td>
      <td><select data-pb="materials.${i}.cat">${["frame", "infill", "post", "track", "sheet"].map((c) => `<option ${c === m.cat ? "selected" : ""}>${c}</option>`).join("")}</select></td>
      ${m.sheet ? `<td class="n" colspan="3">${inp(`materials.${i}.w`, m.w, "num", "number")} x ${inp(`materials.${i}.h`, m.h, "num", "number")}</td><td class="n">per sheet</td>`
        : `<td class="n">${inp(`materials.${i}.dim`, m.dim, "num", "number")}</td><td class="n">${inp(`materials.${i}.perim`, m.perim, "num", "number")}</td><td class="n">${inp(`materials.${i}.kgm`, m.kgm, "num", "number")}</td><td class="n">${inp(`materials.${i}.stock`, m.stock, "num", "number")}</td>`}
      <td class="n">${inp(`materials.${i}.cost`, m.cost, "num", "number")}</td><td class="n">${m.sheet ? "" : money((m.cost / m.stock) * 1000, true)}</td><td>${del("materials", i)}</td></tr>`).join("")}</tbody></table>`;
  } else if (ui.book === "hardware") {
    const cats = ["hinge", "lock", "slide", "post", "motor", "access", "misc"];
    body = `<table class="tbl"><thead><tr><th>Item</th><th>Code used in formulas</th><th>Type</th><th class="n">Cost each</th><th>Note</th><th></th></tr></thead><tbody>
    ${pb.hardware.map((h, i) => !match(h) ? "" : `<tr><td>${inp(`hardware.${i}.name`, h.name)}</td><td>${inp(`hardware.${i}.id`, h.id, "code")}</td>
      <td><select data-pb="hardware.${i}.cat">${cats.map((c) => `<option ${c === h.cat ? "selected" : ""}>${c}</option>`).join("")}</select></td>
      <td class="n">${inp(`hardware.${i}.cost`, h.cost, "num", "number")}</td><td>${inp(`hardware.${i}.note`, h.note || "")}</td><td>${del("hardware", i)}</td></tr>`).join("")}</tbody></table>`;
  } else if (ui.book === "labour") {
    body = `<table class="tbl"><thead><tr><th>Labour</th><th>Code</th><th class="n">Cost per hour</th><th class="n">Sells at</th><th></th></tr></thead><tbody>
    ${pb.labour.map((l, i) => `<tr><td>${inp(`labour.${i}.name`, l.name)}</td><td class="small" style="font-family:ui-monospace,monospace">${esc(l.id)}</td><td class="n">${inp(`labour.${i}.rate`, l.rate, "num", "number")}</td><td class="n">${money(l.rate * (1 + pb.markup.labour / 100), true)}/h</td><td>${["fab", "install", "elec"].includes(l.id) ? "" : del("labour", i)}</td></tr>`).join("")}</tbody></table>`;
  } else if (ui.book === "finishes") {
    body = `<table class="tbl"><thead><tr><th>Finish</th><th class="n">Per m² of steel</th><th class="n">Per kg</th><th class="n">Minimum charge</th></tr></thead><tbody>
    ${pb.finishes.map((x, i) => `<tr><td>${inp(`finishes.${i}.name`, x.name)}</td><td class="n">${inp(`finishes.${i}.perM2`, x.perM2, "num", "number")}</td><td class="n">${inp(`finishes.${i}.perKg`, x.perKg, "num", "number")}</td><td class="n">${inp(`finishes.${i}.min`, x.min, "num", "number")}</td></tr>`).join("")}</tbody></table>
    <p class="small" style="padding:0 10px 10px">The coating area is worked out from the outside of every piece of steel on the cut list, so it follows the gate exactly.</p>`;
  } else {
    const s = pb.settings, row = (label, path, v, unit, type = "number") => `<tr><td>${label}</td><td class="n" style="width:200px">${inp(path, v, type === "number" ? "num" : "", type)}</td><td class="small">${unit}</td></tr>`;
    body = `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:0 24px;padding:6px 6px 12px">
      <table class="tbl"><thead><tr><th colspan="3">Markup on cost</th></tr></thead><tbody>${Object.keys(CATS).map((k) => row(CATS[k][0], `markup.${k}`, pb.markup[k], "%")).join("")}</tbody></table>
      <table class="tbl"><thead><tr><th colspan="3">Rules</th></tr></thead><tbody>
        ${row("GST", "settings.gst", s.gst, "%")}${row("Saw cut (kerf)", "settings.kerf", s.kerf, "mm per cut")}${row("Sheet waste allowance", "settings.sheetWaste", s.sheetWaste, "%")}
        ${row("Round totals to the nearest", "settings.round", s.round, "dollars")}${row("Margin floor warning", "settings.minMargin", s.minMargin, "%")}
        ${row("Quote valid for", "settings.validity", s.validity, "days")}${row("Deposit", "settings.deposit", s.deposit, "%")}</tbody></table>
      <table class="tbl"><thead><tr><th colspan="3">On the quotation</th></tr></thead><tbody>
        ${row("Business name", "settings.company", s.company, "", "text")}${row("ABN", "settings.abn", s.abn, "", "text")}${row("Phone", "settings.phone", s.phone, "", "text")}
        ${row("Email", "settings.email", s.email, "", "text")}${row("Website", "settings.web", s.web, "", "text")}${row("Address", "settings.address", s.address, "", "text")}</tbody></table>
      <div style="padding:10px"><p class="sec-t">Terms</p><textarea data-pb="settings.terms" rows="7" style="width:100%;border:1px solid var(--line);border-radius:10px;padding:10px">${esc(s.terms)}</textarea></div></div>`;
  }
  const canAdd = ["materials", "hardware", "labour"].includes(ui.book);
  $("#v-book").innerHTML = `<div class="wide">
    <div class="page-h"><div><h2>Price book</h2><p>Your costs. Markups turn them into the sell price. Changes apply to every quote on this device straight away. Last changed ${dateStr(db.pbUpdated)}.</p></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn line" data-act="pbexport">Export price book</button><label class="btn line" style="cursor:pointer">Import<input type="file" accept=".json" data-act="pbimport" hidden></label><button class="btn line" data-act="pbreset">Reset to samples</button></div></div>
    <div class="subtabs">${BOOK.map(([k, n]) => `<button data-act="book" data-v="${k}" class="${ui.book === k ? "on" : ""}">${n}</button>`).join("")}</div>
    <div class="card">${ui.book !== "settings" ? `<div class="toolbar"><input type="search" placeholder="Search" data-act="pbsearch" value="${esc(ui.search)}">
      ${ui.book === "materials" || ui.book === "hardware" ? `<span class="small">Supplier price rise:</span><input type="number" id="bulk" placeholder="%" style="width:80px;border:1px solid var(--line);border-radius:9px;padding:9px"><button class="btn line" data-act="bulk" style="min-height:40px;padding:8px 12px">Apply to ${f ? "shown" : "all"}</button>` : ""}
      ${canAdd ? `<button class="btn dark" data-act="pbadd" style="min-height:40px;padding:8px 14px">${SVG.plus}Add</button>` : ""}</div>` : ""}
      <div class="scroll">${body}</div></div>
    <p class="small" style="margin-top:12px">All prices are samples until Apex enters its supplier costs. They stay on this device: export the price book and import it on each tablet so the team quotes from the same numbers.</p></div>`;
}
function setPath(obj, path, val) { const p = path.split("."); let o = obj; for (let i = 0; i < p.length - 1; i++) o = o[p[i]]; o[p.at(-1)] = val; }
function getPath(obj, path) { return path.split(".").reduce((o, k) => o?.[k], obj); }

/* ---------- FORMULAS ---------- */
function renderFormulas() {
  const tpl = tplOf(ui.fTpl) || db.templates[0];
  const q = Q(), it = q.items.find((i) => i.tpl === tpl.id && i.id === q.sel) || q.items.find((i) => i.tpl === tpl.id);
  const r = runItem(tpl, it ? it.values : defaults(tpl), db.pb);
  const env = r.env;
  const res = (src) => { try { const v = evaluate(src, env); return `<span class="res ok">= ${esc(typeof v === "number" ? fmtNum(Math.round(v * 100) / 100) : v)}</span>`; } catch (e) { return `<span class="res bad">${esc(e.message)}</span>`; } };
  const fin = (path, v, w = "") => `<input class="code" data-tp="${path}" value="${esc(v)}" style="${w}">`;
  const del = (list, i) => `<button class="icon-btn danger" data-act="tdel" data-list="${list}" data-i="${i}">${SVG.bin}</button>`;
  const addB = (list) => `<button class="btn line" data-act="tadd" data-list="${list}" style="min-height:36px;padding:6px 12px;margin:8px 10px">${SVG.plus}Add a line</button>`;
  const section = (title, sub, head, rows, list) => `<div class="card" style="margin-bottom:14px"><div class="mat-h"><h3>${title}</h3><span>${sub}</span></div><div class="scroll"><table class="tbl ftbl"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>${addB(list)}</div>`;
  $("#v-formulas").innerHTML = `<div class="wide">
    <div class="page-h"><div><h2>Formulas</h2><p>How each item works out its parts, hardware and hours. Change a line and every quote uses it straight away.</p></div>
      <div style="display:flex;gap:8px"><button class="btn line" data-act="treset">Reset ${esc(tpl.name.toLowerCase())}</button></div></div>
    <div class="subtabs">${db.templates.map((t) => `<button data-act="ftpl" data-v="${t.id}" class="${t.id === tpl.id ? "on" : ""}">${esc(t.name)}</button>`).join("")}</div>
    <div class="fgrid"><div>
      ${r.errors.length ? `<div class="warn err" style="margin:0 0 14px">${r.errors.map((e) => `<p>${esc(e)}</p>`).join("")}</div>` : ""}
      <div class="card" style="margin-bottom:14px"><div class="mat-h"><h3>Wording on the quote</h3><span>Use {name} to drop in a value</span></div><div style="padding:12px 16px">${fin("describe", tpl.describe || "", "width:100%")}<p class="small" style="margin:8px 0 0">Shows as: ${esc(cap(r.desc))}</p></div></div>
      ${section("Working values", "Worked out from the inputs, used by the lines below", "<th>Name</th><th>Formula</th><th>Result</th><th></th>",
        (tpl.vars || []).map((v, i) => `<tr><td style="width:140px">${fin(`vars.${i}.0`, v[0])}</td><td>${fin(`vars.${i}.1`, v[1])}</td><td>${res(v[1])}</td><td>${del("vars", i)}</td></tr>`).join(""), "vars")}
      ${section("Cut list", "Length in mm and how many", "<th>Part</th><th>Material</th><th>Length</th><th>Qty</th><th>Result</th><th></th>",
        (tpl.cuts || []).map((c, i) => `<tr><td>${fin(`cuts.${i}.label`, c.label)}</td><td style="width:120px">${fin(`cuts.${i}.mat`, c.mat)}</td><td>${fin(`cuts.${i}.len`, c.len)}</td><td>${fin(`cuts.${i}.qty`, c.qty)}</td><td>${res(c.len)} ${res(c.qty).replace("= ", "x ")}</td><td>${del("cuts", i)}</td></tr>`).join(""), "cuts")}
      ${section("Hardware and motors", "Code from the price book, or a value that holds one", "<th>Item</th><th>Qty</th><th>Result</th><th></th>",
        (tpl.items || []).map((h, i) => `<tr><td style="width:170px">${fin(`items.${i}.id`, h.id)}</td><td>${fin(`items.${i}.qty`, h.qty)}</td><td>${res(h.qty)}</td><td>${del("items", i)}</td></tr>`).join(""), "items")}
      ${section("Labour", "Hours per job. Installation hours are per person and multiply by the crew", "<th>Rate</th><th>Task</th><th>Hours</th><th>Result</th><th></th>",
        (tpl.labour || []).map((l, i) => `<tr><td style="width:130px"><select data-tp="labour.${i}.rate">${db.pb.labour.map((x) => `<option value="${x.id}" ${x.id === l.rate ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select></td><td style="width:180px">${fin(`labour.${i}.label`, l.label || "")}</td><td>${fin(`labour.${i}.hours`, l.hours)}</td><td>${res(l.hours)}</td><td>${del("labour", i)}</td></tr>`).join(""), "labour")}
      ${section("Checks", "A warning shows on the quote when the rule is true", "<th>When</th><th>Message</th><th>Now</th><th></th>",
        (tpl.checks || []).map((c, i) => `<tr><td>${fin(`checks.${i}.when`, c.when)}</td><td>${fin(`checks.${i}.msg`, c.msg)}</td><td>${(() => { try { return evaluate(c.when, env) ? '<span class="res bad">showing</span>' : '<span class="res ok">clear</span>'; } catch (e) { return `<span class="res bad">${esc(e.message)}</span>`; } })()}</td><td>${del("checks", i)}</td></tr>`).join(""), "checks")}
    </div>
    <aside class="card pad sticky help">
      <p class="sec-t">Testing with</p><p style="margin:0 0 12px">${it ? `<b>${esc(it.name)}</b> from ${esc(q.no)}` : "The default sizes. Add this item to a quote to test with real sizes."}</p>
      <p class="sec-t">Names you can use</p>
      <div class="chips">${tpl.inputs.map((i) => `<span title="${esc(i.label)}">${i.k}</span>`).join("")}${(tpl.vars || []).map((v) => `<span style="background:#fff3ef">${esc(v[0])}</span>`).join("")}<span>kg</span><span>area</span></div>
      <p class="sec-t" style="margin-top:16px">Functions</p>
      <p><code>ceil(x)</code> <code>floor(x)</code> <code>round(x, d)</code> <code>min(a, b)</code> <code>max(a, b)</code> <code>if(test, yes, no)</code> <code>clamp(x, lo, hi)</code></p>
      <p><code>dim(m)</code> size, <code>stock(m)</code> stock length, <code>kgm(m)</code> kg per metre, <code>perim(m)</code> of a material.</p>
      <p class="sec-t" style="margin-top:16px">Examples</p>
      <p><code>ceil((leafW - 2*f - gap) / (ip + gap))</code> pickets that keep every gap under the limit.</p>
      <p><code>if(mount=="plate", posts*4, 0)</code> four anchors per base plate.</p>
      <p class="small">Text values go in double quotes. Lengths are in millimetres.</p>
    </aside></div></div>`;
}

/* ---------- QUOTES ---------- */
function renderQuotes() {
  const f = ui.qSearch.toLowerCase();
  const rows = [...db.quotes].sort((a, b) => b.updated - a.updated).filter((q) => !f || JSON.stringify([q.no, q.client, q.tech]).toLowerCase().includes(f));
  const won = db.quotes.filter((q) => q.status === "won"), sent = db.quotes.filter((q) => ["sent", "won", "lost"].includes(q.status));
  const val = (q) => price(q).inc;
  $("#v-quotes").innerHTML = `<div class="wide qlist">
    <div class="page-h"><div><h2>Quotes</h2><p>Saved on this device.</p></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn red" data-act="newq">${SVG.plus}New quote</button><button class="btn line" data-act="backup">Back up everything</button><label class="btn line" style="cursor:pointer">Restore<input type="file" accept=".json" data-act="restore" hidden></label></div></div>
    <div class="kpis">
      <div class="card kpi"><small>Quotes</small><b>${db.quotes.length}</b></div>
      <div class="card kpi"><small>Win rate</small><b>${sent.length ? Math.round((won.length / sent.length) * 100) : 0}%</b></div>
      <div class="card kpi"><small>Won value</small><b>${money(won.reduce((s, q) => s + val(q), 0))}</b></div>
      <div class="card kpi"><small>Open value</small><b>${money(db.quotes.filter((q) => q.status === "sent" || q.status === "draft").reduce((s, q) => s + val(q), 0))}</b></div>
    </div>
    <div class="card"><div class="toolbar"><input type="search" placeholder="Search client, site, quote number" data-act="qsearch" value="${esc(ui.qSearch)}"></div>
    <div class="scroll"><table class="tbl"><thead><tr><th>Quote</th><th>Client</th><th>Site</th><th>Items</th><th class="n">Total inc GST</th><th>Status</th><th>Updated</th><th></th></tr></thead><tbody>
    ${rows.map((q) => `<tr><td><b>${esc(q.no)}</b>${q.id === db.current ? ' <span class="small">(open)</span>' : ""}</td><td>${esc(q.client.name || "No name")}</td><td>${esc(q.client.address)}</td><td>${q.items.length}</td><td class="n">${money(val(q))}</td><td><span class="status ${q.status}">${cap(q.status)}</span></td><td>${dateStr(q.updated)}</td>
      <td style="white-space:nowrap"><button class="icon-btn" data-act="openq" data-id="${q.id}">Open</button> <button class="icon-btn" data-act="dupq" data-id="${q.id}" title="Copy">${SVG.copy}</button> <button class="icon-btn danger" data-act="delq" data-id="${q.id}" title="Delete">${SVG.bin}</button></td></tr>`).join("")}
    </tbody></table></div></div></div>`;
}

/* ---------- files ---------- */
function download(name, data) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
  a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
function readJson(input, fn) {
  const f = input.files[0]; if (!f) return;
  f.text().then((t) => { try { fn(JSON.parse(t)); } catch (e) { toast("That file could not be read"); } input.value = ""; });
}

/* ---------- events ---------- */
function curItem() { const q = Q(); return q.items.find((i) => i.id === q.sel); }
function setVal(k, v, full) {
  const it = curItem(); if (!it) return;
  it.values[k] = v; save();
  if (full) { $("#editor").innerHTML = htmlEditor(Q(), price()); liveUpdate(); } else liveUpdate();
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-act]"); if (!b) return;
  const act = b.dataset.act, q = Q();
  if (b.matches("input,select,textarea") && !["pbimport", "restore"].includes(act)) return;
  switch (act) {
    case "tab": setTab(b.dataset.tab); break;
    case "add": {
      const t = tplOf(b.dataset.tpl), it = { id: uid(), tpl: t.id, name: t.name, values: defaults(t) };
      const n = q.items.filter((i) => i.tpl === t.id).length; if (n) it.name = `${t.name} ${n + 1}`;
      q.items.push(it); q.sel = it.id; save(); renderBuild(); renderMob();
      if (innerWidth < 860) $("#editor").scrollIntoView({ behavior: "smooth" });
      break;
    }
    case "sel": q.sel = b.dataset.id; save(); renderBuild(); if (innerWidth < 860) $("#editor").scrollIntoView({ behavior: "smooth" }); break;
    case "dup": { const it = curItem(); const c = { ...clone(it), id: uid(), name: it.name + " copy" }; q.items.splice(q.items.indexOf(it) + 1, 0, c); q.sel = c.id; save(); renderBuild(); break; }
    case "del": { const it = curItem(); if (!confirm(`Remove ${it.name} from this quote?`)) return; const i = q.items.indexOf(it); q.items.splice(i, 1); q.sel = q.items[Math.max(0, i - 1)]?.id || null; save(); renderBuild(); renderMob(); break; }
    case "up": case "down": { const it = curItem(), i = q.items.indexOf(it), j = act === "up" ? i - 1 : i + 1; if (j < 0 || j >= q.items.length) return; [q.items[i], q.items[j]] = [q.items[j], q.items[i]]; save(); renderBuild(); break; }
    case "step": {
      const it = curItem(), inp = tplOf(it.tpl).inputs.find((i) => i.k === b.dataset.k);
      let v = (+it.values[inp.k] || 0) + +b.dataset.d;
      if (inp.min != null) v = Math.max(inp.min, v); if (inp.max != null) v = Math.min(inp.max, v);
      v = Math.round(v * 100) / 100;
      $(`.step input[data-k="${inp.k}"]`).value = v; setVal(inp.k, v); break;
    }
    case "seg": { const it = curItem(), inp = tplOf(it.tpl).inputs.find((i) => i.k === b.dataset.k); setVal(inp.k, typeof inp.def === "number" ? +b.dataset.v : b.dataset.v, true); break; }
    case "bool": { const it = curItem(); setVal(b.dataset.k, it.values[b.dataset.k] ? 0 : 1, true); break; }
    case "print": {
      const v = $("#v-" + b.dataset.view); v.classList.add("print");
      const done = () => { v.classList.remove("print"); removeEventListener("afterprint", done); };
      addEventListener("afterprint", done); print(); break;
    }
    case "sign": openSign(); break;
    case "copytext": navigator.clipboard.writeText(quoteText()).then(() => toast("Copied. Paste it into an SMS or email"), () => toast("Copy did not work on this device")); break;
    case "qopt": q[b.dataset.k] = !q[b.dataset.k]; save(); renderDoc(); break;
    case "status": q.status = b.dataset.v; save(); renderDoc(); break;
    case "book": ui.book = b.dataset.v; ui.search = ""; renderBook(); break;
    case "pbdel": { const l = db.pb[b.dataset.list], x = l[+b.dataset.i]; if (!confirm(`Remove ${x.name} from the price book?`)) return; l.splice(+b.dataset.i, 1); db.pbUpdated = Date.now(); save(); renderBook(); break; }
    case "pbadd": {
      const id = (p) => { let n = 1; while (db.pb[ui.book].some((x) => x.id === p + n)) n++; return p + n; };
      if (ui.book === "materials") db.pb.materials.unshift({ id: id("mat"), cat: "frame", name: "New material", dim: 50, perim: 200, kgm: 3, stock: 6500, cost: 0 });
      if (ui.book === "hardware") db.pb.hardware.unshift({ id: id("item"), cat: "misc", name: "New item", cost: 0 });
      if (ui.book === "labour") db.pb.labour.push({ id: id("rate"), name: "New rate", rate: 0 });
      db.pbUpdated = Date.now(); save(); renderBook(); break;
    }
    case "bulk": {
      const pct = +$("#bulk").value; if (!pct) return toast("Enter a percentage first");
      const f = ui.search.toLowerCase(); let n = 0;
      for (const x of db.pb[ui.book]) if (!f || JSON.stringify(x).toLowerCase().includes(f)) { x.cost = Math.round(x.cost * (1 + pct / 100) * 100) / 100; n++; }
      db.pbUpdated = Date.now(); save(); renderBook(); toast(`${n} prices changed by ${pct}%`); break;
    }
    case "pbexport": download(`apex-price-book-${new Date().toISOString().slice(0, 10)}.json`, { type: "apex-price-book", pb: db.pb, templates: db.templates }); break;
    case "pbreset": if (confirm("Put every price back to the samples? Your own prices will be lost unless you exported them.")) { db.pb = clone(PRICEBOOK); db.pbUpdated = Date.now(); save(); renderBook(); } break;
    case "ftpl": ui.fTpl = b.dataset.v; renderFormulas(); break;
    case "tadd": {
      const t = tplOf(ui.fTpl), l = b.dataset.list;
      const blank = { vars: ["x", "0"], cuts: { label: "New part", mat: "frame", len: "0", qty: "0" }, items: { id: "", qty: "0" }, labour: { rate: "fab", label: "New task", hours: "0" }, checks: { when: "0", msg: "Message" } }[l];
      (t[l] = t[l] || []).push(blank); save(); renderFormulas(); break;
    }
    case "tdel": { const t = tplOf(ui.fTpl); t[b.dataset.list].splice(+b.dataset.i, 1); save(); renderFormulas(); break; }
    case "treset": { if (!confirm("Put this item's formulas back to the starting set?")) return; const i = db.templates.findIndex((t) => t.id === ui.fTpl); db.templates[i] = clone(TEMPLATES.find((t) => t.id === ui.fTpl)); save(); renderFormulas(); break; }
    case "newq": { const n = newQuote(db); db.quotes.push(n); db.current = n.id; save(); setTab("build"); break; }
    case "openq": db.current = b.dataset.id; save(); setTab("build"); break;
    case "dupq": { const src = db.quotes.find((x) => x.id === b.dataset.id), n = { ...clone(src), id: uid(), no: `Q-${db.nextNo++}`, created: Date.now(), status: "draft", signature: null }; db.quotes.push(n); save(); renderQuotes(); toast(`Copied as ${n.no}`); break; }
    case "delq": {
      const x = db.quotes.find((y) => y.id === b.dataset.id); if (!confirm(`Delete ${x.no}${x.client.name ? " for " + x.client.name : ""}? This cannot be undone.`)) return;
      db.quotes = db.quotes.filter((y) => y.id !== x.id);
      if (!db.quotes.length) { const n = newQuote(db); db.quotes.push(n); }
      if (db.current === x.id) db.current = db.quotes[0].id;
      save(); renderQuotes(); break;
    }
    case "backup": download(`apex-quotes-backup-${new Date().toISOString().slice(0, 10)}.json`, { type: "apex-backup", db }); break;
  }
});
document.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && e.target.matches(".tog[data-act]")) { e.preventDefault(); e.target.click(); } });

document.addEventListener("input", (e) => {
  const t = e.target, q = Q();
  if (t.dataset.c) { q.client[t.dataset.c] = t.value; save(); if (t.dataset.c === "name") $("#qclient").textContent = t.value || "New quote"; return; }
  if (t.dataset.q) {
    q[t.dataset.q] = t.dataset.q === "discount" ? Math.max(0, Math.min(100, +t.value || 0)) : t.value;
    if (t.dataset.q === "tech") db.lastTech = t.value;
    save(); if (t.dataset.q === "discount") liveUpdate(); return;
  }
  if (t.dataset.act === "rename") { const it = curItem(); it.name = t.value; save(); $("#itemsList").innerHTML = htmlItems(q, price()); return; }
  if (t.dataset.k && t.closest("#editor")) {
    const it = curItem(), inp = tplOf(it.tpl).inputs.find((i) => i.k === t.dataset.k);
    if (inp.type === "num") { if (t.value === "") return; setVal(inp.k, +t.value); } else if (inp.type === "text") setVal(inp.k, t.value);
    return;
  }
  if (t.dataset.pb) {
    const old = getPath(db.pb, t.dataset.pb);
    const v = typeof old === "number" || t.type === "number" ? (t.value === "" ? 0 : +t.value) : t.value;
    setPath(db.pb, t.dataset.pb, v); db.pbUpdated = Date.now(); save(); return;
  }
  if (t.dataset.tp) { const tpl = tplOf(ui.fTpl); setPath(tpl, t.dataset.tp, t.value); save(); return; }
  if (t.dataset.act === "pbsearch") { ui.search = t.value; const pos = t.selectionStart; renderBook(); const n = $('[data-act="pbsearch"]'); n.focus(); n.setSelectionRange(pos, pos); return; }
  if (t.dataset.act === "qsearch") { ui.qSearch = t.value; const pos = t.selectionStart; renderQuotes(); const n = $('[data-act="qsearch"]'); n.focus(); n.setSelectionRange(pos, pos); }
});
document.addEventListener("change", (e) => {
  const t = e.target;
  if (t.tagName === "SELECT" && t.dataset.k && t.closest("#editor")) setVal(t.dataset.k, t.value, true);
  if (t.dataset.pb) { if (t.tagName === "SELECT") { setPath(db.pb, t.dataset.pb, t.value); save(); } renderBook(); }
  if (t.dataset.tp) { if (t.tagName === "SELECT") { setPath(tplOf(ui.fTpl), t.dataset.tp, t.value); save(); } renderFormulas(); }
  if (t.dataset.k && t.closest("#editor") && t.type === "number") { const it = curItem(); t.value = it.values[t.dataset.k]; }
  if (t.dataset.act === "pbimport") readJson(t, (d) => {
    if (d.type !== "apex-price-book" || !d.pb) return toast("That is not an Apex price book file");
    if (!confirm("Replace this device's price book and formulas with the imported ones?")) return;
    db.pb = d.pb; if (d.templates) db.templates = d.templates; db.pbUpdated = Date.now(); save(); renderBook(); toast("Price book imported");
  });
  if (t.dataset.act === "restore") readJson(t, (d) => {
    if (d.type !== "apex-backup" || !d.db?.quotes) return toast("That is not an Apex backup file");
    if (!confirm("Replace everything on this device with the backup?")) return;
    db = d.db; save(); setTab("quotes"); toast("Backup restored");
  });
});

/* ---------- start ---------- */
document.querySelectorAll(".tabs button").forEach((b) => b.addEventListener("click", () => setTab(b.dataset.tab)));
setTab("build");
