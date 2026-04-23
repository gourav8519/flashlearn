import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Deck, Card } from '@/lib/models';
import { requireUser } from '@/lib/auth-server';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { id } = await params;
  await dbConnect();

  const deck = await Deck.findOne({ _id: id, userId: user._id });
  if (!deck) return NextResponse.json({ error: 'Deck not found' }, { status: 404 });

  await Card.deleteMany({ deckId: deck._id });
  await deck.deleteOne();

  return NextResponse.json({ ok: true });
}
