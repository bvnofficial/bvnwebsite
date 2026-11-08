/* Dimensioned front elevations, drawn in millimetres from the same numbers the
   calculator uses, so the drawing and the cut list can never disagree. */
import { fmtNum } from "./engine.js";

const COLOURS = {
  monument: "#323233", black: "#141414", "night sky": "#141414", basalt: "#6d6c6e", "woodland grey": "#4b4c46", ironstone: "#3e434c",
  "deep ocean": "#364152", "wallaby": "#7f7c78", "windspray": "#888b8a", "shale grey": "#bdbfba", "dune": "#b1ada3", "surfmist": "#e4e2d5",
  "classic cream": "#e9dcb8", "paperbark": "#cabfa4", "jasper": "#6c6153", "manor red": "#5e1d0e", "pale eucalypt": "#7c846a", white: "#f2f2f0",
};
export const steelColour = (name) => COLOURS[String(name || "").trim().toLowerCase()] || "#3a3b3f";

const r = (x, y, w, h, fill, extra = "") => `<rect x="${x}" y="${-y - h}" width="${Math.max(w, 0)}" height="${Math.max(h, 0)}" fill="${fill}" ${extra}/>`;
const line = (x1, y1, x2, y2, cls) => `<line x1="${x1}" y1="${-y1}" x2="${x2}" y2="${-y2}" class="${cls}"/>`;
const txt = (x, y, s, cls = "dt", extra = "") => `<text x="${x}" y="${-y}" class="${cls}" ${extra}>${s}</text>`;

function dimH(x1, x2, y, label, tick = 60) {
  return `<g class="dim">${line(x1, y, x2, y, "dl")}${line(x1, y - tick, x1, y + tick, "dl")}${line(x2, y - tick, x2, y + tick, "dl")}
  ${txt((x1 + x2) / 2, y + 45, label, "dt", 'text-anchor="middle"')}</g>`;
}
function dimV(x, y1, y2, label, tick = 60) {
  const cy = (y1 + y2) / 2;
  return `<g class="dim">${line(x, y1, x, y2, "dl")}${line(x - tick, y1, x + tick, y1, "dl")}${line(x - tick, y2, x + tick, y2, "dl")}
  <text x="${x - 50}" y="${-cy}" class="dt" text-anchor="middle" transform="rotate(-90 ${x - 50} ${-cy})">${label}</text></g>`;
}

/* a framed leaf with its infill, bottom left corner at x, y */
function leaf(x, y, w, h, e, col, bottomF) {
  const f = e.f || 50, bf = bottomF || f, ip = e.ip || 25, gap = e.gap || 75;
  let s = r(x, y, w, h, "none", `class="leaf"`);
  const innerW = w - 2 * f, innerH = h - f - bf;
  if (e.infill === "picket" || e.infill === "palisade") {
    const n = Math.max(0, Math.ceil((innerW - gap) / (ip + gap)));
    const g = (innerW - n * ip) / (n + 1);
    for (let i = 0; i < n; i++) {
      const px = x + f + g + i * (ip + g);
      s += r(px, y + bf, ip, innerH, col, e.infill === "palisade" ? `class="pale"` : "");
      if (e.infill === "palisade") s += `<polygon points="${px},${-(y + h)} ${px + ip / 2},${-(y + h + 90)} ${px + ip},${-(y + h)}" fill="${col}"/>`;
    }
  } else if (e.infill === "slat") {
    const n = Math.max(0, Math.ceil((innerH - gap) / (ip + gap)));
    const g = (innerH - n * ip) / (n + 1);
    for (let i = 0; i < n; i++) s += r(x + f, y + bf + g + i * (ip + g), innerW, ip, col);
  } else if (e.infill === "mesh") {
    s += r(x + f, y + bf, innerW, innerH, "url(#mesh)", `opacity=".9"`);
  } else if (e.infill === "sheet") {
    s += r(x + f, y + bf, innerW, innerH, col, `opacity=".82"`);
  }
  s += r(x, y, f, h, col) + r(x + w - f, y, f, h, col) + r(x, y + h - f, w, f, col) + r(x, y, w, bf, col);
  if (e.mid) s += r(x, y + h / 2 - f / 2, w, f, col);
  return s;
}
const post = (x, y0, w, h, col) => r(x, y0, w, h, col) + r(x - 6, y0 + h, w + 12, 14, col);
const pier = (x, w, h) => r(x, 0, w, h, "url(#render)", `class="pier"`) + r(x - 20, h, w + 40, 50, "#cfc6b4");
const motorBox = (x, y, w, h) => `<g class="motor">${r(x, y, w, h, "#d61d09", `rx="18"`)}${r(x + 60, y + h - 90, w - 120, 30, "#fff", 'opacity=".55" rx="10"')}</g>`;

