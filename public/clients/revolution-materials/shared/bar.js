/* Draft switcher shown on every Revolution Materials draft, plus a demo enquiry handler. */
(function () {
  var drafts = [
    ["draft-1", "Forge"],
    ["draft-2", "Periodic"],
    ["draft-3", "Blueprint"],
    ["draft-4", "Grade Finder"],
    ["draft-5", "Chrome 3D"],
    ["builder", "3D Builder"],
    ["hq", "CEO Dashboard"]
  ];
  var here = location.pathname.split("/").filter(Boolean).pop();
  var css = document.createElement("style");
  css.textContent =
    ".bvn-bar{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:9999;display:flex;gap:4px;align-items:center;" +
    "padding:6px;border-radius:999px;background:rgba(12,14,18,.86);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);" +
    "border:1px solid rgba(255,255,255,.14);box-shadow:0 10px 40px rgba(0,0,0,.35);font:600 12px/1 Inter,system-ui,sans-serif;max-width:calc(100vw - 20px);overflow-x:auto}" +
    ".bvn-bar a{color:#c9ced8;text-decoration:none;padding:9px 12px;border-radius:999px;white-space:nowrap;transition:.2s}" +
    ".bvn-bar a:hover{color:#fff;background:rgba(255,255,255,.08)}" +
    ".bvn-bar a.on{color:#0b0d11;background:#fff}" +
    ".bvn-bar .tag{color:#7f8796;padding:0 8px 0 10px;white-space:nowrap}" +
    ".bvn-toast{position:fixed;left:50%;top:24px;transform:translate(-50%,-30px);opacity:0;z-index:10000;padding:14px 20px;border-radius:12px;" +
    "background:#101317;color:#fff;font:500 14px/1.4 Inter,system-ui,sans-serif;border:1px solid rgba(255,255,255,.15);transition:.35s;pointer-events:none;max-width:90vw}" +
    ".bvn-toast.show{opacity:1;transform:translate(-50%,0)}" +
    "@media print{.bvn-bar{display:none}}" +
    /* 3D Part Builder menu link, shared by every draft */
    ".nav nav a.rm3d{display:inline-flex;align-items:center;gap:7px;padding:7px 8px 7px 14px;border-radius:999px;background:linear-gradient(135deg,#ff8a3d,#E86010);color:#fff!important;font-weight:700;letter-spacing:0;text-transform:none;" +
    "box-shadow:0 0 0 0 rgba(232,96,16,.55);animation:rm3dPulse 2.4s infinite;transition:transform .2s;text-decoration:none;white-space:nowrap;line-height:1}" +
    ".nav nav a.rm3d:hover{transform:translateY(-1px);background:linear-gradient(135deg,#ffa060,#f06a18)}" +
    ".nav nav a.rm3d:after{display:none!important}" +
    ".nav nav a.rm3d b{font-size:9.5px;letter-spacing:.08em;background:#fff;color:#E86010;border-radius:999px;padding:3px 6px;font-weight:800}" +
    "@keyframes rm3dPulse{0%{box-shadow:0 0 0 0 rgba(232,96,16,.5)}70%{box-shadow:0 0 0 12px rgba(232,96,16,0)}100%{box-shadow:0 0 0 0 rgba(232,96,16,0)}}" +
    "@media(max-width:900px){.nav nav{display:flex!important;gap:0!important}.nav nav a:not(.rm3d){display:none!important}.nav nav a.rm3d{font-size:12px;padding:6px 6px 6px 11px}}" +
    "@media(max-width:520px){.nav>a.btn{display:none!important}.nav nav a.rm3d{padding:8px 12px}.nav nav a.rm3d b{display:none}}";
  document.head.appendChild(css);
  var bar = document.createElement("nav");
  bar.className = "bvn-bar";
  var html = '<span class="tag">BVN draft</span>';
  drafts.forEach(function (d, i) {
    html += '<a href="/clients/revolution-materials/' + d[0] + '" class="' + (d[0] === here ? "on" : "") + '">' + (d[0].indexOf("draft") === 0 ? (i + 1) + " " : "") + d[1] + "</a>";
  });
  html += '<a href="/clients/revolution-materials">All drafts</a>';
  bar.innerHTML = html;
  document.addEventListener("DOMContentLoaded", function () { document.body.appendChild(bar); });

  window.rmToast = function (msg) {
    var t = document.querySelector(".bvn-toast");
    if (!t) { t = document.createElement("div"); t.className = "bvn-toast"; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.classList.remove("show"); }, 3600);
  };
  /* Any form with data-rfq shows a demo confirmation instead of sending. */
  document.addEventListener("submit", function (e) {
    var f = e.target;
    if (!f.hasAttribute || !f.hasAttribute("data-rfq")) return;
    e.preventDefault();
    window.rmToast("Demo only. In the live site this enquiry goes straight into the GHL pipeline and Jim gets a text.");
    f.reset();
  });
})();
