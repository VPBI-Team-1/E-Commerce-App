import prisma from "@/lib/prisma";
import Image from "next/image";
import ProductActions from "@/components/ProductActions";

import { LuTruck, LuShield, LuHeadphones } from "react-icons/lu";
import ProductDetailView from "@/components/Product/ProductDetailView";
import { notFound } from "next/navigation";

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

  const mainImage = product.images[0];

  const serializedVariants = product.variants.map((variant) => ({
    ...variant,
    price: Number(variant.price),
  }));
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Gambar Produk */}
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={product.name}
                fill
                className="object-contain p-8"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                Gambar Produk
              </div>
            )}
          </div>

          {/* Info & Aksi Produk */}
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-white/70 bg-blue-100/70 px-4 py-2 font-semibold text-primary">
                {product.brand.name}
              </span>

              <span className="rounded-full border border-white/70 bg-blue-100/70 px-4 py-2 font-semibold text-primary">
                {product.category.name}
              </span>
            </div>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            <p className="mt-6 leading-7 text-gray-600">
              {product.description}
            </p>

            {product.warrantyInfo && (
              <p className="mt-4 text-sm text-gray-600">
                Garansi: {product.warrantyInfo}
              </p>
            )}

            {/* Komponen Interaktif (Harga, Varian, Jumlah, Tambah ke Keranjang) */}
            <ProductActions
              productId={product.id}
              variants={serializedVariants}
            />
          </div>
        </div>
      </section>

      {/* Featured benefits */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Keunggulan ByteStore
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-blue-950">
            Belanja perangkat dengan lebih tenang
          </h2>

          <p className="mt-4 text-gray-600">
            Kami menyediakan produk original, pengiriman aman, dan dukungan yang
            membantu kebutuhan setup kamu.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-6">
            <LuTruck className="h-9 w-9 text-blue-700" />
            <h3 className="mt-5 font-semibold text-blue-950">
              Pengiriman Cepat
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Produk dikemas dengan aman dan dikirim secepat mungkin sampai ke
              tangan kamu.
            </p>
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50 p-6">
            <LuShield className="h-9 w-9 text-blue-700" />
            <h3 className="mt-5 font-semibold text-blue-950">
              Produk Original
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Semua produk berasal dari brand terpercaya dan memiliki garansi
              resmi.
            </p>
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50 p-6">
            <LuHeadphones className="h-9 w-9 text-blue-700" />
            <h3 className="mt-5 font-semibold text-blue-950">
              Layanan Pelanggan
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Tim kami siap membantu menjawab pertanyaan dan kebutuhan belanja
              kamu.
            </p>
          </div>
        </div>
      </section>
    </>
    notFound();
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
