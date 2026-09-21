'use client';

import { useState, useTransition } from 'react';
import { archiveProduct } from '../actions/product.actions';
import { Modal } from '@/components/ui/Modal';
import { ArchiveBoxIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface ArchiveProductButtonProps {
  productId: string;
  productName: string;
  isArchived: boolean;
}

export function ArchiveProductButton({
  productId,
  productName,
  isArchived,
}: ArchiveProductButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleOpen = () => {
    setErrorMessage(null);
    setIsOpen(true);
  };

  const handleClose = () => {
    if (isPending) return;
    setErrorMessage(null);
    setIsOpen(false);
  };

  const handleAction = () => {
    setErrorMessage(null);

    startTransition(async () => {
      // Toggle arsipkan / aktifkan
      const res = await archiveProduct(productId, !isArchived);

      if (!res.success) {
        setErrorMessage(res.error || 'Gagal mengubah status produk.');
        return;
      }

      setIsOpen(false);
    });
  };

  const actionTitle = isArchived ? 'Pulihkan Produk' : 'Arsipkan Produk';
  const confirmText = isArchived ? 'Pulihkan' : 'Arsipkan';
  const confirmVariant = isArchived ? 'primary' : 'danger';

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        title={isArchived ? 'Pulihkan Produk' : 'Arsipkan Produk'}
        className={`p-1.5 rounded transition-colors inline-flex items-center justify-center ${
          isArchived
            ? 'text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50'
            : 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
        }`}
      >
        {isArchived ? (
          <ArrowPathIcon className="w-4 h-4" />
        ) : (
          <ArchiveBoxIcon className="w-4 h-4" />
        )}
      </button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={actionTitle}
        confirmText={confirmText}
        confirmVariant={confirmVariant}
        isLoading={isPending}
        onConfirm={handleAction}
      >
        <div className="space-y-3">
          <p className="text-xs text-gray-600 leading-relaxed">
            {isArchived ? (
              <>
                Apakah Anda ingin mengaktifkan kembali produk{' '}
                <span className="font-semibold text-gray-900">&quot;{productName}&quot;</span>?
                Produk akan kembali muncul di katalog publik dan dapat dibeli oleh pelanggan.
              </>
            ) : (
              <>
                Apakah Anda yakin ingin mengarsipkan produk{' '}
                <span className="font-semibold text-gray-900">&quot;{productName}&quot;</span>?
                Produk akan disembunyikan dari katalog publik toko (*soft delete*).
              </>
            )}
          </p>

          {errorMessage && (
            <div className="p-3 rounded border border-red-200 bg-red-50 text-xs text-red-700">
              {errorMessage}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
