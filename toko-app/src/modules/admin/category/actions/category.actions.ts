'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface ActionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Server Action: Menghapus kategori produk dengan Guard Clauses.
 * Aturan Bisnis:
 * - Kategori yang memiliki produk tidak boleh dihapus (onDelete: Restrict).
 */
export async function deleteCategory(id: string): Promise<ActionResponse> {
  // Guard Clause 1: Validasi ID tidak boleh kosong
  if (!id || typeof id !== 'string' || id.trim() === '') {
    return { success: false, error: 'ID kategori tidak valid.' };
  }

  try {
    // Guard Clause 2: Pastikan kategori ada di database
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      return { success: false, error: 'Kategori tidak ditemukan.' };
    }

    // Guard Clause 3: Cek relasi subkategori
    if (category._count.children > 0) {
      return {
        success: false,
        error: `Kategori "${category.name}" tidak dapat dihapus karena masih memuat ${category._count.children} subkategori. Silakan hapus atau pindahkan subkategori terkait terlebih dahulu.`,
      };
    }

    // Guard Clause 4: Cek relasi produk (onDelete: Restrict)
    if (category._count.products > 0) {
      return {
        success: false,
        error: `Kategori "${category.name}" tidak dapat dihapus karena masih memuat ${category._count.products} produk. Silakan hapus atau pindahkan produk terkait terlebih dahulu.`,
      };
    }

    // Eksekusi penghapusan
    await prisma.category.delete({
      where: { id },
    });

    // Revalidasi cache halaman kategori dan subkategori
    revalidatePath('/admin/categories');
    revalidatePath('/admin/subcategories');
    revalidatePath('/admin');

    return {
      success: true,
      message: `Kategori "${category.name}" berhasil dihapus.`,
    };
  } catch (error) {
    console.error('Error saat menghapus kategori:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan sistem saat mencoba menghapus kategori.',
    };
  }
}
