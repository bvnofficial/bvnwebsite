"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, Star, TrendingUp, Settings, Megaphone,
  ChevronDown, ChevronUp, CheckCircle, AlertCircle,
  Instagram, Facebook, MapPin, Clock, Users,
  Package, Zap, Award, ShoppingBag, Utensils,
  BarChart3, Target, Layers, DollarSign,
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  red: "#C41E3A",
  redDark: "#8B0000",
  orange: "#E8721C",
  gold: "#FFB800",
  dark: "#0A0300",
  surface: "#160800",
  card: "#231000",
  cardHover: "#2E1500",
  border: "#3D1A00",
  text: "#FFF5E8",
  muted: "rgba(255,245,232,0.52)",
  dim: "rgba(255,245,232,0.22)",
};

// ── Sauces (with full ingredients & prep) ────────────────────
const sauces = [
  {
    id: 1, name: "Inasal Klasiko", tag: "Signature", color: "#E8721C", emoji: "🍋", heat: 1, region: "Bacolod",
    desc: "Lemongrass, calamansi, and annatto butter — the soul of Filipino rotisserie. Bright, citrusy, golden.",
    prepTime: "10 min", sauceYield: "400ml / 16 portions",
    ingredients: ["2 stalks lemongrass, finely minced","¼ cup calamansi juice (~12 pcs)","3 tbsp annatto oil (achuete)","1 thumb ginger, grated","6 cloves garlic, minced","3 tbsp unsalted butter","1 tbsp fish sauce (patis)","Salt & white pepper to taste"],
    steps: ["Combine all in a small saucepan over medium-low heat.","Simmer 5–7 min, stirring, until fragrant and butter melts.","Strain through fine mesh; discard solids.","Use warm as rotisserie baste every 15 min and as dipping sauce."],
  },
  {
    id: 2, name: "Adobo Negra", tag: "Dark & Deep", color: "#5A3200", emoji: "🧄", heat: 1, region: "Nationwide",
    desc: "Dark soy, native vinegar, roasted garlic glaze. Sticky, rich, and impossibly savoury.",
    prepTime: "15 min", sauceYield: "300ml / 12 portions",
    ingredients: ["¼ cup dark soy sauce","3 tbsp native cane vinegar (sukang iloko)","8 cloves garlic, dry-roasted until charred","1 tsp cracked black pepper","3 bay leaves","2 tbsp brown sugar","1 tsp toasted sesame oil"],
    steps: ["Dry-roast unpeeled garlic in a dry pan ~5 min until charred. Peel.","Combine soy, vinegar, garlic, bay, and pepper. Simmer 10 min.","Add brown sugar; stir until dissolved. Sauce should coat a spoon.","Off heat, add sesame oil. Strain and cool before serving."],
  },
  {
    id: 3, name: "Bicol Maanghang", tag: "🔥 Hottest", color: "#CC2200", emoji: "🌶️", heat: 5, region: "Bicol",
    desc: "Bird's eye chili meets coconut cream. Fiery, creamy, and absolutely addictive. Not for the faint-hearted.",
    prepTime: "20 min", sauceYield: "350ml / 14 portions",
    ingredients: ["15–20 siling labuyo (bird's eye chili), pounded","1 cup thick coconut milk","2 tbsp bagoong alamang (shrimp paste)","5 cloves garlic, minced","1 thumb ginger, grated","½ onion, minced"],
    steps: ["Sauté garlic, onion, ginger in oil 2 min.","Add bagoong alamang; cook stirring 2 min.","Add pounded chili; stir 1 min.","Pour coconut milk; simmer uncovered 8–10 min until thick. ⚠️ Very hot — wash hands after handling chili."],
  },
  {
    id: 4, name: "Sinamak Ilokano", tag: "Tangy", color: "#7A4010", emoji: "🫙", heat: 2, region: "Ilocos",
    desc: "Spiced Ilocos cane vinegar with garlic and chili peppers. Sharp, clean, cuts right through the fat.",
    prepTime: "5 min + 48hr infuse", sauceYield: "250ml / 10 portions",
    ingredients: ["1 cup Ilocos native cane vinegar","10 cloves garlic, whole","5–8 siling labuyo, whole","1 tsp whole black peppercorns","2 thumbs ginger, sliced","Pinch of native palm sugar"],
    steps: ["Combine all ingredients in a sterilised glass jar or bottle.","Do NOT boil — this is a cold-infused vinegar sauce.","Seal and leave at room temperature 24–48 hours.","Strain before serving. Gets better after 3–4 days."],
  },
  {
    id: 5, name: "Laing Sarsa", tag: "Creamy", color: "#2D5016", emoji: "🥥", heat: 2, region: "Bicol",
    desc: "Taro leaves simmered in coconut milk with dried fish. Earthy, smoky, unforgettable on rotisserie skin.",
    prepTime: "25 min", sauceYield: "400ml / 16 portions",
    ingredients: ["30g dried taro leaves (gabi), crumbled","1 cup thick coconut cream","3 tbsp bagoong alamang","4 cloves garlic, minced","½ thumb ginger, grated","2 tbsp dried hipon (tiny dried shrimp)","3 siling labuyo"],
    steps: ["Sauté garlic and ginger in oil. Add bagoong; stir 2 min.","Add dried taro leaves; stir to coat with aromatics.","Pour coconut cream. Do NOT cover (makes laing bitter).","Simmer 15–20 min, stirring often, until thick and creamy."],
  },
  {
    id: 6, name: "Sinigang Asim", tag: "Sour Power", color: "#4A7A2E", emoji: "🍅", heat: 1, region: "Nationwide",
    desc: "Tamarind-based tangy glaze with roasted tomato. Bright and acidic — the palate cleanser you need.",
    prepTime: "15 min", sauceYield: "450ml / 18 portions",
    ingredients: ["4 tbsp tamarind paste (sampalok)","2 medium tomatoes, roasted then blended","4 cloves garlic, minced","2 tbsp fish sauce (patis)","½ cup water","1 tsp sugar (to balance)"],
    steps: ["Roast tomatoes over open flame or in dry pan until skins blacken.","Blend tomatoes smooth. Combine with tamarind paste and water.","Heat in pan, add garlic and fish sauce. Simmer 10 min.","Add sugar to balance acidity. Strain until smooth."],
  },
  {
    id: 7, name: "Mang Tomas Supreme", tag: "Crowd Fave", color: "#6B3A00", emoji: "👑", heat: 0, region: "Nationwide",
    desc: "Elevated Filipino liver sauce with native spices. Rich, thick, the ultimate comfort dip.",
    prepTime: "30 min", sauceYield: "500ml / 20 portions",
    ingredients: ["200g pork liver, roasted and blended smooth","3 tbsp native cane vinegar","6 cloves garlic, minced","1 small onion, minced","3 tbsp brown sugar","1 tsp cracked black pepper","2 tbsp fine breadcrumbs (thickener)","2 bay leaves"],
    steps: ["Roast or pan-fry liver until fully cooked. Cool, then blend smooth.","Sauté garlic and onion. Add blended liver, vinegar, sugar, bay, pepper.","Stir well; simmer 10 min on low heat.","Add breadcrumbs; stir until desired thickness. Remove bay before serving."],
  },
  {
    id: 8, name: "Banana Ketchup Fiesta", tag: "Sweet", color: "#CC5500", emoji: "🍌", heat: 0, region: "Nationwide",
    desc: "Classic Filipino banana ketchup with calamansi zest. Sweet, tangy, party-ready. Kids go wild for this.",
    prepTime: "20 min", sauceYield: "400ml / 16 portions",
    ingredients: ["3 overripe saba bananas, mashed","2 tbsp white sugar","2 tbsp white vinegar","2 tbsp tomato paste","3 cloves garlic, minced","¼ onion, minced","2 tbsp calamansi juice","Pinch allspice & turmeric (for color)"],
    steps: ["Sauté garlic and onion in oil until soft.","Add mashed banana, tomato paste, sugar, and vinegar. Cook 5 min, mashing.","Add calamansi, allspice, and turmeric. Stir well.","Cool then blend until smooth. Adjust sweetness with sugar."],
  },
  {
    id: 9, name: "Bagoong Verde", tag: "Funky", color: "#3D7A3D", emoji: "🦐", heat: 2, region: "Pangasinan",
    desc: "Green shrimp paste, lime, and garlic. Funky, pungent, intensely umami — uniquely Pinoy.",
    prepTime: "10 min + 1hr chill", sauceYield: "250ml / 10 portions",
    ingredients: ["3 tbsp green bagoong alamang","3 tbsp fresh lime juice","4 cloves garlic, fried until golden","4 stalks green onion, finely minced","2 tbsp calamansi juice","2 siling haba (green finger chili), minced"],
    steps: ["Fry garlic in oil until golden and crispy. Drain on paper.","Combine bagoong, lime, calamansi, green onion, and chili in a bowl.","Fold in crispy garlic just before serving for texture.","Chill 1 hour minimum — serve cold against hot chicken."],
  },
  {
    id: 10, name: "Lechon Sauce Klasiko", tag: "Classic", color: "#8B1A1A", emoji: "🔥", heat: 0, region: "Cebu",
    desc: "The original liver-based lechon dipping sauce. Rich, peppery, and deeply Filipino. The closer.",
    prepTime: "35 min", sauceYield: "500ml / 20 portions",
    ingredients: ["200g pork liver, boiled and blended","3 tbsp native cane vinegar","4 tbsp sugar","6 cloves garlic, minced","1 small onion, minced","1 tsp cracked black pepper","3 tbsp breadcrumbs","3 bay leaves","¼ cup chicken stock"],
    steps: ["Boil liver 15 min until cooked. Cool then blend completely smooth.","Sauté garlic and onion in oil. Add liver, stock, vinegar, sugar, bay, pepper.","Simmer 12 min on low heat, stirring to prevent sticking.","Add breadcrumbs to desired thickness. Remove bay. Serve warm."],
  },
  {
    id: 11, name: "Adobo Sarsa", tag: "New", color: "#3A2800", emoji: "🍶", heat: 1, region: "Nationwide",
    desc: "Slow-reduced adobo sauce — soy, vinegar, bay leaf, and black pepper. Poured warm over your chicken.",
    prepTime: "15 min", sauceYield: "400ml / 16 portions",
    ingredients: ["½ cup soy sauce","¼ cup native cane vinegar","8 cloves garlic, minced","4 bay leaves","1 tsp whole black peppercorns","½ cup water","1 tbsp cornstarch + 2 tbsp water (slurry)","1 tsp brown sugar"],
    steps: ["Combine soy, vinegar, water, garlic, bay, and peppercorns in pan.","Bring to boil 2 min, then reduce to low simmer 10 min.","Remove bay leaves. Add cornstarch slurry; stir to thicken.","Add sugar. Serve warm poured over chicken and rice."],
  },
  {
    id: 12, name: "Kaldereta Sarsa", tag: "New", color: "#8B2500", emoji: "🫕", heat: 2, region: "Luzon",
    desc: "Tomato-based kaldereta sauce with liver spread, olives, and bell pepper. Bold, hearty, Filipino fiesta.",
    prepTime: "20 min", sauceYield: "450ml / 18 portions",
    ingredients: ["½ cup tomato sauce","3 tbsp liver spread (canned)","1 red bell pepper, blended","8 pitted green olives, chopped","5 cloves garlic, minced","1 small onion, minced","½ tsp red chili flakes","¼ cup chicken stock","1 tbsp butter"],
    steps: ["Melt butter in pan; sauté garlic and onion until soft.","Add liver spread; stir vigorously 2 min until combined.","Add tomato sauce, blended bell pepper, and chicken stock.","Simmer 10 min. Add olives and chili flakes. Simmer 5 more min."],
  },
  {
    id: 13, name: "Gravy Klasiko", tag: "New", color: "#5C4A1E", emoji: "🥣", heat: 0, region: "Nationwide",
    desc: "Thick, golden chicken gravy made from rotisserie drippings. Poured generously over rice and chicken.",
    prepTime: "15 min", sauceYield: "500ml / 20 portions",
    ingredients: ["¼ cup rotisserie drippings (from the pan below spit)","2 tbsp unsalted butter","3 tbsp all-purpose flour","1½ cups chicken stock","3 cloves garlic, minced","Salt, black pepper, dried thyme to taste"],
    steps: ["Melt butter in saucepan over medium; sauté garlic 1 min.","Add flour; stir constantly 2 min to make a golden roux.","Slowly pour in chicken stock while whisking to prevent lumps.","Add drippings; season with salt, pepper, thyme. Simmer 8 min until glossy."],
  },
];

