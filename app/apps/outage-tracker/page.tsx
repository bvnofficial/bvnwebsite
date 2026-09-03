import Link from "next/link";
import { ArrowLeft, Waves, Zap, Wifi, TrainFront, Activity, Droplets } from "lucide-react";
import OutageMap from "./OutageMap";

const SITE = "https://www.bvnofficial.com";
const PAGE = `${SITE}/apps/outage-tracker`;

const FAQ: { q: string; a: string }[] = [
  {
    q: "Baha ba sa amin ngayon?",
    a: "Tinitingnan ng tracker ang live rainfall data mula sa NASA POWER para sa mahigit 30 lungsod sa buong Pilipinas — Luzon, Visayas, at Mindanao. Kapag mataas ang ulan sa isang lugar, lalabas ito bilang dilaw (warning) o pula (severe) sa mapa. Para sa opisyal na flood at typhoon warnings, sumangguni pa rin sa PAGASA at sa inyong lokal na DRRMC.",
  },
  {
    q: "Bakit walang kuryente / may brownout ba ngayon?",
    a: "Ipinapakita ng tracker ang Meralco scheduled maintenance interruptions (para sa Metro Manila at karatig na lalawigan) at ang NGCP grid alerts — yellow alert at red alert — para sa Luzon, Visayas, at Mindanao. Ang red alert ay maaaring humantong sa rotating brownout. Para sa exact address-level outages, i-check pa rin ang opisyal na Meralco o ang inyong electric cooperative.",
  },
  {
    q: "Sira ba ang internet? (Converge, PLDT, Globe, DITO, Sky)",
    a: "May ISP status strip ang tracker para sa Converge, PLDT, Globe, DITO, at Sky. Kapag may kamakailang balita ng outage o service disruption sa isang provider, magbabago ang kulay nito mula green (no reports) tungo sa amber (reported) o red (outage). Ginagamit din namin ang IODA (Georgia Tech) para sa overall na internet health ng buong bansa.",
  },
  {
    q: "Walang tubig ba? (Maynilad / Manila Water)",
    a: "Sinusubaybayan ng tracker ang water service interruptions mula sa Maynilad, Manila Water, at PrimeWater base sa kanilang mga advisory na na-index kamakailan. Lalabas ang mga ito sa ilalim ng Tubig / Water filter, naka-pin sa lungsod na apektado. Para sa eksaktong schedule ng balik-tubig, tingnan pa rin ang opisyal na advisory ng inyong water provider.",
  },
  {
    q: "May lindol ba ngayon?",
    a: "Kinukuha ng tracker ang real-time na lindol sa loob at paligid ng Pilipinas mula sa USGS (United States Geological Survey), kasama ang magnitude at epicenter. Nasa ilalim ito ng Lindol / Quake filter — pula kapag M6.0 pataas. Para sa opisyal na intensity at tsunami advisories, sumangguni sa PHIVOLCS.",
  },
  {
    q: "Suspended ba ang MRT, LRT, o PNR ngayon?",
    a: "Kinukuha ng tracker ang pinakabagong balita tungkol sa MRT-3, LRT-1, LRT-2, at PNR — limited operations, unloading, technical glitch, o pagbalik sa normal. Lalabas ang mga ito sa ilalim ng Tren / Rail filter. Para sa minute-by-minute updates, sundan din ang opisyal na social media ng bawat linya.",
  },
  {
    q: "Gaano kadalas nag-a-update ang tracker?",
    a: "Awtomatiko itong nagre-refresh tuwing 60 segundo. Ang rainfall ay galing sa pinakabagong araw na may datos ang NASA POWER; ang power at internet reports ay galing sa opisyal na advisories at balita na na-index kamakailan.",
  },
  {
    q: "Opisyal na emergency source ba ito?",
    a: "Hindi. Ang BVN Philippines Outage Tracker ay isang libreng public-service tool na nag-aggregate ng bukas na datos (NASA POWER, IODA, Meralco, NGCP, Google News). Para sa mga desisyong pangkaligtasan, palaging sundin ang PAGASA, PHIVOLCS, NDRRMC, at ang inyong lokal na awtoridad.",
  },
];

const REGIONS = [
  "Metro Manila (NCR)", "Cordillera (Baguio)", "Ilocos (Laoag, Vigan, Dagupan)",
  "Cagayan Valley (Tuguegarao, Ilagan)", "Central Luzon (Pampanga, Cabanatuan, Olongapo)",
  "Calabarzon (Antipolo, Calamba, Batangas, Lucena)", "Mimaropa (Calapan, Puerto Princesa)",
  "Bicol (Naga, Legazpi, Sorsogon)", "Western Visayas (Iloilo, Bacolod)",
  "Central Visayas (Cebu, Dumaguete)", "Eastern Visayas (Tacloban, Ormoc)",
  "Zamboanga Peninsula (Zamboanga, Dipolog)", "Northern Mindanao (Cagayan de Oro, Iligan)",
  "Davao Region (Davao, Tagum)", "Soccsksargen (General Santos, Koronadal, Cotabato)",
  "Caraga (Butuan, Surigao)",
];

