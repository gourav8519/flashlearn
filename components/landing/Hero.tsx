'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Play } from 'lucide-react';
import { useEffect } from 'react';

export function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 50, damping: 20, mass: 0.5 });
  const blob1X = useTransform(sx, (v) => v * 40);
  const blob1Y = useTransform(sy, (v) => v * 40);
  const blob2X = useTransform(sx, (v) => v * -30);
  const blob2Y = useTransform(sy, (v) => v * -30);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    }
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mx, my]);

  return (
    <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          style={{ x: blob1X, y: blob1Y }}
          className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-indigo-200/25 blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.a
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          href="#features"
          className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full
                     bg-white border border-slate-200 text-[11px] sm:text-xs font-semibold text-slate-700
                     shadow-sm hover:shadow-md transition-all max-w-[92vw]"
        >
          <span className="relative flex w-1.5 h-1.5 shrink-0">
            <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping" />
            <span className="relative rounded-full w-1.5 h-1.5 bg-emerald-500" />
          </span>
          <span className="text-emerald-700">New</span>
          <span className="text-slate-400">·</span>
          <span className="sm:hidden">AI flashcards from notes</span>
          <span className="hidden sm:inline">AI-generated flashcards from your notes</span>
          <span className="text-slate-400 shrink-0">→</span>
        </motion.a>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-5 sm:mt-6 text-[40px] leading-[1.05] sm:text-6xl md:text-[64px] font-semibold tracking-[-0.02em] text-slate-900"
        >
          Learn 10× faster. Forget nothing.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-5 sm:mt-6 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed px-2"
        >
          FlashLearn turns your notes into a smart study system powered by
          spaced repetition. Review the right card at the right time — and
          watch your knowledge bloom.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-8 sm:mt-9 flex items-center justify-center gap-3 flex-wrap px-2"
        >
          <Link
            href="/signup"
            className="group h-12 px-5 sm:px-6 rounded-xl inline-flex items-center gap-2
                       bg-gradient-to-b from-indigo-500 to-indigo-600 text-white font-semibold text-sm sm:text-base
                       shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_10px_30px_-6px_rgba(79,70,229,0.55)]
                       hover:shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_14px_36px_-6px_rgba(79,70,229,0.65)]
                       hover:-translate-y-px active:translate-y-0 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span className="sm:hidden">Start free</span>
            <span className="hidden sm:inline">Start free — no card</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <a
            href="#how"
            className="h-12 px-4 sm:px-5 rounded-xl inline-flex items-center gap-2
                       bg-white border border-slate-200 text-slate-700 font-semibold text-sm sm:text-base
                       hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-slate-700" />
            Watch demo
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-6 text-sm text-slate-500"
        >
          Free forever · No credit card · 2 min setup
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-16 md:mt-20"
        >
          <div className="relative mx-auto max-w-5xl rounded-2xl overflow-hidden border border-slate-200/80 shadow-[0_40px_80px_-20px_rgba(79,70,229,0.35)]">
            <div className="absolute -top-px inset-x-10 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />
            <HeroPreview />
          </div>

          <div className="absolute -left-6 top-20 md:-left-16 md:top-32 rotate-[-6deg] w-44 hidden md:block">
            <MiniFlashcard
              front="What is spaced repetition?"
              accent="from-indigo-500 to-purple-600"
            />
          </div>
          <div className="absolute -right-6 top-32 md:-right-16 md:top-40 rotate-[8deg] w-44 hidden md:block">
            <MiniFlashcard
              front="How does SM-2 work?"
              accent="from-rose-500 to-orange-500"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MiniFlashcard({ front, accent }: { front: string; accent: string }) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="rounded-xl bg-white p-4 shadow-xl border border-slate-200/80"
    >
      <div className={`text-[9px] font-bold uppercase tracking-widest bg-gradient-to-r ${accent} bg-clip-text text-transparent`}>
        Question
      </div>
      <div className="mt-2 text-xs font-semibold text-slate-800 leading-snug">{front}</div>
      <div className="mt-3 flex gap-1">
        <div className="flex-1 h-1 rounded-full bg-rose-200" />
        <div className="flex-1 h-1 rounded-full bg-amber-200" />
        <div className="flex-1 h-1 rounded-full bg-emerald-200" />
        <div className="flex-1 h-1 rounded-full bg-cyan-200" />
      </div>
    </motion.div>
  );
}

function HeroPreview() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-white">
      <div className="flex items-center gap-1.5 px-4 h-8 border-b border-slate-200/70 bg-slate-50">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        <span className="ml-3 text-[10px] text-slate-400 font-mono">flashlearn.app/dashboard</span>
      </div>

      <div className="p-6 md:p-8">
        <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-[radial-gradient(ellipse_at_top_right,_#8B5CF6_0%,_#6366F1_40%,_#0F172A_100%)]">
          <div
            className="absolute inset-0 opacity-15
                       bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)]
                       bg-[size:28px_28px]"
          />
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur text-white/90 text-[10px] font-semibold">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              TODAY&apos;S MISSION
            </div>
            <div className="mt-3 text-white text-2xl md:text-3xl font-black tracking-tight leading-tight">
              Beat yesterday&apos;s{' '}
              <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-cyan-300 bg-clip-text text-transparent">
                recall speed
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <div className="h-9 px-3 rounded-lg bg-white text-slate-900 text-xs font-bold inline-flex items-center gap-1.5">
                ▶ Accept Mission
              </div>
              <div className="h-9 px-3 rounded-lg text-amber-300 text-xs font-semibold inline-flex items-center">
                ⚡ +50 XP bonus
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Mastered', value: '87', delta: '+12', color: 'emerald' },
            { label: 'Streak', value: '7', delta: 'days', color: 'amber' },
            { label: 'Avg. recall', value: '3.2s', delta: '−0.4s', color: 'indigo' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 p-3 bg-white">
              <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">{s.label}</div>
              <div className="mt-1 text-xl font-black tabular-nums">{s.value}</div>
              <div className={`text-[10px] text-${s.color}-600 font-semibold`}>{s.delta}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
