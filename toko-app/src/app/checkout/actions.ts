"use server";

import prisma from "@/lib/prisma"; // sesuaikan path prisma client Anda
import { getOrCreateCart, getCartItems } from "../cart/actions";

export interface ShippingAddressInput {
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export async function createOrderAction(data: {
  shippingAddress: ShippingAddressInput;
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

    const subtotal = cartItems.reduce((acc: number, item: any) => {
      const price = item.variant?.price ? Number(item.variant.price) : 0;
      return acc + price * item.quantity;
    }, 0);

    const shippingFee = data.courier === "JNE Express" ? 20000 : 15000;
    const totalAmount = subtotal + shippingFee;

    const invoiceNumber = `INV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          invoiceNumber,
          userId,
          status: "PENDING",
          totalAmount,
          courier: data.courier,
          shippingAddress: data.shippingAddress as any,
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
