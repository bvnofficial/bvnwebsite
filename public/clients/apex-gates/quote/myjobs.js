/* My jobs, on the technician's tablet: what the office booked for you today and
   this week. Call the customer, get directions, text them you are on the way,
   then tap when you arrive and when you finish. The office sees every tap. */
import { iso, nice, mapLink, VSTEP } from "./dispatch.js";

const ME = "apexq.me", CACHE = "apexq.myjobs";
const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const fromIso = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const longDay = (s) => fromIso(s).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" });

export function makeMyJobs(ctx) {
  // ctx: esc, say, render, techs(), icon, startQuote(visit), openQuote(qid) -> bool, company()
  const { esc, say } = ctx;
  const S = { me: get(ME, ""), list: null, at: 0, loading: false, err: "", open: null, eta: null, finish: null, note: "" };
  const cached = get(CACHE, null);
  if (cached && cached.me === S.me) { S.list = cached.list; S.at = cached.at; }

  async function post(body) {
    const r = await fetch("data.json", { method: "POST", headers: { "content-type": "application/json" }, credentials: "same-origin", cache: "no-store", body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || "No connection right now");
    return j;
  }
  async function load() {
    if (S.loading || !S.me) return;
    S.loading = true; S.err = "";
    const from = iso(new Date()), to = iso(addDays(new Date(), 6));
    try {
      const all = (await post({ action: "visits", from, to })).list || [];
      S.list = all.filter((v) => (v.tech === S.me || v.helper === S.me) && v.status !== "cancelled");
      S.at = Date.now(); put(CACHE, { me: S.me, list: S.list, at: S.at });
    } catch (e) { S.err = e.message; }
    S.loading = false; ctx.render();
  }
  const mine = () => S.list || [];
  const today = () => mine().filter((v) => v.date === iso(new Date()));
  const countToday = () => today().filter((v) => v.status !== "done").length;

  function smsLink(v, mins) {
    // a person's first name; a business with no contact person just gets "Hi,"
    const person = v.contact || (/\b(pty|ltd|inc|storage|council|city|shire|group|services|school|church|centre|center|strata|apartments|club|hotel|park|depot|logistics|transport|holdings|trust)\b/i.test(v.client || "") ? "" : v.client || "");
    const first = person.trim().split(/\s+/)[0] || "";
    const me = S.me.split(" ")[0];
    const text = `Hi${first ? " " + first : ""}, it's ${me} from ${ctx.company()}. I'm on my way to you now and should be there in about ${mins} minutes.`;
    return `sms:${String(v.phone || "").replace(/[^\d+]/g, "")}?&body=${encodeURIComponent(text)}`;
  }

  function jobCard(v) {
    const open = S.open === v.id, done = v.status === "done";
    const steps = done ? "" : v.status === "booked"
      ? (S.eta === v.id
        ? `<div class="etarow"><b>About how long?</b>${[15, 30, 45, 60].map((m) => `<a class="btn ghost small" href="${v.phone ? smsLink(v, m) : "#"}" data-mj="onway" data-id="${esc(v.id)}">${m === 60 ? "1 hour" : m + " min"}</a>`).join("")}
            <button class="btn ghost small" data-mj="onway" data-id="${esc(v.id)}" data-quiet="1">No text, just mark it</button></div>`
        : `<button class="btn red wide" data-mj="eta" data-id="${esc(v.id)}">${ctx.icon.truck}On my way</button>`)
      : v.status === "onway" ? `<button class="btn dark wide" data-mj="onsite" data-id="${esc(v.id)}">${ctx.icon.tick}I'm here</button>`
      : S.finish === v.id
        ? `<div class="fld"><label>What did you do? Anything the office should know?</label><textarea data-mjnote rows="3" placeholder="For example: replaced the remote receiver, gate needs a new hinge next visit">${esc(S.note)}</textarea></div>
           <button class="btn green wide" data-mj="done" data-id="${esc(v.id)}">${ctx.icon.tick}Finished, send to the office</button>`
        : `<button class="btn green wide" data-mj="finish" data-id="${esc(v.id)}">${ctx.icon.tick}Job finished</button>`;
    return `<div class="card mjob s-${esc(v.status)}${open ? " open" : ""}">
      <button class="mjhead" data-mj="toggle" data-id="${esc(v.id)}"><span class="mjtime">${nice(v.start)}<small>${v.hours}h</small></span>
        <span class="mjt"><b>${esc(v.client || "No name")}</b><small>${esc([v.kind, v.address].filter(Boolean).join(" · "))}</small></span>
        <i class="vst">${esc(VSTEP[v.status] || "")}</i></button>
      ${open ? `<div class="mjbody">
        ${v.desc ? `<p class="mjdesc">${esc(v.desc)}</p>` : ""}
        ${v.office ? `<div class="warn">${ctx.icon.warn}<div><b>From the office</b><br>${esc(v.office)}</div></div>` : ""}
        ${v.helper && v.helper !== S.me ? `<p class="muted">With ${esc(v.helper)}</p>` : v.helper === S.me ? `<p class="muted">You are helping ${esc(v.tech)}</p>` : ""}
        <div class="mjacts">${v.phone ? `<a class="btn ghost small" href="tel:${esc(String(v.phone).replace(/[^\d+]/g, ""))}">${ctx.icon.call}Call ${esc(String(v.contact || v.client).split(" ")[0])}</a>` : ""}
          ${v.address ? `<a class="btn ghost small" href="${mapLink(v.address)}" target="_blank" rel="noopener">${ctx.icon.pin}Directions</a>` : ""}
          ${v.qid ? `<button class="btn ghost small" data-mj="quote" data-id="${esc(v.id)}">${ctx.icon.folder}Open the quote</button>` : ""}
          ${!v.qid && /measure|callout|repair|service/i.test(v.kind) ? `<button class="btn ghost small" data-mj="start" data-id="${esc(v.id)}">${ctx.icon.plus}Quote this customer</button>` : ""}</div>
        ${steps}
        ${done && v.notes ? `<p class="tnote">${esc(v.notes)}</p>` : ""}</div>` : ""}</div>`;
  }

  function view() {
    const T = ctx.techs();
    if (!S.me) return `<h1 class="big-t">Who are you?</h1><p class="hello">Pick your name once. This tablet then shows the jobs the office booked for you.</p>
      <div class="homegrid">${T.map((t) => `<button class="hometile" data-mj="me" data-v="${esc(t)}">${ctx.icon.worker}<b>${esc(t)}</b></button>`).join("")}</div>
      ${T.length ? "" : `<p class="muted">The office has not put in the team yet (CEO dashboard, Company, The team).</p>`}`;
    // a copy kept on the tablet shows straight away; a fresh one is fetched when it is over 30 seconds old
    if (!S.loading && !S.err && (!S.list || Date.now() - S.at > 30000)) load();
    const t0 = iso(new Date()), byDay = {};
    for (const v of mine()) (byDay[v.date] ||= []).push(v);
    const days = Object.keys(byDay).sort();
    const todays = byDay[t0] || [];
    const left = todays.filter((v) => v.status !== "done").length;
    return `<div class="jtop"><h1 class="big-t" style="margin:0">My jobs</h1>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn ghost small" data-mj="reload">${S.loading ? "Checking..." : "Check for new jobs"}</button><button class="btn ghost small" data-mj="notme">Not ${esc(S.me.split(" ")[0])}?</button></div></div>
      ${S.err ? `<div class="warn">${ctx.icon.warn}<div>${esc(S.err)}. ${S.list ? `Showing what this tablet had at ${new Date(S.at).toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" })}.` : ""}</div></div>` : ""}
      ${!S.list ? `<p class="muted">Getting your jobs...</p>` : ""}
      ${S.list ? `<h2 class="sub-t">Today${todays.length ? `, ${left ? `${left} to go` : "all done"}` : ""}</h2>
        ${todays.length ? `<div class="mjlist">${todays.map(jobCard).join("")}</div>` : `<p class="muted">Nothing booked for you today.</p>`}
        ${days.filter((d) => d !== t0).map((d) => `<h2 class="sub-t">${longDay(d)}</h2><div class="mjlist">${byDay[d].map(jobCard).join("")}</div>`).join("")}` : ""}`;
  }

  async function step(id, status, note) {
    const v = mine().find((x) => x.id === id); if (!v) return;
    const was = v.status; v.status = status; ctx.render();
    try { const j = await post({ action: "visit-step", id, date: v.date, status, note: note || "", who: S.me }); Object.assign(v, j.visit); put(CACHE, { me: S.me, list: S.list, at: S.at }); }
    catch (e) { v.status = was; say(e.message); }
    ctx.render();
  }

  function onClick(e) {
    const b = e.target.closest("[data-mj]"); if (!b) return false;
    const a = b.dataset.mj, id = b.dataset.id;
    if (a === "me") { S.me = b.dataset.v; put(ME, S.me); S.list = null; ctx.render(); return true; }
    if (a === "notme") { S.me = ""; put(ME, ""); S.list = null; ctx.render(); return true; }
    if (a === "reload") { load(); ctx.render(); return true; }
    if (a === "toggle") { S.open = S.open === id ? null : id; S.eta = S.finish = null; ctx.render(); return true; }
    if (a === "eta") { S.eta = id; ctx.render(); return true; }
    if (a === "onway") {
      // the phone's messages app opens with the text ready to send; the office sees "On the way"
      if (b.getAttribute("href") === "#") e.preventDefault();
      S.eta = null; step(id, "onway"); say("The office can see you are on the way"); return true;
    }
    if (a === "onsite") { step(id, "onsite"); return true; }
    if (a === "finish") { S.finish = id; S.note = ""; ctx.render(); return true; }
    if (a === "done") { const n = S.note.trim(); S.finish = null; step(id, "done", n); say("Sent to the office. Nice work"); return true; }
    if (a === "quote") { const v = mine().find((x) => x.id === id); if (v && !ctx.openQuote(v.qid)) say("That quote is on another tablet. The office has a copy"); return true; }
    if (a === "start") { const v = mine().find((x) => x.id === id); if (v) ctx.startQuote(v); return true; }
    return true;
  }
  function onInput(e) { if (e.target.matches && e.target.matches("[data-mjnote]")) { S.note = e.target.value; return true; } return false; }
  // pick up new bookings when the tablet comes back to the app
  document.addEventListener("visibilitychange", () => { if (!document.hidden && S.me && ctx.onView()) load(); });

  return { view, onClick, onInput, countToday, load, state: S };
}
