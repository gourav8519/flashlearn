'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '@/lib/app-context';

export function XPBar() {
  const { user, floats } = useApp();
  if (!user) return null;
  const xpToNext = user.level * 100 + 100;
  const pct = Math.min(100, (user.xp / xpToNext) * 100);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 h-10 sm:h-11 rounded-full bg-white border border-slate-200">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-semibold text-[11px] sm:text-xs shrink-0">
          {user.level}
        </div>
        <div className="hidden sm:block min-w-[140px] md:min-w-[180px]">
          <div className="flex justify-between text-[10px] font-semibold text-slate-600 mb-0.5">
            <span>LVL {user.level}</span>
            <span className="tabular-nums text-slate-500">{user.xp} / {xpToNext} XP</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <motion.div
              className="h-full bg-slate-900 rounded-full"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
        <div className="sm:hidden flex items-center pr-1">
          <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <motion.div
              className="h-full bg-slate-900 rounded-full"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {floats.map((f) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 1, 0], y: -30, scale: [0.6, 1.3, 1, 0.8] }}
            transition={{ duration: 1.4, times: [0, 0.2, 0.75, 1] }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 text-sm font-bold text-emerald-600 pointer-events-none whitespace-nowrap"
          >
            +{f.amount} XP
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
