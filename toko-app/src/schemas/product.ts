import { z } from 'zod';

export const productVariantSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .trim()
    .min(1, 'Nama varian wajib diisi.')
    .max(100, 'Nama varian maksimal 100 karakter.'),
  sku: z.string().trim().max(100, 'SKU maksimal 100 karakter.').nullable().optional(),
  price: z
    .number({ message: 'Harga harus berupa angka.' })
    .positive('Harga harus lebih dari 0.'),
  stock: z
    .number({ message: 'Stok harus berupa angka.' })
    .int('Stok harus berupa bilangan bulat.')
    .min(0, 'Stok tidak boleh bernilai negatif.'),
});

export const productImageSchema = z.object({
  id: z.string().optional(),
  url: z.string().trim().min(1, 'URL gambar tidak boleh kosong.'),
  isPrimary: z.boolean(),
  sortOrder: z.number().int().optional(),
});

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nama produk wajib diisi.')
    .max(100, 'Nama produk maksimal 100 karakter.'),
  description: z
    .string()
    .trim()
    .min(1, 'Deskripsi produk wajib diisi.'),
  warrantyInfo: z
    .string()
    .trim()
    .max(100, 'Informasi garansi maksimal 100 karakter.')
    .nullable()
    .optional(),
  categoryId: z
    .string()
    .trim()
    .min(1, 'Kategori produk wajib dipilih.'),
  brandId: z
    .string()
    .trim()
    .min(1, 'Brand produk wajib dipilih.'),
  variants: z
    .array(productVariantSchema)
    .min(1, 'Produk harus memiliki minimal 1 varian.'),
  images: z
    .array(productImageSchema)
    .min(1, 'Produk harus memiliki minimal 1 gambar.'),
});

export type ProductVariantInput = z.infer<typeof productVariantSchema>;
export type ProductImageInput = z.infer<typeof productImageSchema>;
export type ProductInput = z.infer<typeof productSchema>;
