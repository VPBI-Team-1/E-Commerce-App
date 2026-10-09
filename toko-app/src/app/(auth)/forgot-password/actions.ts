"use server";

import prisma from "@/lib/prisma";
import { resend } from "@/lib/resend";

export async function forgotPasswordAction(email: string) {
  if (!email) {
    return { error: "Email wajib diisi" };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "User dengan email tersebut tidak ditemukan" };
  }

  const resetToken = crypto.randomUUID();

  await prisma.user.update({
    where: { email },
    data: {
      reset_pass_token: resetToken,
    },
  });

  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

  const { error: sendError } = await resend.emails.send({
    from: "ByteStore <noreply@finance-tracker.store>",
    to: email,
    subject: "Reset Password Anda - ByteStore",
    html: `
      <div style="font-family: sans-serif; padding: 20px; text-align: center;">
        <h2>Reset Password ByteStore</h2>
        <p>Halo, ${user.name || "Pelanggan"}!</p>
        <p>Kami menerima permintaan untuk mereset password akun Anda. Klik tombol di bawah untuk melanjutkan:</p>
        <a href="${resetLink}" style="background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 15px 0;">Reset Password</a>
        <p style="font-size: 12px; color: #666; margin-top: 15px;">Jika Anda tidak merasa meminta reset password, abaikan email ini.</p>
      </div>
    `,
  });

  if (sendError) {
    return { error: "Gagal mengirim email reset password" };
  }

  return { success: true, message: "Email reset password berhasil dikirim" };
}
