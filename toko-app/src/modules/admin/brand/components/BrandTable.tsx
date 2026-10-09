import { DeleteBrandButton } from './DeleteBrandButton';
import { EditBrandButton } from './EditBrandButton';

export interface BrandItem {
  id: string;
  name: string;
  createdAt: Date;
  _count: {
    products: number;
  };
}

interface BrandTableProps {
  brands: BrandItem[];
}

export function BrandTable({ brands }: BrandTableProps) {
  // Guard Clause: State kosong jika belum ada data brand
  if (!brands || brands.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg bg-white p-12 text-center">
        <p className="text-sm font-medium text-gray-900">
          Tidak ada brand yang ditemukan
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Coba ganti kata kunci pencarian atau tambahkan data brand baru.
        </p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-6 py-3.5">Nama Brand</th>
              <th className="px-6 py-3.5 text-center">Total Produk Terkait</th>
              <th className="px-6 py-3.5">Tanggal Dibuat</th>
              <th className="px-6 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {brands.map((brand) => {
              const hasProducts = brand._count.products > 0;

              return (
                <tr key={brand.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Nama Brand */}
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <span>{brand.name}</span>
                  </td>

                  {/* Total Produk */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`font-mono ${
                        hasProducts ? 'text-gray-900 font-medium' : 'text-gray-400'
                      }`}
                    >
                      {brand._count.products}
                    </span>
                  </td>

                  {/* Tanggal Dibuat */}
                  <td className="px-6 py-4 text-gray-500">
                    {formatDate(brand.createdAt)}
                  </td>

                  {/* Aksi */}
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      {/* Tombol Edit */}
                      <EditBrandButton
                        brand={{
                          id: brand.id,
                          name: brand.name,
                        }}
                      />

                      {/* Tombol Hapus dengan Guard Clause */}
                      <DeleteBrandButton
                        brandId={brand.id}
                        brandName={brand.name}
                        hasProducts={hasProducts}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
