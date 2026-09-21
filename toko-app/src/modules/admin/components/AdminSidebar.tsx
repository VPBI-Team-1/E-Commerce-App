'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Squares2X2Icon,
  TagIcon,
  CubeIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: Squares2X2Icon,
    exact: true,
  },
  {
    name: 'Kategori',
    href: '/admin/categories',
    icon: TagIcon,
    matches: (path: string) =>
      path.startsWith('/admin/categories') || path.startsWith('/admin/subcategories'),
  },
  {
    name: 'Katalog Produk',
    href: '/admin/products',
    icon: CubeIcon,
  },
  {
    name: 'Pesanan',
    href: '/admin/orders',
    icon: ShoppingBagIcon,
    badge: 'Tahap 4',
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-white flex flex-col min-h-screen">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 bg-primary border-b border-gray-200">
        <Link href="/admin">
          <span className="font-bold text-lg tracking-tight text-white">
            ByteStore
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Menu Navigasi
        </p>
        {navigationItems.map((item) => {
          const isActive = item.matches
            ? item.matches(pathname)
            : item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? 'text-gray-900' : 'text-gray-400'
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-normal">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
