// Revolution Materials: 301s for the bare domain and revolutionmaterials.au.
//
// GoHighLevel hosts the site on www.revolutionmaterials.com.au. Its firewall
// answers any address ending in .php with a 404 before its own redirect list
// runs, and the old site's Google listings are mostly .php pages. So the bare
// domain (and the .au domain) point at Vercel instead, and these rules send
// every old address to the matching part of the new site with a 301.

const SITE = "https://www.revolutionmaterials.com.au";

// Hosts handled here. Never www.revolutionmaterials.com.au: that is GoHighLevel.
const HOSTS = "(?:revolutionmaterials\\.com\\.au|revolutionmaterials\\.au|www\\.revolutionmaterials\\.au)";

// old page (without extension) -> section of the new page
const SECTION = {
  metals: "materials", stainless: "materials", nickel: "materials", titanium: "materials",
  alloy: "materials", other: "materials", specialty: "materials",
  nickelweld: "materials", titaniumweld: "materials", welding: "materials",
  fasteners: "fasteners",
  fabrication: "forms", centrifugal: "forms",
  about: "experience",
  contact: "enquire", "contact-form": "enquire", "feedback-sent": "enquire",
};

const r = (source, destination) => ({
  source,
  destination,
  statusCode: 301,
  has: [{ type: "host", value: HOSTS }],
});

export function rmRedirects() {
  const out = [];
  for (const [page, sec] of Object.entries(SECTION)) {
    for (const ext of ["php", "htm", "html"]) out.push(r(`/${page}.${ext}`, `${SITE}/#${sec}`));
  }
  // every other old page (Bio-Circle, Surfox, Inox, index ...) goes to the home page
  out.push(r("/biocircle", `${SITE}/`));
  out.push(r("/biocircle/:rest*", `${SITE}/`));
  out.push(r("/:file(.*\\.(?:php|htm|html|asp|aspx))", `${SITE}/`));
  // anything else keeps its path on the new site (/news, /dashboard, ?utm=...)
  out.push(r("/", `${SITE}/`));
  out.push(r("/:path*", `${SITE}/:path*`));
  return out;
}
