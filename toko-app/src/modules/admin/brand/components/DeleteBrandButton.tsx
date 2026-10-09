'use client';

import { useState, useTransition } from 'react';
import { deleteBrand } from '../actions/brand.actions';
import { Modal } from '@/components/ui/Modal';
import { TrashIcon } from '@heroicons/react/24/outline';

interface DeleteBrandButtonProps {
  brandId: string;
  brandName: string;
  hasProducts: boolean;
}

export function DeleteBrandButton({
  brandId,
  brandName,
  hasProducts,
}: DeleteBrandButtonProps) {
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

  const handleDelete = () => {
    setErrorMessage(null);

    // Guard Clause: Peringatan jika brand masih memiliki produk
    if (hasProducts) {
      setErrorMessage(
        `Brand "${brandName}" memiliki produk terkait. Hapus atau pindahkan produk tersebut terlebih dahulu.`
      );
      return;
    }

    startTransition(async () => {
      const res = await deleteBrand(brandId);

      if (!res.success) {
        setErrorMessage(res.error || 'Gagal menghapus brand.');
        return;
      }

      setIsOpen(false);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        title="Hapus Brand"
        className="p-1.5 rounded text-gray-400 hover:text-red-600 transition-colors inline-flex items-center justify-center cursor-pointer"
      >
        <TrashIcon className="w-4 h-4" />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Hapus Brand"
        confirmText="Hapus Brand"
        confirmVariant="danger"
        isLoading={isPending}
        onConfirm={handleDelete}
      >
        <div className="space-y-3">
          <p className="text-xs text-gray-600 leading-relaxed">
            Apakah Anda yakin ingin menghapus brand{' '}
            <span className="font-semibold text-gray-900">&quot;{brandName}&quot;</span>?
            Tindakan ini permanen dan tidak dapat dibatalkan.
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
