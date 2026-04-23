'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { AuthShell } from '@/components/auth/AuthShell';
import { useApp } from '@/lib/app-context';

export default function LoginPage() {
  const router = useRouter();
  const { user, logIn, logInGoogle, googleEnabled } = useApp();
  const [email, setEmail] = useState('s001gourav@gmail.com');
  const [password, setPassword] = useState('Sahug@6622');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) router.replace('/dashboard');
  }, [user, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await logIn(email.trim(), password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  }

  async function googleSignIn() {
    setError(null);
    setLoading(true);
    try {
      await logInGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Pick up where you left off. Your cards are waiting."
      quote={{
        text: "I went from re-reading my notes 5 times to reviewing 20 cards a day. My exam scores jumped 30%.",
        author: 'Priya Sharma',
        role: 'Medical student, AIIMS',
      }}
      footer={
        <>
          New to FlashLearn?{' '}
          <Link href="/signup" className="text-indigo-600 font-semibold hover:text-indigo-700">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {googleEnabled && (
          <>
            <GoogleButton onClick={googleSignIn} />
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
          </>
        )}

        <Field
          label="Email"
          icon={<Mail className="w-4 h-4" />}
          input={
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-11 pl-10 pr-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition"
            />
          }
        />

        <Field
          label="Password"
          icon={<Lock className="w-4 h-4" />}
          aside={
            <Link href="#" className="text-xs text-indigo-600 font-semibold hover:text-indigo-700">
              Forgot?
            </Link>
          }
          input={
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-10 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          }
        />

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <label className="flex items-center gap-2 text-sm text-slate-600 pt-1">
          <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
          Keep me signed in
        </label>

        <button
          type="submit"
          disabled={loading}
          className="group w-full h-11 rounded-xl inline-flex items-center justify-center gap-2
                     bg-gradient-to-b from-indigo-500 to-indigo-600 text-white font-semibold text-sm
                     shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_10px_30px_-6px_rgba(79,70,229,0.55)]
                     hover:shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_14px_36px_-6px_rgba(79,70,229,0.65)]
                     hover:-translate-y-px active:translate-y-0 transition-all
                     disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <>
              Log in
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}

function Field({
  label,
  icon,
  input,
  aside,
}: {
  label: string;
  icon: React.ReactNode;
  input: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        {aside}
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
          {icon}
        </span>
        {input}
      </div>
    </div>
  );
}

function GoogleButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-11 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-sm font-semibold text-slate-700 flex items-center justify-center gap-2.5 transition"
    >
      <svg className="w-4 h-4" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.9-8 19.9-20 0-1.3-.1-2.5-.3-3.5z" />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.3-7.2 2.3-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.3-.1-2.5-.4-3.5z" />
      </svg>
      Continue with Google
    </button>
  );
}
