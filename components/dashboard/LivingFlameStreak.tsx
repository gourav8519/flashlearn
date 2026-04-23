'use client';

import { Flame } from 'lucide-react';

type Milestone = { days: number; badge: string };
type Props = { streak: number; nextMilestone?: Milestone };

export function LivingFlameStreak({ streak }: Props) {
  return (
    <div className="inline-flex md:w-full md:max-w-[220px] items-center gap-3 md:flex-col md:gap-0 md:text-center rounded-xl md:rounded-2xl bg-white/70 backdrop-blur-sm border border-amber-200/70 px-4 py-3 md:px-6 md:py-7 shadow-sm">
      <Flame className="w-4 h-4 md:w-5 md:h-5 text-amber-500 md:mb-2 shrink-0" />
      <div className="flex items-baseline gap-2 md:flex-col md:gap-0">
        <div className="text-3xl md:text-6xl font-bold tracking-tight text-slate-900 tabular-nums leading-none">
          {streak}
        </div>
        <div className="md:mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
          Day streak
        </div>
      </div>
    </div>
  );
}
