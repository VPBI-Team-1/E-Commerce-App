"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  LuShoppingCart,
  LuUser,
  LuShoppingBag,
  LuHeart,
  LuLayoutDashboard,
  LuLogOut,
  LuChevronRight,
} from "react-icons/lu";
import SearchBar from "./SearchBar";
import LoginPromptModal from "./LoginPromptModal";
import { useAuth } from "@/context/AuthContext";

const AUTH_CHANGE_EVENT = "bytestore-auth-change";

function subscribeToAuth(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(AUTH_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(AUTH_CHANGE_EVENT, callback);
  };
}

function getAuthSnapshot() {
  return Boolean(localStorage.getItem("user"));
}

function getServerAuthSnapshot() {
  return false;
}

function getStoredUserData(): {
  name: string | null;
  email: string | null;
  role: string | null;
} {
  if (typeof window === "undefined") return { name: null, email: null, role: null };
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return { name: null, email: null, role: null };
    const parsed = JSON.parse(raw);
    return {
      name: parsed?.name || null,
      email: parsed?.email || null,
      role: parsed?.role || null,
    };
  } catch {
    return { name: null, email: null, role: null };
  }
}

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isStorageLoggedIn = useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    getServerAuthSnapshot,
  );

  const isLoggedIn = Boolean(user) || isStorageLoggedIn;

  const stored = getStoredUserData();
  const displayName =
    user?.name || user?.email?.split("@")[0] || stored.name || (stored.email ? stored.email.split("@")[0] : null) || "Pengguna";
  const userRole = user?.role || stored.role || "CUSTOMER";

  useEffect(() => {
    if (!isPopupOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPopupOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsPopupOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPopupOpen]);

  const handleLogout = async () => {
    setIsPopupOpen(false);
    await logout("/");
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

        <SearchBar />

        <nav className="flex items-center gap-2">
          <Link
            href="/cart"
            aria-label="Buka keranjang"
            onClick={(e) => {
              if (!isLoggedIn) {
                e.preventDefault();
                setIsLoginModalOpen(true);
              }
            }}
            className="rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          >
            <LuShoppingCart className="h-6 w-6" />
          </Link>

          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                id="user-menu-button"
                aria-label={`Buka menu profil untuk ${displayName}`}
                aria-haspopup="menu"
                aria-expanded={isPopupOpen}
                onClick={() => setIsPopupOpen((current) => !current)}
                className={`rounded-full p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer ${
                  isPopupOpen
                    ? "bg-blue-50 text-primary ring-2 ring-primary/20"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-primary"
                }`}
              >
                <LuUser className="h-6 w-6" />
              </button>

              {isPopupOpen && (
                <div
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl ring-1 ring-black/5"
                >
                  <Link
                    href="/profile"
                    role="menuitem"
                    onClick={() => setIsPopupOpen(false)}
                    className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 border border-gray-100 transition-colors hover:bg-gray-100 hover:border-gray-200 group cursor-pointer"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-primary transition-colors group-hover:bg-blue-100">
                      <LuUser className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {displayName}
                      </p>
                    </div>

                    <LuChevronRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>

                  <div className="mt-1.5 space-y-0.5" role="none">

                    <Link
                      href="/orders"
                      role="menuitem"
                      onClick={() => setIsPopupOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:bg-gray-100 group cursor-pointer"
                    >
                      <LuShoppingBag className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                      <span>Pembelian</span>
                    </Link>

                    <Link
                      href="/wishlist"
                      role="menuitem"
                      onClick={() => setIsPopupOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:bg-gray-100 group cursor-pointer"
                    >
                      <LuHeart className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                      <span>Wishlist</span>
                    </Link>

                    {userRole === "ADMIN" && (
                      <Link
                        href="/admin"
                        role="menuitem"
                        onClick={() => setIsPopupOpen(false)}
                        className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-primary focus-visible:outline-none focus-visible:bg-blue-50 group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <LuLayoutDashboard className="h-4 w-4 text-blue-600 group-hover:text-primary transition-colors" />
                          <span>Panel Admin</span>
                        </div>
                        <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-blue-700">
                          Admin
                        </span>
                      </Link>
                    )}

                    <div className="my-1 border-t border-gray-100" role="separator" />

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:bg-red-50 group cursor-pointer"
                    >
                      <LuLogOut className="h-4 w-4 text-red-500 group-hover:text-red-600 transition-colors" />
                      <span>Keluar</span>
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

      <LoginPromptModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        redirectPath="/cart"
      />
    </header>
  );
}
