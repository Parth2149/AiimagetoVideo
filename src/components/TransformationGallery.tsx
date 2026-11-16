'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface TransformationItem {
  title: string;
  category: string;
  photo: string;
  video: string;
  poster: string;
  hook: string;
  features: string[];
}

export const DEFAULT_TRANSFORMATIONS: TransformationItem[] = [
  {
    title: 'Wood-Fired Pepperoni Pizza',
    category: 'Restaurant & Food Service',
    photo: '/images.jfif',
    video: '/gallery/pizza_ad.mp4',
    poster: '/gallery/pizza_poster.jpg',
    hook: '“CRISPY WOOD fired perfection EVERY SLICE”',
    features: ['Crispy Pepperoni Callout', 'Melted Mozzarella', 'Wood Fired Base'],
  },
  {
    title: 'Farm Fresh Garden Salad',
    category: 'Health & Fast Casual Dining',
    photo: '/salad-bowl.jpg',
    video: '/gallery/salad_ad.mp4',
    poster: '/gallery/salad_poster.jpg',
    hook: '“FRESHNESS in every bite”',
    features: ['Sliced Avocado Pointer', 'Sweet Corn Kernels', 'Organic Greens'],
  },
  {
    title: 'Commercial Fleet Hauler',
    category: 'Automotive & Logistics',
    photo: '/commercial-truck.jpg',
    video: '/gallery/truck_ad.mp4',
    poster: '/gallery/truck_poster.jpg',
    hook: '“BUILT FOR WORK • 500+ Horsepower”',
    features: ['Dual Chrome Stacks', 'Aerodynamic Cab', 'High-Durability Wheels'],
  },
];

function GalleryVideo({ src, poster }: { src: string; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.muted = true;
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      className="w-full h-full object-cover block"
      aria-label="Finished AI generated product video ad"
    />
  );
}

interface TransformationGalleryProps {
  id?: string;
  titlePrefix?: string;
  subtitle?: string;
  showCta?: boolean;
}

export default function TransformationGallery({
  id = 'gallery',
  titlePrefix = 'Static Photo In',
  subtitle = 'See how one raw product photo produces an editorial commercial ad with dynamic color grading and synchronized copy:',
  showCta = false,
}: TransformationGalleryProps) {
  return (
    <section id={id} className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 scroll-mt-28">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
          Transformation Gallery
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink flex items-center justify-center flex-wrap gap-2.5">
          <span>{titlePrefix}</span>
          <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 shrink-0 inline-block" aria-hidden="true" />
          <span>High-Converting Video Ad Out</span>
        </h2>
        {subtitle && (
          <p className="text-sm text-ink-secondary leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DEFAULT_TRANSFORMATIONS.map((card, i) => (
          <div key={i} className="bg-white rounded-3xl border border-border p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink tracking-tight">{card.title}</span>
              <span className="text-[10px] text-ink-muted bg-canvas-subtle px-2 py-0.5 rounded-full border border-border/60">
                {card.category}
              </span>
            </div>

            {/* Visual Split */}
            <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden border border-border/80 bg-canvas-subtle">
              <div className="space-y-1 p-2 bg-white">
                <span className="text-[10px] font-mono uppercase text-ink-muted block text-center">
                  Original Photo
                </span>
                <div className="aspect-square rounded-xl overflow-hidden bg-black/5">
                  <img
                    src={card.photo}
                    alt={`Raw ${card.title} product photo before AI image to video conversion`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="space-y-1 p-2 bg-white">
                <span className="text-[10px] font-mono uppercase text-accent-blue block text-center font-bold">
                  Finished Video
                </span>
                <div className="aspect-square rounded-xl overflow-hidden bg-black relative shadow-inner">
                  <GalleryVideo src={card.video} poster={card.poster} />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-ink italic block">{card.hook}</span>
              <div className="flex flex-wrap gap-1 pt-1">
                {card.features.map((f, fi) => (
                  <span
                    key={fi}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-canvas-subtle text-ink-secondary border border-border/60"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCta && (
        <div className="text-center pt-4">
          <Link
            href="/create"
            className="btn-glossy px-8 py-3 rounded-2xl text-xs font-bold inline-flex items-center gap-2"
          >
            <span>Try It With Your Own Product Photo Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
