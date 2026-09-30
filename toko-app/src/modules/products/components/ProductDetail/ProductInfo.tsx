"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LuShoppingCart,
  LuZap,
  LuTruck,
  LuShieldCheck,
  LuHeadphones,
} from "react-icons/lu";
import { addCartItems } from "@/app/cart/actions";
import QuantitySelector from "../QuantitySelector";
import type { ProductDetailData } from "../../types/product";

export interface ProductInfoProps {
  product: ProductDetailData;
  isPreview?: boolean;
}

export default function ProductInfo({ product, isPreview = false }: ProductInfoProps) {
  const router = useRouter();

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ""
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  const handleAddToCart = async (redirectCheckout: boolean = false) => {
    if (!selectedVariantId) {
      setErrorMsg("Silakan pilih varian terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await addCartItems({
        productId: product.id,
        productVariantId: selectedVariantId,
        qty: quantity,
      });

      if (!res.success) {
        setErrorMsg(res.error || "Gagal menambahkan ke keranjang");
      } else {
        if (redirectCheckout) {
          router.push("/checkout");
        } else {
          router.push("/cart");
        }
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Terjadi kesalahan, coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          {isAvailable ? `Stok tersedia (${currentStock})` : "Stok habis"}
        </span>
      </div>

      {product.warrantyInfo && (
        <p className="mt-4 text-sm text-gray-600">
          Garansi: {product.warrantyInfo}
        </p>
      )}

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

      {!isPreview ? (
        <>
          <QuantitySelector
            stock={currentStock}
            value={quantity}
            onChange={setQuantity}
          />

          {errorMsg && (
            <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
              {errorMsg}
            </div>
          )}

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleAddToCart(false)}
              disabled={isLoading || !isAvailable || quantity < 1}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-blue-700 px-4 py-3 text-center text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LuShoppingCart className="h-5 w-5 shrink-0" />
              {isLoading ? "Memproses..." : "Tambah ke Keranjang"}
            </button>

            <button
              type="button"
              onClick={() => handleAddToCart(true)}
              disabled={isLoading || !isAvailable || quantity < 1}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LuZap className="h-5 w-5 shrink-0" />
              Pesan Sekarang
            </button>
          </div>
        </>
      ) : (
        <div className="mt-8 rounded-lg border border-blue-100 bg-blue-50/70 p-4 text-sm text-blue-900">
          <p className="font-semibold text-blue-800">Pratinjau Mode Admin</p>
          <p className="mt-1 text-xs text-blue-700 leading-relaxed">
            Tombol aksi transaksi belanja (Tambah ke Keranjang dan Pesan
            Sekarang) disembunyikan pada halaman pratinjau ini.
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-4 border-t border-gray-200 pt-6 sm:grid-cols-3">
        <div className="flex items-start gap-3">
          <span className="rounded-full bg-blue-50 p-2 text-blue-800">
            <LuTruck className="h-5 w-5" />
          </span>
          <div className="text-sm">
            <p className="font-semibold text-gray-900">Pengiriman Cepat</p>
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
            <p className="font-semibold text-gray-900">Layanan Pelanggan</p>
            <p className="mt-1 text-gray-500">Siap membantu</p>
          </div>
        </div>
      </div>
    </div>
  );
}
