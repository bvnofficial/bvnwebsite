/*
 * Skinlux skin check: on device face mapping and skin measures.
 * The photo never leaves the phone. MediaPipe Face Landmarker (Google, Apache 2.0)
 * finds 478 points on the face; everything else is plain image maths in this file.
 * window.SkinScan.load()  starts loading the face model (call early).
 * window.SkinScan.run(canvas, { srcPerPx }) resolves to
 *   { ok: true, scores, raw, quality: [{ code, msg }], regions }  or  { ok: false, reason: "noface" | "load" }
 */
(function () {
  "use strict";
  var VER = "1.2.3";
  var BASE = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@" + VER;
  var MODEL = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";
  var V = null, landP = null;

  function load() {
    if (landP) return landP;
    landP = import(BASE + "/vision_bundle.mjs").then(function (v) {
      V = v;
      return v.FilesetResolver.forVisionTasks(BASE + "/wasm");
    }).then(function (fs) {
      function make(d) {
        return V.FaceLandmarker.createFromOptions(fs, { baseOptions: { modelAssetPath: MODEL, delegate: d }, runningMode: "IMAGE", numFaces: 2 });
      }
      return make("GPU").catch(function () { return make("CPU"); });
    });
    landP.catch(function () { landP = null; });
    return landP;
  }
  function withTimeout(p, ms) {
    return Promise.race([p, new Promise(function (_, rej) { setTimeout(function () { rej(new Error("timeout")); }, ms); })]);
  }

  // ---------- colour ----------
  var LIN = new Float32Array(256);
  for (var i = 0; i < 256; i++) { var c = i / 255; LIN[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function f(t) { return t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116; }
  function toLab(d, n) {
    var L = new Float32Array(n), A = new Float32Array(n), B = new Float32Array(n);
    for (var i = 0; i < n; i++) {
      var r = LIN[d[i * 4]], g = LIN[d[i * 4 + 1]], b = LIN[d[i * 4 + 2]];
      var fx = f((0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047), fy = f(0.2126 * r + 0.7152 * g + 0.0722 * b), fz = f((0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883);
      L[i] = 116 * fy - 16; A[i] = 500 * (fx - fy); B[i] = 200 * (fy - fz);
    }
    return { L: L, A: A, B: B };
  }

  // Mask aware box blur (only skin pixels count, so hair and eyes don't bleed in)
  function blur(src, m, w, h, r) {
    var W1 = w + 1, S = new Float64Array(W1 * (h + 1)), C = new Float64Array(W1 * (h + 1)), out = new Float32Array(w * h);
    for (var y = 0; y < h; y++) {
      var rs = 0, rc = 0;
      for (var x = 0; x < w; x++) {
        var i = y * w + x, mv = m[i];
        rs += src[i] * mv; rc += mv;
        S[(y + 1) * W1 + x + 1] = S[y * W1 + x + 1] + rs;
        C[(y + 1) * W1 + x + 1] = C[y * W1 + x + 1] + rc;
      }
    }
    for (y = 0; y < h; y++) {
      var y0 = Math.max(0, y - r), y1 = Math.min(h, y + r + 1);
      for (x = 0; x < w; x++) {
        var x0 = Math.max(0, x - r), x1 = Math.min(w, x + r + 1);
        var cnt = C[y1 * W1 + x1] - C[y0 * W1 + x1] - C[y1 * W1 + x0] + C[y0 * W1 + x0];
        var s = S[y1 * W1 + x1] - S[y0 * W1 + x1] - S[y1 * W1 + x0] + S[y0 * W1 + x0];
        out[y * w + x] = cnt > 0 ? s / cnt : src[y * w + x];
      }
    }
    return out;
  }

  // ---------- geometry ----------
  function idxOf(conns) {
    var s = {};
    conns.forEach(function (c) { s[c.start] = 1; s[c.end] = 1; });
    return Object.keys(s).map(Number);
  }
  function hull(pts) {
    var p = pts.slice().sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    function cross(o, a, b) { return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); }
    var lo = [], up = [];
    p.forEach(function (q) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); });
    for (var i = p.length - 1; i >= 0; i--) { var q = p[i]; while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  }
  function grow(poly, k) {
    var cx = 0, cy = 0;
    poly.forEach(function (p) { cx += p[0]; cy += p[1]; });
    cx /= poly.length; cy /= poly.length;
    return poly.map(function (p) { return [cx + (p[0] - cx) * k, cy + (p[1] - cy) * k]; });
  }
  function fillPoly(g, poly) { g.beginPath(); poly.forEach(function (p, i) { if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }); g.closePath(); g.fill(); }
  function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
  function dist(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  // raw value at "good" scores 94, at "bad" scores 45
  function score(raw, good, bad) { return Math.round(clamp(94 - (raw - good) / (bad - good) * 49, 38, 94)); }

  // ---------- measuring ----------
  var FW = 420; // face width the photo is scaled to, so numbers don't depend on camera resolution

  function measure(src, lm, opt) {
    var SW = src.width, SH = src.height;
    var pts = lm.map(function (p) { return [p.x * SW, p.y * SH]; });
    var FL = V.FaceLandmarker;
    var ovalI = idxOf(FL.FACE_LANDMARKS_FACE_OVAL);
    var minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9;
    ovalI.forEach(function (i) { var p = pts[i]; minx = Math.min(minx, p[0]); maxx = Math.max(maxx, p[0]); miny = Math.min(miny, p[1]); maxy = Math.max(maxy, p[1]); });
    var fwSrc = maxx - minx, pad = 0.04 * fwSrc;
    var x0 = Math.max(0, minx - pad), y0 = Math.max(0, miny - pad), x1 = Math.min(SW, maxx + pad), y1 = Math.min(SH, maxy + pad);
    var s = FW / fwSrc, w = Math.max(8, Math.round((x1 - x0) * s)), h = Math.max(8, Math.round((y1 - y0) * s)), n = w * h;
    var wc = document.createElement("canvas"); wc.width = w; wc.height = h;
    var wx = wc.getContext("2d", { willReadFrequently: true });
    wx.imageSmoothingQuality = "high";
    wx.drawImage(src, x0, y0, x1 - x0, y1 - y0, 0, 0, w, h);
    var P = pts.map(function (p) { return [(p[0] - x0) * s, (p[1] - y0) * s]; });
    function grp(conns) { return idxOf(conns).map(function (i) { return P[i]; }); }

    // face mask: inside the face outline, outside eyes, brows and lips
    var mc = document.createElement("canvas"); mc.width = w; mc.height = h;
    var mg = mc.getContext("2d", { willReadFrequently: true });
    mg.fillStyle = "#000"; mg.fillRect(0, 0, w, h);
    mg.fillStyle = "#fff"; fillPoly(mg, hull(grp(FL.FACE_LANDMARKS_FACE_OVAL)));
    mg.fillStyle = "#000";
    var eyeL = hull(grp(FL.FACE_LANDMARKS_LEFT_EYE)), eyeR = hull(grp(FL.FACE_LANDMARKS_RIGHT_EYE));
    [grow(eyeL, 1.45), grow(eyeR, 1.45), grow(hull(grp(FL.FACE_LANDMARKS_LEFT_EYEBROW)), 1.35), grow(hull(grp(FL.FACE_LANDMARKS_RIGHT_EYEBROW)), 1.35), grow(hull(grp(FL.FACE_LANDMARKS_LIPS)), 1.15)]
      .forEach(function (poly) { fillPoly(mg, poly); });
    var md = mg.getImageData(0, 0, w, h).data;
    // eye mask, for the eye white reference and the sharpness check
    mg.fillStyle = "#000"; mg.fillRect(0, 0, w, h);
    mg.fillStyle = "#fff"; fillPoly(mg, eyeL); fillPoly(mg, eyeR);
    var ed = mg.getImageData(0, 0, w, h).data;

    var lab = toLab(wx.getImageData(0, 0, w, h).data, n), L = lab.L, A = lab.A, B = lab.B;
    var face = new Uint8Array(n), fL = [], fA = [], fB = [], eyePix = [], glare = 0, faceN = 0;
    for (var i = 0; i < n; i++) {
      if (md[i * 4] > 128) { face[i] = 1; faceN++; fL.push(L[i]); fA.push(A[i]); fB.push(B[i]); if (L[i] > 95) glare++; }
      if (ed[i * 4] > 128) eyePix.push(i);
    }
    function median(a) { var b = Float32Array.from(a).sort(); return b.length ? b[b.length >> 1] : 0; }
    var medL = median(fL), medA = median(fA), medB = median(fB);

    // white balance from the whites of the eyes (brightest, least coloured eye pixels)
    var sc = eyePix.filter(function (i) { return Math.hypot(A[i], B[i]) < 22; }).sort(function (a, b) { return L[b] - L[a]; });
    sc = sc.slice(0, Math.max(0, Math.floor(sc.length * 0.2)));
    var da = 0, db = 0, scL = 0;
    if (sc.length >= 12) {
      var sa = 0, sb = 0; sc.forEach(function (i) { sa += A[i]; sb += B[i]; scL += L[i]; });
      scL /= sc.length;
      da = clamp(sa / sc.length - 1, -6, 6); db = clamp(sb / sc.length - 4, -8, 8);
    }

    // skin mask: face pixels that look like skin (drops hair, glasses, nostrils, shine)
    var skin = new Uint8Array(n);
    for (i = 0; i < n; i++) {
      if (face[i] && L[i] > medL - 28 && L[i] < Math.min(96, medL + 25) && Math.abs(A[i] - medA) < 18 && Math.abs(B[i] - medB) < 20) skin[i] = 1;
    }
    var B1 = blur(L, skin, w, h, 1), B3 = blur(L, skin, w, h, 3), BIG = blur(L, skin, w, h, Math.round(FW * 0.05));

    // regions
    var ow = dist(P[234], P[454]);
    var cheekL = lerp(lerp(P[145], P[61], 0.5), P[234], 0.28), cheekR = lerp(lerp(P[374], P[291], 0.5), P[454], 0.28);
    var R = {
      forehead: { c: lerp(P[151], P[9], 0.15), rx: 0.2 * ow, ry: 0.075 * ow },
      cheekL: { c: cheekL, rx: 0.1 * ow, ry: 0.1 * ow },
      cheekR: { c: cheekR, rx: 0.1 * ow, ry: 0.1 * ow },
      nose: { c: lerp(P[4], P[6], 0.38), rx: 0.05 * ow, ry: 0.08 * ow },
      chin: { c: lerp(P[17], P[152], 0.5), rx: 0.09 * ow, ry: 0.055 * ow },
      eyeL: { c: lerp(P[33], P[133], -0.55), rx: 0.05 * ow, ry: 0.06 * ow },
      eyeR: { c: lerp(P[263], P[362], -0.55), rx: 0.05 * ow, ry: 0.06 * ow }
    };
    var pix = {};
    Object.keys(R).forEach(function (k) {
      var r = R[k], list = [];
      var xa = Math.max(3, Math.floor(r.c[0] - r.rx)), xb = Math.min(w - 4, Math.ceil(r.c[0] + r.rx));
      var ya = Math.max(3, Math.floor(r.c[1] - r.ry)), yb = Math.min(h - 4, Math.ceil(r.c[1] + r.ry));
      for (var y = ya; y <= yb; y++) for (var x = xa; x <= xb; x++) {
        var dx = (x - r.c[0]) / r.rx, dy = (y - r.c[1]) / r.ry, j = y * w + x;
        if (dx * dx + dy * dy <= 1 && skin[j]) list.push(j);
      }
      pix[k] = list;
    });
    // a region that doesn't look like the cheeks (beard, face covering, fringe) is left out
    function regStat(list) { var l = 0, a = 0, b = 0; list.forEach(function (j) { l += L[j]; a += A[j]; b += B[j]; }); var k = Math.max(1, list.length); return [l / k, a / k, b / k]; }
    var ck = regStat(pix.cheekL.concat(pix.cheekR)), dropped = [];
    ["forehead", "chin"].forEach(function (k) {
      if (!pix[k].length) return;
      var st = regStat(pix[k]);
      if (Math.abs(st[0] - ck[0]) > 25 || Math.hypot(st[1] - ck[1], st[2] - ck[2]) > 12) { pix[k] = []; dropped.push(k); }
    });
    // glasses: dark frame across the bridge of the nose
    var br = P[168], brR = 0.035 * ow, brDark = 0, brN = 0;
    for (var by = Math.floor(br[1] - brR); by <= br[1] + brR; by++) for (var bx = Math.floor(br[0] - brR); bx <= br[0] + brR; bx++) {
      if (bx < 0 || by < 0 || bx >= w || by >= h || Math.hypot(bx - br[0], by - br[1]) > brR) continue;
      brN++; if (L[by * w + bx] < medL - 22) brDark++;
    }
    var glasses = brN > 0 && brDark / brN > 0.12;
    if (glasses) { pix.eyeL = []; pix.eyeR = []; }
    function join() { var o = []; for (var a = 0; a < arguments.length; a++) o = o.concat(pix[arguments[a]]); return o; }
    function avg(list, fn) { if (!list.length) return 0; var t = 0; list.forEach(function (j) { t += fn(j); }); return t / list.length; }
    function frac(list, fn) { return avg(list, function (j) { return fn(j) ? 1 : 0; }); }

    var cheeks = join("cheekL", "cheekR"), tzone = join("forehead", "cheekL", "cheekR"), poreZone = join("nose", "chin", "cheekL", "cheekR");
    // texture: fine detail energy
    var texture = avg(tzone, function (j) { return Math.abs(B1[j] - B3[j]); });
    // pores and congestion: small dark dots
    var pores = frac(poreZone, function (j) { return B1[j] < B3[j] - 2.2; });
    // spots and uneven tone: patches darker than the skin around them
    var spots = frac(tzone, function (j) { return B3[j] < BIG[j] - 4.5; });
    var toneMean = avg(tzone, function (j) { return B3[j] - BIG[j]; });
    var toneSd = Math.sqrt(avg(tzone, function (j) { var v = B3[j] - BIG[j] - toneMean; return v * v; }));
    // redness: colour corrected a*, cheeks and nose compared with forehead and chin, plus red patches
    var redZone = join("cheekL", "cheekR", "nose"), refZone = join("forehead", "chin");
    var redA = avg(redZone, function (j) { return A[j] - da; }), refA = refZone.length ? avg(refZone, function (j) { return A[j] - da; }) : redA;

    var patchT = 5; // same for every skin tone: better to under call redness on deep skin than over call it
    var redPatch = frac(redZone, function (j) { return A[j] > medA + patchT; });
    var redness = Math.max(0, redA - refA) + redPatch * 25 + Math.max(0, redA - 15) * 0.6;
    // lines: thin dark lines across the forehead and beside the eyes
    function lineAt(j, dirs) {
      var best = 0;
      dirs.forEach(function (o) {
        if (!skin[j - o] || !skin[j + o]) return;
        var v = 0.5 * (B1[j - o] + B1[j + o]) - B1[j];
        if (v > best) best = v;
      });
      return Math.max(0, best - 1);
    }
    var fLines = avg(pix.forehead, function (j) { return lineAt(j, [3 * w]); });
    var eLines = avg(join("eyeL", "eyeR"), function (j) { return lineAt(j, [3 * w, 3 * w + 3, 3 * w - 3, 3]); });
    var hasF = pix.forehead.length > 30, hasE = pix.eyeL.length + pix.eyeR.length > 30;
    var lines = hasF && hasE ? 0.55 * fLines + 0.45 * eLines : hasE ? eLines : fLines;
    // glow: soft natural highlights on the high points, with even tone
    var glow = frac(tzone, function (j) { return B3[j] > BIG[j] + 3.5; });

    // photo quality
    var q = [];
    function add(code, msg) { q.push({ code: code, msg: msg }); }
    var srcFace = fwSrc * (opt && opt.srcPerPx || 1);
    var eyeSharp = avg(eyePix.filter(function (j) { var x = j % w; return x > 0 && x < w - 1 && j > w && j < n - w; }), function (j) { return Math.abs(L[j + 1] - L[j - 1]) + Math.abs(L[j + w] - L[j - w]); });
    var cl = avg(pix.cheekL, function (j) { return BIG[j]; }), cr = avg(pix.cheekR, function (j) { return BIG[j]; });
    var turn = Math.min(dist(P[1], P[234]), dist(P[1], P[454])) / Math.max(1, Math.max(dist(P[1], P[234]), dist(P[1], P[454])));
    // colour check on the whole picture, not the skin (very deep skin has little colour on its own)
    var colourful = 0;
    for (i = 0; i < n; i += 3) if (Math.hypot(A[i], B[i]) > 8) colourful++;
    var chroma = colourful / (n / 3);
    if (chroma < 0.03) add("bw", "This looks like a black and white or filtered photo. Use a normal colour photo with no filter.");
    if (glasses) add("glasses", "Take your glasses off so the skin around your eyes can be checked.");
    if (srcFace < 260) add("small", "Your face is quite small in the photo. Hold the phone a little closer, or use a sharper photo.");
    if (turn < 0.62) add("turned", "Face the camera straight on so both cheeks show evenly.");
    // exposure judged from the whites of the eyes when we have them, so deep skin isn't called "too dark"
    if (sc.length >= 12 ? scL < 42 : medL < 22) add("dark", "The photo is a bit dark. Face a window or turn on a bright light.");
    if (medL > 86 || glare / Math.max(1, faceN) > 0.06) add("glare", "There's a lot of shine or flash. Soft daylight without the flash works best.");
    if (pix.cheekL.length && pix.cheekR.length && Math.abs(cl - cr) > 8) add("side", "The light is coming from one side. Face the light so both cheeks are lit evenly.");
    if (eyeSharp < 9) add("blur", "The photo looks a little blurry. Hold the phone still and try again.");
    if (skin.reduce(function (t, v) { return t + v; }, 0) < faceN * 0.45) add("cover", "A lot of your face is covered. Pull your hair back and take off glasses.");

    var raw = {
      texture: +texture.toFixed(3), pores: +pores.toFixed(4), spots: +spots.toFixed(4), toneSd: +toneSd.toFixed(3),
      redA: +redA.toFixed(2), refA: +refA.toFixed(2), redPatch: +redPatch.toFixed(4), redness: +redness.toFixed(3),
      fLines: +fLines.toFixed(3), eLines: +eLines.toFixed(3), lines: +lines.toFixed(3), glow: +glow.toFixed(4),
      medL: +medL.toFixed(1), medA: +medA.toFixed(1), medB: +medB.toFixed(1), wb: [+da.toFixed(1), +db.toFixed(1)], eyeWhite: sc.length,
      srcFace: Math.round(srcFace), eyeSharp: +eyeSharp.toFixed(1), sideDiff: +Math.abs(cl - cr).toFixed(1), turn: +turn.toFixed(2),
      glare: +(glare / Math.max(1, faceN)).toFixed(3), chroma: +chroma.toFixed(3), eyeWhiteL: +scL.toFixed(1), bridgeDark: brN ? +(brDark / brN).toFixed(3) : 0, dropped: dropped
    };
    var scores = {
      redness: chroma < 0.03 ? 80 : score(redness, 2, 12),
      evenness: Math.round((score(spots, 0.01, 0.07) + score(toneSd, 1.3, 3.4)) / 2),
      texture: score(texture, 0.55, 1.6),
      dull: Math.round((score(-glow, -0.09, -0.015) + score(toneSd, 1.3, 3.4)) / 2),
      congestion: score(pores, 0.03, 0.13),
      lines: score(lines, 0.12, 0.7)
    };
    // regions back in the coordinates of the picture that was passed in
    var regions = {};
    Object.keys(R).forEach(function (k) {
      var r = R[k];
      regions[k] = { x: (r.c[0] / s + x0) / SW, y: (r.c[1] / s + y0) / SH, rx: r.rx / s / SW, ry: r.ry / s / SH, px: pix[k].length };
    });
    return { ok: true, scores: scores, raw: raw, quality: q, regions: regions };
  }

  function run(canvas, opt) {
    return withTimeout(load(), 25000).then(function (fl) {
      var res = fl.detect(canvas), faces = res.faceLandmarks || [];
      if (!faces.length) {
        // very close selfies: add a border so the face detector sees the whole head
        var k = 1.8, pc = document.createElement("canvas"); pc.width = Math.round(canvas.width * k); pc.height = Math.round(canvas.height * k);
        var pg = pc.getContext("2d"), ox = (pc.width - canvas.width) / 2, oy = (pc.height - canvas.height) / 2;
        pg.fillStyle = "#ede3d8"; pg.fillRect(0, 0, pc.width, pc.height); pg.drawImage(canvas, ox, oy);
        faces = (fl.detect(pc).faceLandmarks || []).map(function (lm) {
          return lm.map(function (p) { return { x: (p.x * pc.width - ox) / canvas.width, y: (p.y * pc.height - oy) / canvas.height, z: p.z }; });
        });
      }
      if (!faces.length) return { ok: false, reason: "noface" };
      var best = faces[0], area = 0;
      faces.forEach(function (lm) {
        var xs = lm.map(function (p) { return p.x; }), ys = lm.map(function (p) { return p.y; });
        var a = (Math.max.apply(null, xs) - Math.min.apply(null, xs)) * (Math.max.apply(null, ys) - Math.min.apply(null, ys));
        if (a > area) { area = a; best = lm; }
      });
      return measure(canvas, best, opt);
    }, function (e) { return { ok: false, reason: "load", error: String(e && e.message || e) }; });
  }

  window.SkinScan = { load: load, run: run };
})();
