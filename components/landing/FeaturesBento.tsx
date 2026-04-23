'use client';

import { motion } from 'framer-motion';
import { Brain, Sparkles, Flame, BarChart3, Layers, Zap } from 'lucide-react';

export function FeaturesBento() {
  return (
    <section id="features" className="relative py-16 sm:py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-widest">
            Everything inside
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-slate-900">
            Built for real learning, not busywork.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 px-2">
            Six features, one goal: make the things you learn actually stick.
          </p>
        </div>

        <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <BentoCard
            span="sm:col-span-2 md:col-span-2 md:row-span-2"
            accent="indigo"
            icon={<Brain className="w-5 h-5" />}
            title="Smart spaced repetition"
            subtitle="Based on the SM-2 algorithm — the same engine behind Anki."
            description="FlashLearn surfaces each card exactly when you&rsquo;re about to forget it. No more re-reading the same notes a hundred times."
          >
            <Sm2Visual />
          </BentoCard>

          <BentoCard
            accent="rose"
            icon={<Sparkles className="w-5 h-5" />}
            title="AI-generated cards"
            subtitle="Paste your notes. Get flashcards in seconds."
          >
            <AiGenVisual />
          </BentoCard>

          <BentoCard
            accent="amber"
            icon={<Flame className="w-5 h-5" />}
            title="Streaks & XP"
            subtitle="Stay hooked. Level up daily."
          >
            <StreakVisual />
          </BentoCard>

          <BentoCard
            accent="emerald"
            icon={<Layers className="w-5 h-5" />}
            title="Knowledge Garden"
            subtitle="Watch your decks bloom as mastery grows."
          >
            <GardenVisual />
          </BentoCard>

          <BentoCard
            accent="cyan"
            icon={<BarChart3 className="w-5 h-5" />}
            title="Deep analytics"
            subtitle="Know exactly what you don&rsquo;t know."
          >
            <AnalyticsVisual />
          </BentoCard>

          <BentoCard
            accent="purple"
            icon={<Zap className="w-5 h-5" />}
            title="Keyboard-first"
            subtitle="Review at the speed of thought."
          >
            <KeyboardVisual />
          </BentoCard>
        </div>
      </div>
    </section>
  );
}

const ACCENT = {
  indigo:  { bg: 'from-indigo-500/10 to-indigo-50',   chip: 'bg-indigo-50 text-indigo-600',   glow: 'rgba(99,102,241,0.25)' },
  rose:    { bg: 'from-rose-500/10 to-rose-50',       chip: 'bg-rose-50 text-rose-600',       glow: 'rgba(244,63,94,0.25)' },
  amber:   { bg: 'from-amber-500/10 to-amber-50',     chip: 'bg-amber-50 text-amber-600',     glow: 'rgba(245,158,11,0.25)' },
  emerald: { bg: 'from-emerald-500/10 to-emerald-50', chip: 'bg-emerald-50 text-emerald-600', glow: 'rgba(16,185,129,0.25)' },
  cyan:    { bg: 'from-cyan-500/10 to-cyan-50',       chip: 'bg-cyan-50 text-cyan-600',       glow: 'rgba(6,182,212,0.25)' },
  purple:  { bg: 'from-purple-500/10 to-purple-50',   chip: 'bg-purple-50 text-purple-600',   glow: 'rgba(168,85,247,0.25)' },
} as const;

type CardProps = {
  span?: string;
  accent: keyof typeof ACCENT;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description?: string;
  children?: React.ReactNode;
};

function BentoCard({ span, accent, icon, title, subtitle, description, children }: CardProps) {
  const a = ACCENT[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative rounded-2xl p-6 border border-slate-200/70 bg-white overflow-hidden
                  transition-all duration-300 hover:-translate-y-1
                  ${span ?? ''}`}
      style={{ boxShadow: `0 1px 3px rgba(15,15,25,0.06), 0 8px 30px -12px ${a.glow}` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${a.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />

      <div className="relative flex flex-col h-full">
        <div className={`w-10 h-10 rounded-xl ${a.chip} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold tracking-tight text-slate-900">{title}</h3>
        <p className="mt-1.5 text-sm text-slate-600">{subtitle}</p>
        {description && <p className="mt-3 text-sm text-slate-500 leading-relaxed">{description}</p>}
        {children && <div className="mt-auto pt-6">{children}</div>}
      </div>
    </motion.div>
  );
}

