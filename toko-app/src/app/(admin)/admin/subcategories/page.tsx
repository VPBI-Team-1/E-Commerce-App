import prisma from '@/lib/prisma';
import { CategoryNavTabs } from '@/modules/admin/category/components/CategoryNavTabs';
import { SubCategoryFilter } from '@/modules/admin/category/components/SubCategoryFilter';
import { SubCategoryTable } from '@/modules/admin/category/components/SubCategoryTable';
import { CategoryPagination } from '@/modules/admin/category/components/CategoryPagination';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

interface AdminSubCategoriesPageProps {
  searchParams: Promise<{
    search?: string;
    parentId?: string;
    page?: string;
  }>;
}

export default async function AdminSubCategoriesPage({
  searchParams,
}: AdminSubCategoriesPageProps) {
  const params = await searchParams;

  const search = typeof params?.search === 'string' ? params.search.trim() : '';
  const parentId = typeof params?.parentId === 'string' ? params.parentId : '';
  const pageNumber = typeof params?.page === 'string' ? Math.max(1, parseInt(params.page, 10)) : 1;
  const pageSize = 10;

  // Bangun filter query khusus Subkategori (parentId != null)
  const where: Prisma.CategoryWhereInput = {
    parentId: parentId ? parentId : { not: null },
  };

  if (search) {
    where.name = {
      contains: search,
      mode: 'insensitive',
    };
  }

  // Ambil data subkategori, count, dan daftar induk untuk dropdown filter secara paralel
  const [totalCount, subcategories, parentCategories] = await Promise.all([
    prisma.category.count({ where }),
    prisma.category.findMany({
      where,
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      include: {
        parent: {
          select: { id: true, name: true },
        },
        _count: {
          select: {
            children: true,
            products: true,
          },
        },
      },
      orderBy: [
        { parent: { name: 'asc' } },
        { name: 'asc' },
      ],
    }),
    prisma.category.findMany({
      where: { parentId: null },
      select: { id: true, name: true },
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
            Subkategori Produk
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola subkategori spesifik yang bernaung di bawah kategori utama.
          </p>
        </div>

        {/* Counter Info */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded border border-gray-200 bg-white text-gray-600 font-medium">
            Total Ditemukan: <strong className="text-gray-900 font-semibold">{totalCount}</strong>
          </span>
        </div>
      </div>

      {/* Nav Tabs */}
      <CategoryNavTabs />

      {/* Filter & Search Toolbar */}
      <SubCategoryFilter
        parentCategories={parentCategories}
        initialParentId={parentId}
        initialSearch={search}
      />

      {/* Tabel Subkategori */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <SubCategoryTable subcategories={subcategories} />
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
