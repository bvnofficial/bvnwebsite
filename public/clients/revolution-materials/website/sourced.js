/* Revolution Materials website: "Some of the materials we've sourced".
   Loads the entries Jim edits on Revolution HQ (saved in his GoHighLevel
   account) and shows them as a vertically scrolling list, each entry a
   heading and free text. If the list can't be loaded, the built-in EXAMPLES
   on the page are shown in the same layout. */
(function () {
  var API = "https://www.bvnofficial.com/api/rm-hq/sourced";
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  };
  var css =
    "#sourced .arrows{display:none}" +
    "#sourced .track:not(.vlist){visibility:hidden}#sourced .track.vlist{position:relative;display:block;overflow-x:hidden;overflow-y:auto;max-height:540px;padding:4px 10px 4px 0;scroll-snap-type:none;scroll-behavior:smooth;scrollbar-width:thin;" +
    "-webkit-mask-image:linear-gradient(to bottom,#000 0,#000 calc(100% - 40px),transparent 100%);mask-image:linear-gradient(to bottom,#000 0,#000 calc(100% - 40px),transparent 100%)}" +
    "#sourced .vx{background:#fff;border:1px solid var(--line,#e2e7ee);border-left:4px solid var(--navy,#003a7c);border-radius:14px;padding:20px 24px;margin:0 0 14px}" +
    "#sourced .vx:last-child{margin-bottom:40px}" +
    "#sourced .vx h3{font-size:19px;font-weight:800;letter-spacing:-.01em;margin:0 0 8px;color:var(--ink,#141a24)}" +
    "#sourced .vx p{margin:0;white-space:pre-line;color:var(--mut,#596474);font-size:15.5px;line-height:1.6}" +
    "@media (max-width:640px){#sourced .track.vlist{max-height:480px}#sourced .vx{padding:18px}}" +
    "@media (prefers-reduced-motion:reduce){#sourced .track.vlist{scroll-behavior:auto}}";

  /* the first list format had fixed fields; show it as heading and text */
  function norm(e) {
    if (!e) return null;
    if ("head" in e || "text" in e) return { head: e.head || "", text: e.text || "" };
    var head = [e.grade, (e.form || "").toLowerCase()].filter(Boolean).join(" ");
    var text = [e.fam, e.spec, e.detail].filter(Boolean).join(". ");
    return { head: head, text: text ? text + "." : "" };
  }

  var drawn = false;
  function draw(list) {
    var track = document.getElementById("track");
    if (!track || !list || !list.length) return false;
    track.classList.add("vlist");
    track.setAttribute("aria-label", "Examples of materials supplied");
    track.innerHTML = list.map(norm).filter(function (e) { return e && (e.head || e.text); }).map(function (e) {
      return '<article class="vx">' + (e.head ? "<h3>" + esc(e.head) + "</h3>" : "") +
        (e.text ? "<p>" + esc(e.text) + "</p>" : "") + "</article>";
    }).join("");
    track.scrollTop = 0;
    drawn = true;
    return true;
  }

  /* gentle auto scroll, one entry at a time, paused while the visitor is reading */
  function autoScroll() {
    var track = document.getElementById("track");
    if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var held = 0;
    var pause = function () { held = Date.now() + 12000; };
    ["mouseenter", "touchstart", "focusin", "wheel", "pointerdown"].forEach(function (ev) {
      track.addEventListener(ev, pause, { passive: true });
    });
    setInterval(function () {
      if (!drawn || document.hidden || Date.now() < held) return;
      if (track.scrollHeight <= track.clientHeight + 4) return;
      var max = track.scrollHeight - track.clientHeight - 4;
      if (track.scrollTop >= max) { track.scrollTo({ top: 0 }); return; }
      var cards = track.querySelectorAll(".vx"), top = track.scrollTop, next = null;
      for (var i = 0; i < cards.length; i++) {
        if (cards[i].offsetTop > top + 8) { next = cards[i]; break; }
      }
      track.scrollTo({ top: next ? next.offsetTop : max });
    }, 5000);
  }

  function fallback() {
    if (!drawn && typeof EXAMPLES !== "undefined") draw(EXAMPLES); // eslint-disable-line no-undef
  }

  function go() {
    var st = document.createElement("style");
    st.textContent = css;
    document.head.appendChild(st);
    var timer = setTimeout(fallback, 3000);
    fetch(API, { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        clearTimeout(timer);
        if (!(d && Array.isArray(d.examples) && draw(d.examples))) fallback();
      })
      .catch(function () { clearTimeout(timer); fallback(); });
    autoScroll();
    stats();
    /* inside the dashboard's live preview (?rmedit=1) the dashboard supplies the content */
    if (/[?&]rmedit=1/.test(location.search)) {
      window.__rmApply = function (list) { restoreContent(); applyContent(list); };
      try { window.parent.postMessage({ rmPreviewReady: true }, location.origin); } catch (e) {}
      reveal();
    } else content();
  }

  /* Text and photos Jim changed on Revolution HQ (Website > Text and photos).
     The last version seen is kept in this browser so repeat visits show it at once. */
  var CKEY = "rm-content-v2";
  function setOwn(el, v) {
    var nodes = el.childNodes, last = null;
    for (var i = 0; i < nodes.length; i++) if (nodes[i].nodeType === 3 && nodes[i].textContent.trim()) last = nodes[i];
    if (last) last.textContent = v; else el.appendChild(document.createTextNode(v));
  }
  /* originals are remembered per element so a fresh list can undo older changes */
  var TOUCHED = [];
  function remember(el, kind) {
    if (el.__rmo) return;
    el.__rmo = kind === "img" ? { img: true, src: el.getAttribute("src"), alt: el.alt, srcset: el.getAttribute("srcset"), disp: el.style.display }
      : { html: el.innerHTML, disp: el.style.display, href: el.getAttribute("href") };
    TOUCHED.push(el);
  }
  function restoreContent() {
    TOUCHED.forEach(function (el) {
      var o = el.__rmo;
      if (o.img) { el.src = o.src; el.alt = o.alt; if (o.srcset) el.setAttribute("srcset", o.srcset); }
      else { el.innerHTML = o.html; if (o.href != null) el.setAttribute("href", o.href); }
      el.style.display = o.disp;
      el.__rmo = null;
    });
    TOUCHED = [];
  }
  var intlPhone = function (v) { var d = String(v).replace(/[^0-9+]/g, ""); return d.charAt(0) === "0" ? "+61" + d.slice(1) : d; };
  /* swap old text for new in every text node (contact email and phone) */
  function swapText(oldT, newT) {
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), n, hits = [];
    while ((n = w.nextNode())) if (n.nodeValue.indexOf(oldT) >= 0 && !(n.parentNode && /^(SCRIPT|STYLE)$/.test(n.parentNode.nodeName))) hits.push(n);
    hits.forEach(function (t) { remember(t.parentNode); t.nodeValue = t.nodeValue.split(oldT).join(newT); });
  }
  function applyContent(list) {
    if (!Array.isArray(list)) return;
    var hideCredits = [];
    list.forEach(function (a) {
      var els;
      try { els = document.querySelectorAll(a.sel); } catch (e) { return; }
      var v = a.value;
      if (a.type === "email" || a.type === "phone") {
        var oldT = a.def || (a.type === "email" ? "info@revolutionmaterials.com.au" : "0428 400 983");
        els.forEach(function (el) {
          remember(el);
          var h = el.getAttribute("href") || "";
          if (a.type === "email") el.setAttribute("href", h.replace(oldT, v));
          else el.setAttribute("href", "tel:" + intlPhone(v));
        });
        swapText(oldT, v);
        return;
      }
      els.forEach(function (el) {
        remember(el, a.type);
        if (a.type === "img") {
          if (!v || !v.src) return;
          el.removeAttribute("srcset");
          el.src = v.src;
          el.alt = v.alt || "";
          if (a.credit != null) hideCredits.push(a.credit);
        } else if (a.type === "show") el.style.display = v === "hide" ? "none" : "";
        else if (a.type === "num") {
          var m = /^([0-9][0-9,.]*)\s?(.*)$/.exec(v) || [];
          el.dataset.n = String(parseFloat(String(m[1] || "0").replace(/,/g, "")) || 0);
          el.dataset.plus = m[2] || "";
          el.setAttribute("aria-label", v);
          el.textContent = v;
        }
        else if (a.type === "text") el.textContent = v;
        else if (a.type === "own") setOwn(el, v);
        else if (a.type === "lines") el.innerHTML = String(v).split("\n").map(esc).join("<br>");
        else if (a.type === "list") el.innerHTML = String(v).split("\n").filter(Boolean).map(function (l) {
          return (/^(and more|other )/i.test(l) ? '<li class="more">' : "<li>") + esc(l) + "</li>";
        }).join("");
        else if (a.type === "tags") el.innerHTML = String(v).split("\n").filter(Boolean).map(function (l) { return "<span>" + esc(l) + "</span>"; }).join("");
      });
    });
    var ul = document.getElementById("credits");
    if (ul) {
      var lis = ul.children;
      for (var i = 0; i < lis.length; i++) lis[i].style.display = hideCredits.indexOf(i) >= 0 ? "none" : "";
      var shown = 0;
      for (var j = 0; j < lis.length; j++) if (lis[j].style.display !== "none") shown++;
      var det = ul.closest("details");
      if (det) det.style.display = shown ? "" : "none";
    }
  }
  /* The page's header code keeps the top of the page (logo, headline, main
     photo) invisible until html.rm-ready, so the original photo never flashes
     before Jim's one. Shown once his changes are in and the photo has loaded,
     after 2.5 s at most. The header CSS also shows it after 3 s on its own. */
  var shown = false;
  function reveal() {
    if (shown) return;
    var imgs = [].slice.call(document.querySelectorAll(".hero figure img, header .brand img"));
    var left = imgs.length, done = function () {
      if (shown) return;
      shown = true;
      document.documentElement.classList.add("rm-ready");
    };
    setTimeout(done, 1500);
    if (!left) return done();
    imgs.forEach(function (im) {
      var one = function () { if (--left <= 0) done(); };
      if (im.complete) one();
      else { im.addEventListener("load", one); im.addEventListener("error", one); }
    });
  }
  function content() {
    var cached = null;
    try { cached = JSON.parse(localStorage.getItem(CKEY) || "null"); applyContent(cached); } catch (e) {}
    /* a repeat visit already has Jim's changes from this browser */
    if (Array.isArray(cached)) reveal();
    var wait = setTimeout(reveal, 1000);
    fetch(API.replace("/sourced", "/content"), { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || !Array.isArray(d.apply)) return;
        restoreContent();
        applyContent(d.apply);
        try { localStorage.setItem(CKEY, JSON.stringify(d.apply)); } catch (e) {}
      })
      .catch(function () {})
      .then(function () { clearTimeout(wait); reveal(); });
  }

  /* animated statistics band, placed just before "Experience".
     To change a number or label, edit STATS. */
  var STATS = [
    { n: 23, plus: true, label: "Years in Business" },
    { n: 40, plus: true, label: "Years of Industry Experience" },
    { n: 11, plus: false, label: "Countries Sourced From" },
    { n: 300, plus: true, label: "Australian Customers Supplied" }
  ];
  function stats() {
    if (document.getElementById("rmstats")) return;
    var before = document.getElementById("experience");
    if (!before) return;
    var st = document.createElement("style");
    st.textContent =
      "#rmstats{background:var(--navy,#003a7c);color:#fff;padding:56px 0}" +
      "#rmstats .sgrid{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);gap:24px;text-align:center}" +
      "#rmstats .sv{font-size:clamp(38px,5vw,56px);font-weight:800;letter-spacing:-.02em;line-height:1;font-variant-numeric:tabular-nums}" +
      "#rmstats .sl{margin-top:10px;font-size:15px;font-weight:600;color:#cfdcf0;line-height:1.4}" +
      "#rmstats .si+.si{border-left:1px solid rgba(255,255,255,.18)}" +
      "@media (max-width:760px){#rmstats{padding:44px 0}#rmstats .sgrid{grid-auto-flow:row;grid-template-columns:repeat(2,minmax(0,1fr));gap:30px 12px}#rmstats .si:nth-child(3){border-left:0}}";
    document.head.appendChild(st);
    var sec = document.createElement("section");
    sec.id = "rmstats";
    sec.setAttribute("aria-label", "Revolution Materials in numbers");
    sec.innerHTML = '<div class="wrap"><div class="sgrid">' + STATS.map(function (s) {
      var final = s.n + (s.plus ? "+" : "");
      return '<div class="si"><div class="sv" data-n="' + s.n + '" data-plus="' + (s.plus ? "+" : "") + '" aria-label="' + final + '">' + final + "</div>" +
        '<div class="sl">' + esc(s.label) + "</div></div>";
    }).join("") + "</div></div>";
    before.parentNode.insertBefore(sec, before);

    var nums = sec.querySelectorAll(".sv");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    nums.forEach(function (el) { el.textContent = "0" + el.dataset.plus; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.disconnect();
        var t0 = performance.now(), dur = 1800;
        (function tick(t) {
          var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
          nums.forEach(function (el) { el.textContent = Math.round(+el.dataset.n * e) + el.dataset.plus; });
          if (k < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.4 });
    io.observe(sec);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go);
  else go();
})();
