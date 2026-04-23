'use client';

import { motion } from 'framer-motion';
import { BookOpen, Brain, TrendingDown } from 'lucide-react';

const POINTS = [
  {
    icon: TrendingDown,
    title: 'The forgetting curve',
    body: 'Ebbinghaus (1885) showed we forget ~70% of new information within 24 hours. Without review, most study time is wasted.',
    accent: 'from-rose-500 to-orange-500',
  },
  {
    icon: Brain,
    title: 'Spaced repetition',
    body: 'Reviewing material at expanding intervals moves it into long-term memory. Used by medical students, polyglots, and memory champions.',
    accent: 'from-indigo-500 to-purple-600',
  },
  {
    icon: BookOpen,
    title: 'SM-2 algorithm',
    body: 'FlashLearn schedules cards using the same algorithm as SuperMemo and Anki — proven by decades of research and millions of learners.',
    accent: 'from-emerald-500 to-cyan-500',
  },
];

export function Science() {
  return (
    <section className="relative py-16 sm:py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">
            The science
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-slate-900">
            Built on 140 years of memory research.
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Not hype. Not gimmicks. Just the method that actually works.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {POINTS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl bg-white p-6 border border-slate-200/70
                         shadow-[0_1px_3px_rgba(15,15,25,0.06),0_8px_24px_-8px_rgba(15,15,25,0.08)]"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.accent} flex items-center justify-center text-white shadow-md`}>
                <p.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900 text-lg tracking-tight">
                {p.title}
              </h3>
              <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
