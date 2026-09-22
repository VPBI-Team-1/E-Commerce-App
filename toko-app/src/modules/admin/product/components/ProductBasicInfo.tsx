'use client';

import { useState, useMemo } from 'react';
import { UseFormRegister, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { ProductInput } from '@/schemas/product';

export interface CategorySelectItem {
  id: string;
  name: string;
  parentId: string | null;
}

export interface BrandSelectItem {
  id: string;
  name: string;
}

interface ProductBasicInfoProps {
  register: UseFormRegister<ProductInput>;
  setValue: UseFormSetValue<ProductInput>;
  currentCategoryId: string;
  errors: FieldErrors<ProductInput>;
  categories: CategorySelectItem[];
  brands: BrandSelectItem[];
  disabled?: boolean;
}

export function ProductBasicInfo({
  register,
  setValue,
  currentCategoryId,
  errors,
  categories,
  brands,
  disabled = false,
}: ProductBasicInfoProps) {
  // Pisahkan kategori tingkat utama (tanpa parentId)
  const rootCategories = useMemo(
    () => categories.filter((c) => !c.parentId),
    [categories]
  );

  // Cari kategori induk awal jika sedang mengedit produk yang sudah memiliki kategori
  const initialRootId = useMemo(() => {
    if (!currentCategoryId) return '';
    const current = categories.find((c) => c.id === currentCategoryId);
    if (!current) return '';
    return current.parentId || current.id;
  }, [categories, currentCategoryId]);

  const [selectedRootId, setSelectedRootId] = useState<string>(initialRootId);

  // Subkategori yang tersedia sesuai kategori utama yang dipilih
  const availableSubcategories = useMemo(() => {
    if (!selectedRootId) return [];
    return categories.filter((c) => c.parentId === selectedRootId);
  }, [categories, selectedRootId]);

  // Handler saat kategori utama berubah: perbarui root ID dan reset subkategori
  const handleRootChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRootId = e.target.value;
    setSelectedRootId(newRootId);

    if (!newRootId) {
      setValue('categoryId', '', { shouldValidate: true, shouldDirty: true });
      return;
    }

    const subcats = categories.filter((c) => c.parentId === newRootId);
    if (subcats.length === 0) {
      // Jika kategori utama tidak memiliki subkategori, gunakan kategori utama langsung
      setValue('categoryId', newRootId, { shouldValidate: true, shouldDirty: true });
    } else {
      // Reset subkategori jadi kosong sesuai instruksi
      setValue('categoryId', '', { shouldValidate: true, shouldDirty: true });
    }
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subId = e.target.value;
    setValue('categoryId', subId, { shouldValidate: true, shouldDirty: true });
  };

  const isSubcategorySelected = availableSubcategories.some((c) => c.id === currentCategoryId);
  const subcategoryValue = isSubcategorySelected ? currentCategoryId : '';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <div className="border-b border-gray-100 pb-3">
        <h2 className="text-sm font-semibold text-gray-900">Informasi Dasar Produk</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Nama produk, kategori katalog, brand, dan deskripsi produk.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nama Produk */}
        <div className="md:col-span-2">
          <label htmlFor="product-name" className="block text-xs font-semibold text-gray-700 mb-1">
            Nama Produk <span className="text-red-500">*</span>
          </label>
          <input
            id="product-name"
            type="text"
            {...register('name')}
            disabled={disabled}
            placeholder="Contoh: AMD Ryzen 9 5950X 16-Core Desktop Processor"
            className={`w-full rounded border px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
              errors.name
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:border-gray-400 focus:ring-gray-400'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-[11px] text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Kategori Utama */}
        <div>
          <label htmlFor="product-root-category" className="block text-xs font-semibold text-gray-700 mb-1">
            Kategori Utama (Induk) <span className="text-red-500">*</span>
          </label>
          <select
            id="product-root-category"
            value={selectedRootId}
            onChange={handleRootChange}
            disabled={disabled}
            className={`w-full rounded border px-3 py-2 text-xs text-gray-900 bg-white focus:outline-none focus:ring-1 ${
              errors.categoryId && !selectedRootId
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:border-gray-400 focus:ring-gray-400'
            }`}
          >
            <option value="">Pilih Kategori Utama</option>
            {rootCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && !selectedRootId && (
            <p className="mt-1 text-[11px] text-red-600">Kategori utama wajib dipilih.</p>
          )}
        </div>

        {/* Subkategori */}
        <div>
          <label htmlFor="product-subcategory" className="block text-xs font-semibold text-gray-700 mb-1">
            Subkategori <span className="text-red-500">*</span>
          </label>
          <select
            id="product-subcategory"
            value={subcategoryValue}
            onChange={handleSubcategoryChange}
            disabled={disabled || !selectedRootId || availableSubcategories.length === 0}
            className={`w-full rounded border px-3 py-2 text-xs text-gray-900 bg-white focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed ${
              errors.categoryId && selectedRootId && availableSubcategories.length > 0 && !currentCategoryId
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:border-gray-400 focus:ring-gray-400'
            }`}
          >
            <option value="">
              {!selectedRootId
                ? 'Pilih kategori utama terlebih dahulu'
                : availableSubcategories.length === 0
                ? 'Tidak ada subkategori'
                : 'Pilih Subkategori'}
            </option>
            {availableSubcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
          {errors.categoryId && selectedRootId && availableSubcategories.length > 0 && !currentCategoryId && (
            <p className="mt-1 text-[11px] text-red-600">Subkategori wajib dipilih.</p>
          )}
        </div>

        {/* Hidden field terdaftar di react-hook-form untuk categoryId */}
        <input type="hidden" {...register('categoryId')} />

        {/* Brand */}
        <div>
          <label htmlFor="product-brand" className="block text-xs font-semibold text-gray-700 mb-1">
            Brand <span className="text-red-500">*</span>
          </label>
          <select
            id="product-brand"
            {...register('brandId')}
            disabled={disabled}
            className={`w-full rounded border px-3 py-2 text-xs text-gray-900 bg-white focus:outline-none focus:ring-1 ${
              errors.brandId
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:border-gray-400 focus:ring-gray-400'
            }`}
          >
            <option value="">Pilih Brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          {errors.brandId && (
            <p className="mt-1 text-[11px] text-red-600">{errors.brandId.message}</p>
          )}
        </div>

        {/* Informasi Garansi / Spesifikasi Ringkas */}
        <div>
          <label htmlFor="product-warranty" className="block text-xs font-semibold text-gray-700 mb-1">
            Garansi atau Spesifikasi Ringkas (Opsional)
          </label>
          <input
            id="product-warranty"
            type="text"
            {...register('warrantyInfo')}
            disabled={disabled}
            placeholder="Contoh: 3 Tahun Garansi Resmi Distributor"
            className="w-full rounded border border-gray-200 px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
          />
          {errors.warrantyInfo && (
            <p className="mt-1 text-[11px] text-red-600">{errors.warrantyInfo.message}</p>
          )}
        </div>

        {/* Deskripsi */}
        <div className="md:col-span-2">
          <label htmlFor="product-description" className="block text-xs font-semibold text-gray-700 mb-1">
            Deskripsi Produk <span className="text-red-500">*</span>
          </label>
          <textarea
            id="product-description"
            rows={4}
            {...register('description')}
            disabled={disabled}
            placeholder="Rincian fitur teknis, kelebihan, dan kelengkapan produk dalam kemasan..."
            className={`w-full rounded border px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
              errors.description
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:border-gray-400 focus:ring-gray-400'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-[11px] text-red-600">{errors.description.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
