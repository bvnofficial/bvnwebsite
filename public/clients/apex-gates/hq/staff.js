/* Apex Gates HQ: the staff field app (phone first) */
(function () {
  const H = window.HQ, A = H.A, { I, esc, money, money2, fmtTime, fmtDay, dayLabel, rel, avatar, C, T, J } = H;
  const S = () => H.S;
  const X = H.ACT;

  H.VIEWS.staff = p => {
    const tid = A.TECHS.some(t => t.id === p[0]) ? p[0] : "jake", view = p[1] || "today", t = T(tid);
    const s = S(), st = s.clock[tid], on = typeof st === "string";
    const unreadMsgs = s.convos.filter(v => v.channel === "Team" && v.staffId === tid && v.msgs.length && v.msgs[v.msgs.length - 1].from === "apex" && v.staffUnread).length;
    let body;
    if (view === "job" && J(p[2])) body = jobView(tid, J(p[2]));
    else if (view === "schedule") body = schedule(tid);
    else if (view === "messages") body = messages(tid);
    else if (view === "time") body = timeView(tid);
    else body = today(tid);
    const tab = (v, l, ic, badge) => `<button class="${view === v || (v === "today" && view === "job") ? "on" : ""}" data-act="go" data-to="staff/${tid}/${v}">${I(ic)}<span>${l}</span>${badge ? `<span class="badge">${badge}</span>` : ""}</button>`;
    return `<div class="field">
      <header class="fhead"><div class="row">${avatar(t.name, "", t.color)}<div class="grow"><h2>${view === "job" ? "Job" : "G'day " + t.short}</h2><div class="small" style="opacity:.7">${t.role} · ${t.van}</div></div>
        <select data-change="staffSwitch" aria-label="Switch technician">${A.TECHS.map(x => `<option value="${x.id}" ${x.id === tid ? "selected" : ""}>${x.short}</option>`).join("")}</select></div>
        <div class="clockbar">${I("clock")}<span class="grow">${on ? `<span class="on">On the clock</span> since ${fmtTime(st)} · ${H.hoursToday(tid).toFixed(1)} h` : st ? `Clocked off · ${(st.total || 0).toFixed(1)} h today` : "Not clocked on yet"}</span>
          <button class="btn sm ${on ? "" : "ok"}" data-act="clock" data-t="${tid}">${on ? "Clock off" : "Clock on"}</button></div></header>
      <main class="fbody">${body}</main>
      <nav class="ftabs">${tab("today", "Today", "home")}${tab("schedule", "Schedule", "cal")}${tab("messages", "Office", "inbox", unreadMsgs)}${tab("time", "Timesheet", "clock")}</nav></div>`;
  };

  const tjobs = (tid, day) => S().jobs.filter(j => j.tech === tid && j.start && j.start.slice(0, 10) === day).sort((a, b) => a.start.localeCompare(b.start));

  /* ---------- today ---------- */
  function today(tid) {
    const s = S(), list = tjobs(tid, A.todayISO());
    let dist = 0, prev = A.BASES[0]; list.forEach(j => { const c = C(j.clientId); dist += H.km(prev, c); prev = c; });
    const cur = list.find(j => j.status === "On the way" || j.status === "In progress") || list.find(j => j.status === "Scheduled");
    const low = H.lowStock().filter(x => x.t === tid);
    const notes = s.notices.filter(n => n.role === "staff:" + tid && n.unread);
    H.after(() => drawRoute(tid, list));
    return `${notes.map(n => `<div class="fsec row" style="background:#FFF8F7;border-color:#F5C9C2"><span style="color:var(--red)">${I("bell")}</span><span class="grow small">${esc(n.text)}</span><button class="btn sm" data-act="stNotice" data-id="${n.id}" data-to="${esc(n.go || "")}">Open</button></div>`).join("")}
      <div class="fsec"><div class="row"><div class="grow"><div class="small muted">${new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })}</div><h3 style="font-size:22px">${list.length} jobs · ${Math.round(dist)} km</h3></div>
        <div class="right small"><b>${list.filter(j => j.status === "Completed").length}</b> done<br><b>${list.filter(j => j.status !== "Completed").length}</b> to go</div></div>
        <div class="minimap" id="route" style="margin-top:12px"></div></div>
      ${low.length ? `<div class="fsec row" style="background:var(--warn-soft);border-color:#F3D9A8"><span style="color:var(--warn)">${I("box")}</span><span class="grow small">Van stock low: ${low.map(x => `${esc(x.p.name)} (${x.n})`).join(", ")}. The office has been told.</span></div>` : ""}
      ${list.map((j, i) => card(j, i, cur)).join("") || '<div class="empty">No jobs today</div>'}`;
  }
  function card(j, i, cur) {
    const c = C(j.clientId), isCur = cur && cur.id === j.id;
    return `<div class="fjob ${isCur ? "current" : ""} ${j.status === "Completed" ? "done" : ""}" data-act="go" data-to="staff/${j.tech}/job/${j.id}">
      <div class="when"><b>${fmtTime(j.start).replace(/(am|pm)/, "")}</b><span class="small muted">${fmtTime(j.start).match(/am|pm/)[0]}</span></div>
      <div style="min-width:0"><div class="row" style="gap:6px"><b class="grow ellipsis">${esc(c.name)}</b>${H.statusTag(j.status)}</div>
        <div class="small muted ellipsis">${esc(j.type)}: ${esc(j.title)}</div><div class="small ellipsis" style="margin-top:4px">${I("map")} ${esc(c.address)}</div>
        ${j.priority === "Urgent" && j.status !== "Completed" ? '<span class="tag red" style="margin-top:6px">Urgent</span>' : ""}${isCur ? `<div style="margin-top:8px"><span class="tag blue">${j.status === "Scheduled" ? "Next up" : "Current job"}</span></div>` : ""}</div></div>`;
  }
  function drawRoute(tid, list) {
    const el = H.$("#route"); if (!el) return;
    const m = H.mkMap(el); if (!m) return;
    const t = T(tid), pts = [[A.BASES[0].lat, A.BASES[0].lng]];
    L.marker(pts[0], { icon: H.hqIcon("HQ") }).addTo(m);
    list.forEach((j, i) => { const c = C(j.clientId); pts.push([c.lat, c.lng]); L.marker([c.lat, c.lng], { icon: H.pinIcon(t.color, i + 1, j.status === "Completed" ? "done" : "") }).addTo(m); });
    L.polyline(pts, { color: t.color, weight: 3, opacity: .6, dashArray: "6 8" }).addTo(m);
    const ow = list.find(j => j.status === "On the way");
    if (ow) { const p = H.vanPos(ow); L.marker([p.lat, p.lng], { icon: H.vanIcon(t.color) }).addTo(m); }
    m.fitBounds(pts, { padding: [24, 24] });
  }

  /* ---------- one job ---------- */
  function jobView(tid, j) {
    const c = C(j.clientId), s = S();
    const flow = ["Scheduled", "On the way", "In progress", "Completed"], at = flow.indexOf(j.status);
    const done = j.checklist.filter(x => x.done).length;
    const stock = s.stock[tid];
    const nav = `https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`;
    const last = s.jobs.filter(x => x.clientId === c.id && x.status === "Completed" && x.id !== j.id && x.report).sort((a, b) => b.start.localeCompare(a.start))[0];
    const locked = j.status === "Scheduled" || j.status === "On the way";
    let action = "";
    if (j.status === "Scheduled") action = `<button class="btn primary lg block" data-act="onWay" data-id="${j.id}">${I("truck")} On my way</button>`;
    else if (j.status === "On the way") action = `<button class="btn primary lg block" data-act="arrive" data-id="${j.id}">${I("shield")} I've arrived: safety check</button>`;
    else if (j.status === "In progress") action = `<button class="btn ok lg block" data-act="finish" data-id="${j.id}">${I("check")} Complete job</button>`;
    H.after(() => { const cv = H.$("#sig"); if (cv) H.sigPad(cv); const mm = H.$("#jobmap"); if (mm) { const m = H.mkMap(mm, [c.lat, c.lng], 14); if (m) L.marker([c.lat, c.lng], { icon: H.pinIcon(T(tid).color, "") }).addTo(m); } });
    return `<button class="btn sm ghost" data-act="go" data-to="staff/${tid}/today" style="margin-bottom:8px">${I("left")} Today</button>
      <div class="fsec"><div class="row"><div class="grow"><div class="small muted">${j.id} · ${esc(j.type)}${j.start ? " · " + dayLabel(j.start) + " " + fmtTime(j.start) : ""}</div><h3 style="font-size:22px;margin-top:2px">${esc(c.name)}</h3></div>${j.priority === "Urgent" ? '<span class="tag red">Urgent</span>' : ""}</div>
        <div class="small" style="margin-top:4px">${esc(j.title)}</div><div class="small muted" style="margin-top:6px">${I("map")} ${esc(c.address)}</div>
        <div class="minimap" id="jobmap" style="height:140px;margin-top:10px"></div>
        <div class="grid" style="grid-template-columns:repeat(3,1fr);gap:6px;margin-top:10px"><a class="btn" href="${nav}" target="_blank" rel="noopener">${I("nav")} Directions</a><a class="btn" href="tel:${c.phone.replace(/\s/g, "")}">${I("phone")} Call</a><button class="btn" data-act="scan" data-id="${j.id}">${I("qr")} Scan gate</button></div></div>
      <div class="statusflow" style="grid-template-columns:repeat(4,1fr);margin-bottom:12px">${["Booked", "On the way", "On site", "Done"].map((f, i) => `<div class="st ${i === at ? "on" : i < at ? "past" : ""}">${f}</div>`).join("")}</div>
      ${j.notes ? `<div class="fsec"><h3>From the office</h3><div class="small">${esc(j.notes)}</div></div>` : ""}
      <div class="fsec"><h3>Gates on site</h3>${c.assets.map(a => `<div class="row" style="padding:6px 0;border-top:1px solid var(--line-2)"><span style="width:44px;color:var(--graph)">${H.gateSvg(H.assetType(a.kind))}</span><div class="grow small"><b>${esc(a.name)}</b><br><span class="muted">${esc(a.kind)} · ${a.last ? "last serviced " + fmtDay(a.last) : "no service record"}</span></div></div>`).join("") || '<div class="small muted">New site, nothing recorded yet</div>'}
        ${last ? `<div class="insight small" style="margin-top:8px"><b>Last visit ${fmtDay(last.start)} (${T(last.tech).short}).</b> ${esc(last.report)}</div>` : ""}</div>
      ${j.status === "Completed" ? doneView(j) : `
      <div class="fsec"><div class="row"><h3 class="grow">Safety check</h3>${j.safety ? '<span class="tag ok">Done</span>' : '<span class="tag">On arrival</span>'}</div><div class="small muted">${j.safety ? "Signed off before work started. Saved to the job." : "Required before work starts. You'll be asked when you tap I've arrived."}</div></div>
      <div class="fsec" style="${locked ? "opacity:.55" : ""}"><div class="row"><h3 class="grow">Checklist</h3><span class="small muted">${done}/${j.checklist.length}</span></div>
        ${j.checklist.map((x, i) => `<label class="check ${x.done ? "done" : ""}" style="margin-bottom:6px"><input type="checkbox" ${x.done ? "checked" : ""} ${locked ? "disabled" : ""} data-change="stCheck" data-id="${j.id}" data-i="${i}"><span>${esc(x.t)}</span></label>`).join("")}</div>
      <div class="fsec"><h3>Photos</h3><div class="photos">${j.photos.map(p => `<div class="ph" style="background-image:url(${p})"></div>`).join("")}<label class="add">${I("camera")}<span>Add photo</span><input type="file" accept="image/*" capture="environment" data-change="stPhoto" data-id="${j.id}"></label></div></div>
      <div class="fsec"><h3>Parts used</h3>${j.parts.map((pt, i) => `<div class="row small" style="padding:5px 0;border-top:1px solid var(--line-2)"><b>${pt.q} x</b><span class="grow">${esc(H.PART(pt.id).name)}</span><span>${money(H.PART(pt.id).price * pt.q)}</span><button class="btn sm ghost" data-act="stPartDel" data-id="${j.id}" data-i="${i}" aria-label="Remove">${I("x")}</button></div>`).join("")}
        <div class="row" style="margin-top:8px"><select class="inp grow" id="partSel">${A.PARTS.map(pt => `<option value="${pt.id}" ${stock[pt.id] ? "" : "disabled"}>${esc(pt.name)} (${stock[pt.id]} in van)</option>`).join("")}</select><button class="btn" data-act="stPart" data-id="${j.id}">${I("plus")} Add</button></div>
        <div class="small muted" style="margin-top:6px">Parts come off your van stock and go on the invoice.</div></div>
      <div class="fsec"><h3>Time on this job</h3><div class="row"><button class="btn" data-act="stLab" data-id="${j.id}" data-v="-0.5">-</button><b class="grow" style="text-align:center;font-family:var(--head);font-size:26px">${(j.labour || 0).toFixed(1)} h</b><button class="btn" data-act="stLab" data-id="${j.id}" data-v="0.5">+</button></div></div>
      <div class="fsec"><h3>Notes for the report</h3><textarea class="inp" data-input="stNotes" data-id="${j.id}" placeholder="What you found and what you fixed">${esc(j.notes || "")}</textarea></div>
      ${j.status === "In progress" ? `<div class="fsec"><h3>Client sign off</h3><input class="inp" id="sigName" placeholder="Client's name" value="${esc(c.contact)}" style="margin-bottom:8px"><canvas id="sig" class="sigpad"></canvas><div class="row" style="margin-top:6px"><span class="small muted grow">Sign with a finger</span><button class="btn sm ghost" data-act="sigClear">Clear</button></div></div>` : ""}
      <div class="bigact">${action}</div>`}`;
  }
  function doneView(j) {
    const inv = S().invoices.find(i => i.jobId === j.id);
    return `<div class="fsec" style="border-color:#BFE8D6;background:var(--ok-soft)"><div class="row"><span style="color:var(--ok)">${I("check")}</span><h3 class="grow">Job complete</h3><span class="small">${j.done ? fmtTime(j.done) : ""}</span></div>
      <div class="small" style="margin-top:6px">${esc(j.report || "")}</div>
      ${j.photos.length ? `<div class="photos" style="margin-top:10px">${j.photos.map(p => `<div class="ph" style="background-image:url(${p})"></div>`).join("")}</div>` : ""}
      ${j.signature ? `<div style="margin-top:10px"><img class="sigimg" src="${j.signature}" alt="Client signature"></div>` : ""}
      <div class="small" style="margin-top:8px">${inv ? `Invoice ${inv.id} for ${money2(inv.amount)} sent to the client.` : "Covered by the client's plan or the quote. No invoice needed."} Report emailed and in the client's portal.</div></div>`;
  }

  /* ---------- schedule, messages, timesheet ---------- */
  function schedule(tid) {
    const out = [];
    for (let off = 0; off < 8; off++) {
      const d = A.at(off, 0).slice(0, 10), list = tjobs(tid, d);
      if (!list.length && off) continue;
      out.push(`<h3 style="margin:14px 2px 8px">${dayLabel(d + "T00:00")} <span class="muted small">${list.length} jobs</span></h3>${list.map((j, i) => card(j, i, null)).join("") || '<div class="small muted">Nothing booked</div>'}`);
    }
    return out.join("");
  }
  function messages(tid) {
    const v = H.teamConvo(tid); v.staffUnread = false;
    H.after(() => { const m = H.$("#smsgs"); if (m) m.scrollTop = m.scrollHeight; });
    return `<div class="fsec" style="padding:0;overflow:hidden"><div class="card-h"><div class="row">${avatar("Simon Sperrin", "sm", "#D61D09")}<b>Office (Simon)</b></div></div>
      <div class="msgs" id="smsgs" style="height:calc(100vh - 380px);min-height:300px">${v.msgs.map(m => `<div class="bub ${m.from === "staff" ? "out" : "in"}">${esc(m.text)}<span class="meta">${esc(m.name || (m.from === "apex" ? "Simon" : T(tid).short))} · ${fmtTime(m.at)}</span></div>`).join("") || '<div class="empty">No messages yet</div>'}</div>
      <div class="compose"><textarea id="smsg" placeholder="Message the office"></textarea><div class="bar"><button class="btn sm" data-act="quickMsg" data-t="${tid}" data-m="Running about 15 minutes late.">Running late</button><button class="btn sm" data-act="quickMsg" data-t="${tid}" data-m="Need a part ordered for this job, details in the job notes.">Need a part</button><span class="grow"></span><button class="btn primary sm" data-act="staffSend" data-t="${tid}">${I("send")} Send</button></div></div></div>`;
  }
  function timeView(tid) {
    const s = S(), hist = s.hours[tid], td = H.hoursToday(tid), wk = hist.reduce((a, b) => a + b, 0) + td;
    const jobs = s.jobs.filter(j => j.tech === tid && j.start && H.isToday(j.start) && (j.labour || j.status === "Completed"));
    return `<div class="fsec"><div class="row"><div class="grow"><div class="small muted">This week</div><h3 style="font-size:30px">${wk.toFixed(1)} h</h3></div>${wk > 38 ? '<span class="tag warn">Overtime</span>' : '<span class="tag ok">On track</span>'}</div>
        <div class="grid" style="grid-template-columns:repeat(5,1fr);gap:6px;margin-top:10px">${["Mon", "Tue", "Wed", "Thu"].map((d, i) => `<div class="insight" style="padding:8px;text-align:center"><div class="small muted">${d}</div><b>${hist[i]}</b></div>`).join("")}<div class="insight" style="padding:8px;text-align:center;border-color:var(--red)"><div class="small muted">Today</div><b>${td.toFixed(1)}</b></div></div></div>
      <div class="fsec"><h3>Time on jobs today</h3>${jobs.map(j => `<div class="row small" style="padding:6px 0;border-top:1px solid var(--line-2)"><b>${j.id}</b><span class="grow ellipsis">${esc(C(j.clientId).name)}</span><b>${(j.labour || j.dur).toFixed(1)} h</b></div>`).join("") || '<div class="small muted">No job time yet</div>'}</div>
      <p class="small muted">Clock on and off times are saved with your location and go to the office for payroll.</p>`;
  }

  /* ---------- actions ---------- */
  X.staffSwitch = (d, el) => H.go(`staff/${el.value}/today`);
  X.clock = d => {
    const s = S(), st = s.clock[d.t];
    if (typeof st === "string") { s.clock[d.t] = { total: H.hoursToday(d.t) }; H.toast("Clocked off. Have a good night."); H.notify("ceo", `${T(d.t).short} clocked off`, "ceo/timesheets"); }
    else { const prev = st && st.total ? st.total : 0; const n = new Date(Date.now() - prev * 36e5); s.clock[d.t] = `${A.iso(n)}T${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`; H.toast("Clocked on"); H.notify("ceo", `${T(d.t).short} clocked on`, "ceo/timesheets"); }
    H.save(); H.render(true);
  };
  X.stNotice = d => { const n = S().notices.find(x => x.id === d.id); n.unread = false; H.save(); if (d.to) H.go(d.to); else H.render(true); };
  X.onWay = d => {
    const j = J(d.id);
    H.modal(H.mhead("On my way", "We'll text " + esc(C(j.clientId).contact) + " with your arrival time") + `<div class="mb"><label class="f">Arriving in about</label><div class="grid g4" style="gap:8px">${[10, 20, 30, 45].map(n => `<button class="btn lg" data-act="onWayGo" data-id="${j.id}" data-v="${n}">${n} min</button>`).join("")}</div>
      <p class="small muted">The client can watch your van on a map in their portal until you arrive.</p></div>`);
  };
  X.onWayGo = d => {
    const j = J(d.id), c = C(j.clientId), t = T(j.tech);
    j.status = "On the way"; j.eta = +d.v;
    H.textClient(c.id, `${t.short} from Apex Gates is on the way. Arriving in about ${d.v} minutes. Track the visit in your portal.`);
    H.notify("client:" + c.id, `${t.short} is on the way, arriving in about ${d.v} minutes`, `client/${c.id}/home`);
    H.notify("ceo", `${t.short} is on the way to ${c.name} (${d.v} min)`, "ceo/map");
    H.save(); H.closeModal(); H.render(true); H.toast(`${c.contact} has been texted your ETA`);
  };
  X.arrive = d => {
    H.modal(H.mhead(`${I("shield")} Safety check`, "Tick every item before you start work") + `<div class="mb stack">${A.SAFETY.map((x, i) => `<label class="check"><input type="checkbox" class="saf"><span>${esc(x)}</span></label>`).join("")}
      <label class="check"><input type="checkbox" class="saf"><span>No other hazards, or I've told the office about them</span></label></div>
      <div class="mf"><button class="btn" data-act="closeModal">Cancel</button><button class="btn primary" data-act="arriveGo" data-id="${d.id}">${I("check")} Start work</button></div>`);
  };
  X.arriveGo = d => {
    if (H.$$(".saf").some(x => !x.checked)) return H.toast("Tick every safety item first", "alert");
    const j = J(d.id), c = C(j.clientId);
    j.status = "In progress"; j.safety = A.SAFETY.map(() => true); j.eta = null; j.arrived = H.nowISO();
    H.notify("ceo", `${T(j.tech).short} arrived at ${c.name}. Safety check done.`, "ceo/jobs/" + j.id);
    H.notify("client:" + c.id, `${T(j.tech).short} has arrived`, `client/${c.id}/home`);
    H.save(); H.closeModal(); H.render(true); H.toast("Safety check saved. Job started.");
  };
  X.stCheck = (d, el) => { const j = J(d.id); j.checklist[+d.i].done = el.checked; H.save(); H.render(true); };
  X.stPhoto = (d, el) => { const f = el.files && el.files[0]; if (!f) return; H.readPhoto(f, url => { J(d.id).photos.push(url); H.save(); H.render(true); H.toast("Photo added to the job"); }); };
  X.stPart = d => { const j = J(d.id), id = H.$("#partSel").value, ex = j.parts.find(p => p.id === id); if (ex) ex.q++; else j.parts.push({ id, q: 1 }); H.save(); H.render(true); };
  X.stPartDel = d => { J(d.id).parts.splice(+d.i, 1); H.save(); H.render(true); };
  X.stLab = d => { const j = J(d.id); j.labour = Math.max(0, (j.labour || 0) + +d.v); H.save(); H.render(true); };
  X.stNotes = (d, el) => { J(d.id).notes = el.value; clearTimeout(X._sn); X._sn = setTimeout(H.save, 400); };
  X.sigClear = () => { const c = H.$("#sig"); c.getContext("2d").clearRect(0, 0, c.width, c.height); delete c.dataset.signed; };
  X.finish = d => {
    const j = J(d.id), sig = H.sigData(H.$("#sig"));
    if (!sig) { H.$("#sig").scrollIntoView({ behavior: "smooth", block: "center" }); return H.toast("Get the client to sign first", "alert"); }
    const left = j.checklist.filter(x => !x.done).length;
    if (left && !confirm(`${left} checklist items aren't ticked. Complete anyway?`)) return;
    j.signature = sig; j.signedBy = H.$("#sigName").value;
    if (!j.labour) j.labour = j.dur;
    const inv = H.completeJob(j);
    H.save(); H.render(true); window.scrollTo(0, 0);
    H.toast(inv ? `Done. Report and invoice ${inv.id} sent to the client.` : "Done. Report sent to the client.");
  };
  X.scan = d => {
    const j = J(d.id), c = C(j.clientId);
    if (!c.assets.length) return H.toast("No gates registered at this site yet", "alert");
    const a = c.assets[0];
    H.modal(H.mhead(`${I("qr")} Scanned: ${esc(a.name)}`, esc(c.name)) + `<div class="mb"><div class="row"><span style="width:70px;color:var(--graph)">${H.gateSvg(H.assetType(a.kind))}</span><div class="kv grow"><span>Model</span><span>${esc(a.kind)}</span><span>Installed</span><span>${a.installed}</span><span>Warranty</span><span>${esc(a.warranty)}</span></div></div>
      <h3 style="margin-top:12px">History</h3>${S().jobs.filter(x => x.clientId === c.id && x.status === "Completed").map(x => `<div class="small" style="padding:6px 0;border-top:1px solid var(--line-2)"><b>${fmtDay(x.start)}</b> ${esc(x.title)}${x.report ? `<div class="muted">${esc(x.report)}</div>` : ""}</div>`).join("") || '<div class="small muted">No visits yet</div>'}</div>`);
  };
  X.quickMsg = d => { H.$("#smsg").value = d.m; X.staffSend(d); };
  X.staffSend = d => {
    const t = H.$("#smsg").value.trim(); if (!t) return;
    const v = H.teamConvo(d.t);
    H.pushMsg(v, { from: "staff", name: T(d.t).short, text: t }, true);
    H.notify("ceo", `${T(d.t).short}: ${t.slice(0, 70)}`, "ceo/inbox/" + v.id);
    H.save(); H.render(true); H.toast("Sent to the office");
  };
})();
