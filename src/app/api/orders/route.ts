import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getAllOrders, VideoStyle } from '@/lib/db';
import { savePhotoFile } from '@/lib/storage';
import { isAdminAuthenticated } from '@/lib/auth';
import { triggerAutoFulfill } from '@/lib/autoFulfill';
import fs from 'node:fs';
import path from 'node:path';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const brief = (formData.get('brief') as string | null) || '';
    const videoStyle = ((formData.get('videoStyle') as string) || 'style2_spotlight') as VideoStyle;
    const photoFile = formData.get('photo') as File | null;

    if (!brief || brief.trim().length < 3) {
      return NextResponse.json(
        { error: 'Please provide a creative brief describing your desired ad.' },
        { status: 400 }
      );
    }

    if (!photoFile || photoFile.size === 0) {
      return NextResponse.json(
        { error: 'Please upload a product photo (JPG, PNG, WebP, or JFIF).' },
        { status: 400 }
      );
    }

    const saved = await savePhotoFile(photoFile);
    const photoFilename = saved.filename;
    const photoOriginalName = saved.originalName;
    const photoMimeType = saved.mimeType;
    const photoSize = saved.size;

    const order = createOrder({
      brief,
      videoStyle,
      photoFilename,
      photoOriginalName,
      photoMimeType,
      photoSize,
    });

    // Automatically trigger autonomous multi-style video fulfillment
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
