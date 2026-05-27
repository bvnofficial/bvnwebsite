# BVN Website

Official website for **BVN** — a Philippines-based digital agency offering Marketing Automation and Business Operations Automation services.

**Live Site:** [www.bvnofficial.com](https://www.bvnofficial.com)

---

## Tech Stack

| Tool | Version |
|------|---------|
| Next.js | 14 (App Router) |
| React | 18 |
| TypeScript | 5 |
| Tailwind CSS | 3.4 |
| Framer Motion | 11 |
| Lucide React | 0.408 |
| clsx + tailwind-merge | Latest |

---

## Getting Started

### 1. Install Dependencies

```bash
cd bvn-website
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
npm run start
```

---

## Project Structure

```
bvn-website/
├── app/
│   ├── layout.tsx          # Root layout (Navbar + Footer)
│   ├── page.tsx            # Home page
│   ├── about/page.tsx      # About Us
│   ├── marketing/page.tsx  # Marketing Automation branch
│   ├── operations/page.tsx # Operations Automation branch
│   ├── pricing/page.tsx    # Pricing (all 4 sections)
│   ├── contact/page.tsx    # Contact form + info
│   └── globals.css         # Global styles + custom CSS
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx      # Sticky glassmorphism nav
│   │   └── Footer.tsx      # Dark footer with 4 columns
│   └── ui/
│       ├── HeroSection.tsx       # Animated hero with spotlight
│       ├── ServiceCard.tsx       # Glassmorphism service card
│       ├── PricingCard.tsx       # Pricing tier card
│       ├── BranchCard.tsx        # Marketing/Operations branch card
│       ├── AnimatedCounter.tsx   # Scroll-triggered number counter
│       ├── GlowButton.tsx        # Orange glow CTA button
│       ├── SectionHeader.tsx     # Reusable section title block
│       └── GridBackground.tsx    # Animated dot/grid background
├── lib/
│   └── utils.ts            # cn() Tailwind merge utility
├── public/
│   └── bvn-logo.png        # ← Add your logo here (see below)
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

---

## Adding the BVN Logo

1. Place your logo image at **`/public/bvn-logo.png`**
2. To use it in the Navbar, update `components/layout/Navbar.tsx`:

```tsx
// Replace the text logo with:
import Image from "next/image";

<Image
  src="/bvn-logo.png"
  alt="BVN Logo"
  width={120}
  height={40}
  className="h-9 w-auto"
  priority
/>
```

3. Do the same in `components/layout/Footer.tsx` if desired.

---

## Customization

### Brand Colors
Edit `tailwind.config.ts` to update brand colors:
```ts
navy: { DEFAULT: '#1B3060', dark: '#0A0F1E', surface: '#111827' },
orange: { DEFAULT: '#E86010', light: '#F5A623' },
```

### Contact Information
Update contact details in:
- `components/layout/Footer.tsx`
- `app/contact/page.tsx`

### Services
- Marketing services: `app/marketing/page.tsx`
- Operations services: `app/operations/page.tsx`

### Pricing
All pricing data is in `app/pricing/page.tsx` as plain TypeScript objects — easy to update.

---

## Contact

- **Email:** bvn@bvnofficial.com
- **Phone:** +63 981 655 6555
- **Facebook:** [facebook.com/bvndigital](https://www.facebook.com/bvndigital)
- **Website:** [www.bvnofficial.com](https://www.bvnofficial.com)
