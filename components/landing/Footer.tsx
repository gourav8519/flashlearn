import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative border-t border-slate-200 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
            F
          </div>
          <span className="font-bold tracking-tight text-slate-900">FlashLearn</span>
        </Link>

        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span>
            Built by{' '}
            <span className="font-semibold text-slate-900">Gourav Sahu</span>
          </span>
          <a
            href="https://github.com/gourav8519"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/gourav-sahu01"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors"
          >
            <Linkedin className="w-4 h-4" />
            <span className="hidden sm:inline">LinkedIn</span>
          </a>
        </div>

        <div className="text-xs text-slate-500">
          © {new Date().getFullYear()} FlashLearn
        </div>
      </div>
    </footer>
  );
}
