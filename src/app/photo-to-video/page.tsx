import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, CheckCircle2, Camera, Layers, Zap, ShieldCheck, Film, Sparkles } from 'lucide-react';
import TransformationGallery from '@/components/TransformationGallery';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://videlto.online';

export const metadata: Metadata = {
  title: {
    absolute: 'Photo to Video AI — Convert Product Photos into Video Ads | Videlto',
  },
  description:
    'Convert single product photos into cinematic video ads in 10 seconds. Free-to-try photo to video AI with automated callouts, camera motion, and voiceover.',
  keywords: [
    'photo to video',
    'ai photo to video',
    'photo to video free',
    'convert photo to video',
    'product photo to video',
    'photo to video maker',
    'turn photo into video ad',
    'photo to video app',
  ],
  alternates: {
    canonical: `${siteUrl}/photo-to-video`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${siteUrl}/photo-to-video`,
    siteName: 'Videlto',
    title: 'Photo to Video AI — Convert Product Photos into Video Ads | Videlto',
    description:
      'Convert single product photos into cinematic video ads in 10 seconds with Videlto AI.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Photo to Video AI — Videlto Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Photo to Video AI — Convert Product Photos into Video Ads | Videlto',
    description:
      'Convert single product photos into cinematic video ads in 10 seconds. Free-to-try photo to video AI.',
    images: ['/og-image.jpg'],
    creator: '@videlto',
  },
};

export default function PhotoToVideoPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Photo to Video AI Generator',
    description:
      'Convert any product photo into an editorial video ad in seconds with reference-anchored AI motion.',
    url: `${siteUrl}/photo-to-video`,
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
          name: 'Photo to Video AI',
          item: `${siteUrl}/photo-to-video`,
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-accent-blue text-xs font-semibold">
            <Camera className="w-3.5 h-3.5" />
            <span>Automated Photo to Video Pipeline</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-ink leading-[1.1]">
            Photo to Video: Convert Any Product Photo into a{' '}
            <span className="text-emerald-700">Cinematic Commercial</span>
          </h1>

          <p className="text-base sm:text-lg text-ink-secondary leading-relaxed max-w-3xl mx-auto">
            Take a smartphone photo of your product, upload it to Videlto, and download a launch-ready 9:16 vertical commercial video ad in 10 seconds. Our photo to video AI directs professional camera kinematics, color harmonies, and conversion-optimized copywriting around your exact product.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/create"
              className="btn-glossy w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-xl hover:scale-102 transition-transform"
            >
              <span>Convert Your Photo to Video Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/#how-it-works"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl font-semibold text-sm text-ink-secondary bg-white hover:bg-canvas-subtle border border-border transition-colors flex items-center justify-center gap-2"
            >
              <span>How Photo to Video Works</span>
            </Link>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-ink-muted">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 1–5 Photos Per Job
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Multi-Angle Support
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant H.264 MP4
            </span>
          </div>
        </section>

        {/* 2. THREE-STEP CONVERSION WORKFLOW */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-border shadow-card space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                Effortless 3-Step Process
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                How Videlto Converts Photos into Commercial Ads
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-canvas-subtle/50 border border-border/80 space-y-3">
                <span className="w-8 h-8 rounded-lg bg-ink text-white font-mono font-bold text-xs flex items-center justify-center">
                  01
                </span>
                <h3 className="text-base font-bold text-ink">Upload Your Product Photo</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Drag and drop 1 to 5 photos from your phone or catalog (JPEG, PNG, WebP, JFIF). You can also paste an image URL directly from your Shopify or Amazon store.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-canvas-subtle/50 border border-border/80 space-y-3">
                <span className="w-8 h-8 rounded-lg bg-ink text-white font-mono font-bold text-xs flex items-center justify-center">
                  02
                </span>
                <h3 className="text-base font-bold text-ink">Choose Ad Direction & Style</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Select between Explainer (tactile callout pointers), Agency Spotlight (cinematic push-in zoom), or Lifestyle Story (human connection narrative). Customize your CTA text in real time.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-canvas-subtle/50 border border-border/80 space-y-3">
                <span className="w-8 h-8 rounded-lg bg-ink text-white font-mono font-bold text-xs flex items-center justify-center">
                  03
                </span>
                <h3 className="text-base font-bold text-ink">Download & Scale Ad Campaigns</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Export high-definition 1080×1920 MP4 files formatted with faststart metadata for instant streaming on Meta Ads Manager, TikTok Ads, and YouTube Shorts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. TRANSFORMATION GALLERY */}
        <TransformationGallery
          titlePrefix="Raw Product Photo In"
          subtitle="Real results from real photos: see how simple product shots convert into agency-grade video ads:"
          showCta={true}
        />

        {/* 4. REAL-WORLD VERTICALS */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-ink-muted">
              High Performance Across Sectors
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Tested & Proven for High-Volume Video Production
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-border shadow-sm space-y-3">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                Restaurant & Fast Casual Dining
              </span>
              <h3 className="text-base font-bold text-ink">Turn Daily Dishes into Viral Food Reels</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Chefs and restaurant owners can snap a photo of any pizza, burger, salad, or dessert on their prep counter. Our photo to video AI identifies ingredients, generates appetizing typography, and produces ads that drive local foot traffic and online orders.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-border shadow-sm space-y-3">
              <span className="text-xs font-bold text-accent-blue uppercase tracking-wide">
                Direct-to-Consumer & Retail Packaging
              </span>
              <h3 className="text-base font-bold text-ink">Turn Static Product Packshots into Urgency Ads</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Replace flat white-background e-commerce photos with dramatic ambient backdrops, illuminated spotlights, and punchy promotional discount cards that convert shoppers within their first glance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-border shadow-sm space-y-3">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                Apparel & Luxury Accessories
              </span>
              <h3 className="text-base font-bold text-ink">Artisanal Callouts & Material Deconstruction</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Showcase fabric weaves, leather grain, waterproof membranes, and watch bezel craftsmanship with angled pointer lines and bespoke editorial display serifs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-border shadow-sm space-y-3">
              <span className="text-xs font-bold text-accent-peach uppercase tracking-wide">
                Commercial Equipment & Automotive
              </span>
              <h3 className="text-base font-bold text-ink">Muscular Angles & Capability Highlights</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Highlight horsepower, towing capacity, suspension setups, and payload specs from fleet photography with high-durability industrial typography.
              </p>
            </div>
          </div>
        </section>

        {/* 5. BOTTOM CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-ink text-white p-8 sm:p-12 rounded-3xl text-center space-y-5 shadow-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-peach">
              No Studio Required
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Transform Your Product Photos into Video Ads Now
            </h2>
            <p className="text-xs sm:text-sm text-canvas-subtle/80 max-w-xl mx-auto leading-relaxed">
              Upload your photo, configure your brief, and get your finished MP4 video ad in 10 seconds.
            </p>
            <div className="pt-2">
              <Link
                href="/create"
                className="btn-glossy px-8 py-4 rounded-2xl text-xs sm:text-sm font-bold inline-flex items-center gap-2"
              >
                <span>Launch Photo to Video Generator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
