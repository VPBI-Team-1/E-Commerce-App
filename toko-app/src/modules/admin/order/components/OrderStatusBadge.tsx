import { OrderStatus } from '@prisma/client';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[11px] font-medium'
      : 'px-2.5 py-1 text-xs font-medium';

  switch (status) {
    case OrderStatus.PENDING:
      return (
        <span
          className={`inline-flex items-center rounded border border-gray-200 bg-gray-50 text-gray-700 ${sizeClasses}`}
        >
          Menunggu Pembayaran
        </span>
      );
    case OrderStatus.VERIFYING:
      return (
        <span
          className={`inline-flex items-center rounded border border-amber-200 bg-amber-50 text-amber-800 ${sizeClasses}`}
        >
          Menunggu Verifikasi
        </span>
      );
    case OrderStatus.PAID:
      return (
        <span
          className={`inline-flex items-center rounded border border-blue-200 bg-blue-50 text-blue-800 ${sizeClasses}`}
        >
          Lunas / Siap Kirim
        </span>
      );
    case OrderStatus.SHIPPED:
      return (
        <span
          className={`inline-flex items-center rounded border border-indigo-200 bg-indigo-50 text-indigo-800 ${sizeClasses}`}
        >
          Sedang Dikirim
        </span>
      );
    case OrderStatus.COMPLETED:
      return (
        <span
          className={`inline-flex items-center rounded border border-emerald-200 bg-emerald-50 text-emerald-800 ${sizeClasses}`}
        >
          Selesai
        </span>
      );
    case OrderStatus.CANCELLED:
      return (
        <span
          className={`inline-flex items-center rounded border border-rose-200 bg-rose-50 text-rose-700 ${sizeClasses}`}
        >
          Dibatalkan
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center rounded border border-gray-200 bg-gray-50 text-gray-700 ${sizeClasses}`}
        >
          {status}
        </span>
      );
  }
}
