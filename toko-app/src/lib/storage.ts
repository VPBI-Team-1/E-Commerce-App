import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface StorageService {
  upload(file: File, folder?: string): Promise<string>;
}

class LocalStorageAdapter implements StorageService {
  private uploadDir = path.join(process.cwd(), 'public', 'uploads');

  async upload(file: File): Promise<string> {
    await fs.promises.mkdir(this.uploadDir, { recursive: true });

    const ext = path.extname(file.name) || '.jpg';
    const safeBaseName = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const uniqueName = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}_${safeBaseName}${ext}`;
    const destination = path.join(this.uploadDir, uniqueName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
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
      const ext = path.extname(file.name) || '.jpg';
      const safeBaseName = path
        .basename(file.name, ext)
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 30);
      const pathname = `${folder}/${Date.now()}_${safeBaseName}${ext}`;

      const blob = await put(pathname, file, { access: 'public' });
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
