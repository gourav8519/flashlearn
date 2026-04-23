'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="relative py-16 sm:py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-10 md:p-16 bg-slate-900">
          <div className="relative text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-xs font-medium"
            >
              <Sparkles className="w-3 h-3" />
              Free forever · No card needed
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-5 text-white text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.1]"
            >
              Stop forgetting. Start remembering.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5 text-base sm:text-lg text-white/70 max-w-xl mx-auto px-2"
            >
              Your free account takes 30 seconds. Your first review session, 5 minutes.
              Your future self will thank you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex items-center justify-center gap-3 flex-wrap"
            >
              <Link
                href="/signup"
                className="group h-12 px-6 rounded-xl inline-flex items-center gap-2 bg-white text-slate-900 font-bold shadow-2xl hover:scale-105 active:scale-100 transition-transform"
              >
                Start free — no card
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/login"
                className="h-12 px-5 rounded-xl inline-flex items-center text-white/90 hover:text-white font-semibold transition"
              >
                Already have an account?
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
