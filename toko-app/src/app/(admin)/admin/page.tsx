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
import { DashboardMonthFilter } from '@/modules/admin/dashboard/components/DashboardMonthFilter';

export const dynamic = 'force-dynamic';

interface AdminDashboardPageProps {
  searchParams?: Promise<{
    month?: string;
  }>;
}

export default async function AdminDashboardPage({
  searchParams,
}: AdminDashboardPageProps) {
  const params = await searchParams;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthNumber = now.getMonth() + 1;
  const defaultMonthStr = `${currentYear}-${String(currentMonthNumber).padStart(2, '0')}`;

  const monthParam = typeof params?.month === 'string' ? params.month.trim() : '';
  const isValidMonth = /^\d{4}-(0[1-9]|1[0-2])$/.test(monthParam);
  const selectedMonth = isValidMonth ? monthParam : defaultMonthStr;

  const [selectedYear, selectedMonthNum] = selectedMonth.split('-').map(Number);

  // Time boundaries for the selected month
  const startOfMonth = new Date(selectedYear, selectedMonthNum - 1, 1, 0, 0, 0, 0);
  const endOfMonth = new Date(selectedYear, selectedMonthNum, 0, 23, 59, 59, 999);
  const daysInMonth = endOfMonth.getDate();

  const monthLabel = new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
  }).format(startOfMonth);

  const [
    salesAggregate,
    totalOrders,
    activeProducts,
    totalCustomers,
    recentOrdersRaw,
    paidOrdersInMonth,
  ] = await Promise.all([
    // Total Penjualan pada bulan yang dipilih
    prisma.order.aggregate({
      where: {
        status: {
          in: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.COMPLETED],
        },
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: {
        totalAmount: true,
      },
    }),
    // Total Pesanan pada bulan yang dipilih (di luar cancelled)
    prisma.order.count({
      where: {
        status: {
          not: OrderStatus.CANCELLED,
        },
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    }),
    // Metrik kesehatan katalog & pelanggan secara umum
    prisma.product.count({
      where: { isArchived: false },
    }),
    prisma.user.count({
      where: { role: 'CUSTOMER' },
    }),
    // 5 pesanan terbaru yang masuk
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
    // Pesanan lunas pada bulan terpilih untuk data harian grafik
    prisma.order.findMany({
      where: {
        status: {
          in: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.COMPLETED],
        },
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
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

  // Build daily sales data for each day of the selected month
  const daysMap = new Map<string, { totalSales: number; orderCount: number; label: string }>();

  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = String(d).padStart(2, '0');
    const monthStr = String(selectedMonthNum).padStart(2, '0');
    const key = `${selectedYear}-${monthStr}-${dayStr}`;
    const label = `${d} ${new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(startOfMonth)}`;

    daysMap.set(key, { totalSales: 0, orderCount: 0, label });
  }

  paidOrdersInMonth.forEach((order) => {
    const d = new Date(order.createdAt);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const key = `${y}-${m}-${day}`;

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
      desc: `Pesanan lunas periode ${monthLabel}`,
      icon: BanknotesIcon,
    },
    {
      title: 'Total Pesanan',
      value: totalOrders.toLocaleString('id-ID'),
      desc: `Pesanan aktif periode ${monthLabel}`,
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
      {/* Header with Month Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Ringkasan Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Selamat datang di panel administrasi ByteStore. Pantau kinerja penjualan dan katalog produk Anda.
          </p>
        </div>

        {/* Month Filter */}
        <DashboardMonthFilter currentMonth={selectedMonth} />
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

      {/* Sales Trend Chart for Selected Month */}
      <SalesChart
        data={salesChartData}
        title={`Tren Penjualan Harian: ${monthLabel}`}
        subtitle={`Pendapatan harian dari pesanan berstatus lunas pada ${monthLabel}`}
      />

      {/* Recent Orders Table */}
      <RecentOrders orders={formattedRecentOrders} />
    </div>
  );
}


