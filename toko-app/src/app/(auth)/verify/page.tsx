"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { verifyOtpAction } from "./actions";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!email || otp.length < 6) {
      setApiError("Masukkan email dan 6 digit kode OTP dengan benar.");
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const result = await verifyOtpAction(email, otp);

      if (result?.error) {
        setApiError(result.error);
      } else if (result?.success) {
        localStorage.setItem("user", JSON.stringify(result.user));
        router.push("/login");
        router.refresh();
      }
    } catch (err) {
      setApiError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
        Verifikasi Kode OTP
      </h1>
      <p className="mb-6 text-center text-sm text-gray-500">
        Kode verifikasi telah dikirimkan ke email Anda.
      </p>

      {apiError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            disabled={isLoading || !!emailParam}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700"
          >
            Kode OTP (6 Digit)
          </label>
          <input
            id="otp"
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Hanya terima angka
            placeholder="123456"
            disabled={isLoading}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-center text-xl font-bold tracking-widest outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.length < 6}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Memverifikasi..." : "Verifikasi OTP"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Salah memasukkan email?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Daftar Ulang
        </Link>
      </p>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="mb-12 flex min-h-[calc(100vh-200px)] items-center justify-center">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="rounded-lg bg-primary px-3 py-1 text-2xl font-bold text-white">
              B
            </span>
            <span className="text-2xl font-bold">
              Byte<span className="text-primary">Store</span>
            </span>
          </Link>
        </div>

        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <VerifyOtpForm />
        </Suspense>
      </div>
    </div>
  );
}
