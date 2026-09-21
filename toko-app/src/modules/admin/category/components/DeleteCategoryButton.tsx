'use client';

import { useState, useTransition } from 'react';
import { deleteCategory } from '../actions/category.actions';
import { Modal } from '@/components/ui/Modal';

interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
  hasProducts: boolean;
  hasChildren?: boolean;
}

export function DeleteCategoryButton({
  categoryId,
  categoryName,
  hasProducts,
  hasChildren = false,
}: DeleteCategoryButtonProps) {
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

    // Guard Clause 1: Peringatan jika kategori memiliki subkategori
    if (hasChildren) {
      setErrorMessage(
        `Kategori "${categoryName}" memiliki subkategori terkait. Hapus atau pindahkan subkategori terlebih dahulu.`
      );
      return;
    }

    // Guard Clause 2: Peringatan jika kategori sudah pasti punya produk
    if (hasProducts) {
      setErrorMessage(
        `Kategori "${categoryName}" memiliki produk terkait. Hapus atau pindahkan produk tersebut terlebih dahulu.`
      );
      return;
    }

    startTransition(async () => {
      const res = await deleteCategory(categoryId);

      if (!res.success) {
        setErrorMessage(res.error || 'Gagal menghapus kategori.');
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
        className="text-xs font-medium text-red-600 hover:text-red-800 transition-colors"
      >
        Hapus
      </button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Hapus Kategori"
        confirmText="Hapus Kategori"
        confirmVariant="danger"
        isLoading={isPending}
        onConfirm={handleDelete}
      >
        <div className="space-y-3">
          <p className="text-xs text-gray-600 leading-relaxed">
            Apakah Anda yakin ingin menghapus kategori{' '}
            <span className="font-semibold text-gray-900">&quot;{categoryName}&quot;</span>?
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
