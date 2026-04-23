export type Rating = 1 | 2 | 3 | 4;

export type SM2State = {
  interval: number;
  ease: number;
  reps: number;
  due: number;
  lapses: number;
};

export const INITIAL_SM2: SM2State = {
  interval: 0,
  ease: 2.5,
  reps: 0,
  due: Date.now(),
  lapses: 0,
};

const DAY = 86_400_000;

const NEXT_INTERVAL_LABELS: Record<Rating, string> = {
  1: '<10m',
  2: '10m',
  3: '—',
  4: '—',
};

export function previewInterval(state: SM2State, rating: Rating): string {
  const next = applySM2(state, rating);
  if (rating === 1) return NEXT_INTERVAL_LABELS[1];
  if (next.interval === 0) return NEXT_INTERVAL_LABELS[rating];
  if (next.interval < 1) return `${Math.round(next.interval * 24 * 60)}m`;
  if (next.interval < 30) return `${next.interval}d`;
  return `${Math.round(next.interval / 30)}mo`;
}

export function applySM2(state: SM2State, rating: Rating): SM2State {
  const q = { 1: 0, 2: 3, 3: 4, 4: 5 }[rating];
  let { interval, ease, reps, lapses } = state;

  if (q < 3) {
    reps = 0;
    interval = 0;
    lapses += 1;
  } else {
    if (reps === 0) interval = rating === 4 ? 3 : 1;
    else if (reps === 1) interval = rating === 4 ? 8 : 6;
    else interval = Math.max(1, Math.round(interval * ease * (rating === 2 ? 0.6 : 1)));
    reps += 1;
  }

  ease = Math.max(1.3, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  const nextDue =
    interval === 0 ? Date.now() + 10 * 60 * 1000 : Date.now() + interval * DAY;

  return { interval, ease, reps, lapses, due: nextDue };
}

export function xpForRating(rating: Rating): number {
  return { 1: 2, 2: 5, 3: 10, 4: 15 }[rating];
}
