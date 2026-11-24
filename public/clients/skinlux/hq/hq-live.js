// Skinlux HQ live loader. Reads /api/skinlux-hq (GoHighLevel, both clinics),
// hands the data to the shared HQ script, then loads it.
// Not connected yet: shows a banner and the sample data, clearly marked.
(function () {
  "use strict";
  var HQ = "../assets/hq.js?v=7";
  function banner(text, tone) {
    var b = document.createElement("div");
    b.style.cssText = "padding:10px 18px;font-size:13.5px;text-align:center;" +
      (tone === "warn" ? "background:#fff4d6;color:#6b4e12" : "background:#eef6f0;color:#2f5d43");
    b.textContent = text;
    document.body.insertBefore(b, document.body.firstChild);
  }
  function load() { var s = document.createElement("script"); s.src = HQ; document.body.appendChild(s); }
  function liveOverview() {
    // The numbers panel on the overview is sample data in the demo. In live mode it
    // makes way for a note until Timely and the workflow numbers are connected.
    var sec = document.getElementById("v-overview"), needs = document.getElementById("needs");
    if (!sec || !needs) return;
    var n = needs.nextSibling;
    while (n) { var next = n.nextSibling; sec.removeChild(n); n = next; }
    var c = document.createElement("div");
    c.className = "card soft"; c.style.marginTop = "22px";
    c.innerHTML = "<h3>The numbers</h3><p class=\"muted\" style=\"margin:0\">Bookings, revenue, rebook rate and money recovered show here once the Timely link is on. Workflow numbers are under Workflows.</p>";
    sec.appendChild(c);
  }
  var key = null; try { key = localStorage.getItem("skinluxhq-key"); } catch (e) {}
  var h = { Accept: "application/json" }; if (key) h.Authorization = "Bearer " + key;
  fetch("/api/skinlux-hq", { credentials: "include", headers: h, cache: "no-store" })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (d && d.configured && !d.failed) {
        window.SKINLUX_HQ_LIVE = d;
        liveOverview();
        if (d.stale) banner("Showing the last good copy. GoHighLevel didn't answer just now.", "warn");
        else if ((d.clinics || []).length < 2) banner("Live from GoHighLevel: " + d.clinics.join(" only") + ". The other clinic isn't connected yet.", "warn");
      } else {
        banner("Not connected to GoHighLevel yet. Everything below is SAMPLE data until the keys are added.", "warn");
      }
      load();
    })
    .catch(function () { banner("Couldn't reach Skinlux HQ's data. Everything below is SAMPLE data.", "warn"); load(); });
})();
