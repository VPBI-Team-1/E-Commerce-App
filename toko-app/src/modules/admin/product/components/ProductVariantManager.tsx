'use client';

import { useFieldArray, Control, UseFormRegister, FieldErrors, Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { ProductInput } from '@/schemas/product';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ProductVariantManagerProps {
  control: Control<ProductInput>;
  register: UseFormRegister<ProductInput>;
  errors: FieldErrors<ProductInput>;
  disabled?: boolean;
}

export function ProductVariantManager({
  control,
  register,
  errors,
  disabled = false,
}: ProductVariantManagerProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  const handleAddVariant = () => {
    append({
      name: `Varian ${fields.length + 1}`,
      sku: '',
      price: 0,
      stock: 0,
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Varian, Harga &amp; Stok</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Kelola harga dasar dan stok inventaris melalui varian produk. Minimal 1 varian aktif.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddVariant}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <PlusIcon className="w-4 h-4 text-gray-500" />
          <span>Tambah Varian</span>
        </button>
      </div>

      {errors.variants?.root && (
        <p className="text-xs text-red-600">{errors.variants.root.message}</p>
      )}
      {errors.variants?.message && (
        <p className="text-xs text-red-600">{errors.variants.message}</p>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => {
          const variantErrors = errors.variants?.[index];

          return (
            <div
              key={field.id}
              className="p-4 rounded border border-gray-200 bg-gray-50/50 space-y-3 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700">
                  Varian #{index + 1}
                </span>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={disabled}
                    title="Hapus Varian"
                    className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Nama Varian */}
                <div>
                  <label
                    htmlFor={`variant-name-${index}`}
                    className="block text-[11px] font-medium text-gray-600 mb-1"
                  >
                    Nama Varian <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={`variant-name-${index}`}
                    type="text"
                    {...register(`variants.${index}.name`)}
                    disabled={disabled}
                    placeholder="Contoh: Standar atau Hitam"
                    className={`w-full rounded border px-3 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:ring-1 ${
                      variantErrors?.name
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-200 focus:border-gray-400 focus:ring-gray-400'
                    }`}
                  />
                  {variantErrors?.name && (
                    <p className="mt-1 text-[10px] text-red-600">
                      {variantErrors.name.message}
                    </p>
                  )}
                </div>

                {/* SKU */}
                <div>
                  <label
                    htmlFor={`variant-sku-${index}`}
                    className="block text-[11px] font-medium text-gray-600 mb-1"
                  >
                    SKU (Opsional)
                  </label>
                  <input
                    id={`variant-sku-${index}`}
                    type="text"
                    {...register(`variants.${index}.sku`)}
                    disabled={disabled}
                    placeholder="Contoh: RYZ-5950X-BOX"
                    className="w-full rounded border border-gray-200 px-3 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                  />
                  {variantErrors?.sku && (
                    <p className="mt-1 text-[10px] text-red-600">
                      {variantErrors.sku.message}
                    </p>
                  )}
                </div>

                {/* Harga Dasar / Varian */}
                <div>
                  <label
                    htmlFor={`variant-price-${index}`}
                    className="block text-[11px] font-medium text-gray-600 mb-1"
                  >
                    Harga (IDR) <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name={`variants.${index}.price`}
                    control={control}
                    render={({ field }) => (
                      <NumericFormat
                        id={`variant-price-${index}`}
                        value={field.value > 0 ? field.value : ''}
                        onValueChange={(values) => {
                          field.onChange(values.floatValue ?? 0);
                        }}
                        onBlur={field.onBlur}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="Rp "
                        allowNegative={false}
                        decimalScale={0}
                        disabled={disabled}
                        placeholder="Rp 0"
                        className={`w-full rounded border px-3 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:ring-1 ${
                          variantErrors?.price
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-200 focus:border-gray-400 focus:ring-gray-400'
                        }`}
                      />
                    )}
                  />
                  {variantErrors?.price && (
                    <p className="mt-1 text-[10px] text-red-600">
                      {variantErrors.price.message}
                    </p>
                  )}
                </div>

                {/* Jumlah Stok */}
                <div>
                  <label
                    htmlFor={`variant-stock-${index}`}
                    className="block text-[11px] font-medium text-gray-600 mb-1"
                  >
                    Stok Inventaris <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={`variant-stock-${index}`}
                    type="number"
                    min="0"
                    step="1"
                    {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                    disabled={disabled}
                    placeholder="0"
                    className={`w-full rounded border px-3 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:ring-1 ${
                      variantErrors?.stock
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-200 focus:border-gray-400 focus:ring-gray-400'
                    }`}
                  />
                  {variantErrors?.stock && (
                    <p className="mt-1 text-[10px] text-red-600">
                      {variantErrors.stock.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
