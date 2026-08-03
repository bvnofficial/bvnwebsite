import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/lib/admin";
import { profile, pipeline, today } from "@/data/command-center";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Build a compact snapshot of Benjamin's current state so BVN answers grounded.
function buildContext(): string {
  const clients = pipeline
    .map((c) => `- ${c.name} [${c.stage}, ${c.health}]: ${c.next}`)
    .join("\n");
  const tasks = today.map((t) => `- (${t.priority}) ${t.text}${t.client ? ` [${t.client}]` : ""}`).join("\n");
  return `CURRENT STATE (source of truth for answers):

CLIENTS / PIPELINE:
${clients}

TODAY'S TASKS:
${tasks}

TARGET ROLES: ${profile.targetRoles.join("; ")}`;
}

const SYSTEM = `You are "BVN", Benjamin Vincent Yson's personal command-center assistant. You speak to Benjamin himself, not to clients or website visitors. You are practical, direct, and warm, like a sharp chief of staff who knows his business.

Ground every answer in the CURRENT STATE below. If something is not in that state or you are unsure, say so plainly rather than guessing. Keep spoken answers short (1 to 3 sentences) unless he asks for detail. Never use dashes as punctuation. When he asks what to do next, prioritise high-priority tasks and blocked clients.

${buildContext()}`;

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY is not set on the server." }, { status: 503 });
    }

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages." }, { status: 400 });
    }
    const recent = messages.slice(-16);

    const stream = await client.messages.stream({
      model: "claude-haiku-4-5",
      max_tokens: 600,
      system: SYSTEM,
      messages: recent,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
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
    console.error("command chat error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
