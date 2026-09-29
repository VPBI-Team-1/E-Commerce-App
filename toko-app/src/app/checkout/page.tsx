"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getOrCreateCart, getCartItems } from "../cart/actions";
import { createOrderAction, ShippingAddressInput } from "./actions";

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Form State
  const [address, setAddress] = useState<ShippingAddressInput>({
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [courier, setCourier] = useState<string>("JNE Express");

  // Load Data Item dari Cart
  useEffect(() => {
    async function loadCheckoutData() {
      setLoading(true);
      const cartRes = await getOrCreateCart();
      if (cartRes.success && cartRes.data) {
        const itemsRes = await getCartItems(cartRes.data.id);
        if (itemsRes.success && itemsRes.data) {
          if (itemsRes.data.length === 0) {
            router.push("/cart");
            return;
          }
          setItems(itemsRes.data);
        }
      }
      setLoading(false);
    }
    loadCheckoutData();
  }, [router]);

  const subtotal = items.reduce((acc, item) => {
    const price = item.variant?.price ? Number(item.variant.price) : 0;
    return acc + price * item.quantity;
  }, 0);

  const shippingFee = courier === "JNE Express" ? 20000 : 15000;
  const totalAmount = subtotal + shippingFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.name || !address.phone || !address.address) {
      alert("Harap lengkapi alamat pengiriman!");
      return;
    }

    startTransition(async () => {
      const res = await createOrderAction({
        shippingAddress: address,
        courier,
      });

      if (res.success && res.data) {
        alert(
          `Pesanan Berhasil Dibuat!\nNo. Invoice: ${res.data.invoiceNumber}`,
        );
        router.push(`/order/success?id=${res.data.orderId}`); // Halaman konfirmasi
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
          {/* Kolom Kiri: Form Alamat & Kurir */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Alamat Pengiriman */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                1. Alamat Pengiriman
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Nama Penerima
                  </label>
                  <input
                    type="text"
                    required
                    value={address.name}
                    onChange={(e) =>
                      setAddress({ ...address, name: e.target.value })
                    }
                    className="w-full border rounded-lg p-2.5 text-sm focus:outline-blue-600"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Nomor Telepon
                  </label>
                  <input
                    type="text"
                    required
                    value={address.phone}
                    onChange={(e) =>
                      setAddress({ ...address, phone: e.target.value })
                    }
                    className="w-full border rounded-lg p-2.5 text-sm focus:outline-blue-600"
                    placeholder="081234567890"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Alamat Lengkap
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={address.address}
                    onChange={(e) =>
                      setAddress({ ...address, address: e.target.value })
                    }
                    className="w-full border rounded-lg p-2.5 text-sm focus:outline-blue-600"
                    placeholder="Jalan, Blok, No. Rumah, RT/RW, Kec/Kel"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Kota / Kabupaten
                  </label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                    className="w-full border rounded-lg p-2.5 text-sm focus:outline-blue-600"
                    placeholder="Jakarta Selatan"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    required
                    value={address.postalCode}
                    onChange={(e) =>
                      setAddress({ ...address, postalCode: e.target.value })
                    }
                    className="w-full border rounded-lg p-2.5 text-sm focus:outline-blue-600"
                    placeholder="12345"
                  />
                </div>
              </div>
            </div>

            {/* 2. Opsi Pengiriman (Kurir) */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                2. Metode Pengiriman
              </h2>
              <div className="space-y-3">
                {[
                  {
                    id: "JNE Express",
                    name: "JNE Express (Reguler)",
                    fee: 20000,
                    eta: "2-3 hari",
                  },
                  {
                    id: "J&T Express",
                    name: "J&T Express (Standard)",
                    fee: 15000,
                    eta: "3-4 hari",
                  },
                  {
                    id: "Sicepat",
                    name: "SiCepat REG",
                    fee: 18000,
                    eta: "2-3 hari",
                  },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                      courier === item.id
                        ? "border-blue-600 bg-blue-50/30"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="courier"
                        checked={courier === item.id}
                        onChange={() => setCourier(item.id)}
                        className="text-blue-600 focus:ring-blue-500"
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
                    <span className="text-sm font-bold text-gray-900">
                      Rp {item.fee.toLocaleString("id-ID")}
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
                <span>Rp {shippingFee.toLocaleString("id-ID")}</span>
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
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition shadow-md shadow-blue-200 disabled:opacity-50 text-sm"
            >
              {isPending ? "Memproses Pesanan..." : "Buat Pesanan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
