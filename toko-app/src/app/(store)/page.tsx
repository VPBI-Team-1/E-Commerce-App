import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  LuTruck,
  LuShield,
  LuHeadphones,
  LuBox,
  LuCircuitBoard,
  LuCpu,
  LuFan,
  LuHardDrive,
  LuKeyboard,
  LuMemoryStick,
  LuMonitor,
  LuZap,
} from "react-icons/lu";
import type { IconType } from "react-icons";
import ProductCard from "@/components/Store/ProductCard";
import Hero from "@/components/Store/Hero";

const benefits = [
  {
    icon: LuTruck,
    title: "Pengiriman Cepat",
    description:
      "Produk dikemas dengan aman dan dikirim secepat mungkin sampai ke tangan kamu.",
  },
  {
    icon: LuShield,
    title: "Produk Original",
    description:
      "Semua produk berasal dari brand terpercaya dan memiliki garansi resmi.",
  },
  {
    icon: LuHeadphones,
    title: "Layanan Pelanggan",
    description:
      "Tim kami siap membantu menjawab pertanyaan dan kebutuhan belanja kamu.",
  },
];

const categoryIcons: Record<string, IconType> = {
  Processor: LuCpu,
  Motherboard: LuCircuitBoard,
  Casing: LuBox,
  VGA: LuMonitor,
  RAM: LuMemoryStick,
  PSU: LuZap,
  Storage: LuHardDrive,
  "Cooler dan Fan": LuFan,
  Monitor: LuMonitor,
  "Keyboard dan Mouse": LuKeyboard,
  Audio: LuHeadphones,
};

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    where: {
      parentId: { not: null },
      products: {
        some: { isArchived: false },
      },
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });

  const products = await prisma.product.findMany({
    where: {
      isArchived: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 12,
    include: {
      variants: {
        orderBy: { price: "asc" },
        take: 1,
      },
      images: {
        orderBy: { isPrimary: "desc" },
        take: 1,
      },
    },
  });

  return (
    <div>
      {/* Hero section */}
      <Hero />

      <section
        aria-labelledby="popular-categories-heading"
        className="mx-auto max-w-7xl px-6 py-12"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              Jelajahi katalog
            </p>
            <h2
              id="popular-categories-heading"
              className="mt-1 text-2xl font-bold text-gray-900"
            >
              Kategori Produk
            </h2>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((category) => {
            const Icon = categoryIcons[category.name] ?? LuBox;

            return (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="group flex min-h-28 flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white p-4 text-center transition-colors hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <Icon
                  aria-hidden="true"
                  className="h-8 w-8 text-blue-700 transition-transform group-hover:scale-110"
                />
                <span className="text-sm font-medium text-gray-800">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* product section */}
      <section id="produk" className="mx-auto max-w-7xl px-6 py-4">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Produk Terbaru
        </h2>

        {products.length === 0 ? (
          <p className="text-gray-500">Belum ada produk tersedia.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
          {benefits.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-lg border border-blue-100 bg-blue-50 p-6"
            >
              <Icon className="h-9 w-9 text-blue-700" />

              <h3 className="mt-5 font-semibold text-blue-950">{title}</h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
