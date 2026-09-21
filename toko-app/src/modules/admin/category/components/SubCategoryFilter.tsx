'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ParentOption {
  id: string;
  name: string;
}

interface SubCategoryFilterProps {
  parentCategories: ParentOption[];
  initialParentId?: string;
  initialSearch?: string;
}

export function SubCategoryFilter({
  parentCategories,
  initialParentId = '',
  initialSearch = '',
}: SubCategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [selectedParent, setSelectedParent] = useState(initialParentId);
  const [, startTransition] = useTransition();

  const applyFilters = (newSearch: string, newParentId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newSearch.trim()) {
      params.set('search', newSearch.trim());
    } else {
      params.delete('search');
    }

    if (newParentId) {
      params.set('parentId', newParentId);
    } else {
      params.delete('parentId');
    }

    params.set('page', '1');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(search, selectedParent);
  };

  const handleParentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const parentId = e.target.value;
    setSelectedParent(parentId);
    applyFilters(search, parentId);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama subkategori..."
          className="w-full rounded-md border border-gray-200 bg-white pl-3.5 pr-8 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
        />
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              applyFilters('', selectedParent);
            }}
            title="Bersihkan pencarian"
            aria-label="Bersihkan pencarian"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Filter Dropdown Kategori Induk */}
      <div className="flex items-center gap-2">
        <label htmlFor="parent-filter" className="text-xs text-gray-500 font-medium shrink-0">
          Kategori Induk:
        </label>
        <select
          id="parent-filter"
          value={selectedParent}
          onChange={handleParentChange}
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 focus:border-gray-400 focus:outline-none cursor-pointer"
        >
          <option value="">Semua Kategori Induk</option>
          {parentCategories.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
