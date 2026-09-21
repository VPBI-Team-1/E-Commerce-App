import prisma from '@/lib/prisma';
import { CategoryNavTabs } from '@/modules/admin/category/components/CategoryNavTabs';
import { RootCategoryTable } from '@/modules/admin/category/components/RootCategoryTable';
import { CategoryPagination } from '@/modules/admin/category/components/CategoryPagination';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

interface AdminCategoriesPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function AdminCategoriesPage({
  searchParams,
}: AdminCategoriesPageProps) {
  const params = await searchParams;

  const search = typeof params?.search === 'string' ? params.search.trim() : '';
  const pageNumber = typeof params?.page === 'string' ? Math.max(1, parseInt(params.page, 10)) : 1;
  const pageSize = 10;

  // Filter khusus Kategori Utama (parentId == null)
  const where: Prisma.CategoryWhereInput = {
    parentId: null,
  };

  if (search) {
    where.name = {
      contains: search,
      mode: 'insensitive',
    };
  }

  const [totalCount, categories, totalSubcategories] = await Promise.all([
    prisma.category.count({ where }),
    prisma.category.findMany({
      where,
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      include: {
        _count: {
          select: {
            children: true,
            products: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.category.count({
      where: { parentId: { not: null } },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Kategori Utama (Induk)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola kategori tingkat atas pada struktur katalog toko.
          </p>
        </div>

        {/* Counter Info */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded border border-gray-200 bg-white text-gray-600 font-medium">
            Total Kategori Utama: <strong className="text-gray-900 font-semibold">{totalCount}</strong>
          </span>
          <span className="px-3 py-1.5 rounded border border-gray-200 bg-white text-gray-600 font-medium">
            Total Subkategori: <strong className="text-gray-900 font-semibold">{totalSubcategories}</strong>
          </span>
        </div>
      </div>

      {/* Nav Tabs */}
      <CategoryNavTabs />

      {/* Tabel Kategori Utama */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <RootCategoryTable categories={categories} />
        <CategoryPagination
          currentPage={pageNumber}
          totalPages={totalPages}
          totalItems={totalCount}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}
