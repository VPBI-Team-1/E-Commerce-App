'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { categorySchema } from '@/schemas/category';

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Server Action: Membuat kategori atau subkategori baru.
 */
export async function createCategory(payload: unknown): Promise<ActionResponse> {
  const parsed = categorySchema.safeParse(payload);
  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || 'Data kategori tidak valid.';
    return { success: false, error: errorMessage };
  }

  const { name } = parsed.data;
  const parentId = parsed.data.parentId && parsed.data.parentId.trim() !== '' ? parsed.data.parentId.trim() : null;

  try {
    if (parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: parentId },
      });
      if (!parent) {
        return { success: false, error: 'Kategori induk tidak ditemukan.' };
      }
    }

    const existingCategory = await prisma.category.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        parentId: parentId,
      },
    });

    if (existingCategory) {
      return {
        success: false,
        error: parentId
          ? `Subkategori "${name}" sudah terdaftar pada kategori induk ini.`
          : `Kategori utama "${name}" sudah terdaftar.`,
      };
    }

    const created = await prisma.category.create({
      data: {
        name,
        parentId,
      },
    });

    revalidatePath('/admin/categories');
    revalidatePath('/admin/subcategories');
    revalidatePath('/admin/products');
    revalidatePath('/admin');

    return {
      success: true,
      data: created,
      message: `Kategori "${created.name}" berhasil dibuat.`,
    };
  } catch (error) {
    console.error('Error saat membuat kategori:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan sistem saat membuat kategori.',
    };
  }
}

/**
 * Server Action: Mengubah nama atau hierarki kategori.
 */
export async function updateCategory(
  id: string,
  payload: unknown
): Promise<ActionResponse> {
  if (!id || typeof id !== 'string' || id.trim() === '') {
    return { success: false, error: 'ID kategori tidak valid.' };
  }

  const parsed = categorySchema.safeParse(payload);
  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || 'Data kategori tidak valid.';
    return { success: false, error: errorMessage };
  }

  const { name } = parsed.data;
  const parentId = parsed.data.parentId && parsed.data.parentId.trim() !== '' ? parsed.data.parentId.trim() : null;

  if (parentId === id) {
    return {
      success: false,
      error: 'Kategori tidak dapat menjadi induk bagi dirinya sendiri.',
    };
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { children: true },
        },
      },
    });

    if (!category) {
      return { success: false, error: 'Kategori tidak ditemukan.' };
    }

    if (parentId && category._count.children > 0) {
      return {
        success: false,
        error: 'Kategori utama yang memiliki subkategori tidak dapat diubah menjadi subkategori.',
      };
    }

    if (parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: parentId },
      });
      if (!parent) {
        return { success: false, error: 'Kategori induk tidak ditemukan.' };
      }
    }

    const duplicate = await prisma.category.findFirst({
      where: {
        id: { not: id },
        name: { equals: name, mode: 'insensitive' },
        parentId: parentId,
      },
    });

    if (duplicate) {
      return {
        success: false,
        error: `Nama kategori "${name}" sudah digunakan pada tingkat hierarki ini.`,
      };
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name,
        parentId,
      },
    });

    revalidatePath('/admin/categories');
    revalidatePath('/admin/subcategories');
    revalidatePath('/admin/products');
    revalidatePath('/admin');

    return {
      success: true,
      data: updated,
      message: `Kategori "${updated.name}" berhasil diperbarui.`,
    };
  } catch (error) {
    console.error('Error saat memperbarui kategori:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan sistem saat memperbarui kategori.',
    };
  }
}

/**
 * Server Action: Menghapus kategori produk dengan Guard Clauses.
 */
export async function deleteCategory(id: string): Promise<ActionResponse> {
  if (!id || typeof id !== 'string' || id.trim() === '') {
    return { success: false, error: 'ID kategori tidak valid.' };
  }

  try {
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

    if (category._count.children > 0) {
      return {
        success: false,
        error: `Kategori "${category.name}" tidak dapat dihapus karena masih memuat ${category._count.children} subkategori. Silakan hapus atau pindahkan subkategori terkait terlebih dahulu.`,
      };
    }

    if (category._count.products > 0) {
      return {
        success: false,
        error: `Kategori "${category.name}" tidak dapat dihapus karena masih memuat ${category._count.products} produk. Silakan hapus atau pindahkan produk terkait terlebih dahulu.`,
      };
    }

    await prisma.category.delete({
      where: { id },
    });

    revalidatePath('/admin/categories');
    revalidatePath('/admin/subcategories');
    revalidatePath('/admin/products');
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
