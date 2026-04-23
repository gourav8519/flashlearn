'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Flame, Layers, Plus, Play, Target, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/app/AppShell';
import { Protected } from '@/components/app/Protected';
import { LivingFlameStreak } from '@/components/dashboard/LivingFlameStreak';
import { NextCardCountdown } from '@/components/dashboard/NextCardCountdown';
import { StatCard } from '@/components/dashboard/StatCard';
import { useApp } from '@/lib/app-context';

function vibe() {
  const h = new Date().getHours();
  if (h < 12) return { emoji: '☀️', greet: 'Good morning', msg: "Let's start strong" };
  if (h < 17) return { emoji: '⚡', greet: 'Good afternoon', msg: 'Midday momentum' };
  if (h < 21) return { emoji: '🌙', greet: 'Good evening', msg: 'Wind-down review' };
  return { emoji: '🦉', greet: 'Hey night owl', msg: 'Late night focus' };
}

function DashboardInner() {
  const router = useRouter();
  const { user, decks, cards, reviews, getDueCards } = useApp();
  const v = vibe();

  const due = getDueCards();
  const dueCount = due.length;

  const nextDue = useMemo(() => {
    const userCardIds = new Set(
      cards.filter((c) => decks.some((d) => d.id === c.deckId)).map((c) => c.id),
    );
    const upcoming = cards
      .filter((c) => userCardIds.has(c.id) && c.due > Date.now())
      .sort((a, b) => a.due - b.due)[0];
    if (!upcoming) return null;
    const deck = decks.find((d) => d.id === upcoming.deckId);
    return { card: upcoming, deckName: deck?.name ?? 'Deck' };
  }, [cards, decks]);

  const mastered = useMemo(
    () => cards.filter((c) => decks.some((d) => d.id === c.deckId) && c.reps >= 3).length,
    [cards, decks],
  );

  const last7Reviews = useMemo(() => {
    const since = Date.now() - 7 * 86_400_000;
    const mine = reviews.filter((r) => r.userId === user?.id && r.reviewedAt >= since);
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      const count = mine.filter((r) => {
        const rd = new Date(r.reviewedAt);
        return `${rd.getFullYear()}-${rd.getMonth() + 1}-${rd.getDate()}` === key;
      }).length;
      return count;
    });
    return days;
  }, [reviews, user?.id]);

  const avgRecall = useMemo(() => {
    const mine = reviews.filter((r) => r.userId === user?.id).slice(-20);
    if (!mine.length) return 0;
    return mine.reduce((s, r) => s + r.durationMs, 0) / mine.length / 1000;
  }, [reviews, user?.id]);

  const topDeck = useMemo(() => {
    return decks
      .map((d) => {
        const deckCards = cards.filter((c) => c.deckId === d.id);
        const dueNow = deckCards.filter((c) => c.due <= Date.now()).length;
        return { deck: d, total: deckCards.length, dueNow };
      })
      .sort((a, b) => b.dueNow - a.dueNow || b.total - a.total)
      .slice(0, 3);
  }, [decks, cards]);

  function startReview() {
    if (due.length === 0) return;
    const deckId = due[0].deckId;
    router.push(`/study/${deckId}`);
  }

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto space-y-5 sm:space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-slate-500 text-sm flex items-center gap-1.5">
            <span>{v.emoji}</span>
            <span>{v.msg}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            {v.greet}, {user?.name}
          </h1>
        </div>
        <Link
          href="/decks"
          className="h-9 px-3 text-xs inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition"
        >
          <Plus className="w-3.5 h-3.5" /> New deck
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 border border-amber-200/60 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-10">
          <div className="flex items-center justify-center md:w-[280px] shrink-0">
            <LivingFlameStreak
              streak={user?.streak ?? 0}
              nextMilestone={
                (user?.streak ?? 0) < 7
                  ? { days: 7, badge: 'Week Warrior' }
                  : (user?.streak ?? 0) < 30
                    ? { days: 30, badge: 'Monthly Master' }
                    : { days: 100, badge: 'Century Club' }
              }
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-amber-200 text-amber-700 text-[11px] font-semibold tracking-[0.15em]">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping" />
                <span className="relative rounded-full w-1.5 h-1.5 bg-emerald-500" />
              </span>
              {dueCount > 0 ? `${dueCount} CARDS DUE` : 'ALL CAUGHT UP'}
            </div>
            <h2 className="text-slate-900 text-3xl sm:text-4xl md:text-[44px] font-semibold tracking-[-0.02em] mt-4 leading-[1.1]">
              {dueCount > 0 ? 'Review now, keep the streak.' : 'Ahead of schedule.'}
            </h2>
            <p className="text-slate-600 mt-3 sm:mt-4 max-w-md text-sm sm:text-base leading-relaxed">
              {dueCount > 0
                ? `You have ${dueCount} card${dueCount > 1 ? 's' : ''} waiting. A 5-minute review locks in your ${user?.streak ?? 0}-day streak.`
                : 'No cards due right now. Create a new deck or add cards to existing ones to keep learning.'}
            </p>
            <div className="flex items-center gap-3 mt-7 flex-wrap">
              {dueCount > 0 ? (
                <button
                  onClick={startReview}
                  className="group h-12 px-6 rounded-xl bg-slate-900 text-white font-bold inline-flex items-center gap-2 shadow-[0_8px_24px_-8px_rgba(15,15,25,0.4)] hover:-translate-y-px active:translate-y-0 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Start review
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ) : (
                <Link
                  href="/decks"
                  className="group h-12 px-6 rounded-xl bg-slate-900 text-white font-bold inline-flex items-center gap-2 shadow-[0_8px_24px_-8px_rgba(15,15,25,0.4)] hover:-translate-y-px transition-all"
                >
                  <Layers className="w-4 h-4" />
                  Browse decks
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {nextDue && dueCount === 0 && (
        <NextCardCountdown
          dueAt={new Date(nextDue.card.due)}
          deckName={nextDue.deckName}
          onReview={() => router.push(`/study/${nextDue.card.deckId}`)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Cards mastered"
          value={String(mastered)}
          delta={`of ${cards.filter((c) => decks.some((d) => d.id === c.deckId)).length} total`}
          sparkline={last7Reviews.length ? last7Reviews : [0, 0, 0, 0, 0, 0, 0]}
          icon={<Target className="w-4 h-4" />}
          accent="emerald"
        />
        <StatCard
          label="Study streak"
          value={`${user?.streak ?? 0} day${(user?.streak ?? 0) === 1 ? '' : 's'}`}
          delta={user?.lastReviewDate ? `Last: ${user.lastReviewDate}` : 'Start today'}
          sparkline={last7Reviews.length ? last7Reviews : [0, 0, 0, 0, 0, 0, 0]}
          icon={<Flame className="w-4 h-4" />}
          accent="amber"
        />
        <StatCard
          label="Avg. recall"
          value={avgRecall ? `${avgRecall.toFixed(1)}s` : '—'}
          delta={reviews.filter((r) => r.userId === user?.id).length ? 'Last 20 reviews' : 'No data yet'}
          sparkline={last7Reviews.length ? last7Reviews : [0, 0, 0, 0, 0, 0, 0]}
          icon={<Zap className="w-4 h-4" />}
          accent="brand"
        />
      </div>

      {topDeck.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-lg font-bold tracking-tight">Your decks</h2>
            <Link href="/decks" className="text-sm text-indigo-600 font-semibold hover:text-indigo-700">
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topDeck.map(({ deck, total, dueNow }) => (
              <Link
                key={deck.id}
                href={`/decks/${deck.id}`}
                className="group relative rounded-2xl p-5 overflow-hidden bg-white border border-slate-200/70 hover:-translate-y-0.5 hover:shadow-lg transition-all"
              >
                <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity bg-gradient-to-br ${deck.color}`} />
                <div className="relative">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${deck.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="mt-3 font-bold tracking-tight text-slate-900">{deck.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{deck.description || 'No description'}</p>
                  <div className="flex items-center gap-3 mt-4 text-xs">
                    <span className="text-slate-500">{total} cards</span>
                    {dueNow > 0 && (
                      <span className="inline-flex items-center gap-1 text-rose-600 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        {dueNow} due
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Protected>
      <AppShell>
        <DashboardInner />
      </AppShell>
    </Protected>
  );
}