// ── Menu ──────────────────────────────────────────────────────
const menuItems = [
  { name: "Sarsa Box Solo", desc: "¼ spatchcock chicken · Java rice · 1 sarsa · atchara", price: 159, badge: "BESTSELLER", badgeColor: C.orange },
  { name: "Sarsa Box Duo", desc: "½ spatchcock chicken · Java rice · 2 sarsas · atchara", price: 289, badge: "POPULAR", badgeColor: C.red },
  { name: "Sarsa Box Fiesta", desc: "Whole spatchcock · 3 cups rice · 3 sarsas · atchara + drink", price: 499, badge: "SULIT", badgeColor: "#2D7A2D" },
  { name: "Sarsa Add-On", desc: "Any signature sauce in a 50ml dipping cup", price: 25, badge: null, badgeColor: "" },
  { name: "Java Rice Solo", desc: "Garlic java rice, side order", price: 35, badge: null, badgeColor: "" },
  { name: "Egg or Coleslaw", desc: "Sunny side up or creamy coleslaw add-on", price: 30, badge: null, badgeColor: "" },
];

// ── Operations steps ──────────────────────────────────────────
const opsSteps = [
  { time: "5:00 AM", task: "Marinate chickens overnight", icon: "🐔", detail: "Dry-rub with salt, pepper, lemongrass, calamansi. Spatchcock and flatten. Refrigerate." },
  { time: "9:00 AM", task: "Cart setup & prep", icon: "🛒", detail: "Set up stainless cart. Load rotisserie spit. Prep rice, sauces, packaging materials." },
  { time: "10:00 AM", task: "Fire up rotisserie", icon: "🔥", detail: "LPG burners on. Load chickens on spit. Cooking time: 45–60 min per batch. Baste every 15 min." },
  { time: "11:00 AM", task: "Open for service", icon: "🎉", detail: "First batch ready. Java rice cooking. All sauces portioned and labeled. Atchara prepped." },
  { time: "11–8 PM", task: "Rolling service", icon: "⚡", detail: "Continuous rotation: sell, replenish, cook next batch. Maintain 2-chicken buffer at all times." },
  { time: "8:00 PM", task: "Close & clean", icon: "🧹", detail: "Count inventory. Clean cart and spit. Record daily sales. Marinate next day's batch." },
];

// ── Equipment list ────────────────────────────────────────────
const equipment = [
  { item: "Custom stainless rotisserie cart", cost: 35000 },
  { item: "Electric rotisserie motor + spit rods (3)", cost: 12000 },
  { item: "LPG burner setup + hose + regulator", cost: 5000 },
  { item: "Initial chicken stock (50 heads)", cost: 12000 },
  { item: "Sauce ingredients (all 10 variants)", cost: 8000 },
  { item: "Packaging: boxes, cups, bags (500 sets)", cost: 6000 },
  { item: "Branding: tarpaulin, stickers, uniforms", cost: 5000 },
  { item: "Permits: barangay, business, sanitary", cost: 8000 },
  { item: "Working capital buffer", cost: 9000 },
];

// ── Marketing campaigns ───────────────────────────────────────
const campaigns = [
  {
    phase: "Phase 1 — Launch", timeline: "Week 1–2", color: C.red,
    activities: [
      "Teaser posts: 'Sarsa Republic is coming 🇵🇭🔥' — 7 days countdown on IG/FB",
      "Behind-the-scenes Reels: cart build, sauce prep, chicken marinade process",
      "Free taste day: first 30 customers get a Sarsa Box free. Film every reaction.",
      "Influencer invite: 3 local food content creators, free boxes, tag @sarsarepublika",
    ],
  },
  {
    phase: "Phase 2 — Growth", timeline: "Week 3–8", color: C.orange,
    activities: [
      "'Sarsa of the Week' feature — highlight one sauce every week with story post",
      "UGC campaign: 'Which sarsa are you?' personality quiz on Stories",
      "Loyalty stamp card: buy 5 boxes, get 1 free — post it on IG stories daily",
      "Collab with nearby businesses: rice supplier, drinks brand cross-promotion",
    ],
  },
  {
    phase: "Phase 3 — Scale", timeline: "Month 2+", color: "#2D7A2D",
    activities: [
      "GrabFood / FoodPanda listing — delivery ready Sarsa Boxes",
      "Catering packages: Sarsa Republic at your events (minimum 20 boxes)",
      "Second cart: target high-foot-traffic area (market, school, office district)",
      "Build a Sarsa Club loyalty group on Viber/Telegram — exclusive promos",
    ],
  },
];

// ── Menu prep guide ───────────────────────────────────────────
const prepSteps = [
  { step: "01", title: "Spatchcock the Chicken", icon: "🔪", detail: "Place chicken breast-side down. Using kitchen shears, cut along both sides of the backbone and remove it. Flip over, press firmly on the breastbone until it cracks flat. The bird should now be fully butterflied — uniform thickness for even cooking." },
  { step: "02", title: "Overnight Dry Marinade", icon: "🧂", detail: "Combine: 2 tbsp coarse salt, 1 tsp white pepper, 1 tsp garlic powder, 1 tsp smoked paprika, and 1 tsp annatto powder. Rub aggressively under and over the skin. Refrigerate uncovered 8–12 hours. Dry skin = crispier skin." },
  { step: "03", title: "Load onto Spit Rods", icon: "🔩", detail: "Thread 2 spit rods through each spatchcock chicken diagonally (shoulder to hip). Secure with spit forks. Space chickens 5–6cm apart on the rod. A standard commercial spit holds 6–8 spatchcock birds simultaneously." },
  { step: "04", title: "Rotisserie Cooking", icon: "🔥", detail: "LPG rotisserie at ~180–200°C. Cook 45–55 min. Baste with Inasal Klasiko sauce every 15 min using a brush. Internal temperature must reach 75°C at the thickest part of the thigh. Skin should be deep golden-orange and crispy." },
  { step: "05", title: "Rest and Portion", icon: "⏱️", detail: "Rest cooked chickens 5 min off the spit. Portion with cleaver: whole = 1 chicken, half = split down the breast, quarter = half split again into thigh+leg and breast+wing. A spatchcock quarters more evenly than a trussed chicken." },
  { step: "06", title: "Box Assembly", icon: "📦", detail: "Layer Java rice first (1 cup packed). Place portioned chicken on top, skin-side up. Add 30ml sauce in a small cup on the side. Finish with 2 tbsp atchara (pickled papaya) in the corner. Fold box lid. Stamp with date sticker. Done in under 45 seconds." },
];

// ── Java rice recipe ──────────────────────────────────────────
const javaRice = {
  ingredients: ["2 cups long-grain rice (cooked)","2 tbsp annatto oil (achuete)","4 cloves garlic, fried crispy","1 tbsp margarine or butter","½ tsp salt","½ tsp garlic powder"],
  steps: ["Fry garlic in oil until golden and crispy. Set aside.","In the same pan, add annatto oil, margarine, garlic powder, and salt.","Add cooked rice; stir-fry on high heat 3–4 min, breaking clumps.","Fold in fried garlic. Rice should be bright orange-yellow and fragrant."],
};

