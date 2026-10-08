"use server";

import { verifyAccessToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { ProductVariant } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

type CartType = {
  productId: string;
  productVariantId: string;
  qty: number;
};

async function getAuthenticatedUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  const payload = await verifyAccessToken(token);
  if (!payload || !payload.userId) return null;

  return payload.userId as string;
}

export async function getOrCreateCart() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return { success: false, error: "Silakan login terlebih dahulu" };
  }

  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
        updatedAt: new Date(),
      },
    });
  }

  return {
    success: true,
    message: "Berhasil memuat keranjang",
    data: cart,
  };
}

// menghitung keranjang milik pengguna yang sedang login (keperluan menampilkan jumlah item di header)
export async function getCartItemCount(): Promise<
  { success: true; count: number } | { success: false; count: 0; error: string }
> {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return {
        success: false,
        count: 0,
        error: "Silakan login terlebih dahulu",
      };
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!cart) {
      return { success: true, count: 0 };
    }

    const result = await prisma.cartItem.aggregate({
      where: { cartId: cart.id },
      _sum: {
        quantity: true,
      },
    });

    return {
      success: true,
      count: result._sum.quantity ?? 0,
    };
  } catch (error) {
    console.error("Error fetching cart item count: ", error);
    return {
      success: false,
      count: 0,
      error: "Gagal menghitung jumlah barang di keranjang",
    };
  }
}

export async function getCartItems(cartId: string) {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { cartId },
      include: {
        variant: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const serializedCartItems = JSON.parse(JSON.stringify(cartItems));

    return {
      success: true,
      message: "Berhasil memuat barang di keranjang",
      data: serializedCartItems,
    };
  } catch (error) {
    console.error("Error fetching barang keranjang: ", error);
    return {
      success: false,
      message: "Gagal memuat barang di keranjang",
      data: [],
    };
  }
}

export async function addCartItems(data: CartType) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return { success: false, error: "Silakan login terlebih dahulu" };
    }

    const quantityToAdd = data.qty > 0 ? data.qty : 1;

    const result = await prisma.$transaction(async (tx) => {
      const [productVariant] = await tx.$queryRaw<ProductVariant[]>`
        SELECT * FROM "ProductVariant" WHERE id = ${data.productVariantId} FOR UPDATE
      `;

      if (!productVariant || productVariant.productId !== data.productId) {
        throw new Error("Jenis produk ini tidak ditemukan");
      }

      if (productVariant.stock < quantityToAdd) {
        throw new Error(
          `Produk ${productVariant.name} hanya tersisa ${productVariant.stock}`,
        );
      }

      let cart = await tx.cart.findFirst({
        where: { userId },
      });

      if (!cart) {
        cart = await tx.cart.create({
          data: { userId },
        });
      }

      const existingCartItem = await tx.cartItem.findUnique({
        where: {
          cartId_productVariantId: {
            cartId: cart.id,
            productVariantId: data.productVariantId,
          },
        },
      });

      const currentQtyInCart = existingCartItem ? existingCartItem.quantity : 0;
      const totalRequestedQty = currentQtyInCart + quantityToAdd;

      if (productVariant.stock < totalRequestedQty) {
        throw new Error(
          `Stok tidak mencukupi. Tersisa ${productVariant.stock}, tetapi di keranjang Anda sudah ada ${currentQtyInCart}`,
        );
      }

      const cartItem = await tx.cartItem.upsert({
        where: {
          cartId_productVariantId: {
            cartId: cart.id,
            productVariantId: data.productVariantId,
          },
        },
        update: {
          quantity: {
            increment: quantityToAdd,
          },
        },
        create: {
          cartId: cart.id,
          productVariantId: data.productVariantId,
          quantity: quantityToAdd,
        },
      });

      return cartItem;
    });

    const serializedData = JSON.parse(JSON.stringify(result));
    revalidatePath("/cart");

    return {
      success: true,
      message: "Berhasil menambahkan produk ke keranjang",
      data: serializedData,
    };
  } catch (error) {
    console.error("Cart Action Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Gagal menambahkan ke keranjang",
    };
  }
}

export async function updateCartItemQuantityAction(
  cartItemId: string,
  newQuantity: number,
) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return { success: false, error: "Silakan login terlebih dahulu" };
    }

    if (newQuantity < 1) {
      return { success: false, error: "Jumlah barang minimal 1" };
    }

    const updatedItem = await prisma.$transaction(async (tx) => {
      const cartItem = await tx.cartItem.findUnique({
        where: { id: cartItemId },
        include: {
          cart: true,
          variant: true,
        },
      });

      if (!cartItem || cartItem.cart.userId !== userId) {
        throw new Error("Item keranjang tidak ditemukan atau akses ditolak");
      }

      if (cartItem.variant.stock < newQuantity) {
        throw new Error(`Stok produk hanya tersisa ${cartItem.variant.stock}`);
      }

      return await tx.cartItem.update({
        where: { id: cartItemId },
        data: { quantity: newQuantity },
      });
    });

    const serializedUpdatedItem = JSON.parse(JSON.stringify(updatedItem));

    revalidatePath("/cart");

    return {
      success: true,
      message: "Kuantitas berhasil diperbarui",
      data: serializedUpdatedItem,
    };
  } catch (error) {
    console.error("Update Cart Item Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Gagal mengubah kuantitas item",
    };
  }
}

export async function removeCartItemAction(cartItemId: string) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return { success: false, error: "Silakan login terlebih dahulu" };
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      return {
        success: false,
        error: "Item tidak ditemukan atau akses ditolak",
      };
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    revalidatePath("/cart");

    return {
      success: true,
      message: "Item berhasil dihapus dari keranjang",
    };
  } catch (error) {
    console.error("Remove Cart Item Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gagal menghapus item",
    };
  }
}
