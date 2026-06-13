import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getCourse } from "@/lib/courses";
import { createAdminClient } from "@/utils/supabase/admin";
import {
  CERT_PRICE_PHP,
  PAYMONGO_BASE,
  pmAuth,
  certDescription,
} from "@/lib/certificate";

// Resolve the site origin from the request so PayMongo redirects back to the
// same environment the checkout started in (localhost when testing, the live
// domain in production) instead of a hardcoded URL.
function resolveBaseUrl(req: Request): string {
  const origin = req.headers.get("origin");
  if (origin) return origin.replace(/\/$/, "");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (host) {
    const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  }
  return "https://www.bvnofficial.com";
}

// Creates a PENDING certificate record + a PayMongo QR Ph checkout session.
// Returns the checkout URL the student is redirected to. The record flips to
// PAID on the /certificate/<id> page once PayMongo confirms the payment.
export async function POST(req: Request) {
  try {
    const baseUrl = resolveBaseUrl(req);
    const { name, email, courseSlug } = await req.json();

    if (!name || !email || !courseSlug) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    const course = getCourse(String(courseSlug));
    if (!course) {
      return NextResponse.json({ error: "Unknown course." }, { status: 404 });
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Certificate service is not configured yet." },
        { status: 503 }
      );
    }

    const id = randomUUID();
    const description = certDescription(course.title);

    // 1. Insert the pending record first, so it exists when PayMongo redirects back.
    const { error: insertErr } = await supabase.from("course_completions").insert({
      id,
      course_slug: course.slug,
      course_title: course.title,
      student_name: String(name).trim().slice(0, 120),
      student_email: String(email).trim().toLowerCase().slice(0, 160),
      amount: CERT_PRICE_PHP,
      currency: "PHP",
      provider: "paymongo",
      paid: false,
    });

    if (insertErr) {
      console.error("Certificate insert error:", insertErr.message);
      return NextResponse.json({ error: "Could not start certificate checkout." }, { status: 500 });
    }

    // 2. Create the PayMongo QR Ph checkout session.
    const body = {
      data: {
        attributes: {
          billing: { name: String(name).trim(), email: String(email).trim() },
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          description,
          line_items: [
            {
              currency: "PHP",
              amount: Math.round(CERT_PRICE_PHP * 100),
              name: description,
              quantity: 1,
            },
          ],
          payment_method_types: ["qrph"],
          success_url: `${baseUrl}/certificate/${id}`,
          cancel_url: `${baseUrl}/courses/${course.slug}/certificate`,
          metadata: { certificate_id: id, course_slug: course.slug },
        },
      },
    };

    const sessionRes = await fetch(`${PAYMONGO_BASE}/checkout_sessions`, {
      method: "POST",
      headers: { Authorization: pmAuth(), "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!sessionRes.ok) {
      const err = await sessionRes.json().catch(() => ({}));
      const pmMsg = err?.errors?.[0]?.detail ?? "Could not start QR payment.";
      console.error("PayMongo cert session error:", JSON.stringify(err));
      return NextResponse.json({ error: pmMsg }, { status: 500 });
    }

    const session = await sessionRes.json();
    const checkoutUrl: string = session?.data?.attributes?.checkout_url;
    const sessionId: string = session?.data?.id;

    if (!checkoutUrl) {
      return NextResponse.json({ error: "No checkout URL returned." }, { status: 500 });
    }

    // 3. Store the session id on the record for verification on the cert page.
    await supabase
      .from("course_completions")
      .update({ provider_ref: sessionId })
      .eq("id", id);

    return NextResponse.json({ checkoutUrl, id });
  } catch (err) {
    console.error("Certificate checkout route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
