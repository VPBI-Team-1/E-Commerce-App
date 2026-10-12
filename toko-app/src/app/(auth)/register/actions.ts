"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema, RegisterInput } from "@/schemas/auth";

export async function registerAction(data: RegisterInput) {
  const validatedFields = registerSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Data yang dimasukkan tidak valid." };
  }

  const { name, email, password, role } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email sudah terdaftar!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "CUSTOMER",
        is_verified: true,
        verified_token: null,
        verified_token_expired: null,
      },
    });

    return { success: true, email };
  } catch (error: any) {
    console.error("Register Error:", error);

    return {
      error:
        error.message || "Terjadi kesalahan saat mendaftar. Silakan coba lagi.",
    };
  }
}