// ── Scale models ──────────────────────────────────────────────
const scaleModels = [
  {
    tier: 1, name: "Solo Cart Starter", emoji: "🛒", color: C.orange,
    investment: 100000, carts: 1, staff: 2,
    revenueRange: [85800, 171600], profitRange: [20000, 65000],
    timeline: "Launch in 30 days",
    description: "One cart, one location, two people. The classic entry point. You run it yourself as owner-operator, keep overheads ultra-low, and learn the business firsthand.",
    requirements: ["Custom stainless rotisserie cart","LPG burner + 2 gas tanks","Barangay + business + sanitary permits","50-head initial chicken stock","Sauce ingredients for all 13 variants","500 sets of packaging"],
    pros: ["Lowest risk, easiest to manage","Full control of operations","High learning curve (you master the product)"],
    cons: ["Revenue ceiling (~₱170K/mo max)","Owner-dependent — you can't take a day off"],
  },
  {
    tier: 2, name: "Double Cart Expansion", emoji: "🔁", color: "#2D9E2D",
    investment: 80000, carts: 2, staff: 4,
    revenueRange: [171600, 343200], profitRange: [55000, 130000],
    timeline: "Add 2nd cart at Month 3",
    description: "Deploy a second cart at a different high-traffic location. Hire a dedicated cook and cashier per cart. You shift from operator to manager. Revenue doubles; profit margin improves due to shared commissary production.",
    requirements: ["2nd cart (₱80K additional)","Commissary space for batch sauce production","Hired Pitmaster (Cook) for 2nd cart","GCash terminal and POS system","Delivery van or tricycle for daily supply runs"],
    pros: ["Revenue doubles immediately","Commissary reduces per-unit sauce cost by 20–30%","Begins building a brand presence in multiple locations"],
    cons: ["Requires reliable staff (harder to find)","Logistics coordination needed daily"],
  },
  {
    tier: 3, name: "Republika Fleet", emoji: "🏴", color: C.red,
    investment: 400000, carts: 5, staff: 13,
    revenueRange: [429000, 858000], profitRange: [150000, 340000],
    timeline: "Build over 6–12 months",
    description: "Five carts across a city, fed by a central commissary kitchen producing all 13 sauces in bulk. One operations manager coordinates logistics, quality control, and daily deployment. This is a real business.",
    requirements: ["5 carts across different barangays/areas","Central commissary kitchen (rented, ₱15–25K/mo)","1 Operations Manager (₱18–25K/mo)","Delivery van for daily sauce + supply runs","Brand standards manual + staff training system","POS system with inventory tracking"],
    pros: ["₱150K–340K monthly profit","Brand becomes a local institution","Exit options: sell, partner, or franchise"],
    cons: ["Complex logistics and quality control","High dependence on operations manager","Requires solid systems and training"],
  },
  {
    tier: 4, name: "Ghost Kitchen (Online)", emoji: "👻", color: "#6A0DAD",
    investment: 80000, carts: 0, staff: 3,
    revenueRange: [50000, 150000], profitRange: [15000, 50000],
    timeline: "Launch in 2 weeks (parallel track)",
    description: "No cart. No street presence. Rent a shared commercial kitchen space and sell exclusively through GrabFood and FoodPanda. Lower startup cost, weather-independent, and reaches a completely different customer segment.",
    requirements: ["Shared commercial kitchen rental (₱8–15K/mo)","GrabFood + FoodPanda merchant registration","Food delivery packaging (spill-proof boxes)","1 dedicated cook + 1 packager","Grab/FoodPanda advertising budget (₱3–5K/mo)"],
    pros: ["Weather-independent revenue","No physical presence needed","Data-driven — Grab shows you exactly what sells"],
    cons: ["30% platform commission cuts margin","No brand street visibility","Dependent on platform algorithm"],
  },
  {
    tier: 5, name: "Franchise Model", emoji: "🏆", color: C.gold,
    investment: 0, carts: 0, staff: 0,
    revenueRange: [150000, 600000], profitRange: [75000, 300000],
    timeline: "Sellable after Month 12",
    description: "Sell Sarsa Republika franchise packages to entrepreneurs for ₱150,000 per unit. They get the cart, brand rights, training, and sauce supply. You earn an upfront franchise fee plus 5% monthly royalty on every franchisee's revenue. 10 franchisees = ₱75K+/month passive.",
    requirements: ["Registered trademark (IPOPHL)","Full Operations Manual (recipe + procedures)","Training program (1-week in-person)","Central sauce production + distribution","Franchise agreement (lawyer-drafted)"],
    pros: ["Scales without your capital","Recurring royalty income (passive)","Each franchisee does their own marketing"],
    cons: ["Needs proven track record (12+ months)","Brand reputation is in franchisees hands","Legal and trademark setup required first"],
  },
];

// ── Marketing budget & strategy ───────────────────────────────
const marketingBudget = [
  { line: "Facebook & Instagram Ads", monthly: 3000, note: "Boosted posts + lead-gen campaigns, ₱100/day", phase: "Month 1+" },
  { line: "Influencer / Food Creator Collabs", monthly: 2500, note: "Nano (1K–10K followers): free boxes + ₱500 fee", phase: "Month 1+" },
  { line: "GrabFood / FoodPanda Ads", monthly: 2000, note: "In-app promoted listing + banner ads", phase: "Month 2+" },
  { line: "Printed Materials (tarpaulin, stickers)", monthly: 1000, note: "Monthly refresh of cart tarpaulin + bag prints", phase: "Month 1+" },
  { line: "Promo Costs (giveaways, free tastings)", monthly: 1500, note: "~10 free Sarsa Boxes/week for sampling & UGC", phase: "Month 1–2" },
  { line: "SMS/Viber Blast (loyalty list)", monthly: 500, note: "Weekly promo SMS to repeat customer list", phase: "Month 2+" },
];

const contentCalendar = [
  { day: "Monday", content: "🎬 Reel — sauce pour slow-mo over chicken", platform: "IG + FB", type: "Video", goal: "Reach" },
  { day: "Tuesday", content: "📖 Carousel — Sauce of the Week story + recipe hint", platform: "IG", type: "Carousel", goal: "Save & Share" },
  { day: "Wednesday", content: "📍 Location story update + today's special", platform: "FB Stories", type: "Story", goal: "Foot traffic" },
  { day: "Thursday", content: "👥 Customer reaction video (UGC repost)", platform: "IG + FB", type: "Video", goal: "Trust" },
  { day: "Friday", content: "🏆 Weekend deal post: buy Fiesta Box, get free sauce", platform: "FB", type: "Photo + Text", goal: "Sales" },
  { day: "Saturday", content: "📊 Poll: 'Which sarsa are you this weekend?'", platform: "IG Stories", type: "Poll", goal: "Engagement" },
  { day: "Sunday", content: "🎉 Behind the scenes: prep for the week ahead", platform: "IG Reels", type: "Video", goal: "Brand story" },
];

const influencerTiers = [
  { tier: "Nano", followers: "1K–10K", cost: "Free box + ₱300–500", reach: "300–2,000/post", conversion: "High — tight community", action: "Give free Sarsa Box, ask for honest review Reel" },
  { tier: "Micro", followers: "10K–100K", cost: "₱1,500–5,000 per post", reach: "5,000–30,000/post", conversion: "Medium — good for brand awareness", action: "Paid collab + link in bio + stories mention" },
  { tier: "Macro", followers: "100K+", cost: "₱10,000–50,000", reach: "50,000+/post", conversion: "Low direct conversion, high brand lift", action: "Only if budget allows — focus on local food pages" },
];

// ── Tabs ──────────────────────────────────────────────────────
type Tab = "brand" | "menu" | "marketing" | "operations" | "scale" | "financials";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "brand",      label: "Brand",        icon: <Star size={14} /> },
  { id: "menu",       label: "Menu & Sauces", icon: <Flame size={14} /> },
  { id: "marketing",  label: "Marketing",    icon: <Megaphone size={14} /> },
  { id: "operations", label: "Operations",   icon: <Settings size={14} /> },
  { id: "scale",      label: "Scale Models", icon: <Layers size={14} /> },
  { id: "financials", label: "Financials",   icon: <TrendingUp size={14} /> },
];

