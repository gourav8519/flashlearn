'use client';

import { motion } from 'framer-motion';

type Deck = { id: string; name: string; mastery: number; color: string };
type Props = { decks: Deck[] };

function stageOf(mastery: number): 'seed' | 'sprout' | 'bud' | 'bloom' {
  if (mastery < 20) return 'seed';
  if (mastery < 50) return 'sprout';
  if (mastery < 80) return 'bud';
  return 'bloom';
}

function Plant({ deck, index }: { deck: Deck; index: number }) {
  const stage = stageOf(deck.mastery);
  const height = 36 + (deck.mastery / 100) * 120;
  const cx = index * 90 + 60;
  const groundY = 230;
  const topY = groundY - height;

  return (
    <motion.g
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] }}
    >
      <ellipse cx={cx} cy={groundY + 2} rx={22} ry={3} fill="#065F46" opacity={0.12} />

      {stage !== 'seed' && (
        <motion.path
          d={`M ${cx} ${groundY} Q ${cx - 2} ${(groundY + topY) / 2} ${cx} ${topY}`}
          stroke="#10B981"
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
          animate={{ rotate: [-1, 1, -1] }}
          style={{ transformOrigin: `${cx}px ${groundY}px` }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {stage === 'seed' && (
        <>
          <ellipse cx={cx} cy={groundY - 4} rx={10} ry={6} fill="#78350F" />
          <path d={`M ${cx - 6} ${groundY - 4} Q ${cx} ${groundY - 14} ${cx + 6} ${groundY - 4}`} stroke="#059669" strokeWidth={2} fill="none" strokeLinecap="round" />
        </>
      )}

      {(stage === 'sprout' || stage === 'bud' || stage === 'bloom') && (
        <>
          <motion.ellipse
            cx={cx - 12}
            cy={topY + height * 0.35}
            rx={14}
            ry={7}
            fill="#10B981"
            transform={`rotate(-35 ${cx - 12} ${topY + height * 0.35})`}
            animate={{ ry: [7, 8, 7] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.ellipse
            cx={cx + 12}
            cy={topY + height * 0.5}
            rx={14}
            ry={7}
            fill="#10B981"
            transform={`rotate(35 ${cx + 12} ${topY + height * 0.5})`}
            animate={{ ry: [7, 8, 7] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          />
        </>
      )}

      {(stage === 'bud' || stage === 'bloom') && (
        <motion.circle
          cx={cx}
          cy={topY}
          r={stage === 'bloom' ? 12 : 8}
          fill={deck.color}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{ transformOrigin: `${cx}px ${topY}px` }}
        />
      )}

      {stage === 'bloom' && (
        <g>
          {[0, 60, 120, 180, 240, 300].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const px = cx + Math.cos(rad) * 13;
            const py = topY + Math.sin(rad) * 13;
            return <circle key={deg} cx={px} cy={py} r={9} fill={deck.color} opacity={0.9} />;
          })}
          <circle cx={cx} cy={topY} r={5} fill="#FEF3C7" />
        </g>
      )}

      <text x={cx} y={254} textAnchor="middle" className="fill-slate-700 text-[11px] font-semibold">
        {deck.name}
      </text>
      <text x={cx} y={268} textAnchor="middle" className="fill-slate-400 text-[10px] tabular-nums">
        {deck.mastery}%
      </text>
    </motion.g>
  );
}

export function KnowledgeGarden({ decks }: Props) {
  const width = Math.max(560, decks.length * 90 + 60);
  const blooming = decks.filter((d) => d.mastery >= 80).length;

  return (
    <div
      className="rounded-2xl overflow-hidden border border-slate-200/60
                 bg-gradient-to-b from-sky-50 via-white to-emerald-50/50
                 shadow-[0_1px_3px_rgba(15,15,25,0.06),0_8px_24px_-8px_rgba(15,15,25,0.08)]"
    >
      <div className="p-6 pb-2 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Knowledge Garden</h3>
          <p className="text-sm text-slate-500">
            {blooming > 0
              ? `${blooming} deck${blooming > 1 ? 's' : ''} in full bloom · keep watering the rest`
              : 'Review daily to help your decks bloom'}
          </p>
        </div>
        <span className="text-xs text-slate-400 font-medium">🌱 → 🌸</span>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} 280`} className="block min-w-full" style={{ minWidth: width }}>
          <defs>
            <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect x={0} y={230} width={width} height={50} fill="url(#ground)" />
          <line
            x1={0}
            y1={230}
            x2={width}
            y2={230}
            stroke="#10B981"
            strokeWidth={1}
            strokeDasharray="2 4"
            opacity={0.3}
          />
          {decks.map((d, i) => (
            <Plant key={d.id} deck={d} index={i} />
          ))}
        </svg>
      </div>
    </div>
  );
}
