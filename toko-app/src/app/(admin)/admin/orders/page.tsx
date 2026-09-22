import prisma from '@/lib/prisma';
import { Prisma, OrderStatus } from '@prisma/client';
import { OrderTable, OrderListItem } from '@/modules/admin/order/components/OrderTable';
import { OrderStatusFilter } from '@/modules/admin/order/components/OrderStatusFilter';
import { OrderSearch } from '@/modules/admin/order/components/OrderSearch';
import { OrderPagination } from '@/modules/admin/order/components/OrderPagination';

export const dynamic = 'force-dynamic';

interface AdminOrdersPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const params = await searchParams;

  const search = typeof params?.search === 'string' ? params.search.trim() : '';
  const statusParam = typeof params?.status === 'string' ? params.status.trim() : '';
  const pageNumber =
    typeof params?.page === 'string' ? Math.max(1, parseInt(params.page, 10)) : 1;
  const pageSize = 10;

  const where: Prisma.OrderWhereInput = {};

  if (search) {
    where.OR = [
      { invoiceNumber: { contains: search, mode: 'insensitive' } },
      { user: { name: { contains: search, mode: 'insensitive' } } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
    ];
  }

  if (statusParam && Object.values(OrderStatus).includes(statusParam as OrderStatus)) {
    where.status = statusParam as OrderStatus;
  }

  const [totalOrders, ordersRaw] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
    }),
  ]);

  const orders: OrderListItem[] = ordersRaw.map((o) => ({
    id: o.id,
    invoiceNumber: o.invoiceNumber,
    status: o.status,
    totalAmount: Number(o.totalAmount),
    courier: o.courier,
    trackingNumber: o.trackingNumber,
    createdAt: o.createdAt,
    user: o.user,
    _count: o._count,
  }));

  const totalPages = Math.ceil(totalOrders / pageSize);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Manajemen Pesanan
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Pantau daftar transaksi, verifikasi pembayaran manual, dan kelola pengiriman barang.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <OrderStatusFilter />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <OrderSearch initialSearch={search} />
          <div className="text-xs text-gray-500">
            Total <span className="font-semibold text-gray-900">{totalOrders}</span> pesanan
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="space-y-4">
        <OrderTable orders={orders} />
        <OrderPagination
          currentPage={pageNumber}
          totalPages={totalPages}
          totalItems={totalOrders}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}
