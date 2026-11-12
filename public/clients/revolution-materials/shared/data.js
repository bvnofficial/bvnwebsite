/* Revolution Materials: shared content for all five website drafts.
   Source: the current revolutionmaterials.com.au (metals, fasteners, about pages). */
window.RM = {
  name: "Revolution Materials",
  legal: "Revolution Advanced Metals & Materials",
  tagline: "Specialist metals and alloy fasteners, sourced to specification.",
  since: "Since the early 1980s",
  phone1: "+61 3 9029 3469",
  phone2: "+61 3 9314 0485",
  tel: "+61390293469",
  email: "info@revolutionmaterials.com.au",
  address: "Unit 7, 37-39 Little Boundary Road, Laverton North VIC 3026",
  postal: "PO Box 5, Newport VIC 3015",
  forms: ["Sheet and plate", "Coil, strip and foil", "Bar and billet", "Tube and pipe", "Fittings and flanges", "Drawn wire and wire rod", "Clad plate", "Expanded metal", "Fasteners"],
  metals: [
    { sym: "Ss", key: "stainless", name: "Stainless Steels", short: "Austenitic, martensitic, duplex and super duplex grades.",
      grades: ["303", "304 / 304L / 304H", "316 / 316L / 316H", "316Ti", "316LMo", "317 / 317L", "309 / 309S", "310 / 310S", "321", "347", "348", "410 / 410S", "416", "420", "431", "17-4PH", "904L", "254 SMO", "2205 Duplex", "Ferralium 255", "Nitronic 50", "Nitronic 60"],
      fact: "Molybdenum in 316 gives it superior corrosion resistance to the 304 series." },
    { sym: "Ni", key: "nickel", name: "Nickel Alloys", short: "Aerospace and corrosion grades for the hardest service.",
      grades: ["Nickel 200 / 201", "Monel 400", "Monel K-500", "Inconel 600", "Inconel 601", "Inconel 617", "Inconel 625", "Inconel 718", "Inconel X-750", "Inconel 725", "Hastelloy B-2", "Hastelloy B-3", "Hastelloy C-22", "Hastelloy C-276", "Hastelloy X", "Incoloy 800 / 800HT", "Incoloy 825", "Incoloy 925", "Nimonic 75", "Nimonic 80A", "Nimonic 90", "Carpenter 20"],
      fact: "Alloy 718 holds its creep rupture strength up to 700 °C." },
    { sym: "Ti", key: "titanium", name: "Titanium", short: "Commercially pure and alloyed, Grades 1 to 18.",
      grades: ["CP Grade 1", "CP Grade 2", "CP Grade 3", "CP Grade 4", "Grade 5 (6Al-4V)", "Grade 6", "Grade 7", "Grade 9 (3Al-2.5V)", "Grade 11", "Grade 12", "Grade 16", "Grade 17", "Grade 18"],
      fact: "Grade 5 (6Al-4V) is used in critical aircraft structural components." },
    { sym: "Cr", key: "alloy", name: "Alloy Steels", short: "Chrome moly and high tensile grades to ASTM, DIN and BS.",
      grades: ["ASTM A182 F1 to F22", "ASTM A193 B7 / B16", "ASTM A335 P1 to P22", "ASTM A387 5 to 91 PVQ", "ASTM A350 LF1 / LF2 / LF3", "ASTM A514", "ASTM A588", "EN16", "EN19", "EN24", "EN26", "4140", "Durehete 1055", "Esshete 1250"],
      fact: "We focus on alloy steel grades not readily available in Australia." },
    { sym: "Mo", key: "other", name: "Other Metals", short: "Cobalt, molybdenum, tantalum, zirconium and the unusual.",
      grades: ["Copper nickel alloys", "Nickel silvers", "Cobalt based medical alloys", "Pure molybdenum", "Molybdenum alloys", "Tantalum", "Zirconium 702 / 705", "Maraging tool steels", "Thermocouple alloys", "Controlled expansion alloys", "Electrical resistance alloys", "Magnetic and electronic alloys"],
      fact: "If you cannot source it anywhere else, try us." }
  ],
  fasteners: [
    { key: "bolts", name: "Bolts", items: ["Hexagon", "Square head", "12 point", "Mushroom head", "Washer faced", "Studbolts", "Indented foundation"] },
    { key: "studs", name: "Studs", items: ["Allthread", "Waisted", "Studbolts"] },
    { key: "screws", name: "Screws", items: ["Socket head capscrews", "Setscrews", "Grubscrews", "Cheese head", "Pan head", "Countersunk", "Slotted roundhead", "Socket button head", "Socket countersunk", "Socket shoulder", "Machine screws"] },
    { key: "nuts", name: "Nuts", items: ["Full", "Half", "Lock", "Self locking", "Washer faced", "12 point", "Round", "Ring", "Castellated", "Dome", "Cap", "Nyloc type"] },
    { key: "washers", name: "Washers", items: ["Standard forms", "Tab", "Dished", "Keyed", "Spring", "Tapered"] },
    { key: "other", name: "Other", items: ["Plugs", "Keys", "Welding adaptors"] }
  ],
  fastenerMaterials: [
    { name: "Stainless", list: "303, 304L, 309, 310, 316L, 316Ti, 317L, 321, 347, 410, 431, 17-4PH, 904L, 254 SMO, A-286" },
    { name: "Duplex and Super Duplex", list: "2205 (UNS 31803), Falc 223, Ferralium 255, UNS 32550" },
    { name: "Titanium", list: "Grades 1, 2, 3, 4, 5, 7, 9, 11, 12, 16, 17, 18" },
    { name: "Super Alloys", list: "Monel 400 and K500, Hastelloy C-276, Inconel 600, 625, 718, Incoloy 800HT, 825, Nimonic 80A, Zirconium 702" },
    { name: "Petroleum and Chemical", list: "ASTM A193 / A194 / A320: B7, B7M, B8, B8M, B16, L7 and more" },
    { name: "Heat Resisting", list: "Durehete 900, 950, 1055, Esshete 1250, 21CrMoV57, 24CrMo4" },
    { name: "Bronzes", list: "Aluminium bronze, phosphor bronze, Hiduron, cupro nickel, brass" }
  ],
  proof: [
    { n: "40+", l: "years in specialty metals" },
    { n: "3 to 200", u: "mm", l: "fastener size range" },
    { n: "9", l: "product forms" },
    { n: "100%", l: "certified material" }
  ],
  promises: [
    { t: "Sourced to specification", d: "ASTM, DIN, BS, Werkstoff or your own drawing. The right material at the right spec." },
    { t: "Small orders welcome", d: "One special bolt or a full shipment. Small orders are a specialty." },
    { t: "Full certification", d: "Mill certificates, heat treatment, coatings and testing on request." },
    { t: "A global supply network", d: "Rolling mills, specialist makers and stockists across Europe, Asia and North America." }
  ],
  industries: ["Oil and gas", "Petrochemical", "Mining", "Power generation", "Defence", "Marine", "Food and pharma", "Aerospace", "Water treatment", "Heavy fabrication"]
};
