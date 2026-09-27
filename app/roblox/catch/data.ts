// CATCH! game facts for the site, taken from the game's own data files.
export const GAME_URL = "https://www.roblox.com/games/79002892141852/Catch";

export const RARITIES = [
  { id: "common", name: "Common", color: "#b2b8c4" },
  { id: "rare", name: "Rare", color: "#48c774" },
  { id: "epic", name: "Epic", color: "#4096ff" },
  { id: "legendary", name: "Legendary", color: "#a85aff" },
  { id: "mythic", name: "Mythic", color: "#ff8a28" },
  { id: "divine", name: "Divine", color: "#ffd440" },
  { id: "ethereal", name: "Ethereal", color: "#ffaaeb" },
] as const;

export const rarityColor = (id: string) => RARITIES.find((r) => r.id === id)?.color ?? "#b2b8c4";
export const rarityName = (id: string) => RARITIES.find((r) => r.id === id)?.name ?? id;

export const FINISHES = [
  { id: "Normal", mult: 1, color: "#e8e3ff" },
  { id: "Gold", mult: 5, color: "#ffd23f" },
  { id: "Lava", mult: 15, color: "#ff6a2b" },
  { id: "Diamond", mult: 35, color: "#8ff3ff" },
  { id: "Rainbow", mult: 60, color: "#ff9bf0" },
  { id: "Galaxy", mult: 100, color: "#9a6bff" },
  { id: "Hacker", mult: 150, color: "#5cff8a" },
];

export const SKILL_BLURB: Record<string, string> = {
  Swift: "You move faster on foot.",
  Scholar: "Monsters on your hub gain experience faster.",
  Magnate: "Your hub earns more every second.",
  Fortune: "Everything you sell is worth more.",
  "Keen Eye": "Spheres catch more often.",
  Vigour: "You sprint for longer before running out.",
  Bound: "Double jump. Epic and rarer only.",
  Soar: "Hold jump to fly. Mythic and rarer only.",
};

export const SIZES = [
  { name: "Undersized", note: "Small and light" },
  { name: "Normal", note: "The usual" },
  { name: "Large", note: "Bigger, heavier, worth more" },
  { name: "Huge", note: "The whole server is told" },
  { name: "Titan", note: "Comic alert for everyone" },
  { name: "Super Titan", note: "The loudest alert in the game" },
];

// World bands, from the plaza outwards. Spawn weights per wave on a normal server.
export const BIOMES = [
  {
    id: "meadow", ring: 1, name: "Sunny Meadow", top: "common", bg: "linear-gradient(135deg,#6fd26a,#2f8f45)",
    blurb: "Where every trainer starts. Bright green fields full of Commons and Rares, and the odd lucky Epic.",
    w: { common: 51, rare: 27, epic: 2 },
  },
  {
    id: "woodland", ring: 2, name: "Old Woodland", top: "rare", bg: "linear-gradient(135deg,#3f8a4c,#1f4d2b)",
    blurb: "Tall old trees and mossy rocks. Rares take over here and Epics start to show up.",
    w: { common: 44, rare: 37, epic: 8 },
  },
  {
    id: "highlands", ring: 3, name: "Rocky Highlands", top: "epic", bg: "linear-gradient(135deg,#9b8d7a,#5a4d40)",
    blurb: "Cliffs and boulders. Epic monsters rule the high ground.",
    w: { common: 15, rare: 23, epic: 25 },
  },
  {
    id: "ashen", ring: 4, name: "Ashen Wastes", top: "legendary", bg: "linear-gradient(135deg,#5a3a3a,#231416)",
    blurb: "Burnt ground and smoking stone. The first place Legendaries walk around.",
    w: { common: 15, rare: 10, epic: 18, legendary: 21 },
  },
  {
    id: "frozen", ring: 5, name: "Frozen Reach", top: "mythic", bg: "linear-gradient(135deg,#9fd8ff,#3f74b8)",
    blurb: "Ice fields at the edge of the map. Mythics are the most common thing out here.",
    w: { common: 11, rare: 9, epic: 14, legendary: 17, mythic: 28 },
  },
  {
    id: "crater", ring: 6, name: "Skyfall Crater", top: "divine", bg: "linear-gradient(135deg,#ff9a3c,#8a2a52)",
    blurb: "Something fell from the sky and left glowing rocks. Divine monsters live here.",
    w: { common: 13, rare: 8, epic: 11, legendary: 10, mythic: 15, divine: 18 },
  },
  {
    id: "rift", ring: 7, name: "The Void Rift", top: "ethereal", bg: "linear-gradient(135deg,#3a1a78,#0d0520)",
    blurb: "The very edge of the world. Two Ethereals appear somewhere in the Rift every ten minutes. Be fast.",
    w: { common: 5, rare: 5, epic: 5, legendary: 6, mythic: 11, divine: 21 },
  },
];

