// Skinlux treatment and product data, shared by the event sender, the staff
// app and the quiz. Source: clients/skinlux-jellie/build/03-treatment-data.csv
// and 02-messages.md. Aftercare comes from Jellie's own aftercare docs. Timely stays the source of bookings;
// this file only holds what each treatment means for the follow up.

export type Clinic = "booragoon" | "leederville";
export const CLINICS: Record<Clinic, { name: string; phone: string }> = {
  booragoon: { name: "Booragoon", phone: "0478 817 414" },
  leederville: { name: "Leederville", phone: "0423 549 335" },
};

export type Treatment = {
  name: string; // must match the GoHighLevel "Last treatment" option
  injectable: boolean;
  rebookDays: number; // 0 = no automatic next due date
  checkinDay: 2 | 3;
  aftercare: string | null; // null = general line
  concerns: string[];
};

export const TREATMENTS: Treatment[] = [
  // aftercare: the short text sent 30 minutes after Treatment done, written from
  // Jellie's aftercare docs (Drive, 26 Nov 2026). Full guides: lib/skinlux-aftercare.ts
  // (client app). Jellie's edits in HQ, Your messages (msg_aftercare_*) win over this.
  { name: "HIFU", injectable: false, rebookDays: 90, checkinDay: 2, concerns: ["ageing", "laxity", "jawline"],
    aftercare: "Feeling warm, flushed or tender is normal. For 48 hours skip hot showers, saunas, swimming and hard exercise, and no alcohol for 24 hours. No laser or waxing on the area for 2 weeks, SPF 30+ every day, and drink plenty of water for 5 days." },
  { name: "Carbon Laser", injectable: false, rebookDays: 21, checkinDay: 2, concerns: ["acne", "pores", "texture"],
    aftercare: "Some redness is normal and settles quickly. For 24 to 48 hours: no makeup, hard exercise, hot showers or saunas, and no vitamin C, vitamin A or exfoliants. Gentle cleanser and hydrating serum only, and please don't pick any breakouts." },
  { name: "Wrinkle relaxers", injectable: true, rebookDays: 105, checkinDay: 2, concerns: ["ageing"],
    aftercare: null },
  { name: "Bio stimulating injection", injectable: true, rebookDays: 35, checkinDay: 2, concerns: ["ageing", "scarring", "texture"],
    aftercare: null },
  { name: "Fillers", injectable: true, rebookDays: 270, checkinDay: 2, concerns: ["ageing", "laxity"],
    aftercare: null },
  { name: "IPL Skin Correction", injectable: false, rebookDays: 30, checkinDay: 2, concerns: ["pigmentation", "rosacea"],
    aftercare: "SPF 30+ every day and keep out of the sun. For 24 hours: chilled aloe or post laser gel up to 3 times a day, and no exercise, spas, saunas or very hot showers. No vitamin A, vitamin C or acids for 5 days (2 weeks if we treated pigmentation)." },
  { name: "Skin needling", injectable: false, rebookDays: 28, checkinDay: 2, concerns: ["scarring", "pores", "ageing", "pigmentation"],
    aftercare: "A sunburn feeling and redness for 3 to 5 days is normal. For 24 to 48 hours: no makeup, hard exercise, hot showers or saunas, and no vitamin C, vitamin A or exfoliants. SPF every day. Vitamin C back from day 3 to 5, retinol from day 7." },
  { name: "Bright and Tight", injectable: false, rebookDays: 28, checkinDay: 2, concerns: ["texture", "laxity"],
    aftercare: "A little warmth, pinkness or light flaking is normal, so don't pick. For 24 hours skip hard exercise, saunas and very hot showers. Gentle cleanser and hydrating serum only for 5 days, SPF every day, vitamin C from day 5, retinol from day 7, and no other skin treatments for 2 weeks." },
  { name: "Clinical Peels", injectable: false, rebookDays: 14, checkinDay: 2, concerns: ["acne", "texture", "pores", "pigmentation"],
    aftercare: "Tingling, redness, tightness or flaking for 1 to 7 days is normal, so don't pick. For 3 days: gentle products only, no retinol, acids or scrubs, lukewarm water, and no hot showers, saunas or exercise. SPF every day." },
  { name: "Advanced Peels", injectable: false, rebookDays: 42, checkinDay: 3, concerns: ["pigmentation", "texture"],
    aftercare: "Keep your skin moisturised and don't pick any flaking. For 24 hours avoid heat and harsh washcloths. No acids, retinol, scrubs or enzymes for 5 days, and no waxing, IPL, laser or other peels for 14 days. SPF 30+ and stay out of the sun for 5 to 10 days." },
  { name: "Cosmelan", injectable: false, rebookDays: 0, checkinDay: 3, concerns: ["pigmentation"],
    aftercare: "Red, tight and inflamed skin is normal, and peeling starts around day 3. Please don't pick or peel. Mist with water every 2 to 3 hours while the mask is on, rinse it off with lukewarm water at the time we gave you, then use only your mesoestetic home care." },
  { name: "Nano fractional RF", injectable: false, rebookDays: 28, checkinDay: 2, concerns: ["scarring", "texture", "laxity"],
    aftercare: "Red, hot and tight skin is normal. Nothing on your skin for 24 hours, not even water, and just fan it for comfort. Days 1 to 5: gentle cleanser, hydrating serum and SPF only. No other active ingredients for 7 days." },
  { name: "Diamond Polar RF", injectable: false, rebookDays: 7, checkinDay: 2, concerns: ["laxity", "ageing"],
    aftercare: "You may feel warm or look a little pink for an hour or two. Moisturiser, makeup and your normal day are all fine. Wear SPF every day to help keep your results." },
  { name: "Electrocautery", injectable: false, rebookDays: 0, checkinDay: 2, concerns: ["lesions"],
    aftercare: "Small crusts and redness are normal. Keep the area dry for 1 to 2 days, then wash gently. No active products on it for a week, SPF every day, and please don't pick the crusts. They fall off on their own in 7 to 10 days." },
  { name: "Exo Grow", injectable: false, rebookDays: 28, checkinDay: 2, concerns: ["hair loss"],
    aftercare: "A tender or pink scalp for a few days is normal. For 24 hours: no hair washing, scratching, hard exercise, saunas, very hot showers or direct sun. Then wash gently with lukewarm water. No colour, bleach or keratin for at least 2 weeks." },
  { name: "LED therapy", injectable: false, rebookDays: 7, checkinDay: 2, concerns: ["acne", "rosacea"],
    aftercare: "Nothing special needed." },
  { name: "Body Sculpting", injectable: false, rebookDays: 7, checkinDay: 2, concerns: ["body"],
    aftercare: "Muscle tiredness or soreness, like after a workout, is normal. Drink plenty of water, eat enough protein and go gently if you're sore. Call us if it gets worse, and get urgent help for severe pain, a lot of swelling or dark urine." },
  { name: "Plasma Fibroblast", injectable: false, rebookDays: 56, checkinDay: 3, concerns: ["laxity", "ageing"],
    aftercare: "Small crusts and redness are normal. Keep the area dry for 1 to 2 days, then wash gently. No active products on it for a week, SPF every day, and please don't pick the crusts. They fall off on their own in 7 to 10 days." },
  { name: "IPL hair removal (SHR)", injectable: false, rebookDays: 25, checkinDay: 2, concerns: ["hair removal"],
    aftercare: "For 24 hours: lukewarm showers, no hard exercise, hot baths or saunas, and no fragrance or deodorant on the area if it's irritated. SPF 50+ and no tan or fake tan between sessions. Shave only, no waxing, tweezing or threading." },
  { name: "Tattoo removal", injectable: false, rebookDays: 0, checkinDay: 2, concerns: ["tattoo"],
    aftercare: "Keep the dressing on and the area dry for 24 hours, then apply your balm 2 to 3 times a day. Swelling, itching, pinpoint bleeding or blisters can happen. Don't pick or pop them, raise the area and keep it clean. SPF 30+ and no sun on the area." },
];

