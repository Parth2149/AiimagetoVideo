import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Film, CheckCircle2, ArrowRight, ShieldCheck, Zap, Layers, Cpu, Eye, Compass, Award } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://videlto.online';

export const metadata: Metadata = {
  title: {
    absolute: 'About Videlto — AI Ecommerce Video Ad Maker & Image-to-Video Engine',
  },
  description:
    'Learn how Videlto transforms product photos into studio-grade commercial video ads. Discover our multimodal AI image-to-video directing engine and product fidelity guarantee.',
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${siteUrl}/about`,
    siteName: 'Videlto',
    title: 'About Videlto — AI Ecommerce Video Ad Maker & Image-to-Video Engine',
    description:
      'Learn how Videlto transforms product photos into studio-grade commercial video ads. Discover our multimodal AI image-to-video directing engine and product fidelity guarantee.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'About Videlto AI Video Ad Maker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Videlto — AI Ecommerce Video Ad Maker & Image-to-Video Engine',
    description:
      'Learn how Videlto transforms product photos into studio-grade commercial video ads in seconds.',
    images: ['/og-image.jpg'],
    creator: '@videlto',
  },
};

export default function AboutPage() {
  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-20">
      {/* 1. Hero Section */}
      <section className="space-y-4 text-center sm:text-left">
        <span className="text-xs font-bold uppercase tracking-widest text-accent-blue block">
          Our Mission & Platform
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-ink leading-tight">
          Democratizing Studio-Quality Video Advertising for Every Brand
        </h1>
        <p className="text-base sm:text-xl text-ink-secondary leading-relaxed max-w-3xl">
          We built Videlto because modern social commerce requires high-velocity video advertising, yet traditional creative agencies charge $2,500 per video and take three weeks to deliver.
        </p>
      </section>

      {/* 2. Key Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl bg-white border border-border shadow-card space-y-1">
          <span className="text-2xl sm:text-4xl font-extrabold text-ink font-mono tracking-tight block">
            10s
          </span>
          <span className="text-xs text-ink-secondary font-medium block">
            Average Ad Generation
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-border shadow-card space-y-1">
          <span className="text-2xl sm:text-4xl font-extrabold text-accent-blue font-mono tracking-tight block">
            98.5%
          </span>
          <span className="text-xs text-ink-secondary font-medium block">
            Lower Cost vs Agencies
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-border shadow-card space-y-1">
          <span className="text-2xl sm:text-4xl font-extrabold text-emerald-700 font-mono tracking-tight block">
            100%
          </span>
          <span className="text-xs text-ink-secondary font-medium block">
            Product Image Fidelity
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-border shadow-card space-y-1">
          <span className="text-2xl sm:text-4xl font-extrabold text-ink font-mono tracking-tight block">
            3.4x
          </span>
          <span className="text-xs text-ink-secondary font-medium block">
            Higher Conversion ROAS
          </span>
        </div>
      </section>

      {/* 3. The Core Problem vs Our Solution */}
      <section className="bg-canvas-subtle/70 p-8 sm:p-12 rounded-3xl border border-border/80 space-y-8">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-ink-muted">
            The Industry Shift
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            Why Traditional Video Ad Production is Broken
          </h2>
          <p className="text-sm text-ink-secondary leading-relaxed max-w-2xl">
            Instagram Reels, TikTok, and YouTube Shorts algorithms punish repetitive creatives. Brands must test new video angles weekly. But hiring production crews, booking studio kitchens, and iterating motion graphics creates an unsustainable bottleneck.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-rose-200/80 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 block">
              Traditional Production Agency
            </span>
            <ul className="space-y-2 text-xs text-ink-secondary leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>$1,500 – $4,000 cost per commercial video asset</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>2 to 4 weeks turnaround from brief to final cut</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Requires camera crews, lighting sets, and studio time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Additional fees for revisions, resizing, and aspect ratios</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-emerald-300 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-emerald-600" />
              <span>Videlto</span>
            </span>
            <ul className="space-y-2 text-xs text-ink-secondary leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Instant free trial & fraction of the cost vs agencies</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Ready in 10 to 15 seconds, available 24/7 on demand</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Upload 1 photo from any phone or camera—no studio needed</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Full commercial usage rights and export to 9:16 vertical & 16:9</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Multimodal Architecture */}
      <section id="technology" className="space-y-8">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-ink-muted">
            Under the Hood
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            How Our Motion Architecture Works
          </h2>
          <p className="text-sm text-ink-secondary leading-relaxed max-w-2xl">
            Videlto does not apply generic motion templates or distorted shapes. Our engine performs a deep perceptual breakdown of your uploaded photo:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-border shadow-card space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-accent-blue flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-ink">1. Visual Feature Analysis</h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Our director analyzes the exact object geometry, visible ingredients, textures, and coordinates (<code className="font-mono bg-canvas-subtle px-1 py-0.5 rounded text-[11px]">[x, y]</code> normalized), pointing directly to real features in the photo.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-border shadow-card space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-ink">2. Palette Harmonization</h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Extracts a custom 7-color palette (primary dark tone, radial spotlight, accent highlight, tactile tag background, serif text) directly from your product's natural mood.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-border shadow-card space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-ink">3. Motion Compositing</h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              FFmpeg and GPU-accelerated pipelines render 30fps baseline reveals, tactile cards, elbow pointer lines, and editorial serif headlines with crisp typography.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Core Principles */}
      <section id="principles" className="space-y-6">
        <h2 className="text-2xl font-bold text-ink tracking-tight">
          Our Three Guiding Principles
        </h2>
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-border shadow-sm flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-ink text-white flex items-center justify-center font-bold text-xs shrink-0">
              01
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-ink">Absolute Product Fidelity</h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                We never distort, hallucinate, or alter the genuine product. Your dish, vehicle, or cosmetic bottle stays 100% authentic so customers receive exactly what they saw in the ad.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-border shadow-sm flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-ink text-white flex items-center justify-center font-bold text-xs shrink-0">
              02
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-ink">Agency-Grade Typography & Design</h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                We pair editorial display serifs with geometric tracked sans-serifs, high-contrast badges, and tactile drop shadows. No generic template artifacts—only bespoke design you would proudly publish on your brand's official profile.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-border shadow-sm flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-ink text-white flex items-center justify-center font-bold text-xs shrink-0">
              03
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-ink">Radical Accessibility</h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Whether you are a solo food truck owner, an independent artisan bakery, a logistics fleet operator, or an international retail brand, high-converting video ads should be accessible in seconds from any browser.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bottom CTA Card */}
      <section className="bg-ink text-white p-8 sm:p-12 rounded-3xl space-y-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            Ready to Create Your First Commercial Video Ad?
          </h3>
          <p className="text-xs sm:text-sm text-ink-muted max-w-lg leading-relaxed">
            Upload any product photo and see our vision director render an editorial 9:16 social ad in 10 seconds.
          </p>
        </div>
        <Link
          href="/create"
          className="px-6 py-3.5 rounded-2xl bg-white text-ink font-bold text-sm hover:bg-canvas-subtle transition-all shadow-md shrink-0 flex items-center gap-2"
        >
          <span>Launch Video Studio</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}

