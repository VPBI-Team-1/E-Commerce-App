import {
  BanknotesIcon,
  ShoppingBagIcon,
  CubeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';

export default function AdminDashboardPage() {
  // Data ringkasan (hardcoded sementara sesuai kebutuhan tahap ini)
  const statCards = [
    {
      title: 'Total Penjualan',
      value: 'Rp 48.500.000',
      desc: 'Akumulasi penjualan bulan ini',
      icon: BanknotesIcon,
    },
    {
      title: 'Total Pesanan',
      value: '128',
      desc: 'Pesanan masuk dan selesai',
      icon: ShoppingBagIcon,
    },
    {
      title: 'Produk Aktif',
      value: '22',
      desc: 'Tayang di katalog publik',
      icon: CubeIcon,
    },
    {
      title: 'Total Pelanggan',
      value: '64',
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

      {/* Stats Cards - Minimalist Flat */}
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
    </div>
  );
}
