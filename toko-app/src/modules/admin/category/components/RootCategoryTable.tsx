import { DeleteCategoryButton } from './DeleteCategoryButton';
import { EditCategoryButton } from './EditCategoryButton';
import { CategoryOption } from './CategoryFormModal';

export interface RootCategoryItem {
  id: string;
  name: string;
  createdAt: Date;
  _count: {
    children: number;
    products: number;
  };
}

interface RootCategoryTableProps {
  categories: RootCategoryItem[];
  parentOptions?: CategoryOption[];
}

export function RootCategoryTable({
  categories,
  parentOptions,
}: RootCategoryTableProps) {
  // Guard Clause: State kosong jika belum ada data kategori utama
  if (!categories || categories.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg bg-white p-12 text-center">
        <p className="text-sm font-medium text-gray-900">
          Belum ada Kategori Utama terdaftar
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Kategori utama tingkat atas (root) yang ditambahkan akan tampil di sini.
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
              <th className="px-6 py-3.5">Nama Kategori Utama</th>
              <th className="px-6 py-3.5 text-center">Subkategori</th>
              <th className="px-6 py-3.5 text-center">Produk Langsung</th>
              <th className="px-6 py-3.5">Tanggal Dibuat</th>
              <th className="px-6 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((cat) => {
              const hasChildren = cat._count.children > 0;
              const hasProducts = cat._count.products > 0;

              return (
                <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <span>{cat.name}</span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`font-mono ${
                        hasChildren ? 'text-gray-900 font-medium' : 'text-gray-400'
                      }`}
                    >
                      {cat._count.children}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`font-mono ${
                        hasProducts ? 'text-gray-900 font-medium' : 'text-gray-400'
                      }`}
                    >
                      {cat._count.products}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {formatDate(cat.createdAt)}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      <EditCategoryButton
                        category={{
                          id: cat.id,
                          name: cat.name,
                          parentId: null,
                          hasChildren,
                        }}
                        parentOptions={parentOptions || categories.map((c) => ({ id: c.id, name: c.name }))}
                      />
                      <DeleteCategoryButton
                        categoryId={cat.id}
                        categoryName={cat.name}
                        hasProducts={hasProducts}
                        hasChildren={hasChildren}
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