// ── Cart Visual SVG ───────────────────────────────────────────
function CartVisual() {
  return (
    <div className="relative w-full max-w-xl mx-auto select-none">
      <svg viewBox="0 0 580 680" className="w-full" style={{ filter: "drop-shadow(0 8px 40px rgba(232,114,28,0.25))" }}>
        {/* ── DIMENSION ARROWS ── */}
        {/* Width arrow bottom */}
        <line x1="90" y1="618" x2="490" y2="618" stroke="#FFB800" strokeWidth="1.5" strokeDasharray="none"/>
        <polygon points="90,614 90,622 78,618" fill="#FFB800"/>
        <polygon points="490,614 490,622 502,618" fill="#FFB800"/>
        <text x="290" y="636" textAnchor="middle" fill="#FFB800" fontSize="13" fontWeight="bold">150 cm</text>
        {/* Height arrow left */}
        <line x1="52" y1="58" x2="52" y2="572" stroke="#FFB800" strokeWidth="1.5"/>
        <polygon points="48,58 56,58 52,46" fill="#FFB800"/>
        <polygon points="48,572 56,572 52,584" fill="#FFB800"/>
        <text x="30" y="318" textAnchor="middle" fill="#FFB800" fontSize="13" fontWeight="bold" transform="rotate(-90,30,318)">210 cm</text>

        {/* ── CART SHADOW ── */}
        <rect x="95" y="72" width="400" height="510" rx="10" fill="rgba(0,0,0,0.4)"/>

        {/* ── TOP SIGNAGE SECTION (40cm) ── */}
        <defs>
          <linearGradient id="signageGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9B0000"/>
            <stop offset="100%" stopColor="#C41E3A"/>
          </linearGradient>
          <linearGradient id="steelGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#CBD5DC"/>
            <stop offset="50%" stopColor="#A8B8C2"/>
            <stop offset="100%" stopColor="#8898A8"/>
          </linearGradient>
          <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0A2535"/>
            <stop offset="100%" stopColor="#0D3040"/>
          </linearGradient>
          <radialGradient id="fireGlow" cx="50%" cy="100%" r="60%">
            <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#FF6B00" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect x="90" y="58" width="400" height="100" rx="10" fill="url(#signageGrad)" stroke="#7A0000" strokeWidth="1.5"/>
        {/* LED strip accent */}
        <rect x="90" y="148" width="400" height="5" fill="#FFB800" opacity="0.8"/>
        {/* Brand text */}
        <text x="290" y="96" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="Arial Black, Arial" letterSpacing="3">SARSA REPUBLIKA</text>
        <text x="290" y="118" textAnchor="middle" fill="#FFD060" fontSize="12" fontFamily="Arial" letterSpacing="4">SARSA NG PILIPINO</text>
        {/* Decorative dots */}
        <circle cx="118" cy="108" r="5" fill="#FFB800" opacity="0.7"/>
        <circle cx="462" cy="108" r="5" fill="#FFB800" opacity="0.7"/>
        <text x="290" y="140" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" letterSpacing="2">✦ 13 FILIPINO SAUCES · SPATCHCOCK ROTISSERIE ✦</text>

        {/* ── ROTISSERIE GLASS (70cm) ── */}
        <rect x="90" y="153" width="400" height="175" fill="url(#steelGrad)" stroke="#7890A0" strokeWidth="1"/>
        {/* Glass window */}
        <rect x="104" y="162" width="320" height="155" rx="4" fill="url(#glassGrad)" stroke="#2A5570" strokeWidth="2"/>
        {/* Glass reflection */}
        <rect x="106" y="164" width="60" height="151" rx="3" fill="rgba(255,255,255,0.04)"/>
        {/* Fire glow at bottom */}
        <rect x="104" y="267" width="320" height="50" rx="4" fill="url(#fireGlow)"/>
        {/* Spit rods */}
        <line x1="104" y1="210" x2="424" y2="210" stroke="#B8C8D4" strokeWidth="3" strokeLinecap="round"/>
        <line x1="104" y1="248" x2="424" y2="248" stroke="#B8C8D4" strokeWidth="3" strokeLinecap="round"/>
        {/* Chickens on top spit */}
        <ellipse cx="148" cy="210" rx="18" ry="22" fill="#D4820A" stroke="#A05000" strokeWidth="1"/>
        <ellipse cx="196" cy="210" rx="18" ry="22" fill="#C87010" stroke="#A05000" strokeWidth="1"/>
        <ellipse cx="244" cy="210" rx="18" ry="22" fill="#D4820A" stroke="#A05000" strokeWidth="1"/>
        <ellipse cx="292" cy="210" rx="18" ry="22" fill="#C87010" stroke="#A05000" strokeWidth="1"/>
        <ellipse cx="340" cy="210" rx="18" ry="22" fill="#D4820A" stroke="#A05000" strokeWidth="1"/>
        <ellipse cx="388" cy="210" rx="18" ry="22" fill="#C87010" stroke="#A05000" strokeWidth="1"/>
        {/* Chickens on bottom spit */}
        <ellipse cx="163" cy="248" rx="18" ry="22" fill="#CC7010" stroke="#A05000" strokeWidth="1"/>
        <ellipse cx="211" cy="248" rx="18" ry="22" fill="#D4820A" stroke="#A05000" strokeWidth="1"/>
        <ellipse cx="259" cy="248" rx="18" ry="22" fill="#CC7010" stroke="#A05000" strokeWidth="1"/>
        <ellipse cx="307" cy="248" rx="18" ry="22" fill="#D4820A" stroke="#A05000" strokeWidth="1"/>
        <ellipse cx="355" cy="248" rx="18" ry="22" fill="#CC7010" stroke="#A05000" strokeWidth="1"/>
        <ellipse cx="403" cy="248" rx="18" ry="22" fill="#D4820A" stroke="#A05000" strokeWidth="1"/>
        {/* Flame icons at bottom */}
        <text x="155" y="308" textAnchor="middle" fontSize="10">🔥</text>
        <text x="215" y="308" textAnchor="middle" fontSize="10">🔥</text>
        <text x="275" y="308" textAnchor="middle" fontSize="10">🔥</text>
        <text x="335" y="308" textAnchor="middle" fontSize="10">🔥</text>
        <text x="395" y="308" textAnchor="middle" fontSize="10">🔥</text>
        {/* Rotisserie label */}
        <rect x="430" y="165" width="52" height="148" rx="4" fill="#0D2535" stroke="#2A5570" strokeWidth="1"/>
        <text x="456" y="245" textAnchor="middle" fill="#7AADCC" fontSize="9" fontWeight="bold" transform="rotate(90,456,245)">ROTISSERIE · 6–8 BIRDS</text>

        {/* ── COUNTER TOP (8cm) ── */}
        <rect x="90" y="328" width="400" height="18" fill="#D8E4EC" stroke="#9AAAB8" strokeWidth="1"/>
        <rect x="90" y="332" width="400" height="4" fill="rgba(255,255,255,0.4)"/>

        {/* ── SERVICE AREA (38cm) ── */}
        <rect x="90" y="346" width="400" height="94" fill="url(#steelGrad)" stroke="#7890A0" strokeWidth="1"/>
        {/* Dividers */}
        <line x1="228" y1="346" x2="228" y2="440" stroke="#7890A0" strokeWidth="1"/>
        <line x1="366" y1="346" x2="366" y2="440" stroke="#7890A0" strokeWidth="1"/>
        {/* Section 1: Order Here */}
        <rect x="96" y="354" width="126" height="78" rx="3" fill="#0A2030" stroke="#2A5060" strokeWidth="1"/>
        <text x="159" y="382" textAnchor="middle" fill="#FFB800" fontSize="9" fontWeight="bold">ORDER HERE</text>
        <text x="159" y="396" textAnchor="middle" fill="white" fontSize="8">Solo Box ₱159</text>
        <text x="159" y="408" textAnchor="middle" fill="white" fontSize="8">Duo Box  ₱289</text>
        <text x="159" y="420" textAnchor="middle" fill="white" fontSize="8">Fiesta Box ₱499</text>
        {/* Section 2: Sauce tray */}
        <text x="297" y="368" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8" fontWeight="bold">SAUCE DISPLAY</text>
        {[0,1,2,3,4,5].map(i => (
          <circle key={i} cx={240 + i * 21} cy="400" r="9" fill={["#E8721C","#CC2200","#5A3200","#4A7A2E","#2D5016","#FFB800"][i]} stroke="#1A1A1A" strokeWidth="1"/>
        ))}
        {/* Section 3: GCash */}
        <rect x="372" y="354" width="112" height="78" rx="3" fill="#0A2030" stroke="#1177AA" strokeWidth="1.5"/>
        <text x="428" y="378" textAnchor="middle" fill="#00AAFF" fontSize="9" fontWeight="bold">GCash / Cash</text>
        <rect x="394" y="385" width="68" height="40" rx="2" fill="#EEEEEE"/>
        <text x="428" y="410" textAnchor="middle" fill="#333" fontSize="8">QR CODE</text>

        {/* ── STORAGE CABINET (58cm) ── */}
        <rect x="90" y="440" width="400" height="132" rx="0" fill="url(#steelGrad)" stroke="#7890A0" strokeWidth="1"/>
        {/* Cabinet door left */}
        <rect x="100" y="450" width="185" height="112" rx="5" fill="#98AABB" stroke="#6A8898" strokeWidth="1.5"/>
        <rect x="100" y="450" width="185" height="112" rx="5" fill="rgba(255,255,255,0.06)"/>
        {/* Door handle left */}
        <rect x="172" y="498" width="40" height="8" rx="4" fill="#5A7080" stroke="#3A5060" strokeWidth="1"/>
        {/* Cabinet door right */}
        <rect x="295" y="450" width="185" height="112" rx="5" fill="#98AABB" stroke="#6A8898" strokeWidth="1.5"/>
        <rect x="295" y="450" width="185" height="112" rx="5" fill="rgba(255,255,255,0.06)"/>
        {/* Door handle right */}
        <rect x="367" y="498" width="40" height="8" rx="4" fill="#5A7080" stroke="#3A5060" strokeWidth="1"/>
        {/* Labels inside doors */}
        <text x="192" y="490" textAnchor="middle" fill="rgba(0,0,0,0.3)" fontSize="8">INGREDIENTS</text>
        <text x="192" y="502" textAnchor="middle" fill="rgba(0,0,0,0.3)" fontSize="8">& SAUCES</text>
        <text x="387" y="490" textAnchor="middle" fill="rgba(0,0,0,0.3)" fontSize="8">PACKAGING</text>
        <text x="387" y="502" textAnchor="middle" fill="rgba(0,0,0,0.3)" fontSize="8">& TOOLS</text>
        {/* Bottom edge */}
        <rect x="90" y="568" width="400" height="8" rx="0" fill="#6A7A88" stroke="#4A5A68" strokeWidth="1"/>

        {/* ── WHEELS ── */}
        <circle cx="148" cy="580" r="24" fill="#1E2830" stroke="#4A5868" strokeWidth="3"/>
        <circle cx="148" cy="580" r="10" fill="#3A4858" stroke="#5A6878" strokeWidth="1.5"/>
        <circle cx="432" cy="580" r="24" fill="#1E2830" stroke="#4A5868" strokeWidth="3"/>
        <circle cx="432" cy="580" r="10" fill="#3A4858" stroke="#5A6878" strokeWidth="1.5"/>

        {/* ── SECTION LABELS (right side) ── */}
        <line x1="494" y1="108" x2="520" y2="108" stroke="#3D1A00" strokeWidth="1" strokeDasharray="3,2"/>
        <text x="522" y="112" fill="rgba(255,245,232,0.45)" fontSize="9">Signage</text>
        <line x1="494" y1="240" x2="520" y2="240" stroke="#3D1A00" strokeWidth="1" strokeDasharray="3,2"/>
        <text x="522" y="244" fill="rgba(255,245,232,0.45)" fontSize="9">Rotisserie</text>
        <line x1="494" y1="336" x2="520" y2="336" stroke="#3D1A00" strokeWidth="1" strokeDasharray="3,2"/>
        <text x="522" y="340" fill="rgba(255,245,232,0.45)" fontSize="9">Counter</text>
        <line x1="494" y1="392" x2="520" y2="392" stroke="#3D1A00" strokeWidth="1" strokeDasharray="3,2"/>
        <text x="522" y="396" fill="rgba(255,245,232,0.45)" fontSize="9">Service</text>
        <line x1="494" y1="504" x2="520" y2="504" stroke="#3D1A00" strokeWidth="1" strokeDasharray="3,2"/>
        <text x="522" y="508" fill="rgba(255,245,232,0.45)" fontSize="9">Storage</text>
      </svg>

      {/* Parking space note */}
      <p className="text-center text-xs mt-3" style={{ color: "rgba(255,245,232,0.3)" }}>
        Footprint: 150cm × 65cm — fits within one standard parking space (250cm × 500cm)
      </p>
    </div>
  );
}

