import type { ProductDetailData } from "../../types/product";

export interface ProductSpecsProps {
  product: ProductDetailData;
}

export default function ProductSpecs({ product }: ProductSpecsProps) {
  const totalStock = product.variants.reduce(
    (total, variant) => total + variant.stock,
    0
  );

  return (
    <div className="space-y-10">
      <section aria-labelledby="specifications-heading">
        <h2 id="specifications-heading" className="text-xl font-bold text-gray-900">
          Informasi Produk
        </h2>
        <dl className="mt-5 divide-y divide-gray-200 border-y border-gray-200">
          <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-4 py-3 text-sm sm:grid-cols-[160px_minmax(0,1fr)]">
            <dt className="text-gray-500">Kategori</dt>
            <dd className="font-medium text-gray-900">{product.category.name}</dd>
          </div>
          <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-4 py-3 text-sm sm:grid-cols-[160px_minmax(0,1fr)]">
            <dt className="text-gray-500">Brand</dt>
            <dd className="font-medium text-gray-900">{product.brand.name}</dd>
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
        <h2 id="warranty-heading" className="text-xl font-bold text-gray-900">
          Garansi
        </h2>
        <p className="mt-3 leading-7 text-gray-600">
          {product.warrantyInfo || "Informasi garansi belum tersedia."}
        </p>
      </section>

      <section aria-labelledby="description-heading">
        <h2 id="description-heading" className="text-xl font-bold text-gray-900">
          Deskripsi Produk
        </h2>
        <p className="mt-3 whitespace-pre-line leading-7 text-gray-600">
          {product.description}
        </p>
      </section>
    </div>
  );
}
