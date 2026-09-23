import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nama kategori wajib diisi.')
    .max(50, 'Nama kategori maksimal 50 karakter.'),
  parentId: z.string().trim().nullable().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
