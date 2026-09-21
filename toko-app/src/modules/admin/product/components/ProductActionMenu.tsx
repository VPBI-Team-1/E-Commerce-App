'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { archiveProduct } from '../actions/product.actions';
import { Modal } from '@/components/ui/Modal';
import {
  PencilSquareIcon,
  EllipsisVerticalIcon,
  ArchiveBoxIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface ProductActionMenuProps {
  productId: string;
  productName: string;
  isArchived: boolean;
}

export function ProductActionMenu({
  productId,
  productName,
  isArchived,
}: ProductActionMenuProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Menutup dropdown saat klik di luar elemen
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleOpenModal = () => {
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isPending) return;
    setErrorMessage(null);
    setIsModalOpen(false);
  };

  const handleAction = () => {
    setErrorMessage(null);

    startTransition(async () => {
      const res = await archiveProduct(productId, !isArchived);

      if (!res.success) {
        setErrorMessage(res.error || 'Gagal mengubah status produk.');
        return;
      }

      setIsModalOpen(false);
    });
  };

  const actionTitle = isArchived ? 'Pulihkan Produk' : 'Arsipkan Produk';
  const confirmText = isArchived ? 'Pulihkan' : 'Arsipkan';
  const confirmVariant = isArchived ? 'primary' : 'danger';

  return (
    <>
      <div className="inline-flex items-center justify-end gap-1">
        {/* Tombol Edit (Tampilan/UI Placeholder) */}
        <button
          type="button"
          title="Edit Produk"
          className="p-1.5 rounded text-gray-400 hover:text-blue-600 transition-colors inline-flex items-center justify-center cursor-pointer"
        >
          <PencilSquareIcon className="w-4 h-4" />
        </button>

        {/* Tombol Menu 3 Dot Vertikal */}
        <div className="relative inline-flex items-center" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            title="Menu Aksi"
            className={`p-1.5 rounded text-gray-400 hover:text-gray-700 transition-colors inline-flex items-center justify-center cursor-pointer ${
              isDropdownOpen ? 'text-gray-700' : ''
            }`}
          >
            <EllipsisVerticalIcon className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 z-20 border border-gray-100 text-left">
              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  handleOpenModal();
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors cursor-pointer text-left ${
                  isArchived
                    ? 'text-emerald-600 hover:bg-emerald-50'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-amber-600'
                }`}
              >
                {isArchived ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 shrink-0" />
                    <span>Pulihkan</span>
                  </>
                ) : (
                  <>
                    <ArchiveBoxIcon className="w-4 h-4 shrink-0" />
                    <span>Arsipkan</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Konfirmasi Arsip / Pulihkan */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
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
