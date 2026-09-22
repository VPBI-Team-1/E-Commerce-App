import prisma from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { OrderStatusBadge } from '@/modules/admin/order/components/OrderStatusBadge';
import { OrderActionButtons } from '@/modules/admin/order/components/OrderActionButtons';

export const dynamic = 'force-dynamic';

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

interface ShippingAddressData {
  recipientName?: string;
  phone?: string;
  fullAddress?: string;
  city?: string;
  postalCode?: string;
}

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          variant: {
            select: {
              id: true,
              name: true,
              price: true,
              stock: true,
              product: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const shipping = (order.shippingAddress as ShippingAddressData) || {};

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
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Navigation & Header */}
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors mb-3"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Pesanan</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
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
          <div className="border border-gray-200 rounded-lg bg-white p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">
              Informasi Pengiriman &amp; Penerima
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-500 block">Penerima</span>
                <span className="font-semibold text-gray-900 block mt-0.5">
                  {shipping.recipientName || order.user.name}
                </span>
                <span className="text-gray-600 block mt-0.5">
                  {shipping.phone || 'Nomor telepon tidak dicantumkan'}
                </span>
                <span className="text-gray-400 block mt-0.5">
                  Akun: {order.user.email}
                </span>
              </div>

              <div>
                <span className="text-gray-500 block">Alamat Tujuan</span>
                <p className="text-gray-800 font-medium mt-0.5 leading-relaxed">
                  {shipping.fullAddress || 'Alamat tidak tersedia'}
                </p>
                {(shipping.city || shipping.postalCode) && (
                  <p className="text-gray-500 mt-0.5">
                    {[shipping.city, shipping.postalCode].filter(Boolean).join(', ')}
                  </p>
                )}
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
                  <span className="text-gray-500 block">Estimasi Waktu Tiba (ETA)</span>
                  <span className="font-semibold text-gray-900 block mt-0.5">
                    {formatDate(order.eta)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Ordered Items Table Card */}
          <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-200 bg-gray-50/50">
              <h2 className="text-sm font-semibold text-gray-900">
                Rincian Barang yang Dibeli
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3">Produk &amp; Varian</th>
                    <th className="px-5 py-3 text-right">Harga Satuan</th>
                    <th className="px-5 py-3 text-center">Jumlah</th>
                    <th className="px-5 py-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-gray-900">
                          {item.productName}
                        </div>
                        {item.variant && (
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            Varian: {item.variant.name}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right font-medium text-gray-700">
                        {formatIDR(Number(item.price))}
                      </td>
                      <td className="px-5 py-3.5 text-center font-medium text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-gray-900">
                        {formatIDR(Number(item.subtotal))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Order Summary & Actions */}
        <div className="space-y-6">
          {/* Action Card */}
          <div className="border border-gray-200 rounded-lg bg-white p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">
              Tindakan Operasional
            </h2>
            <OrderActionButtons
              orderId={order.id}
              status={order.status}
              invoiceNumber={order.invoiceNumber}
            />
          </div>

          {/* Payment Summary Card */}
          <div className="border border-gray-200 rounded-lg bg-white p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">
              Ringkasan Pembayaran
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span>Subtotal Produk</span>
                <span className="font-medium text-gray-900">
                  {formatIDR(Number(order.totalAmount))}
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
                  {formatIDR(Number(order.totalAmount))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
