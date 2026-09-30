"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { forgotPasswordAction } from "./actions";

type ForgotPasswordInput = {
  email: string;
};

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>();

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const result = await forgotPasswordAction(data.email);

      if (result?.error) {
        setApiError(result.error);
      } else if (result?.success) {
        setIsSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setApiError("Terjadi kesalahan, silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md">
        <div>
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
            Lupa Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Masukkan email Anda untuk menerima link reset password.
          </p>
        </div>

        {/* Tampilan Jika Email Berhasil Dikirim */}
        {isSuccess ? (
          <div className="space-y-4 text-center">
            <div className="rounded-md bg-green-50 p-4 text-sm text-green-700 border border-green-200">
              Instruksi reset password telah dikirim ke email Anda. Silakan
              periksa kotak masuk atau folder spam Anda.
            </div>
            <Link
              href="/login"
              className="inline-block font-semibold text-blue-600 hover:text-blue-500"
            >
              Kembali ke Login
            </Link>
          </div>
        ) : (
          /* Form Input Email */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {apiError && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                {apiError}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Alamat Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="nama@email.com"
                {...register("email", {
                  required: "Email wajib diisi",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Format email tidak valid",
                  },
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white shadow hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? "Mengirim..." : "Kirim Link Reset"}
            </button>

            <div className="text-center text-sm">
              <Link
                href="/login"
                className="font-semibold text-blue-600 hover:text-blue-500"
              >
                Kembali ke Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
