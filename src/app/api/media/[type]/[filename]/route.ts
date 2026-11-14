import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { getPhotoFilePath, getVideoFilePath } from '@/lib/storage';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: {
    type: string;
    filename: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { type, filename } = params;
  const download = request.nextUrl.searchParams.get('download') === '1';
  const customName = request.nextUrl.searchParams.get('name') || filename;

  let filePath: string | null = null;
  let contentType = 'application/octet-stream';

  if (type === 'photos') {
    filePath = getPhotoFilePath(filename);
    const ext = path.extname(filename).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.webp') contentType = 'image/webp';
  } else if (type === 'videos') {
    filePath = getVideoFilePath(filename);
    contentType = 'video/mp4';
  }

  if (!filePath || !fs.existsSync(filePath)) {
    return new NextResponse('File not found', { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;

  // Video Streaming with Range request support
  const range = request.headers.get('range');
  if (range && type === 'videos') {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize || start > end) {
      return new NextResponse('Requested range not satisfiable', {
        status: 416,
        headers: { 'Content-Range': `bytes */${fileSize}` },
      });
    }

    const chunkSize = end - start + 1;
    const stream = fs.createReadStream(filePath, { start, end });
    const webStream = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk) => controller.enqueue(chunk));
        stream.on('end', () => controller.close());
        stream.on('error', (err) => controller.error(err));
      },
    });

    const headers: Record<string, string> = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize.toString(),
      'Content-Type': contentType,
    };

    if (download) {
      headers['Content-Disposition'] = `attachment; filename="${encodeURIComponent(customName)}"`;
    }

    return new NextResponse(webStream, {
      status: 206,
      headers,
    });
  }

  // Full file read stream
  const nodeStream = fs.createReadStream(filePath);
  const webStream = new ReadableStream({
    start(controller) {
      nodeStream.on('data', (chunk) => controller.enqueue(chunk));
      nodeStream.on('end', () => controller.close());
      nodeStream.on('error', (err) => controller.error(err));
    },
  });

  const headers: Record<string, string> = {
    'Content-Length': fileSize.toString(),
    'Content-Type': contentType,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=31536000, immutable',
  };

  if (download) {
    headers['Content-Disposition'] = `attachment; filename="${encodeURIComponent(customName)}"`;
  } else {
    headers['Content-Disposition'] = `inline; filename="${encodeURIComponent(customName)}"`;
  }

  return new NextResponse(webStream, {
    status: 200,
    headers,
  });
}

