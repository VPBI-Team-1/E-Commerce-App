"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { LuSearch, LuShoppingCart, LuUser } from "react-icons/lu";

export default function StoreHeader() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLogin = useCallback(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setIsPopupOpen(false);
    window.location.href = "/";
  };

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

          {isLoggedIn ? (
            <div
              className="relative"
              onMouseEnter={() => setIsPopupOpen(true)}
              onMouseLeave={() => setIsPopupOpen(false)}
            >
              <button
                type="button"
                aria-label="Buka menu profil"
                aria-expanded={isPopupOpen}
                onClick={() => setIsPopupOpen((current) => !current)}
                className="rounded-full bg-gray-100 p-2 text-gray-700 transition-colors hover:bg-blue-50 hover:text-primary"
              >
                <LuUser className="h-6 w-6" />
              </button>

              {isPopupOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                  <div className="border-b border-gray-100 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-blue-50 p-2 text-primary">
                        <LuUser className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Pengguna
                        </p>
                        <p className="text-xs text-gray-500">Akun ByteStore</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      href="/profile"
                      className="block rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-primary"
                    >
                      Akun Saya
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-primary"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 transition-colors hover:border-primary hover:bg-blue-50 hover:text-primary"
              >
                Masuk
              </Link>

              <Link
                href="/register"
                className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg border border-primary bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Daftar
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
