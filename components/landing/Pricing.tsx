'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check } from 'lucide-react';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    tagline: 'Everything you need to get started.',
    cta: 'Start free',
    href: '/signup',
    featured: false,
    features: [
      'Up to 5 decks',
      '500 cards total',
      'Full SM-2 algorithm',
      'Basic analytics',
      'Mobile + desktop',
    ],
  },
  {
    name: 'Pro',
    price: '$8',
    period: '/month',
    tagline: 'Unlimited learning, AI superpowers.',
    cta: 'Start 14-day trial',
    href: '/signup?plan=pro',
    featured: true,
    features: [
      'Unlimited decks & cards',
      'AI card generation (unlimited)',
      'Advanced analytics',
      'Knowledge Garden visualisation',
      'Priority support',
      'Early access to new features',
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-16 sm:py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-widest">
            Pricing
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Start free. Upgrade when
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              you&rsquo;re addicted.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 px-2">
            Cancel anytime. No hidden fees. Your data is yours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto pt-3">
          {PLANS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl p-6 sm:p-8 border transition-all duration-300 hover:-translate-y-1 ${
                p.featured
                  ? 'bg-gradient-to-br from-slate-900 to-indigo-950 border-indigo-500/30 text-white shadow-[0_20px_60px_-20px_rgba(79,70,229,0.5)]'
                  : 'bg-white border-slate-200 shadow-[0_1px_3px_rgba(15,15,25,0.06),0_8px_24px_-8px_rgba(15,15,25,0.08)]'
              }`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
                  Most popular
                </div>
              )}

              <div className="flex items-baseline justify-between">
                <h3 className={`text-xl font-bold ${p.featured ? 'text-white' : 'text-slate-900'}`}>
                  {p.name}
                </h3>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className={`text-5xl font-black tracking-tight ${p.featured ? 'text-white' : 'text-slate-900'}`}>
                  {p.price}
                </span>
                <span className={`text-sm ${p.featured ? 'text-white/60' : 'text-slate-500'}`}>
                  {p.period}
                </span>
              </div>

              <p className={`mt-2 text-sm ${p.featured ? 'text-white/70' : 'text-slate-600'}`}>
                {p.tagline}
              </p>

              <Link
                href={p.href}
                className={`mt-6 h-11 w-full rounded-xl inline-flex items-center justify-center gap-2 font-semibold text-sm transition-all ${
                  p.featured
                    ? 'bg-white text-slate-900 hover:scale-[1.02]'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {p.cta} →
              </Link>

              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span
                      className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        p.featured ? 'bg-emerald-400/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    <span className={p.featured ? 'text-white/80' : 'text-slate-700'}>{f}</span>
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
