import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

import { AdBlueprint } from './blueprint';

let DatabaseSyncRef: any = null;
let dbInstance: any = null;

function resolveDatabaseSync() {
  if (DatabaseSyncRef) return DatabaseSyncRef;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('node:sqlite');
    DatabaseSyncRef = mod.DatabaseSync || mod.default?.DatabaseSync;
    return DatabaseSyncRef;
  } catch (err: any) {
    throw new Error(
      `Failed to load built-in node:sqlite module: ${err?.message || err}. Make sure Node.js >= 22 is used with --experimental-sqlite.`
    );
  }
}

export type OrderStatus = 'submitted' | 'in_production' | 'ready' | 'failed';
export type VideoStyle = 'style1_explainer' | 'style2_spotlight' | 'style3_lifestyle';

export interface AdCallout {
  number?: string;
  name?: string;
  note?: string;
  num?: string;
  title?: string;
  subtitle?: string;
  pos?: string;
  pin_x?: number;
  pin_y?: number;
  target_x?: number;
  target_y?: number;
  target_xy?: [number, number];
  preferred_quadrant?: string;
}

export interface AdCreativeMetadata {
  brand_name: string;
  headline: string;
  subheadline: string;
  cta: string;
  badge_tag: string;
  primary_color: string;
  accent_color: string;
  video_style?: VideoStyle;
  // Explainer-specific
  header_slogan?: string;
  section_title?: string;
  callouts?: AdCallout[];
  tagline_closing?: string;
  ingredients_summary?: string;
  background_gradient_start?: string;
  background_gradient_end?: string;
  // Lifestyle-specific
  lifestyle_story?: string;
}

