'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ProductSearchProps {
  initialSearch?: string;
  initialStatus?: string;
}

export function ProductSearch({
  initialSearch = '',
  initialStatus = 'all',
}: ProductSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [, startTransition] = useTransition();

  const applyFilters = (newSearch: string, newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newSearch.trim()) {
      params.set('search', newSearch.trim());
    } else {
      params.delete('search');
    }

    if (newStatus && newStatus !== 'all') {
      params.set('status', newStatus);
    } else {
      params.delete('status');
    }

    params.set('page', '1'); // Reset to first page on new query

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(searchTerm, initialStatus);
  };

  const handleStatusChange = (status: string) => {
    applyFilters(searchTerm, status);
  };

  const filterTabs = [
    { label: 'Semua', value: 'all' },
    { label: 'Aktif', value: 'active' },
    { label: 'Diarsipkan', value: 'archived' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Search Input Form */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari nama produk..."
          className="w-full rounded-md border border-gray-200 bg-white pl-3.5 pr-8 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              applyFilters('', initialStatus);
            }}
            title="Bersihkan pencarian"
            aria-label="Bersihkan pencarian"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center rounded-md border border-gray-200 bg-white p-1">
        {filterTabs.map((tab) => {
          const isSelected = initialStatus === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => handleStatusChange(tab.value)}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-primary text-white font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
