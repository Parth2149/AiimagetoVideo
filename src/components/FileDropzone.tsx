'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, Plus, ChevronLeft, ChevronRight, Star, Layers } from 'lucide-react';

interface FileDropzoneProps {
  files: File[];
  previewUrls: string[];
  onFilesChange: (files: File[], previewUrls: string[]) => void;
  activeLabel?: string;
  isUsingSample?: boolean;
  onUseSample?: () => void;
  maxFiles?: number;
}

export default function FileDropzone({
  files,
  previewUrls,
  onFilesChange,
  activeLabel = 'Product Photo',
  isUsingSample = false,
  onUseSample,
  maxFiles = 5,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const addMoreInputRef = useRef<HTMLInputElement | null>(null);

  const validateFiles = (newFiles: File[]): File[] => {
    setError(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jfif', 'image/pjpeg'];
    const validExts = ['.jpg', '.jpeg', '.png', '.webp', '.jfif'];

    const accepted: File[] = [];
    for (const f of newFiles) {
      const ext = f.name.substring(f.name.lastIndexOf('.')).toLowerCase();
      if (!validTypes.includes(f.type) && !validExts.includes(ext)) {
        setError(`"${f.name}" is not a supported format. Please use JPG, PNG, or WebP.`);
        continue;
      }
      if (f.size > 25 * 1024 * 1024) {
        setError(`"${f.name}" exceeds 25MB limit.`);
        continue;
      }
      accepted.push(f);
    }
    return accepted;
  };

  const handleAddFiles = (incoming: FileList | File[]) => {
    const list = Array.from(incoming);
    const validated = validateFiles(list);
    if (validated.length === 0) return;

    const combinedFiles = [...files, ...validated].slice(0, maxFiles);
    const newPreviewUrls = combinedFiles.map((file) => URL.createObjectURL(file));

    onFilesChange(combinedFiles, newPreviewUrls);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAddFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index: number) => {
    const nextFiles = files.filter((_, i) => i !== index);
    const nextUrls = previewUrls.filter((_, i) => i !== index);
    onFilesChange(nextFiles, nextUrls);
  };

  const handleSetHero = (index: number) => {
    if (index === 0) return;
    const itemFile = files[index];
    const itemUrl = previewUrls[index];

    const nextFiles = [itemFile, ...files.filter((_, i) => i !== index)];
    const nextUrls = [itemUrl, ...previewUrls.filter((_, i) => i !== index)];
    onFilesChange(nextFiles, nextUrls);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;

    const nextFiles = [...files];
    const nextUrls = [...previewUrls];

    const tempFile = nextFiles[index];
    nextFiles[index] = nextFiles[targetIndex];
    nextFiles[targetIndex] = tempFile;

    const tempUrl = nextUrls[index];
    nextUrls[index] = nextUrls[targetIndex];
    nextUrls[targetIndex] = tempUrl;

    onFilesChange(nextFiles, nextUrls);
  };

  const hasPhotos = files.length > 0 || (isUsingSample && previewUrls.length > 0);
  const photoCount = files.length > 0 ? files.length : isUsingSample ? previewUrls.length : 0;

  return (
    <div className="space-y-3">
      {/* Hidden file inputs */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp,.jfif"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleAddFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <input
        ref={addMoreInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp,.jfif"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleAddFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {/* Main Upload / Multi-Angle Management Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`group relative rounded-3xl border-2 transition-all duration-200 p-5 ${
          isDragOver
            ? 'border-accent-blue bg-blue-50/40'
            : hasPhotos
            ? 'border-border bg-canvas-subtle/30'
            : 'border-dashed border-border hover:border-ink-muted/50 bg-white/70 hover:bg-white cursor-pointer'
        }`}
        onClick={() => {
          if (!hasPhotos) inputRef.current?.click();
        }}
      >
        {hasPhotos ? (
          <div className="space-y-4">
            {/* Header info bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-ink">
                  {isUsingSample ? activeLabel : `${photoCount} Product Angle${photoCount > 1 ? 's' : ''} Ready`}
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {isUsingSample ? 'Sample Active' : `${photoCount}/${maxFiles} Uploaded`}
                </span>
              </div>

              {photoCount < maxFiles && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addMoreInputRef.current?.click();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ink text-white text-xs font-semibold hover:bg-ink/90 transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Angle</span>
                </button>
              )}
            </div>

            {/* Horizontal Thumbnail Strip */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-1 scrollbar-thin">
              {previewUrls.map((url, idx) => {
                const isHero = idx === 0;
                return (
                  <div
                    key={`${url}-${idx}`}
                    className={`relative group/thumb shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 transition-all ${
                      isHero
                        ? 'border-ink shadow-md ring-2 ring-ink/20'
                        : 'border-border hover:border-border-strong shadow-sm'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Angle ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Order Badge */}
                    <div className="absolute top-2 left-2 z-10 pointer-events-none">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md shadow-sm ${
                          isHero
                            ? 'bg-ink text-white'
                            : 'bg-black/60 text-white'
                        }`}
                      >
                        {isHero ? '#1 HERO' : `#${idx + 1}`}
                      </span>
                    </div>

                    {/* Action Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(idx);
                          }}
                          className="w-6 h-6 rounded-full bg-black/60 text-white hover:bg-rose-600 flex items-center justify-center transition-colors"
                          title="Remove this photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        {idx > 0 ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMove(idx, 'left');
                            }}
                            className="p-1 rounded-lg bg-black/60 text-white hover:bg-black/90 transition-colors"
                            title="Move left"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                        ) : <div className="w-6" />}

                        {!isHero && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetHero(idx);
                            }}
                            className="px-2 py-1 rounded-lg bg-white text-ink text-[10px] font-bold hover:bg-stone-100 transition-colors shadow-sm"
                            title="Set as Hero angle"
                          >
                            Set Hero
                          </button>
                        )}

                        {idx < previewUrls.length - 1 ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMove(idx, 'right');
                            }}
                            className="p-1 rounded-lg bg-black/60 text-white hover:bg-black/90 transition-colors"
                            title="Move right"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        ) : <div className="w-6" />}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add Angle Slot Button */}
              {photoCount < maxFiles && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addMoreInputRef.current?.click();
                  }}
                  className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-2 border-dashed border-border hover:border-ink/60 bg-white/60 hover:bg-white flex flex-col items-center justify-center gap-1.5 transition-all text-ink-muted hover:text-ink cursor-pointer"
                >
                  <Plus className="w-5 h-5 text-accent-blue" />
                  <span className="text-xs font-semibold">Add Angle</span>
                  <span className="text-[10px] text-ink-faint">({photoCount}/{maxFiles})</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-ink-muted flex items-center gap-1.5 pt-1">
              <Layers className="w-3.5 h-3.5 text-accent-blue" />
              <span>Multi-angle ad active: Photos will be showcased across different camera angles and scenes.</span>
            </p>
          </div>
        ) : (
          /* Empty state */
          <div className="py-4 flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-ink-secondary group-hover:scale-105 group-hover:bg-blue-50 group-hover:text-accent-blue transition-all">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">
                Drop 1 to 5 product photos here, or <span className="text-accent-blue underline">browse</span>
              </p>
              <p className="text-xs text-ink-muted mt-0.5">
                Upload multiple angles (hero, side, close-up, packaging) for a multi-angle commercial ad
              </p>
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-600 font-medium pl-1">{error}</p>}
    </div>
  );
}
