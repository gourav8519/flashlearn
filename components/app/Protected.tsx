'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useApp } from '@/lib/app-context';

export function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <span className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-slate-700 animate-spin" />
          Loading…
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
