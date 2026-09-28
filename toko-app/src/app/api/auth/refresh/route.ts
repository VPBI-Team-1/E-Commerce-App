import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyRefreshToken, signAccessToken } from "@/lib/jwt";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token tidak ditemukan" },
        { status: 401 },
      );
    }

    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        { error: "Refresh token tidak valid atau expired" },
        { status: 401 },
      );
    }

    const savedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { User: true },
    });

    if (!savedToken || savedToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Refresh token tidak terdaftar atau sudah kedaluwarsa" },
        { status: 401 },
      );
    }

    const newAccessToken = await signAccessToken({
      userId: savedToken.User.id,
      email: savedToken.User.email,
      role: savedToken.User.role,
    });

    cookieStore.set("session", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Token berhasil diperbarui",
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
