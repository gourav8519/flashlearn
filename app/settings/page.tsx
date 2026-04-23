'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Check, LogOut, User as UserIcon, Mail, Key, Sparkles, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { AppShell } from '@/components/app/AppShell';
import { Protected } from '@/components/app/Protected';
import { useApp } from '@/lib/app-context';

function SettingsInner() {
  const router = useRouter();
  const { user, updateProfile, logOut } = useApp();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [saved, setSaved] = useState(false);

  function save(e: React.FormEvent) {
    e.preventDefault();
    updateProfile({ name: name.trim(), email: email.trim().toLowerCase() });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  function handleLogout() {
    logOut();
    router.push('/');
  }

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-1 text-sm">Manage your profile and account</p>
      </div>

      <section className="rounded-2xl bg-white border border-slate-200/70 p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold">Profile</h2>
            <p className="text-sm text-slate-500 mt-0.5">Your public display info</p>
          </div>
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-white text-xl font-bold shadow-md">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
        </div>

        <form onSubmit={save} className="space-y-4">
          <Field
            label="Name"
            icon={<UserIcon className="w-4 h-4" />}
            input={
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 pl-10 pr-3 rounded-xl bg-white border border-slate-200 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition"
              />
            }
          />
          <Field
            label="Email"
            icon={<Mail className="w-4 h-4" />}
            input={
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-3 rounded-xl bg-white border border-slate-200 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition"
              />
            }
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="h-10 px-4 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
            >
              Save changes
            </button>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                <Check className="w-4 h-4" /> Saved
              </span>
            )}
          </div>
        </form>
      </section>

      <ApiKeySection />

      <PasswordSection />

      <section className="rounded-2xl bg-white border border-slate-200/70 p-6">
        <h2 className="text-lg font-bold">Progress</h2>
        <p className="text-sm text-slate-500 mt-0.5">Your stats at a glance</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <Stat label="Level" value={String(user?.level ?? 1)} />
          <Stat label="XP" value={String(user?.xp ?? 0)} />
          <Stat label="Streak" value={`${user?.streak ?? 0}d`} />
          <Stat label="Member since" value={memberSince(user?.createdAt)} />
        </div>
      </section>

      <section className="rounded-2xl bg-white border border-slate-200/70 p-6">
        <h2 className="text-lg font-bold">Account</h2>
        <p className="text-sm text-slate-500 mt-0.5">Session and data management</p>
        <div className="mt-4 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 h-12 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
          >
            <span className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
              <LogOut className="w-4 h-4" /> Log out
            </span>
            <span className="text-slate-400">→</span>
          </button>
        </div>
      </section>
    </div>
  );
}

