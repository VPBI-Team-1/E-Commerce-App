'use client';

import { useState, useTransition, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { brandSchema, BrandInput } from '@/schemas/brand';
import { createBrand, updateBrand } from '../actions/brand.actions';
import { XMarkIcon } from '@heroicons/react/24/outline';

export interface BrandToEdit {
  id: string;
  name: string;
}

interface BrandFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandToEdit?: BrandToEdit | null;
}

export function BrandFormModal({
  isOpen,
  onClose,
  brandToEdit,
}: BrandFormModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isEditMode = Boolean(brandToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BrandInput>({
    resolver: zodResolver(brandSchema),
    values: {
      name: brandToEdit?.name || '',
    },
  });

  const handleClose = useCallback(() => {
    if (isPending) return;
    setServerError(null);
    reset();
    onClose();
  }, [isPending, reset, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPending, handleClose]);

  if (!isOpen) {
    return null;
  }

  const onSubmit = (data: BrandInput) => {
    setServerError(null);

    startTransition(async () => {
      const response = isEditMode && brandToEdit
        ? await updateBrand(brandToEdit.id, data)
        : await createBrand(data);

      if (!response.success) {
        setServerError(
          response.error || 'Terjadi kesalahan saat menyimpan data brand.'
        );
        return;
      }

      handleClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 transition-opacity"
        onClick={isPending ? undefined : handleClose}
      />

      {/* Dialog Card */}
      <div className="relative z-10 w-full max-w-md bg-white border border-gray-200 rounded-lg p-6 shadow-md text-left">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-base font-semibold text-gray-900">
            {isEditMode ? 'Edit Brand' : 'Tambah Brand Baru'}
          </h2>
          <button
            type="button"
            disabled={isPending}
            onClick={handleClose}
            aria-label="Tutup"
            className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {serverError && (
            <div className="p-3 rounded border border-red-200 bg-red-50 text-xs text-red-700">
              {serverError}
            </div>
          )}

          <div>
            <label
              htmlFor="brand-name"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Nama Brand <span className="text-red-500">*</span>
            </label>
            <input
              id="brand-name"
              type="text"
              {...register('name')}
              placeholder="Contoh: ASUS, Logitech, atau Corsair"
              disabled={isPending}
              className={`w-full rounded border px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                errors.name
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:border-gray-400 focus:ring-gray-400'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-[11px] text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
            <button
              type="button"
              disabled={isPending}
              onClick={handleClose}
              className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-xs font-medium text-white bg-primary rounded hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isPending
                ? 'Menyimpan...'
                : isEditMode
                ? 'Perbarui Brand'
                : 'Simpan Brand'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
