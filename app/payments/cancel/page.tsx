import Link from "next/link";
import Image from "next/image";
import { XCircle, ChevronRight, RefreshCw } from "lucide-react";

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center px-4 py-24">
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(ellipse, rgba(232,96,16,0.3), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative w-full max-w-md text-center">
        <div className="bg-[#111827] border border-white/8 rounded-3xl overflow-hidden shadow-2xl">

          <div className="px-8 py-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <Image src="/bvn-logo.png" alt="BVN" width={32} height={32} />
              <span className="font-heading font-bold text-white/70 text-sm">BVN Digital Agency</span>
            </Link>

            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <XCircle size={40} className="text-white/30" />
            </div>

            <h1 className="font-heading font-extrabold text-white text-2xl mb-2">Payment Cancelled</h1>
            <p className="text-white/40 text-sm mb-8">
              No worries — you were not charged. You can try again whenever you&apos;re ready.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/payments"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-orange text-white font-heading font-bold text-sm rounded-xl
                  hover:bg-orange-light transition-all shadow-[0_0_20px_rgba(232,96,16,0.3)]"
              >
                <RefreshCw size={14} />
                Try Again
              </Link>
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white/5 border border-white/10 text-white font-heading font-bold text-sm rounded-xl
                  hover:bg-white/10 transition-all"
              >
                Back to Home <ChevronRight size={14} />
              </Link>
            </div>

            <p className="text-white/25 text-xs mt-6">
              Need help?{" "}
              <Link href="/contact" className="text-orange hover:underline">
                Contact us
              </Link>{" "}
              at bvn@bvnofficial.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
