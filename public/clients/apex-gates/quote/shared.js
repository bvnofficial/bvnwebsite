/* Builds the list of things that can be quoted from the base templates, the
   gate types the office added, and the equipment the office offers as extras.
   Used by the tablet app (easy.js) and the office page (admin.js). */

const clone = (o) => JSON.parse(JSON.stringify(o));

/* equipment the office ticked as "offer on every gate" */
export const offered = (pb) => (pb.hardware || []).filter((h) => h.offer);

function addExtras(t, pb) {
  for (const h of offered(pb)) {
    const k = `x_${h.id}`;
    if (t.inputs.find((i) => i.k === k)) continue;
    t.inputs.push({ k, label: h.name, type: "num", def: 0, unit: "", min: 0, max: 50, group: "Extras" });
    t.items = (t.items || []).concat({ id: h.id, qty: k });
  }
  return t;
}

/* gates = { custom: [...], hidden: [ids] } */
export function buildTemplates(base, pb, gates = {}) {
  const hidden = new Set(gates.hidden || []);
  const out = base.map((t) => {
    const c = clone(t);
    c.base = c.base || c.id;
    c.hidden = hidden.has(c.id);
    return c.kind === "gate" ? addExtras(c, pb) : c;
  });
  for (const g of gates.custom || []) {
    const b = base.find((t) => t.id === g.base);
    if (!b) continue;
    const t = clone(b);
    Object.assign(t, { id: g.id, name: g.name, blurb: g.blurb || "", base: b.id, custom: true, hidden: hidden.has(g.id) });
    for (const i of t.inputs) if (g.defaults && i.k in g.defaults) i.def = g.defaults[i.k];
    for (const x of g.parts || []) if (x.id && +x.qty > 0) t.items = (t.items || []).concat({ id: x.id, qty: String(+x.qty) });
    if (+g.hours > 0) t.labour = (t.labour || []).concat({ rate: "install", label: "Extra work", hours: String(+g.hours) });
    if (+g.shopHours > 0) t.labour = (t.labour || []).concat({ rate: "fab", label: "Extra workshop time", hours: String(+g.shopHours) });
    if (g.name) t.describe = `${g.name}: ` + (t.describe || "").replace(/^[^,]*,\s*/, "");
    out.push(t.kind === "gate" ? addExtras(t, pb) : t);
  }
  for (const k of pb.kits || []) out.push(kitTemplate(k, pb, hidden));
  return out;
}

/* a kit becomes something to quote: each part or hour is a count the team can
   change on the quote, and setting it to 0 takes it out for that job */
export function kitTemplate(k, pb, hidden = new Set()) {
  const name = (x) => x.kind === "hours" ? ((pb.labour || []).find((l) => l.id === x.id) || {}).name || "Labour" : ((pb.hardware || []).find((h) => h.id === x.id) || {}).name || x.id;
  const list = (k.items || []).filter((x) => x.id);
  return {
    id: "kit_" + k.id, name: k.name, blurb: k.note || "", base: "kit", kit: true, kind: "part", draw: "none", hidden: hidden.has("kit_" + k.id),
    describe: k.name,
    inputs: list.map((x, i) => ({ k: "q" + i, label: x.kind === "hours" ? name(x) + " (hours)" : name(x), type: "num", def: +x.qty || 0, unit: x.kind === "hours" ? "hours" : "", min: 0, max: 200, step: x.kind === "hours" ? 0.5 : 1, ref: { kind: x.kind, id: x.id } })),
    vars: [["finish", '"none"']],
    items: list.map((x, i) => (x.kind === "hours" ? null : { id: x.id, qty: "q" + i })).filter(Boolean),
    labour: list.map((x, i) => (x.kind === "hours" ? { rate: x.id, label: name(x), hours: "q" + i } : null)).filter(Boolean),
  };
}

/* what the technicians get: every price already has the markup added and the
   markups are zero, so their tablets never learn what Apex pays or adds on.
   Running it twice changes nothing. The server does the same before sending. */
