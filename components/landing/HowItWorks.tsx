'use client';

import { motion } from 'framer-motion';
import { FileText, Brain, TrendingUp } from 'lucide-react';

const STEPS = [
  {
    n: '01',
    icon: <FileText className="w-5 h-5" />,
    title: 'Create or import decks',
    desc: 'Paste notes, upload PDFs, or let AI generate cards from any topic.',
    accent: 'from-indigo-500 to-purple-600',
  },
  {
    n: '02',
    icon: <Brain className="w-5 h-5" />,
    title: 'Review what&rsquo;s due',
    desc: 'FlashLearn picks the exact cards you&rsquo;re about to forget. Rate each one: Again / Hard / Good / Easy.',
    accent: 'from-rose-500 to-orange-500',
  },
  {
    n: '03',
    icon: <TrendingUp className="w-5 h-5" />,
    title: 'Master forever',
    desc: 'Intervals grow automatically. Your knowledge compounds instead of fading.',
    accent: 'from-emerald-500 to-cyan-500',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-16 sm:py-20 md:py-28 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/5 text-slate-700 text-xs font-bold uppercase tracking-widest">
            How it works
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-slate-900">
            From zero to mastery in three steps.
          </h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          <div className="absolute top-16 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent hidden md:block" />

          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              <div className="relative mb-6 flex items-center justify-center">
                <div className="relative">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.accent} flex items-center justify-center text-white shadow-xl shadow-slate-900/10`}>
                    {s.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 bg-white border border-slate-200 rounded-full px-2 py-0.5 text-[10px] font-mono font-bold text-slate-500 shadow-sm">
                    {s.n}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3
                  className="text-xl font-bold tracking-tight text-slate-900"
                  dangerouslySetInnerHTML={{ __html: s.title }}
                />
                <p
                  className="mt-2 text-slate-600 leading-relaxed max-w-xs mx-auto"
                  dangerouslySetInnerHTML={{ __html: s.desc }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
