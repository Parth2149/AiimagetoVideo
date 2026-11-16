import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, CheckCircle2, TrendingUp, DollarSign, Smartphone, Zap, ShieldCheck } from 'lucide-react';
import TransformationGallery from '@/components/TransformationGallery';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://videlto.online';

export const metadata: Metadata = {
  title: {
    absolute: 'Ecommerce Video Ads Maker — High-ROAS AI Video Ads in Seconds | Videlto',
  },
  description:
    'Boost ROAS on Meta, TikTok, and YouTube with automated ecommerce video ads. Turn product photos into high-converting 9:16 vertical commercials instantly.',
  keywords: [
    'ecommerce video',
    'ecommerce video ads',
    'ai video ad',
    'ai ad video generator',
    'social commerce video maker',
    'tiktok shop ads generator',
    'reels video ads for ecommerce',
    'dtc video ads',
  ],
  alternates: {
    canonical: `${siteUrl}/ecommerce-video-ads`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${siteUrl}/ecommerce-video-ads`,
    siteName: 'Videlto',
    title: 'Ecommerce Video Ads Maker — High-ROAS AI Video Ads in Seconds | Videlto',
    description:
      'Boost ROAS on Meta, TikTok, and YouTube with automated ecommerce video ads from Videlto.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ecommerce Video Ads Generator — Videlto Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ecommerce Video Ads Maker — High-ROAS AI Video Ads in Seconds | Videlto',
    description:
      'Turn product photos into high-converting 9:16 ecommerce video ads in seconds.',
    images: ['/og-image.jpg'],
    creator: '@videlto',
  },
};

export default function EcommerceVideoAdsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Ecommerce Video Ads Generator',
    description:
      'High-ROAS AI video ad generator for ecommerce and DTC brands. Scale ad testing across Instagram Reels, TikTok, and YouTube Shorts.',
    url: `${siteUrl}/ecommerce-video-ads`,
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
          name: 'Ecommerce Video Ads',
          item: `${siteUrl}/ecommerce-video-ads`,
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
            <TrendingUp className="w-3.5 h-3.5" />
            <span>High-ROAS Ad Creative Generator</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-ink leading-[1.1]">
            Ecommerce Video Ads: High-ROAS{' '}
            <span className="text-emerald-700">AI Video Ad Generator</span> for Modern Brands
          </h1>

          <p className="text-base sm:text-lg text-ink-secondary leading-relaxed max-w-3xl mx-auto">
            Scale your paid social marketing without scaling your overhead. Videlto turns single product photos into direct-response 9:16 vertical ecommerce video ads designed to maximize click-through rate, lower customer acquisition cost (CAC), and drive immediate revenue.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/create"
              className="btn-glossy w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-xl hover:scale-102 transition-transform"
            >
              <span>Create Ecommerce Video Ad Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/#styles"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl font-semibold text-sm text-ink-secondary bg-white hover:bg-canvas-subtle border border-border transition-colors flex items-center justify-center gap-2"
            >
              <span>See Ad Formats</span>
            </Link>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-ink-muted">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Meta & TikTok Ad Specs
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 10-Second Render Time
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Perpetual Commercial Rights
            </span>
          </div>
        </section>

        {/* 2. PERFORMANCE PLAYBOOK */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-border shadow-card space-y-8">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                Performance Advertising Playbook
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                Unlock High Creative Velocity for Meta, TikTok & YouTube
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Media buying is won with creative testing volume. Videlto allows growth marketers to test 10+ ad variations per week at a fraction of agency costs:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-canvas-subtle/50 border border-border/80 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-ink text-white flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-ink">Native 9:16 Vertical Ratio</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Export 1080×1920 pixels designed specifically for the mobile feed experience. Zero letterboxing or stretching—every element is positioned for maximum screen real estate.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-canvas-subtle/50 border border-border/80 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-ink text-white flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-ink">Dynamic Hook Copywriting</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Tailored direct-response headlines and value propositions capture consumer attention within the first 1.5 seconds, reducing bounce rates and increasing video retention.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-canvas-subtle/50 border border-border/80 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-ink text-white flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-ink">98% Lower Production Cost</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Cut your cost per creative from $2,500 down to practically zero. Reinvest your production savings directly into paid media traffic to scale your revenue.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. TRANSFORMATION GALLERY */}
        <TransformationGallery
          subtitle="Real examples of ecommerce product photos transformed into high-converting vertical video ads:"
          showCta={true}
        />

        {/* 4. PLATFORM INTEGRATIONS & SPECS */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-ink-muted">
              Universal Platform Compatibility
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Pre-Configured for Major Social Ad Channels
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-2.5">
              <span className="text-xs font-bold text-accent-blue uppercase tracking-wide">
                Instagram & Facebook Reels
              </span>
              <h3 className="text-sm font-bold text-ink">Meta Advantage+ Friendly</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Clean visual hierarchy and safe zones ensure text overlays never get blocked by username or audio captions on Reels.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-2.5">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                TikTok & TikTok Shop
              </span>
              <h3 className="text-sm font-bold text-ink">High-Retention Creative</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Paced for rapid mobile scrolling with punchy offer cards and clear call-to-action buttons that convert shoppers in seconds.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-2.5">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wide">
                YouTube Shorts & Website
              </span>
              <h3 className="text-sm font-bold text-ink">Fast-Loading MP4 Assets</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Encoded with faststart moov atom flags for instantaneous playback with zero buffering on product landing pages and Shorts.
              </p>
            </div>
          </div>
        </section>

        {/* 5. BOTTOM CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-ink text-white p-8 sm:p-12 rounded-3xl text-center space-y-5 shadow-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-peach">
              Boost Your ROAS Today
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Start Generating High-ROAS Ecommerce Video Ads
            </h2>
            <p className="text-xs sm:text-sm text-canvas-subtle/80 max-w-xl mx-auto leading-relaxed">
              Upload your product photo, choose your preferred tone, and get a studio-quality video ad in 10 seconds.
            </p>
            <div className="pt-2">
              <Link
                href="/create"
                className="btn-glossy px-8 py-4 rounded-2xl text-xs sm:text-sm font-bold inline-flex items-center gap-2"
              >
                <span>Launch Ecommerce Video Ad Maker</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