export function teamView(pb) {
  const t = clone(pb), mk = t.markup || {};
  const up = (cat, v) => (+v || 0) * (1 + (mk[cat] || 0) / 100);
  for (const m of t.materials || []) m.cost = up("materials", m.cost);
  for (const h of t.hardware || []) { h.cost = h.sell > 0 ? h.sell : up(h.cat === "motor" || h.cat === "access" ? "motors" : "hardware", h.cost); delete h.sell; }
  for (const l of t.labour || []) l.rate = up("labour", l.rate);
  for (const f of t.finishes || []) { f.perM2 = up("finish", f.perM2); f.perKg = up("finish", f.perKg); f.min = up("finish", f.min); }
  for (const k of Object.keys(mk)) mk[k] = 0;
  if (t.settings) t.settings.minMargin = null;
  return t;
}

/* bring a saved price book up to date with any new default fields */
export function mergePricebook(saved, defaults) {
  const pb = clone(saved);
  for (const k of Object.keys(defaults)) if (!(k in pb)) pb[k] = clone(defaults[k]);
  for (const k of Object.keys(defaults.settings)) if (!(k in pb.settings)) pb.settings[k] = defaults.settings[k];
  for (const k of Object.keys(defaults.markup)) if (!(k in pb.markup)) pb.markup[k] = defaults.markup[k];
  // keep every item the formulas rely on, even if the saved book is older
  for (const list of ["materials", "hardware", "labour", "finishes"]) {
    for (const d of defaults[list]) if (!pb[list].find((x) => x.id === d.id)) pb[list].push(clone(d));
  }
  return pb;
}

/* extras the team adds while making or putting in a job, priced like the quote:
   parts from the price book, extra hours, or their own line at a customer price.
   An extra the customer is not charged for still costs Apex. */
export function priceExtras(job, pb) {
  const mk = pb.markup || {}, up = (c) => 1 + (mk[c] || 0) / 100;
  const lines = [];
  for (const x of (job && job.extras) || []) {
    const qty = +x.qty || 0;
    if (qty <= 0) continue;
    let cost = 0, full = 0, name = x.name;
    if (x.kind === "hours") {
      const r = (pb.labour || []).find((l) => l.id === x.id); if (!r) continue;
      cost = r.rate * qty; full = cost * up("labour"); name = name || r.name;
    } else if (x.kind === "own") {
      full = (+x.price || 0) * qty; cost = full / up("other");
    } else {
      const h = (pb.hardware || []).find((h) => h.id === x.id); if (!h) continue;
      cost = h.cost * qty; full = h.sell > 0 ? h.sell * qty : cost * up(h.cat === "motor" || h.cat === "access" ? "motors" : "hardware"); name = name || h.name;
    }
    const charged = x.charge !== false;
    lines.push({ ...x, qty, name, cost, full, sell: charged ? full : 0, charged });
  }
  return { lines, sell: lines.reduce((a, l) => a + l.sell, 0), cost: lines.reduce((a, l) => a + l.cost, 0) };
}

/* the money groups Simon wants to see (and Xero codes): where the money comes from */
export const GROUPS = [["install", "New install"], ["callout", "Callout or repair"], ["service", "Service or maintenance"], ["supply", "Supply only"]];
export function groupOf(q) {
  if (q.group) return q.group;
  const t = (q.items || []).map((i) => String(i.tpl));
  if (t.includes("service")) return "callout";
  if (t.some((x) => /^(swing|slide|cant|bifold|ped|fence|auto)$/.test(x) || x.startsWith("kit_") || x.startsWith("g"))) return "install";
  return t.length ? "supply" : "install";
}

/* where a job is up to, after the customer said yes */
export const STAGES = [["won", "Signed"], ["made", "Made"], ["fitted", "Put in"], ["invoiced", "Invoiced"], ["paid", "Paid"]];
export function stageOf(q) {
  const j = q.job || {};
  if (q.status !== "won") return null;
  if (j.paid) return "paid";
  if (j.invoice) return "invoiced";
  if (j.fitted) return "fitted";
  if (j.made) return "made";
  return "won";
}
