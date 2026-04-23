'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
  quote?: { text: string; author: string; role: string };
};

export function AuthShell({ title, subtitle, children, footer, quote }: Props) {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-white">
      <div className="relative flex flex-col px-5 sm:px-6 py-6 sm:py-8 md:px-12 md:py-10 min-h-screen md:min-h-0">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
            F
          </div>
          <span className="font-bold tracking-tight text-slate-900">FlashLearn</span>
        </Link>

        <div className="flex-1 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm mx-auto"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600">{subtitle}</p>

            <div className="mt-6 sm:mt-8">{children}</div>
          </motion.div>
        </div>

        <div className="text-center text-sm text-slate-500 pt-6">{footer}</div>
      </div>

      <div className="hidden md:flex relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_#8B5CF6_0%,_#6366F1_40%,_#0F172A_100%)]">
        <div
          className="absolute inset-0 opacity-15
                     bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)]
                     bg-[size:36px_36px]
                     [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
        />
        <motion.div
          className="absolute top-24 right-24 w-3 h-3 rounded-full bg-cyan-300"
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 right-40 w-2 h-2 rounded-full bg-amber-300"
          animate={{ scale: [1, 1.7, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        />

        <div className="relative flex flex-col justify-between p-12 text-white w-full">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-md"
          >
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-semibold tracking-widest">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              LOVED BY 12K+ LEARNERS
            </div>

            <h2 className="mt-5 text-4xl font-black tracking-tight leading-[1.05]">
              Your brain,
              <br />
              <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-cyan-300 bg-clip-text text-transparent">
                upgraded.
              </span>
            </h2>

            <div className="mt-8 space-y-3">
              {[
                'Smart spaced repetition',
                'AI-generated flashcards',
                'Beautiful progress tracking',
                'Works everywhere',
              ].map((f) => (
                <div key={f} className="flex items-center gap-3 text-white/80">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </span>
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {quote && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 max-w-md"
            >
              <div className="text-amber-300 text-sm mb-2">★★★★★</div>
              <p className="text-white/90 text-sm leading-relaxed">&ldquo;{quote.text}&rdquo;</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-white text-xs font-bold">
                  {quote.author[0]}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{quote.author}</div>
                  <div className="text-white/50 text-xs">{quote.role}</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
