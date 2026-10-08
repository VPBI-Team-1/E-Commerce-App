import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/Store/ProductCard";
import SearchFilters from "./SearchFilters";

type SearchPageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string | string[];
    brand?: string | string[];
    minPrice?: string;
    maxPrice?: string;
    available?: string;
  }>;
};

function toStringArray(value?: string | string[]) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function parsePrice(value?: string) {
  if (!value) return undefined;

  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : undefined;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const searchTerm = params.search?.trim() ?? "";

  const selectedCategoryIds = toStringArray(params.category);
  const selectedBrandIds = toStringArray(params.brand);
  const minPrice = parsePrice(params.minPrice);
  const maxPrice = parsePrice(params.maxPrice);
  const availableOnly = params.available === "true";

  const variantWhere: Prisma.ProductVariantWhereInput = {};

  if (minPrice !== undefined || maxPrice !== undefined) {
    variantWhere.price = {
      ...(minPrice !== undefined ? { gte: minPrice } : {}),
      ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
    };
  }

  if (availableOnly) {
    variantWhere.stock = { gt: 0 };
  }

  const hasVariantFilter = Object.keys(variantWhere).length > 0;

  const matchingProducts = {
    isArchived: false,
    name: {
      contains: searchTerm,
      mode: "insensitive" as const,
    },
  };

  const [categories, brands] = searchTerm
    ? await Promise.all([
        prisma.category.findMany({
          where: {
            products: { some: matchingProducts },
          },
          orderBy: { name: "asc" },
        }),
        prisma.brand.findMany({
          where: {
            products: { some: matchingProducts },
          },
          orderBy: { name: "asc" },
        }),
      ])
    : [[], []];

  const products = searchTerm
    ? await prisma.product.findMany({
        where: {
          isArchived: false,
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
          ...(selectedCategoryIds.length > 0
            ? { categoryId: { in: selectedCategoryIds } }
            : {}),
          ...(selectedBrandIds.length > 0
            ? { brandId: { in: selectedBrandIds } }
            : {}),
          ...(hasVariantFilter ? { variants: { some: variantWhere } } : {}),
        },
        include: {
          variants: {
            where: hasVariantFilter ? variantWhere : undefined,
            orderBy: { price: "asc" },
            take: 1,
          },
          images: {
            orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
            take: 1,
          },
        },
      })
    : [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold">
        {searchTerm ? (
          <>
            Hasil pencarian untuk{" "}
            <span className="text-primary">&quot;{searchTerm}&quot;</span>
          </>
        ) : (
          "Masukkan kata kunci untuk mencari produk"
        )}
      </h1>

      {searchTerm && products.length > 0 && (
        <p className="mt-2 text-sm text-gray-500">
          Menampilkan {products.length} produk dari gudang e-commerce
        </p>
      )}

      {/* search filter */}
      {searchTerm &&
        (products.length === 0 ? (
          <p className="mt-2 text-gray-600">
            Tidak ada produk yang cocok dengan kata kunci &quot;{searchTerm}
            &quot;.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
            <SearchFilters
              searchTerm={searchTerm}
              selectedCategoryIds={selectedCategoryIds}
              selectedBrandIds={selectedBrandIds}
              minPrice={minPrice}
              maxPrice={maxPrice}
              categories={categories}
              brands={brands}
            />

            {/* product card */}
            <section aria-label="Hasil Produk">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    productId={product.id}
                    name={product.name}
                    imageUrl={product.images[0]?.url ?? null}
                    price={
                      product.variants[0]
                        ? Number(product.variants[0].price)
                        : null
                    }
                  />
                ))}
              </div>
            </section>
          </div>
        ))}
    </div>
  );
}
