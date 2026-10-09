"use client";

import { useEffect } from "react";
import Link from "next/link";
import { LuShoppingCart, LuLogIn, LuX } from "react-icons/lu";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectPath?: string;
  title?: string;
  description?: string;
}

export default function LoginPromptModal({
  isOpen,
  onClose,
  redirectPath = "/cart",
  title = "Masuk untuk Melihat Keranjang",
  description = "Silakan masuk ke akun ByteStore Anda terlebih dahulu untuk melihat dan mengelola barang di keranjang belanja.",
}: LoginPromptModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const loginHref = `/login?redirect=${encodeURIComponent(redirectPath)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-prompt-title"
      aria-describedby="login-prompt-desc"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup dialog masuk"
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
        >
          <LuX className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-primary">
            <LuShoppingCart className="h-7 w-7" aria-hidden="true" />
          </div>

          <h2
            id="login-prompt-title"
            className="text-lg font-bold text-gray-900"
          >
            {title}
          </h2>

          <p
            id="login-prompt-desc"
            className="mt-2 text-sm text-gray-600 leading-relaxed"
          >
            {description}
          </p>

          <div className="mt-6 flex w-full flex-col gap-2.5">
            <Link
              href={loginHref}
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <LuLogIn className="h-4 w-4" aria-hidden="true" />
              <span>Masuk Sekarang</span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 cursor-pointer"
            >
              Nanti Saja
            </button>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Belum punya akun?{" "}
            <Link
              href="/register"
              onClick={onClose}
              className="font-semibold text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
