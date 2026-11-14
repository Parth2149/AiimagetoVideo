import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const UPLOAD_ROOT = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
const PHOTOS_DIR = path.join(UPLOAD_ROOT, 'photos');
const VIDEOS_DIR = path.join(UPLOAD_ROOT, 'videos');

export function ensureUploadDirs() {
  if (!fs.existsSync(PHOTOS_DIR)) {
    fs.mkdirSync(PHOTOS_DIR, { recursive: true });
  }
  if (!fs.existsSync(VIDEOS_DIR)) {
    fs.mkdirSync(VIDEOS_DIR, { recursive: true });
  }
}

export const ALLOWED_PHOTO_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jfif',
  'image/pjpeg',
  'application/octet-stream',
];
export const ALLOWED_PHOTO_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.jfif'];
export const MAX_PHOTO_BYTES = 25 * 1024 * 1024; // 25 MB

export const ALLOWED_VIDEO_TYPES = ['video/mp4'];
export const ALLOWED_VIDEO_EXTS = ['.mp4'];
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB

export async function savePhotoFile(file: File): Promise<{
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
}> {
  ensureUploadDirs();

  const originalName = file.name || 'product.jpg';
  const ext = path.extname(originalName).toLowerCase();
  const mimeType = file.type || 'image/jpeg';

  if (!ALLOWED_PHOTO_EXTS.includes(ext) && !ALLOWED_PHOTO_TYPES.includes(mimeType)) {
    throw new Error('Invalid photo format. Please upload JPG, PNG, WebP, or JFIF.');
  }

  if (file.size > MAX_PHOTO_BYTES) {
    throw new Error('Photo exceeds maximum allowed size (25MB).');
  }

  const arrayBuffer = await file.arrayBuffer();
  const rawBuffer = Buffer.from(arrayBuffer);

  // Normalize image into standard RGB JPEG bytes
  const jpegBuffer = await sharp(rawBuffer)
    .toFormat('jpeg', { quality: 92 })
    .toBuffer();

  const filename = `photo_${Date.now()}_${crypto.randomBytes(8).toString('hex')}.jpg`;
  const targetPath = path.join(PHOTOS_DIR, filename);
  fs.writeFileSync(targetPath, jpegBuffer);

  return {
    filename,
    originalName,
    mimeType: 'image/jpeg',
    size: jpegBuffer.length,
  };
}

export async function saveVideoFile(file: File): Promise<{
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
}> {
  ensureUploadDirs();

  const originalName = file.name || 'video.mp4';
  const ext = path.extname(originalName).toLowerCase();
  const mimeType = file.type || 'video/mp4';

  if (ext !== '.mp4' && mimeType !== 'video/mp4') {
    throw new Error('Invalid video format. Please upload an MP4 file.');
  }

  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error('Video exceeds maximum allowed size (100MB).');
  }

  const filename = `video_${Date.now()}_${crypto.randomBytes(8).toString('hex')}.mp4`;
  const targetPath = path.join(VIDEOS_DIR, filename);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(targetPath, buffer);

  return {
    filename,
    originalName,
    mimeType: 'video/mp4',
    size: file.size,
  };
}

export function getPhotoFilePath(filename: string): string | null {
  // Prevent directory traversal
  const sanitized = path.basename(filename);
  const fullPath = path.join(PHOTOS_DIR, sanitized);
  if (fs.existsSync(fullPath)) {
    return fullPath;
  }
  return null;
}

export function getVideoFilePath(filename: string): string | null {
  const sanitized = path.basename(filename);
  const fullPath = path.join(VIDEOS_DIR, sanitized);
  if (fs.existsSync(fullPath)) {
    return fullPath;
  }
  return null;
}

