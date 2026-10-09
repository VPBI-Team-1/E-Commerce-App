import { LuSearch } from "react-icons/lu";

export default function SearchBar() {
  return (
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
  );
}
