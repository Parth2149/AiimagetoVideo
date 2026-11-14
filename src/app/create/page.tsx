'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FileDropzone from '@/components/FileDropzone';
import AdPreviewFrame from '@/components/AdPreviewFrame';
import { ArrowRight, Loader2, AlertCircle, Play, Eye, X, Check, Smartphone, Monitor, Info } from 'lucide-react';
import { VideoStyle } from '@/lib/db';

interface StyleConfig {
  id: VideoStyle;
  title: string;
  badge: string;
  description: string;
  placeholder: string;
  exampleVideo: string;
  accent: string;
  bestFor: string;
}

const VIDEO_STYLES: StyleConfig[] = [
  {
    id: 'style1_explainer',
    title: '1. Explainer & Detailing',
    badge: 'Artisanal Callouts',
    description: 'Numbered ingredient/spec callouts, animated pointer lines, and deconstructed features with elegant typography.',
    placeholder: 'Highlight key craftsmanship, specs, or materials. End with a clear call-to-action.',
    exampleVideo: '/examples/style1_explainer.mp4',
    accent: '#4E7D56',
    bestFor: 'Food menus, consumer products, electronics, cosmetics, apparel craftsmanship',
  },
  {
    id: 'style2_spotlight',
    title: '2. Editorial Agency Spotlight',
    badge: 'High-Impact Social Ad',
    description: 'Cinematic push-in zoom, ambient backdrop blur, punchy commercial copywriting, and glassmorphic card.',
    placeholder: 'Direct-response offer, limited-time promotion, or bold product hook. End with ‘Shop Now’.',
    exampleVideo: '/examples/style2_spotlight.mp4',
    accent: '#E65100',
    bestFor: 'E-commerce sales, product launches, limited drops, direct-response offers',
  },
  {
    id: 'style3_lifestyle',
    title: '3. Cinematic Lifestyle Story',
    badge: 'Human Connection',
    description: 'Authentic setting, candid atmosphere, and 3-beat human interaction storyboard with natural audio & voiceover.',
    placeholder: 'Tell a story about enjoying this product in an authentic daily setting or ritual.',
    exampleVideo: '/examples/style3_lifestyle.mp4',
    accent: '#D97706',
    bestFor: 'Lifestyle brands, dining experiences, vehicles, wellness, apparel',
  },
];

const TONE_PRESETS = [
  { label: 'Punchy & Bold', prompt: 'Create a high-energy, direct social ad with bold typography and urgency.' },
  { label: 'Luxurious & Editorial', prompt: 'Craft a sophisticated, elegant ad with serene pacing and bespoke craftsmanship.' },
  { label: 'Warm & Candid', prompt: 'Focus on authentic, joyful human connection and everyday savoring moments.' },
  { label: 'Direct Response', prompt: 'Highlight key value propositions, clear pricing/benefit, and an irresistible call to action.' },
];

