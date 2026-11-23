// Skinlux demo suite: offline "AI" concierge. Answers from window.SKINLUX only.
// window.SkinluxConcierge.reply(text) -> { text, links:[{label,url}], tags:[], concern, treatment, handoff }
(function () {
  var S = window.SKINLUX;
  var lastLocation = null;

  var ALIASES = {
    "relaxers": ["botox", "dysport", "xeomin", "wrinkle relax\\w*", "anti ?wrinkle", "muscle relax\\w*", "injectables?", "frown lines?"],
    "rejuran": ["rejuran", "salmon", "bio ?stimul\\w*", "polynucleotides?", "skin boosters?"],
    "fillers": ["fillers?", "lip fill\\w*", "dermal fill\\w*", "cheek fill\\w*"],
    "ipl-skin": ["ipl skin", "ipl facial", "skin correction", "photo ?rejuv\\w*"],
    "ipl-hair": ["ipl hair", "shr", "laser hair", "hair removal", "brazilian", "underarms?", "unwanted hair"],
    "hifu": ["hifu", "ultrasound lift"],
    "carbon": ["carbon", "laser facial", "hollywood"],
    "needling": ["needling", "micro ?needling", "collagen induction"],
    "bright": ["bright (and|&) tight", "bright tight"],
    "advanced-peel": ["advanced peels?", "cosmelan", "alpha beta", "level [23] peel"],
    "clinical-peel": ["clinical peels?", "resurfacing peel", "peels?", "chemical peels?"],
    "nano-rf": ["nano", "fractional rf", "fractional", "rf needling"],
    "diamond": ["diamond", "polar"],
    "electro": ["electrocautery", "skin tags?", "cherry angiomas?"],
    "exogrow": ["exo ?grow", "hair loss", "hair regrowth", "thinning hair"],
    "led": ["led", "light therapy"],
    "body": ["ems", "ems lux", "venus", "venus legacy", "body sculpt\\w*", "sculpting"],
    "plasma": ["plasma", "fibroblast"]
  };

  // Concern words a visitor might type, mapped to concern keys in the data.
  var CONCERNS = [
    ["acne scars", ["acne scars?", "scarring", "scars?", "pitted", "pock ?marks?"]],
    ["acne", ["acne", "breakouts?", "pimples?", "spots on my"]],
    ["pigmentation", ["pigment\\w*", "sun ?spots?", "dark spots?", "melasma", "age spots?"]],
    ["rosacea", ["rosacea", "redness", "red skin", "flushing"]],
    ["fine lines", ["wrinkles?", "fine lines?", "lines", "crow'?s feet"]],
    ["sagging", ["sag\\w*", "jowls?", "jawline", "lift\\w*", "droopy"]],
    ["double chin", ["double chin"]],
    ["pores", ["pores", "congest\\w*", "blackheads?"]],
    ["dull skin", ["dull", "glow", "tired skin", "brighten\\w*"]],
    ["texture", ["texture", "rough skin", "bumpy"]],
    ["tightening", ["loose skin", "tighten\\w*", "firm\\w*", "crepey"]],
    ["stubborn fat", ["fat", "cellulite", "tummy", "stomach", "love handles"]],
    ["hooded eyelids", ["hooded", "eyelids?"]],
    ["ageing", ["ageing", "aging", "anti ?age\\w*", "older"]]
  ];

  // Curated picks where the data alone would be too broad.
  var PICKS = {
    "acne scars": ["needling", "nano-rf", "rejuran"],
    "acne": ["carbon", "clinical-peel", "led"],
    "pigmentation": ["ipl-skin", "needling", "advanced-peel"],
    "rosacea": ["ipl-skin", "led", "rejuran"],
    "fine lines": ["diamond", "nano-rf", "relaxers"],
    "sagging": ["hifu", "diamond", "fillers"],
    "double chin": ["hifu"],
    "dull skin": ["bright", "clinical-peel", "led"],
    "stubborn fat": ["body"]
  };

  var INTENTS = {
    price: /\b(price|prices|pricing|cost|costs|how much|\$|fee|fees|expensive|cheap)\b/,
    downtime: /\b(downtime|down time|recovery|red after|redness after|back to work|go out after|heal)\b/,
    sessions: /\b(how many|sessions?|treatments? do i need|course|how often)\b/,
    aftercare: /\b(after ?care|after the treatment|look after|avoid|make ?up|shower|gym|exercise|swim|wash my face|sun after)\b/,
    duration: /\b(how long (does|is) (it|the)|how long|take long)\b/,
    hours: /\b(open|opening|hours|close|closing|closed|saturday|sunday|monday|tuesday|wednesday|thursday|friday|today|tonight|weekend|late)\b/,
    address: /\b(address|where are you|located|location|find you|directions)\b/,
    which: /\b(which clinic|closest|nearest|both clinics|two clinics|clinics)\b/,
    parking: /\b(park|parking|car)\b/,
    vouchers: /\b(vouchers?|gift cards?|gift)\b/,
    deposit: /\b(deposits?|pay upfront|pay up front|prepay)\b/,
    book: /\b(book|booking|appointment|available|availability|spot|slot)\b/,
    recommend: /\b(recommend|suggest|best for|what (should|can|do) (i|you)|help with|treat|good for|options?)\b/,
    hello: /^(hi|hey|hello|good (morning|afternoon|evening)|g'?day)\b/,
    thanks: /\b(thanks|thank you|cheers|ta)\b/,
    human: /\b(human|person|real person|staff|call me|speak to|talk to)\b/
  };

  var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var DAY_WORDS = { sun: 0, sunday: 0, mon: 1, monday: 1, tue: 2, tues: 2, tuesday: 2, wed: 3, wednesday: 3, thu: 4, thur: 4, thurs: 4, thursday: 4, fri: 5, friday: 5, sat: 6, saturday: 6 };

  function rx(list) { return new RegExp("\\b(" + list.join("|") + ")\\b", "i"); }
  function byId(id) { for (var i = 0; i < S.treatments.length; i++) if (S.treatments[i].id === id) return S.treatments[i]; return null; }
  function displayName(t) { return t.injectable ? t.name.replace(/\s*\(.*\)\s*/, "") : t.name; }
  function lc(s) { return s.charAt(0).toLowerCase() + s.slice(1); }
  function trimDot(s) { return s.replace(/\.\s*$/, ""); }

  function parseHours(str) {
    var map = {};
    str.split(", ").forEach(function (seg) {
      var m = seg.match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)(?: to (Mon|Tue|Wed|Thu|Fri|Sat|Sun))? (.*)$/);
      if (!m) return;
      var a = DAYS.indexOf(m[1]), b = m[2] ? DAYS.indexOf(m[2]) : a;
      for (var d = a; d <= b; d++) map[d] = m[3];
    });
    return map;
  }

  function findLocation(t) {
    if (/leederville|leedy|vincent st|north of the river/i.test(t)) return "leederville";
    if (/booragoon|garden city|riseley|south of the river/i.test(t)) return "booragoon";
    return null;
  }

  function findTreatment(t) {
    var order = ["relaxers", "rejuran", "fillers", "ipl-skin", "ipl-hair", "hifu", "carbon", "needling", "bright", "advanced-peel", "clinical-peel", "nano-rf", "diamond", "electro", "exogrow", "led", "body", "plasma"];
    for (var i = 0; i < order.length; i++) if (rx(ALIASES[order[i]]).test(t)) return byId(order[i]);
    if (/\bipl\b/i.test(t)) return byId(/pigment|rosacea|red|sun|spot/i.test(t) ? "ipl-skin" : "ipl-hair");
    if (/\blaser\b/i.test(t)) return byId("carbon");
    return null;
  }

  function findConcern(t) {
    for (var i = 0; i < CONCERNS.length; i++) if (rx(CONCERNS[i][1]).test(t)) return CONCERNS[i][0];
    return null;
  }

  function picksFor(concern) {
    var ids = PICKS[concern];
    if (!ids) {
      ids = S.treatments.filter(function (x) { return x.concerns.indexOf(concern) > -1; })
        .sort(function (a, b) { return (a.injectable ? 1 : 0) - (b.injectable ? 1 : 0); })
        .slice(0, 3).map(function (x) { return x.id; });
    }
    return ids.map(byId).filter(Boolean);
  }

  function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

  var BOOK = function (label) { return { label: label || "Book online", url: S.booking }; };
  var CONSULT = { label: "Book a complimentary consult", url: S.booking };

  function injectableReply(t, intents) {
    var name = lc(displayName(t));
    var txt;
    if (intents.downtime) {
      txt = "Downtime for " + name + ": " + lc(t.downtime) + "\n\nEverything starts with a complimentary consultation with Nurse Leo or Nurse Maria, so they can check it's right for you.";
    } else if (intents.duration) {
      txt = "The appointment itself takes " + t.time + ". Your first visit is a complimentary consultation with one of our nurses.";
    } else {
      var what = t.id === "rejuran" ? "this is a prescription treatment" : name + " are prescription treatments";
      txt = "Good question. Because " + what + ", we don't share pricing or product details online. Your first step is a complimentary consultation with Nurse Leo or Nurse Maria. They'll look at your skin, talk through options and give you pricing in person, with no pressure to go ahead.";
    }
    return { text: txt, links: [CONSULT], tags: ["interest-injectables", "consult-request"], treatment: t.id };
  }

  function hoursReply(t, loc) {
    var dayMatch = t.match(/\b(sun|sunday|mon|monday|tue|tues|tuesday|wed|wednesday|thu|thur|thurs|thursday|fri|friday|sat|saturday)\b/i);
    var day = null;
    if (dayMatch) day = DAY_WORDS[dayMatch[1].toLowerCase()];
    else if (/\b(today|tonight)\b/i.test(t)) day = new Date().getDay();
    else if (/\bweekend\b/i.test(t)) day = 6;
    var locs = loc ? [loc] : ["booragoon", "leederville"];
    if (day === null) {
      return locs.map(function (k) { return S.locations[k].name + ": " + S.locations[k].hours + "."; }).join("\n\n");
    }
    var dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][day];
    var lines = locs.map(function (k) {
      var h = parseHours(S.locations[k].hours)[day];
      if (!h || /closed/i.test(h)) return S.locations[k].name + " is closed on " + dayName + "s.";
      return S.locations[k].name + " is open " + dayName + " " + h + ".";
    });
    var first = lines.length === 1 && !/closed/.test(lines[0]) ? "Yes, " + lines[0] : lines.join("\n");
    if (day === 0) first += "\nWe're open Saturdays 9am to 5pm at both clinics.";
    return first;
  }

  function reply(input) {
    var raw = String(input || "").trim();
    var t = raw.toLowerCase();
    if (!t) return { text: "Ask me anything about our treatments, prices, clinics or bookings.", links: [], tags: [] };

    var intents = {};
    Object.keys(INTENTS).forEach(function (k) { intents[k] = INTENTS[k].test(t); });
    var loc = findLocation(t);
    if (loc) lastLocation = loc;
    var tr = findTreatment(t);
    var concern = findConcern(t);
    if (tr && concern && /\b(price|cost|how much)\b/.test(t)) concern = null;
    var tags = [];
    if (loc) tags.push("location-" + loc);

    // Treatment specific questions
    if (tr) {
      tags.push("interest-" + tr.id);
      if (tr.injectable) {
        var r = injectableReply(tr, intents);
        r.tags = r.tags.concat(tags);
        return r;
      }
      var name = tr.name;
      var parts = [];
      if (intents.price) parts.push(name + " pricing: " + trimDot(tr.price) + ".");
      if (intents.downtime) parts.push("Downtime for " + lc(name) + ": " + lc(tr.downtime));
      if (intents.duration) parts.push("It takes " + tr.time + ".");
      if (intents.sessions) parts.push("Course: " + trimDot(tr.course) + ".");
      if (intents.aftercare) {
        parts.push(/confirm/i.test(tr.aftercare)
          ? "Your therapist will go through aftercare with you on the day and send it to your phone."
          : "Aftercare: " + tr.aftercare);
      }
      if (intents.deposit) parts.push(depositFor(tr));
      if (!parts.length) {
        parts.push(name + " is great for " + tr.concerns.slice(0, 3).join(", ") + ". It takes " + tr.time + ", downtime: " + lc(trimDot(tr.downtime)) + ". " + trimDot(tr.results) + ".");
        parts.push("Pricing: " + trimDot(tr.price) + ".");
      }
      if (intents.price && !intents.downtime && tr.downtime) parts.push("Downtime: " + lc(trimDot(tr.downtime)) + ".");
      return { text: parts.join("\n\n"), links: [BOOK("Book " + name.replace(/\s*\(.*\)\s*/, ""))], tags: tags, treatment: tr.id };
    }

    // Concern based recommendation
    if (concern) {
      tags.push("concern-" + slug(concern));
      var picks = picksFor(concern);
      var nonInj = picks.filter(function (x) { return !x.injectable; });
      var inj = picks.filter(function (x) { return x.injectable; });
      var lines = ["For " + concern + ", these are what our therapists usually suggest:"];
      nonInj.forEach(function (x) {
        lines.push(x.name + ": " + trimDot(x.results) + ". Downtime: " + lc(trimDot(x.downtime)) + ".");
      });
      inj.forEach(function (x) {
        lines.push(displayName(x) + " with one of our nurses. This starts with a complimentary consultation.");
      });
      lines.push("Not sure which? A skin consult is the best place to start, and we'll build a plan around you.");
      return {
        text: lines.join("\n\n"),
        links: [BOOK("Book a skin consult")],
        tags: tags, concern: concern
      };
    }

    // General clinic questions
    if (intents.deposit) {
      return { text: "Some treatments need a deposit when you book online, either $50 or $100 depending on the treatment. It isn't an extra cost: it comes straight off your treatment on the day.", links: [BOOK()], tags: tags };
    }
    if (intents.parking) {
      var pB = "Booragoon has free parking. We're on Level 2 at 135 Riseley St, right next to Garden City.";
      var pL = "Leederville is at 316 Vincent St. There's street parking close by, and the team can point you to the easiest spot when you book.";
      var p = loc === "leederville" ? pL : loc === "booragoon" ? pB : pB + "\n\n" + pL;
      return { text: p, links: [], tags: tags };
    }
    if (intents.vouchers) {
      return { text: "Yes, we have gift vouchers for any amount. You can buy them online and they're emailed the same day, so they're perfect for last minute gifts.", links: [{ label: "Buy a gift voucher", url: S.vouchers }], tags: tags.concat(["interest-vouchers"]) };
    }
    if (intents.address || intents.which) {
      var a = loc ? [loc] : ["booragoon", "leederville"];
      var txt = a.map(function (k) { return S.locations[k].name + ": " + S.locations[k].address + ". Phone " + S.locations[k].phone + "."; }).join("\n\n");
      if (!loc) txt = "We have two clinics:\n\n" + txt + "\n\nBooragoon suits the southern suburbs, Leederville is handy for the city and western suburbs.";
      return { text: txt, links: [BOOK()], tags: tags };
    }
    if (intents.hours) {
      return { text: hoursReply(t, loc || null), links: [BOOK()], tags: tags };
    }
    if (intents.book) {
      return { text: "You can book online any time, day or night. Pick your clinic and treatment, and you'll get a confirmation by text.", links: [BOOK()], tags: tags.concat(["intent-book"]) };
    }
    if (intents.human) {
      return { text: "Of course. I'll pass this to the team now and someone will get back to you today. What's the best first name and mobile to reach you on?", links: [], tags: tags.concat(["handoff"]), handoff: true };
    }
    if (intents.hello) {
      return { text: "Hi, welcome to Skinlux. I can help with treatments, prices, downtime, our two clinics or booking. What would you like to know?", links: [], tags: tags };
    }
    if (intents.thanks) {
      return { text: "You're welcome. We'd love to see you soon.", links: [BOOK()], tags: tags };
    }
    if (intents.recommend) {
      return { text: "Happy to help. Tell me a little about your skin: is it acne scars, pigmentation, redness, fine lines, sagging, or something else? Or book a skin consult and we'll look together.", links: [BOOK("Book a skin consult")], tags: tags };
    }
    return {
      text: "I want to get that right for you, so I'll pass it to the team and they'll reply today. Can I grab your first name and mobile?",
      links: [], tags: tags.concat(["handoff", "unanswered"]), handoff: true
    };
  }

  function depositFor(tr) {
    if (["ipl-hair", "nano-rf", "hifu", "ipl-skin"].indexOf(tr.id) > -1) {
      return "Some " + lc(tr.name) + " bookings need a $50 deposit online. It comes straight off your treatment on the day.";
    }
    return "If your booking needs a deposit, it's $50 or $100 and it comes straight off your treatment on the day.";
  }

  // UI helpers -------------------------------------------------------------
  function injectCss() {
    if (document.getElementById("concierge-css")) return;
    var st = document.createElement("style");
    st.id = "concierge-css";
    st.textContent =
      ".typing{display:inline-flex;gap:4px;align-items:center;padding:12px 14px}" +
      ".typing i{width:7px;height:7px;border-radius:99px;background:var(--taupe);animation:cdot 1s infinite ease-in-out}" +
      ".typing i:nth-child(2){animation-delay:.15s}.typing i:nth-child(3){animation-delay:.3s}" +
      "@keyframes cdot{0%,80%,100%{opacity:.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}" +
      ".msg .links{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}" +
      ".msg .links a{display:inline-block;padding:5px 10px;border-radius:99px;background:var(--gold-soft);color:var(--mocha);text-decoration:none;font-size:13px}" +
      ".msg{animation:cin .2s ease-out}@keyframes cin{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}";
    document.head.appendChild(st);
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function scroll(el) { var box = el.closest(".app-body") || el.parentElement || el; box.scrollTop = box.scrollHeight; el.scrollTop = el.scrollHeight; }

  function addUser(chatEl, text) {
    var d = document.createElement("div");
    d.className = "msg me";
    d.textContent = text;
    chatEl.appendChild(d); scroll(chatEl);
    return d;
  }

  function addBot(chatEl, r) {
    var d = document.createElement("div");
    d.className = "msg bot";
    var html = esc(r.text);
    if (r.links && r.links.length) {
      html += '<div class="links">' + r.links.map(function (l) {
        return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>";
      }).join("") + "</div>";
    }
    d.innerHTML = html;
    chatEl.appendChild(d); scroll(chatEl);
    return d;
  }

  function typing(chatEl, ms) {
    injectCss();
    var d = document.createElement("div");
    d.className = "msg bot typing";
    d.innerHTML = "<i></i><i></i><i></i>";
    chatEl.appendChild(d); scroll(chatEl);
    return new Promise(function (res) { setTimeout(function () { d.remove(); res(); }, ms); });
  }

  // Full round trip: show the user's message, typing dots, then the answer.
  function ask(chatEl, text, opts) {
    injectCss();
    opts = opts || {};
    addUser(chatEl, text);
    var r = reply(text);
    var ms = opts.delay != null ? opts.delay : Math.min(1900, 700 + r.text.length * 4);
    return typing(chatEl, ms).then(function () { addBot(chatEl, r); return r; });
  }

  function greet(chatEl, text, ms) {
    injectCss();
    return typing(chatEl, ms || 700).then(function () { return addBot(chatEl, { text: text, links: [] }); });
  }

  window.SkinluxConcierge = {
    reply: reply, ask: ask, typing: typing, addUser: addUser, addBot: addBot, greet: greet,
    displayName: displayName,
    reset: function () { lastLocation = null; }
  };
})();
