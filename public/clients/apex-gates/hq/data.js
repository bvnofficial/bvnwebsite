/* Apex Gates HQ: sample data, price book and the quote engine.
   Everything here is sample data for the preview. The live version reads
   leads and conversations from GHL and jobs from AroFlo. */
(function () {
  const pad = n => String(n).padStart(2, "0");
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayISO = () => iso(new Date());

  // a local date-time string `off` working days from today (Sundays skipped)
  function at(off, hh, mm = 0) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + off);
    if (d.getDay() === 0) d.setDate(d.getDate() + (off < 0 ? -2 : 1));
    return `${iso(d)}T${pad(hh)}:${pad(mm)}`;
  }
  function ago(mins) {
    const d = new Date(Date.now() - mins * 60000);
    return `${iso(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  const BASES = [
    { id: "malaga", name: "Apex Gates HQ, Malaga", lat: -31.8563, lng: 115.8936 },
    { id: "safetybay", name: "Service branch, Safety Bay", lat: -32.3047, lng: 115.7393 }
  ];

  const STAFF = [
    { id: "simon", name: "Simon Sperrin", short: "Simon", role: "Owner", color: "#D61D09" },
    { id: "jake", name: "Jake Morris", short: "Jake", role: "Senior gate technician", color: "#2563EB", van: "Van 1" },
    { id: "liam", name: "Liam Chen", short: "Liam", role: "Gate technician", color: "#0E9F6E", van: "Van 2" },
    { id: "ryan", name: "Ryan Walsh", short: "Ryan", role: "Garage door technician", color: "#8B5CF6", van: "Van 3" }
  ];
  const TECHS = STAFF.filter(s => s.id !== "simon");

  const CHECKLISTS = {
    "Service": ["Check motor and gearbox", "Test safety beams", "Test obstruction sensing", "Lubricate track and rollers", "Check limit switches", "Test remotes and keypad", "Test battery backup"],
    "Breakdown": ["Diagnose the fault", "Repair or replace the part", "Run full open and close cycles", "Test safety beams", "Explain the fix to the client"],
    "Install": ["Footings and track set", "Gate hung and level", "Motor installed and wired", "Limits set", "Safety beams installed", "Remotes coded", "Client handover"],
    "Site visit": ["Measure the opening", "Check slope and clearance", "Check power at the gate", "Take photos", "Talk through options"],
    "Garage door": ["Check springs and cables", "Lubricate moving parts", "Test opener force", "Test safety reverse", "Test remotes"]
  };

  // pre start safety check (job safety analysis) done on site before work starts
  const SAFETY = [
    "Site hazards checked (traffic, pedestrians, overhead lines)",
    "Work area barricaded and signs out",
    "Power isolated and tagged out at the gate",
    "Gate secured so it cannot move",
    "PPE on (gloves, glasses, hi vis, boots)"
  ];

  const PARTS = [
    { id: "beam", name: "Safety beam set", price: 180 },
    { id: "remote", name: "Remote, 4 button", price: 65 },
    { id: "limit", name: "Limit switch", price: 45 },
    { id: "gearbox", name: "Gearbox rebuild kit", price: 320 },
    { id: "board", name: "Control board", price: 590 },
    { id: "battery", name: "Backup battery 12V", price: 55 },
    { id: "rollers", name: "Guide rollers (pair)", price: 140 },
    { id: "spring", name: "Garage door torsion spring", price: 210 }
  ];

  /* ---------- price book (sample rates, swapped for Apex's own list) ---------- */
  const PRICE = {
    gates: {
      sliding:    { name: "Sliding gate",       base: 1900, perM: 520, hours: [6, 0.5],  kgMul: 1 },
      cantilever: { name: "Cantilever gate",    base: 3800, perM: 880, hours: [10, 0.8], kgMul: 1.4 },
      swing:      { name: "Swing gates (pair)", base: 1600, perM: 460, hours: [5, 0.4],  kgMul: 0.5 },
      bifold:     { name: "Bi-fold gate",       base: 2900, perM: 640, hours: [8, 0.6],  kgMul: 0.5 },
      telescopic: { name: "Telescopic gate",    base: 3400, perM: 720, hours: [9, 0.6],  kgMul: 0.6 },
      boom:       { name: "Boom gate",          base: 4950, perM: 140, hours: [6, 0],    kgMul: 0 },
      bollards:   { name: "Bollards",           base: 0,    perM: 0,   hours: [0, 0],    kgMul: 0 }
    },
    materials: {
      slat:     { name: "Steel slat",          mul: 1,    kg: 28 },
      alu:      { name: "Aluminium slat",      mul: 1.15, kg: 14 },
      palisade: { name: "Security palisade",   mul: 1.25, kg: 32 },
      mesh:     { name: "Weld mesh",           mul: 0.9,  kg: 18 },
      timber:   { name: "Timber look battens", mul: 1.2,  kg: 24 }
    },
    heights: { "1.5": 0.92, "1.8": 1, "2.1": 1.12, "2.4": 1.25, "3.0": 1.5 },
    motors: {
      none:   { name: "No motor (manual)",          price: 0,    max: 9999 },
      res:    { name: "Residential motor kit",      price: 1250, max: 300 },
      com:    { name: "Commercial motor kit",       price: 2650, max: 800 },
      heavy:  { name: "Heavy duty industrial motor", price: 4200, max: 2500 }
    },
    bollards: { fixed: { name: "Fixed security bollard", price: 650 }, removable: { name: "Removable bollard", price: 890 }, auto: { name: "Automatic rising bollard", price: 6400 } },
    extras: [
      { id: "beams",   name: "Safety beams",              price: 380 },
      { id: "keypad",  name: "Keypad",                    price: 290 },
      { id: "intercom", name: "Video intercom",           price: 1450 },
      { id: "remotes", name: "4 extra remotes",           price: 220 },
      { id: "battery", name: "Battery backup",            price: 450 },
      { id: "loop",    name: "Vehicle exit loop",         price: 520 },
      { id: "solar",   name: "Solar power kit",           price: 890 },
      { id: "lights",  name: "Post lights",               price: 340 },
      { id: "removal", name: "Remove and dispose old gate", price: 450 },
      { id: "footings", name: "Concrete footings",        price: 650 }
    ],
    labourRate: 115,
    gst: 0.1,
    deposit: 0.3,
    costShare: { goods: 0.62, labour: 0.45 }
  };

  /* quote engine: turns the builder's answers into priced lines plus the
     numbers the owner sees (weight, motor advice, margin) */
  function computeQuote(q) {
    const P = PRICE, lines = [], notes = [];
    let goods = 0, labourH = 0, weight = 0, recMotor = "none";
    if (q.type === "bollards") {
      const b = P.bollards[q.bollardKind] || P.bollards.fixed;
      const n = Math.max(1, +q.qty || 1);
      lines.push({ d: `${b.name}`, q: n, u: b.price });
      goods += b.price * n;
      labourH = n * (q.bollardKind === "auto" ? 7 : 2.5);
      if (q.bollardKind === "auto") notes.push("Rising bollards need a 3 phase or dedicated 240V circuit and a drainage point.");
    } else {
      const g = P.gates[q.type] || P.gates.sliding;
      const m = P.materials[q.material] || P.materials.slat;
      const W = Math.max(1, +q.width || 4), H = q.type === "boom" ? 1 : (P.heights[q.height] || 1);
      const gatePrice = q.type === "boom" ? g.base + g.perM * W : (g.base + g.perM * W) * m.mul * H;
      const desc = q.type === "boom" ? `${g.name}, ${W.toFixed(1)} m arm, motor included` : `${g.name}, ${W.toFixed(1)} m wide x ${q.height} m high, ${m.name.toLowerCase()}`;
      lines.push({ d: desc, q: 1, u: Math.round(gatePrice / 10) * 10 });
      goods += gatePrice;
      labourH = g.hours[0] + g.hours[1] * W;
      if (q.type !== "boom") {
        weight = Math.round(W * (+q.height || 1.8) * m.kg * (g.kgMul || 1) * (q.type === "cantilever" ? 1 : 1));
        recMotor = weight <= P.motors.res.max ? "res" : weight <= P.motors.com.max ? "com" : "heavy";
        if (q.siteType && q.siteType !== "Residential" && recMotor === "res") recMotor = "com";
        const motorId = q.motor === "auto" ? recMotor : q.motor;
        const mo = P.motors[motorId];
        if (mo && mo.price) { lines.push({ d: mo.name + (q.type === "swing" || q.type === "bifold" ? " (both leaves)" : ""), q: 1, u: mo.price * (q.type === "swing" || q.type === "bifold" ? 1.4 : 1) }); goods += mo.price * (q.type === "swing" || q.type === "bifold" ? 1.4 : 1); }
        if (mo && mo.max < weight) notes.push(`The ${mo.name.toLowerCase()} is rated to ${mo.max} kg but this gate is about ${weight} kg. Use the recommended motor.`);
        if (q.type === "cantilever" && W < 4) notes.push("Cantilever gates suit openings of 4 m or more. A sliding gate is cheaper here.");
        if (q.type === "swing" && W > 6) notes.push("Swing leaves over 3 m catch the wind. Consider a sliding or bi-fold gate.");
        if (q.type === "sliding" && q.space === "short") notes.push("There is not enough run back for a sliding gate. Look at telescopic or bi-fold.");
      }
    }
    (q.extras || []).forEach(id => {
      const x = P.extras.find(e => e.id === id);
      if (x) { lines.push({ d: x.name, q: 1, u: x.price }); goods += x.price; labourH += id === "intercom" ? 2 : id === "footings" ? 3 : 0.5; }
    });
    labourH = Math.round(labourH * 2) / 2;
    const labour = labourH * P.labourRate;
    lines.push({ d: `Installation and commissioning (${labourH} hrs)`, q: 1, u: labour });
    let sub = lines.reduce((s, l) => s + l.q * l.u, 0);
    const disc = Math.min(30, Math.max(0, +q.discount || 0));
    if (disc) { const v = -Math.round(sub * disc) / 100; lines.push({ d: `Discount ${disc}%`, q: 1, u: v }); sub += v; }
    const gst = sub * P.gst, total = sub + gst;
    const cost = goods * P.costShare.goods + labour * P.costShare.labour;
    const margin = sub > 0 ? (sub - cost) / sub : 0;
    return { lines, sub, gst, total, deposit: total * P.deposit, labourH, weight, recMotor, margin, profit: sub - cost, notes, days: Math.max(1, Math.ceil(labourH / 8)) };
  }

  function quoteTotals(lines) {
    const sub = lines.reduce((s, l) => s + l.q * l.u, 0);
    return { sub, gst: sub * PRICE.gst, total: sub * (1 + PRICE.gst) };
  }

  /* ---------- seed ---------- */
  function seed() {
    const clients = [
      { id: "c1", name: "Harbourview Strata", type: "Strata", contact: "Karen Doyle", phone: "0412 555 201", email: "karen@harbourviewstrata.com.au", address: "18 Seaview Parade, Rockingham WA 6168", lat: -32.2786, lng: 115.7316, plan: "Quarterly", since: 2019,
        assets: [{ id: "a1", name: "Main sliding gate", kind: "Sliding gate, 7 m, commercial motor", installed: 2019, last: at(-62, 9), warranty: "Expired" }, { id: "a2", name: "Pedestrian gate and intercom", kind: "Swing pedestrian gate, audio intercom", installed: 2019, last: at(-62, 9), warranty: "Expired" }] },
      { id: "c2", name: "Wangara Steel Supplies", type: "Industrial", contact: "Mark Hughes", phone: "0423 555 118", email: "mark@wangarasteel.com.au", address: "42 Prosperity Avenue, Wangara WA 6065", lat: -31.7905, lng: 115.8302, plan: "Monthly", since: 2020,
        assets: [{ id: "a3", name: "Yard cantilever gate", kind: "Cantilever gate, 9 m, heavy duty motor", installed: 2020, last: at(-25, 8), warranty: "Expired" }, { id: "a4", name: "Visitor boom gate", kind: "Boom gate, 5 m arm", installed: 2022, last: at(-25, 8), warranty: "Until 2027" }] },
      { id: "c3", name: "Lakeside Business Park", type: "Commercial", contact: "Priya Sharma", phone: "0438 555 640", email: "facilities@lakesidepark.com.au", address: "7 Hasler Road, Osborne Park WA 6017", lat: -31.9021, lng: 115.8124, plan: "Quarterly", since: 2018,
        assets: [{ id: "a5", name: "Entry boom gate", kind: "Boom gate, 4.5 m arm", installed: 2018, last: at(0, 7, 30), warranty: "Expired" }, { id: "a6", name: "Exit boom gate", kind: "Boom gate, 4.5 m arm", installed: 2018, last: at(0, 7, 30), warranty: "Expired" }, { id: "a7", name: "After hours sliding gate", kind: "Sliding gate, 8 m", installed: 2021, last: at(0, 7, 30), warranty: "Until 2026" }] },
      { id: "c4", name: "Sarah Nguyen", type: "Residential", contact: "Sarah Nguyen", phone: "0401 555 732", email: "sarah.nguyen@email.com", address: "23 Eucalyptus Drive, Ellenbrook WA 6069", lat: -31.7752, lng: 115.9688, plan: null, since: 2026,
        assets: [{ id: "a8", name: "Driveway swing gates", kind: "Double swing gates, 4.2 m, manual", installed: 2024, last: null, warranty: "Until 2029" }] },
      { id: "c5", name: "Canning Vale Logistics", type: "Industrial", contact: "Tom Bradley", phone: "0447 555 902", email: "tom@cvlogistics.com.au", address: "110 Bannister Road, Canning Vale WA 6155", lat: -32.0718, lng: 115.9213, plan: "Monthly", since: 2021,
        assets: [{ id: "a9", name: "Truck gate", kind: "Telescopic gate, 12 m", installed: 2021, last: at(-27, 9), warranty: "Expired" }, { id: "a10", name: "Loading dock bollards", kind: "4 automatic rising bollards", installed: 2023, last: at(-27, 9), warranty: "Until 2028" }] },
      { id: "c6", name: "David Patel", type: "Residential", contact: "David Patel", phone: "0419 555 377", email: "dpatel@email.com", address: "5 Brighton Road, Scarborough WA 6019", lat: -31.8932, lng: 115.7571, plan: null, since: 2023,
        assets: [{ id: "a11", name: "Driveway sliding gate", kind: "Sliding gate, 4 m, aluminium", installed: 2023, last: at(-180, 10), warranty: "Until 2028" }, { id: "a12", name: "Double garage door", kind: "Sectional garage door with opener", installed: 2016, last: null, warranty: "Expired" }] },
      { id: "c7", name: "Midland Medical Centre", type: "Commercial", contact: "Dr Helen Ross", phone: "0408 555 214", email: "practice@midlandmedical.com.au", address: "3 Victoria Street, Midland WA 6056", lat: -31.8888, lng: 116.0108, plan: "Biannual", since: 2022,
        assets: [{ id: "a13", name: "Car park boom gate", kind: "Boom gate, 4 m arm", installed: 2022, last: at(-170, 9), warranty: "Until 2027" }] },
      { id: "c8", name: "Baldivis Grammar", type: "Commercial", contact: "Andrew Kemp", phone: "0433 555 860", email: "facilities@baldivisgrammar.wa.edu.au", address: "60 Settlers Avenue, Baldivis WA 6171", lat: -32.3311, lng: 115.8283, plan: "Quarterly", since: 2020,
        assets: [{ id: "a14", name: "Front swing gates", kind: "Double swing gates, 6 m", installed: 2020, last: at(-88, 9), warranty: "Expired" }, { id: "a15", name: "Drop off bollards", kind: "6 removable bollards", installed: 2020, last: at(-88, 9), warranty: "Expired" }] },
      { id: "c9", name: "Welshpool Freight", type: "Industrial", contact: "Gary Lim", phone: "0429 555 455", email: "gary@welshpoolfreight.com.au", address: "28 Kewdale Road, Welshpool WA 6106", lat: -31.9951, lng: 115.9352, plan: null, since: 2026, assets: [] },
      { id: "c10", name: "Emma Wilson", type: "Residential", contact: "Emma Wilson", phone: "0402 555 619", email: "emma.w@email.com", address: "11 Marine Parade, Cottesloe WA 6011", lat: -31.9962, lng: 115.7578, plan: null, since: 2024,
        assets: [{ id: "a16", name: "Bi-fold driveway gate", kind: "Bi-fold gate, 4.8 m, timber look", installed: 2024, last: at(-1, 9), warranty: "Until 2029" }, { id: "a17", name: "Garage door", kind: "Roller door with opener", installed: 2018, last: at(0, 9), warranty: "Expired" }] },
      { id: "c11", name: "Peel Marina Apartments", type: "Strata", contact: "Rob Fielding", phone: "0414 555 093", email: "manager@peelmarina.com.au", address: "2 Marina Quay, Mandurah WA 6210", lat: -32.5357, lng: 115.7437, plan: "Quarterly", since: 2021,
        assets: [{ id: "a18", name: "Car park sliding gate", kind: "Sliding gate, 6 m", installed: 2021, last: at(-91, 9), warranty: "Expired" }, { id: "a19", name: "Visitor boom gate", kind: "Boom gate, 4 m arm", installed: 2021, last: at(-91, 9), warranty: "Expired" }] },
      { id: "c12", name: "Bayswater Auto Group", type: "Commercial", contact: "Nick Russo", phone: "0421 555 726", email: "nick@bayswaterauto.com.au", address: "250 Guildford Road, Bayswater WA 6053", lat: -31.9184, lng: 115.9181, plan: "Quarterly", since: 2025,
        assets: [{ id: "a20", name: "Showroom yard gate", kind: "Sliding gate, 9 m, palisade", installed: 2025, last: at(-92, 9), warranty: "Until 2030" }] },
      { id: "c13", name: "Henderson Marine Works", type: "Industrial", contact: "Shane O'Brien", phone: "0436 555 281", email: "shane@hendersonmarine.com.au", address: "14 Quill Way, Henderson WA 6166", lat: -32.1563, lng: 115.7762, plan: "Monthly", since: 2019,
        assets: [{ id: "a21", name: "Wharf cantilever gate", kind: "Cantilever gate, 11 m", installed: 2019, last: at(-29, 9), warranty: "Expired" }, { id: "a22", name: "Security bollards", kind: "3 automatic rising bollards", installed: 2023, last: at(-29, 9), warranty: "Until 2028" }] },
      { id: "c14", name: "Josh and Kate Robinson", type: "Residential", contact: "Kate Robinson", phone: "0405 555 148", email: "kate.robinson@email.com", address: "9 Lakeside Drive, Joondalup WA 6027", lat: -31.7449, lng: 115.7702, plan: null, since: 2026, assets: [] },
      { id: "c15", name: "Ashby Early Learning", type: "Commercial", contact: "Lauren Mills", phone: "0417 555 330", email: "director@ashbyearly.com.au", address: "31 Ashby Boulevard, Ashby WA 6065", lat: -31.7322, lng: 115.7975, plan: null, since: 2026, assets: [] },
      { id: "c16", name: "Mike Turner", type: "Residential", contact: "Mike Turner", phone: "0430 555 772", email: "mturner@email.com", address: "47 Wanneroo Road, Wanneroo WA 6065", lat: -31.7496, lng: 115.8037, plan: null, since: 2026, assets: [] },
      { id: "c17", name: "Forrestfield Storage", type: "Commercial", contact: "Ben Carter", phone: "0426 555 905", email: "ben@forrestfieldstorage.com.au", address: "88 Dundas Road, Forrestfield WA 6058", lat: -31.9862, lng: 116.0067, plan: null, since: 2026, assets: [] }
    ];

    const J = (id, clientId, type, tech, start, dur, status, title, extra = {}) => {
      const list = CHECKLISTS[type] || CHECKLISTS.Service;
      const done = status === "Completed" ? list.length : status === "In progress" ? 2 : 0;
        return Object.assign({ id, clientId, type, tech, start, dur, status, title, priority: "Normal", notes: "", checklist: list.map((t, i) => ({ t, done: i < done })), photos: [], parts: [], signature: null, eta: null, report: null,
        safety: status === "Completed" || status === "In progress" ? SAFETY.map(() => true) : null,
        labour: status === "Completed" ? dur : status === "In progress" ? 0.5 : 0 }, extra);
    };
    const jobs = [
      J("J-2296", "c10", "Service", "jake", at(-1, 9), 1.5, "Completed", "Bi-fold gate 12 month service"),
      J("J-2297", "c2", "Service", "liam", at(-1, 8), 2, "Completed", "Monthly service"),
      J("J-2298", "c13", "Breakdown", "liam", at(-2, 13), 1.5, "Completed", "Bollard not rising fully"),
      J("J-2299", "c3", "Install", "jake", at(-3, 8), 7, "Completed", "Install after hours sliding gate motor upgrade"),
      J("J-2311", "c3", "Service", "jake", at(0, 7, 30), 2, "Completed", "Quarterly service, 3 gates"),
      J("J-2312", "c2", "Breakdown", "liam", at(0, 8), 1.5, "In progress", "Cantilever gate stuck half open", { priority: "Urgent", notes: "Motor showing fault code E3. Mark called at 7:05am." }),
      J("J-2313", "c1", "Breakdown", "jake", at(0, 10, 30), 1.5, "On the way", "Main gate not closing fully, beams flashing", { priority: "Urgent", eta: 25, notes: "Residents worried about security overnight. Probably beam alignment or a failed beam." }),
      J("J-2317", "c10", "Garage door", "ryan", at(0, 8, 30), 1, "Completed", "Roller door service"),
      J("J-2314", "c6", "Garage door", "ryan", at(0, 13), 1, "Scheduled", "Garage door opener slow and noisy"),
      J("J-2316", "c14", "Site visit", "liam", at(0, 12, 30), 1, "Scheduled", "Measure up for new sliding gate"),
      J("J-2315", "c8", "Service", "jake", at(0, 13, 30), 2, "Scheduled", "Quarterly service, gates and bollards"),
      J("J-2318", "c12", "Service", "liam", at(0, 15), 1.5, "Scheduled", "Quarterly service"),
      J("J-2319", "c9", "Install", "jake", at(1, 8), 7, "Scheduled", "Install 8 m cantilever gate and heavy duty motor", { notes: "Footings poured last week. Crane booked 8:30am." }),
      J("J-2320", "c5", "Service", "liam", at(1, 8, 30), 2, "Scheduled", "Monthly service, truck gate and bollards"),
      J("J-2321", "c16", "Garage door", "ryan", at(1, 9), 1, "Scheduled", "Garage door grinding, opens halfway"),
      J("J-2322", "c13", "Service", "liam", at(1, 12), 1.5, "Scheduled", "Monthly service"),
      J("J-2323", "c11", "Service", "jake", at(2, 8), 2, "Scheduled", "Quarterly service"),
      J("J-2324", "c7", "Service", "liam", at(2, 9), 1, "Scheduled", "Six monthly boom gate service"),
      J("J-2325", "c15", "Site visit", "ryan", at(2, 14), 1, "Scheduled", "Child safe pedestrian gate and car park gate"),
      J("J-2326", "c12", "Install", "jake", at(3, 8), 6, "Scheduled", "Install 7 m sliding gate, keypad and beams"),
      J("J-2327", "c2", "Service", "liam", at(3, 10), 1.5, "Scheduled", "Boom gate arm check after impact"),
      J("J-2328", "c17", "Site visit", "liam", at(4, 9), 1, "Scheduled", "Boom gate with number plate recognition"),
      J("J-2330", "c13", "Breakdown", null, null, 1, "To schedule", "Bollard LED ring not lighting", { notes: "Requested through the client portal." })
    ];
    jobs.find(j => j.id === "J-2311").report = "All three gates serviced. Exit boom arm spring adjusted. No faults.";

    const quotes = [
      { id: "Q-1043", clientId: "c7", title: "Second boom gate for staff car park", status: "Declined", created: at(-20, 10), sent: at(-20, 11),
        lines: [{ d: "Boom gate, 4.0 m arm, motor included", q: 1, u: 5510 }, { d: "Vehicle exit loop", q: 1, u: 520 }, { d: "Installation and commissioning (6.5 hrs)", q: 1, u: 747.5 }], reason: "Budget moved to next financial year." },
      { id: "Q-1044", clientId: "c9", title: "8 m cantilever gate with heavy duty motor", status: "Accepted", created: at(-14, 9), sent: at(-14, 15), accepted: at(-12, 10), sig: "Gary Lim",
        lines: [{ d: "Cantilever gate, 8.0 m wide x 2.1 m high, security palisade", q: 1, u: 15190 }, { d: "Heavy duty industrial motor", q: 1, u: 4200 }, { d: "Safety beams", q: 1, u: 380 }, { d: "Vehicle exit loop", q: 1, u: 520 }, { d: "Installation and commissioning (17 hrs)", q: 1, u: 1955 }] },
      { id: "Q-1045", clientId: "c12", title: "New 7 m sliding gate, keypad and beams", status: "Accepted", created: at(-9, 9), sent: at(-9, 12), accepted: at(-6, 16), sig: "Nick Russo",
        lines: [{ d: "Sliding gate, 7.0 m wide x 2.1 m high, security palisade", q: 1, u: 7650 }, { d: "Commercial motor kit", q: 1, u: 2650 }, { d: "Safety beams", q: 1, u: 380 }, { d: "Keypad", q: 1, u: 290 }, { d: "Installation and commissioning (10.5 hrs)", q: 1, u: 1207.5 }] },
      { id: "Q-1046", clientId: "c4", title: "Automate double swing gates", status: "Sent", created: at(-2, 10), sent: at(-2, 10), viewed: at(-1, 19),
        lines: [{ d: "Residential swing gate motor kit (both leaves)", q: 1, u: 1890 }, { d: "Safety beams", q: 1, u: 380 }, { d: "Keypad", q: 1, u: 290 }, { d: "4 extra remotes", q: 1, u: 220 }, { d: "Installation and commissioning (6 hrs)", q: 1, u: 690 }] },
      { id: "Q-1047", clientId: "c1", title: "Upgrade pedestrian gate to video intercom", status: "Sent", created: at(-1, 14), sent: at(-1, 14),
        lines: [{ d: "Video intercom", q: 1, u: 1450 }, { d: "Installation and commissioning (3 hrs)", q: 1, u: 345 }] }
    ];

    const invoices = [
      { id: "INV-1180", clientId: "c3", jobId: "J-2299", amount: 4380, status: "Paid", issued: at(-3, 16), due: at(11, 0), paid: at(-1, 10) },
      { id: "INV-1181", clientId: "c1", jobId: null, title: "Quarterly maintenance, Q3", amount: 1320, status: "Overdue", issued: at(-35, 9), due: at(-5, 0) },
      { id: "INV-1182", clientId: "c2", jobId: "J-2297", amount: 495, status: "Paid", issued: at(-1, 12), due: at(13, 0), paid: at(0, 7) },
      { id: "INV-1183", clientId: "c10", jobId: "J-2296", amount: 289, status: "Due", issued: at(-1, 12), due: at(13, 0) },
      { id: "INV-1184", clientId: "c13", jobId: "J-2298", amount: 610, status: "Due", issued: at(-2, 15), due: at(12, 0) },
      { id: "INV-1185", clientId: "c12", jobId: null, title: "Deposit for Q-1045", amount: 3971, status: "Paid", issued: at(-6, 16), due: at(-6, 16), paid: at(-5, 9) },
      { id: "INV-1186", clientId: "c9", jobId: null, title: "Deposit for Q-1044", amount: 7347, status: "Paid", issued: at(-12, 10), due: at(-12, 10), paid: at(-11, 9) }
    ];

    const m = (from, text, mins, extra = {}) => Object.assign({ from, text, at: ago(mins) }, extra);
    const convos = [
      { id: "v1", clientId: "c16", channel: "AI call", unread: true, at: ago(14 * 60),
        msgs: [m("ai", "", 14 * 60, { kind: "call", duration: "3:12", summary: "Garage door opens halfway then stops, grinding noise from the opener. Wanneroo. Wants a visit this week, mornings preferred. Booked Ryan for tomorrow 9:00am and sent a confirmation text.",
          transcript: [["AI", "Thanks for calling Apex Gates. Our team is out on jobs, I'm the after hours assistant. How can I help?"], ["Mike", "Hi, my garage door is making a grinding noise and it only opens halfway now."], ["AI", "Sorry to hear that. Is the car stuck inside, or can you still get in and out?"], ["Mike", "I can get out, it's just loud and slow."], ["AI", "Okay, that's not an emergency then. Which suburb are you in?"], ["Mike", "Wanneroo."], ["AI", "Our garage door technician Ryan can come tomorrow at 9am. Does that work?"], ["Mike", "Yep, perfect."], ["AI", "Done. You'll get a text with the booking now. Anything else?"], ["Mike", "No, that's it, thanks."]] })] },
      { id: "v2", clientId: "c15", channel: "Website", unread: true, at: ago(95),
        msgs: [m("client", "Quote request from apexgates.com.au\nService: New gate or automation\nSite: Early learning centre, Ashby\n\nWe need a child safe pedestrian gate with a keypad at the front, and a sliding gate for the staff car park. Safety is our top priority. Can someone come and look this week?", 95, { photo: true })] },
      { id: "v3", clientId: "c4", channel: "Email", unread: true, at: ago(40),
        msgs: [m("apex", "Hi Sarah, your quote Q-1046 for automating the swing gates is ready. You can view and accept it in your Apex Gates portal.", 2 * 24 * 60), m("client", "Hi Simon, thanks for the quote, it looks good. Quick question: do the motors still work in a power cut? We lose power a few times every summer.", 40)] },
      { id: "v4", clientId: "c1", channel: "SMS", unread: false, at: ago(18),
        msgs: [m("client", "Hi, our main gate won't close fully and the beams keep flashing. Residents are worried about security tonight.", 175), m("apex", "Thanks Karen, we'll get someone out this morning. Jake is booked for 10:30.", 168, { name: "Simon" }), m("auto", "Jake from Apex Gates is on the way. Arriving in about 25 minutes. Track the visit in your portal.", 18)] },
      { id: "v5", clientId: "c17", channel: "Facebook", unread: true, at: ago(220),
        msgs: [m("client", "Hi there, do you do boom gates with number plate recognition? We have 400 units and want to stop tailgating after hours.", 220)] },
      { id: "v6", clientId: "c2", channel: "SMS", unread: false, at: ago(55),
        msgs: [m("client", "Gate stuck half open, can't lock the yard. Can someone come asap?", 125), m("apex", "On it Mark, Liam will be there by 8.", 120, { name: "Simon" }), m("client", "Liam's here now. Thanks for getting someone out so fast.", 55)] },
      { id: "v7", clientId: null, staffId: "jake", channel: "Team", unread: true, at: ago(22),
        msgs: [m("staff", "Finished Lakeside. Heading to Harbourview now, Kwinana Fwy is slow so ETA about 25 min.", 22, { name: "Jake" })] },
      { id: "v8", clientId: "c14", channel: "Website", unread: false, at: ago(3 * 24 * 60),
        msgs: [m("client", "Quote request from apexgates.com.au\nService: New gate or automation\n\nWe're after an automatic sliding gate for our new driveway, about 5 m wide. Modern look, maybe aluminium slats.", 3 * 24 * 60), m("apex", "Thanks Kate. Liam can come out Thursday at 12:30 to measure up. Does that suit?", 3 * 24 * 60 - 30, { name: "Simon" }), m("client", "Perfect, see you then.", 3 * 24 * 60 - 90)] }
    ];

    const opps = [
      { id: "o1", clientId: "c15", title: "Pedestrian gate and car park gate", value: 14500, stage: "New lead", source: "Website", at: ago(95) },
      { id: "o2", clientId: "c16", title: "Garage door repair", value: 420, stage: "Site visit", source: "AI receptionist", at: ago(14 * 60) },
      { id: "o3", clientId: "c17", title: "Boom gate with plate recognition", value: 18900, stage: "Site visit", source: "Facebook", at: ago(220) },
      { id: "o4", clientId: null, name: "Jandakot Hangar Co", title: "Two cantilever gates", value: 36000, stage: "Contacted", source: "Google", at: ago(2 * 24 * 60) },
      { id: "o5", clientId: "c14", title: "5 m aluminium sliding gate", value: 7800, stage: "Site visit", source: "Website", at: ago(3 * 24 * 60) },
      { id: "o6", clientId: "c4", title: "Automate double swing gates", value: 3817, stage: "Quote sent", source: "Google", at: ago(2 * 24 * 60), quoteId: "Q-1046" },
      { id: "o7", clientId: "c1", title: "Video intercom upgrade", value: 1975, stage: "Quote sent", source: "Existing client", at: ago(24 * 60), quoteId: "Q-1047" },
      { id: "o8", clientId: "c12", title: "New 7 m sliding gate", value: 13395, stage: "Won", source: "Referral", at: ago(6 * 24 * 60), quoteId: "Q-1045" },
      { id: "o9", clientId: "c9", title: "8 m cantilever gate", value: 24470, stage: "Won", source: "Google", at: ago(12 * 24 * 60), quoteId: "Q-1044" },
      { id: "o10", clientId: "c7", title: "Second boom gate", value: 7454, stage: "Lost", source: "Existing client", at: ago(20 * 24 * 60), quoteId: "Q-1043" },
      { id: "o11", clientId: null, name: "Malaga Self Storage", title: "Keypad access upgrade", value: 2600, stage: "New lead", source: "Referral", at: ago(5 * 60) }
    ];

    const notices = [
      { id: "n1", role: "ceo", text: "AI receptionist booked Mike Turner (garage door) for tomorrow 9:00am", at: ago(14 * 60), go: "ceo/inbox/v1" },
      { id: "n2", role: "ceo", text: "Sarah Nguyen viewed quote Q-1046", at: ago(17 * 60), go: "ceo/quotes/Q-1046" },
      { id: "n3", role: "ceo", text: "Wangara Steel paid INV-1182 ($495)", at: ago(160), go: "ceo/invoices" },
      { id: "n4", role: "ceo", text: "New website enquiry from Ashby Early Learning", at: ago(95), go: "ceo/inbox/v2" },
      { id: "n5", role: "ceo", text: "Jake is on the way to Harbourview Strata", at: ago(18), go: "ceo/map" }
    ];

    return {
      v: 1, seededOn: todayISO(), clients, jobs, quotes, invoices, convos, opps, notices,
      clock: { jake: at(0, 7, 2), liam: at(0, 7, 41), ryan: at(0, 8, 9) },
      hours: { jake: [8.5, 9, 7.5, 8], liam: [8, 8.5, 8, 9], ryan: [7.5, 8, 6, 8] },
      revenue: [48200, 53900, 51200, 60400, 64800],
      // van stock by technician, with the reorder level for each part
      stock: {
        jake: { beam: 2, remote: 6, limit: 3, gearbox: 1, board: 0, battery: 2, rollers: 1, spring: 0 },
        liam: { beam: 1, remote: 4, limit: 2, gearbox: 0, board: 1, battery: 3, rollers: 2, spring: 0 },
        ryan: { beam: 0, remote: 5, limit: 1, gearbox: 0, board: 0, battery: 1, rollers: 0, spring: 2 },
        warehouse: { beam: 8, remote: 30, limit: 12, gearbox: 3, board: 2, battery: 10, rollers: 6, spring: 4 }
      },
      reorder: { beam: 2, remote: 4, limit: 2, gearbox: 1, board: 1, battery: 2, rollers: 2, spring: 1 },
      pos: [
        { id: "PO-0412", supplier: "Gate Motor Supplies WA", items: "2 x Control board, 4 x Safety beam set", amount: 1900, status: "Ordered", at: at(-2, 11), jobId: null },
        { id: "PO-0411", supplier: "Perth Steel Fabrication", items: "8 m cantilever gate, security palisade", amount: 9850, status: "Received", at: at(-10, 9), jobId: "J-2319" }
      ],
      seq: { job: 2331, quote: 1048, inv: 1187, msg: 1, opp: 12, notice: 6 }
    };
  }

  window.APEX = { seed, at, ago, todayISO, iso, BASES, STAFF, TECHS, CHECKLISTS, PARTS, SAFETY, PRICE, computeQuote, quoteTotals };
})();
