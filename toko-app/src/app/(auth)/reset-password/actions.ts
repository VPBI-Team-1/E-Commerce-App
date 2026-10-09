"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function resetPasswordAction(token: string, newPassword: string) {
  if (!token || !newPassword) {
    return { error: "Token dan password baru wajib diisi" };
  }

  if (newPassword.length < 6) {
    return { error: "Password minimal 6 karakter" };
  }
  const user = await prisma.user.findFirst({
    where: {
      reset_pass_token: token,
    },
  });

  if (!user) {
    return { error: "Token reset password tidak valid atau sudah kadaluwarsa" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      reset_pass_token: null,
    },
  });

  return {
    success: true,
    message: "Password berhasil diperbarui, silakan login",
  };
}
