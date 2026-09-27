"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { loginSchema, LoginInput } from "@/schemas/auth";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";

export async function loginAction(data: LoginInput) {
  const validatedFields = loginSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Data yang dimasukkan tidak valid." };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "Email atau password salah!" };
    }

    // 3. Verifikasi Password Hash dengan Bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { error: "Email atau password salah!" };
    }

    if (!user.is_verified) {
      return {
        error: "Tolong verifikasi email anda sebelum login.",
        needsVerification: true,
        email: user.email,
      };
    }

    const accessToken = await signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = await signRefreshToken({ userId: user.id });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        id: crypto.randomUUID(),
        userId: user.id,
        token: refreshToken,
        expiresAt: expiresAt,
      },
    });

    const cookieStore = await cookies();

    cookieStore.set("session", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15,
      path: "/",
    });

    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
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
  } catch (error) {
    console.error("Login Error:", error);
    return { error: "Terjadi kesalahan pada server. Silakan coba lagi." };
  }
}
