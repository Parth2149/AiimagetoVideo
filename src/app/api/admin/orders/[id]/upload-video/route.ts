import { NextRequest, NextResponse } from 'next/server';
import { attachVideoToOrder, getOrderById } from '@/lib/db';
import { saveVideoFile } from '@/lib/storage';
import { isAdminAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const order = getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  try {
    const formData = await request.formData();
    const videoFile = formData.get('video') as File | null;

    if (!videoFile || videoFile.size === 0) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
    }

    const saved = await saveVideoFile(videoFile);

    const updated = attachVideoToOrder(id, {
      videoFilename: saved.filename,
      videoOriginalName: saved.originalName,
      videoMimeType: saved.mimeType,
      videoSize: saved.size,
    });

    return NextResponse.json({
      success: true,
      message: 'Video uploaded successfully and order marked as ready.',
      order: updated,
    });
  } catch (err: any) {
    console.error('Error uploading video:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to upload video' },
      { status: 500 }
    );
  }
}