export interface PhotoRecord {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface Order {
  id: string;
  token: string;
  status: OrderStatus;
  video_style: VideoStyle;
  brief: string;
  photo_filename: string;
  photo_original_name: string;
  photo_mime_type: string;
  photo_size: number;
  photos_json?: string | null;
  cta_text?: string | null;
  video_filename: string | null;
  video_original_name: string | null;
  video_mime_type: string | null;
  video_size: number | null;
  ad_metadata?: string | null;
  error_message?: string | null;
  created_at: number;
  updated_at: number;
}

export function getDatabase(): any {
  if (dbInstance) {
    return dbInstance;
  }

  const DatabaseSyncClass = resolveDatabaseSync();

  const dbFilePath = process.env.DATABASE_FILE || path.join(process.cwd(), 'data', 'studio.db');
  const dbDir = path.dirname(dbFilePath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const db = new DatabaseSyncClass(dbFilePath);
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      token TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('submitted', 'in_production', 'ready', 'failed')),
      video_style TEXT NOT NULL DEFAULT 'style2_spotlight',
      brief TEXT NOT NULL,
      photo_filename TEXT NOT NULL,
      photo_original_name TEXT NOT NULL,
      photo_mime_type TEXT NOT NULL,
      photo_size INTEGER NOT NULL,
      video_filename TEXT,
      video_original_name TEXT,
      video_mime_type TEXT,
      video_size INTEGER,
      ad_metadata TEXT,
      error_message TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_orders_token ON orders(token);
    CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
  `);

  try {
    db.exec(`ALTER TABLE orders ADD COLUMN video_style TEXT NOT NULL DEFAULT 'style2_spotlight';`);
  } catch {}

  try {
    db.exec(`ALTER TABLE orders ADD COLUMN ad_metadata TEXT;`);
  } catch {}

  try {
    db.exec(`ALTER TABLE orders ADD COLUMN photos_json TEXT;`);
  } catch {}

  try {
    db.exec(`ALTER TABLE orders ADD COLUMN cta_text TEXT;`);
  } catch {}

  dbInstance = db;
  return dbInstance;
}

export function createOrder(data: {
  brief: string;
  ctaText?: string;
  videoStyle?: VideoStyle;
  photoFilename?: string;
  photoOriginalName?: string;
  photoMimeType?: string;
  photoSize?: number;
  photos?: PhotoRecord[];
}): Order {
  const db = getDatabase();
  const id = `ord_${crypto.randomBytes(8).toString('hex')}`;
  const token = crypto.randomBytes(20).toString('hex');
  const now = Date.now();
  const style = data.videoStyle || 'style2_spotlight';
  const cta = data.ctaText ? data.ctaText.trim() : null;

  const photoRecords: PhotoRecord[] = data.photos && data.photos.length > 0
    ? data.photos
    : [{
        filename: data.photoFilename || 'photo.jpg',
        originalName: data.photoOriginalName || 'product.jpg',
        mimeType: data.photoMimeType || 'image/jpeg',
        size: data.photoSize || 0,
      }];

  const primaryPhoto = photoRecords[0];
  const photosJson = JSON.stringify(photoRecords);

  const stmt = db.prepare(`
    INSERT INTO orders (
      id, token, status, video_style, brief, cta_text,
      photo_filename, photo_original_name, photo_mime_type, photo_size,
      photos_json,
      video_filename, video_original_name, video_mime_type, video_size,
      ad_metadata,
      created_at, updated_at
    ) VALUES (
      ?, ?, 'submitted', ?, ?, ?,
      ?, ?, ?, ?,
      ?,
      NULL, NULL, NULL, NULL,
      NULL,
      ?, ?
    )
  `);

  stmt.run(
    id,
    token,
    style,
    data.brief.trim(),
    cta,
    primaryPhoto.filename,
    primaryPhoto.originalName,
    primaryPhoto.mimeType,
    primaryPhoto.size,
    photosJson,
    now,
    now
  );

  return getOrderById(id)!;
}

export function getOrderPhotos(order: Order): PhotoRecord[] {
  if (order.photos_json) {
    try {
      const parsed = JSON.parse(order.photos_json);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {}
  }
  return [
    {
      filename: order.photo_filename,
      originalName: order.photo_original_name,
      mimeType: order.photo_mime_type,
      size: order.photo_size,
    },
  ];
}

export function getOrderByToken(token: string): Order | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM orders WHERE token = ?');
  const row = stmt.get(token) as unknown as Order | undefined;
  return row || null;
}

export function getOrderById(id: string): Order | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM orders WHERE id = ?');
  const row = stmt.get(id) as unknown as Order | undefined;
  return row || null;
}

export function getAllOrders(): Order[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM orders ORDER BY created_at DESC');
  const rows = stmt.all() as unknown as Order[];
  return rows || [];
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | null {
  const db = getDatabase();
  const now = Date.now();
  const stmt = db.prepare(`
    UPDATE orders
    SET status = ?, updated_at = ?
    WHERE id = ?
  `);
  stmt.run(status, now, id);
  return getOrderById(id);
}

export function attachVideoToOrder(
  id: string,
  videoData: {
    videoFilename: string;
    videoOriginalName: string;
    videoMimeType: string;
    videoSize: number;
    adMetadata?: AdCreativeMetadata | AdBlueprint | any | null;
  }
): Order | null {
  const db = getDatabase();
  const now = Date.now();
  const metadataJson = videoData.adMetadata ? JSON.stringify(videoData.adMetadata) : null;
  const stmt = db.prepare(`
    UPDATE orders
    SET status = 'ready',
        video_filename = ?,
        video_original_name = ?,
        video_mime_type = ?,
        video_size = ?,
        ad_metadata = ?,
        updated_at = ?
    WHERE id = ?
  `);
  stmt.run(
    videoData.videoFilename,
    videoData.videoOriginalName,
    videoData.videoMimeType,
    videoData.videoSize,
    metadataJson,
    now,
    id
  );
  return getOrderById(id);
}

export function failOrder(id: string, errorMessage: string): Order | null {
  const db = getDatabase();
  const now = Date.now();
  const stmt = db.prepare(`
    UPDATE orders
    SET status = 'failed',
        error_message = ?,
        updated_at = ?
    WHERE id = ?
  `);
  stmt.run(errorMessage, now, id);
  return getOrderById(id);
}