export default function CreateAdPage() {
  const router = useRouter();

  // 100% custom user-uploaded photos only (zero preloaded sample state)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [activeLabel, setActiveLabel] = useState<string>('No Photos Uploaded');
  const [selectedStyle, setSelectedStyle] = useState<VideoStyle>('style1_explainer');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [brief, setBrief] = useState('');
  const [ctaText, setCtaText] = useState('Order Today');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Backend Health Status Check
  const [healthStatus, setHealthStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (!isMounted) return;
        if (res.ok) {
          const data = await res.json();
          setHealthStatus(data.status === 'online' ? 'online' : 'offline');
        } else {
          setHealthStatus('offline');
        }
      } catch {
        if (isMounted) setHealthStatus('offline');
      }
    };
    checkHealth();
    return () => {
      isMounted = false;
    };
  }, []);

  // Modal for previewing sample video
  const [previewModalVideo, setPreviewModalVideo] = useState<{ title: string; url: string } | null>(null);

  const activeStyleConfig = VIDEO_STYLES.find((s) => s.id === selectedStyle) || VIDEO_STYLES[0];

  const handleFilesChange = (newFiles: File[], newUrls: string[]) => {
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);

    if (newFiles.length === 0) {
      setActiveLabel('No Photos Uploaded');
    } else if (newFiles.length === 1) {
      setActiveLabel(`${newFiles[0].name} (Hero Angle)`);
    } else {
      setActiveLabel(`${newFiles.length} Product Angles Ready`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (selectedFiles.length === 0) {
      setErrorMessage('Please upload at least 1 product photo to generate your commercial ad.');
      return;
    }

    const activeBrief = brief.trim() || activeStyleConfig.placeholder;
    const activeCta = ctaText.trim() || 'Order Today';

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('brief', activeBrief);
      formData.append('ctaText', activeCta);
      formData.append('videoStyle', selectedStyle);
      formData.append('aspectRatio', aspectRatio);

      for (const file of selectedFiles) {
        formData.append('images[]', file);
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit order');
      }

      router.push(`/orders/${data.token}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  const hasPhotos = selectedFiles.length > 0;

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Page Header with Live Backend Health Indicator */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            <img src="/logo.png" alt="Videlto" className="w-4 h-4 object-contain" />
            <span>Videlto Studio • Commercial Video Director</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Create Your Commercial Video Ad
          </h1>
          <p className="text-sm text-ink-secondary max-w-2xl leading-relaxed">
            Upload 1 to 5 product photos. The Creative Director analyzes your product features, extracts harmonized color palettes, writes punchy copywriting, and renders a studio-grade video ad.
          </p>
        </div>

        {/* Live Backend Health Indicator */}
        <div className="self-start sm:self-auto shrink-0">
          {healthStatus === 'online' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/90 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>AI Engine Online</span>
            </div>
          )}
          {healthStatus === 'checking' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 bg-stone-100 border border-stone-200">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-500" />
              <span>Checking Engine...</span>
            </div>
          )}
          {healthStatus === 'offline' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Engine Offline</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Configuration Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. PRODUCT PHOTO SECTION */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-border shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                  1. Product Photo Upload
                </span>
                <span className="text-[11px] text-ink-faint font-mono">JPG, PNG, WEBP, JFIF (1–5 Photos)</span>
              </div>

              {/* Clean Multi-Angle Dropzone */}
              <FileDropzone
                files={selectedFiles}
                previewUrls={previewUrls}
                onFilesChange={handleFilesChange}
                activeLabel={activeLabel}
                maxFiles={5}
              />
            </div>

            {/* 2. AD STYLE SELECTOR */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-border shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                  2. Choose Video Ad Style
                </span>
                <span className="text-[11px] text-accent-blue font-medium">3 Signature Formats</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {VIDEO_STYLES.map((style) => {
                  const isSelected = selectedStyle === style.id;
                  return (
                    <div
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all relative ${
                        isSelected
                          ? 'border-ink bg-canvas-subtle/50 shadow-sm ring-1 ring-ink'
                          : 'border-border/80 bg-white hover:border-border hover:bg-canvas-subtle/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-ink tracking-tight">
                              {style.title}
                            </span>
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                              style={{ backgroundColor: `${style.accent}15`, color: style.accent }}
                            >
                              {style.badge}
                            </span>
                          </div>
                          <p className="text-xs text-ink-secondary leading-relaxed">
                            {style.description}
                          </p>
                          <span className="text-[11px] text-ink-muted block pt-0.5">
                            <strong className="text-ink">Best for:</strong> {style.bestFor}
                          </span>
                        </div>

                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewModalVideo({ title: style.title, url: style.exampleVideo });
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-canvas-subtle hover:bg-canvas-subtle/80 text-[11px] font-medium text-ink-secondary border border-border transition-colors"
                          >
                            <Play className="w-3 h-3 fill-current text-ink" />
                            <span>Preview</span>
                          </button>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected ? 'border-ink bg-ink text-white' : 'border-border bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. ASPECT RATIO & FORMAT */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-border shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted block">
                  3. Aspect Ratio & Placement
                </span>
                <span className="text-[11px] font-mono text-ink-muted">
                  {aspectRatio === '9:16' ? '1080×1920 (Vertical)' : '1920×1080 (Landscape)'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    aspectRatio === '9:16'
                      ? 'border-ink bg-canvas-subtle/50 ring-1 ring-ink'
                      : 'border-border/80 bg-white hover:bg-canvas-subtle/20'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-ink mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-ink block">9:16 Vertical (Recommended)</span>
                    <span className="text-[11px] text-ink-muted block">Instagram Reels, TikTok, Shorts</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio('16:9')}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    aspectRatio === '16:9'
                      ? 'border-ink bg-canvas-subtle/50 ring-1 ring-ink'
                      : 'border-border/80 bg-white hover:bg-canvas-subtle/20'
                  }`}
                >
                  <Monitor className="w-5 h-5 text-ink mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-ink block">16:9 Landscape</span>
                    <span className="text-[11px] text-ink-muted block">YouTube & Website Headers</span>
                  </div>
                </button>
              </div>
            </div>

            {/* 4. CREATIVE BRIEF & TONE */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-border shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                  4. Creative Brief & Tone
                </span>
                <span className="text-[11px] text-ink-faint">Hook, Call-to-Action & Mood</span>
              </div>

              {/* Tone Presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-ink-muted block">
                  Tone Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {TONE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setBrief(preset.prompt)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-canvas-subtle hover:bg-canvas-subtle/80 text-ink-secondary border border-border/80 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder={activeStyleConfig.placeholder}
                rows={3}
                className="w-full p-4 rounded-2xl bg-canvas-subtle/40 border border-border focus:border-ink focus:outline-none text-xs sm:text-sm text-ink placeholder:text-ink-faint leading-relaxed transition-colors resize-none"
              />

              <div className="flex items-center gap-1.5 text-[11px] text-ink-muted">
                <Info className="w-3.5 h-3.5 text-accent-blue shrink-0" />
                <span>Leave blank to let the creative director compose optimal commercial copy tailored to your product.</span>
              </div>

              {/* Call to Action Input */}
              <div className="space-y-1.5 pt-2 border-t border-border/60">
                <div className="flex items-center justify-between">
                  <label htmlFor="cta-input" className="text-xs font-semibold text-ink">
                    Call-to-Action (CTA)
                  </label>
                  <span className="text-[11px] font-mono text-ink-muted">
                    {ctaText.length}/28
                  </span>
                </div>
                <input
                  id="cta-input"
                  type="text"
                  maxLength={28}
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="Order Today"
                  className="w-full px-4 py-2.5 rounded-xl bg-canvas-subtle/40 border border-border focus:border-ink focus:outline-none text-xs sm:text-sm text-ink placeholder:text-ink-faint transition-colors font-medium"
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !hasPhotos}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 tracking-wide transition-all ${
                !hasPhotos
                  ? 'bg-stone-200 text-stone-500 cursor-not-allowed shadow-none'
                  : 'btn-glossy shadow-lg cursor-pointer'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Directing & Rendering Video Ad...</span>
                </>
              ) : !hasPhotos ? (
                <span>Upload at least 1 product photo to generate</span>
              ) : (
                <>
                  <span>Render Custom Video Ad Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Live Interactive Mockup Frame (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-ink-muted">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-accent-blue" />
                <span>Live Simulation</span>
              </span>
              <span className="font-mono text-[10px] text-ink-faint">
                {aspectRatio === '9:16' ? '1080×1920 (9:16)' : '1920×1080 (16:9)'}
              </span>
            </div>

            <div className="studio-card p-4 rounded-3xl border border-border/80 flex items-center justify-center bg-canvas-subtle/30 min-h-[460px]">
              <AdPreviewFrame
                photoUrls={previewUrls}
                photoUrl={previewUrls[0] || null}
                briefText={brief}
                ctaText={ctaText.trim() || 'Order Today'}
                aspectRatio={aspectRatio}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Video Preview Modal (Adaptive Aspect Ratio - No Black Bars) */}
      {previewModalVideo && (() => {
        const isLandscapeClip = previewModalVideo.url.includes('style3') || previewModalVideo.url.includes('lifestyle');
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
            <div className={`bg-canvas-card rounded-3xl w-full overflow-hidden border border-border shadow-2xl space-y-4 p-5 transition-all duration-300 ${
              isLandscapeClip ? 'max-w-xl sm:max-w-2xl' : 'max-w-sm'
            }`}>
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="font-bold text-sm text-ink">{previewModalVideo.title}</span>
                <button
                  type="button"
                  onClick={() => setPreviewModalVideo(null)}
                  className="w-7 h-7 rounded-full bg-canvas-subtle flex items-center justify-center hover:bg-border transition-colors text-ink"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className={`rounded-2xl overflow-hidden bg-black relative flex items-center justify-center transition-all duration-300 ${
                isLandscapeClip ? 'aspect-video w-full' : 'aspect-[9/16] max-h-[80vh]'
              }`}>
                <video
                  src={previewModalVideo.url}
                  controls
                  autoPlay
                  playsInline
                  loop
                  className="w-full h-full object-cover block"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  const matchedStyle = VIDEO_STYLES.find((s) => s.exampleVideo === previewModalVideo.url);
                  if (matchedStyle) setSelectedStyle(matchedStyle.id);
                  setPreviewModalVideo(null);
                }}
                className="btn-glossy w-full py-2.5 rounded-xl text-xs font-semibold"
              >
                Select This Ad Style
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
