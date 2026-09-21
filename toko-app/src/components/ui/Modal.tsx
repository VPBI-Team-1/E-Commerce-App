'use client';

import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'primary';
  onConfirm?: () => void;
  isLoading?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  confirmVariant = 'primary',
  onConfirm,
  isLoading = false,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  // Guard Clause: Return early if modal is not open
  if (!isOpen) {
    return null;
  }

  const confirmBtnStyles =
    confirmVariant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 text-white'
      : 'bg-primary hover:bg-blue-700 text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={isLoading ? undefined : onClose}
      />

      {/* Dialog Card */}
      <div className="relative z-10 w-full max-w-md bg-white border border-gray-200 rounded-xl p-6 shadow-xl text-left">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base font-semibold text-gray-900 text-left">{title}</h3>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer -mr-1 -mt-1"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {description && (
          <p className="mt-2 text-sm text-gray-600 leading-relaxed text-left">
            {description}
          </p>
        )}

        {children && <div className="mt-3 text-left">{children}</div>}

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer transition-colors"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              type="button"
              disabled={isLoading}
              onClick={onConfirm}
              className={`rounded-md px-3.5 py-2 text-xs font-medium disabled:opacity-50 cursor-pointer transition-colors ${confirmBtnStyles}`}
            >
              {isLoading ? 'Memproses...' : confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
