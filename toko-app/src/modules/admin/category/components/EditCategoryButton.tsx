'use client';

import { useState } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { CategoryFormModal, CategoryOption } from './CategoryFormModal';

interface EditCategoryButtonProps {
  category: {
    id: string;
    name: string;
    parentId: string | null;
    hasChildren?: boolean;
  };
  parentOptions: CategoryOption[];
}

export function EditCategoryButton({ category, parentOptions }: EditCategoryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        title="Edit Kategori"
        className="p-1.5 rounded text-gray-400 hover:text-blue-600 transition-colors inline-flex items-center justify-center cursor-pointer"
      >
        <PencilSquareIcon className="w-4 h-4" />
      </button>

      <CategoryFormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        categoryToEdit={category}
        parentOptions={parentOptions}
      />
    </>
  );
}