function ApiKeySection() {
  const { user, updateProfile } = useApp();
  const [value, setValue] = useState('');
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setError(null);
    if (!value.trim()) return;
    setSaving(true);
    try {
      await updateProfile({ groqApiKey: value.trim() });
      setValue('');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save key');
    } finally {
      setSaving(false);
    }
  }

  async function clear() {
    if (!confirm('Remove your Groq API key? AI generation will stop working.')) return;
    setSaving(true);
    try {
      await updateProfile({ groqApiKey: null });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl bg-white border border-slate-200/70 p-6">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            AI generation
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Add your free Groq API key to generate flashcards from notes
          </p>
        </div>
        {user?.hasGroqApiKey && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        )}
      </div>

      {user?.hasGroqApiKey ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 px-3 h-11 rounded-xl bg-slate-50 border border-slate-200 font-mono text-sm text-slate-700">
            <Key className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="flex-1 tabular-nums">{user.groqApiKeyPreview}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                /* noop — focus replace below */
              }}
              className="hidden"
            />
            <button
              onClick={clear}
              disabled={saving}
              className="h-9 px-3 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition disabled:opacity-50"
            >
              Remove key
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <label className="block mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
              Replace key
            </label>
            <KeyInput
              value={value}
              onChange={setValue}
              show={show}
              toggleShow={() => setShow((s) => !s)}
            />
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={save}
                disabled={saving || !value.trim()}
                className="h-9 px-3 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save new key'}
              </button>
              {saved && (
                <span className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
                  <Check className="w-3.5 h-3.5" /> Saved
                </span>
              )}
              {error && <span className="text-xs text-rose-600">{error}</span>}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="rounded-xl bg-indigo-50/50 border border-indigo-100 p-4 text-sm">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="space-y-2 min-w-0">
                <div className="font-semibold text-slate-900">Get a free key in 30 seconds</div>
                <ol className="space-y-1 text-slate-600 list-decimal list-inside">
                  <li>
                    Visit{' '}
                    <a
                      href="https://console.groq.com/keys"
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 font-semibold hover:underline inline-flex items-center gap-0.5"
                    >
                      console.groq.com/keys
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>Sign in with Google (no card required)</li>
                  <li>Create API Key → paste below</li>
                </ol>
              </div>
            </div>
          </div>

          <KeyInput
            value={value}
            onChange={setValue}
            show={show}
            toggleShow={() => setShow((s) => !s)}
          />

          <div className="flex items-center gap-2">
            <button
              onClick={save}
              disabled={saving || !value.trim()}
              className="h-10 px-4 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save API key'}
            </button>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                <Check className="w-4 h-4" /> Saved
              </span>
            )}
            {error && <span className="text-sm text-rose-600">{error}</span>}
          </div>
        </div>
      )}
    </section>
  );
}

function PasswordSection() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!current || !next) {
      setError('Fill both password fields.');
      return;
    }
    if (next !== confirm) {
      setError('New passwords do not match.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/profile/password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? 'Failed to change password');
      setCurrent('');
      setNext('');
      setConfirm('');
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl bg-white border border-slate-200/70 p-6">
      <h2 className="text-lg font-bold">Change password</h2>
      <p className="text-sm text-slate-500 mt-0.5">
        Must be at least 8 characters and include a letter and a number.
      </p>

      <form onSubmit={save} className="mt-4 space-y-3">
        <PasswordField
          label="Current password"
          value={current}
          onChange={setCurrent}
          show={showCurrent}
          toggleShow={() => setShowCurrent((s) => !s)}
          autoComplete="current-password"
        />
        <PasswordField
          label="New password"
          value={next}
          onChange={setNext}
          show={showNext}
          toggleShow={() => setShowNext((s) => !s)}
          autoComplete="new-password"
        />
        <PasswordField
          label="Confirm new password"
          value={confirm}
          onChange={setConfirm}
          show={showNext}
          toggleShow={() => setShowNext((s) => !s)}
          autoComplete="new-password"
        />

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={saving || !current || !next || !confirm}
            className="h-10 px-4 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Update password'}
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
              <Check className="w-4 h-4" /> Password updated
            </span>
          )}
          {error && <span className="text-sm text-rose-600">{error}</span>}
        </div>
      </form>
    </section>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  toggleShow,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  toggleShow: () => void;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="block mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className="w-full h-11 pl-10 pr-10 rounded-xl bg-white border border-slate-200 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition"
        />
        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function KeyInput({
  value,
  onChange,
  show,
  toggleShow,
}: {
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  toggleShow: () => void;
}) {
  return (
    <div className="relative">
      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="gsk_..."
        className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 bg-white text-sm font-mono focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition"
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

function Field({
  label,
  icon,
  input,
}: {
  label: string;
  icon: React.ReactNode;
  input: React.ReactNode;
}) {
  return (
    <div>
      <label className="block mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
          {icon}
        </span>
        {input}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-4">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{label}</div>
      <div className="text-2xl font-bold tracking-tight mt-1 tabular-nums">{value}</div>
    </div>
  );
}

function memberSince(ts?: number) {
  if (!ts) return '—';
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function SettingsPage() {
  return (
    <Protected>
      <AppShell>
        <SettingsInner />
      </AppShell>
    </Protected>
  );
}
