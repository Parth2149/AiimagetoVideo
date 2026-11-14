'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AdPreviewFrame from '@/components/AdPreviewFrame';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import type { AdCreativeMetadata } from '@/lib/db';
import {
  Copy,
  Check,
  Download,
  ArrowLeft,
  RefreshCw,
  Palette,
  FileText,
  Cpu,
  Layers,
  AlertCircle,
} from 'lucide-react';

interface PhotoAngleItem {
  index: number;
  url: string;
  originalName: string;
  size: number;
}

interface OrderData {
  id: string;
  token: string;
  status: 'submitted' | 'in_production' | 'ready' | 'failed';
  videoStyle?: string;
  brief: string;
  photoUrl: string;
  photoOriginalName: string;
  photoSize: number;
  photos?: PhotoAngleItem[];
  videoUrl: string | null;
  videoDownloadUrl: string | null;
  videoOriginalName: string | null;
  videoSize: number | null;
  adMetadata?: AdCreativeMetadata | null;
  error_message?: string | null;
  createdAt: number;
  updatedAt: number;
}

export default function OrderStatusPage() {
  const params = useParams();
  const token = params?.token as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const fetchOrder = useCallback(
    async (silent = false) => {
      if (!token) return;
      if (!silent) setIsRefreshing(true);
      try {
        const res = await fetch(`/api/orders/${token}`);
        if (!res.ok) {
          throw new Error('Order not found or invalid link.');
        }
        const data = await res.json();
        setOrder(data.order);
      } catch (err: any) {
        setError(err.message || 'Failed to load order.');
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Polling: while order is not ready, poll every 2.5 seconds
  useEffect(() => {
    if (!order || order.status === 'ready') return;

    const interval = setInterval(() => {
      fetchOrder(true);
    }, 2500);

    return () => clearInterval(interval);
  }, [order, fetchOrder]);

  // Cycle animation steps while in production
  useEffect(() => {
    if (!order || order.status === 'ready') return;
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev >= 3 ? 1 : prev + 1));
    }, 1800);
    return () => clearInterval(stepInterval);
  }, [order]);

  const copyOrderLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <RefreshCw className="w-6 h-6 animate-spin text-ink-muted mb-3" />
        <p className="text-sm text-ink-secondary">Retrieving private order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex-1 max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error || 'Order could not be found.'}
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-accent-blue"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 lg:py-12">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link
              href="/"
              className="text-xs text-ink-muted hover:text-ink flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Studio</span>
            </Link>
            <span className="text-border-strong">•</span>
            <span className="text-xs font-mono text-ink-muted">ID: {order.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
            {order.status === 'ready' ? 'Your Video Ad is Ready!' : 'Directing & Rendering Your Video Ad'}
          </h1>
        </div>

        {/* Shareable Link Copy Button */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={copyOrderLink}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-white border border-border shadow-sm hover:bg-stone-50 transition-all text-ink"
            title="Copy private link to reopen anytime"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-ink-muted" />
                <span>Copy Private Link</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => fetchOrder()}
            disabled={isRefreshing}
            className="p-2 rounded-xl text-ink-muted hover:text-ink bg-white border border-border hover:bg-stone-50 transition-colors shadow-sm"
            title="Refresh status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Order Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8 items-start">
        
        {/* Left Column: Status info, Creative Brief, Details & Action */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Status Display Card */}
          <div className="bg-white p-6 rounded-3xl border border-border shadow-card space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Production Status
              </span>
              <OrderStatusBadge status={order.status} size="sm" />
            </div>

            <OrderStatusBadge status={order.status} size="lg" />

            {/* If In Production: Show Real-time AI Pipeline steps */}
            {(order.status === 'submitted' || order.status === 'in_production') && (
              <div className="p-4 rounded-2xl bg-canvas-subtle border border-border/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                  <Cpu className="w-4 h-4 text-accent-blue animate-spin" />
                  <span>Creative Director & Motion Engine Running</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className={`flex items-center gap-2.5 ${activeStep >= 1 ? 'text-ink font-medium' : 'text-ink-muted'}`}>
                    <span className={`w-2 h-2 rounded-full ${activeStep === 1 ? 'bg-accent-blue animate-ping' : 'bg-emerald-500'}`} />
                    <span>Analyzing product packshot & extracting harmonious palette</span>
                  </div>
                  <div className={`flex items-center gap-2.5 ${activeStep >= 2 ? 'text-ink font-medium' : 'text-ink-muted'}`}>
                    <span className={`w-2 h-2 rounded-full ${activeStep === 2 ? 'bg-accent-orchid animate-ping' : activeStep > 2 ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                    <span>Crafting editorial headlines & compelling brand copywriting</span>
                  </div>
                  <div className={`flex items-center gap-2.5 ${activeStep >= 3 ? 'text-ink font-medium' : 'text-ink-muted'}`}>
                    <span className={`w-2 h-2 rounded-full ${activeStep === 3 ? 'bg-accent-peach animate-ping' : 'bg-stone-300'}`} />
                    <span>Compositing high-definition 9:16 vertical motion video ad</span>
                  </div>
                </div>
              </div>
            )}

            {/* If Generation Failed */}
            {order.status === 'failed' && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Generation Failed</span>
                </div>
                <p className="text-xs text-rose-700 leading-relaxed font-mono break-all">
                  {(order as any).error_message || 'Vision analysis or video rendering failed. Please try again.'}
                </p>
                <div className="pt-1">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-rose-300 text-xs font-semibold text-rose-800 shadow-sm hover:bg-rose-50 transition-colors"
                  >
                    <span>Upload New Photo & Try Again</span>
                  </Link>
                </div>
              </div>
            )}

            {order.status === 'ready' && order.videoDownloadUrl && (
              <div className="pt-2">
                <a
                  href={order.videoDownloadUrl}
                  download={order.videoOriginalName || 'video_ad.mp4'}
                  className="btn-glossy w-full py-3.5 px-6 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 tracking-wide"
                >
                  <Download className="w-4 h-4" />
                  <span>Download MP4 Video Ad</span>
                </a>
                <p className="text-[11px] text-ink-muted text-center mt-2 font-mono">
                  High-definition 1080×1920 MP4 • Tailored for Instagram Reels, TikTok & Shorts
                </p>
              </div>
            )}
          </div>

          {/* Human Creative Direction Card (Extracted & Directed by Gemini) */}
          {order.adMetadata && (() => {
            const meta = order.adMetadata as any;
            const brandName = meta.copy?.micro_header || meta.brand_name || 'STUDIO SELECT';
            const headline = meta.copy?.hook_line_1
              ? `${meta.copy.hook_line_1} ${meta.copy.hook_line_2_italic || ''} ${meta.copy.hook_line_3 || ''}`.trim()
              : meta.headline || 'Crafted with care';
            const subheadline = meta.copy?.section_title || meta.subheadline || 'Custom engineered advertisement';
            const primaryColor = meta.palette?.bg_primary || meta.primary_color || '#16120E';
            const accentColor = meta.palette?.accent_color || meta.accent_color || '#E5A93C';
            const cta = meta.copy?.cta_text || meta.cta || 'Order Today';
            const calloutsList = meta.callouts || [];

            return (
              <div className="bg-white p-6 rounded-3xl border border-border shadow-card space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-accent-blue" />
                    <span>Creative Direction & Copy</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {order.videoStyle === 'style1_explainer'
                      ? 'Explainer & Detailing'
                      : order.videoStyle === 'style3_lifestyle'
                      ? 'Cinematic Lifestyle'
                      : 'Editorial Spotlight'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-canvas-subtle border border-border/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-ink-muted">
                      {brandName}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10"
                        style={{ backgroundColor: primaryColor }}
                        title="Primary Brand Color"
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10"
                        style={{ backgroundColor: accentColor }}
                        title="Accent Color"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-semibold text-ink font-sans tracking-tight">
                      {headline}
                    </h4>
                    <p className="text-xs text-ink-secondary leading-relaxed">
                      {subheadline}
                    </p>
                  </div>

                  {/* If Lifestyle Director Plan exists */}
                  {meta.lifestyle_plan && (
                    <div className="pt-2 border-t border-border/60 space-y-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
                        Cinematic Lifestyle Storyboard (3 Beats)
                      </span>
                      <div className="space-y-2">
                        <div className="p-2.5 rounded-xl bg-white border border-border/80 text-xs space-y-1">
                          <span className="font-mono font-bold text-accent-blue text-[10px] block">
                            BEAT 1 (0.0s - 3.0s) • ENTRY & FRAMING
                          </span>
                          <p className="text-ink text-[11px] leading-relaxed">
                            {meta.lifestyle_plan.talent_and_action?.beat_1_0_to_3s}
                          </p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-border/80 text-xs space-y-1">
                          <span className="font-mono font-bold text-accent-blue text-[10px] block">
                            BEAT 2 (3.0s - 7.0s) • CANDID SAVORING & USE
                          </span>
                          <p className="text-ink text-[11px] leading-relaxed">
                            {meta.lifestyle_plan.talent_and_action?.beat_2_3_to_7s}
                          </p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-border/80 text-xs space-y-1">
                          <span className="font-mono font-bold text-accent-blue text-[10px] block">
                            BEAT 3 (7.0s - 10.0s) • GENUINE SMILE & HERO HOLD
                          </span>
                          <p className="text-ink text-[11px] leading-relaxed">
                            {meta.lifestyle_plan.talent_and_action?.beat_3_7_to_10s}
                          </p>
                        </div>
                      </div>

                      {meta.lifestyle_plan.audio_direction && (
                        <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs space-y-1">
                          <span className="font-mono font-bold text-amber-800 text-[10px] block">
                            VOICEOVER & AUDIO DIRECTION
                          </span>
                          <p className="text-amber-950 text-[11px] leading-relaxed italic">
                            "{meta.lifestyle_plan.audio_direction}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* If callouts exist */}
                  {calloutsList.length > 0 && (
                    <div className="pt-2 border-t border-border/60 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
                        Deconstructed Feature Callouts
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {calloutsList.map((c: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-border/80 text-xs">
                            <span className="font-mono font-bold text-accent-blue px-1.5 py-0.5 rounded bg-blue-50 text-[10px]">
                              {c.num || c.number || `0${idx + 1}`}
                            </span>
                            <div className="flex-1">
                              <span className="font-semibold text-ink block">{c.title || c.name}</span>
                              <span className="text-ink-muted text-[11px]">{c.subtitle || c.note}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex items-center gap-2 border-t border-border/60 text-xs">
                    <span className="text-ink-muted">Call to Action:</span>
                    <span className="font-semibold text-ink bg-white px-2.5 py-1 rounded-lg border border-border">
                      {cta}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Customer Brief Card */}
          <div className="bg-white p-6 rounded-3xl border border-border shadow-card space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              <FileText className="w-4 h-4 text-ink-secondary" />
              <span>Original Creative Brief</span>
            </div>
            <div className="p-4 rounded-2xl bg-canvas-subtle border border-border/70 font-sans text-sm text-ink leading-relaxed whitespace-pre-wrap">
              {order.brief}
            </div>
          </div>

          {/* Specifications & Uploaded Angles */}
          <div className="bg-white p-6 rounded-3xl border border-border shadow-card space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted block">
              Specifications & Photos
            </span>

            {order.photos && order.photos.length > 1 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block">
                  Uploaded Product Angles ({order.photos.length})
                </span>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                  {order.photos.map((p, idx) => (
                    <div
                      key={p.url}
                      className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-border shadow-sm group"
                    >
                      <img src={p.url} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute top-1 left-1">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur-md uppercase">
                          {idx === 0 ? 'Hero' : `#${idx + 1}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-canvas-subtle border border-border/60">
                <span className="text-ink-muted block mb-1">Source Packshot</span>
                <span className="font-medium text-ink truncate block">
                  {order.photoOriginalName} ({(order.photoSize / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-canvas-subtle border border-border/60">
                <span className="text-ink-muted block mb-1">Created At</span>
                <span className="font-medium text-ink block">
                  {new Date(order.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Preview Frame with Satin Shader */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="w-full flex flex-col items-center">
            <AdPreviewFrame
              photoUrl={order.photoUrl}
              photoUrls={order.photos?.map((p) => p.url) || [order.photoUrl]}
              videoUrl={order.videoUrl}
              briefText={order.brief}
              adMetadata={order.adMetadata}
              isStatusPage={true}
            />
            <p className="text-xs text-ink-muted mt-5 text-center font-medium">
              {order.status === 'ready'
                ? 'Finished commercial video ad playing above • Tap audio icon to listen'
                : 'Rendering live video ad with human-directed typography...'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
