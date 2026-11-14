import React from 'react';
import Link from 'next/link';
import { Film, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/80 bg-canvas-subtle/60 text-ink">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center text-white shadow-sm">
                <Film className="w-4 h-4" />
              </div>
              <span className="font-semibold text-base tracking-tight text-ink">
                Videlto
              </span>
            </Link>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Commercial motion studio transforming product photography into high-converting 9:16 video ads for social commerce.
            </p>
          </div>

          {/* Product & Studio */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Studio & Tools
            </h4>
            <ul className="space-y-2 text-xs text-ink-secondary">
              <li>
                <Link href="/create" className="hover:text-ink transition-colors flex items-center gap-1 font-medium text-ink">
                  <span>Create Video Ad</span>
                  <ArrowUpRight className="w-3 h-3 text-accent-blue" />
                </Link>
              </li>
              <li>
                <Link href="/#styles" className="hover:text-ink transition-colors">
                  Signature Ad Styles
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-ink transition-colors">
                  How The Studio Works
                </Link>
              </li>
              <li>
                <Link href="/#gallery" className="hover:text-ink transition-colors">
                  Transformation Gallery
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-ink transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Signature Ad Styles */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Ad Formats
            </h4>
            <ul className="space-y-2 text-xs text-ink-secondary">
              <li>
                <Link href="/create?style=style1_explainer" className="hover:text-ink transition-colors block">
                  <span className="font-medium text-ink">Style 1: Explainer & Detailing</span>
                  <span className="block text-[11px] text-ink-muted">Deconstructed callout pointers</span>
                </Link>
              </li>
              <li>
                <Link href="/create?style=style2_spotlight" className="hover:text-ink transition-colors block">
                  <span className="font-medium text-ink">Style 2: Agency Spotlight</span>
                  <span className="block text-[11px] text-ink-muted">Punchy typography & card</span>
                </Link>
              </li>
              <li>
                <Link href="/create?style=style3_lifestyle" className="hover:text-ink transition-colors block">
                  <span className="font-medium text-ink">Style 3: Cinematic Lifestyle</span>
                  <span className="block text-[11px] text-ink-muted">3-beat human connection story</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-ink-secondary">
              <li>
                <Link href="/about" className="hover:text-ink transition-colors">
                  About Videlto & Motion Studio
                </Link>
              </li>
              <li>
                <Link href="/about#technology" className="hover:text-ink transition-colors">
                  Multimodal Architecture
                </Link>
              </li>
              <li>
                <Link href="/about#principles" className="hover:text-ink transition-colors">
                  Product Fidelity Guarantee
                </Link>
              </li>
              <li>
                <span className="text-ink-muted flex items-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Commercial Use Rights Included</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Videlto (Motion Studio). All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-ink transition-colors">Home</Link>
            <Link href="/create" className="hover:text-ink transition-colors">Create</Link>
            <Link href="/about" className="hover:text-ink transition-colors">About</Link>
            <Link href="/admin" className="hover:text-ink transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

