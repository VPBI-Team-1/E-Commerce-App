"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/schemas/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", role: "CUSTOMER" },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setApiError(null);

    try {
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: data.email,
          role: data.role,
          name: data.email.split("@")[0],
        }),
      );

      router.push("/");
    } catch (err) {
      setApiError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-12 flex min-h-[calc(100vh-200px)] items-center justify-center">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="rounded-lg bg-primary px-3 py-1 text-2xl font-bold text-white">
              B
            </span>
            <span className="text-2xl font-bold">
              Byte<span className="text-primary">Store</span>
            </span>
          </Link>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
            Selamat Datang Kembali
          </h1>
          <p className="mb-6 text-center text-sm text-gray-500">
            Masukkan kredensial Anda untuk masuk.
          </p>

          {apiError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                placeholder="nama@email.com"
                {...register("email")}
                disabled={isLoading}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-primary focus:ring-blue-100"
                } focus:ring-2`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Masukkan password"
                {...register("password")}
                disabled={isLoading}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-primary focus:ring-blue-100"
                } focus:ring-2`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <input type="hidden" value="CUSTOMER" {...register("role")} />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline"
            >
              Daftar
            </Link>
            <span className="mx-2 text-gray-300">|</span>
            <Link
              href="/admin/login"
              className="text-primary hover:underline"
            >
              Masuk sebagai Admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
