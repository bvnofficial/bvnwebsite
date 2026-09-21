import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import type { CompletionRow } from "@/lib/certificate";
import { buildCertificatePdf } from "@/lib/certificate-pdf";

// Generates the downloadable PDF certificate. Only paid records produce a PDF.
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("course_completions")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
  }

  const row = data as CompletionRow;
  if (!row.paid) {
    return NextResponse.json({ error: "Payment not completed." }, { status: 402 });
  }

  const bytes = await buildCertificatePdf(row);

  const safeCourse = row.course_title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="BVN-Certificate-${safeCourse}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
