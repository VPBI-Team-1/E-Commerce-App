'use client';

import { useState, useTransition } from 'react';
import { OrderStatus } from '@prisma/client';
import { Modal } from '@/components/ui/Modal';
import {
  verifyPayment,
  shipOrder,
  cancelOrder,
} from '../actions/order.actions';

interface OrderActionButtonsProps {
  orderId: string;
  status: OrderStatus;
  invoiceNumber: string;
}

export function OrderActionButtons({
  orderId,
  status,
  invoiceNumber,
}: OrderActionButtonsProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const handleVerify = () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const res = await verifyPayment(orderId);
      if (!res.success) {
        setErrorMessage(res.error || 'Gagal memverifikasi pembayaran.');
      } else {
        setSuccessMessage(res.message || 'Pembayaran berhasil disetujui.');
      }
    });
  };

  const handleShip = () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const res = await shipOrder(orderId);
      if (!res.success) {
        setErrorMessage(res.error || 'Gagal memproses pengiriman.');
      } else {
        setSuccessMessage(res.message || 'Pesanan berhasil diproses kirim.');
      }
    });
  };

  const handleConfirmCancel = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsCancelModalOpen(false);

    startTransition(async () => {
      const res = await cancelOrder(orderId);
      if (!res.success) {
        setErrorMessage(res.error || 'Gagal membatalkan pesanan.');
      } else {
        setSuccessMessage(res.message || 'Pesanan berhasil dibatalkan.');
      }
    });
  };

  const canCancel =
    status === OrderStatus.PENDING ||
    status === OrderStatus.VERIFYING ||
    status === OrderStatus.PAID;

  return (
    <div className="space-y-3">
      {/* Feedback Messages */}
      {errorMessage && (
        <div className="p-3 rounded border border-rose-200 bg-rose-50 text-xs text-rose-800">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="p-3 rounded border border-emerald-200 bg-emerald-50 text-xs text-emerald-800">
          {successMessage}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        {status === OrderStatus.VERIFYING && (
          <button
            type="button"
            disabled={isPending}
            onClick={handleVerify}
            className="w-full inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isPending ? 'Memproses...' : 'Setujui Pembayaran'}
          </button>
        )}

        {status === OrderStatus.PAID && (
          <button
            type="button"
            disabled={isPending}
            onClick={handleShip}
            className="w-full inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isPending ? 'Memproses...' : 'Kirim Barang'}
          </button>
        )}

        {canCancel && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => setIsCancelModalOpen(true)}
            className="w-full inline-flex items-center justify-center rounded border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 hover:border-rose-200 disabled:opacity-50 transition-colors cursor-pointer"
          >
            Batalkan Pesanan
          </button>
        )}

        {!canCancel && (
          <p className="text-xs text-gray-500 text-center py-1">
            Tidak ada tindakan lebih lanjut yang diperlukan untuk pesanan ini.
          </p>
        )}
      </div>

      {/* Confirmation Modal via Global Component */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Konfirmasi Pembatalan"
        confirmText="Ya, Batalkan Pesanan"
        cancelText="Kembali"
        confirmVariant="danger"
        isLoading={isPending}
        onConfirm={handleConfirmCancel}
      >
        <p className="text-xs text-gray-600 leading-relaxed">
          Apakah Anda yakin ingin membatalkan pesanan{' '}
          <span className="font-semibold text-gray-900">
            &quot;{invoiceNumber}&quot;
          </span>
          ? Stok produk yang terkunci akan otomatis dikembalikan ke etalase utama.
        </p>
      </Modal>
    </div>
  );
}
