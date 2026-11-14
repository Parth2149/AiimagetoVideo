'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, CheckCircle2 } from 'lucide-react';

interface FileDropzoneProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  previewUrl: string | null;
  onUseSample?: () => void;
  isUsingSample?: boolean;
}

export default function FileDropzone({
  file,
  onFileSelect,
  previewUrl,
  onUseSample,
  isUsingSample = false,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const validateAndSet = (selectedFile: File) => {
    setError(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jfif', 'image/pjpeg'];
    const validExts = ['.jpg', '.jpeg', '.png', '.webp', '.jfif'];
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();

    if (!validTypes.includes(selectedFile.type) && !validExts.includes(ext)) {
      setError('Please upload a JPG, PNG, or WebP image.');
      return;
    }

    if (selectedFile.size > 25 * 1024 * 1024) {
      setError('File size must be under 25MB.');
      return;
    }

    onFileSelect(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSet(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSet(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`group relative rounded-2xl border-2 border-dashed p-5 transition-all duration-200 cursor-pointer text-center ${
          isDragOver
            ? 'border-accent-blue bg-blue-50/40'
            : file || isUsingSample
            ? 'border-emerald-300/80 bg-emerald-50/20'
            : 'border-border hover:border-ink-muted/50 bg-white/60 hover:bg-white'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={handleChange}
        />

        {file ? (
          <div className="flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-border">
                {previewUrl ? (
                  <img src={previewUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 m-3 text-ink-muted" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink truncate">{file.name}</p>
                <p className="text-xs text-ink-muted">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • Click to replace
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFileSelect(null);
              }}
              className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-stone-200/60 transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : isUsingSample ? (
          <div className="flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-border">
                {previewUrl && (
                  <img src={previewUrl} alt="Sample Salad" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink flex items-center gap-1.5">
                  Sample Salad Bowl Photo
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                    Active
                  </span>
                </p>
                <p className="text-xs text-ink-muted">Ready to order • Click or drop to use your own</p>
              </div>
            </div>
            <span className="text-xs text-accent-blue font-medium underline">Replace</span>
          </div>
        ) : (
          <div className="py-3 flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-ink-secondary group-hover:scale-105 group-hover:bg-blue-50 group-hover:text-accent-blue transition-all">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">
                Drop your product photo here, or <span className="text-accent-blue underline">browse</span>
              </p>
              <p className="text-xs text-ink-muted mt-0.5">Supports JPG, PNG, or WebP up to 25MB</p>
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-600 font-medium pl-1">{error}</p>}

      {!file && !isUsingSample && onUseSample && (
        <div className="flex items-center justify-between text-xs pt-1 px-1 text-ink-muted">
          <span>Need an example to try?</span>
          <button
            type="button"
            onClick={onUseSample}
            className="text-ink font-medium hover:text-accent-blue underline transition-colors"
          >
            Load sample salad bowl photo
          </button>
        </div>
      )}
    </div>
  );
}

