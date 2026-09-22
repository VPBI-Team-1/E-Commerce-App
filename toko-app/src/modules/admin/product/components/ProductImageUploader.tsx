'use client';

import { useState, useTransition, useRef } from 'react';
import { ProductImageInput } from '@/schemas/product';
import { uploadProductImageAction } from '../actions/product.actions';
import {
  ArrowUpTrayIcon,
  TrashIcon,
  StarIcon as StarSolidIcon,
} from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface ProductImageUploaderProps {
  images: ProductImageInput[];
  onChange: (images: ProductImageInput[]) => void;
  errorMessage?: string;
  disabled?: boolean;
}

export function ProductImageUploader({
  images,
  onChange,
  errorMessage,
  disabled = false,
}: ProductImageUploaderProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);

    const fileList = Array.from(files);

    startTransition(async () => {
      const newUploadedImages: ProductImageInput[] = [];

      for (const file of fileList) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await uploadProductImageAction(formData);

        if (!res.success || !res.data) {
          setUploadError(res.error || `Gagal mengunggah file ${file.name}.`);
          continue;
        }

        newUploadedImages.push({
          url: res.data.url,
          isPrimary: images.length === 0 && newUploadedImages.length === 0,
          sortOrder: images.length + newUploadedImages.length,
        });
      }

      if (newUploadedImages.length > 0) {
        onChange([...images, ...newUploadedImages]);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    });
  };

  const handleSetPrimary = (indexToPrimary: number) => {
    const updated = images.map((img, idx) => ({
      ...img,
      isPrimary: idx === indexToPrimary,
    }));
    onChange(updated);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const wasPrimary = images[indexToRemove]?.isPrimary;
    const remaining = images.filter((_, idx) => idx !== indexToRemove);

    if (wasPrimary && remaining.length > 0) {
      remaining[0].isPrimary = true;
    }

    onChange(remaining);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Galeri Foto Produk</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Unggah minimal 1 foto produk. Format: JPG, PNG, WebP (Maks. 5MB per file).
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          className="hidden"
          id="product-image-input"
        />

        <label
          htmlFor="product-image-input"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer self-start sm:self-auto ${
            disabled || isUploading ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          <ArrowUpTrayIcon className="w-4 h-4 text-gray-500" />
          <span>{isUploading ? 'Mengunggah...' : 'Pilih File Gambar'}</span>
        </label>
      </div>

      {uploadError && (
        <div className="p-3 rounded border border-red-200 bg-red-50 text-xs text-red-700">
          {uploadError}
        </div>
      )}

      {errorMessage && (
        <p className="text-xs text-red-600 font-medium">{errorMessage}</p>
      )}

      {/* Grid Preview Foto */}
      {images.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-lg p-8 text-center bg-gray-50/50">
          <p className="text-xs font-medium text-gray-600">Belum ada foto yang diunggah</p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Klik tombol &quot;Pilih File Gambar&quot; di atas untuk menambahkan foto produk.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map((img, index) => (
            <div
              key={img.url + index}
              className={`group relative rounded border overflow-hidden bg-gray-50 transition-all ${
                img.isPrimary
                  ? 'border-primary ring-1 ring-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="aspect-square w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Toolbar Aksi Gambar */}
              <div className="p-1.5 flex items-center justify-between bg-white border-t border-gray-100 text-xs">
                <button
                  type="button"
                  onClick={() => handleSetPrimary(index)}
                  disabled={disabled}
                  title={img.isPrimary ? 'Foto Utama' : 'Jadikan Foto Utama'}
                  className={`inline-flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${
                    img.isPrimary ? 'text-primary' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  {img.isPrimary ? (
                    <>
                      <StarSolidIcon className="w-3.5 h-3.5 text-primary" />
                      <span>Utama</span>
                    </>
                  ) : (
                    <>
                      <StarOutlineIcon className="w-3.5 h-3.5" />
                      <span>Set Utama</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  disabled={disabled}
                  title="Hapus Foto"
                  className="p-1 rounded text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
