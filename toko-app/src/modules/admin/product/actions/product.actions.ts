'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface ActionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Server Action: Mengarsipkan atau memulihkan produk (Soft Delete).
 * Sesuai aturan bisnis, produk yang pernah dibeli tidak boleh di-hard delete,
 * melainkan disembunyikan menggunakan flag isArchived.
 */
export async function archiveProduct(
  productId: string,
  isArchived: boolean = true
): Promise<ActionResponse> {
  // Guard Clause 1: Validasi ID produk
  if (!productId || typeof productId !== 'string' || productId.trim() === '') {
    return { success: false, error: 'ID produk tidak valid.' };
  }

  try {
    // Guard Clause 2: Cek keberadaan produk di database
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, isArchived: true },
    });

    if (!product) {
      return { success: false, error: 'Produk tidak ditemukan di database.' };
    }

    // Eksekusi update flag isArchived
    await prisma.product.update({
      where: { id: productId },
      data: { isArchived },
    });

    // Revalidasi halaman admin
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
