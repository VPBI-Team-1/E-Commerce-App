import prisma from '@/lib/prisma';
import { ProductSearch } from '@/modules/admin/product/components/ProductSearch';
import { ProductTable } from '@/modules/admin/product/components/ProductTable';
import { ProductPagination } from '@/modules/admin/product/components/ProductPagination';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

interface AdminProductsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const params = await searchParams;

  const search = typeof params?.search === 'string' ? params.search.trim() : '';
  const status = typeof params?.status === 'string' ? params.status : 'all';
  const pageNumber = typeof params?.page === 'string' ? Math.max(1, parseInt(params.page, 10)) : 1;
  const pageSize = 8;

  // Bangun filter kondisi pencarian Prisma
  const where: Prisma.ProductWhereInput = {};

  if (search) {
    where.name = {
      contains: search,
      mode: 'insensitive',
    };
  }

  if (status === 'active') {
    where.isArchived = false;
  } else if (status === 'archived') {
    where.isArchived = true;
  }

  // Ambil total count dan data produk secara paralel
  const [totalCount, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      include: {
        category: {
          select: { id: true, name: true },
        },
        brand: {
          select: { id: true, name: true },
        },
        images: {
          select: { url: true, isPrimary: true },
          orderBy: { isPrimary: 'desc' },
        },
        variants: {
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Katalog Produk
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Pantau inventaris, varian stok barang, dan status arsip katalog toko.
          </p>
        </div>

        {/* Counter Info */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded border border-gray-200 bg-white text-gray-600 font-medium">
            Total Ditemukan: <strong className="text-gray-900 font-semibold">{totalCount}</strong>
          </span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <ProductSearch initialSearch={search} initialStatus={status} />

      {/* Tabel Produk */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <ProductTable products={products} />
        <ProductPagination
          currentPage={pageNumber}
          totalPages={totalPages}
          totalItems={totalCount}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}
