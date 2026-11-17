import sharp, { type Metadata } from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomBytes } from 'node:crypto';

export const MAX_UPLOAD_BYTES = 6 * 1024 * 1024;
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const MAX_PIXELS = 40_000_000;

export function uploadDir(): string {
  return path.resolve(/*turbopackIgnore: true*/ process.env.UPLOAD_DIR ?? './data/uploads');
}

export class UploadError extends Error {}

/** Validates, re-encodes to webp (which strips all metadata) and stores a user-supplied image. Returns the stored file name. */
export async function storeImage(file: File): Promise<string> {
  if (!(file instanceof File) || file.size === 0) throw new UploadError('No file received');
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError(`${file.name} is larger than ${MAX_UPLOAD_BYTES / 1024 / 1024} MB`);
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXT.has(ext) || !ALLOWED_MIME.has(file.type)) throw new UploadError(`${file.name}: only JPG, PNG or WebP images are allowed`);
  const buf = Buffer.from(await file.arrayBuffer());
  let meta: Metadata;
  try {
    meta = await sharp(buf, { limitInputPixels: MAX_PIXELS }).metadata();
  } catch {
    throw new UploadError(`${file.name} is not a valid image`);
  }
  if (!meta.format || !['jpeg', 'png', 'webp'].includes(meta.format)) throw new UploadError(`${file.name} is not a supported image type`);
  const out = await sharp(buf, { limitInputPixels: MAX_PIXELS })
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
  const name = `${Date.now().toString(36)}-${randomBytes(8).toString('hex')}.webp`;
  await fs.mkdir(uploadDir(), { recursive: true });
  await fs.writeFile(path.join(/*turbopackIgnore: true*/ uploadDir(), name), out, { mode: 0o640 });
  return name;
}

export const SAFE_NAME = /^[a-z0-9]+-[a-f0-9]{16}\.webp$/;

export async function readUpload(name: string): Promise<Buffer | null> {
  if (!SAFE_NAME.test(name)) return null;
  try {
    return await fs.readFile(path.join(/*turbopackIgnore: true*/ uploadDir(), name));
  } catch {
    return null;
  }
}

export async function deleteUpload(name: string): Promise<void> {
  if (!SAFE_NAME.test(name)) return;
  await fs.rm(path.join(/*turbopackIgnore: true*/ uploadDir(), name), { force: true });
}
