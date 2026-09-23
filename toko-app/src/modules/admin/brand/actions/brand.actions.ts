'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { brandSchema } from '@/schemas/brand';

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Server Action: Membuat brand baru dengan validasi schema dan pencegahan duplikasi.
 */
export async function createBrand(
  payload: unknown
): Promise<ActionResponse<{ id: string; name: string }>> {
  const parsed = brandSchema.safeParse(payload);
  if (!parsed.success) {
    const errorMessage =
      parsed.error.issues[0]?.message || 'Data brand tidak valid.';
    return { success: false, error: errorMessage };
  }

  const { name } = parsed.data;

  try {
    const existingBrand = await prisma.brand.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
      },
    });

    if (existingBrand) {
      return {
        success: false,
        error: `Brand dengan nama "${name}" sudah terdaftar.`,
      };
    }

    const created = await prisma.brand.create({
      data: { name },
    });

    revalidatePath('/admin/brands');
    revalidatePath('/admin/products');

    return {
      success: true,
      data: { id: created.id, name: created.name },
      message: `Brand "${created.name}" berhasil ditambahkan.`,
    };
  } catch (error) {
    console.error('Error saat membuat brand:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan pada sistem saat mencoba menambahkan brand.',
    };
  }
}

/**
 * Server Action: Memperbarui nama brand dengan validasi.
 */
export async function updateBrand(
  id: string,
  payload: unknown
): Promise<ActionResponse<{ id: string; name: string }>> {
  if (!id || typeof id !== 'string' || id.trim() === '') {
    return { success: false, error: 'ID brand tidak valid.' };
  }

  const parsed = brandSchema.safeParse(payload);
  if (!parsed.success) {
    const errorMessage =
      parsed.error.issues[0]?.message || 'Data brand tidak valid.';
    return { success: false, error: errorMessage };
  }

  const { name } = parsed.data;

  try {
    const brand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      return { success: false, error: 'Brand tidak ditemukan.' };
    }

    const duplicate = await prisma.brand.findFirst({
      where: {
        id: { not: id },
        name: { equals: name, mode: 'insensitive' },
      },
    });

    if (duplicate) {
      return {
        success: false,
        error: `Brand dengan nama "${name}" sudah digunakan oleh brand lain.`,
      };
    }

    const updated = await prisma.brand.update({
      where: { id },
      data: { name },
    });

    revalidatePath('/admin/brands');
    revalidatePath('/admin/products');

    return {
      success: true,
      data: { id: updated.id, name: updated.name },
      message: `Brand berhasil diperbarui menjadi "${updated.name}".`,
    };
  } catch (error) {
    console.error('Error saat memperbarui brand:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan pada sistem saat mencoba memperbarui brand.',
    };
  }
}

/**
 * Server Action: Menghapus brand produk dengan Guard Clauses.
 * Aturan Bisnis:
 * - Brand yang memiliki produk tidak boleh dihapus (onDelete: Restrict).
 */
export async function deleteBrand(id: string): Promise<ActionResponse> {
  if (!id || typeof id !== 'string' || id.trim() === '') {
    return { success: false, error: 'ID brand tidak valid.' };
  }

  try {
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!brand) {
      return { success: false, error: 'Brand tidak ditemukan.' };
    }

    if (brand._count.products > 0) {
      return {
        success: false,
        error: `Brand "${brand.name}" tidak dapat dihapus karena masih digunakan oleh ${brand._count.products} produk. Silakan hapus atau pindahkan produk terkait terlebih dahulu.`,
      };
    }

    await prisma.brand.delete({
      where: { id },
    });

    revalidatePath('/admin/brands');
    revalidatePath('/admin/products');

    return { success: true, message: `Brand "${brand.name}" berhasil dihapus.` };
  } catch (error) {
    console.error('Error saat menghapus brand:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan pada sistem saat mencoba menghapus brand.',
    };
  }
}
