import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Tag, ArrowRight } from "lucide-react";
import { blogPosts, getBlogPost, type ContentSection } from "@/lib/blog-posts";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema, jsonLdScript, SITE_URL } from "@/lib/jsonld";
import GlowButton from "@/components/ui/GlowButton";
import ShareButtons from "@/components/ui/ShareButtons";

// ── Static params for all blog posts ─────────────────────────
export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

// ── Per-post SEO metadata ─────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getBlogPost(params.slug);
  if (!post) return { title: "Post Not Found | BVN" };

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords.join(", "),
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `https://www.bvnofficial.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.dateISO,
      authors: ["BVN Agency"],
      siteName: "BVN",
      images: [ogImage({ title: post.title, eyebrow: post.category, theme: post.category === "Operations" ? "blue" : "orange" })],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.metaDescription,
      images: [ogImage({ title: post.title, eyebrow: post.category, theme: post.category === "Operations" ? "blue" : "orange" }).url],
    },
    alternates: {
      canonical: `https://www.bvnofficial.com/blog/${post.slug}`,
    },
  };
}

// ── Blog post page ────────────────────────────────────────────
export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  // Related posts — same category, exclude current
  const related = blogPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  const isMarketing = post.category === "Marketing";
  const accentClass = isMarketing ? "text-orange" : "text-blue-400";
  const accentBg = isMarketing ? "bg-orange/10 border-orange/20" : "bg-blue-400/10 border-blue-400/20";

  // Word count (improves Article richness signals)
  const wordCount = post.sections.reduce((n, s) => {
    if (s.type === "paragraph" || s.type === "h2" || s.type === "h3" || s.type === "callout") {
      return n + (s.text?.split(/\s+/).length ?? 0);
    }
    if (s.type === "list" || s.type === "numbered") {
      return n + s.items.join(" ").split(/\s+/).length;
    }
    return n;
  }, 0);

  // JSON-LD structured data for Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    image: ogImage({ title: post.title, eyebrow: post.category }).url,
    datePublished: post.dateISO,
    dateModified: post.dateISO,
    articleSection: post.category,
    wordCount,
    inLanguage: "en",
    author: {
      "@type": "Organization",
      name: "BVN",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "BVN",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/bvn-logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    keywords: post.keywords.join(", "),
  };

  const breadcrumb = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  return (
    <>
      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumb)} />

      {/* ── Top bar ─────────────────────────────────────── */}
      <div className="pt-20 md:pt-24 bg-navy-dark" />

      {/* ── Hero / Post header ──────────────────────────── */}
      <section className="relative bg-navy-dark px-6 md:px-12 lg:px-24 pb-12 pt-8 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            background: isMarketing
              ? "radial-gradient(ellipse 50% 40% at 50% 0%, #E86010 0%, transparent 70%)"
              : "radial-gradient(ellipse 50% 40% at 50% 0%, #60a5fa 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm font-accent font-semibold transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Back to Blog
          </Link>

          {/* Category + meta */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span
              className={`flex items-center gap-1.5 text-xs font-accent font-semibold px-2.5 py-1 rounded-full border ${accentBg} ${accentClass}`}
            >
              <Tag size={10} />
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-white/40 text-xs">
              <Clock size={11} />
              {post.readTime}
            </span>
            <time
              dateTime={post.dateISO}
              className="text-white/30 text-xs"
            >
              {post.date}
            </time>
          </div>

          {/* Title */}
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-5">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-white/60 text-lg leading-relaxed mb-6">
            {post.excerpt}
          </p>

          {/* Share */}
          <ShareButtons
            url={`https://www.bvnofficial.com/blog/${post.slug}`}
            title={post.title}
          />
        </div>
      </section>

      {/* ── Article body ────────────────────────────────── */}
      <article className="relative bg-navy-surface border-t border-white/5 px-6 md:px-12 lg:px-24 py-14">
        <div className="max-w-3xl mx-auto space-y-6">
          {post.sections.map((section, i) => (
            <SectionRenderer key={i} section={section} isMarketing={isMarketing} />
          ))}
        </div>
      </article>

      {/* ── Related posts ───────────────────────────────── */}
      {related.length > 0 && (
        <section className="bg-navy-dark border-t border-white/5 px-6 md:px-12 lg:px-24 py-16">
          <div className="max-w-7xl mx-auto">
            <p className="font-accent font-semibold text-xs uppercase tracking-[0.2em] text-white/40 mb-6">
              Related Articles
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((relPost) => (
                <Link
                  key={relPost.slug}
                  href={`/blog/${relPost.slug}`}
                  className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl p-5
                    hover:border-orange/25 hover:bg-white/7 transition-all duration-300"
                >
                  <span
                    className={`self-start text-xs font-accent font-semibold px-2 py-0.5 rounded-full border mb-3
                      ${relPost.category === "Marketing"
                        ? "bg-orange/10 border-orange/20 text-orange"
                        : "bg-blue-400/10 border-blue-400/20 text-blue-400"
                      }`}
                  >
                    {relPost.category}
                  </span>
                  <h3 className="font-heading font-bold text-white text-sm leading-snug mb-3 flex-1
                    group-hover:text-orange-light transition-colors line-clamp-2">
                    {relPost.title}
                  </h3>
                  <span className="flex items-center gap-1 text-orange text-xs font-accent font-semibold
                    group-hover:gap-2 transition-all duration-200">
                    Read <ArrowRight size={11} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Banner ──────────────────────────────────── */}
      <section
        className="px-6 md:px-12 lg:px-24 py-20 border-t border-white/5 text-center"
        style={{
          background: "linear-gradient(135deg, #0A0F1E 0%, #1B3060 50%, #0A0F1E 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <p className="font-accent font-semibold text-xs uppercase tracking-[0.2em] text-orange mb-4">
            Ready to Take Action?
          </p>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white mb-4 leading-tight">
            Let BVN Help You Grow
          </h2>
          <p className="text-white/60 mb-8">
            Whether it&apos;s marketing, automation, or both — BVN has the expertise to
            turn the strategies in this article into real results for your business.
          </p>
          <GlowButton href="/contact" variant="filled" showArrow>
            Book a Free Consultation
          </GlowButton>
        </div>
      </section>
    </>
  );
}

// ── Section renderer component ────────────────────────────────
function SectionRenderer({
  section,
  isMarketing,
}: {
  section: ContentSection;
  isMarketing: boolean;
}) {
  const accentClass = isMarketing ? "text-orange" : "text-blue-400";
  const accentBorderClass = isMarketing ? "border-orange/30" : "border-blue-400/30";
  const accentBgClass = isMarketing ? "bg-orange/5" : "bg-blue-400/5";

  switch (section.type) {
    case "paragraph":
      return (
        <p className="text-white/75 text-base md:text-[17px] leading-[1.85] font-body">
          {section.text}
        </p>
      );

    case "h2":
      return (
        <h2 className={`font-heading font-bold text-2xl md:text-3xl text-white mt-10 mb-2 leading-tight ${accentClass} border-l-4 ${accentBorderClass} pl-4`}>
          {section.text}
        </h2>
      );

    case "h3":
      return (
        <h3 className="font-heading font-semibold text-lg md:text-xl text-white/90 mt-7 mb-1 leading-snug">
          {section.text}
        </h3>
      );

    case "list":
      return (
        <ul className="space-y-2.5 pl-1">
          {section.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-white/70 text-base leading-relaxed">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${isMarketing ? "bg-orange" : "bg-blue-400"}`} />
              <span className="font-body">{item}</span>
            </li>
          ))}
        </ul>
      );

    case "numbered":
      return (
        <ol className="space-y-3 pl-1">
          {section.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-white/70 text-base leading-relaxed">
              <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-heading font-bold
                ${isMarketing ? "bg-orange/15 text-orange" : "bg-blue-400/15 text-blue-400"}`}>
                {i + 1}
              </span>
              <span className="font-body pt-0.5">{item}</span>
            </li>
          ))}
        </ol>
      );

    case "callout":
      return (
        <div className={`rounded-2xl border ${accentBorderClass} ${accentBgClass} p-6`}>
          <p className={`font-accent font-semibold text-sm leading-relaxed ${accentClass}`}>
            💡 {section.text}
          </p>
        </div>
      );

    case "cta":
      return (
        <div className="rounded-2xl bg-navy-dark border border-white/10 p-8 text-center mt-8">
          <h3 className="font-heading font-bold text-white text-xl mb-2">{section.heading}</h3>
          <p className="text-white/60 text-sm mb-6 font-body">{section.text}</p>
          <GlowButton href="/contact" variant="filled" showArrow>
            Book a Free Consultation
          </GlowButton>
        </div>
      );

    default:
      return null;
  }
}
