/* Revolution Materials website: "Some of the materials we've sourced".
   Loads the list Jim edits on Revolution HQ (saved in his GoHighLevel account)
   and redraws the cards in #track. If the list can't be loaded, the cards
   already on the page stay as they are. */
(function () {
  var API = "https://www.bvnofficial.com/api/rm-hq/sourced";
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  };
  function row(label, v) {
    return v ? "<dt>" + label + "</dt><dd>" + esc(v) + "</dd>" : "";
  }
  function draw(list) {
    var track = document.getElementById("track");
    if (!track || !list || !list.length) return;
    track.innerHTML = list.map(function (e) {
      return '<article class="ex">' + (e.fam ? '<span class="fam">' + esc(e.fam) + "</span>" : "") +
        "<h3>" + esc(e.grade) + "</h3><dl>" +
        row("Specification", e.spec) + row("Form", e.form) + row("Details", e.detail) +
        "</dl></article>";
    }).join("");
    track.scrollLeft = 0;
  }
  function go() {
    fetch(API, { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && Array.isArray(d.examples)) draw(d.examples); })
      .catch(function () {});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go);
  else go();
})();
