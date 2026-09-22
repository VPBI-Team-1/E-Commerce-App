import prisma from '@/lib/prisma';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { ProductSearch } from '@/modules/admin/product/components/ProductSearch';
import { ProductTable, ProductItem } from '@/modules/admin/product/components/ProductTable';
import { ProductPagination } from '@/modules/admin/product/components/ProductPagination';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

interface AdminProductsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
    sortBy?: string;
    sortOrder?: string;
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
  const sortBy = typeof params?.sortBy === 'string' ? params.sortBy : undefined;
  const sortOrder = params?.sortOrder === 'desc' ? 'desc' : 'asc';

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

  const includeConfig = {
    category: {
      select: { id: true, name: true },
    },
    brand: {
      select: { id: true, name: true },
    },
    images: {
      select: { url: true, isPrimary: true },
      orderBy: { isPrimary: 'desc' as const },
    },
    variants: {
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
      },
    },
  };

  type ProductWithRelations = Prisma.ProductGetPayload<{
    include: typeof includeConfig;
  }>;

  let totalCount = 0;
  let rawProducts: ProductWithRelations[] = [];

  if (sortBy === 'price' || sortBy === 'stock') {
    // Ambil seluruh produk yang memenuhi filter untuk diurutkan berdasarkan agregat varian
    const allMatching = await prisma.product.findMany({
      where,
      include: includeConfig,
    });

    totalCount = allMatching.length;

    allMatching.sort((a, b) => {
      if (sortBy === 'price') {
        const pricesA = a.variants.map((v) => Number(v.price));
        const pricesB = b.variants.map((v) => Number(v.price));
        const minA = pricesA.length > 0 ? Math.min(...pricesA) : 0;
        const minB = pricesB.length > 0 ? Math.min(...pricesB) : 0;
        return sortOrder === 'asc' ? minA - minB : minB - minA;
      } else {
        // sortBy === 'stock'
        const stockA = a.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
        const stockB = b.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
        return sortOrder === 'asc' ? stockA - stockB : stockB - stockA;
      }
    });

    rawProducts = allMatching.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  } else {
    // Default urutkan berdasarkan waktu pembuatan terbaru (Prisma DB level pagination)
    const [count, list] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        include: includeConfig,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    totalCount = count;
    rawProducts = list;
  }

  // Serialisasi Decimal ke plain number agar aman dilempar ke Client Component (ProductTable)
  const serializedProducts: ProductItem[] = rawProducts.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    warrantyInfo: product.warrantyInfo,
    isArchived: product.isArchived,
    category: product.category,
    brand: product.brand,
    images: product.images,
    variants: product.variants.map((v) => ({
      id: v.id,
      name: v.name,
      price: Number(v.price),
      stock: v.stock,
    })),
  }));

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

        {/* Counter Info & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded border border-gray-200 bg-white text-gray-600 font-medium">
              Total Ditemukan: <strong className="text-gray-900 font-semibold">{totalCount}</strong>
            </span>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-primary hover:bg-blue-700 rounded transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Tambah Produk</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <ProductSearch initialSearch={search} initialStatus={status} />

      {/* Tabel Produk */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <ProductTable products={serializedProducts} />
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
