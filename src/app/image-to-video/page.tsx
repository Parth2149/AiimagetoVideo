import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, CheckCircle2, Zap, Film, Layers, Sparkles, Smartphone, ShieldCheck } from 'lucide-react';
import TransformationGallery from '@/components/TransformationGallery';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://videlto.online';

export const metadata: Metadata = {
  title: {
    absolute: 'Image to Video AI — Turn Any Image into Video Ads Free | Videlto',
  },
  description:
    "Transform static product images into high-converting 9:16 and 16:9 commercial video ads in seconds with Videlto's free image to video AI engine. No video editing skills needed.",
  keywords: [
    'image to video',
    'image to video ai',
    'free image to video',
    'image to video generator',
    'ai video generator from image',
    'product image to video',
    'convert image to video',
    'image to video ad',
  ],
  alternates: {
    canonical: `${siteUrl}/image-to-video`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${siteUrl}/image-to-video`,
    siteName: 'Videlto',
    title: 'Image to Video AI — Turn Any Image into Video Ads Free | Videlto',
    description:
      'Transform static product images into high-converting 9:16 and 16:9 commercial video ads in seconds with Videlto AI.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Videlto Image to Video AI Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image to Video AI — Turn Any Image into Video Ads Free | Videlto',
    description:
      'Turn static product photos into studio-grade 9:16 video ads in 10 seconds. Free-to-try image to video AI engine.',
    images: ['/og-image.jpg'],
    creator: '@videlto',
  },
};

export default function ImageToVideoPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Image to Video AI Ad Generator',
    description:
      'Transform static product images into high-converting commercial video ads with AI.',
    url: `${siteUrl}/image-to-video`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Image to Video AI',
          item: `${siteUrl}/image-to-video`,
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex-1 w-full space-y-20 sm:space-y-28 py-10 sm:py-16">
        {/* 1. HERO */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Image to Video AI</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-ink leading-[1.1]">
            Image to Video AI: Turn Product Images into{' '}
            <span className="text-accent-blue">High-Converting Video Ads</span>
          </h1>

          <p className="text-base sm:text-lg text-ink-secondary leading-relaxed max-w-3xl mx-auto">
            Stop losing customers to static banner ads. Videlto&apos;s commercial image to video AI engine takes your raw product photos and produces bespoke 9:16 vertical and 16:9 landscape commercials in 10 seconds—complete with tactile pointer lines, cinematic zoom, and synchronized copywriting.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/create"
              className="btn-glossy w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-xl hover:scale-102 transition-transform"
            >
              <span>Convert Image to Video Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/#styles"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl font-semibold text-sm text-ink-secondary bg-white hover:bg-canvas-subtle border border-border transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore 3 Video Styles</span>
            </Link>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-ink-muted">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 1080×1920 MP4 Export
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Commercial Rights
            </span>
          </div>
        </section>

        {/* 2. THE PROBLEM & SOLUTION: WHY IMAGE TO VIDEO AI MATTERS */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-border shadow-card space-y-8">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-accent-blue">
                The Creative Velocity Advantage
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                Why Static Product Photos Are No Longer Enough
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Modern social commerce on Instagram, TikTok, and YouTube prioritizes full-screen vertical video over static photography. Ad platforms reward video with lower cost-per-click (CPC) and higher algorithmic distribution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-5 rounded-2xl bg-canvas-subtle/70 border border-border/80 space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-ink text-white flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-ink">3.8x Higher Click-Through Rates</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Moving visuals stop the scroll instantly. Dynamic motion graphics highlight product craftsmanship in the critical first 3 seconds of ad delivery.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-canvas-subtle/70 border border-border/80 space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-ink text-white flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-ink">Zero Production Delays</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Traditional video shoots take 3 to 4 weeks and cost thousands of dollars. Videlto turns existing product images into launch-ready ad creative in under 15 seconds.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-canvas-subtle/70 border border-border/80 space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-ink text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-ink">Absolute Product Fidelity</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Generic generative video tools hallucinate details and morph your product. Videlto preserves your exact shape, packaging, and texture with 100% fidelity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. TRANSFORMATION GALLERY */}
        <TransformationGallery
          subtitle="Watch how raw product images transform into high-impact commercials with synchronized editorial typography:"
          showCta={true}
        />

        {/* 4. INDUSTRY USE CASES */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-ink-muted">
              Built for Every Category
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Commercial Image to Video AI Tailored for Your Industry
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-border shadow-sm space-y-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide block">
                Food & Menus
              </span>
              <h3 className="text-sm font-bold text-ink">Artisanal Dining Ads</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Turn smartphone food photos into mouth-watering ads highlighting crispy toppings, fresh garnishes, and daily specials.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-border shadow-sm space-y-2">
              <span className="text-xs font-bold text-accent-blue uppercase tracking-wide block">
                Fashion & Apparel
              </span>
              <h3 className="text-sm font-bold text-ink">Luxury Editorial Drops</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Deconstruct garment stitching, premium cotton weights, and fit with high-fashion serifs and elegant pacing.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-border shadow-sm space-y-2">
              <span className="text-xs font-bold text-accent-peach uppercase tracking-wide block">
                Automotive & Fleet
              </span>
              <h3 className="text-sm font-bold text-ink">Heavy-Duty Capability</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Highlight horsepower, chassis specs, and aerodynamic body lines with muscular contrast and bold industrial hooks.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-border shadow-sm space-y-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wide block">
                D2C Electronics
              </span>
              <h3 className="text-sm font-bold text-ink">Feature-Rich Detailing</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Point out USB-C charging ports, noise-canceling microphones, and battery longevity with tactile pointer callouts.
              </p>
            </div>
          </div>
        </section>

        {/* 5. BOTTOM CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-ink text-white p-8 sm:p-12 rounded-3xl text-center space-y-5 shadow-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-peach">
              Fast, Free, & Automated
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Turn Your Product Images into Video Ads?
            </h2>
            <p className="text-xs sm:text-sm text-canvas-subtle/80 max-w-xl mx-auto leading-relaxed">
              Upload your photo, pick your director style, and download your 9:16 commercial video ad in seconds.
            </p>
            <div className="pt-2">
              <Link
                href="/create"
                className="btn-glossy px-8 py-4 rounded-2xl text-xs sm:text-sm font-bold inline-flex items-center gap-2"
              >
                <span>Start Generating with Image to Video AI</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