export const WEATHER = [
  { id: "thunderstorm", name: "Thunderstorm", giant: "Zeusmo the Storm King", mut: "Shocked", x: "1.5x", time: "3 min", color: "#7aa6ff", event: false },
  { id: "voltage-surge", name: "Voltage Surge", giant: "Ohm Bot 9000", mut: "Volted", x: "2x", time: "2.5 min", color: "#50dcff", event: false },
  { id: "firestorm", name: "Firestorm", giant: "Magmus the Hothead", mut: "Rage", x: "3x", time: "2 min 20", color: "#ff7a28", event: false },
  { id: "void-eclipse", name: "Void Eclipse", giant: "Nocturna the Sky Whale", mut: "Void", x: "5x", time: "2 min", color: "#8c46dc", event: false },
  { id: "aurora-bloom", name: "Aurora Bloom", giant: "Lumideer of the North", mut: "Eternal", x: "10x", time: "1 min 40", color: "#78f0be", event: false },
  { id: "data-storm", name: "Data Storm", giant: "Glitchar the Corrupted", mut: "Glitched", x: "15x", time: "Event", color: "#3cff78", event: true },
  { id: "prism-rain", name: "Prism Rain", giant: "Prismira the Crystal Phoenix", mut: "Prismatic", x: "20x", time: "Event", color: "#ffa0ff", event: true },
  { id: "time-fracture", name: "Time Fracture", giant: "Chronologg the Clockwork Giant", mut: "Chrono", x: "30x", time: "Event", color: "#e6c878", event: true },
  { id: "genesis-dawn", name: "Genesis Dawn", giant: "Solara of the First Light", mut: "Genesis", x: "50x", time: "Event", color: "#ffe696", event: true },
  { id: "omega-event", name: "Omega Event", giant: "Omegrax the Star Dragon", mut: "Omega", x: "100x", time: "Event", color: "#ff3c3c", event: true },
];

export const SPHERES = [
  { id: "plain", name: "Plain Sphere", price: "150", d: "Standard issue. Holds a Common." },
  { id: "keen", name: "Keen Sphere", price: "260", d: "Charged shell. Holds a Rare." },
  { id: "prime", name: "Prime Sphere", price: "430", d: "Burns the escape shut. Holds an Epic." },
  { id: "nova", name: "Nova Sphere", price: "820", d: "Folds space. Holds Legendary and Mythic." },
  { id: "zenith", name: "Zenith Sphere", price: "1,400", d: "The best money can buy. Holds Divine and Ethereal." },
  { id: "admin", name: "Admin Sphere", price: "Giveaway", d: "Never misses. Only from BVN giveaways." },
];

export const FOODS = [
  { id: "kibble", name: "Kibble", d: "Cheap and dull. Gets a young pet moving.", price: "120" },
  { id: "berry-mix", name: "Berry Mix", d: "Sweet. Most pets will drop what they are doing for it.", price: "700" },
  { id: "golden-feed", name: "Golden Feed", d: "Rich enough to carry a pet through the middle levels.", price: "3,800" },
  { id: "storm-ration", name: "Storm Ration", d: "Charged feed. The first food that moves a high level pet.", price: "22K" },
  { id: "eternal-nectar", name: "Eternal Nectar", d: "One bottle is worth a hundred meals. Priced like it.", price: "130K" },
];

export const TRACKERS = [
  { id: "rare", name: "Rare Tracker", d: "Points at the nearest Rare or better for one minute." },
  { id: "epic", name: "Epic Tracker", d: "Ignores the small stuff. Epic and above, ninety seconds." },
  { id: "mythic", name: "Mythic Tracker", d: "Mythic and above only. Bring good spheres." },
  { id: "mutation", name: "Mutation Tracker", d: "Any mutated pet, any rarity, two minutes. The money one." },
];

export const EGGS = [
  { id: "common", name: "Common Egg", robux: 9 },
  { id: "rare", name: "Rare Egg", robux: 19 },
  { id: "epic", name: "Epic Egg", robux: 39 },
  { id: "legendary", name: "Legendary Egg", robux: 79 },
  { id: "mythic", name: "Mythic Egg", robux: 149 },
  { id: "divine", name: "Divine Egg", robux: 249 },
  { id: "ethereal", name: "Ethereal Egg", robux: 449 },
];

