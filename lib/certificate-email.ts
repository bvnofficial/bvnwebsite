// Emails a student their BVN certificate (PDF attached + verify link).
// Non-fatal by design: any failure is logged and returns false so it NEVER
// blocks certificate issuance. Uses the same Titan/GoDaddy SMTP as the other
// transactional emails on the site.
import nodemailer from "nodemailer";
import type { CompletionRow } from "@/lib/certificate";
import { buildCertificatePdf } from "@/lib/certificate-pdf";

export async function sendCertificateEmail(row: CompletionRow): Promise<boolean> {
  const to = (row.student_email || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    console.error("Certificate email skipped: invalid recipient.");
    return false;
  }

  const user = process.env.EMAIL_ADDRESS;
  const pass = process.env.EMAIL_PASSWORD;
  if (!user || !pass) {
    console.error("Certificate email skipped: SMTP env (EMAIL_ADDRESS/EMAIL_PASSWORD) not set.");
    return false;
  }

  try {
    const pdfBytes = await buildCertificatePdf(row);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtpout.secureserver.net",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: { user, pass },
    });

    const firstName = (row.student_name || "there").split(" ")[0];
    const certUrl = `https://www.bvnofficial.com/certificate/${row.id}`;
    const safeCourse = row.course_title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
    const issued = new Date(row.paid_at ?? row.created_at ?? Date.now()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    await transporter.sendMail({
      from: `"BVN Academy" <${user}>`,
      to,
      bcc: user, // keep a copy for BVN's records
      subject: `🎓 Your BVN Certificate — ${row.course_title}`,
      html: `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
<div style="max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
  <div style="background:linear-gradient(135deg,#0A0F1E,#141b2e);padding:32px;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800">🎓 Congratulations, ${firstName}!</h1>
    <p style="color:rgba(255,255,255,.75);margin:8px 0 0;font-size:14px">Your BVN Certificate of Completion is ready</p>
  </div>
  <div style="padding:32px">
    <p style="color:#333;font-size:15px;line-height:1.6;margin:0 0 20px">
      You've successfully completed <strong>${row.course_title}</strong>. Your official BVN certificate
      is <strong>attached to this email as a PDF</strong> — download it, print it, or share it with clients and employers.
    </p>
    <div style="background:#fff7ef;border:1px solid #f5d6b8;border-radius:12px;padding:18px;margin-bottom:24px">
      <table style="width:100%;font-size:14px;color:#333">
        <tr><td style="padding:4px 0;color:#888">Course</td><td style="padding:4px 0;font-weight:600;text-align:right">${row.course_title}</td></tr>
        <tr><td style="padding:4px 0;color:#888">Awarded to</td><td style="padding:4px 0;font-weight:600;text-align:right">${row.student_name}</td></tr>
        <tr><td style="padding:4px 0;color:#888">Date issued</td><td style="padding:4px 0;font-weight:600;text-align:right">${issued}</td></tr>
      </table>
    </div>
    <div style="text-align:center;margin-bottom:24px">
      <a href="${certUrl}" style="display:inline-block;background:#E86010;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;font-size:15px">
        View &amp; Verify My Certificate
      </a>
    </div>
    <p style="color:#999;font-size:12px;line-height:1.6;text-align:center;margin:0">
      You can verify this certificate any time at<br/>
      <a href="${certUrl}" style="color:#E86010">bvnofficial.com/certificate/${row.id}</a><br/>
      Certificate ID: ${row.id}
    </p>
  </div>
  <div style="background:#0A0F1E;padding:16px 32px;text-align:center">
    <p style="color:rgba(255,255,255,.5);font-size:12px;margin:0">BVN Digital Agency · Learn the skills that pay.</p>
  </div>
</div>
</body></html>`,
      attachments: [
        {
          filename: `BVN-Certificate-${safeCourse}.pdf`,
          content: Buffer.from(pdfBytes),
          contentType: "application/pdf",
        },
      ],
    });

    return true;
  } catch (err) {
    console.error("Certificate email send failed:", err);
    return false;
  }
}