export const THERAPISTS = ["Jellie", "Nurse Leo", "Nurse Maria", "Sharon Kim", "Shakira Hewitt"];

export const PRODUCTS: { name: string; lifeDays: number | null }[] = [
  "Skincare Doctor Barrier Build Cream", "Skincare Doctor Barrier Build Cleanser 120ml", "Skincare Doctor Hydrate + Repair Serum",
  "Skincare Doctor Hydrate + Exfoliate Serum", "Skincare Doctor Men's Kit", "Skincare Doctor Starter Kit",
  "Skincare Doctor Retinal + B3 Serum", "Skincare Doctor Vitamin Sleep Balm", "Skincare Doctor Bright Eye Serum",
  "Skincare Doctor Hydrating Face Oil", "Skincare Doctor DNA Repair Cream", "Skincare Doctor Hydra Light Cream",
  "Skincare Doctor Hydra Soothe Cream", "Skincare Doctor Retinal + Peptide Cream", "Skincare Doctor Vitamin C + Peptides Serum",
  "Skincare Doctor Exfoliating Blemish Serum", "Skincare Doctor Hydrate", "Skincare Doctor HA + Peptide Mist",
  "Skincare Doctor Oil Cleanser", "SkinCare Doctor Gel Cleanser",
].map((name) => ({ name, lifeDays: null })); // per product life to come from Jellie

