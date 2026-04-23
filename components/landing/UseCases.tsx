'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Languages } from 'lucide-react';

const CASES = [
  {
    icon: <GraduationCap className="w-5 h-5" />,
    tag: 'Students',
    title: 'Ace exams without burnout',
    description:
      'From NEET to JEE to GATE — review only what you&rsquo;re about to forget. Spend 30 minutes a day instead of cramming for 6 hours the night before.',
    bullets: ['Medical / engineering entrance prep', 'School board exams', 'Competitive tests'],
    accent: 'from-indigo-500 to-purple-600',
    bg: 'from-indigo-50 to-purple-50/50',
  },
  {
    icon: <Briefcase className="w-5 h-5" />,
    tag: 'Professionals',
    title: 'Retain what you learn on the job',
    description:
      'System design, frameworks, client names, legal clauses — stop googling the same things. Build a personal knowledge base that grows with you.',
    bullets: ['Tech interviews', 'Certifications (AWS, PMP)', 'Industry knowledge'],
    accent: 'from-rose-500 to-orange-500',
    bg: 'from-rose-50 to-orange-50/50',
  },
  {
    icon: <Languages className="w-5 h-5" />,
    tag: 'Language learners',
    title: 'Speak fluently, one card at a time',
    description:
      'Vocabulary, grammar rules, idioms — FlashLearn surfaces words exactly when you&rsquo;re about to forget them. No more lost streaks on Duolingo.',
    bullets: ['Vocabulary drills', 'Grammar patterns', 'Phrases & idioms'],
    accent: 'from-emerald-500 to-cyan-500',
    bg: 'from-emerald-50 to-cyan-50/50',
  },
];

export function UseCases() {
  return (
    <section className="relative py-16 sm:py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/5 text-slate-700 text-xs font-bold uppercase tracking-widest">
            Built for every learner
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-slate-900">
            Whatever you&rsquo;re learning, we&rsquo;ve got you.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CASES.map((c, i) => (
            <motion.div
              key={c.tag}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative rounded-2xl p-7 border border-slate-200/70
                          bg-gradient-to-br ${c.bg}
                          shadow-[0_1px_3px_rgba(15,15,25,0.06)]
                          hover:shadow-[0_16px_40px_-12px_rgba(15,15,25,0.15)]
                          hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.accent} text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                  {c.icon}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-600">
                  {c.tag}
                </div>
              </div>

              <h3
                className="mt-5 text-xl font-bold tracking-tight text-slate-900 leading-snug"
                dangerouslySetInnerHTML={{ __html: c.title }}
              />
              <p
                className="mt-3 text-sm text-slate-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: c.description }}
              />

              <ul className="mt-5 space-y-2">
                {c.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-slate-700">
                    <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${c.accent}`} />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
