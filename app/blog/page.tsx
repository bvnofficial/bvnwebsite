import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { blogPosts } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog — Marketing & Automation Insights | BVN Philippines",
  description:
    "Expert insights on digital marketing, business automation, SEO, CRM, and operations for Philippine businesses. Practical guides to help you grow faster.",
  keywords:
    "digital marketing blog Philippines, business automation blog, SEO Philippines, marketing tips Philippines, operations automation guides",
  openGraph: {
    title: "Blog — Marketing & Automation Insights | BVN Philippines",
    description:
      "Expert insights on digital marketing, business automation, SEO, and operations for Philippine businesses.",
    url: "https://www.bvnofficial.com/blog",
    type: "website",
  },
  alternates: {
    canonical: "https://www.bvnofficial.com/blog",
  },
};

export default function BlogPage() {
  const marketing = blogPosts.filter((p) => p.category === "Marketing");
  const operations = blogPosts.filter((p) => p.category === "Operations");

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[44vh] flex items-center justify-center bg-navy-dark overflow-hidden pt-24 pb-16 px-6">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, #E86010 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <span className="inline-block font-accent font-semibold text-xs tracking-[0.2em] uppercase text-orange mb-4 px-3 py-1.5 rounded-full bg-orange/10 border border-orange/20">
            BVN Blog
          </span>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-4 leading-tight">
            Marketing &amp; Automation{" "}
            <span className="text-gradient">Insights</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Practical guides, strategies, and tips to help Philippine businesses
            grow faster through smarter marketing and intelligent automation.
          </p>
        </div>
      </section>

      {/* ── All Posts ────────────────────────────────────── */}
      <section className="relative py-20 px-6 md:px-12 lg:px-24 bg-navy-dark border-t border-white/5">
        <div className="max-w-7xl mx-auto">

          {/* Featured / Latest post */}
          {blogPosts[0] && (
            <div className="mb-16">
              <p className="font-accent font-semibold text-xs uppercase tracking-[0.2em] text-orange mb-6">
                Latest Article
              </p>
              <Link
                href={`/blog/${blogPosts[0].slug}`}
                className="group block bg-white/5 border border-white/10 rounded-2xl overflow-hidden
                  hover:border-orange/30 hover:shadow-[0_0_40px_rgba(232,96,16,0.1)] transition-all duration-300"
              >
                <div className="p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`text-xs font-accent font-semibold px-2.5 py-1 rounded-full border
                        ${blogPosts[0].category === "Marketing"
                          ? "bg-orange/10 border-orange/20 text-orange"
                          : "bg-blue-400/10 border-blue-400/20 text-blue-400"
                        }`}
                    >
                      {blogPosts[0].category}
                    </span>
                    <span className="flex items-center gap-1.5 text-white/40 text-xs">
                      <Clock size={11} /> {blogPosts[0].readTime}
                    </span>
                    <span className="text-white/30 text-xs">{blogPosts[0].date}</span>
                  </div>
                  <h2 className="font-heading font-bold text-white text-2xl md:text-3xl mb-3 leading-tight
                    group-hover:text-orange-light transition-colors">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-white/55 text-base leading-relaxed mb-6 max-w-3xl">
                    {blogPosts[0].excerpt}
                  </p>
                  <span className="flex items-center gap-1.5 text-orange text-sm font-accent font-semibold
                    group-hover:gap-3 transition-all duration-200">
                    Read Article <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </div>
          )}

          {/* Marketing Posts */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <Tag size={14} className="text-orange" />
              <p className="font-accent font-semibold text-xs uppercase tracking-[0.2em] text-orange">
                Marketing
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketing.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>

          {/* Operations Posts */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Tag size={14} className="text-blue-400" />
              <p className="font-accent font-semibold text-xs uppercase tracking-[0.2em] text-blue-400">
                Operations &amp; Automation
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {operations.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PostCard({ post }: { post: (typeof blogPosts)[number] }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl p-6
        hover:border-orange/25 hover:bg-white/7 hover:shadow-[0_0_24px_rgba(232,96,16,0.08)]
        transition-all duration-300"
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`text-xs font-accent font-semibold px-2 py-0.5 rounded-full border
            ${post.category === "Marketing"
              ? "bg-orange/10 border-orange/20 text-orange"
              : "bg-blue-400/10 border-blue-400/20 text-blue-400"
            }`}
        >
          {post.category}
        </span>
        <span className="flex items-center gap-1 text-white/35 text-xs">
          <Clock size={10} /> {post.readTime}
        </span>
      </div>
      <h3 className="font-heading font-bold text-white text-base leading-snug mb-2 flex-1
        group-hover:text-orange-light transition-colors line-clamp-2">
        {post.title}
      </h3>
      <p className="text-white/50 text-xs leading-relaxed mb-4 line-clamp-3">
        {post.excerpt}
      </p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-white/30 text-xs">{post.date}</span>
        <span className="flex items-center gap-1 text-orange text-xs font-accent font-semibold
          group-hover:gap-2 transition-all duration-200">
          Read <ArrowRight size={11} />
        </span>
      </div>
    </Link>
  );
}