function frame(minX, maxX, maxY, body) {
  const pad = 380, w = maxX - minX + pad * 2;
  // labels and lines keep the same size on screen whatever the span
  const fs = Math.max(92, w / 42), sw = Math.max(7, w / 900), top = maxY + 220 + fs;
  return `<svg class="elev" viewBox="${minX - pad} ${-top} ${w} ${top + 520 + fs}" style="--fs:${fs.toFixed(0)}px;--fs2:${(fs * 0.8).toFixed(0)}px;--sw:${sw.toFixed(1)}" xmlns="http://www.w3.org/2000/svg" role="img">
  <defs>
    <pattern id="mesh" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M0 0H50M0 0V50" stroke="currentColor" stroke-width="5" opacity=".75"/></pattern>
    <pattern id="render" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="#e8e1d2"/><circle cx="12" cy="18" r="3" fill="#d9d0bd"/><circle cx="42" cy="44" r="2.5" fill="#d9d0bd"/></pattern>
    <pattern id="earth" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V40" stroke="#b8ad97" stroke-width="6"/></pattern>
  </defs>
  ${r(minX - pad, -260, w, 260, "url(#earth)", 'opacity=".35"')}
  ${line(minX - pad, 0, maxX + pad, 0, "ground")}
  ${body}</svg>`;
}

function swing(e, col) {
  const W = e.W, L = e.L || 1, pd = e.postW || 100;
  const hp = e.posts ?? 0, cp = e.catchPosts ?? 0;
  let s = "";
  const leftPost = L === 2 ? hp >= 1 : hp >= 1, rightPost = L === 2 ? hp >= 2 : cp >= 1;
  s += leftPost ? post(-pd, 0, pd, e.H + (e.postAbove || 50), col) : pier(-450, 450, e.H + 100);
  s += rightPost ? post(W, 0, pd, e.H + (e.postAbove || 50), col) : pier(W, 450, e.H + 100);
  for (let i = 0; i < L; i++) {
    const x = (e.side || 15) + i * (e.leafW + (e.midgap || 10));
    s += leaf(x, e.gc || 50, e.leafW, e.leafH, e, col);
    if (e.auto === "linear") {
      // linear motors sit behind the bottom rail, seen from inside
      const mx = i === 0 ? x + 120 : x + e.leafW - 120 - Math.min(1000, e.leafW * 0.55);
      s += `<g class="motor ghost">${r(mx, (e.gc || 50) + 80, Math.min(1000, e.leafW * 0.55), 90, "#d61d09", 'rx="40" opacity=".85"')}</g>`;
    }
    if (e.auto === "under") s += r(i === 0 ? x - 60 : x + e.leafW - 260, -220, 320, 200, "#d61d09", 'rx="14" opacity=".8"');
  }
  if (e.auto && e.auto !== "none") s += txt(W / 2, -140, e.auto === "linear" ? "Linear motors behind the bottom rail (inside)" : "Underground motors in the footings", "mt2", 'text-anchor="middle"');
  s += dimH(0, W, -330, `${fmtNum(W)} opening`);
  if (L === 2) s += dimH(e.side || 15, (e.side || 15) + e.leafW, e.H + 120, `${fmtNum(Math.round(e.leafW))} leaf`);
  s += dimV(-pd - 220, 0, e.H, `${fmtNum(e.H)}`);
  return frame(-pd - 450, W + pd + 450, e.H + 260, s);
}

