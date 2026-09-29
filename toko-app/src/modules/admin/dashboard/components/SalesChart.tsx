'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ArrowTrendingUpIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export interface DailySalesData {
  date: string;
  rawDate: string;
  totalSales: number;
  orderCount: number;
}

interface SalesChartProps {
  data?: DailySalesData[];
  isLoading?: boolean;
  error?: string | null;
}

const formatIDR = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val);
};

const formatCompactIDR = (val: number) => {
  if (val >= 1_000_000_000) {
    return `Rp ${(val / 1_000_000_000).toFixed(1)}M`;
  }
  if (val >= 1_000_000) {
    return `Rp ${(val / 1_000_000).toFixed(1)}jt`;
  }
  if (val >= 1_000) {
    return `Rp ${(val / 1_000).toFixed(0)}rb`;
  }
  return `Rp ${val}`;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: DailySalesData;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm text-xs">
        <p className="font-semibold text-gray-900 mb-1">{item.date}</p>
        <div className="space-y-0.5">
          <p className="text-gray-600">
            Penjualan:{' '}
            <span className="font-semibold text-blue-600">
              {formatIDR(item.totalSales)}
            </span>
          </p>
          <p className="text-gray-500">
            Pesanan Lunas: <span className="font-medium text-gray-700">{item.orderCount}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
}

export function SalesChart({ data = [], isLoading = false, error = null }: SalesChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Total sales in this period
  const totalPeriodSales = data.reduce((acc, curr) => acc + curr.totalSales, 0);

  // State 1: Loading State (or SSR hydration guard)
  if (isLoading || !isMounted) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="space-y-2">
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-56 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="h-8 w-28 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-[280px] w-full mt-4 flex items-end justify-between gap-3 px-4 pb-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-t w-full animate-pulse"
              style={{ height: `${30 + (i % 4) * 20}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // State 2: Error State
  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-rose-50 text-rose-600 mb-3">
          <ExclamationTriangleIcon className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">Gagal Memuat Grafik</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">{error}</p>
      </div>
    );
  }

  // State 3: Empty State
  const hasNoData = data.length === 0;

  if (hasNoData) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-400 mb-3">
          <ArrowTrendingUpIcon className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">Belum Ada Data Penjualan</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
          Data grafik akan otomatis terbentuk setelah ada transaksi pesanan yang masuk dan diverifikasi.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-gray-900">
              Tren Penjualan 7 Hari Terakhir
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Pendapatan harian dari pesanan berstatus lunas, dikirim, dan selesai
          </p>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-xs text-gray-400 block">Total Periode Ini</span>
          <span className="text-base font-bold text-gray-900">
            {formatIDR(totalPeriodSales)}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-4 h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCompactIDR}
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="totalSales"
              stroke="#2563eb"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#salesGradient)"
              activeDot={{ r: 5, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