const WHAT = [
  { Icon: Waves, color: "#3b82f6", title: "Baha / Flooding", body: "Live rainfall sa 30+ lungsod mula sa NASA POWER, plus PAGASA-style advisories." },
  { Icon: Zap, color: "#f59e0b", title: "Kuryente / Power", body: "Meralco scheduled interruptions (per barangay) at NGCP yellow/red alerts para sa 3 grids." },
  { Icon: Wifi, color: "#10b981", title: "Internet", body: "Per-provider status (Converge, PLDT, Globe, DITO, Sky) plus national health mula sa IODA." },
  { Icon: Droplets, color: "#06b6d4", title: "Tubig / Water", body: "Water service interruptions mula sa Maynilad, Manila Water, at PrimeWater." },
  { Icon: Activity, color: "#f43f5e", title: "Lindol / Earthquake", body: "Real-time earthquakes sa buong Pilipinas mula sa USGS — magnitude at epicenter." },
  { Icon: TrainFront, color: "#a855f7", title: "Tren / Rail", body: "MRT-3, LRT-1, LRT-2, at PNR advisories — limited ops, glitch, o normal." },
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "BVN Philippines Outage Tracker",
        url: PAGE,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "PHP" },
        description:
          "Live map of flooding, brownouts (power outages), internet/ISP status, and rail advisories across the Philippines.",
        publisher: { "@type": "Organization", name: "BVN", url: SITE },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Apps", item: `${SITE}/apps` },
          { "@type": "ListItem", position: 2, name: "PH Outage Tracker", item: PAGE },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-navy-dark text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* top bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-navy-dark/80 px-6 py-4 backdrop-blur-xl md:px-12">
        <Link href="/apps" className="flex items-center gap-2 text-sm font-semibold text-white/60 transition-colors hover:text-white">
          <ArrowLeft size={16} /> Back to Apps
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/20">
            <Activity size={14} className="text-orange-400" />
          </div>
          <span className="text-sm font-semibold text-white/80">Outage Tracker</span>
        </div>
        <div className="w-24" />
      </div>

      <main className="mx-auto max-w-6xl px-5 py-8 md:py-12">
        {/* hero */}
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">Live Tracker · Libre</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">BVN Philippines Outage Tracker</h1>
        <p className="mt-3 max-w-3xl text-white/70">
          Baha ba? Walang kuryente? Walang tubig? Sira ba ang internet? May lindol? Isang live map ng{" "}
          <strong>flooding</strong>, <strong>brownout</strong>, <strong>walang tubig</strong>,{" "}
          <strong>internet outage</strong>, <strong>lindol</strong>, at <strong>MRT/LRT advisories</strong> sa buong
          Pilipinas — Luzon, Visayas, at Mindanao. I-zoom sa inyong lugar (Metro Manila, Rizal, Cebu, Davao…),
          i-filter, at i-share ang link. Nag-a-update tuwing 60 segundo. Walang sign-up.
        </p>

        {/* the app */}
        <div className="mt-6">
          <OutageMap />
        </div>

        {/* quick answers */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { t: "“Baha ba sa amin?”", d: "Tingnan ang live rainfall sa inyong lungsod. Dilaw = mag-ingat, pula = malakas na ulan." },
            { t: "“Bakit walang kuryente?”", d: "Meralco maintenance at NGCP red/yellow alert na maaaring maging dahilan ng brownout." },
            { t: "“Sira ba ang Converge/PLDT?”", d: "Per-provider ISP status para sa lahat ng major internet providers." },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-sm font-semibold text-white">{c.t}</div>
              <div className="mt-1 text-sm text-white/60">{c.d}</div>
            </div>
          ))}
        </div>

        {/* what it tracks */}
        <h2 className="mt-12 text-2xl font-bold">Ano ang sinusubaybayan nito</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHAT.map(({ Icon, color, title, body }) => (
            <div key={title} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <Icon size={22} style={{ color }} />
              <div className="mt-2 font-semibold text-white">{title}</div>
              <div className="mt-1 text-sm text-white/60">{body}</div>
            </div>
          ))}
        </div>

        {/* coverage */}
        <h2 className="mt-12 text-2xl font-bold">Saklaw na mga rehiyon</h2>
        <p className="mt-2 text-white/70">
          Nag-sa-sample ang rainfall map sa mga sumusunod na lungsod at rehiyon sa buong bansa:
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {REGIONS.map((r) => (
            <span key={r} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70">
              {r}
            </span>
          ))}
        </div>

        {/* FAQ */}
        <h2 className="mt-12 text-2xl font-bold">Mga madalas itanong (FAQ)</h2>
        <div className="mt-4 divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.03]">
          {FAQ.map((f) => (
            <details key={f.q} className="group px-5 py-4">
              <summary className="cursor-pointer list-none font-semibold text-white marker:hidden">
                {f.q}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{f.a}</p>
            </details>
          ))}
        </div>

        {/* sources + disclaimer */}
        <div className="mt-12 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/60">
          <p>
            <strong className="text-white/80">Mga pinagkukunan ng datos:</strong> NASA POWER (rainfall), IODA –
            Georgia Tech (internet), Meralco (power interruptions per barangay), NGCP (grid alerts), USGS
            (earthquakes), at Google News (rail, ISP, at water advisories).
          </p>
          <p className="mt-2">
            <strong className="text-white/80">Paalala:</strong> Hindi ito opisyal na emergency source. Para sa mga
            desisyong pangkaligtasan, sundin ang PAGASA, PHIVOLCS, NDRRMC, at ang inyong lokal na awtoridad. Ginawa
            ng <Link href="/" className="text-orange-400 hover:underline">BVN</Link> bilang libreng public tool.
          </p>
        </div>
      </main>
    </div>
  );
}
