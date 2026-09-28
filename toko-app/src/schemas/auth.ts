import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi.")
    .email("Format email tidak valid."),
  password: z
    .string()
    .min(1, "Password wajib diisi.")
    .min(3, "Password minimal 3 karakter."),
  role: z.enum(["CUSTOMER", "ADMIN"]),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama wajib diisi.")
    .max(100, "Nama maksimal 100 karakter."),
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi.")
    .email("Format email tidak valid."),
  password: z
    .string()
    .min(1, "Password wajib diisi.")
    .min(6, "Password minimal 6 karakter."),
  role: z.enum(["CUSTOMER", "ADMIN"]),
});

export type RegisterInput = z.infer<typeof registerSchema>;
