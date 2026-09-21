import { ProductActionMenu } from './ProductActionMenu';
import { Badge } from '@/components/ui/Badge';

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
    price: any;
    stock: number;
  }[];
}

interface ProductTableProps {
  products: ProductItem[];
}

export function ProductTable({ products }: ProductTableProps) {
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
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-6 py-3.5">Produk</th>
              <th className="px-6 py-3.5">Kategori</th>
              <th className="px-6 py-3.5">Brand</th>
              <th className="px-6 py-3.5">Harga &amp; Varian</th>
              <th className="px-6 py-3.5 text-center">Total Stok</th>
              <th className="px-6 py-3.5 text-center">Status</th>
              <th className="px-6 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => {
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
                  className={`hover:bg-gray-50/50 transition-colors ${
                    product.isArchived ? 'bg-gray-50/30' : ''
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
                      className={`font-mono ${
                        totalStock > 0
                          ? 'text-gray-900 font-medium'
                          : 'text-red-600 font-semibold'
                      }`}
                    >
                      {totalStock}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4 text-center">
                    {product.isArchived ? (
                      <Badge variant="warning" size="sm">
                        Diarsipkan
                      </Badge>
                    ) : (
                      <Badge variant="success" size="sm">
                        Aktif
                      </Badge>
                    )}
                  </td>

                  {/* Aksi Arsipkan / Pulihkan */}
                  <td className="px-6 py-4 text-right">
                    <ProductActionMenu
                      productId={product.id}
                      productName={product.name}
                      isArchived={product.isArchived}
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
