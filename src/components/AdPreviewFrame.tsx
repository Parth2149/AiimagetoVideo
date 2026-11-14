'use client';

import React, { useState, useEffect } from 'react';
import SatinShader from './SatinShader';
import { Volume2, VolumeX, ShoppingBag, Film, Layers } from 'lucide-react';
import type { AdCreativeMetadata } from '@/lib/db';

interface AdPreviewFrameProps {
  photoUrl?: string | null;
  photoUrls?: string[];
  videoUrl?: string | null;
  briefText?: string;
  adMetadata?: AdCreativeMetadata | null;
  adHeadline?: string;
  ctaText?: string;
  brandTag?: string;
  isStatusPage?: boolean;
  aspectRatio?: '9:16' | '16:9';
}

export default function AdPreviewFrame({
  photoUrl,
  photoUrls = [],
  videoUrl,
  briefText = '',
  adMetadata,
  adHeadline,
  ctaText = 'Order Today',
  brandTag = 'STUDIO SELECT',
  isStatusPage = false,
  aspectRatio = '9:16',
}: AdPreviewFrameProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [activeCycleIndex, setActiveCycleIndex] = useState(0);

  // Combine photoUrl and photoUrls into one list
  const allUrls: string[] = photoUrls.length > 0
    ? photoUrls
    : photoUrl
    ? [photoUrl]
    : [];

  const hasPhotos = allUrls.length > 0;

  // Gently cycle preview photos every 3.2 seconds if multiple photos are present
  useEffect(() => {
    if (allUrls.length <= 1) return;
    const interval = setInterval(() => {
      setActiveCycleIndex((prev) => (prev + 1) % allUrls.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [allUrls.length]);

  const activeDisplayPhoto = hasPhotos ? allUrls[activeCycleIndex % allUrls.length] : null;

  // Dynamic values
  const displayBrand = adMetadata?.brand_name || brandTag;
  const displayBadge = adMetadata?.badge_tag || 'COMMERCIAL SPOTLIGHT';
  const displayHeadline = adMetadata?.headline || adHeadline || (
    hasPhotos ? 'Product Showcase in Motion' : 'Commercial Video Studio'
  );
  const displaySubheadline = adMetadata?.subheadline || (
    briefText.trim()
      ? briefText.trim()
      : 'Vision Director will analyze your photo & craft custom copy'
  );
  const displayCta = adMetadata?.cta || ctaText;
  const accentColor = adMetadata?.accent_color || '#FBBF24';

  const isLandscape = aspectRatio === '16:9';

  return (
    <div className={`relative w-full mx-auto select-none transition-all duration-300 ${
      isLandscape ? 'max-w-[480px]' : 'max-w-[340px]'
    }`}>
      {/* Satin color wash shader positioned BEHIND the preview frame */}
      <div className="absolute -inset-6 sm:-inset-8 z-0">
        <SatinShader />
      </div>

      {/* Ad Preview Frame (Dynamic 9:16 or 16:9) */}
      <div className="relative z-10 rounded-[32px] p-2.5 sm:p-3 bg-white/80 backdrop-blur-md border border-[#E6E2D9] shadow-floating transition-all duration-300">
        <div className={`relative w-full rounded-[24px] overflow-hidden bg-stone-900 border border-stone-200/40 flex flex-col justify-between shadow-inner transition-all duration-300 ${
          isLandscape ? 'aspect-[16/9]' : 'aspect-[9/16]'
        }`}>

          {videoUrl ? (
            /* Finished Video Ad Player */
            <div className="relative w-full h-full bg-black group">
              <video
                src={videoUrl}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                controls={false}
              />

              {/* Audio Toggle */}
              <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition-colors border border-white/20 shadow-md"
                  title={isMuted ? 'Unmute audio' : 'Mute audio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Live Format Indicator */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <span className="px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase bg-black/40 backdrop-blur-md text-white/90 border border-white/15 shadow-sm">
                  {isLandscape ? 'HD 16:9' : 'HD 9:16'}
                </span>
              </div>
            </div>
          ) : (
            /* Live Mockup Frame */
            <div className="relative w-full h-full flex flex-col justify-between bg-stone-100">
              {/* Product Photo with gentle crossfade */}
              {activeDisplayPhoto ? (
                <img
                  key={activeDisplayPhoto}
                  src={activeDisplayPhoto}
                  alt="Product preview"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 animate-fade-in"
                />
              ) : (
                /* Clean Empty State - Perfectly Centered in visible area above bottom card */
                <div className={`absolute inset-0 flex flex-col items-center justify-center text-center bg-[#FAF8F5] ${
                  isLandscape ? 'pt-8 pb-24 px-4' : 'pt-12 pb-36 px-6'
                }`}>
                  <div className={`rounded-2xl bg-stone-100 flex items-center justify-center text-ink-muted border border-border/80 ${
                    isLandscape ? 'w-9 h-9 mb-1.5' : 'w-12 h-12 mb-2.5'
                  }`}>
                    <Film className={isLandscape ? 'w-4 h-4 opacity-60' : 'w-6 h-6 opacity-60'} />
                  </div>
                  <p className="text-xs font-semibold text-ink">Upload your product photo(s) to preview your ad</p>
                  <p className="text-[10px] sm:text-[11px] text-ink-muted mt-0.5 max-w-[280px] leading-tight">
                    Accepts 1 to 5 product angles • Visualizing {isLandscape ? '16:9 Landscape' : '9:16 Vertical'} format
                  </p>
                </div>
              )}

              {/* Top Ad Header Pill + Angle Badge */}
              <div className="relative z-10 p-3 sm:p-4 pt-3 sm:pt-4 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black/45 backdrop-blur-md text-white border border-white/20 shadow-sm">
                  {displayBrand}
                </span>

                <div className="flex items-center gap-1.5">
                  {allUrls.length > 1 && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-ink/70 text-white backdrop-blur border border-white/30 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-accent-blue" />
                      <span>{allUrls.length} Angles</span>
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-white/80 backdrop-blur text-ink border border-white/50">
                    {isStatusPage ? 'Processing' : 'Live Mockup'}
                  </span>
                </div>
              </div>

              {/* Bottom Agency-Grade Graphic Text Box */}
              <div className={`relative z-10 bg-gradient-to-t from-black/85 via-black/45 to-transparent flex flex-col ${
                isLandscape ? (!hasPhotos ? 'p-2.5 gap-1.5' : 'p-3 gap-2') : 'p-4 sm:p-5 gap-2'
              }`}>
                <div className={`rounded-2xl bg-black/45 backdrop-blur-md border border-white/15 space-y-1 shadow-lg ${
                  isLandscape ? (!hasPhotos ? 'p-2' : 'p-2.5') : 'p-3.5'
                }`}>
                  <span
                    className="text-[9px] tracking-widest font-bold uppercase drop-shadow block"
                    style={{ color: accentColor }}
                  >
                    {displayBadge}
                  </span>
                  <h3 className={`text-white font-semibold leading-tight drop-shadow-sm font-sans ${
                    isLandscape ? 'text-xs sm:text-sm' : 'text-base'
                  }`}>
                    {displayHeadline}
                  </h3>
                  <p className={`text-white/80 text-[11px] leading-relaxed ${
                    isLandscape && !hasPhotos ? 'line-clamp-1' : 'line-clamp-2'
                  }`}>
                    {displaySubheadline}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold bg-white text-ink shadow-md hover:bg-stone-100 transition-colors cursor-pointer">
                    <ShoppingBag className="w-3.5 h-3.5 text-ink" />
                    <span>{displayCta}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-white/75 uppercase tracking-wider font-mono">
                    <span>{isLandscape ? '16:9 HD' : '9:16 HD'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
