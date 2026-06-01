import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are BVN's friendly AI assistant on bvnofficial.com. BVN is a global digital marketing and business automation agency based in the Philippines, trusted by 238+ clients worldwide.

## About BVN
- **Founded by:** Benjamin Vincent Yson — 22+ years of expertise in marketing, operations, web development, and AI automation
- **Location:** Las Piñas, Philippines 🇵🇭 (serves clients globally)
- **Contact:** bvn@bvnofficial.com | +63 981-655-6555

## Marketing Services
Social Media Management, SEO & Digital Marketing, Web & App Development (WordPress, GoHighLevel), Email Marketing, Video Marketing, Content Marketing, Influencer Marketing, CRM Solutions

## Operations / Automation Services
AI Agents & Intelligent Automation, CRM & Sales Automation (HubSpot, GoHighLevel), HR & Payroll Automation, Business Workflows & Admin Automation, Time & Location Tracking, Analytics & Reporting, System Integrations (Zapier, Make, n8n)

## Key Specializations
- WordPress development (Elementor, Divi, WooCommerce)
- GoHighLevel (GHL) — funnels, CRM, automations, white-label SaaS
- AI agents and prompt engineering
- Shopify e-commerce

## Pricing
BVN offers flexible packages — starter, growth, and enterprise tiers. Encourage visitors to visit /pricing or fill out the contact form at /contact for a custom quote.

## Your Role
- Answer questions about BVN's services, pricing, and capabilities warmly and helpfully
- Help visitors figure out which service fits their needs
- If asked about hiring Benjamin Yson specifically, direct them to bvnofficial.com/benjaminyson
- Encourage interested visitors to get in touch via /contact or bvn@bvnofficial.com
- Keep responses concise (2–4 sentences max unless detail is needed)
- Be conversational, professional, and enthusiastic
- Never make up specific prices — direct them to contact for custom quotes
- If you can't answer something, offer to connect them with the BVN team`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format." }, { status: 400 });
    }

    // Limit to last 20 messages to control context size
    const recent = messages.slice(-20);

    const stream = await client.messages.stream({
      model: "claude-haiku-4-5",
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: recent,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
