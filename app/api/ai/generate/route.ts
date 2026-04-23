import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { requireUser } from '@/lib/auth-server';
import { resolveGroqKey } from '@/lib/ai-config';
import { checkRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 60;

const SYSTEM_PROMPT = `You generate flashcards from study material for use with a spaced repetition system (SM-2).

Rules for great flashcards:
1. One concept per card. Break compound ideas into multiple cards.
2. Minimum information principle. Shortest question that still uniquely cues the answer.
3. Active recall. Phrase fronts as questions, fill-in-blanks, or "define X" — never "this card covers X".
4. Atomic answers. 1-2 sentences, no filler. Never "The answer is..." — just the answer.
5. Avoid yes/no questions. They teach nothing.
6. Preserve technical terms exactly as they appear in the source.

You MUST respond with ONLY valid JSON matching this exact shape (no markdown, no commentary):
{
  "cards": [
    { "front": "question text", "back": "answer text" }
  ]
}`;

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const rl = checkRateLimit(`ai:${user._id.toString()}`, 10, 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Slow down — try again in ${rl.retryAfter}s.` },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    );
  }

  const apiKey = resolveGroqKey(user.groqApiKey);
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Add your free Groq API key in Settings to enable AI generation.' },
      { status: 503 },
    );
  }

  let body: { notes?: string; count?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const notes = (body.notes ?? '').trim();
  const count = Math.min(Math.max(Number(body.count) || 8, 1), 25);

  if (notes.length < 20) {
    return NextResponse.json(
      { error: 'Please provide at least 20 characters of notes to generate from.' },
      { status: 400 },
    );
  }
  if (notes.length > 20_000) {
    return NextResponse.json(
      { error: 'Notes are too long. Keep under 20,000 characters.' },
      { status: 400 },
    );
  }

  const groq = new Groq({ apiKey });

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_completion_tokens: 4096,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Generate exactly ${count} high-quality flashcards from the notes below.\n\nNOTES:\n"""\n${notes}\n"""\n\nReturn the JSON object now.`,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: 'Model returned no content' }, { status: 502 });
    }

    let parsed: { cards?: Array<{ front?: string; back?: string }> };
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json({ error: 'Model returned invalid JSON' }, { status: 502 });
    }

    const cards = (parsed.cards ?? [])
      .map((c) => ({ front: String(c.front ?? '').trim(), back: String(c.back ?? '').trim() }))
      .filter((c) => c.front && c.back);

    if (cards.length === 0) {
      return NextResponse.json(
        { error: 'The model did not return any usable cards. Try different notes.' },
        { status: 502 },
      );
    }

    return NextResponse.json({
      cards,
      usage: {
        prompt_tokens: completion.usage?.prompt_tokens ?? 0,
        completion_tokens: completion.usage?.completion_tokens ?? 0,
      },
    });
  } catch (err) {
    console.error('Groq generation error', err);
    const msg = err instanceof Error ? err.message : 'AI generation failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
