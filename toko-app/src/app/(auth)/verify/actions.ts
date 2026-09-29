"use server";

import prisma from "@/lib/prisma";

export async function verifyOtpAction(email: string, otp: string) {
  if (!email || !otp) {
    return { error: "Email dan Kode OTP wajib diisi!" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "User tidak ditemukan!" };
    }

    if (user.is_verified) {
      return { error: "Akun ini sudah terverifikasi. Silakan login." };
    }

    if (user.verified_token !== otp) {
      return { error: "Kode OTP yang Anda masukkan salah!" };
    }

    if (
      user.verified_token_expired &&
      user.verified_token_expired < new Date()
    ) {
      return { error: "Kode OTP sudah kedaluwarsa. Silakan minta kode baru." };
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: {
          is_verified: true,
          verified_token: null,
          verified_token_expired: null,
        },
      });
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error: any) {
    console.error("Detail Verify OTP Error:", error?.message || error);

    return {
      error:
        error?.message || "Terjadi kesalahan saat memproses verifikasi OTP.",
    };
  }
}
