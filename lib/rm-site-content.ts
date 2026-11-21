// Editable text and photos on the Revolution Materials website.
// Jim edits these on Revolution HQ (Website > Text and photos). Saved values
// live in his GoHighLevel account (custom value "Website - Content") and
// sourced.js applies them to the page. Each field points at an element that
// exists both in the GHL page and in the bvnofficial preview copy.
//
// type:
//   text  plain text of the element
//   own   the element's own trailing text (keeps icons or a bold lead-in)
//   lines text with line breaks
//   list  <ul> items, one per line ("And more" lines keep the faded style)
//   tags  pill tags, one per line
//   img   photo { src, alt }; credit = index in the footer photo credits
//   show  "show" or "hide" for a whole section, card or item
//   num   a statistic such as "23+" (counts up on the page)
//   email the contact email, changed everywhere it appears (links too)
//   phone the contact phone, changed everywhere it appears (call links too)
// A selector may match several elements; all of them are changed.

export type FieldType = "text" | "own" | "lines" | "list" | "tags" | "img" | "show" | "num" | "email" | "phone";
export type ImgValue = { src: string; alt: string };
export type Field = {
  key: string;
  group: string;
  label: string;
  sel: string;
  type: FieldType;
  def: string | ImgValue;
  credit?: number;
};

const G = "https://files.leadconnectorhq.com/file/";
const img = (path: string, alt: string): ImgValue => ({ src: G + path, alt });

const F: Field[] = [];
const add = (group: string, key: string, label: string, sel: string, type: FieldType, def: string | ImgValue, credit?: number) =>
  F.push({ key, group, label, sel, type, def, credit });

/* Top of the page */
let g = "Top of the page";
add(g, "hero.kick", "Small heading", ".hero .kick", "text", "Specialist metals sourcing for Australia");
add(g, "hero.h1", "Main headline", ".hero h1", "text", "Having trouble finding the metals you need?");
add(g, "hero.lead", "Intro paragraph", ".hero .lead", "text", "Revolution Materials supplies metals in a wide range of grades, specifications and product forms to Australian businesses, drawing on an extensive international network of trusted manufacturers and suppliers to meet their requirements, including hard-to-find materials.");
add(g, "hero.lead2", "Second line", ".hero .lead2", "text", "Whether it's a particular grade, size, form or specification, we can help.");
add(g, "hero.welcome", "Line under the buttons", ".hero .welcome", "own", "No enquiry too large or too small.");
add(g, "hero.img", "Main photo", ".hero figure img", "img", img("6afab7637c3b573a627603b2/rm-steel-pipe.jpg", "Bundles of steel pipe ready for dispatch"), 0);
add(g, "hero.capT", "Photo caption, bold line", ".hero figcaption b", "text", "Sourced from mills worldwide");
add(g, "hero.capS", "Photo caption, second line", ".hero figcaption", "own", "Delivered anywhere in Australia, with full material certification.");

/* Strip under the top */
g = "Strip under the top section";
[
  ["Decades in metals", "Experience you can call on"],
  ["Global network", "Manufacturers, mills and suppliers"],
  ["Fully certified", "ASTM, ASME, AMS, EN and more"],
  ["Australia wide", "Delivery to any state"],
].forEach(([b, s], i) => {
  add(g, `trust.${i + 1}.b`, `Item ${i + 1}, bold`, `.trust .wrap > div:nth-child(${i + 1}) b`, "text", b);
  add(g, `trust.${i + 1}.s`, `Item ${i + 1}, small`, `.trust .wrap > div:nth-child(${i + 1}) span`, "text", s);
});

