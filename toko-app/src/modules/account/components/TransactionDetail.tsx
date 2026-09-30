"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LuArrowLeft,
  LuPackage,
  LuCreditCard,
  LuClock,
  LuCircleCheck,
  LuTruck,
  LuCircleX,
  LuCircleAlert,
} from "react-icons/lu";
import { Order, ShippingAddressData } from "@/modules/account/types/account.types";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import PaymentModal from "@/modules/account/components/PaymentModal";
import { Modal } from "@/components/ui/Modal";
import {
  cancelUserOrder,
  completeUserOrder,
} from "@/modules/account/actions/account.actions";

interface TransactionDetailProps {
  initialOrder: Order;
}

export default function TransactionDetail({
  initialOrder,
}: TransactionDetailProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order>(initialOrder);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateString: string | Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const handlePaymentSuccess = () => {
    setOrder((prev) => ({
      ...prev,
      status: "VERIFYING",
    }));
    router.refresh();
  };

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    setActionError(null);
    try {
      const res = await cancelUserOrder(order.id);
      if (res.success) {
        setOrder((prev) => ({
          ...prev,
          status: "CANCELLED",
        }));
        setIsCancelModalOpen(false);
        router.refresh();
      } else {
        setActionError(res.message || "Gagal membatalkan pesanan.");
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
      setActionError("Terjadi kesalahan sistem saat membatalkan pesanan.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCompleteOrder = async () => {
    setIsCompleting(true);
    setActionError(null);
    try {
      const res = await completeUserOrder(order.id);
      if (res.success) {
        setOrder((prev) => ({
          ...prev,
          status: "COMPLETED",
        }));
        setIsCompleteModalOpen(false);
        router.refresh();
      } else {
        setActionError(res.message || "Gagal menyelesaikan pesanan.");
      }
    } catch (err) {
      console.error("Error completing order:", err);
      setActionError("Terjadi kesalahan sistem saat menyelesaikan pesanan.");
    } finally {
      setIsCompleting(false);
    }
  };

  const shipping = (order.shippingAddress as ShippingAddressData) || {};

  return (
    <div className="space-y-6">
      {/* Navigation & Header */}
      <div>
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors mb-3"
        >
          <LuArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Pesanan</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                {order.invoiceNumber}
              </h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Dibuat pada {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Details & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping and Customer Card */}
          <div className="border border-gray-200 rounded-2xl bg-white p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">
              Informasi Pengiriman &amp; Penerima
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-500 block">Penerima</span>
                <span className="font-semibold text-gray-900 block mt-0.5">
                  {order.user?.name || shipping.recipientName || "Pelanggan ByteStore"}
                </span>
                {shipping.phone && (
                  <span className="text-gray-600 block mt-0.5">
                    {shipping.phone}
                  </span>
                )}
                {order.user?.email && (
                  <span className="text-gray-500 block mt-0.5">
                    {order.user.email}
                  </span>
                )}
              </div>

              <div>
                <span className="text-gray-500 block">Alamat Tujuan</span>
                <p className="text-gray-800 font-medium mt-0.5 leading-relaxed">
                  {shipping.fullAddress ||
                    (typeof order.shippingAddress === "string"
                      ? order.shippingAddress
                      : ((order.shippingAddress as Record<string, unknown>)?.address as string)) ||
                    "Alamat tidak tersedia"}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-gray-500 block">Metode Pengiriman</span>
                <span className="font-semibold text-gray-900 block mt-0.5">
                  {order.courier}
                </span>
                <span className="text-emerald-700 font-medium block text-[11px]">
                  Gratis Ongkir (Rp 0)
                </span>
              </div>

              {order.trackingNumber && (
                <div>
                  <span className="text-gray-500 block">Nomor Resi</span>
                  <span className="font-mono font-semibold text-gray-900 block mt-0.5">
                    {order.trackingNumber}
                  </span>
                </div>
              )}

              {order.eta && (
                <div>
                  <span className="text-gray-500 block">Estimasi Tiba (ETA)</span>
                  <span className="font-semibold text-gray-900 block mt-0.5">
                    {formatDate(order.eta)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Ordered Items Table Card */}
          <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-200 bg-gray-50/50">
              <h2 className="text-sm font-semibold text-gray-900">
                Rincian Barang yang Dibeli
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3">Produk</th>
                    <th className="px-5 py-3 text-right">Harga Satuan</th>
                    <th className="px-5 py-3 text-center">Jumlah</th>
                    <th className="px-5 py-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item) => {
                    const itemImage = item.variant?.product?.images?.[0]?.url;
                    return (
                      <tr key={item.id} className="hover:bg-gray-50/50">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-50 text-gray-500">
                              {itemImage ? (
                                <Image
                                  src={itemImage}
                                  alt={item.productName}
                                  fill
                                  sizes="44px"
                                  className="object-contain p-1"
                                  unoptimized={
                                    !itemImage.includes("m.media-amazon.com") &&
                                    !itemImage.startsWith("/")
                                  }
                                />
                              ) : (
                                <LuPackage className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {item.productName}
                              </div>
                              {item.variant && item.variant.name && (
                                <div className="text-[11px] text-gray-500 mt-0.5">
                                  Varian: {item.variant.name}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right font-medium text-gray-700 whitespace-nowrap">
                          {formatPrice(Number(item.price))}
                        </td>
                        <td className="px-5 py-3.5 text-center font-medium text-gray-900 whitespace-nowrap">
                          {item.quantity}
                        </td>
                        <td className="px-5 py-3.5 text-right font-semibold text-gray-900 whitespace-nowrap">
                          {formatPrice(Number(item.subtotal))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Order Summary & Actions */}
        <div className="space-y-6">
          {/* Action Card */}
          <div className="border border-gray-200 rounded-2xl bg-white p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">
              Status &amp; Tindakan
            </h2>

            {order.status === "PENDING" && (
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
                  <LuClock className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                  <p className="leading-relaxed">
                    Pesanan Anda menunggu pembayaran. Silakan lakukan pembayaran via Virtual Account.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <LuCreditCard className="h-4 w-4" />
                  <span>Bayar Sekarang</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActionError(null);
                    setIsCancelModalOpen(true);
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors cursor-pointer"
                >
                  <LuCircleX className="h-4 w-4" />
                  <span>Batalkan Pesanan</span>
                </button>
              </div>
            )}

            {order.status === "VERIFYING" && (
              <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
                <LuClock className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                <p className="leading-relaxed">
                  Bukti pembayaran sedang diverifikasi oleh admin. Kami akan segera memperbarui status pesanan Anda.
                </p>
              </div>
            )}

            {order.status === "PAID" && (
              <div className="flex items-start gap-2.5 rounded-xl bg-blue-50 p-3 text-xs text-blue-800 border border-blue-200">
                <LuCircleCheck className="h-4 w-4 shrink-0 mt-0.5 text-blue-600" />
                <p className="leading-relaxed">
                  Pembayaran berhasil dikonfirmasi. Pesanan sedang disiapkan untuk dikirim.
                </p>
              </div>
            )}

            {order.status === "SHIPPED" && (
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 rounded-xl bg-indigo-50 p-3 text-xs text-indigo-800 border border-indigo-200">
                  <LuTruck className="h-4 w-4 shrink-0 mt-0.5 text-indigo-600" />
                  <p className="leading-relaxed">
                    Pesanan sedang dalam proses pengiriman kurir ke alamat tujuan Anda.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActionError(null);
                    setIsCompleteModalOpen(true);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  <LuCircleCheck className="h-4 w-4" />
                  <span>Selesaikan Pesanan</span>
                </button>
              </div>
            )}

            {order.status === "COMPLETED" && (
              <div className="flex items-start gap-2.5 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200">
                <LuCircleCheck className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
                <p className="leading-relaxed">
                  Pesanan telah selesai dan diterima dengan baik. Terima kasih telah berbelanja di ByteStore!
                </p>
              </div>
            )}

            {order.status === "CANCELLED" && (
              <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 p-3 text-xs text-rose-800 border border-rose-200">
                <LuCircleX className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
                <p className="leading-relaxed">
                  Pesanan ini telah dibatalkan.
                </p>
              </div>
            )}
          </div>

          {/* Payment Summary Card */}
          <div className="border border-gray-200 rounded-2xl bg-white p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">
              Ringkasan Pembayaran
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span>Subtotal Produk</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(Number(order.totalAmount))}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Biaya Pengiriman</span>
                <span className="font-medium text-emerald-700">
                  Gratis (Rp 0)
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-900">Total Tagihan</span>
                <span className="font-bold text-gray-900">
                  {formatPrice(Number(order.totalAmount))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        orderId={order.id}
        invoiceNumber={order.invoiceNumber}
        totalAmount={Number(order.totalAmount)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Modal Batalkan Pesanan */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Batalkan Pesanan"
        description="Apakah Anda yakin ingin membatalkan pesanan ini? Pesanan yang dibatalkan tidak dapat diproses kembali dan stok produk akan dikembalikan."
        confirmText="Ya, Batalkan Pesanan"
        cancelText="Kembali"
        confirmVariant="danger"
        onConfirm={handleCancelOrder}
        isLoading={isCancelling}
      >
        {actionError && (
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 p-2.5 text-xs text-red-700 border border-red-200">
            <LuCircleAlert className="h-4 w-4 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}
      </Modal>

      {/* Modal Selesaikan Pesanan */}
      <Modal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        title="Konfirmasi Pesanan Selesai"
        description="Pastikan barang pesanan telah Anda terima dengan baik dan lengkap. Setelah diselesaikan, status pesanan akan menjadi Selesai."
        confirmText="Ya, Pesanan Diterima"
        cancelText="Kembali"
        confirmVariant="primary"
        onConfirm={handleCompleteOrder}
        isLoading={isCompleting}
      >
        {actionError && (
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 p-2.5 text-xs text-red-700 border border-red-200">
            <LuCircleAlert className="h-4 w-4 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}
      </Modal>
    </div>
  );
}
