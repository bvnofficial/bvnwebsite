import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, business, email, phone, services } = body;

  if (!name || !email || !business) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_ADDRESS,
    to: process.env.EMAIL_ADDRESS,
    replyTo: email, // so hitting Reply goes to the lead, not back to yourself
    subject: `🔥 New Website Lead: ${business}`,
    text: [
      `New lead from the demo site CTA`,
      ``,
      `Name: ${name}`,
      `Business: ${business}`,
      `Email: ${email}`,
      `Phone: ${phone || 'Not provided'}`,
      `Services: ${services || 'Not provided'}`,
      ``,
      `Reply to this email to respond directly to ${name}.`,
    ].join('\n'),
  });

  // Confirmation to the lead so they know the message went through (best-effort).
  try {
    const firstName = String(name).trim().split(/\s+/)[0] || 'there';
    await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: `Thanks for reaching out to BVN, ${firstName}`,
      text: [
        `Hi ${firstName},`,
        ``,
        `Thanks for getting in touch about ${business}. I got your message and I'll get back to you personally, usually within a day.`,
        ``,
        `Talk soon,`,
        `Benjamin Vincent Yson`,
        `BVN · bvnofficial.com`,
      ].join('\n'),
    });
  } catch (e) {
    console.error('lead confirmation email failed:', e);
  }

  return NextResponse.json({ success: true });
}
