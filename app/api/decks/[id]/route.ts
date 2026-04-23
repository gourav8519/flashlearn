import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Deck, Card } from '@/lib/models';
import { requireUser } from '@/lib/auth-server';
import { withErrorHandling, isValidObjectId } from '@/lib/api-helpers';

type RouteCtx = { params: Promise<{ id: string }> };

export const DELETE = withErrorHandling<RouteCtx>(async (_req, { params }) => {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid deck id' }, { status: 400 });
  }

  await dbConnect();

  const deck = await Deck.findOne({ _id: id, userId: user._id });
  if (!deck) return NextResponse.json({ error: 'Deck not found' }, { status: 404 });

  await Card.deleteMany({ deckId: deck._id });
  await deck.deleteOne();

  return NextResponse.json({ ok: true });
});
