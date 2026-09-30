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
} from "@/schemas/user";

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

    // Cek apakah user sudah punya alamat
    const addressCount = await prisma.address.count({
      where: { userId: auth.userId },
    });

    // Jika ini adalah alamat pertama, otomatis set default = true
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

    // Validasi kepemilikan alamat
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

    // Validasi kepemilikan alamat
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

      // Jika alamat yang dihapus adalah alamat default, angkat alamat lain yang tersisa menjadi default
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

    // Validasi kepemilikan alamat
    const target = await prisma.address.findUnique({
      where: { id },
    });

    if (!target || target.userId !== auth.userId) {
      return { success: false, message: "Alamat tidak ditemukan atau akses ditolak." };
    }

    if (target.isDefault) {
      return { success: true, message: "Alamat ini sudah menjadi alamat utama." };
    }

    // Gunakan Prisma Transaction: set semua alamat user menjadi false, lalu target menjadi true
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
        items: true,
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


