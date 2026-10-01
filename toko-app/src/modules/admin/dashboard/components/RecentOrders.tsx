import React from 'react';
import Link from 'next/link';
import { OrderStatus } from '@prisma/client';
import { OrderStatusBadge } from '@/modules/admin/order/components/OrderStatusBadge';
import { ShoppingBagIcon, ChevronRightIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export interface RecentOrderItem {
  id: string;
  invoiceNumber: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date | string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  itemCount: number;
}

interface RecentOrdersProps {
  orders?: RecentOrderItem[];
  isLoading?: boolean;
  error?: string | null;
}

const formatIDR = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val);
};

const formatDate = (dateInput: Date | string) => {
  const d = new Date(dateInput);
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

export function RecentOrders({ orders = [], isLoading = false, error = null }: RecentOrdersProps) {
  // State 1: Loading State
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="space-y-2">
            <div className="h-5 w-36 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-52 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="h-7 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="mt-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // State 2: Error State
  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-rose-50 text-rose-600 mb-3">
          <ExclamationTriangleIcon className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">Gagal Memuat Pesanan Terbaru</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">{error}</p>
      </div>
    );
  }

  // State 3: Empty State
  if (orders.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-400 mb-3">
          <ShoppingBagIcon className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">Belum Ada Pesanan Masuk</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
          Daftar transaksi pesanan dari pelanggan akan ditampilkan di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-200">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Pesanan Terbaru</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            5 transaksi pesanan terakhir yang masuk ke toko
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Lihat Semua Pesanan
          <ChevronRightIcon className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase tracking-wider text-[11px] whitespace-nowrap">
            <tr>
              <th className="px-5 py-3.5">Invoice</th>
              <th className="px-5 py-3.5">Tanggal</th>
              <th className="px-5 py-3.5">Pelanggan</th>
              <th className="px-5 py-3.5">Total Tagihan</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">
                  {order.invoiceNumber}
                </td>
                <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{order.user.name}</div>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="font-semibold text-gray-900">
                    {formatIDR(order.totalAmount)}
                  </div>
                  <div className="text-[11px] text-gray-400">
                    {order.itemCount} item
                  </div>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <OrderStatusBadge status={order.status} size="sm" />
                </td>
                <td className="px-5 py-4 text-right whitespace-nowrap">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="inline-flex items-center justify-center rounded border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-colors"
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
