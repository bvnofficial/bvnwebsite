"use client";

import { useEffect, useState, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// Lightweight blog review console. Enter the admin secret once
// (kept in this browser's sessionStorage, never in code), then
// review drafts and schedule, publish, or reject them from any
// device including your phone.
//
// Note: this gates on BLOG_ADMIN_SECRET entered at runtime. Treat
// the secret like a password. For a hardened version, put this
// behind Supabase auth later.
// ─────────────────────────────────────────────────────────────

interface DraftPost {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  status: "draft" | "scheduled";
  scheduled_for: string | null;
  read_time: string | null;
  sections: any[];
}

export default function BlogAdminPage() {
  const [secret, setSecret] = useState("");
  const [entered, setEntered] = useState(false);
  const [posts, setPosts] = useState<DraftPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string>("");

  useEffect(() => {
    const s = sessionStorage.getItem("bvn_blog_secret");
    if (s) {
      setSecret(s);
      setEntered(true);
    }
  }, []);

  const load = useCallback(async (key: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/blog/admin", { headers: { "x-admin-secret": key } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setPosts(data.posts);
    } catch (e: any) {
      setError(e.message);
      if (e.message === "unauthorized") {
        sessionStorage.removeItem("bvn_blog_secret");
        setEntered(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (entered && secret) load(secret);
  }, [entered, secret, load]);

  async function act(slug: string, action: string, scheduledFor?: string) {
    setBusy(slug + action);
    setError("");
    try {
      const res = await fetch("/api/blog/admin", {
        method: "POST",
        headers: { "content-type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify({ slug, action, scheduledFor }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");
      await load(secret);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy("");
    }
  }

  if (!entered) {
    return (
      <main className="min-h-screen bg-navy-dark text-white flex items-center justify-center px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sessionStorage.setItem("bvn_blog_secret", secret);
            setEntered(true);
          }}
          className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <h1 className="font-heading font-bold text-xl mb-1">Blog Review</h1>
          <p className="text-white/50 text-sm mb-5">Enter the admin secret to continue.</p>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Admin secret"
            className="w-full bg-navy-surface border border-white/15 rounded-lg px-3 py-2.5 text-sm mb-4 outline-none focus:border-orange"
          />
          <button
            type="submit"
            className="w-full bg-orange hover:bg-orange-light transition-colors rounded-lg py-2.5 font-accent font-semibold text-sm"
          >
            Unlock
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-navy-dark text-white px-5 md:px-10 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading font-extrabold text-2xl">Blog Review</h1>
            <p className="text-white/50 text-sm">{posts.length} awaiting review</p>
          </div>
          <button onClick={() => load(secret)} className="text-orange text-sm font-accent font-semibold">
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg px-4 py-3 text-sm mb-5">
            {error}
          </div>
        )}
        {loading && <p className="text-white/40 text-sm">Loading…</p>}
        {!loading && posts.length === 0 && (
          <p className="text-white/40 text-sm">Nothing in the queue. The next cron run will draft the next planned post.</p>
        )}

        <div className="space-y-4">
          {posts.map((p) => (
            <ReviewCard key={p.slug} post={p} busy={busy} onAct={act} />
          ))}
        </div>
      </div>
    </main>
  );
}

function ReviewCard({
  post,
  busy,
  onAct,
}: {
  post: DraftPost;
  busy: string;
  onAct: (slug: string, action: string, scheduledFor?: string) => void;
}) {
  const [when, setWhen] = useState("");
  const [open, setOpen] = useState(false);
  const isScheduled = post.status === "scheduled";

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-accent font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/60">
          {post.category}
        </span>
        <span
          className={`text-[10px] font-accent font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            isScheduled ? "bg-blue-400/15 text-blue-300" : "bg-orange/15 text-orange"
          }`}
        >
          {isScheduled ? `scheduled ${new Date(post.scheduled_for!).toLocaleDateString()}` : "draft"}
        </span>
        {post.read_time && <span className="text-white/30 text-xs">{post.read_time}</span>}
      </div>

      <h2 className="font-heading font-bold text-white leading-snug mb-1.5">{post.title}</h2>
      <p className="text-white/55 text-sm mb-3">{post.excerpt}</p>

      <button onClick={() => setOpen((o) => !o)} className="text-orange text-xs font-accent font-semibold mb-3">
        {open ? "Hide preview" : "Preview content"}
      </button>
      {open && (
        <div className="bg-navy-surface border border-white/10 rounded-lg p-4 mb-4 max-h-72 overflow-y-auto space-y-2">
          {post.sections.map((s, i) => (
            <PreviewSection key={i} s={s} />
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="datetime-local"
          value={when}
          onChange={(e) => setWhen(e.target.value)}
          className="bg-navy-surface border border-white/15 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-orange"
        />
        <button
          disabled={!when || busy === post.slug + "schedule"}
          onClick={() => onAct(post.slug, "schedule", when)}
          className="text-xs font-accent font-semibold px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-200 hover:bg-blue-500/30 disabled:opacity-40 transition-colors"
        >
          Schedule
        </button>
        <button
          disabled={busy === post.slug + "publish"}
          onClick={() => onAct(post.slug, "publish")}
          className="text-xs font-accent font-semibold px-3 py-1.5 rounded-lg bg-orange hover:bg-orange-light disabled:opacity-40 transition-colors"
        >
          Publish now
        </button>
        <button
          disabled={busy === post.slug + "reject"}
          onClick={() => {
            if (confirm(`Delete draft "${post.title}"? This cannot be undone.`)) onAct(post.slug, "reject");
          }}
          className="text-xs font-accent font-semibold px-3 py-1.5 rounded-lg bg-white/5 text-white/50 hover:bg-red-500/20 hover:text-red-300 transition-colors ml-auto"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

function PreviewSection({ s }: { s: any }) {
  if (s.type === "h2") return <p className="text-white font-heading font-bold text-sm">{s.text}</p>;
  if (s.type === "h3") return <p className="text-white/90 font-heading font-semibold text-sm">{s.text}</p>;
  if (s.type === "paragraph") return <p className="text-white/60 text-xs leading-relaxed">{s.text}</p>;
  if (s.type === "callout") return <p className="text-orange text-xs">💡 {s.text}</p>;
  if (s.type === "cta") return <p className="text-white/70 text-xs italic">[CTA] {s.heading}</p>;
  if (s.type === "list" || s.type === "numbered")
    return (
      <ul className="text-white/60 text-xs list-disc pl-4">
        {s.items.map((it: string, i: number) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    );
  return null;
}
