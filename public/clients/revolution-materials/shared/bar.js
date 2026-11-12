/* Draft switcher shown on every Revolution Materials draft, plus a demo enquiry handler. */
(function () {
  var drafts = [
    ["draft-1", "Forge"],
    ["draft-2", "Periodic"],
    ["draft-3", "Blueprint"],
    ["draft-4", "Grade Finder"],
    ["draft-5", "Chrome 3D"],
    ["builder", "3D Builder"]
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
    "@media print{.bvn-bar{display:none}}";
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
