"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { getUserOrders } from "@/app/actions/user";
import {
  LuShoppingBag,
  LuPackage,
  LuClock,
  LuCircleCheck,
  LuTruck,
  LuCircleX,
  LuArrowRight,
} from "react-icons/lu";

interface OrderItem {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  variant?: {
    product?: {
      images?: {
        url: string;
      }[];
    };
  };
}

interface Order {
  id: string;
  invoiceNumber: string;
  status: "PENDING" | "VERIFYING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  totalAmount: number;
  courier: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await getUserOrders();
        if (res.success && res.data) {
          setOrders(res.data as Order[]);
        }
      } catch (err) {
        console.error("Gagal memuat pesanan:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      loadOrders();
    }
  }, [user]);

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

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h1 className="text-xl font-bold text-gray-900">Daftar Pembelian</h1>
        <p className="mt-1 text-sm text-gray-500">
          Pantau status pesanan dan riwayat belanja produk Anda.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-gray-200 p-5 space-y-4"
            >
              <div className="flex justify-between">
                <div className="h-5 w-40 rounded bg-gray-200" />
                <div className="h-5 w-24 rounded bg-gray-200" />
              </div>
              <div className="h-4 w-3/4 rounded bg-gray-100" />
              <div className="h-4 w-1/2 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-primary">
            <LuShoppingBag className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-base font-bold text-gray-900">
            Belum Ada Transaksi Pembelian
          </h2>
          <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
            Semua pesanan yang Anda buat akan muncul di sini. Mulai belanja produk teknologi pilihan Anda sekarang.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 cursor-pointer"
          >
            <span>Mulai Belanja</span>
            <LuArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        /* Order Cards */
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300"
            >
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

              <div className="py-4">
                {(() => {
                  const firstItem = order.items?.[0];
                  const remainingCount = (order.items?.length || 0) - 1;

                  if (!firstItem) return null;

                  const imageUrl =
                    firstItem.variant?.product?.images?.[0]?.url;

                  return (
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
                  );
                })()}
              </div>

              <div className="flex items-center justify-end border-t border-gray-100 pt-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-gray-500">Total Belanja:</span>
                  <span className="text-base font-bold text-primary">
                    {formatPrice(Number(order.totalAmount))}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
