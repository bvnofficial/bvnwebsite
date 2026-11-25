// Applies Jellie's HQ Settings (prices, booking link, phones, which treatments
// show online, routine products) to window.SKINLUX on the live client pages.
(function () {
  var S = window.SKINLUX;
  if (!S) return;
  S.ready = fetch("/api/skinlux-settings", { cache: "no-store" })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (!d || !d.ok) return;
      if (d.booking) S.booking = d.booking;
      Object.keys(d.phones || {}).forEach(function (k) { if (S.locations[k] && d.phones[k]) S.locations[k].phone = d.phones[k]; });
      (d.treatments || []).forEach(function (x) {
        var t = S.treatments.filter(function (y) { return y.id === x.id; })[0];
        if (!t) return;
        t.price = x.price; t.from = x.from; t.online = x.online;
        if (x.interval_days) t.interval_days = x.interval_days;
      });
      S.routine_products = d.products || [];
      var shown = S.treatments.filter(function (t) { return t.online !== false; });
      S.treatments.length = 0;
      shown.forEach(function (t) { S.treatments.push(t); });
    })
    .catch(function () {});
})();
