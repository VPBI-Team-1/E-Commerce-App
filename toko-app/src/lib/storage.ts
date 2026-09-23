import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';

export interface StorageService {
  upload(file: File, folder?: string): Promise<string>;
}

async function processFile(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  let buffer = Buffer.from(arrayBuffer);
  let ext = path.extname(file.name) || '';

  if (file.type.startsWith('image/')) {
    try {
      buffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
      ext = '.webp';
    } catch (error) {
      console.error('Sharp compression failed, falling back to original buffer', error);
      if (!ext) ext = '.jpg';
    }
  } else if (!ext) {
    ext = '.jpg';
  }

  const safeBaseName = path
    .basename(file.name, path.extname(file.name))
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 30);

  return { buffer, ext, safeBaseName };
}

class LocalStorageAdapter implements StorageService {
  private uploadDir = path.join(process.cwd(), 'public', 'uploads');

  async upload(file: File): Promise<string> {
    await fs.promises.mkdir(this.uploadDir, { recursive: true });

    const { buffer, ext, safeBaseName } = await processFile(file);
    const uniqueName = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}_${safeBaseName}${ext}`;
    const destination = path.join(this.uploadDir, uniqueName);

    await fs.promises.writeFile(destination, buffer);

    return `/uploads/${uniqueName}`;
  }
}

class VercelBlobStorageAdapter implements StorageService {
  private localFallback = new LocalStorageAdapter();

  async upload(file: File, folder: string = 'products'): Promise<string> {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN tidak ditemukan. Mengalihkan ke LocalStorageAdapter.');
      return this.localFallback.upload(file);
    }

    try {
      const { put } = await import('@vercel/blob');
      const { buffer, ext, safeBaseName } = await processFile(file);
      const pathname = `${folder}/${Date.now()}_${safeBaseName}${ext}`;

      const contentType = file.type.startsWith('image/') ? 'image/webp' : file.type;
      const blob = await put(pathname, buffer, { access: 'public', contentType });
      return blob.url;
    } catch (error) {
      console.error('Gagal mengunggah ke Vercel Blob:', error);
      return this.localFallback.upload(file);
    }
  }
}

function createStorageService(): StorageService {
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction ? new VercelBlobStorageAdapter() : new LocalStorageAdapter();
}

export const storageService = createStorageService();
