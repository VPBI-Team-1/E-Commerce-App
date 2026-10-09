import Link from 'next/link';
import { OrderStatus } from '@prisma/client';
import { OrderStatusBadge } from './OrderStatusBadge';

export interface OrderListItem {
  id: string;
  invoiceNumber: string;
  status: OrderStatus;
  totalAmount: number;
  courier: string;
  trackingNumber: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    items: number;
  };
}

interface OrderTableProps {
  orders: OrderListItem[];
}

export function OrderTable({ orders }: OrderTableProps) {
  if (!orders || orders.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg bg-white p-12 text-center">
        <p className="text-sm font-medium text-gray-900">Tidak ada pesanan yang ditemukan</p>
        <p className="mt-1 text-xs text-gray-500">
          Coba bersihkan filter status atau gunakan kata kunci pencarian lain.
        </p>
      </div>
    );
  }

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase tracking-wider text-[11px] whitespace-nowrap">
            <tr>
              <th className="px-6 py-3.5">Invoice</th>
              <th className="px-6 py-3.5">Tanggal</th>
              <th className="px-6 py-3.5">Pelanggan</th>
              <th className="px-6 py-3.5">Kurir</th>
              <th className="px-6 py-3.5">Total Tagihan</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                {/* Invoice */}
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-900">{order.invoiceNumber}</span>
                </td>

                {/* Tanggal */}
                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                  {formatDate(order.createdAt)}
                </td>

                {/* Customer */}
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{order.user.name}</div>
                </td>

                {/* Courier */}
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-800">{order.courier}</span>
                  {order.trackingNumber && (
                    <div className="text-[11px] font-mono text-gray-500 mt-0.5">
                      {order.trackingNumber}
                    </div>
                  )}
                </td>

                {/* Total */}
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">
                    {formatIDR(order.totalAmount)}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    {order._count.items} item produk
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <OrderStatusBadge status={order.status} size="sm" />
                </td>

                {/* Action Link */}
                <td className="px-6 py-4 text-right">
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
