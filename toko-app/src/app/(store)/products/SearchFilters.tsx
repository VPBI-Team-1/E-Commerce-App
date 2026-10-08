"use client";

import Link from "next/link";
import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import CategoryFilterOptions from "@/components/Store/CategoryFilter";

type SearchFiltersProps = {
  searchTerm: string;
  selectedCategoryIds: string[];
  selectedBrandIds: string[];
  minPrice?: number;
  maxPrice?: number;
  categories: Array<{ id: string; name: string }>;
  brands: Array<{ id: string; name: string }>;
};

export default function SearchFilters({
  searchTerm,
  selectedCategoryIds,
  selectedBrandIds,
  minPrice,
  maxPrice,
  categories,
  brands,
}: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="h-fit overflow-hidden rounded-lg border border-gray-200 border-t-4 border-t-blue-700 bg-white shadow-sm lg:sticky lg:top-6">
      <div className="border-b border-gray-200 bg-gray-50 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Filter Produk
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Sesuaikan hasil pencarian
            </p>
          </div>

          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls="search-filters-form"
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 lg:hidden"
          >
            <span>{isOpen ? "Tutup" : "Buka"}</span>
            <LuChevronDown
              className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      <div
        className={`${isOpen ? "block" : "hidden"} lg:block`}
        id="search-filters-form"
      >
        <form method="get" className="space-y-6 p-5">
          <input type="hidden" name="search" value={searchTerm} />

          <fieldset>
            <legend className="text-sm font-medium text-gray-900">
              Kategori
            </legend>
            <CategoryFilterOptions
              categories={categories}
              selectedCategoryIds={selectedCategoryIds}
            />
          </fieldset>

          {brands.length > 0 && (
            <fieldset>
              <legend className="text-sm font-medium text-gray-900">
                Merek
              </legend>
              <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
                {brands.map((brand) => (
                  <label
                    key={brand.id}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <input
                      type="checkbox"
                      name="brand"
                      value={brand.id}
                      defaultChecked={selectedBrandIds.includes(brand.id)}
                      className="h-4 w-4 accent-blue-700"
                    />
                    {brand.name}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <fieldset>
            <legend className="text-sm font-medium text-gray-900">
              Rentang harga
            </legend>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="block text-xs font-medium text-gray-600">
                Minimum
                <input
                  type="number"
                  name="minPrice"
                  min="0"
                  defaultValue={minPrice ?? ""}
                  placeholder="Rp minimum"
                  className="mt-1 h-10 w-full rounded-md border border-gray-300 px-3 text-sm"
                />
              </label>

              <label className="block text-xs font-medium text-gray-600">
                Maksimum
                <input
                  type="number"
                  name="maxPrice"
                  min="0"
                  defaultValue={maxPrice ?? ""}
                  placeholder="Rp maksimum"
                  className="mt-1 h-10 w-full rounded-md border border-gray-300 px-3 text-sm"
                />
              </label>
            </div>
          </fieldset>

          <div className="space-y-2">
            <button
              type="submit"
              className="w-full rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Terapkan Filter
            </button>

            <Link
              href={`/products?search=${encodeURIComponent(searchTerm)}`}
              className="block rounded-md border border-gray-300 px-4 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset Filter
            </Link>
          </div>
        </form>
      </div>
    </aside>
  );
}
