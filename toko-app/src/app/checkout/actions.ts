"use server";

import prisma from "@/lib/prisma"; // sesuaikan path prisma client Anda
import { getOrCreateCart, getCartItems } from "../cart/actions";

export interface ShippingAddressInput {
  fullAddress: string;
}

export async function createOrderAction(data: {
  shippingAddress:
    | string
    | ShippingAddressInput
    | { fullAddress: string; [key: string]: unknown };
  courier: string;
}) {
  try {
    const cartRes = await getOrCreateCart();
    if (!cartRes.success || !cartRes.data) {
      return { success: false, message: "Keranjang tidak ditemukan" };
    }

    const cartId = cartRes.data.id;
    const userId = cartRes.data.userId;

    if (!userId) {
      return { success: false, message: "Pengguna tidak terautentikasi" };
    }

    const itemsRes = await getCartItems(cartId);
    if (!itemsRes.success || !itemsRes.data || itemsRes.data.length === 0) {
      return { success: false, message: "Keranjang belanja kosong" };
    }

    const cartItems = itemsRes.data;

    // Validate stock
    for (const item of cartItems) {
      const stock = item.variant?.stock || 0;
      if (stock < item.quantity) {
        const productName = item.variant?.product?.name || "Produk";
        return {
          success: false,
          message: `Stok ${productName} tidak mencukupi`,
        };
      }
    }

    const subtotal = cartItems.reduce((acc: number, item: any) => {
      const price = item.variant?.price ? Number(item.variant.price) : 0;
      return acc + price * item.quantity;
    }, 0);

    let shippingFee = 0;

    const totalAmount = subtotal + shippingFee;

    const invoiceNumber = `INV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const fullAddress =
      typeof data.shippingAddress === "string"
        ? data.shippingAddress.trim()
        : String(
            data.shippingAddress?.fullAddress ||
              (data.shippingAddress as Record<string, unknown>)?.address ||
              "",
          ).trim();

    if (!fullAddress) {
      return {
        success: false,
        message: "Alamat pengiriman wajib dipilih atau diisi.",
      };
    }

    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          invoiceNumber,
          userId,
          status: "PENDING",
          totalAmount,
          courier: data.courier,
          shippingAddress: { fullAddress },
          expiresAt,
          items: {
            create: cartItems.map((item: any) => ({
              productVariantId: item.variantId || item.variant?.id,
              productName: item.variant?.product?.name || "Produk",
              price: item.variant?.price ? Number(item.variant.price) : 0,
              quantity: item.quantity,
              subtotal:
                (item.variant?.price ? Number(item.variant.price) : 0) *
                item.quantity,
            })),
          },
        },
      });

      for (const item of cartItems) {
        const variantId = item.variantId || item.variant?.id;
        if (variantId) {
          await tx.productVariant.update({
            where: { id: variantId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      await tx.cartItem.deleteMany({
        where: { cartId },
      });

      return order;
    });

    return {
      success: true,
      message: "Pesanan berhasil dibuat",
      data: { orderId: newOrder.id, invoiceNumber: newOrder.invoiceNumber },
    };
  } catch (error: any) {
    console.error("Error creating order:", error);
    return {
      success: false,
      message: error.message || "Gagal membuat pesanan",
    };
  }
}
