'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { ProductActionMenu } from './ProductActionMenu';
import {
  ChevronUpDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  warrantyInfo: string | null;
  isArchived: boolean;
  category: { id: string; name: string };
  brand: { id: string; name: string };
  images: { url: string; isPrimary: boolean }[];
  variants: {
    id: string;
    name: string;
    price: number;
    stock: number;
  }[];
}

interface ProductTableProps {
  products: ProductItem[];
}

export function ProductTable({ products }: ProductTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSortBy = searchParams.get('sortBy');
  const currentSortOrder = searchParams.get('sortOrder') || 'asc';

  const handleSort = (field: 'price' | 'stock') => {
    const params = new URLSearchParams(searchParams.toString());

    if (currentSortBy === field) {
      if (currentSortOrder === 'asc') {
        params.set('sortOrder', 'desc');
      } else {
        // Toggle off sorting jika sudah desc
        params.delete('sortBy');
        params.delete('sortOrder');
      }
    } else {
      params.set('sortBy', field);
      params.set('sortOrder', 'asc');
    }

    params.set('page', '1');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Guard Clause: Tampilkan state kosong jika tidak ada produk yang cocok
  if (!products || products.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg bg-white p-12 text-center">
        <p className="text-sm font-medium text-gray-900">Tidak ada produk yang ditemukan</p>
        <p className="mt-1 text-xs text-gray-500">
          Coba ganti kata kunci pencarian atau bersihkan filter status.
        </p>
      </div>
    );
  }

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase tracking-wider text-[11px] whitespace-nowrap">
            <tr>
              <th className="px-6 py-3.5">Produk</th>
              <th className="px-6 py-3.5">Kategori</th>
              <th className="px-6 py-3.5">Brand</th>
              <th className="px-6 py-3.5">
                <button
                  type="button"
                  onClick={() => handleSort('price')}
                  className="group inline-flex items-center gap-1.5 font-semibold text-gray-700 hover:text-gray-900 cursor-pointer uppercase tracking-wider text-[11px] select-none whitespace-nowrap"
                  title={`Urutkan berdasarkan harga (${currentSortBy === 'price' && currentSortOrder === 'asc'
                      ? 'Saat ini Terendah -> Klik untuk Tertinggi'
                      : 'Klik untuk Terendah'
                    })`}
                >
                  <span>Harga &amp; Varian</span>
                  {currentSortBy === 'price' ? (
                    currentSortOrder === 'asc' ? (
                      <ChevronUpIcon className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <ChevronDownIcon className="w-3.5 h-3.5 text-primary" />
                    )
                  ) : (
                    <ChevronUpDownIcon className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
                  )}
                </button>
              </th>
              <th className="px-6 py-3.5 text-center">
                <button
                  type="button"
                  onClick={() => handleSort('stock')}
                  className="group inline-flex items-center justify-center gap-1.5 font-semibold text-gray-700 hover:text-gray-900 cursor-pointer uppercase tracking-wider text-[11px] select-none mx-auto whitespace-nowrap"
                  title={`Urutkan berdasarkan stok (${currentSortBy === 'stock' && currentSortOrder === 'asc'
                      ? 'Saat ini Sedikit -> Klik untuk Terbanyak'
                      : 'Klik untuk Tersedikit'
                    })`}
                >
                  <span>Total Stok</span>
                  {currentSortBy === 'stock' ? (
                    currentSortOrder === 'asc' ? (
                      <ChevronUpIcon className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <ChevronDownIcon className="w-3.5 h-3.5 text-primary" />
                    )
                  ) : (
                    <ChevronUpDownIcon className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
                  )}
                </button>
              </th>
              <th className="px-6 py-3.5 text-center">Status</th>
              <th className="px-6 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product, index) => {
              const primaryImage =
                product.images.find((img) => img.isPrimary)?.url ||
                product.images[0]?.url;

              // Hitung total stok dari seluruh varian
              const totalStock = product.variants.reduce(
                (sum, v) => sum + (v.stock || 0),
                0
              );

              // Ambil harga terendah dan tertinggi
              const variantPrices = product.variants.map((v) => Number(v.price));
              const minPrice =
                variantPrices.length > 0 ? Math.min(...variantPrices) : 0;
              const maxPrice =
                variantPrices.length > 0 ? Math.max(...variantPrices) : 0;

              const priceLabel =
                minPrice === maxPrice
                  ? formatIDR(minPrice)
                  : `${formatIDR(minPrice)} - ${formatIDR(maxPrice)}`;

              return (
                <tr
                  key={product.id}
                  className={`hover:bg-gray-50/50 transition-colors ${product.isArchived ? 'bg-gray-50/30' : ''
                    }`}
                >
                  {/* Info Produk (Thumbnail + Nama) */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded border border-gray-200 bg-gray-50 shrink-0 overflow-hidden flex items-center justify-center">
                        {primaryImage ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={primaryImage}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-[10px] text-gray-400">No Pic</span>
                        )}
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <p className="font-semibold text-gray-900 truncate">
                          {product.name}
                        </p>
                        {product.warrantyInfo && (
                          <p className="text-[11px] text-gray-400 truncate">
                            {product.warrantyInfo}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Kategori */}
                  <td className="px-6 py-4 text-gray-700">
                    {product.category?.name || '-'}
                  </td>

                  {/* Brand */}
                  <td className="px-6 py-4 text-gray-700">
                    {product.brand?.name || '-'}
                  </td>

                  {/* Harga & Varian */}
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{priceLabel}</p>
                    <p className="text-[11px] text-gray-400">
                      {product.variants.length} Varian
                    </p>
                  </td>

                  {/* Total Stok */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`font-mono ${totalStock > 0
                          ? 'text-gray-900 font-medium'
                          : 'text-red-600 font-semibold'
                        }`}
                    >
                      {totalStock}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`font-medium ${product.isArchived
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                        }`}
                    >
                      {product.isArchived ? 'Diarsipkan' : 'Aktif'}
                    </span>
                  </td>

                  {/* Aksi Arsipkan / Pulihkan */}
                  <td className="px-6 py-4 text-right">
                    <ProductActionMenu
                      productId={product.id}
                      productName={product.name}
                      isArchived={product.isArchived}
                      openUpwards={index >= products.length - 1 || products.length <= 2}
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
