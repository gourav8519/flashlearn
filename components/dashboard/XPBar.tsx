'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useXP } from './XPProvider';

export function XPBar() {
  const { level, xp, xpToNext, registerBar } = useXP();
  const ref = useRef<HTMLDivElement | null>(null);
  const pct = Math.min(100, (xp / xpToNext) * 100);

  useEffect(() => {
    registerBar(ref.current);
    return () => registerBar(null);
  }, [registerBar]);

  return (
    <div
      ref={ref}
      className="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 h-10 sm:h-11 rounded-full
                 bg-gradient-to-r from-amber-50 to-rose-50
                 border border-amber-200/70 shadow-sm"
    >
      <div
        className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-amber-400 to-rose-500
                   flex items-center justify-center text-white font-black text-[11px] sm:text-xs shadow-md shrink-0"
      >
        {level}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 opacity-30 blur-md -z-10" />
      </div>

      <div className="hidden sm:block min-w-[140px] md:min-w-[180px]">
        <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-0.5">
          <span>LVL {level}</span>
          <span className="tabular-nums">
            {xp} / {xpToNext} XP
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/80 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-fuchsia-500 rounded-full"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      <div className="sm:hidden flex items-center gap-1 pr-1">
        <div className="w-16 h-1.5 rounded-full bg-white/80 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-fuchsia-500 rounded-full"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </div>
  );
}
