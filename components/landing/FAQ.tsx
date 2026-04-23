'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const QUESTIONS = [
  {
    q: 'How is FlashLearn different from Anki or Quizlet?',
    a: 'FlashLearn uses the same proven SM-2 algorithm as Anki, but with a modern, beautiful UI. Unlike Quizlet, we focus on true spaced repetition (not just memorization games). Plus we have AI card generation and the Knowledge Garden visualization — features neither competitor offers.',
  },
  {
    q: 'Is my data private? Where is it stored?',
    a: 'Your cards and progress are stored securely in MongoDB. We never share your data with third parties. You can export everything to CSV or delete your account anytime — no questions asked.',
  },
  {
    q: 'Do I need an account to try it?',
    a: 'Yes, but signup takes 30 seconds and is free forever. We need an account to save your progress and sync across devices. No credit card required.',
  },
  {
    q: 'Does the AI generation actually work well?',
    a: 'Paste your notes, a textbook chapter, or even a PDF. Our AI extracts key concepts and generates clean Q&A pairs in seconds. You can edit any card before adding it to your deck — the AI is a starting point, not a replacement for your judgment.',
  },
  {
    q: 'What if I miss a day? Will my streak reset?',
    a: 'We give you a 24-hour grace window and one "freeze" per week. Life happens. Streaks should motivate you, not punish you for a busy Tuesday.',
  },
  {
    q: 'Can I import my existing Anki decks?',
    a: 'Yes — we support .apkg imports. You can also import from CSV, Quizlet exports, and Notion. All your scheduling data transfers over.',
  },
  {
    q: 'Does it work offline?',
    a: 'The web app needs a connection to sync. Our mobile apps (iOS/Android, coming soon) will support full offline mode with automatic sync when you&rsquo;re back online.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative py-16 sm:py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/5 text-slate-700 text-xs font-bold uppercase tracking-widest">
            Questions?
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-slate-900">
            Honest answers.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Still curious? Reach us at{' '}
            <a href="mailto:hey@flashlearn.app" className="text-indigo-600 font-semibold hover:text-indigo-700">
              hey@flashlearn.app
            </a>
          </p>
        </div>

        <div className="space-y-3">
          {QUESTIONS.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-slate-300 shadow-[0_4px_20px_-8px_rgba(15,15,25,0.12)]'
                    : 'bg-white border-slate-200/70 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left"
                >
                  <span className="text-sm sm:text-base font-semibold text-slate-900 pr-2">
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isOpen ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-slate-600 leading-relaxed">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
