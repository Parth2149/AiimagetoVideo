import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const geminiKey = process.env.GEMINI_API_KEY;
    const geminiReady = Boolean(geminiKey && geminiKey.trim().length > 10);

    let dbReady = false;
    try {
      const db = getDatabase();
      dbReady = Boolean(db);
    } catch {
      dbReady = false;
    }

    const isHealthy = geminiReady;

    return NextResponse.json({
      status: isHealthy ? 'online' : 'degraded',
      engine: isHealthy ? 'AI Engine Online' : 'Configuration Pending',
      gemini: geminiReady,
      database: dbReady,
      timestamp: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        status: 'offline',
        engine: 'Engine Offline',
        error: err?.message || 'Health check failed',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}