export const SHARDS = [
  { id: "rainbow", name: "Rainbow Shard", d: "Each one adds 5 percent chance your evolved pet turns Rainbow." },
  { id: "weight", name: "Weight Shard", d: "Your evolved pet comes out heavier." },
  { id: "luck", name: "Luck Shard", d: "Each one adds 10 percent luck in the machine." },
  { id: "mutation", name: "Mutation Shard", d: "Each one adds a chance of a mutation on evolve." },
  { id: "shocked", name: "Shocked Shard", d: "Each one adds 10 percent chance of Shocked." },
  { id: "void", name: "Void Shard", d: "Each one adds 4 percent chance of Void." },
  { id: "omega", name: "Omega Shard", d: "Event only. Aim for the rarest mutation of all." },
  { id: "taco", name: "Taco Shard", d: "Event only. Yes. Tacos." },
];

export const PACKS = [
  { id: "normal", name: "Normal Pack" },
  { id: "gold", name: "Gold Pack" },
  { id: "diamond", name: "Diamond Pack" },
  { id: "rainbow", name: "Rainbow Pack" },
  { id: "galaxy", name: "Galaxy Pack" },
];

export const BOARDS = [
  { id: "white-drifter", name: "White Drifter", price: "2.5M", speed: 34 },
  { id: "green-surge", name: "Green Surge", price: "18M", speed: 48 },
  { id: "purple-nebula", name: "Purple Nebula", price: "120M", speed: 68 },
  { id: "red-inferno", name: "Red Inferno", price: "900M", speed: 120 },
];

// name, tagline, coin price, speed, robux (if sold for Robux)
export const RIDES: { id: string; name: string; tag: string; price: string; speed: number; robux?: number; art?: string }[] = [
  { id: "skateboard", name: "Skateboard", tag: "Flames on the deck, wind in your hair.", price: "400K", speed: 30 },
  { id: "scooter", name: "Scooter", tag: "Beep beep, coming through.", price: "800K", speed: 32 },
  { id: "unicycle", name: "Unicycle", tag: "One wheel. Zero fear.", price: "1.2M", speed: 33 },
  { id: "shopping-cart", name: "Shopping Cart", tag: "Rocket boosted groceries.", price: "3M", speed: 38 },
  { id: "go-kart", name: "Go Kart", tag: "Low, loud and lightning quick.", price: "6M", speed: 58, robux: 49 },
  { id: "bumper-car", name: "Bumper Car", tag: "Bonk everything. Politely.", price: "9M", speed: 58, robux: 49 },
  { id: "rubber-duck-boat", name: "Rubber Duck Boat", tag: "Quack quack, full speed ahead.", price: "12M", speed: 45 },
  { id: "motorbike", name: "Motorbike", tag: "Long handlebars, longer wheelies.", price: "25M", speed: 50 },
  { id: "convertible", name: "Convertible", tag: "Top down, sunglasses on.", price: "40M", speed: 56 },
  { id: "pal-wagon", name: "Pal Wagon", tag: "Four seats: you, a friend and your Pal Pets.", price: "60M", speed: 58, art: "convertible" },
  { id: "monster-truck", name: "Monster Truck", tag: "Crushes bumps for breakfast.", price: "70M", speed: 60 },
  { id: "jet-ski", name: "Jet Ski", tag: "Skims the ground like it is water.", price: "90M", speed: 64 },
  { id: "hover-bike", name: "Hover Bike", tag: "No wheels. No limits.", price: "150M", speed: 82, robux: 99 },
  { id: "magic-carpet", name: "Magic Carpet", tag: "A whole new world, at speed.", price: "220M", speed: 80 },
  { id: "cloud", name: "Cloud", tag: "Fluffy, fast and a little rainbow.", price: "300M", speed: 86, robux: 99 },
  { id: "tank", name: "Tank", tag: "Paint splats only. Very serious.", price: "400M", speed: 92, robux: 149 },
  { id: "roller-coaster-cart", name: "Roller Coaster Cart", tag: "Keep your arms inside the ride.", price: "500M", speed: 100, robux: 149 },
  { id: "hot-air-balloon", name: "Hot Air Balloon", tag: "Slow to start, lovely view.", price: "650M", speed: 104, robux: 199 },
  { id: "jetpack", name: "Jetpack", tag: "Strap in. Blast off.", price: "800M", speed: 115, robux: 199 },
  { id: "dragon-glider", name: "Dragon Glider", tag: "Soar like you own the sky.", price: "1.2B", speed: 140, robux: 299 },
  { id: "ufo", name: "UFO", tag: "Take me to your leader. Fast.", price: "1.8B", speed: 160, robux: 399 },
  { id: "rocket", name: "Rocket", tag: "The fastest ride money can buy.", price: "3B", speed: 180, robux: 499 },
];
