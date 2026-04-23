import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Card, Deck, Review } from '@/lib/models';
import { requireUser } from '@/lib/auth-server';
import { applySM2, Rating, xpForRating } from '@/lib/sm2';

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { cardId, rating, durationMs } = await req.json();
  if (!cardId || ![1, 2, 3, 4].includes(rating)) {
    return NextResponse.json({ error: 'Invalid review payload' }, { status: 400 });
  }

  await dbConnect();

  const card = await Card.findById(cardId);
  if (!card) return NextResponse.json({ error: 'Card not found' }, { status: 404 });

  const deck = await Deck.findOne({ _id: card.deckId, userId: user._id });
  if (!deck) return NextResponse.json({ error: 'Not authorised' }, { status: 403 });

  const nextState = applySM2(
    { interval: card.interval, ease: card.ease, reps: card.reps, due: card.due, lapses: card.lapses },
    rating as Rating,
  );
  card.interval = nextState.interval;
  card.ease = nextState.ease;
  card.reps = nextState.reps;
  card.due = nextState.due;
  card.lapses = nextState.lapses;
  await card.save();

  const review = await Review.create({
    cardId: card._id,
    userId: user._id,
    rating,
    durationMs: typeof durationMs === 'number' ? Math.max(0, durationMs) : 0,
  });

  const today = todayKey();
  const yesterday = yesterdayKey();
  if (user.lastReviewDate !== today) {
    user.streak = user.lastReviewDate === yesterday ? user.streak + 1 : 1;
    user.lastReviewDate = today;
  }

  const bonus = xpForRating(rating as Rating);
  user.xp += bonus;
  const threshold = () => user.level * 100 + 100;
  while (user.xp >= threshold()) {
    user.xp -= threshold();
    user.level += 1;
  }
  await user.save();

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
    review: {
      id: review._id.toString(),
      cardId: review.cardId.toString(),
      userId: review.userId.toString(),
      rating: review.rating,
      reviewedAt: review.reviewedAt,
      durationMs: review.durationMs,
    },
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      streak: user.streak,
      lastReviewDate: user.lastReviewDate,
      xp: user.xp,
      level: user.level,
    },
    xpGained: bonus,
  });
}
