'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { OrderStatus } from '@prisma/client';

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Memverifikasi pembayaran manual oleh admin.
 * Mengubah status pesanan dari VERIFYING menjadi PAID.
 */
export async function verifyPayment(orderId: string): Promise<ActionResponse> {
  if (!orderId || typeof orderId !== 'string') {
    return { success: false, error: 'ID pesanan tidak valid.' };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, status: true, invoiceNumber: true },
    });

    if (!order) {
      return { success: false, error: 'Pesanan tidak ditemukan.' };
    }

    if (order.status !== OrderStatus.VERIFYING) {
      return {
        success: false,
        error: 'Hanya pesanan dengan status Menunggu Verifikasi yang dapat disetujui pembayarannya.',
      };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.PAID },
    });

    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);

    return {
      success: true,
      message: `Pembayaran pesanan ${order.invoiceNumber} berhasil disetujui.`,
    };
  } catch (error) {
    console.error('Gagal verifikasi pembayaran:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan sistem saat memverifikasi pembayaran.',
    };
  }
}

/**
 * Memproses pengiriman barang untuk pesanan yang sudah lunas (PAID).
 * Mengubah status ke SHIPPED, menghasilkan nomor resi tiruan, dan menghitung ETA.
 */
export async function shipOrder(orderId: string): Promise<ActionResponse> {
  if (!orderId || typeof orderId !== 'string') {
    return { success: false, error: 'ID pesanan tidak valid.' };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, status: true, courier: true, invoiceNumber: true },
    });

    if (!order) {
      return { success: false, error: 'Pesanan tidak ditemukan.' };
    }

    if (order.status !== OrderStatus.PAID) {
      return {
        success: false,
        error: 'Hanya pesanan berstatus Lunas yang dapat diproses untuk pengiriman barang.',
      };
    }

    const isCargo = order.courier.toLowerCase().includes('cargo');
    const courierCode = isCargo ? 'CRG' : 'STD';
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const trackingNumber = `BS-${courierCode}-${Date.now().toString().slice(-6)}${randomSuffix}`;

    // Rumus PRD: Cargo +7 hari, Standard +3 hari dari waktu pengiriman
    const additionalDays = isCargo ? 7 : 3;
    const eta = new Date(Date.now() + additionalDays * 24 * 60 * 60 * 1000);

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.SHIPPED,
        trackingNumber,
        eta,
      },
    });

    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);

    return {
      success: true,
      message: `Pesanan ${order.invoiceNumber} berhasil dikirim dengan resi ${trackingNumber}.`,
    };
  } catch (error) {
    console.error('Gagal memproses pengiriman pesanan:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan sistem saat memproses pengiriman barang.',
    };
  }
}

/**
 * Membatalkan pesanan dan mengembalikan kuantitas stok produk terkait (restock).
 */
export async function cancelOrder(orderId: string): Promise<ActionResponse> {
  if (!orderId || typeof orderId !== 'string') {
    return { success: false, error: 'ID pesanan tidak valid.' };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          select: { productVariantId: true, quantity: true },
        },
      },
    });

    if (!order) {
      return { success: false, error: 'Pesanan tidak ditemukan.' };
    }

    if (
      order.status === OrderStatus.SHIPPED ||
      order.status === OrderStatus.COMPLETED ||
      order.status === OrderStatus.CANCELLED
    ) {
      return {
        success: false,
        error: `Pesanan dengan status ${order.status} tidak dapat dibatalkan.`,
      };
    }

    // Transaksi atomik untuk pembatalan pesanan dan pengembalian stok barang
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
      });

      for (const item of order.items) {
        await tx.productVariant.update({
          where: { id: item.productVariantId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
    });

    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);

    return {
      success: true,
      message: `Pesanan ${order.invoiceNumber} berhasil dibatalkan dan stok telah dikembalikan ke etalase.`,
    };
  } catch (error) {
    console.error('Gagal membatalkan pesanan:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan sistem saat membatalkan pesanan.',
    };
  }
}
