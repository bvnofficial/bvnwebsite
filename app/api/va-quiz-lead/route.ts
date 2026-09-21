import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// VA niche quiz — optional email capture. Notifies the owner (Reply-To the lead)
// and emails the visitor their niche + course roadmap.
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { email?: string; name?: string; niche?: string; courseSlug?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const email = String(body.email || "").trim();
  const name = String(body.name || "").trim().slice(0, 80);
  const niche = String(body.niche || "").trim().slice(0, 80);
  const courseSlug = String(body.courseSlug || "").trim().replace(/[^a-z0-9-]/gi, "").slice(0, 60);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid email" }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: { user: process.env.EMAIL_ADDRESS, pass: process.env.EMAIL_PASSWORD },
  });

  const courseUrl = courseSlug
    ? `https://www.bvnofficial.com/courses/${courseSlug}`
    : "https://www.bvnofficial.com/courses";

  // Notify the owner; Reply goes straight to the lead.
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: process.env.EMAIL_ADDRESS,
      replyTo: email,
      subject: `🧭 VA Quiz lead: ${niche || "VA"}`,
      text: [
        "New VA niche quiz lead",
        "",
        `Name: ${name || "Not provided"}`,
        `Email: ${email}`,
        `Best-fit niche: ${niche || "Not provided"}`,
        `Course: ${courseUrl}`,
        "",
        "Reply to this email to reach them.",
      ].join("\n"),
    });
  } catch (e) {
    console.error("va-quiz owner email failed:", e);
  }

  // Send the visitor their roadmap.
  try {
    const first = name.split(/\s+/)[0] || "there";
    await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: `Your VA niche: ${niche}`,
      text: [
        `Hi ${first},`,
        "",
        `Your best-fit VA niche is ${niche}, and it is in strong demand right now.`,
        "",
        "Here is the fastest way to start:",
        `1. Take the ${niche} course: ${courseUrl}`,
        "2. Build one small sample project while you learn.",
        "3. Apply to a few jobs a day with that sample. Consistency wins.",
        "",
        "You have got this.",
        "",
        "Benjamin Vincent Yson",
        "BVN · bvnofficial.com",
      ].join("\n"),
    });
  } catch (e) {
    console.error("va-quiz roadmap email failed:", e);
  }

  return NextResponse.json({ ok: true });
}