function slide(e, col, cant) {
  const W = e.W, left = e.dir !== "right", pd = e.postW || 100, Lg = e.leafL, H = e.H;
  const x0 = cant ? (left ? -(Lg - W - 50) : -50) : -(e.over || 100);
  let s = "";
  s += pier(-450, 450, H + 100) + pier(W, 450, H + 100);
  // open position, dashed
  const openX = left ? x0 - W : x0 + W;
  s += r(openX, cant ? 120 : 60, Lg, (cant ? e.leafH : e.leafH), "none", 'class="ghostleaf"');
  if (!cant) s += r(Math.min(x0, openX) - 50, -10, e.trackLen, 25, "#8b8d93");
  // support posts behind the piers, level with the opening face, next to the motor
  const sp = e.posts || 0, side = left ? -pd : W;
  for (let i = 0; i < sp; i++) {
    const px = cant ? (left ? -pd - i * Math.max(900, (Lg - W) * 0.6) : W + i * Math.max(900, (Lg - W) * 0.6)) : side;
    s += post(px, 0, pd, H + (e.postAbove || 0) - (cant ? 200 : 0), col);
  }
  if (e.catchPosts) s += post(left ? W : -pd, 0, pd, H + (e.postAbove || 50), col);
  s += leaf(x0, cant ? 120 : 60, Lg, e.leafH, { ...e, f: e.f }, col, cant ? e.f : e.bf);
  if (cant) {
    s += r(x0, 120 - 110, Lg, 100, "#8b8d93");
    const c1 = left ? -450 - 650 : W + 450 + 50, c2 = left ? -450 - Math.max(1600, (Lg - W) * 0.85) : W + 450 + Math.max(1000, (Lg - W) * 0.85) - 600;
    s += r(c1, 0, 600, 140, "#55575d") + r(c2, 0, 600, 140, "#55575d");
  } else {
    const wy = 30;
    s += `<circle cx="${x0 + 350}" cy="${-wy}" r="48" class="wheel"/><circle cx="${x0 + Lg - 350}" cy="${-wy}" r="48" class="wheel"/>`;
  }
  if (e.motor && e.motor !== "none") s += motorBox(left ? -450 - 520 : W + 450 + 90, 0, 430, 330, "Motor");
  if (e.motor && e.motor !== "none") s += txt(left ? -450 - 300 : W + 450 + 300, -150, "Motor behind the pier", "mt2", `text-anchor="${left ? "end" : "start"}" dominant-baseline="hanging"`);
  s += dimH(0, W, -330, `${fmtNum(W)} opening`);
  s += dimH(x0, x0 + Lg, H + 160, `${fmtNum(Math.round(Lg))} gate`);
  s += dimV(Math.max(W, x0 + Lg, openX + Lg) + 560, 0, H, fmtNum(H));
  const minX = Math.min(-1200, openX, x0) - 200, maxX = Math.max(W + 1200, openX + Lg, x0 + Lg) + 700;
  return frame(minX, maxX, H + 300, s);
}

function bifold(e, col) {
  const W = e.W, n = e.panels, pd = e.postW || 100;
  let s = (e.posts >= 1 ? post(-pd, 0, pd, e.H + 50, col) : pier(-450, 450, e.H + 100)) + (e.posts >= 2 || e.catchPosts ? post(W, 0, pd, e.H + 50, col) : pier(W, 450, e.H + 100));
  for (let i = 0; i < n; i++) s += leaf(15 + i * (e.panelW + 10), 50, e.panelW, e.leafH, e, col);
  if (e.on) s += txt(W / 2, -140, "Bifold motors behind the bottom rail (inside)", "mt2", 'text-anchor="middle"');
  s += dimH(0, W, -330, `${fmtNum(W)} opening`) + dimH(15, 15 + e.panelW, e.H + 120, `${fmtNum(Math.round(e.panelW))} panel`) + dimV(-pd - 220, 0, e.H, fmtNum(e.H));
  return frame(-pd - 450, W + pd + 450, e.H + 260, s);
}

