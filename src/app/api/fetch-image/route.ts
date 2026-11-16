import { NextRequest, NextResponse } from 'next/server';
import dns from 'dns';

export const dynamic = 'force-dynamic';

const MAX_IMAGE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

function isPrivateIp(ip: string): boolean {
  // IPv4 private/loopback/link-local/metadata
  if (
    ip === '127.0.0.1' ||
    ip === '0.0.0.0' ||
    ip.startsWith('127.') ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('169.254.')
  ) {
    return true;
  }
  // 172.16.0.0 - 172.31.255.255
  if (ip.startsWith('172.')) {
    const parts = ip.split('.');
    if (parts.length >= 2) {
      const second = parseInt(parts[1], 10);
      if (second >= 16 && second <= 31) return true;
    }
  }
  // IPv6 loopback / unique local / link-local
  if (
    ip === '::1' ||
    ip === '::' ||
    ip.toLowerCase().startsWith('fc') ||
    ip.toLowerCase().startsWith('fd') ||
    ip.toLowerCase().startsWith('fe80:')
  ) {
    return true;
  }

  return false;
}

function detectImageMime(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;

  // JPEG / JFIF: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }

  // WEBP: RIFF....WEBP
  if (
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const targetUrl = searchParams.get('url');

    if (!targetUrl || typeof targetUrl !== 'string') {
      return NextResponse.json({ error: 'Missing "url" query parameter' }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(targetUrl.trim());
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return NextResponse.json({ error: 'Only HTTP and HTTPS URLs are supported' }, { status: 400 });
    }

    const hostname = parsedUrl.hostname.toLowerCase();

    // Prevent direct localhost / internal names
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      hostname === '0.0.0.0'
    ) {
      return NextResponse.json(
        { error: 'Access to private or local network hosts is not permitted' },
        { status: 400 }
      );
    }

    if (isPrivateIp(hostname)) {
      return NextResponse.json(
        { error: 'Access to private or internal IP addresses is not permitted' },
        { status: 400 }
      );
    }

    // Resolve DNS to verify resolved IP is not private (prevent DNS rebinding)
    try {
      const lookup = await dns.promises.lookup(hostname);
      if (isPrivateIp(lookup.address)) {
        return NextResponse.json(
          { error: 'Target resolves to a private or internal IP address' },
          { status: 400 }
        );
      }
    } catch {
      // If DNS resolution fails, let fetch handle the failure
    }

    // Fetch the remote image with 10s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let response: Response;
    try {
      response = await fetch(parsedUrl.toString(), {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        return NextResponse.json({ error: 'Request to fetch image timed out (10s)' }, { status: 504 });
      }
      return NextResponse.json(
        { error: `Failed to connect to image host: ${err.message || 'Network error'}` },
        { status: 502 }
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Remote server responded with HTTP status ${response.status}` },
        { status: 400 }
      );
    }

    // Check Content-Length if provided
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `Image is too large (max allowed: 25MB)` },
        { status: 400 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.byteLength > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `Image exceeds maximum allowed size of 25MB` },
        { status: 400 }
      );
    }

    // Validate image format by magic bytes
    const detectedMime = detectImageMime(buffer);
    const headerMime = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase();

    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jfif'];

    let finalMime = detectedMime;
    if (!finalMime) {
      if (headerMime && allowedMimes.includes(headerMime)) {
        finalMime = headerMime;
      } else {
        return NextResponse.json(
          { error: 'The URL does not point to a valid JPEG, PNG, or WebP image.' },
          { status: 400 }
        );
      }
    }

    // Return binary image
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': finalMime,
        'Content-Length': buffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'Content-Disposition': 'inline',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Internal server error while fetching image' },
      { status: 500 }
    );
  }
}
