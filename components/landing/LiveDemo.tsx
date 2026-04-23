'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Volume2, Sparkles } from 'lucide-react';

type Card = { q: string; a: string; subject: string; color: string };

const DEMO_CARDS: Card[] = [
  {
    subject: 'Physics',
    q: 'How does reversing coil polarity generate continuous rotation?',
    a: 'Each coil generates a magnetic field whose direction depends on current flow. Reversing polarity repeatedly keeps the rotor spinning.',
    color: 'from-indigo-500 to-purple-600',
  },
  {
    subject: 'Biology',
    q: 'What organelle produces ATP in eukaryotic cells?',
    a: 'The mitochondria — often called the powerhouse of the cell — through oxidative phosphorylation.',
    color: 'from-rose-500 to-pink-500',
  },
  {
    subject: 'Chemistry',
    q: 'Why is water a polar molecule?',
    a: 'Oxygen&rsquo;s higher electronegativity pulls shared electrons toward itself, creating a partial negative charge on O and partial positive on H.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    subject: 'History',
    q: 'Which treaty ended World War I?',
    a: 'The Treaty of Versailles, signed on June 28, 1919, formally ended the war between Germany and the Allied Powers.',
    color: 'from-amber-500 to-orange-500',
  },
];

const ANSWERS = [
  { label: 'Again', hint: '<1m',  tone: 'rose' },
  { label: 'Hard',  hint: '6m',   tone: 'amber' },
  { label: 'Good',  hint: '10m',  tone: 'emerald' },
  { label: 'Easy',  hint: '4d',   tone: 'cyan' },
];

const TONE: Record<string, string> = {
  rose:    'hover:bg-rose-50    hover:border-rose-300    hover:text-rose-700',
  amber:   'hover:bg-amber-50   hover:border-amber-300   hover:text-amber-700',
  emerald: 'hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700',
  cyan:    'hover:bg-cyan-50    hover:border-cyan-300    hover:text-cyan-700',
};

const FLOAT_GRAD: Record<string, string> = {
  rose:    'from-rose-400 to-rose-600',
  amber:   'from-amber-400 to-amber-600',
  emerald: 'from-emerald-400 to-emerald-600',
  cyan:    'from-cyan-400 to-cyan-600',
};

export function LiveDemo() {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [floats, setFloats] = useState<{ id: number; amount: number; tone: string }[]>([]);
  const card = DEMO_CARDS[idx];
  const progress = ((idx + (flipped ? 1 : 0.5)) / DEMO_CARDS.length) * 100;

  useEffect(() => {
    if (flipped) return;
    const t = setTimeout(() => setFlipped(true), 3500);
    return () => clearTimeout(t);
  }, [idx, flipped]);

  function next(amount: number, tone: string) {
    const id = Date.now();
    setFloats((f) => [...f, { id, amount, tone }]);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 1400);
    setTimeout(() => {
      setFlipped(false);
      setIdx((i) => (i + 1) % DEMO_CARDS.length);
    }, 400);
  }

  return (
    <section className="relative py-20 sm:py-24 md:py-32 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-rose-400/10 to-amber-400/10 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            Try it yourself
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 [text-wrap:balance]">
            This is what 30 seconds
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 bg-clip-text text-transparent">
              of FlashLearn feels like.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Click <b className="text-slate-900">Reveal</b>, then rate how well you remembered. That&rsquo;s the whole loop.
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 tabular-nums">
              Card {idx + 1} / {DEMO_CARDS.length}
            </span>
            <div className="flex-1 mx-4 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <button className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="relative [perspective:1800px]" style={{ aspectRatio: '16/10' }}>
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 [transform-style:preserve-3d]"
            >
              <div
                className="absolute inset-0 [backface-visibility:hidden] rounded-3xl bg-white
                           border border-slate-200 p-8 sm:p-10 flex flex-col
                           shadow-[0_30px_80px_-20px_rgba(79,70,229,0.25),0_0_0_1px_rgba(15,15,25,0.02)]"
              >
                <span className={`text-[11px] font-bold uppercase tracking-[0.2em] bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                  Question · {card.subject}
                </span>
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-xl sm:text-2xl md:text-3xl font-medium text-center leading-snug tracking-tight text-slate-900 [text-wrap:balance]">
                    {card.q}
                  </p>
                </div>
                <button
                  onClick={() => setFlipped(true)}
                  className="self-center inline-flex items-center gap-2 px-5 h-11 rounded-xl
                             bg-slate-900 text-white text-sm font-semibold
                             hover:bg-slate-800 hover:scale-105 active:scale-100 transition-all
                             shadow-[0_8px_24px_-8px_rgba(15,15,25,0.5)]"
                >
                  Reveal answer
                  <kbd className="px-1.5 py-0.5 rounded bg-white/15 text-[10px]">Space</kbd>
                </button>
              </div>

              <div
                className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]
                           rounded-3xl bg-gradient-to-br from-white to-indigo-50/40
                           border border-indigo-100 p-8 sm:p-10 flex flex-col
                           shadow-[0_30px_80px_-20px_rgba(79,70,229,0.3)]"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600">
                  Answer
                </span>
                <div className="flex-1 flex items-center justify-center">
                  <p
                    className="text-base sm:text-lg md:text-xl text-center leading-relaxed text-slate-800 [text-wrap:balance]"
                    dangerouslySetInnerHTML={{ __html: card.a }}
                  />
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {floats.map((f) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 0, scale: 0.6 }}
                  animate={{ opacity: [0, 1, 1, 0], y: -60, scale: [0.6, 1.2, 1, 0.8] }}
                  transition={{ duration: 1.2, times: [0, 0.2, 0.7, 1] }}
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-3xl font-black bg-gradient-to-r ${FLOAT_GRAD[f.tone]} bg-clip-text text-transparent`}
                >
                  +{f.amount} XP
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {flipped && (
              <motion.div
                key={`answers-${idx}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="grid grid-cols-4 gap-2 sm:gap-3 mt-6"
              >
                {ANSWERS.map((a, i) => (
                  <button
                    key={a.label}
                    onClick={() => next([5, 8, 10, 15][i], a.tone)}
                    className={`group relative h-14 sm:h-16 rounded-xl bg-white border border-slate-200
                                flex flex-col items-center justify-center
                                transition-all duration-200
                                hover:-translate-y-0.5 hover:shadow-md
                                active:translate-y-0 active:scale-[0.97]
                                ${TONE[a.tone]}`}
                  >
                    <span className="text-[13px] sm:text-sm font-semibold">{a.label}</span>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">{a.hint}</span>
                    <kbd className="absolute top-1.5 right-1.5 px-1 py-0.5 rounded bg-slate-100 text-[9px] text-slate-400 opacity-0 group-hover:opacity-100 transition">
                      {i + 1}
                    </kbd>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 text-center text-xs text-slate-400">
            {flipped ? 'Rate your recall to continue →' : 'Card will reveal automatically in a few seconds…'}
          </div>
        </div>
      </div>
    </section>
  );
}