/* Materials */
g = "Materials";
add(g, "mat.k", "Small heading", "#materials .sh .k", "text", "Materials");
add(g, "mat.h2", "Heading", "#materials .sh h2", "text", "Seven families of metals, and many more grades on request");
add(g, "mat.p", "Intro", "#materials .sh p", "text", "These lists show some of what we supply. They are illustrative, not complete. If your material isn't here, we can still source it.");
const MATS: [string, string, string, string, number][] = [
  ["Stainless Steel", "6afab760a30b968e3fbcf906/rm-flange.jpg", "Machined stainless steel flanges", "Austenitic 300/400 series\nFerritic/Martensitic\nDuplex and Super Duplex\n6Mo\nNitronic\nPrecipitation Hardening\nAnd more", 8],
  ["Nickel Alloys", "6afab760893246071fb7b92a/rm-inconel.jpg", "Pipe section clad with Inconel nickel alloy", "Nickel and Nickel Alloys\nIncoloy, Inconel, Monel, Hastelloy\nNimonic, Ferralium, Nitronic\nInvar, Kovar\nAnd more", 2],
  ["Titanium", "6afab763a30b968e3fbcf94a/rm-titanium-bars.jpg", "Titanium bars", "Commercially Pure Titanium\nTitanium Alloys\nAnd more", 3],
  ["Alloy Steels", "6afab76277a01e46221fd37f/rm-square-bar.jpg", "Large square and round alloy steel bars", "Chrome-Moly\nHigh Strength Low Alloy\nStructural Steels\nClad Plate\nHeat Resistant Steels\nAnd more", 5],
  ["Copper Alloys", "6afab75fa30b968e3fbcf8e2/rm-copper-cathode.jpg", "Bundles of copper", "Brass\nPhosphor Bronze\nAluminium Bronze\nHigh Copper Alloys\nCopper\nCopper-Nickel\nCast Bronze\nHigh Lead Bronze\nBeryllium Copper\nAnd more", 6],
  ["Aluminium", "6afb640654a6494bd6cf8e75/rm-aluminium-ingots.jpg", "Stacked aluminium ingots strapped for transport", "2000, 4000 and 8000 series\nOther grades and specifications on enquiry", 7],
  ["Special Metals", "6afab764a30b968e3fbcf96c/rm-zirconium.jpg", "Zirconium crystal bars", "Cobalt Alloys\nMolybdenum\nTantalum\nZirconium\nPlatinum\nMagnesium\nManganese\nNiobium\nTungsten\nHafnium\nVanadium\nRhenium\nAnd more", 4],
];
MATS.forEach(([name, file, alt, list, credit], i) => {
  const s = `#materials .mat:nth-child(${i + 1})`;
  add(g, `mat.${i + 1}.img`, `${name}: photo`, `${s} img`, "img", img(file, alt), credit);
  add(g, `mat.${i + 1}.h3`, `${name}: name`, `${s} h3`, "text", name);
  add(g, `mat.${i + 1}.list`, `${name}: list (one per line)`, `${s} ul`, "list", list);
});
add(g, "mat.ask.h3", "Last card: heading", "#materials .mat.ask h3", "text", "Not on the list?");
add(g, "mat.ask.p", "Last card: text", "#materials .mat.ask p", "text", "Send us the grade, size and specification. We source materials whether or not they're listed on this website.");
add(g, "mat.note", "Note under the cards", "#materials .note", "text", "Can't see your grade? Ask anyway. Most of what we supply is never listed on a website, and we're happy to investigate unusual requirements.");

/* Forms and fasteners */
g = "Forms and fasteners";
add(g, "forms.k", "Small heading", "#forms .sh .k", "text", "Forms and fasteners");
add(g, "forms.h2", "Heading", "#forms .sh h2", "text", "In the form, size and condition you need");
add(g, "forms.p", "Intro", "#forms .sh p", "text", "Sometimes the grade is quite ordinary, but the size, condition, form or specification makes it hard to find locally. That's where we help.");
add(g, "forms.1.img", "Available Forms: photo", "#forms .panel:nth-child(1) img", "img", img("6afab761893246071fb7b952/rm-seamless-pipe.jpg", "Bundles of seamless steel pipe with blue end caps"), 1);
add(g, "forms.1.h3", "Available Forms: heading", "#forms .panel:nth-child(1) h3", "text", "Available Forms");
add(g, "forms.1.p", "Available Forms: text", "#forms .panel:nth-child(1) .b > p", "text", "Supplied cut to size or in full lengths, to the specification you need.");
add(g, "forms.1.tags", "Available Forms: tags (one per line)", "#forms .panel:nth-child(1) .tags", "tags", "Plate\nSheet\nPipe\nFittings\nBar\nWire\nCastings\nForgings\nOther product forms");
add(g, "forms.2.img", "Fasteners: photo", "#forms .panel:nth-child(2) img", "img", img("6afab75e893246071fb7b8f6/rm-bolts.jpg", "Bolt, nut and washer"), 9);
add(g, "forms.2.h3", "Fasteners: heading", "#forms .panel:nth-child(2) h3", "text", "Fasteners");
add(g, "forms.2.p", "Fasteners: text", "#forms .panel:nth-child(2) .b > p", "text", "Fasteners in the same specialist grades, from standard sizes to one off components made to drawing.");
add(g, "forms.2.tags", "Fasteners: tags (one per line)", "#forms .panel:nth-child(2) .tags", "tags", "Bolts\nNuts\nWashers\nScrews\nStudbolts\nCustom fasteners\nComponents");

