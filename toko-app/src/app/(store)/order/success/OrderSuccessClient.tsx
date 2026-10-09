"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LuCircleCheck,
  LuCreditCard,
  LuShoppingBag,
  LuArrowRight,
  LuPackage,
  LuReceipt,
} from "react-icons/lu";
import { Order } from "@/modules/account/types/account.types";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import PaymentModal from "@/modules/account/components/PaymentModal";

interface OrderSuccessClientProps {
  order: Order | null;
  orderId?: string;
}

export default function OrderSuccessClient({
  order: initialOrder,
  orderId,
}: OrderSuccessClientProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(initialOrder);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handlePaymentSuccess = () => {
    if (order) {
      setOrder({
        ...order,
        status: "VERIFYING",
      });
    }
    router.refresh();
  };

  return (
    <div className="min-h-[80vh] py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        {/* Success Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xs mb-6">
          <LuCircleCheck className="h-10 w-10" />
        </div>

        {/* Title & Description */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Pesanan Berhasil Dibuat!
        </h1>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed max-w-lg mx-auto">
          Terima kasih telah berbelanja di ByteStore. Pesanan Anda telah tercatat dalam sistem dan siap diproses setelah pembayaran terkonfirmasi.
        </p>

        {order ? (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 shadow-xs text-left space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div className="space-y-1">
                <span className="text-xs text-gray-500 block">Nomor Invoice</span>
                <span className="font-mono text-base font-bold text-gray-900">
                  {order.invoiceNumber}
                </span>
              </div>
              <div>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>

            {/* Total tagihan */}
            <div className="flex items-center justify-between rounded-xl bg-gray-50/80 p-4 border border-gray-100">
              <div className="space-y-0.5">
                <span className="text-xs text-gray-500 block">Total Pembayaran</span>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(Number(order.totalAmount))}
                </span>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                Metode: Virtual Account
              </span>
            </div>

            {/* Preview Barang */}
            {order.items && order.items.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-semibold text-gray-700 block">
                  Ringkasan Barang ({order.items.length} produk)
                </span>
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {order.items.map((item) => {
                    const img = item.variant?.product?.images?.[0]?.url;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-lg border border-gray-100 p-2.5 bg-white text-xs"
                      >
                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-gray-100 bg-gray-50 text-gray-400">
                          {img ? (
                            <Image
                              src={img}
                              alt={item.productName}
                              fill
                              sizes="44px"
                              className="object-contain p-1"
                              unoptimized={
                                !img.includes("m.media-amazon.com") &&
                                !img.startsWith("/")
                              }
                            />
                          ) : (
                            <LuPackage className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {item.productName}
                          </p>
                          <p className="text-gray-500 mt-0.5">
                            {item.quantity} barang x {formatPrice(Number(item.price))}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tombol Tindakan */}
            <div className="pt-2 space-y-3">
              {order.status === "PENDING" && (
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <LuCreditCard className="h-4 w-4" />
                  <span>Bayar Sekarang via Virtual Account</span>
                </button>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/orders/${order.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <LuReceipt className="h-4 w-4" />
                  <span>Lihat Detail Transaksi</span>
                </Link>
                <Link
                  href="/products"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <LuShoppingBag className="h-4 w-4" />
                  <span>Lanjut Belanja</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Fallback jika order tidak ditemukan / user direct visit */
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
            <p className="text-xs text-gray-600 leading-relaxed">
              Pesanan Anda telah kami terima. Anda dapat memeriksa rincian transaksi belanja, status pembayaran, dan pengiriman barang di daftar pembelian Anda.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/orders"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
              >
                <span>Lihat Daftar Pembelian</span>
                <LuArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span>Lanjut Belanja</span>
              </Link>
            </div>
          </div>
        )}

        {/* Modal Pembayaran jika order ada */}
        {order && (
          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            orderId={order.id}
            invoiceNumber={order.invoiceNumber}
            totalAmount={Number(order.totalAmount)}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </div>
  );
}
