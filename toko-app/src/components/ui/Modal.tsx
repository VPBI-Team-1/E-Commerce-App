'use client';

import React, { useEffect } from 'react';

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
      : 'bg-gray-900 hover:bg-gray-800 text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 transition-opacity"
        onClick={isLoading ? undefined : onClose}
      />

      {/* Dialog Card */}
      <div className="relative z-10 w-full max-w-md bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
        )}

        {children && <div className="mt-4">{children}</div>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              type="button"
              disabled={isLoading}
              onClick={onConfirm}
              className={`rounded-md px-3.5 py-2 text-xs font-medium disabled:opacity-50 ${confirmBtnStyles}`}
            >
              {isLoading ? 'Memproses...' : confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
