'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Squares2X2Icon,
  TagIcon,
  BuildingStorefrontIcon,
  CubeIcon,
  ShoppingBagIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  matches?: (path: string) => boolean;
  badge?: string;
}

const navigationItems: NavigationItem[] = [
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
    name: 'Brand',
    href: '/admin/brands',
    icon: BuildingStorefrontIcon,
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
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout('/admin/login');
    } catch (error) {
      console.error('Gagal logout admin:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-white flex flex-col min-h-screen">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 bg-white border-b border-gray-200">
        <Link href="/admin" className="inline-flex items-center gap-3">
          <span className="rounded-lg bg-primary px-3 py-1 text-2xl font-bold text-white">
            B
          </span>
          <span className="text-2xl font-bold text-gray-900">
            Byte<span className="text-primary">Store</span>
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

      {/* User Info and Logout */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center justify-between gap-3 px-2 py-1">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || user?.email || 'Admin'}
            </p>
            <p className="text-xs text-gray-600 truncate">
              {user?.email || 'admin@bytestore.com'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            title={isLoggingOut ? 'Memproses...' : 'Keluar'}
            aria-label="Keluar dari akun admin"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
}
