'use client';

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { BrandFormModal } from './BrandFormModal';

interface CreateBrandButtonProps {
  buttonLabel?: string;
}

export function CreateBrandButton({
  buttonLabel = 'Tambah Brand',
}: CreateBrandButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-primary hover:bg-blue-700 rounded transition-colors cursor-pointer"
      >
        <PlusIcon className="w-4 h-4" />
        <span>{buttonLabel}</span>
      </button>

      <BrandFormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
