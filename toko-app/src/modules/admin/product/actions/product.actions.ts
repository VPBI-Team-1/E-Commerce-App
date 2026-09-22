'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { productSchema } from '@/schemas/product';
import { storageService } from '@/lib/storage';

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Server Action: Mengunggah gambar produk menggunakan Storage Service (RFC 0004).
 */
export async function uploadProductImageAction(
  formData: FormData
): Promise<ActionResponse<{ url: string }>> {
  const file = formData.get('file');

  if (!file || !(file instanceof File)) {
    return { success: false, error: 'File gambar tidak ditemukan.' };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      success: false,
      error: 'Format file tidak didukung. Gunakan format JPG, PNG, WebP, atau GIF.',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: 'Ukuran file terlalu besar. Batas maksimal adalah 5MB.',
    };
  }

  try {
    const url = await storageService.upload(file, 'products');
    return { success: true, data: { url } };
  } catch (error) {
    console.error('Gagal mengunggah gambar:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan sistem saat mengunggah gambar produk.',
    };
  }
}

/**
 * Server Action: Membuat produk baru beserta varian dan gambarnya.
 */
export async function createProduct(payload: unknown): Promise<ActionResponse<{ id: string }>> {
  const parsed = productSchema.safeParse(payload);
  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || 'Data formulir produk tidak valid.';
    return { success: false, error: errorMessage };
  }

  const { name, description, warrantyInfo, categoryId, brandId, variants, images } = parsed.data;

  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });
    if (!category) {
      return { success: false, error: 'Kategori yang dipilih tidak valid atau tidak ditemukan.' };
    }

    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      select: { id: true },
    });
    if (!brand) {
      return { success: false, error: 'Brand yang dipilih tidak valid atau tidak ditemukan.' };
    }

    const newProduct = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name,
          description,
          warrantyInfo: warrantyInfo || null,
          categoryId,
          brandId,
        },
      });

      await tx.productVariant.createMany({
        data: variants.map((v) => ({
          productId: product.id,
          name: v.name,
          sku: v.sku || null,
          price: v.price,
          stock: v.stock,
        })),
      });

      const hasPrimary = images.some((img) => img.isPrimary);
      await tx.productImage.createMany({
        data: images.map((img, idx) => ({
          productId: product.id,
          url: img.url,
          isPrimary: hasPrimary ? img.isPrimary : idx === 0,
          sortOrder: img.sortOrder ?? idx,
        })),
      });

      return product;
    });

    revalidatePath('/admin/products');
    revalidatePath('/admin');

    return {
      success: true,
      data: { id: newProduct.id },
      message: `Produk "${newProduct.name}" berhasil ditambahkan.`,
    };
  } catch (error) {
    console.error('Error saat membuat produk:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan sistem saat menyimpan produk baru.',
    };
  }
}

/**
 * Server Action: Memperbarui data produk, varian, dan gambarnya.
 */
export async function updateProduct(
  id: string,
  payload: unknown
): Promise<ActionResponse<{ id: string }>> {
  if (!id || typeof id !== 'string' || id.trim() === '') {
    return { success: false, error: 'ID produk tidak valid.' };
  }

  const parsed = productSchema.safeParse(payload);
  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || 'Data formulir produk tidak valid.';
    return { success: false, error: errorMessage };
  }

  const { name, description, warrantyInfo, categoryId, brandId, variants, images } = parsed.data;

  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
      },
    });

    if (!existingProduct) {
      return { success: false, error: 'Produk tidak ditemukan di database.' };
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });
    if (!category) {
      return { success: false, error: 'Kategori yang dipilih tidak valid.' };
    }

    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      select: { id: true },
    });
    if (!brand) {
      return { success: false, error: 'Brand yang dipilih tidak valid.' };
    }

    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: {
          name,
          description,
          warrantyInfo: warrantyInfo || null,
          categoryId,
          brandId,
        },
      });

      const submittedVariantIds = variants
        .map((v) => v.id)
        .filter((vid): vid is string => Boolean(vid));

      const existingVariantIds = existingProduct.variants.map((v) => v.id);
      const variantsToDelete = existingVariantIds.filter(
        (vid) => !submittedVariantIds.includes(vid)
      );

      if (variantsToDelete.length > 0) {
        // Cek keterkaitan dengan pesanan sebelum menghapus varian
        const usedInOrders = await tx.orderItem.findFirst({
          where: { productVariantId: { in: variantsToDelete } },
          select: { id: true },
        });

        if (usedInOrders) {
          throw new Error(
            'Sebagian varian yang dihapus sudah memiliki riwayat pesanan sehingga tidak dapat dihapus permanen.'
          );
        }

        await tx.productVariant.deleteMany({
          where: { id: { in: variantsToDelete } },
        });
      }

      for (const variant of variants) {
        if (variant.id && existingVariantIds.includes(variant.id)) {
          await tx.productVariant.update({
            where: { id: variant.id },
            data: {
              name: variant.name,
              sku: variant.sku || null,
              price: variant.price,
              stock: variant.stock,
            },
          });
        } else {
          await tx.productVariant.create({
            data: {
              productId: id,
              name: variant.name,
              sku: variant.sku || null,
              price: variant.price,
              stock: variant.stock,
            },
          });
        }
      }

      await tx.productImage.deleteMany({
        where: { productId: id },
      });

      const hasPrimary = images.some((img) => img.isPrimary);
      await tx.productImage.createMany({
        data: images.map((img, idx) => ({
          productId: id,
          url: img.url,
          isPrimary: hasPrimary ? img.isPrimary : idx === 0,
          sortOrder: img.sortOrder ?? idx,
        })),
      });
    });

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${id}/edit`);
    revalidatePath('/admin');

    return {
      success: true,
      data: { id },
      message: `Produk "${name}" berhasil diperbarui.`,
    };
  } catch (error) {
    console.error('Error saat memperbarui produk:', error);
    const message =
      error instanceof Error ? error.message : 'Terjadi kesalahan sistem saat memperbarui produk.';
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Server Action: Mengarsipkan atau memulihkan produk (Soft Delete).
 */
export async function archiveProduct(
  productId: string,
  isArchived: boolean = true
): Promise<ActionResponse> {
  if (!productId || typeof productId !== 'string' || productId.trim() === '') {
    return { success: false, error: 'ID produk tidak valid.' };
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, isArchived: true },
    });

    if (!product) {
      return { success: false, error: 'Produk tidak ditemukan di database.' };
    }

    await prisma.product.update({
      where: { id: productId },
      data: { isArchived },
    });

    revalidatePath('/admin/products');
    revalidatePath('/admin');

    const statusText = isArchived ? 'diarsipkan' : 'diaktifkan kembali';
    return {
      success: true,
      message: `Produk "${product.name}" berhasil ${statusText}.`,
    };
  } catch (error) {
    console.error('Error saat memperbarui status arsip produk:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan sistem saat memproses arsip produk.',
    };
  }
}
