'use client';

import React, { useState } from 'react';
import SatinShader from './SatinShader';
import { Volume2, VolumeX, ShoppingBag, Film } from 'lucide-react';
import type { AdCreativeMetadata } from '@/lib/db';

interface AdPreviewFrameProps {
  photoUrl: string | null;
  videoUrl?: string | null;
  briefText?: string;
  adMetadata?: AdCreativeMetadata | null;
  adHeadline?: string;
  ctaText?: string;
  brandTag?: string;
  isStatusPage?: boolean;
}

export default function AdPreviewFrame({
  photoUrl,
  videoUrl,
  briefText = '',
  adMetadata,
  adHeadline,
  ctaText = 'Order Today',
  brandTag = 'STUDIO SELECT',
  isStatusPage = false,
}: AdPreviewFrameProps) {
  const [isMuted, setIsMuted] = useState(true);

  // Dynamic human-directed values
  const displayBrand = adMetadata?.brand_name || brandTag;
  const displayBadge = adMetadata?.badge_tag || 'FRESHLY CRAFTED';
  const displayHeadline = adMetadata?.headline || adHeadline || 'Crafted with precision.';
  const displaySubheadline = adMetadata?.subheadline || (
    briefText || 'Handcrafted fresh daily with premium ingredients.'
  );
  const displayCta = adMetadata?.cta || ctaText;
  const accentColor = adMetadata?.accent_color || '#FBBF24';

  return (
    <div className="relative w-full max-w-[360px] mx-auto select-none">
      {/* Satin color wash shader positioned BEHIND the preview frame */}
      <div className="absolute -inset-6 sm:-inset-8 z-0">
        <SatinShader />
      </div>

      {/* Portrait 9:16 Ad Preview Phone/Frame */}
      <div className="relative z-10 rounded-[32px] p-2.5 sm:p-3 bg-white/80 backdrop-blur-md border border-[#E6E2D9] shadow-floating transition-all duration-300">
        <div className="relative w-full aspect-[9/16] rounded-[24px] overflow-hidden bg-stone-900 border border-stone-200/40 flex flex-col justify-between shadow-inner">
          
          {videoUrl ? (
            /* Finished Video Ad Player - video contains full animated typography & graphic overlays */
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
              
              {/* Audio Toggle & Playback Status */}
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

              {/* Discreet Live Indicator */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <span className="px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase bg-black/40 backdrop-blur-md text-white/90 border border-white/15 shadow-sm">
                  HD 9:16
                </span>
              </div>
            </div>
          ) : (
            /* Still Ad Preview with Real Human-Directed Typography & Glassmorphism */
            <div className="relative w-full h-full flex flex-col justify-between bg-stone-100">
              {/* Product Photo */}
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Product preview"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#FAF8F5]">
                  <Film className="w-8 h-8 text-ink-muted mb-2 opacity-50" />
                  <p className="text-xs text-ink-secondary">Upload a product photo to see live ad mockup</p>
                </div>
              )}

              {/* Top Ad Header Pill */}
              <div className="relative z-10 p-4 pt-5 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black/45 backdrop-blur-md text-white border border-white/20 shadow-sm">
                  {displayBrand}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-white/80 backdrop-blur text-ink border border-white/50">
                  {isStatusPage ? 'Processing' : 'Live Mockup'}
                </span>
              </div>

              {/* Bottom Agency-Grade Graphic Text Box */}
              <div className="relative z-10 p-5 bg-gradient-to-t from-black/85 via-black/45 to-transparent flex flex-col gap-3">
                <div className="p-3.5 rounded-2xl bg-black/45 backdrop-blur-md border border-white/15 space-y-1 shadow-lg">
                  <span
                    className="text-[9px] tracking-widest font-bold uppercase drop-shadow block"
                    style={{ color: accentColor }}
                  >
                    {displayBadge}
                  </span>
                  <h3 className="text-white text-base font-semibold leading-tight drop-shadow-sm font-sans">
                    {displayHeadline}
                  </h3>
                  <p className="text-white/80 text-[11px] leading-relaxed line-clamp-2">
                    {displaySubheadline}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white text-ink shadow-md hover:bg-stone-100 transition-colors cursor-pointer">
                    <ShoppingBag className="w-3.5 h-3.5 text-ink" />
                    <span>{displayCta}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-white/75 uppercase tracking-wider font-mono">
                    <span>9:16 HD</span>
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
