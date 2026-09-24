/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { CREATURES } from "./creatures";
import "./wiki.css";

const SITE = "https://www.bvnofficial.com";
const PAGE = `${SITE}/roblox/catch`;
const GAME = "https://www.roblox.com/games/79002892141852/Catch";

export const metadata: Metadata = {
  title: { absolute: "Catch! (Roblox game) - BVN Wiki" },
  description:
    "Catch! is a Roblox creature-catching and idle income game by BVN. Throw spheres at brainrots, put them on your hub to earn money, survive the 10-second night and hunt weather-born mutations.",
  alternates: { canonical: "/roblox/catch" },
  keywords:
    "Catch Roblox, Catch! Roblox game, Roblox brainrot catching game, Roblox creature catching, Roblox idle hub game, BVN Catch, brainrot mutations, Galaxy Pack",
  openGraph: {
    title: "Catch! (Roblox game)",
    description:
      "A Roblox creature-catching and idle income game. Throw spheres, fill your hub, chase mutations.",
    url: PAGE,
    siteName: "BVN Wiki",
    type: "article",
    images: [{ url: `${SITE}/roblox/catch/thumbnail.webp`, width: 1672, height: 941, alt: "Catch! key art" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Catch! (Roblox game)",
    images: [`${SITE}/roblox/catch/thumbnail.webp`],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  name: "Catch!",
  url: GAME,
  image: `${SITE}/roblox/catch/icon.webp`,
  description:
    "A Roblox creature-catching and idle income game. Throw spheres at brainrots, put them on your hub and let them earn.",
  gamePlatform: "Roblox",
  applicationCategory: "Game",
  genre: ["Creature collection", "Idle", "Simulator"],
  author: { "@type": "Person", name: "Benjamin Vincent Yson", url: `${SITE}/benjaminyson` },
  publisher: { "@type": "Organization", name: "BVN", url: SITE },
  playMode: "MultiPlayer",
  numberOfPlayers: { "@type": "QuantitativeValue", maxValue: 20 },
};

const fmt = (n: number) => {
  if (n >= 1e12) return `${+(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `${+(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${+(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${+(n / 1e3).toFixed(2)}K`;
  return `${+n.toFixed(2)}`;
};

const TOC: [string, string, [string, string][]?][] = [
  ["Gameplay", "gameplay", [
    ["Catching", "catching"],
    ["The world", "world"],
    ["Hubs and income", "hubs"],
    ["Followers and skills", "followers"],
    ["Day and night", "daynight"],
    ["Weather and mutations", "weather"],
    ["Transport", "transport"],
  ]],
  ["Creatures", "creatures", [
    ["Finishes and rarities", "finishes"],
    ["Sizes", "sizes"],
    ["List of creatures", "list"],
  ]],
  ["Economy", "economy", [
    ["Shops", "shops"],
    ["Trading", "trading"],
    ["Friends bonus", "friends"],
  ]],
  ["Monetization", "monetization", [
    ["Galaxy Packs", "packs"],
    ["Server boosts", "boosts"],
  ]],
  ["Controls", "controls"],
  ["Development", "development"],
  ["Gallery", "gallery"],
  ["See also", "seealso"],
  ["References", "references"],
];

const RARITIES: [string, string, string, string][] = [
  ["Normal", "Common", "Sunny Meadow", "Plain sphere"],
  ["Gold", "Rare", "Old Woodland", "Keen sphere"],
  ["Diamond", "Epic", "Rocky Highlands", "Prime sphere"],
  ["Lava", "Legendary", "Ashen Wastes", "Nova sphere"],
  ["Galaxy", "Mythic", "Pack prizes only (never wild)", "Nova sphere"],
  ["Rainbow", "Divine", "Skyfall Crater", "Zenith sphere"],
];

const BANDS: [string, string, string][] = [
  ["Sunny Meadow", "1", "Common"],
  ["Old Woodland", "2", "Rare"],
  ["Rocky Highlands", "3", "Epic"],
  ["Ashen Wastes", "4", "Legendary"],
  ["Frozen Reach", "5", "Mythic"],
  ["Skyfall Crater", "6", "Divine"],
  ["The Void Rift", "7", "Ethereal (event)"],
];

const SPHERES: [string, string, string, string][] = [
  ["Plain Sphere", "x1.0", "150", "Standard issue. Holds a Common."],
  ["Keen Sphere", "x1.8", "260", "Charged shell. Holds a Rare."],
  ["Prime Sphere", "x2.8", "430", "Burns the escape shut. Holds an Epic."],
  ["Nova Sphere", "x4.2", "820", "Folds space around the target. Holds Legendary and Mythic."],
  ["Zenith Sphere", "x6.5", "1,400", "The best money can buy. Holds Divine and Ethereal."],
];

const MUTATIONS: [string, string, string, string][] = [
  ["Shocked", "x2", "Thunderstorm", "Arcing sparks."],
  ["Volted", "x3", "Voltage Surge", "Crackling yellow charge."],
  ["Rage", "x4", "Firestorm", "Burning fury."],
  ["Void", "x10", "Void Eclipse", "Collapsing horizon."],
  ["Eternal", "x100", "Aurora Bloom", "Aurora bound."],
];

const WEATHER: [string, string, string, string][] = [
  ["Thunderstorm", "Shocked", "3:00", "10%"],
  ["Voltage Surge", "Volted", "2:30", "6%"],
  ["Firestorm", "Rage", "2:20", "3.5%"],
  ["Void Eclipse", "Void", "2:00", "1.2%"],
  ["Aurora Bloom", "Eternal", "1:40", "0.4%"],
];

const SIZES: [string, string][] = [
  ["Undersized", "Smaller than average and lighter."],
  ["Normal", "The standard size."],
  ["Large", "Bigger and heavier than normal."],
  ["Huge", "Announced to the whole server when it spawns."],
  ["Titan", "Announced with a comic alert. Common Titans appear about once in every 1,000 Common spawns."],
  ["Super Titan", "The rarest size. The loudest announcement in the game."],
];

const SKILLS: [string, string][] = [
  ["Swift", "You move faster on foot."],
  ["Scholar", "Brainrots on your hub gain experience faster."],
  ["Magnate", "Your hub earns more every second."],
  ["Fortune", "Everything you sell is worth more."],
  ["Keen Eye", "Spheres catch more often."],
  ["Vigour", "You sprint for longer before running out."],
  ["Bound", "Double jump."],
  ["Soar", "Hold jump to fly."],
];

const HUBS: [string, string][] = [
  ["1", "Dirt Lot"], ["2", "Gravel Pen"], ["3", "Capped Pen"], ["4", "Stone Yard"], ["5", "Lantern Yard"],
  ["6", "Alloy Pen"], ["7", "Neon Works"], ["8", "Suspended Deck"], ["9", "Scanfield Enclosure"],
  ["10", "Ascendant Sanctum"],
];

const BOARDS: [string, string][] = [
  ["White Drifter", "34"],
  ["Green Surge", "48"],
  ["Purple Nebula", "68"],
  ["Red Inferno", "165"],
];

const CONTROLS: [string, string][] = [
  ["Click / tap", "Throw the equipped sphere where you point"],
  ["1 - 9, 0", "Select a hotbar slot (PC has ten slots, phones five)"],
  ["F", "Ride or put away your hoverboard while keeping a sphere in hand"],
  ["B", "Open the bag"],
  ["N", "Open the creature Index"],
  ["P", "Open PET HUB"],
  ["T", "Open Trade"],
  ["V", "Open Transport"],
  ["Right click a pet (PC)", "Favourite it (heart). Double tap on phones."],
];

function Ref({ n }: { n: number }) {
  return (
    <sup className="reference">
      <a href={`#ref${n}`}>[{n}]</a>
    </sup>
  );
}

function Heading({ id, children, level = 2 }: { id: string; children: React.ReactNode; level?: 2 | 3 }) {
  const Tag = level === 2 ? "h2" : "h3";
  return (
    <Tag id={id}>
      <span className="mw-headline">{children}</span>
      <span className="mw-editsection">
        <span>[</span>
        <a href={GAME}>play</a>
        <span>]</span>
      </span>
    </Tag>
  );
}

export default function CatchWikiPage() {
  return (
    <div className="wiki">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="wiki-top">
        <div className="wiki-top-inner">
          <a href="/roblox/catch" className="wiki-brand">
            <img src="/roblox/catch/icon.webp" alt="" width={28} height={28} />
            <span>
              <strong>BVN Wiki</strong>
              <em>The game encyclopedia</em>
            </span>
          </a>
          <nav>
            <a href="#gameplay">Gameplay</a>
            <a href="#creatures">Creatures</a>
            <a href="#economy">Economy</a>
            <a href={GAME} className="wiki-play">Play on Roblox</a>
          </nav>
        </div>
      </header>

      <main className="wiki-page">
        <article>
          <div className="wiki-tabs">
            <span className="on">Article</span>
            <a href="#gallery">Gallery</a>
            <a href="#references">References</a>
          </div>

          <h1 id="top">Catch! (Roblox game)</h1>
          <div className="siteSub">From BVN Wiki, the game encyclopedia</div>
          <div className="hatnote">
            This article is about the Roblox game. For the studio behind it, see <a href={`${SITE}/about`}>BVN</a>.
          </div>

          {/* Infobox */}
          <table className="infobox">
            <tbody>
              <tr>
                <th colSpan={2} className="infobox-title">Catch!</th>
              </tr>
              <tr>
                <td colSpan={2} className="infobox-image">
                  <img src="/roblox/catch/icon.webp" alt="Catch! game icon: a Roblox avatar throwing a glowing sphere at two colourful block creatures" width={220} height={220} />
                  <div className="caption">Game icon</div>
                </td>
              </tr>
              <tr><th>Developer</th><td>BVN (Benjamin Vincent Yson)</td></tr>
              <tr><th>Publisher</th><td>BVN</td></tr>
              <tr><th>Engine</th><td>Roblox</td></tr>
              <tr><th>Platform</th><td>Roblox (Windows, macOS, iOS, Android)</td></tr>
              <tr><th>Genre</th><td>Creature collection, idle simulator</td></tr>
              <tr><th>Mode</th><td>Multiplayer, up to 20 players per server</td></tr>
              <tr><th>Status</th><td>Beta, in active development</td></tr>
              <tr><th>Website</th><td><a href={GAME}>roblox.com/games/79002892141852</a></td></tr>
            </tbody>
          </table>

          <p>
            <b>Catch!</b> is a creature-catching and idle income game for Roblox, developed by BVN. Players walk out from a
            central plaza into an open world, throw spheres at wandering &ldquo;brainrot&rdquo; creatures and put what they
            catch on a personal <a href="#hubs">hub</a>, where it earns money every second. Nothing in the world attacks
            the player: the tension comes from whether a creature escapes before the next throw.<Ref n={1} />
          </p>
          <p>
            The world is divided into seven rings, and the further a player walks from the plaza the rarer the creatures
            become. Rare creatures can also arrive with an oversized body, and <a href="#weather">weather events</a> can
            brand wild creatures and hub pets with multiplying mutations. A server holds up to 20 players, and every
            player has their own hub.
          </p>

          {/* TOC */}
          <div id="toc" className="toc">
            <div className="toctitle"><h2>Contents</h2></div>
            <ul>
              {TOC.map(([label, id, kids], i) => (
                <li key={id}>
                  <a href={`#${id}`}><span className="tocnumber">{i + 1}</span> <span className="toctext">{label}</span></a>
                  {kids && (
                    <ul>
                      {kids.map(([kl, kid], j) => (
                        <li key={kid}>
                          <a href={`#${kid}`}><span className="tocnumber">{i + 1}.{j + 1}</span> <span className="toctext">{kl}</span></a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <figure className="thumb">
            <img src="/roblox/catch/thumbnail.webp" alt="Catch! key art: an avatar throws a glowing sphere at a red and a yellow block creature" width={836} height={470} />
            <figcaption>Promotional artwork for <i>Catch!</i>: throwing a sphere at wild brainrots.</figcaption>
          </figure>

          {/* Gameplay */}
          <Heading id="gameplay">Gameplay</Heading>
          <Heading id="catching" level={3}>Catching</Heading>
          <p>
            Catching is done with <b>spheres</b>, thrown by clicking (or tapping) where the player wants the sphere to land.
            Throws are lobbed in an arc, and a sphere that falls short bounces twice and can still hit a creature. A
            successful hit pulls the creature into the sphere, the sphere wiggles, and either the creature is caught
            (&ldquo;CAPTURE SUCCESS!&rdquo;) or it escapes (&ldquo;GOT AWAY!&rdquo;). Every failed throw wears the creature
            down and sends it running, and the next throw has better odds. A caught creature goes to the player&rsquo;s bag.
          </p>
          <p>
            Each sphere has a catch power, and each creature has a catch rate that depends on its rarity and size. Stronger
            spheres are needed for rarer creatures.
          </p>
          <table className="wikitable">
            <caption>Spheres</caption>
            <thead><tr><th>Sphere</th><th>Catch power</th><th>Price (coins)</th><th>Notes</th></tr></thead>
            <tbody>
              {SPHERES.map((r) => (
                <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>
              ))}
            </tbody>
          </table>
          <p>
            Creatures that have never been caught by the player show a slanted <b>NEW!</b> tag beside their name. An
            administrator-only Admin Sphere never misses and is used for giveaways.
          </p>

          <Heading id="world" level={3}>The world</Heading>
          <p>
            The map is a ring around a central plaza that holds the shops, the arena and the spawn pad. Beyond a safe zone
            around the plaza the ground is split into seven rings, called bands. Each band has its own scenery, fog and creature mix, and a
            higher top rarity than the one before.
          </p>
          <table className="wikitable">
            <caption>World bands</caption>
            <thead><tr><th>Band</th><th>Ring (from the plaza outwards)</th><th>Top rarity</th></tr></thead>
            <tbody>
              {BANDS.map((r) => (
                <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>
              ))}
            </tbody>
          </table>
          <p>
            The outermost band, <b>The Void Rift</b>, has no ordinary spawns of its own. It is where the Ethereal event
            creature appears at the Rift Core, a timed event that can happen once every two hours.
          </p>

          <Heading id="hubs" level={3}>Hubs and income</Heading>
          <p>
            Every player is given a plot of their own on the ring around the plaza, called a <b>hub</b>. A creature placed
            on the hub earns money every second, with no button to collect it. Income depends on the creature&rsquo;s base
            income, its size and weight, its level and its mutations, and is then multiplied by the hub&rsquo;s own level
            bonus. Only as many creatures as the hub has room for will earn, and the best earners take the slots.
          </p>
          <p>
            Hubs are upgraded through ten levels, each adding room for one more creature (from 3 at level 1 to 12 at
            level 10). A hub also earns while its owner is away, up to a limit that grows with the hub level: one hour at
            level 1, rising to twelve hours at level 10. Each hub carries a board that other players can like, and the
            upgrade button glows when an upgrade is affordable.
          </p>
          <table className="wikitable">
            <caption>Hub levels</caption>
            <thead><tr><th>Level</th><th>Name</th></tr></thead>
            <tbody>
              {HUBS.map((r) => (
                <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td></tr>
              ))}
            </tbody>
          </table>
          <p>
            Creatures can be fed pet food (sold in five tiers up to Eternal Nectar) to gain levels, which raises both their
            income and their sale price. Creatures parked on a hub also gain a small amount of experience over time.
          </p>

          <Heading id="followers" level={3}>Followers and skills</Heading>
          <p>
            Up to three creatures can be equipped as <b>followers</b>. A follower walks beside the player and grants the
            skill attached to its species. Each creature has one of eight skills, and the strength of the bonus grows with
            the creature&rsquo;s rarity.
          </p>
          <table className="wikitable">
            <caption>Skills</caption>
            <thead><tr><th>Skill</th><th>Effect</th></tr></thead>
            <tbody>
              {SKILLS.map((r) => (
                <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td></tr>
              ))}
            </tbody>
          </table>

          <Heading id="daynight" level={3}>Day and night</Heading>
          <p>
            The game runs on a cycle of a <b>five-minute day</b> followed by a <b>ten-second night</b>. When night falls
            every player is brought back inside the base hub, a glowing wall rises around it with a countdown, and a large
            moon appears. Shops and other players&rsquo; hubs stay reachable inside the wall. At dawn the wall drops, a
            comic 3-2-1-GO countdown plays, and the wild creature population is restocked. A banner at the top of the screen
            counts down to the next night by day and to morning at night.
          </p>

          <Heading id="weather" level={3}>Weather and mutations</Heading>
          <p>
            Wild creatures spawn without mutations. The only way a mutation enters the world is through <b>weather
            events</b>: while one is running, bolts strike wild creatures and creatures parked on hubs, and each strike has
            a chance to brand the target. Mutations <b>stack</b>, so a creature already carrying Void can still be struck
            by Shocked and carry both. Mutation multipliers on income and sale price add together rather than
            multiplying.
          </p>
          <table className="wikitable">
            <caption>Natural weather events and their mutations</caption>
            <thead><tr><th>Event</th><th>Mutation</th><th>Duration</th><th>Strike chance</th></tr></thead>
            <tbody>
              {WEATHER.map((r) => (
                <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>
              ))}
            </tbody>
          </table>
          <table className="wikitable">
            <caption>Mutations</caption>
            <thead><tr><th>Mutation</th><th>Income and sale multiplier</th><th>Comes from</th><th>Look</th></tr></thead>
            <tbody>
              {MUTATIONS.map((r) => (
                <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>
              ))}
            </tbody>
          </table>
          <p>
            Five further mutations (Glitched, Prismatic, Chrono, Genesis and Omega, worth from 150 to 5,000 times) exist
            only for administrator events. The Mutation Tracker, sold in the Track stall, points an on-screen arrow and a
            beam of light at the nearest mutated creature.
          </p>

          <Heading id="transport" level={3}>Transport</Heading>
          <p>
            Hoverboards are bought at the Boards stall and ridden with the <kbd>F</kbd> key, so a player can hold a sphere
            and throw while riding. A limited <b>BETA Motorbike</b>, ridden sitting and leaning forward, was given to early
            testers through a redeem code and is never sold.
          </p>
          <table className="wikitable">
            <caption>Hoverboards</caption>
            <thead><tr><th>Board</th><th>Speed</th></tr></thead>
            <tbody>
              {BOARDS.map((r) => (
                <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td></tr>
              ))}
              <tr><td>BETA Motorbike</td><td>48</td></tr>
            </tbody>
          </table>

          {/* Creatures */}
          <Heading id="creatures">Creatures</Heading>
          <p>
            The roster is a collection of more than 80 &ldquo;brainrot&rdquo; characters, blocky figures drawn from
            internet meme culture. Every creature exists in several visual finishes, and each finish sets the creature&rsquo;s
            rarity. The game keeps an Index of every creature the player has caught, drawn as a black silhouette until it
            is found.
          </p>

          <Heading id="finishes" level={3}>Finishes and rarities</Heading>
          <p>A creature&rsquo;s rarity comes from its finish, not from its name, so the same character can be found in several rarities.</p>
          <table className="wikitable">
            <caption>Finishes</caption>
            <thead><tr><th>Finish</th><th>Rarity</th><th>Found in</th><th>Usual sphere</th></tr></thead>
            <tbody>
              {RARITIES.map((r) => (
                <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>
              ))}
            </tbody>
          </table>

          <Heading id="sizes" level={3}>Sizes</Heading>
          <p>
            Each creature also rolls a size, which changes its body, its weight and its value. Large sizes are rare, and a
            HUGE or bigger spawn is announced to everyone in the server. The catcher of a Legendary or better creature, or
            of any HUGE or bigger one, is announced too, with their avatar beside the creature.
          </p>
          <table className="wikitable">
            <caption>Size tiers</caption>
            <thead><tr><th>Tier</th><th>Description</th></tr></thead>
            <tbody>
              {SIZES.map((r) => (
                <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td></tr>
              ))}
            </tbody>
          </table>

          <Heading id="list" level={3}>List of creatures</Heading>
          <p>
            The table lists every creature in the game data with its base income and weight in the Normal finish at level 1
            and normal size. Finishes, size, level and mutations raise these numbers.
          </p>
          <table className="wikitable sortable" id="creature-table">
            <caption>Creatures ({CREATURES.length})</caption>
            <thead><tr><th>Creature</th><th>Base income / second</th><th>Weight (kg)</th><th>Skill</th></tr></thead>
            <tbody>
              {CREATURES.map((c) => (
                <tr key={c.name}>
                  <td>{c.name}</td>
                  <td data-sort-value={c.income}>{fmt(c.income)}</td>
                  <td>{c.weight}</td>
                  <td>{c.skill}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Economy */}
          <Heading id="economy">Economy</Heading>
          <p>
            Money is earned from hubs and from selling creatures. It is spent on spheres, food, trackers, hoverboards and
            hub upgrades. Very large numbers are common in the late game and are shown in short form (K, M, B, T and
            beyond). Roblox&rsquo;s own player list shows every player&rsquo;s money and income, sorted with the richest at
            the top.
          </p>
          <Heading id="shops" level={3}>Shops</Heading>
          <p>
            The plaza holds stalls for selling creatures, buying gear (spheres), pet food, trackers and hoverboards. The
            Gears and Pet Food shelves restock every five minutes on the real clock, at the same moment for every player.
            The shelf contents are the same for everyone, but stock is counted per player, so one player buying out an item
            does not empty it for anyone else. The rarest spheres appear on the shelf in small amounts. Menu buttons
            teleport a player straight to the Sphere Shop, Feed Shop or Sell stall.
          </p>
          <p>
            Favourited creatures, creatures equipped as followers and creatures parked on a hub are never offered for sale.
          </p>
          <Heading id="trading" level={3}>Trading</Heading>
          <p>
            Players in the same server can trade or gift creatures. A creature received in a trade cannot be traded on for
            24 hours and shows a red lock tag with the time left, and traded creatures do not count towards the
            Index. Favourites and followers are kept out of trades. The list of a player&rsquo;s creatures can be sorted by
            rarity, level, weight, income, value or name.
          </p>
          <Heading id="friends" level={3}>Friends bonus</Heading>
          <p>
            Every Roblox friend in the same server adds 10 percent to a player&rsquo;s income. Five friends is +50 percent
            and twenty friends would be +200 percent. A chip under the top bar shows the current bonus.
          </p>

          {/* Monetization */}
          <Heading id="monetization">Monetization</Heading>
          <p>
            The game is free to play. Robux purchases are optional developer products: coin packs, server-wide boosts and
            Galaxy Packs. Nothing sold for Robux is required to reach any part of the world.
          </p>
          <Heading id="packs" level={3}>Galaxy Packs</Heading>
          <p>
            A Galaxy Pack is kept in the bag until opened. Opening one plays a slot-machine style show with two reels: the
            first spins for about eight seconds and lands on a creature, and the second spins for another eight seconds and
            lands on its weight. Packs exist for every finish (Normal, Gold, Diamond, Lava, Galaxy and Rainbow), and the
            Galaxy pack contains creatures that never spawn in the wild. A pack picks a group of creatures with fixed odds:
            70 percent common, 25 percent rare and 5 percent ultra rare, with the group set by how much the creature earns.
            A pack of ten also guarantees one rare or better pull.
          </p>
          <Heading id="boosts" level={3}>Server boosts</Heading>
          <p>
            Two timed boosts, 2x Money and 2x Luck, can be bought for the whole server: when one player buys a boost,
            everyone in that server gets it. A Luck boost raises the chance of rarer creatures and bigger sizes. An active
            boost shows as a chip with a countdown, and buying the same boost again adds time.
          </p>

          {/* Controls */}
          <Heading id="controls">Controls</Heading>
          <table className="wikitable">
            <caption>Default controls</caption>
            <thead><tr><th>Input</th><th>Action</th></tr></thead>
            <tbody>
              {CONTROLS.map((r) => (
                <tr key={r[0]}><td><kbd>{r[0]}</kbd></td><td>{r[1]}</td></tr>
              ))}
            </tbody>
          </table>
          <p>
            On phones the game opens in landscape. Music, effects and the visibility of other players&rsquo; pets can be
            switched off in Settings, and the Settings screen also accepts redeem codes.
          </p>

          {/* Development */}
          <Heading id="development">Development</Heading>
          <p>
            Catch! is written in Luau and built with the Rojo workflow, with the code kept in a source repository and synced
            into Roblox Studio. It is developed and operated by Benjamin Vincent Yson under the name BVN.<Ref n={2} /> The
            game began as a creature collector with procedurally built pets and was rebuilt around an imported brainrot
            roster with a per-creature balance workbook. Its first public build is a beta.
          </p>

          {/* Gallery */}
          <Heading id="gallery">Gallery</Heading>
          <ul className="gallery">
            <li>
              <img src="/roblox/catch/thumbnail.webp" alt="Key art: an avatar throws a glowing sphere at a red and a yellow block creature" loading="lazy" />
              <p>Promotional key art.</p>
            </li>
            <li>
              <img src="/roblox/catch/catch-them-all.webp" alt="Key art with the slogan Catch Them All" loading="lazy" />
              <p>&ldquo;Catch them all&rdquo; artwork.</p>
            </li>
            <li>
              <img src="/roblox/catch/versus.webp" alt="Split artwork of two players facing a crowd of creatures" loading="lazy" />
              <p>Two-player artwork in blue and red.</p>
            </li>
            <li>
              <img src="/roblox/catch/banner.webp" alt="Wide banner: Collect brainrots, get rich" loading="lazy" />
              <p>Banner with the tagline &ldquo;Collect brainrots, get rich!&rdquo;</p>
            </li>
            <li>
              <img className="logo-tile" src="/roblox/catch/logo.webp" alt="The Catch! logo" loading="lazy" />
              <p>The logo.</p>
            </li>
          </ul>

          <Heading id="seealso">See also</Heading>
          <ul>
            <li><a href={`${SITE}/apps/outage-tracker`}>BVN Philippines Outage Tracker</a>, another BVN project</li>
            <li><a href={`${SITE}/case-studies`}>BVN case studies</a></li>
          </ul>

          <Heading id="references">References</Heading>
          <ol className="references">
            <li id="ref1">
              &ldquo;<a href={GAME}>Catch!</a>&rdquo;. <i>Roblox</i>. Retrieved 24 September 2026.
            </li>
            <li id="ref2">
              &ldquo;<a href={`${SITE}/benjaminyson`}>Benjamin Vincent Yson</a>&rdquo;. <i>BVN</i>. Retrieved 24 September 2026.
            </li>
          </ol>

          <div className="catlinks">
            <b>Categories</b>: <a href="#top">Roblox games</a> | <a href="#top">Creature collection games</a> |{" "}
            <a href="#top">Idle games</a> | <a href="#top">2026 video games</a> | <a href="#top">Multiplayer online games</a>
          </div>
          <p className="footer-note">
            This page was last edited on 24 September 2026. Statistics are taken from the game&rsquo;s data and change as
            the game is updated. Catch! is an independent game and is not affiliated with or endorsed by Roblox Corporation.
          </p>
        </article>
      </main>
    </div>
  );
}
