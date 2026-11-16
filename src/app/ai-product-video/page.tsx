import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, CheckCircle2, Film, Layers, Sparkles, Sliders, Smartphone, Check } from 'lucide-react';
import TransformationGallery from '@/components/TransformationGallery';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://videlto.online';

export const metadata: Metadata = {
  title: {
    absolute: 'AI Product Video Maker — Studio-Grade Product Videos in Seconds | Videlto',
  },
  description:
    'Create high-impact AI product videos from your catalog photos. Automatic feature callouts, 9:16 vertical exports, and compelling copywriting for DTC brands.',
  keywords: [
    'ai product video',
    'product video maker',
    'product demo video maker',
    'ai product video generator',
    'ecommerce product videos',
    'automated product video',
    'product video ad maker',
    'ai video for products',
  ],
  alternates: {
    canonical: `${siteUrl}/ai-product-video`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${siteUrl}/ai-product-video`,
    siteName: 'Videlto',
    title: 'AI Product Video Maker — Studio-Grade Product Videos in Seconds | Videlto',
    description:
      'Create high-impact AI product videos from your catalog photos in seconds with Videlto.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Product Video Maker — Videlto Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Product Video Maker — Studio-Grade Product Videos in Seconds | Videlto',
    description:
      'Turn catalog photography into high-converting AI product video ads in seconds.',
    images: ['/og-image.jpg'],
    creator: '@videlto',
  },
};

export default function AiProductVideoPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'AI Product Video Maker',
    description:
      'Studio-grade AI product video generator that turns static product photography into high-converting commercial ads.',
    url: `${siteUrl}/ai-product-video`,
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
          name: 'AI Product Video Maker',
          item: `${siteUrl}/ai-product-video`,
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
            <Film className="w-3.5 h-3.5" />
            <span>AI Product Video Ad Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-ink leading-[1.1]">
            AI Product Video Maker: Studio-Grade Commercials from{' '}
            <span className="text-accent-peach">Product Photos</span>
          </h1>

          <p className="text-base sm:text-lg text-ink-secondary leading-relaxed max-w-3xl mx-auto">
            Give every product in your catalog the spotlight it deserves. Videlto&apos;s AI product video maker automatically identifies visible craftsmanship, generates harmonized color palettes, and directs cinematic camera movement—turning static photos into high-converting video demos in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/create"
              className="btn-glossy w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-xl hover:scale-102 transition-transform"
            >
              <span>Build AI Product Video Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl font-semibold text-sm text-ink-secondary bg-white hover:bg-canvas-subtle border border-border transition-colors flex items-center justify-center gap-2"
            >
              <span>Our AI Architecture</span>
            </Link>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-ink-muted">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Reference-Anchored Fidelity
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 3 Unique Creative Styles
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Ready in 10–15 Seconds
            </span>
          </div>
        </section>

        {/* 2. THE 3 DIRECTOR STYLES DEEP DIVE */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-border shadow-card space-y-8">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-accent-peach">
                Bespoke Creative Direction
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                3 Signature AI Product Video Director Formats
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Choose the visual language that resonates with your brand ethos and drives direct buyer action:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-canvas-subtle/50 border border-border/80 space-y-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Style 1
                </span>
                <h3 className="text-base font-bold text-ink">Explainer & Detailing</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Deconstructs your product with numbered tactile tags, 45° bent-elbow pointer lines, and elegant editorial display serifs. Perfect for menus, cosmetics, and spec-heavy consumer goods.
                </p>
                <Link
                  href="/create?style=style1_explainer"
                  className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1 pt-1"
                >
                  <span>Use Explainer Style</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-6 rounded-2xl bg-canvas-subtle/50 border border-border/80 space-y-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 uppercase tracking-wider">
                  Style 2
                </span>
                <h3 className="text-base font-bold text-ink">Agency Spotlight</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  A high-energy 9:16 push-in zoom, ambient backdrop illumination, high-contrast glassmorphic deal cards, and punchy copywriting. Ideal for flash sales and drops.
                </p>
                <Link
                  href="/create?style=style2_spotlight"
                  className="text-xs font-bold text-orange-800 hover:underline inline-flex items-center gap-1 pt-1"
                >
                  <span>Use Spotlight Style</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-6 rounded-2xl bg-canvas-subtle/50 border border-border/80 space-y-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wider">
                  Style 3
                </span>
                <h3 className="text-base font-bold text-ink">Cinematic Lifestyle Story</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Authentic real-world environment and 3-beat human interaction storyboard with natural pacing. Tailored for dining experiences, apparel, hospitality, and vehicles.
                </p>
                <Link
                  href="/create?style=style3_lifestyle"
                  className="text-xs font-bold text-amber-800 hover:underline inline-flex items-center gap-1 pt-1"
                >
                  <span>Use Lifestyle Style</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3. TRANSFORMATION GALLERY */}
        <TransformationGallery
          subtitle="See how our AI product video maker takes unedited product photos and turns them into studio-grade ads:"
          showCta={true}
        />

        {/* 4. PRODUCT CATEGORIES */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-ink-muted">
              Built for Scale
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Scale Your Product Catalog Video Production
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-2.5">
              <h3 className="text-sm font-bold text-ink">E-Commerce & Shopify Brands</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Generate video ads for hundreds of SKU items in your store. Test different hook variations and tone presets to identify high-converting creative winners.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-2.5">
              <h3 className="text-sm font-bold text-ink">Culinary & Hospitality</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Create daily promotional Reels for specials and season menus. Keep your Instagram feed constantly updated with dynamic food motion ads.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-2.5">
              <h3 className="text-sm font-bold text-ink">Boutique & Luxury Goods</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Present watches, jewelry, leatherware, and cosmetics with calm editorial elegance and high-end typography that reflects quality craftsmanship.
              </p>
            </div>
          </div>
        </section>

        {/* 5. BOTTOM CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-ink text-white p-8 sm:p-12 rounded-3xl text-center space-y-5 shadow-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-peach">
              Generate in Seconds
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Create Your First AI Product Video Ad Free
            </h2>
            <p className="text-xs sm:text-sm text-canvas-subtle/80 max-w-xl mx-auto leading-relaxed">
              Upload your product photo, choose a style, and let Videlto build an agency-grade commercial for you.
            </p>
            <div className="pt-2">
              <Link
                href="/create"
                className="btn-glossy px-8 py-4 rounded-2xl text-xs sm:text-sm font-bold inline-flex items-center gap-2"
              >
                <span>Launch AI Product Video Maker</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
