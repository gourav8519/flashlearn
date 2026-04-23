'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Play, Plus, X, Clock, Layers, Sparkles, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppShell } from '@/components/app/AppShell';
import { Protected } from '@/components/app/Protected';
import { useApp, type AiDraftCard } from '@/lib/app-context';

type EditingCard = { id: string; front: string; back: string; due: number } | null;

const DAY_MS = 86_400_000;

function toDatetimeLocal(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function humanDue(ts: number): string {
  const diff = ts - Date.now();
  if (diff <= 0) return 'Due now';
  if (diff < 60_000) return 'Due in <1m';
  if (diff < 3_600_000) return `Due in ${Math.round(diff / 60_000)}m`;
  if (diff < DAY_MS) return `Due in ${Math.round(diff / 3_600_000)}h`;
  if (diff < 30 * DAY_MS) return `Due in ${Math.round(diff / DAY_MS)}d`;
  return `Due in ${Math.round(diff / (30 * DAY_MS))}mo`;
}

function DeckDetailInner() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getDeck, listCards, createCard, updateCard, deleteCard, generateAiCards, aiEnabled } =
    useApp();
  const deck = params?.id ? getDeck(params.id) : undefined;
  const cards = params?.id ? listCards(params.id) : [];
  const [showAdd, setShowAdd] = useState(false);
  const [showAi, setShowAi] = useState(false);
  const [editing, setEditing] = useState<EditingCard>(null);

  if (!deck) {
    return (
      <div className="px-6 py-10 max-w-2xl mx-auto text-center">
        <p className="text-slate-500">Deck not found.</p>
        <Link href="/decks" className="mt-4 inline-block text-indigo-600 font-semibold">
          ← Back to decks
        </Link>
      </div>
    );
  }

  const due = cards.filter((c) => c.due <= Date.now());
  const mastery =
    cards.length === 0 ? 0 : Math.round((cards.filter((c) => c.reps >= 3).length / cards.length) * 100);

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-5xl mx-auto space-y-6">
      <Link
        href="/decks"
        className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> All decks
      </Link>

      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-slate-200/70 bg-white">
        <div className={`absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-30 bg-gradient-to-br ${deck.color}`} />
        <div className="relative">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${deck.color} flex items-center justify-center text-white shadow-md shrink-0`}>
              <Layers className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{deck.name}</h1>
              <p className="text-slate-500 mt-1">{deck.description || 'No description'}</p>

              <div className="flex items-center gap-4 mt-4 text-sm flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-slate-600">
                  <Layers className="w-4 h-4" /> {cards.length} cards
                </span>
                {due.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-rose-600 font-semibold">
                    <Clock className="w-4 h-4" /> {due.length} due now
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-slate-600">
                  Mastery · {mastery}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-6 flex-wrap">
            <button
              disabled={due.length === 0}
              onClick={() => router.push(`/study/${deck.id}`)}
              className="h-11 px-5 rounded-xl bg-gradient-to-b from-indigo-500 to-indigo-600 text-white font-semibold text-sm inline-flex items-center gap-2 shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:-translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4 fill-white" />
              {due.length > 0 ? `Study ${due.length} due` : 'No cards due'}
            </button>
            <button
              onClick={() => setShowAdd(true)}
              className="h-11 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm inline-flex items-center gap-2 hover:border-slate-300 hover:bg-slate-50 transition"
            >
              <Plus className="w-4 h-4" /> Add card
            </button>
            {aiEnabled && (
              <button
                onClick={() => setShowAi(true)}
                className="h-11 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm inline-flex items-center gap-2 hover:border-slate-300 hover:bg-slate-50 transition"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" /> Generate with AI
              </button>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold tracking-tight mb-3">Cards</h2>
        {cards.length === 0 ? (
          <div className="rounded-2xl bg-white border border-dashed border-slate-300 p-10 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <Plus className="w-5 h-5 text-slate-500" />
            </div>
            <p className="text-slate-600 font-medium">No cards yet</p>
            <p className="text-slate-500 text-sm mt-1">Add your first card to start learning.</p>
            <button
              onClick={() => setShowAdd(true)}
              className="mt-4 h-10 px-4 rounded-xl bg-slate-900 text-white text-sm font-semibold"
            >
              Add your first card
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cards.map((card) => {
              const status = cardStatus(card);
              return (
                <button
                  key={card.id}
                  onClick={() => setEditing({ id: card.id, front: card.front, back: card.back, due: card.due })}
                  className="group text-left rounded-2xl bg-white border border-slate-200/70 p-5 hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_rgba(15,15,25,0.12)] transition-all"
                >
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-indigo-600">Question</div>
                    <p className="text-sm font-medium text-slate-900 mt-1 line-clamp-2">{card.front}</p>
                    <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 mt-3">Answer</div>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{card.back}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-xs">
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${status.className}`}>
                      {status.label}
                    </span>
                    <span className="text-slate-500">{card.reps} reviews · ease {card.ease.toFixed(2)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <AddCardModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={(front, back) => {
          createCard(deck.id, front, back);
          setShowAdd(false);
        }}
      />

      <EditCardModal
        editing={editing}
        onClose={() => setEditing(null)}
        onSave={async (front, back, due) => {
          if (!editing) return;
          await updateCard(editing.id, front, back, due);
          setEditing(null);
        }}
        onDelete={async () => {
          if (!editing) return;
          await deleteCard(editing.id);
          setEditing(null);
        }}
      />

      <AiGenerateModal
        open={showAi}
        onClose={() => setShowAi(false)}
        onGenerate={generateAiCards}
        onAddAll={async (accepted) => {
          if (!deck) return;
          for (const c of accepted) {
            await createCard(deck.id, c.front, c.back);
          }
          setShowAi(false);
        }}
      />
    </div>
  );
}

