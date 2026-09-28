import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

import {
  LuShoppingCart,
  LuZap,
  LuTruck,
  LuShieldCheck,
  LuHeadphones,
} from "react-icons/lu";
import QuantitySelector from "./QuantitySelector";

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

  const mainImage = product.images[0];
  const cheapestVariant = product.variants[0];

  const totalStock = product.variants.reduce(
    (total, variant) => total + variant.stock,
    0,
  );

  const isAvailable = totalStock > 0;

  return (
    <div className="py-4">
      {/* gambar dan tombol navigasi */}
      <section className="mx-auto max-w-7xl p-6 bg-white rounded-lg">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-50">
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-6 sm:p-10"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">
                Gambar Produk
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                {product.brand.name}
              </span>

              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
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

            <div className="mt-5 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isAvailable ? "bg-green-500" : "bg-red-500"
                }`}
              />

              <span
                className={`text-sm font-medium ${
                  isAvailable ? "text-green-700" : "text-red-700"
                }`}
              >
                {isAvailable ? `Stok tersedia (${totalStock})` : "Stok habis"}
              </span>
            </div>

            {product.warrantyInfo && (
              <p className="mt-4 text-sm text-gray-600">
                Garansi: {product.warrantyInfo}
              </p>
            )}

            <fieldset className="mt-8">
              <legend className="text-sm font-semibold text-gray-900">
                Pilihan Varian
              </legend>

              <div className="mt-3 space-y-2">
                {product.variants.map((variant) => (
                  <label
                    key={variant.id}
                    htmlFor={`variant-${variant.id}`}
                    className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 ${
                      variant.stock === 0
                        ? "cursor-not-allowed bg-gray-50 opacity-60"
                        : ""
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block font-medium text-gray-900">
                        {variant.name}
                      </span>

                      <span className="mt-1 block text-sm text-gray-500">
                        {variant.stock > 0
                          ? `Stok ${variant.stock} unit`
                          : "Stok habis"}
                      </span>
                    </span>

                    <span className="flex shrink-0 items-center gap-3">
                      <span className="text-right text-sm font-semibold text-gray-900">
                        Rp {Number(variant.price).toLocaleString("id-ID")}
                      </span>

                      <input
                        id={`variant-${variant.id}`}
                        type="radio"
                        name="variantId"
                        value={variant.id}
                        disabled={variant.stock === 0}
                        className="h-4 w-4 accent-blue-700"
                      />
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <QuantitySelector stock={cheapestVariant?.stock ?? 0} />

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link
                href="/cart"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-blue-700 px-4 py-3 text-center text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
              >
                <LuShoppingCart className="h-5 w-5 shrink-0" />
                Tambah ke Keranjang
              </Link>

              <Link
                href="/payment"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-800"
              >
                <LuZap className="h-5 w-5 shrink-0" />
                Pesan Sekarang
              </Link>
            </div>

            <div className="mt-8 grid gap-4 border-t border-gray-200 pt-6 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <span className="rounded-full bg-blue-50 p-2 text-blue-800">
                  <LuTruck className="h-5 w-5" />
                </span>

                <div className="text-sm">
                  <p className="font-semibold text-gray-900">
                    Pengiriman Cepat
                  </p>
                  <p className="mt-1 text-gray-500">1-3 hari kerja</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="rounded-full bg-blue-50 p-2 text-blue-800">
                  <LuShieldCheck className="h-5 w-5" />
                </span>

                <div className="text-sm">
                  <p className="font-semibold text-gray-900">Produk Original</p>
                  <p className="mt-1 text-gray-500">Garansi resmi</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="rounded-full bg-blue-50 p-2 text-blue-800">
                  <LuHeadphones className="h-5 w-5" />
                </span>

                <div className="text-sm">
                  <p className="font-semibold text-gray-900">
                    Layanan Pelanggan
                  </p>
                  <p className="mt-1 text-gray-500">Siap membantu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deskripsi dan spesifikasi */}
      <section className="mt-4 bg-white rounded-lg mx-auto grid max-w-7xl gap-12 p-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-10">
          <section aria-labelledby="specifications-heading">
            <h2
              id="specifications-heading"
              className="text-xl font-bold text-gray-900"
            >
              Informasi Produk
            </h2>

            <dl className="mt-5 divide-y divide-gray-200 border-y border-gray-200">
              <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-4 py-3 text-sm sm:grid-cols-[160px_minmax(0,1fr)]">
                <dt className="text-gray-500">Kategori</dt>
                <dd className="font-medium text-gray-900">
                  {product.category.name}
                </dd>
              </div>

              <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-4 py-3 text-sm sm:grid-cols-[160px_minmax(0,1fr)]">
                <dt className="text-gray-500">Brand</dt>
                <dd className="font-medium text-gray-900">
                  {product.brand.name}
                </dd>
              </div>

              <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-4 py-3 text-sm sm:grid-cols-[160px_minmax(0,1fr)]">
                <dt className="text-gray-500">Jumlah varian</dt>
                <dd className="font-medium text-gray-900">
                  {product.variants.length} varian
                </dd>
              </div>

              <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-4 py-3 text-sm sm:grid-cols-[160px_minmax(0,1fr)]">
                <dt className="text-gray-500">Total stok</dt>
                <dd className="font-medium text-gray-900">{totalStock} unit</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="warranty-heading">
            <h2
              id="warranty-heading"
              className="text-xl font-bold text-gray-900"
            >
              Garansi
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              {product.warrantyInfo || "Informasi garansi belum tersedia."}
            </p>
          </section>

          <section aria-labelledby="description-heading">
            <h2
              id="description-heading"
              className="text-xl font-bold text-gray-900"
            >
              Deskripsi Produk
            </h2>

            <p className="mt-3 whitespace-pre-line leading-7 text-gray-600">
              {product.description}
            </p>
          </section>
        </div>

        <aside aria-labelledby="recommendations-heading">
          <h2
            id="recommendations-heading"
            className="text-xl font-bold text-gray-900"
          >
            Produk Serupa
          </h2>

          {recommendations.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">
              Belum ada produk serupa.
            </p>
          ) : (
            <div className="mt-5 divide-y divide-gray-200">
              {recommendations.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="flex gap-4 py-4 first:pt-0 hover:text-blue-700"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100">
                    {item.images[0] ? (
                      <Image
                        src={item.images[0].url}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center text-xs text-gray-500">
                        Tanpa gambar
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="line-clamp-2 text-sm font-medium text-gray-900">
                      {item.name}
                    </h3>

                    <p className="mt-2 text-sm font-semibold text-blue-700">
                      {item.variants[0]
                        ? `Rp ${Number(item.variants[0].price).toLocaleString("id-ID")}`
                        : "Harga belum tersedia"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}
