/* Apex Quote engine: a small formula language, the calculator that turns a
   gate or fence template into a cut list, hardware, labour and finish, and a
   cutting optimiser that packs every cut into full stock lengths. No DOM here. */

/* ---------- formula language ----------
   Numbers, "strings", variables, + - * / % ^, comparisons, && || !, and
   functions: ceil floor round min max abs sqrt if(cond, a, b) clamp(x, lo, hi)
   plus dim(mat) perim(mat) stock(mat) kgm(mat) that read the price book. */
const FN = {
  ceil: Math.ceil, floor: Math.floor, round: (x, d = 0) => { const p = 10 ** d; return Math.round(x * p) / p; },
  min: Math.min, max: Math.max, abs: Math.abs, sqrt: Math.sqrt,
  if: (c, a, b) => (c ? a : b), clamp: (x, lo, hi) => Math.min(hi, Math.max(lo, x)),
};

function tokenize(src) {
  const t = []; let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/[0-9.]/.test(c)) { let j = i; while (j < src.length && /[0-9._]/.test(src[j])) j++; if (/[eE]/.test(src[j] || "") && /[0-9+-]/.test(src[j + 1] || "")) { j += 2; while (j < src.length && /[0-9]/.test(src[j])) j++; } t.push({ k: "n", v: parseFloat(src.slice(i, j).replace(/_/g, "")) }); i = j; continue; }
    if (/[A-Za-z_]/.test(c)) { let j = i; while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++; t.push({ k: "id", v: src.slice(i, j) }); i = j; continue; }
    if (c === '"' || c === "'") { let j = i + 1; while (j < src.length && src[j] !== c) j++; if (j >= src.length) throw new Error("Unclosed quote"); t.push({ k: "s", v: src.slice(i + 1, j) }); i = j + 1; continue; }
    const two = src.slice(i, i + 2);
    if (["<=", ">=", "==", "!=", "&&", "||"].includes(two)) { t.push({ k: "op", v: two }); i += 2; continue; }
    if ("+-*/%^()<>!,?:".includes(c)) { t.push({ k: "op", v: c }); i++; continue; }
    throw new Error(`Unexpected "${c}"`);
  }
  return t;
}

/* Pratt parser to a closure tree, so a formula is parsed once and run many times. */
export function compile(src) {
  const toks = tokenize(String(src)); let p = 0;
  const peek = () => toks[p], next = () => toks[p++];
  const want = (v) => { const x = next(); if (!x || x.v !== v) throw new Error(`Expected "${v}"`); };
  const BP = { "?": 1, "||": 2, "&&": 3, "==": 4, "!=": 4, "<": 5, ">": 5, "<=": 5, ">=": 5, "+": 6, "-": 6, "*": 7, "/": 7, "%": 7, "^": 9 };
  function prefix() {
    const x = next(); if (!x) throw new Error("Formula ends too soon");
    if (x.k === "n" || x.k === "s") { const v = x.v; return () => v; }
    if (x.k === "id") {
      if (peek() && peek().v === "(") {
        next(); const args = [];
        if (peek() && peek().v !== ")") { do { args.push(expr(0)); } while (peek() && peek().v === "," && next()); }
        want(")");
        const name = x.v;
        if (name === "if") { const [c, a, b] = args; return (e) => (c(e) ? a(e) : b ? b(e) : 0); }
        return (e) => { const f = FN[name] || e.$fn?.[name]; if (!f) throw new Error(`Unknown function ${name}()`); return f(...args.map((a) => a(e))); };
      }
      const name = x.v;
      if (name === "true") return () => 1; if (name === "false") return () => 0;
      return (e) => { if (!(name in e)) throw new Error(`Unknown name "${name}"`); const v = e[name]; return typeof v === "boolean" ? +v : v; };
    }
    if (x.v === "(") { const a = expr(0); want(")"); return a; }
    if (x.v === "-") { const a = expr(8); return (e) => -a(e); }
    if (x.v === "+") return expr(8);
    if (x.v === "!") { const a = expr(8); return (e) => +!a(e); }
    throw new Error(`Unexpected "${x.v}"`);
  }
  function expr(min) {
    let left = prefix();
    for (;;) {
      const o = peek(); if (!o || o.k !== "op" || !(o.v in BP)) break;
      const bp = BP[o.v]; if (bp < min) break; next();
      if (o.v === "?") { const a = expr(0); want(":"); const b = expr(1); const c = left; left = (e) => (c(e) ? a(e) : b(e)); continue; }
      const right = expr(o.v === "^" ? bp : bp + 1), l = left;
      const op = {
        "+": (a, b) => a + b, "-": (a, b) => a - b, "*": (a, b) => a * b, "/": (a, b) => (b === 0 ? 0 : a / b), "%": (a, b) => a % b, "^": (a, b) => a ** b,
        "==": (a, b) => +(a == b), "!=": (a, b) => +(a != b), "<": (a, b) => +(a < b), ">": (a, b) => +(a > b), "<=": (a, b) => +(a <= b), ">=": (a, b) => +(a >= b),
        "&&": (a, b) => +(a && b), "||": (a, b) => +(a || b),
      }[o.v];
      left = (e) => op(l(e), right(e));
    }
    return left;
  }
  const root = expr(0);
  if (p < toks.length) throw new Error(`Unexpected "${toks[p].v}"`);
  return root;
}