function Sm2Visual() {
  const intervals = [
    { day: 'Day 1', pct: 10, color: 'bg-rose-400' },
    { day: 'Day 2', pct: 18, color: 'bg-rose-400' },
    { day: 'Day 4', pct: 32, color: 'bg-amber-400' },
    { day: 'Day 9', pct: 52, color: 'bg-emerald-400' },
    { day: 'Day 21', pct: 75, color: 'bg-cyan-400' },
    { day: 'Day 60', pct: 98, color: 'bg-indigo-500' },
  ];
  return (
    <div className="relative rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-bold text-slate-700">Review schedule</div>
        <div className="text-[10px] text-slate-500">SM-2 algorithm</div>
      </div>
      <div className="space-y-2.5">
        {intervals.map((i, idx) => (
          <motion.div
            key={i.day}
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: '100%', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            className="flex items-center gap-3"
          >
            <div className="w-14 text-[10px] font-semibold text-slate-500 tabular-nums">{i.day}</div>
            <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${i.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.08 + 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full ${i.color} rounded-full`}
              />
            </div>
            <div className="w-10 text-[10px] font-bold text-slate-700 tabular-nums text-right">{i.pct}%</div>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
        Each correct review <b className="text-slate-700">doubles</b> the next interval.
      </div>
    </div>
  );
}

function AiGenVisual() {
  return (
    <div className="relative rounded-xl border border-slate-200 bg-gradient-to-br from-rose-50/50 to-white p-4 space-y-2 text-xs">
      <div className="font-mono text-[10px] text-slate-500 leading-relaxed bg-slate-50 rounded p-2">
        Photosynthesis converts CO₂ and water into glucose using sunlight…
      </div>
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-center text-[10px] font-semibold text-rose-600"
      >
        ✨ Generating cards…
      </motion.div>
      <div className="rounded-lg border border-slate-200 bg-white p-2.5">
        <div className="text-[9px] font-bold text-rose-600">Q</div>
        <div className="text-[11px] font-semibold text-slate-800">What does photosynthesis produce?</div>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-2.5">
        <div className="text-[9px] font-bold text-rose-600">Q</div>
        <div className="text-[11px] font-semibold text-slate-800">What inputs are needed?</div>
      </div>
    </div>
  );
}

function StreakVisual() {
  return (
    <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-amber-50 to-rose-50 p-4 flex items-center justify-center min-h-[140px]">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-radial from-amber-400/40 to-transparent blur-2xl" />
        <svg viewBox="0 0 100 140" className="relative w-16 h-20 drop-shadow-lg">
          <defs>
            <linearGradient id="bento-flame" x1="0" y1="100%" x2="0" y2="0%">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="50%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>
          </defs>
          <path
            d="M50,132 C18,110 14,72 38,40 C44,54 54,50 50,28 C72,44 86,78 72,112 C66,122 60,128 50,132 Z"
            fill="url(#bento-flame)"
            className="origin-bottom [animation:flicker_1.8s_ease-in-out_infinite]"
          />
        </svg>
        <div className="text-center mt-2">
          <div className="text-2xl font-black tabular-nums">7</div>
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">day streak</div>
        </div>
      </div>
    </div>
  );
}

function GardenVisual() {
  return (
    <div className="rounded-xl border border-slate-200 bg-gradient-to-b from-sky-50 to-emerald-50/40 p-4 min-h-[140px]">
      <svg viewBox="0 0 240 120" className="w-full h-auto">
        <line x1={0} y1={100} x2={240} y2={100} stroke="#10B981" strokeWidth={1} strokeDasharray="2 3" opacity={0.3} />
        {[30, 90, 150, 210].map((x, i) => {
          const h = [20, 50, 75, 90][i];
          return (
            <g key={x}>
              <line x1={x} y1={100} x2={x} y2={100 - h * 0.6} stroke="#10B981" strokeWidth={2} strokeLinecap="round" />
              {h > 30 && <ellipse cx={x - 5} cy={100 - h * 0.4} rx={7} ry={3.5} fill="#10B981" transform={`rotate(-30 ${x - 5} ${100 - h * 0.4})`} />}
              {h > 30 && <ellipse cx={x + 5} cy={100 - h * 0.5} rx={7} ry={3.5} fill="#10B981" transform={`rotate(30 ${x + 5} ${100 - h * 0.5})`} />}
              {h > 60 && <circle cx={x} cy={100 - h * 0.6} r={h > 80 ? 7 : 5} fill={['#8B5CF6', '#06B6D4', '#F59E0B', '#F43F5E'][i]} />}
              {h > 80 && [0, 72, 144, 216, 288].map((d) => {
                const r = (d * Math.PI) / 180;
                return <circle key={d} cx={x + Math.cos(r) * 7} cy={100 - h * 0.6 + Math.sin(r) * 7} r={4} fill={['#8B5CF6', '#06B6D4', '#F59E0B', '#F43F5E'][i]} opacity={0.8} />;
              })}
            </g>
          );
        })}
      </svg>
      <div className="text-[10px] text-center text-slate-500 mt-1">Seed → Sprout → Bud → Bloom</div>
    </div>
  );
}

function AnalyticsVisual() {
  const data = [32, 45, 38, 58, 72, 65, 82];
  const max = Math.max(...data);
  return (
    <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-cyan-50/50 to-white p-4">
      <div className="flex items-end gap-1.5 h-20">
        {data.map((v, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${(v / max) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 rounded-t bg-gradient-to-t from-cyan-500 to-indigo-500"
          />
        ))}
      </div>
      <div className="flex justify-between mt-2 text-[9px] text-slate-400 font-mono">
        <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
      </div>
      <div className="mt-2 text-[11px] font-semibold text-emerald-600">↑ 28% this week</div>
    </div>
  );
}

function KeyboardVisual() {
  const keys = [
    { k: '1', label: 'Again', color: 'bg-rose-100 text-rose-700' },
    { k: '2', label: 'Hard', color: 'bg-amber-100 text-amber-700' },
    { k: '3', label: 'Good', color: 'bg-emerald-100 text-emerald-700' },
    { k: '4', label: 'Easy', color: 'bg-cyan-100 text-cyan-700' },
  ];
  return (
    <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-purple-50/40 to-white p-4 space-y-2">
      {keys.map((key) => (
        <div key={key.k} className="flex items-center gap-3">
          <kbd className={`w-8 h-8 rounded-md font-bold text-sm flex items-center justify-center ${key.color}`}>
            {key.k}
          </kbd>
          <span className="text-xs font-semibold text-slate-700">{key.label}</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>
      ))}
      <div className="text-[10px] text-slate-400 font-mono pt-1">SPACE to flip</div>
    </div>
  );
}
