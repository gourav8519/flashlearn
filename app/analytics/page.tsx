'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/app/AppShell';
import { Protected } from '@/components/app/Protected';
import { useApp } from '@/lib/app-context';

const RANGE = 30;
const DAY = 86_400_000;

function AnalyticsInner() {
  const { user, decks, cards, reviews } = useApp();

  const mine = useMemo(() => reviews.filter((r) => r.userId === user?.id), [reviews, user?.id]);

  const heatmap = useMemo(() => {
    const days: { date: string; count: number }[] = [];
    for (let i = RANGE - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const count = mine.filter((r) => {
        const rd = new Date(r.reviewedAt);
        const rk = `${rd.getFullYear()}-${String(rd.getMonth() + 1).padStart(2, '0')}-${String(rd.getDate()).padStart(2, '0')}`;
        return rk === key;
      }).length;
      days.push({ date: key, count });
    }
    return days;
  }, [mine]);

  const maxDay = Math.max(1, ...heatmap.map((d) => d.count));
  const totalReviews = mine.length;
  const last30 = mine.filter((r) => r.reviewedAt > Date.now() - RANGE * DAY);
  const successRate =
    last30.length === 0 ? 0 : Math.round((last30.filter((r) => r.rating >= 3).length / last30.length) * 100);
  const avgRecall = last30.length
    ? last30.reduce((s, r) => s + r.durationMs, 0) / last30.length / 1000
    : 0;

  const ratingDist = useMemo(() => {
    const d = { 1: 0, 2: 0, 3: 0, 4: 0 };
    last30.forEach((r) => (d[r.rating] = (d[r.rating] || 0) + 1));
    return d;
  }, [last30]);

  const deckStats = useMemo(() => {
    return decks
      .map((deck) => {
        const deckCards = cards.filter((c) => c.deckId === deck.id);
        const mastered = deckCards.filter((c) => c.reps >= 3).length;
        const pct = deckCards.length ? Math.round((mastered / deckCards.length) * 100) : 0;
        return { deck, total: deckCards.length, mastered, pct };
      })
      .sort((a, b) => b.pct - a.pct);
  }, [decks, cards]);

  const hourHist = useMemo(() => {
    const h = Array.from({ length: 24 }, () => 0);
    mine.forEach((r) => {
      h[new Date(r.reviewedAt).getHours()] += 1;
    });
    return h;
  }, [mine]);

  const bestHour = hourHist.indexOf(Math.max(...hourHist));

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-slate-500 mt-1 text-sm">Your learning patterns over time</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <InsightCard label="Total reviews" value={String(totalReviews)} subtitle="all time" />
        <InsightCard
          label="Success rate"
          value={`${successRate}%`}
          subtitle="last 30 days"
          tone={successRate >= 80 ? 'positive' : successRate >= 60 ? 'neutral' : 'warning'}
        />
        <InsightCard
          label="Avg. recall"
          value={avgRecall ? `${avgRecall.toFixed(1)}s` : '—'}
          subtitle="last 30 days"
        />
        <InsightCard
          label="Best hour"
          value={totalReviews ? formatHour(bestHour) : '—'}
          subtitle="most reviews"
        />
      </div>

      <section className="rounded-2xl bg-white border border-slate-200/70 p-5 sm:p-6">
        <h2 className="text-sm font-bold tracking-tight text-slate-700 mb-4 uppercase">Last 30 days</h2>
        <div className="flex flex-wrap gap-1">
          {heatmap.map((d) => {
            const intensity = d.count / maxDay;
            const bg =
              d.count === 0
                ? 'bg-slate-100'
                : intensity < 0.33
                  ? 'bg-indigo-200'
                  : intensity < 0.66
                    ? 'bg-indigo-400'
                    : 'bg-indigo-600';
            return (
              <div
                key={d.date}
                title={`${d.date}: ${d.count} reviews`}
                className={`w-7 h-7 rounded-md ${bg} hover:ring-2 hover:ring-slate-900/10 transition cursor-pointer`}
              />
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <span>Less</span>
          <div className="w-3 h-3 rounded bg-slate-100" />
          <div className="w-3 h-3 rounded bg-indigo-200" />
          <div className="w-3 h-3 rounded bg-indigo-400" />
          <div className="w-3 h-3 rounded bg-indigo-600" />
          <span>More</span>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="rounded-2xl bg-white border border-slate-200/70 p-5 sm:p-6">
          <h2 className="text-sm font-bold tracking-tight text-slate-700 mb-4 uppercase">Answer distribution</h2>
          {last30.length === 0 ? (
            <p className="text-sm text-slate-500">No reviews yet in the last 30 days.</p>
          ) : (
            <div className="space-y-3">
              {[
                { k: 1, label: 'Again', color: 'bg-rose-500' },
                { k: 2, label: 'Hard', color: 'bg-amber-500' },
                { k: 3, label: 'Good', color: 'bg-emerald-500' },
                { k: 4, label: 'Easy', color: 'bg-cyan-500' },
              ].map((r) => {
                const count = ratingDist[r.k as 1 | 2 | 3 | 4] || 0;
                const pct = Math.round((count / last30.length) * 100);
                return (
                  <div key={r.k}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700">{r.label}</span>
                      <span className="text-slate-500 tabular-nums">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className={`h-full ${r.color} rounded-full`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-white border border-slate-200/70 p-5 sm:p-6">
          <h2 className="text-sm font-bold tracking-tight text-slate-700 mb-4 uppercase">Deck mastery</h2>
          {deckStats.length === 0 ? (
            <p className="text-sm text-slate-500">No decks yet.</p>
          ) : (
            <div className="space-y-3">
              {deckStats.map(({ deck, total, pct }) => (
                <div key={deck.id}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700 truncate">{deck.name}</span>
                    <span className="text-slate-500 tabular-nums shrink-0 ml-2">{pct}% · {total} cards</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className={`h-full bg-gradient-to-r ${deck.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function InsightCard({
  label,
  value,
  subtitle,
  tone,
}: {
  label: string;
  value: string;
  subtitle: string;
  tone?: 'positive' | 'warning' | 'neutral';
}) {
  const accent =
    tone === 'positive'
      ? 'from-emerald-400 to-emerald-600'
      : tone === 'warning'
        ? 'from-rose-400 to-rose-600'
        : 'from-indigo-400 to-indigo-600';
  return (
    <div className="group rounded-2xl bg-white border border-slate-200/70 p-4 hover:-translate-y-0.5 hover:shadow-sm transition overflow-hidden relative">
      <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{label}</div>
      <div className="text-2xl sm:text-3xl font-bold tracking-tight mt-1 tabular-nums">{value}</div>
      <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
    </div>
  );
}

function formatHour(h: number) {
  if (h === 0) return '12 AM';
  if (h < 12) return `${h} AM`;
  if (h === 12) return '12 PM';
  return `${h - 12} PM`;
}

export default function AnalyticsPage() {
  return (
    <Protected>
      <AppShell>
        <AnalyticsInner />
      </AppShell>
    </Protected>
  );
}
