'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Layers, Plus, Search, MoreHorizontal, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppShell } from '@/components/app/AppShell';
import { Protected } from '@/components/app/Protected';
import { useApp } from '@/lib/app-context';

function DecksInner() {
  const { decks, cards, createDeck, deleteDeck } = useApp();
  const [query, setQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const filtered = decks.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.description.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Your decks</h1>
          <p className="text-slate-500 mt-1 text-sm">
            {decks.length} deck{decks.length === 1 ? '' : 's'} ·{' '}
            {cards.filter((c) => decks.some((d) => d.id === c.deckId)).length} cards total
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="h-10 px-4 rounded-xl bg-gradient-to-b from-indigo-500 to-indigo-600 text-white font-semibold text-sm inline-flex items-center gap-2 shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:-translate-y-px transition-all"
        >
          <Plus className="w-4 h-4" /> New deck
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search decks…"
          className="w-full h-10 pl-9 pr-3 rounded-lg bg-white border border-slate-200 focus:border-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-100 text-sm transition"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState onCreate={() => setShowCreate(true)} hasQuery={query.length > 0} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((deck) => {
            const deckCards = cards.filter((c) => c.deckId === deck.id);
            const due = deckCards.filter((c) => c.due <= Date.now()).length;
            const mastery =
              deckCards.length === 0
                ? 0
                : Math.round(
                    (deckCards.filter((c) => c.reps >= 3).length / deckCards.length) * 100,
                  );

            return (
              <div
                key={deck.id}
                className="group relative rounded-2xl p-5 overflow-hidden bg-white border border-slate-200/70 hover:-translate-y-0.5 hover:shadow-lg transition-all"
              >
                <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity bg-gradient-to-br ${deck.color}`} />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <Link href={`/decks/${deck.id}`} className="block">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${deck.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                        <Layers className="w-5 h-5" />
                      </div>
                    </Link>
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === deck.id ? null : deck.id)}
                        className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {menuOpen === deck.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-white border border-slate-200 shadow-xl p-1 z-10"
                          >
                            <button
                              onClick={() => {
                                if (confirm(`Delete "${deck.name}"? This cannot be undone.`)) {
                                  deleteDeck(deck.id);
                                }
                                setMenuOpen(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 h-9 rounded-lg hover:bg-rose-50 text-sm text-rose-600 transition"
                            >
                              <Trash2 className="w-4 h-4" /> Delete deck
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <Link href={`/decks/${deck.id}`} className="block mt-4">
                    <h3 className="text-lg font-bold tracking-tight text-slate-900 line-clamp-1">{deck.name}</h3>
                    <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">
                      {deck.description || 'No description'}
                    </p>

                    <div className="flex items-center gap-3 mt-4 text-xs text-slate-500">
                      <span>{deckCards.length} cards</span>
                      {due > 0 && (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          {due} due
                        </span>
                      )}
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500">Mastery</span>
                        <span className="font-semibold tabular-nums">{mastery}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${deck.color} rounded-full transition-all duration-700`}
                          style={{ width: `${mastery}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateDeckModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={(name, desc) => {
          createDeck(name, desc);
          setShowCreate(false);
        }}
      />
    </div>
  );
}

function EmptyState({ onCreate, hasQuery }: { onCreate: () => void; hasQuery: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 rotate-6" />
        <div className="absolute inset-0 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow">
          <Layers className="w-8 h-8 text-indigo-500" />
        </div>
      </div>
      <h3 className="text-xl font-bold tracking-tight">
        {hasQuery ? 'No decks match your search' : 'Your first deck awaits'}
      </h3>
      <p className="text-slate-500 mt-2 max-w-sm">
        {hasQuery ? 'Try a different keyword.' : 'Decks are collections of flashcards. Create one to start learning.'}
      </p>
      {!hasQuery && (
        <button
          onClick={onCreate}
          className="mt-6 h-10 px-4 rounded-xl bg-slate-900 text-white text-sm font-semibold inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create your first deck
        </button>
      )}
    </div>
  );
}

function CreateDeckModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim(), description.trim());
    setName('');
    setDescription('');
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
              className="pointer-events-auto w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold tracking-tight">Create new deck</h3>
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
                  <label className="block mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">Name</label>
                  <input
                    autoFocus
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Biology · Cell structure"
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">Description <span className="text-slate-400 font-normal">(optional)</span></label>
                  <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A short note about what's inside"
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition"
                  />
                </div>
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
                  Create deck
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function DecksPage() {
  return (
    <Protected>
      <AppShell>
        <DecksInner />
      </AppShell>
    </Protected>
  );
}
