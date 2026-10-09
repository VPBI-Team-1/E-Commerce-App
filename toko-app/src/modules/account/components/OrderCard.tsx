"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Order } from "@/modules/account/types/account.types";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import PaymentModal from "@/modules/account/components/PaymentModal";
import {
  LuPackage,
  LuCreditCard,
  LuArrowRight,
} from "react-icons/lu";

interface OrderCardProps {
  order: Order;
  onOrderUpdate?: () => void;
}

export default function OrderCard({ order: initialOrder, onOrderUpdate }: OrderCardProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order>(initialOrder);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handlePaymentSuccess = () => {
    setOrder((prev) => ({
      ...prev,
      status: "VERIFYING",
    }));
    if (onOrderUpdate) {
      onOrderUpdate();
    }
    router.refresh();
  };

  const firstItem = order.items?.[0];
  const remainingCount = (order.items?.length || 0) - 1;
  const imageUrl = firstItem?.variant?.product?.images?.[0]?.url;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 shadow-2xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3 text-xs text-gray-500">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-gray-900">
            {order.invoiceNumber}
          </span>
          <span>•</span>
          <span>
            {new Date(order.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <div>
          <OrderStatusBadge status={order.status} size="sm" />
        </div>
      </div>

      {/* Item info */}
      <div className="py-4">
        {firstItem && (
          <div className="flex items-start gap-3.5">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 text-gray-500">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={firstItem.productName}
                  fill
                  sizes="56px"
                  className="object-contain p-1"
                  unoptimized={
                    !imageUrl.includes("m.media-amazon.com") &&
                    !imageUrl.startsWith("/")
                  }
                />
              ) : (
                <LuPackage className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {firstItem.productName}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {firstItem.quantity} barang x {formatPrice(Number(firstItem.price))}
              </p>
              {remainingCount > 0 && (
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  +{remainingCount} produk lainnya
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-100 pt-3">
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-gray-500">Total Belanja:</span>
          <span className="text-base font-bold text-primary">
            {formatPrice(Number(order.totalAmount))}
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {order.status === "PENDING" && (
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <LuCreditCard className="h-3.5 w-3.5" />
              <span>Bayar</span>
            </button>
          )}

          <Link
            href={`/orders/${order.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <span>Lihat Detail Transaksi</span>
            <LuArrowRight className="h-3.5 w-3.5" />
          </Link>
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
    </div>
  );
}

