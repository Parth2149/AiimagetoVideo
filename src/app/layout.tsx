import type { Metadata, Viewport } from 'next';
import { Instrument_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://videlto.online';

export const viewport: Viewport = {
  themeColor: '#111418',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Videlto — Turn Any Product Photo into a Cinematic Video Ad in 10 Seconds',
    template: '%s | Videlto Creative Studio',
  },
  description:
    'Commercial video ad platform turning product photography into editorial 9:16 vertical video ads for Instagram Reels, TikTok, and YouTube Shorts. Authentic product fidelity and custom motion.',
  keywords: [
    'commercial video ad creator',
    'product photo to video ad',
    'ecommerce video ads',
    'Instagram Reels ad creator',
    'TikTok product video maker',
    'commercial video ad studio',
    'Videlto',
    'Videlto Studio',
    'DTC video marketing',
    'social commerce video ads',
  ],
  authors: [{ name: 'Videlto Studio' }],
  creator: 'Videlto Creative Studio',
  publisher: 'Videlto Inc.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Videlto Creative Studio',
    title: 'Videlto — Turn Any Product Photo into a Cinematic Video Ad',
    description:
      'Upload a product photo and get a bespoke, agency-grade 9:16 vertical commercial ad in 10 seconds. Reference-anchored motion direction and editorial typography.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Videlto Creative Studio Interface',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Videlto — Turn Any Product Photo into a Cinematic Video Ad',
    description:
      'Turn static product photography into high-converting 9:16 video ads in seconds. Studio-grade video production for modern brands.',
    images: ['/og-image.jpg'],
    creator: '@videlto',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Videlto',
      operatingSystem: 'All',
      applicationCategory: 'MultimediaApplication',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
      description:
        'Commercial video ad platform transforming static product photos into 9:16 social video ads.',
      url: siteUrl,
    },
    {
      '@type': 'Organization',
      name: 'Videlto',
      url: siteUrl,
      logo: `${siteUrl}/sample-salad-bowl.svg`,
      sameAs: ['https://twitter.com/videlto'],
    },
    {
      '@type': 'WebSite',
      url: siteUrl,
      name: 'Videlto',
      potentialAction: {
        '@type': 'CreateAction',
        target: `${siteUrl}/create`,
        name: 'Create Product Video Ad',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={instrumentSans.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-canvas text-ink antialiased flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
