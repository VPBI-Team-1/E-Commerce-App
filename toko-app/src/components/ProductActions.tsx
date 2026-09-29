"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuShoppingCart, LuZap, LuPlus, LuMinus } from "react-icons/lu";
import { addCartItems } from "@/app/cart/actions";

type Variant = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

type ProductActionsProps = {
  productId: string;
  variants: Variant[];
};

export default function ProductActions({
  productId,
  variants,
}: ProductActionsProps) {
  const router = useRouter();

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    variants[0]?.id || "",
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);

  const handleAddToCart = async () => {
    if (!selectedVariantId) {
      setErrorMsg("Silakan pilih varian terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await addCartItems({
        productId,
        productVariantId: selectedVariantId,
        qty: quantity,
      });

      if (!res.success) {
        setErrorMsg(res.error || "Gagal menambahkan ke keranjang");
      } else {
        router.push("/cart");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Terjadi kesalahan, coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Update Tampilan Harga Berdasarkan Varian yang Dipilih */}
      <div>
        <p className="text-3xl font-bold text-blue-600">
          {selectedVariant
            ? `Rp ${Number(selectedVariant.price).toLocaleString("id-ID")}`
            : "Harga belum tersedia"}
        </p>
        {selectedVariant && (
          <p className="mt-1 text-sm text-gray-500">
            Stok:{" "}
            <span className="font-semibold text-gray-700">
              {selectedVariant.stock}
            </span>
          </p>
        )}
      </div>

      {/* Pilihan Varian */}
      {variants.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-900">Pilihan Varian</h2>
          <div className="mt-3 space-y-2">
            {variants.map((variant) => (
              <label
                key={variant.id}
                className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all ${
                  selectedVariantId === variant.id
                    ? "border-blue-600 bg-blue-50/50 text-blue-900 ring-1 ring-blue-600"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="product-variant"
                    value={variant.id}
                    checked={selectedVariantId === variant.id}
                    onChange={() => setSelectedVariantId(variant.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium">{variant.name}</span>
                </div>
                <span className="font-semibold text-gray-700">
                  Rp {Number(variant.price).toLocaleString("id-ID")}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Jumlah / Kuantitas */}
      <div>
        <h2 className="font-semibold text-gray-900">Jumlah</h2>
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            disabled={quantity <= 1}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            <LuMinus />
          </button>
          <span className="w-10 text-center text-lg font-semibold">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((prev) => prev + 1)}
            disabled={
              selectedVariant ? quantity >= selectedVariant.stock : false
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            <LuPlus />
          </button>
        </div>
      </div>

      {/* Pesan Error jika stok habis atau belum login */}
      {errorMsg && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {errorMsg}
        </div>
      )}

      {/* Tombol Aksi */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isLoading || !selectedVariant || selectedVariant.stock < 1}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-600 px-5 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50 disabled:opacity-50"
        >
          <LuShoppingCart className="text-2xl" />
          {isLoading ? "Menambahkan..." : "Tambah ke Keranjang"}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isLoading || !selectedVariant || selectedVariant.stock < 1}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          <LuZap className="text-2xl" />
          Pesan Sekarang
        </button>
      </div>
    </div>
  );
}
