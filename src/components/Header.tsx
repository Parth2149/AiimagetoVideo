import React from 'react';
import Link from 'next/link';
import { Film, Sparkles, ArrowRight } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full border-b border-border/80 bg-canvas/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Film className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight text-ink flex items-center gap-1.5">
              Videlto
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 text-stone-700 bg-stone-100 rounded border border-stone-200 font-semibold tracking-wider">
                Studio
              </span>
            </span>
            <span className="text-[10px] text-ink-muted hidden sm:inline">Product Motion & Video Ads</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-ink-secondary">
          <Link href="/" className="hover:text-ink transition-colors">
            Home
          </Link>
          <Link href="/create" className="hover:text-ink transition-colors flex items-center gap-1 text-ink font-semibold">
            <span>Create Ad</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent-peach" />
          </Link>
          <Link href="/#styles" className="hover:text-ink transition-colors">
            Styles
          </Link>
          <Link href="/#how-it-works" className="hover:text-ink transition-colors">
            How It Works
          </Link>
          <Link href="/about" className="hover:text-ink transition-colors">
            About
          </Link>
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/80 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Studio Active</span>
          </div>
          <Link
            href="/create"
            className="btn-glossy px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <span>Create Video Ad</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
