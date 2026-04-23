import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Card, Deck } from '@/lib/models';
import { requireUser } from '@/lib/auth-server';
import { withErrorHandling, parseBody, isValidObjectId } from '@/lib/api-helpers';
import { cardPatchSchema } from '@/lib/validation';

type RouteCtx = { params: Promise<{ id: string }> };

async function assertOwned(userId: string, cardId: string) {
  await dbConnect();
  const card = await Card.findById(cardId);
  if (!card) return { error: 'Card not found', status: 404 as const };
  const deck = await Deck.findOne({ _id: card.deckId, userId });
  if (!deck) return { error: 'Not authorised', status: 403 as const };
  return { card };
}

export const PATCH = withErrorHandling<RouteCtx>(async (req, { params }) => {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid card id' }, { status: 400 });
  }

  const { front, back, due } = await parseBody(req, cardPatchSchema);

  const result = await assertOwned(user._id.toString(), id);
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  result.card.front = front.trim();
  result.card.back = back.trim();
  if (typeof due === 'number') result.card.due = due;
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
});

export const DELETE = withErrorHandling<RouteCtx>(async (_req: NextRequest, { params }) => {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid card id' }, { status: 400 });
  }

  const result = await assertOwned(user._id.toString(), id);
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  await result.card.deleteOne();
  return NextResponse.json({ ok: true });
});
