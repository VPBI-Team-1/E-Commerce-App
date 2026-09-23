import Link from "next/link";
import { LuSearch, LuShoppingCart, LuUser } from "react-icons/lu";

export default function StoreHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-3">
          <span className="rounded-lg bg-primary px-3 py-1 text-2xl font-bold text-white">
            B
          </span>

          <span className="hidden text-2xl font-bold sm:inline">
            Byte<span className="text-primary">Store</span>
          </span>
        </Link>

        <form
          action="/products"
          method="GET"
          className="flex h-11 min-w-0 items-center gap-3 rounded-lg bg-gray-100 px-4"
        >
          <input
            type="search"
            name="search"
            placeholder="Cari processor, GPU, monitor..."
            aria-label="Cari produk"
            className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500"
          />

          <button
            type="submit"
            aria-label="Cari produk"
            className="shrink-0 text-gray-600 transition-colors hover:text-primary"
          >
            <LuSearch className="h-5 w-5" />
          </button>
        </form>

        <nav className="flex items-center gap-2">
          <Link
            href="/cart"
            aria-label="Buka keranjang"
            className="rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-primary"
          >
            <LuShoppingCart className="h-6 w-6" />
          </Link>

          <Link
            href="/profile"
            aria-label="Buka halaman profil"
            className="rounded-full bg-gray-100 p-2 text-gray-700 transition-colors hover:bg-gray-200 hover:text-primary"
          >
            <LuUser className="h-6 w-6" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
