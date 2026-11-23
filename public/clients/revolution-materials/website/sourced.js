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

  /* Jim's high-resolution logo (Nov 2026). The page code may still carry the
     first logo; it is swapped before the top of the page is shown. A logo Jim
     uploads on Revolution HQ is applied afterwards and still wins. */
  var LOGO_OLD = /6afab75777a01e46221fd28b\/rm-logo\.png$|\/rm-logo\.png$/;
  var LOGO_NEW = "https://files.leadconnectorhq.com/file/6b03e1942c68ebcf46a523e9/rm-logo-2026.webp";
  function logo() {
    document.querySelectorAll("header .brand img, footer .foot img").forEach(function (im) {
      if (LOGO_OLD.test(im.getAttribute("src") || "")) { im.removeAttribute("srcset"); im.src = LOGO_NEW; }
    });
  }

  function go() {
    logo();
    var st = document.createElement("style");
    st.textContent = css;
    document.head.appendChild(st);
    if (document.getElementById("track")) {
      var timer = setTimeout(fallback, 3000);
      fetch(API, { cache: "no-cache" })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
          clearTimeout(timer);
          if (!(d && Array.isArray(d.examples) && draw(d.examples))) fallback();
        })
        .catch(function () { clearTimeout(timer); fallback(); });
      autoScroll();
    }
    stats();
    news();
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
  /* formatted text from the dashboard: one paragraph per line, <b> and <i> only */
  function richInline(l) {
    return esc(l).replace(/&lt;(\/?)([bi])&gt;/g, "<$1$2>");
  }
  function richHtml(v) {
    var ls = String(v || "").split("\n").filter(function (l) { return l.trim(); });
    if (ls.length < 2) return richInline(ls[0] || "");
    return ls.map(function (l) { return '<span class="rmpara">' + richInline(l) + "</span>"; }).join("");
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
        else if (a.type === "rich") el.innerHTML = richHtml(v);
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

  /* News page (revolutionmaterials.com.au/news), edited by Jim on Revolution HQ
     (Website > News). While News is switched off the API returns no posts, the
     menu link stays out and the page says there is nothing to show yet. */
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function niceDate(d) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d || "");
    return m ? +m[3] + " " + MONTHS[+m[2] - 1] + " " + m[1] : "";
  }
  var newsCss =
    "#rmnews{padding:64px 0 24px}#rmnews .sh h1{font:800 clamp(32px,4.2vw,50px)/1.08 var(--f,Manrope,sans-serif);letter-spacing:-.03em;margin:10px 0 14px}" +
    "#rmnewslist{display:grid;gap:28px}" +
    ".rmpost{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:36px;align-items:start;background:#fff;border:1px solid var(--line,#e2e7ee);border-radius:18px;padding:22px}" +
    ".rmpost.nophoto{grid-template-columns:1fr}" +
    ".rmpost .ph{display:grid;gap:10px}" +
    ".rmpost .main{display:block;width:100%;padding:0;border:0;background:var(--soft,#f4f6f9);border-radius:12px;overflow:hidden;cursor:zoom-in;aspect-ratio:4/3}" +
    ".rmpost .main img{width:100%;height:100%;object-fit:cover;display:block}" +
    ".rmpost .th{display:flex;gap:8px;flex-wrap:wrap}" +
    ".rmpost .th button{width:72px;height:54px;padding:0;border:2px solid transparent;border-radius:8px;overflow:hidden;cursor:pointer;background:var(--soft,#f4f6f9)}" +
    ".rmpost .th button[aria-pressed=true]{border-color:var(--navy,#003a7c)}" +
    ".rmpost .th img{width:100%;height:100%;object-fit:cover;display:block}" +
    ".rmpost time{display:block;font-weight:700;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--navy,#003a7c);margin:4px 0 10px}" +
    ".rmpost h2{font:800 clamp(22px,2.4vw,28px)/1.2 var(--f,Manrope,sans-serif);letter-spacing:-.02em;margin:0 0 12px;color:var(--ink,#141a24)}" +
    ".rmpost p{margin:0;white-space:pre-line;color:var(--mut,#596474);font-size:16px;line-height:1.65}" +
    ".rmnone{padding:40px;border:1px dashed var(--line,#e2e7ee);border-radius:16px;text-align:center;color:var(--mut,#596474)}.rmnone a{color:var(--navy,#003a7c);font-weight:700}" +
    "#rmbox{position:fixed;inset:0;z-index:100;background:rgba(10,14,22,.9);display:flex;align-items:center;justify-content:center;padding:24px}" +
    "#rmbox img{max-width:100%;max-height:100%;object-fit:contain;border-radius:8px}" +
    "#rmbox button{position:absolute;top:14px;right:14px;width:44px;height:44px;border-radius:50%;border:0;background:#fff;color:#141a24;font-size:26px;line-height:44px;cursor:pointer}" +
    "@media (max-width:820px){.rmpost{grid-template-columns:1fr;gap:18px;padding:16px}#rmnews{padding:44px 0 12px}}";
  function lightbox(src, alt) {
    var b = document.createElement("div");
    b.id = "rmbox";
    b.setAttribute("role", "dialog");
    b.setAttribute("aria-modal", "true");
    b.setAttribute("aria-label", "Photo");
    b.innerHTML = '<img src="' + esc(src) + '" alt="' + esc(alt) + '"><button type="button" aria-label="Close photo">&times;</button>';
    var key = function (e) { if (e.key === "Escape") close(); };
    var close = function () { b.remove(); document.removeEventListener("keydown", key); };
    b.addEventListener("click", function (e) { if (e.target === b || e.target.tagName === "BUTTON") close(); });
    document.addEventListener("keydown", key);
    document.body.appendChild(b);
    b.querySelector("button").focus();
  }
  function drawNews(box, posts) {
    if (!posts || !posts.length) {
      box.innerHTML = '<div class="rmnone">There is no news to show yet. Please check back soon, or <a href="/">go to the home page</a>.</div>';
      return;
    }
    box.innerHTML = posts.map(function (p) {
      var ph = p.photos || [];
      var alt = p.title || "Revolution Materials order";
      var photos = ph.length ? '<div class="ph"><button type="button" class="main" aria-label="Enlarge photo"><img src="' + esc(ph[0].src) + '" alt="' + esc(alt) + '" loading="lazy"></button>' +
        (ph.length > 1 ? '<div class="th">' + ph.map(function (x, j) {
          return '<button type="button" aria-label="Show photo ' + (j + 1) + '" aria-pressed="' + (j === 0) + '" data-src="' + esc(x.src) + '"><img src="' + esc(x.src) + '" alt="" loading="lazy"></button>';
        }).join("") + "</div>" : "") + "</div>" : "";
      return '<article class="rmpost' + (ph.length ? "" : " nophoto") + '">' + photos + "<div>" +
        (p.date ? '<time datetime="' + esc(p.date) + '">' + niceDate(p.date) + "</time>" : "") +
        (p.title ? "<h2>" + esc(p.title) + "</h2>" : "") + (p.text ? "<p>" + esc(p.text) + "</p>" : "") + "</div></article>";
    }).join("");
    if (box.__rmclick) return;
    box.__rmclick = true;
    box.addEventListener("click", function (e) {
      var t = e.target.closest("button");
      if (!t || !box.contains(t)) return;
      var post = t.closest(".rmpost"), main = post && post.querySelector(".main img");
      if (!main) return;
      if (t.classList.contains("main")) return lightbox(main.src, main.alt);
      if (t.dataset.src) {
        main.src = t.dataset.src;
        post.querySelectorAll(".th button").forEach(function (b) { b.setAttribute("aria-pressed", String(b === t)); });
      }
    });
  }
  function news() {
    var box = document.getElementById("rmnewslist");
    if (box) {
      var st = document.createElement("style");
      /* the GoHighLevel page has an empty builder section above the site; hide it
         with a rule, since the page's own scripts redraw that section */
      st.textContent = newsCss + ".c-section:has(> .inner > .empty-slot){display:none!important}";
      document.head.appendChild(st);
    }
    fetch(API.replace("/sourced", "/news"), { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        var on = !!(d && d.on);
        if (on) {
          /* menu link, placed before the mobile-only email and phone so the
             numbered menu items Jim can rename keep their positions */
          var nav = document.getElementById("nav");
          if (nav && !nav.querySelector(".rmnewsl")) {
            var a = document.createElement("a");
            a.href = "/news";
            a.className = "rmnewsl";
            a.textContent = "News";
            if (box) a.setAttribute("aria-current", "page");
            nav.insertBefore(a, nav.querySelector(".mmail"));
          }
          var ful = document.querySelector("footer .foot > div:nth-child(3) ul");
          if (ful && !ful.querySelector(".rmnewsl")) {
            var li = document.createElement("li");
            li.className = "rmnewsl";
            li.innerHTML = '<a href="/news">News</a>';
            ful.appendChild(li);
          }
        }
        if (box) drawNews(box, on && d.posts);
      })
      .catch(function () { if (box) drawNews(box, null); });
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
    /* the stats band replaces the old strip under the top section (Jim, 24 Nov 2026) */
    var trust = document.querySelector(".rm .trust");
    var hero = document.querySelector(".rm .hero");
    var before = trust || (hero && hero.nextElementSibling) || document.getElementById("experience");
    if (!before) return;
    var st = document.createElement("style");
    st.textContent =
      ".rm .rmpara{display:block}.rm .rmpara+.rmpara{margin-top:.85em}.rm .trust{display:none!important}#rmstats{background:var(--navy,#003a7c);color:#fff;padding:56px 0}" +
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
    if (trust) trust.parentNode.removeChild(trust);

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
