"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LuShoppingCart,
  LuZap,
  LuTruck,
  LuShieldCheck,
  LuHeadphones,
} from "react-icons/lu";
import QuantitySelector from "./QuantitySelector";

export interface ProductVariantItem {
  id: string;
  name: string;
  sku?: string | null;
  price: number;
  stock: number;
}

export interface ProductImageItem {
  id: string;
  url: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface ProductDetailData {
  id: string;
  name: string;
  description: string;
  warrantyInfo: string | null;
  brand: {
    name: string;
  };
  category: {
    name: string;
  };
  variants: ProductVariantItem[];
  images: ProductImageItem[];
}

export interface RecommendationProductItem {
  id: string;
  name: string;
  images: Array<{
    url: string;
  }>;
  variants: Array<{
    price: number;
  }>;
}

export interface ProductDetailViewProps {
  product: ProductDetailData;
  recommendations?: RecommendationProductItem[];
  isPreview?: boolean;
}

export default function ProductDetailView({
  product,
  recommendations = [],
  isPreview = false,
}: ProductDetailViewProps) {
  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url ||
    product.images[0]?.url ||
    "";
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>(primaryImage);

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ""
  );

  const activeVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    product.variants[0];

  const totalStock = product.variants.reduce(
    (total, variant) => total + variant.stock,
    0
  );

  const displayPrice = activeVariant
    ? `Rp ${Number(activeVariant.price).toLocaleString("id-ID")}`
    : product.variants[0]
    ? `Rp ${Number(product.variants[0].price).toLocaleString("id-ID")}`
    : "Harga belum tersedia";

  const currentStock = activeVariant ? activeVariant.stock : totalStock;
  const isAvailable = currentStock > 0;

