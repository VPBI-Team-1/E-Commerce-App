"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getOrCreateCart, getCartItems } from "../cart/actions";
import { createOrderAction } from "./actions";
import { getAddresses } from "@/modules/account/actions/account.actions";
import { Address } from "@/modules/account/types/account.types";

interface CartItemData {
  id: string;
  variantId?: string;
  quantity: number;
  variant?: {
    id?: string;
    price?: number | string;
    stock?: number;
    product?: {
      name?: string;
      images?: { url: string }[];
    };
  };
}

interface CourierOption {
  id: string;
  name: string;
  fee: number;
  originalFee: number;
  eta: string;
}

const COURIER_OPTIONS: CourierOption[] = [
  {
    id: "Standard",
    name: "Standard Delivery",
    fee: 0,
    originalFee: 15000,
    eta: "3 hari",
  },
  {
    id: "Cargo",
    name: "Cargo Delivery",
    fee: 0,
    originalFee: 50000,
    eta: "5 hari",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Address State from Customer Account
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [courier, setCourier] = useState<string>("Standard");

  // Load Data Item dari Cart dan Daftar Alamat Akun
  useEffect(() => {
    async function loadCheckoutData() {
      setLoading(true);
      try {
        const [cartRes, addrRes] = await Promise.all([
          getOrCreateCart(),
          getAddresses(),
        ]);

        if (cartRes.success && cartRes.data) {
          const itemsRes = await getCartItems(cartRes.data.id);
          if (itemsRes.success && itemsRes.data) {
            if (itemsRes.data.length === 0) {
              router.push("/cart");
              return;
            }
            setItems(itemsRes.data as CartItemData[]);
          }
        }

        if (addrRes.success && addrRes.data) {
          const addrList = addrRes.data as Address[];
          setAddresses(addrList);
          const defaultAddr = addrList.find((a) => a.isDefault) || addrList[0];
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
          }
        }
      } catch (err) {
        console.error("Gagal memuat data checkout:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCheckoutData();
  }, [router]);

  const subtotal = items.reduce((acc, item) => {
    const price = item.variant?.price ? Number(item.variant.price) : 0;
    return acc + price * item.quantity;
  }, 0);

  const selectedCourierObj =
    COURIER_OPTIONS.find((c) => c.id === courier) || COURIER_OPTIONS[0];
  const shippingFee = selectedCourierObj.fee;
  const originalShippingFee = selectedCourierObj.originalFee;
  const totalAmount = subtotal + shippingFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
    if (!selectedAddress || !selectedAddress.fullAddress.trim()) {
      alert("Harap pilih alamat pengiriman Anda terlebih dahulu!");
      return;
    }

    startTransition(async () => {
      const res = await createOrderAction({
        shippingAddress: { fullAddress: selectedAddress.fullAddress.trim() },
        courier,
      });

      if (res.success && res.data) {
        alert(
          `Pesanan Berhasil Dibuat!\nNo. Invoice: ${res.data.invoiceNumber}`,
        );
        router.push(`/order/success?id=${res.data.orderId}`);
      } else {
        alert(res.message || "Terjadi kesalahan saat membuat pesanan.");
      }
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl text-center">
        Memuat checkout...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-6">
          <Link href="/cart" className="text-sm text-blue-600 hover:underline">
            ← Kembali ke Keranjang
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Checkout</h1>
        </div>

        <form
          onSubmit={handleSubmitOrder}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Kolom Kiri: Alamat dari Akun & Kurir */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Alamat Pengiriman */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  1. Alamat Pengiriman
                </h2>
                <Link
                  href="/profile"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Kelola Alamat di Profil
                </Link>
              </div>

              {addresses.length === 0 ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 space-y-3">
                  <p className="leading-relaxed">
                    Anda belum memiliki alamat pengiriman tersimpan di akun Anda. Harap tambahkan alamat di halaman Profil untuk melanjutkan pemesanan.
                  </p>
                  <Link
                    href="/profile"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-700 px-3.5 py-2 font-medium text-white hover:bg-amber-800 transition-colors cursor-pointer"
                  >
                    Tambah Alamat Sekarang
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition ${
                          isSelected
                            ? "border-blue-600 bg-blue-50/30 ring-1 ring-blue-500/20 shadow-2xs"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={isSelected}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-gray-900">
                              Alamat Pengiriman
                            </span>
                            {addr.isDefault && (
                              <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                                Utama
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {addr.fullAddress}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Opsi Pengiriman (Kurir) */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                2. Metode Pengiriman
              </h2>
              <div className="space-y-3">
                {COURIER_OPTIONS.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                      courier === item.id
                        ? "border-blue-600 bg-blue-50/30 ring-1 ring-blue-500/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="courier"
                        checked={courier === item.id}
                        onChange={() => setCourier(item.id)}
                        className="text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Estimasi tiba: {item.eta}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <span className="line-through text-gray-400 font-normal">
                        Rp {item.originalFee.toLocaleString("id-ID")}
                      </span>
                      <span className="text-emerald-700 font-bold">
                        Rp {item.fee.toLocaleString("id-ID")}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Ringkasan Pesanan */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24 space-y-4">
            <h2 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
              Ringkasan Pesanan
            </h2>

            {/* List Barang */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => {
                const img = item.variant?.product?.images?.[0]?.url;
                return (
                  <div
                    key={item.id}
                    className="flex gap-3 items-center text-xs"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded relative flex-shrink-0">
                      {img && (
                        <Image
                          src={img}
                          alt="Product"
                          fill
                          className="object-contain"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 line-clamp-1">
                        {item.variant?.product?.name}
                      </p>
                      <p className="text-gray-500">
                        {item.quantity}x Rp{" "}
                        {Number(item.variant?.price || 0).toLocaleString(
                          "id-ID",
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Rincian */}
            <div className="pt-3 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal Produk</span>
                <span>Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Ongkos Kirim</span>
                <div className="flex items-center gap-2">
                  {originalShippingFee !== undefined && (
                    <span className="line-through text-gray-400">
                      Rp {originalShippingFee.toLocaleString("id-ID")}
                    </span>
                  )}
                  <span>Rp {shippingFee.toLocaleString("id-ID")}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100 flex justify-between font-bold text-base text-gray-900">
                <span>Total Pesanan</span>
                <span className="text-blue-600">
                  Rp {totalAmount.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending || addresses.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition shadow-md shadow-blue-200 disabled:opacity-50 text-sm cursor-pointer disabled:cursor-not-allowed"
            >
              {isPending
                ? "Memproses Pesanan..."
                : addresses.length === 0
                ? "Tambahkan Alamat Terlebih Dahulu"
                : "Buat Pesanan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
