'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function CategoryNavTabs() {
  const pathname = usePathname();

  const isSubcategories = pathname.startsWith('/admin/subcategories');

  return (
    <div className="flex border-b border-gray-200">
      <Link
        href="/admin/categories"
        className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors ${
          !isSubcategories
            ? 'border-gray-900 text-gray-900'
            : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
        }`}
      >
        Kategori Utama
      </Link>
      <Link
        href="/admin/subcategories"
        className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors ${
          isSubcategories
            ? 'border-gray-900 text-gray-900'
            : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
        }`}
      >
        Subkategori
      </Link>
    </div>
  );
}
