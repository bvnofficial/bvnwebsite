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
  return out;
}

/* what the technicians get: every price already has the markup added and the
   markups are zero, so their tablets never learn what Apex pays or adds on.
   Running it twice changes nothing. The server does the same before sending. */
export function teamView(pb) {
  const t = clone(pb), mk = t.markup || {};
  const up = (cat, v) => (+v || 0) * (1 + (mk[cat] || 0) / 100);
  for (const m of t.materials || []) m.cost = up("materials", m.cost);
  for (const h of t.hardware || []) h.cost = up(h.cat === "motor" || h.cat === "access" ? "motors" : "hardware", h.cost);
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
