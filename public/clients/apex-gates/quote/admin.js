/* Apex Quote office page: the one place prices are changed, new equipment and
   materials are added, and new gate types are set up. Saving sends it to the
   server, and every tablet picks it up the next time it opens. */
import { PRICEBOOK, TEMPLATES } from "./data.js";
import { runItem, priceQuote, defaults, money, byId } from "./engine.js";
import { drawItem } from "./draw.js";
import { buildTemplates, mergePricebook } from "./shared.js";

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

const st = { office: false, loaded: false, work: null, dirty: false, updated: null, tab: "prices", shelf: "steel", find: "", gate: null, err: "", history: null, saving: false };

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
  if (st.tab === "prices") m.innerHTML = viewPrices();
  if (st.tab === "add") m.innerHTML = viewAdd();
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
    <h1 class="big-t" style="display:flex;gap:12px;align-items:center"><span style="width:44px;color:var(--red)">${ICON.lock}</span>Office only</h1>
    <p style="font-size:19px;margin:0 0 16px">This is where prices are changed and new gates, equipment and materials are added. Every tablet uses what is saved here.</p>
    <div class="fld"><label>Office password</label><input id="opw" type="password" autocomplete="current-password"></div>
    ${st.err ? `<div class="warn" style="margin-top:12px">${ICON.warn}<div>${esc(st.err)}</div></div>` : ""}
    <button class="btn red wide" style="margin-top:16px" data-act="login">Open the office</button>
    <a class="btn ghost wide" href="index.html" style="margin-top:10px;text-decoration:none">${ICON.back}Back to quoting</a></div>`;
}

/* prices */
const SHELVES = [
  ["steel", "Steel", (p) => p.materials.filter((m) => !m.sheet), "materials", "cost"],
  ["sheet", "Mesh and sheet", (p) => p.materials.filter((m) => m.sheet), "materials", "cost"],
  ["parts", "Gate parts", (p) => p.hardware.filter((h) => !["motor", "access", "misc"].includes(h.cat)), "hardware", "cost"],
  ["motors", "Motors and remotes", (p) => p.hardware.filter((h) => h.cat === "motor" || h.cat === "access"), "hardware", "cost"],
  ["site", "Travel and hire", (p) => p.hardware.filter((h) => h.cat === "misc"), "hardware", "cost"],
  ["labour", "Our team per hour", (p) => p.labour, "labour", "rate"],
  ["paint", "Paint and galvanising", (p) => p.finishes.filter((f) => f.id !== "none"), "finishes", "perM2"],
  ["addon", "How much we add on", () => [], "", ""],
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
      const note = sh[3] === "materials" && !x.sheet ? `${(x.stock / 1000).toLocaleString("en-AU")} m length` : sh[3] === "labour" ? "per hour" : x.note || "";
      return `<div class="prow ${sh[3] === "hardware" ? "wide" : ""}"><div><b>${esc(x.name)}</b>${note ? `<small>${esc(note)}</small>` : ""}
        ${x.added ? `<button class="linkbtn" data-act="remove" data-list="${sh[3]}" data-id="${x.id}">${ICON.bin}Remove</button>` : ""}</div>
        <div class="pair">${sh[3] === "hardware" ? `<button class="offer ${x.offer ? "on" : ""}" data-act="offer" data-id="${x.id}">${x.offer ? ICON.tick : ""}Offer on gates</button>` : ""}
        <div class="money-in"><span>$</span><input data-list="${sh[3]}" data-id="${x.id}" data-f="${sh[4]}" inputmode="decimal" value="${x[sh[4]]}"></div></div></div>`;
    }).join("") || `<p class="muted">Nothing matches.</p>`;
  }
  return `<h1 class="big-t">Prices</h1><p class="hello" style="margin-top:-10px">What things cost Apex, before GST. Change a number, then press <b>Save for everyone</b> at the bottom.</p>
  <div class="shelves">${SHELVES.map((s) => `<button class="shelf ${s[0] === sh[0] ? "on" : ""}" data-act="shelf" data-v="${s[0]}"><b>${s[1]}</b></button>`).join("")}</div>
  ${["addon", "paint"].includes(sh[0]) ? "" : `<div class="pbar"><div class="fld"><input data-find placeholder="Search ${sh[1].toLowerCase()}" value="${esc(st.find)}"></div><button class="btn dark small" data-act="rise">Prices went up by a %</button><button class="btn ghost small" data-act="tab" data-v="add">${ICON.plus}Add new</button></div>`}
  ${sh[3] === "hardware" ? `<p class="muted" style="margin:0 0 12px">"Offer on gates" puts the item in an Extras tab on every gate, so the team can add it.</p>` : ""}
  <div class="plist">${rows}</div>`;
}

/* add new equipment and materials */
function viewAdd() {
  const seg = (name, opts, cur) => `<div class="segrow">${opts.map(([v, l]) => `<button class="${cur === v ? "on" : ""}" data-act="aseg" data-n="${name}" data-v="${v}">${l}</button>`).join("")}</div>`;
  const a = (st.addH ||= { cat: "hinge", name: "", cost: "", note: "", offer: false });
  const m = (st.addM ||= { cat: "frame", name: "", cost: "", len: 6.5, size: "", kgm: "", w: 2400, h: 1200, kgm2: "" });
  const sheet = m.cat === "sheet";
  return `<h1 class="big-t">Add something new</h1>
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
  <section class="card pad" style="margin-top:16px"><h2 class="qh">Numbers</h2><div class="two">${f("gst", "GST %", "num")}${f("deposit", "Deposit asked for %", "num")}${f("validity", "Quote is good for (days)", "num")}${f("minMargin", "Warn when Apex makes under %", "num")}${f("round", "Round totals to the nearest $", "num")}${f("kerf", "Saw cut (mm)", "num")}</div></section>
  <section class="card pad" style="margin-top:16px"><h2 class="qh">${ICON.undo}Undo a save</h2><p class="muted" style="margin-top:-6px">Every save is kept. Go back to an earlier one if something went wrong.</p>
    ${st.history ? (st.history.length ? `<div class="hist">${st.history.map((n) => `<div class="prow ro"><b>${esc(histDate(n))}</b><button class="btn ghost small" data-act="restore" data-n="${esc(n)}">Go back to this</button></div>`).join("")}</div>` : `<p class="muted">No earlier saves yet.</p>`) : `<button class="btn ghost small" data-act="history">Show earlier saves</button>`}
  </section>
  <section class="card pad" style="margin-top:16px"><h2 class="qh">More</h2><div style="display:flex;gap:10px;flex-wrap:wrap">
    <a class="btn ghost small" href="full.html" style="text-decoration:none">Full tool (cut lists and formulas)</a>
    <button class="btn ghost small" data-act="logout">${ICON.lock}Lock the office on this device</button></div></section>`;
}
const histDate = (n) => { const m = n.match(/^(\d{4})-(\d\d)-(\d\d)T(\d\d)-(\d\d)/); return m ? new Date(Date.UTC(+m[1], m[2] - 1, +m[3], +m[4], +m[5])).toLocaleString("en-AU", { weekday: "short", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" }) : n; };

/* ---------- actions ---------- */
document.addEventListener("click", async (e) => {
  const b = e.target.closest("[data-act]"); if (!b) return;
  const a = b.dataset.act;
  if (a === "tab") { st.tab = b.dataset.v; st.gate = null; render(); scrollTo(0, 0); }
  if (a === "login") {
    try { await api({ action: "login", password: $("#opw").value }); st.err = ""; await load(); } catch (err) { st.err = err.message; render(); }
  }
  if (a === "logout") { await api({ action: "logout" }).catch(() => {}); location.href = "index.html"; }
  if (a === "shelf") { st.shelf = b.dataset.v; st.find = ""; render(); }
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
  if (el.matches("[data-find]")) { st.find = el.value; const pos = el.selectionStart; render(); const n = $("[data-find]"); n.focus(); n.setSelectionRange(pos, pos); }
});
document.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.id === "opw") $("[data-act=login]").click(); });
window.addEventListener("beforeunload", (e) => { if (st.dirty) { e.preventDefault(); e.returnValue = ""; } });

render();
load();
