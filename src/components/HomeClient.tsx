'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Layers,
  Film,
  Zap,
  ShieldCheck,
  TrendingUp,
  Clock,
  Smartphone,
  ChevronDown,
  Eye,
  Sliders,
  DollarSign,
} from 'lucide-react';
import TransformationGallery from '@/components/TransformationGallery';
import { FAQS } from '@/lib/faqs';

interface StyleShowcase {
  id: string;
  name: string;
  badge: string;
  description: string;
  bestFor: string;
  videoUrl: string;
  posterSnapshot: string;
  accent: string;
  highlights: string[];
}

export const SHOWCASE_STYLES: StyleShowcase[] = [
  {
    id: 'style1_explainer',
    name: '1. Explainer & Detailing',
    badge: 'Artisanal Callouts',
    description:
      'Deconstructs your product with numbered tactile tags, 45° bent elbow pointer lines, and elegant editorial display serifs.',
    bestFor: 'Food menus, gourmet dishes, consumer electronics, craftsmanship, cosmetics',
    videoUrl: '/examples/style1_explainer.mp4',
    posterSnapshot: '/examples/style1_poster.jpg',
    accent: '#4E7D56',
    highlights: [
      'Numbered ingredient / feature tags (01..04)',
      'Subtle baseline slide-up reveals',
      'Harmonized 7-color palette extracted from photo',
      'No text overlapping product hero',
    ],
  },
  {
    id: 'style2_spotlight',
    name: '2. Agency Spotlight',
    badge: 'High-Impact Social Ad',
    description:
      'A cinematic 9:16 push-in zoom, ambient backdrop illumination, high-contrast glassmorphic cards, and punchy copywriting.',
    bestFor: 'Direct-response social ads, limited-edition product drops, e-commerce flash sales',
    videoUrl: '/examples/style2_spotlight.mp4',
    posterSnapshot: '/examples/style2_poster.jpg',
    accent: '#E65100',
    highlights: [
      'Smooth cinematic 9:16 push-in zoom',
      'Dark ambient spotlight background',
      'Glassmorphic card with rounded corners',
      'High-contrast call to action pill',
    ],
  },
  {
    id: 'style3_lifestyle',
    name: '3. Cinematic Lifestyle Story',
    badge: 'Human Connection',
    description:
      'Authentic real-world environment and 3-beat candid human interaction storyboard with natural conversational voiceover.',
    bestFor: 'Dining experiences, lifestyle apparel, commercial vehicles, hospitality, wellness',
    videoUrl: '/examples/style3_lifestyle.mp4',
    posterSnapshot: '/examples/style3_poster.jpg',
    accent: '#D97706',
    highlights: [
      '3-Beat Storyboard (Entry, Savoring, Reaction)',
      'Zero on-screen text during video scene',
      'Subtle bottom dark gradient scrim',
      'Crisp editorial serif CTA fade-in on final 2.5s',
    ],
  },
];

