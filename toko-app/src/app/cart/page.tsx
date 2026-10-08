"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { LuShoppingCart } from "react-icons/lu";
import {
  getOrCreateCart,
  getCartItems,
  updateCartItemQuantityAction,
  removeCartItemAction,
} from "./actions";

interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

interface CartItemType {
  id: string;
  quantity: number;
  variant: {
    id: string;
    name: string;
    price: number;
    stock: number;
    product: {
      name: string;
      images?: ProductImage[];
    };
  };
}

export default function CartPage() {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isUnauthenticated, setIsUnauthenticated] = useState(false);

  const loadCart = async () => {
    setLoading(true);

    const cartRes = await getOrCreateCart();

    if (cartRes.success && cartRes.data) {
      setIsUnauthenticated(false);
      const itemsRes = await getCartItems(cartRes.data.id);
      if (itemsRes.success && itemsRes.data) {
        setItems(itemsRes.data as unknown as CartItemType[]);
      }
    } else if (cartRes.error === "Silakan login terlebih dahulu") {
      setIsUnauthenticated(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleQuantityChange = (
    itemId: string,
    currentQty: number,
    delta: number,
  ) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQty } : item,
      ),
    );

    startTransition(async () => {
      const res = await updateCartItemQuantityAction(itemId, newQty);

      if (res.error || !res.success) {
        loadCart();
      } else {
        window.dispatchEvent(new Event("bytestore-cart-change"));
      }
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));

    startTransition(async () => {
      const res = await removeCartItemAction(itemId);
      if (res.error || !res.success) {
        loadCart();
      } else {
        window.dispatchEvent(new Event("bytestore-cart-change"));
      }
    });
  };

  const subtotal = items.reduce((acc, item) => {
    const price = item.variant?.price ?? 0;
    return acc + Number(price) * item.quantity;
  }, 0);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-28 bg-gray-100 animate-pulse rounded-xl"
              />
            ))}
          </div>
          <div className="h-64 bg-gray-100 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Halaman */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Keranjang Belanja{" "}
            <span className="text-sm font-normal text-gray-500">
              ({totalItems} item)
            </span>
          </h1>
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            ← Lanjut Belanja
          </Link>
        </div>

        {isUnauthenticated ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto my-12">
            <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <LuShoppingCart
                className="h-8 w-8 text-primary"
                aria-hidden="true"
              />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Silakan Masuk Terlebih Dahulu
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Masuk ke akun ByteStore Anda untuk mengakses keranjang belanja dan
              melanjutkan pesanan.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/login?redirect=/cart"
                className="inline-block bg-primary text-white font-medium text-sm px-6 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm"
              >
                Masuk Sekarang
              </Link>
              <Link
                href="/"
                className="inline-block border border-gray-300 text-gray-700 font-medium text-sm px-6 py-2.5 rounded-lg hover:bg-gray-50 transition"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto my-12">
            <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <LuShoppingCart
                className="h-8 w-8 text-primary"
                aria-hidden="true"
              />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Keranjang Anda Kosong
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Belum ada komponen atau periferal komputer yang ditambahkan.
            </p>
            <Link
              href="/"
              className="inline-block bg-primary text-white font-medium text-sm px-6 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              Jelajahi Produk ByteStore
            </Link>
          </div>
        ) : (
          /* Konten Keranjang & Ringkasan */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Daftar Item Keranjang */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                // Ambil gambar produk utama
                const imageUrl = item.variant?.product?.images?.[0]?.url;
                const price = item.variant?.price
                  ? Number(item.variant.price)
                  : 0;

                return (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-4 transition hover:border-gray-200"
                  >
                    {/* Gambar Produk */}
                    <div className="w-20 h-20 bg-gray-100 rounded-xl relative flex-shrink-0 overflow-hidden border border-gray-100 flex items-center justify-center">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={item.variant?.product?.name || "Gambar Produk"}
                          fill
                          className="object-contain p-2"
                        />
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">
                          ByteStore
                        </span>
                      )}
                    </div>

                    {/* Informasi Produk */}
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug">
                        {item.variant?.product?.name || "Produk"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Varian: {item.variant?.name || "-"}
                      </p>
                      <p className="text-sm font-bold text-blue-600 mt-2">
                        Rp {price.toLocaleString("id-ID")}
                      </p>
                    </div>

                    {/* Kontrol Kuantitas & Tombol Hapus */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity, -1)
                          }
                          disabled={isPending || item.quantity <= 1}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-200 disabled:opacity-40 transition text-sm font-semibold"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-semibold text-gray-800 bg-white min-w-[32px] text-center border-x border-gray-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity, 1)
                          }
                          disabled={
                            isPending ||
                            (item.variant?.stock
                              ? item.quantity >= item.variant.stock
                              : false)
                          }
                          className="px-3 py-1 text-gray-600 hover:bg-gray-200 disabled:opacity-40 transition text-sm font-semibold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isPending}
                        className="text-gray-400 hover:text-red-500 transition text-sm p-1"
                        title="Hapus Produk"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ringkasan Belanja (Sidebar Kanan) */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
              <h2 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Ringkasan Belanja
              </h2>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Total Harga ({totalItems} barang)</span>
                  <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimasi Ongkos Kirim</span>
                  <span className="text-green-600 font-medium">
                    Dihitung saat checkout
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center font-bold text-gray-900 text-base">
                  <span>Total Bayar</span>
                  <span className="text-blue-600">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className={`w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition shadow-md shadow-blue-200 text-sm ${
                  items.length === 0 || isPending
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
              >
                Lanjut ke Pembayaran
              </Link>

              <p className="text-[11px] text-gray-400 text-center mt-3">
                🔒 Transaksi aman & terenkripsi di ByteStore.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
