/* Scheduling and dispatch for the CEO dashboard: a week on one screen, one row
   per technician. Drag a job to another day or person, tap a gap to book a new
   one, and book a signed quote straight in. Technicians move their jobs along on
   the tablet (on the way, on site, done) and it shows here. */
import { stageOf } from "./shared.js";

const pad = (n) => String(n).padStart(2, "0");
export const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromIso = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const monday = (d) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const MON = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
/* "13-Nov-2026" from the old system, or "13/11/2026" */
export function oldDate(s) {
  let m = /^(\d{1,2})-([A-Za-z]{3})-(\d{4})/.exec(String(s || ""));
  if (m) return `${m[3]}-${pad(MON[m[2].toLowerCase()] || 1)}-${pad(+m[1])}`;
  m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(String(s || ""));
  return m ? `${m[3]}-${pad(+m[2])}-${pad(+m[1])}` : "";
}
const oldTime = (s) => { const m = /(\d{1,2}):(\d{2})\s*(am|pm)?/i.exec(String(s || "")); if (!m) return "08:00"; let h = +m[1]; if (m[3] && /pm/i.test(m[3]) && h < 12) h += 12; if (m[3] && /am/i.test(m[3]) && h === 12) h = 0; return `${pad(h)}:${m[2]}`; };
export const KINDS = ["Install", "Service", "Callout", "Repair", "Measure and quote", "Pick up or drop off"];
export const VSTEP = { booked: "Booked", onway: "On the way", onsite: "On site", done: "Done", cancelled: "Cancelled" };
export const nice = (t) => { const [h, m] = String(t || "08:00").split(":").map(Number); return `${h % 12 || 12}${m ? ":" + pad(m) : ""}${h < 12 ? "am" : "pm"}`; };
const dayName = (d) => d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
const suburb = (a) => String(a || "").split(",").map((x) => x.trim()).filter(Boolean).pop() || "";
export const mapLink = (a) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a)}`;

export function makeDispatch(ctx) {
  // ctx: api, esc, say, render, techs(), quotes(), jobs(), icon
  const { api, esc, say } = ctx;
  const S = { week: iso(monday(new Date())), list: null, loading: false, edit: null, found: [], drag: null, timer: null };

  async function load(quiet) {
    if (S.loading) return;
    S.loading = true;
    try { S.list = (await api({ action: "visits", from: S.week, to: iso(addDays(fromIso(S.week), 6)), undated: true })).list || []; }
    catch (e) { S.list = S.list || []; if (!quiet) say(e.message); }
    S.loading = false;
    if (!S.edit) ctx.render();
  }
  // technicians' taps show up without anyone pressing refresh
  function keepFresh() {
    clearInterval(S.timer);
    S.timer = setInterval(() => { if (ctx.onTab() && !S.edit && !document.hidden) load(true); else if (!ctx.onTab()) clearInterval(S.timer); }, 45000);
  }

  const days = () => Array.from({ length: 7 }, (_, i) => addDays(fromIso(S.week), i));
  /* signed quotes that still need a day to be put in */
  function toBook() {
    const have = new Set((S.list || []).map((v) => v.qid).filter(Boolean));
    const fromQ = (ctx.quotes() || []).filter((q) => q.status === "won" && ["won", "made"].includes(stageOf(q)) && !have.has(q.id) && !q.booked)
      .map((q) => ({ src: "q", key: q.id, title: q.client?.name || "No name", sub: `${q.no} · ${stageOf(q) === "made" ? "made, ready to put in" : "signed, to make and put in"}`, prefill: { qid: q.id, code: q.no, kind: "Install", client: q.client?.name || "", phone: q.client?.phone || "", address: q.client?.address || "", desc: q.items.map((i) => i.name).join(", "), hours: 4 } }));
    const undated = (S.list || []).filter((v) => !v.date && v.status !== "cancelled").map((v) => ({ src: "v", key: v.id, title: v.client || "No name", sub: `${v.kind || "Job"} · needs a day`, visit: v }));
    return undated.concat(fromQ);
  }
  /* jobs from the old system that fall on this week and are not booked here yet */
  function oldJobs() {
    const have = new Set((S.list || []).map((v) => v.code).filter(Boolean));
    const from = S.week, to = iso(addDays(fromIso(S.week), 6));
    return (ctx.jobs() || []).filter((j) => !have.has(j.code) && !["Invoiced", "Paid"].includes(j.status)).map((j) => ({ ...j, day: oldDate(j.date) })).filter((j) => j.day >= from && j.day <= to);
  }
  function rows() {
    const names = ctx.techs().slice();
    for (const v of S.list || []) if (v.date && v.tech && !names.includes(v.tech)) names.push(v.tech);
    for (const j of oldJobs()) if (j.tech && !names.includes(j.tech)) names.push(j.tech);
    return names.concat([""]);
  }

  function card(v) {
    const late = v.status === "booked" && v.date === iso(new Date()) && v.start < `${pad(new Date().getHours() - 1)}:00`;
    return `<div class="vcard s-${esc(v.status)}${late ? " late" : ""}" draggable="true" data-drag="v:${esc(v.id)}" data-dp="open" data-id="${esc(v.id)}">
      <b>${nice(v.start)} ${esc(v.client || "No name")}</b><small>${esc([v.kind, suburb(v.address)].filter(Boolean).join(" · "))}</small>
      ${v.status !== "booked" ? `<i class="vst">${esc(VSTEP[v.status])}</i>` : ""}</div>`;
  }
  function oldCard(j) {
    return `<div class="vcard old" draggable="true" data-drag="j:${esc(j.code)}" data-dp="openold" data-code="${esc(j.code)}" title="From the old system, not booked here yet">
      <b>${nice(oldTime(j.time))} ${esc(j.client || "No name")}</b><small>${esc([j.code, suburb(j.address)].filter(Boolean).join(" · "))}</small></div>`;
  }

  function view() {
    keepFresh();
    if (!S.list) { load(); return `<p class="muted">Loading the week...</p>`; }
    const D = days(), today = iso(new Date()), R = rows(), olds = oldJobs();
    const inCell = (tech, day) => (S.list || []).filter((v) => v.date === day && (v.tech || "") === tech && v.status !== "cancelled");
    const oldIn = (tech, day) => olds.filter((j) => j.day === day && (j.tech || "") === tech);
    const now = (S.list || []).filter((v) => v.date === today);
    const live = now.filter((v) => v.status === "onway" || v.status === "onsite");
    const tb = toBook();
    const head = `<div class="dphead">
      <div class="wk"><button class="btn ghost small" data-dp="wk" data-n="-7" aria-label="Last week">&#8249;</button>
        <b>${dayName(D[0])} to ${dayName(D[6])}</b>
        <button class="btn ghost small" data-dp="wk" data-n="7" aria-label="Next week">&#8250;</button>
        <button class="btn ghost small" data-dp="wk" data-n="0">This week</button></div>
      <button class="btn red small" data-dp="new">${ctx.icon.plus}Book a job</button></div>
    <div class="dptoday"><b>Today</b><span>${now.length ? `${now.length} job${now.length > 1 ? "s" : ""}, ${now.filter((v) => v.status === "done").length} done` : "Nothing booked"}</span>
      ${live.map((v) => `<span class="live s-${v.status}">${esc(v.tech || "Someone")} ${v.status === "onway" ? "is on the way to" : "is at"} ${esc(v.client)}</span>`).join("")}</div>`;
    const strip = tb.length ? `<section class="tobook"><h2 class="qh">To book <span class="muted">(${tb.length})</span></h2><p class="muted">Drag one onto a day, or tap it.</p>
      <div class="tbl">${tb.map((t) => `<div class="vcard tb" draggable="true" data-drag="${t.src}:${esc(t.key)}" data-dp="${t.src === "v" ? "open" : "bookq"}" data-id="${esc(t.key)}"><b>${esc(t.title)}</b><small>${esc(t.sub)}</small></div>`).join("")}</div></section>` : "";
    const grid = `<div class="wgrid" style="--days:7"><div class="wcorner"></div>${D.map((d) => `<div class="wday${iso(d) === today ? " today" : ""}">${dayName(d)}</div>`).join("")}
      ${R.map((tech) => `<div class="wtech">${esc(tech || "Not given to anyone")}</div>${D.map((d) => {
        const day = iso(d), list = inCell(tech, day), hrs = list.reduce((a, v) => a + (+v.hours || 0), 0);
        return `<div class="wcell${day === today ? " today" : ""}" data-cell="${esc(tech)}|${day}" data-dp="cell">${list.map(card).join("")}${oldIn(tech, day).map(oldCard).join("")}
          ${hrs ? `<span class="hrs${hrs > 8 ? " over" : ""}">${hrs}h</span>` : ""}</div>`;
      }).join("")}`).join("")}</div>`;
    return head + strip + `<div class="wscroll">${grid}</div><p class="muted" style="font-size:15px;margin-top:10px">Grey dashed cards came from the old system. Tap one to book it here. A red edge means the job should have started an hour ago and nobody has tapped On the way.</p>` + (S.edit ? form() : "");
  }

  /* ---------- the booking form ---------- */
  function blank(extra = {}) {
    return { id: "", qid: "", code: "", kind: "Install", client: "", contact: "", phone: "", address: "", desc: "", tech: ctx.techs()[0] || "", helper: "", date: iso(new Date()), start: "08:00", hours: 2, status: "booked", office: "", notes: "", log: [], ...extra };
  }
  function form() {
    const v = S.edit, techs = ctx.techs();
    const opt = (list, cur) => list.map(([val, label]) => `<option value="${esc(val)}" ${val === cur ? "selected" : ""}>${esc(label)}</option>`).join("");
    const T = [["", "Nobody yet"]].concat(techs.map((t) => [t, t]));
    if (v.tech && !techs.includes(v.tech)) T.push([v.tech, v.tech]);
    const f = (k, label, type = "text", attrs = "") => `<div class="fld"><label>${label}</label><input data-vf="${k}" type="${type}" value="${esc(v[k])}" ${attrs}></div>`;
    return `<div class="dpmodal" data-dp="shade"><div class="card pad dpform" role="dialog" aria-label="Book a job">
      <div class="jh"><h2 class="qh" style="margin:0">${v.id ? "Change this job" : "Book a job"}</h2>${v.code ? `<span class="pill">${esc(v.code)}</span>` : ""}</div>
      <div class="fld" style="margin-top:12px"><label>Customer</label><input data-vf="client" data-findc value="${esc(v.client)}" placeholder="Type a name, street or phone" autocomplete="off">
        ${S.found.length ? `<div class="found">${S.found.map((c, i) => `<button data-dp="pickc" data-i="${i}"><b>${esc(c.name)}</b><small>${esc([c.address, c.phone].filter(Boolean).join(" · "))}</small></button>`).join("")}</div>` : ""}</div>
      <div class="two">${f("phone", "Phone", "tel")}${f("contact", "Who to ask for")}</div>
      ${f("address", "Address")}
      <div class="two"><div class="fld"><label>Type of job</label><select data-vf="kind">${opt(KINDS.map((k) => [k, k]), v.kind)}</select></div>
        <div class="fld"><label>Status</label><select data-vf="status">${opt(Object.entries(VSTEP), v.status)}</select></div></div>
      <div class="fld"><label>What to do</label><textarea data-vf="desc" rows="3">${esc(v.desc)}</textarea></div>
      <div class="two"><div class="fld"><label>Technician</label><select data-vf="tech">${opt(T, v.tech)}</select></div>
        <div class="fld"><label>Second person (optional)</label><select data-vf="helper">${opt([["", "Nobody"]].concat(techs.map((t) => [t, t])), v.helper)}</select></div></div>
      <div class="three">${f("date", "Day", "date")}${f("start", "Start", "time", 'step="900"')}${f("hours", "Hours", "number", 'step="0.5" min="0.5" max="12" inputmode="decimal"')}</div>
      <div class="fld"><label>Note for the technician (gate code, dog, where to park)</label><textarea data-vf="office" rows="2">${esc(v.office)}</textarea></div>
      ${v.notes ? `<div class="fld"><label>What the technician wrote</label><p class="tnote">${esc(v.notes)}</p></div>` : ""}
      ${v.log && v.log.length ? `<details class="vlog"><summary>What happened (${v.log.length})</summary>${v.log.slice().reverse().map((l) => `<div><small>${new Date(l.at).toLocaleString("en-AU", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</small> ${esc(l.who ? l.who + ": " : "")}${esc(l.what)}</div>`).join("")}</details>` : ""}
      ${v.address ? `<a class="linkbtn" href="${mapLink(v.address)}" target="_blank" rel="noopener">Open the address in Maps</a>` : ""}
      <div class="dpbtns"><button class="btn green" data-dp="save" ${S.saving ? "disabled" : ""}>${ctx.icon.tick}${S.saving ? "Saving..." : v.id ? "Save the change" : "Book it"}</button>
        <button class="btn ghost" data-dp="close">Close</button>
        ${v.id ? `<button class="btn ghost" data-dp="del">${ctx.icon.bin}Delete</button>` : ""}</div></div></div>`;
  }
  function openForm(v) { S.edit = v; S.found = []; ctx.render(); setTimeout(() => { const el = document.querySelector("[data-findc]"); if (el && !v.client) el.focus(); }, 30); }
  function fromOld(code, extra = {}) {
    const j = (ctx.jobs() || []).find((x) => x.code === code); if (!j) return null;
    const day = oldDate(j.date);
    return blank({ code: j.code, kind: ({ callout: "Callout", service: "Service", install: "Install", supply: "Pick up or drop off" })[j.group] || "Service", client: j.client, phone: j.phone, address: j.address, desc: j.desc, tech: j.tech || "", date: day || iso(new Date()), start: oldTime(j.time), ...extra });
  }
  function fromQuote(qid, extra = {}) { const t = toBook().find((x) => x.src === "q" && x.key === qid); return t ? blank({ ...t.prefill, ...extra }) : null; }

  async function saveVisit(v, quiet) {
    S.saving = true; if (!quiet) ctx.render();
    try {
      const j = await api({ action: "visit-save", visit: v });
      const at = (S.list || []).findIndex((x) => x.id === j.visit.id);
      at >= 0 ? (S.list[at] = j.visit) : S.list.push(j.visit);
      S.edit = null; say(v.date ? `Booked: ${j.visit.tech || "nobody yet"}, ${dayName(fromIso(v.date))} at ${nice(v.start)}` : "Saved. It is in To book until it has a day");
    } catch (e) { say("Could not save: " + e.message); }
    S.saving = false; ctx.render();
  }

  async function onClick(e) {
    const b = e.target.closest("[data-dp]"); if (!b) return false;
    const a = b.dataset.dp;
    if (a === "shade" && e.target !== b) return true;
    if (a === "shade" || a === "close") { S.edit = null; ctx.render(); return true; }
    if (a === "wk") { const n = +b.dataset.n; S.week = n ? iso(addDays(fromIso(S.week), n)) : iso(monday(new Date())); S.list = null; ctx.render(); return true; }
    if (a === "new") { openForm(blank()); return true; }
    if (a === "cell") { if (e.target.closest(".vcard")) return true; const [tech, day] = b.dataset.cell.split("|"); openForm(blank({ tech, date: day })); return true; }
    if (a === "open") { const v = (S.list || []).find((x) => x.id === b.dataset.id); if (v) openForm({ ...JSON.parse(JSON.stringify(v)), was: v.date }); return true; }
    if (a === "openold") { const v = fromOld(b.dataset.code); if (v) openForm(v); return true; }
    if (a === "bookq") { const v = fromQuote(b.dataset.id); if (v) openForm(v); return true; }
    if (a === "pickc") { const c = S.found[+b.dataset.i]; Object.assign(S.edit, { client: c.name, phone: c.phone || S.edit.phone, address: c.address || S.edit.address, contact: c.contact || S.edit.contact }); S.found = []; ctx.render(); return true; }
    if (a === "save") {
      const v = S.edit;
      if (!v.client.trim()) { say("Please put in the customer"); return true; }
      if (v.date && v.tech) {
        const clash = (S.list || []).filter((x) => x.id !== v.id && x.date === v.date && x.tech === v.tech && x.status !== "cancelled").find((x) => {
          const s = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
          return s(v.start) < s(x.start) + x.hours * 60 && s(x.start) < s(v.start) + (+v.hours || 2) * 60;
        });
        if (clash && !confirm(`${v.tech} already has ${clash.client} at ${nice(clash.start)} that day. Book this anyway?`)) return true;
      }
      saveVisit(v); return true;
    }
    if (a === "del") {
      const v = S.edit;
      if (!confirm(`Delete the booking for ${v.client || "this job"}? It cannot be brought back. To keep a record, set the status to Cancelled instead.`)) return true;
      try { await api({ action: "visit-del", id: v.id, date: v.was ?? v.date }); S.list = S.list.filter((x) => x.id !== v.id); S.edit = null; say("Deleted"); } catch (err) { say(err.message); }
      ctx.render(); return true;
    }
    return true;
  }
  let findT;
  function onInput(e) {
    const el = e.target; if (!el.dataset || !el.dataset.vf || !S.edit) return false;
    S.edit[el.dataset.vf] = el.dataset.vf === "hours" ? parseFloat(el.value) || 0 : el.value;
    if (el.dataset.findc !== undefined) {
      clearTimeout(findT);
      const q = el.value.trim();
      findT = setTimeout(async () => {
        if (q.length < 2) { S.found = []; } else { try { S.found = ((await api({ action: "clients", q })).list || []).slice(0, 6); } catch (err) { S.found = []; } }
        if (!S.edit) return;
        const pos = el.selectionStart; ctx.render(); const n = document.querySelector("[data-findc]"); if (n) { n.focus(); n.setSelectionRange(pos, pos); }
      }, 250);
    }
    return true;
  }
  /* drag a card onto another day or person */
  function onDragStart(e) { const c = e.target.closest && e.target.closest("[data-drag]"); if (!c) return; S.drag = c.dataset.drag; e.dataTransfer.effectAllowed = "move"; try { e.dataTransfer.setData("text/plain", S.drag); } catch (err) {} c.classList.add("dragging"); }
  function onDragOver(e) { const c = e.target.closest && e.target.closest("[data-cell]"); if (!c || !S.drag) return; e.preventDefault(); document.querySelectorAll(".wcell.over").forEach((x) => x !== c && x.classList.remove("over")); c.classList.add("over"); }
  function onDrop(e) {
    const c = e.target.closest && e.target.closest("[data-cell]"); if (!c || !S.drag) return;
    e.preventDefault(); c.classList.remove("over");
    const [tech, day] = c.dataset.cell.split("|"), [src, key] = [S.drag.slice(0, 1), S.drag.slice(2)]; S.drag = null;
    if (src === "v") {
      const v = (S.list || []).find((x) => x.id === key); if (!v || (v.date === day && (v.tech || "") === tech)) { ctx.render(); return; }
      const moved = { ...v, was: v.date, tech, date: day };
      Object.assign(v, { tech, date: day }); ctx.render(); saveVisit(moved, true);
    }
    if (src === "q") { const v = fromQuote(key, { tech, date: day }); if (v) openForm(v); }
    if (src === "j") { const v = fromOld(key, { tech, date: day }); if (v) openForm(v); }
  }
  function onDragEnd() { S.drag = null; document.querySelectorAll(".dragging,.wcell.over").forEach((x) => x.classList.remove("dragging", "over")); }
  document.addEventListener("dragstart", onDragStart);
  document.addEventListener("dragover", onDragOver);
  document.addEventListener("drop", onDrop);
  document.addEventListener("dragend", onDragEnd);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && S.edit) { S.edit = null; ctx.render(); } });

  return { view, onClick, onInput, state: S, reload: () => { S.list = null; } };
}
