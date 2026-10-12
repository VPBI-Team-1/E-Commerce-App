import prisma from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export interface SyncOrdersResult {
  cancelledCount: number;
  completedCount: number;
}

/**
 * Memeriksa dan membatalkan pesanan PENDING yang telah melewati waktu expiresAt.
 * Mengembalikan stok produk yang terpotong secara atomik via prisma.$transaction.
 */
export async function syncExpiredOrders(userId?: string): Promise<number> {
  const now = new Date();
  const whereClause: {
    status: OrderStatus;
    expiresAt: { lte: Date };
    userId?: string;
  } = {
    status: OrderStatus.PENDING,
    expiresAt: { lte: now },
  };

  if (userId) {
    whereClause.userId = userId;
  }

  const expiredOrders = await prisma.order.findMany({
    where: whereClause,
    include: {
      items: {
        select: { productVariantId: true, quantity: true },
      },
    },
  });

  if (expiredOrders.length === 0) return 0;

  let cancelledCount = 0;

  for (const order of expiredOrders) {
    try {
      await prisma.$transaction(async (tx) => {
        const current = await tx.order.findUnique({
          where: { id: order.id },
          select: { status: true },
        });

        if (!current || current.status !== OrderStatus.PENDING) {
          return;
        }

        await tx.order.update({
          where: { id: order.id },
          data: { status: OrderStatus.CANCELLED },
        });

        for (const item of order.items) {
          if (item.productVariantId) {
            await tx.productVariant.update({
              where: { id: item.productVariantId },
              data: {
                stock: {
                  increment: item.quantity,
                },
              },
            });
          }
        }

        cancelledCount++;
      });
    } catch (error) {
      console.error(`Gagal membatalkan pesanan kedaluwarsa ${order.id}:`, error);
    }
  }

  return cancelledCount;
}

/**
 * Memeriksa dan menyelesaikan pesanan SHIPPED yang telah melewati 24 jam setelah ETA.
 */
export async function syncCompletedOrders(userId?: string): Promise<number> {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const whereClause: {
    status: OrderStatus;
    eta: { not: null; lte: Date };
    userId?: string;
  } = {
    status: OrderStatus.SHIPPED,
    eta: {
      not: null,
      lte: twentyFourHoursAgo,
    },
  };

  if (userId) {
    whereClause.userId = userId;
  }

  const completedCandidates = await prisma.order.findMany({
    where: whereClause,
    select: { id: true },
  });

  if (completedCandidates.length === 0) return 0;

  const result = await prisma.order.updateMany({
    where: {
      id: { in: completedCandidates.map((o) => o.id) },
      status: OrderStatus.SHIPPED,
    },
    data: {
      status: OrderStatus.COMPLETED,
    },
  });

  return result.count;
}

/**
 * Evaluasi cepat untuk satu pesanan spesifik berdasarkan orderId.
 */
export async function syncSingleOrder(orderId: string): Promise<void> {
  if (!orderId) return;

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
      expiresAt: true,
      eta: true,
      items: {
        select: { productVariantId: true, quantity: true },
      },
    },
  });

  if (!order) return;

  if (order.status === OrderStatus.PENDING && order.expiresAt <= now) {
    await prisma.$transaction(async (tx) => {
      const current = await tx.order.findUnique({
        where: { id: order.id },
        select: { status: true },
      });

      if (!current || current.status !== OrderStatus.PENDING) return;

      await tx.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.CANCELLED },
      });

      for (const item of order.items) {
        if (item.productVariantId) {
          await tx.productVariant.update({
            where: { id: item.productVariantId },
            data: {
              stock: { increment: item.quantity },
            },
          });
        }
      }
    });
  } else if (
    order.status === OrderStatus.SHIPPED &&
    order.eta &&
    order.eta <= twentyFourHoursAgo
  ) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.COMPLETED },
    });
  }
}

/**
 * Menjalankan siklus sinkronisasi lengkap (pembatalan dan penyelesaian).
 */
export async function syncOrderLifecycle(options?: {
  userId?: string;
  orderId?: string;
}): Promise<SyncOrdersResult> {
  if (options?.orderId) {
    await syncSingleOrder(options.orderId);
    return { cancelledCount: 0, completedCount: 0 };
  }

  const [cancelledCount, completedCount] = await Promise.all([
    syncExpiredOrders(options?.userId),
    syncCompletedOrders(options?.userId),
  ]);

  return { cancelledCount, completedCount };
}
