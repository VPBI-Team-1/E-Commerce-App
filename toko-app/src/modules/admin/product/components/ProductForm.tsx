'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductInput } from '@/schemas/product';
import { createProduct, updateProduct } from '../actions/product.actions';
import { ProductBasicInfo, CategorySelectItem, BrandSelectItem } from './ProductBasicInfo';
import { ProductVariantManager } from './ProductVariantManager';
import { ProductImageUploader } from './ProductImageUploader';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export interface InitialProductData {
  id: string;
  name: string;
  description: string;
  warrantyInfo: string | null;
  categoryId: string;
  brandId: string;
  variants: {
    id?: string;
    name: string;
    sku?: string | null;
    price: number;
    stock: number;
  }[];
  images: {
    id?: string;
    url: string;
    isPrimary: boolean;
    sortOrder?: number;
  }[];
}

interface ProductFormProps {
  initialData?: InitialProductData;
  categories: CategorySelectItem[];
  brands: BrandSelectItem[];
}

export function ProductForm({
  initialData,
  categories,
  brands,
}: ProductFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isEditMode = Boolean(initialData);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          warrantyInfo: initialData.warrantyInfo || null,
          categoryId: initialData.categoryId,
          brandId: initialData.brandId,
          variants: initialData.variants.map((v) => ({
            id: v.id,
            name: v.name,
            sku: v.sku || null,
            price: Number(v.price),
            stock: Number(v.stock),
          })),
          images: initialData.images.map((img, idx) => ({
            id: img.id,
            url: img.url,
            isPrimary: img.isPrimary,
            sortOrder: img.sortOrder ?? idx,
          })),
        }
      : {
          name: '',
          description: '',
          warrantyInfo: null,
          categoryId: '',
          brandId: '',
          variants: [
            {
              name: 'Standar',
              sku: '',
              price: 0,
              stock: 0,
            },
          ],
          images: [],
        },
  });

  const currentCategoryId = useWatch({
    control,
    name: 'categoryId',
  }) ?? '';

  const watchedImages = useWatch({
    control,
    name: 'images',
  }) ?? [];

  const handleImagesChange = (newImages: typeof watchedImages) => {
    setValue('images', newImages, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = (data: ProductInput) => {
    setServerError(null);

    startTransition(async () => {
      const response = isEditMode && initialData
        ? await updateProduct(initialData.id, data)
        : await createProduct(data);

      if (!response.success) {
        setServerError(response.error || 'Terjadi kesalahan saat memproses formulir.');
        return;
      }

      router.push('/admin/products');
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="p-2 rounded border border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          title="Kembali ke Katalog Produk"
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {isEditMode ? 'Edit Data Produk' : 'Tambah Produk Baru'}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {isEditMode
              ? `Perbarui informasi, harga varian, dan galeri untuk "${initialData?.name}".`
              : 'Lengkapi rincian produk untuk ditambahkan ke katalog toko ByteStore.'}
          </p>
        </div>
      </div>

      {serverError && (
        <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-xs text-red-700">
          <p className="font-semibold mb-0.5">Gagal Menyimpan Produk</p>
          <p>{serverError}</p>
        </div>
      )}

      {/* Bagian 1: Informasi Dasar */}
      <ProductBasicInfo
        register={register}
        setValue={setValue}
        currentCategoryId={currentCategoryId}
        errors={errors}
        categories={categories}
        brands={brands}
        disabled={isPending}
      />

      {/* Bagian 2: Varian, Harga & Stok */}
      <ProductVariantManager
        control={control}
        register={register}
        errors={errors}
        disabled={isPending}
      />

      {/* Bagian 3: Unggah Galeri Foto */}
      <ProductImageUploader
        images={watchedImages}
        onChange={handleImagesChange}
        errorMessage={errors.images?.message}
        disabled={isPending}
      />

      {/* Bottom Sticky Action Bar on Mobile / Desktop Footer */}
      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-200">
        <Link
          href="/admin/products"
          className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Batal
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 text-xs font-semibold text-white bg-primary rounded hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isPending
            ? 'Menyimpan...'
            : isEditMode
            ? 'Perbarui Produk'
            : 'Simpan Produk'}
        </button>
      </div>
    </form>
  );
}
