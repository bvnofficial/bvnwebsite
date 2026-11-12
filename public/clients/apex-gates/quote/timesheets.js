/* Timesheets on the CEO dashboard: each technician's week, from the start,
   break and finish taps on the tablet, with the hours on jobs and the driving
   worked out from the On my way, I'm here and Job finished taps. The office can
   fix a forgotten tap, tick each day as checked, and download the week for pay. */
import { iso, fromIso, monday, addDays, dayName } from "./dispatch.js";

const pad = (n) => String(n).padStart(2, "0");
const hhmm = (t) => { if (!t) return ""; const d = new Date(t); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const at = (day, v) => { if (!/^\d{1,2}:\d{2}$/.test(v || "")) return null; const [y, m, d] = day.split("-").map(Number); const [h, mi] = v.split(":").map(Number); return new Date(y, m - 1, d, h, mi).getTime(); };
const hrs = (ms) => (ms > 0 ? Math.round(ms / 36e5 * 100) / 100 : 0);
const show = (h) => (h ? `${Math.floor(h)}h ${pad(Math.round((h % 1) * 60))}m` : "");
const breakMs = (d) => (d.breaks || []).reduce((a, b) => a + ((b.to || b.from) - b.from), 0);
export const workedMs = (d) => (d && d.start && d.end ? d.end - d.start - breakMs(d) : 0);

export function makeTimesheets(ctx) {
  // ctx: api, esc, say, render, techs(), icon, onTab()
  const { api, esc, say } = ctx;
  const S = { week: iso(monday(new Date())), days: null, visits: null, loading: false };

  async function load() {
    if (S.loading) return;
    S.loading = true;
    const from = S.week, to = iso(addDays(fromIso(S.week), 6));
    try {
      const [d, v] = await Promise.all([api({ action: "days", from, to }), api({ action: "visits", from, to })]);
      S.days = d.list || []; S.visits = v.list || [];
    } catch (e) { S.days = S.days || []; S.visits = S.visits || []; say(e.message); }
    S.loading = false; ctx.render();
  }
  const dayOf = (tech, day) => S.days.find((d) => d.tech === tech && d.date === day) || { tech, date: day, start: null, end: null, breaks: [], note: "", checked: false };
  /* driving and time on site from the job taps, for the technician and the helper */
  function jobTime(tech, day) {
    let road = 0, site = 0, jobs = 0;
    for (const v of S.visits) {
      if (v.date !== day || (v.tech !== tech && v.helper !== tech)) continue;
      const t = (w) => { const l = (v.log || []).filter((x) => x.what.startsWith(w)).pop(); return l ? l.at : null; };
      const go = t("On the way"), here = t("Arrived on site"), done = t("Finished the job");
      if (go && here && here > go) road += here - go;
      if (here && done && done > here) site += done - here;
      if (done) jobs++;
    }
    return { road: hrs(road), site: hrs(site), jobs };
  }
  function people() {
    const names = ctx.techs().slice();
    for (const d of S.days || []) if (!names.includes(d.tech)) names.push(d.tech);
    return names;
  }

  function view() {
    if (!S.days) { load(); return `<h1 class="big-t">Timesheets</h1><p class="muted">Loading the week...</p>`; }
    const D = Array.from({ length: 7 }, (_, i) => iso(addDays(fromIso(S.week), i))), today = iso(new Date());
    const tables = people().map((tech) => {
      let tw = 0, ts = 0, tr = 0;
      const rows = D.map((day) => {
        const d = dayOf(tech, day), j = jobTime(tech, day), w = hrs(workedMs(d));
        tw += w; ts += j.site; tr += j.road;
        const forgot = d.start && !d.end && day < today;
        if (!d.start && !j.jobs) return `<tr class="off"><td>${dayName(fromIso(day))}</td><td colspan="7" class="muted">Not working</td><td><button class="linkbtn" data-ts="add" data-t="${esc(tech)}" data-d="${day}">Add times</button></td></tr>`;
        const k = `data-t="${esc(tech)}" data-d="${day}"`;
        return `<tr class="${forgot ? "forgot" : ""}${d.checked ? " ok" : ""}"><td>${dayName(fromIso(day))}${forgot ? `<small>Forgot to finish</small>` : ""}</td>
          <td><input type="time" data-tf="start" ${k} value="${hhmm(d.start)}" ${d.checked ? "disabled" : ""}></td>
          <td><input type="time" data-tf="end" ${k} value="${hhmm(d.end)}" ${d.checked ? "disabled" : ""}></td>
          <td><input type="number" min="0" max="240" step="5" inputmode="numeric" data-tf="brk" ${k} value="${Math.round(breakMs(d) / 60000)}" ${d.checked ? "disabled" : ""}><small>min</small></td>
          <td><b>${show(w)}</b></td><td>${show(j.site)}${j.jobs ? `<small>${j.jobs} job${j.jobs > 1 ? "s" : ""}</small>` : ""}</td><td>${show(j.road)}</td>
          <td>${d.note ? `<small class="tsnote">${esc(d.note)}</small>` : ""}</td>
          <td>${d.start ? `<button class="btn small ${d.checked ? "green" : "ghost"}" data-ts="check" ${k}>${d.checked ? `${ctx.icon.tick}Checked` : "Check"}</button>` : ""}</td></tr>`;
      }).join("");
      return `<section class="card pad tscard"><div class="jh"><h2 class="qh" style="margin:0">${esc(tech)}</h2><span class="tstot"><b>${show(tw) || "0h"}</b> worked · ${show(ts) || "0h"} on site · ${show(tr) || "0h"} driving</span>
        <button class="btn ghost small" data-ts="checkall" data-t="${esc(tech)}">Check the whole week</button></div>
        <div class="tsscroll"><table class="ts"><thead><tr><th>Day</th><th>Start</th><th>Finish</th><th>Break</th><th>Worked</th><th>On site</th><th>Driving</th><th>Note</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
    }).join("");
    return `<h1 class="big-t">Timesheets</h1><p class="hello" style="margin-top:-10px">From the Start, Break and Finish buttons on each tablet. On site and driving come from the job taps. Fix a forgotten tap here, then tick the day as checked for pay.</p>
      <div class="dphead"><div class="wk"><button class="btn ghost small" data-ts="wk" data-n="-7" aria-label="Last week">&#8249;</button><b>${dayName(fromIso(D[0]))} to ${dayName(fromIso(D[6]))}</b><button class="btn ghost small" data-ts="wk" data-n="7" aria-label="Next week">&#8250;</button><button class="btn ghost small" data-ts="wk" data-n="0">This week</button></div>
      <button class="btn dark small" data-ts="csv">Download the week for pay (CSV)</button></div>
      ${tables || `<p class="muted">Put the team in on Company first.</p>`}`;
  }

  async function saveDay(d, msg) {
    try { const j = await api({ action: "day-save", day: d }); const i = S.days.findIndex((x) => x.tech === d.tech && x.date === d.date); i >= 0 ? (S.days[i] = j.day) : S.days.push(j.day); if (msg) say(msg); }
    catch (e) { say("Could not save: " + e.message); }
    ctx.render();
  }
  function onChange(e) {
    const el = e.target; if (!el.dataset || !el.dataset.tf) return false;
    const d = JSON.parse(JSON.stringify(dayOf(el.dataset.t, el.dataset.d))), day = el.dataset.d;
    if (el.dataset.tf === "start") d.start = at(day, el.value);
    if (el.dataset.tf === "end") d.end = at(day, el.value);
    if (el.dataset.tf === "brk") {
      const mins = Math.max(0, parseInt(el.value, 10) || 0), from = (d.start || at(day, "12:00")) + 4 * 36e5;
      d.breaks = mins ? [{ from, to: from + mins * 60000 }] : [];
    }
    if (d.start && d.end && d.end <= d.start) { say("The finish has to be after the start"); ctx.render(); return true; }
    saveDay(d, "Saved");
    return true;
  }
  function csv() {
    const D = Array.from({ length: 7 }, (_, i) => iso(addDays(fromIso(S.week), i)));
    const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = [["Name", "Date", "Start", "Finish", "Break minutes", "Hours worked", "Hours on site", "Hours driving", "Jobs done", "Checked", "Note"].map(q).join(",")];
    for (const tech of people()) for (const day of D) {
      const d = dayOf(tech, day), j = jobTime(tech, day); if (!d.start && !j.jobs) continue;
      lines.push([tech, day, hhmm(d.start), hhmm(d.end), Math.round(breakMs(d) / 60000), hrs(workedMs(d)), j.site, j.road, j.jobs, d.checked ? "Yes" : "No", d.note].map(q).join(","));
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/csv" }));
    a.download = `Apex timesheets ${D[0]}.csv`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  async function onClick(e) {
    const b = e.target.closest("[data-ts]"); if (!b) return false;
    const a = b.dataset.ts;
    if (a === "wk") { const n = +b.dataset.n; S.week = n ? iso(addDays(fromIso(S.week), n)) : iso(monday(new Date())); S.days = null; ctx.render(); }
    if (a === "csv") csv();
    if (a === "add") { const d = dayOf(b.dataset.t, b.dataset.d); saveDay({ ...d, start: at(b.dataset.d, "07:00"), end: at(b.dataset.d, "15:30"), breaks: [{ from: at(b.dataset.d, "11:30"), to: at(b.dataset.d, "12:00") }] }, "Added a 7:00 to 3:30 day. Change the times if they are different"); }
    if (a === "check") { const d = dayOf(b.dataset.t, b.dataset.d); if (!d.checked && d.start && !d.end) return say("Put in the finish time first"), true; saveDay({ ...d, checked: !d.checked }, d.checked ? "Opened again" : "Checked"); }
    if (a === "checkall") {
      const D = Array.from({ length: 7 }, (_, i) => iso(addDays(fromIso(S.week), i)));
      const todo = D.map((day) => dayOf(b.dataset.t, day)).filter((d) => d.start && !d.checked);
      if (todo.some((d) => !d.end)) return say("One day has no finish time. Put it in first"), true;
      for (const d of todo) await saveDay({ ...d, checked: true });
      say(todo.length ? `Checked ${todo.length} day${todo.length > 1 ? "s" : ""}` : "Nothing new to check");
    }
    return true;
  }
  return { view, onClick, onChange, reload: () => { S.days = null; } };
}
