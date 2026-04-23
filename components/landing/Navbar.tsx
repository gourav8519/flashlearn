'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300
                  ${scrolled || open ? 'bg-white/85 backdrop-blur-xl border-b border-slate-200/60' : 'bg-transparent'}`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
            F
          </div>
          <span className="font-bold tracking-tight text-slate-900">FlashLearn</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 h-9 inline-flex items-center text-sm text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/login"
            className="h-9 px-4 inline-flex items-center whitespace-nowrap text-sm font-medium text-slate-700 hover:text-slate-900 transition"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="group h-9 px-4 inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg
                       bg-gradient-to-b from-slate-900 to-slate-800 text-white text-sm font-semibold
                       shadow-[0_1px_0_rgba(255,255,255,0.1)_inset,0_4px_12px_-2px_rgba(15,15,25,0.3)]
                       hover:-translate-y-px active:translate-y-0 transition-all"
          >
            Start free
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="md:hidden w-10 h-10 inline-flex items-center justify-center rounded-lg
                     text-slate-700 hover:bg-slate-100 transition-colors
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="md:hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-3 h-11 flex items-center text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  {l.label}
                </a>
              ))}

              <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="h-11 rounded-lg inline-flex items-center justify-center text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="group h-11 rounded-lg inline-flex items-center justify-center gap-1.5
                             bg-gradient-to-b from-slate-900 to-slate-800 text-white text-sm font-semibold
                             shadow-[0_1px_0_rgba(255,255,255,0.1)_inset,0_4px_12px_-2px_rgba(15,15,25,0.3)]"
                >
                  Start free
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
