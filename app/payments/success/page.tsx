"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ChevronRight, Loader2, AlertCircle } from "lucide-react";

interface SessionDetails {
  amount: number;
  description: string;
  customerName: string;
  customerEmail: string;
  paymentMethod: string;
  status: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("checkout_session_id") || "";

  const [details, setDetails] = useState<SessionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found.");
      setLoading(false);
      return;
    }

    fetch(`/api/payment/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setDetails(data);
        }
      })
      .catch(() => setError("Could not load payment details."))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="text-orange animate-spin mx-auto mb-4" />
          <p className="text-white/50 text-sm">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h1 className="font-heading font-bold text-white text-xl mb-2">Verification Failed</h1>
          <p className="text-white/40 text-sm mb-6">{error}</p>
          <p className="text-white/30 text-xs mb-6">
            If you completed payment, you will receive an email receipt from PayMongo.
            Contact us at bvn@bvnofficial.com with your transaction ID.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-orange text-white font-heading font-bold text-sm rounded-xl hover:bg-orange-light transition-all">
            Back to Home <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  const phpAmount = details
    ? "₱" + (details.amount / 100).toLocaleString("en-PH", { minimumFractionDigits: 2 })
    : "—";

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center px-4 py-24">
      {/* BG glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(ellipse, rgba(16,185,129,0.3), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-[#111827] border border-emerald-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">

          {/* Header */}
          <div
            style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}
            className="px-8 py-10 text-center"
          >
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Image src="/bvn-logo.png" alt="BVN" width={32} height={32} />
              <span className="font-heading font-bold text-white/80 text-sm">BVN Digital Agency</span>
            </Link>
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle size={48} className="text-white" />
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-white mb-1">Payment Successful!</h1>
            <p className="text-emerald-100 text-sm">Thank you — your payment has been confirmed.</p>
          </div>

          {/* Details */}
          <div className="p-8">
            <div className="bg-[#0A0F1E] rounded-2xl p-5 mb-5 text-center border border-white/8">
              <p className="text-white/30 text-xs uppercase tracking-widest mb-2">Amount Paid</p>
              <p className="font-heading font-black text-orange text-3xl">{phpAmount}</p>
              {details?.description && (
                <p className="text-white/40 text-sm mt-1">{details.description}</p>
              )}
            </div>

            <div className="space-y-3 mb-6">
              {details?.customerName && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Name</span>
                  <span className="text-white">{details.customerName}</span>
                </div>
              )}
              {details?.customerEmail && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Email</span>
                  <span className="text-white">{details.customerEmail}</span>
                </div>
              )}
              {details?.paymentMethod && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Method</span>
                  <span className="text-white capitalize">{details.paymentMethod.replace(/_/g, " ")}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Session ID</span>
                <span className="text-white/60 font-mono text-xs">{sessionId?.slice(0, 20)}…</span>
              </div>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-3 mb-6 text-center">
              <p className="text-white/40 text-xs leading-relaxed">
                A receipt has been sent to{" "}
                <span className="text-white">{details?.customerEmail}</span>. Our team
                will reach out within 24 hours to kick off your project.
              </p>
            </div>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-orange text-white font-heading font-bold text-sm rounded-xl
                hover:bg-orange-light transition-all shadow-[0_0_25px_rgba(232,96,16,0.3)]"
            >
              Back to Home <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
          <Loader2 size={32} className="text-orange animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
