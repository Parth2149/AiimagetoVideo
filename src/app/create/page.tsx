'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FileDropzone from '@/components/FileDropzone';
import AdPreviewFrame from '@/components/AdPreviewFrame';
import { ArrowRight, Loader2, AlertCircle, Play, Eye, X, Check, Layers, Film, Compass, Smartphone, Monitor, Info } from 'lucide-react';
import { VideoStyle } from '@/lib/db';

const SAMPLES = [
  {
    id: 'pizza',
    label: '🍕 Pepperoni Pizza',
    path: '/images.jfif',
    brief: 'Artisan wood-fired pepperoni pizza ad. End with Order Hot Now.',
    style: 'style1_explainer' as VideoStyle,
  },
  {
    id: 'salad',
    label: '🥗 Salad Bowl',
    path: '/salad-bowl.jpg',
    brief: 'Deconstruct this fresh signature salad bowl with avocado and garden corn. End with Order Fresh Today.',
    style: 'style1_explainer' as VideoStyle,
  },
  {
    id: 'truck',
    label: '🚚 Fleet Truck',
    path: '/commercial-truck.jpg',
    brief: 'Commercial fleet heavy haulage rig ad. End with Built for the Long Haul.',
    style: 'style3_lifestyle' as VideoStyle,
  },
  {
    id: 'burger',
    label: '🍔 Artisan Burger',
    path: '/salad-bowl.jpg', // Fallback image if needed
    brief: 'Artisanal burger stacked with crisp lettuce and golden cut fries. End with Order Today.',
    style: 'style2_spotlight' as VideoStyle,
  },
];

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
    description: 'Numbered ingredient callouts, animated pointer lines, and deconstructed features with elegant serif typography.',
    placeholder: 'Deconstruct this dish. Detail the fresh avocado slices, ripe tomatoes, and artisan seasonings.',
    exampleVideo: '/examples/style1_explainer.mp4',
    accent: '#4E7D56',
    bestFor: 'Food menus, electronics, cosmetics, apparel craftsmanship',
  },
  {
    id: 'style2_spotlight',
    title: '2. Editorial Agency Spotlight',
    badge: 'High-Impact Social Ad',
    description: 'Cinematic 9:16 push-in zoom, ambient backdrop blur, punchy human copywriting, and glassmorphic card.',
    placeholder: 'Make a 10-second Instagram ad for this product. Bold hook, end with ‘Order today’.',
    exampleVideo: '/examples/style2_spotlight.mp4',
    accent: '#E65100',
    bestFor: 'E-commerce sales, limited drops, direct-response offers',
  },
  {
    id: 'style3_lifestyle',
    title: '3. Cinematic Lifestyle Story',
    badge: 'Human Connection',
    description: 'Warm candid atmosphere, authentic setting, and 3-beat human interaction storyboard with natural audio & voiceover.',
    placeholder: 'Tell an authentic story about enjoying this product. Focus on taste, ritual, and shared moments.',
    exampleVideo: '/examples/style3_lifestyle.mp4',
    accent: '#D97706',
    bestFor: 'Lifestyle brands, dining experiences, vehicles, wellness',
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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(SAMPLES[0].path);
  const [isUsingSample, setIsUsingSample] = useState(true);
  const [sampleChoice, setSampleChoice] = useState(SAMPLES[0].id);
  const [selectedStyle, setSelectedStyle] = useState<VideoStyle>('style1_explainer');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [brief, setBrief] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal for previewing sample video
  const [previewModalVideo, setPreviewModalVideo] = useState<{ title: string; url: string } | null>(null);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setIsUsingSample(false);
      return () => URL.revokeObjectURL(url);
    }
  }, [selectedFile]);

  const activeStyleConfig = VIDEO_STYLES.find((s) => s.id === selectedStyle) || VIDEO_STYLES[0];

  const handleSelectSample = (sample: typeof SAMPLES[0]) => {
    setSelectedFile(null);
    setPreviewUrl(sample.path);
    setIsUsingSample(true);
    setSampleChoice(sample.id);
    setSelectedStyle(sample.style);
    if (!brief) {
      setBrief(sample.brief);
    }
  };

  const handleFileSelect = (file: File | null) => {
    if (file) {
      setSelectedFile(file);
      setIsUsingSample(false);
    } else {
      setSelectedFile(null);
      setIsUsingSample(false);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const activeBrief = brief.trim() || activeStyleConfig.placeholder;

    if (!selectedFile && !isUsingSample) {
      setErrorMessage('Please upload a product photo or select one of the instant samples above.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('brief', activeBrief);
      formData.append('videoStyle', selectedStyle);
      formData.append('aspectRatio', aspectRatio);

      if (selectedFile) {
        formData.append('photo', selectedFile);
        formData.append('useSampleSalad', 'false');
      } else {
        // Fetch sample file as blob
        const sampleObj = SAMPLES.find((s) => s.id === sampleChoice) || SAMPLES[0];
        const res = await fetch(sampleObj.path);
        const blob = await res.blob();
        formData.append('photo', blob, sampleObj.path.split('/').pop() || 'sample.jpg');
        formData.append('useSampleSalad', 'false');
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

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
          <Film className="w-4 h-4 text-accent-blue" />
          <span>Videlto Studio • Commercial Video Director</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
          Create Your Commercial Video Ad
        </h1>
        <p className="text-sm text-ink-secondary max-w-2xl leading-relaxed">
          Upload any raw product photo. Our creative director analyzes visible features, extracts harmonized color palettes, writes punchy copywriting, and renders a studio-grade 9:16 vertical video ad.
        </p>
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
                <span className="text-[11px] text-ink-faint font-mono">JPG, PNG, WEBP, JFIF</span>
              </div>

              {/* Sample Shortcuts */}
              <div className="space-y-2">
                <span className="text-[11px] font-medium text-ink-muted block">
                  Quick Sample Presets (Click to test instantly):
                </span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLES.map((sample) => {
                    const isSelected = isUsingSample && sampleChoice === sample.id;
                    return (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => handleSelectSample(sample)}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-ink text-white border-ink shadow-sm scale-102'
                            : 'bg-canvas-subtle/80 hover:bg-canvas-subtle text-ink-secondary border-border/70'
                        }`}
                      >
                        {sample.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dropzone */}
              <FileDropzone
                file={selectedFile}
                previewUrl={previewUrl}
                onFileSelect={handleFileSelect}
                isUsingSample={isUsingSample}
                onUseSample={() => handleSelectSample(SAMPLES[0])}
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
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted block">
                3. Aspect Ratio & Placement
              </span>

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
                  <Smartphone className="w-5 h-5 text-ink mt-0.5" />
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
                  <Monitor className="w-5 h-5 text-ink mt-0.5" />
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
                  Quick Tone Presets:
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
                <Info className="w-3.5 h-3.5 text-accent-blue" />
                <span>Leave blank to let the creative director compose the optimal commercial copy automatically.</span>
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
              disabled={isSubmitting}
              className="btn-glossy w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg tracking-wide"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Directing & Rendering Video Ad...</span>
                </>
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
                <span>Live Aspect Simulation</span>
              </span>
              <span className="font-mono text-[10px] text-ink-faint">1080×1920 (9:16)</span>
            </div>

            <div className="studio-card p-4 rounded-3xl border border-border/80 flex items-center justify-center bg-canvas-subtle/30">
              <AdPreviewFrame
                photoUrl={previewUrl}
                briefText={brief || activeStyleConfig.placeholder}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Video Preview Modal */}
      {previewModalVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-canvas-card rounded-3xl max-w-sm w-full overflow-hidden border border-border shadow-2xl space-y-4 p-5">
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

            <div className="rounded-2xl overflow-hidden bg-black aspect-[9/16] relative flex items-center justify-center">
              <video
                src={previewModalVideo.url}
                controls
                autoPlay
                playsInline
                loop
                className="w-full h-full object-contain"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setPreviewModalVideo(null);
                const matchedStyle = VIDEO_STYLES.find((s) => s.exampleVideo === previewModalVideo.url);
                if (matchedStyle) setSelectedStyle(matchedStyle.id);
              }}
              className="btn-glossy w-full py-2.5 rounded-xl text-xs font-semibold"
            >
              Select This Ad Style
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
