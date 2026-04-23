'use client';

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type XPContextValue = {
  level: number;
  xp: number;
  xpToNext: number;
  awardXP: (amount: number, fromEl?: HTMLElement | null) => void;
  registerBar: (el: HTMLElement | null) => void;
};

const XPContext = createContext<XPContextValue | null>(null);

export function useXP() {
  const ctx = useContext(XPContext);
  if (!ctx) throw new Error('useXP must be used inside <XPProvider>');
  return ctx;
}

type Float = {
  id: number;
  amount: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

type ProviderProps = {
  children: ReactNode;
  initialLevel?: number;
  initialXP?: number;
};

export function XPProvider({ children, initialLevel = 12, initialXP = 840 }: ProviderProps) {
  const [level, setLevel] = useState(initialLevel);
  const [xp, setXp] = useState(initialXP);
  const [floats, setFloats] = useState<Float[]>([]);
  const barRef = useRef<HTMLElement | null>(null);
  const idRef = useRef(0);

  const xpToNext = level * 100 + 100;

  const registerBar = useCallback((el: HTMLElement | null) => {
    barRef.current = el;
  }, []);

  const awardXP = useCallback(
    (amount: number, fromEl?: HTMLElement | null) => {
      const bar = barRef.current;
      const barRect = bar?.getBoundingClientRect();
      const srcRect = fromEl?.getBoundingClientRect();

      const startX = srcRect
        ? srcRect.left + srcRect.width / 2
        : window.innerWidth / 2;
      const startY = srcRect
        ? srcRect.top + srcRect.height / 2
        : window.innerHeight / 2;
      const endX = barRect ? barRect.left + barRect.width / 2 : startX;
      const endY = barRect ? barRect.top + barRect.height / 2 : startY - 120;

      const id = ++idRef.current;
      setFloats((prev) => [...prev, { id, amount, startX, startY, endX, endY }]);

      window.setTimeout(() => {
        setFloats((prev) => prev.filter((f) => f.id !== id));
      }, 1600);

      window.setTimeout(() => {
        setXp((prev) => {
          const next = prev + amount;
          if (next >= xpToNext) {
            setLevel((l) => l + 1);
            return next - xpToNext;
          }
          return next;
        });
      }, 1200);
    },
    [xpToNext],
  );

  return (
    <XPContext.Provider value={{ level, xp, xpToNext, awardXP, registerBar }}>
      {children}

      <div className="fixed inset-0 pointer-events-none z-[100]">
        <AnimatePresence>
          {floats.map((f) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, scale: 0.5, left: f.startX, top: f.startY }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.3, 1, 0.5],
                left: [f.startX, f.startX, f.endX, f.endX],
                top: [f.startY, f.startY - 50, f.endY, f.endY],
              }}
              transition={{
                duration: 1.4,
                times: [0, 0.15, 0.75, 1],
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-2xl font-black
                         bg-gradient-to-r from-amber-400 via-rose-500 to-fuchsia-500 bg-clip-text text-transparent
                         drop-shadow-[0_2px_10px_rgba(251,146,60,0.6)]"
            >
              +{f.amount} XP
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </XPContext.Provider>
  );
}