/* Experience */
g = "Experience and service";
add(g, "exp.k", "Small heading", "#experience .sh .k", "text", "Experience and service");
add(g, "exp.h2", "Heading", "#experience .sh h2", "text", "Decades of experience, and an international network");
add(g, "exp.p", "Intro", "#experience .sh p", "text", "Revolution Materials is a specialist metals sourcing business, not a distributor selling a fixed range of stock. We draw on many years in the metals industry and a worldwide network of manufacturers, mills and suppliers to find what local stockists can't readily provide.");
add(g, "exp.specsLabel", "Specifications label", "#experience .sh + p", "text", "Supplied to international specifications");
add(g, "exp.specs", "Specifications (one per line)", "#experience .specs", "tags", "ASTM\nASME\nAMS\nEN\nand others");
[
  ["Decades of experience", "Long standing knowledge of metals, mills and specifications."],
  ["International sourcing network", "Manufacturers, mills and suppliers around the world."],
  ["Hard to find materials", "Grades, sizes and forms that conventional Australian stockists don't hold."],
  ["Full material certification", "Mill certificates supplied with your order."],
  ["Help with material selection", "Advice on suitable grades and possible alternatives when required.*"],
  ["Delivery anywhere in Australia", "To your site, workshop or warehouse."],
  ["Personal attention, large or small", "Every enquiry is handled personally, whether it's a single bar or a full project."],
].forEach(([b, s], i) => {
  add(g, `exp.${i + 1}.b`, `Point ${i + 1}, heading`, `#experience .pt:nth-child(${i + 1}) b`, "text", b);
  add(g, `exp.${i + 1}.s`, `Point ${i + 1}, text`, `#experience .pt:nth-child(${i + 1}) span`, "text", s);
});
add(g, "exp.disc", "Small print", "#experience .disc", "text", "* Material selection advice is general guidance only. Final suitability for any application remains the responsibility of the purchaser and their engineer.");

/* Past supplies heading (entries are on their own page) */
g = "Materials we've sourced (heading)";
add(g, "src.k", "Small heading", "#sourced .sh .k", "text", "Track record");
add(g, "src.h2", "Heading", "#sourced .sh h2", "text", "Some of the materials we've sourced");
add(g, "src.p", "Intro", "#sourced .sh p", "text", "Just a small selection of the many materials we've supplied. If you don't see what you need, please ask.");

/* Enquiry */
g = "Enquiry section";
add(g, "enq.h2", "Heading", "#enquire .enq h2", "text", "Tell us what you need");
add(g, "enq.p", "Text", "#enquire .enq h2 + p", "text", "Most customers simply email their requirements or RFQ. Send your list, drawing or specification and we'll come back to you personally.");
add(g, "enq.small", "Small lines under the email", "#enquire .small", "lines", "No enquiry too large or too small.\n39 Little Boundary Road, Laverton North VIC 3026");

/* Footer */
g = "Footer";
add(g, "foot.about", "About line", "footer .foot > div:first-child p", "text", "Specialist sourcing of metals, alloys and fasteners from suppliers around the world, for Australian businesses.");


/* ---------- more control: contact, menu, buttons, statistics, show or hide ---------- */
const MORE: Field[] = [];
const more = (group: string, key: string, label: string, sel: string, type: FieldType, def: string | ImgValue) =>
  MORE.push({ key, group, label, sel, type, def });

