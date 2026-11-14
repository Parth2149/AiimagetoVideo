import { NextRequest, NextResponse } from 'next/server';
import { getExpectedPassword, createSessionToken, COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const expected = getExpectedPassword();

    if (!password || password !== expected) {
      return NextResponse.json({ error: 'Incorrect administrator password.' }, { status: 401 });
    }

    const token = createSessionToken();
    const response = NextResponse.json({ success: true, message: 'Authenticated successfully' });

    // Set HTTP-only cookie for secure session
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: 'Login request failed.' }, { status: 500 });
  }
}

