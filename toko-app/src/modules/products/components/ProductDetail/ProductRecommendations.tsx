import Link from "next/link";
import Image from "next/image";
import type { RecommendationProductItem } from "../../types/product";

export interface ProductRecommendationsProps {
  recommendations: RecommendationProductItem[];
  isPreview?: boolean;
}

export default function ProductRecommendations({
  recommendations,
  isPreview = false,
}: ProductRecommendationsProps) {
  return (
    <aside aria-labelledby="recommendations-heading">
      <h2 id="recommendations-heading" className="text-xl font-bold text-gray-900">
        Produk Serupa
      </h2>

      {recommendations.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">Belum ada produk serupa.</p>
      ) : (
        <div className="mt-5 divide-y divide-gray-200">
          {recommendations.map((item) => {
            const targetHref = isPreview
              ? `/admin/products/${item.id}/preview`
              : `/products/${item.id}`;

            return (
              <Link
                key={item.id}
                href={targetHref}
                className="flex gap-4 py-4 first:pt-0 hover:text-blue-700 group transition-colors"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100 border border-gray-200">
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
                  <h3 className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-blue-700">
                    {item.variants[0]
                      ? `Rp ${Number(item.variants[0].price).toLocaleString(
                          "id-ID"
                        )}`
                      : "Harga belum tersedia"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </aside>
  );
}
