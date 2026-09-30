"use server";

import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import {
  biodataSchema,
  addressSchema,
  changePasswordSchema,
  BiodataInput,
  AddressInput,
  ChangePasswordInput,
} from "@/modules/account/schemas/account.schema";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  const payload = await verifyAccessToken(token);
  if (!payload || !payload.userId) return null;

  return {
    userId: payload.userId as string,
    email: payload.email as string,
    role: (payload.role as string) || "CUSTOMER",
  };
}

export async function updateProfile(data: BiodataInput) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return { success: false, message: "Sesi telah berakhir, silakan login kembali." };
    }

    const validation = biodataSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        message: validation.error.issues[0]?.message || "Data profil tidak valid.",
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id: auth.userId },
      data: { name: validation.data.name },
      select: { id: true, name: true, email: true },
    });

    revalidatePath("/profile");

    return {
      success: true,
      message: "Profil berhasil diperbarui.",
      data: updatedUser,
    };
  } catch (error: unknown) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal memperbarui profil.",
    };
  }
}

export async function getAddresses() {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return { success: false, message: "Sesi telah berakhir, silakan login kembali.", data: [] };
    }

    const addresses = await prisma.address.findMany({
      where: { userId: auth.userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return {
      success: true,
      data: addresses,
    };
  } catch (error: unknown) {
    console.error("Error fetching addresses:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal memuat daftar alamat.",
      data: [],
    };
  }
}

export async function addAddress(data: AddressInput) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return { success: false, message: "Sesi telah berakhir, silakan login kembali." };
    }

    const validation = addressSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        message: validation.error.issues[0]?.message || "Alamat lengkap tidak valid.",
      };
    }

    const fullAddress = validation.data.fullAddress;

    const addressCount = await prisma.address.count({
      where: { userId: auth.userId },
    });

    const isFirstAddress = addressCount === 0;

    const newAddress = await prisma.address.create({
      data: {
        userId: auth.userId,
        fullAddress,
        isDefault: isFirstAddress,
      },
    });

    revalidatePath("/profile");

    return {
      success: true,
      message: isFirstAddress
        ? "Alamat berhasil ditambahkan sebagai alamat utama."
        : "Alamat berhasil ditambahkan.",
      data: newAddress,
    };
  } catch (error: unknown) {
    console.error("Error adding address:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menambahkan alamat.",
    };
  }
}

export async function updateAddress(id: string, data: AddressInput) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return { success: false, message: "Sesi telah berakhir, silakan login kembali." };
    }

    const validation = addressSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        message: validation.error.issues[0]?.message || "Alamat lengkap tidak valid.",
      };
    }

    const fullAddress = validation.data.fullAddress;

    const existing = await prisma.address.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== auth.userId) {
      return { success: false, message: "Alamat tidak ditemukan atau akses ditolak." };
    }

    const updated = await prisma.address.update({
      where: { id },
      data: { fullAddress },
    });

    revalidatePath("/profile");

    return {
      success: true,
      message: "Alamat berhasil diperbarui.",
      data: updated,
    };
  } catch (error: unknown) {
    console.error("Error updating address:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal memperbarui alamat.",
    };
  }
}

export async function deleteAddress(id: string) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return { success: false, message: "Sesi telah berakhir, silakan login kembali." };
    }

    const existing = await prisma.address.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== auth.userId) {
      return { success: false, message: "Alamat tidak ditemukan atau akses ditolak." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.address.delete({
        where: { id },
      });

      if (existing.isDefault) {
        const remaining = await tx.address.findFirst({
          where: { userId: auth.userId },
          orderBy: { createdAt: "desc" },
        });

        if (remaining) {
          await tx.address.update({
            where: { id: remaining.id },
            data: { isDefault: true },
          });
        }
      }
    });

    revalidatePath("/profile");

    return {
      success: true,
      message: "Alamat berhasil dihapus.",
    };
  } catch (error: unknown) {
    console.error("Error deleting address:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menghapus alamat.",
    };
  }
}

export async function setDefaultAddress(id: string) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return { success: false, message: "Sesi telah berakhir, silakan login kembali." };
    }

    const target = await prisma.address.findUnique({
      where: { id },
    });

    if (!target || target.userId !== auth.userId) {
      return { success: false, message: "Alamat tidak ditemukan atau akses ditolak." };
    }

    if (target.isDefault) {
      return { success: true, message: "Alamat ini sudah menjadi alamat utama." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.address.updateMany({
        where: { userId: auth.userId },
        data: { isDefault: false },
      });

      await tx.address.update({
        where: { id },
        data: { isDefault: true },
      });
    });

    revalidatePath("/profile");

    return {
      success: true,
      message: "Alamat utama berhasil diperbarui.",
    };
  } catch (error: unknown) {
    console.error("Error setting default address:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal mengubah alamat utama.",
    };
  }
}

