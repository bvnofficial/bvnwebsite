/* Apex Gates HQ: store, helpers, router and shared pieces used by all three sides */
(function () {
  const A = window.APEX;
  const KEY = "apexhq.v1";
  const LOGO = "https://apexgates.com.au/wp-content/uploads/2018/10/logo_sml.png";

  /* ---------- store ---------- */
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.v === 1 && s.seededOn === A.todayISO()) return s;
    } catch (e) {}
    return A.seed();
  }
  let S = load();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); }
    catch (e) { // storage full (photos): drop the oldest photos and try again
      S.jobs.forEach(j => { if (j.photos.length > 2) j.photos = j.photos.slice(-2); });
      try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e2) {}
    }
  }
  function reset() { S = A.seed(); save(); toast("Sample data reset"); render(); }
  // another tab changed the data (owner in one tab, client in another): redraw
  window.addEventListener("storage", e => { if (e.key === KEY) { S = load(); render(true); } });

  /* ---------- small helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = n => (n < 0 ? "-$" : "$") + Math.abs(Math.round(n)).toLocaleString("en-AU");
  const money2 = n => (n < 0 ? "-$" : "$") + Math.abs(n).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const kfmt = n => n >= 1000 ? "$" + (n / 1000).toFixed(n >= 100000 ? 0 : 1).replace(/\.0$/, "") + "k" : money(n);
  const dt = s => new Date(s);
  const dayISO = s => s ? s.slice(0, 10) : "";
  const nowISO = () => { const d = new Date(); return `${A.iso(d)}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };
  const isoIn = mins => { const d = new Date(Date.now() + mins * 60000); return `${A.iso(d)}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };
  const isToday = s => dayISO(s) === A.todayISO();
  function fmtTime(s) {
    if (!s) return "";
    const d = dt(s); let h = d.getHours(); const m = d.getMinutes(); const ap = h >= 12 ? "pm" : "am";
    h = h % 12 || 12; return `${h}${m ? ":" + String(m).padStart(2, "0") : ""}${ap}`;
  }
  const fmtDay = s => dt(s).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
  const fmtDate = s => dt(s).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
  function rel(s) {
    const mins = Math.round((Date.now() - dt(s)) / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return mins + " min ago";
    if (mins < 60 * 24 && isToday(s)) return Math.round(mins / 60) + " hr ago";
    const days = Math.round((new Date(A.todayISO()) - new Date(dayISO(s))) / 864e5);
    if (days === 1) return "Yesterday";
    if (days < 7 && days > 0) return days + " days ago";
    return fmtDay(s);
  }
  function dayLabel(s) {
    const days = Math.round((new Date(dayISO(s)) - new Date(A.todayISO())) / 864e5);
    return days === 0 ? "Today" : days === 1 ? "Tomorrow" : days === -1 ? "Yesterday" : fmtDay(s);
  }
  const initials = n => String(n || "?").replace(/^Dr /, "").split(/\s+/).filter(w => /^[A-Za-z]/.test(w)).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const C = id => S.clients.find(c => c.id === id);
  const T = id => A.STAFF.find(s => s.id === id);
  const J = id => S.jobs.find(j => j.id === id);
  const Q = id => S.quotes.find(q => q.id === id);
  const clientName = o => (o.clientId && C(o.clientId) ? C(o.clientId).name : o.name || "New contact");
  const colorFor = s => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) % 360; return `hsl(${h} 45% 42%)`; };
  const avatar = (name, cls = "", color) => `<span class="avatar ${cls}" style="background:${color || colorFor(name)}">${esc(initials(name))}</span>`;
  function km(a, b) {
    const R = 6371, dLat = (b.lat - a.lat) * Math.PI / 180, dLng = (b.lng - a.lng) * Math.PI / 180;
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x)) * 1.3; // road factor
  }
  const qTotal = q => A.quoteTotals(q.lines).total;
  const nextId = k => { S.seq[k] = (S.seq[k] || 1) + 1; return S.seq[k]; };

  /* ---------- icons ---------- */
  const P = {
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
    inbox: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    pipe: '<rect x="3" y="4" width="5" height="16" rx="1"/><rect x="10" y="4" width="5" height="11" rx="1"/><rect x="17" y="4" width="4" height="7" rx="1"/>',
    map: '<path d="M9 3L3 6v15l6-3 6 3 6-3V3l-6 3z"/><path d="M9 3v15M15 6v15"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    quote: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
    tool: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
    users: '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M17 4a4 4 0 0 1 0 8M22 21a7 7 0 0 0-4-6.3"/>',
    repeat: '<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
    team: '<circle cx="12" cy="7" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/>',
    dollar: '<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
    send: '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
    spark: '<path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    x: '<path d="M18 6L6 18M6 6l12 12"/>',
    left: '<path d="M15 18l-6-6 6-6"/>',
    right: '<path d="M9 18l6-6-6-6"/>',
    truck: '<path d="M1 4h14v12H1zM15 9h4l3 3v4h-7"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
    camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    nav: '<path d="M3 11l19-9-9 19-2-8z"/>',
    alert: '<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    box: '<path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7z"/><path d="M3.3 7L12 12l8.7-5M12 22V12"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
    gate: '<path d="M3 21V5M21 21V5M3 8h18M3 18h18M7 8v10M11 8v10M15 8v10M19 8v10"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
    clip: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3h6v3H9zM9 11h6M9 15h4"/>',
    cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>',
    layers: '<path d="M12 2L2 7l10 5 10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>',
    play: '<path d="M5 3l14 9-14 9z"/>',
    star: '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    qr: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 17h4v4h-4"/>',
    mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10a7 7 0 0 1-14 0M12 17v5"/>',
    doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
    more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>'
  };
  const I = (n, cls = "") => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[n] || ""}</svg>`;

  // simple drawings of each gate type, used in the quote machine and asset lists
  function gateSvg(type) {
    const s = 'stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"';
    const g = {
      sliding: `<path ${s} d="M2 28h44M4 8h28v18H4zM10 8v18M16 8v18M22 8v18M28 8v18"/><path ${s} d="M36 17h8m-3-3 3 3-3 3"/>`,
      cantilever: `<path ${s} d="M2 28h44M4 8h30v14H4zM10 8v14M16 8v14M22 8v14M28 8v14"/><path ${s} d="M6 22v4M30 22v4"/>`,
      swing: `<path ${s} d="M2 28h44M4 6v22M44 6v22M4 10l16 4v12L4 26M44 10l-16 4v12l16 0"/>`,
      bifold: `<path ${s} d="M2 28h44M4 6v22M4 9l9 3v14H4M13 12l9-3v17h-9"/>`,
      telescopic: `<path ${s} d="M2 28h44M4 7h22v19H4zM14 10h22v16"/>`,
      boom: `<path ${s} d="M2 28h44M6 12h6v16H6zM12 15h32"/><path ${s} stroke-dasharray="3 3" d="M14 15h30"/>`,
      bollards: `<path ${s} d="M2 28h44M8 12h6v16H8zM21 12h6v16h-6zM34 12h6v16h-6z"/><path ${s} d="M8 16h6M21 16h6M34 16h6"/>`,
      garage: `<path ${s} d="M2 28h44M6 28V10l18-6 18 6v18M10 14h28v14H10zM10 19h28M10 24h28"/>`
    };
    return `<svg viewBox="0 0 48 30">${g[type] || g.sliding}</svg>`;
  }
  const assetType = k => /garage|roller|sectional/i.test(k) ? "garage" : /cantilever/i.test(k) ? "cantilever" : /boom/i.test(k) ? "boom" : /bollard/i.test(k) ? "bollards" : /swing/i.test(k) ? "swing" : /bi-fold/i.test(k) ? "bifold" : /telescopic/i.test(k) ? "telescopic" : "sliding";

  /* ---------- toasts, modal, notifications ---------- */
  function toast(msg, icon = "check") {
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = I(icon) + `<span>${esc(msg)}</span>`;
    $("#toasts").appendChild(el);
    setTimeout(() => { el.style.transition = "opacity .3s"; el.style.opacity = 0; setTimeout(() => el.remove(), 300); }, 3400);
  }
  function modal(html, cls = "") {
    const m = $("#modal");
    m.innerHTML = `<div class="mbox ${cls}" role="dialog" aria-modal="true">${html}</div>`;
    m.hidden = false;
    document.body.style.overflow = "hidden";
    runAfter();
  }
  function closeModal() { const m = $("#modal"); m.hidden = true; m.innerHTML = ""; document.body.style.overflow = ""; }
  $("#modal") && $("#modal").addEventListener("mousedown", e => { if (e.target.id === "modal") closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#modal").hidden) closeModal(); });
  const mhead = (title, sub = "") => `<div class="mh"><div class="grow"><h2>${title}</h2>${sub ? `<div class="muted small">${sub}</div>` : ""}</div><button class="btn ghost sm" data-act="closeModal" aria-label="Close">${I("x")}</button></div>`;

  // role is "ceo", "staff:jake" or "client:c1"
  function notify(role, text, go) {
    S.notices.unshift({ id: "n" + nextId("notice"), role, text, at: nowISO(), go, unread: true });
    S.notices = S.notices.slice(0, 60);
  }

  /* ---------- shared business logic ---------- */
  function clientConvo(clientId) {
    let v = S.convos.find(c => c.clientId === clientId && c.channel === "Portal");
    if (!v) { v = { id: "v" + nextId("msg") + "p", clientId, channel: "Portal", unread: false, at: nowISO(), msgs: [] }; S.convos.unshift(v); }
    return v;
  }
  function teamConvo(staffId) {
    let v = S.convos.find(c => c.channel === "Team" && c.staffId === staffId);
    if (!v) { v = { id: "vt" + staffId, clientId: null, staffId, channel: "Team", unread: false, at: nowISO(), msgs: [] }; S.convos.unshift(v); }
    return v;
  }
  function pushMsg(v, msg, unread) {
    msg.at = msg.at || nowISO();
    v.msgs.push(msg); v.at = msg.at;
    if (unread != null) v.unread = unread;
    S.convos.sort((a, b) => b.at.localeCompare(a.at));
  }
  // text the client (lands in their SMS thread and their portal)
  function textClient(clientId, text) {
    let v = S.convos.find(c => c.clientId === clientId && c.channel === "SMS");
    if (!v) { v = { id: "vs" + nextId("msg"), clientId, channel: "SMS", unread: false, at: nowISO(), msgs: [] }; S.convos.unshift(v); }
    pushMsg(v, { from: "auto", text });
  }

  const OVERLAP = (a1, a2, b1, b2) => a1 < b2 && b1 < a2;
  // first free slot for a technician, Mon to Sat, 7am to 5pm (Saturday until noon)
  function findSlot(tech, dur, fromOff = 0, ignoreId) {
    for (let off = fromOff; off < 21; off++) {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + off);
      if (d.getDay() === 0) continue;
      const end = d.getDay() === 6 ? 12 : 17;
      let startH = 7;
      if (off === 0) { const n = new Date(); startH = Math.max(7, Math.ceil((n.getHours() + n.getMinutes() / 60 + 0.5) * 2) / 2); }
      const busy = S.jobs.filter(j => j.tech === tech && j.start && dayISO(j.start) === A.iso(d) && j.id !== ignoreId)
        .map(j => { const s = dt(j.start); const h = s.getHours() + s.getMinutes() / 60; return [h - 0.5, h + j.dur + 0.5]; }); // 30 min travel buffer
      for (let h = startH; h + dur <= end; h += 0.5) {
        if (!busy.some(b => OVERLAP(h, h + dur, b[0], b[1]))) {
          const hh = Math.floor(h), mm = Math.round((h - hh) * 60);
          return `${A.iso(d)}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
        }
      }
    }
    return null;
  }
  function clashes(tech, start, dur, ignoreId) {
    if (!tech || !start) return [];
    const s = dt(start).getTime(), e = s + dur * 36e5;
    return S.jobs.filter(j => j.tech === tech && j.start && j.id !== ignoreId && OVERLAP(s, e, dt(j.start).getTime(), dt(j.start).getTime() + j.dur * 36e5));
  }

  const PART = id => A.PARTS.find(p => p.id === id);
  const WAGE = 52; // labour cost per hour, for job costing
  // what a job earns and costs (job costing)
  function jobCosting(j) {
    const c = C(j.clientId) || {};
    const parts = j.parts.reduce((s, p) => s + PART(p.id).price * p.q, 0);
    const partsCost = parts * 0.6;
    const hours = j.labour || (j.status === "Completed" ? j.dur : 0);
    const labourCost = hours * WAGE;
    const inv = S.invoices.find(i => i.jobId === j.id);
    let income = inv ? inv.amount / 1.1 : 0;
    if (!inv && c.plan && j.type === "Service") income = { Monthly: 450, Quarterly: 1200, Biannual: 900 }[c.plan] || 0; // plan visit value
    return { parts, partsCost, hours, labourCost, cost: partsCost + labourCost, income, profit: income - partsCost - labourCost };
  }

  function jobInvoiceAmount(j) {
    const c = C(j.clientId);
    const parts = j.parts.reduce((s, p) => s + PART(p.id).price * p.q, 0);
    const hours = Math.max(1, j.labour || j.dur);
    if (j.type === "Service" && c && c.plan) return parts ? parts * 1.1 : 0;  // service covered by the plan, parts extra
    if (j.type === "Site visit") return 0;
    if (j.type === "Install") return 0;                                      // billed from the quote
    const callout = j.type === "Garage door" ? 99 : 149;
    return (callout + hours * A.PRICE.labourRate + parts) * 1.1;
  }

  function completeJob(j, by) {
    j.status = "Completed";
    j.done = nowISO();
    if (!j.labour) j.labour = j.dur;
    const c = C(j.clientId);
    // deduct parts from the technician's van stock
    j.parts.forEach(p => { if (S.stock[j.tech] && S.stock[j.tech][p.id] != null) S.stock[j.tech][p.id] = Math.max(0, S.stock[j.tech][p.id] - p.q); });
    if (c) c.assets.forEach(a => { a.last = j.done; });
    const amt = jobInvoiceAmount(j);
    let inv = null;
    if (amt > 0) {
      inv = { id: "INV-" + nextId("inv"), clientId: j.clientId, jobId: j.id, amount: Math.round(amt * 100) / 100, status: "Due", issued: nowISO(), due: A.at(14, 0) };
      S.invoices.unshift(inv);
    }
    j.report = j.report || `${j.checklist.filter(x => x.done).length} of ${j.checklist.length} checks done.` + (j.parts.length ? " Parts: " + j.parts.map(p => `${p.q} x ${PART(p.id).name}`).join(", ") + "." : "") + (j.notes ? " " + j.notes : "");
    notify("ceo", `${T(j.tech).short} finished ${j.id} at ${c ? c.name : ""}` + (inv ? `, invoice ${inv.id} for ${money2(inv.amount)} sent` : ""), "ceo/jobs/" + j.id);
    if (c) {
      notify("client:" + c.id, `Your service report for ${j.title.toLowerCase()} is ready` + (inv ? ` (invoice ${money2(inv.amount)})` : ""), "client/" + c.id + "/history");
      textClient(c.id, `Hi ${c.contact.split(" ")[0]}, ${T(j.tech).short} has finished at your site. Your service report${inv ? " and invoice are" : " is"} in your Apex Gates portal. Thanks!`);
    }
    // a site visit becomes a quote to write
    if (j.type === "Site visit") notify("ceo", `Measure up done for ${c.name}. Ready to quote.`, "ceo/quotes/new/" + c.id);
    return inv;
  }

  function lowStock() {
    const out = [];
    ["jake", "liam", "ryan"].forEach(t => A.PARTS.forEach(p => { const n = S.stock[t][p.id]; if (n < S.reorder[p.id]) out.push({ t, p, n }); }));
    return out;
  }

  /* ---------- signature pad + photos ---------- */
  function sigPad(canvas) {
    if (!canvas || canvas._pad) return;
    canvas._pad = true;
    const r = canvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    canvas.width = r.width * dpr; canvas.height = r.height * dpr;
    const x = canvas.getContext("2d");
    x.scale(dpr, dpr); x.lineWidth = 2.2; x.lineCap = "round"; x.lineJoin = "round"; x.strokeStyle = "#1D2125";
    let down = false;
    const pt = e => { const b = canvas.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
    canvas.addEventListener("pointerdown", e => { down = true; canvas.setPointerCapture(e.pointerId); const [a, b] = pt(e); x.beginPath(); x.moveTo(a, b); canvas.dataset.signed = "1"; });
    canvas.addEventListener("pointermove", e => { if (!down) return; const [a, b] = pt(e); x.lineTo(a, b); x.stroke(); });
    canvas.addEventListener("pointerup", () => { down = false; });
  }
  const sigData = c => c && c.dataset.signed ? c.toDataURL("image/png") : null;
  function readPhoto(file, cb) {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const k = Math.min(1, 520 / Math.max(img.width, img.height));
      const c = document.createElement("canvas"); c.width = img.width * k; c.height = img.height * k;
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url); cb(c.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = () => toast("That photo could not be read", "alert");
    img.src = url;
  }

  /* ---------- maps ---------- */
  const maps = [];
  function mkMap(el, center = [-31.98, 115.86], zoom = 10) {
    if (!window.L || !el) { if (el) el.innerHTML = '<div class="empty">The map needs an internet connection.</div>'; return null; }
    const m = L.map(el, { zoomControl: true, attributionControl: true, scrollWheelZoom: true }).setView(center, zoom);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(m);
    maps.push(m);
    setTimeout(() => m.invalidateSize(), 60);
    return m;
  }
  const pinIcon = (color, label, cls = "") => window.L && L.divIcon({ className: "", html: `<div class="pin ${cls}" style="background:${color}"><b>${label}</b></div>`, iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -28] });
  const vanIcon = color => window.L && L.divIcon({ className: "", html: `<div class="van" style="background:${color}">${I("truck")}</div>`, iconSize: [34, 34], iconAnchor: [17, 17] });
  const hqIcon = t => window.L && L.divIcon({ className: "", html: `<div class="hqpin">${t}</div>`, iconSize: [34, 34], iconAnchor: [17, 17] });
  const dotIcon = color => window.L && L.divIcon({ className: "", html: `<div class="dotpin" style="background:${color}"></div>`, iconSize: [14, 14], iconAnchor: [7, 7] });
  // where a van on the way is now (part way from its last stop to the job)
  function vanPos(j) {
    const c = C(j.clientId);
    const prev = S.jobs.filter(x => x.tech === j.tech && x.start && isToday(x.start) && x.start < j.start && x.status === "Completed").sort((a, b) => b.start.localeCompare(a.start))[0];
    const from = prev ? C(prev.clientId) : A.BASES[0];
    const k = Math.min(0.85, Math.max(0.15, 1 - (j.eta || 20) / 45));
    return { lat: from.lat + (c.lat - from.lat) * k, lng: from.lng + (c.lng - from.lng) * k, from };
  }

  /* ---------- router + render ---------- */
  const U = { after: [], ui: {} };
  const parts = () => (location.hash.replace(/^#\/?/, "") || "").split("/").filter(Boolean).map(decodeURIComponent);
  function go(path) { if (location.hash.slice(1) !== path) location.hash = path; else render(); }
  function after(fn) { U.after.push(fn); }
  function runAfter() { const list = U.after; U.after = []; list.forEach(f => { try { f(); } catch (e) { console.error(e); } }); }
  const VIEWS = {};
  let lastKey = "";
  function render(keepScroll) {
    maps.splice(0).forEach(m => { try { m.stop(); m.off(); m.remove(); } catch (e) {} });
    const p = parts(), role = p[0];
    const key = p.join("/");
    const scroller = $(".page") || $(".fbody") || $(".pbody");
    const y = keepScroll || key === lastKey ? window.scrollY : 0;
    const inner = scroller ? scroller.scrollTop : 0;
    let html;
    try { html = VIEWS[role] ? VIEWS[role](p.slice(1)) : launcher(); }
    catch (e) { console.error(e); html = `<div class="empty">Something went wrong. <button class="btn" data-act="reset">Reset sample data</button></div>`; }
    // the live Apex CEO page has its own save bar at the bottom, so the sample switcher stays off it
    $("#app").innerHTML = html + (role && !(role === "ceo" && p[1] === "apexceo") ? switcher(role) : "");
    if (key === lastKey || keepScroll) { window.scrollTo(0, y); const s2 = $(".page") || $(".fbody") || $(".pbody"); if (s2) s2.scrollTop = inner; }
    else window.scrollTo(0, 0);
    lastKey = key;
    runAfter();
  }
  window.addEventListener("hashchange", () => { closeModal(); render(); });

  function switcher(role) {
    const b = (r, label, icon, path) => `<button class="${role === r ? "on" : ""}" data-act="go" data-to="${path}">${I(icon)}<span>${label}</span></button>`;
    return `<div class="switcher" role="navigation" aria-label="Switch view"><span class="lbl">View as</span>
      ${b("ceo", "Owner", "chart", "ceo/overview")}${b("staff", "Staff", "tool", "staff/jake/today")}${b("client", "Client", "users", "client/c1/home")}
      <span class="sep"></span><button data-act="go" data-to="" title="Start screen">${I("home")}</button><button data-act="reset" title="Reset sample data">${I("repeat")}</button></div>`;
  }

  function launcher() {
    return `<div class="launch"><div class="in">
      <img class="logo" src="${LOGO}" alt="Apex Gates">
      <h1>One system for <em>Apex Gates</em>.<br>Owner, staff and clients.</h1>
      <p class="lead">Leads and conversations from GoHighLevel, jobs and service work from the Apex app, all on one screen and branded for Apex Gates. Pick a side to look around. Everything is linked, so what you do on one side shows up on the others.</p>
      <div class="roles">
        <button class="role" data-act="go" data-to="ceo/overview"><span class="ri">${I("chart")}</span><h2>Owner HQ</h2>
          <ul><li>Morning brief and live numbers</li><li>Every SMS, email, web form and AI call in one inbox</li><li>Live map of jobs and vans</li><li>Calendar with smart booking</li><li>Quote machine that prices itself</li><li>Jobs, assets, stock, timesheets and job costing</li></ul><span class="go">Open as Simon ${I("right")}</span></button>
        <button class="role" data-act="go" data-to="staff/jake/today"><span class="ri">${I("tool")}</span><h2>Staff field app</h2>
          <ul><li>Today's run with directions</li><li>"On my way" texts the client</li><li>Safety check before each job</li><li>Checklists, photos, parts from van stock</li><li>Client signs on the phone</li><li>Clock on and off, timesheets</li></ul><span class="go">Open as Jake ${I("right")}</span></button>
        <button class="role" data-act="go" data-to="client/c1/home"><span class="ri">${I("users")}</span><h2>Client portal</h2>
          <ul><li>Track the technician live</li><li>Report a broken gate with a photo</li><li>Accept quotes and sign online</li><li>Pay invoices</li><li>Gates, service history and reports</li><li>Chat with the Apex team</li></ul><span class="go">Open as Harbourview Strata ${I("right")}</span></button>
      </div>
      <div class="flow">
        <div><b>1. Enquiry comes in</b>Website form, phone call answered by the AI receptionist, SMS, email or Facebook. All land in GHL.</div>
        <div><b>2. Quote and win</b>The quote machine prices it, the client accepts and signs in the portal, the deal moves to Won.</div>
        <div><b>3. Job in the Apex app</b>The job is booked, the technician gets it on the phone, the client gets texts and live tracking.</div>
        <div><b>4. Done and paid</b>Checklist, photos and signature on site. Report and invoice go out, the client pays online.</div>
      </div>
      <p class="built">Sample data only. Built for Apex Gates by BVN Official.</p>
    </div></div>`;
  }

  /* ---------- actions (event delegation) ---------- */
  const ACT = {
    go: d => go(d.to),
    reset: () => { if (confirm("Reset all sample data back to the start?")) reset(); },
    closeModal
  };
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-act]");
    if (!t) return;
    const fn = ACT[t.dataset.act];
    if (fn) { if (t.tagName === "A" && !t.getAttribute("href")?.startsWith("http") && !t.getAttribute("href")?.startsWith("tel") && !t.getAttribute("href")?.startsWith("mailto")) e.preventDefault(); fn(t.dataset, t, e); }
  });
  ["change", "input"].forEach(type => document.addEventListener(type, e => {
    const t = e.target.closest(`[data-${type}]`);
    if (t && ACT[t.dataset[type]]) ACT[t.dataset[type]](t.dataset, t, e);
  }));

  window.HQ = {
    get S() { return S; }, save, A, U, VIEWS, ACT, render, go, after, runAfter, toast, modal, closeModal, mhead, notify,
    $, $$, esc, isoIn, money, money2, kfmt, dt, dayISO, nowISO, isToday, fmtTime, fmtDay, fmtDate, rel, dayLabel, initials, avatar, colorFor, km,
    C, T, J, Q, clientName, qTotal, nextId, I, gateSvg, assetType, LOGO,
    clientConvo, teamConvo, pushMsg, textClient, findSlot, clashes, completeJob, jobCosting, jobInvoiceAmount, lowStock, PART, WAGE,
    sigPad, sigData, readPhoto, mkMap, pinIcon, vanIcon, hqIcon, dotIcon, vanPos
  };
  document.addEventListener("DOMContentLoaded", () => render());
})();
