import type { Metadata } from 'next';
import CreateClient from './CreateClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://videlto.online';

export const metadata: Metadata = {
  title: {
    absolute: 'Create AI Product Video Ad Free | Photo to Video Generator — Videlto',
  },
  description:
    'Upload 1–5 product photos and generate custom 9:16 Reels, TikTok, and YouTube Shorts video ads with AI. Fast, free-to-start image-to-video ad maker.',
  keywords: [
    'photo to video generator',
    'create ai product video',
    'image to video ad maker',
    'free ai video generator',
    'ecommerce video ads maker',
    'product video ad generator',
    'reels video ad creator',
    'tiktok ad creator',
  ],
  alternates: {
    canonical: `${siteUrl}/create`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${siteUrl}/create`,
    siteName: 'Videlto',
    title: 'Create AI Product Video Ad Free | Photo to Video Generator — Videlto',
    description:
      'Upload 1–5 product photos and generate custom 9:16 Reels, TikTok, and YouTube Shorts video ads with AI. Fast, free-to-start image-to-video ad maker.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Create AI Product Video Ad — Videlto Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create AI Product Video Ad Free | Photo to Video Generator — Videlto',
    description:
      'Upload 1–5 product photos and generate custom 9:16 Reels, TikTok, and YouTube Shorts video ads with AI.',
    images: ['/og-image.jpg'],
    creator: '@videlto',
  },
};

export default function CreatePage() {
  return <CreateClient />;
}
