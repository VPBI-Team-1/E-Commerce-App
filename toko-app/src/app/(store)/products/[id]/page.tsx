import prisma from "@/lib/prisma";
import ProductDetailView from "@/modules/products/components/ProductDetail";

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      brand: true,
      category: true,
      variants: {
        orderBy: {
          price: "asc",
        },
      },
      images: {
        orderBy: [
          {
            isPrimary: "desc",
          },
          {
            sortOrder: "asc",
          },
        ],
      },
    },
  });

  if (!product) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-gray-500">Produk tidak ditemukan</p>
      </div>
    );
  }



  const recommendations = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      categoryId: product.categoryId,
      isArchived: false,
    },
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      variants: {
        orderBy: {
          price: "asc",
        },
        take: 1,
      },
      images: {
        orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
        take: 1,
      },
    },
  });

  const serializedProduct = {
    ...product,
    variants: product.variants.map((v) => ({
      ...v,
      price: Number(v.price),
    })),
  };

  const serializedRecommendations = recommendations.map((item) => ({
    ...item,
    variants: item.variants.map((v) => ({
      ...v,
      price: Number(v.price),
    })),
  }));

  return (
    <ProductDetailView
      product={serializedProduct}
      recommendations={serializedRecommendations}
      isPreview={false}
    />
  );
}
