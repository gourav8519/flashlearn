'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Rating } from './sm2';

export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: number;
  streak: number;
  lastReviewDate: string | null;
  xp: number;
  level: number;
  hasGroqApiKey: boolean;
  groqApiKeyPreview: string | null;
};

export type Deck = {
  id: string;
  userId: string;
  name: string;
  description: string;
  color: string;
  createdAt: number;
};

export type Card = {
  id: string;
  deckId: string;
  front: string;
  back: string;
  interval: number;
  ease: number;
  reps: number;
  due: number;
  lapses: number;
  createdAt: number;
};

export type Review = {
  id: string;
  cardId: string;
  userId: string;
  rating: Rating;
  reviewedAt: number;
  durationMs: number;
};

type State = {
  user: User | null;
  decks: Deck[];
  cards: Card[];
  reviews: Review[];
  loading: boolean;
  googleEnabled: boolean;
  aiEnabled: boolean;
};

export type AiDraftCard = { front: string; back: string };

type Actions = {
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logInGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  updateProfile: (updates: { name?: string; email?: string; groqApiKey?: string | null }) => Promise<void>;

  createDeck: (name: string, description?: string) => Promise<Deck>;
  deleteDeck: (id: string) => Promise<void>;
  getDeck: (id: string) => Deck | undefined;

  listCards: (deckId: string) => Card[];
  createCard: (deckId: string, front: string, back: string) => Promise<Card>;
  updateCard: (id: string, front: string, back: string, due?: number) => Promise<Card>;
  deleteCard: (id: string) => Promise<void>;

  getDueCards: (deckId?: string) => Card[];
  recordReview: (cardId: string, rating: Rating, durationMs: number) => Promise<void>;
  generateAiCards: (notes: string, count: number) => Promise<AiDraftCard[]>;

  refresh: () => Promise<void>;
  floats: { id: number; amount: number }[];
};

type Value = State & Actions;

const AppContext = createContext<Value | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}

async function api<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const res = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
    ...init,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? 'Request failed');
  return data as T;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [floats, setFloats] = useState<{ id: number; amount: number }[]>([]);

  const refresh = useCallback(async () => {
    try {
      const data = await api<{
        user: User | null;
        decks?: Deck[];
        cards?: Card[];
        reviews?: Review[];
        googleEnabled?: boolean;
        aiEnabled?: boolean;
      }>('/api/me');
      setUser(data.user);
      setDecks(data.decks ?? []);
      setCards(data.cards ?? []);
      setReviews(data.reviews ?? []);
      setGoogleEnabled(!!data.googleEnabled);
      setAiEnabled(!!data.aiEnabled);
    } catch {
      setUser(null);
      setDecks([]);
      setCards([]);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    refresh();
  }, [status, refresh]);

  const emitFloat = useCallback((amount: number) => {
    const id = Date.now() + Math.random();
    setFloats((f) => [...f, { id, amount }]);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 1500);
  }, []);

  const signUp = useCallback<Actions['signUp']>(async (email, password, name) => {
    await api('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.error) throw new Error(res.error);
    await refresh();
  }, [refresh]);

  const logIn = useCallback<Actions['logIn']>(async (email, password) => {
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.error) throw new Error('Invalid email or password');
    await refresh();
  }, [refresh]);

  const logInGoogle = useCallback<Actions['logInGoogle']>(async () => {
    await signIn('google', { callbackUrl: '/dashboard' });
  }, []);

  const logOut = useCallback(async () => {
    await signOut({ redirect: false });
    setUser(null);
    setDecks([]);
    setCards([]);
    setReviews([]);
  }, []);

  const updateProfile = useCallback<Actions['updateProfile']>(
    async (updates) => {
      const data = await api<{ user: User }>('/api/profile', {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      setUser(data.user);
    },
    [],
  );

  const createDeck = useCallback<Actions['createDeck']>(
    async (name, description = '') => {
      const data = await api<{ deck: Deck }>('/api/decks', {
        method: 'POST',
        body: JSON.stringify({ name, description }),
      });
      setDecks((prev) => [data.deck, ...prev]);
      return data.deck;
    },
    [],
  );

  const deleteDeck = useCallback<Actions['deleteDeck']>(
    async (id) => {
      await api(`/api/decks/${id}`, { method: 'DELETE' });
      setDecks((prev) => prev.filter((d) => d.id !== id));
      setCards((prev) => prev.filter((c) => c.deckId !== id));
    },
    [],
  );

  const getDeck = useCallback<Actions['getDeck']>(
    (id) => decks.find((d) => d.id === id),
    [decks],
  );

  const listCards = useCallback<Actions['listCards']>(
    (deckId) => cards.filter((c) => c.deckId === deckId),
    [cards],
  );

  const createCard = useCallback<Actions['createCard']>(
    async (deckId, front, back) => {
      const data = await api<{ card: Card }>(`/api/decks/${deckId}/cards`, {
        method: 'POST',
        body: JSON.stringify({ front, back }),
      });
      setCards((prev) => [...prev, data.card]);
      return data.card;
    },
    [],
  );

  const updateCard = useCallback<Actions['updateCard']>(
    async (id, front, back, due) => {
      const data = await api<{ card: Card }>(`/api/cards/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ front, back, ...(due !== undefined ? { due } : {}) }),
      });
      setCards((prev) => prev.map((c) => (c.id === id ? data.card : c)));
      return data.card;
    },
    [],
  );

  const deleteCard = useCallback<Actions['deleteCard']>(
    async (id) => {
      await api(`/api/cards/${id}`, { method: 'DELETE' });
      setCards((prev) => prev.filter((c) => c.id !== id));
    },
    [],
  );

  const getDueCards = useCallback<Actions['getDueCards']>(
    (deckId) => {
      const now = Date.now();
      const userDeckIds = new Set(decks.map((d) => d.id));
      return cards.filter((c) => {
        if (!userDeckIds.has(c.deckId)) return false;
        if (deckId && c.deckId !== deckId) return false;
        return c.due <= now;
      });
    },
    [cards, decks],
  );

  const generateAiCards = useCallback<Actions['generateAiCards']>(
    async (notes, count) => {
      const data = await api<{ cards: AiDraftCard[] }>('/api/ai/generate', {
        method: 'POST',
        body: JSON.stringify({ notes, count }),
      });
      return data.cards;
    },
    [],
  );

  const recordReview = useCallback<Actions['recordReview']>(
    async (cardId, rating, durationMs) => {
      const data = await api<{
        card: Card;
        review: Review;
        user: User;
        xpGained: number;
      }>('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({ cardId, rating, durationMs }),
      });
      setCards((prev) => prev.map((c) => (c.id === cardId ? data.card : c)));
      setReviews((prev) => [data.review, ...prev]);
      setUser(data.user);
      emitFloat(data.xpGained);
    },
    [emitFloat],
  );

  const value: Value = {
    user,
    decks,
    cards,
    reviews,
    loading,
    googleEnabled,
    aiEnabled,
    signUp,
    logIn,
    logInGoogle,
    logOut,
    updateProfile,
    createDeck,
    deleteDeck,
    getDeck,
    listCards,
    createCard,
    updateCard,
    deleteCard,
    getDueCards,
    recordReview,
    generateAiCards,
    refresh,
    floats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
