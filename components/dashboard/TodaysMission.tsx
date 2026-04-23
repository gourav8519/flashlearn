'use client';

import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { ReactNode } from 'react';

type Props = {
  title: string;
  highlight: string;
  description: ReactNode;
  xpReward?: number;
  onStart?: () => void;
};

export function TodaysMission({ title, highlight, description, xpReward, onStart }: Props) {
  return (
    <section
      className="relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 min-h-[260px] sm:min-h-[320px]
                 bg-[radial-gradient(ellipse_at_top_right,_#8B5CF6_0%,_#6366F1_40%,_#0F172A_100%)]
                 shadow-[0_20px_60px_-20px_rgba(79,70,229,0.45)]"
    >
      <div
        className="absolute inset-0 opacity-20
                   bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)]
                   bg-[size:40px_40px]
                   [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      <motion.div
        className="absolute top-10 right-20 w-3 h-3 rounded-full bg-cyan-300"
        animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-40 w-2 h-2 rounded-full bg-amber-300"
        animate={{ scale: [1, 1.7, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      />
      <motion.div
        className="absolute top-1/2 left-10 w-1.5 h-1.5 rounded-full bg-emerald-300"
        animate={{ scale: [1, 1.9, 1], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      />
      <motion.div
        className="absolute bottom-16 left-24 w-1 h-1 rounded-full bg-fuchsia-300"
        animate={{ scale: [1, 2, 1], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 1.5 }}
      />

      <div className="relative z-10">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                     bg-white/10 backdrop-blur-md border border-white/20
                     text-white/90 text-[11px] font-semibold tracking-[0.15em]"
        >
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" />
            <span className="relative rounded-full w-1.5 h-1.5 bg-emerald-400" />
          </span>
          TODAY&apos;S MISSION
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-white text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mt-4 leading-[1.05]"
        >
          {title}
          <br />
          <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-cyan-300 bg-clip-text text-transparent">
            {highlight}
          </span>
        </motion.h2>

        <p className="text-white/70 mt-3 sm:mt-4 max-w-md text-sm sm:text-base leading-relaxed">{description}</p>

        <div className="flex items-center gap-4 mt-7 flex-wrap">
          <button
            onClick={onStart}
            className="group h-12 px-6 rounded-xl bg-white text-slate-900 font-bold
                       inline-flex items-center gap-2 shadow-2xl
                       hover:scale-105 active:scale-100 transition-transform duration-200"
          >
            <Play className="w-4 h-4 fill-slate-900" />
            Accept Mission
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <span className="text-white/50 text-xs hidden md:inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/80 border border-white/10">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/80 border border-white/10">Enter</kbd>
          </span>
          {xpReward ? (
            <span className="inline-flex items-center gap-1.5 text-amber-300 text-sm font-semibold">
              ⚡ +{xpReward} XP bonus
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
