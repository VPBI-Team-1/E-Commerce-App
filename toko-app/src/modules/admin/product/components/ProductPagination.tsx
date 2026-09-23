'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export function ProductPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
}: ProductPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Guard Clause: Sembunyikan pagination jika tidak ada data sama sekali
  if (totalItems === 0) {
    return null;
  }

  const navigateToPage = (page: number) => {
    // Guard Clause: Cegah navigasi ke luar batas halaman
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
      {/* Information text */}
      <p className="text-xs text-gray-500">
        Menampilkan{' '}
        <span className="font-semibold text-gray-900">{startItem}</span> -{' '}
        <span className="font-semibold text-gray-900">{endItem}</span> dari{' '}
        <span className="font-semibold text-gray-900">{totalItems}</span> produk
      </p>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => navigateToPage(currentPage - 1)}
          className="rounded border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
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
          className="rounded border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}
