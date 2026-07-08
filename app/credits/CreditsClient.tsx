"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
  Coins, ArrowLeft, Check, AlertCircle, Lock, Wrench, GraduationCap, Headphones,
  Plus, History,
} from "lucide-react";
import type { WalletData } from "@/lib/credits";
import {
  type CreditItem, type CreditCategory, CATEGORY_LABELS, TOPUP_PRESETS,
} from "@/lib/credit-catalog";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
const PHP_PER_CREDIT = 60; // must match /api/credits/paymongo-topup

interface Props {
  user: { email: string; name?: string };
  wallet: WalletData;
  catalog: CreditItem[];
  paypalEnabled: boolean;
}

const CATEGORY_ICON: Record<CreditCategory, typeof Wrench> = {
  tool: Wrench,
  course: GraduationCap,
  coaching: Headphones,
};

export default function CreditsClient({ user, wallet, catalog, paypalEnabled }: Props) {
  const router = useRouter();
  const [balance, setBalance] = useState(wallet.balance);
  const [owned, setOwned] = useState<Set<string>>(new Set(wallet.entitlements));
  const [amount, setAmount] = useState<number>(25);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Keep latest top-up amount readable inside PayPal callbacks without rebuilding buttons.
  const amountRef = useRef(amount);
  amountRef.current = amount;

  // Handle return from a PayMongo (GCash/card) credit top-up.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("pm") !== "1") return;
    let sid: string | null = null;
    try {
      sid = localStorage.getItem("bvn_credit_pm");
    } catch {
      /* ignore */
    }
    window.history.replaceState({}, "", "/credits");
    if (!sid) return;
    (async () => {
      setMsg({ ok: true, text: "Confirming your GCash / card payment…" });
      try {
        const res = await fetch("/api/credits/paymongo-verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sid }),
        });
        const d = await res.json();
        if (res.ok && d.ok) {
          try {
            localStorage.removeItem("bvn_credit_pm");
          } catch {
            /* ignore */
          }
          setBalance(d.balance);
          setMsg({ ok: true, text: `Added ${d.credited} credits. New balance: ${d.balance}.` });
          router.refresh();
        } else if (d.pending) {
          setMsg({ ok: false, text: "Payment not confirmed yet. If you just paid, refresh in a moment." });
        } else {
          setMsg({ ok: false, text: d.error || "Could not confirm payment." });
        }
      } catch {
        setMsg({ ok: false, text: "Could not confirm payment. Please refresh the page." });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function payGcash() {
    setMsg(null);
    if (!amountRef.current || amountRef.current < 1) {
      setMsg({ ok: false, text: "Enter an amount of at least 1 credit." });
      return;
    }
    setBusy("__gcash");
    try {
      const res = await fetch("/api/credits/paymongo-topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountRef.current }),
      });
      const d = await res.json();
      if (res.ok && d.checkoutUrl) {
        try {
          if (d.sessionId) localStorage.setItem("bvn_credit_pm", d.sessionId);
        } catch {
          /* ignore */
        }
        window.location.href = d.checkoutUrl;
      } else {
        setMsg({ ok: false, text: d.error || "Could not start GCash checkout." });
        setBusy(null);
      }
    } catch {
      setMsg({ ok: false, text: "Network error. Please try again." });
      setBusy(null);
    }
  }

  const grouped = useMemo(() => {
    const order: CreditCategory[] = ["tool", "course", "coaching"];
    return order
      .map((cat) => ({ cat, items: catalog.filter((i) => i.category === cat) }))
      .filter((g) => g.items.length > 0);
  }, [catalog]);

  async function unlock(item: CreditItem) {
    setMsg(null);
    setBusy(item.id);
    try {
      const res = await fetch("/api/credits/spend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id }),
      });
      const d = await res.json();
      if (res.ok && d.ok) {
        setBalance(d.balance);
        setOwned((prev) => new Set(prev).add(item.id));
        setMsg({ ok: true, text: `Unlocked "${item.name}".` });
        router.refresh();
      } else {
        setMsg({ ok: false, text: d.error || "Could not complete purchase." });
        if (typeof d.balance === "number") setBalance(d.balance);
      }
    } catch {
      setMsg({ ok: false, text: "Network error. Please try again." });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Header */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-accent font-semibold text-white/40 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={13} /> Back to dashboard
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Image src="/bvn-logo.png" alt="BVN" width={40} height={40} />
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Credits</h1>
            <p className="text-sm text-white/40 font-body">{user.name || user.email}</p>
          </div>
        </div>

        {/* Global message */}
        {msg && (
          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-3 mb-6 text-sm font-body border ${
              msg.ok
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                : "bg-red-500/10 border-red-500/20 text-red-300"
            }`}
          >
            {msg.ok ? <Check size={15} /> : <AlertCircle size={15} />} {msg.text}
          </div>
        )}

        {/* Balance */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#141b2e] to-[#0d1220] border border-orange/20 rounded-3xl p-7 mb-8">
          <div className="pointer-events-none absolute -top-16 -right-10 w-56 h-56 rounded-full bg-orange/15 blur-3xl" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange/15 border border-orange/30 flex items-center justify-center shrink-0">
              <Coins size={26} className="text-orange" />
            </div>
            <div>
              <p className="text-xs font-accent font-semibold uppercase tracking-widest text-white/40">
                Your Balance
              </p>
              <p className="text-4xl font-heading font-extrabold text-white leading-tight">
                {balance} <span className="text-lg text-white/40 font-body">credits</span>
              </p>
              <p className="text-xs text-white/35 font-body mt-0.5">1 credit = $1 USD</p>
            </div>
          </div>
        </div>

        {/* Not-ready notice (migration not run) */}
        {!wallet.ready && (
          <div className="flex items-start gap-3 bg-amber-500/8 border border-amber-500/25 rounded-2xl p-5 mb-8">
            <AlertCircle size={18} className="text-amber-300 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-200 text-sm font-semibold mb-1">Credits are being set up</p>
              <p className="text-white/45 text-xs leading-relaxed">
                The wallet database isn&apos;t initialized yet. Top-up and unlocks are temporarily
                unavailable. Please check back shortly.
              </p>
            </div>
          </div>
        )}

        {/* Top up */}
        {wallet.ready && (
          <section className="mb-10">
            <h2 className="flex items-center gap-2 text-sm font-accent font-bold text-white/40 uppercase tracking-widest mb-4">
              <Plus size={14} /> Top Up Credits
            </h2>
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
              {/* Amount picker */}
              <div className="flex flex-wrap gap-2 mb-4">
                {TOPUP_PRESETS.map((v) => (
                  <button
                    key={v}
                    onClick={() => setAmount(v)}
                    className={`px-4 py-2 rounded-xl text-sm font-accent font-semibold border transition-all ${
                      amount === v
                        ? "bg-orange text-white border-orange shadow-[0_0_16px_rgba(232,96,16,0.35)]"
                        : "bg-white/[0.03] text-white/60 border-white/10 hover:border-white/25"
                    }`}
                  >
                    ${v}
                  </button>
                ))}
                <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-xl px-3">
                  <span className="text-white/40 text-sm">$</span>
                  <input
                    type="number"
                    min={1}
                    max={5000}
                    value={amount}
                    onChange={(e) => setAmount(Math.max(1, Math.floor(Number(e.target.value) || 0)))}
                    className="w-20 bg-transparent py-2 text-sm text-white focus:outline-none font-body"
                  />
                </div>
              </div>
              <p className="text-xs text-white/40 font-body mb-5">
                You&apos;ll receive <span className="text-white font-semibold">{amount} credits</span>{" "}
                for <span className="text-white font-semibold">${amount}.00</span>.
              </p>

              {/* PayPal */}
              {paypalEnabled && PAYPAL_CLIENT_ID ? (
                <PayPalScriptProvider
                  options={{
                    clientId: PAYPAL_CLIENT_ID,
                    currency: "USD",
                    intent: "capture",
                    components: "buttons",
                    enableFunding: "card",
                  }}
                >
                  <PayPalButtons
                    style={{ layout: "vertical", color: "gold", shape: "pill", label: "pay", height: 46 }}
                    forceReRender={[amount]}
                    onClick={(_d, actions) => {
                      if (!amountRef.current || amountRef.current < 1) {
                        setMsg({ ok: false, text: "Enter an amount of at least $1." });
                        return actions.reject();
                      }
                      setMsg(null);
                      return actions.resolve();
                    }}
                    createOrder={async () => {
                      const res = await fetch("/api/credits/create-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ amount: amountRef.current }),
                      });
                      const d = await res.json();
                      if (!res.ok || !d.id) throw new Error(d.error || "Could not start checkout.");
                      return d.id;
                    }}
                    onApprove={async (data) => {
                      const res = await fetch("/api/credits/capture", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ orderID: data.orderID }),
                      });
                      const d = await res.json();
                      if (!res.ok || !d.ok) {
                        setMsg({ ok: false, text: d.error || "Payment could not be completed." });
                        return;
                      }
                      setBalance(d.balance);
                      setMsg({ ok: true, text: `Added ${d.credited} credits. New balance: ${d.balance}.` });
                      router.refresh();
                    }}
                    onError={() => setMsg({ ok: false, text: "A payment error occurred. Please try again." })}
                  />
                </PayPalScriptProvider>
              ) : null}

              {/* GCash / Card (PHP) via PayMongo — always available */}
              {paypalEnabled && PAYPAL_CLIENT_ID && (
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-white/30 text-xs font-accent">or</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
              )}
              <button
                onClick={payGcash}
                disabled={busy === "__gcash"}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-heading font-semibold text-sm bg-white/[0.06] border border-white/15 text-white hover:border-orange/40 hover:bg-white/[0.09] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {busy === "__gcash"
                  ? "Starting checkout…"
                  : `Pay ₱${(amount * PHP_PER_CREDIT).toLocaleString()} with GCash / Card`}
              </button>
              <p className="text-center text-white/30 text-xs mt-2 font-body">
                Philippine Pesos · via PayMongo
              </p>
            </div>
          </section>
        )}

        {/* Store */}
        {wallet.ready && (
          <section className="mb-10">
            <h2 className="flex items-center gap-2 text-sm font-accent font-bold text-white/40 uppercase tracking-widest mb-4">
              <Lock size={14} /> Spend Credits
            </h2>
            <div className="space-y-6">
              {grouped.map(({ cat, items }) => {
                const CatIcon = CATEGORY_ICON[cat];
                return (
                  <div key={cat}>
                    <div className="flex items-center gap-2 mb-3">
                      <CatIcon size={14} className="text-orange" />
                      <h3 className="text-xs font-accent font-bold text-white/60 uppercase tracking-widest">
                        {CATEGORY_LABELS[cat]}
                      </h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {items.map((item) => {
                        const isOwned = owned.has(item.id);
                        const canAfford = balance >= item.credits;
                        const isBusy = busy === item.id;
                        return (
                          <div
                            key={item.id}
                            className="bg-[#111827] border border-white/10 rounded-2xl p-5 flex flex-col"
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <p className="font-heading font-semibold text-white text-sm">{item.name}</p>
                              <span className="shrink-0 text-orange font-heading font-bold text-sm">
                                {item.credits} cr
                              </span>
                            </div>
                            <p className="text-white/45 text-xs font-body leading-relaxed flex-grow mb-4">
                              {item.description}
                            </p>
                            {isOwned ? (
                              <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-accent font-semibold">
                                  <Check size={13} /> Unlocked
                                </span>
                                {item.href && (
                                  <Link
                                    href={item.href}
                                    className="text-xs font-accent font-semibold text-orange hover:text-orange-light"
                                  >
                                    Open →
                                  </Link>
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={() => unlock(item)}
                                disabled={isBusy || !canAfford}
                                className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-accent font-semibold transition-all ${
                                  canAfford
                                    ? "bg-orange text-white hover:bg-orange-light disabled:opacity-50"
                                    : "bg-white/5 text-white/40 border border-white/10 cursor-not-allowed"
                                }`}
                              >
                                {isBusy ? (
                                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : canAfford ? (
                                  <>
                                    <Lock size={12} /> Unlock for {item.credits}
                                  </>
                                ) : (
                                  <>Need {item.credits - balance} more credits</>
                                )}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* History */}
        {wallet.transactions.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 text-sm font-accent font-bold text-white/40 uppercase tracking-widest mb-4">
              <History size={14} /> Transaction History
            </h2>
            <div className="bg-[#111827] border border-white/10 rounded-2xl divide-y divide-white/5">
              {wallet.transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm text-white font-body">{tx.description || tx.kind}</p>
                    <p className="text-[11px] text-white/35 font-body">
                      {new Date(tx.created_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-heading font-bold ${
                      tx.amount >= 0 ? "text-emerald-400" : "text-white/70"
                    }`}
                  >
                    {tx.amount >= 0 ? "+" : ""}
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
