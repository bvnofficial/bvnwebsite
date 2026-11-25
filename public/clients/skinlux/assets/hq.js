// Skinlux HQ: the owner app shell around the dashboard (11-dashboard.html).
// Inbox, Today, Clients, Leads, Workflows, Reviews, Team and Connections.
// Every name and number here is SAMPLE data for the demo.
(function () {
  "use strict";
  var S = window.SKINLUX;
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function money(n) { return "$" + Math.round(n).toLocaleString("en-AU"); }
  function toast(msg) {
    var t = $("toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("show"); }, 3400);
  }
  function clinic() { var b = document.querySelector("#segClinic button.on"); return b ? b.getAttribute("data-v") : "both"; }
  function inClinic(c) { var k = clinic(); return k === "both" || c === "both" || c === k; }
  function clinicsList() { var k = clinic(); return k === "both" ? ["booragoon", "leederville"] : [k]; }
  function LOC(c) { return c === "both" ? "Both clinics" : S.locations[c].name; }
  function sc(n) { var k = clinic(); return k === "both" ? n : Math.round(n * (k === "booragoon" ? 0.67 : 0.33)); }
  function initials(n) {
    if (/^\d/.test(n)) return "#";
    return n.replace(/^@/, "").split(/[ .]/).filter(Boolean).slice(0, 2).map(function (w) { return w[0].toUpperCase(); }).join("");
  }

  var ICONS = {
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    inbox: '<path d="M3 13l3-8h12l3 8v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M3 13h5l1 3h6l1-3h5"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    users: '<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-6 7-6s7 2 7 6"/><path d="M16 4a4 4 0 0 1 0 8M22 21c0-3-2-5-4-5.6"/>',
    leads: '<path d="M3 4h18l-7 9v6l-4 2v-8z"/>',
    flow: '<circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M6 9v3a3 3 0 0 0 3 3h6"/>',
    team: '<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    star: '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
    plug: '<path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>'
  };
  function I(n, s) {
    s = s || 18;
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[n] + "</svg>";
  }

  // Channels: label, colour, send button text
  var CH = {
    sms: ["SMS", "#4f8a6b", "Send SMS"],
    wa: ["WhatsApp", "#2f9e5b", "Send WhatsApp"],
    ig: ["Instagram", "#b8457c", "Send on Instagram"],
    fb: ["Facebook", "#3d6cc9", "Send on Messenger"],
    email: ["Email", "#7a6455", "Send email"],
    web: ["Website chat", "#b8925a", "Reply in chat"],
    scan: ["Skin Check", "#8a6a3a", "Send SMS"],
    review: ["Google review", "#c08a2e", "Post reply on Google"]
  };

  var SAFE_INJ = "Thanks for asking. Pricing for cosmetic injectables is given at a free consultation with one of our registered nurses, so it's matched to you. Would you like a consult time?";

  var CONVOS = [
    { id: "c1", name: "Hannah Lee", ch: "wa", clinic: "booragoon", at: "9:42am", unread: true, nurse: true, inj: true, paused: true,
      assigned: "Nurse Leo", phone: "0433 019 884", wf: "Workflow 2: paused for a nurse",
      msgs: [
        { f: "sys", t: "Thu: wrinkle relaxers with Nurse Leo. Staff app tap sent the aftercare." },
        { f: "bot", t: "Hi Hannah, it's Skinlux. Just checking in two days after your treatment. How are you feeling? Any questions, reply here.", at: "Sat 9:00am" },
        { f: "them", t: "Hi! A bit more swelling on one side than I expected. Is that ok?", at: "9:42am" },
        { f: "sys", t: "Flagged for a nurse (swelling). Every other message to Hannah is paused." }],
      draft: "Hi Hannah, thanks for letting us know. Some swelling can happen in the first few days. Nurse Leo would like to take a quick look. Could you send a photo here, or can we call you this afternoon?" },
    { id: "c5", name: "Sarah Ng", ch: "scan", clinic: "booragoon", at: "2:21pm", unread: true, assigned: "Sharon Kim", phone: "0402 118 337",
      wf: "Skin Check lead: call within 15 minutes",
      msgs: [
        { f: "sys", t: "Did the AI Skin Check from the Meta HIFU ad. Score 64. Focus: redness, even tone, clear pores. Downtime: none." },
        { f: "bot", t: "Hi Sarah, here's your Skinlux 12 week plan: LED, Carbon Laser and Clinical Peels, from $3,320, with a home routine. Book your first session: skinlux.au/plan/sn64", at: "2:20pm" },
        { f: "sys", t: "Alert sent to Booragoon: call Sarah within 15 minutes." }],
      draft: "Hi Sarah, it's Sharon from Skinlux Booragoon. I've had a look at your skin plan. Can I give you a quick call to talk through your first session?" },
    { id: "c2", name: "Chloe Bennett", ch: "sms", clinic: "booragoon", at: "1:58pm", unread: true, assigned: "Sharon Kim", phone: "0412 554 210",
      wf: "Workflow 1: abandoned booking, step 3",
      msgs: [
        { f: "sys", t: "Tue: started the HIFU double chin offer in Timely and left at the $50 deposit." },
        { f: "bot", t: "Hi Chloe, still keen on your HIFU double chin session? Your $50 deposit comes off the treatment price. Finish booking here: skinlux.au/b/hifu", at: "Fri 9:00am" },
        { f: "them", t: "Is the deposit refundable if I need to move it?", at: "1:58pm" }],
      draft: "Hi Chloe, you can move your booking up to 48 hours before at no cost, and the deposit moves with it. Want me to hold Thursday 6pm at Booragoon for you?" },
    { id: "c3", name: "@jess.glow", ch: "ig", clinic: "leederville", at: "1:31pm", unread: true, inj: true, assigned: "Nurse Maria", phone: "Instagram DM",
      wf: "Injectable question: compliance check on",
      msgs: [
        { f: "them", t: "How much is Botox?", at: "1:30pm" },
        { f: "them", t: "Do you have anything Saturday morning?", at: "1:31pm" }],
      draft: "Hi Jess, thanks for asking. Pricing for cosmetic injectables is given at a free consultation with one of our registered nurses, so it's matched to you. Nurse Maria has Saturday 9:30am or 11am at Leederville. Which suits you?" },
    { id: "c4", name: "Priya Sharma", ch: "fb", clinic: "leederville", at: "12:47pm", unread: true, assigned: "", phone: "0447 302 118", wf: "New lead",
      msgs: [{ f: "them", t: "Hi, do you have Saturday spots for the $247 carbon laser offer in Leederville?", at: "12:47pm" }],
      draft: "Hi Priya, yes. We have Saturday 10am and 2:30pm at Leederville for the carbon laser offer (face, LED and consult, $247). There are 7 spots left this month. Which time would you like?" },
    { id: "c9", name: "Mia Robinson", ch: "sms", clinic: "leederville", at: "10:22am", unread: false, assigned: "Shakira Hewitt", phone: "0420 776 315", wf: "Workflow 4: no rebooking",
      msgs: [
        { f: "bot", t: "Hi Mia, you're due for IPL session 6 of 10. Keeping to every 4 weeks gets the best result. Book here: skinlux.au/b/ipl", at: "Wed 9:00am" },
        { f: "them", t: "Can I do Thursday after 5?", at: "10:22am" }],
      draft: "Hi Mia, Thursday 5:30pm at Leederville is free. Shall I book it for you?" },
    { id: "c6", name: "Ava Mitchell", ch: "review", clinic: "booragoon", at: "8:12am", unread: false, assigned: "Sharon Kim", phone: "0438 661 205", wf: "Review reply due today",
      msgs: [{ f: "them", t: "3 stars. The treatment was lovely but I waited 20 minutes past my time.", at: "8:12am" }],
      draft: "Hi Ava, thank you for the honest review, and sorry about the wait. That's not the visit we want for you. We'd love to have you back, and your next visit comes with a complimentary LED add on. Jellie, Skinlux" },
    { id: "c12", name: "Ruby Patel", ch: "web", clinic: "booragoon", at: "Sun", unread: false, assigned: "Sharon Kim", phone: "0431 220 784", wf: "Website chat: call back requested",
      msgs: [
        { f: "them", t: "Is HIFU painful? I saw the double chin offer.", at: "Sun 10:41pm" },
        { f: "them", t: "Can someone call me tomorrow? 0431 220 784", at: "Sun 10:42pm" },
        { f: "sys", t: "Arrived after hours. Task created for Sharon to call Ruby on Monday morning." }],
      draft: "Hi Ruby, it's Sharon from Skinlux Booragoon. Most clients feel warm prickles in a few spots, and it's over in 45 to 60 minutes with no downtime. Is now a good time for a quick call about the double chin offer?" },
    { id: "c8", name: "Grace Nguyen", ch: "sms", clinic: "leederville", at: "Fri", unread: false, nurse: true, paused: true, assigned: "Nurse Maria", phone: "0416 302 947", wf: "Workflow 2: paused for a nurse",
      msgs: [
        { f: "sys", t: "Wed: skin needling with Nurse Maria." },
        { f: "bot", t: "Hi Grace, how is your skin feeling after needling?", at: "Fri 9:00am" },
        { f: "them", t: "Still quite red, is that normal?", at: "Fri 6:15pm" }],
      draft: "Hi Grace, redness for 2 to 3 days after needling is normal. Keep using the gentle cleanser and SPF, and skip makeup and retinol for now. If it isn't settling by tomorrow, send us a photo and I'll take a look. Maria" },
    { id: "c10", name: "Olivia Tran", ch: "email", clinic: "booragoon", at: "Sun", unread: false, assigned: "Jellie", phone: "0401 228 760", wf: "Workflow 3: product, day 90",
      msgs: [
        { f: "bot", t: "Subject: How's your Crystal Retinal going?\n\nHi Olivia, it's been about 3 months with Medik8 Crystal Retinal 3. How is your skin feeling?", at: "Sat" },
        { f: "them", t: "Loving it! Should I move up to the 6 now?", at: "Sun 4:10pm" }],
      draft: "Hi Olivia, so glad it's working. If your skin has had no irritation for a month, stepping up to Crystal Retinal 6 makes sense. I'll put one aside at Booragoon for you. Jellie" },
    { id: "c11", name: "Isla Carter", ch: "wa", clinic: "leederville", at: "Sat", unread: false, assigned: "Shakira Hewitt", phone: "0422 940 113", wf: "Workflow 1: existing client",
      msgs: [
        { f: "sys", t: "Wed: started a carbon laser booking online and stopped. Has 2 package sessions left." },
        { f: "bot", t: "Hi Isla, you still have 2 carbon laser sessions in your package. Reply here and we'll book one for you.", at: "Fri" },
        { f: "them", t: "Oh yes please! Any time Saturday", at: "Sat 9:20am" }],
      draft: "Hi Isla, Saturday 11:30am at Leederville is yours, booked from your package. See you then!" }
  ];

  var CLIENTS = [
    { name: "Hannah Lee", clinic: "booragoon", phone: "0433 019 884", since: "Mar 2025", visits: 7, spend: 2140, points: 860,
      last: "Thu 19 Nov, wrinkle relaxers", next: "Not booked", tags: ["injectables", "nurse-check", "vip"], forms: "Consent signed 19 Nov",
      products: ["Mesoestetic SPF 50"], history: ["19 Nov: wrinkle relaxers, Nurse Leo", "2 Sep: Bright & Tight, Sharon", "14 Aug: wrinkle relaxers, Nurse Leo"] },
    { name: "Sarah Ng", clinic: "booragoon", phone: "0402 118 337", since: "New today", visits: 0, spend: 0, points: 0,
      last: "No visits yet", next: "Not booked", tags: ["skin-check", "score-64", "focus-redness", "meta-ad"], forms: "Not sent yet",
      products: [], history: ["Today 2:20pm: AI Skin Check from the Meta HIFU ad"] },
    { name: "Chloe Bennett", clinic: "booragoon", phone: "0412 554 210", since: "New", visits: 0, spend: 0, points: 0,
      last: "No visits yet", next: "Not booked", tags: ["new-client", "abandoned-booking", "interest-hifu"], forms: "Not sent yet",
      products: [], history: ["Tue: left the HIFU offer at the deposit step", "Tue to Fri: abandoned booking emails 1 to 3"] },
    { name: "Ava Mitchell", clinic: "booragoon", phone: "0438 661 205", since: "Jan 2026", visits: 5, spend: 1260, points: 520,
      last: "Sat 21 Nov, Bright & Tight", next: "Tue 15 Dec, Bright & Tight", tags: ["bright-tight", "review-3-star"], forms: "Up to date",
      products: ["O Cosmedics Mild Cleanser"], history: ["21 Nov: Bright & Tight, Sharon", "24 Oct: Bright & Tight, Sharon"] },
    { name: "Olivia Tran", clinic: "booragoon", phone: "0401 228 760", since: "Jun 2024", visits: 9, spend: 1890, points: 1120,
      last: "Mon 24 Aug, advanced consult", next: "Today 10:00am, advanced consult", tags: ["retail", "medik8", "vip"], forms: "Up to date",
      products: ["Medik8 Crystal Retinal 3", "Medik8 C-Tetra"], history: ["24 Aug: bought Crystal Retinal 3", "24 Aug: advanced consult, Jellie"] },
    { name: "Emma Walsh", clinic: "booragoon", phone: "0412 345 678", since: "Feb 2026", visits: 6, spend: 1340, points: 1240,
      last: "Today 9:00am, IPL underarms 4 of 8", next: "Fri 11 Dec, IPL underarms", tags: ["ipl-hair", "course"], forms: "Up to date",
      course: { label: "IPL underarms", done: 4, total: 8 }, products: [], history: ["Today: IPL underarms 4 of 8, Sharon", "28 Oct: IPL underarms 3 of 8"] },
    { name: "Ruby Anderson", clinic: "booragoon", phone: "0451 883 470", since: "Nov 2024", visits: 4, spend: 0, points: 300,
      last: "Wed 5 Aug, injectable", next: "Review due Thu 26 Nov", tags: ["injectables", "overdue-rebook"], forms: "Up to date",
      products: [], history: ["5 Aug: injectable treatment, Nurse Leo"] },
    { name: "Zoe Harris", clinic: "booragoon", phone: "0417 265 038", since: "Apr 2025", visits: 8, spend: 1610, points: 940,
      last: "Today 10:00am, Bright & Tight", next: "Mon 21 Dec, Bright & Tight", tags: ["retail", "bright-tight"], forms: "Up to date",
      products: ["Mesoestetic SPF 50"], history: ["Today: Bright & Tight, Sharon", "22 Sep: bought SPF 50"] },
    { name: "Priya Sharma", clinic: "leederville", phone: "0447 302 118", since: "New", visits: 0, spend: 0, points: 0,
      last: "No visits yet", next: "Not booked", tags: ["facebook", "interest-carbon"], forms: "Not sent yet", products: [], history: ["Today 12:47pm: Facebook message about the carbon laser offer"] },
    { name: "Grace Nguyen", clinic: "leederville", phone: "0416 302 947", since: "Sep 2026", visits: 3, spend: 1185, points: 410,
      last: "Wed 18 Nov, skin needling 1 of 3", next: "Wed 16 Dec, skin needling 2 of 3", tags: ["needling", "course", "nurse-check"], forms: "Up to date",
      course: { label: "Skin needling pack of 3", done: 1, total: 3 }, products: ["O Cosmedics Mild Cleanser"], history: ["18 Nov: skin needling 1 of 3, Nurse Maria", "30 Sep: Clinical Peel and LED"] },
    { name: "Mia Robinson", clinic: "leederville", phone: "0420 776 315", since: "Mar 2026", visits: 5, spend: 600, points: 380,
      last: "Mon 26 Oct, IPL Brazilian 5 of 10", next: "Not booked", tags: ["ipl-hair", "course", "overdue-rebook"], forms: "Up to date",
      course: { label: "IPL Brazilian", done: 5, total: 10 }, products: [], history: ["26 Oct: IPL Brazilian 5 of 10, Shakira", "28 Sep: IPL Brazilian 4 of 10"] },
    { name: "Isla Carter", clinic: "leederville", phone: "0422 940 113", since: "Jul 2026", visits: 4, spend: 1380, points: 600,
      last: "Thu 22 Oct, carbon laser 4 of 6", next: "Not booked", tags: ["package", "carbon", "overdue-rebook"], forms: "Up to date",
      course: { label: "Carbon laser package", done: 4, total: 6 }, products: [], history: ["22 Oct: carbon laser 4 of 6, Shakira"] },
    { name: "Sophie Clarke", clinic: "leederville", phone: "0409 117 562", since: "Oct 2026", visits: 3, spend: 585, points: 200,
      last: "Sat 7 Nov, Diamond Polar 3 of 8", next: "Not booked", tags: ["diamond-polar", "course", "overdue-rebook"], forms: "Up to date",
      course: { label: "Diamond Polar RF", done: 3, total: 8 }, products: [], history: ["7 Nov: Diamond Polar 3 of 8, Shakira"] }
  ];
  function findClient(n) { return CLIENTS.filter(function (c) { return c.name === n; })[0]; }

  // Today's Timely diary. Now is 2:40pm.
  var DIARY = {
    booragoon: { hours: "Open 9am to 9pm today", staff: ["Sharon Kim", "Jellie", "Nurse Leo"], appts: [
      { s: "Sharon Kim", t: "9:00am", n: "Emma Walsh", tr: "IPL underarms 4 of 8", st: "done", v: 75 },
      { s: "Sharon Kim", t: "10:00am", n: "Zoe Harris", tr: "Bright & Tight", st: "done", v: 295 },
      { s: "Sharon Kim", t: "11:30am", n: "Kate Morris", tr: "HIFU double chin (offer)", st: "notap", v: 174 },
      { s: "Sharon Kim", t: "2:00pm", n: "Amy Lewis", tr: "Carbon Laser", st: "inroom", v: 460 },
      { s: "Sharon Kim", t: "3:30pm", n: "Rachel Kim", tr: "Skin needling", st: "upcoming", v: 330 },
      { s: "Sharon Kim", t: "5:00pm", n: "Tara Singh", tr: "Diamond Polar RF 2 of 8", st: "upcoming", v: 195 },
      { s: "Jellie", t: "10:00am", n: "Olivia Tran", tr: "Advanced consult", st: "done", v: 100 },
      { s: "Jellie", t: "12:00pm", n: "Bella Rossi", tr: "Clinical Peel and LED", st: "done", v: 220 },
      { s: "Jellie", t: "3:00pm", n: "Nina Patel", tr: "HIFU full face and neck", st: "deposit", v: 1800 },
      { s: "Jellie", t: "6:00pm", n: "Laura Chen", tr: "Plasma Fibroblast", st: "upcoming", v: 400 },
      { s: "Nurse Leo", t: "9:30am", n: "Megan Ford", tr: "Injectable review", st: "done", v: 0 },
      { s: "Nurse Leo", t: "11:00am", n: "Jade Wilson", tr: "Wrinkle relaxers", st: "done", v: 0 },
      { s: "Nurse Leo", t: "2:15pm", n: "Holly Grant", tr: "Bio stimulating injection 2 of 4", st: "inroom", v: 0 },
      { s: "Nurse Leo", t: "4:00pm", n: "", tr: "HIFU, 60 min", st: "free", v: 0 },
      { s: "Nurse Leo", t: "7:00pm", n: "Kim Tran", tr: "Nurse consultation", st: "upcoming", v: 0 }] },
    leederville: { hours: "Open 10am to 5pm today", staff: ["Shakira Hewitt", "Nurse Maria"], appts: [
      { s: "Shakira Hewitt", t: "10:00am", n: "Laura Price", tr: "IPL full legs 7 of 10", st: "done", v: 259 },
      { s: "Shakira Hewitt", t: "11:00am", n: "Tom Reid", tr: "Men's beard IPL", st: "done", v: 199 },
      { s: "Shakira Hewitt", t: "12:30pm", n: "Isabel Moore", tr: "Carbon Laser (offer)", st: "notap", v: 247 },
      { s: "Shakira Hewitt", t: "2:30pm", n: "Chen Li", tr: "Clinical Peel and LED", st: "inroom", v: 220 },
      { s: "Shakira Hewitt", t: "4:00pm", n: "", tr: "Carbon Laser, 60 min", st: "free", v: 0 },
      { s: "Nurse Maria", t: "10:30am", n: "Sienna Hall", tr: "Fillers", st: "done", v: 0 },
      { s: "Nurse Maria", t: "1:00pm", n: "Grace Bell", tr: "Skin needling with exosomes", st: "done", v: 720 },
      { s: "Nurse Maria", t: "3:00pm", n: "Erin Walsh", tr: "Nurse consultation", st: "upcoming", v: 0 },
      { s: "Nurse Maria", t: "4:15pm", n: "Pia Novak", tr: "Wrinkle relaxers review", st: "upcoming", v: 0 }] }
  };
  var ST = {
    done: ["Done, aftercare sent", "ok"], notap: ["Finished, no tap yet", "warn"], inroom: ["In the room", "gold"],
    upcoming: ["Booked", ""], deposit: ["Deposit not paid", "bad"], free: ["Free slot", ""]
  };
  function todayIssues() {
    var out = [];
    clinicsList().forEach(function (c) {
      DIARY[c].appts.forEach(function (a) { if ((a.st === "notap" && !a.sent) || (a.st === "deposit" && !a.sent)) out.push({ c: c, a: a }); });
    });
    return out;
  }

  var STAGES = ["New", "Contacted", "Consult booked", "Booked", "Lost"];
  var LEADS = [
    { n: "Sarah Ng", src: "Skin Check", i: "12 week plan", c: "booragoon", s: 0, age: "20 min", v: 3320, cv: "c5" },
    { n: "Priya Sharma", src: "Facebook", i: "Carbon laser offer", c: "leederville", s: 0, age: "2 hrs", v: 247, cv: "c4" },
    { n: "Zoe Clarke", src: "Offer page", i: "IPL full legs", c: "leederville", s: 0, age: "3 hrs", v: 2072 },
    { n: "Ruby Patel", src: "Website chat", i: "HIFU double chin", c: "booragoon", s: 0, age: "16 hrs", v: 174, cv: "c12" },
    { n: "Kate Lowe", src: "Meta ad", i: "HIFU double chin", c: "booragoon", s: 1, age: "Today", v: 174 },
    { n: "Chloe Bennett", src: "Abandoned booking", i: "HIFU double chin", c: "booragoon", s: 1, age: "6 days", v: 174, cv: "c2" },
    { n: "@jess.glow", src: "Instagram", i: "Injectables consult", c: "leederville", s: 1, age: "Today", v: 0, inj: true, cv: "c3" },
    { n: "Ella Martin", src: "Abandoned booking", i: "Advanced consult", c: "leederville", s: 2, age: "4 days", v: 100 },
    { n: "Tara Singh", src: "Treatment quiz", i: "Diamond Polar course", c: "booragoon", s: 3, age: "Last week", v: 1560 },
    { n: "Amy Lewis", src: "Google", i: "Carbon Laser", c: "booragoon", s: 3, age: "Last week", v: 460 },
    { n: "Nina Patel", src: "Skin Check", i: "HIFU full face and neck", c: "booragoon", s: 3, age: "Fri", v: 1800 },
    { n: "Hayley Cox", src: "Meta ad", i: "EMS body sculpting", c: "booragoon", s: 4, age: "2 weeks", v: 147 }
  ];
  var SOURCES = [["Meta ads", 58, 21], ["Skin Check", 41, 17], ["Instagram", 33, 9], ["Website chat", 29, 11], ["Google", 24, 12], ["Offer pages", 18, 8], ["Treatment quiz", 15, 6], ["Facebook", 12, 3]];

  var FLOWS = [
    { n: "1. Abandoned booking", on: true, now: 23, a: [67, "came in"], b: [16, "booked after all"], c: ["$12,810", "recovered"],
      log: ["2:31pm: email 1 sent to Kate Lowe", "1:58pm: Chloe Bennett replied, task for Sharon", "12:05pm: Jess Moore booked, workflow stopped"] },
    { n: "2. Completed appointment", on: true, now: 148, a: [469, "check ins sent"], b: [107, "replies"], c: [73, "Google reviews"],
      log: ["2:20pm: Nurse Leo tapped done for Jade Wilson, aftercare sent", "9:42am: Hannah Lee flagged for a nurse, paused", "9:00am: 31 day 2 check ins sent"] },
    { n: "3. Product sales", on: true, now: 205, a: ["$14,070", "product sales"], b: [90, "reorder reminders"], c: ["37%", "buy again at 3 months"],
      log: ["Sun: Olivia Tran asked about stepping up her retinal", "Sat: 12 how to use emails sent"] },
    { n: "4. No rebooking", on: true, now: 61, a: [61, "overdue now"], b: [22, "rebooked after a reminder"], c: ["62%", "rebook rate"],
      log: ["10:22am: Mia Robinson replied, wants Thursday after 5", "9:00am: 14 reminders sent"] },
    { n: "AI Skin Check follow up", on: true, now: 14, a: [41, "scans"], b: [17, "booked"], c: ["$21,400", "in plans booked"],
      log: ["2:20pm: Sarah Ng scanned, alert sent to Booragoon", "Fri: Nina Patel booked HIFU from her plan"] },
    { n: "New lead: call within 15 minutes", on: true, now: 4, a: [230, "leads this month"], b: ["11 min", "average time to first call"], c: [87, "booked"],
      log: ["2:21pm: Sarah Ng from the Skin Check, Sharon alerted", "12:47pm: Priya Sharma from Facebook, unassigned"] },
    { n: "Waitlist slot filler", on: true, now: 2, a: [9, "cancellations this week"], b: [7, "slots filled"], c: ["$2,140", "kept in the diary"],
      log: ["1:10pm: Leederville 3pm cancelled, 6 waitlist clients texted", "1:14pm: Grace Bell took the slot"] }
  ];

  var REVIEWS = [
    { n: "Ava Mitchell", c: "booragoon", s: 3, t: "The treatment was lovely but I waited 20 minutes past my time.", at: "Today 8:12am", replied: false, cv: "c6",
      draft: "Hi Ava, thank you for the honest review, and sorry about the wait. That's not the visit we want for you. We'd love to have you back, and your next visit comes with a complimentary LED add on. Jellie, Skinlux" },
    { n: "Megan F.", c: "booragoon", s: 5, t: "Nurse Leo is so gentle and explains everything. Wouldn't go anywhere else.", at: "Yesterday", replied: false,
      draft: "Thank you Megan! We'll pass this on to Leo. See you at your next review. Jellie, Skinlux" },
    { n: "Tom R.", c: "leederville", s: 4, t: "Great beard IPL and friendly team. Parking on Vincent St is tricky.", at: "Sat", replied: false,
      draft: "Thanks Tom! Good tip on parking. There's usually space in the Oxford St car park, a two minute walk away. See you next session. Jellie, Skinlux" },
    { n: "Laura P.", c: "leederville", s: 5, t: "Shakira did my IPL and it's the most comfortable it has ever been.", at: "Fri", replied: true, reply: "Thank you Laura! Shakira will be so happy to hear that." },
    { n: "Bella R.", c: "booragoon", s: 5, t: "Love my carbon laser glow. Sharon is the best.", at: "Thu", replied: true, reply: "Thanks Bella! See you at your next one." }
  ];

  var TEAM = [
    { n: "Jellie", c: "both", appts: 4, rebook: 71, retail: 3120, rev: 9 },
    { n: "Sharon Kim", c: "booragoon", appts: 6, rebook: 68, retail: 4380, rev: 14 },
    { n: "Nurse Leo", c: "booragoon", appts: 5, rebook: 74, retail: 820, rev: 11 },
    { n: "Shakira Hewitt", c: "leederville", appts: 5, rebook: 59, retail: 2210, rev: 8 },
    { n: "Nurse Maria", c: "leederville", appts: 4, rebook: 66, retail: 640, rev: 6 }
  ];

  var STOCK = [
    { n: "Carbon laser cream", c: "booragoon", left: 2, min: 6 },
    { n: "Medik8 C-Tetra", c: "leederville", left: 3, min: 8 },
    { n: "Mesoestetic SPF 50", c: "booragoon", left: 4, min: 10 }
  ];

  // Live mode: the live page (/clients/skinlux/hq) sets window.SKINLUX_HQ_LIVE from
  // /api/skinlux-hq before this script runs. Then real GoHighLevel data replaces
  // the samples, and anything without a live source yet shows empty.
  var LIVE = window.SKINLUX_HQ_LIVE || null;
  if (LIVE) {
    CONVOS = LIVE.convos || []; CLIENTS = LIVE.clients || []; LEADS = LIVE.leads || [];
    FLOWS = LIVE.flows || []; SOURCES = LIVE.sources || []; REVIEWS = []; TEAM = [];
    STOCK = (LIVE.stock || []).filter(function (x) { return x.left !== null && x.left <= x.min; }).map(function (x) { return { n: x.n, c: x.c, left: x.left, min: x.min, ordered: x.order > 0 }; });
    LIVE.events = LIVE.events || []; LIVE.tasks = LIVE.tasks || []; LIVE.intake = LIVE.intake || [];
    var noDiary = { hours: "The diary fills in once the Timely link is on", staff: [], appts: [] };
    DIARY = { booragoon: noDiary, leederville: { hours: noDiary.hours, staff: [], appts: [] } };
  }

  // live helpers: the event log (staff app, forms, shop, leads) by clinic and period
  function perthDay(t) { return new Date(t + 8 * 3600000).toISOString().slice(0, 10); }
  function evs(kind, days, extra) {
    var since = days === 0 ? Date.parse(perthDay(Date.now()) + "T00:00:00+08:00") : Date.now() - days * 86400000;
    return ((LIVE && LIVE.events) || []).filter(function (e) { return e.at >= since && inClinic(e.c) && (!kind || e.k === kind) && (!extra || extra(e)); });
  }
  function sumV(list) { return list.reduce(function (a, e) { return a + (e.v || 0); }, 0); }
  function hm(t) { return new Date(t).toLocaleTimeString("en-AU", { timeZone: "Australia/Perth", hour: "numeric", minute: "2-digit" }); }
  function agoTxt(t) { var m = Math.round((Date.now() - t) / 60000); if (m < 60) return Math.max(1, m) + " min ago"; var h = Math.round(m / 60); if (h < 24) return h + " hrs ago"; var d = Math.round(h / 24); return d === 1 ? "yesterday" : d + " days ago"; }
  var EVTXT = { treatment_done: "Treatment done", product_sold: "Product sold", new_lead: "New lead", incomplete_booking: "Didn't finish booking", booking_made: "Booked", intake: "Intake form", waitlist: "Joined the waitlist", client_app: "Client app" };
  function liveTasks() { return ((LIVE && LIVE.tasks) || []).filter(function (t) { return inClinic(t.clinic); }); }
  function intakeOpen() { return ((LIVE && LIVE.intake) || []).filter(function (f) { return inClinic(f.c) && !f.cleared; }); }
  var ui_np = "month";

  var ui = { view: "overview", convo: LIVE ? (CONVOS[0] ? CONVOS[0].id : "") : "c1", ibf: "all", ibch: "", q: "", cf: "all", warn: null, read: {} };

  var NAV = [["grp", "Run the day"], ["overview", "Overview", "home"], ["inbox", "Inbox", "inbox"], ["today", "Today", "cal"], ["clients", "Clients", "users"],
    ["grp", "Grow"], ["leads", "Leads", "leads"], ["flows", "Workflows", "flow"], ["reviews", "Reviews", "star"], ["apps", "Apps", "grid"],
    ["grp", "Team and setup"], ["team", "Team", "team"], ["connections", "Connections", "plug"]];
  var TITLES = { overview: "Overview", inbox: "Inbox", today: "Today", clients: "Clients", leads: "Leads", flows: "Workflows", reviews: "Reviews", apps: "Apps", team: "Team", connections: "Connections" };
  var SUBS = {
    overview: "Both clinics, every number, one screen",
    inbox: "Every SMS, WhatsApp, Instagram, Facebook, email, chat and review in one place",
    today: LIVE ? "Today at both clinics, from the staff app, forms and waitlist. " + new Date().toLocaleDateString("en-AU", { timeZone: "Australia/Perth", weekday: "long", day: "numeric", month: "long" }) : "Today's Timely diary, live. Monday 23 November, 2:40pm",
    clients: "Every client from Timely, with history, courses, products and tags",
    leads: "Every new enquiry from ads, the Skin Check, offer pages, the quiz and chat",
    flows: "Your automations, running live",
    reviews: "Google reviews for both clinics",
    apps: "Every Skinlux app, live, in one place",
    team: "Who is doing what today",
    connections: "Everything Skinlux HQ is connected to"
  };

  function openConvos() { return CONVOS.filter(function (v) { return inClinic(v.clinic) && v.status !== "done"; }); }
  function counts() {
    return {
      inbox: openConvos().filter(function (v) { return v.unread; }).length,
      nurse: openConvos().filter(function (v) { return v.nurse; }).length,
      today: LIVE ? intakeOpen().length : todayIssues().length,
      leads: LEADS.filter(function (l) { return inClinic(l.c) && l.s === 0; }).length,
      reviews: REVIEWS.filter(function (r) { return inClinic(r.c) && !r.replied; }).length
    };
  }

  function renderNav() {
    var c = counts();
    $("side").innerHTML = '<div class="logo">Skinlux <span>HQ</span></div><div class="logo-sub">Booragoon and Leederville</div>' +
      NAV.map(function (n) {
        if (n[0] === "grp") return '<div class="grp">' + n[1] + "</div>";
        var ct = c[n[0]], red = n[0] === "inbox" && c.nurse;
        return '<button class="nav' + (ui.view === n[0] ? " on" : "") + '" data-go="' + n[0] + '">' + I(n[2]) + "<span>" + n[1] + "</span>" +
          (ct ? '<span class="ct' + (red ? " red" : "") + '">' + ct + "</span>" : "") + "</button>";
      }).join("") +
      (LIVE ? '<div class="sync"><span class="dot-live"></span>GoHighLevel live, ' + hm(LIVE.syncedAt) + '<br><span class="dot-live"></span>Staff app, shop and forms live<br><span class="dot-live" style="background:var(--warn);box-shadow:0 0 0 3px var(--warn-soft)"></span>Timely: waiting on access</div>'
        : '<div class="sync"><span class="dot-live"></span>Timely synced 2 min ago<br><span class="dot-live"></span>GoHighLevel live<br><small class="muted">Direct links, no Zapier</small></div>');
  }

  function go(v, sub) {
    ui.view = v;
    if (v === "inbox" && sub) { ui.convo = sub; var cv = convo(sub); if (cv) { cv.unread = false; if (cv.status === "done") ui.ibf = "done"; else if (ui.ibf === "done") ui.ibf = "all"; } }
    Array.prototype.forEach.call(document.querySelectorAll("section.view"), function (s) { s.hidden = s.id !== "v-" + v; });
    $("tbTitle").textContent = TITLES[v];
    $("tbSub").textContent = SUBS[v];
    $("search").hidden = v === "inbox";
    closeBell();
    renderAll();
    if (location.hash !== "#" + v) history.replaceState(null, "", "#" + v);
    window.scrollTo(0, 0);
  }
  function renderAll() {
    renderNav();
    var f = { overview: renderNeeds, inbox: renderInbox, today: renderToday, clients: renderClients, leads: renderLeads,
      flows: renderFlows, reviews: renderReviews, apps: renderApps, team: renderTeam, connections: renderConn }[ui.view];
    if (f) f();
    renderBell();
  }

  /* ---------- Overview: needs you today ---------- */
  function renderNeeds() {
    var c = counts();
    var od = LIVE ? liveTasks().filter(function (t) { return t.overdue; }).length : document.querySelectorAll("#taskTable tr.overdue").length;
    var items = LIVE ? [[c.nurse, "Replies need a nurse", "inbox", "bad"], [c.inbox, "Unread messages", "inbox", ""], [c.leads, "New leads to call", "leads", ""],
      [c.today, "Intake forms to check", "today", "warn"], [STOCK.filter(function (x) { return inClinic(x.c); }).length, "Stock running low", "apps", "warn"], [od, "Overdue team tasks", "team", "bad"]]
      : [[c.nurse, "Replies need a nurse", "inbox", "bad"], [c.inbox, "Unread messages", "inbox", ""], [c.leads, "New leads to call", "leads", ""],
      [c.today, "Diary issues today", "today", "warn"], [c.reviews, "Reviews to reply to", "reviews", ""], [od, "Overdue team tasks", "#team-tasks", "bad"]];
    if (LIVE) renderLiveNumbers();
    $("needs").innerHTML = items.map(function (i) {
      return '<button class="need ' + (i[0] ? i[3] : "") + '" data-go="' + i[2] + '"><b>' + i[0] + "</b><span>" + i[1] + "</span></button>";
    }).join("");
  }

  function renderLiveNumbers() {
    var box = $("liveNums"); if (!box) return;
    var d = ui_np === "today" ? 0 : ui_np === "week" ? 7 : 30;
    var tx = evs("treatment_done", d), px = evs("product_sold", d), ld = evs("new_lead", d), ab = evs("incomplete_booking", d), bk = evs("booking_made", d);
    var sk = ld.filter(function (e) { return e.s === "skin-check"; }).length, qz = ld.filter(function (e) { return e.s === "quiz"; }).length, of = ld.filter(function (e) { return e.s === "offer-page"; }).length;
    var lbl = { today: "Today", week: "Last 7 days", month: "Last 30 days" }[ui_np];
    var h = '<div class="dash-head" style="margin-top:26px"><h2 style="margin:0">The numbers</h2><div class="switches"><div class="seg" id="segNp">' +
      [["today", "Today"], ["week", "7 days"], ["month", "30 days"]].map(function (x) { return '<button data-np="' + x[0] + '"' + (ui_np === x[0] ? ' class="on"' : "") + ">" + x[1] + "</button>"; }).join("") +
      '</div><span class="stamp" style="margin:0">Live, ' + hm(LIVE.syncedAt) + "</span></div></div>" +
      '<div class="grid g4">' + kpi("Treatments done", tx.length, money(sumV(tx)) + " at your from prices") + kpi("Products sold", px.length, money(sumV(px)) + " retail, clinic and online") +
      kpi("New leads", ld.length, sk + " skin check, " + qz + " quiz, " + of + " offer pages") + kpi("Abandoned bookings", ab.length, bk.length + " bookings came back") + "</div>";
    var byT = {}; tx.forEach(function (e) { byT[e.i] = (byT[e.i] || 0) + 1; });
    var byP = {}; px.forEach(function (e) { var n = String(e.i || "").replace(/^Skin[Cc]are Doctor /, ""); byP[n] = (byP[n] || 0) + 1; });
    function bars(o, empty) {
      var k = Object.keys(o).sort(function (a, b) { return o[b] - o[a]; }).slice(0, 6), mx = k.length ? o[k[0]] : 1;
      return k.length ? k.map(function (x) { return '<div class="srcbar"><span>' + esc(x) + '</span><div class="bar"><span style="width:' + (o[x] / mx * 100) + '%"></span></div><b>' + o[x] + "</b></div>"; }).join("") : '<p class="muted">' + empty + "</p>";
    }
    h += '<div class="grid g2 mt"><div class="card"><div class="section-title"><h3>Treatments</h3><span class="muted">' + lbl + "</span></div>" + bars(byT, "Treatments show here as the team taps Treatment done in the staff app.") + "</div>" +
      '<div class="card"><div class="section-title"><h3>Products</h3><span class="muted">' + lbl + "</span></div>" + bars(byP, "Product sales show here from the staff app and the online shop.") + "</div></div>";
    var w = (LIVE.waitlist && LIVE.waitlist.people || []).filter(function (p) { return inClinic(p.c); }).length;
    h += '<div class="grid g4 mt">' + kpi("Intake forms", evs("intake", d).length, intakeOpen().length + " waiting for a nurse") + kpi("On the waitlist", w, "Waiting for a free spot") +
      kpi("Client app messages", evs("client_app", d).length, "Messages, set asides and call backs") + kpi("Website", LIVE.site ? (LIVE.site.up ? "Up" : "DOWN") : "...", LIVE.site && LIVE.site.up ? "Loads in " + (LIVE.site.ms / 1000).toFixed(1) + "s" : "Checked each refresh") + "</div>" +
      '<div class="card soft mt"><b>Revenue, bookings and rebook rate come from Timely.</b> <span class="muted">They show here once Timely admin access is shared. Until then, treatment and product values above use your Settings prices.</span></div>';
    box.innerHTML = h;
  }

  /* ---------- Inbox ---------- */
  function convo(id) { return CONVOS.filter(function (v) { return v.id === id; })[0]; }
  function convoList() {
    return CONVOS.filter(function (v) {
      if (!inClinic(v.clinic)) return false;
      if (ui.ibch && v.ch !== ui.ibch) return false;
      if (ui.ibf === "done") return v.status === "done";
      if (v.status === "done") return false;
      if (ui.ibf === "unread") return v.unread;
      if (ui.ibf === "nurse") return v.nurse;
      if (ui.ibf === "mine") return v.assigned === "Jellie";
      if (ui.ibf === "none") return !v.assigned;
      return true;
    });
  }
  function chBadge(k) { return '<span class="chn" style="background:' + CH[k][1] + '1f;color:' + CH[k][1] + '">' + CH[k][0] + "</span>"; }
  function avatar(name, ch) { return '<div class="av">' + esc(initials(name)) + (ch ? '<i class="ch" style="background:' + CH[ch][1] + '"></i>' : "") + "</div>"; }
  function itemHtml(v) {
    var shown = v.msgs.filter(function (m) { return m.f !== "sys"; });
    var last = shown[shown.length - 1] || v.msgs[v.msgs.length - 1];
    var pre = last.f === "us" ? "You: " : last.f === "bot" ? "Auto: " : "";
    var tags = chBadge(v.ch) + '<span class="chn">' + LOC(v.clinic) + "</span>" +
      (v.nurse ? '<span class="chn" style="background:var(--bad-soft);color:var(--bad)">Nurse</span>' : "") +
      (!v.assigned ? '<span class="chn" style="background:var(--warn-soft);color:var(--warn)">Unassigned</span>' : "");
    return '<div class="ib-item' + (v.id === ui.convo ? " on" : "") + (v.unread ? " unread" : "") + '" data-cv="' + v.id + '">' + avatar(v.name, v.ch) +
      '<div style="min-width:0"><div class="top"><span class="nm">' + esc(v.name) + '</span><small class="muted">' + esc(v.at) + "</small></div>" +
      '<div class="prev">' + pre + esc(last.t.split("\n")[0]) + '</div><div class="tagrow">' + tags + "</div></div></div>";
  }
  function threadHtml(v) {
    var opts = '<option value="">Unassigned</option>' + S.team.map(function (m) { return "<option" + (v.assigned === m.name ? " selected" : "") + ">" + m.name + "</option>"; }).join("");
    var h = '<div class="ib-thread"><div class="th-head">' + avatar(v.name, v.ch) +
      '<div class="who"><b>' + esc(v.name) + '</b><div class="muted" style="font-size:12px">' + CH[v.ch][0] + " &middot; " + LOC(v.clinic) + " &middot; " + esc(v.wf) + "</div></div>" +
      '<div class="th-ctl"><select id="thAssign" aria-label="Assign to">' + opts + "</select>" +
      (v.ch !== "review" ? '<button class="btn sm ghost" data-act="book">Book in Timely</button>' : "") +
      '<button class="btn sm ' + (v.status === "done" ? "ghost" : "gold") + '" data-act="done">' + (v.status === "done" ? "Reopen" : "Mark done") + "</button></div></div>" +
      '<div class="th-body" id="thBody">';
    h += v.msgs.map(function (m) {
      if (m.f === "sys") return '<div class="sysline">' + esc(m.t) + "</div>";
      var who = m.f === "them" ? "" : m.f === "bot" ? "Sent automatically" : (m.by || "You");
      return '<div class="bub ' + m.f + '">' + esc(m.t) + "<small>" + [m.at, who].filter(Boolean).map(esc).join(", ") + "</small></div>";
    }).join("");
    h += '</div><div class="composer">' +
      (ui.warn ? '<div class="warnbox"><b>Hold on.</b> ' + ui.warn + ' <button class="lnk" data-act="fix">Use the safe wording</button></div>' : "") +
      (v.inj ? '<div class="badge warn" style="margin-bottom:6px">Injectable chat: no prices, offers or brand names</div>' : "") +
      '<textarea id="reply" placeholder="Type a reply, or let the AI draft one">' + esc(v.typed || "") + "</textarea>" +
      (LIVE ? '<div class="row"><select id="quick" aria-label="Quick reply" style="max-width:220px"><option value="">Quick replies</option><option value="book">Booking link</option><option value="hours">Opening hours and address</option><option value="consult">Free consult (injectables)</option><option value="thanks">Thanks, we will call you</option></select>'
        : '<div class="row"><button class="btn sm ghost" data-act="ai">Draft a reply with AI</button>') +
      '<span style="flex:1"></span><button class="btn sm" data-act="send">' + CH[v.ch][2] + "</button></div></div></div>";
    return h;
  }
  function sideHtml(v) {
    var c = findClient(v.name);
    var h = '<div class="ib-side"><h4 style="margin-top:0">Contact</h4><div class="kv"><span>Mobile</span><div>' + esc(v.phone) + "</div><span>Clinic</span><div>" + LOC(v.clinic) +
      "</div><span>Owner</span><div>" + esc(v.assigned || "Unassigned") + "</div></div>";
    if (c) {
      h += '<h4>' + (LIVE ? "Client record" : "From Timely") + '</h4><div class="kv"><span>Client since</span><div>' + c.since + "</div><span>Visits</span><div>" + c.visits + "</div><span>Spent</span><div>" + (LIVE ? "From Timely, soon" : money(c.spend)) +
        "</div><span>Last visit</span><div>" + c.last + "</div><span>Next</span><div>" + c.next + "</div></div>";
      if (c.course) h += courseBar(c.course);
      h += '<h4>Tags</h4><div class="tagrow">' + c.tags.map(function (t) { return '<span class="chn">' + t + "</span>"; }).join("") + "</div>" +
        '<button class="btn sm ghost block" style="margin-top:14px" data-client="' + esc(c.name) + '">Open full profile</button>';
    } else {
      h += '<p class="muted" style="margin-top:10px">' + (LIVE ? "Not a saved client yet. They become one when they book or the team taps Treatment done." : "Not in Timely yet. Skinlux HQ adds them to Timely when they book.") + "</p>";
    }
    h += "<h4>Workflow</h4><p>" + esc(v.wf) + "</p>" + (v.paused ? '<span class="badge bad">Automations paused for this client</span>' : "");
    return h + "</div>";
  }
  function renderInbox() {
    var list = convoList();
    if (!list.some(function (v) { return v.id === ui.convo; })) ui.convo = list.length ? list[0].id : null;
    var fl = [["all", "All"], ["unread", "Unread"], ["nurse", "Needs a nurse"], ["none", "Unassigned"], ["mine", "Mine"], ["done", "Done"]];
    var chOpts = '<option value="">All channels</option>' + Object.keys(CH).map(function (k) { return '<option value="' + k + '"' + (ui.ibch === k ? " selected" : "") + ">" + CH[k][0] + "</option>"; }).join("");
    var h = '<div class="inbox"><div class="ib-list"><div class="ib-filters">' +
      fl.map(function (f) { return '<span class="chip' + (ui.ibf === f[0] ? " on" : "") + '" data-ibf="' + f[0] + '">' + f[1] + "</span>"; }).join("") +
      '<select id="ibCh" aria-label="Channel">' + chOpts + '</select></div><div class="ib-items">' +
      (list.length ? list.map(itemHtml).join("") : '<div class="empty">Nothing here.</div>') + "</div></div>";
    var v = convo(ui.convo);
    if (v && list.indexOf(v) >= 0) { v.unread = false; h += threadHtml(v) + sideHtml(v); }
    else h += '<div class="ib-thread"><div class="empty" style="margin:auto">Pick a conversation</div></div><div class="ib-side"></div>';
    $("v-inbox").innerHTML = h + "</div>";
    var tb = $("thBody"); if (tb) tb.scrollTop = tb.scrollHeight;
    renderNav();
  }
  var RISKY_INJ = /(\$\s?\d|discount|% ?off|\bdeal\b|special|cheap|half price|botox|dysport|xeomin|juvederm|restylane)/i;
  var RISKY_ALL = /(guarantee|100% results|permanent results|no risk)/i;
  function liveSend(v, text) {
    if (!LIVE.canSend) { toast("Sending from Skinlux HQ switches on after testing. For now, reply in GoHighLevel."); return; }
    var key = null; try { key = localStorage.getItem("skinluxhq-key"); } catch (e) {}
    var h = { "Content-Type": "application/json" }; if (key) h.Authorization = "Bearer " + key;
    fetch("/api/skinlux-hq/send", { method: "POST", credentials: "include", headers: h,
      body: JSON.stringify({ clinic: v.clinic, contactId: v.contactId, ch: v.ch, text: text, inj: !!v.inj }) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d.ok) { toast(d.error || "Not sent"); return; }
        v.msgs.push({ f: "us", t: text, at: "Just now", by: "You" }); v.typed = ""; v.at = "Just now";
        renderInbox(); toast("Sent through GoHighLevel from the " + LOC(v.clinic) + " account.");
      })
      .catch(function () { toast("Couldn't reach GoHighLevel. Nothing was sent."); });
  }
  function sendReply() {
    var v = convo(ui.convo); if (!v) return;
    var text = ($("reply").value || "").trim();
    if (!text) { toast("Type a reply first, or tap Draft a reply with AI"); return; }
    v.typed = text;
    if (v.inj && RISKY_INJ.test(text)) {
      ui.warn = "This is an injectable chat. AHPRA and TGA rules mean no prices, discounts or brand names here.";
      renderInbox(); return;
    }
    if (RISKY_ALL.test(text)) {
      ui.warn = "Promising results isn't allowed in health advertising.";
      renderInbox(); return;
    }
    ui.warn = null;
    if (LIVE) { liveSend(v, text); return; }
    v.msgs.push({ f: "us", t: text, at: "Just now", by: "Jellie" });
    v.typed = ""; v.at = "Just now";
    if (v.ch === "review") {
      REVIEWS.forEach(function (r) { if (r.cv === v.id) { r.replied = true; r.reply = text; } });
      v.status = "done";
      toast("Reply posted on Google for " + LOC(v.clinic) + ".");
    } else {
      toast("Sent by " + CH[v.ch][0].replace("Skin Check", "SMS") + " from the " + LOC(v.clinic) + " account. Saved on " + v.name.split(" ")[0] + "'s contact.");
    }
    renderInbox();
  }

  /* ---------- Today ---------- */
  function renderTodayLive() {
    var tx = evs("treatment_done", 0), px = evs("product_sold", 0), ld = evs("new_lead", 0);
    var today = perthDay(Date.now());
    var forms = (LIVE.intake || []).filter(function (f) { return inClinic(f.c) && (f.visit === today || (!f.cleared)); });
    var slots = (LIVE.waitlist && LIVE.waitlist.slots || []).filter(function (s) { return inClinic(s.c); });
    var h = '<div class="grid g4">' + kpi("Treatments done today", tx.length, money(sumV(tx)) + " at from prices") + kpi("Products sold today", px.length, money(sumV(px)) + " retail") +
      kpi("Intake forms to check", intakeOpen().length, "Flagged for a nurse") + kpi("Open waitlist spots", slots.length, "Posted, not filled yet") + "</div>";
    var act = evs("", 0, function (e) { return EVTXT[e.k]; });
    h += '<div class="grid g2 mt"><div class="card"><div class="section-title"><h3>Today so far</h3><span class="muted">Newest first</span></div>' +
      (act.length ? '<table><tbody>' + act.slice(0, 40).map(function (e) {
        return "<tr><td style=\"white-space:nowrap\">" + hm(e.at) + "</td><td><b>" + esc(e.n || "") + "</b></td><td>" + EVTXT[e.k] + (e.i ? ": " + esc(String(e.i).replace(/^Skin[Cc]are Doctor /, "")) : "") + "</td><td class=\"muted\">" + esc(e.t || LOC(e.c)) + "</td></tr>";
      }).join("") + "</tbody></table>" : '<p class="muted">Nothing yet today. Treatment done and Product sold taps, forms, leads and waitlist joins show up here as they happen.</p>') + "</div>" +
      '<div class="card"><div class="section-title"><h3>Intake forms</h3><a class="lnk" href="intake.html">Open all forms</a></div>' +
      (forms.length ? forms.slice(0, 12).map(function (f) {
        return '<div class="rev"><div class="row between"><b>' + esc(f.n) + '</b><small class="muted">' + LOC(f.c) + (f.visit ? ", visit " + esc(f.visit) : "") + "</small></div><div class=\"muted\">" + esc(f.t) + "</div>" +
          (f.flags.length ? '<div class="tagrow" style="margin-top:6px">' + f.flags.map(function (x) { return '<span class="badge ' + (/^STOP/.test(x) ? "bad" : "warn") + '">' + esc(x) + "</span>"; }).join("") + "</div>" : '<span class="badge ok">Clear to treat</span>') +
          (f.cleared ? "" : ' <small class="muted">Needs a nurse to clear it</small>') + "</div>";
      }).join("") : '<p class="muted">No forms for today and nothing waiting for a nurse. Send clients the form link before their visit.</p>') + "</div></div>";
    h += '<div class="grid g2 mt"><div class="card"><div class="section-title"><h3>Waitlist</h3><a class="lnk" href="waitlist.html">Fill a spot</a></div>' +
      (slots.length ? slots.map(function (s) { return '<div class="rev"><b>' + esc(s.t) + '</b> <span class="muted">' + esc(s.when) + ", " + LOC(s.c) + "</span></div>"; }).join("") : '<p class="muted">No open spots. When someone cancels, post the spot on the waitlist page to see who wants it.</p>') + "</div>" +
      '<div class="card soft"><h3>The Timely diary</h3><p class="muted" style="margin:0">Today\'s appointments for both clinics show here once Timely admin access is shared with bvn@bvnofficial.com. Until then, this page shows what the staff app, forms and waitlist report.</p></div></div>';
    $("v-today").innerHTML = h;
  }
  function renderToday() {
    if (LIVE) { renderTodayLive(); return; }
    var all = [];
    clinicsList().forEach(function (c) { DIARY[c].appts.forEach(function (a) { all.push(a); }); });
    var booked = all.filter(function (a) { return a.st !== "free"; });
    var done = all.filter(function (a) { return a.st === "done"; }).length;
    var rev = booked.reduce(function (s, a) { return s + a.v; }, 0);
    var free = all.filter(function (a) { return a.st === "free"; }).length;
    var h = '<div class="grid g4">' +
      kpi("Appointments today", booked.length, done + " done so far") + kpi("Booked value today", money(rev), "Injectables not shown") +
      kpi("Need a tap or a deposit", todayIssues().length, "Fix these first") + kpi("Free slots left", free, "Offer them to the waitlist") + "</div>";
    clinicsList().forEach(function (c) {
      var d = DIARY[c];
      h += '<div class="card mt"><div class="section-title"><h3>' + LOC(c) + '</h3><span class="muted">' + d.hours + ', from Timely</span></div>' +
        '<div class="diary" style="grid-template-columns:repeat(' + d.staff.length + ',minmax(0,1fr))">';
      d.staff.forEach(function (s) {
        h += '<div class="dcol"><h4>' + s + "</h4>";
        d.appts.filter(function (a) { return a.s === s; }).forEach(function (a) {
          var i = d.appts.indexOf(a), st = ST[a.st];
          var btn = "";
          if (a.st === "notap") btn = a.sent ? '<div class="muted">Reminder sent to ' + s.split(" ")[0] + "'s phone</div>" : '<button class="btn sm ghost" data-appt="' + c + ":" + i + '">Remind ' + s.split(" ")[0] + " to tap</button>";
          if (a.st === "deposit") btn = a.sent ? '<div class="muted">Payment link sent by SMS</div>' : '<button class="btn sm ghost" data-appt="' + c + ":" + i + '">Send payment link</button>';
          if (a.st === "free") btn = a.sent ? '<div class="muted">Waitlist texted, waiting for a yes</div>' : '<button class="btn sm ghost" data-appt="' + c + ":" + i + '">Offer to waitlist</button>';
          h += '<div class="appt ' + a.st + '"><div class="row between"><span class="t">' + a.t + "</span>" + (st[1] ? '<span class="badge ' + st[1] + '">' + st[0] + "</span>" : '<small class="muted">' + st[0] + "</small>") + "</div>" +
            "<div><b>" + esc(a.n || "Open") + "</b></div><div class=\"muted\">" + esc(a.tr) + "</div>" + btn + "</div>";
        });
        h += "</div>";
      });
      h += "</div></div>";
    });
    $("v-today").innerHTML = h;
  }
  function apptAction(key) {
    var p = key.split(":"), c = p[0], a = DIARY[c].appts[+p[1]];
    a.sent = true;
    if (a.st === "notap") toast(a.s.split(" ")[0] + " got a nudge on the staff app to tap Treatment done for " + a.n + ". Aftercare goes out the moment she taps.");
    if (a.st === "deposit") toast("Payment link sent to " + a.n + " by SMS. If it isn't paid by 2pm tomorrow, the clinic gets a call task.");
    if (a.st === "free") {
      toast("Waitlist texted: 4 clients want " + a.tr.split(",")[0] + " at " + LOC(c) + ". First yes gets " + a.t + ".");
      setTimeout(function () {
        a.st = "upcoming"; a.n = "Grace Bell"; a.v = a.tr.indexOf("HIFU") === 0 ? 450 : 460; a.sent = false;
        if (ui.view === "today") renderToday();
        toast("Grace Bell said yes. " + a.t + " is booked in Timely and the others got a sorry, it's gone text.");
      }, 4500);
    }
    renderAll();
  }
  function kpi(label, value, sub) {
    return '<div class="tile-kpi"><div class="label">' + label + '</div><div class="value">' + value + "</div>" + (sub ? '<small class="muted">' + sub + "</small>" : "") + "</div>";
  }

  /* ---------- Clients ---------- */
  function courseBar(c) {
    return '<div style="margin-top:10px"><div class="row between" style="font-size:12px"><span>' + c.label + "</span><b>" + c.done + " of " + c.total + '</b></div><div class="bar"><span style="width:' + (c.done / c.total * 100) + '%"></span></div></div>';
  }
  function clientList() {
    var q = ui.q.toLowerCase();
    return CLIENTS.filter(function (c) {
      if (!inClinic(c.clinic)) return false;
      if (q && (c.name + " " + c.phone + " " + c.tags.join(" ") + " " + c.last).toLowerCase().indexOf(q) < 0) return false;
      if (ui.cf === "new") return c.visits <= 1;
      if (ui.cf === "course") return !!c.course;
      if (ui.cf === "overdue") return c.tags.indexOf("overdue-rebook") >= 0;
      if (ui.cf === "inj") return c.tags.indexOf("injectables") >= 0;
      if (ui.cf === "vip") return c.tags.indexOf("vip") >= 0;
      return true;
    });
  }
  function renderClients() {
    var fl = [["all", "All"], ["new", "New"], ["course", "Course in progress"], ["overdue", "Overdue to rebook"], ["inj", "Injectables"], ["vip", "VIP"]];
    var list = clientList();
    var mine = CLIENTS.filter(function (c) { return inClinic(c.clinic); });
    var head = LIVE
      ? kpi("Clients", mine.length.toLocaleString("en-AU"), "In GoHighLevel") +
        kpi("New in 30 days", mine.filter(function (c) { return c.at && Date.now() - c.at < 30 * 864e5; }).length, "Added to GoHighLevel") +
        kpi("With a package", mine.filter(function (c) { return c.course; }).length, "Package sessions tracked") +
        kpi("Due to rebook", mine.filter(function (c) { return c.tags.indexOf("rebook-due") > -1; }).length, "Workflow 4 is on them")
      : kpi("Active clients", sc(3912).toLocaleString("en-AU"), "Seen in the last 12 months") + kpi("New this month", sc(154), "From Timely") +
        kpi("Courses in progress", sc(286), "Tracked session by session") + kpi("Overdue to rebook", sc(61), "Workflow 4 is on them");
    var h = '<div class="grid g4">' + head + "</div>" +
      '<div class="card mt"><div class="row between wrap" style="margin-bottom:12px"><div class="row wrap" style="gap:6px">' +
      fl.map(function (f) { return '<span class="chip' + (ui.cf === f[0] ? " on" : "") + '" data-cf="' + f[0] + '">' + f[1] + "</span>"; }).join("") +
      '</div><small class="muted">' + (ui.q ? 'Search: "' + esc(ui.q) + '". ' : "") + "Showing " + list.length + " sample clients</small></div>" +
      '<table id="clientTable"><thead><tr><th>Client</th><th>Clinic</th><th>Last visit</th><th>Next</th><th>Spent</th><th>Tags</th></tr></thead><tbody>' +
      (list.length ? list.map(function (c) {
        return '<tr data-client="' + esc(c.name) + '"><td><div class="row" style="gap:10px">' + avatar(c.name) + "<div><b>" + esc(c.name) + '</b><div class="muted" style="font-size:12px">' + c.phone + "</div></div></div></td><td>" + LOC(c.clinic) +
          "</td><td>" + c.last + "</td><td>" + (c.next === "Not booked" ? '<span class="badge warn">Not booked</span>' : c.next) + "</td><td>" + money(c.spend) +
          '</td><td><div class="tagrow">' + c.tags.slice(0, 3).map(function (t) { return '<span class="chn">' + t + "</span>"; }).join("") + "</div></td></tr>";
      }).join("") : '<tr><td colspan="6" class="empty">No clients match.</td></tr>') + "</tbody></table></div>";
    $("v-clients").innerHTML = h;
  }
  function openClient(name) {
    var c = findClient(name); if (!c) return;
    var cv = CONVOS.filter(function (v) { return v.name === c.name; })[0];
    var h = '<div class="p-head"><div class="badge gold">' + LOC(c.clinic) + '</div><h2 style="margin:8px 0 2px">' + esc(c.name) + '</h2><small class="muted">' + c.phone + " &middot; client since " + c.since + "</small></div>" +
      '<div class="cp-body"><div class="grid g3" style="gap:8px;margin-bottom:14px">' +
      kpi("Visits", c.visits) + kpi("Spent", money(c.spend)) + kpi("Points", c.points) + "</div>" +
      '<div class="kv"><span>Last visit</span><div>' + c.last + "</div><span>Next</span><div>" + c.next + "</div><span>Forms</span><div>" + c.forms + "</div></div>" +
      (c.course ? "<h4>Course</h4>" + courseBar(c.course) : "") +
      "<h4>Products</h4><p>" + (c.products.length ? c.products.join(", ") : '<span class="muted">None yet</span>') + "</p>" +
      '<h4>Tags</h4><div class="tagrow">' + c.tags.map(function (t) { return '<span class="chn">' + t + "</span>"; }).join("") + "</div>" +
      '<h4>History</h4><ul class="timeline">' + c.history.map(function (x) { var i = x.indexOf(": "); return "<li><b>" + esc(x.slice(i + 2)) + '</b><small class="muted">' + esc(x.slice(0, i)) + "</small></li>"; }).join("") + "</ul></div>" +
      (LIVE ? '<div class="p-foot">' + (cv ? '<button class="btn" data-goconvo="' + cv.id + '">Open conversation</button>' : "") + '<button class="btn ghost" data-cact="app">Client app link</button><button class="btn ghost" data-cact="book">Book in Timely</button></div>'
      : '<div class="p-foot">' + (cv ? '<button class="btn" data-goconvo="' + cv.id + '">Open conversation</button>' : '<button class="btn" data-cact="msg">Send a message</button>') +
      '<button class="btn ghost" data-cact="book">Book in Timely</button><button class="btn ghost" data-cact="wait">Add to waitlist</button></div>');
    $("cpInner").innerHTML = h;
    $("cpanel").dataset.client = c.name; $("cpanel").dataset.cid = c.id || ""; $("cpanel").dataset.cclinic = c.clinic;
    $("cpanel").classList.add("show"); $("scrim2").classList.add("show"); $("cpanel").setAttribute("aria-hidden", "false");
  }
  function closeClient() { $("cpanel").classList.remove("show"); $("scrim2").classList.remove("show"); $("cpanel").setAttribute("aria-hidden", "true"); }

  /* ---------- Leads ---------- */
  function renderLeads() {
    var list = LEADS.filter(function (l) { return inClinic(l.c); });
    var max = SOURCES.length ? SOURCES[0][1] : 1;
    var srcs = SOURCES, scl = sc;
    if (LIVE) {
      var tally = {};
      list.forEach(function (l) { var k = l.src || "Other"; tally[k] = tally[k] || [k, 0, 0]; tally[k][1]++; if (l.s === 3) tally[k][2]++; });
      srcs = Object.keys(tally).map(function (k) { return tally[k]; }).sort(function (a, b) { return b[1] - a[1]; });
      scl = function (n) { return n; };
      max = Math.max.apply(null, srcs.map(function (x) { return x[1]; }).concat([1]));
    }
    var h = '<div class="grid g2"><div class="card"><div class="section-title"><h3>Leads by source</h3><span class="muted">Booked in brackets</span></div>' +
      (srcs.length ? "" : '<p class="muted">No leads yet.</p>') +
      srcs.map(function (s) {
        return '<div class="srcbar"><span>' + s[0] + '</span><div class="bar"><span style="width:' + (s[1] / max * 100) + '%"></span></div><b>' + scl(s[1]) + ' <small class="muted">(' + scl(s[2]) + ")</small></b></div>";
      }).join("") + '</div><div class="grid g2" style="align-content:start">' +
      (LIVE ? kpi("Open leads", list.filter(function (l) { return l.s < 3; }).length, "All channels") + kpi("Booked", list.filter(function (l) { return l.s === 3; }).length, "In the Leads pipeline") + kpi("Lost", list.filter(function (l) { return l.s === 4; }).length, "Marked lost")
        : kpi("Leads this month", sc(230), "All channels") + kpi("Booked", sc(87), "38% of leads") + kpi("Average reply time", "4 min", "Whole team")) + kpi("Waiting for a call", list.filter(function (l) { return l.s === 0; }).length, "Oldest first") + "</div></div>";
    h += '<div class="kan mt">' + STAGES.map(function (st, si) {
      var col = list.filter(function (l) { return l.s === si; });
      return '<div class="kcol"><h4><span>' + st + "</span><span>" + col.length + "</span></h4>" + col.map(function (l) {
        var i = LEADS.indexOf(l);
        return '<div class="lead' + (l.fresh ? " fresh" : "") + '"><b>' + esc(l.n) + '</b><div class="muted">' + esc(l.i) + "</div>" +
          '<div class="tagrow" style="margin-top:6px"><span class="chn">' + l.src + '</span><span class="chn">' + LOC(l.c) + "</span></div>" +
          '<div class="row between" style="margin-top:6px"><small class="muted">' + l.age + "</small><b>" + (l.inj ? "Consult" : money(l.v)) + "</b></div>" +
          '<div class="row">' + (si < 3 ? '<button class="btn sm" data-lead="' + i + '">Move to ' + STAGES[si + 1] + "</button>" : "") +
          (l.cv ? '<button class="btn sm ghost" data-goconvo="' + l.cv + '">Chat</button>' : "") + "</div></div>";
      }).join("") + "</div>";
    }).join("") + "</div>";
    $("v-leads").innerHTML = h;
  }

  /* ---------- Workflows ---------- */
  var MSGCARD = !LIVE ? "" : '<div class="card" style="margin-bottom:16px;display:flex;gap:14px;align-items:center;flex-wrap:wrap"><div style="flex:1;min-width:220px"><b>You control everything here</b><br><span class="muted">Message wording, your offer pages, and Settings for follow ups on or off, clinic details and links, treatment prices and timing, products and your team.</span></div><a class="btn sm" href="messages.html">Your messages</a><a class="btn sm ghost" href="offers.html">Your offers</a><a class="btn sm ghost" href="settings.html">Settings</a></div>';
  // live: flows 1 to 3 map to the follow up switches in Settings
  var FLOW_AUTO = ["abandoned", "treatment", "product"];
  function liveFlowOn(i) {
    var a = LIVE && LIVE.automations, k = FLOW_AUTO[i];
    if (!a || !k) return null;
    var cs = clinicsList(), on = cs.filter(function (c) { return a[c] && a[c][k] !== false; });
    return on.length === cs.length ? "on" : on.length ? "some" : "off";
  }
  function liveFlowToggle(i, fl) {
    var K = null; try { K = localStorage.getItem("skinluxhq-key"); } catch (e) {}
    var H = { Accept: "application/json", "Content-Type": "application/json" }; if (K) H.Authorization = "Bearer " + K;
    var turnOn = liveFlowOn(i) !== "on", cs = clinicsList();
    fetch("/api/skinlux-hq/settings", { headers: H, credentials: "include", cache: "no-store" }).then(function (r) { return r.json(); }).then(function (d) {
      if (!d.ok) throw new Error(d.error);
      var st = d.settings;
      cs.forEach(function (c) { st.automations[c][FLOW_AUTO[i]] = turnOn; });
      return fetch("/api/skinlux-hq/settings", { method: "PUT", headers: H, credentials: "include", body: JSON.stringify({ settings: st }) }).then(function (r) { return r.json(); });
    }).then(function (d) {
      if (!d || !d.ok) throw new Error(d && d.error);
      LIVE.automations = d.settings.automations;
      toast(fl.n + (turnOn ? " is back on" : " is paused") + (cs.length === 1 ? " at " + cs[0].charAt(0).toUpperCase() + cs[0].slice(1) : " at both clinics") + ".");
      renderFlows();
    }).catch(function () { toast("Couldn't change that. Try again in a minute."); });
  }
  function renderFlows() {
    var h = MSGCARD + '<div class="note" style="margin-bottom:16px">Every workflow runs in GoHighLevel and reads from Timely directly. Switch one off and nobody new enters it. People already in it finish their current step.</div><div class="stack">';
    FLOWS.forEach(function (f, i) {
      var lv = LIVE ? liveFlowOn(i) : null;
      if (lv) f.on = lv !== "off";
      function stat(x) { return "<div><b>" + (typeof x[0] === "number" ? sc(x[0]) : x[0]) + "</b>" + x[1] + "</div>"; }
      h += '<div class="card flow' + (f.on ? "" : " off") + '"><div><h3 style="margin:0">' + f.n + "</h3>" +
        '<div class="stats">' + (f.now ? "<div><b>" + sc(f.now) + "</b>in it right now</div>" : "") + stat(f.a) + stat(f.b) + stat(f.c) + "</div>" +
        '<small class="muted">Latest</small><ul>' + f.log.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>" +
        (LIVE && !lv ? '<div class="row"><small class="muted">Runs in GoHighLevel</small></div></div>' :
        '<div class="row"><small class="muted">' + (lv === "some" ? "On at one clinic" : f.on ? "On" : "Paused") + '</small><button class="switch' + (f.on ? " on" : "") + '" data-flow="' + i + '" aria-label="Turn ' + esc(f.n) + (f.on ? " off" : " on") + '"></button></div></div>');
    });
    $("v-flows").innerHTML = h + "</div>";
  }

  /* ---------- Reviews ---------- */
  function stars(n) { return '<span class="stars">' + "&#9733;".repeat(n) + '<span style="color:var(--line)">' + "&#9733;".repeat(5 - n) + "</span></span>"; }
  function renderReviews() {
    var list = REVIEWS.filter(function (r) { return inClinic(r.c); });
    var rv = function (t) { return CLIENTS.filter(function (c) { return inClinic(c.clinic) && c.tags.indexOf(t) > -1; }).length; };
    var h = '<div class="grid g4">' + (LIVE
      ? kpi("Review requests sent", rv("review-asked"), "Only to clients who replied happy") + kpi("Reviews left", rv("review-left"), "Tagged in GoHighLevel") +
        kpi("Google ratings", "Soon", "Once both Google profiles are connected") + kpi("Replies waiting", 0, "From Google")
      : kpi("Booragoon rating", "4.9", "214 Google reviews") + kpi("Leederville rating", "4.8", "97 Google reviews") +
        kpi("Asked this month", sc(212), "Only clients who replied happy") + kpi("Left this month", sc(73), "34% of those asked")) + "</div>" +
      '<div class="card mt"><div class="section-title"><h3>Latest reviews</h3><span class="muted">' + list.filter(function (r) { return !r.replied; }).length + " waiting for a reply</span></div>";
    if (LIVE) { $("v-reviews").innerHTML = h + '<p class="muted">Google reviews for Booragoon and Leederville show here, with reply drafts, once manager access on both Google Business Profiles is shared. Review requests already go out from the after treatment follow up.</p></div>'; return; }
    h += list.map(function (r) {
      var i = REVIEWS.indexOf(r);
      return '<div class="rev"><div class="row between"><div><b>' + esc(r.n) + "</b> " + stars(r.s) + '</div><small class="muted">' + LOC(r.c) + ", " + r.at + "</small></div>" +
        "<p style=\"margin:6px 0 0\">" + esc(r.t) + "</p>" +
        (r.replied ? '<div class="reply"><b>Your reply:</b> ' + esc(r.reply) + "</div>" :
          '<label for="rv' + i + '">Reply draft</label><textarea id="rv' + i + '">' + esc(r.draft) + '</textarea><div class="row" style="margin-top:8px"><button class="btn sm" data-review="' + i + '">Post reply on Google</button>' +
          (r.s <= 3 ? '<span class="badge warn">Under 4 stars: Jellie was alerted</span>' : "") + "</div>") + "</div>";
    }).join("");
    $("v-reviews").innerHTML = h + "</div>";
  }

  /* ---------- Team ---------- */
  function renderTeamLive() {
    var team = (LIVE.team || []).filter(function (m) { return clinic() === "both" || !m.clinics.length || m.clinics.indexOf(clinic()) > -1; });
    var protos = (LIVE.training && LIVE.training.protocols || []).filter(function (p) { return p.status === "signed"; });
    var reads = (LIVE.training && LIVE.training.reads) || {};
    var t30 = evs("treatment_done", 30), p30 = evs("product_sold", 30), t0 = evs("treatment_done", 0);
    var h = '<div class="card"><div class="section-title"><h3>Team</h3><span class="muted">From the staff app, last 30 days</span></div>' +
      "<table><thead><tr><th>Team member</th><th>Clinics</th><th>Today</th><th>Treatments</th><th>Retail</th><th>Training read</th></tr></thead><tbody>" +
      (team.length ? team.map(function (m) {
        var mine = function (l) { return l.filter(function (e) { return e.t === m.name; }); };
        var rd = protos.filter(function (p) { return (reads[m.name] || {})[p.id]; }).length;
        return "<tr><td><div class=\"row\" style=\"gap:10px\">" + avatar(m.name) + "<b>" + esc(m.name) + "</b></div></td><td>" + (m.clinics.length === 2 || !m.clinics.length ? "Both" : LOC(m.clinics[0])) + "</td><td>" + mine(t0).length + " done</td><td>" + mine(t30).length + "</td><td>" + money(sumV(mine(p30))) + "</td><td>" + (protos.length ? rd + " of " + protos.length : "None signed yet") + "</td></tr>";
      }).join("") : '<tr><td colspan="6" class="muted">Add your team in Settings.</td></tr>') + "</tbody></table>" +
      '<div class="row" style="gap:8px;margin-top:12px"><a class="btn sm ghost" href="scorecard.html">Therapist scorecard</a><a class="btn sm ghost" href="training.html">Training and protocols</a><a class="btn sm ghost" href="settings.html">Edit the team</a></div></div>';
    var tasks = liveTasks();
    h += '<div class="card mt" id="team-tasks"><div class="section-title"><h3>Open follow up tasks</h3><span class="muted">' + tasks.length + " open, " + tasks.filter(function (t) { return t.overdue; }).length + " overdue. Tick them off in GoHighLevel.</span></div>" +
      (tasks.length ? "<table><tbody>" + tasks.slice(0, 60).map(function (t) {
        return "<tr" + (t.overdue ? ' class="overdue"' : "") + "><td><b>" + esc(t.title) + "</b>" + (t.body ? '<br><small class="muted">' + esc(t.body.slice(0, 160)) + "</small>" : "") + "</td><td>" + LOC(t.clinic) + "</td><td>" + (t.overdue ? '<span class="badge bad">Overdue</span> ' : "") + esc(t.dueTxt) + "</td><td>" + (t.phone ? '<a class="btn sm ghost" href="tel:' + esc(t.phone) + '">Call</a>' : "") + "</td></tr>";
      }).join("") + "</tbody></table>" : '<p class="muted">No open tasks. Call backs from the follow ups, nurse checks and client app messages land here.</p>') + "</div>";
    $("v-team").innerHTML = h;
  }
  function renderTeam() {
    if (LIVE) { renderTeamLive(); return; }
    var tasks = document.querySelectorAll("#taskTable tbody tr[data-id]");
    var list = TEAM.filter(function (t) { return inClinic(t.c); });
    var h = '<div class="card"><div class="section-title"><h3>Team this month</h3><span class="muted">From Timely, the staff app and GoHighLevel</span></div>' +
      "<table><thead><tr><th>Team member</th><th>Clinic</th><th>Today</th><th>Rebook rate</th><th>Retail</th><th>Reviews naming them</th><th></th></tr></thead><tbody>" +
      list.map(function (t) {
        return "<tr><td><div class=\"row\" style=\"gap:10px\">" + avatar(t.n) + "<b>" + t.n + "</b></div></td><td>" + LOC(t.c) + "</td><td>" + t.appts + " clients</td>" +
          '<td><div class="row" style="gap:8px"><div class="bar" style="width:80px"><span style="width:' + t.rebook + '%"></span></div>' + t.rebook + "%</div></td><td>" + money(t.retail) + "</td><td>" + t.rev + "</td>" +
          '<td><button class="btn sm ghost" data-msgstaff="' + t.n + '">Message</button></td></tr>';
      }).join("") + "</tbody></table></div>" +
      '<div class="grid g2 mt"><div class="card"><h3>Message the team</h3><p class="muted">Goes to everyone at the clinic you picked at the top, on the staff app.</p>' +
      '<textarea id="teamMsg" placeholder="For example: HIFU offer has 6 spots left, mention it at checkout today"></textarea><button class="btn sm" style="margin-top:8px" data-act="teammsg">Send to the team</button></div>' +
      '<div class="card"><h3>Open follow up tasks</h3><p>' + tasks.length + " open, " + document.querySelectorAll("#taskTable tr.overdue").length + ' overdue.</p><button class="btn sm ghost" data-go="#team-tasks">Open the task list</button></div></div>';
    $("v-team").innerHTML = h;
  }

  /* ---------- Apps: every app in the Skinlux suite ---------- */
  function appsData() {
    return [
    ["Staff app", "08-staff-app.html", "For the team", [[sc(23), "treatments tapped done today"], [sc(6), "call backs done"]], "today"],
    ["My Skinlux client app", "01-client-app.html", "For clients", [[sc(412), "clients using it"], [sc(38), "aftercare guides opened this week"]], "clients"],
    ["AI Skin Check", "16-skin-scan.html", "For clients", [[sc(41), "scans this month"], [sc(17), "booked from a scan"]], "leads"],
    ["Treatment finder quiz", "04-treatment-quiz.html", "For clients", [[sc(15), "quiz leads this month"], ["Acne", "top concern"]], "leads"],
    ["Intake and consent forms", "05-intake-forms.html", "For clients", [[sc(9), "forms done for today"], [sc(1), "flag for a nurse"]], "today"],
    ["Waitlist slot filler", "06-waitlist.html", "For clients", [[sc(7), "slots filled this week"], [money(sc(2140)), "kept in the diary"]], "flows"],
    ["Training and protocols hub", "09-training-hub.html", "For the team", [[18, "treatment protocols"], ["4 of 5", "team up to date"]], "team"],
    ["Therapist scorecard", "10-scorecard.html", "For the team", [["74%", "best rebook rate (Nurse Leo)"], [money(sc(11170)), "retail this month"]], "team"],
    ["Stock tracker", "12-stock.html", "For you", [[STOCK.filter(function (x) { return inClinic(x.c) && !x.ordered; }).length, "items running low"], [sc(2), "orders drafted"]], "connections"],
    ["Ad compliance checker", "13-compliance-checker.html", "For you", [[sc(12), "ads and emails checked"], [sc(2), "fixed before going out"]], ""],
    ["Offer page builder", "14-offer-builder.html", "For you", [[5, "offers live"], [sc(19), "spots left this month"]], "leads"],
    ["Website and review monitor", "15-monitor.html", "For you", [["Up", "loads in 1.2s"], [REVIEWS.filter(function (r) { return inClinic(r.c) && !r.replied; }).length, "reviews to reply to"]], "reviews"]
  ];
  }
  function liveApps() {
    var st = (LIVE.stock || []).filter(function (x) { return inClinic(x.c); });
    var low = st.filter(function (x) { return x.left !== null && x.left <= x.min; }).length, unc = st.filter(function (x) { return x.left === null; }).length;
    var wl = LIVE.waitlist || { people: [], slots: [], filled: [] };
    var wp = wl.people.filter(function (p) { return inClinic(p.c); }).length, wf = (wl.filled || []).filter(function (s) { return inClinic(s.c) && s.at > Date.now() - 30 * 86400000; }).length;
    var tr = LIVE.training || { protocols: [], reads: {} }, signed = tr.protocols.filter(function (p) { return p.status === "signed"; }).length;
    var ld = evs("new_lead", 30);
    var tap0 = evs("treatment_done", 0).length + evs("product_sold", 0).length, tap30 = evs("treatment_done", 30).length;
    var site = LIVE.site;
    return [
      ["Staff app", "../staff/index.html", "For the team", [[tap0, "taps today"], [tap30, "treatments done, 30 days"]], "today"],
      ["My Skinlux client app", "", "For clients", [[evs("client_app", 30).length, "messages and requests, 30 days"], ["Private", "each client gets their own link"]], "clients"],
      ["AI Skin Check", "../skin-check/index.html", "For clients", [[ld.filter(function (e) { return e.s === "skin-check"; }).length, "skin check leads, 30 days"], ["Live", "selfie checked on the phone"]], "leads"],
      ["Treatment finder quiz", "../quiz/index.html", "For clients", [[ld.filter(function (e) { return e.s === "quiz"; }).length, "quiz leads, 30 days"], ["Live", "your prices from Settings"]], "leads"],
      ["Intake and consent forms", "intake.html", "For clients", [[evs("intake", 7).length, "forms this week"], [intakeOpen().length, "waiting for a nurse"]], "today"],
      ["Waitlist slot filler", "waitlist.html", "For clients", [[wp, "people waiting"], [wf, "spots filled, 30 days"]], "today"],
      ["Training and protocols hub", "training.html", "For the team", [[tr.protocols.length, "treatment protocols"], [signed, "signed off"]], "team"],
      ["Therapist scorecard", "scorecard.html", "For the team", [[tap30, "treatments, 30 days"], [money(sumV(evs("product_sold", 30))), "retail, 30 days"]], "team"],
      ["Stock tracker", "stock.html", "For you", [[low, "items running low"], [unc, "not counted yet"]], ""],
      ["Ad compliance checker", "compliance.html", "For you", [["Live", "paste any ad or message"], ["AHPRA", "TGA and Spam Act checks"]], ""],
      ["Offer page builder", "offers.html", "For you", [[ld.filter(function (e) { return e.s === "offer-page"; }).length, "offer claims, 30 days"], ["Live", "spots left counter"]], "leads"],
      ["Website and review monitor", "monitor.html", "For you", [[site ? (site.up ? "Up" : "Down") : "...", site && site.up ? "loads in " + (site.ms / 1000).toFixed(1) + "s" : "checked each refresh"], ["Soon", "Google reviews, once the profiles are shared"]], "connections"]
    ];
  }
  function renderApps() {
    if (LIVE) {
      $("v-apps").innerHTML = MSGCARD + '<div class="card soft" style="margin-bottom:16px"><b>Every app is live and reports into Skinlux HQ.</b> <span class="muted">Numbers are for the clinic picked at the top. Client app links: open a client under Clients and press Client app link.</span></div>' +
        '<div class="grid g3">' + liveApps().map(function (a) {
          return '<div class="card"><div class="muted" style="font-size:12px;letter-spacing:1px;text-transform:uppercase">' + a[2] + '</div><h3 style="margin:4px 0 12px">' + a[0] + "</h3>" +
            '<div class="grid g2" style="gap:10px">' + a[3].map(function (k) { return '<div><div style="font-family:var(--serif);font-size:26px;font-weight:600;line-height:1.1">' + k[0] + '</div><div class="muted" style="font-size:12.5px">' + k[1] + "</div></div>"; }).join("") + "</div>" +
            '<div class="row" style="gap:8px;margin-top:14px">' + (a[1] ? '<a class="btn sm" href="' + a[1] + '" target="_blank" rel="noopener">Open app</a>' : '<button class="btn sm" data-go="clients">Find a client</button>') +
            (a[4] ? '<button class="btn sm ghost" data-go="' + a[4] + '">See it in HQ</button>' : "") + "</div></div>";
        }).join("") + "</div>";
      return;
    }
    var h = MSGCARD + '<div class="card soft" style="margin-bottom:16px"><b>Every app reports into Skinlux HQ.</b> <span class="muted">Each card shows the numbers for that app, for the clinic picked at the top. Open the app, or jump to where its work shows up in HQ.</span></div>' +
      '<div class="grid g3">' + appsData().map(function (a) {
        // Live apps (built and working) link to the real thing; the rest show the demo
        var LIVE_APPS = { "Staff app": ["../staff/index.html", "Live: treatment done, product sold and call backs"],
          "Ad compliance checker": ["compliance.html", "Live: paste any ad or message to check it"],
          "Treatment finder quiz": ["../quiz/index.html", "Live: quiz leads go to Leads and the new lead workflow"],
          "AI Skin Check": ["../skin-check/index.html", "Live: plan leads go to Leads and the new lead workflow"],
          "Offer page builder": ["offers.html", "Live: make offer pages with a spots left counter"] };
        var live = LIVE && LIVE_APPS[a[0]];
        if (LIVE) { a = a.slice(); a[3] = live ? [["Live", live[1]]] : [["Soon", "its numbers show here once this app is live"]]; a[1] = live ? live[0] : "../" + a[1]; }
        if (LIVE && a[0] === "Website and review monitor" && LIVE.site) { a[3] = [[LIVE.site.up ? "Up" : "Down", LIVE.site.up ? "website loads in " + (LIVE.site.ms / 1000).toFixed(1) + "s" : "website isn't answering"], ["Soon", "Google reviews, once Jellie shares the profiles"]]; a[4] = "connections"; }
        return '<div class="card"><div class="muted" style="font-size:12px;letter-spacing:1px;text-transform:uppercase">' + a[2] + '</div><h3 style="margin:4px 0 12px">' + a[0] + "</h3>" +
          '<div class="grid g2" style="gap:10px">' + a[3].map(function (k) { return '<div><div style="font-family:var(--serif);font-size:26px;font-weight:600;line-height:1.1">' + k[0] + '</div><div class="muted" style="font-size:12.5px">' + k[1] + "</div></div>"; }).join("") + "</div>" +
          '<div class="row" style="gap:8px;margin-top:14px"><a class="btn sm" href="' + a[1] + '" target="_blank" rel="noopener">' + (live ? "Open app" : LIVE ? "See the demo" : "Open app") + "</a>" +
          (a[4] ? '<button class="btn sm ghost" data-go="' + a[4] + '">See it in HQ</button>' : "") + "</div></div>";
      }).join("") + "</div>";
    $("v-apps").innerHTML = h;
  }

  /* ---------- Connections ---------- */
  function renderConn() {
    if (LIVE) {
      var on = LIVE.clinics || [];
      var site = LIVE.site || null;
      var siteTxt = !site ? "Waiting" : site.up ? "Up, loads in " + (site.ms / 1000).toFixed(1) + "s" : "DOWN, not answering";
      var LC = [
        ["GoHighLevel", on.length ? "Connected: " + on.map(LOC).join(" and ") : "Not connected", on.length === 2 ? "Live" : "Waiting"],
        ["Timely", "Clients, bookings, visits and sales through the Timely link", "Waiting"],
        ["clientcare inbox", "Incomplete booking emails, forwarded to GoHighLevel", "Waiting"],
        ["Shopify", "Online orders go to the product sale workflow", "Live"],
        ["Instagram, Facebook and WhatsApp", "Connected by Jellie inside GoHighLevel", "Waiting"],
        ["Google Business Profiles", "Reviews for both clinics", "Waiting"],
        ["Staff app", "Treatment done taps, product sales and training", "Live"],
        ["Intake forms and waitlist", "Client forms and waitlist joins, saved to GoHighLevel", LIVE.store ? "Live" : "Waiting"],
        ["My Skinlux client app", "Each client's private link, messages land as GoHighLevel tasks", "Live"],
        ["Quiz, Skin Check and offer pages", "Leads go into GoHighLevel and the Leads pipeline", "Live"],
        ["Website monitor", "skinluxfaceandbody.com.au, checked each time HQ refreshes", siteTxt]
      ];
      $("v-connections").innerHTML = '<div class="card"><div class="section-title"><h3>Connections</h3><span class="muted">Last sync ' +
        new Date(LIVE.syncedAt).toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" }) + "</span></div>" +
        LC.map(function (c) {
          var ok = c[2] === "Live" || /^Up/.test(c[2]), bad = /^DOWN/.test(c[2]);
          var dot = ok ? "" : bad ? ' style="background:#c0392b;box-shadow:0 0 0 3px #f6d5d1"' : ' style="background:var(--warn);box-shadow:0 0 0 3px var(--warn-soft)"';
          return '<div class="conn"><i' + dot + '></i><div><b>' + c[0] + '</b><div class="muted" style="font-size:13px">' + c[1] + '</div></div><small' + (bad ? ' style="color:#c0392b;font-weight:600"' : ' class="muted"') + '>' + c[2] + "</small></div>";
        }).join("") +
        ((LIVE.errors || []).length ? '<p class="muted" style="margin-top:10px">Not read this time: ' + esc(LIVE.errors.join(", ")) + "</p>" : "") + "</div>";
      return;
    }
    var CONN = [
      ["Timely", "Clients, bookings, visits and sales. Direct connection, no Zapier.", "Synced 2 min ago"],
      ["GoHighLevel", "Emails, texts, tags, waits and team tasks", "Live"],
      ["clientcare inbox", "Reads Timely's incomplete booking and confirmation emails", "Checked 1 min ago"],
      ["WhatsApp Business", "Booragoon and Leederville numbers", "Live"],
      ["Instagram and Facebook", "DMs and comments, straight into the inbox", "Live"],
      ["Google Business Profile", "Reviews for both clinics", "Checked 5 min ago"],
      ["Staff app", "5 team members signed in", "Live"],
      ["Website", "skinluxfaceandbody.com.au, checked every minute", "Up, loads in 1.2s"]
    ];
    var low = STOCK.filter(function (s) { return inClinic(s.c); });
    var h = '<div class="grid g2"><div class="card"><div class="section-title"><h3>Connected</h3><span class="muted">' + CONN.length + " of " + CONN.length + " working</span></div>" +
      CONN.map(function (c) { return '<div class="conn"><i></i><div><b>' + c[0] + '</b><div class="muted" style="font-size:13px">' + c[1] + '</div></div><small class="muted">' + c[2] + "</small></div>"; }).join("") + "</div>" +
      '<div class="stack"><div class="card"><div class="section-title"><h3>Stock running low</h3><span class="muted">From the stock tracker</span></div>' +
      (low.length ? low.map(function (s) {
        var i = STOCK.indexOf(s);
        return '<div class="conn"><i style="background:var(--warn);box-shadow:0 0 0 3px var(--warn-soft)"></i><div><b>' + s.n + '</b><div class="muted" style="font-size:13px">' + LOC(s.c) + ": " + s.left + " left, reorder at " + s.min + "</div></div>" +
          (s.ordered ? '<small class="muted">Order drafted</small>' : '<button class="btn sm ghost" data-stock="' + i + '">Draft order</button>') + "</div>";
      }).join("") : '<p class="muted">Nothing low.</p>') + "</div>" +
      '<div class="card"><div class="section-title"><h3>Website history</h3><span class="muted">Last 7 days</span></div><div class="log">' +
      "<div><span>Sat</span>Down for 41 minutes. Jellie got a text within 1 minute.</div><div><span>Sat</span>Back up. Ads were sending people to the offer pages the whole time.</div><div><span>Today</span>Up all day, average load 1.2 seconds.</div></div></div>" +
      '<div class="card"><div class="section-title"><h3>Sync log</h3><span class="muted">Today</span></div><div class="log">' +
      "<div><span>2:38pm</span>Timely: 3 new bookings and 1 new client synced</div><div><span>2:31pm</span>GoHighLevel: abandoned booking email 1 sent to Kate Lowe</div>" +
      "<div><span>2:21pm</span>Skin Check: Sarah Ng added as a lead, Booragoon alerted</div><div><span>2:20pm</span>Staff app: Nurse Leo tapped done for Jade Wilson</div>" +
      "<div><span>1:58pm</span>SMS: Chloe Bennett replied, task created for Sharon</div></div></div></div></div>";
    $("v-connections").innerHTML = h;
  }

  /* ---------- Notifications ---------- */
  function notifs() {
    var out = [];
    if (LIVE && LIVE.site && !LIVE.site.up) out.push({ k: "site" + new Date().toDateString(), cls: "bad", t: "<b>The website is down.</b> skinluxfaceandbody.com.au isn't answering. Call the web host.", go: ["connections"] });
    openConvos().forEach(function (v) {
      if (v.nurse) out.push({ k: "n" + v.id, cls: "bad", t: "<b>" + esc(v.name) + "</b> needs a nurse: " + esc(v.msgs.filter(function (m) { return m.f === "them"; }).slice(-1)[0].t), go: ["inbox", v.id] });
      else if (v.ch === "scan" && v.unread) out.push({ k: "s" + v.id, cls: "warn", t: "<b>" + esc(v.name) + "</b> did the Skin Check. Call within 15 minutes.", go: ["inbox", v.id] });
    });
    todayIssues().forEach(function (x) {
      out.push({ k: "d" + x.a.n, cls: "warn", t: x.a.st === "notap" ? "<b>" + x.a.n + "</b> finished at " + x.a.t + " but " + x.a.s.split(" ")[0] + " hasn't tapped done" : "<b>" + x.a.n + "</b> hasn't paid the deposit for " + x.a.t + " " + x.a.tr, go: ["today"] });
    });
    REVIEWS.forEach(function (r) { if (inClinic(r.c) && !r.replied && r.s <= 3) out.push({ k: "r" + r.n, cls: "bad", t: "New " + r.s + " star review from <b>" + r.n + "</b>", go: ["reviews"] }); });
    STOCK.forEach(function (s) { if (inClinic(s.c) && !s.ordered) out.push({ k: "k" + s.n + s.c, cls: "", t: "<b>" + esc(s.n) + "</b> is low at " + LOC(s.c) + " (" + s.left + " left)", go: [LIVE ? "apps" : "connections"] }); });
    if (LIVE) intakeOpen().forEach(function (f) { out.push({ k: "i" + f.id, cls: f.flags.some(function (x) { return /^STOP/.test(x); }) ? "bad" : "warn", t: "<b>" + esc(f.n) + "</b>'s intake form needs a nurse: " + esc(f.flags.join(", ")), go: ["today"] }); });
    return out;
  }
  function renderBell() {
    var list = notifs(), unread = list.filter(function (n) { return !ui.read[n.k]; }).length;
    $("bellCt").textContent = unread ? unread : "";
    if ($("bellPop").hidden) return;
    $("bellPop").innerHTML = '<div class="bp-head"><b>Notifications</b><button class="lnk" data-act="readall">Mark all read</button></div>' +
      (list.length ? list.map(function (n, i) { return '<div class="bp-item" data-ni="' + i + '"><i class="' + n.cls + '"></i><div' + (ui.read[n.k] ? ' style="opacity:.6"' : "") + ">" + n.t + "</div></div>"; }).join("") : '<div class="empty">All clear.</div>');
    $("bellPop")._list = list;
  }
  function closeBell() { $("bellPop").hidden = true; }

  /* ---------- Live events, so the demo feels alive ---------- */
  function liveEvents() {
    setTimeout(function () {
      CONVOS.unshift({ id: "c20", name: "@mel.skinjourney", ch: "ig", clinic: "leederville", at: "Just now", unread: true, inj: true, assigned: "Nurse Maria", phone: "Instagram DM",
        wf: "Injectable question: compliance check on",
        msgs: [{ f: "them", t: "Hey, do you do lip filler? What's the price?", at: "Just now" }],
        draft: "Hi Mel, yes, our registered nurses do lip treatments at Leederville. Pricing is given at a free consultation so it's matched to you. Nurse Maria has Thursday 3pm or Saturday 10am free. Which suits?" });
      renderAll();
      toast("New Instagram message at Leederville. It's an injectable question, so the compliance check is on for the reply.");
    }, 25000);
    setTimeout(function () {
      CONVOS.unshift({ id: "c21", name: "Tegan Brooks", ch: "scan", clinic: "booragoon", at: "Just now", unread: true, assigned: "Sharon Kim", phone: "0419 664 205",
        wf: "Skin Check lead: call within 15 minutes",
        msgs: [{ f: "sys", t: "Did the AI Skin Check from the QR code at reception. Score 71. Focus: firmness, fine lines, texture." },
          { f: "bot", t: "Hi Tegan, here's your Skinlux 12 week plan: Diamond Polar RF and Clinical Peels, from $1,780, plus a free nurse consult for fine lines. Book here: skinlux.au/plan/tb71", at: "Just now" },
          { f: "sys", t: "Alert sent to Booragoon: call Tegan within 15 minutes." }],
        draft: "Hi Tegan, it's Sharon at Skinlux Booragoon. Thanks for doing the skin check. Can I call you to book your first session?" });
      LEADS.unshift({ n: "Tegan Brooks", src: "Skin Check", i: "12 week plan", c: "booragoon", s: 0, age: "Just now", v: 1780, cv: "c21", fresh: true });
      renderAll();
      toast("New Skin Check lead at Booragoon: Tegan Brooks. Sharon has 15 minutes to call.");
    }, 60000);
  }

  /* ---------- Events ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target;
    var g = t.closest("[data-go]");
    if (g) {
      var dest = g.getAttribute("data-go");
      if (dest.charAt(0) === "#") { go("overview"); var el = document.querySelector(dest); if (el) setTimeout(function () { el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 50); }
      else go(dest);
      return;
    }
    var gc = t.closest("[data-goconvo]");
    if (gc) { closeClient(); go("inbox", gc.getAttribute("data-goconvo")); return; }
    var np = t.closest("[data-np]");
    if (np) { ui_np = np.getAttribute("data-np"); renderLiveNumbers(); return; }
    var cl = t.closest("[data-client]");
    if (cl && !t.closest("#cpanel")) { openClient(cl.getAttribute("data-client")); return; }
    var it = t.closest("[data-cv]");
    if (it) { ui.convo = it.getAttribute("data-cv"); ui.warn = null; renderInbox(); return; }
    var f = t.closest("[data-ibf]");
    if (f) { ui.ibf = f.getAttribute("data-ibf"); renderInbox(); return; }
    var cf = t.closest("[data-cf]");
    if (cf) { ui.cf = cf.getAttribute("data-cf"); renderClients(); return; }
    var ap = t.closest("[data-appt]");
    if (ap) { apptAction(ap.getAttribute("data-appt")); return; }
    var ld = t.closest("[data-lead]");
    if (ld) {
      var l = LEADS[+ld.getAttribute("data-lead")]; l.s++; l.fresh = false;
      if (LIVE && l.id) {
        var K3 = null; try { K3 = localStorage.getItem("skinluxhq-key"); } catch (e3) {}
        var H3 = { "Content-Type": "application/json" }; if (K3) H3.Authorization = "Bearer " + K3;
        fetch("/api/skinlux-hq/apps", { method: "POST", credentials: "include", headers: H3, body: JSON.stringify({ action: "lead-stage", id: l.id, clinic: l.c, stage: l.s }) })
          .then(function (r) { return r.json(); }).then(function (d) { if (!d.ok) { l.s--; renderAll(); toast(d.error || "GoHighLevel didn't take that change"); } }).catch(function () { l.s--; renderAll(); toast("Couldn't reach GoHighLevel"); });
      }
      toast(l.n + " moved to " + STAGES[l.s] + (l.s === 3 ? ". Booked in Timely, and the follow ups stop." : "."));
      renderAll(); return;
    }
    var fw = t.closest("[data-flow]");
    if (fw) {
      var fi = +fw.getAttribute("data-flow"), fl = FLOWS[fi];
      if (LIVE && FLOW_AUTO[fi]) { liveFlowToggle(fi, fl); return; }
      fl.on = !fl.on;
      toast(fl.n + (fl.on ? " is back on." : " is paused. Nobody new enters it."));
      renderFlows(); return;
    }
    var rv = t.closest("[data-review]");
    if (rv) {
      var i = +rv.getAttribute("data-review"), r = REVIEWS[i];
      r.reply = $("rv" + i).value.trim() || r.draft; r.replied = true;
      if (r.cv) { var c6 = convo(r.cv); if (c6) { c6.status = "done"; c6.msgs.push({ f: "us", t: r.reply, at: "Just now", by: "Jellie" }); } }
      toast("Reply posted on Google for " + LOC(r.c) + ".");
      renderAll(); return;
    }
    var stk = t.closest("[data-stock]");
    if (stk) { var s = STOCK[+stk.getAttribute("data-stock")]; s.ordered = true; toast("Order drafted for " + s.n + " at " + LOC(s.c) + ". It's in your email to check and send."); renderAll(); return; }
    var ms = t.closest("[data-msgstaff]");
    if (ms) { toast("Chat with " + ms.getAttribute("data-msgstaff") + " opened on the staff app."); return; }
    var ca = t.closest("[data-cact]");
    if (ca && LIVE) {
      var a2 = ca.getAttribute("data-cact"), pd2 = $("cpanel").dataset;
      if (a2 === "book") { window.open(S.booking, "_blank", "noopener"); return; }
      if (a2 === "app") {
        var K2 = null; try { K2 = localStorage.getItem("skinluxhq-key"); } catch (e2) {}
        fetch("/api/skinlux-hq/apps?link=" + encodeURIComponent(pd2.cid) + "&clinic=" + pd2.cclinic, { credentials: "include", cache: "no-store", headers: K2 ? { Authorization: "Bearer " + K2 } : {} })
          .then(function (r) { return r.json(); }).then(function (d) {
            if (!d.ok) { toast(d.error || "Couldn't make the link"); return; }
            (navigator.clipboard ? navigator.clipboard.writeText(d.url) : Promise.reject()).then(function () { toast("Client app link copied. It's also saved on their GoHighLevel record."); }, function () { prompt("Copy this link", d.url); });
          }).catch(function () { toast("Couldn't make the link. Try again."); });
        return;
      }
      return;
    }
    if (ca) {
      var who = $("cpanel").dataset.client, a = ca.getAttribute("data-cact");
      toast(a === "book" ? "Timely opened at " + who + "'s profile to book." : a === "wait" ? who + " is on the waitlist. They get a text when a matching slot opens." : "New message to " + who + " started in the Inbox.");
      return;
    }
    var ni = t.closest("[data-ni]");
    if (ni) { var n = $("bellPop")._list[+ni.getAttribute("data-ni")]; ui.read[n.k] = true; go(n.go[0], n.go[1]); return; }
    var act = t.closest("[data-act]");
    if (act) {
      var k = act.getAttribute("data-act"), v = convo(ui.convo);
      if (k === "readall") { notifs().forEach(function (x) { ui.read[x.k] = true; }); renderBell(); return; }
      if (k === "teammsg") { var m = $("teamMsg").value.trim(); if (!m) { toast("Type a message first"); return; } $("teamMsg").value = ""; toast("Sent to the team at " + LOC(clinic()) + " on the staff app."); return; }
      if (!v) return;
      if (k === "ai") { v.typed = v.draft; ui.warn = null; renderInbox(); toast("Draft written from your price list and aftercare notes. Check it, then send."); return; }
      if (k === "send") { sendReply(); return; }
      if (k === "fix") { v.typed = v.inj ? (v.draft && !RISKY_INJ.test(v.draft) ? v.draft : SAFE_INJ) : v.draft; ui.warn = null; renderInbox(); return; }
      if (k === "book" && LIVE) { window.open(S.booking, "_blank", "noopener"); return; }
      if (k === "book") {
        v.msgs.push({ f: "sys", t: "Booked in Timely by Jellie. Every follow up for " + v.name.split(" ")[0] + " has stopped and a confirmation went out." });
        v.wf = "Booked"; v.status = "done";
        LEADS.forEach(function (l) { if (l.cv === v.id && l.s < 3) l.s = 3; });
        ui.ibf = "all"; toast("Booked in Timely. Moved to Done, and the lead is marked Booked."); renderAll(); return;
      }
      if (k === "done") { v.status = v.status === "done" ? "open" : "done"; if (v.status === "done") { v.nurse = false; } toast(v.status === "done" ? v.name + " marked done." : v.name + " reopened."); renderAll(); return; }
    }
    if (t.closest("#bell")) {
      var p = $("bellPop"), br = $("bell").getBoundingClientRect();
      p.style.right = Math.max(12, document.documentElement.clientWidth - br.right) + "px";
      p.hidden = !p.hidden; renderBell(); return;
    }
    if (!t.closest("#bellPop")) closeBell();
  });
  document.addEventListener("input", function (e) {
    if (e.target.id === "reply") { var v = convo(ui.convo); if (v) v.typed = e.target.value; }
    if (e.target.id === "search") { ui.q = e.target.value; if (ui.view !== "clients") go("clients"); else renderClients(); }
  });
  document.addEventListener("change", function (e) {
    if (e.target.id === "ibCh") { ui.ibch = e.target.value; renderInbox(); }
    if (e.target.id === "quick" && e.target.value) {
      var qv = convo(ui.convo); if (!qv) return;
      var first = String(qv.name || "").split(" ")[0], loc = S.locations[qv.clinic] || {}, nm = /^guest|^unknown|^@/i.test(first) ? "" : " " + first;
      var Qr = {
        book: "Hi" + nm + ", you can pick a time that suits you here: " + S.booking + " Any questions, just reply here.",
        hours: "Hi" + nm + ", Skinlux " + (loc.name || "") + " is at " + (loc.address || "") + ". " + (loc.hours ? "We're open " + loc.hours + ". " : "") + "You can reach us on " + (loc.phone || "") + ".",
        consult: "Hi" + nm + ", the best first step is a free consult with one of our nurses, so they can talk through what suits you. You can book it here: " + S.booking,
        thanks: "Thanks" + nm + ", one of the team will give you a call shortly."
      };
      qv.typed = Qr[e.target.value].replace(/\s+/g, " ").trim(); ui.warn = null; renderInbox();
    }
    if (e.target.id === "thAssign") {
      var v = convo(ui.convo); v.assigned = e.target.value;
      v.msgs.push({ f: "sys", t: v.assigned ? "Assigned to " + v.assigned + ". They got a ping on the staff app." : "Unassigned." });
      renderInbox(); toast(v.assigned ? "Assigned to " + v.assigned + "." : "Unassigned.");
    }
  });
  $("segClinic").addEventListener("click", function () { setTimeout(renderAll, 0); });
  $("scrim2").addEventListener("click", closeClient);
  $("cpClose").addEventListener("click", closeClient);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeClient(); closeBell(); } });
  // The old task panel's Mark done changes overdue counts.
  var tbd = $("taskBody"); if (tbd) tbd.addEventListener("click", function () { setTimeout(renderNeeds, 0); });
  var pd = $("pnDone"); if (pd) pd.addEventListener("click", function () { setTimeout(renderNeeds, 0); });

  function fitBar() { document.documentElement.style.setProperty("--db", (document.querySelector(".demo-bar") ? document.querySelector(".demo-bar").offsetHeight : 0) + "px"); }
  window.addEventListener("resize", fitBar);
  fitBar();
  $("bellIcon").innerHTML = I("bell", 19);
  var start = (location.hash || "").slice(1);
  go(TITLES[start] ? start : "overview");
  if (!LIVE) liveEvents();
})();
