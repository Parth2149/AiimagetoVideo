import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getAllOrders, VideoStyle } from '@/lib/db';
import { savePhotoFiles } from '@/lib/storage';
import { isAdminAuthenticated } from '@/lib/auth';
import { triggerAutoFulfill } from '@/lib/autoFulfill';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const brief = (formData.get('brief') as string | null) || '';
    const ctaText = (formData.get('ctaText') as string | null) || (formData.get('cta') as string | null) || '';
    const videoStyle = ((formData.get('videoStyle') as string) || 'style2_spotlight') as VideoStyle;

    // Collect all uploaded images from 'images', 'images[]', 'photos', 'photos[]', or single 'photo'
    let rawFiles: File[] = [];

    const candidateKeys = ['images[]', 'images', 'photos[]', 'photos', 'photo'];
    for (const key of candidateKeys) {
      const found = formData.getAll(key).filter((item): item is File => item instanceof File && item.size > 0);
      if (found.length > 0) {
        rawFiles = found;
        break;
      }
    }

    if (!brief || brief.trim().length < 3) {
      return NextResponse.json(
        { error: 'Please provide a creative brief describing your desired ad.' },
        { status: 400 }
      );
    }

    if (rawFiles.length === 0) {
      return NextResponse.json(
        { error: 'Please upload at least 1 product photo (JPG, PNG, WebP, or JFIF).' },
        { status: 400 }
      );
    }

    if (rawFiles.length > 5) {
      return NextResponse.json(
        { error: 'You can upload a maximum of 5 photos for multi-angle showcase.' },
        { status: 400 }
      );
    }

    // Normalize and save all photos (1 to 5) into standard RGB JPEGs
    const savedPhotos = await savePhotoFiles(rawFiles);

    const order = createOrder({
      brief,
      ctaText: ctaText.trim() || undefined,
      videoStyle,
      photos: savedPhotos,
      photoFilename: savedPhotos[0].filename,
      photoOriginalName: savedPhotos[0].originalName,
      photoMimeType: savedPhotos[0].mimeType,
      photoSize: savedPhotos[0].size,
    });

    // Automatically trigger autonomous multi-style video fulfillment with multi-photo support
    triggerAutoFulfill(order.id);

    return NextResponse.json({
      success: true,
      token: order.token,
      orderId: order.id,
      order,
    });
  } catch (err: any) {
    console.error('Error creating order:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to create order.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const orders = getAllOrders();
  return NextResponse.json({ orders });
}
