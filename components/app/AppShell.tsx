'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Home,
  Layers,
  BarChart3,
  Settings,
  ChevronsUpDown,
  LogOut,
  Menu,
} from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { XPBar } from './XPBar';

const NAV = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/decks', icon: Layers, label: 'Decks' },
  { href: '/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, getDueCards } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const dueCount = getDueCards().length;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-32 w-[560px] h-[560px] rounded-full bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-cyan-500/10 to-transparent blur-3xl" />
      </div>

      <aside className="hidden lg:flex w-60 h-screen sticky top-0 border-r border-slate-200/70 bg-white/70 backdrop-blur-xl flex-col shrink-0">
        <SidebarContent pathname={pathname} dueCount={dueCount} onNavigate={() => {}} />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="lg:hidden fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 flex flex-col"
            >
              <SidebarContent
                pathname={pathname}
                dueCount={dueCount}
                onNavigate={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 border-b border-slate-200/60">
          <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-slate-700" />
              </button>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <XPBar />
            </div>
          </div>
        </header>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  pathname,
  dueCount,
  onNavigate,
}: {
  pathname: string | null;
  dueCount: number;
  onNavigate: () => void;
}) {
  const router = useRouter();
  const { user, logOut } = useApp();
  const [userOpen, setUserOpen] = useState(false);

  return (
    <>
      <div className="px-5 h-16 flex items-center gap-2 border-b border-slate-200/70">
        <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
          F
        </div>
        <span className="font-bold tracking-tight">FlashLearn</span>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`group relative flex items-center gap-3 px-3 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-indigo-600"
                />
              )}
              <Icon className={`w-4 h-4 transition-transform ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span>{item.label}</span>
              {item.href === '/decks' && dueCount > 0 && (
                <span className="ml-auto px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-semibold tabular-nums">
                  {dueCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-200/70 relative">
        <button
          onClick={() => setUserOpen((v) => !v)}
          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 transition"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-sm font-medium text-slate-900 truncate">{user?.name}</div>
            <div className="text-xs text-slate-500 truncate">{user?.email}</div>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-slate-400 shrink-0" />
        </button>
        <AnimatePresence>
          {userOpen && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full left-3 right-3 mb-2 rounded-xl bg-white border border-slate-200 shadow-xl p-1"
            >
              <Link
                href="/settings"
                onClick={() => {
                  setUserOpen(false);
                  onNavigate();
                }}
                className="w-full flex items-center gap-2 px-3 h-9 rounded-lg hover:bg-slate-100 text-sm text-slate-700 transition"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <button
                onClick={() => {
                  logOut();
                  router.push('/');
                }}
                className="w-full flex items-center gap-2 px-3 h-9 rounded-lg hover:bg-rose-50 text-sm text-rose-600 transition"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
