import { NextRequest, NextResponse } from 'next/server';
import { getOrderByToken, getOrderPhotos, AdCreativeMetadata } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: {
    token: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { token } = params;
  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  const order = getOrderByToken(token);
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  let adMetadata: AdCreativeMetadata | null = null;
  if (order.ad_metadata) {
    try {
      adMetadata = JSON.parse(order.ad_metadata);
    } catch {}
  }

  const photoRecords = getOrderPhotos(order);
  const photos = photoRecords.map((p, idx) => ({
    index: idx,
    url: `/api/media/photos/${p.filename}`,
    originalName: p.originalName,
    size: p.size,
  }));

  return NextResponse.json({
    order: {
      id: order.id,
      token: order.token,
      status: order.status,
      videoStyle: order.video_style,
      brief: order.brief,
      photoUrl: `/api/media/photos/${order.photo_filename}`,
      photoOriginalName: order.photo_original_name,
      photoSize: order.photo_size,
      photos,
      videoUrl: order.video_filename ? `/api/media/videos/${order.video_filename}` : null,
      videoDownloadUrl: order.video_filename
        ? `/api/media/videos/${order.video_filename}?download=1&name=${encodeURIComponent(
            order.video_original_name || `${order.id}-ad.mp4`
          )}`
        : null,
      videoOriginalName: order.video_original_name,
      videoSize: order.video_size,
      adMetadata,
      error_message: order.error_message || null,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    },
  });
}
