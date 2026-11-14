import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus, OrderStatus } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';

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
  try {
    const { status } = (await request.json()) as { status: OrderStatus };
    if (!['submitted', 'in_production', 'ready'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updated = updateOrderStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update status' }, { status: 500 });
  }
}