function cardStatus(card: { due: number; reps: number; lapses: number }) {
  if (card.due <= Date.now()) return { label: 'Due now', className: 'bg-rose-100 text-rose-700' };
  if (card.reps === 0) return { label: 'New', className: 'bg-slate-100 text-slate-700' };
  if (card.reps >= 3) return { label: 'Mastered', className: 'bg-emerald-100 text-emerald-700' };
  return { label: 'Learning', className: 'bg-amber-100 text-amber-700' };
}

function AddCardModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (front: string, back: string) => void;
}) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [addAnother, setAddAnother] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;
    onAdd(front.trim(), back.trim());
    setFront('');
    setBack('');
    if (!addAnother) onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <form
              onSubmit={submit}
              className="pointer-events-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold tracking-tight">Add new card</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">Question (front)</label>
                  <textarea
                    autoFocus
                    required
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                    placeholder="What do you want to remember?"
                    rows={2}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm resize-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider">Answer (back)</label>
                  <textarea
                    required
                    value={back}
                    onChange={(e) => setBack(e.target.value)}
                    placeholder="The answer you want to recall"
                    rows={3}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm resize-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={addAnother}
                    onChange={(e) => setAddAnother(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600"
                  />
                  Add another after saving
                </label>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-10 px-4 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
                >
                  Save card
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function EditCardModal({
  editing,
  onClose,
  onSave,
  onDelete,
}: {
  editing: EditingCard;
  onClose: () => void;
  onSave: (front: string, back: string, due: number) => void | Promise<void>;
  onDelete: () => void | Promise<void>;
}) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [due, setDue] = useState<number>(Date.now());
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (editing) {
      setFront(editing.front);
      setBack(editing.back);
      setDue(editing.due);
      setConfirmDelete(false);
    }
  }, [editing]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;
    setSaving(true);
    try {
      await onSave(front.trim(), back.trim(), due);
    } finally {
      setSaving(false);
    }
  }

  function startOfTomorrow9am(): number {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    return d.getTime();
  }

  return (
    <AnimatePresence>
      {editing && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <form
              onSubmit={submit}
              className="pointer-events-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold tracking-tight">Edit card</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">Question (front)</label>
                  <textarea
                    required
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                    rows={2}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm resize-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider">Answer (back)</label>
                  <textarea
                    required
                    value={back}
                    onChange={(e) => setBack(e.target.value)}
                    rows={3}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm resize-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition"
                  />
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Next review</label>
                    <span className="text-xs text-slate-500 tabular-nums">{humanDue(due)}</span>
                  </div>
                  <input
                    type="datetime-local"
                    value={toDatetimeLocal(due)}
                    onChange={(e) => {
                      const ts = new Date(e.target.value).getTime();
                      if (Number.isFinite(ts)) setDue(ts);
                    }}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    <PresetButton label="Now" onClick={() => setDue(Date.now())} />
                    <PresetButton label="Tomorrow 9am" onClick={() => setDue(startOfTomorrow9am())} />
                    <PresetButton label="+3 days" onClick={() => setDue(Date.now() + 3 * DAY_MS)} />
                    <PresetButton label="+1 week" onClick={() => setDue(Date.now() + 7 * DAY_MS)} />
                    <PresetButton label="+1 month" onClick={() => setDue(Date.now() + 30 * DAY_MS)} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 mt-6">
                {confirmDelete ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600">Delete this card?</span>
                    <button
                      type="button"
                      onClick={onDelete}
                      className="h-9 px-3 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition"
                    >
                      Yes, delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="h-9 px-3 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="h-9 px-3 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                  >
                    Delete card
                  </button>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="h-10 px-4 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-70"
                  >
                    {saving ? 'Saving…' : 'Save changes'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function AiGenerateModal({
  open,
  onClose,
  onGenerate,
  onAddAll,
}: {
  open: boolean;
  onClose: () => void;
  onGenerate: (notes: string, count: number) => Promise<AiDraftCard[]>;
  onAddAll: (cards: AiDraftCard[]) => Promise<void>;
}) {
  const [notes, setNotes] = useState('');
  const [count, setCount] = useState(8);
  const [drafts, setDrafts] = useState<AiDraftCard[] | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setNotes('');
      setCount(8);
      setDrafts(null);
      setSelected(new Set());
      setError(null);
    }
  }, [open]);

  async function generate() {
    setError(null);
    setLoading(true);
    try {
      const cards = await onGenerate(notes, count);
      setDrafts(cards);
      setSelected(new Set(cards.map((_, i) => i)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  async function addAll() {
    if (!drafts) return;
    const accepted = drafts.filter((_, i) => selected.has(i));
    if (accepted.length === 0) return;
    setSaving(true);
    try {
      await onAddAll(accepted);
    } finally {
      setSaving(false);
    }
  }

  function toggle(i: number) {
    const next = new Set(selected);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setSelected(next);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-2xl max-h-[85vh] rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-lg font-bold tracking-tight">Generate cards with AI</h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!drafts ? (
                <div className="p-5 space-y-4 overflow-y-auto">
                  <div>
                    <label className="block mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Your notes
                    </label>
                    <textarea
                      autoFocus
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Paste your notes, a textbook excerpt, or any study material (min 20 chars, max 20,000)…"
                      rows={10}
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm resize-y focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition font-mono"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                      <span>{notes.trim().length} chars</span>
                      <span>Llama 3.3 70B · via Groq</span>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Number of cards: <span className="text-slate-900 tabular-nums">{count}</span>
                    </label>
                    <input
                      type="range"
                      min={3}
                      max={20}
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                      className="w-full accent-slate-900"
                    />
                  </div>

                  {error && (
                    <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
                      {error}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-5 overflow-y-auto space-y-2">
                  <div className="text-xs text-slate-500 mb-2">
                    {selected.size} of {drafts.length} selected · click to toggle
                  </div>
                  {drafts.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggle(i)}
                      className={`w-full text-left rounded-xl border p-4 transition ${
                        selected.has(i)
                          ? 'bg-indigo-50/50 border-indigo-300'
                          : 'bg-white border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                            selected.has(i)
                              ? 'bg-indigo-600 text-white'
                              : 'border border-slate-300'
                          }`}
                        >
                          {selected.has(i) && <Check className="w-3 h-3" strokeWidth={3} />}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] uppercase tracking-wider font-bold text-indigo-600">
                            Question
                          </div>
                          <p className="text-sm font-medium text-slate-900 mt-0.5">{c.front}</p>
                          <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 mt-2">
                            Answer
                          </div>
                          <p className="text-sm text-slate-600 mt-0.5">{c.back}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between gap-2 p-5 border-t border-slate-200 bg-slate-50/50">
                {!drafts ? (
                  <>
                    <span className="text-xs text-slate-500">
                      Free — uses your Groq API key
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="h-10 px-4 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={generate}
                        disabled={loading || notes.trim().length < 20}
                        className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                      >
                        {loading ? (
                          <>
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            Generating…
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" /> Generate
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setDrafts(null)}
                      className="text-xs font-medium text-slate-600 hover:text-slate-900"
                    >
                      ← Edit prompt
                    </button>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="h-10 px-4 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={addAll}
                        disabled={saving || selected.size === 0}
                        className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-50 inline-flex items-center gap-2"
                      >
                        {saving ? 'Adding…' : `Add ${selected.size} card${selected.size === 1 ? '' : 's'}`}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function PresetButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-7 px-2.5 rounded-md text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 hover:border-slate-300 hover:text-slate-900 transition"
    >
      {label}
    </button>
  );
}

export default function DeckDetailPage() {
  return (
    <Protected>
      <AppShell>
        <DeckDetailInner />
      </AppShell>
    </Protected>
  );
}