// Jellie (24 Nov): send the shop link to repurchase about 2 to 3 months after an in clinic sale.
// The reminder goes at life minus 10 days, so 85 gives 75 days (about 2.5 months).
export const DEFAULT_PRODUCT_LIFE = 85;

const MON = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
/** DD-MMM-YYYY in Perth time, the format GoHighLevel date fields take */
export function ghlDate(daysFromNow: number, now = new Date()): string {
  const perth = new Date(now.getTime() + 8 * 3600_000 + daysFromNow * 86400_000);
  return `${String(perth.getUTCDate()).padStart(2, "0")}-${MON[perth.getUTCMonth()]}-${perth.getUTCFullYear()}`;
}

export function aftercareSms(t: Treatment, firstName: string, clinic: Clinic): string {
  const sign = `Skinlux ${CLINICS[clinic].name}`;
  if (t.injectable)
    return `Hi ${firstName}, thanks for coming in today. Please follow the aftercare your nurse gave you today. Freshclinics will also email you the full post treatment advice. Avoid rubbing, pressing or massaging the area, and follow your injector's advice on exercise, heat and sun. Any questions or worries, reply here and a nurse will call you. ${sign}`;
  if (!t.aftercare)
    return `Hi ${firstName}, thanks for coming in today. Your therapist went through your ${t.name} aftercare with you. Any questions, just reply here. ${sign}`;
  return `Hi ${firstName}, thanks for coming in today. ${t.aftercare} Any questions, just reply here. ${sign}`;
}

export function findTreatment(name: string): Treatment | undefined {
  const n = name.trim().toLowerCase();
  return TREATMENTS.find((t) => t.name.toLowerCase() === n);
}

// Quiz: concern -> treatments, best first (02-messages.md "paired treatments", for Jellie to check)
export const CONCERN_MAP: Record<string, string[]> = {
  "Acne or congestion": ["Carbon Laser", "Clinical Peels", "LED therapy"],
  "Pigmentation or sun damage": ["IPL Skin Correction", "Clinical Peels", "Skin needling"],
  "Redness or rosacea": ["IPL Skin Correction", "LED therapy"],
  "Fine lines and ageing": ["Bright and Tight", "Diamond Polar RF", "HIFU"],
  "Sagging or loose skin": ["HIFU", "Diamond Polar RF", "Nano fractional RF"],
  "Scarring or texture": ["Skin needling", "Nano fractional RF", "Clinical Peels"],
  "Large pores": ["Carbon Laser", "Skin needling", "Clinical Peels"],
  "Unwanted hair": ["IPL hair removal (SHR)"],
  "Stubborn fat or toning": ["Body Sculpting", "HIFU"],
  "Thinning hair": ["Exo Grow"],
};
