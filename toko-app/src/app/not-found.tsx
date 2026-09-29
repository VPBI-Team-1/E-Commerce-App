import Link from "next/link";
import Header from "@/components/Store/Header";
import Footer from "@/components/Store/Footer";
import { LuArrowLeft, LuFileQuestion } from "react-icons/lu";

export const metadata = {
  title: "404 - Halaman Tidak Ditemukan | ByteStore",
  description: "Halaman yang Anda tuju tidak dapat ditemukan.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-gray-50 text-gray-900">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-primary">
            <LuFileQuestion className="h-10 w-10 text-primary" />
          </div>

          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-800">
            Error 404
          </span>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Halaman Tidak Ditemukan
          </h1>

          <p className="mt-3 text-base text-gray-600">
            Maaf, halaman yang Anda cari tidak tersedia, telah dipindahkan, atau alamat tautan tidak valid.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
            >
              <LuArrowLeft className="h-4 w-4" />
              Kembali ke Beranda
            </Link>

            <Link
              href="/products"
              className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
            >
              Lihat Katalog Produk
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
