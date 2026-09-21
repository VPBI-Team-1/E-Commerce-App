'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface ActionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Server Action: Menghapus brand produk dengan Guard Clauses.
 * Aturan Bisnis:
 * - Brand yang memiliki produk tidak boleh dihapus (onDelete: Restrict).
 */
export async function deleteBrand(id: string): Promise<ActionResponse> {
  // Guard Clause 1: Validasi ID tidak boleh kosong
  if (!id || typeof id !== 'string' || id.trim() === '') {
    return { success: false, error: 'ID brand tidak valid.' };
  }

  try {
    // Guard Clause 2: Pastikan brand ada di database
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

    // Guard Clause 3: Cek relasi produk (onDelete: Restrict)
    if (brand._count.products > 0) {
      return {
        success: false,
        error: `Brand "${brand.name}" tidak dapat dihapus karena masih digunakan oleh ${brand._count.products} produk. Silakan hapus atau pindahkan produk terkait terlebih dahulu.`,
      };
    }

    // Eksekusi penghapusan
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
