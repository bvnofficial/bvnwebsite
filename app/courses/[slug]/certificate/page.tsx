"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Award, Lock, ArrowLeft, Loader2, QrCode, Coins } from "lucide-react";
import { getCourse } from "@/lib/courses";
import { useProgress } from "@/lib/useProgress";
import { createClient } from "@/utils/supabase/client";
import PayPalCheckout from "@/app/payments/PayPalCheckout";

export default function CertificateClaimPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const course = getCourse(slug);

  const { isCompleted, loaded } = useProgress(slug);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Wallet: is the visitor signed in, and how many credits do they have?
  // (1 credit = $1 = ₱60 = exactly the certificate fee.)
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  // If they already own this course's certificate, show it instead of re-charging.
  const [existingCertId, setExistingCertId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      const u = data.user;
      if (!u) {
        setLoggedIn(false);
        return;
      }
      setLoggedIn(true);
      if (u.email && !email) setEmail(u.email);
      const { data: wallet } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", u.id)
        .maybeSingle();
      setBalance(wallet?.balance ?? 0);

      // Already earned this certificate? Skip straight to viewing it.
      try {
        const res = await fetch("/api/certificate/mine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseSlug: slug }),
        });
        const d = await res.json();
        if (d.found && d.id) setExistingCertId(d.id);
      } catch {
        /* non-fatal */
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!course) {
    return (
      <div className="min-h-screen bg-[#080C18] flex items-center justify-center text-white/50">
        Course not found.
        <Link href="/courses" className="text-orange ml-2">Back to courses</Link>
      </div>
    );
  }

  // Completion check (client-side, from saved progress)
  let total = 0;
  let done = 0;
  course.modules.forEach((mod, mIdx) =>
    mod.lessons.forEach((_, lIdx) => {
      total += 1;
      if (isCompleted(mIdx, lIdx)) done += 1;
    })
  );
  const allComplete = total > 0 && done === total;

  const formValid = name.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // When the user can pay with credits, that becomes the primary (orange) action
  // and QR Ph drops to a secondary style so there's only ever one primary button.
  const canUseCredits = loggedIn === true && balance !== null && balance >= 1;

  // ── PayMongo QR Ph ──
  const payWithQR = async () => {
    if (!formValid) {
      setError("Please enter your full name and a valid email.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/certificate/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), courseSlug: slug }),
      });
      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) throw new Error(data.error || "Could not start payment.");
      window.location.href = data.checkoutUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setLoading(false);
    }
  };

  // ── Pay with 1 wallet credit ──
  const payWithCredits = async () => {
    if (!formValid) {
      setError("Please enter your full name and a valid email.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/certificate/credits-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug: slug, name: name.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.id) throw new Error(data.error || "Could not use credits.");
      router.push(`/certificate/${data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setLoading(false);
    }
  };

  // ── PayPal success → record + redirect ──
  const onPaypalSuccess = async (d: { captureId: string }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/certificate/paypal-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          captureId: d.captureId,
          courseSlug: slug,
          name: name.trim(),
          email: email.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.id) throw new Error(data.error || "Could not issue certificate.");
      router.push(`/certificate/${data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment recorded but certificate failed. Contact bvn@bvnofficial.com.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C18] py-12 px-4">
      <div className="max-w-lg mx-auto">
        <Link
          href={`/courses/${slug}`}
          className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-sm font-accent mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to course
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange/10 border border-orange/30 mb-4">
            <Award className="text-orange" size={26} />
          </div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-white mb-2">
            Get your Certificate
          </h1>
          <p className="text-white/50 text-sm leading-relaxed">
            {course.title} — Certificate of Completion, issued by BVN Digital Agency.
          </p>
        </div>

        {/* Already earned → show it, don't ask to pay again */}
        {existingCertId ? (
          <div className="bg-white/[0.04] border border-emerald-500/20 rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mb-4">
              <Award className="text-emerald-400" size={26} />
            </div>
            <p className="text-white font-heading font-bold text-lg mb-2">
              You already have this certificate
            </p>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              No need to pay again. View or download it, or re-send it to your email.
            </p>
            <Link
              href={`/certificate/${existingCertId}`}
              className="inline-block px-6 py-3 rounded-xl bg-orange text-white font-heading font-semibold text-sm hover:bg-orange-light transition-all"
            >
              View my certificate →
            </Link>
          </div>
        ) : loaded && !allComplete ? (
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 text-center">
            <Lock className="text-white/40 mx-auto mb-4" size={28} />
            <p className="text-white/80 font-heading font-semibold mb-2">
              Finish the course first
            </p>
            <p className="text-white/45 text-sm leading-relaxed mb-6">
              You&apos;ve completed <span className="text-white/80 font-semibold">{done} of {total}</span> lessons.
              Complete all lessons to unlock your certificate.
            </p>
            <Link
              href={`/courses/${slug}/learn?m=0&l=0`}
              className="inline-block px-5 py-3 rounded-xl bg-orange text-white font-heading font-semibold text-sm hover:bg-orange-light transition-all"
            >
              Continue learning
            </Link>
          </div>
        ) : (
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 md:p-8">
            {/* Name on certificate */}
            <label className="block text-white/60 text-xs font-accent font-semibold uppercase tracking-wider mb-2">
              Full name (as it appears on the certificate)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Juan Dela Cruz"
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-orange/50 mb-4"
            />

            <label className="block text-white/60 text-xs font-accent font-semibold uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-orange/50 mb-6"
            />

            {error && (
              <p className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Price */}
            <div className="flex items-center justify-between bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 mb-5">
              <span className="text-white/60 text-sm">Certificate fee</span>
              <span className="text-white font-heading font-bold">₱99 <span className="text-white/40 font-normal text-sm">/ $1</span></span>
            </div>

            {/* Pay with wallet credits (1 credit = the full fee) */}
            {canUseCredits && (
              <>
                <button
                  onClick={payWithCredits}
                  disabled={loading || !formValid}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-orange text-white font-heading font-semibold text-sm shadow-[0_0_24px_rgba(232,96,16,0.3)] hover:bg-orange-light disabled:opacity-50 transition-all mb-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <Coins size={16} />}
                  Use 1 credit
                </button>
                <p className="text-white/35 text-xs text-center mb-4">
                  You have <span className="text-white/70 font-semibold">{balance}</span>{" "}
                  {balance === 1 ? "credit" : "credits"}. Covers the full fee — no cash needed.
                </p>

                {/* Divider */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-white/30 text-xs font-accent">or pay directly</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
              </>
            )}

            {/* Logged in but no credits → nudge to top up */}
            {loggedIn && balance !== null && balance < 1 && (
              <div className="flex items-center justify-between gap-3 bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 mb-4">
                <span className="flex items-center gap-2 text-white/55 text-xs">
                  <Coins size={14} className="text-orange/70" /> Pay with credits instead
                </span>
                <Link href="/credits" className="text-orange text-xs font-accent font-semibold hover:underline">
                  Top up →
                </Link>
              </div>
            )}

            {/* Not signed in → let them use a wallet if they have one */}
            {loggedIn === false && (
              <div className="flex items-center justify-between gap-3 bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 mb-4">
                <span className="flex items-center gap-2 text-white/55 text-xs">
                  <Coins size={14} className="text-orange/70" /> Have credits?
                </span>
                <Link
                  href={`/login?next=/courses/${slug}/certificate`}
                  className="text-orange text-xs font-accent font-semibold hover:underline"
                >
                  Log in to pay with your wallet →
                </Link>
              </div>
            )}

            {/* QR Ph (PayMongo) */}
            <button
              onClick={payWithQR}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-heading font-semibold text-sm disabled:opacity-50 transition-all mb-3 ${
                canUseCredits
                  ? "bg-white/8 border border-white/12 text-white hover:bg-white/12"
                  : "bg-orange text-white shadow-[0_0_24px_rgba(232,96,16,0.3)] hover:bg-orange-light"
              }`}
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <QrCode size={16} />}
              Pay ₱99 with QR Ph
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-xs font-accent">or pay internationally</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* PayPal / card ($1 USD) */}
            <div className={!formValid || loading ? "opacity-50 pointer-events-none" : ""}>
              <PayPalCheckout
                amount="1.00"
                currency="USD"
                name={name.trim()}
                email={email.trim()}
                description={`BVN Certificate — ${course.title}`}
                onSuccess={onPaypalSuccess}
                onError={(msg) => setError(msg)}
              />
            </div>
            {!formValid && (
              <p className="text-white/30 text-xs text-center mt-2">
                Enter your name and email above to enable payment.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
