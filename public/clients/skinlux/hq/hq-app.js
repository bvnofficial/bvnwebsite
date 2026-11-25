// Shared helpers for the Skinlux HQ app pages (stock, waitlist, intake,
// training, scorecard, monitor). Same sign in as HQ: the HQ cookie, or the
// key HQ keeps in this browser.
(function () {
  "use strict";
  var K = null; try { K = localStorage.getItem("skinluxhq-key"); } catch (e) {}
  var H = { Accept: "application/json", "Content-Type": "application/json" }; if (K) H.Authorization = "Bearer " + K;
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function toast(t) { var e = $("toast"); if (!e) return; e.textContent = t; e.style.display = "block"; clearTimeout(e._t); e._t = setTimeout(function () { e.style.display = "none"; }, 3200); }
  function api(method, url, body) {
    return fetch(url, { method: method, headers: H, credentials: "include", cache: "no-store", body: body ? JSON.stringify(body) : undefined })
      .then(function (r) { return r.json().catch(function () { return { ok: false, error: "Unexpected reply" }; }); })
      .catch(function () { return { ok: false, error: "Couldn't reach Skinlux HQ. Try again in a minute." }; });
  }
  function feed() { return api("GET", "/api/skinlux-hq"); }
  var CL = { booragoon: "Booragoon", leederville: "Leederville", both: "Both clinics" };
  function money(n) { return "$" + Math.round(n || 0).toLocaleString("en-AU"); }
  function perthDay(t) { return new Date(t + 8 * 3600000).toISOString().slice(0, 10); }
  function ago(t) {
    var m = Math.round((Date.now() - t) / 60000);
    if (m < 1) return "just now"; if (m < 60) return m + " min ago";
    var h = Math.round(m / 60); if (h < 24) return h + " hrs ago";
    var d = Math.round(h / 24); return d === 1 ? "yesterday" : d + " days ago";
  }
  function when(t) { return new Date(t).toLocaleString("en-AU", { timeZone: "Australia/Perth", weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }); }
  // clinic picker shared with HQ (remembers the choice)
  function clinicSeg(el, onChange, withBoth) {
    var cur = "both"; try { cur = localStorage.getItem("skinluxhq-clinic") || "both"; } catch (e) {}
    if (!withBoth && cur === "both") cur = "booragoon";
    var opts = withBoth ? ["booragoon", "leederville", "both"] : ["booragoon", "leederville"];
    el.className = "seg";
    el.innerHTML = opts.map(function (c) { return '<button data-c="' + c + '"' + (c === cur ? ' class="on"' : "") + ">" + (c === "both" ? "Both" : CL[c]) + "</button>"; }).join("");
    [].forEach.call(el.querySelectorAll("button"), function (b) {
      b.onclick = function () {
        cur = b.dataset.c; try { localStorage.setItem("skinluxhq-clinic", cur); } catch (e) {}
        [].forEach.call(el.querySelectorAll("button"), function (x) { x.classList.toggle("on", x === b); });
        onChange(cur);
      };
    });
    return cur;
  }
  window.HQ = { $: $, esc: esc, toast: toast, api: api, feed: feed, CL: CL, money: money, perthDay: perthDay, ago: ago, when: when, clinicSeg: clinicSeg };
})();