function fence(e, col) {
  const pd = e.pd, bays = e.bays, bw = e.bayW, show = Math.min(bays, 5);
  let s = "", x = 0;
  const ph = e.pierH - e.wallH;
  if (e.ends) s += pier(-450, 450, e.pierH + 60);
  for (let i = 0; i < show; i++) {
    if (!e.ends || i > 0) { s += post(x, e.wallH, pd, ph, col); x += pd; }
    if (e.wallH > 0) s += r(x - (i === 0 && e.ends ? 0 : pd), 0, bw + pd * (i === 0 && e.ends ? 0 : 1) + (i === show - 1 ? pd : 0), e.wallH, "url(#render)", 'class="pier"');
    s += leaf(x, e.wallH + 25, bw, e.panelH, { ...e, f: e.f, mid: e.rails > 2 }, col);
    x += bw;
  }
  if (show < bays) s += txt(x + 400, e.pierH / 2, `+ ${bays - show} more panels`, "mt2");
  else if (e.ends) s += pier(x, 450, e.pierH + 60); else s += post(x, e.wallH, pd, ph, col);
  s += dimH(0, bw + (e.ends ? 0 : pd), -330, `${fmtNum(Math.round(bw))} panel`);
  s += dimV(-600, 0, e.pierH, fmtNum(e.pierH));
  if (e.wallH > 0) s += dimV(x + (show < bays ? 1600 : 700), 0, e.wallH, `${fmtNum(e.wallH)} wall`);
  return frame(-700, x + (show < bays ? 2000 : 900), e.pierH + 260, s);
}

function posts(e, col) {
  const n = Math.min(e.qty, 8), pd = e.postW || 100, gap = 900;
  let s = "";
  for (let i = 0; i < n; i++) {
    const x = i * (pd + gap);
    s += post(x, 0, pd, e.above, col);
    if (e.mount === "ground") s += r(x, -e.embed, pd, e.embed, col, 'opacity=".35"') + r(x - 120, -e.embed - 60, pd + 240, e.embed + 60, "#9a9a92", 'opacity=".25"');
    else s += r(x - 75, 0, pd + 150, 12, "#55575d");
  }
  const w = n * (pd + gap) - gap;
  s += dimV(-300, 0, e.above, fmtNum(e.above));
  if (e.mount === "ground") s += dimV(w + 300, -e.embed, 0, `${fmtNum(e.embed)} in ground`);
  return frame(-500, w + 500, e.above + 200, s).replace(/viewBox="([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)"/, (m, a, b, c, d) => `viewBox="${a} ${b} ${c} ${+d + (e.mount === "ground" ? e.embed : 0)}"`);
}

export function drawItem(tpl, run, pb) {
  if (!run || tpl.draw === "none") return "";
  const e = { ...run.env };
  const pm = pb.materials.find((m) => m.id === e.postMat);
  e.postW = pm?.dim || 100;
  const col = steelColour(e.colour);
  try {
    if (tpl.draw === "swing") return swing(e, col);
    if (tpl.draw === "slide") return slide(e, col, false);
    if (tpl.draw === "cant") return slide(e, col, true);
    if (tpl.draw === "bifold") return bifold(e, col);
    if (tpl.draw === "fence") return fence(e, col);
    if (tpl.draw === "posts") return posts(e, col);
  } catch (err) { return `<p class="small">Drawing not available: ${err.message}</p>`; }
  return "";
}
