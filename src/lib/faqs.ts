export interface FaqItem {
  q: string;
  a: string;
}

export const FAQS: FaqItem[] = [
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
