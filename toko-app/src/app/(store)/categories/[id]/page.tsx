import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/Store/ProductCard";

type CategoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      parent: {
        select: { id: true, name: true },
      },
      children: {
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      },
    },
  });

  if (!category) {
    notFound();
  }

  const categoryIds = [
    category.id,
    ...category.children.map((child) => child.id),
  ];

  const products = await prisma.product.findMany({
    where: {
      isArchived: false,
      categoryId: { in: categoryIds },
    },
    orderBy: { createdAt: "desc" },
    include: {
      variants: {
        orderBy: { price: "asc" },
        take: 1,
      },
      images: {
        orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
        take: 1,
      },
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-900">
          Beranda
        </Link>
        <span aria-hidden="true"> / </span>

        {category.parent && (
          <>
            <Link
              href={`/categories/${category.parent.id}`}
              className="hover:text-gray-900"
            >
              {category.parent.name}
            </Link>
            <span aria-hidden="true"> / </span>
          </>
        )}

        <span aria-current="page">{category.name}</span>
      </nav>

      <header className="mt-4">
        <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>

        <p className="mt-2 text-sm text-gray-600">{products.length} produk</p>
      </header>

      {products.length === 0 ? (
        <p className="mt-8 text-gray-600">
          Belum ada produk tersedia di kategori ini.
        </p>
      ) : (
        <section
          aria-label={`Produk kategori ${category.name}`}
          className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              productId={product.id}
              name={product.name}
              imageUrl={product.images[0]?.url ?? null}
              price={
                product.variants[0] ? Number(product.variants[0].price) : null
              }
            />
          ))}
        </section>
      )}
    </div>
  );
}
