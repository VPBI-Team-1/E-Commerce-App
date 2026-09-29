import prisma from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';
import {
  BanknotesIcon,
  ShoppingBagIcon,
  CubeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { SalesChart, DailySalesData } from '@/modules/admin/dashboard/components/SalesChart';
import { RecentOrders, RecentOrderItem } from '@/modules/admin/dashboard/components/RecentOrders';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [
    salesAggregate,
    totalOrders,
    activeProducts,
    totalCustomers,
    recentOrdersRaw,
    paidOrdersLast7Days,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: {
        status: {
          in: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.COMPLETED],
        },
      },
      _sum: {
        totalAmount: true,
      },
    }),
    prisma.order.count({
      where: {
        status: {
          not: OrderStatus.CANCELLED,
        },
      },
    }),
    prisma.product.count({
      where: { isArchived: false },
    }),
    prisma.user.count({
      where: { role: 'CUSTOMER' },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
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
    prisma.order.findMany({
      where: {
        status: {
          in: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.COMPLETED],
        },
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        totalAmount: true,
        createdAt: true,
      },
    }),
  ]);

  const totalSalesAmount = salesAggregate._sum.totalAmount
    ? Number(salesAggregate._sum.totalAmount)
    : 0;

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Build daily sales data for the last 7 days
  const daysMap = new Map<string, { totalSales: number; orderCount: number; label: string }>();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
    }).format(d);

    daysMap.set(key, { totalSales: 0, orderCount: 0, label });
  }

  paidOrdersLast7Days.forEach((order) => {
    const key = new Date(order.createdAt).toISOString().slice(0, 10);
    if (daysMap.has(key)) {
      const existing = daysMap.get(key)!;
      existing.totalSales += Number(order.totalAmount);
      existing.orderCount += 1;
    }
  });

  const salesChartData: DailySalesData[] = Array.from(daysMap.entries()).map(
    ([rawDate, val]) => ({
      rawDate,
      date: val.label,
      totalSales: val.totalSales,
      orderCount: val.orderCount,
    })
  );

  const formattedRecentOrders: RecentOrderItem[] = recentOrdersRaw.map((o) => ({
    id: o.id,
    invoiceNumber: o.invoiceNumber,
    status: o.status,
    totalAmount: Number(o.totalAmount),
    createdAt: o.createdAt,
    user: o.user,
    itemCount: o._count.items,
  }));

  const statCards = [
    {
      title: 'Total Penjualan',
      value: formatIDR(totalSalesAmount),
      desc: 'Pesanan lunas, dikirim, dan selesai',
      icon: BanknotesIcon,
    },
    {
      title: 'Total Pesanan',
      value: totalOrders.toLocaleString('id-ID'),
      desc: 'Pesanan menunggu bayar, verifikasi, lunas, dikirim, dan selesai',
      icon: ShoppingBagIcon,
    },
    {
      title: 'Produk Aktif',
      value: activeProducts.toLocaleString('id-ID'),
      desc: 'Tayang di katalog publik',
      icon: CubeIcon,
    },
    {
      title: 'Total Pelanggan',
      value: totalCustomers.toLocaleString('id-ID'),
      desc: 'Pengguna terdaftar aktif',
      icon: UsersIcon,
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Ringkasan Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Selamat datang di panel administrasi ByteStore. Pantau kinerja penjualan dan katalog produk Anda.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white border border-gray-200 rounded-lg p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">
                  {stat.title}
                </span>
                <Icon className="w-5 h-5 text-gray-400" />
              </div>
              <p className="mt-3 text-2xl font-bold text-gray-900">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-gray-400">{stat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Sales Trend Chart */}
      <SalesChart data={salesChartData} />

      {/* Recent Orders Table */}
      <RecentOrders orders={formattedRecentOrders} />
    </div>
  );
}

