"use client";

import Link from "next/link";
import { LuUser, LuShoppingCart, LuPackage, LuLayoutDashboard, LuLogOut, LuArrowRight } from "react-icons/lu";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse rounded-2xl bg-white p-8 shadow-xs border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-200" />
            <div className="space-y-2">
              <div className="h-5 w-40 rounded bg-gray-200" />
              <div className="h-4 w-56 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-primary">
            <LuUser className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Anda Belum Masuk
          </h1>
          <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
            Silakan masuk ke akun ByteStore Anda untuk mengelola profil dan melihat riwayat belanja.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/login?redirect=/profile"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Masuk Sekarang
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Daftar Akun
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayName = user.name || user.email.split("@")[0] || "Pengguna";
  const userInitial = displayName.charAt(0).toUpperCase() || "U";
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header Profile Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
              {userInitial}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900">
                  {displayName}
                </h1>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    isAdmin
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {isAdmin ? "Administrator" : "Pelanggan"}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{user.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => logout("/")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer self-start sm:self-auto"
          >
            <LuLogOut className="h-4 w-4" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/cart"
          className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:border-primary/40 hover:shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <LuShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">
                Keranjang Belanja
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                Kelola barang dan lanjutkan ke checkout
              </p>
            </div>
          </div>
          <LuArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </Link>

        <Link
          href="/products"
          className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:border-primary/40 hover:shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <LuPackage className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">
                Katalog Produk
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                Jelajahi produk teknologi terbaru ByteStore
              </p>
            </div>
          </div>
          <LuArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </Link>

        {isAdmin && (
          <Link
            href="/admin"
            className="group flex items-center justify-between rounded-2xl border border-purple-200 bg-white p-5 shadow-xs transition-all hover:border-purple-400 hover:shadow-sm sm:col-span-2"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-700 transition-colors group-hover:bg-purple-700 group-hover:text-white">
                <LuLayoutDashboard className="h-6 w-6" />
              </div>
              <div>
                <p className="text-base font-semibold text-gray-900">
                  Panel Administrator
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Kelola produk, pesanan, kategori, dan pengaturan toko
                </p>
              </div>
            </div>
            <LuArrowRight className="h-5 w-5 text-purple-400 transition-transform group-hover:translate-x-1 group-hover:text-purple-700" />
          </Link>
        )}
      </div>
    </div>
  );
}
