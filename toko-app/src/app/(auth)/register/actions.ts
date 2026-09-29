"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { resend } from "@/lib/resend";
import { registerSchema, RegisterInput } from "@/schemas/auth";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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

    let verifyToken: string;
    let duplicateToken;
    do {
      verifyToken = generateOTP();
      duplicateToken = await prisma.user.findUnique({
        where: { verified_token: verifyToken },
      });
    } while (duplicateToken);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role || "CUSTOMER",
          is_verified: false,
          verified_token: verifyToken,
          verified_token_expired: expiresAt,
        },
      });

      const { error: sendError } = await resend.emails.send({
        from: "ByteStore <noreply@finance-tracker.store>",
        to: email,
        subject: "Kode OTP Verifikasi Pendaftaran ByteStore",
        html: `
        <div style="font-family: sans-serif; padding: 20px; text-align: center;">
          <h2>Selamat Datang di ByteStore, ${name}!</h2>
          <p>Gunakan kode OTP di bawah ini untuk memverifikasi akun Anda:</p>
          <h1 style="background: #f4f4f4; padding: 12px; letter-spacing: 5px; color: #0070f3; display: inline-block; border-radius: 8px;">${verifyToken}</h1>
          <p style="font-size: 12px; color: #666; margin-top: 15px;">Kode ini berlaku selama 24 jam.</p>
        </div>
      `,
      });

      if (sendError) {
        throw new Error(
          sendError.message || "Gagal mengirimkan email verifikasi.",
        );
      }
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
