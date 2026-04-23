import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Deck } from '@/lib/models';
import { requireUser } from '@/lib/auth-server';
import { DECK_COLOR_PALETTE } from '@/lib/seed';

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { name, description } = await req.json();
  if (!name || !name.trim()) {
    return NextResponse.json({ error: 'Deck name is required' }, { status: 400 });
  }

  await dbConnect();
  const existingCount = await Deck.countDocuments({ userId: user._id });
  const color = DECK_COLOR_PALETTE[existingCount % DECK_COLOR_PALETTE.length];

  const deck = await Deck.create({
    userId: user._id,
    name: name.trim(),
    description: (description ?? '').trim(),
    color,
  });

  return NextResponse.json({
    deck: {
      id: deck._id.toString(),
      userId: deck.userId.toString(),
      name: deck.name,
      description: deck.description,
      color: deck.color,
      createdAt: deck.createdAt,
    },
  });
}
