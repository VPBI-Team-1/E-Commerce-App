import { ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function AdminOrdersPlaceholderPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Manajemen Pesanan
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Daftar riwayat transaksi dan pengelolaan verifikasi pesanan.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
          <ShoppingBagIcon className="w-6 h-6" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-gray-900">
          Modul Pesanan Belum Tersedia
        </h3>
        <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
          Fungsionalitas manajemen pesanan, verifikasi pembayaran manual, dan integrasi kurir pengiriman akan diimplementasikan pada Tahap 4 &amp; 5.
        </p>
      </div>
    </div>
  );
}
