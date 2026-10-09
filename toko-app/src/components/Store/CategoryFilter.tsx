"use client";

import { useState } from "react";

type CategoryOption = {
  id: string;
  name: string;
};

type CategoryFilterOptionsProps = {
  categories: CategoryOption[];
  selectedCategoryIds: string[];
};

export default function CategoryFilterOptions({
  categories,
  selectedCategoryIds,
}: CategoryFilterOptionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleCategories = categories.slice(0, 5);
  const additionalCategories = categories.slice(5);

  function renderCategory(category: CategoryOption) {
    return (
      <label
        key={category.id}
        className="flex items-center gap-2 text-sm text-gray-700"
      >
        <input
          type="checkbox"
          name="category"
          value={category.id}
          defaultChecked={selectedCategoryIds.includes(category.id)}
          className="h-4 w-4 accent-blue-700"
        />
        {category.name}
      </label>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      {visibleCategories.map(renderCategory)}

      {isExpanded && additionalCategories.map(renderCategory)}

      {additionalCategories.length > 0 && (
        <button
          type="button"
          onClick={() => setIsExpanded((expanded) => !expanded)}
          className="pt-1 text-sm font-medium text-blue-700 hover:text-blue-800  cursor-pointer"
        >
          {isExpanded ? "Lihat lebih sedikit" : "Lihat kategori lainnya"}
        </button>
      )}
    </div>
  );
}
