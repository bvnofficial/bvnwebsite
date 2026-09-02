import Link from "next/link";
import QRCode from "qrcode";
import { createAdminClient } from "@/utils/supabase/admin";
import { PAYMONGO_BASE, pmAuth, type CompletionRow } from "@/lib/certificate";
import { sendCertificateEmail } from "@/lib/certificate-email";
import ResendButton from "./ResendButton";

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
          // Atomic flip: only the request that actually transitions the row
          // from unpaid → paid gets a row back, so the certificate email is
          // sent EXACTLY ONCE even if several page loads race on confirmation.
          const { data: updated } = await supabase
            .from("course_completions")
            .update({ paid: true, paid_at: new Date().toISOString() })
            .eq("id", id)
            .eq("paid", false)
            .select("*")
            .maybeSingle();
          if (updated) {
            row = updated as CompletionRow;
            // First (and only) confirmation — email it to the student (non-fatal).
            await sendCertificateEmail(row);
          } else {
            // A concurrent request already flipped it; just show the paid record.
            const { data: fresh } = await supabase
              .from("course_completions")
              .select("*")
              .eq("id", id)
              .single();
            if (fresh) row = fresh as CompletionRow;
          }
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

  const verifyUrl = `https://www.bvnofficial.com/certificate/${cert.id}`;
  // Verification QR — generated server-side, no external service.
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 0,
    width: 240,
    color: { dark: "#0A0F1E", light: "#00000000" },
    errorCorrectionLevel: "M",
  });

  // LinkedIn "Add to profile" deep link.
  const issuedDate = new Date(cert.paid_at ?? cert.created_at);
  const liUrl =
    "https://www.linkedin.com/profile/add?" +
    new URLSearchParams({
      startTask: "CERTIFICATION_NAME",
      name: `${cert.course_title} — BVN Certificate of Completion`,
      organizationName: "BVN Digital Agency",
      issueYear: String(issuedDate.getFullYear()),
      issueMonth: String(issuedDate.getMonth() + 1),
      certId: cert.id,
      certUrl: verifyUrl,
    }).toString();

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
          <p className="text-white/40 text-sm mt-2">
            You&apos;ve earned an official BVN Certificate of Completion.
          </p>
        </div>

        {/* ── Premium on-page certificate ─────────────────────────── */}
        <div
          className="relative overflow-hidden rounded-2xl p-6 md:p-10 shadow-2xl"
          style={{ background: "linear-gradient(135deg, #ffffff 0%, #fbfcff 55%, #fff7ef 100%)" }}
        >
          {/* Guilloché / watermark logo behind content */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/bvn-logo.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute left-1/2 top-1/2 w-[70%] max-w-xl -translate-x-1/2 -translate-y-1/2 opacity-[0.04]"
          />

          {/* Double frame */}
          <div className="absolute inset-3 border-2 border-[#0A0F1E] rounded-xl pointer-events-none" />
          <div className="absolute inset-[18px] border border-orange/60 rounded-lg pointer-events-none" />

          {/* Ornamental corner flourishes */}
          {[
            "top-4 left-4",
            "top-4 right-4 rotate-90",
            "bottom-4 right-4 rotate-180",
            "bottom-4 left-4 -rotate-90",
          ].map((pos, i) => (
            <svg
              key={i}
              className={`absolute ${pos} pointer-events-none`}
              width="54" height="54" viewBox="0 0 54 54" fill="none"
            >
              <path d="M2 26 V6 A4 4 0 0 1 6 2 H26" stroke="#E86010" strokeWidth="2" strokeLinecap="round" />
              <path d="M2 40 V10 M10 2 H40" stroke="#0A0F1E" strokeWidth="1" opacity="0.35" />
              <circle cx="6" cy="6" r="2.2" fill="#F5A623" />
            </svg>
          ))}

          {/* Content */}
          <div className="relative text-center py-4 md:py-6">
            {/* Real logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/bvn-logo.png" alt="BVN Digital Agency" className="h-20 w-auto mx-auto mb-2" />
            <p className="font-heading font-extrabold text-[#0A0F1E] tracking-[0.28em] text-sm mb-3">
              BVN DIGITAL AGENCY
            </p>

            {/* Decorative divider with diamond */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="h-px w-16 md:w-28" style={{ background: "linear-gradient(90deg, transparent, #E86010)" }} />
              <span className="w-2 h-2 rotate-45 bg-orange" />
              <span className="h-px w-16 md:w-28" style={{ background: "linear-gradient(90deg, #E86010, transparent)" }} />
            </div>

            <p className="font-serif font-bold text-[#0A0F1E] text-3xl md:text-4xl mb-1 tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
              Certificate of Completion
            </p>
            <p className="text-gray-500 text-sm mb-6">This certificate is proudly presented to</p>

            <p className="font-bold text-orange text-4xl md:text-5xl mb-3" style={{ fontFamily: "Georgia, serif" }}>
              {cert.student_name}
            </p>
            <div className="w-56 h-0.5 mx-auto mb-6" style={{ background: "linear-gradient(90deg, transparent, #F5A623, transparent)" }} />

            <p className="text-gray-500 text-sm mb-2">for successfully completing the course</p>
            <p className="font-heading font-bold text-[#0A0F1E] text-xl md:text-2xl mb-3">
              {cert.course_title}
            </p>
            <p className="text-gray-400 text-xs max-w-md mx-auto mb-8 leading-relaxed">
              In recognition of dedication, skill, and the successful completion of all coursework and assessments.
            </p>

            {/* Date · Seal · Signature */}
            <div className="grid grid-cols-3 items-end gap-2 max-w-xl mx-auto mt-6">
              <div className="text-left">
                <p className="font-heading font-semibold text-[#0A0F1E] text-sm border-b border-gray-300 pb-1">{issued}</p>
                <p className="text-gray-400 text-[11px] mt-1">Date Issued</p>
              </div>

              {/* Gold seal medallion */}
              <div className="flex justify-center">
                <svg width="96" height="112" viewBox="0 0 96 112" fill="none" className="drop-shadow">
                  {/* ribbon tails */}
                  <path d="M36 78 L30 108 L44 98 Z" fill="#E86010" />
                  <path d="M60 78 L66 108 L52 98 Z" fill="#C2410C" />
                  {/* starburst */}
                  <g>
                    {Array.from({ length: 24 }).map((_, i) => (
                      <rect
                        key={i}
                        x="46" y="2" width="4" height="14" rx="1"
                        fill="#F5A623"
                        transform={`rotate(${i * 15} 48 48)`}
                      />
                    ))}
                  </g>
                  <circle cx="48" cy="48" r="34" fill="#F5A623" />
                  <circle cx="48" cy="48" r="34" fill="none" stroke="#C2410C" strokeWidth="1.5" />
                  <circle cx="48" cy="48" r="27" fill="#0A0F1E" />
                  <circle cx="48" cy="48" r="27" fill="none" stroke="#F5A623" strokeWidth="1" />
                  <text x="48" y="46" textAnchor="middle" fontFamily="Georgia, serif" fontSize="16" fontWeight="bold" fill="#F5A623">BVN</text>
                  <text x="48" y="60" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="6" letterSpacing="1.5" fill="#ffffff">CERTIFIED</text>
                </svg>
              </div>

              <div className="text-right">
                <p className="font-semibold text-[#0A0F1E] text-base border-b border-gray-300 pb-1" style={{ fontFamily: "'Brush Script MT', cursive" }}>Benjamin Yson</p>
                <p className="text-gray-400 text-[11px] mt-1">Founder, BVN Digital Agency</p>
              </div>
            </div>

            {/* Verification footer with QR */}
            <div className="flex items-center justify-center gap-4 mt-10 pt-6 border-t border-gray-200 max-w-xl mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt="Scan to verify certificate" className="w-16 h-16" />
              <div className="text-left">
                <p className="text-[#0A0F1E] text-xs font-heading font-semibold flex items-center gap-1">
                  <span className="text-emerald-600">✔</span> Verified Certificate
                </p>
                <p className="text-gray-400 text-[10px] mt-0.5">Scan or visit to verify authenticity</p>
                <p className="text-gray-400 text-[10px] mt-0.5 font-mono">ID: {cert.id}</p>
              </div>
            </div>
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
          <a
            href={liUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-center px-6 py-3 rounded-xl bg-[#0A66C2] text-white font-heading font-semibold text-sm hover:brightness-110 transition-all"
          >
            in  Add to LinkedIn
          </a>
          <ResendButton id={cert.id} />
          <Link
            href={`/courses/${cert.course_slug}`}
            className="w-full sm:w-auto text-center px-6 py-3 rounded-xl border border-white/15 text-white/70 font-heading font-semibold text-sm hover:bg-white/5 transition-all"
          >
            Back to course
          </Link>
        </div>

        <p className="text-center text-white/30 text-xs mt-3">
          A copy was emailed to you when this certificate was issued. Use the button above to resend it.
        </p>

        <p className="text-center text-white/30 text-xs mt-6">
          Save your Certificate ID to verify this certificate any time at{" "}
          <span className="text-white/50">bvnofficial.com/certificate/{cert.id}</span>
        </p>
      </div>
    </div>
  );
}