export default function HomeClient() {
  const [activeStyleTab, setActiveStyleTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const currentStyle = SHOWCASE_STYLES[activeStyleTab];

  return (
    <div className="flex-1 w-full space-y-24 sm:space-y-32 py-10 sm:py-16">
      {/* =================================================================== */}
      {/* 1. HERO SECTION                                                     */}
      {/* =================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 text-center">
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Main H1 */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-ink leading-[1.08]">
            Turn Any Product Photo into a{' '}
            <span className="underline decoration-accent-peach/60 decoration-wavy decoration-2">
              Cinematic Video Ad
            </span>{' '}
            in Seconds.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-ink-secondary leading-relaxed max-w-2xl mx-auto">
            No expensive camera crews, no rigid templates. Upload a single photo—our creative director deconstructs visible features, selects an editorial palette, writes punchy hooks, and renders 9:16 ads for Reels, TikTok, and Shorts.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/create"
              className="btn-glossy w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 shadow-xl hover:scale-102 transition-transform"
            >
              <span>Create Your Video Ad Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#styles"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl font-semibold text-sm text-ink-secondary bg-white hover:bg-canvas-subtle border border-border transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Play className="w-4 h-4 fill-current text-ink" />
              <span>Watch 3 Ad Formats</span>
            </a>
          </div>

          {/* Trust Metrics */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-ink-secondary">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% Real Product Fidelity</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Crisp Agency Typography</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Commercial Rights Included</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Showcase Player */}
        <div className="max-w-4xl mx-auto rounded-3xl p-3 sm:p-5 bg-white border border-border shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3 px-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono text-ink-muted ml-2">Videlto Studio Player • 9:16 Vertical Export</span>
            </div>
            <Link href="/create" className="text-xs font-bold text-accent-blue hover:underline flex items-center gap-1">
              <span>Open Studio</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Grid: Player Left, Live Metadata Right */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Video Canvas (5 cols) */}
            <div className="md:col-span-5 flex justify-center">
              <div className="w-[260px] sm:w-[280px] aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-xl relative border border-border/80">
                <video
                  key={currentStyle.videoUrl}
                  src={`${currentStyle.videoUrl}#t=0.5`}
                  poster={currentStyle.posterSnapshot}
                  preload="metadata"
                  controls
                  autoPlay
                  playsInline
                  loop
                  muted
                  onLoadedMetadata={(e) => {
                    e.currentTarget.muted = true;
                    e.currentTarget.play().catch(() => {});
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Style Selector Tabs (7 cols) */}
            <div className="md:col-span-7 space-y-4 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted block">
                Select Format Preview:
              </span>

              <div className="space-y-2.5">
                {SHOWCASE_STYLES.map((style, idx) => {
                  const isActive = activeStyleTab === idx;
                  return (
                    <div
                      key={style.id}
                      onClick={() => setActiveStyleTab(idx)}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                        isActive
                          ? 'border-ink bg-canvas-subtle/70 shadow-sm ring-1 ring-ink'
                          : 'border-border/80 bg-white hover:bg-canvas-subtle/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-ink">{style.name}</span>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                          style={{ backgroundColor: `${style.accent}15`, color: style.accent }}
                        >
                          {style.badge}
                        </span>
                      </div>
                      <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
                        {style.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-ink-muted">Ready to test with your photo?</span>
                <Link
                  href={`/create?style=${currentStyle.id}`}
                  className="btn-glossy px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <span>Create in this Style</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. THE 3 SIGNATURE AD STYLES SECTION                                */}
      {/* =================================================================== */}
      <section id="styles" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 scroll-mt-28">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-blue">
            3 Signature Director Formats
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
            Engineered for Maximum Social Click-Through
          </h2>
          <p className="text-sm text-ink-secondary leading-relaxed">
            Different products require different creative hooks. Choose the ad format tailored to your target audience:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SHOWCASE_STYLES.map((style) => (
            <div
              key={style.id}
              className="bg-white rounded-3xl border border-border p-6 shadow-card space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                    style={{ backgroundColor: `${style.accent}15`, color: style.accent }}
                  >
                    {style.badge}
                  </span>
                  <span className="text-xs font-mono text-ink-muted">1080×1920 (9:16)</span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-ink tracking-tight">{style.name}</h3>
                  <p className="text-xs text-ink-secondary leading-relaxed">{style.description}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-canvas-subtle/60 border border-border/70 space-y-1.5">
                  <span className="text-[11px] font-bold text-ink uppercase tracking-wide block">
                    Ideal For:
                  </span>
                  <p className="text-xs text-ink-secondary leading-relaxed">{style.bestFor}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-ink uppercase tracking-wide block">
                    Key Director Features:
                  </span>
                  <ul className="space-y-1.5 text-xs text-ink-secondary">
                    {style.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-border/60">
                <Link
                  href={`/create?style=${style.id}`}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center block bg-canvas-subtle hover:bg-ink hover:text-white border border-border transition-all"
                >
                  Create {style.name.split('.')[1]} Ad →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. BEFORE & AFTER TRANSFORMATION GALLERY                            */}
      {/* =================================================================== */}
      <TransformationGallery />

      {/* =================================================================== */}
      {/* 4. HOW IT WORKS (3 SIMPLE STEPS)                                    */}
      {/* =================================================================== */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 scroll-mt-28">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-ink-muted">
            Simple 3-Step Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
            From Raw Photo to Launch-Ready Ad in 10 Seconds
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-border shadow-card space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-ink text-white flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-ink">Upload Any Product Photo</h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Drop 1 to 5 product photos (dishes, footwear, vehicles, electronics). Supports JPG, PNG, WebP, and JFIF.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-border shadow-card space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-ink text-white flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-ink">Select Ad Style & Copy</h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Choose Explainer, Agency Spotlight, or Cinematic Lifestyle. Use our automated creative tone presets or write your custom brief.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-border shadow-card space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-ink text-white flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-ink">Instant 9:16 Video Ad</h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Our automated engine directs camera motion, color harmony, and typography, exporting a crisp H.264 MP4 ready to scale.
            </p>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. COST & AGENCY COMPARISON TABLE                                   */}
      {/* =================================================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Economic Advantage
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Videlto vs. Traditional Creative Agencies
          </h2>
        </div>

        <div className="bg-white rounded-3xl border border-border shadow-card overflow-hidden">
          <div className="grid grid-cols-3 p-4 bg-canvas-subtle border-b border-border/80 text-xs font-bold text-ink">
            <span>Production Metric</span>
            <span>Traditional Agency</span>
            <span className="text-emerald-700">Videlto Studio</span>
          </div>

          <div className="divide-y divide-border/60 text-xs text-ink-secondary">
            <div className="grid grid-cols-3 p-4 items-center">
              <span className="font-semibold text-ink">Cost Per Video Ad</span>
              <span className="text-rose-700 font-mono">$1,500 – $3,500</span>
              <span className="text-emerald-700 font-bold font-mono">Free Trial / $9</span>
            </div>
            <div className="grid grid-cols-3 p-4 items-center">
              <span className="font-semibold text-ink">Turnaround Time</span>
              <span className="text-rose-700 font-mono">2 – 3 Weeks</span>
              <span className="text-emerald-700 font-bold font-mono">10 to 15 Seconds</span>
            </div>
            <div className="grid grid-cols-3 p-4 items-center">
              <span className="font-semibold text-ink">Production Gear</span>
              <span className="text-rose-700">Studio, Lights, Crews</span>
              <span className="text-emerald-700 font-bold">1 Smartphone Photo</span>
            </div>
            <div className="grid grid-cols-3 p-4 items-center">
              <span className="font-semibold text-ink">Revisions & Resizing</span>
              <span className="text-rose-700">Billable Hourly Rates</span>
              <span className="text-emerald-700 font-bold">1-Click Instant Regeneration</span>
            </div>
            <div className="grid grid-cols-3 p-4 items-center">
              <span className="font-semibold text-ink">Commercial Usage Rights</span>
              <span className="text-rose-700">Complex Licensing Caps</span>
              <span className="text-emerald-700 font-bold">100% Perpetual Commercial Rights</span>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 6. FAQ ACCORDION SECTION                                            */}
      {/* =================================================================== */}
      <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8 scroll-mt-28">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-ink-muted">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-white overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-ink flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-ink-muted shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-ink' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-ink-secondary leading-relaxed border-t border-border/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 7. FINAL HIGH-IMPACT CTA BANNER                                     */}
      {/* =================================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-ink text-white p-8 sm:p-14 rounded-3xl space-y-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 max-w-lg">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-peach">
              Start Generating Today
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Create Your First Commercial Video Ad in 10 Seconds
            </h2>
            <p className="text-xs sm:text-sm text-canvas-subtle/80 leading-relaxed">
              Join e-commerce brands, food creators, and modern agencies producing studio-quality video ads from simple product photos.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/create"
              className="btn-glossy w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Launch Studio Creator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
