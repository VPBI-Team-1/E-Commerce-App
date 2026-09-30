"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getUserOrders } from "@/modules/account/actions/account.actions";
import { Order } from "@/modules/account/types/account.types";
import OrderCard from "@/modules/account/components/OrderCard";
import {
  LuShoppingBag,
  LuArrowRight,
} from "react-icons/lu";

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
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
