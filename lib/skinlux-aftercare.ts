// Skinlux's own full aftercare, one guide per treatment, from Jellie's Google
// Drive folder "Affter-care Folder (Updated)" (read 26 Nov 2026). Shown in the
// My Skinlux client app and linked from the aftercare text. Kept close to
// Jellie's wording; only sign offs and "reply to this email" lines are left out
// (the app has its own Message button). Injectables never name a product.
// Treatment names must match lib/skinlux-data.ts.

export type AftercareGuide = { intro?: string; sections: { title: string; points: string[] }[] };

const DOT_PEN: AftercareGuide = {
  intro: "Small micro crusts and some redness are normal after your treatment.",
  sections: [
    { title: "First 1 to 2 days", points: [
      "Dry healing for 24 to 48 hours: don't get the area wet for 1 to 2 days.",
      "Only use products recommended by your dermal therapist.",
    ] },
    { title: "After 2 days", points: [
      "Gently cleanse or wash the area.",
      "No active ingredients on the area for up to a week.",
      "Apply SPF every day.",
      "Don't pick, scratch or exfoliate the crusts. They fall off on their own over 7 to 10 days.",
      "Vitamin C and vitamin A can be used once the crust has completely fallen off.",
    ] },
    { title: "Next treatment", points: [
      "Pigmented lesions may need treating again in 4 weeks.",
      "Vascular lesions can be treated every 14 days.",
      "The area should be fully healed before it is treated again.",
    ] },
  ],
};

const INJECTABLE: AftercareGuide = {
  intro: "Your nurse went through your aftercare with you today. You'll also get separate post treatment advice by email from Freshclinics.",
  sections: [
    { title: "Aftercare", points: [
      "Avoid rubbing, pressing or massaging the area unless your injector gave you specific instructions.",
      "Check with your injector when you can go back to makeup, skincare and other treatments, and follow the timing they gave you for the area treated.",
      "Follow your injector's advice on exercise, heat and sun. They may advise no strenuous exercise for the first 24 hours, and limiting intense heat and direct sun while any redness or swelling settles.",
    ] },
    { title: "Worried about anything?", points: [
      "Booragoon clinic: call 0478 817 414.",
      "Leederville clinic: call 0423 549 335.",
    ] },
  ],
};

const IPL_HAIR: AftercareGuide = {
  sections: [
    { title: "First 24 hours", points: [
      "Keep showers lukewarm and avoid strenuous exercise, hot baths, saunas and steam rooms.",
      "Wear loose clothing if the area is sensitive.",
      "Avoid rubbing or scratching the skin, and skip fragranced products or deodorant on the area if it's irritated.",
    ] },
    { title: "While the skin settles", points: [
      "Use a gentle cleanser and a fragrance free moisturiser on intact skin.",
      "Pause scrubs, exfoliating acids and retinol until the area has settled and your therapist says when to restart.",
      "Protect exposed areas with broad spectrum SPF 50+ and don't tan the treated area between sessions.",
    ] },
    { title: "Between sessions", points: [
      "Shave once the skin feels comfortable. No waxing, tweezing or threading on the treated area.",
      "Treated hairs can look like they're still growing before they shed over the following weeks.",
      "Keep to the treatment intervals your dermal therapist gave you. Leaving it too long between sessions can disrupt permanent hair reduction.",
      "No sun or fake tan for 2 to 4 weeks before your next session. We have to refuse treatment if there's fake tan or a natural tan on the area.",
    ] },
  ],
};

