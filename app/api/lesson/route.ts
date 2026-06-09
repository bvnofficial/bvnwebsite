import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "Lesson AI not configured. Add ANTHROPIC_API_KEY to .env.local." }, { status: 503 });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const { courseTitle, moduleTitle, lessonTitle, lessonDuration, skills } = await req.json();

    if (!courseTitle || !lessonTitle) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const system = `You are an expert educator writing a lesson for BVN Academy, a free VA (Virtual Assistant) training platform.
Write practical, engaging lesson content for working adults who want to become professional VAs.
Use clear, direct language. No fluff. Every sentence should add value.
Format your response using these exact markers so the UI can parse sections:

##OVERVIEW##
2-3 sentences explaining what this lesson covers and why it matters for a VA's career.

##CONCEPTS##
List 4-6 key concepts or terms (one per line, format: **Term**: explanation)

##CONTENT##
The main lesson body. Use ## for subheadings, bullet points for lists, and **bold** for important terms.
Be practical — include real tools, workflows, and examples a VA would actually use.
Write 400-600 words.

##EXERCISE##
A hands-on task the learner can do right now to practice the skill. Be specific about steps.

##SUMMARY##
3-5 bullet points summarizing the key takeaways from this lesson.`;

    const userMsg = `Course: ${courseTitle}
Module: ${moduleTitle}
Lesson: ${lessonTitle}
Duration: ${lessonDuration}
Skills covered in this course: ${skills?.join(", ")}

Write this lesson now.`;

    const stream = await client.messages.stream({
      model: "claude-haiku-4-5",
      max_tokens: 1200,
      system,
      messages: [{ role: "user", content: userMsg }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
          controller.close();
        } catch (streamErr) {
          controller.error(streamErr);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: unknown) {
    console.error("Lesson API error:", err);
    // Surface billing / auth errors clearly
    const msg = (err as { error?: { error?: { message?: string }; message?: string }; message?: string })
      ?.error?.error?.message
      ?? (err as { message?: string })?.message
      ?? "Failed to load lesson content.";
    const status = (err as { status?: number })?.status === 400 ? 402 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
