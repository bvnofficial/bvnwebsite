/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { Bangers, Nunito } from "next/font/google";
import { MONSTERS } from "./monsters";
import {
  BIOMES, BOARDS, EGGS, FINISHES, FOODS, GAME_URL, PACKS, RARITIES, RIDES, SHARDS, SIZES, SPHERES, TRACKERS, WEATHER,
  rarityColor,
} from "./data";
import Dex from "./Dex";
import CatchGame from "./CatchGame";
import Reveal from "./Reveal";
import "./catch.css";

const comic = Bangers({ weight: "400", subsets: ["latin"], variable: "--ct-comic", display: "swap" });
const body = Nunito({ subsets: ["latin"], weight: ["400", "700", "800", "900"], variable: "--ct-body", display: "swap" });

const SITE = "https://www.bvnofficial.com";

export const metadata: Metadata = {
  title: { absolute: "CATCH! on Roblox | 190 Monsters, 7 Biomes, Rides and Weather Giants" },
  description:
    "CATCH! is a Roblox monster catching game by BVN. Throw spheres at 190 brainrot monsters across 7 biomes, fight beside your Pal Pets, duel in the arena, ride 22 rides, survive weather giants and chase 50x Taco Fever mutations.",
  alternates: { canonical: "/roblox/catch" },
  keywords:
    "CATCH Roblox, CATCH! Roblox game, Roblox monster catching game, brainrot catching game, Roblox pet game, Pal Pets, Taco Fever, weather giants, BVN Roblox",
  openGraph: {
    title: "CATCH! on Roblox: catch 190 brainrot monsters",
    description: "Throw spheres, build your hub, fight with your Pal Pets and get rich. Every monster, biome, ride and weather giant.",
    url: `${SITE}/roblox/catch`,
    siteName: "BVN",
    type: "website",
    images: [{ url: `${SITE}/roblox/catch/catch-them-all.webp`, width: 1672, height: 941, alt: "CATCH! key art" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CATCH! on Roblox",
    description: "Catch 190 brainrot monsters, fight with your Pal Pets, get rich.",
    images: [`${SITE}/roblox/catch/catch-them-all.webp`],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  name: "CATCH!",
  url: `${SITE}/roblox/catch`,
  sameAs: GAME_URL,
  image: `${SITE}/roblox/catch/catch-them-all.webp`,
  description: "A Roblox monster catching game: throw spheres at 190 brainrot monsters, build a hub that earns money, and fight beside your Pal Pets.",
  gamePlatform: "Roblox",
  genre: ["Creature collection", "Adventure", "Simulator"],
  author: { "@type": "Organization", name: "BVN", url: SITE },
  numberOfPlayers: { "@type": "QuantitativeValue", maxValue: 20 },
};

const byId = (id: string) => MONSTERS.find((m) => m.id === id)!;
const HERO_FLOATERS = [
  { id: "fee-nix", style: { left: "4%", top: "18%", ["--r" as string]: "-8deg" } },
  { id: "burnardo-blazini", style: { right: "5%", top: "14%", ["--r" as string]: "7deg", animationDelay: "0.8s" } },
  { id: "patrickino-stellone", style: { left: "7%", bottom: "16%", ["--r" as string]: "6deg", animationDelay: "1.6s" }, sm: true },
  { id: "megasqualo-dentone", style: { right: "7%", bottom: "18%", ["--r" as string]: "-6deg", animationDelay: "2.2s" }, sm: true },
  { id: "jandellino-coronello", style: { left: "20%", top: "4%", ["--r" as string]: "5deg", animationDelay: "1.1s", width: "clamp(60px,7vw,100px)" }, sm: true },
  { id: "draghetto-cannellone", style: { right: "20%", top: "3%", ["--r" as string]: "-5deg", animationDelay: "2.8s", width: "clamp(60px,7vw,100px)" }, sm: true },
];

const half = Math.ceil(MONSTERS.length / 2);
const ROW_A = MONSTERS.slice(0, half);
const ROW_B = MONSTERS.slice(half);

const BIOME_MONS: Record<string, string[]> = {
  meadow: ["uno", "blooby"],
  woodland: ["tres", "seengko"],
  highlands: ["tigrealo-scudone", "quatro"],
  ashen: ["dos", "sammino-ragnetto"],
  frozen: ["brrino-piedone", "mucca-planetina"],
  crater: ["kagurina-ombrellina", "alucardino-spadone"],
  rift: ["il-grande-mischione", "wandina-bacchetta"],
};

function Sec({ id, alt, kicker, title, sub, children }: { id: string; alt?: boolean; kicker?: string; title: React.ReactNode; sub?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className={`ct-sec ${alt ? "alt halftone" : ""}`}>
      <div className="ct-wrap">
        <div className="ct-rv">
          {kicker && <span className="ct-kicker">{kicker}</span>}
          <h2 className="ct-h2 comic stroke">{title}</h2>
          {sub && <p className="ct-sub">{sub}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

export default function CatchPage() {
  const counts = RARITIES.map((r) => ({ ...r, n: MONSTERS.filter((m) => m.rarity === r.id).length }));
  const maxN = Math.max(...counts.map((c) => c.n));
  const sets = Array.from(new Set(MONSTERS.map((m) => m.set)));

  return (
    <div className={`ct ${comic.variable} ${body.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Reveal />

      {/* ---------- top bar ---------- */}
      <header className="ct-top">
        <div className="ct-top-in">
          <a href="#top" className="ct-top-logo" aria-label="CATCH! home">
            <img src="/roblox/catch/catch-logo.webp" alt="CATCH!" width={94} height={38} />
          </a>
          <nav>
            <a href="#play">Play</a>
            <a href="#features">Features</a>
            <a href="#monsters">Monsters</a>
            <a href="#biomes">Biomes</a>
            <a href="#weather">Weather</a>
            <a href="#rides">Rides</a>
            <a href="#items">Items</a>
            <a href="#premium">Premium</a>
            <a href="#future">Coming Soon</a>
          </nav>
          <a href={GAME_URL} className="ct-btn small green" target="_blank" rel="noopener noreferrer">PLAY NOW</a>
        </div>
      </header>

      {/* ---------- hero ---------- */}
      <section className="ct-hero" id="top">
        <div className="ct-hero-bg" style={{ backgroundImage: "url(/roblox/catch/catch-them-all.webp)" }} />
        <div className="ct-rays" />
        {HERO_FLOATERS.map((f) => (
          <img key={f.id} src={`/roblox/catch/mon/${f.id}.webp`} alt="" className={`ct-float ${f.sm ? "hide-sm" : ""}`} style={f.style} width={150} height={150} />
        ))}
        <div className="ct-hero-in">
          <h1 style={{ margin: 0 }}>
            <img className="ct-hero-logo" src="/roblox/catch/catch-logo.webp" alt="CATCH!" width={1400} height={566} />
          </h1>
          <div className="ct-tag comic stroke">CATCH THEM ALL. GET RICH.</div>
          <p className="lead">
            Throw spheres at <b>190 brainrot monsters</b> across <b>7 wild biomes</b>. Put them on your hub to earn money every
            second, bring three into battle as your <b>Pal Pets</b>, duel other players in the arena and ride out on anything from
            a shopping cart to a rocket.
          </p>
          <div className="ct-hero-ctas">
            <a className="ct-btn green" href={GAME_URL} target="_blank" rel="noopener noreferrer">PLAY NOW ON ROBLOX</a>
            <a className="ct-btn" href="#play">TRY A CATCH</a>
            <a className="ct-btn pink" href="#monsters">SEE ALL 190 MONSTERS</a>
          </div>
          <p className="ct-soon">A Roblox game by BVN. Out now on Roblox, free to play.</p>
        </div>
      </section>

      <div className="ct-stats">
        {[
          ["190", "Monsters"],
          ["7", "Biomes"],
          ["7", "Finishes"],
          ["22", "Rides"],
          ["11", "Weather Giants"],
          ["100x", "Top Mutation"],
        ].map(([b, s]) => (
          <div className="ct-stat" key={s}>
            <b>{b}</b>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="ct-marquee" aria-hidden="true">
        <div className="ct-marquee-row">
          {[...ROW_A, ...ROW_A].map((m, i) => (
            <img key={m.id + i} src={`/roblox/catch/mon/${m.id}.webp`} alt="" loading="lazy" width={96} height={96} />
          ))}
        </div>
        <div className="ct-marquee-row rev">
          {[...ROW_B, ...ROW_B].map((m, i) => (
            <img key={m.id + i} src={`/roblox/catch/mon/${m.id}.webp`} alt="" loading="lazy" width={96} height={96} />
          ))}
        </div>
      </div>

      {/* ---------- how to play ---------- */}
      <Sec id="how" kicker="HOW IT WORKS" title={<>FOUR STEPS TO <em>RICH</em></>} sub="Walk out of the plaza, and the further you go, the rarer the monsters get.">
        <div className="ct-steps">
          {[
            ["1", "THROW", "Aim anywhere and lob a sphere. Every miss tires the monster out, so the next throw has better odds.", "/roblox/catch/art/sphere-zenith.webp"],
            ["2", "CATCH", "The sphere wiggles three times. CAPTURE SUCCESS! or GOT AWAY! Rare ones announce you to the whole server.", `/roblox/catch/mon/fee-nix.webp`],
            ["3", "EARN", "Park monsters on your hub and they earn money every second, even while you are away.", "/roblox/catch/art/gate-level-15.webp"],
            ["4", "FIGHT", "Take three Pal Pets with you. They fight wild monsters beside you and give you their skill.", `/roblox/catch/mon/laylina-cannonella.webp`],
          ].map(([n, h, p, img]) => (
            <div className="ct-step ct-rv" key={n}>
              <div className="num">{n}</div>
              <img src={img} alt="" width={120} height={120} loading="lazy" />
              <h3>{h}</h3>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </Sec>

      {/* ---------- mini game ---------- */}
      <Sec
        id="play"
        alt
        kicker="PLAY RIGHT NOW"
        title={<>TRY A <em>CATCH!</em></>}
        sub="Pick a sphere and throw. A weak sphere tears right open on a rare monster, so match your sphere to what you are hunting. Misses tire it out."
      >
        <div className="ct-rv">
          <CatchGame />
        </div>
      </Sec>

      {/* ---------- features ---------- */}
      <Sec id="features" kicker="EVERYTHING IN THE GAME" title={<>PACKED WITH <em>ACTION</em></>} sub="Catching is only the start. Here is everything waiting for you on the island.">
        <div className="ct-feats">
          <div className="ct-feat ct-rv">
            <div className="pic">
              {["plain", "keen", "prime", "nova", "zenith"].map((s) => (
                <img key={s} src={`/roblox/catch/art/sphere-${s}.webp`} alt="" style={{ maxHeight: 70 }} loading="lazy" width={70} height={70} />
              ))}
            </div>
            <h3>SPHERE CATCHING</h3>
            <p>Five spheres from Plain to Zenith, each one strong enough for a higher rarity. Throws arc and bounce, and a tired monster is easier to catch but runs harder.</p>
          </div>
          <div className="ct-feat ct-rv">
            <span className="ct-badge new">NEW</span>
            <div className="pic">
              {["alucardino-spadone", "eudorina-fulminella", "zilonghino-lancione"].map((s) => (
                <img key={s} src={`/roblox/catch/mon/${s}.webp`} alt="" loading="lazy" width={110} height={110} style={{ maxHeight: 110 }} />
              ))}
            </div>
            <h3>PAL PETS FIGHT FOR YOU</h3>
            <p>Three followers walk beside you and battle wild monsters with real moves: fists, kicks, wands that throw fireballs and lightning, guns, and dragons that breathe fire. They heal back at your base.</p>
          </div>
          <div className="ct-feat ct-rv">
            <div className="pic">
              <img src="/roblox/catch/mon/megasqualo-dentone.webp" alt="" loading="lazy" width={140} height={140} />
            </div>
            <h3>MONSTERS FIGHT BACK</h3>
            <p>Miss a throw on a Rare or bigger and it can go into a RAGE. It shows where it will hit, then flings anyone standing there. Beams, crosses, rings and a full barrage at Ethereal.</p>
          </div>
          <div className="ct-feat ct-rv">
            <div className="pic">
              <img className="cover" src="/roblox/catch/versus.webp" alt="Blue versus red" loading="lazy" width={400} height={150} />
            </div>
            <h3>ARENA DUELS</h3>
            <p>Press G near any player to inspect their team, then TRADE or DUEL. Your three Pal Pets are your team, and the arena crowd is watching.</p>
          </div>
          <div className="ct-feat ct-rv">
            <div className="pic">
              {["gate-level-1", "gate-level-8", "gate-level-15"].map((l) => (
                <img key={l} src={`/roblox/catch/art/${l}.webp`} alt="" loading="lazy" width={110} height={110} style={{ maxHeight: 110 }} />
              ))}
            </div>
            <h3>YOUR OWN HUB</h3>
            <p>Every player gets a plot. Monsters on it earn money every second, with no button to press. Upgrade through 15 levels, each with a new fence and gate.</p>
          </div>
          <div className="ct-feat ct-rv">
            <div className="pic">
              {["rocket", "dragon-glider", "ufo"].map((r) => (
                <img key={r} src={`/roblox/catch/art/ride-${r}.webp`} alt="" loading="lazy" width={110} height={110} style={{ maxHeight: 110 }} />
              ))}
            </div>
            <h3>22 RIDES</h3>
            <p>Skateboards, go karts, a rubber duck boat, a tank, a UFO and a rocket. The Pal Wagon seats four: you, a friend and your Pal Pets.</p>
          </div>
          <div className="ct-feat ct-rv">
            <div className="pic">
              <img src="/roblox/catch/art/prop-incubator.webp" alt="" loading="lazy" width={120} height={120} />
              <img src="/roblox/catch/art/egg-ethereal.webp" alt="" loading="lazy" width={80} height={80} style={{ maxHeight: 80 }} />
            </div>
            <h3>EGGS AND HATCHING</h3>
            <p>An egg for every rarity and an incubator at every hub. When it hatches, a roulette spins through monsters and then weights before it lands on yours.</p>
          </div>
          <div className="ct-feat ct-rv">
            <div className="pic">
              {["thunderstorm", "omega-event", "void-eclipse"].map((w) => (
                <img key={w} src={`/roblox/catch/art/herald-${w}.webp`} alt="" loading="lazy" width={110} height={110} style={{ maxHeight: 110 }} />
              ))}
            </div>
            <h3>WEATHER GIANTS</h3>
            <p>Storms arrive with a giant who talks, throws strikes and drops weather orbs. Grab an orb to roll a mutation onto your Pal Pet.</p>
          </div>
          <div className="ct-feat ct-rv">
            <span className="ct-badge soon">SOON</span>
            <div className="pic">
              <img src="/roblox/catch/art/prop-evolution-machine.webp" alt="" loading="lazy" width={140} height={140} />
            </div>
            <h3>EVOLUTION</h3>
            <p>Bring three of the same monster to level 100. One evolves into a bigger, glowing form with an aura and energy wings. Add shards to push the odds toward Rainbow, extra weight or a mutation.</p>
          </div>
          <div className="ct-feat ct-rv">
            <span className="ct-badge soon">SOON</span>
            <div className="pic">
              <img src="/roblox/catch/art/prop-fuse-machine.webp" alt="" loading="lazy" width={140} height={140} />
            </div>
            <h3>FUSION</h3>
            <p>Feed three monsters into the Fuse Machine and get an egg back. What hatches out of it is up to luck.</p>
          </div>
          <div className="ct-feat ct-rv">
            <div className="pic">
              {["pack-galaxy", "pack-rainbow", "pack-gold"].map((p) => (
                <img key={p} src={`/roblox/catch/art/${p}.webp`} alt="" loading="lazy" width={100} height={100} style={{ maxHeight: 100 }} />
              ))}
            </div>
            <h3>TRADING AND PACKS</h3>
            <p>Trade or gift monsters with anyone in your server. Open packs with a spinning reel that slows down and lands right in the middle.</p>
          </div>
          <div className="ct-feat ct-rv">
            <span className="ct-badge">HOT</span>
            <div className="pic">
              <img src="/roblox/catch/art/herald-taco-fever.webp" alt="" loading="lazy" width={140} height={140} />
            </div>
            <h3>TACO FEVER</h3>
            <p>A taco bigger than the arena falls from the sky, counts 3, 2, 1 and explodes. Then it rains tacos, everyone dances, and monsters can catch the 50x Tacos mutation.</p>
          </div>
        </div>
      </Sec>

      {/* ---------- monster dex ---------- */}
      <Sec
        id="monsters"
        alt
        kicker={`${MONSTERS.length} MONSTERS, ${sets.length} SETS`}
        title={<>THE <em>MONSTER</em> INDEX</>}
        sub="Every monster in the game. Search, filter by rarity or set, and tap one to see its evolved form."
      >
        <div className="ct-rv">
          <Dex />
        </div>
      </Sec>

      {/* ---------- rarities, finishes, sizes ---------- */}
      <Sec id="rarity" kicker="HOW RARE IS IT?" title={<>RARITY, <em>FINISH</em> AND SIZE</>} sub="Three rolls decide what a monster is worth: how rare its kind is, which finish it wears and how big it spawned.">
        <div className="ct-ladder ct-rv">
          {counts.map((c, i) => (
            <div className="ct-rung" key={c.id} style={{ background: c.color, height: 90 + i * 26 }}>
              <b>{c.name.toUpperCase()}</b>
              <span>{c.n} monsters</span>
              <i style={{ display: "block", height: 6, marginTop: 6, borderRadius: 3, background: "#0b0618", width: `${(c.n / maxN) * 100}%`, alignSelf: "center" }} />
            </div>
          ))}
        </div>
        <h3 className="ct-h3 ct-rv">7 FINISHES</h3>
        <div className="ct-pills ct-rv">
          {FINISHES.map((f) => (
            <div className="ct-pill" key={f.id} style={{ borderColor: "#0b0618", background: `linear-gradient(135deg, ${f.color}, #24124f 80%)` }}>
              <b>{f.id.toUpperCase()}</b>
              <span>{f.mult > 1 ? `x${f.mult} value` : "The base look"}</span>
            </div>
          ))}
        </div>
        <h3 className="ct-h3 ct-rv">6 SIZES</h3>
        <div className="ct-pills ct-rv">
          {SIZES.map((s, i) => (
            <div className="ct-pill" key={s.name}>
              <b style={{ fontSize: 16 + i * 3 }}>{s.name.toUpperCase()}</b>
              <span>{s.note}</span>
            </div>
          ))}
        </div>
      </Sec>

      {/* ---------- biomes ---------- */}
      <Sec
        id="biomes"
        alt
        kicker="7 RINGS AROUND THE PLAZA"
        title={<>THE <em>BIOMES</em></>}
        sub="The world is a ring of biomes around the plaza. Every step outward makes the monsters rarer. A new wave of monsters spawns every five minutes."
      >
        <div className="ct-biomes">
          {BIOMES.map((b) => {
            const total = Object.values(b.w).reduce((a, n) => a + n, 0);
            return (
              <div className="ct-biome ct-rv" key={b.id} style={{ background: b.bg }}>
                <div className="ring">
                  <div>
                    <span>RING</span>
                    <b>{b.ring}</b>
                  </div>
                </div>
                <div>
                  <h3 className="stroke">{b.name}</h3>
                  <p>{b.blurb}</p>
                  <div className="ct-bars" title="Spawn mix per wave">
                    {Object.entries(b.w).map(([r, n]) => (
                      <i key={r} style={{ width: `${(n / total) * 100}%`, background: rarityColor(r) }} />
                    ))}
                    {b.id === "rift" && <i style={{ width: "6%", background: rarityColor("ethereal") }} />}
                  </div>
                  <div className="ct-bar-key">
                    {Object.keys(b.w).concat(b.id === "rift" ? ["ethereal"] : []).map((r) => (
                      <span key={r} style={{ ["--c" as string]: rarityColor(r) }}>{r.toUpperCase()}</span>
                    ))}
                  </div>
                </div>
                <div className="scene">
                  <img src={`/roblox/catch/art/env-${b.id}-1.webp`} alt="" loading="lazy" width={120} height={120} />
                  <img className="mon" src={`/roblox/catch/mon/${BIOME_MONS[b.id][0]}.webp`} alt={byId(BIOME_MONS[b.id][0]).name} loading="lazy" width={100} height={100} />
                  <img src={`/roblox/catch/art/env-${b.id}-2.webp`} alt="" loading="lazy" width={120} height={120} />
                  <img className="mon" src={`/roblox/catch/mon/${BIOME_MONS[b.id][1]}.webp`} alt={byId(BIOME_MONS[b.id][1]).name} loading="lazy" width={100} height={100} style={{ animationDelay: "0.6s" }} />
                  <img src={`/roblox/catch/art/env-${b.id}-3.webp`} alt="" loading="lazy" width={120} height={120} />
                </div>
              </div>
            );
          })}
        </div>
      </Sec>

      {/* ---------- weather ---------- */}
      <Sec
        id="weather"
        kicker="STORMS, GIANTS AND MUTATIONS"
        title={<>WEATHER <em>GIANTS</em></>}
        sub="Every weather event brings a giant to the sky. Its strikes and orbs brand monsters with a mutation that multiplies their money. Mutations stack, so one monster can carry several."
      >
        <div className="ct-giants">
          {WEATHER.map((w) => (
            <div className="ct-giant ct-rv" key={w.id} style={{ background: `linear-gradient(160deg, ${w.color}, #24124f 75%)` }}>
              {w.event && <span className="evt">SPECIAL EVENT</span>}
              <img src={`/roblox/catch/art/herald-${w.id}.webp`} alt={w.giant} loading="lazy" width={130} height={130} />
              <div className="w comic stroke">{w.name.toUpperCase()}</div>
              <div className="who">{w.giant.toUpperCase()}</div>
              <div className="mut">{w.mut.toUpperCase()} {w.x}</div>
              <div className="dur">{w.event ? "Special event weather" : `Lasts ${w.time}`}</div>
            </div>
          ))}
        </div>

        <div className="ct-taco ct-rv" id="taco">
          {["6%", "22%", "41%", "58%", "77%", "92%"].map((l, i) => (
            <span key={l} className="ct-mini-taco" style={{ left: l, animationDelay: `${i * 0.5}s` }} aria-hidden="true">🌮</span>
          ))}
          <div>
            <h3>TACO FEVER!</h3>
            <p>The party event. El Taco Grande drops a taco bigger than the whole arena, it pulses 3, 2, 1 and explodes. Then the song starts.</p>
            <ul>
              <li>Tacos rain on the whole island</li>
              <li>Every player dances</li>
              <li>Monsters can catch the <b>TACOS mutation: 50x money</b></li>
              <li>Twenty tiny tacos swarm around every Tacos monster</li>
              <li>Lasts exactly as long as the song</li>
            </ul>
          </div>
          <div className="ct-taco-art">
            <img src="/roblox/catch/art/herald-taco-fever.webp" alt="El Taco Grande" loading="lazy" width={300} height={300} />
          </div>
        </div>
      </Sec>

      {/* ---------- hub + arena ---------- */}
      <Sec id="hub" alt kicker="YOUR BASE" title={<>BUILD YOUR <em>HUB</em></>} sub="Fifteen hub levels. Each one adds room for more monsters and gives your plot a new fence and gate. Slide through all fifteen.">
        <div className="ct-hubs ct-rv">
          {Array.from({ length: 15 }, (_, i) => i + 1).map((l) => (
            <figure key={l}>
              <div className="fg">
                <img src={`/roblox/catch/art/fence-level-${l}.webp`} alt={`Level ${l} fence`} loading="lazy" width={130} height={130} />
                <img className="gate" src={`/roblox/catch/art/gate-level-${l}.webp`} alt={`Level ${l} gate`} loading="lazy" width={100} height={100} />
              </div>
              <figcaption>LEVEL {l}</figcaption>
            </figure>
          ))}
        </div>
        <div className="ct-arena" style={{ marginTop: 60 }}>
          <img className="vs ct-rv" src="/roblox/catch/versus.webp" alt="Blue team versus red team" loading="lazy" width={1983} height={793} />
          <div className="ct-rv">
            <h3 className="ct-h2 comic stroke" style={{ textAlign: "left", fontSize: "clamp(40px,6vw,64px)" }}>
              THE <em>ARENA</em>
            </h3>
            <ul>
              <li><b>Press G</b> near a player to see their Pal Pets and stats.</li>
              <li><b>DUEL</b> them in the arena in the middle of the plaza. Your three followers are your team.</li>
              <li><b>TRADE</b> or gift monsters. A traded monster stays locked for 24 hours.</li>
              <li><b>Friends bonus:</b> every Roblox friend in your server adds 10 percent to your income.</li>
            </ul>
          </div>
        </div>
      </Sec>

      {/* ---------- rides ---------- */}
      <Sec id="rides" kicker="PRESS F TO RIDE" title={<>22 <em>RIDES</em></>} sub="Buy them at the Rides stall with coins, or grab the Robux ones. Throw spheres while you ride.">
        <div className="ct-rides">
          {RIDES.map((r) => (
            <div className="ct-ride ct-rv" key={r.id}>
              {r.robux && <span className="ct-badge new" style={{ fontSize: 12 }}>R$ {r.robux}</span>}
              <img src={`/roblox/catch/art/ride-${r.art ?? r.id}.webp`} alt={r.name} loading="lazy" width={110} height={110} />
              <div className="nm">{r.name.toUpperCase()}</div>
              <div className="tg">{r.tag}</div>
              <div className="ct-speed"><i style={{ width: `${(r.speed / 200) * 100}%` }} /></div>
              <div className="row">
                <span>SPEED {r.speed}</span>
                <span>{r.price} coins</span>
              </div>
            </div>
          ))}
        </div>
        <h3 className="ct-h3 ct-rv">HOVERBOARDS</h3>
        <div className="ct-rides">
          {BOARDS.map((b) => (
            <div className="ct-ride ct-rv" key={b.id}>
              <img src={`/roblox/catch/art/board-${b.id}.webp`} alt={b.name} loading="lazy" width={110} height={110} />
              <div className="nm">{b.name.toUpperCase()}</div>
              <div className="ct-speed"><i style={{ width: `${(b.speed / 200) * 100}%` }} /></div>
              <div className="row">
                <span>SPEED {b.speed}</span>
                <span>{b.price} coins</span>
              </div>
            </div>
          ))}
          <div className="ct-ride ct-rv" style={{ background: "linear-gradient(160deg,#ff3b4f,#24124f 80%)" }}>
            <span className="ct-badge">BETA</span>
            <img src="/roblox/catch/art/ride-motorbike.webp" alt="BETA Motorbike" loading="lazy" width={110} height={110} />
            <div className="nm">BETA MOTORBIKE</div>
            <div className="tg">The fastest ride in the game. Only for beta testers, never sold.</div>
            <div className="ct-speed"><i style={{ width: "100%" }} /></div>
            <div className="row"><span>SPEED 200</span><span>Exclusive</span></div>
          </div>
        </div>
      </Sec>

      {/* ---------- items ---------- */}
      <Sec id="items" alt kicker="THE PLAZA SHOPS" title={<>GEAR <em>UP</em></>} sub="Shelves restock every five minutes for everyone at the same moment. Spheres, food, trackers, eggs, packs and evolution shards.">
        <h3 className="ct-h3 ct-rv" style={{ marginTop: 0 }}>SPHERES</h3>
        <div className="ct-shelf">
          {SPHERES.map((s) => (
            <div className="ct-item ct-rv" key={s.id}>
              <img src={`/roblox/catch/art/sphere-${s.id}.webp`} alt={s.name} loading="lazy" width={100} height={100} />
              <div className="nm">{s.name.toUpperCase()}</div>
              <div className="d">{s.d}</div>
              <span className="pr">{s.price === "Giveaway" ? "GIVEAWAY ONLY" : `${s.price} coins`}</span>
            </div>
          ))}
        </div>
        <h3 className="ct-h3 ct-rv">PET FOOD</h3>
        <div className="ct-shelf">
          {FOODS.map((f) => (
            <div className="ct-item ct-rv" key={f.id}>
              <img src={`/roblox/catch/art/food-${f.id}.webp`} alt={f.name} loading="lazy" width={100} height={100} />
              <div className="nm">{f.name.toUpperCase()}</div>
              <div className="d">{f.d}</div>
              <span className="pr">{f.price} coins</span>
            </div>
          ))}
        </div>
        <h3 className="ct-h3 ct-rv">TRACKERS</h3>
        <div className="ct-shelf">
          {TRACKERS.map((t) => (
            <div className="ct-item ct-rv" key={t.id}>
              <img src={`/roblox/catch/art/tracker-${t.id}.webp`} alt={t.name} loading="lazy" width={100} height={100} />
              <div className="nm">{t.name.toUpperCase()}</div>
              <div className="d">{t.d}</div>
            </div>
          ))}
        </div>
        <h3 className="ct-h3 ct-rv">EGGS</h3>
        <div className="ct-shelf">
          {EGGS.map((e) => (
            <div className="ct-item ct-rv" key={e.id} style={{ borderColor: "#0b0618", background: `linear-gradient(160deg, ${rarityColor(e.id)}55, #24124f 70%)` }}>
              <img src={`/roblox/catch/art/egg-${e.id}.webp`} alt={e.name} loading="lazy" width={100} height={100} />
              <div className="nm">{e.name.toUpperCase()}</div>
              <div className="d">Hatches a random {e.id} monster. Might come out Gold or Rainbow.</div>
              <span className="pr rbx">R$ {e.robux}</span>
            </div>
          ))}
        </div>
        <h3 className="ct-h3 ct-rv">PACKS</h3>
        <div className="ct-shelf">
          {PACKS.map((p) => (
            <div className="ct-item ct-rv" key={p.id}>
              <img src={`/roblox/catch/art/pack-${p.id}.webp`} alt={p.name} loading="lazy" width={100} height={100} />
              <div className="nm">{p.name.toUpperCase()}</div>
              <div className="d">{p.id === "galaxy" ? "Galaxy monsters never spawn in the wild. Packs are the only way." : "A reel spins fast, slows down, and lands on your prize."}</div>
            </div>
          ))}
        </div>
        <h3 className="ct-h3 ct-rv">EVOLUTION SHARDS <span style={{ color: "#ff8a28", fontSize: 22 }}>(COMING SOON)</span></h3>
        <div className="ct-shelf">
          {SHARDS.map((s) => (
            <div className="ct-item ct-rv" key={s.id}>
              <img src={`/roblox/catch/art/shard-${s.id}.webp`} alt={s.name} loading="lazy" width={100} height={100} />
              <div className="nm">{s.name.toUpperCase()}</div>
              <div className="d">{s.d}</div>
            </div>
          ))}
        </div>
      </Sec>

      {/* ---------- premium ---------- */}
      <Sec
        id="premium"
        kicker="FREE TO PLAY. PREMIUM IF YOU WANT IT."
        title={<>PREMIUM <em>PERKS</em></>}
        sub="Everything in the world can be reached for free. Robux just makes the ride faster. Prices shown are the planned Robux prices."
      >
        <div className="ct-prem">
          <div className="ct-pass bag ct-rv">
            <h3>DOUBLE BAG</h3>
            <span className="price">R$ 199</span>
            <ul>
              <li>Carry 400 monsters instead of 200</li>
              <li>Yours forever</li>
            </ul>
          </div>
          <div className="ct-pass svip ct-rv">
            <span className="ct-badge">BEST</span>
            <h3>SUPER VIP</h3>
            <span className="price">R$ 1499</span>
            <ul>
              <li>800 monster bag</li>
              <li>+60% sale price</li>
              <li>+60% hub income</li>
              <li>+60% feeding XP</li>
              <li>+10% catch chance</li>
              <li>A burning SVIP tag over your name</li>
            </ul>
          </div>
          <div className="ct-pass vip ct-rv">
            <h3>VIP</h3>
            <span className="price">R$ 499</span>
            <ul>
              <li>400 monster bag</li>
              <li>+25% sale price</li>
              <li>+25% hub income</li>
              <li>+25% feeding XP</li>
              <li>A gold VIP tag over your name</li>
            </ul>
          </div>
        </div>
        <div className="ct-tables">
          <table className="ct-table ct-rv">
            <thead>
              <tr><th>GALAXY PACKS</th><th>ROBUX</th></tr>
            </thead>
            <tbody>
              <tr><td>Galaxy Pack (1 Galaxy monster)</td><td>R$ 99</td></tr>
              <tr><td>Galaxy Pack x5</td><td>R$ 399</td></tr>
              <tr><td>Galaxy Pack x10 (one rare guaranteed)</td><td>R$ 699</td></tr>
            </tbody>
          </table>
          <table className="ct-table ct-rv">
            <thead>
              <tr><th>SERVER BOOSTS</th><th>ROBUX</th></tr>
            </thead>
            <tbody>
              <tr><td>2x Money for the whole server, 30 min</td><td>R$ 99</td></tr>
              <tr><td>2x Money for the whole server, 2 hours</td><td>R$ 249</td></tr>
              <tr><td>2x Luck for the whole server, 30 min</td><td>R$ 99</td></tr>
              <tr><td>2x Luck for the whole server, 2 hours</td><td>R$ 249</td></tr>
            </tbody>
          </table>
          <table className="ct-table ct-rv">
            <thead>
              <tr><th>COINS</th><th>ROBUX</th></tr>
            </thead>
            <tbody>
              <tr><td>Pocket of Coins (50K)</td><td>R$ 49</td></tr>
              <tr><td>Sack of Coins (350K)</td><td>R$ 99</td></tr>
              <tr><td>Chest of Coins (2M)</td><td>R$ 249</td></tr>
              <tr><td>Vault of Coins (12M)</td><td>R$ 799</td></tr>
            </tbody>
          </table>
          <table className="ct-table ct-rv">
            <thead>
              <tr><th>WEATHER MACHINE</th><th>ROBUX</th></tr>
            </thead>
            <tbody>
              <tr><td>Start a Thunderstorm (Shocked 1.5x)</td><td>R$ 49</td></tr>
              <tr><td>Start a Voltage Surge (Volted 2x)</td><td>R$ 79</td></tr>
              <tr><td>Start a Firestorm (Rage 3x)</td><td>R$ 129</td></tr>
              <tr><td>Start a Void Eclipse (Void 5x)</td><td>R$ 199</td></tr>
              <tr><td>Start an Aurora Bloom (Eternal 10x)</td><td>R$ 399</td></tr>
            </tbody>
          </table>
        </div>
        <p className="ct-sub" style={{ marginTop: 26, marginBottom: 0, fontSize: 15 }}>
          Also for Robux: eggs of every rarity, Hatch Now for R$ 25, and eleven rides from the Go Kart to the Rocket.
        </p>
      </Sec>

      {/* ---------- roadmap ---------- */}
      <Sec id="future" alt kicker="WHAT IS NEXT" title={<>COMING <em>SOON</em></>} sub="CATCH! keeps growing. Here is what we are building next.">
        <div className="ct-road">
          <div className="ct-milestone big ct-rv" style={{ ["--c" as string]: "#5cff8a" }}>
            <span className="st">NEXT BIG UPDATE</span>
            <h3 className="stroke">RIDE YOUR OWN MONSTERS</h3>
            <p>Hop on the back of the monsters you caught and ride them across the island. Your dragon becomes your wings. Your Titan becomes your tank.</p>
            <div className="mons">
              {["zilonghino-lancione", "draghetto-cannellone", "arcierino-galoppino", "megasqualo-dentone"].map((m) => (
                <img key={m} src={`/roblox/catch/mon/${m}.webp`} alt="" loading="lazy" width={130} height={130} />
              ))}
            </div>
          </div>
          <div className="ct-milestone ct-rv" style={{ ["--c" as string]: "#ffd23f" }}>
            <span className="st">IN TESTING</span>
            <h3>EVOLUTION FOR EVERYONE</h3>
            <p>The Evolution Machine already stands on the plaza. Three of the same monster at level 100, a big cutscene, and an evolved form with glowing wings.</p>
          </div>
          <div className="ct-milestone ct-rv" style={{ ["--c" as string]: "#ffd23f" }}>
            <span className="st">IN TESTING</span>
            <h3>FUSION MACHINE</h3>
            <p>Turn three monsters into a mystery egg.</p>
          </div>
          <div className="ct-milestone ct-rv" style={{ ["--c" as string]: "#3ee6ff" }}>
            <span className="st">WITH EVOLUTION</span>
            <h3>SHARDS AND WEATHER CRYSTALS</h3>
            <p>Shards hidden around the world, rarer the further out you go, plus crystals that fall during weather events.</p>
          </div>
          <div className="ct-milestone ct-rv" style={{ ["--c" as string]: "#ff4fa3" }}>
            <span className="st">LAUNCH</span>
            <h3>OPEN TO EVERYONE ON ROBLOX</h3>
            <p>Eggs, rides and the Weather Machine go on sale, and the island opens to every player.</p>
          </div>
        </div>
      </Sec>

      {/* ---------- final ---------- */}
      <section className="ct-final">
        <div className="ct-rays" style={{ top: "50%" }} />
        <img className="banner ct-rv" src="/roblox/catch/banner.webp" alt="Collect brainrots, get rich" loading="lazy" width={2000} height={750} />
        <h2 className="ct-h2 comic stroke ct-rv" style={{ marginTop: 50 }}>
          READY TO <em>CATCH?</em>
        </h2>
        <p className="ct-sub ct-rv">Follow CATCH! on Roblox so you are there on day one.</p>
        <div className="ct-hero-ctas ct-rv">
          <a className="ct-btn green" href={GAME_URL} target="_blank" rel="noopener noreferrer">PLAY NOW ON ROBLOX</a>
          <a className="ct-btn cyan" href="#play">ONE MORE THROW</a>
        </div>
      </section>

      <footer className="ct-foot">
        CATCH! is made by <a href={SITE}>BVN</a>. Monster pictures and numbers come straight from the game files and change as the game updates.
        <br />
        CATCH! is an independent game and is not affiliated with or endorsed by Roblox Corporation.
      </footer>
    </div>
  );
}
