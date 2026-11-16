import type { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';
import { FAQS } from '@/lib/faqs';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://videlto.online';

export const metadata: Metadata = {
  title: 'Videlto — AI Product Photo to Video Ad Generator | Image to Video AI',
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
    'product photo to video',
    'reels ad maker',
    'tiktok video ad generator',
    'videlto',
  ],
  alternates: {
    canonical: siteUrl,
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
      "Turn any product photo into a high-converting 9:16 or 16:9 video ad in seconds. Videlto's AI image-to-video studio crafts explainer, spotlight, and lifestyle ecommerce video ads.",
    images: ['/og-image.jpg'],
    creator: '@videlto',
  },
};

export default function HomePage() {
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Videlto',
    url: siteUrl,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
    description:
      "Turn any product photo into a high-converting 9:16 or 16:9 video ad in seconds. Videlto's AI image-to-video studio crafts explainer, spotlight, and lifestyle ecommerce video ads.",
    featureList: [
      'AI Image to Video generation',
      'Image to video AI for commercial products',
      'Photo to video ad maker',
      'Ecommerce video ad generator',
      '9:16 Vertical video ads for Reels, TikTok, and Shorts',
      '16:9 Landscape video ads for YouTube and websites',
      '3 Signature visual styles (Explainer, Agency Spotlight, Cinematic Lifestyle)',
      'Automated multimodal storyboard directing and motion graphics',
      'Instant H.264 MP4 export with audio sync',
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomeClient />
    </>
  );
}
