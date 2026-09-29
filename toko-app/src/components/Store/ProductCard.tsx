import Image from "next/image";
import LinkButton from "./LinkButton";

type ProductCardProps = {
  productId: string;
  name: string;
  imageUrl: string | null;
  price: number | null;
};

export default function ProductCard({
  productId,
  name,
  imageUrl,
  price,
}: ProductCardProps) {
  return (
    <article
      key={productId}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
    >
      <div className="relative aspect-4/3 overflow-hidden sm:aspect-square">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
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
          {name}
        </h3>

        <p className="mt-3 text-lg font-bold text-blue-600">
          {price !== null
            ? `Rp ${price.toLocaleString("id-ID")}`
            : "Harga belum tersedia"}
        </p>

        <LinkButton
          href={`/products/${productId}`}
          variant="dark"
          className="mt-5"
        >
          Lihat Detail
        </LinkButton>
      </div>
    </article>
  );
}
