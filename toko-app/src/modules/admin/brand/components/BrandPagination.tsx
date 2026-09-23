'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

interface BrandPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export function BrandPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
}: BrandPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Guard Clause: Sembunyikan pagination jika data tidak ada atau hanya 1 halaman
  if (totalItems === 0 || totalPages <= 1) {
    return null;
  }

  const navigateToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-t border-gray-200 bg-white">
      <p className="text-xs text-gray-500">
        Menampilkan{' '}
        <span className="font-semibold text-gray-900">{startItem}</span> -{' '}
        <span className="font-semibold text-gray-900">{endItem}</span> dari{' '}
        <span className="font-semibold text-gray-900">{totalItems}</span> brand
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => navigateToPage(currentPage - 1)}
          className="rounded border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          Sebelumnya
        </button>

        <span className="px-2 text-xs text-gray-600 font-medium">
          Halaman {currentPage} dari {totalPages || 1}
        </span>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => navigateToPage(currentPage + 1)}
          className="rounded border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}
