// Skinlux treatment and product data, shared by the event sender, the staff
// app and the quiz. Source: clients/skinlux-jellie/build/03-treatment-data.csv
// and 02-messages.md. Aftercare marked "missing" there uses the general line
// until Jellie supplies the real wording. Timely stays the source of bookings;
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
  { name: "HIFU", injectable: false, rebookDays: 90, checkinDay: 2, concerns: ["ageing", "laxity", "jawline"],
    aftercare: "mild swelling or tingling is normal for a day. Gentle skincare and SPF 30+ daily" },
  { name: "Carbon Laser", injectable: false, rebookDays: 21, checkinDay: 2, concerns: ["acne", "pores", "texture"], aftercare: null },
  { name: "Wrinkle relaxers", injectable: true, rebookDays: 105, checkinDay: 2, concerns: ["ageing"], aftercare: null },
  { name: "Bio stimulating injection", injectable: true, rebookDays: 35, checkinDay: 2, concerns: ["ageing", "scarring", "texture"], aftercare: null },
  { name: "Fillers", injectable: true, rebookDays: 270, checkinDay: 2, concerns: ["ageing", "laxity"], aftercare: null },
  { name: "IPL Skin Correction", injectable: false, rebookDays: 30, checkinDay: 2, concerns: ["pigmentation", "rosacea"],
    aftercare: "redness for 24 to 48 hours is normal. SPF 30+ daily and avoid the sun" },
  { name: "Skin needling", injectable: false, rebookDays: 28, checkinDay: 2, concerns: ["scarring", "pores", "ageing", "pigmentation"],
    aftercare: "no makeup for 24 hours, gentle cleanser, SPF 30+, no retinol for a week" },
  { name: "Bright and Tight", injectable: false, rebookDays: 28, checkinDay: 2, concerns: ["texture", "laxity"],
    aftercare: "SPF 30+ and gentle skincare for 48 hours" },
  { name: "Clinical Peels", injectable: false, rebookDays: 14, checkinDay: 2, concerns: ["acne", "texture", "pores", "pigmentation"],
    aftercare: "no exfoliants for 3 days, SPF 30+" },
  { name: "Advanced Peels", injectable: false, rebookDays: 42, checkinDay: 3, concerns: ["pigmentation", "texture"], aftercare: null },
  { name: "Nano fractional RF", injectable: false, rebookDays: 28, checkinDay: 2, concerns: ["scarring", "texture", "laxity"],
    aftercare: "nothing on the skin for 24 hours, not even water. Then SPF 30+. No hard exercise, hot baths or massage for 2 days" },
  { name: "Diamond Polar RF", injectable: false, rebookDays: 7, checkinDay: 2, concerns: ["laxity", "ageing"],
    aftercare: "you may look flushed for an hour or two. Makeup is fine straight away. Drink plenty of water" },
  { name: "Electrocautery", injectable: false, rebookDays: 0, checkinDay: 2, concerns: ["lesions"], aftercare: null },
  { name: "Exo Grow", injectable: false, rebookDays: 28, checkinDay: 2, concerns: ["hair loss"], aftercare: null },
  { name: "LED therapy", injectable: false, rebookDays: 7, checkinDay: 2, concerns: ["acne", "rosacea"], aftercare: "nothing special needed" },
  { name: "Body Sculpting", injectable: false, rebookDays: 7, checkinDay: 2, concerns: ["body"],
    aftercare: "drink plenty of water. Some muscle soreness after EMS is normal" },
  { name: "Plasma Fibroblast", injectable: false, rebookDays: 56, checkinDay: 3, concerns: ["laxity", "ageing"], aftercare: null },
  { name: "IPL hair removal (SHR)", injectable: false, rebookDays: 25, checkinDay: 2, concerns: ["hair removal"],
    aftercare: "no hot showers, gym or sun for 24 hours. Shave, don't wax, between sessions" },
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
    return `Hi ${firstName}, thanks for coming in today. Please follow the aftercare your nurse gave you. Any questions or concerns, reply here and a nurse will call you. ${sign}`;
  if (!t.aftercare)
    return `Hi ${firstName}, thanks for coming in today. Your therapist went through your ${t.name} aftercare with you. Any questions, just reply here. ${sign}`;
  return `Hi ${firstName}, thanks for coming in today. Your ${t.name} aftercare: ${t.aftercare}. Any questions, just reply here. ${sign}`;
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