const cache = new Map();
export function evaluate(src, env) {
  if (typeof src === "number") return src;
  let f = cache.get(src);
  if (!f) { f = compile(src); cache.set(src, f); }
  const v = f(env);
  return typeof v === "number" && !Number.isFinite(v) ? 0 : v;
}

/* ---------- running a template ---------- */
export const byId = (list, id) => list.find((x) => x.id === id);

export function defaults(tpl) {
  const v = {}; for (const i of tpl.inputs) v[i.k] = i.def; return v;
}

/* Turns one quote item (template + its input values) into parts, with every
   formula error reported against the line that caused it. */
export function runItem(tpl, values, pb) {
  const errors = [], warnings = [];
  const mat = (id) => byId(pb.materials, id) || {};
  const env = {
    $fn: { dim: (m) => mat(m).dim || 0, perim: (m) => mat(m).perim || 0, stock: (m) => mat(m).stock || 0, kgm: (m) => mat(m).kgm || 0, depth: (m) => mat(m).depth || mat(m).dim || 0 },
  };
  for (const i of tpl.inputs) {
    let v = values[i.k] ?? i.def;
    if (i.type === "num") v = +v || 0;
    if (i.type === "bool") v = v ? 1 : 0;
    if (i.type === "seg" && typeof i.def === "number") v = +v;
    env[i.k] = v;
  }
  const run = (src, where) => { try { return evaluate(src, env); } catch (e) { errors.push(`${where}: ${e.message}`); return 0; } };
  for (const [k, src] of tpl.vars || []) env[k] = run(src, `Value ${k}`);

  const cuts = [];
  for (const c of tpl.cuts || []) {
    const m = env[c.mat] !== undefined && typeof env[c.mat] === "string" ? env[c.mat] : c.mat;
    const qty = Math.round(run(c.qty, c.label + " quantity"));
    const len = Math.round(run(c.len, c.label + " length"));
    if (qty > 0 && len > 0) cuts.push({ label: c.label, mat: m, len, qty, noCoat: !!c.noCoat });
  }
  const sheets = [];
  for (const s of tpl.sheets || []) {
    const m = typeof env[s.mat] === "string" ? env[s.mat] : s.mat;
    const area = run(s.area, s.label + " area");
    if (area > 0) sheets.push({ label: s.label, mat: m, area });
  }
  const items = [];
  for (const h of tpl.items || []) {
    const id = typeof env[h.id] === "string" && h.id in env ? env[h.id] : h.id;
    const qty = run(h.qty, (h.label || id) + " quantity");
    if (qty > 0 && id && id !== "none") items.push({ id, qty: Math.round(qty * 100) / 100 });
  }
  const labour = [];
  for (const l of tpl.labour || []) {
    const hours = run(l.hours, `${l.label || l.rate} hours`);
    if (hours > 0) labour.push({ rate: l.rate, label: l.label, hours: Math.round(hours * 4) / 4 });
  }
  const direct = [];
  for (const d of tpl.direct || []) {
    const amount = run(d.qty, "Quantity") * run(d.unit, "Unit cost");
    if (amount) direct.push({ cat: typeof env[d.cat] === "string" ? env[d.cat] : d.cat, amount });
  }

  // weight and coating area come straight from the cut list
  let kg = 0, area = 0;
  for (const c of cuts) {
    const m = mat(c.mat); kg += (c.len / 1000) * c.qty * (m.kgm || 0);
    if (!c.noCoat) area += (c.len / 1000) * c.qty * ((m.perim || 0) / 1000);
  }
  for (const s of sheets) { const m = mat(s.mat); kg += s.area * (m.kgm2 || 0); area += s.area * 2; }
  env.kg = Math.round(kg); env.area = Math.round(area * 10) / 10;
  for (const w of tpl.checks || []) { if (run(w.when, "Check")) warnings.push(w.msg.replace(/\{(\w+)\}/g, (_, k) => fmtNum(env[k]))); }
  const finish = env.finish || "none";
  const desc = (tpl.describe || tpl.name).replace(/\{(\w+)\}/g, (_, k) => {
    const inp = tpl.inputs.find((i) => i.k === k);
    if (inp?.type === "seg") { const o = inp.opts.find((o) => o[0] == env[k]); return o ? o[1].toLowerCase() : ""; }
    if (inp?.type === "mat") return mat(env[k]).name || "";
    return fmtNum(env[k]);
  }).replace(/\s+,/g, ",").replace(/\s{2,}/g, " ").trim();
  return { env, cuts, sheets, items, labour, direct, kg, area, finish, errors, warnings, desc };
}

