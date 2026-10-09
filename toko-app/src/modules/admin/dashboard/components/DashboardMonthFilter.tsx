'use client';

import React, { useRef, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface DashboardMonthFilterProps {
  currentMonth: string; // format YYYY-MM, contoh: "2026-09"
}

export function DashboardMonthFilter({ currentMonth }: DashboardMonthFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleMonthChange = (newMonth: string) => {
    if (!newMonth || newMonth === currentMonth) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('month', newMonth);

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleOpenPicker = () => {
    if (inputRef.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        try {
          inputRef.current.showPicker();
        } catch {
          inputRef.current.focus();
        }
      } else {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div
      onClick={handleOpenPicker}
      className={`relative inline-flex items-center cursor-pointer transition-opacity ${
        isPending ? 'opacity-60 pointer-events-none' : 'opacity-100'
      }`}
    >
      <input
        ref={inputRef}
        type="month"
        value={currentMonth}
        onChange={(e) => handleMonthChange(e.target.value)}
        onClick={handleOpenPicker}
        aria-label="Pilih Bulan dan Tahun"
        className="px-3.5 py-1.5 text-xs font-semibold text-gray-800 bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all cursor-pointer shadow-xs"
      />
    </div>
  );
}