export const AFTERCARE: Record<string, AftercareGuide> = {
  "HIFU": {
    intro: "Healing takes around 2 weeks, for some clients 4 to 6 weeks. Collagen takes 3 to 6 months to fully mature, which is when you'll see the full effect.",
    sections: [
      { title: "What's normal", points: [
        "Feeling warm straight after the treatment.",
        "The treated area may be flushed, red and tender.",
      ] },
      { title: "Aftercare", points: [
        "Drink plenty of water and stay hydrated for the next 5 days.",
        "No laser and no waxing on the area for 2 weeks, and no other machine treatments for 2 weeks.",
        "Use a physical sunscreen every day (SPF 30+ minimum) and avoid strong sun for 2 weeks.",
        "Avoid heat from exercise, hot showers, saunas and spas for 48 hours.",
        "No swimming for 48 hours.",
        "Mineral makeup is fine straight away.",
        "Vitamin A and C can go back on after 48 hours.",
        "Paracetamol is fine. Avoid anti inflammatory medication.",
        "No alcohol for at least 24 hours.",
      ] },
      { title: "Next steps", points: [
        "A progress review is recommended 12 weeks after your treatment. Your skin therapist or nurse may suggest another treatment in 3 months, with other treatments if needed for your goals.",
        "If you had HIFU fat reduction, staying hydrated is especially important. The fat leaves through your body's natural processes, via the liver and lymphatic system.",
      ] },
    ],
  },
  "Carbon Laser": {
    intro: "There's little to no downtime. You'll usually leave looking refreshed and glowing, and some redness is normal and settles quickly.",
    sections: [
      { title: "First 24 to 48 hours", points: [
        "No strenuous exercise, hot showers, saunas or anything else that makes you hot or sweaty.",
        "No makeup.",
        "Avoid active ingredients such as vitamin C, vitamin A and exfoliants.",
        "Cleanse gently with a gentle cleanser, then apply hydrating serums and moisturisers (for example Skincare Doctor Hydrate Serum, Hydrate + Repair Serum or Hydra Light Cream).",
        "Don't rub or touch the skin too hard when cleansing or applying products.",
      ] },
      { title: "Breakouts", points: [
        "If you had this treatment for acne or congestion, some purging is expected.",
        "Don't pick, peel or pop any spots. It can lead to acne scarring, so let the skin heal on its own.",
        "Contact us if you notice blisters, crusts or open areas. Let them heal on their own. If healing is slow, a thin layer of antibiotic ointment may be advised.",
      ] },
      { title: "Next treatment", points: [
        "Your therapist will tell you when to book your next appointment. Keeping to the plan gives the best results, and maintenance treatments are ongoing.",
      ] },
    ],
  },
  "Wrinkle relaxers": {
    intro: "You'll get a separate email from Freshclinics with the full post treatment advice.",
    sections: [
      { title: "What to expect", points: [
        "The effect usually peaks at around 2 to 4 weeks and slowly wears off after 8 to 10 weeks.",
        "Coming back for maintenance at around 3 to 4 months is recommended.",
      ] },
      { title: "Top ups", points: [
        "If a top up is needed, it must be done 2 to 3 weeks after your first treatment.",
        "Our cosmetic nurse will call you in 2 weeks to see if you need one.",
        "After 3 weeks it no longer counts as a top up and becomes a new treatment.",
      ] },
    ],
  },
  "Bio stimulating injection": INJECTABLE,
  "Fillers": INJECTABLE,
  "IPL Skin Correction": {
    sections: [
      { title: "Every day", points: [
        "Use sunscreen with SPF 30 or higher.",
        "Keep the treated areas out of the sun.",
      ] },
      { title: "First 24 hours, or until redness and swelling settle", points: [
        "Apply chilled aloe vera gel or post laser gel up to 3 times a day, or what your skin therapist recommended.",
        "A cold compress for 5 to 10 minutes every hour can soothe the skin. Never put ice directly on the skin.",
        "Avoid exercise and anything that makes you sweat or raises your body temperature.",
        "No pools, spas or saunas, and no very hot showers or baths.",
      ] },
      { title: "Up to 5 days", points: [
        "Avoid scented lotions and soaps.",
        "No vitamin A, AHAs, BHAs or vitamin C. If we treated pigmentation, wait 2 weeks for vitamin A, AHAs and BHAs.",
        "Keep using chilled aloe vera or post laser gel up to 3 times a day.",
      ] },
      { title: "1 to 4 weeks", points: [
        "No muscle relaxant or filler injections in the treated area for 1 week.",
        "No prescription strength exfoliant creams (prescription vitamin A) for 2 weeks.",
        "After IPL for pigmentation, wait 2 weeks, or until all the micro crusting has gone, before exfoliating the area. Using acids or retinol sooner will aggravate the skin while it heals.",
      ] },
      { title: "Please note", points: [
        "Not following the aftercare and treatment plan can affect your result and raise the chance of side effects.",
      ] },
    ],
  },
  "Skin needling": {
    sections: [
      { title: "First 24 to 48 hours", points: [
        "No strenuous exercise, hot showers, saunas or anything else that makes you hot or sweaty.",
        "No makeup.",
        "Avoid active ingredients such as vitamin C, vitamin A and exfoliants.",
        "Cleanse gently with a gentle cleanser, then apply the hydrating serums and moisturisers your skin therapist recommended.",
      ] },
      { title: "First week", points: [
        "Avoid the sun and wear SPF every day, whatever the weather.",
        "Keep using a gentle cleanser, hydrating serums and moisturiser.",
        "While the skin is dry or peeling, an occlusive balm and the healing products your therapist recommended will help.",
        "Bring vitamin C back 3 to 5 days after, in the morning, followed by SPF.",
        "Bring vitamin A (retinol or retinal) back 7 days after, at night.",
      ] },
      { title: "What to expect", points: [
        "A sunburn like feeling for 3 to 5 days.",
        "Redness during this time, fading as your skin heals.",
        "Some mild peeling from around day 3.",
        "Your skin should feel resurfaced and back to normal around 5 to 7 days after.",
        "If your treatment included advanced exosomes, healing may be quicker.",
      ] },
      { title: "Please note", points: [
        "If you feel anything unusual that isn't listed here, contact us. Your healing phase is as important as the treatment.",
      ] },
    ],
  },
  "Bright and Tight": {
    intro: "Bright and Tight combines Diamond Polar radiofrequency to firm, a peel tailored to your skin to brighten and smooth, and LED. Your therapist will tell you if today's peel needs any extra aftercare.",
    sections: [
      { title: "What to expect", points: [
        "Your skin may feel a little warm or look pink after treatment.",
        "Mild dryness, tightness or light flaking can happen over the next few days, especially after a resurfacing peel. Let flakes shed on their own and don't pick or scrub.",
      ] },
      { title: "Aftercare", points: [
        "For the first 24 hours, avoid strenuous exercise, hot yoga, saunas, steam rooms and very hot showers.",
        "For up to 5 days, use only a gentle cleanser, Hydrate + Repair or a repairing serum, and no active ingredients.",
        "Apply SPF every day.",
        "From day 5, if your skin feels settled, bring in the vitamin C or tyrosinase inhibitor your therapist recommended.",
        "From day 7, start vitamin A, retinol or retinal.",
        "No other skin treatments for 2 weeks.",
        "Any unusual side effects, please contact us.",
      ] },
    ],
  },
  "Clinical Peels": {
    intro: "Your skin may be more sensitive after a resurfacing or enzyme peel. Itching, tingling, stinging, redness, swelling, tightness, peeling, flaking or scabbing can happen and usually last 1 to 7 days.",
    sections: [
      { title: "First 3 days", points: [
        "Gentle products only, no active ingredients. Avoid retinol (vitamin A), AHAs and facial scrubs.",
        "A gentle or hydrating cleanser, then B5 Serum or Hydrating Mist, and a gentle moisturiser with epidermal growth factors such as Hydrate + Repair.",
        "Apply sunscreen every day and limit sun exposure.",
        "Wash with lukewarm water. No hot showers, saunas, spas or exercise.",
        "Mineral makeup is fine. Take it off at night.",
      ] },
      { title: "Days 3 to 5", points: [
        "Your skin may start to peel or flake, or just feel rough, from around day 2 to 6. It depends on the peel and your skin, and it doesn't always happen.",
        "Don't pick or scratch. Let the skin come away on its own.",
        "Bring in the vitamin C or tyrosinase inhibitor and AHAs your skin therapist recommended.",
      ] },
      { title: "Day 7 onwards", points: [
        "Retinol, retinal or vitamin A can go back on. If you're new to retinol, build up slowly as your therapist advised.",
        "Keep using sunscreen every day.",
      ] },
    ],
  },
  "Advanced Peels": {
    intro: "Recovery and how much you peel depend on your skin and the peel we used. Usually only the Catalyst Retinol and Alpha Beta peels cause slight peeling.",
    sections: [
      { title: "Aftercare", points: [
        "If flaky, dry skin appears, don't pick, scratch or peel it.",
        "Keep your skin hydrated and moisturised. Warmth, a pinkish red colour or dryness is normal, and your home care routine will settle it.",
        "Avoid direct sun for 5 to 10 days and wear Mineral Pro SPF 30 or 50. Reapply every 2 hours when you're outside.",
      ] },
      { title: "Timings", points: [
        "Next 24 hours: avoid excessive heat and harsh washcloths. If you have a leave on peel, don't rinse it or put water on it for 5 hours after it was applied.",
        "Next 5 days: no AHAs, BHAs, retinol, scrubs or enzymes.",
        "Next 14 days: no waxing or hair removal on the area, and no other peels, IPL, laser or skin treatments we haven't prescribed.",
      ] },
      { title: "For dryness", points: [
        "Hyaluronic acid, a balm, Medisoothe or the products your skin therapist recommended help with dryness, repair and hydration.",
      ] },
      { title: "Next treatment", points: [
        "Book your next treatment for 2 to 4 weeks' time.",
      ] },
    ],
  },
  "Cosmelan": {
    intro: "Red, tight and inflamed skin is normal after Cosmelan. Peeling starts around day 3. Please don't pick or peel your skin, and contact the clinic if anything worries you.",
    sections: [
      { title: "While the mask is on", points: [
        "Mist your skin with water every 2 to 3 hours during the day.",
        "Don't leave the mask on longer than your provider told you. When the time is up, remove the cosmelan 1 mask with lukewarm water.",
        "Use only mesoestetic products as part of the Cosmelan method. It gives the best result and lowers the chance of a reaction.",
      ] },
      { title: "First 72 hours", points: [
        "Morning: hydracream fusion, hydratonic mist, melan recovery, mesoprotech melan 130 pigment control.",
        "Night: hydracream fusion, hydratonic mist, hydravital mask for 20 minutes, melan recovery.",
      ] },
      { title: "First 4 weeks", points: [
        "Morning: hydracream fusion, hydratonic mist, cosmelan 2 maintenance cream, hydra vital factor k, melan recovery, mesoprotech melan 130 pigment control.",
        "Night: hydracream fusion, hydratonic mist, hydravital mask for 20 minutes every second night, cosmelan 2 maintenance cream, hydra vital factor k, melan recovery.",
        "If you can't tolerate cosmelan 2 maintenance cream on its own, mix it in equal amounts with hydra vital factor k, then apply melan recovery.",
      ] },
      { title: "The following 5 months", points: [
        "Morning: hydracream fusion, hydratonic mist, hydra vital factor k or melan recovery, mesoprotech melan 130 pigment control.",
        "Night: hydracream fusion, hydratonic mist, cosmelan 2 maintenance cream, hydra vital factor k, melan recovery.",
        "Keep up the home care for up to 6 months after the treatment.",
      ] },
    ],
  },
  "Nano fractional RF": {
    intro: "Straight after treatment your skin will look red and inflamed and feel hot and tight.",
    sections: [
      { title: "First 24 hours", points: [
        "Don't use any products. Nothing on the skin for the rest of the day: no washing, cleansing, steam or moisture.",
        "Only fan the skin for comfort. Don't use a cold compress.",
      ] },
      { title: "Days 1 to 5", points: [
        "Only a gentle cleanser, hydrating serums or correctors and the SPF your skin therapist recommended. Make sure nothing irritates the skin, as that raises the chance of side effects.",
        "Around day 3 your skin may flake and feel bumpy, and the redness should have settled to a slight pinkness. Vitamin C can be brought in then with a hydrating moisturiser, followed by SPF in the morning.",
        "No other active ingredients for 7 days.",
      ] },
      { title: "Day 7 onwards", points: [
        "Dryness and flaking should be finished and your skin should feel smoother.",
        "Go back to your normal routine, including vitamin C, vitamin A and hydrators. The right home care makes the most of your treatment.",
      ] },
      { title: "Next steps", points: [
        "For best results we recommend at least 3 sessions, 2 to 4 weeks apart depending on your skin.",
        "If your skin is sensitive, LED 3 to 5 days after, or a gentle peel or enzyme peel in 2 weeks, can help.",
      ] },
    ],
  },
  "Diamond Polar RF": {
    sections: [
      { title: "Aftercare", points: [
        "Your skin may feel warm or look slightly pink after treatment. This usually settles within one to two hours.",
        "You can usually go back to your normal activities and apply moisturiser or makeup the same day.",
        "Apply SPF every day. It helps keep the tightening result and protects your collagen.",
        "If you have any other skin concerns, let us know and we can talk about what to pair with Diamond Polar RF.",
      ] },
    ],
  },
  "Electrocautery": DOT_PEN,
  "Plasma Fibroblast": DOT_PEN,
  "Exo Grow": {
    intro: "Your scalp may feel a little tender or look slightly pink after microneedling. This settles over the next few days.",
    sections: [
      { title: "First 24 hours", points: [
        "Don't wash your hair, scratch or rub your scalp.",
        "No vigorous exercise, saunas or very hot showers.",
        "Keep the treated area out of direct sun.",
      ] },
      { title: "After 24 hours", points: [
        "If your scalp is settling, wash gently with lukewarm water and the shampoo your therapist recommended.",
        "Follow your therapist's advice on when to restart scalp serums, tonics and styling products.",
      ] },
      { title: "Hair colour and chemical treatments", points: [
        "Wait at least 2 weeks before colouring, bleaching or a keratin treatment. If your scalp is still irritated, wait until it has settled.",
      ] },
      { title: "Next steps", points: [
        "Follow your treatment plan for the best results, and contact us if you have any concerns or side effects.",
      ] },
    ],
  },
  "Body Sculpting": {
    sections: [
      { title: "Stay hydrated", points: [
        "Drink water regularly through the day.",
      ] },
      { title: "Support your muscles", points: [
        "Eat balanced meals with enough protein to help your muscles recover.",
        "Keep up regular exercise and good sleep alongside your course. EMS doesn't replace exercise or a healthy diet.",
      ] },
      { title: "Listen to your body", points: [
        "Muscle tiredness, tenderness or mild soreness, like after a workout, is normal.",
        "If you feel sore, choose gentle movement and let your muscles recover before hard exercise.",
        "If your appointment also included radiofrequency or suction, follow the extra skin care advice your therapist gave you.",
      ] },
      { title: "Your course", points: [
        "Come to the sessions and reviews your therapist recommended. Results build gradually and vary from person to person.",
        "Tell us about ongoing discomfort or any change in your health before your next appointment.",
      ] },
      { title: "When to contact us", points: [
        "Contact the clinic if discomfort lasts, gets worse or worries you.",
        "Get urgent medical help for severe muscle pain, a lot of swelling, marked weakness or dark urine.",
      ] },
    ],
  },
  "IPL hair removal (SHR)": IPL_HAIR,
  "Tattoo removal": {
    sections: [
      { title: "Up to 5 days: what's normal", points: [
        "A sunburn like feeling, swelling, pinpoint bleeding, itchy or dry skin, bruising and tenderness.",
        "Blisters may appear, especially on hands and feet. If they do, raise the area, keep it clean and covered, and don't pick, pop or touch them.",
      ] },
      { title: "Every day", points: [
        "Apply SPF 30+ sunscreen and keep the treated area out of the sun.",
      ] },
      { title: "First 24 hours, or until redness settles", points: [
        "Keep the dressing from the clinic on and keep the area dry.",
        "After 24 hours take the dressing off. If there's a lot of redness, swelling or blisters, take a photo, contact the clinic, then apply the recommended balm and a clean dressing.",
        "No exercise, heavy sweating, hot showers or baths.",
        "Raise the area to reduce swelling.",
      ] },
      { title: "Up to 2 weeks", points: [
        "Apply the recommended balm 2 to 3 times a day or as needed.",
        "Cover with a clean dressing if there are blisters or scabs, or if clothing rubs.",
        "No sun, scratching, picking, rubbing, shaving or exfoliating.",
        "Let it heal on its own. Picking can cause infection or scarring. If healing is slow, an antibiotic ointment may be recommended.",
        "Contact the clinic if blisters, crusting or open areas get worse.",
      ] },
      { title: "Before each treatment, tell us if you have", points: [
        "Had sun or fake tan on the area in the last 4 weeks.",
        "Started or changed any medicines or supplements.",
        "A new medical condition or have been unwell.",
        "Become pregnant or are trying to conceive.",
      ] },
    ],
  },
};

export function aftercareGuide(treatment: string): AftercareGuide | null {
  return AFTERCARE[treatment] || null;
}
