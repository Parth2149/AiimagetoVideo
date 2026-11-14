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
  DollarSign
} from 'lucide-react';

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

const SHOWCASE_STYLES: StyleShowcase[] = [
  {
    id: 'style1_explainer',
    name: '1. Explainer & Detailing',
    badge: 'Artisanal Callouts',
    description:
      'Deconstructs your product with numbered tactile tags, 45° bent elbow pointer lines, and elegant editorial display serifs.',
    bestFor: 'Food menus, gourmet dishes, consumer electronics, craftsmanship, cosmetics',
    videoUrl: '/verification_videos/salad_bowl_ad.mp4',
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
    videoUrl: '/verification_videos/test_pizza_lifestyle.mp4',
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

const BEFORE_AFTER = [
  {
    title: 'Wood-Fired Pepperoni Pizza',
    category: 'Restaurant & Food Service',
    photo: '/images.jfif',
    video: '/verification_videos/test_pizza_lifestyle.mp4',
    poster: '/verification_snapshots/pizza_poster.jpg',
    hook: '“CRISPY WOOD fired perfection EVERY SLICE”',
    features: ['Crispy Pepperoni Callout', 'Melted Mozzarella', 'Wood Fired Base'],
  },
  {
    title: 'Farm Fresh Garden Salad',
    category: 'Health & Fast Casual Dining',
    photo: '/salad-bowl.jpg',
    video: '/verification_videos/salad_bowl_ad.mp4',
    poster: '/verification_snapshots/salad_poster.jpg',
    hook: '“FRESHNESS in every bite”',
    features: ['Sliced Avocado Pointer', 'Sweet Corn Kernels', 'Organic Greens'],
  },
  {
    title: 'Commercial Fleet Hauler',
    category: 'Automotive & Logistics',
    photo: '/commercial-truck.jpg',
    video: '/verification_videos/commercial_truck_ad.mp4',
    poster: '/verification_snapshots/truck_poster.jpg',
    hook: '“BUILT FOR WORK • 500+ Horsepower”',
    features: ['Dual Chrome Stacks', 'Aerodynamic Cab', 'High-Durability Wheels'],
  },
];

const FAQS = [
  {
    q: 'What types of product photos can I upload?',
    a: 'You can upload photos of anything: dishes, beverages, clothing, electronics, automotive vehicles, cosmetics, or packaged goods. Our engine normalizes JPEG, PNG, WEBP, and JFIF formats in memory.',
  },
  {
    q: 'How does Videlto ensure my product looks 100% real?',
    a: 'Unlike generic generation tools that mutate or alter product shapes, Videlto uses reference-anchored visual analysis. Your exact product photo is preserved with absolute fidelity—we direct the lighting, camera movement, typography, and callouts around your real product.',
  },
  {
    q: 'What aspect ratios and video formats are produced?',
    a: 'Our default output is 9:16 vertical video (1080×1920, 30fps), encoded in standard MP4 (H.264/AAC) with faststart enabled. This makes it instantly ready to post on Instagram Reels, TikTok, YouTube Shorts, and Facebook Ads. 16:9 landscape is also supported.',
  },
  {
    q: 'Do I own the commercial rights to the video ads?',
    a: 'Yes! You own 100% full commercial rights to all generated video ads. You can use them freely in paid meta ads, organic social campaigns, website hero sections, and digital billboards.',
  },
  {
    q: 'Can I customize the copy, tone, and call to action?',
    a: 'Yes. In the Studio Creator (/create), you can input your own creative brief, choose from tone presets (Punchy, Luxurious, Warm, Direct Response), or specify your exact CTA like “Order Online” or “Book a Demo”.',
  },
];

export default function HomePage() {
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
      <section id="gallery" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 scroll-mt-28">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Transformation Gallery
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
            Static Photo In ➡️ High-Converting Video Ad Out
          </h2>
          <p className="text-sm text-ink-secondary leading-relaxed">
            See how one raw product photo produces an editorial commercial ad with dynamic color grading and synchronized copy:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BEFORE_AFTER.map((card, i) => (
            <div key={i} className="bg-white rounded-3xl border border-border p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink tracking-tight">{card.title}</span>
                <span className="text-[10px] text-ink-muted bg-canvas-subtle px-2 py-0.5 rounded-full border border-border/60">
                  {card.category}
                </span>
              </div>

              {/* Visual Split */}
              <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden border border-border/80 bg-canvas-subtle">
                <div className="space-y-1 p-2 bg-white">
                  <span className="text-[10px] font-mono uppercase text-ink-muted block text-center">
                    Original Photo
                  </span>
                  <div className="aspect-square rounded-xl overflow-hidden bg-black/5">
                    <img src={card.photo} alt={card.title} className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="space-y-1 p-2 bg-white">
                  <span className="text-[10px] font-mono uppercase text-accent-blue block text-center font-bold">
                    Finished Video
                  </span>
                  <div className="aspect-square rounded-xl overflow-hidden bg-black relative shadow-inner">
                    <video
                      src={card.video}
                      poster={card.poster}
                      muted
                      loop
                      playsInline
                      autoPlay
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-ink italic block">{card.hook}</span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {card.features.map((f, fi) => (
                    <span key={fi} className="text-[10px] px-2 py-0.5 rounded-md bg-canvas-subtle text-ink-secondary border border-border/60">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

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
              Drop any smartphone photo, DSLR shot, or e-commerce asset. Our system converts and normalizes your photo in memory.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-border shadow-card space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-accent-blue text-white flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-ink">Creative Direction & Scene Mapping</h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Our creative director analyzes visible features, extracts a cohesive color palette, writes editorial headlines, and maps precise pointer coordinates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-border shadow-card space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-ink">Download Studio 9:16 MP4</h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Export high-definition 1080×1920 video with faststart encoding. Instant playback on Instagram Reels, TikTok, and YouTube Shorts.
            </p>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. AGENCY VS VIDELTO COMPARISON TABLE                               */}
      {/* =================================================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-ink-muted">
            Value Comparison
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            Traditional Creative Agency vs. Videlto
          </h2>
        </div>

        <div className="rounded-3xl border border-border bg-white overflow-hidden shadow-card">
          <div className="grid grid-cols-3 bg-canvas-subtle p-4 font-bold text-xs text-ink border-b border-border">
            <span>Production Factor</span>
            <span className="text-rose-700">Traditional Agency</span>
            <span className="text-emerald-700 font-bold">Videlto</span>
          </div>

          <div className="divide-y divide-border/60 text-xs text-ink-secondary">
            <div className="grid grid-cols-3 p-4 items-center">
              <span className="font-semibold text-ink">Cost per Video</span>
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
              Ready to Turn Your Product Photos into Viral Video Ads?
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Upload your photo now. In 10 seconds, download an editorial 9:16 vertical commercial ad ready to launch on Instagram, TikTok, and Shorts.
            </p>
          </div>
          <Link
            href="/create"
            className="px-8 py-4 rounded-2xl bg-white text-ink font-bold text-sm sm:text-base hover:bg-canvas-subtle transition-all shadow-xl shrink-0 flex items-center gap-2.5"
          >
            <span>Launch Studio Creator</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
