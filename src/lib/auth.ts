import crypto from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'studio_admin_session';

export function getExpectedPassword(): string {
  return process.env.ADMIN_PASSWORD || 'studio2026';
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET || getExpectedPassword() + '_salt_creative_studio';
  return crypto.createHash('sha256').update(secret).digest('hex');
}

export function createSessionToken(): string {
  const payload = `admin_${Date.now()}`;
  const hmac = crypto.createHmac('sha256', getSessionSecret()).update(payload).digest('hex');
  return `${payload}.${hmac}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || !token.includes('.')) {
    return false;
  }
  const [payload, signature] = token.split('.');
  if (!payload || !signature) {
    return false;
  }
  const expectedHmac = crypto.createHmac('sha256', getSessionSecret()).update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedHmac));
}

export function isAdminAuthenticated(): boolean {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    return verifySessionToken(token);
  } catch {
    return false;
  }
}

export { COOKIE_NAME };

