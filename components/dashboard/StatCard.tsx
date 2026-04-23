'use client';

import { ReactNode } from 'react';

type Accent = 'emerald' | 'amber' | 'brand' | 'rose' | 'cyan';

type Props = {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: 'positive' | 'neutral' | 'negative';
  sparkline?: number[];
  icon: ReactNode;
  accent: Accent;
};

const ACCENT: Record<Accent, { bg: string; text: string; grad: string; stroke: string }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', grad: 'from-emerald-400 to-emerald-600', stroke: '#10B981' },
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',   grad: 'from-amber-400 to-amber-600',   stroke: '#F59E0B' },
  brand:   { bg: 'bg-indigo-50',  text: 'text-indigo-600',  grad: 'from-indigo-400 to-indigo-600',  stroke: '#6366F1' },
  rose:    { bg: 'bg-rose-50',    text: 'text-rose-600',    grad: 'from-rose-400 to-rose-600',    stroke: '#F43F5E' },
  cyan:    { bg: 'bg-cyan-50',    text: 'text-cyan-600',    grad: 'from-cyan-400 to-cyan-600',    stroke: '#06B6D4' },
};

function Sparkline({ data, stroke }: { data: number[]; stroke: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 80},${24 - ((v - min) / range) * 20 - 2}`)
    .join(' ');
  const area = `0,24 ${points} 80,24`;
  return (
    <svg viewBox="0 0 80 24" className="w-20 h-6">
      <defs>
        <linearGradient id={`spark-${stroke}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#spark-${stroke})`} />
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StatCard({
  label,
  value,
  delta,
  deltaTone = 'neutral',
  sparkline,
  icon,
  accent,
}: Props) {
  const a = ACCENT[accent];
  const deltaColor =
    deltaTone === 'positive'
      ? 'text-emerald-600'
      : deltaTone === 'negative'
        ? 'text-rose-600'
        : 'text-slate-500';

  return (
    <div
      className="group relative rounded-2xl bg-white border border-slate-200/60 p-5
                 shadow-[0_1px_3px_rgba(15,15,25,0.06),0_8px_24px_-8px_rgba(15,15,25,0.08)]
                 hover:shadow-[0_2px_6px_rgba(15,15,25,0.06),0_16px_40px_-12px_rgba(79,70,229,0.18)]
                 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${a.grad} opacity-0 group-hover:opacity-100 transition-opacity`}
      />

      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
          {label}
        </span>
        <div
          className={`w-8 h-8 rounded-lg ${a.bg} ${a.text} flex items-center justify-center
                      group-hover:scale-110 group-hover:rotate-3 transition-transform`}
        >
          {icon}
        </div>
      </div>

      <div className="text-3xl font-bold tracking-tight tabular-nums text-slate-900">
        {value}
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className={`text-xs font-medium ${deltaColor}`}>{delta}</span>
        {sparkline ? <Sparkline data={sparkline} stroke={a.stroke} /> : null}
      </div>
    </div>
  );
}
