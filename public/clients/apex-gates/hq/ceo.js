/* Apex Gates HQ: the owner side */
(function () {
  const H = window.HQ, A = H.A, { I, esc, money, money2, kfmt, fmtTime, fmtDay, fmtDate, rel, dayLabel, avatar, C, T, J, Q } = H;
  const S = () => H.S;
  const STAGES = ["New lead", "Contacted", "Site visit", "Quote sent", "Won", "Lost"];
  const PLAN_DAYS = { Monthly: 30, Quarterly: 91, Biannual: 182 };
  const STATUS_TAG = { "Completed": "ok", "In progress": "blue", "On the way": "blue", "Scheduled": "", "To schedule": "warn" };
  const statusTag = s => `<span class="tag ${STATUS_TAG[s] || ""}">${s === "On the way" ? '<span class="pulse" style="color:#2563EB"></span>' : ""}${esc(s)}</span>`;
  const techLabel = id => id ? `<span class="techdot" style="background:${T(id).color}"></span>${esc(T(id).short)}` : '<span class="faint">Not assigned</span>';
  const ui = H.U.ui;

  const NAV = [
    ["grp", "Apex CEO (live)"],
    ["apexceo", "Apex CEO", "chart"],
    ["grp", "Sales (GHL)"],
    ["overview", "Overview", "home"], ["inbox", "Inbox", "inbox"], ["pipeline", "Pipeline", "pipe"], ["quotes", "Quotes", "quote"],
    ["grp", "Service (AroFlo)"],
    ["calendar", "Calendar", "cal"], ["map", "Map", "map"], ["jobs", "Jobs", "tool"], ["maintenance", "Maintenance", "repeat"], ["assets", "Assets", "gate"], ["stock", "Stock", "box"], ["timesheets", "Timesheets", "clock"], ["costing", "Job costing", "chart"],
    ["grp", "Business"],
    ["clients", "Clients", "users"], ["invoices", "Invoices", "dollar"], ["team", "Team", "team"]
  ];
  const TITLES = { apexceo: "Apex CEO", overview: "Overview", inbox: "Inbox", pipeline: "Pipeline", quotes: "Quotes", calendar: "Calendar", map: "Jobs map", jobs: "Jobs", maintenance: "Maintenance", assets: "Assets", stock: "Stock and orders", timesheets: "Timesheets", costing: "Job costing", clients: "Clients", invoices: "Invoices", team: "Team" };

  function badges() {
    const s = S();
    return {
      inbox: s.convos.filter(v => v.unread).length,
      jobs: s.jobs.filter(j => j.status === "To schedule").length,
      stock: H.lowStock().length ? "!" : 0,
      invoices: s.invoices.filter(i => i.status === "Overdue").length,
      maintenance: maintRows().filter(r => r.state === "Overdue" && !r.booked).length
    };
  }

  /* ---------- layout ---------- */
  H.VIEWS.ceo = p => {
    const view = TITLES[p[0]] ? p[0] : "overview";
    const b = badges();
    const nav = NAV.map(n => n[0] === "grp" ? `<div class="grp">${n[1]}</div>` :
      `<button class="${view === n[0] ? "on" : ""}" data-act="go" data-to="ceo/${n[0]}">${I(n[2])}<span>${n[1]}</span>${b[n[0]] ? `<span class="badge">${b[n[0]]}</span>` : ""}</button>`).join("");
    const unread = S().notices.filter(n => n.role === "ceo" && n.unread).length;
    const body = VIEW[view](p.slice(1));
    const full = view === "inbox" || view === "map" || view === "apexceo";
    return `<div class="ceo">
      <aside class="side"><div class="brand"><img src="${H.LOGO}" alt=""><b>HQ</b></div><nav class="nav">${nav}</nav>
        <div class="sync"><div><i></i>GoHighLevel connected</div><div><i></i>AroFlo connected</div><div class="faint tiny" style="margin-top:4px">Synced ${fmtTime(H.nowISO())}</div></div></aside>
      <div class="main">
        <header class="top"><h1>${TITLES[view]}</h1>
          <div class="search"><span>${I("search")}</span><input class="inp" placeholder="Search clients, jobs, quotes" data-input="search" value="${esc(ui.q || "")}" aria-label="Search"><div id="sres"></div></div>
          <div class="bell" style="position:relative"><button class="btn ghost" data-act="bell" aria-label="Notifications">${I("bell")}</button>${unread ? `<span class="n">${unread}</span>` : ""}${ui.bell ? bellPanel() : ""}</div>
          <button class="btn primary" data-act="newMenu">${I("plus")}<span>New</span></button>
        </header>
        ${full ? body : `<div class="page">${body}</div>`}
      </div></div>`;
  };

  function bellPanel() {
    const list = S().notices.filter(n => n.role === "ceo").slice(0, 12);
    return `<div class="npanel"><div class="card-h"><b>Notifications</b><button class="btn sm ghost" data-act="readAll">Mark all read</button></div>
      ${list.map(n => `<div class="fi ${n.unread ? "unread" : ""}" data-act="go" data-to="${esc(n.go || "ceo/overview")}"><span class="grow">${esc(n.text)}</span><span class="faint tiny nowrap">${rel(n.at)}</span></div>`).join("") || '<div class="empty">Nothing new</div>'}</div>`;
  }

  /* ---------- overview ---------- */
  const monthKey = s => s.slice(0, 7);
  function maintRows() {
    const s = S(), today = new Date(A.todayISO());
    return s.clients.filter(c => c.plan).map(c => {
      const last = c.assets.reduce((m, a) => a.last && a.last > m ? a.last : m, "");
      const due = new Date(last ? H.dayISO(last) : A.todayISO()); due.setDate(due.getDate() + PLAN_DAYS[c.plan]);
      const days = Math.round((due - today) / 864e5);
      const booked = s.jobs.find(j => j.clientId === c.id && j.type === "Service" && j.status !== "Completed" && j.start);
      return { c, last, due: A.iso(due), days, booked, state: days < 0 ? "Overdue" : days <= 21 ? "Due soon" : "OK" };
    }).sort((a, b) => a.days - b.days);
  }
  function stats() {
    const s = S(), today = A.todayISO(), month = today.slice(0, 7), week = Date.now() - 7 * 864e5;
    const paidMonth = s.invoices.filter(i => i.status === "Paid" && i.paid && monthKey(i.paid) === month).reduce((a, i) => a + i.amount, 0);
    return {
      leads: s.opps.filter(o => new Date(o.at) > week && o.stage !== "Lost").length,
      quotesOut: s.quotes.filter(q => q.status === "Sent"),
      won: s.opps.filter(o => o.stage === "Won" && new Date(o.at) > Date.now() - 30 * 864e5).reduce((a, o) => a + o.value, 0),
      revenue: 21300 + paidMonth,
      today: s.jobs.filter(j => j.start && H.isToday(j.start)),
      overdue: s.invoices.filter(i => i.status === "Overdue" || (i.status === "Due" && i.due < today))
    };
  }
  function brief(st) {
    const s = S();
    const urgent = st.today.filter(j => j.priority === "Urgent" && j.status !== "Completed");
    const techs = new Set(st.today.map(j => j.tech)).size;
    const due = maintRows().filter(r => r.days <= 14 && !r.booked).length;
    const unread = s.convos.filter(v => v.unread).length;
    const qv = st.quotesOut.reduce((a, q) => a + H.qTotal(q), 0);
    const parts = [
      `${st.today.length} jobs today across ${techs} technicians, ${st.today.filter(j => j.status === "Completed").length} done so far.`,
      urgent.length ? `${urgent.length} urgent: ${urgent.map(j => `${C(j.clientId).name} (${T(j.tech).short}, ${j.status.toLowerCase()})`).join(" and ")}.` : "",
      unread ? `${unread} conversations need a reply, including a new web enquiry worth about ${kfmt(14500)}.` : "Inbox is clear.",
      st.quotesOut.length ? `${st.quotesOut.length} quotes waiting on a decision (${money(qv)}). Sarah Nguyen opened hers last night.` : "",
      st.overdue.length ? `${st.overdue.length} invoice overdue: ${st.overdue.map(i => `${C(i.clientId).name} ${money(i.amount)}`).join(", ")}.` : "",
      due ? `${due} maintenance visits due in the next 2 weeks are not booked yet.` : ""
    ];
    return parts.filter(Boolean).join(" ");
  }
  const VIEW = {};
  /* the live CEO dashboard from Apex Quote: quotes and profit, jobs, prices, kits, stock.
     It keeps its own CEO password, so only Simon and Tatjana get in. */
  VIEW.apexceo = () => `<iframe class="apexframe" src="/clients/apex-gates/quote/admin.html" title="Apex CEO"></iframe>`;
  VIEW.overview = () => {
    const s = S(), st = stats();
    const months = [];
    for (let i = 5; i >= 0; i--) { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i); months.push(d.toLocaleDateString("en-AU", { month: "short" })); }
    const rev = [...s.revenue, st.revenue], max = Math.max(...rev) * 1.1;
    const stageVal = STAGES.slice(0, 5).map(g => ({ g, n: s.opps.filter(o => o.stage === g).length, v: s.opps.filter(o => o.stage === g).reduce((a, o) => a + o.value, 0) }));
    const maxV = Math.max(...stageVal.map(x => x.v), 1);
    const src = {}; s.opps.forEach(o => src[o.source] = (src[o.source] || 0) + 1);
    const low = H.lowStock();
    const toSched = s.jobs.filter(j => j.status === "To schedule");
    const h = new Date().getHours();
    return `<div class="grid" style="gap:16px">
      <div class="card brief"><div class="row"><span class="tag">${I("spark")} AI morning brief</span><span class="grow"></span><span class="small" style="opacity:.7">${new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })}</span></div>
        <h3 style="margin-top:10px;font-size:24px">Good ${h < 12 ? "morning" : h < 17 ? "afternoon" : "evening"}, Simon</h3><p>${esc(brief(st))}</p></div>
      <div class="kpis">
        ${kpi("New leads, 7 days", st.leads, "+3 on last week", "up", "ceo/pipeline")}
        ${kpi("Quotes waiting", money(st.quotesOut.reduce((a, q) => a + H.qTotal(q), 0)), st.quotesOut.length + " quotes", "", "ceo/quotes")}
        ${kpi("Won, last 30 days", kfmt(st.won), "Close rate 64%", "up", "ceo/pipeline")}
        ${kpi("Revenue this month", kfmt(st.revenue), "On track for " + kfmt(st.revenue * 30 / new Date().getDate()), "up", "ceo/invoices")}
        ${kpi("Jobs today", `${st.today.filter(j => j.status === "Completed").length}/${st.today.length}`, st.today.filter(j => j.priority === "Urgent").length + " urgent", "", "ceo/calendar")}
        ${kpi("Overdue invoices", money(st.overdue.reduce((a, i) => a + i.amount, 0)), st.overdue.length + " invoice", st.overdue.length ? "dn" : "", "ceo/invoices")}
      </div>
      <div class="grid g-main">
        <div class="card"><div class="card-h"><h3>Today's jobs</h3><button class="btn sm" data-act="go" data-to="ceo/map">${I("map")} Live map</button></div>
          <div>${st.today.sort((a, b) => a.start.localeCompare(b.start)).map(jobRow).join("")}</div></div>
        <div class="grid" style="align-content:start">
          ${toSched.length || low.length ? `<div class="card"><div class="card-h"><h3>Needs you</h3></div><div class="card-b stack">
            ${toSched.map(j => `<div class="row"><span class="tag warn">To schedule</span><span class="grow small ellipsis">${esc(C(j.clientId).name)}: ${esc(j.title)}</span><button class="btn sm" data-act="autoBook" data-id="${j.id}">${I("spark")} Auto book</button></div>`).join("")}
            ${low.length ? `<div class="row"><span class="tag red">Low stock</span><span class="grow small">${low.length} parts below reorder level in vans</span><button class="btn sm" data-act="go" data-to="ceo/stock">Fix</button></div>` : ""}
          </div></div>` : ""}
          <div class="card"><div class="card-h"><h3>Activity</h3></div><div class="card-b feed">${s.notices.filter(n => n.role === "ceo").slice(0, 7).map(n => `<div class="fi" data-act="go" data-to="${esc(n.go || "ceo/overview")}"><span>${esc(n.text)}</span><span class="t">${rel(n.at)}</span></div>`).join("")}</div></div>
        </div>
      </div>
      <div class="grid g3">
        <div class="card"><div class="card-h"><h3>Revenue</h3><span class="muted small">Last 6 months</span></div><div class="card-b"><div class="bars">${rev.map((v, i) => `<div class="b ${i === 5 ? "cur" : ""}"><em>${kfmt(v)}</em><i style="height:${(v / max * 100).toFixed(1)}%"></i><span>${months[i]}</span></div>`).join("")}</div></div></div>
        <div class="card"><div class="card-h"><h3>Pipeline</h3><span class="muted small">${kfmt(stageVal.slice(0, 4).reduce((a, x) => a + x.v, 0))} open</span></div><div class="card-b funnel">${stageVal.map(x => `<div class="fr"><span>${x.g} <span class="faint">(${x.n})</span></span><span class="track"><i style="width:${Math.max(3, x.v / maxV * 100)}%;background:${x.g === "Won" ? "var(--ok)" : "var(--char)"}"></i></span><b class="right">${kfmt(x.v)}</b></div>`).join("")}</div></div>
        <div class="card"><div class="card-h"><h3>Where leads come from</h3></div><div class="card-b funnel">${Object.entries(src).sort((a, b) => b[1] - a[1]).map(([k, n]) => `<div class="fr"><span>${esc(k)}</span><span class="track"><i style="width:${n / s.opps.length * 100 * 2.2}%;background:${k === "AI receptionist" ? "var(--purple)" : "var(--red)"}"></i></span><b class="right">${n}</b></div>`).join("")}
          <p class="small muted" style="margin:10px 0 0">The AI receptionist answered 6 calls after hours this month and booked 4 of them.</p></div></div>
      </div></div>`;
  };
  const kpi = (l, v, d, cls, to) => `<div class="card kpi" data-act="go" data-to="${to}"><div class="l">${l}</div><div class="v">${v}</div><div class="d ${cls}">${d}</div></div>`;
  function jobRow(j) {
    const c = C(j.clientId);
    return `<div class="jobrow" data-act="job" data-id="${j.id}"><div class="time">${fmtTime(j.start)}<small>${j.dur} hr</small></div>
      <div style="min-width:0"><div class="b ellipsis">${esc(c.name)} ${j.priority === "Urgent" ? '<span class="tag red">Urgent</span>' : ""}</div><div class="small muted ellipsis">${esc(j.type)}: ${esc(j.title)}</div></div>
      <div class="right"><div>${statusTag(j.status)}</div><div class="small" style="margin-top:4px">${techLabel(j.tech)}</div></div></div>`;
  }

  /* ---------- inbox ---------- */
  const AI_REPLIES = {
    v1: "Hi Mike, it's Simon from Apex Gates. Just confirming Ryan will be with you tomorrow at 9am for the garage door. A grinding noise and stopping halfway is usually a worn drive gear or a spring, and he'll carry both. See you then.",
    v2: "Hi Lauren, thanks for getting in touch. We do a lot of child safe gates, including pedestrian gates with self closing hinges, keypads mounted out of reach and pool rated latches. Ryan can come and look on Monday at 2pm and we'll have a quote to you within 24 hours of the visit. Does that time suit?",
    v3: "Hi Sarah, good question. The quote doesn't include battery backup yet. For $450 we can add a backup battery that keeps the gates running for about 20 open and close cycles during a power cut, and they can always be opened by hand with the release key. Would you like me to add it to the quote?",
    v5: "Hi Ben, yes we do. We supply boom gates with number plate recognition that link to a resident list, so registered cars open the gate automatically and tailgating can be logged. Liam can come and look at the site on Tuesday at 9am. Does that work?"
  };
  function aiSuggest(v) {
    if (AI_REPLIES[v.id]) return AI_REPLIES[v.id];
    if (v.channel === "Team") return "Thanks, no worries. I'll let the client know.";
    const c = C(v.clientId);
    return `Hi ${c ? c.contact.split(" ")[0] : "there"}, thanks for your message. I'll check and get back to you shortly.`;
  }
  const vName = v => v.channel === "Team" ? `${T(v.staffId).name} (team)` : H.clientName(v);
  VIEW.inbox = p => {
    const s = S(), f = ui.inboxF || "All", q = (ui.iq || "").toLowerCase();
    const sel = p[0] ? s.convos.find(v => v.id === p[0]) : null;
    if (sel && sel.unread) { sel.unread = false; H.save(); }
    const list = s.convos.filter(v => (f === "All" || (f === "Unread" ? v.unread : (v.channel === f || (f === "Calls" && v.channel === "AI call")))) && (!q || vName(v).toLowerCase().includes(q)));
    const chan = v => `<span class="chan ${v.channel === "AI call" ? "AI" : v.channel}">${v.channel === "AI call" ? "AI call" : v.channel}</span>`;
    const last = v => { const m = v.msgs[v.msgs.length - 1]; return m ? (m.kind === "call" ? "Call summary: " + m.summary : m.text) : ""; };
    return `<div class="inbox ${sel ? "has-thread" : ""}">
      <div class="col clcol"><div class="lhead stack"><input class="inp" placeholder="Search conversations" data-input="iq" value="${esc(ui.iq || "")}">
        <div class="chips">${["All", "Unread", "SMS", "Email", "Website", "Calls", "Facebook", "Portal", "Team"].map(x => `<button class="chip ${f === x ? "on" : ""}" data-act="inboxF" data-f="${x}">${x}</button>`).join("")}</div></div>
        <div class="clist">${list.map(v => `<div class="citem ${v.unread ? "unread" : ""} ${sel && sel.id === v.id ? "on" : ""}" data-act="go" data-to="ceo/inbox/${v.id}">
          ${v.channel === "Team" ? avatar(T(v.staffId).name, "", T(v.staffId).color) : avatar(vName(v))}
          <div class="grow"><div class="row" style="gap:6px"><span class="nm grow ellipsis">${esc(vName(v))}</span><span class="faint tiny nowrap">${rel(v.at)}</span></div>
          <div class="row" style="gap:6px;margin-top:3px">${chan(v)}<span class="pv grow">${esc(last(v))}</span></div></div></div>`).join("") || '<div class="empty">No conversations</div>'}</div></div>
      <div class="col thcol">${sel ? thread(sel) : '<div class="empty" style="margin:auto">Pick a conversation</div>'}</div>
      <div class="col cside">${sel ? contactPanel(sel) : ""}</div></div>`;
  };
  function bubble(m, v) {
    if (m.kind === "call") return `<div class="bub call"><div class="row"><span class="chan AI">${I("mic")} AI receptionist</span><span class="b">Answered a call</span><span class="grow"></span><span class="faint small">${m.duration} · ${rel(m.at)}</span></div>
      <div class="sum"><b>Summary.</b> ${esc(m.summary)}</div>
      <details><summary>Read the transcript</summary><div class="tr">${m.transcript.map(([w, t]) => `<div><b>${esc(w)}</b> ${esc(t)}</div>`).join("")}</div></details>
      <div class="row" style="margin-top:10px"><span class="tag ok">${I("check")} Job booked</span><span class="tag">${I("play")} Recording 3:12</span></div></div>`;
    const out = m.from === "apex" || m.from === "auto" || (v.channel === "Team" && m.from === "apex");
    const who = m.from === "auto" ? "Automatic text" : m.from === "apex" ? (m.name || "Apex Gates") : m.name || H.clientName(v);
    return `<div class="bub ${m.from === "auto" ? "auto" : out ? "out" : "in"}">${esc(m.text)}${m.photo === true ? `<div class="att">${I("camera")} photo_front_gate.jpg</div>` : m.photo ? `<img class="ph" src="${m.photo}" alt="Photo from client">` : ""}<span class="meta">${esc(who)} · ${fmtTime(m.at)}${H.isToday(m.at) ? "" : ", " + fmtDay(m.at)}</span></div>`;
  }
  function thread(v) {
    const c = C(v.clientId);
    const msgs = v.msgs.map(m => bubble(m, v)).join("");
    const chOpts = v.channel === "Team" ? ["Team"] : ["SMS", "Email", ...(v.channel === "Facebook" ? ["Facebook"] : []), ...(v.channel === "Portal" ? ["Portal"] : [])];
    return `<div class="thead"><button class="btn ghost sm" data-act="go" data-to="ceo/inbox" aria-label="Back">${I("left")}</button>
        ${v.channel === "Team" ? avatar(T(v.staffId).name, "", T(v.staffId).color) : avatar(vName(v))}<div class="grow"><b>${esc(vName(v))}</b><div class="small muted">${c ? esc(c.phone) + " · " + esc(c.type) : esc(T(v.staffId).role)}</div></div>
        ${c ? `<button class="btn sm" data-act="call" data-id="${c.id}">${I("phone")}<span>Call</span></button><button class="btn sm" data-act="go" data-to="ceo/quotes/new/${c.id}">${I("quote")}<span>Quote</span></button><button class="btn sm" data-act="book" data-client="${c.id}">${I("cal")}<span>Book</span></button>` : ""}</div>
      <div class="msgs" id="msgs">${msgs}</div>
      <div class="compose"><textarea id="reply" placeholder="Write a reply" aria-label="Reply">${esc(ui.draft && ui.draft[v.id] || "")}</textarea>
        <div class="bar"><select class="inp" id="rch" style="width:auto;min-height:32px;padding:4px 8px">${chOpts.map(x => `<option ${x === (v.channel === "Website" || v.channel === "AI call" ? "SMS" : v.channel) ? "selected" : ""}>${x}</option>`).join("")}</select>
        <button class="btn sm" data-act="aiReply" data-id="${v.id}" style="color:#6D3FD8">${I("spark")} AI suggest</button><span class="grow"></span>
        <button class="btn primary sm" data-act="sendReply" data-id="${v.id}">${I("send")} Send</button></div></div>`;
  }
  function contactPanel(v) {
    if (v.channel === "Team") {
      const t = T(v.staffId), jobs = S().jobs.filter(j => j.tech === t.id && j.start && H.isToday(j.start));
      return `<div class="sec">${avatar(t.name, "lg", t.color)}<h3 style="margin-top:8px">${esc(t.name)}</h3><div class="muted small">${esc(t.role)} · ${t.van}</div></div>
        <div class="sec"><div class="k">Today</div>${jobs.map(j => `<div class="small" style="padding:4px 0;cursor:pointer" data-act="job" data-id="${j.id}">${fmtTime(j.start)} ${esc(C(j.clientId).name)} ${statusTag(j.status)}</div>`).join("")}</div>`;
    }
    const c = C(v.clientId), s = S();
    const opp = s.opps.find(o => o.clientId === c.id && o.stage !== "Lost");
    const jobs = s.jobs.filter(j => j.clientId === c.id).slice(-3);
    return `<div class="sec">${avatar(c.name, "lg")}<h3 style="margin-top:8px">${esc(c.name)}</h3><div class="muted small">${esc(c.contact)}</div>
        <div class="chips" style="margin-top:8px"><span class="tag">${esc(c.type)}</span>${c.plan ? `<span class="tag ok">${c.plan} plan</span>` : ""}${c.since === 2026 ? '<span class="tag blue">New</span>' : ""}</div></div>
      <div class="sec"><div class="kv"><span>Phone</span><span>${esc(c.phone)}</span><span>Email</span><span class="ellipsis">${esc(c.email)}</span><span>Site</span><span>${esc(c.address)}</span></div></div>
      ${opp ? `<div class="sec"><div class="k">Opportunity</div><div class="b">${esc(opp.title)}</div><div class="row small" style="margin-top:4px"><span class="tag dark">${opp.stage}</span><span class="b">${money(opp.value)}</span><span class="muted">from ${esc(opp.source)}</span></div></div>` : ""}
      <div class="sec"><div class="k">Jobs in AroFlo</div>${jobs.length ? jobs.map(j => `<div class="small" style="padding:4px 0;cursor:pointer" data-act="job" data-id="${j.id}"><b>${j.id}</b> ${esc(j.title)}<br>${statusTag(j.status)} <span class="muted">${j.start ? dayLabel(j.start) : ""}</span></div>`).join("") : '<div class="small muted">No jobs yet</div>'}</div>
      <div class="sec"><div class="k">Gates on site</div>${c.assets.length ? c.assets.map(a => `<div class="small" style="padding:3px 0">${esc(a.name)}<br><span class="muted">${esc(a.kind)}</span></div>`).join("") : '<div class="small muted">None recorded</div>'}</div>`;
  }

  /* ---------- pipeline ---------- */
  VIEW.pipeline = () => {
    const s = S();
    return `<div class="toolbar"><span class="muted">Drag a card to move it. Moving a deal to Won creates the job in AroFlo.</span><span class="grow"></span><button class="btn" data-act="newLead">${I("plus")} Add lead</button></div>
      <div class="kanban">${STAGES.map(g => {
        const list = s.opps.filter(o => o.stage === g);
        return `<div class="kcol" data-stage="${g}"><div class="kh"><b>${g}</b><span>${list.length} · ${kfmt(list.reduce((a, o) => a + o.value, 0))}</span></div>
          ${list.map(o => `<div class="kcard" draggable="true" data-opp="${o.id}" data-act="opp" data-id="${o.id}">
            <div class="row"><b class="grow ellipsis">${esc(H.clientName(o))}</b><span class="faint tiny">${rel(o.at)}</span></div>
            <div class="small muted" style="margin:3px 0 6px">${esc(o.title)}</div>
            <div class="row"><span class="v grow">${money(o.value)}</span><span class="tag ${o.source === "AI receptionist" ? "purple" : ""}">${esc(o.source)}</span></div>
            <select class="inp mv" data-change="oppStage" data-id="${o.id}" aria-label="Move to stage">${STAGES.map(x => `<option ${x === g ? "selected" : ""}>${x}</option>`).join("")}</select></div>`).join("")}</div>`;
      }).join("")}</div>`;
  };
  function moveOpp(id, stage) {
    const s = S(), o = s.opps.find(x => x.id === id);
    if (!o || o.stage === stage) return;
    o.stage = stage; o.at = H.nowISO();
    if (stage === "Won" && o.clientId && !s.jobs.find(j => j.clientId === o.clientId && j.type === "Install" && j.status !== "Completed")) {
      s.jobs.push(newJob({ clientId: o.clientId, type: "Install", title: o.title, dur: 6, status: "To schedule" }));
      H.toast(`${H.clientName(o)} won. Install job created in AroFlo, ready to schedule.`);
    } else H.toast(`${H.clientName(o)} moved to ${stage}`);
    H.save(); H.render(true);
  }
  function newJob(o) {
    const list = A.CHECKLISTS[o.type] || A.CHECKLISTS.Service;
    return Object.assign({ id: "J-" + H.nextId("job"), clientId: null, type: "Service", tech: null, start: null, dur: 1, status: "Scheduled", title: "", priority: "Normal", notes: "", checklist: list.map(t => ({ t, done: false })), photos: [], parts: [], signature: null, eta: null, report: null, safety: null, labour: 0 }, o);
  }
  H.newJob = newJob;
  // drag and drop between columns
  document.addEventListener("dragstart", e => { const c = e.target.closest && e.target.closest(".kcard"); if (c) { e.dataTransfer.setData("text/plain", c.dataset.opp); c.classList.add("drag"); } });
  document.addEventListener("dragend", e => { const c = e.target.closest && e.target.closest(".kcard"); if (c) c.classList.remove("drag"); H.$$(".kcol.over").forEach(x => x.classList.remove("over")); });
  document.addEventListener("dragover", e => { const col = e.target.closest && e.target.closest(".kcol"); if (col) { e.preventDefault(); H.$$(".kcol.over").forEach(x => x !== col && x.classList.remove("over")); col.classList.add("over"); } });
  document.addEventListener("drop", e => { const col = e.target.closest && e.target.closest(".kcol"); if (col) { e.preventDefault(); moveOpp(e.dataTransfer.getData("text/plain"), col.dataset.stage); } });

  /* ---------- map ---------- */
  VIEW.map = () => {
    const s = S(), day = ui.mapDay || "today", tf = ui.mapTech || "all";
    const L2 = ui.layers || (ui.layers = { jobs: true, vans: true, maint: true, leads: false });
    const jobs = mapJobs(day, tf);
    const byTech = A.TECHS.filter(t => tf === "all" || t.id === tf).map(t => {
      const list = jobs.filter(j => j.tech === t.id).sort((a, b) => a.start.localeCompare(b.start));
      let dist = 0, prev = A.BASES[0];
      list.forEach(j => { const c = C(j.clientId); dist += H.km(prev, c); prev = c; });
      return { t, list, dist };
    });
    return `<div class="mapwrap"><div class="mapside">
      <div class="seg" style="margin-bottom:10px">${[["today", "Today"], ["tomorrow", "Tomorrow"], ["week", "This week"]].map(([k, l]) => `<button class="${day === k ? "on" : ""}" data-act="mapDay" data-v="${k}">${l}</button>`).join("")}</div>
      <div class="chips" style="margin-bottom:10px"><button class="chip ${tf === "all" ? "on" : ""}" data-act="mapTech" data-v="all">All vans</button>${A.TECHS.map(t => `<button class="chip ${tf === t.id ? "on" : ""}" data-act="mapTech" data-v="${t.id}"><span class="dot" style="background:${t.color}"></span>${t.short}</button>`).join("")}</div>
      <div class="chips" style="margin-bottom:14px">${[["jobs", "Jobs"], ["vans", "Vans live"], ["maint", "Service due"], ["leads", "Open leads"]].map(([k, l]) => `<button class="chip ${L2[k] ? "on" : ""}" data-act="layer" data-v="${k}">${l}</button>`).join("")}</div>
      ${byTech.map(({ t, list, dist }) => `<div style="margin-bottom:14px"><div class="row"><span class="techdot" style="background:${t.color}"></span><b class="grow">${t.name}</b><span class="small muted">${list.length} stops · ${Math.round(dist)} km</span></div>
        ${list.map((j, i) => `<div class="stop" data-act="mapFocus" data-id="${j.id}"><span class="num" style="background:${t.color};opacity:${j.status === "Completed" ? .5 : 1}">${i + 1}</span><div class="grow"><b>${esc(C(j.clientId).name)}</b> ${j.priority === "Urgent" ? '<span class="tag red">Urgent</span>' : ""}<div class="small muted">${day === "week" ? fmtDay(j.start) + " " : ""}${fmtTime(j.start)} · ${esc(j.type)}</div></div>${statusTag(j.status)}</div>`).join("") || '<div class="small muted" style="padding:6px 0">No jobs</div>'}</div>`).join("")}
      <button class="btn block" data-act="optimise">${I("spark")} Suggest best route order</button>
      <div class="legend" style="margin-top:12px"><span>${I("truck")} Van live</span><span><span class="techdot" style="background:#D97706"></span>Service due</span><span><span class="techdot" style="background:#9AA0A8"></span>Open lead</span></div>
      </div><div id="map"></div></div>`;
  };
  function mapJobs(day, tf) {
    const s = S(), t0 = A.todayISO(), t1 = A.at(1, 0).slice(0, 10), wk = A.at(6, 0).slice(0, 10);
    return s.jobs.filter(j => j.start && j.tech && (tf === "all" || j.tech === tf)).filter(j => {
      const d = j.start.slice(0, 10);
      return day === "today" ? d === t0 : day === "tomorrow" ? d === t1 : d >= t0 && d <= wk;
    });
  }
  function drawMap() {
    const el = H.$("#map"); if (!el) return;
    const m = H.mkMap(el); if (!m) return;
    const s = S(), day = ui.mapDay || "today", tf = ui.mapTech || "all", L2 = ui.layers;
    const pts = [];
    A.BASES.forEach(b => L.marker([b.lat, b.lng], { icon: H.hqIcon(b.id === "malaga" ? "HQ" : "SB"), zIndexOffset: 500 }).addTo(m).bindPopup(`<b>${esc(b.name)}</b>`));
    const jobs = mapJobs(day, tf);
    H.U.markers = {};
    if (L2.jobs) A.TECHS.forEach(t => {
      const list = jobs.filter(j => j.tech === t.id).sort((a, b) => a.start.localeCompare(b.start));
      if (!list.length) return;
      const line = [[A.BASES[0].lat, A.BASES[0].lng]];
      list.forEach((j, i) => {
        const c = C(j.clientId); line.push([c.lat, c.lng]); pts.push([c.lat, c.lng]);
        const mk = L.marker([c.lat, c.lng], { icon: H.pinIcon(t.color, i + 1, (j.status === "Completed" ? "done " : "") + (j.priority === "Urgent" && j.status !== "Completed" ? "urgent" : "")) }).addTo(m)
          .bindPopup(`<b>${esc(c.name)}</b><br>${day === "week" ? fmtDay(j.start) + " " : ""}${fmtTime(j.start)} · ${esc(j.type)}<br>${esc(j.title)}<br><span style="color:${t.color};font-weight:600">${t.short}</span> · ${esc(j.status)}<br><button class="btn sm" style="margin-top:8px" data-act="job" data-id="${j.id}">Open job</button>`);
        H.U.markers[j.id] = mk;
      });
      L.polyline(line, { color: t.color, weight: 3, opacity: .55, dashArray: "6 8" }).addTo(m);
    });
    if (L2.vans && day === "today") s.jobs.filter(j => j.status === "On the way" && (tf === "all" || j.tech === tf)).forEach(j => {
      const p = H.vanPos(j), t = T(j.tech);
      L.marker([p.lat, p.lng], { icon: H.vanIcon(t.color), zIndexOffset: 900 }).addTo(m).bindPopup(`<b>${t.name}</b> · ${t.van}<br>On the way to ${esc(C(j.clientId).name)}<br>Arriving in about ${j.eta} min`);
    });
    if (L2.vans && day === "today") s.jobs.filter(j => j.status === "In progress" && (tf === "all" || j.tech === tf)).forEach(j => {
      const c = C(j.clientId), t = T(j.tech);
      L.circle([c.lat, c.lng], { radius: 700, color: t.color, weight: 1, fillOpacity: .12 }).addTo(m);
    });
    if (L2.maint) maintRows().filter(r => r.days <= 21).forEach(r => L.marker([r.c.lat, r.c.lng], { icon: H.dotIcon("#D97706") }).addTo(m).bindPopup(`<b>${esc(r.c.name)}</b><br>${r.c.plan} service ${r.days < 0 ? "overdue by " + -r.days + " days" : "due in " + r.days + " days"}<br>${r.booked ? "Booked " + fmtDay(r.booked.start) : "Not booked yet"}`));
    if (L2.leads) s.opps.filter(o => o.clientId && !["Won", "Lost"].includes(o.stage)).forEach(o => { const c = C(o.clientId); L.marker([c.lat, c.lng], { icon: H.dotIcon("#9AA0A8") }).addTo(m).bindPopup(`<b>${esc(c.name)}</b><br>${esc(o.title)}<br>${money(o.value)} · ${o.stage}`); });
    pts.push([A.BASES[0].lat, A.BASES[0].lng]);
    if (pts.length > 1) m.fitBounds(pts, { padding: [40, 40], maxZoom: 12 });
    if (ui.focus && H.U.markers[ui.focus]) { const mk = H.U.markers[ui.focus]; m.setView(mk.getLatLng(), 13); mk.openPopup(); ui.focus = null; }
  }

  /* ---------- calendar ---------- */
  const HH = 54, H0 = 6, H1 = 18;
  VIEW.calendar = () => {
    const s = S(), mobile = window.innerWidth < 760, off = ui.calOff || 0, tf = ui.calTech || "all";
    const start = new Date(); start.setHours(0, 0, 0, 0);
    if (mobile) start.setDate(start.getDate() + off * 3);
    else { const dow = (start.getDay() + 6) % 7; start.setDate(start.getDate() - dow + off * 7); }
    const n = mobile ? 3 : 6, days = [];
    for (let i = 0; i < n; i++) { const d = new Date(start); d.setDate(d.getDate() + i); if (d.getDay() === 0 && mobile) d.setDate(d.getDate() + 1); days.push(A.iso(d)); }
    const techs = A.TECHS.filter(t => tf === "all" || t.id === tf);
    const toSched = s.jobs.filter(j => j.status === "To schedule");
    const now = new Date(), nowTop = (now.getHours() + now.getMinutes() / 60 - H0) * HH;
    const evs = d => s.jobs.filter(j => j.start && j.start.slice(0, 10) === d && techs.some(t => t.id === j.tech)).map(j => {
      const st = H.dt(j.start), top = (st.getHours() + st.getMinutes() / 60 - H0) * HH, lane = tf === "all" ? A.TECHS.findIndex(t => t.id === j.tech) : 0, lanes = tf === "all" ? 3 : 1;
      const t = T(j.tech);
      return `<div class="ev ${j.status === "Completed" ? "done" : ""} ${j.priority === "Urgent" && j.status !== "Completed" ? "urgent" : ""}" data-act="job" data-id="${j.id}" style="top:${top}px;height:${Math.max(26, j.dur * HH - 3)}px;background:${t.color};left:calc(${lane / lanes * 100}% + 2px);right:auto;width:calc(${100 / lanes}% - 4px)">
        <b class="ellipsis">${esc(C(j.clientId).name)}</b><span class="ellipsis" style="display:block">${fmtTime(j.start)} ${esc(j.type)}</span></div>`;
    }).join("");
    return `<div class="toolbar">
        <div class="row"><button class="btn sm" data-act="calOff" data-v="-1" aria-label="Previous">${I("left")}</button><button class="btn sm" data-act="calOff" data-v="0">Today</button><button class="btn sm" data-act="calOff" data-v="1" aria-label="Next">${I("right")}</button></div>
        <b>${fmtDay(days[0] + "T00:00")} to ${fmtDay(days[days.length - 1] + "T00:00")}</b><span class="grow"></span>
        <div class="chips"><button class="chip ${tf === "all" ? "on" : ""}" data-act="calTech" data-v="all">Everyone</button>${A.TECHS.map(t => `<button class="chip ${tf === t.id ? "on" : ""}" data-act="calTech" data-v="${t.id}"><span class="dot" style="background:${t.color}"></span>${t.short}</button>`).join("")}</div>
        <button class="btn primary" data-act="book">${I("plus")} New booking</button></div>
      ${toSched.length ? `<div class="card card-b row wrap" style="margin-bottom:14px;padding:10px 14px"><span class="tag warn">${toSched.length} to schedule</span>${toSched.map(j => `<span class="small"><b>${esc(C(j.clientId).name)}</b> ${esc(j.title)}</span><button class="btn sm" data-act="autoBook" data-id="${j.id}">${I("spark")} Auto book</button>`).join("")}</div>` : ""}
      <div class="tblwrap"><div class="cal" style="--days:${n};--hh:${HH}px;min-width:${mobile ? 0 : 760}px">
        <div class="dh" style="border-left:0"></div>${days.map(d => `<div class="dh ${d === A.todayISO() ? "today" : ""}">${new Date(d + "T00:00").toLocaleDateString("en-AU", { weekday: "short" })}<b>${+d.slice(8)}</b></div>`).join("")}
        <div class="hours">${Array.from({ length: H1 - H0 }, (_, i) => `<div>${fmtTime(`2000-01-01T${String(H0 + i).padStart(2, "0")}:00`)}</div>`).join("")}</div>
        ${days.map(d => `<div class="day ${d === A.todayISO() ? "today" : ""}" data-act="calSlot" data-day="${d}" style="height:${(H1 - H0) * HH}px">${evs(d)}${d === A.todayISO() && nowTop > 0 && nowTop < (H1 - H0) * HH ? `<div class="nowline" style="top:${nowTop}px"></div>` : ""}</div>`).join("")}
      </div></div>
      <p class="small muted">Click an empty spot to book it. Each technician has a lane, so double bookings stand out. Bookings text the client and appear on the technician's phone.</p>`;
  };

  /* booking modal (new job, or move an existing one) */
  function bookModal(o = {}) {
    const s = S(), j = o.jobId ? J(o.jobId) : null;
    const v = j ? { client: j.clientId, type: j.type, title: j.title, tech: j.tech || "jake", dur: j.dur, pri: j.priority, notes: j.notes, start: j.start } : { client: o.client || "c1", type: o.type || "Service", title: o.title || "", tech: o.tech || "jake", dur: o.dur || 1.5, pri: "Normal", notes: "", start: o.start };
    if (!v.start) v.start = H.findSlot(v.tech, v.dur, 0) || A.at(1, 8);
    H.modal(H.mhead(j ? `Reschedule ${j.id}` : "New booking", j ? esc(j.title) : "Creates the job in AroFlo and texts the client") + `<div class="mb"><div class="fgrid">
      <div class="full"><label class="f">Client</label><select class="inp" id="bkClient" ${j ? "disabled" : ""}>${s.clients.map(c => `<option value="${c.id}" ${c.id === v.client ? "selected" : ""}>${esc(c.name)}</option>`).join("")}</select></div>
      <div><label class="f">Job type</label><select class="inp" id="bkType" ${j ? "disabled" : ""}>${Object.keys(A.CHECKLISTS).map(t => `<option ${t === v.type ? "selected" : ""}>${t}</option>`).join("")}</select></div>
      <div><label class="f">Priority</label><select class="inp" id="bkPri">${["Normal", "Urgent"].map(t => `<option ${t === v.pri ? "selected" : ""}>${t}</option>`).join("")}</select></div>
      <div class="full"><label class="f">What's the job</label><input class="inp" id="bkTitle" value="${esc(v.title)}" placeholder="For example: quarterly service, gate not closing"></div>
      <div><label class="f">Technician</label><select class="inp" id="bkTech" data-change="bkCheck">${A.TECHS.map(t => `<option value="${t.id}" ${t.id === v.tech ? "selected" : ""}>${t.name}</option>`).join("")}</select></div>
      <div><label class="f">Length (hours)</label><select class="inp" id="bkDur" data-change="bkCheck">${[0.5, 1, 1.5, 2, 3, 4, 6, 7, 8].map(n => `<option ${n == v.dur ? "selected" : ""}>${n}</option>`).join("")}</select></div>
      <div><label class="f">Date</label><input type="date" class="inp" id="bkDate" value="${v.start.slice(0, 10)}" data-change="bkCheck"></div>
      <div><label class="f">Start</label><input type="time" class="inp" id="bkTime" value="${v.start.slice(11, 16)}" step="900" data-change="bkCheck"></div>
      <div class="full"><button class="btn sm" data-act="bkFind" data-job="${j ? j.id : ""}">${I("spark")} Find the next free slot</button> <span id="bkMsg" class="small"></span></div>
      <div class="full"><label class="f">Notes for the technician</label><textarea class="inp" id="bkNotes">${esc(v.notes)}</textarea></div>
      <label class="check full"><input type="checkbox" id="bkSms" checked><span>Text the client a booking confirmation</span></label>
    </div></div><div class="mf"><button class="btn" data-act="closeModal">Cancel</button><button class="btn primary" data-act="bkSave" data-job="${j ? j.id : ""}">${I("check")} ${j ? "Save changes" : "Book job"}</button></div>`);
    H.ACT.bkCheck({ job: j ? j.id : "" });
  }
  H.bookModal = bookModal;

  /* ---------- quotes ---------- */
  VIEW.quotes = p => {
    if (p[0] === "new") return quoteBuilder(p[1]);
    if (p[0]) return quoteDetail(Q(p[0]));
    const s = S(), f = ui.qf || "All";
    const list = s.quotes.filter(q => f === "All" || q.status === f).slice().reverse();
    const sum = st => s.quotes.filter(q => q.status === st).reduce((a, q) => a + H.qTotal(q), 0);
    return `<div class="grid g4" style="margin-bottom:16px">${kpi("Waiting on client", money(sum("Sent")), s.quotes.filter(q => q.status === "Sent").length + " quotes", "", "ceo/quotes")}${kpi("Accepted", money(sum("Accepted")), "This month", "up", "ceo/quotes")}${kpi("Win rate", "64%", "Last 90 days", "up", "ceo/quotes")}${kpi("Average quote", money(s.quotes.reduce((a, q) => a + H.qTotal(q), 0) / s.quotes.length), "Inc GST", "", "ceo/quotes")}</div>
      <div class="toolbar"><div class="chips">${["All", "Draft", "Sent", "Accepted", "Declined"].map(x => `<button class="chip ${f === x ? "on" : ""}" data-act="qf" data-f="${x}">${x}</button>`).join("")}</div><span class="grow"></span><button class="btn primary" data-act="go" data-to="ceo/quotes/new">${I("spark")} Quote machine</button></div>
      <div class="card tblwrap"><table class="tbl resp"><thead><tr><th>Quote</th><th>Client</th><th>For</th><th>Sent</th><th class="right">Total inc GST</th><th>Status</th></tr></thead><tbody>
      ${list.map(q => `<tr class="click" data-act="go" data-to="ceo/quotes/${q.id}"><td data-l="Quote"><b>${q.id}</b></td><td data-l="Client">${esc(C(q.clientId).name)}</td><td data-l="For">${esc(q.title)}</td><td data-l="Sent">${q.sent ? rel(q.sent) : "Not sent"}${q.viewed && q.status === "Sent" ? ' <span class="tag blue">Viewed</span>' : ""}</td><td data-l="Total" class="right b">${money2(H.qTotal(q))}</td><td data-l="Status">${qTag(q.status)}</td></tr>`).join("")}</tbody></table></div>`;
  };
  const qTag = st => `<span class="tag ${st === "Accepted" ? "ok" : st === "Declined" ? "red" : st === "Sent" ? "blue" : ""}">${st}</span>`;

  function qbDefaults(clientId) {
    const c = C(clientId) || C("c14");
    return { clientId: c.id, siteType: c.type === "Residential" ? "Residential" : "Commercial", type: "sliding", width: 5, height: "1.8", material: "alu", motor: "auto", extras: ["beams", "remotes"], discount: 0, bollardKind: "fixed", qty: 3, space: "ok", title: "" };
  }
  function quoteBuilder(clientId) {
    if (!H.U.qb || (clientId && H.U.qb.clientId !== clientId)) H.U.qb = qbDefaults(clientId);
    const q = H.U.qb, P = A.PRICE, s = S();
    const types = Object.entries(P.gates);
    const isGate = !["boom", "bollards"].includes(q.type);
    return `<div class="row" style="margin-bottom:14px"><button class="btn sm" data-act="go" data-to="ceo/quotes">${I("left")} Quotes</button><span class="muted small">Answer a few questions and the quote prices itself. Sample rates for now: we load Apex's own price list in the live version.</span></div>
    <div class="qm"><div class="card card-b stack">
      <div class="fgrid"><div><label class="f">Client</label><select class="inp" data-change="qb" data-k="clientId">${s.clients.map(c => `<option value="${c.id}" ${c.id === q.clientId ? "selected" : ""}>${esc(c.name)}</option>`).join("")}</select></div>
        <div><label class="f">Site</label><div class="seg">${["Residential", "Commercial", "Industrial"].map(x => `<button class="${q.siteType === x ? "on" : ""}" data-act="qbSet" data-k="siteType" data-v="${x}">${x}</button>`).join("")}</div></div></div>
      <div><label class="f">What are we quoting</label><div class="types">${types.map(([k, g]) => `<button class="type ${q.type === k ? "on" : ""}" data-act="qbSet" data-k="type" data-v="${k}">${H.gateSvg(k)}${g.name.replace(" (pair)", "")}</button>`).join("")}</div></div>
      ${q.type === "bollards" ? `<div class="fgrid"><div><label class="f">Bollard type</label><select class="inp" data-change="qb" data-k="bollardKind">${Object.entries(P.bollards).map(([k, b]) => `<option value="${k}" ${q.bollardKind === k ? "selected" : ""}>${b.name} (${money(b.price)})</option>`).join("")}</select></div>
        <div><label class="f">How many</label><input type="number" min="1" max="30" class="inp" value="${q.qty}" data-input="qb" data-k="qty"></div></div>` : `
      <div><label class="f">${q.type === "boom" ? "Boom arm length" : "Opening width"}</label><div class="range"><input type="range" min="${q.type === "boom" ? 3 : 2}" max="${q.type === "boom" ? 8 : 16}" step="0.1" value="${q.width}" data-input="qb" data-k="width"><output id="wout">${(+q.width).toFixed(1)} m</output></div></div>
      ${isGate ? `<div class="fgrid"><div><label class="f">Height</label><div class="seg">${Object.keys(P.heights).map(h => `<button class="${q.height === h ? "on" : ""}" data-act="qbSet" data-k="height" data-v="${h}">${h} m</button>`).join("")}</div></div>
        <div><label class="f">Infill</label><select class="inp" data-change="qb" data-k="material">${Object.entries(P.materials).map(([k, m]) => `<option value="${k}" ${q.material === k ? "selected" : ""}>${m.name}</option>`).join("")}</select></div>
        <div><label class="f">Motor</label><select class="inp" data-change="qb" data-k="motor"><option value="auto" ${q.motor === "auto" ? "selected" : ""}>Pick for me (by gate weight)</option>${Object.entries(P.motors).map(([k, m]) => `<option value="${k}" ${q.motor === k ? "selected" : ""}>${m.name}${m.price ? " (" + money(m.price) + ")" : ""}</option>`).join("")}</select></div>
        ${q.type === "sliding" ? `<div><label class="f">Run back space beside the opening</label><select class="inp" data-change="qb" data-k="space"><option value="ok" ${q.space === "ok" ? "selected" : ""}>Enough room</option><option value="short" ${q.space === "short" ? "selected" : ""}>Not enough room</option></select></div>` : ""}</div>` : ""}`}
      <div><label class="f">Extras</label><div class="xgrid">${P.extras.map(x => `<label class="check"><input type="checkbox" data-change="qbX" data-v="${x.id}" ${q.extras.includes(x.id) ? "checked" : ""}><span>${x.name}</span><em>${money(x.price)}</em></label>`).join("")}</div></div>
      <div class="fgrid"><div><label class="f">Discount %</label><input type="number" min="0" max="30" class="inp" value="${q.discount}" data-input="qb" data-k="discount"></div>
        <div><label class="f">Quote title</label><input class="inp" placeholder="Filled in for you" value="${esc(q.title)}" data-input="qb" data-k="title"></div></div>
    </div>
    <div class="qdoc stack"><div id="qinsight"></div><div id="qdoc"></div>
      <div class="row"><button class="btn grow" data-act="qbSave" data-send="0">Save draft</button><button class="btn primary grow" data-act="qbSave" data-send="1">${I("send")} Send to client</button></div>
      <p class="small muted" style="margin:0">Sending texts and emails the client a link. They accept and sign in their portal, and the deal moves to Won.</p></div></div>`;
  }
  function qbTitle(q) {
    if (q.title) return q.title;
    if (q.type === "bollards") return `${q.qty} ${A.PRICE.bollards[q.bollardKind].name.toLowerCase()}s`;
    const g = A.PRICE.gates[q.type].name;
    return q.type === "boom" ? `${g}, ${(+q.width).toFixed(1)} m arm` : `${(+q.width).toFixed(1)} m ${g.toLowerCase().replace(" (pair)", "")}, ${A.PRICE.materials[q.material].name.toLowerCase()}`;
  }
  function docHtml(clientId, title, lines, id, status) {
    const c = C(clientId), t = A.quoteTotals(lines);
    return `<div class="doc"><div class="dh"><img src="${H.LOGO}" alt="Apex Gates"><div class="right"><b>QUOTE ${id || "(draft)"}</b><div class="small" style="opacity:.75">${fmtDate(H.nowISO())}</div></div></div>
      <div class="card-b"><div class="small muted">Prepared for</div><b>${esc(c.name)}</b><div class="small muted">${esc(c.address)}</div><h3 style="margin-top:12px">${esc(title)}</h3></div>
      <table><thead><tr><th>Item</th><th class="right">Qty</th><th class="right">Amount</th></tr></thead><tbody>
      ${lines.map(l => `<tr class="line"><td>${esc(l.d)}</td><td class="n">${l.q}</td><td class="n">${money2(l.q * l.u)}</td></tr>`).join("")}</tbody>
      <tbody><tr class="tot"><td colspan="2" class="right muted">Subtotal</td><td class="n">${money2(t.sub)}</td></tr><tr class="tot"><td colspan="2" class="right muted">GST</td><td class="n">${money2(t.gst)}</td></tr>
      <tr class="tot big"><td colspan="2" class="right">Total</td><td class="n">${money2(t.total)}</td></tr></tbody></table>
      <div class="card-b small muted" style="border-top:1px solid var(--line-2)">30% deposit (${money2(t.total * A.PRICE.deposit)}) to book in. Valid for 30 days. 12 month workmanship warranty.${status ? `<div style="margin-top:6px">Status: ${qTag(status)}</div>` : ""}</div></div>`;
  }
  function refreshQuote() {
    const q = H.U.qb; if (!q || !H.$("#qdoc")) return;
    const r = A.computeQuote(q), P = A.PRICE;
    H.$("#qdoc").innerHTML = docHtml(q.clientId, qbTitle(q), r.lines);
    const mPct = Math.round(r.margin * 100), mCol = mPct >= 35 ? "var(--ok)" : mPct >= 25 ? "var(--warn)" : "var(--red)";
    H.$("#qinsight").innerHTML = `<div class="insight stack"><div class="row"><span class="tag dark">${I("spark")} Only you see this</span><span class="grow"></span><span class="small muted">${r.labourH} hrs labour · ${r.days} day${r.days > 1 ? "s" : ""} on site</span></div>
      <div class="row"><div class="grow"><div class="small muted">Margin</div><b style="color:${mCol}">${mPct}%</b></div><div class="grow"><div class="small muted">Profit</div><b>${money(r.profit)}</b></div>${r.weight ? `<div class="grow"><div class="small muted">Gate weight</div><b>${r.weight} kg</b></div>` : ""}</div>
      <div class="meter"><i style="width:${Math.max(4, Math.min(100, mPct * 2))}%;background:${mCol}"></i></div>
      ${r.weight ? `<div class="small">Recommended motor: <b>${P.motors[r.recMotor].name}</b> (rated to ${P.motors[r.recMotor].max} kg${q.siteType !== "Residential" ? ", commercial site" : ""}).</div>` : ""}
      ${r.notes.map(n => `<div class="warnbox">${I("alert")}<span>${esc(n)}</span></div>`).join("")}
      ${mPct < 25 ? `<div class="warnbox">${I("alert")}<span>Margin is under 25%. Check the discount.</span></div>` : ""}</div>`;
    const w = H.$("#wout"); if (w) w.textContent = (+q.width).toFixed(1) + " m";
  }
  function quoteDetail(q) {
    if (!q) return '<div class="empty">Quote not found</div>';
    const c = C(q.clientId);
    const tl = [["Created", q.created], ["Sent by SMS and email", q.sent], ["Opened by client", q.viewed], [q.status === "Declined" ? "Declined" : "Accepted and signed", q.accepted || q.declined]];
    const job = S().jobs.find(j => j.clientId === q.clientId && j.type === "Install" && j.quoteId === q.id);
    return `<div class="row" style="margin-bottom:14px"><button class="btn sm" data-act="go" data-to="ceo/quotes">${I("left")} Quotes</button><span class="grow"></span>
        ${q.status === "Draft" ? `<button class="btn primary" data-act="qSend" data-id="${q.id}">${I("send")} Send to client</button>` : ""}
        ${q.status === "Sent" ? `<button class="btn" data-act="qRemind" data-id="${q.id}">${I("bell")} Send a reminder</button><button class="btn" data-act="qAccept" data-id="${q.id}">${I("check")} Mark accepted</button>` : ""}
        ${q.status === "Accepted" && !job ? `<button class="btn primary" data-act="qJob" data-id="${q.id}">${I("tool")} Create install job</button>` : ""}</div>
      <div class="qm"><div>${docHtml(q.clientId, q.title, q.lines, q.id, q.status)}</div>
      <div class="stack"><div class="card card-b"><h3>Timeline</h3><div class="timeline" style="margin-top:10px">${tl.map(([l, at]) => `<div><i class="${at ? "on" : ""}"></i><span class="grow">${l}</span><span class="small muted">${at ? rel(at) : ""}</span></div>`).join("")}</div>
        ${q.sigImg ? `<div style="margin-top:10px"><div class="small muted">Signed by ${esc(q.sig)}</div><img class="sigimg" src="${q.sigImg}" alt="Signature"></div>` : q.sig ? `<div class="small muted" style="margin-top:10px">Signed by ${esc(q.sig)}</div>` : ""}
        ${q.reason ? `<div class="warnbox" style="margin-top:10px">${I("alert")}<span>Reason: ${esc(q.reason)}</span></div>` : ""}</div>
        <div class="card card-b"><h3>${esc(c.name)}</h3><div class="small muted">${esc(c.contact)} · ${esc(c.phone)}</div><div class="row" style="margin-top:10px"><button class="btn sm" data-act="openConvo" data-client="${c.id}">${I("inbox")} Messages</button><button class="btn sm" data-act="clientCard" data-id="${c.id}">${I("users")} Client</button></div></div></div></div>`;
  }
  function sendQuote(q) {
    const c = C(q.clientId), s = S();
    q.status = "Sent"; q.sent = H.nowISO();
    H.textClient(c.id, `Hi ${c.contact.split(" ")[0]}, your Apex Gates quote ${q.id} (${q.title}) is ready. View and accept it in your portal.`);
    H.notify("client:" + c.id, `New quote ${q.id}: ${q.title}`, `client/${c.id}/quotes/${q.id}`);
    let o = s.opps.find(x => x.clientId === c.id && !["Won", "Lost"].includes(x.stage));
    if (!o) { o = { id: "o" + H.nextId("opp"), clientId: c.id, title: q.title, source: "Existing client", stage: "Quote sent" }; s.opps.push(o); }
    Object.assign(o, { stage: "Quote sent", value: Math.round(H.qTotal(q)), quoteId: q.id, at: H.nowISO() });
  }

  /* ---------- jobs ---------- */
  VIEW.jobs = p => {
    const s = S(), f = ui.jf || "Active";
    if (p[0]) H.after(() => jobModal(p[0]));
    const today = A.todayISO();
    const list = s.jobs.filter(j => f === "All" || (f === "Active" ? j.status !== "Completed" : f === "Today" ? j.start && j.start.slice(0, 10) === today : j.status === f))
      .sort((a, b) => (a.start || "9").localeCompare(b.start || "9"));
    const cnt = st => s.jobs.filter(j => j.status === st).length;
    return `<div class="grid g4" style="margin-bottom:16px">${kpi("To schedule", cnt("To schedule"), "Waiting for a time", cnt("To schedule") ? "dn" : "", "ceo/jobs")}${kpi("Scheduled", cnt("Scheduled"), "Next 7 days", "", "ceo/calendar")}${kpi("On site now", cnt("In progress") + cnt("On the way"), "In progress or on the way", "", "ceo/map")}${kpi("Completed this week", cnt("Completed"), "All signed off", "up", "ceo/costing")}</div>
      <div class="toolbar"><div class="chips">${["Active", "Today", "To schedule", "Scheduled", "In progress", "Completed", "All"].map(x => `<button class="chip ${f === x ? "on" : ""}" data-act="jf" data-f="${x}">${x}</button>`).join("")}</div><span class="grow"></span><button class="btn primary" data-act="book">${I("plus")} New job</button></div>
      <div class="card tblwrap"><table class="tbl resp"><thead><tr><th>Job</th><th>Client</th><th>Type</th><th>When</th><th>Technician</th><th>Checklist</th><th>Status</th></tr></thead><tbody>
      ${list.map(j => { const done = j.checklist.filter(x => x.done).length; return `<tr class="click" data-act="job" data-id="${j.id}"><td data-l="Job"><b>${j.id}</b>${j.priority === "Urgent" ? ' <span class="tag red">Urgent</span>' : ""}</td><td data-l="Client"><b>${esc(C(j.clientId).name)}</b><div class="small muted">${esc(j.title)}</div></td><td data-l="Type">${esc(j.type)}</td><td data-l="When" class="nowrap">${j.start ? dayLabel(j.start) + " " + fmtTime(j.start) : '<span class="faint">Not booked</span>'}</td><td data-l="Technician" class="nowrap">${techLabel(j.tech)}</td><td data-l="Checklist"><div class="row" style="gap:6px"><div class="prog grow"><i style="width:${done / j.checklist.length * 100}%"></i></div><span class="small muted">${done}/${j.checklist.length}</span></div></td><td data-l="Status">${statusTag(j.status)}</td></tr>`; }).join("")}</tbody></table></div>`;
  };
  function jobModal(id) {
    const j = J(id); if (!j) return;
    const c = C(j.clientId), cost = H.jobCosting(j), inv = S().invoices.find(i => i.jobId === j.id);
    const done = j.checklist.filter(x => x.done).length;
    const flow = ["Scheduled", "On the way", "In progress", "Completed"], at = flow.indexOf(j.status);
    H.modal(H.mhead(`${j.id} ${j.priority === "Urgent" ? '<span class="tag red">Urgent</span>' : ""}`, `${esc(j.type)} · ${esc(j.title)}`) + `<div class="mb stack">
      <div class="statusflow" style="grid-template-columns:repeat(4,1fr)">${flow.map((f, i) => `<div class="st ${i === at ? "on" : i < at ? "past" : ""}">${f}</div>`).join("")}</div>
      <div class="grid g2"><div class="kv"><span>Client</span><b>${esc(c.name)}</b><span>Contact</span><span>${esc(c.contact)}, ${esc(c.phone)}</span><span>Site</span><span>${esc(c.address)}</span>${c.plan ? `<span>Plan</span><span>${c.plan} maintenance</span>` : ""}</div>
        <div class="kv"><span>Technician</span><span>${techLabel(j.tech)}</span><span>When</span><span>${j.start ? dayLabel(j.start) + ", " + fmtTime(j.start) + " for " + j.dur + " hr" : "Not booked"}</span>${j.eta && j.status === "On the way" ? `<span>ETA</span><b style="color:var(--blue)">${j.eta} min</b>` : ""}<span>Safety check</span><span>${j.safety ? '<span class="tag ok">Done on site</span>' : '<span class="tag">Before work starts</span>'}</span></div></div>
      ${j.notes ? `<div class="insight small"><b>Notes.</b> ${esc(j.notes)}</div>` : ""}
      <div><div class="row"><h3 class="grow">Checklist</h3><span class="small muted">${done} of ${j.checklist.length}</span></div><div class="prog" style="margin:8px 0"><i style="width:${done / j.checklist.length * 100}%"></i></div>
        <div class="small" style="columns:2;column-gap:20px">${j.checklist.map(x => `<div style="padding:2px 0">${x.done ? `<span style="color:var(--ok)">${I("check")}</span>` : '<span class="faint">○</span>'} ${esc(x.t)}</div>`).join("")}</div></div>
      ${j.photos.length ? `<div><h3>Photos</h3><div class="photos" style="margin-top:8px">${j.photos.map(p => `<div class="ph" style="background-image:url(${p})"></div>`).join("")}</div></div>` : ""}
      ${j.parts.length ? `<div><h3>Parts used</h3><div class="small" style="margin-top:6px">${j.parts.map(p => `${p.q} x ${esc(H.PART(p.id).name)} (${money(H.PART(p.id).price * p.q)})`).join("<br>")}</div></div>` : ""}
      ${j.signature ? `<div><h3>Client sign off</h3><img class="sigimg" src="${j.signature}" alt="Signature" style="margin-top:6px"></div>` : ""}
      ${j.report ? `<div class="insight small"><b>Service report.</b> ${esc(j.report)}</div>` : ""}
      ${j.status === "Completed" ? `<div class="grid g4" style="gap:8px">${[["Income", money(cost.income)], ["Labour", money(cost.labourCost) + ` (${cost.hours} h)`], ["Parts", money(cost.partsCost)], ["Profit", money(cost.profit)]].map(([l, v]) => `<div class="insight"><div class="small muted">${l}</div><b>${v}</b></div>`).join("")}</div>` : ""}
      ${inv ? `<div class="row small"><span class="tag ${inv.status === "Paid" ? "ok" : "warn"}">${inv.id} ${inv.status}</span><b>${money2(inv.amount)}</b></div>` : ""}
    </div><div class="mf">${j.status !== "Completed" ? `<button class="btn" data-act="bookEdit" data-id="${j.id}">${I("cal")} ${j.start ? "Reschedule" : "Book a time"}</button><button class="btn" data-act="textEta" data-id="${j.id}">${I("phone")} Text client</button><button class="btn ok" data-act="ceoComplete" data-id="${j.id}">${I("check")} Mark complete</button>` : ""}
      <button class="btn" data-act="openConvo" data-client="${c.id}">${I("inbox")} Messages</button><button class="btn dark" data-act="go" data-to="staff/${j.tech || "jake"}/job/${j.id}">${I("tool")} Open on the technician's phone</button></div>`, "wide");
  }
  H.jobModal = jobModal;

  /* ---------- maintenance ---------- */
  VIEW.maintenance = () => {
    const rows = maintRows();
    const st = r => r.booked ? `<span class="tag ok">Booked ${dayLabel(r.booked.start)}</span>` : `<span class="tag ${r.state === "Overdue" ? "red" : r.state === "Due soon" ? "warn" : ""}">${r.state === "OK" ? "Due " + fmtDay(r.due + "T00:00") : r.state === "Overdue" ? "Overdue " + -r.days + " days" : "Due in " + r.days + " days"}</span>`;
    const unbooked = rows.filter(r => r.days <= 21 && !r.booked).length;
    return `<div class="grid g4" style="margin-bottom:16px">${kpi("Clients on a plan", rows.length, "Recurring income", "up", "ceo/maintenance")}${kpi("Gates covered", rows.reduce((a, r) => a + r.c.assets.length, 0), "Every gate has a history", "", "ceo/assets")}${kpi("Due in 3 weeks", rows.filter(r => r.days <= 21).length, unbooked + " not booked", unbooked ? "dn" : "", "ceo/maintenance")}${kpi("Plan income a year", kfmt(rows.reduce((a, r) => a + ({ Monthly: 450 * 12, Quarterly: 1200 * 4, Biannual: 900 * 2 }[r.c.plan] || 0), 0)), "Before extra parts", "up", "ceo/maintenance")}</div>
      <div class="toolbar"><span class="muted">Service schedules like AroFlo's periodic tasks. Reminders go to clients automatically a week before each visit.</span><span class="grow"></span><button class="btn primary" data-act="autoMaint" ${unbooked ? "" : "disabled"}>${I("spark")} Book all due services (${unbooked})</button></div>
      <div class="card tblwrap"><table class="tbl resp"><thead><tr><th>Client</th><th>Plan</th><th>Gates</th><th>Last service</th><th>Next due</th><th>Status</th></tr></thead><tbody>
      ${rows.map(r => `<tr class="click" data-act="clientCard" data-id="${r.c.id}"><td data-l="Client"><b>${esc(r.c.name)}</b><div class="small muted">${esc(r.c.address.split(",")[1] || "")}</div></td><td data-l="Plan">${r.c.plan}</td><td data-l="Gates">${r.c.assets.length}</td><td data-l="Last">${r.last ? fmtDay(r.last) : "Never"}</td><td data-l="Next due">${fmtDay(r.due + "T00:00")}</td><td data-l="Status">${st(r)}</td></tr>`).join("")}</tbody></table></div>`;
  };

  /* ---------- assets ---------- */
  VIEW.assets = () => {
    const s = S(), q = (ui.aq || "").toLowerCase();
    const rows = []; s.clients.forEach(c => c.assets.forEach(a => rows.push({ c, a })));
    const list = rows.filter(r => !q || (r.a.name + r.a.kind + r.c.name).toLowerCase().includes(q));
    return `<div class="toolbar"><input class="inp" style="max-width:320px" placeholder="Search gates, clients or models" data-input="aq" value="${esc(ui.aq || "")}"><span class="grow"></span><span class="muted small">${rows.length} gates on the register. Each has a QR label so technicians can scan it on site.</span></div>
      <div class="card tblwrap"><table class="tbl resp"><thead><tr><th></th><th>Gate</th><th>Client</th><th>Installed</th><th>Last service</th><th>Warranty</th><th></th></tr></thead><tbody>
      ${list.map(({ c, a }) => `<tr class="click" data-act="assetCard" data-c="${c.id}" data-a="${a.id}"><td data-l="" style="width:58px;color:var(--graph)">${H.gateSvg(H.assetType(a.kind))}</td><td data-l="Gate"><b>${esc(a.name)}</b><div class="small muted">${esc(a.kind)}</div></td><td data-l="Client">${esc(c.name)}</td><td data-l="Installed">${a.installed}</td><td data-l="Last service">${a.last ? fmtDay(a.last) : "No record"}</td><td data-l="Warranty"><span class="tag ${/Until/.test(a.warranty) ? "ok" : ""}">${esc(a.warranty)}</span></td><td data-l="">${I("qr")}</td></tr>`).join("")}</tbody></table></div>`;
  };
  function qrSvg(seed) {
    let h = 0; for (const ch of seed) h = (h * 131 + ch.charCodeAt(0)) >>> 0;
    const n = 21, cells = [];
    const fixed = (x, y) => (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      let on;
      if (fixed(x, y)) { const cx = x > 13 ? x - 14 : x, cy = y > 13 ? y - 14 : y; on = cx === 0 || cy === 0 || cx === 6 || cy === 6 || (cx > 1 && cx < 5 && cy > 1 && cy < 5); }
      else { h = (h * 1103515245 + 12345) >>> 0; on = (h >> 16) & 1; }
      if (on) cells.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
    }
    return `<svg viewBox="-1 -1 23 23" width="150" height="150" style="background:#fff">${cells.join("")}</svg>`;
  }

  /* ---------- stock and purchase orders ---------- */
  VIEW.stock = () => {
    const s = S(), cols = ["jake", "liam", "ryan", "warehouse"];
    const low = H.lowStock();
    return `<div class="toolbar"><span class="muted">Van stock drops when a technician adds a part to a job. Red means below the reorder level.</span><span class="grow"></span><button class="btn" data-act="restock" ${low.length ? "" : "disabled"}>${I("truck")} Restock vans from warehouse</button><button class="btn primary" data-act="newPO">${I("cart")} New purchase order</button></div>
      <div class="card tblwrap" style="margin-bottom:16px"><table class="tbl"><thead><tr><th>Part</th><th class="right">Sell price</th>${cols.map(c => `<th class="right">${c === "warehouse" ? "Warehouse" : T(c).short + "'s van"}</th>`).join("")}<th class="right">Reorder at</th></tr></thead><tbody>
      ${A.PARTS.map(p => `<tr><td><b>${esc(p.name)}</b></td><td class="right">${money(p.price)}</td>${cols.map(c => { const n = s.stock[c][p.id], lowN = c !== "warehouse" && n < s.reorder[p.id]; return `<td class="right"><span class="${lowN ? "tag red" : ""}">${n}</span></td>`; }).join("")}<td class="right muted">${s.reorder[p.id]}</td></tr>`).join("")}</tbody></table></div>
      <div class="card"><div class="card-h"><h3>Purchase orders</h3></div><div class="tblwrap"><table class="tbl resp"><thead><tr><th>PO</th><th>Supplier</th><th>Items</th><th>For job</th><th class="right">Amount</th><th>Status</th><th></th></tr></thead><tbody>
      ${s.pos.map(o => `<tr><td data-l="PO"><b>${o.id}</b><div class="small muted">${fmtDay(o.at)}</div></td><td data-l="Supplier">${esc(o.supplier)}</td><td data-l="Items">${esc(o.items)}</td><td data-l="Job">${o.jobId || '<span class="faint">Stock</span>'}</td><td data-l="Amount" class="right">${money(o.amount)}</td><td data-l="Status"><span class="tag ${o.status === "Received" ? "ok" : "blue"}">${o.status}</span></td><td data-l="">${o.status === "Ordered" ? `<button class="btn sm" data-act="poRecv" data-id="${o.id}">Mark received</button>` : ""}</td></tr>`).join("")}</tbody></table></div></div>`;
  };

  /* ---------- timesheets ---------- */
  function hoursToday(t) {
    const s = S(); const st = s.clock[t];
    if (!st) return 0;
    if (typeof st === "object") return st.total || 0;
    return Math.max(0, (Date.now() - H.dt(st)) / 36e5);
  }
  H.hoursToday = hoursToday;
  VIEW.timesheets = () => {
    const s = S(), days = ["Mon", "Tue", "Wed", "Thu"];
    return `<div class="toolbar"><span class="muted">Technicians clock on and off in the field app. Job time is logged against each job for costing.</span><span class="grow"></span><button class="btn primary" data-act="approveTs">${I("check")} Approve and send to payroll</button></div>
      <div class="card tblwrap"><table class="tbl"><thead><tr><th>Technician</th>${days.map(d => `<th class="right">${d}</th>`).join("")}<th class="right">Today</th><th class="right">Week</th><th class="right">On jobs</th><th>Status</th></tr></thead><tbody>
      ${A.TECHS.map(t => { const hist = s.hours[t.id], today = hoursToday(t.id), wk = hist.reduce((a, b) => a + b, 0) + today, onJobs = s.jobs.filter(j => j.tech === t.id && j.status === "Completed").reduce((a, j) => a + (j.labour || j.dur), 0);
        const st = s.clock[t.id]; const on = typeof st === "string";
        return `<tr><td><span class="techdot" style="background:${t.color}"></span><b>${t.name}</b></td>${hist.map(h => `<td class="right">${h.toFixed(1)}</td>`).join("")}<td class="right b">${today.toFixed(1)}</td><td class="right"><b>${wk.toFixed(1)}</b>${wk > 38 ? ' <span class="tag warn">Overtime</span>' : ""}</td><td class="right">${onJobs.toFixed(1)}</td><td>${on ? `<span class="tag ok">On since ${fmtTime(st)}</span>` : st ? '<span class="tag">Clocked off</span>' : '<span class="tag">Not started</span>'}</td></tr>`; }).join("")}</tbody></table></div>`;
  };

  /* ---------- job costing ---------- */
  VIEW.costing = () => {
    const s = S(), rows = s.jobs.filter(j => j.status === "Completed").map(j => ({ j, k: H.jobCosting(j) })).filter(r => r.k.income > 0 || r.k.cost > 0);
    const tot = rows.reduce((a, r) => ({ i: a.i + r.k.income, c: a.c + r.k.cost, p: a.p + r.k.profit }), { i: 0, c: 0, p: 0 });
    const pct = (p, i) => i ? Math.round(p / i * 100) : 0;
    return `<div class="grid g4" style="margin-bottom:16px">${kpi("Income", money(tot.i), rows.length + " finished jobs", "", "ceo/costing")}${kpi("Costs", money(tot.c), "Labour and parts", "", "ceo/costing")}${kpi("Profit", money(tot.p), pct(tot.p, tot.i) + "% margin", tot.p > 0 ? "up" : "dn", "ceo/costing")}${kpi("Labour rate", money(A.PRICE.labourRate) + "/h", "Wage cost " + money(H.WAGE) + "/h", "", "ceo/costing")}</div>
      <div class="card tblwrap"><table class="tbl resp"><thead><tr><th>Job</th><th>Client</th><th class="right">Hours</th><th class="right">Income</th><th class="right">Labour</th><th class="right">Parts</th><th class="right">Profit</th><th class="right">Margin</th></tr></thead><tbody>
      ${rows.map(({ j, k }) => { const m = pct(k.profit, k.income); return `<tr class="click" data-act="job" data-id="${j.id}"><td data-l="Job"><b>${j.id}</b><div class="small muted">${esc(j.type)}</div></td><td data-l="Client">${esc(C(j.clientId).name)}</td><td data-l="Hours" class="right">${k.hours}</td><td data-l="Income" class="right">${money(k.income)}</td><td data-l="Labour" class="right">${money(k.labourCost)}</td><td data-l="Parts" class="right">${money(k.partsCost)}</td><td data-l="Profit" class="right b">${money(k.profit)}</td><td data-l="Margin" class="right"><span class="tag ${m >= 40 ? "ok" : m >= 20 ? "warn" : "red"}">${m}%</span></td></tr>`; }).join("")}</tbody></table></div>
      <p class="small muted">Plan services count the visit's share of the plan fee as income. Install jobs are paid from the quote, so their income shows on the invoice.</p>`;
  };

  /* ---------- clients ---------- */
  VIEW.clients = () => {
    const s = S(), q = (ui.cq || "").toLowerCase(), f = ui.cf || "All";
    const list = s.clients.filter(c => (f === "All" || c.type === f) && (!q || (c.name + c.contact + c.address).toLowerCase().includes(q)));
    const spend = c => s.invoices.filter(i => i.clientId === c.id && i.status === "Paid").reduce((a, i) => a + i.amount, 0);
    return `<div class="toolbar"><input class="inp" style="max-width:300px" placeholder="Search clients" data-input="cq" value="${esc(ui.cq || "")}"><div class="chips">${["All", "Residential", "Commercial", "Strata", "Industrial"].map(x => `<button class="chip ${f === x ? "on" : ""}" data-act="cf" data-f="${x}">${x}</button>`).join("")}</div></div>
      <div class="card tblwrap"><table class="tbl resp"><thead><tr><th>Client</th><th>Type</th><th>Contact</th><th>Plan</th><th>Gates</th><th class="right">Paid this year</th></tr></thead><tbody>
      ${list.map(c => `<tr class="click" data-act="clientCard" data-id="${c.id}"><td data-l="Client"><div class="row">${avatar(c.name, "sm")}<div><b>${esc(c.name)}</b><div class="small muted">${esc(c.address)}</div></div></div></td><td data-l="Type">${esc(c.type)}</td><td data-l="Contact">${esc(c.contact)}<div class="small muted">${esc(c.phone)}</div></td><td data-l="Plan">${c.plan ? `<span class="tag ok">${c.plan}</span>` : '<span class="faint">None</span>'}</td><td data-l="Gates">${c.assets.length}</td><td data-l="Paid" class="right">${money(spend(c))}</td></tr>`).join("")}</tbody></table></div>`;
  };
  function clientCard(id) {
    const c = C(id), s = S();
    const jobs = s.jobs.filter(j => j.clientId === id).sort((a, b) => (b.start || "").localeCompare(a.start || ""));
    const qs = s.quotes.filter(q => q.clientId === id), inv = s.invoices.filter(i => i.clientId === id);
    H.modal(H.mhead(esc(c.name), `${esc(c.type)} · client since ${c.since}`) + `<div class="mb stack">
      <div class="grid g2"><div class="kv"><span>Contact</span><span>${esc(c.contact)}</span><span>Phone</span><span>${esc(c.phone)}</span><span>Email</span><span>${esc(c.email)}</span><span>Site</span><span>${esc(c.address)}</span></div>
        <div class="kv"><span>Plan</span><span>${c.plan ? c.plan + " maintenance" : "None"}</span><span>Gates</span><span>${c.assets.length}</span><span>Portal</span><span><span class="tag ok">Active</span></span></div></div>
      ${c.assets.length ? `<div><h3>Gates</h3>${c.assets.map(a => `<div class="row" style="padding:6px 0;border-top:1px solid var(--line-2)"><span style="width:44px;color:var(--graph)">${H.gateSvg(H.assetType(a.kind))}</span><div class="grow"><b>${esc(a.name)}</b><div class="small muted">${esc(a.kind)} · installed ${a.installed}</div></div><span class="small muted">${a.last ? "Serviced " + fmtDay(a.last) : ""}</span></div>`).join("")}</div>` : ""}
      <div><h3>Jobs</h3>${jobs.map(j => `<div class="row small" style="padding:6px 0;border-top:1px solid var(--line-2);cursor:pointer" data-act="job" data-id="${j.id}"><b>${j.id}</b><span class="grow ellipsis">${esc(j.title)}</span><span class="muted">${j.start ? fmtDay(j.start) : ""}</span>${statusTag(j.status)}</div>`).join("") || '<div class="small muted">None yet</div>'}</div>
      ${qs.length ? `<div><h3>Quotes</h3>${qs.map(q => `<div class="row small" style="padding:6px 0;border-top:1px solid var(--line-2);cursor:pointer" data-act="go" data-to="ceo/quotes/${q.id}"><b>${q.id}</b><span class="grow ellipsis">${esc(q.title)}</span><b>${money(H.qTotal(q))}</b>${qTag(q.status)}</div>`).join("")}</div>` : ""}
      ${inv.length ? `<div><h3>Invoices</h3>${inv.map(i => `<div class="row small" style="padding:6px 0;border-top:1px solid var(--line-2)"><b>${i.id}</b><span class="grow">${fmtDay(i.issued)}</span><b>${money2(i.amount)}</b><span class="tag ${i.status === "Paid" ? "ok" : i.status === "Overdue" ? "red" : "warn"}">${i.status}</span></div>`).join("")}</div>` : ""}
    </div><div class="mf"><button class="btn" data-act="openConvo" data-client="${c.id}">${I("inbox")} Messages</button><button class="btn" data-act="book" data-client="${c.id}">${I("cal")} Book a job</button><button class="btn" data-act="go" data-to="ceo/quotes/new/${c.id}">${I("quote")} Quote</button><button class="btn dark" data-act="go" data-to="client/${c.id}/home">${I("users")} See their portal</button></div>`, "wide");
  }
  H.clientCard = clientCard;

  /* ---------- invoices ---------- */
  VIEW.invoices = () => {
    const s = S(), f = ui.vf || "All", today = A.todayISO();
    const list = s.invoices.filter(i => f === "All" || i.status === f).sort((a, b) => b.issued.localeCompare(a.issued));
    const sum = st => s.invoices.filter(i => i.status === st).reduce((a, i) => a + i.amount, 0);
    return `<div class="grid g4" style="margin-bottom:16px">${kpi("Outstanding", money(sum("Due") + sum("Overdue")), s.invoices.filter(i => i.status !== "Paid").length + " invoices", "", "ceo/invoices")}${kpi("Overdue", money(sum("Overdue")), "Auto reminders on", sum("Overdue") ? "dn" : "", "ceo/invoices")}${kpi("Paid this month", money(s.invoices.filter(i => i.status === "Paid" && i.paid && i.paid.slice(0, 7) === today.slice(0, 7)).reduce((a, i) => a + i.amount, 0)), "Card, bank and Afterpay", "up", "ceo/invoices")}${kpi("Average days to pay", "6", "Down from 19 before online pay", "up", "ceo/invoices")}</div>
      <div class="toolbar"><div class="chips">${["All", "Due", "Overdue", "Paid"].map(x => `<button class="chip ${f === x ? "on" : ""}" data-act="vf" data-f="${x}">${x}</button>`).join("")}</div></div>
      <div class="card tblwrap"><table class="tbl resp"><thead><tr><th>Invoice</th><th>Client</th><th>For</th><th>Due</th><th class="right">Amount</th><th>Status</th><th></th></tr></thead><tbody>
      ${list.map(i => `<tr><td data-l="Invoice"><b>${i.id}</b><div class="small muted">${fmtDay(i.issued)}</div></td><td data-l="Client">${esc(C(i.clientId).name)}</td><td data-l="For">${i.jobId ? `<a href="#" data-act="job" data-id="${i.jobId}">${i.jobId}</a> ${esc(J(i.jobId) ? J(i.jobId).title : "")}` : esc(i.title || "")}</td><td data-l="Due">${fmtDay(i.due)}</td><td data-l="Amount" class="right b">${money2(i.amount)}</td><td data-l="Status"><span class="tag ${i.status === "Paid" ? "ok" : i.status === "Overdue" ? "red" : "warn"}">${i.status}${i.status === "Paid" && i.paid ? " " + fmtDay(i.paid) : ""}</span></td><td data-l="">${i.status !== "Paid" ? `<button class="btn sm" data-act="invRemind" data-id="${i.id}">Remind</button> <button class="btn sm" data-act="invPaid" data-id="${i.id}">Paid</button>` : ""}</td></tr>`).join("")}</tbody></table></div>`;
  };

  /* ---------- team ---------- */
  VIEW.team = () => {
    const s = S();
    return `<div class="grid g3">${A.TECHS.map(t => {
      const jobs = s.jobs.filter(j => j.tech === t.id && j.start && H.isToday(j.start)).sort((a, b) => a.start.localeCompare(b.start));
      const cur = jobs.find(j => j.status === "In progress" || j.status === "On the way");
      const booked = jobs.reduce((a, j) => a + j.dur, 0), util = Math.min(100, booked / 9 * 100);
      const st = s.clock[t.id];
      return `<div class="card tcard"><div class="row">${avatar(t.name, "lg", t.color)}<div class="grow"><h3>${t.name}</h3><div class="small muted">${t.role} · ${t.van}</div></div></div>
        <div style="margin:12px 0">${cur ? `<span class="tag blue"><span class="pulse" style="color:#2563EB"></span>${cur.status} · ${esc(C(cur.clientId).name)}</span>` : `<span class="tag">${jobs.every(j => j.status === "Completed") && jobs.length ? "Finished for the day" : "Between jobs"}</span>`} ${typeof st === "string" ? `<span class="tag ok">On since ${fmtTime(st)}</span>` : ""}</div>
        <div class="small muted">Booked today: ${booked} of 9 hours</div><div class="util"><i style="width:${util}%;background:${t.color}"></i></div>
        <div style="margin-top:12px">${jobs.map(j => `<div class="row small" style="padding:5px 0;border-top:1px solid var(--line-2);cursor:pointer" data-act="job" data-id="${j.id}"><span class="b" style="width:52px">${fmtTime(j.start)}</span><span class="grow ellipsis">${esc(C(j.clientId).name)}</span>${statusTag(j.status)}</div>`).join("") || '<div class="small muted">No jobs today</div>'}</div>
        <div class="row" style="margin-top:12px"><button class="btn sm grow" data-act="openTeam" data-id="${t.id}">${I("inbox")} Message</button><button class="btn sm grow" data-act="go" data-to="staff/${t.id}/today">${I("tool")} Their app</button></div></div>`;
    }).join("")}</div>`;
  };

  /* ---------- actions ---------- */
  const X = H.ACT;
  X.bell = () => { ui.bell = !ui.bell; H.render(true); };
  X.readAll = () => { S().notices.forEach(n => { if (n.role === "ceo") n.unread = false; }); ui.bell = false; H.save(); H.render(true); };
  X.newMenu = () => H.modal(H.mhead("Create") + `<div class="mb grid g2">
      <button class="btn lg" data-act="go" data-to="ceo/quotes/new">${I("quote")} New quote</button><button class="btn lg" data-act="book">${I("cal")} New booking</button>
      <button class="btn lg" data-act="newLead">${I("users")} New lead</button><button class="btn lg" data-act="newPO">${I("cart")} Purchase order</button></div>`);
  X.search = (d, el) => {
    ui.q = el.value; const q = el.value.toLowerCase().trim(), box = H.$("#sres");
    if (!q) { box.innerHTML = ""; return; }
    const s = S(), res = [
      ...s.clients.filter(c => (c.name + c.contact).toLowerCase().includes(q)).slice(0, 4).map(c => `<div class="fi" data-act="clientCard" data-id="${c.id}">${I("users")} ${esc(c.name)}</div>`),
      ...s.jobs.filter(j => (j.id + j.title + C(j.clientId).name).toLowerCase().includes(q)).slice(0, 4).map(j => `<div class="fi" data-act="job" data-id="${j.id}">${I("tool")} ${j.id} ${esc(j.title)}</div>`),
      ...s.quotes.filter(x => (x.id + x.title).toLowerCase().includes(q)).slice(0, 3).map(x => `<div class="fi" data-act="go" data-to="ceo/quotes/${x.id}">${I("quote")} ${x.id} ${esc(x.title)}</div>`)
    ];
    box.innerHTML = `<div class="npanel" style="left:0;right:auto;width:100%">${res.join("") || '<div class="empty">No matches</div>'}</div>`;
  };
  document.addEventListener("click", e => { if (!e.target.closest(".search")) { const b = H.$("#sres"); if (b) b.innerHTML = ""; } if (ui.bell && !e.target.closest(".bell")) { ui.bell = false; const p = H.$(".npanel"); if (p && !p.closest(".search")) p.remove(); } });

  X.job = d => jobModal(d.id);
  X.clientCard = d => clientCard(d.id);
  X.inboxF = d => { ui.inboxF = d.f; H.render(true); };
  X.iq = (d, el) => { ui.iq = el.value; clearTimeout(X._iq); X._iq = setTimeout(() => { H.render(true); const i = H.$('[data-input="iq"]'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }, 250); };
  X.aiReply = d => { const v = S().convos.find(x => x.id === d.id), t = H.$("#reply"); t.value = ""; const full = aiSuggest(v); let i = 0; const tick = () => { t.value = full.slice(0, i += 4); if (i < full.length) requestAnimationFrame(tick); }; tick(); };
  X.sendReply = d => {
    const v = S().convos.find(x => x.id === d.id), t = H.$("#reply"), text = t.value.trim();
    if (!text) return H.toast("Write a message first", "alert");
    const ch = H.$("#rch").value;
    H.pushMsg(v, { from: "apex", name: "Simon", text, via: ch }, false);
    if (v.clientId) H.notify("client:" + v.clientId, "New message from Apex Gates", `client/${v.clientId}/messages`);
    if (v.staffId) v.staffUnread = true;
    if (v.staffId) H.notify("staff:" + v.staffId, "Message from Simon: " + text.slice(0, 60), `staff/${v.staffId}/messages`);
    if (ui.draft) delete ui.draft[v.id];
    H.save(); H.render(true); H.toast(`Sent by ${ch}`);
  };
  X.call = d => { const c = C(d.id); H.modal(H.mhead("Calling " + esc(c.contact), esc(c.phone)) + `<div class="mb" style="text-align:center">${avatar(c.name, "lg")}<p class="muted">Calls go through the GHL dialler. They're recorded, summarised by AI and saved in this conversation.</p><div class="row" style="justify-content:center"><span class="pulse" style="color:#0E9F6E"></span><b>Ringing</b></div></div><div class="mf"><button class="btn primary" data-act="closeModal">End call</button></div>`); };
  X.openConvo = d => { const s = S(); const v = s.convos.find(x => x.clientId === d.client) || H.clientConvo(d.client); H.save(); H.closeModal(); H.go("ceo/inbox/" + v.id); };

  X.opp = (d, el, e) => {
    if (e.target.closest("select")) return;
    const o = S().opps.find(x => x.id === d.id), c = o.clientId && C(o.clientId);
    H.modal(H.mhead(esc(H.clientName(o)), esc(o.title)) + `<div class="mb stack"><div class="kv"><span>Value</span><b>${money(o.value)}</b><span>Stage</span><span>${o.stage}</span><span>Source</span><span>${esc(o.source)}</span><span>Last update</span><span>${rel(o.at)}</span>${c ? `<span>Phone</span><span>${esc(c.phone)}</span>` : ""}</div>
      <div><label class="f">Move to</label><div class="chips">${STAGES.map(g => `<button class="chip ${g === o.stage ? "on" : ""}" data-act="oppMove" data-id="${o.id}" data-stage="${g}">${g}</button>`).join("")}</div></div></div>
      <div class="mf">${c ? `<button class="btn" data-act="openConvo" data-client="${c.id}">${I("inbox")} Messages</button><button class="btn" data-act="book" data-client="${c.id}" data-type="Site visit">${I("cal")} Book site visit</button><button class="btn primary" data-act="go" data-to="ceo/quotes/new/${c.id}">${I("quote")} Quote</button>` : '<span class="muted small">Add contact details to quote this lead.</span>'}</div>`);
  };
  X.oppMove = d => { H.closeModal(); moveOpp(d.id, d.stage); };
  X.oppStage = (d, el) => moveOpp(d.id, el.value);
  X.newLead = () => H.modal(H.mhead("New lead") + `<div class="mb fgrid"><div class="full"><label class="f">Name or business</label><input class="inp" id="nlName" placeholder="For example: Malaga Storage"></div><div class="full"><label class="f">What do they need</label><input class="inp" id="nlTitle" placeholder="For example: new boom gate"></div><div><label class="f">Estimated value</label><input class="inp" id="nlVal" type="number" value="5000"></div><div><label class="f">Source</label><select class="inp" id="nlSrc">${["Phone", "Website", "Google", "Facebook", "Referral", "AI receptionist"].map(x => `<option>${x}</option>`).join("")}</select></div></div><div class="mf"><button class="btn" data-act="closeModal">Cancel</button><button class="btn primary" data-act="nlSave">Add lead</button></div>`);
  X.nlSave = () => { const n = H.$("#nlName").value.trim(); if (!n) return H.toast("Add a name", "alert"); S().opps.push({ id: "o" + H.nextId("opp"), clientId: null, name: n, title: H.$("#nlTitle").value || "New enquiry", value: +H.$("#nlVal").value || 0, stage: "New lead", source: H.$("#nlSrc").value, at: H.nowISO() }); H.save(); H.closeModal(); H.go("ceo/pipeline"); H.toast("Lead added to the pipeline"); };

  X.mapDay = d => { ui.mapDay = d.v; H.render(true); };
  X.mapTech = d => { ui.mapTech = d.v; H.render(true); };
  X.layer = d => { ui.layers[d.v] = !ui.layers[d.v]; H.render(true); };
  X.mapFocus = d => { const mk = H.U.markers && H.U.markers[d.id]; if (mk) { mk._map.setView(mk.getLatLng(), 13); mk.openPopup(); if (window.innerWidth < 1024) H.$("#map").scrollIntoView({ behavior: "smooth" }); } };
  X.optimise = () => {
    // nearest neighbour from HQ for each van's remaining jobs today
    const s = S(); let moved = 0;
    A.TECHS.forEach(t => {
      const left = s.jobs.filter(j => j.tech === t.id && j.start && H.isToday(j.start) && j.status === "Scheduled");
      if (left.length < 2) return;
      const slots = left.map(j => j.start).sort();
      let cur = s.jobs.filter(j => j.tech === t.id && j.start && H.isToday(j.start) && j.status !== "Scheduled").map(j => C(j.clientId)).pop() || A.BASES[0];
      const order = [], pool = left.slice();
      while (pool.length) { pool.sort((a, b) => H.km(cur, C(a.clientId)) - H.km(cur, C(b.clientId))); const n = pool.shift(); order.push(n); cur = C(n.clientId); }
      order.forEach((j, i) => { if (j.start !== slots[i]) moved++; j.start = slots[i]; });
    });
    H.save(); H.render(true); H.toast(moved ? `Reordered ${moved} stops to cut driving time. Clients were texted new times.` : "Today's runs are already in the best order.", "spark");
  };

  X.calOff = d => { ui.calOff = d.v === "0" ? 0 : (ui.calOff || 0) + +d.v; H.render(true); };
  X.calTech = d => { ui.calTech = d.v; H.render(true); };
  X.calSlot = (d, el, e) => {
    if (e.target.closest(".ev")) return;
    const r = el.getBoundingClientRect(), h = H0 + Math.floor((e.clientY - r.top) / HH * 2) / 2;
    const hh = Math.floor(h), mm = (h - hh) * 60;
    bookModal({ start: `${d.day}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`, tech: ui.calTech && ui.calTech !== "all" ? ui.calTech : "jake" });
  };
  X.book = d => bookModal({ client: d.client, type: d.type });
  X.bookEdit = d => bookModal({ jobId: d.id });
  X.bkCheck = d => {
    const tech = H.$("#bkTech").value, dur = +H.$("#bkDur").value, start = `${H.$("#bkDate").value}T${H.$("#bkTime").value}`;
    const cl = H.clashes(tech, start, dur, d.job || undefined), msg = H.$("#bkMsg");
    if (!msg) return;
    msg.innerHTML = cl.length ? `<span style="color:var(--red)">${I("alert")} Clashes with ${cl.map(j => `${j.id} at ${fmtTime(j.start)}`).join(", ")}</span>` : `<span style="color:var(--ok)">${I("check")} ${T(tech).short} is free</span>`;
  };
  X.bkFind = d => {
    const tech = H.$("#bkTech").value, dur = +H.$("#bkDur").value;
    const slot = H.findSlot(tech, dur, 0, d.job || undefined);
    if (!slot) return H.toast("No free time in the next 3 weeks", "alert");
    H.$("#bkDate").value = slot.slice(0, 10); H.$("#bkTime").value = slot.slice(11, 16);
    X.bkCheck(d);
  };
  X.bkSave = d => {
    const s = S(), start = `${H.$("#bkDate").value}T${H.$("#bkTime").value}`, tech = H.$("#bkTech").value, dur = +H.$("#bkDur").value;
    let j = d.job ? J(d.job) : null;
    if (j) Object.assign(j, { start, tech, dur, priority: H.$("#bkPri").value, notes: H.$("#bkNotes").value, status: j.status === "To schedule" ? "Scheduled" : j.status });
    else {
      const type = H.$("#bkType").value, clientId = H.$("#bkClient").value;
      j = newJob({ clientId, type, tech, start, dur, title: H.$("#bkTitle").value || type, priority: H.$("#bkPri").value, notes: H.$("#bkNotes").value });
      s.jobs.push(j);
    }
    const c = C(j.clientId);
    if (H.$("#bkSms").checked) H.textClient(c.id, `Hi ${c.contact.split(" ")[0]}, you're booked with Apex Gates on ${fmtDay(start)} at ${fmtTime(start)}. ${T(tech).short} will text when he's on the way.`);
    H.notify("staff:" + tech, `New job ${j.id}: ${c.name}, ${dayLabel(start)} ${fmtTime(start)}`, `staff/${tech}/job/${j.id}`);
    H.notify("client:" + c.id, `Visit booked for ${fmtDay(start)} at ${fmtTime(start)}`, `client/${c.id}/home`);
    H.save(); H.closeModal(); H.render(true); H.toast(`${j.id} booked with ${T(tech).short}, ${dayLabel(start)} ${fmtTime(start)}`);
  };
  X.autoBook = d => {
    const j = J(d.id), techs = j.type === "Garage door" ? ["ryan"] : ["jake", "liam"];
    const best = techs.map(t => ({ t, slot: H.findSlot(t, j.dur, 0) })).filter(x => x.slot).sort((a, b) => a.slot.localeCompare(b.slot))[0];
    if (!best) return H.toast("No free slot found", "alert");
    Object.assign(j, { tech: best.t, start: best.slot, status: "Scheduled" });
    const c = C(j.clientId);
    H.textClient(c.id, `Hi ${c.contact.split(" ")[0]}, you're booked with Apex Gates on ${fmtDay(best.slot)} at ${fmtTime(best.slot)}.`);
    H.notify("staff:" + best.t, `New job ${j.id}: ${c.name}`, `staff/${best.t}/job/${j.id}`);
    H.save(); H.render(true); H.toast(`${j.id} booked: ${T(best.t).short}, ${dayLabel(best.slot)} ${fmtTime(best.slot)} (first free slot)`, "spark");
  };
  X.autoMaint = () => {
    const s = S(); let n = 0;
    maintRows().filter(r => r.days <= 21 && !r.booked).forEach(r => {
      const dur = Math.max(1, r.c.assets.length * 0.75);
      const best = ["jake", "liam"].map(t => ({ t, slot: H.findSlot(t, dur, 1) })).filter(x => x.slot).sort((a, b) => a.slot.localeCompare(b.slot))[0];
      if (!best) return;
      s.jobs.push(newJob({ clientId: r.c.id, type: "Service", tech: best.t, start: best.slot, dur, title: `${r.c.plan} service, ${r.c.assets.length} gate${r.c.assets.length > 1 ? "s" : ""}` }));
      H.textClient(r.c.id, `Hi ${r.c.contact.split(" ")[0]}, your ${r.c.plan.toLowerCase()} gate service with Apex Gates is booked for ${fmtDay(best.slot)} at ${fmtTime(best.slot)}.`);
      n++;
    });
    H.save(); H.render(true); H.toast(`${n} services booked into free slots and clients texted`, "spark");
  };

  X.qf = d => { ui.qf = d.f; H.render(true); };
  X.qbSet = d => { H.U.qb[d.k] = d.v; if (d.k === "type") { H.U.qb.width = d.v === "boom" ? 4.5 : Math.max(+H.U.qb.width, 3); } H.render(true); };
  X.qb = (d, el) => { H.U.qb[d.k] = el.value; if (d.k === "clientId") { const c = C(el.value); H.U.qb.siteType = c.type === "Residential" ? "Residential" : c.type === "Industrial" ? "Industrial" : "Commercial"; H.render(true); } else refreshQuote(); };
  X.qbX = (d, el) => { const x = H.U.qb.extras; if (el.checked) { if (!x.includes(d.v)) x.push(d.v); } else H.U.qb.extras = x.filter(v => v !== d.v); refreshQuote(); };
  X.qbSave = d => {
    const q = H.U.qb, r = A.computeQuote(q), s = S();
    const nq = { id: "Q-" + H.nextId("quote"), clientId: q.clientId, title: qbTitle(q), lines: r.lines.map(l => ({ d: l.d, q: l.q, u: Math.round(l.u * 100) / 100 })), status: "Draft", created: H.nowISO() };
    s.quotes.push(nq);
    if (d.send === "1") sendQuote(nq);
    H.U.qb = null; H.save(); H.go("ceo/quotes/" + nq.id);
    H.toast(d.send === "1" ? `${nq.id} sent to ${C(nq.clientId).name} by SMS and email` : `${nq.id} saved as a draft`);
  };
  X.qSend = d => { sendQuote(Q(d.id)); H.save(); H.render(true); H.toast("Quote sent"); };
  X.qRemind = d => { const q = Q(d.id), c = C(q.clientId); H.textClient(c.id, `Hi ${c.contact.split(" ")[0]}, just checking you got quote ${q.id}. Happy to answer any questions.`); H.save(); H.toast("Reminder texted to " + c.contact); };
  X.qAccept = d => { const q = Q(d.id); q.status = "Accepted"; q.accepted = H.nowISO(); q.sig = C(q.clientId).contact; const o = S().opps.find(x => x.quoteId === q.id); H.save(); if (o) moveOpp(o.id, "Won"); else H.render(true); };
  X.qJob = d => { const q = Q(d.id); const j = newJob({ clientId: q.clientId, type: "Install", title: q.title, dur: 6, status: "To schedule", quoteId: q.id }); S().jobs.push(j); H.save(); H.go("ceo/calendar"); H.toast(`${j.id} created. Use Auto book to find a day.`); };

  X.jf = d => { ui.jf = d.f; H.render(true); };
  X.textEta = d => { const j = J(d.id), c = C(j.clientId); H.textClient(c.id, `Hi ${c.contact.split(" ")[0]}, a quick update from Apex Gates about your ${j.type.toLowerCase()}: ${j.status === "On the way" ? `${T(j.tech).short} is about ${j.eta} minutes away.` : `we're booked for ${fmtDay(j.start)} at ${fmtTime(j.start)}.`}`); H.save(); H.toast("Text sent to " + c.contact); };
  X.ceoComplete = d => { const inv = H.completeJob(J(d.id)); H.save(); H.closeModal(); H.render(true); H.toast(inv ? `Completed. Invoice ${inv.id} sent.` : "Completed. Report sent to the client."); };

  X.aq = (d, el) => { ui.aq = el.value; clearTimeout(X._aq); X._aq = setTimeout(() => { H.render(true); const i = H.$('[data-input="aq"]'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }, 250); };
  X.assetCard = d => {
    const c = C(d.c), a = c.assets.find(x => x.id === d.a);
    const hist = S().jobs.filter(j => j.clientId === c.id && j.status === "Completed");
    H.modal(H.mhead(esc(a.name), esc(c.name)) + `<div class="mb"><div class="grid g2"><div class="stack"><div style="color:var(--graph);width:120px">${H.gateSvg(H.assetType(a.kind))}</div><div class="kv"><span>Type</span><span>${esc(a.kind)}</span><span>Installed</span><span>${a.installed}</span><span>Warranty</span><span>${esc(a.warranty)}</span><span>Last service</span><span>${a.last ? fmtDate(a.last) : "No record"}</span></div></div>
      <div style="text-align:center">${qrSvg(c.id + a.id)}<div class="small muted">QR label on the gate post. Scanning it opens this gate's history on the technician's phone.</div></div></div>
      <h3 style="margin-top:14px">Service history</h3>${hist.map(j => `<div class="small" style="padding:6px 0;border-top:1px solid var(--line-2)"><b>${fmtDay(j.start)}</b> ${esc(j.title)} (${T(j.tech).short})${j.report ? `<div class="muted">${esc(j.report)}</div>` : ""}</div>`).join("") || '<div class="small muted">No visits recorded yet</div>'}</div>`);
  };
  X.restock = () => {
    const s = S(); let moved = 0;
    H.lowStock().forEach(({ t, p }) => { const need = s.reorder[p.id] + 2 - s.stock[t][p.id], give = Math.min(need, s.stock.warehouse[p.id]); if (give > 0) { s.stock[t][p.id] += give; s.stock.warehouse[p.id] -= give; moved += give; } });
    H.save(); H.render(true); H.toast(moved ? `${moved} parts packed for the vans. Pick list sent to the warehouse.` : "Warehouse is short. Raise a purchase order.", moved ? "check" : "alert");
  };
  X.newPO = () => {
    const s = S(), need = A.PARTS.filter(p => s.stock.warehouse[p.id] < 4);
    const items = need.map(p => `${10 - s.stock.warehouse[p.id]} x ${p.name}`);
    const amount = need.reduce((a, p) => a + (10 - s.stock.warehouse[p.id]) * p.price * 0.55, 0);
    H.modal(H.mhead("New purchase order", "Filled in from warehouse stock below the minimum") + `<div class="mb stack"><div><label class="f">Supplier</label><select class="inp" id="poSup"><option>Gate Motor Supplies WA</option><option>Perth Steel Fabrication</option><option>Garage Door Parts Direct</option></select></div>
      <div><label class="f">Items</label><textarea class="inp" id="poItems">${esc(items.join(", ") || "2 x Control board")}</textarea></div><div><label class="f">Amount ex GST</label><input class="inp" id="poAmt" type="number" value="${Math.round(amount) || 1180}"></div></div>
      <div class="mf"><button class="btn" data-act="closeModal">Cancel</button><button class="btn primary" data-act="poSave">${I("send")} Send to supplier</button></div>`);
  };
  X.poSave = () => { const s = S(); s.pos.unshift({ id: "PO-0" + (413 + s.pos.length - 2), supplier: H.$("#poSup").value, items: H.$("#poItems").value, amount: +H.$("#poAmt").value, status: "Ordered", at: H.nowISO(), jobId: null }); H.save(); H.closeModal(); H.go("ceo/stock"); H.render(true); H.toast("Purchase order emailed to the supplier"); };
  X.poRecv = d => { const s = S(), o = s.pos.find(x => x.id === d.id); o.status = "Received"; A.PARTS.forEach(p => { const m = o.items.match(new RegExp("(\\d+) x " + p.name.replace(/[()]/g, "\\$&"))); if (m) s.stock.warehouse[p.id] += +m[1]; }); H.save(); H.render(true); H.toast(`${o.id} received into the warehouse`); };
  X.approveTs = () => H.toast("Timesheets approved and sent to payroll (Xero)");
  X.cq = (d, el) => { ui.cq = el.value; clearTimeout(X._cq); X._cq = setTimeout(() => { H.render(true); const i = H.$('[data-input="cq"]'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }, 250); };
  X.cf = d => { ui.cf = d.f; H.render(true); };
  X.vf = d => { ui.vf = d.f; H.render(true); };
  X.invRemind = d => { const i = S().invoices.find(x => x.id === d.id), c = C(i.clientId); H.textClient(c.id, `Hi ${c.contact.split(" ")[0]}, a friendly reminder that invoice ${i.id} for ${money2(i.amount)} is ${i.status === "Overdue" ? "overdue" : "due " + fmtDay(i.due)}. You can pay it in your Apex Gates portal.`); H.save(); H.toast("Reminder sent to " + c.contact); };
  X.invPaid = d => { const i = S().invoices.find(x => x.id === d.id); i.status = "Paid"; i.paid = H.nowISO(); H.save(); H.render(true); H.toast(`${i.id} marked paid`); };

  // after each owner render: maps, quote preview, scroll the thread to the end
  H.docHtml = docHtml; H.moveOpp = moveOpp; H.qTag = qTag; H.statusTag = statusTag;
  X.openTeam = d => { const v = H.teamConvo(d.id); H.save(); H.go("ceo/inbox/" + v.id); };
  const origVIEW = H.VIEWS.ceo;
  H.VIEWS.ceo = p => {
    const html = origVIEW(p);
    H.after(() => {
      if (H.$("#map")) drawMap();
      if (H.$("#qdoc")) refreshQuote();
      const m = H.$("#msgs"); if (m) m.scrollTop = m.scrollHeight;
      const r = H.$("#reply"); if (r) r.addEventListener("input", () => { ui.draft = ui.draft || {}; ui.draft[p[1]] = r.value; });
    });
    return html;
  };
})();
