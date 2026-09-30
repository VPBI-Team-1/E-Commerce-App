import { z } from "zod";

export const biodataSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama lengkap minimal 2 karakter.")
    .max(100, "Nama lengkap maksimal 100 karakter."),
});

export type BiodataInput = z.infer<typeof biodataSchema>;

export const addressSchema = z.object({
  fullAddress: z
    .string()
    .trim()
    .min(5, "Alamat lengkap minimal 5 karakter.")
    .max(500, "Alamat lengkap maksimal 500 karakter."),
});

export type AddressInput = z.infer<typeof addressSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Kata sandi saat ini wajib diisi."),
    newPassword: z
      .string()
      .min(6, "Kata sandi baru minimal 6 karakter.")
      .max(100, "Kata sandi maksimal 100 karakter."),
    confirmPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi kata sandi baru tidak cocok.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Kata sandi baru tidak boleh sama dengan kata sandi saat ini.",
    path: ["newPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
