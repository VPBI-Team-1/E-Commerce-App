import prisma from '@/lib/prisma';
import { BrandTable } from '@/modules/admin/brand/components/BrandTable';
import { BrandSearch } from '@/modules/admin/brand/components/BrandSearch';
import { BrandPagination } from '@/modules/admin/brand/components/BrandPagination';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

interface AdminBrandsPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function AdminBrandsPage({
  searchParams,
}: AdminBrandsPageProps) {
  const params = await searchParams;

  const search = typeof params?.search === 'string' ? params.search.trim() : '';
  const pageNumber = typeof params?.page === 'string' ? Math.max(1, parseInt(params.page, 10)) : 1;
  const pageSize = 10;

  const where: Prisma.BrandWhereInput = {};

  if (search) {
    where.name = {
      contains: search,
      mode: 'insensitive',
    };
  }

  const [totalCount, brands] = await Promise.all([
    prisma.brand.count({ where }),
    prisma.brand.findMany({
      where,
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Manajemen Brand
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola daftar merek produsen komponen komputer dan periferal toko.
          </p>
        </div>

        {/* Counter Info */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded border border-gray-200 bg-white text-gray-600 font-medium">
            Total Brand: <strong className="text-gray-900 font-semibold">{totalCount}</strong>
          </span>
        </div>
      </div>

      {/* Toolbar Pencarian */}
      <BrandSearch initialSearch={search} />

      {/* Tabel Brand */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <BrandTable brands={brands} />
        <BrandPagination
          currentPage={pageNumber}
          totalPages={totalPages}
          totalItems={totalCount}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}
