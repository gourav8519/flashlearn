'use client';

import { SessionProvider } from 'next-auth/react';
import { AppProvider } from '@/lib/app-context';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AppProvider>{children}</AppProvider>
    </SessionProvider>
  );
}
