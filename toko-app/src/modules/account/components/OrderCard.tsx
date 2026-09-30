"use client";

import React from "react";
import Image from "next/image";
import { Order } from "@/modules/account/types/account.types";
import {
  LuPackage,
  LuClock,
  LuCircleCheck,
  LuTruck,
  LuCircleX,
} from "react-icons/lu";

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <LuCircleCheck className="h-3.5 w-3.5" />
            <span>Selesai</span>
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
            <LuTruck className="h-3.5 w-3.5" />
            <span>Dikirim</span>
          </span>
        );
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200">
            <LuCircleCheck className="h-3.5 w-3.5" />
            <span>Dibayar</span>
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 border border-red-200">
            <LuCircleX className="h-3.5 w-3.5" />
            <span>Dibatalkan</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
            <LuClock className="h-3.5 w-3.5" />
            <span>Menunggu Pembayaran</span>
          </span>
        );
    }
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const firstItem = order.items?.[0];
  const remainingCount = (order.items?.length || 0) - 1;
  const imageUrl = firstItem?.variant?.product?.images?.[0]?.url;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300">
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
        <div>{getStatusBadge(order.status)}</div>
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
      <div className="flex items-center justify-end border-t border-gray-100 pt-3">
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-gray-500">Total Belanja:</span>
          <span className="text-base font-bold text-primary">
            {formatPrice(Number(order.totalAmount))}
          </span>
        </div>
      </div>
    </div>
  );
}
