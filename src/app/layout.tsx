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
    default: 'Videlto — AI Product Photo to Video Ad Generator | Image to Video AI',
    template: '%s | Videlto',
  },
  description:
    "Turn any product photo into a high-converting 9:16 or 16:9 video ad in seconds. Videlto's AI image-to-video studio crafts explainer, spotlight, and lifestyle ecommerce video ads.",
  keywords: [
    'image to video',
    'image to video ai',
    'photo to video',
    'ai product video',
    'ai video generator',
    'ecommerce video ads',
    'ai video ad',
    'free image to video',
    'commercial video ad creator',
    'product photo to video ad',
    'Instagram Reels ad creator',
    'TikTok product video maker',
    'Videlto',
    'Videlto Studio',
  ],
  authors: [{ name: 'Videlto Studio' }],
  creator: 'Videlto',
  publisher: 'Videlto',
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
    siteName: 'Videlto',
    title: 'Videlto — AI Product Photo to Video Ad Generator | Image to Video AI',
    description:
      "Turn any product photo into a high-converting 9:16 or 16:9 video ad in seconds. Videlto's AI image-to-video studio crafts explainer, spotlight, and lifestyle ecommerce video ads.",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Videlto — AI Product Photo to Video Ad Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Videlto — AI Product Photo to Video Ad Generator | Image to Video AI',
    description:
      "Turn static product photography into high-converting 9:16 video ads in seconds. Studio-grade video production for modern brands.",
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
      '@type': 'Organization',
      name: 'Videlto',
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
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
