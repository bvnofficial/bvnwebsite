import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import type { CompletionRow } from "@/lib/certificate";
import { sendCertificateEmail } from "@/lib/certificate-email";

// Re-sends the certificate email for a paid cert. Always sends to the email
// ON FILE (can't be redirected by the caller), so it's safe to expose on the
// certificate page. Cert ids are unguessable UUIDs.
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
    }

    const { data, error } = await admin
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

    const ok = await sendCertificateEmail(row);
    if (!ok) {
      return NextResponse.json(
        { error: "Could not send the email right now. Please try again shortly." },
        { status: 500 }
      );
    }

    // Masked confirmation, e.g. "be***@gmail.com".
    const masked = row.student_email.replace(/^(.{1,2}).*(@.*)$/, "$1***$2");
    return NextResponse.json({ ok: true, email: masked });
  } catch (err) {
    console.error("cert resend route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
