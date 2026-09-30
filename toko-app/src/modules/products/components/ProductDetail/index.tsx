import type { ProductDetailData, RecommendationProductItem } from "../../types/product";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductSpecs from "./ProductSpecs";
import ProductRecommendations from "./ProductRecommendations";

export interface ProductDetailViewProps {
  product: ProductDetailData;
  recommendations?: RecommendationProductItem[];
  isPreview?: boolean;
}

export default function ProductDetailView({
  product,
  recommendations = [],
  isPreview = false,
}: ProductDetailViewProps) {
  return (
    <div className="py-4">
      <section className="mx-auto max-w-7xl p-6 bg-white rounded-lg shadow-xs">
        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery images={product.images} name={product.name} />
          <ProductInfo product={product} isPreview={isPreview} />
        </div>
      </section>

      <section className="mt-4 bg-white rounded-lg mx-auto grid max-w-7xl gap-12 p-6 shadow-xs lg:grid-cols-[minmax(0,1fr)_320px]">
        <ProductSpecs product={product} />
        <ProductRecommendations
          recommendations={recommendations}
          isPreview={isPreview}
        />
      </section>
    </div>
  );
}