export const fmtNum = (n) => (typeof n === "number" ? (Number.isInteger(n) ? n.toLocaleString("en-AU") : (+n.toFixed(1)).toLocaleString("en-AU")) : n ?? "");

/* ---------- cutting optimiser ----------
   Best fit decreasing over full stock lengths with a saw kerf. Any cut longer
   than a stock length is split into welded joins, which the cut list flags. */
export function packCuts(cuts, stockLen, kerf = 3, minOff = 0) {
  const pieces = []; const joins = [];
  for (const c of cuts) {
    for (let n = 0; n < c.qty; n++) {
      if (c.len > stockLen) {
        let left = c.len, part = 1; joins.push(c.label);
        while (left > 0) { const l = Math.min(left, stockLen); pieces.push({ label: `${c.label} (part ${part++})`, len: l, item: c.item }); left -= l; }
      } else pieces.push({ label: c.label, len: c.len, item: c.item });
    }
  }
  pieces.sort((a, b) => b.len - a.len);
  const bars = [];
  for (const p of pieces) {
    let best = null, bestLeft = Infinity;
    for (const b of bars) {
      const need = p.len + (b.cuts.length ? kerf : 0);
      const left = b.free - need;
      if (left >= 0 && left < bestLeft && (left === 0 || left >= minOff || left < 1)) { best = b; bestLeft = left; }
    }
    if (!best) { best = { cuts: [], free: stockLen }; bars.push(best); }
    best.free -= p.len + (best.cuts.length ? kerf : 0);
    best.cuts.push(p);
  }
  const used = pieces.reduce((s, p) => s + p.len, 0);
  const total = bars.length * stockLen;
  return { bars, used, total, waste: total ? 1 - used / total : 0, joins: [...new Set(joins)] };
}

