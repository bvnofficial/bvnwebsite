import { notFound } from "next/navigation";
import type { Metadata } from "next";
import QRCode from "qrcode";
import { CheckCircle2, Download, ShieldCheck, Building2 } from "lucide-react";
import { COE_RECORDS, getCoe, coeIssuedLabel } from "@/lib/coe";

export function generateStaticParams() {
  return COE_RECORDS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
): Promise<Metadata> {
  const rec = getCoe(params.slug);
  if (!rec) return { title: "Certificate of Employment | BVN" };
  return {
    title: `Certificate of Employment — ${rec.name} | BVN`,
    description: `Official BVN verification: ${rec.name} was employed as ${rec.role} (${rec.start} to ${rec.end}).`,
    robots: { index: false, follow: false },
  };
}

export default async function CoeVerifyPage({ params }: { params: { slug: string } }) {
  const rec = getCoe(params.slug);
  if (!rec) notFound();

  const verifyUrl = `https://www.bvnofficial.com/coe/${rec.slug}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 0,
    width: 240,
    color: { dark: "#0A0F1E", light: "#00000000" },
    errorCorrectionLevel: "M",
  });

  const rows: { k: string; v: string }[] = [
    { k: "Employee", v: `${rec.honorific ? rec.honorific + " " : ""}${rec.name}` },
    { k: "Position", v: rec.role },
    { k: "Employment period", v: `${rec.start} — ${rec.end}` },
    { k: "Employer", v: "BVN Digital Marketing Agency" },
    { k: "Date issued", v: coeIssuedLabel(rec.issued) },
    { k: "Reference no.", v: rec.refId },
  ];

  return (
    <div className="min-h-screen bg-[#080C18] pt-28 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Verified banner */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-accent font-semibold">
            <ShieldCheck size={16} /> Verified by BVN
          </span>
        </div>

        <div className="bg-white/[0.04] border border-white/10 rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-white/10 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/bvn-logo.png" alt="BVN" className="h-11 mx-auto mb-4" />
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-white">
              Certificate of Employment
            </h1>
            <p className="text-white/45 text-sm mt-2">
              Official employment record issued by BVN Digital Marketing Agency.
            </p>
          </div>

          {/* Details */}
          <div className="px-8 py-6">
            <dl className="divide-y divide-white/8">
              {rows.map(({ k, v }) => (
                <div key={k} className="flex flex-wrap justify-between gap-2 py-3">
                  <dt className="text-white/45 text-sm font-accent">{k}</dt>
                  <dd className="text-white font-heading font-semibold text-sm text-right">{v}</dd>
                </div>
              ))}
            </dl>

            {rec.responsibilities && rec.responsibilities.length > 0 && (
              <div className="mt-6 pt-5 border-t border-white/8">
                <p className="text-white/45 text-xs font-accent uppercase tracking-wider mb-4">
                  Roles &amp; Responsibilities
                </p>
                <div className="space-y-4">
                  {rec.responsibilities.map((g) => (
                    <div key={g.area}>
                      <p className="text-orange text-xs font-heading font-bold uppercase tracking-wide mb-1.5">
                        {g.area}
                      </p>
                      <ul className="space-y-1">
                        {g.items.map((it, i) => (
                          <li key={i} className="flex gap-2 text-white/60 text-[13px] leading-relaxed">
                            <span className="text-orange/70 shrink-0">•</span>
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mt-6 text-emerald-400/90 text-sm">
              <CheckCircle2 size={16} />
              This employment record is authentic and published by BVN.
            </div>

            {/* Actions + QR */}
            <div className="flex flex-col sm:flex-row items-center gap-5 mt-7 pt-6 border-t border-white/10">
              <a
                href={`/coe/${rec.slug}.pdf`}
                download
                className="flex-1 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-orange text-white font-heading font-semibold text-sm shadow-[0_0_24px_rgba(232,96,16,0.3)] hover:bg-orange-light transition-all"
              >
                <Download size={16} /> Download official PDF
              </a>
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="Scan to verify" className="w-16 h-16 bg-white rounded-lg p-1" />
                <span className="text-white/40 text-xs leading-relaxed max-w-[120px]">
                  Scan to verify this certificate
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-white/[0.02] border-t border-white/10 flex items-center gap-2 text-white/35 text-xs">
            <Building2 size={13} />
            BVN Digital Marketing Agency · bvnofficial.com · bvn@bvnofficial.com · +63 981 655 6555
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-5">
          Verify authenticity at <span className="text-white/50">{verifyUrl}</span>
        </p>
      </div>
    </div>
  );
}
