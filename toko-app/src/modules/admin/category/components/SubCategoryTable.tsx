import { DeleteCategoryButton } from './DeleteCategoryButton';
import { Badge } from '@/components/ui/Badge';

export interface SubCategoryItem {
  id: string;
  name: string;
  parentId: string | null;
  parent: { id: string; name: string } | null;
  createdAt: Date;
  _count: {
    products: number;
    children: number;
  };
}

interface SubCategoryTableProps {
  subcategories: SubCategoryItem[];
}

export function SubCategoryTable({ subcategories }: SubCategoryTableProps) {
  // Guard Clause: State kosong jika belum ada data subkategori
  if (!subcategories || subcategories.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg bg-white p-12 text-center">
        <p className="text-sm font-medium text-gray-900">
          Tidak ada subkategori yang ditemukan
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Coba ganti kata kunci pencarian atau pilih kategori induk yang berbeda.
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
              <th className="px-6 py-3.5">Nama Subkategori</th>
              <th className="px-6 py-3.5">Kategori Induk (Parent)</th>
              <th className="px-6 py-3.5 text-center">Total Produk</th>
              <th className="px-6 py-3.5">Tanggal Dibuat</th>
              <th className="px-6 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {subcategories.map((sub) => {
              const hasProducts = sub._count.products > 0;
              const hasChildren = sub._count.children > 0;

              return (
                <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <span>{sub.name}</span>
                  </td>

                  <td className="px-6 py-4">
                    <Badge variant="neutral" size="sm">
                      {sub.parent?.name || 'Tanpa Induk'}
                    </Badge>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`font-mono ${
                        hasProducts ? 'text-gray-900 font-medium' : 'text-gray-400'
                      }`}
                    >
                      {sub._count.products}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {formatDate(sub.createdAt)}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <DeleteCategoryButton
                      categoryId={sub.id}
                      categoryName={sub.name}
                      hasProducts={hasProducts}
                      hasChildren={hasChildren}
                    />
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