/* ---------- pricing a whole quote ---------- */
export function priceQuote(quote, templates, pb) {
  const s = pb.settings;
  const lines = [], allCuts = new Map(), sheetNeed = new Map(), warnings = [], errors = [];
  let kgTotal = 0;
  const up = (cat) => 1 + (pb.markup[cat] ?? 0) / 100;

  for (const it of quote.items) {
    const tpl = byId(templates, it.tpl); if (!tpl) continue;
    const r = runItem(tpl, it.values, pb);
    const line = { id: it.id, tpl, r, name: it.name || tpl.name, desc: r.desc, cost: { materials: 0, hardware: 0, motors: 0, labour: 0, finish: 0, other: 0 } };
    for (const c of r.cuts) {
      if (!allCuts.has(c.mat)) allCuts.set(c.mat, []);
      allCuts.get(c.mat).push({ ...c, item: it.id });
    }
    for (const sh of r.sheets) sheetNeed.set(sh.mat, (sheetNeed.get(sh.mat) || []).concat({ ...sh, item: it.id }));
    for (const h of r.items) {
      const x = byId(pb.hardware, h.id);
      if (!x) { r.errors.push(`Item "${h.id}" is not in the price book`); continue; }
      const cat = x.cat === "motor" || x.cat === "access" ? "motors" : "hardware";
      line.cost[cat] += x.cost * h.qty;
      h.name = x.name; h.unit = x.cost; h.cat = cat;
    }
    for (const l of r.labour) {
      const rate = byId(pb.labour, l.rate);
      if (!rate) { r.errors.push(`Labour rate "${l.rate}" is not in the price book`); continue; }
      l.name = l.label || rate.name; l.unit = rate.rate;
      line.cost.labour += rate.rate * l.hours * (l.rate === "install" ? (r.env.crew || 1) : 1);
      l.crew = l.rate === "install" ? r.env.crew || 1 : 1;
    }
    const f = byId(pb.finishes, r.finish);
    if (f && f.id !== "none") line.cost.finish += Math.max(f.min || 0, f.perM2 * r.area + (f.perKg || 0) * r.kg);
    for (const d of r.direct) line.cost[d.cat in line.cost ? d.cat : "other"] += d.amount;
    kgTotal += r.kg;
    r.warnings.forEach((w) => warnings.push(`${line.name}: ${w}`));
    r.errors.forEach((e) => errors.push(`${line.name}: ${e}`));
    lines.push(line);
  }

  // Steel is bought in full lengths across the whole job, then shared back to
  // each line by the share of metres it used, so offcuts are paid for once.
  const packs = [];
  for (const [mid, cuts] of allCuts) {
    const m = byId(pb.materials, mid);
    if (!m) { errors.push(`Material "${mid}" is not in the price book`); continue; }
    const pk = packCuts(cuts, m.stock, s.kerf, s.minOffcut);
    const cost = pk.bars.length * m.cost;
    packs.push({ mat: m, ...pk, cost });
    if (pk.joins.length) warnings.push(`${m.name}: ${pk.joins.join(", ")} longer than a ${m.stock} mm length, joined`);
    const byItem = new Map();
    for (const c of cuts) byItem.set(c.item, (byItem.get(c.item) || 0) + c.len * c.qty);
    for (const l of lines) l.cost.materials += pk.used ? cost * ((byItem.get(l.id) || 0) / pk.used) : 0;
  }
  const sheetPacks = [];
  for (const [mid, list] of sheetNeed) {
    const m = byId(pb.materials, mid); if (!m) continue;
    const a = list.reduce((t, x) => t + x.area, 0);
    const per = ((m.w || 2400) * (m.h || 1200)) / 1e6;
    const count = Math.ceil((a * (1 + s.sheetWaste / 100)) / per);
    sheetPacks.push({ mat: m, area: a, count, cost: count * m.cost });
    for (const l of lines) { const mine = list.filter((x) => x.item === l.id).reduce((t, x) => t + x.area, 0); l.cost.materials += a ? (count * m.cost * mine) / a : 0; }
  }

  const tot = { cost: 0, sell: 0, byCat: {} };
  for (const l of lines) {
    l.costTotal = 0; l.sell = 0;
    for (const [cat, v] of Object.entries(l.cost)) {
      l.costTotal += v; l.sell += v * up(cat);
      tot.byCat[cat] = (tot.byCat[cat] || { cost: 0, sell: 0 });
      tot.byCat[cat].cost += v; tot.byCat[cat].sell += v * up(cat);
    }
    tot.cost += l.costTotal; tot.sell += l.sell;
  }
  const disc = Math.min(Math.max(+quote.discount || 0, 0), 100);
  const exGstRaw = tot.sell * (1 - disc / 100);
  const exGst = s.round ? Math.round(exGstRaw / s.round) * s.round : exGstRaw;
  const gst = exGst * (s.gst / 100);
  const margin = exGst ? (exGst - tot.cost) / exGst : 0;
  if (lines.length && s.minMargin != null && margin * 100 < s.minMargin) warnings.push(`Margin is ${(margin * 100).toFixed(1)}%, under your ${s.minMargin}% floor`);
  return { lines, packs, sheetPacks, tot, disc, exGst, gst, inc: exGst + gst, margin, kg: kgTotal, warnings, errors, rounding: exGst - exGstRaw };
}

export const money = (n, cents = false) => (n || 0).toLocaleString("en-AU", { style: "currency", currency: "AUD", minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 });
