'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface OrderSearchProps {
  initialSearch?: string;
}

export function OrderSearch({ initialSearch = '' }: OrderSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [, startTransition] = useTransition();

  const handleApplySearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term.trim()) {
      params.set('search', term.trim());
    } else {
      params.delete('search');
    }
    params.set('page', '1');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleApplySearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-sm">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <MagnifyingGlassIcon className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Cari invoice atau nama pembeli..."
        className="w-full rounded-md border border-gray-200 bg-white pl-9 pr-8 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={() => {
            setSearchTerm('');
            handleApplySearch('');
          }}
          title="Bersihkan pencarian"
          aria-label="Bersihkan pencarian"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}
