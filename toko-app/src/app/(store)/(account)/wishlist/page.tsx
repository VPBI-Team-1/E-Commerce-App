"use client";

import React from "react";
import Link from "next/link";
import { LuHeart, LuArrowRight } from "react-icons/lu";

export default function WishlistPage() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h1 className="text-xl font-bold text-gray-900">Wishlist Saya</h1>
        <p className="mt-1 text-sm text-gray-500">
          Simpan produk favorit Anda dan pantau ketersediaan barang dengan mudah.
        </p>
      </div>

      {/* Empty State (Antislop Compliant) */}
      <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500">
          <LuHeart className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-base font-bold text-gray-900">
          Wishlist Masih Kosong
        </h2>
        <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
          Belum ada produk impian yang disimpan. Jelajahi katalog dan tekan ikon hati untuk menambahkan produk ke sini.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 cursor-pointer"
        >
          <span>Jelajahi Produk</span>
          <LuArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
