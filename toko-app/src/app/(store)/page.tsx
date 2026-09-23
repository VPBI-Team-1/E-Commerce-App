import Image from "next/image";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { LuTruck, LuShield, LuHeadphones } from "react-icons/lu";

type HomePageProps = {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    sort?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const brands = await prisma.brand.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const products = await prisma.product.findMany({
    where: {
      isArchived: false,
      ...(params.category
        ? {
            categoryId: params.category,
          }
        : {}),
      ...(params.brand
        ? {
            brandId: params.brand,
          }
        : {}),
    },
    orderBy: {
      createdAt: params.sort === "oldest" ? "asc" : "desc",
    },
    take: 12,
    include: {
      variants: {
        orderBy: {
          price: "asc",
        },
        take: 1,
      },
      images: {
        orderBy: {
          isPrimary: "desc",
        },
        take: 1,
      },
    },
  });

  return (
    <>
      {/* Hero section */}
      <section className="relative isolate min-h-105 overflow-hidden text-blue-950 sm:min-h-115 lg:min-h-130">
        <Image
          src="/hero.jpg"
          alt="Setup komputer ByteStore"
          fill
          priority
          className="object-cover object-left sm:object-center"
        />

        <div className="absolute inset-0 bg-white/20" />

        <div className="relative z-10 mx-auto flex min-h-105 max-w-7xl items-center px-6 py-12 sm:min-h-115 lg:min-h-130">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700 shadow-md backdrop-blur-sm sm:text-sm">
              Toko Produk & Periferal Komputer
            </p>

            <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Upgrade Setup, Tingkatkan Performa
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-blue-950 sm:text-lg">
              Temukan berbagai komponen PC dan periferal terbaik untuk kebutuhan
              gaming, kerja, dan sehari-hari.
            </p>

            <a
              href="#produk"
              className="mt-7 inline-flex rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Jelajahi Produk
            </a>
          </div>
        </div>
      </section>

      {/* product section */}
      <section id="produk" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
          <form
            method="get"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
              Kategori
              <select
                name="category"
                defaultValue={params.category ?? ""}
                className="h-11 rounded-md border border-gray-300 bg-white px-3 font-normal outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Semua Kategori</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
              Brand
              <select
                name="brand"
                defaultValue={params.brand ?? ""}
                className="h-11 rounded-md border border-gray-300 bg-white px-3 font-normal outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Semua Brand</option>

                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
              Urutkan
              <select
                name="sort"
                defaultValue={params.sort ?? "latest"}
                className="h-11 rounded-md border border-gray-300 bg-white px-3 font-normal outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="latest">Terbaru</option>
                <option value="oldest">Terlama</option>
              </select>
            </label>

            <div className="flex items-end gap-3">
              <button
                type="submit"
                className="h-11 flex-1 rounded-md bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Terapkan
              </button>

              <Link
                href="/"
                className="flex h-11 items-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Reset
              </Link>
            </div>
          </form>
        </div>

        {products.length === 0 ? (
          <p className="text-gray-500">Belum ada produk tersedia.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-gray-100 sm:aspect-square">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      className="object-contain p-5 transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500">
                      Gambar Produk
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <h3 className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-gray-900">
                    {product.name}
                  </h3>

                  <p className="mt-3 text-lg font-bold text-blue-600">
                    {product.variants[0]
                      ? `Rp ${Number(product.variants[0].price).toLocaleString(
                          "id-ID",
                        )}`
                      : "Harga belum tersedia"}
                  </p>

                  <Link
                    href={`/products/${product.id}`}
                    className="mt-5 block rounded-lg bg-gray-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Pesan Sekarang
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
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
