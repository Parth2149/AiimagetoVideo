import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full border-b border-border/80 bg-canvas/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between">
        {/* Brand with Big Prominent Logo */}
        <Link href="/" className="flex items-center gap-3 sm:gap-3.5 group py-1">
          <img
            src="/logo.png"
            alt="Videlto Logo"
            className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
          />
          <div className="flex flex-col justify-center">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-ink flex items-center gap-1.5 leading-tight">
              Videlto
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 text-stone-700 bg-stone-100 rounded border border-stone-200 font-semibold tracking-wider">
                Studio
              </span>
            </span>
            <span className="text-[11px] text-ink-muted hidden sm:inline font-medium leading-none">Commercial Video Ad Studio</span>
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
