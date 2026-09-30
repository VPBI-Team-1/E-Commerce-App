export interface ProductVariantItem {
  id: string;
  name: string;
  sku?: string | null;
  price: number;
  stock: number;
}

export interface ProductImageItem {
  id: string;
  url: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface ProductDetailData {
  id: string;
  name: string;
  description: string;
  warrantyInfo: string | null;
  brand: {
    name: string;
  };
  category: {
    name: string;
  };
  variants: ProductVariantItem[];
  images: ProductImageItem[];
}

export interface RecommendationProductItem {
  id: string;
  name: string;
  images: Array<{
    url: string;
  }>;
  variants: Array<{
    price: number;
  }>;
}
