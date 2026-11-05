/* Apex Gates HQ: the client portal */
(function () {
  const H = window.HQ, A = H.A, { I, esc, money, money2, fmtTime, fmtDay, fmtDate, dayLabel, rel, avatar, C, T, J, Q } = H;
  const S = () => H.S;
  const X = H.ACT;
  const ACCOUNTS = ["c1", "c4", "c2", "c3", "c6"];

  H.VIEWS.client = p => {
    const cid = C(p[0]) ? p[0] : "c1", view = p[1] || "home", c = C(cid), s = S();
    const quotesOpen = s.quotes.filter(q => q.clientId === cid && q.status === "Sent").length;
    const invDue = s.invoices.filter(i => i.clientId === cid && i.status !== "Paid").length;
    const views = { home, gates, request, quotes, invoices, messages, history };
    const body = (views[view] || home)(c, p[2]);
    const nb = (v, l, ic, b) => `<button class="${view === v ? "on" : ""}" data-act="go" data-to="client/${cid}/${v}">${l}${b ? `<span class="badge">${b}</span>` : ""}</button>`;
    return `<div class="portal"><header class="phead"><div class="in"><img src="${H.LOGO}" alt="Apex Gates"><div class="small muted" style="line-height:1.2">Client portal<br><select data-change="clientSwitch" style="border:0;background:transparent;font-weight:600;color:var(--text);padding:0;margin-left:-3px" aria-label="Switch account">${ACCOUNTS.map(id => `<option value="${id}" ${id === cid ? "selected" : ""}>${esc(C(id).name)}</option>`).join("")}</select></div>
      <nav class="pnav">${nb("home", "Home")}${nb("gates", "My gates")}${nb("quotes", "Quotes", "", quotesOpen)}${nb("invoices", "Invoices", "", invDue)}${nb("messages", "Messages")}</nav></div></header>
      <main class="pbody">${body}</main></div>`;
  };

  /* ---------- home ---------- */
  function home(c) {
    const s = S(), first = c.contact.replace(/^Dr /, "").split(" ")[0];
    const live = s.jobs.find(j => j.clientId === c.id && (j.status === "On the way" || j.status === "In progress"));
    const next = s.jobs.filter(j => j.clientId === c.id && j.status === "Scheduled" && j.start).sort((a, b) => a.start.localeCompare(b.start))[0];
    const qs = s.quotes.filter(q => q.clientId === c.id && q.status === "Sent");
    const inv = s.invoices.filter(i => i.clientId === c.id && i.status !== "Paid");
    const notes = s.notices.filter(n => n.role === "client:" + c.id).slice(0, 4);
    if (live) H.after(() => trackMap(live));
    return `<div class="stack" style="--gap:16px">
      <div class="hero"><div><h1>Hi ${esc(first)}</h1><p>${esc(c.name)}${c.plan ? ` · ${c.plan} maintenance plan` : ""} · ${c.assets.length} gate${c.assets.length === 1 ? "" : "s"} looked after by Apex</p></div>
        <button class="btn primary lg" data-act="go" data-to="client/${c.id}/request">${I("alert")} Report a problem</button></div>
      ${live ? tracker(live) : ""}
      <div class="qa">
        <button data-act="go" data-to="client/${c.id}/request/broken"><span class="qi">${I("tool")}</span><b>Something's broken</b><span class="small muted">Gate stuck, noisy or not closing</span></button>
        <button data-act="go" data-to="client/${c.id}/request/service"><span class="qi">${I("cal")}</span><b>Book a service</b><span class="small muted">Pick a time that suits</span></button>
        <button data-act="go" data-to="client/${c.id}/request/quote"><span class="qi">${I("quote")}</span><b>Get a quote</b><span class="small muted">New gate, motor or upgrade</span></button>
        <button data-act="go" data-to="client/${c.id}/messages"><span class="qi">${I("inbox")}</span><b>Message us</b><span class="small muted">We usually reply within the hour</span></button>
      </div>
      <div class="grid g2">
        <div class="card"><div class="card-h"><h3>Needs your attention</h3></div><div class="list">
          ${qs.map(q => `<div class="li" data-act="go" data-to="client/${c.id}/quotes/${q.id}">${I("quote")}<div class="grow"><b>Quote ${q.id}</b><div class="small muted">${esc(q.title)}</div></div><b>${money(H.qTotal(q))}</b><span class="tag blue">Review</span></div>`).join("")}
          ${inv.map(i => `<div class="li" data-act="go" data-to="client/${c.id}/invoices">${I("dollar")}<div class="grow"><b>Invoice ${i.id}</b><div class="small muted">Due ${fmtDay(i.due)}</div></div><b>${money2(i.amount)}</b><span class="tag ${i.status === "Overdue" ? "red" : "warn"}">${i.status === "Overdue" ? "Overdue" : "Pay"}</span></div>`).join("")}
          ${!qs.length && !inv.length ? '<div class="empty">All up to date. Nothing needs you.</div>' : ""}</div></div>
        <div class="card"><div class="card-h"><h3>Next visit</h3></div><div class="card-b">
          ${next ? `<div class="row"><div class="grow"><div style="font-family:var(--head);font-size:26px;font-weight:700">${dayLabel(next.start)}, ${fmtTime(next.start)}</div><div class="small muted">${esc(next.type)}: ${esc(next.title)}</div></div>${avatar(T(next.tech).name, "", T(next.tech).color)}</div><div class="small" style="margin-top:8px">Your technician is <b>${T(next.tech).name}</b>. We'll text you when he's on the way.</div>`
            : `<div class="muted">No visit booked.${c.plan ? " Your next plan service will be booked automatically." : ""}</div><button class="btn" style="margin-top:10px" data-act="go" data-to="client/${c.id}/request/service">Book a service</button>`}</div></div>
      </div>
      ${notes.length ? `<div class="card"><div class="card-h"><h3>Recent updates</h3></div><div class="card-b feed">${notes.map(n => `<div class="fi" data-act="go" data-to="${esc(n.go || "client/" + c.id + "/home")}"><span>${esc(n.text)}</span><span class="t">${rel(n.at)}</span></div>`).join("")}</div></div>` : ""}
      <div class="row small muted" style="justify-content:center;padding:10px">${I("phone")} Urgent breakdowns after hours: call and our assistant will book you in straight away.</div></div>`;
  }
  function tracker(j) {
    const t = T(j.tech), onWay = j.status === "On the way";
    return `<div class="track"><div class="th">${avatar(t.name, "lg", t.color)}<div class="grow"><div class="small muted">${onWay ? "On the way" : "On site now"}</div><b style="font-size:16px">${t.name}</b><div class="small muted">${esc(j.title)}</div></div>
        <div class="right">${onWay ? `<div class="eta">${j.eta} min</div><div class="small muted">arriving about ${fmtTime(H.isoIn(j.eta))}</div>` : `<span class="tag ok">Working on it</span>`}</div></div>
      <div class="steps">${[0, 1, 2, 3].map(i => `<div class="${i <= (onWay ? 1 : 2) ? "on" : ""}"></div>`).join("")}</div>
      <div class="minimap" id="track" style="border-radius:0;height:220px"></div></div>`;
  }
  function trackMap(j) {
    const el = H.$("#track"); if (!el) return;
    const c = C(j.clientId), t = T(j.tech);
    const m = H.mkMap(el, [c.lat, c.lng], 12); if (!m) return;
    L.marker([c.lat, c.lng], { icon: H.pinIcon("#D61D09", "") }).addTo(m).bindPopup("Your site");
    if (j.status === "On the way") {
      const p = H.vanPos(j);
      L.marker([p.lat, p.lng], { icon: H.vanIcon(t.color) }).addTo(m);
      L.polyline([[p.lat, p.lng], [c.lat, c.lng]], { color: t.color, weight: 3, dashArray: "6 8" }).addTo(m);
      m.fitBounds([[p.lat, p.lng], [c.lat, c.lng]], { padding: [40, 40] });
    }
  }

  /* ---------- gates and history ---------- */
  function gates(c) {
    const s = S(), PLAN = { Monthly: 30, Quarterly: 91, Biannual: 182 };
    return `<div class="row" style="margin-bottom:14px"><h2 class="grow">My gates</h2><button class="btn" data-act="go" data-to="client/${c.id}/history">${I("clip")} Service reports</button></div>
      ${c.assets.map(a => { let due = ""; if (c.plan && a.last) { const d = new Date(H.dayISO(a.last)); d.setDate(d.getDate() + PLAN[c.plan]); due = fmtDay(A.iso(d) + "T00:00"); }
        return `<div class="card asset" style="margin-bottom:12px"><div class="ai" style="color:var(--graph)">${H.gateSvg(H.assetType(a.kind))}</div><div class="grow"><h3>${esc(a.name)}</h3><div class="small muted">${esc(a.kind)} · installed ${a.installed}</div>
          <div class="chips" style="margin-top:8px"><span class="tag">${a.last ? "Serviced " + fmtDay(a.last) : "No service yet"}</span>${due ? `<span class="tag blue">Next service ${due}</span>` : ""}<span class="tag ${/Until/.test(a.warranty) ? "ok" : ""}">Warranty: ${esc(a.warranty.toLowerCase())}</span></div></div>
          <button class="btn sm" data-act="go" data-to="client/${c.id}/request/broken/${a.id}">Report a problem</button></div>`; }).join("") || '<div class="card empty">No gates on record yet. Once we install or service one, it shows here.</div>'}
      ${c.plan ? `<div class="card card-b"><h3>${c.plan} maintenance plan</h3><p class="small muted" style="margin:6px 0 0">Every visit covers a full safety and motor check, lubrication, beam tests and a written report. Breakdown callouts are priority and parts are at trade price. Visits are booked for you and we text a week before.</p></div>`
        : `<div class="card card-b row wrap"><div class="grow"><h3>Keep your gates running</h3><p class="small muted" style="margin:6px 0 0">A maintenance plan catches problems before your gate stops working. From $${c.type === "Residential" ? "220 a year" : "450 a quarter"}.</p></div><button class="btn primary" data-act="go" data-to="client/${c.id}/messages" data-plan="1">Ask about a plan</button></div>`}`;
  }
  function history(c) {
    const list = S().jobs.filter(j => j.clientId === c.id && j.status === "Completed").sort((a, b) => b.start.localeCompare(a.start));
    return `<div class="row" style="margin-bottom:14px"><button class="btn sm" data-act="go" data-to="client/${c.id}/gates">${I("left")} My gates</button><h2 class="grow">Service reports</h2></div>
      ${list.map(j => `<div class="card card-b" style="margin-bottom:12px"><div class="row"><div class="grow"><b>${fmtDate(j.start)}</b> · ${esc(j.type)}<div class="small muted">${esc(j.title)} · ${T(j.tech).name}</div></div><span class="tag ok">${I("check")} Complete</span></div>
        <div class="small" style="margin-top:8px">${esc(j.report || "")}</div>
        <div class="small muted" style="margin-top:6px">${j.checklist.filter(x => x.done).length} of ${j.checklist.length} checks passed${j.safety ? " · safety check done" : ""}</div>
        ${j.photos.length ? `<div class="photos" style="margin-top:10px">${j.photos.map(p => `<div class="ph" style="background-image:url(${p})"></div>`).join("")}</div>` : ""}
        ${j.signature ? `<div style="margin-top:8px"><span class="small muted">Signed by ${esc(j.signedBy || c.contact)}</span><br><img class="sigimg" src="${j.signature}" alt="Signature"></div>` : ""}</div>`).join("") || '<div class="card empty">No reports yet</div>'}`;
  }

  /* ---------- request ---------- */
  const KINDS = { broken: ["Something's broken", "tool"], service: ["Book a service", "cal"], quote: ["New gate or upgrade", "quote"], garage: ["Garage door", "gate"] };
  function request(c, kind) {
    const pp = H.U.req && H.U.req.cid === c.id ? H.U.req : (H.U.req = { cid: c.id, kind: KINDS[kind] ? kind : "broken", urgent: false, when: "ASAP", photo: null, asset: (location.hash.split("/")[4]) || (c.assets[0] && c.assets[0].id) || "" });
    if (KINDS[kind] && pp.kind !== kind && !pp.touched) pp.kind = kind;
    if (pp.sent) return sentView(c, pp);
    return `<div class="row" style="margin-bottom:14px"><button class="btn sm" data-act="go" data-to="client/${c.id}/home">${I("left")} Home</button><h2 class="grow">How can we help?</h2></div>
      <div class="card card-b stack" style="max-width:720px">
        <div class="qa" style="grid-template-columns:repeat(4,1fr)">${Object.entries(KINDS).map(([k, [l, ic]]) => `<button style="${pp.kind === k ? "border-color:var(--red);background:var(--red-soft)" : ""}" data-act="reqKind" data-v="${k}"><span class="qi">${I(ic)}</span><b class="small">${l}</b></button>`).join("")}</div>
        ${c.assets.length && pp.kind !== "quote" ? `<div><label class="f">Which gate</label><select class="inp" id="rqAsset">${c.assets.map(a => `<option value="${a.id}" ${a.id === pp.asset ? "selected" : ""}>${esc(a.name)}</option>`).join("")}<option value="">Something else</option></select></div>` : ""}
        ${pp.kind === "broken" || pp.kind === "garage" ? `<label class="check" style="${pp.urgent ? "border-color:var(--red);background:var(--red-soft)" : ""}"><input type="checkbox" data-change="reqUrgent" ${pp.urgent ? "checked" : ""}><span><b>It's urgent.</b> The gate is stuck open or closed, or it's a safety risk.</span></label>` : ""}
        <div><label class="f">${pp.kind === "quote" ? "What are you after?" : "What's happening?"}</label><textarea class="inp" id="rqText" placeholder="${pp.kind === "quote" ? "For example: an automatic sliding gate for a 5 m driveway" : "For example: the gate stops halfway and beeps"}">${esc(pp.text || "")}</textarea></div>
        <div><label class="f">Add a photo (helps us bring the right parts)</label><div class="photos" style="max-width:300px">${pp.photo ? `<div class="ph" style="background-image:url(${pp.photo})"></div>` : ""}<label class="add">${I("camera")}<span>${pp.photo ? "Change" : "Add photo"}</span><input type="file" accept="image/*" capture="environment" data-change="reqPhoto"></label></div></div>
        <div><label class="f">When suits you</label><div class="chips">${["ASAP", "Mornings", "Afternoons", "Any time this week"].map(w => `<button class="chip ${pp.when === w ? "on" : ""}" data-act="reqWhen" data-v="${w}">${w}</button>`).join("")}</div></div>
        <button class="btn primary lg" data-act="reqSend" data-c="${c.id}">${I("send")} Send to Apex Gates</button>
        <p class="small muted" style="margin:0">This goes straight to Simon's team and into your messages. Urgent jobs are booked into the first free slot automatically.</p></div>`;
  }
  function sentView(c, pp) {
    const j = pp.jobId && J(pp.jobId);
    return `<div class="card card-b" style="max-width:640px;text-align:center;padding:36px 24px;margin:0 auto">
      <div style="width:64px;height:64px;border-radius:50%;background:var(--ok-soft);color:var(--ok);display:grid;place-items:center;margin:0 auto 12px">${I("check")}</div>
      <h2>Thanks, we've got it</h2>
      ${j && j.start ? `<p>You're booked with <b>${T(j.tech).name}</b> on <b>${dayLabel(j.start)} at ${fmtTime(j.start)}</b>. We've texted you the details, and you can track him here when he's on the way.</p>`
        : pp.kind === "quote" ? "<p>Simon will be in touch today to book a time to measure up. Quotes are usually ready within 24 hours of the visit.</p>"
        : "<p>The team has been told and will confirm a time with you shortly. You'll get a text as soon as it's booked.</p>"}
      <div class="row" style="justify-content:center;margin-top:16px"><button class="btn" data-act="reqNew" data-c="${c.id}">Send another</button><button class="btn primary" data-act="go" data-to="client/${c.id}/home">Back to home</button></div></div>`;
  }

  /* ---------- quotes ---------- */
  function quotes(c, id) {
    const s = S();
    if (id && Q(id)) return quoteView(c, Q(id));
    const list = s.quotes.filter(q => q.clientId === c.id && q.status !== "Draft").slice().reverse();
    return `<h2 style="margin-bottom:14px">Quotes</h2><div class="card list">${list.map(q => `<div class="li" data-act="go" data-to="client/${c.id}/quotes/${q.id}">${I("quote")}<div class="grow"><b>${esc(q.title)}</b><div class="small muted">${q.id} · ${fmtDay(q.sent || q.created)}</div></div><b>${money2(H.qTotal(q))}</b>${H.qTag(q.status === "Sent" ? "Sent" : q.status).replace(">Sent<", ">Awaiting you<")}</div>`).join("") || '<div class="empty">No quotes yet</div>'}</div>`;
  }
  function quoteView(c, q) {
    if (q.status === "Sent" && !q.viewed) { q.viewed = H.nowISO(); H.notify("ceo", `${c.name} opened quote ${q.id}`, "ceo/quotes/" + q.id); H.save(); }
    return `<div class="row" style="margin-bottom:14px"><button class="btn sm" data-act="go" data-to="client/${c.id}/quotes">${I("left")} Quotes</button></div>
      <div class="qm"><div>${H.docHtml(q.clientId, q.title, q.lines, q.id, q.status === "Sent" ? null : q.status)}</div>
      <div class="stack">${q.status === "Sent" ? `<div class="card card-b stack"><h3>Happy with this?</h3><p class="small muted" style="margin:0">Accept and sign below. We'll book the work in and send a 30% deposit invoice of ${money2(H.qTotal(q) * A.PRICE.deposit)}.</p>
        <button class="btn primary lg" data-act="qcAccept" data-id="${q.id}">${I("pen")} Accept and sign</button><button class="btn" data-act="go" data-to="client/${c.id}/messages">${I("inbox")} Ask a question</button><button class="btn ghost" data-act="qcDecline" data-id="${q.id}">Decline</button></div>`
        : `<div class="card card-b">${q.status === "Accepted" ? `<h3 style="color:var(--ok)">${I("check")} Accepted ${q.accepted ? fmtDay(q.accepted) : ""}</h3><p class="small muted">Thanks! We'll be in touch to book the work.</p>${q.sigImg ? `<img class="sigimg" src="${q.sigImg}" alt="Your signature">` : ""}` : `<h3>Declined</h3><p class="small muted">${esc(q.reason || "")}</p>`}</div>`}
        <div class="card card-b small muted">Every Apex install comes with a 12 month workmanship warranty and the manufacturer's motor warranty. Prices include supply, installation and commissioning.</div></div></div>`;
  }

  /* ---------- invoices ---------- */
  function invoices(c) {
    const list = S().invoices.filter(i => i.clientId === c.id).sort((a, b) => b.issued.localeCompare(a.issued));
    const due = list.filter(i => i.status !== "Paid").reduce((a, i) => a + i.amount, 0);
    return `<div class="row" style="margin-bottom:14px"><h2 class="grow">Invoices</h2>${due ? `<span class="b">${money2(due)} to pay</span>` : ""}</div>
      <div class="card list">${list.map(i => `<div class="li" style="cursor:default">${I("dollar")}<div class="grow"><b>${i.id}</b><div class="small muted">${i.jobId && J(i.jobId) ? esc(J(i.jobId).title) : esc(i.title || "")} · ${fmtDay(i.issued)}</div></div><b>${money2(i.amount)}</b>
        ${i.status === "Paid" ? `<span class="tag ok">Paid</span>` : `<button class="btn primary sm" data-act="payInv" data-id="${i.id}">${I("card")} Pay${i.status === "Overdue" ? " (overdue)" : ""}</button>`}</div>`).join("") || '<div class="empty">No invoices</div>'}</div>`;
  }

  /* ---------- messages ---------- */
  function messages(c) {
    const s = S(), all = [];
    s.convos.filter(v => v.clientId === c.id).forEach(v => v.msgs.forEach(m => all.push(Object.assign({ ch: v.channel }, m))));
    all.sort((a, b) => a.at.localeCompare(b.at));
    H.after(() => { const m = H.$("#cmsgs"); if (m) m.scrollTop = m.scrollHeight; });
    return `<div class="card chatbox" style="overflow:hidden"><div class="card-h"><div class="row">${avatar("Apex Gates", "", "#D61D09")}<div><b>Apex Gates</b><div class="small muted">Simon and the team · usually reply within the hour</div></div></div></div>
      <div class="msgs" id="cmsgs" style="flex:1">${all.map(m => m.kind === "call" ? `<div class="bub in">Phone call with our assistant: ${esc(m.summary)}<span class="meta">${fmtDay(m.at)}</span></div>` :
        `<div class="bub ${m.from === "client" ? "out" : m.from === "auto" ? "in" : "in"}">${esc(m.text)}${m.photo && m.photo !== true ? `<img class="ph" src="${m.photo}" alt="">` : ""}<span class="meta">${m.from === "client" ? "You" : m.from === "auto" ? "Apex Gates (automatic)" : esc(m.name || "Apex Gates")} · ${m.ch === "Portal" ? "" : m.ch + " · "}${fmtTime(m.at)}${H.isToday(m.at) ? "" : ", " + fmtDay(m.at)}</span></div>`).join("") || '<div class="empty">Say hello. Ask anything about your gates.</div>'}</div>
      <div class="compose"><textarea id="cmsg" placeholder="Write a message">${H.U.ui.cdraft || ""}</textarea><div class="bar"><span class="grow"></span><button class="btn primary sm" data-act="clientSend" data-c="${c.id}">${I("send")} Send</button></div></div></div>`;
  }

  /* ---------- actions ---------- */
  X.clientSwitch = (d, el) => { H.U.req = null; H.go(`client/${el.value}/home`); };
  X.reqKind = d => { H.U.req.kind = d.v; H.U.req.touched = true; keepText(); H.render(true); };
  X.reqUrgent = (d, el) => { H.U.req.urgent = el.checked; keepText(); H.render(true); };
  X.reqWhen = d => { H.U.req.when = d.v; keepText(); H.render(true); };
  X.reqPhoto = (d, el) => { const f = el.files && el.files[0]; if (!f) return; keepText(); H.readPhoto(f, url => { H.U.req.photo = url; H.render(true); }); };
  X.reqNew = d => { H.U.req = null; H.go(`client/${d.c}/request`); H.render(); };
  function keepText() { const t = H.$("#rqText"); if (t) H.U.req.text = t.value; const a = H.$("#rqAsset"); if (a) H.U.req.asset = a.value; }
  X.reqSend = d => {
    keepText();
    const pp = H.U.req, c = C(d.c), s = S();
    if (!pp.text || pp.text.trim().length < 4) return H.toast("Tell us a little about it first", "alert");
    const asset = c.assets.find(a => a.id === pp.asset);
    const label = KINDS[pp.kind][0];
    const v = H.clientConvo(c.id);
    H.pushMsg(v, { from: "client", name: c.contact, text: `${label}${pp.urgent ? " (URGENT)" : ""}${asset ? "\nGate: " + asset.name : ""}\nWhen: ${pp.when}\n\n${pp.text}`, photo: pp.photo || undefined }, true);
    if (pp.kind === "quote") {
      s.opps.push({ id: "o" + H.nextId("opp"), clientId: c.id, title: pp.text.slice(0, 50), value: 5000, stage: "New lead", source: "Client portal", at: H.nowISO() });
      H.notify("ceo", `${c.name} asked for a quote in the portal`, "ceo/inbox/" + v.id);
    } else {
      const type = pp.kind === "service" ? "Service" : pp.kind === "garage" ? "Garage door" : "Breakdown";
      const j = H.newJob({ clientId: c.id, type, title: (asset ? asset.name + ": " : "") + pp.text.split("\n")[0].slice(0, 60), dur: type === "Service" ? 1.5 : 1, status: "To schedule", priority: pp.urgent ? "Urgent" : "Normal", notes: `From the client portal. ${pp.text}` });
      if (pp.photo) j.photos.push(pp.photo);
      s.jobs.push(j); pp.jobId = j.id;
      if (pp.urgent) {
        const techs = type === "Garage door" ? ["ryan"] : ["jake", "liam"];
        const best = techs.map(t => ({ t, slot: H.findSlot(t, j.dur, 0) })).filter(x => x.slot).sort((a, b) => a.slot.localeCompare(b.slot))[0];
        if (best) {
          Object.assign(j, { tech: best.t, start: best.slot, status: "Scheduled" });
          H.textClient(c.id, `Hi ${c.contact.split(" ")[0]}, ${T(best.t).short} from Apex Gates is booked for ${dayLabel(best.slot).toLowerCase()} at ${fmtTime(best.slot)} for your urgent job.`);
          H.notify("staff:" + best.t, `URGENT job added: ${c.name}, ${fmtTime(best.slot)}`, `staff/${best.t}/job/${j.id}`);
        }
      }
      H.notify("ceo", `${pp.urgent ? "URGENT: " : ""}${c.name} reported "${pp.text.slice(0, 50)}"${j.start ? ` and was auto booked with ${T(j.tech).short}` : ""}`, "ceo/jobs/" + j.id);
    }
    pp.sent = true; H.save(); H.render(true); window.scrollTo(0, 0);
  };
  X.qcAccept = d => {
    const q = Q(d.id), c = C(q.clientId);
    H.modal(H.mhead("Accept quote " + q.id, esc(q.title) + " · " + money2(H.qTotal(q))) + `<div class="mb stack"><div><label class="f">Your name</label><input class="inp" id="qaName" value="${esc(c.contact)}"></div>
      <div><label class="f">Sign here</label><canvas id="qsig" class="sigpad"></canvas><div class="row"><span class="small muted grow">Sign with your finger or mouse</span><button class="btn sm ghost" data-act="qsigClear">Clear</button></div></div>
      <label class="check"><input type="checkbox" id="qaTerms"><span class="small">I accept the quote and Apex Gates' terms of trade</span></label>
      <label class="check"><input type="checkbox" id="qaPay" checked><span class="small">Pay the 30% deposit now (${money2(H.qTotal(q) * A.PRICE.deposit)})</span></label></div>
      <div class="mf"><button class="btn" data-act="closeModal">Cancel</button><button class="btn primary" data-act="qcAcceptGo" data-id="${q.id}">${I("check")} Accept</button></div>`);
    H.after(() => H.sigPad(H.$("#qsig"))); H.runAfter();
  };
  X.qsigClear = () => { const c = H.$("#qsig"); c.getContext("2d").clearRect(0, 0, c.width, c.height); delete c.dataset.signed; };
  X.qcAcceptGo = d => {
    const q = Q(d.id), c = C(q.clientId), s = S(), sig = H.sigData(H.$("#qsig"));
    if (!sig) return H.toast("Please sign first", "alert");
    if (!H.$("#qaTerms").checked) return H.toast("Tick the box to accept the terms", "alert");
    const pay = H.$("#qaPay").checked;
    q.status = "Accepted"; q.accepted = H.nowISO(); q.sig = H.$("#qaName").value; q.sigImg = sig;
    const dep = { id: "INV-" + H.nextId("inv"), clientId: c.id, jobId: null, title: "Deposit for " + q.id, amount: Math.round(H.qTotal(q) * A.PRICE.deposit * 100) / 100, status: pay ? "Paid" : "Due", issued: H.nowISO(), due: A.at(7, 0), paid: pay ? H.nowISO() : undefined };
    s.invoices.unshift(dep);
    const o = s.opps.find(x => x.quoteId === q.id);
    H.notify("ceo", `${c.name} accepted and signed ${q.id} (${money(H.qTotal(q))})${pay ? ", deposit paid" : ""}`, "ceo/quotes/" + q.id);
    H.save(); H.closeModal();
    if (o) { const keep = location.hash; H.moveOpp(o.id, "Won"); }
    else { s.jobs.push(H.newJob({ clientId: c.id, type: "Install", title: q.title, dur: 6, status: "To schedule", quoteId: q.id })); H.save(); H.render(true); }
    H.toast(pay ? "Accepted and deposit paid. Thank you!" : "Accepted. Thank you!");
  };
  X.qcDecline = d => H.modal(H.mhead("Decline quote") + `<div class="mb"><label class="f">Can you tell us why? (optional)</label><select class="inp" id="qdR"><option>The price is more than we planned</option><option>We went with someone else</option><option>We've put the project on hold</option><option>Other</option></select></div><div class="mf"><button class="btn" data-act="closeModal">Cancel</button><button class="btn" data-act="qcDeclineGo" data-id="${d.id}">Decline</button></div>`);
  X.qcDeclineGo = d => { const q = Q(d.id), c = C(q.clientId); q.status = "Declined"; q.declined = H.nowISO(); q.reason = H.$("#qdR").value; const o = S().opps.find(x => x.quoteId === q.id); if (o) o.stage = "Lost"; H.notify("ceo", `${c.name} declined ${q.id}: ${q.reason}`, "ceo/quotes/" + q.id); H.save(); H.closeModal(); H.render(true); };
  X.payInv = d => {
    const i = S().invoices.find(x => x.id === d.id);
    H.modal(H.mhead("Pay " + i.id, money2(i.amount) + " inc GST") + `<div class="mb stack"><div class="grid g2" style="gap:8px">${[["card", "Card"], ["phone", "Apple Pay or Google Pay"], ["layers", "Afterpay"], ["doc", "Bank transfer"]].map(([ic, l], k) => `<label class="check"><input type="radio" name="pm" ${k ? "" : "checked"}>${I(ic)}<span>${l}</span></label>`).join("")}</div>
      <p class="small muted" style="margin:0">In the live portal this opens a secure payment page. Card details never touch Apex's system.</p></div>
      <div class="mf"><button class="btn" data-act="closeModal">Cancel</button><button class="btn primary" data-act="payGo" data-id="${i.id}">${I("check")} Pay ${money2(i.amount)}</button></div>`);
  };
  X.payGo = d => { const i = S().invoices.find(x => x.id === d.id), c = C(i.clientId); i.status = "Paid"; i.paid = H.nowISO(); H.notify("ceo", `${c.name} paid ${i.id} online (${money2(i.amount)})`, "ceo/invoices"); H.save(); H.closeModal(); H.render(true); H.toast("Payment received. Receipt emailed."); };
  X.clientSend = d => {
    const t = H.$("#cmsg").value.trim(); if (!t) return;
    const c = C(d.c), v = H.clientConvo(c.id);
    H.pushMsg(v, { from: "client", name: c.contact, text: t }, true);
    H.notify("ceo", `New portal message from ${c.name}`, "ceo/inbox/" + v.id);
    H.U.ui.cdraft = ""; H.save(); H.render(true);
  };
})();
