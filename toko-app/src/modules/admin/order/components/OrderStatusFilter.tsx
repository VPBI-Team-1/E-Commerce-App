'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Tabs } from '@/components/ui/Tabs';

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
    <Tabs
      items={statusTabs.map((tab) => ({
        label: tab.label,
        value: tab.value,
        isActive: currentStatus === tab.value,
        onClick: () => handleSelectStatus(tab.value),
      }))}
    />
  );
}
