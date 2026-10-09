import prisma from '@/lib/prisma';
import { ProductForm, InitialProductData } from '@/modules/admin/product/components/ProductForm';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Edit Produk | ByteStore Admin',
  description: 'Ubah informasi dan konfigurasi produk pada katalog ByteStore.',
};

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        variants: {
          orderBy: { createdAt: 'asc' },
        },
        images: {
          orderBy: [
            { isPrimary: 'desc' },
            { sortOrder: 'asc' },
          ],
        },
      },
    }),
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
    prisma.brand
      .findMany({
        select: { id: true, name: true },
      })
      .then((bList) =>
        bList.sort((a, b) =>
          a.name.localeCompare(b.name, 'id', { sensitivity: 'base' })
        )
      ),
  ]);

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Produk Tidak Ditemukan</h2>
          <p className="text-xs text-gray-500">
            Produk dengan ID &quot;{id}&quot; tidak dapat ditemukan di sistem atau mungkin telah dihapus.
          </p>
          <div>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-blue-700 rounded transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Kembali ke Katalog Produk</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const initialData: InitialProductData = {
    id: product.id,
    name: product.name,
    description: product.description,
    warrantyInfo: product.warrantyInfo,
    categoryId: product.categoryId,
    brandId: product.brandId,
    variants: product.variants.map((v) => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      price: Number(v.price),
      stock: v.stock,
    })),
    images: product.images.map((img) => ({
      id: img.id,
      url: img.url,
      isPrimary: img.isPrimary,
      sortOrder: img.sortOrder,
    })),
  };

  return (
    <ProductForm
      initialData={initialData}
      categories={categories}
      brands={brands}
    />
  );
}
