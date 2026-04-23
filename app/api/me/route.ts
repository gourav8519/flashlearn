import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Deck, Card, Review } from '@/lib/models';
import { requireUser, publicUser } from '@/lib/auth-server';
import { googleEnabled } from '@/auth';
import { aiAvailable } from '@/lib/ai-config';

export async function GET() {
  const user = await requireUser();
  if (!user)
    return NextResponse.json(
      { user: null, googleEnabled, aiEnabled: aiAvailable() },
      { status: 200 },
    );

  await dbConnect();

  const [decks, reviews] = await Promise.all([
    Deck.find({ userId: user._id }).sort({ createdAt: -1 }).lean(),
    Review.find({ userId: user._id }).sort({ reviewedAt: -1 }).limit(200).lean(),
  ]);
  const deckIds = decks.map((d) => d._id);
  const cards = await Card.find({ deckId: { $in: deckIds } }).lean();

  return NextResponse.json({
    user: publicUser(user),
    googleEnabled,
    aiEnabled: aiAvailable(user.groqApiKey),
    decks: decks.map((d) => ({
      id: d._id.toString(),
      userId: d.userId.toString(),
      name: d.name,
      description: d.description,
      color: d.color,
      createdAt: d.createdAt,
    })),
    cards: cards.map((c) => ({
      id: c._id.toString(),
      deckId: c.deckId.toString(),
      front: c.front,
      back: c.back,
      interval: c.interval,
      ease: c.ease,
      reps: c.reps,
      due: c.due,
      lapses: c.lapses,
      createdAt: c.createdAt,
    })),
    reviews: reviews.map((r) => ({
      id: r._id.toString(),
      cardId: r.cardId.toString(),
      userId: r.userId.toString(),
      rating: r.rating,
      reviewedAt: r.reviewedAt,
      durationMs: r.durationMs,
    })),
  });
}
