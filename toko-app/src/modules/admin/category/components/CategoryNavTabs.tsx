'use client';

import { usePathname } from 'next/navigation';
import { Tabs } from '@/components/ui/Tabs';

export function CategoryNavTabs() {
  const pathname = usePathname();
  const isSubcategories = pathname.startsWith('/admin/subcategories');

  return (
    <Tabs
      items={[
        {
          label: 'Kategori Utama',
          href: '/admin/categories',
          isActive: !isSubcategories,
        },
        {
          label: 'Subkategori',
          href: '/admin/subcategories',
          isActive: isSubcategories,
        },
      ]}
    />
  );
}
