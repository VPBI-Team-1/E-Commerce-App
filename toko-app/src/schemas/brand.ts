import { z } from 'zod';

export const brandSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nama brand wajib diisi.')
    .max(100, 'Nama brand maksimal 100 karakter.'),
});

export type BrandInput = z.infer<typeof brandSchema>;