// ── Heat indicator ────────────────────────────────────────────
function HeatDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className="w-2 h-2 rounded-full"
          style={{ background: n <= level ? "#CC2200" : "rgba(255,245,232,0.15)" }}
        />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function SarsaRepublikaPage() {
  const [tab, setTab] = useState<Tab>("brand");
  const [openSauce, setOpenSauce] = useState<number | null>(null);
  const [boxesPerDay, setBoxesPerDay] = useState(60);

  // Financial calculations
  const avgPrice = 165;
  const daysPerMonth = 26;
  const cogsPct = 0.34;
  const labor = 18000;
  const fixedMonthly = 12000; // rent, LPG, packaging, misc

  const financials = useMemo(() => {
    const dailyRevenue = boxesPerDay * avgPrice;
    const monthlyRevenue = dailyRevenue * daysPerMonth;
    const cogs = monthlyRevenue * cogsPct;
    const totalCosts = cogs + labor + fixedMonthly;
    const netProfit = monthlyRevenue - totalCosts;
    const totalStartup = equipment.reduce((s, e) => s + e.cost, 0);
    const paybackMonths = totalStartup / Math.max(netProfit, 1);
    return { dailyRevenue, monthlyRevenue, cogs, totalCosts, netProfit, totalStartup, paybackMonths };
  }, [boxesPerDay]);

  const fade = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
  };

  return (
    <div style={{ background: C.dark, color: C.text, minHeight: "100vh", fontFamily: "inherit" }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${C.redDark}55 0%, ${C.dark} 70%)` }}
      >
        {/* Decorative ring */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/5" />
        </div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border"
          style={{ borderColor: `${C.orange}55`, background: `${C.orange}15`, color: C.orange }}
        >
          <Flame size={12} /> Business Concept · Developed by BVN
        </motion.div>

        {/* Logo */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <Image
            src="/sarsa-republika-logo.png"
            alt="Sarsa Republika Logo"
            width={340}
            height={340}
            className="mx-auto drop-shadow-2xl"
            priority
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="mt-6 text-lg md:text-xl max-w-xl"
          style={{ color: C.muted }}
        >
          Filipino spatchcock rotisserie chicken · 13 signature sauces · served in a box, street-food style
        </motion.p>

        {/* Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-8"
        >
          {[
            { icon: "🔥", text: "Spatchcock Rotisserie" },
            { icon: "🫙", text: "13 Filipino Sauces" },
            { icon: "📦", text: "Rice Box Concept" },
            { icon: "🛒", text: "Stainless Street Cart" },
          ].map((p) => (
            <div
              key={p.text}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{ background: `${C.card}`, border: `1px solid ${C.border}`, color: C.text }}
            >
              <span>{p.icon}</span> {p.text}
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── STICKY TABS ───────────────────────────────────── */}
      <div className="sticky top-0 z-40" style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2 scrollbar-hide">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all"
                style={{
                  background: tab === t.id ? C.red : "transparent",
                  color: tab === t.id ? "#fff" : C.muted,
                  border: `1px solid ${tab === t.id ? C.red : "transparent"}`,
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── TAB CONTENT ───────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">

          {/* ── BRAND TAB ─────────────────────────────────── */}
          {tab === "brand" && (
            <motion.div key="brand" {...fade}>

              {/* Brand Story */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.orange }}>The Concept</p>
                  <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-heading">One Chicken.<br />A Republic of Sauces.</h2>
                  <p className="text-base leading-relaxed mb-4" style={{ color: C.muted }}>
                    Sarsa Republika takes everything Filipinos love about lechon manok — the golden skin, the smoky rotisserie smell, the community gathering around a cart — and upgrades it.
                  </p>
                  <p style={{ color: C.muted }} className="text-base leading-relaxed mb-4">
                    Spatchcock (butterfly) cut means faster, more even cooking and crispier skin all around. A premium stainless cart signals quality before the customer even tastes anything. And 13 rotating Filipino sauces make every visit different.
                  </p>
                  <p style={{ color: C.muted }} className="text-base leading-relaxed">
                    The packaging is the game-changer: a Peri Peri-style rice box, branded, clean, Instagrammable. You&apos;re not just buying chicken — you&apos;re buying an experience.
                  </p>
                </div>

                {/* Brand identity cards */}
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Brand Name", value: "Sarsa Republika", note: '"Sarsa" = sauce · "Republika" = republic' },
                    { label: "Tagline", value: "Sarsa ng Pilipino", note: "The sauce of the Filipino" },
                    { label: "Sub-tagline", value: "One chicken. Unlimited sarsa.", note: "Highlighting the sauce variety USP" },
                    { label: "Tone of Voice", value: "Bold · Proud · Makulay", note: "Filipino pride meets modern street food" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                      <p className="text-xs uppercase tracking-wider mb-1" style={{ color: C.dim }}>{item.label}</p>
                      <p className="text-lg font-bold" style={{ color: C.text }}>{item.value}</p>
                      <p className="text-xs mt-1" style={{ color: C.muted }}>{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="mb-12">
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: C.orange }}>Brand Palette</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { name: "Republika Red", hex: "#C41E3A", role: "Primary" },
                    { name: "Rotisserie Orange", hex: "#E8721C", role: "Secondary" },
                    { name: "Gold Sarsa", hex: "#FFB800", role: "Accent" },
                    { name: "Burnt Dark", hex: "#231000", role: "Background" },
                  ].map((col) => (
                    <div key={col.name} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                      <div className="h-20" style={{ background: col.hex }} />
                      <div className="p-3" style={{ background: C.card }}>
                        <p className="font-bold text-sm">{col.name}</p>
                        <p className="text-xs" style={{ color: C.muted }}>{col.hex}</p>
                        <p className="text-xs" style={{ color: C.dim }}>{col.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* USPs */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: C.orange }}>Why Sarsa Republika Wins</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { icon: "🐔", title: "Spatchcock Method", desc: "Butterfly cut = 40% faster cooking, crispier skin on all sides, more even heat distribution." },
                    { icon: "🫙", title: "13 Filipino Sauces", desc: "No other cart offers this. Each sauce is a different region, a different story. Repeat customers guaranteed." },
                    { icon: "📦", title: "The Sarsa Box", desc: "Rice box presentation = premium perception, higher price tolerance, Instagrammable, delivery-ready." },
                    { icon: "🛒", title: "Premium Stainless Cart", desc: "Signals cleanliness, quality, and legitimacy before the customer even tastes anything." },
                    { icon: "🏳️", title: "Filipino Pride Branding", desc: "Every sauce tells a regional story. Customers feel connected to their heritage with every bite." },
                    { icon: "🚀", title: "Scalable Model", desc: "Single cart → multiple carts → GrabFood → catering → franchise. The path to scale is clear." },
                  ].map((u) => (
                    <div
                      key={u.title}
                      className="rounded-xl p-5 flex flex-col gap-3"
                      style={{ background: C.card, border: `1px solid ${C.border}` }}
                    >
                      <div className="text-3xl">{u.icon}</div>
                      <div>
                        <p className="font-bold text-sm mb-1">{u.title}</p>
                        <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{u.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── MENU & SAUCES TAB ─────────────────────────── */}
          {tab === "menu" && (
            <motion.div key="menu" {...fade}>

              {/* Menu */}
              <div className="mb-14">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.orange }}>The Menu</p>
                <h2 className="text-3xl font-extrabold font-heading mb-6">What We Sell</h2>
                <div className="overflow-hidden rounded-2xl" style={{ border: `1px solid ${C.border}` }}>
                  <div className="hidden md:grid grid-cols-12 px-5 py-3 text-xs font-bold uppercase tracking-widest" style={{ background: C.card, color: C.muted, borderBottom: `1px solid ${C.border}` }}>
                    <span className="col-span-5">Item</span>
                    <span className="col-span-5">Description</span>
                    <span className="col-span-2 text-right">Price</span>
                  </div>
                  {menuItems.map((item, i) => (
                    <div
                      key={item.name}
                      className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-0 px-5 py-4 items-center"
                      style={{
                        background: i % 2 === 0 ? C.surface : C.card,
                        borderBottom: i < menuItems.length - 1 ? `1px solid ${C.border}` : "none",
                      }}
                    >
                      <div className="md:col-span-5 flex items-center gap-3">
                        <span className="font-bold text-sm">{item.name}</span>
                        {item.badge && (
                          <span
                            className="text-[10px] font-black px-2 py-0.5 rounded-full text-white uppercase tracking-wider"
                            style={{ background: item.badgeColor }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="md:col-span-5 text-xs" style={{ color: C.muted }}>{item.desc}</div>
                      <div className="md:col-span-2 text-right font-heading font-extrabold text-lg" style={{ color: C.gold }}>
                        ₱{item.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sauces */}
              <div className="mb-14">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.orange }}>The Sauces</p>
                <h2 className="text-3xl font-extrabold font-heading mb-2">13 Regions. 13 Sarsas.</h2>
                <p className="mb-6 text-sm" style={{ color: C.muted }}>Click any sauce for full ingredients and preparation steps. Each sauce batch yields ~250–500ml (10–20 portions).</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sauces.map((sauce) => {
                    const isOpen = openSauce === sauce.id;
                    return (
                      <motion.div
                        key={sauce.id}
                        layout
                        onClick={() => setOpenSauce(isOpen ? null : sauce.id)}
                        className="rounded-xl p-5 cursor-pointer transition-all"
                        style={{
                          background: isOpen ? C.cardHover : C.card,
                          border: `1px solid ${isOpen ? sauce.color : C.border}`,
                        }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${sauce.color}25` }}>
                              {sauce.emoji}
                            </div>
                            <div>
                              <p className="font-bold text-sm">{sauce.name}</p>
                              <p className="text-xs mt-0.5" style={{ color: sauce.color }}>{sauce.tag}</p>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {isOpen ? <ChevronUp size={16} style={{ color: C.muted }} /> : <ChevronDown size={16} style={{ color: C.muted }} />}
                          </div>
                        </div>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-4 border-t mt-4" style={{ borderColor: C.border }}>
                                <p className="text-xs leading-relaxed mb-4" style={{ color: C.muted }}>{sauce.desc}</p>

                                {/* Stats row */}
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs" style={{ color: C.dim }}>Heat:</span>
                                    <HeatDots level={sauce.heat} />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin size={11} style={{ color: C.dim }} />
                                    <span className="text-xs" style={{ color: C.muted }}>{sauce.region}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock size={11} style={{ color: C.dim }} />
                                    <span className="text-xs" style={{ color: C.muted }}>{sauce.prepTime}</span>
                                  </div>
                                </div>

                                {/* Yield badge */}
                                <p className="text-xs px-2 py-1 rounded mb-3 inline-block" style={{ background: `${sauce.color}20`, color: sauce.color }}>
                                  Yield: {sauce.sauceYield}
                                </p>

                                {/* Ingredients */}
                                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: C.orange }}>Ingredients</p>
                                <ul className="flex flex-col gap-1 mb-4">
                                  {sauce.ingredients.map((ing, i) => (
                                    <li key={i} className="flex gap-2 text-xs" style={{ color: C.muted }}>
                                      <span style={{ color: sauce.color }}>·</span> {ing}
                                    </li>
                                  ))}
                                </ul>

                                {/* Steps */}
                                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: C.orange }}>How to Make</p>
                                <ol className="flex flex-col gap-2">
                                  {sauce.steps.map((step, i) => (
                                    <li key={i} className="flex gap-2 text-xs" style={{ color: C.muted }}>
                                      <span className="font-bold flex-shrink-0" style={{ color: sauce.color }}>{i + 1}.</span>
                                      {step}
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Prep Guide */}
              <div className="mb-14">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.orange }}>Preparation Guide</p>
                <h2 className="text-3xl font-extrabold font-heading mb-6">From Raw Chicken to Sarsa Box</h2>
                <div className="relative flex flex-col gap-4">
                  <div className="absolute left-[22px] top-0 bottom-0 w-0.5" style={{ background: C.border }} />
                  {prepSteps.map((s) => (
                    <div key={s.step} className="flex gap-5 relative">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center text-lg flex-shrink-0 z-10 font-bold text-sm"
                        style={{ background: C.card, border: `2px solid ${C.orange}`, color: C.orange }}>
                        {s.step}
                      </div>
                      <div className="flex-1 rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg">{s.icon}</span>
                          <span className="font-bold text-sm">{s.title}</span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{s.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Java Rice */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.orange }}>Java Rice Recipe</p>
                <h2 className="text-3xl font-extrabold font-heading mb-6">The Signature Side</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: C.orange }}>Ingredients</p>
                    <ul className="flex flex-col gap-2">
                      {javaRice.ingredients.map((ing, i) => (
                        <li key={i} className="flex gap-2 text-sm" style={{ color: C.muted }}>
                          <span style={{ color: C.orange }}>·</span> {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: C.orange }}>Steps</p>
                    <ol className="flex flex-col gap-3">
                      {javaRice.steps.map((step, i) => (
                        <li key={i} className="flex gap-2 text-sm" style={{ color: C.muted }}>
                          <span className="font-bold flex-shrink-0" style={{ color: C.gold }}>{i + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── MARKETING TAB ─────────────────────────────── */}
          {tab === "marketing" && (
            <motion.div key="marketing" {...fade}>

              {/* Target market */}
              <div className="mb-12">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.orange }}>Target Market</p>
                <h2 className="text-3xl font-extrabold font-heading mb-6">Who Buys From Us</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { emoji: "👨‍💼", name: "The Daily Commuter", age: "25–40", desc: "Wants a fast, filling, affordable lunch near work or transit hubs. Values convenience and taste.", spend: "₱150–200/visit", freq: "3–4×/week" },
                    { emoji: "👨‍👩‍👧", name: "The Family", age: "30–50", desc: "Looking for a satisfying dinner takeaway. Loves the Fiesta Box for the family. Values the rice + sauce combo.", spend: "₱400–600/visit", freq: "1–2×/week" },
                    { emoji: "📱", name: "The Foodie", age: "18–30", desc: "Follows food content online. Will try for the sauces, share on IG, come back for more. Your biggest marketer.", spend: "₱180–280/visit", freq: "2–3×/week" },
                  ].map((p) => (
                    <div key={p.name} className="rounded-xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                      <div className="text-4xl mb-3">{p.emoji}</div>
                      <p className="font-bold text-base mb-1">{p.name}</p>
                      <p className="text-xs mb-3" style={{ color: C.orange }}>Age {p.age}</p>
                      <p className="text-xs leading-relaxed mb-4" style={{ color: C.muted }}>{p.desc}</p>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs">
                          <span style={{ color: C.dim }}>Avg. spend</span>
                          <span className="font-semibold">{p.spend}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span style={{ color: C.dim }}>Frequency</span>
                          <span className="font-semibold">{p.freq}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social media */}
              <div className="mb-12">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.orange }}>Social Media Strategy</p>
                <h2 className="text-3xl font-extrabold font-heading mb-6">Content That Sells</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#E1306C25" }}>
                        <Instagram size={18} style={{ color: "#E1306C" }} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Instagram @sarsarepublika</p>
                        <p className="text-xs" style={{ color: C.muted }}>Primary visual channel</p>
                      </div>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {[
                        "Daily: Box reveal Reel (slow pour of sauce onto chicken) — 3–5s hook",
                        "Weekly: 'Sarsa of the Week' carousel — sauce origin story + how to pair",
                        "Biweekly: Customer reaction video — authentic, unscripted",
                        "Stories: Daily polls ('Inasal or Adobo Negra today?'), countdown to new sauce",
                      ].map((item) => (
                        <li key={item} className="flex gap-2 text-xs" style={{ color: C.muted }}>
                          <CheckCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: C.orange }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#1877F225" }}>
                        <Facebook size={18} style={{ color: "#1877F2" }} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Facebook Page: Sarsa Republika</p>
                        <p className="text-xs" style={{ color: C.muted }}>Community & local reach</p>
                      </div>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {[
                        "Post daily location update: 'We're at [area] today!' with map pin",
                        "Weekly: Sauce pairing guide — text post with photo, high shareability",
                        "Run a ₱500 Sarsa Box giveaway — comment to join, must tag 2 friends",
                        "Join local food Facebook groups and post weekly (with admin permission)",
                      ].map((item) => (
                        <li key={item} className="flex gap-2 text-xs" style={{ color: C.muted }}>
                          <CheckCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: C.orange }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Campaign phases */}
              <div className="mb-12">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.orange }}>Launch Roadmap</p>
                <h2 className="text-3xl font-extrabold font-heading mb-6">90-Day Campaign Plan</h2>
                <div className="flex flex-col gap-5">
                  {campaigns.map((c) => (
                    <div key={c.phase} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${c.color}55` }}>
                      <div className="px-5 py-3 flex items-center justify-between" style={{ background: `${c.color}20`, borderBottom: `1px solid ${c.color}30` }}>
                        <div>
                          <p className="font-bold text-sm">{c.phase}</p>
                          <p className="text-xs mt-0.5" style={{ color: C.muted }}>{c.timeline}</p>
                        </div>
                        <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                      </div>
                      <div className="px-5 py-4" style={{ background: C.card }}>
                        <ul className="flex flex-col gap-2.5">
                          {c.activities.map((a) => (
                            <li key={a} className="flex gap-2 text-xs" style={{ color: C.muted }}>
                              <Zap size={12} className="flex-shrink-0 mt-0.5" style={{ color: c.color }} />
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Calendar */}
              <div className="mb-12">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.orange }}>Weekly Content Calendar</p>
                <h2 className="text-3xl font-extrabold font-heading mb-6">7-Day Posting Schedule</h2>
                <div className="overflow-x-auto rounded-2xl" style={{ border: `1px solid ${C.border}` }}>
                  <table className="w-full min-w-[560px]">
                    <thead>
                      <tr style={{ background: C.card }}>
                        {["Day","Content","Platform","Type","Goal"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: C.muted }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {contentCalendar.map((row, i) => (
                        <tr key={row.day} style={{ background: i % 2 === 0 ? C.surface : C.card, borderTop: `1px solid ${C.border}` }}>
                          <td className="px-4 py-3 font-semibold text-sm" style={{ color: C.orange }}>{row.day}</td>
                          <td className="px-4 py-3 text-xs" style={{ color: C.muted }}>{row.content}</td>
                          <td className="px-4 py-3 text-xs">{row.platform}</td>
                          <td className="px-4 py-3 text-xs">
                            <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: `${C.orange}20`, color: C.orange }}>{row.type}</span>
                          </td>
                          <td className="px-4 py-3 text-xs" style={{ color: C.dim }}>{row.goal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Marketing Budget */}
              <div className="mb-12">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.orange }}>Marketing Budget</p>
                <h2 className="text-3xl font-extrabold font-heading mb-6">Monthly Spend Breakdown</h2>
                <div className="overflow-hidden rounded-2xl" style={{ border: `1px solid ${C.border}` }}>
                  {marketingBudget.map((row, i) => (
                    <div key={row.line} className="flex items-center justify-between px-5 py-4"
                      style={{ background: i % 2 === 0 ? C.surface : C.card, borderBottom: i < marketingBudget.length - 1 ? `1px solid ${C.border}` : "none" }}>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{row.line}</p>
                        <p className="text-xs mt-0.5" style={{ color: C.muted }}>{row.note}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-heading font-bold" style={{ color: C.gold }}>₱{row.monthly.toLocaleString()}/mo</p>
                        <p className="text-xs" style={{ color: C.dim }}>{row.phase}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-5 py-4" style={{ background: `${C.red}20`, borderTop: `2px solid ${C.red}` }}>
                    <span className="font-bold">Total Monthly Marketing Budget</span>
                    <span className="font-heading font-extrabold text-lg" style={{ color: C.gold }}>
                      ₱{marketingBudget.reduce((s, r) => s + r.monthly, 0).toLocaleString()}/mo
                    </span>
                  </div>
                </div>
              </div>

              {/* Influencer Strategy */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.orange }}>Influencer Strategy</p>
                <h2 className="text-3xl font-extrabold font-heading mb-2">Who to Partner With</h2>
                <p className="text-sm mb-6" style={{ color: C.muted }}>Start with nano and micro food creators in your city. They have the highest engagement rate and lowest cost. Build up as budget grows.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {influencerTiers.map((tier, i) => (
                    <div key={tier.tier} className="rounded-xl p-5" style={{ background: C.card, border: `1px solid ${[C.orange, C.red, "#6A0DAD"][i]}40` }}>
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-heading font-extrabold text-lg" style={{ color: [C.orange, C.red, "#6A0DAD"][i] }}>{tier.tier}</p>
                        <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: `${[C.orange, C.red, "#6A0DAD"][i]}20`, color: [C.orange, C.red, "#6A0DAD"][i] }}>
                          {tier.followers} followers
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 mb-4">
                        <div className="flex justify-between text-xs">
                          <span style={{ color: C.dim }}>Cost per collab</span>
                          <span className="font-semibold">{tier.cost}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span style={{ color: C.dim }}>Est. reach</span>
                          <span className="font-semibold">{tier.reach}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span style={{ color: C.dim }}>Conversion</span>
                          <span className="font-semibold">{tier.conversion}</span>
                        </div>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
                        <span className="font-bold" style={{ color: C.orange }}>How: </span>{tier.action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── OPERATIONS TAB ────────────────────────────── */}
          {tab === "operations" && (
            <motion.div key="operations" {...fade}>

              {/* Daily workflow */}
              <div className="mb-12">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.orange }}>Daily Operations</p>
                <h2 className="text-3xl font-extrabold font-heading mb-6">A Day in the Republika</h2>
                <div className="relative flex flex-col gap-4">
                  <div className="absolute left-[22px] top-0 bottom-0 w-0.5" style={{ background: C.border }} />
                  {opsSteps.map((step, i) => (
                    <div key={step.time} className="flex gap-5 relative">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-lg flex-shrink-0 z-10"
                        style={{ background: C.card, border: `2px solid ${C.border}` }}
                      >
                        {step.icon}
                      </div>
                      <div className="flex-1 rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-sm">{step.task}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ background: C.surface, color: C.orange }}>
                            {step.time}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{step.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Visual */}
              <div className="mb-12">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.orange }}>Cart Design & Dimensions</p>
                <h2 className="text-3xl font-extrabold font-heading mb-2">The Sarsa Republika Cart</h2>
                <p className="text-sm mb-6" style={{ color: C.muted }}>
                  Custom stainless steel, 150cm × 65cm footprint — fits in one standard parking space (250cm × 500cm).
                  Full height with LED signage: 210cm. Built for visibility, hygiene, and speed.
                </p>

                {/* Specs row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: "Length", value: "150 cm", icon: "📏" },
                    { label: "Width", value: "65 cm", icon: "📐" },
                    { label: "Total Height", value: "210 cm", icon: "📊" },
                    { label: "Spit Capacity", value: "6–8 birds", icon: "🐔" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                      <div className="text-2xl mb-2">{s.icon}</div>
                      <p className="font-heading font-extrabold text-xl" style={{ color: C.gold }}>{s.value}</p>
                      <p className="text-xs mt-1" style={{ color: C.muted }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                <CartVisual />

                {/* Cart sections breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  {[
                    { label: "Top Signage (40cm)", detail: "Illuminated LED panel with logo, tagline, and brand colors. Visible from 30m away. Includes menu pricing board." },
                    { label: "Rotisserie Glass (70cm)", detail: "Tempered glass front panel. Two rotating spit rods holding 6–8 spatchcock chickens simultaneously. LPG-fired from below." },
                    { label: "Service Counter (8cm)", detail: "Polished stainless counter top. Sauce display tray with 6 sauce cups visible. GCash QR + order panel on right." },
                    { label: "Storage Cabinet (58cm)", detail: "Two lockable stainless doors. Left: sauce ingredients + prep materials. Right: packaging, boxes, gloves, tools." },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                      <p className="font-bold text-sm mb-1">{s.label}</p>
                      <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{s.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipment */}
              <div className="mb-12">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.orange }}>Equipment & Setup</p>
                <h2 className="text-3xl font-extrabold font-heading mb-6">What You Need to Start</h2>
                <div className="overflow-hidden rounded-2xl" style={{ border: `1px solid ${C.border}` }}>
                  {equipment.map((item, i) => (
                    <div
                      key={item.item}
                      className="flex items-center justify-between px-5 py-4"
                      style={{
                        background: i % 2 === 0 ? C.surface : C.card,
                        borderBottom: i < equipment.length - 1 ? `1px solid ${C.border}` : "none",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Package size={14} style={{ color: C.orange }} />
                        <span className="text-sm">{item.item}</span>
                      </div>
                      <span className="font-heading font-bold text-sm" style={{ color: C.gold }}>₱{item.cost.toLocaleString()}</span>
                    </div>
                  ))}
                  <div
                    className="flex items-center justify-between px-5 py-4"
                    style={{ background: `${C.red}20`, borderTop: `2px solid ${C.red}` }}
                  >
                    <span className="font-bold">Total Startup Cost</span>
                    <span className="font-heading font-extrabold text-lg" style={{ color: C.gold }}>
                      ₱{equipment.reduce((s, e) => s + e.cost, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Staffing */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.orange }}>Staffing</p>
                <h2 className="text-3xl font-extrabold font-heading mb-6">Your Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      role: "Pitmaster / Cook", emoji: "👨‍🍳", salary: "₱9,000–12,000/mo",
                      duties: ["Marinate and load chickens onto spit", "Monitor rotisserie and baste", "Batch cooking and quality control", "Prep sauces and rice"],
                    },
                    {
                      role: "Cashier / Packager", emoji: "🧑‍💼", salary: "₱7,000–9,000/mo",
                      duties: ["Take orders and handle cash/GCash", "Pack Sarsa Boxes to standard", "Manage sauce portioning", "Customer service and upselling"],
                    },
                  ].map((staff) => (
                    <div key={staff.role} className="rounded-xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">{staff.emoji}</span>
                        <div>
                          <p className="font-bold text-sm">{staff.role}</p>
                          <p className="text-xs" style={{ color: C.orange }}>{staff.salary}</p>
                        </div>
                      </div>
                      <ul className="flex flex-col gap-2">
                        {staff.duties.map((d) => (
                          <li key={d} className="flex gap-2 text-xs" style={{ color: C.muted }}>
                            <CheckCircle size={12} className="flex-shrink-0 mt-0.5" style={{ color: C.orange }} />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── SCALE TAB ─────────────────────────────────── */}
          {tab === "scale" && (
            <motion.div key="scale" {...fade}>
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.orange }}>Growth Roadmap</p>
                <h2 className="text-3xl font-extrabold font-heading mb-2">5 Ways to Scale Sarsa Republika</h2>
                <p className="text-sm mb-8" style={{ color: C.muted }}>
                  Start with one cart and build to a franchise empire. Each tier is designed to be entered in sequence — or run in parallel if capital allows.
                </p>
              </div>

              <div className="flex flex-col gap-8">
                {scaleModels.map((model) => (
                  <div key={model.tier} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${model.color}40` }}>
                    {/* Header */}
                    <div className="px-6 py-4 flex items-center justify-between" style={{ background: `${model.color}18`, borderBottom: `1px solid ${model.color}30` }}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${model.color}25` }}>
                          {model.emoji}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${model.color}30`, color: model.color }}>
                              Tier {model.tier}
                            </span>
                          </div>
                          <p className="font-heading font-extrabold text-xl">{model.name}</p>
                          <p className="text-xs" style={{ color: C.muted }}>{model.timeline}</p>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        {model.investment > 0 && (
                          <p className="text-xs" style={{ color: C.dim }}>Additional Investment</p>
                        )}
                        <p className="font-heading font-extrabold text-2xl" style={{ color: C.gold }}>
                          {model.investment > 0 ? `₱${model.investment.toLocaleString()}` : "Earn from Tier 1+"}
                        </p>
                      </div>
                    </div>

                    <div className="p-6" style={{ background: C.card }}>
                      <p className="text-sm leading-relaxed mb-6" style={{ color: C.muted }}>{model.description}</p>

                      {/* Revenue/Profit */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="rounded-xl p-4" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                          <p className="text-xs mb-1" style={{ color: C.dim }}>Monthly Revenue Range</p>
                          <p className="font-heading font-bold text-lg" style={{ color: C.gold }}>
                            ₱{model.revenueRange[0].toLocaleString()} – ₱{model.revenueRange[1].toLocaleString()}
                          </p>
                        </div>
                        <div className="rounded-xl p-4" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                          <p className="text-xs mb-1" style={{ color: C.dim }}>Monthly Net Profit Range</p>
                          <p className="font-heading font-bold text-lg" style={{ color: "#2D9E2D" }}>
                            ₱{model.profitRange[0].toLocaleString()} – ₱{model.profitRange[1].toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Requirements */}
                      {model.requirements.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: C.orange }}>Requirements</p>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {model.requirements.map((r) => (
                              <li key={r} className="flex gap-2 text-xs" style={{ color: C.muted }}>
                                <CheckCircle size={12} className="flex-shrink-0 mt-0.5" style={{ color: model.color }} />
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Pros/Cons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#2D9E2D" }}>Advantages</p>
                          <ul className="flex flex-col gap-1.5">
                            {model.pros.map((p) => (
                              <li key={p} className="flex gap-2 text-xs" style={{ color: C.muted }}>
                                <span style={{ color: "#2D9E2D" }}>✓</span> {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: C.red }}>Challenges</p>
                          <ul className="flex flex-col gap-1.5">
                            {model.cons.map((c) => (
                              <li key={c} className="flex gap-2 text-xs" style={{ color: C.muted }}>
                                <span style={{ color: C.red }}>⚠</span> {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scaling timeline */}
              <div className="mt-12">
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: C.orange }}>Recommended Growth Timeline</p>
                <div className="overflow-x-auto rounded-2xl" style={{ border: `1px solid ${C.border}` }}>
                  <table className="w-full min-w-[520px]">
                    <thead>
                      <tr style={{ background: C.card }}>
                        {["Period","Focus","Action","Expected Monthly Profit"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: C.muted }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { period: "Month 1–2", focus: "Tier 1: Launch", action: "Owner-operated single cart. Master recipes, build regulars.", profit: "₱20,000–35,000" },
                        { period: "Month 3–5", focus: "Tier 1: Stabilise", action: "60–80 boxes/day. Hire 2nd person. Start sauce batch production.", profit: "₱40,000–65,000" },
                        { period: "Month 4–6", focus: "Tier 2: 2nd Cart", action: "Scout 2nd location. Hire dedicated Pitmaster. Add GrabFood.", profit: "₱60,000–110,000" },
                        { period: "Month 6–9", focus: "Tier 4: Ghost Kitchen", action: "Parallel online-only kitchen. Test delivery demand.", profit: "+₱15,000–30,000" },
                        { period: "Month 9–12", focus: "Tier 3: Fleet Plan", action: "3rd and 4th cart. Central commissary. Operations Manager.", profit: "₱120,000–220,000" },
                        { period: "Year 2+", focus: "Tier 5: Franchise", action: "Trademark registered. Sell 5–10 franchise units at ₱150K.", profit: "₱150,000–400,000+" },
                      ].map((row, i) => (
                        <tr key={row.period} style={{ background: i % 2 === 0 ? C.surface : C.card, borderTop: `1px solid ${C.border}` }}>
                          <td className="px-4 py-3 text-sm font-semibold" style={{ color: C.orange }}>{row.period}</td>
                          <td className="px-4 py-3 text-sm">{row.focus}</td>
                          <td className="px-4 py-3 text-xs" style={{ color: C.muted }}>{row.action}</td>
                          <td className="px-4 py-3 text-sm font-bold" style={{ color: "#2D9E2D" }}>{row.profit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── FINANCIALS TAB ────────────────────────────── */}
          {tab === "financials" && (
            <motion.div key="financials" {...fade}>

              {/* Calculator */}
              <div className="mb-12">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.orange }}>Revenue Calculator</p>
                <h2 className="text-3xl font-extrabold font-heading mb-2">How Much Will You Make?</h2>
                <p className="text-sm mb-8" style={{ color: C.muted }}>Adjust the slider to model your daily sales volume. All calculations use live pricing.</p>

                {/* Slider */}
                <div className="rounded-2xl p-6 mb-8" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-sm">Boxes Sold Per Day</p>
                    <p className="font-heading font-extrabold text-2xl" style={{ color: C.gold }}>{boxesPerDay}</p>
                  </div>
                  <input
                    type="range" min={20} max={200} step={5}
                    value={boxesPerDay}
                    onChange={(e) => setBoxesPerDay(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: C.red }}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs" style={{ color: C.dim }}>20 (slow day)</span>
                    <span className="text-xs" style={{ color: C.dim }}>200 (peak)</span>
                  </div>
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: "Daily Revenue", value: `₱${financials.dailyRevenue.toLocaleString()}`, sub: `${boxesPerDay} boxes × ₱${avgPrice}`, color: C.gold },
                    { label: "Monthly Revenue", value: `₱${financials.monthlyRevenue.toLocaleString()}`, sub: `${daysPerMonth} days open`, color: C.orange },
                    { label: "Monthly Costs", value: `₱${financials.totalCosts.toLocaleString()}`, sub: "COGS + labor + overhead", color: C.red },
                    { label: "Net Profit", value: `₱${Math.max(0, financials.netProfit).toLocaleString()}`, sub: financials.netProfit < 0 ? "⚠️ Increase volume" : "Per month", color: financials.netProfit >= 0 ? "#2D9E2D" : C.red },
                  ].map((m) => (
                    <div key={m.label} className="rounded-xl p-4 flex flex-col gap-1" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                      <p className="text-xs" style={{ color: C.dim }}>{m.label}</p>
                      <p className="font-heading font-extrabold text-xl leading-tight" style={{ color: m.color }}>{m.value}</p>
                      <p className="text-xs" style={{ color: C.muted }}>{m.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Payback */}
                <div
                  className="rounded-xl p-5 flex items-center gap-4"
                  style={{ background: financials.paybackMonths <= 3 ? "#0D2E0D" : C.card, border: `1px solid ${financials.paybackMonths <= 3 ? "#2D9E2D55" : C.border}` }}
                >
                  {financials.paybackMonths <= 3
                    ? <CheckCircle size={24} style={{ color: "#2D9E2D", flexShrink: 0 }} />
                    : <AlertCircle size={24} style={{ color: C.orange, flexShrink: 0 }} />
                  }
                  <div>
                    <p className="font-bold text-sm">
                      Startup recovered in <span style={{ color: C.gold }}>{financials.netProfit > 0 ? financials.paybackMonths.toFixed(1) : "∞"} months</span>
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                      Based on ₱{financials.totalStartup.toLocaleString()} startup cost and ₱{Math.max(0, financials.netProfit).toLocaleString()}/mo net profit.
                      {financials.netProfit < 0 ? " Sell more boxes to reach profitability." : " At this volume you break even fast."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cost breakdown */}
              <div className="mb-12">
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: C.orange }}>Monthly Cost Breakdown</p>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Cost of Goods Sold (COGS)", value: financials.cogs, pct: "34%" },
                    { label: "Labor (cook + cashier)", value: labor, pct: "—" },
                    { label: "Space rent / stall fee", value: 5000, pct: "—" },
                    { label: "LPG & utilities", value: 3000, pct: "—" },
                    { label: "Packaging materials", value: 2500, pct: "—" },
                    { label: "Miscellaneous", value: 1500, pct: "—" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ background: C.card }}>
                      <span className="text-sm">{row.label}</span>
                      <div className="flex items-center gap-3">
                        {row.pct !== "—" && <span className="text-xs" style={{ color: C.muted }}>{row.pct} of revenue</span>}
                        <span className="font-bold text-sm font-heading" style={{ color: C.gold }}>₱{Math.round(row.value).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6-month projection */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: C.orange }}>6-Month Growth Projection</p>
                <div className="overflow-x-auto rounded-2xl" style={{ border: `1px solid ${C.border}` }}>
                  <table className="w-full min-w-[480px]">
                    <thead>
                      <tr style={{ background: C.card }}>
                        {["Month", "Boxes/Day", "Revenue", "Costs", "Profit"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: C.muted }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { month: "Month 1", boxes: 40, note: "Soft launch" },
                        { month: "Month 2", boxes: 60, note: "Word spreads" },
                        { month: "Month 3", boxes: 75, note: "Loyalty building" },
                        { month: "Month 4", boxes: 90, note: "GrabFood live" },
                        { month: "Month 5", boxes: 110, note: "Peak traction" },
                        { month: "Month 6", boxes: 130, note: "2nd cart planning" },
                      ].map((row, i) => {
                        const rev = row.boxes * avgPrice * daysPerMonth;
                        const costs = rev * cogsPct + labor + fixedMonthly;
                        const profit = rev - costs;
                        return (
                          <tr key={row.month} style={{ background: i % 2 === 0 ? C.surface : C.card, borderTop: `1px solid ${C.border}` }}>
                            <td className="px-4 py-3">
                              <p className="text-sm font-semibold">{row.month}</p>
                              <p className="text-xs" style={{ color: C.dim }}>{row.note}</p>
                            </td>
                            <td className="px-4 py-3 text-sm" style={{ color: C.muted }}>{row.boxes}</td>
                            <td className="px-4 py-3 text-sm font-bold" style={{ color: C.gold }}>₱{rev.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm" style={{ color: C.muted }}>₱{Math.round(costs).toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm font-bold" style={{ color: profit >= 0 ? "#2D9E2D" : C.red }}>
                              {profit >= 0 ? "+" : ""}₱{Math.round(profit).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── CTA FOOTER ────────────────────────────────────── */}
      <section
        className="mt-8 py-16 px-6 text-center"
        style={{ background: `linear-gradient(180deg, ${C.dark} 0%, ${C.redDark}40 100%)`, borderTop: `1px solid ${C.border}` }}
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.orange }}>Ready to Launch?</p>
        <h2 className="text-3xl md:text-4xl font-extrabold font-heading mb-4">Let BVN build the brand.</h2>
        <p className="text-base mb-8 max-w-lg mx-auto" style={{ color: C.muted }}>
          Sarsa Republika is a BVN concept. We handle branding, website, social media, and marketing — so you focus on the chicken.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 font-heading font-bold px-8 py-4 rounded-xl text-white text-base transition-all hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${C.red}, ${C.orange})` }}
        >
          Work With BVN <Zap size={16} />
        </a>
        <p className="mt-6 text-xs" style={{ color: C.dim }}>
          Business concept developed by BVN Digital · bvnofficial.com
        </p>
      </section>
    </div>
  );
}