  return (
    <div className="py-4">
      {/* Gambar dan informasi produk */}
      <section className="mx-auto max-w-7xl p-6 bg-white rounded-lg shadow-xs">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Kolom Galeri Gambar */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
              {selectedImageUrl ? (
                <Image
                  src={selectedImageUrl}
                  alt={product.name}
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

            {/* Thumbnail list jika gambar lebih dari satu */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {product.images.map((img, index) => (
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
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Kolom Informasi dan Aksi Produk */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                {product.brand.name}
              </span>

              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
                {product.category.name}
              </span>
            </div>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            <p className="mt-5 text-2xl font-bold text-blue-600">
              {displayPrice}
            </p>

            <div className="mt-5 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isAvailable ? "bg-green-500" : "bg-red-500"
                }`}
              />

              <span
                className={`text-sm font-medium ${
                  isAvailable ? "text-green-700" : "text-red-700"
                }`}
              >
                {isAvailable
                  ? `Stok tersedia (${currentStock})`
                  : "Stok habis"}
              </span>
            </div>

            {product.warrantyInfo && (
              <p className="mt-4 text-sm text-gray-600">
                Garansi: {product.warrantyInfo}
              </p>
            )}

            {/* Pilihan Varian */}
            <fieldset className="mt-8">
              <legend className="text-sm font-semibold text-gray-900">
                Pilihan Varian
              </legend>

              <div className="mt-3 space-y-2">
                {product.variants.map((variant) => (
                  <label
                    key={variant.id}
                    htmlFor={`variant-${variant.id}`}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg border p-4 transition-colors ${
                      selectedVariantId === variant.id
                        ? "border-blue-600 bg-blue-50/20 ring-1 ring-blue-600/30"
                        : "border-gray-200 hover:border-blue-300"
                    } ${
                      variant.stock === 0
                        ? "cursor-not-allowed bg-gray-50 opacity-60"
                        : ""
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block font-medium text-gray-900">
                        {variant.name}
                      </span>

                      <span className="mt-1 block text-sm text-gray-500">
                        {variant.stock > 0
                          ? `Stok ${variant.stock} unit`
                          : "Stok habis"}
                      </span>
                    </span>

                    <span className="flex shrink-0 items-center gap-3">
                      <span className="text-right text-sm font-semibold text-gray-900">
                        Rp {Number(variant.price).toLocaleString("id-ID")}
                      </span>

                      <input
                        id={`variant-${variant.id}`}
                        type="radio"
                        name="variantId"
                        value={variant.id}
                        checked={selectedVariantId === variant.id}
                        onChange={() => setSelectedVariantId(variant.id)}
                        disabled={variant.stock === 0}
                        className="h-4 w-4 accent-blue-700 cursor-pointer"
                      />
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Aksi Pembelian untuk Customer atau Info Preview untuk Admin */}
            {!isPreview ? (
              <>
                <QuantitySelector stock={currentStock} />

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/cart"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-blue-700 px-4 py-3 text-center text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 cursor-pointer"
                  >
                    <LuShoppingCart className="h-5 w-5 shrink-0" />
                    Tambah ke Keranjang
                  </Link>

                  <Link
                    href="/payment"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-800 cursor-pointer"
                  >
                    <LuZap className="h-5 w-5 shrink-0" />
                    Pesan Sekarang
                  </Link>
                </div>
              </>
            ) : (
              <div className="mt-8 rounded-lg border border-blue-100 bg-blue-50/70 p-4 text-sm text-blue-900">
                <p className="font-semibold text-blue-800">
                  Pratinjau Mode Admin
                </p>
                <p className="mt-1 text-xs text-blue-700 leading-relaxed">
                  Tombol aksi transaksi belanja (Tambah ke Keranjang dan Pesan Sekarang) disembunyikan pada halaman pratinjau ini.
                </p>
              </div>
            )}

            {/* Fitur Layanan Toko */}
            <div className="mt-8 grid gap-4 border-t border-gray-200 pt-6 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <span className="rounded-full bg-blue-50 p-2 text-blue-800">
                  <LuTruck className="h-5 w-5" />
                </span>

                <div className="text-sm">
                  <p className="font-semibold text-gray-900">
                    Pengiriman Cepat
                  </p>
                  <p className="mt-1 text-gray-500">1-3 hari kerja</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="rounded-full bg-blue-50 p-2 text-blue-800">
                  <LuShieldCheck className="h-5 w-5" />
                </span>

                <div className="text-sm">
                  <p className="font-semibold text-gray-900">Produk Original</p>
                  <p className="mt-1 text-gray-500">Garansi resmi</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="rounded-full bg-blue-50 p-2 text-blue-800">
                  <LuHeadphones className="h-5 w-5" />
                </span>

                <div className="text-sm">
                  <p className="font-semibold text-gray-900">
                    Layanan Pelanggan
                  </p>
                  <p className="mt-1 text-gray-500">Siap membantu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deskripsi dan spesifikasi */}
      <section className="mt-4 bg-white rounded-lg mx-auto grid max-w-7xl gap-12 p-6 shadow-xs lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-10">
          <section aria-labelledby="specifications-heading">
            <h2
              id="specifications-heading"
              className="text-xl font-bold text-gray-900"
            >
              Informasi Produk
            </h2>

            <dl className="mt-5 divide-y divide-gray-200 border-y border-gray-200">
              <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-4 py-3 text-sm sm:grid-cols-[160px_minmax(0,1fr)]">
                <dt className="text-gray-500">Kategori</dt>
                <dd className="font-medium text-gray-900">
                  {product.category.name}
                </dd>
              </div>

              <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-4 py-3 text-sm sm:grid-cols-[160px_minmax(0,1fr)]">
                <dt className="text-gray-500">Brand</dt>
                <dd className="font-medium text-gray-900">
                  {product.brand.name}
                </dd>
              </div>

              <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-4 py-3 text-sm sm:grid-cols-[160px_minmax(0,1fr)]">
                <dt className="text-gray-500">Jumlah varian</dt>
                <dd className="font-medium text-gray-900">
                  {product.variants.length} varian
                </dd>
              </div>

              <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-4 py-3 text-sm sm:grid-cols-[160px_minmax(0,1fr)]">
                <dt className="text-gray-500">Total stok</dt>
                <dd className="font-medium text-gray-900">{totalStock} unit</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="warranty-heading">
            <h2
              id="warranty-heading"
              className="text-xl font-bold text-gray-900"
            >
              Garansi
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              {product.warrantyInfo || "Informasi garansi belum tersedia."}
            </p>
          </section>

          <section aria-labelledby="description-heading">
            <h2
              id="description-heading"
              className="text-xl font-bold text-gray-900"
            >
              Deskripsi Produk
            </h2>

            <p className="mt-3 whitespace-pre-line leading-7 text-gray-600">
              {product.description}
            </p>
          </section>
        </div>

        {/* Produk Serupa */}
        <aside aria-labelledby="recommendations-heading">
          <h2
            id="recommendations-heading"
            className="text-xl font-bold text-gray-900"
          >
            Produk Serupa
          </h2>

          {recommendations.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">
              Belum ada produk serupa.
            </p>
          ) : (
            <div className="mt-5 divide-y divide-gray-200">
              {recommendations.map((item) => {
                const targetHref = isPreview
                  ? `/admin/products/${item.id}/preview`
                  : `/products/${item.id}`;

                return (
                  <Link
                    key={item.id}
                    href={targetHref}
                    className="flex gap-4 py-4 first:pt-0 hover:text-blue-700 group transition-colors"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100 border border-gray-200">
                      {item.images[0] ? (
                        <Image
                          src={item.images[0].url}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-xs text-gray-500">
                          Tanpa gambar
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </h3>

                      <p className="mt-2 text-sm font-semibold text-blue-700">
                        {item.variants[0]
                          ? `Rp ${Number(item.variants[0].price).toLocaleString("id-ID")}`
                          : "Harga belum tersedia"}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}
