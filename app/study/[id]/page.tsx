'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { X, Volume2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Protected } from '@/components/app/Protected';
import { useApp } from '@/lib/app-context';
import { applySM2, previewInterval, Rating } from '@/lib/sm2';

const ANSWERS: { label: string; rating: Rating; tone: string }[] = [
  { label: 'Again', rating: 1, tone: 'rose' },
  { label: 'Hard',  rating: 2, tone: 'amber' },
  { label: 'Good',  rating: 3, tone: 'emerald' },
  { label: 'Easy',  rating: 4, tone: 'cyan' },
];

const TONE: Record<string, string> = {
  rose:    'hover:bg-rose-50    hover:border-rose-300    hover:text-rose-700    focus:ring-rose-200',
  amber:   'hover:bg-amber-50   hover:border-amber-300   hover:text-amber-700   focus:ring-amber-200',
  emerald: 'hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 focus:ring-emerald-200',
  cyan:    'hover:bg-cyan-50    hover:border-cyan-300    hover:text-cyan-700    focus:ring-cyan-200',
};

function StudyInner() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getDeck, listCards, recordReview } = useApp();
  const deck = params?.id ? getDeck(params.id) : undefined;

  const initialCards = useMemo(() => {
    if (!params?.id) return [];
    return listCards(params.id).filter((c) => c.due <= Date.now());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id, deck?.id]);

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [completed, setCompleted] = useState(0);
  const startedAtRef = useRef<number>(Date.now());
  const sessionStart = useRef<number>(Date.now());

  useEffect(() => {
    startedAtRef.current = Date.now();
    setFlipped(false);
  }, [index]);

  const current = initialCards[index];

  const handleRate = useCallback(
    (rating: Rating) => {
      if (!current) return;
      const durationMs = Date.now() - startedAtRef.current;
      recordReview(current.id, rating, durationMs);
      setCompleted((n) => n + 1);
      if (index + 1 < initialCards.length) {
        setIndex((i) => i + 1);
      } else {
        setIndex((i) => i + 1);
      }
    },
    [current, index, initialCards.length, recordReview],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === 'Space' && !flipped) {
        e.preventDefault();
        setFlipped(true);
      } else if (flipped) {
        const map: Record<string, Rating> = { Digit1: 1, Digit2: 2, Digit3: 3, Digit4: 4 };
        const r = map[e.code];
        if (r) {
          e.preventDefault();
          handleRate(r);
        }
      }
      if (e.code === 'Escape') router.push(`/decks/${params?.id}`);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipped, handleRate, router, params?.id]);

  if (!deck) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500">Deck not found.</p>
          <Link href="/decks" className="mt-4 inline-block text-indigo-600 font-semibold">← Back to decks</Link>
        </div>
      </div>
    );
  }

  if (initialCards.length === 0) {
    return (
      <EmptySession
        deckId={deck.id}
        title="Nothing to review right now"
        subtitle="All cards in this deck are scheduled for later. Come back when they're due."
      />
    );
  }

  if (index >= initialCards.length) {
    const secs = Math.round((Date.now() - sessionStart.current) / 1000);
    return (
      <SessionComplete
        deckId={deck.id}
        deckName={deck.name}
        completed={completed}
        seconds={secs}
      />
    );
  }

  const progress = (index / initialCards.length) * 100;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex flex-col">
      <header className="flex items-center justify-between px-4 sm:px-6 h-16">
        <Link
          href={`/decks/${deck.id}`}
          className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-slate-600" />
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium tabular-nums">
            Card {index + 1} / {initialCards.length}
          </span>
          <div className="w-32 sm:w-48 h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        <button className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
          <Volume2 className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 pb-6">
        <div className="w-full max-w-2xl">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            <div className="relative [perspective:1800px]" style={{ aspectRatio: '16 / 10' }}>
              <motion.div
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 [transform-style:preserve-3d]"
              >
                <div className="absolute inset-0 [backface-visibility:hidden] rounded-3xl bg-white border border-slate-200 shadow-[0_30px_80px_-20px_rgba(79,70,229,0.20)] p-6 sm:p-10 flex flex-col">
                  <span className={`text-[11px] font-bold uppercase tracking-[0.2em] bg-gradient-to-r ${deck.color} bg-clip-text text-transparent`}>
                    Question · {deck.name}
                  </span>
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-xl sm:text-2xl md:text-3xl font-medium text-center leading-snug tracking-tight text-slate-900 [text-wrap:balance]">
                      {current.front}
                    </p>
                  </div>
                  <button
                    onClick={() => setFlipped(true)}
                    className="self-center inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 hover:scale-105 active:scale-100 transition-all shadow-lg"
                  >
                    Reveal answer
                    <kbd className="px-1.5 py-0.5 rounded bg-white/15 text-[10px]">Space</kbd>
                  </button>
                </div>

                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl bg-gradient-to-br from-white to-indigo-50/40 border border-indigo-100 shadow-[0_30px_80px_-20px_rgba(79,70,229,0.25)] p-6 sm:p-10 flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600">Answer</span>
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-lg sm:text-xl md:text-2xl text-center leading-relaxed text-slate-800 [text-wrap:balance]">
                      {current.back}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <AnimatePresence>
            {flipped && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, delay: 0.1 }}
                className="grid grid-cols-4 gap-2 sm:gap-3 mt-6 sm:mt-8"
              >
                {ANSWERS.map((a, i) => (
                  <button
                    key={a.label}
                    onClick={() => handleRate(a.rating)}
                    className={`group relative h-14 sm:h-16 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.97] focus:outline-none focus:ring-4 ${TONE[a.tone]}`}
                  >
                    <span className="text-[13px] sm:text-sm font-semibold">{a.label}</span>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
                      {previewInterval(current, a.rating)}
                    </span>
                    <kbd className="absolute top-1.5 right-1.5 px-1 py-0.5 rounded bg-slate-100 text-[9px] text-slate-400 opacity-0 group-hover:opacity-100 transition">
                      {i + 1}
                    </kbd>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function EmptySession({ deckId, title, subtitle }: { deckId: string; title: string; subtitle: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-slate-50">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-4xl mx-auto shadow-lg">
          ✓
        </div>
        <h2 className="mt-6 text-2xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 text-slate-600">{subtitle}</p>
        <div className="mt-6 flex justify-center gap-2">
          <Link
            href={`/decks/${deckId}`}
            className="h-10 px-4 rounded-xl bg-slate-900 text-white text-sm font-semibold inline-flex items-center"
          >
            Back to deck
          </Link>
          <Link
            href="/dashboard"
            className="h-10 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-semibold inline-flex items-center"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function SessionComplete({
  deckId,
  deckName,
  completed,
  seconds,
}: {
  deckId: string;
  deckName: string;
  completed: number;
  seconds: number;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-md"
      >
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 via-rose-500 to-fuchsia-500 flex items-center justify-center text-white text-5xl mx-auto shadow-xl">
          🎉
        </div>
        <h2 className="mt-6 text-3xl font-black tracking-tight">Session complete!</h2>
        <p className="mt-2 text-slate-600">
          You reviewed <b>{completed}</b> card{completed === 1 ? '' : 's'} in {deckName}
          {' '}in <b>{formatSecs(seconds)}</b>.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-2">
          <Link
            href={`/decks/${deckId}`}
            className="h-11 px-5 rounded-xl bg-slate-900 text-white text-sm font-semibold inline-flex items-center justify-center"
          >
            Back to deck
          </Link>
          <Link
            href="/dashboard"
            className="h-11 px-5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-semibold inline-flex items-center justify-center"
          >
            Go to dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function formatSecs(s: number) {
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r}s`;
}

export default function StudyPage() {
  return (
    <Protected>
      <StudyInner />
    </Protected>
  );
}
