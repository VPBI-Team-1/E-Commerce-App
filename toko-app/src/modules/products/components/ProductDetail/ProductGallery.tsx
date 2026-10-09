"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImageItem } from "../../types/product";

export interface ProductGalleryProps {
  images: ProductImageItem[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const primaryImage =
    images.find((img) => img.isPrimary)?.url || images[0]?.url || "";
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>(primaryImage);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
        {selectedImageUrl ? (
          <Image
            src={selectedImageUrl}
            alt={name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-6 sm:p-10 transition-all duration-200"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            Gambar Produk
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              key={img.id || index}
              type="button"
              onClick={() => setSelectedImageUrl(img.url)}
              className={`relative h-18 w-18 shrink-0 overflow-hidden rounded-lg border-2 bg-gray-50 transition-all cursor-pointer ${
                selectedImageUrl === img.url
                  ? "border-blue-600 ring-2 ring-blue-600/20"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Image
                src={img.url}
                alt={`${name} thumbnail ${index + 1}`}
                fill
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
