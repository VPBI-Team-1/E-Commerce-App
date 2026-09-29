import prisma from "@/lib/prisma";
import ProductDetailView from "@/components/Product/ProductDetailView";
import { AdminBackButton } from "@/modules/admin/components/AdminBackButton";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Preview Produk | ByteStore Admin",
  description: "Pratinjau tampilan detail produk untuk admin ByteStore.",
};

type ProductPreviewPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPreviewPage({
  params,
}: ProductPreviewPageProps) {
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
    notFound();
  }

  // Ambil rekomendasi produk serupa dalam kategori yang sama
  const recommendations = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      categoryId: product.categoryId,
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

  // Pastikan Decimal dikonversi ke Number agar serializable ke client component
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
    <div className="space-y-6">
      {/* Bar Navigasi dan Info Preview Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <AdminBackButton label="Kembali" href="/admin/products" />
          <div className="h-6 w-px bg-gray-200 hidden sm:block" />
          <div>
            <h1 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <span>Preview:</span>
              <span className="text-blue-600 truncate max-w-sm">{product.name}</span>
            </h1>
            <p className="text-xs text-gray-500">
              Pratinjau tampilan detail produk dari sudut pandang customer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
              product.isArchived
                ? "bg-amber-100 text-amber-800"
                : "bg-emerald-100 text-emerald-800"
            }`}
          >
            Status: {product.isArchived ? "Diarsipkan" : "Aktif"}
          </span>
        </div>
      </div>

      {/* Kontainer Kanvas Preview */}
      <div className="bg-gray-50 rounded-xl p-3 sm:p-6 border border-gray-200">
        <ProductDetailView
          product={serializedProduct}
          recommendations={serializedRecommendations}
          isPreview={true}
        />
      </div>
    </div>
  );
}
