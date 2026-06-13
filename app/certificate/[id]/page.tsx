import Link from "next/link";
import { createAdminClient } from "@/utils/supabase/admin";
import { PAYMONGO_BASE, pmAuth, type CompletionRow } from "@/lib/certificate";

export const metadata = {
  title: "Your Certificate | BVN",
  robots: { index: false, follow: false },
};

// Server-side: fetch the record. For PayMongo records that aren't marked paid
// yet, verify the checkout session and flip the record to PAID. PayPal records
// are already paid when created.
async function loadCertificate(id: string): Promise<CompletionRow | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("course_completions")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  let row = data as CompletionRow;

  if (!row.paid && row.provider === "paymongo" && row.provider_ref) {
    try {
      const res = await fetch(`${PAYMONGO_BASE}/checkout_sessions/${row.provider_ref}`, {
        headers: { Authorization: pmAuth() },
        cache: "no-store",
      });
      if (res.ok) {
        const session = await res.json();
        const attrs = session?.data?.attributes;
        const status: string =
          attrs?.payment_intent?.attributes?.status ?? attrs?.status ?? "";
        if (status === "succeeded" || status === "paid") {
          const { data: updated } = await supabase
            .from("course_completions")
            .update({ paid: true, paid_at: new Date().toISOString() })
            .eq("id", id)
            .select("*")
            .single();
          if (updated) row = updated as CompletionRow;
        }
      }
    } catch (e) {
      console.error("PayMongo cert verify error:", e);
    }
  }

  return row;
}

export default async function CertificatePage({ params }: { params: { id: string } }) {
  const cert = await loadCertificate(params.id);

  if (!cert) {
    return (
      <div className="min-h-screen bg-[#080C18] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-white/70 font-heading font-bold text-lg mb-2">Certificate not found</p>
          <p className="text-white/40 text-sm mb-6">This certificate link is invalid or has expired.</p>
          <Link href="/courses" className="text-orange text-sm font-accent">← Back to courses</Link>
        </div>
      </div>
    );
  }

  // Payment still pending (e.g. user backed out of QR checkout).
  if (!cert.paid) {
    return (
      <div className="min-h-screen bg-[#080C18] flex items-center justify-center px-6">
        <div className="max-w-md text-center bg-white/[0.04] border border-white/10 rounded-2xl p-8">
          <p className="text-amber-300 font-heading font-bold text-lg mb-2">Payment pending</p>
          <p className="text-white/50 text-sm mb-6 leading-relaxed">
            We haven&apos;t received your payment for this certificate yet. If you just paid, give it a
            moment and refresh. Otherwise you can start the payment again.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href={`/certificate/${cert.id}`}
              className="px-5 py-3 rounded-xl bg-white/10 text-white/80 text-sm font-heading font-semibold hover:bg-white/15"
            >
              Refresh
            </a>
            <Link
              href={`/courses/${cert.course_slug}/certificate`}
              className="px-5 py-3 rounded-xl bg-orange text-white text-sm font-heading font-semibold hover:bg-orange-light"
            >
              Restart payment
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const issued = new Date(cert.paid_at ?? cert.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#080C18] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-accent font-semibold mb-4">
            🎉 Payment confirmed — your certificate is ready
          </div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-white">
            Congratulations, {cert.student_name.split(" ")[0]}!
          </h1>
        </div>

        {/* On-page certificate preview */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-3 border-2 border-[#0A0F1E] rounded-xl pointer-events-none" />
          <div className="absolute inset-[18px] border border-orange/60 rounded-lg pointer-events-none" />
          <div className="relative text-center py-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/bvn-logo.png" alt="BVN Digital Agency" className="h-16 w-auto mx-auto mb-3" />
            <p className="font-heading font-extrabold text-[#0A0F1E] tracking-[0.2em] text-sm mb-1">
              BVN DIGITAL AGENCY
            </p>
            <div className="w-full h-0.5 bg-orange/70 mb-6" />
            <p className="font-serif font-bold text-[#0A0F1E] text-2xl md:text-3xl mb-2" style={{ fontFamily: "Georgia, serif" }}>
              Certificate of Completion
            </p>
            <p className="text-gray-500 text-sm mb-6">This certificate is proudly presented to</p>
            <p className="font-bold text-orange text-3xl md:text-4xl mb-2" style={{ fontFamily: "Georgia, serif" }}>
              {cert.student_name}
            </p>
            <div className="w-48 h-px bg-yellow mx-auto mb-6" />
            <p className="text-gray-500 text-sm mb-2">for successfully completing the course</p>
            <p className="font-heading font-bold text-[#0A0F1E] text-lg md:text-xl mb-8">
              {cert.course_title}
            </p>
            <div className="flex justify-between items-end max-w-md mx-auto mt-10 text-left">
              <div>
                <p className="font-heading font-semibold text-[#0A0F1E] text-sm border-b border-gray-300 pb-1">{issued}</p>
                <p className="text-gray-400 text-xs mt-1">Date Issued</p>
              </div>
              <div className="text-right">
                <p className="font-heading font-semibold text-[#0A0F1E] text-sm border-b border-gray-300 pb-1">Benjamin Yson</p>
                <p className="text-gray-400 text-xs mt-1">Founder, BVN Digital Agency</p>
              </div>
            </div>
            <p className="text-gray-300 text-[10px] mt-8">Certificate ID: {cert.id}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <a
            href={`/api/certificate/${cert.id}/pdf`}
            className="w-full sm:w-auto text-center px-6 py-3 rounded-xl bg-orange text-white font-heading font-semibold text-sm shadow-[0_0_24px_rgba(232,96,16,0.35)] hover:bg-orange-light transition-all"
          >
            ⬇ Download PDF Certificate
          </a>
          <Link
            href={`/courses/${cert.course_slug}`}
            className="w-full sm:w-auto text-center px-6 py-3 rounded-xl border border-white/15 text-white/70 font-heading font-semibold text-sm hover:bg-white/5 transition-all"
          >
            Back to course
          </Link>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          Save your Certificate ID to verify this certificate any time at this page.
        </p>
      </div>
    </div>
  );
}
