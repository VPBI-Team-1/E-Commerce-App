import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

import {
  LuShoppingCart,
  LuZap,
  LuTruck,
  LuShield,
  LuHeadphones,
} from "react-icons/lu";

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
    return <p>Produk tidak ditemukan</p>;
  }

  const mainImage = product.images[0];
  const cheapestVariant = product.variants[0];

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-2">
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

          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-white/70 bg-blue-100/70 px-4 py-2 text-primary font-semibold">
                {product.brand.name}
              </span>

              <span className="rounded-full border border-white/70 bg-blue-100/70 px-4 py-2 text-primary font-semibold">
                {product.category.name}
              </span>
            </div>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            <p className="mt-5 text-2xl font-bold text-blue-600">
              {cheapestVariant
                ? `Rp ${Number(cheapestVariant.price).toLocaleString("id-ID")}`
                : "Harga belum tersedia"}
            </p>

            <p className="mt-6 leading-7 text-gray-600">
              {product.description}
            </p>

            {product.warrantyInfo && (
              <p className="mt-4 text-sm text-gray-600">
                Garansi: {product.warrantyInfo}
              </p>
            )}

            <div className="mt-8">
              <h2 className="font-semibold">Pilihan Varian</h2>

              <div className="mt-3 space-y-2">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                  >
                    <span>{variant.name}</span>
                    <input type="radio" name={product.name} id={product.id} />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Link
                href="/cart"
                className="flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-lg border border-primary text-primary transition-colors hover:border-primary hover:bg-blue-50 hover:text-primary flex-1"
              >
                <LuShoppingCart className="text-2xl" />
                Tambah ke Keranjang
              </Link>

              <Link
                href="/payment"
                className="flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-lg border border-primary bg-primary text-white transition-colors hover:bg-blue-700 flex-1"
              >
                <LuZap className="text-2xl" />
                Pesan Sekarang
              </Link>
            </div>
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
  );
}