export async function getUserOrders() {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return { success: false, message: "Sesi telah berakhir, silakan login kembali.", data: [] };
    }

    const orders = await prisma.order.findMany({
      where: { userId: auth.userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: {
                      orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const serializedOrders = JSON.parse(JSON.stringify(orders));

    return {
      success: true,
      data: serializedOrders,
    };
  } catch (error: unknown) {
    console.error("Error fetching user orders:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal memuat daftar pesanan.",
      data: [],
    };
  }
}

export async function changePassword(data: ChangePasswordInput) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return { success: false, message: "Sesi telah berakhir, silakan login kembali." };
    }

    const validation = changePasswordSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        message: validation.error.issues[0]?.message || "Data kata sandi tidak valid.",
      };
    }

    const { currentPassword, newPassword } = validation.data;

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { password: true },
    });

    if (!user) {
      return { success: false, message: "Pengguna tidak ditemukan." };
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return { success: false, message: "Kata sandi saat ini tidak cocok." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: auth.userId },
      data: { password: hashedPassword },
    });

    return {
      success: true,
      message: "Kata sandi berhasil diperbarui.",
    };
  } catch (error: unknown) {
    console.error("Error changing password:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal mengubah kata sandi.",
    };
  }
}

export async function getUserOrderDetail(orderId: string) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return { success: false, message: "Sesi telah berakhir, silakan login kembali." };
    }

    if (!orderId || typeof orderId !== "string") {
      return { success: false, message: "ID pesanan tidak valid." };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: {
                      orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return { success: false, message: "Pesanan tidak ditemukan." };
    }

    // Security check: Must belong to user
    if (order.userId !== auth.userId) {
      return { success: false, message: "Anda tidak memiliki akses ke pesanan ini." };
    }

    const serializedOrder = JSON.parse(JSON.stringify(order));

    return {
      success: true,
      data: serializedOrder,
    };
  } catch (error: unknown) {
    console.error("Error fetching order detail:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal memuat detail pesanan.",
    };
  }
}

export async function confirmOrderPayment(orderId: string) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return { success: false, message: "Sesi telah berakhir, silakan login kembali." };
    }

    if (!orderId || typeof orderId !== "string") {
      return { success: false, message: "ID pesanan tidak valid." };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        userId: true,
        status: true,
        invoiceNumber: true,
      },
    });

    if (!order) {
      return { success: false, message: "Pesanan tidak ditemukan." };
    }

    // Security check: Must belong to user
    if (order.userId !== auth.userId) {
      return { success: false, message: "Akses ditolak. Pesanan bukan milik Anda." };
    }

    // Only PENDING orders can be confirmed
    if (order.status !== "PENDING") {
      return {
        success: false,
        message: "Hanya pesanan berstatus Menunggu Pembayaran yang dapat dikonfirmasi pembayarannya.",
      };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "VERIFYING" },
    });

    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    return {
      success: true,
      message: `Konfirmasi pembayaran untuk ${order.invoiceNumber} berhasil dikirim. Menunggu verifikasi admin.`,
    };
  } catch (error: unknown) {
    console.error("Error confirming order payment:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal mengonfirmasi pembayaran.",
    };
  }
}

export async function cancelUserOrder(orderId: string) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return { success: false, message: "Sesi telah berakhir, silakan login kembali." };
    }

    if (!orderId || typeof orderId !== "string") {
      return { success: false, message: "ID pesanan tidak valid." };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          select: { productVariantId: true, quantity: true },
        },
      },
    });

    if (!order) {
      return { success: false, message: "Pesanan tidak ditemukan." };
    }

    // Security check: Must belong to user
    if (order.userId !== auth.userId) {
      return { success: false, message: "Akses ditolak. Pesanan bukan milik Anda." };
    }

    // Only PENDING orders can be cancelled by customer
    if (order.status !== "PENDING") {
      return {
        success: false,
        message: "Hanya pesanan yang masih berstatus Menunggu Pembayaran yang dapat dibatalkan.",
      };
    }

    // Atomic transaction: update status and restore stock
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
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
    });

    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    return {
      success: true,
      message: `Pesanan ${order.invoiceNumber} berhasil dibatalkan.`,
    };
  } catch (error: unknown) {
    console.error("Error cancelling order:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal membatalkan pesanan.",
    };
  }
}

export async function completeUserOrder(orderId: string) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return { success: false, message: "Sesi telah berakhir, silakan login kembali." };
    }

    if (!orderId || typeof orderId !== "string") {
      return { success: false, message: "ID pesanan tidak valid." };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        userId: true,
        status: true,
        invoiceNumber: true,
      },
    });

    if (!order) {
      return { success: false, message: "Pesanan tidak ditemukan." };
    }

    // Security check: Must belong to user
    if (order.userId !== auth.userId) {
      return { success: false, message: "Akses ditolak. Pesanan bukan milik Anda." };
    }

    // Only SHIPPED orders can be completed by customer
    if (order.status !== "SHIPPED") {
      return {
        success: false,
        message: "Hanya pesanan yang sedang dikirim yang dapat diselesaikan.",
      };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "COMPLETED" },
    });

    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    return {
      success: true,
      message: `Pesanan ${order.invoiceNumber} telah selesai. Terima kasih telah berbelanja di ByteStore!`,
    };
  } catch (error: unknown) {
    console.error("Error completing order:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menyelesaikan pesanan.",
    };
  }
}

