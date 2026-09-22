import prisma from '@/lib/prisma';
import { ProductForm } from '@/modules/admin/product/components/ProductForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Tambah Produk Baru | ByteStore Admin',
  description: 'Tambah item produk baru ke katalog ByteStore.',
};

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({
      include: {
        parent: {
          select: { name: true },
        },
      },
      orderBy: [
        { parentId: 'asc' },
        { name: 'asc' },
      ],
    }),
    prisma.brand.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  return <ProductForm categories={categories} brands={brands} />;
}
