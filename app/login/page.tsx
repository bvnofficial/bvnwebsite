"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Eye, EyeOff, LogIn, AlertCircle, CheckCircle } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0F1E]" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("registered") === "1") {
      setSuccess("Account created! Check your email to confirm, then log in.");
    }
    if (searchParams.get("error") === "auth_callback_failed") {
      setError("Email confirmation failed. Please try again.");
    }
  }, [searchParams]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Honor a safe same-origin ?next= (e.g. returning to certificate checkout).
      const next = searchParams.get("next");
      const dest = next && /^\/(?!\/)/.test(next) ? next : "/dashboard";
      router.push(dest);
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center px-4 py-24">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/40">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Link href="/">
              <Image
                src="/bvn-logo.png"
                alt="BVN"
                width={56}
                height={56}
                className="mb-3 hover:scale-105 transition-transform"
              />
            </Link>
            <h1 className="text-2xl font-heading font-bold text-white">Welcome back</h1>
            <p className="text-sm text-white/50 mt-1 font-body">Sign in to your BVN account</p>
          </div>

          {/* Success message */}
          {success && (
            <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 mb-5">
              <CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-300 font-body">{success}</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-300 font-body">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-accent font-semibold text-white/60 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 font-body
                  focus:outline-none focus:border-orange/50 focus:bg-white/8 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-accent font-semibold text-white/60 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-white/30 font-body
                    focus:outline-none focus:border-orange/50 focus:bg-white/8 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-orange text-white font-heading font-semibold text-sm rounded-xl
                shadow-[0_0_20px_rgba(232,96,16,0.35)] hover:bg-orange-light hover:shadow-[0_0_30px_rgba(232,96,16,0.55)]
                disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={16} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30 font-body">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm font-body text-white/50">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-orange hover:text-orange-light font-semibold transition-colors"
            >
              Create one
            </Link>
          </p>

          {/* Back home */}
          <div className="text-center mt-4">
            <Link
              href="/"
              className="text-xs text-white/30 hover:text-white/60 font-body transition-colors"
            >
              ← Back to bvnofficial.com
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
