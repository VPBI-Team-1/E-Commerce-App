"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/schemas/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerAction } from "./actions";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "CUSTOMER",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const result = await registerAction(data);

      console.log("Response dari Server Action:", result);

      if (result?.error) {
        setApiError(result.error);
      } else if (result?.success) {
        router.push(`/verify?email=${encodeURIComponent(result.email)}`);
      } else {
        setApiError("Server tidak mengembalikan respon yang valid.");
      }
    } catch (err) {
      console.error("Client Submit Error:", err);
      setApiError("Terjadi kesalahan koneksi atau jaringan.");
    } finally {
      setIsLoading(false);
    }
  };

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

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
            Buat Akun Baru
          </h1>
          <p className="mb-6 text-center text-sm text-gray-500">
            Lengkapi data di bawah untuk mendaftar.
          </p>

          {apiError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nama Lengkap
              </label>
              <input
                id="name"
                type="text"
                placeholder="Nama Lengkap"
                {...register("name")}
                disabled={isLoading}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                  errors.name
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-primary focus:ring-blue-100"
                } focus:ring-2`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

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
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
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
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <input type="hidden" value="CUSTOMER" {...register("role")} />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