g = "Contact details";
more(g, "contact.email", "Email address (changed everywhere on the site)", 'a[href^="mailto:"]', "email", "info@revolutionmaterials.com.au");
more(g, "contact.phone", "Phone number (changed everywhere on the site)", 'a[href^="tel:"]', "phone", "0428 400 983");
more(g, "contact.address", "Address in the footer", "footer .foot > div:nth-child(2) li:last-child p", "lines", "39 Little Boundary Road\nLaverton North VIC 3026");

g = "Logo, menu and buttons";
more(g, "logo", "Logo (top and footer)", "header .brand img, footer .foot img", "img", img("6afab75777a01e46221fd28b/rm-logo.png", "Revolution Materials"));
["Materials", "Forms", "Fasteners", "Experience", "Past supplies", "Contact"].forEach((t, i) => {
  more(g, `nav.${i + 1}`, `Menu item ${i + 1}`, `#nav > a:nth-child(${i + 1})`, "text", t);
  more(g, `nav.${i + 1}.show`, `Show menu item ${i + 1}`, `#nav > a:nth-child(${i + 1})`, "show", "show");
});
more(g, "btn.header", "Button at the top right", "header .nav > a.btn", "text", "Request a Quote");
more(g, "btn.hero1", "First button in the top section", ".hero .cta a:nth-child(1)", "own", "Email Your Enquiry");
more(g, "btn.hero2", "Second button in the top section", ".hero .cta a:nth-child(2)", "text", "Request a Quote");
more(g, "btn.ask", "Button on the Not on the list card", "#materials .mat.ask .btn", "text", "Ask us");

g = "Statistics";
more(g, "stats.show", "Show the statistics band", "#rmstats", "show", "show");
[["23+", "Years in Business"], ["40+", "Years of Industry Experience"], ["11", "Countries Sourced From"], ["300+", "Australian Customers Supplied"]].forEach(([n, l], i) => {
  more(g, `stats.${i + 1}.n`, `Statistic ${i + 1}, number`, `#rmstats .si:nth-child(${i + 1}) .sv`, "num", n);
  more(g, `stats.${i + 1}.l`, `Statistic ${i + 1}, label`, `#rmstats .si:nth-child(${i + 1}) .sl`, "text", l);
  more(g, `stats.${i + 1}.show`, `Show statistic ${i + 1}`, `#rmstats .si:nth-child(${i + 1})`, "show", "show");
});

g = "Show or hide parts of the page";
more(g, "show.lead2", "Second line in the top section", ".hero .lead2", "show", "show");
more(g, "show.welcome", "Line under the buttons in the top section", ".hero .welcome", "show", "show");
more(g, "show.trust", "Strip under the top section", ".trust", "show", "show");
[1, 2, 3, 4].forEach((i) => more(g, `show.trust.${i}`, `Strip item ${i}`, `.trust .wrap > div:nth-child(${i})`, "show", "show"));
more(g, "show.materials", "Materials section", "#materials", "show", "show");
MATS.forEach(([name], i) => more(g, `show.mat.${i + 1}`, `Materials card: ${name}`, `#materials .mat:nth-child(${i + 1})`, "show", "show"));
more(g, "show.mat.ask", "Materials card: Not on the list?", "#materials .mat.ask", "show", "show");
more(g, "show.mat.note", "Note under the materials cards", "#materials .note", "show", "show");
more(g, "show.forms", "Forms and fasteners section", "#forms", "show", "show");
more(g, "show.forms.1", "Available Forms panel", "#forms .panel:nth-child(1)", "show", "show");
more(g, "show.forms.2", "Fasteners panel", "#forms .panel:nth-child(2)", "show", "show");
more(g, "show.experience", "Experience section", "#experience", "show", "show");
[1, 2, 3, 4, 5, 6, 7].forEach((i) => more(g, `show.exp.${i}`, `Experience point ${i}`, `#experience .pt:nth-child(${i})`, "show", "show"));
more(g, "show.exp.disc", "Experience small print", "#experience .disc", "show", "show");
more(g, "show.sourced", "Materials we've sourced section", "#sourced", "show", "show");

// the new groups come first in the editor
F.unshift(...MORE);

export const FIELDS: Field[] = F;
export const BY_KEY: Record<string, Field> = Object.fromEntries(F.map((f) => [f.key, f]));
