import type { Metadata } from "next";

const BASE = "https://www.bvnofficial.com";

export type OgTheme = "orange" | "blue" | "green" | "rose" | "yellow" | "purple";

type OgImageOpts = {
  /** The main heading shown on the generated image — should describe the page. */
  title: string;
  /** Small uppercase label above the title (e.g. "Free Tool", "Marketing Service"). */
  eyebrow?: string;
  /** Accent color keyed to the page's topic. */
  theme?: OgTheme;
};

/** Build a page-relevant OG image descriptor pointing at the /api/og generator. */
export function ogImage({ title, eyebrow, theme }: OgImageOpts) {
  const p = new URLSearchParams({ title });
  if (eyebrow) p.set("eyebrow", eyebrow);
  if (theme) p.set("theme", theme);
  return {
    url: `${BASE}/api/og?${p.toString()}`,
    width: 1200,
    height: 630,
    alt: title,
  };
}

type BuildMetadataOpts = {
  /** Page <title> (SEO title, may include "| BVN"). */
  title: string;
  description: string;
  /** Path beginning with "/" — used for canonical + og:url. */
  path: string;
  /** Heading rendered on the OG image; defaults to `title`. Keep it concise/topical. */
  ogTitle?: string;
  eyebrow?: string;
  theme?: OgTheme;
  keywords?: string;
};

/**
 * Full Metadata object with a page-relevant OG (and Twitter) image.
 * Use in `layout.tsx` files for client-component pages that can't export metadata themselves.
 */
export function buildMetadata({
  title,
  description,
  path,
  ogTitle,
  eyebrow,
  theme,
  keywords,
}: BuildMetadataOpts): Metadata {
  const url = `${BASE}${path}`;
  const img = ogImage({ title: ogTitle ?? title, eyebrow, theme });
  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [img],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [img.url],
    },
    alternates: { canonical: url },
  };
}
