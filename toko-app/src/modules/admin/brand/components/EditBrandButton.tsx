'use client';

import { useState } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { BrandFormModal } from './BrandFormModal';

interface EditBrandButtonProps {
  brand: {
    id: string;
    name: string;
  };
}

export function EditBrandButton({ brand }: EditBrandButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        title="Edit Brand"
        className="p-1.5 rounded text-gray-400 hover:text-blue-600 transition-colors inline-flex items-center justify-center cursor-pointer"
      >
        <PencilSquareIcon className="w-4 h-4" />
      </button>

      <BrandFormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        brandToEdit={brand}
      />
    </>
  );
}
