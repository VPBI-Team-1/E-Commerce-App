'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

const statusTabs = [
  { label: 'Semua', value: '' },
  { label: 'Menunggu Verifikasi', value: 'VERIFYING' },
  { label: 'Siap Kirim', value: 'PAID' },
  { label: 'Sedang Dikirim', value: 'SHIPPED' },
  { label: 'Selesai', value: 'COMPLETED' },
  { label: 'Dibatalkan', value: 'CANCELLED' },
  { label: 'Menunggu Bayar', value: 'PENDING' },
];

export function OrderStatusFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentStatus = searchParams.get('status') || '';

  const handleSelectStatus = (statusValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (statusValue) {
      params.set('status', statusValue);
    } else {
      params.delete('status');
    }
    params.set('page', '1');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-gray-200">
      {statusTabs.map((tab) => {
        const isActive = currentStatus === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => handleSelectStatus(tab.value)}
            className={`px-3 py-2 rounded-t font-medium whitespace-nowrap transition-colors border-b-2 -mb-[1px] ${
              isActive
                ? 'border-gray-900 text-gray-900 bg-white font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
