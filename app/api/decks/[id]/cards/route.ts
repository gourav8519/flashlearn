import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Deck, Card } from '@/lib/models';
import { requireUser } from '@/lib/auth-server';
import { withErrorHandling, parseBody, isValidObjectId } from '@/lib/api-helpers';
import { cardCreateSchema } from '@/lib/validation';

type RouteCtx = { params: Promise<{ id: string }> };

export const POST = withErrorHandling<RouteCtx>(async (req, { params }) => {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid deck id' }, { status: 400 });
  }

  const { front, back } = await parseBody(req, cardCreateSchema);

  await dbConnect();

  const deck = await Deck.findOne({ _id: id, userId: user._id });
  if (!deck) return NextResponse.json({ error: 'Deck not found' }, { status: 404 });

  const card = await Card.create({
    deckId: deck._id,
    front: front.trim(),
    back: back.trim(),
  });

  return NextResponse.json({
    card: {
      id: card._id.toString(),
      deckId: card.deckId.toString(),
      front: card.front,
      back: card.back,
      interval: card.interval,
      ease: card.ease,
      reps: card.reps,
      due: card.due,
      lapses: card.lapses,
      createdAt: card.createdAt,
    },
  });
});
