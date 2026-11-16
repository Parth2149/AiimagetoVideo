import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/80 bg-canvas-subtle/60 text-ink">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          {/* 1. Brand Info */}
          <div className="sm:col-span-2 md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="Videlto Logo"
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
              <span className="font-extrabold text-xl tracking-tight text-ink">
                Videlto
              </span>
            </Link>
            <p className="text-xs text-ink-secondary leading-relaxed">
              AI image-to-video ad studio turning static product photography into high-converting video ads for social commerce.
            </p>
          </div>

          {/* 2. SEO Solutions & Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent-blue" />
              <span>AI Video Tools</span>
            </h4>
            <ul className="space-y-2 text-xs text-ink-secondary">
              <li>
                <Link href="/image-to-video" className="hover:text-ink transition-colors font-medium text-ink">
                  Image to Video AI
                </Link>
              </li>
              <li>
                <Link href="/photo-to-video" className="hover:text-ink transition-colors font-medium text-ink">
                  Photo to Video Generator
                </Link>
              </li>
              <li>
                <Link href="/ai-product-video" className="hover:text-ink transition-colors font-medium text-ink">
                  AI Product Video Maker
                </Link>
              </li>
              <li>
                <Link href="/ecommerce-video-ads" className="hover:text-ink transition-colors font-medium text-ink">
                  Ecommerce Video Ads
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Studio & Features */}
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

          {/* 4. Signature Ad Formats */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Ad Formats
            </h4>
            <ul className="space-y-2 text-xs text-ink-secondary">
              <li>
                <Link href="/create?style=style1_explainer" className="hover:text-ink transition-colors block">
                  <span className="font-medium text-ink">Style 1: Explainer</span>
                  <span className="block text-[11px] text-ink-muted">Deconstructed callout pointers</span>
                </Link>
              </li>
              <li>
                <Link href="/create?style=style2_spotlight" className="hover:text-ink transition-colors block">
                  <span className="font-medium text-ink">Style 2: Spotlight</span>
                  <span className="block text-[11px] text-ink-muted">Punchy typography & deal card</span>
                </Link>
              </li>
              <li>
                <Link href="/create?style=style3_lifestyle" className="hover:text-ink transition-colors block">
                  <span className="font-medium text-ink">Style 3: Lifestyle</span>
                  <span className="block text-[11px] text-ink-muted">3-beat human connection story</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* 5. Company & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-ink-secondary">
              <li>
                <Link href="/about" className="hover:text-ink transition-colors">
                  About Videlto
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
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Commercial Rights Included</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Videlto. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/" className="hover:text-ink transition-colors">Home</Link>
            <Link href="/image-to-video" className="hover:text-ink transition-colors">Image to Video</Link>
            <Link href="/photo-to-video" className="hover:text-ink transition-colors">Photo to Video</Link>
            <Link href="/ai-product-video" className="hover:text-ink transition-colors">AI Product Video</Link>
            <Link href="/ecommerce-video-ads" className="hover:text-ink transition-colors">Ecommerce Ads</Link>
            <Link href="/create" className="hover:text-ink transition-colors">Studio</Link>
            <Link href="/about" className="hover:text-ink transition-colors">About</Link>
            <Link href="/admin" className="hover:text-ink transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
