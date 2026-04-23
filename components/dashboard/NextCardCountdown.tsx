'use client';

import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = {
  dueAt: Date;
  deckName: string;
  onReview?: () => void;
};

export function NextCardCountdown({ dueAt, deckName, onReview }: Props) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, dueAt.getTime() - Date.now()),
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining(Math.max(0, dueAt.getTime() - Date.now()));
    }, 1000);
    return () => window.clearInterval(id);
  }, [dueAt]);

  const mm = String(Math.floor(remaining / 60000)).padStart(2, '0');
  const ss = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0');
  const isDue = remaining === 0;

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl
                 bg-gradient-to-r from-rose-500/10 via-white to-amber-500/10
                 border border-rose-200/60 shadow-sm"
    >
      <div className="relative w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center shrink-0">
        <div className="absolute inset-0 rounded-full bg-rose-500/25 animate-ping" />
        <Clock className="relative w-5 h-5 text-rose-600" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-xs text-slate-500 font-medium">
          {isDue ? 'Card ready to review' : 'Next card due in'}
        </div>
        <div className="text-lg font-black tabular-nums text-slate-900 flex items-baseline gap-2">
          {isDue ? '00:00' : `${mm}:${ss}`}
          <span className="text-xs text-slate-400 font-normal">· {deckName}</span>
        </div>
      </div>

      <button
        onClick={onReview}
        className="text-rose-600 font-semibold text-sm hover:text-rose-700
                   whitespace-nowrap px-3 h-9 rounded-lg hover:bg-rose-50 transition-colors"
      >
        Review now →
      </button>
    </div>
  );
}
