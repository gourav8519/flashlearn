import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Card, Deck } from '@/lib/models';
import { requireUser } from '@/lib/auth-server';

async function assertOwned(userId: string, cardId: string) {
  await dbConnect();
  const card = await Card.findById(cardId);
  if (!card) return { error: 'Card not found', status: 404 as const };
  const deck = await Deck.findOne({ _id: card.deckId, userId });
  if (!deck) return { error: 'Not authorised', status: 403 as const };
  return { card };
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { id } = await params;
  const { front, back, due } = await req.json();
  if (!front?.trim() || !back?.trim()) {
    return NextResponse.json({ error: 'Front and back are required' }, { status: 400 });
  }

  const result = await assertOwned(user._id.toString(), id);
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status });

  result.card.front = front.trim();
  result.card.back = back.trim();
  if (typeof due === 'number' && Number.isFinite(due) && due > 0) {
    result.card.due = due;
  }
  await result.card.save();

  return NextResponse.json({
    card: {
      id: result.card._id.toString(),
      deckId: result.card.deckId.toString(),
      front: result.card.front,
      back: result.card.back,
      interval: result.card.interval,
      ease: result.card.ease,
      reps: result.card.reps,
      due: result.card.due,
      lapses: result.card.lapses,
      createdAt: result.card.createdAt,
    },
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { id } = await params;
  const result = await assertOwned(user._id.toString(), id);
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status });

  await result.card.deleteOne();
  return NextResponse.json({ ok: true });
}
