import React from 'react';
import Link from 'next/link';

export interface TabItem {
  label: string;
  value?: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  className?: string;
}

/**
 * Komponen Tab navigasi global untuk menjaga konsistensi antarmuka.
 * Mendukung item berbasis Link (navigasi rute) maupun Button (filter/state).
 */
export function Tabs({ items, className = '' }: TabsProps) {
  return (
    <div
      className={`flex items-center border-b border-gray-200 overflow-x-auto ${className}`}
    >
      {items.map((tab, idx) => {
        const activeClasses = tab.isActive
          ? 'border-gray-900 text-gray-900 font-semibold'
          : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300 font-medium';

        const baseClasses = `inline-flex items-center gap-1.5 px-4 py-2.5 text-xs border-b-2 -mb-px transition-colors whitespace-nowrap cursor-pointer ${activeClasses}`;

        if (tab.href) {
          return (
            <Link
              key={tab.href || idx}
              href={tab.href}
              className={baseClasses}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {tab.count}
                </span>
              )}
            </Link>
          );
        }

        return (
          <button
            key={tab.value || idx}
            type="button"
            onClick={tab.onClick}
            className={baseClasses}
          >
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
