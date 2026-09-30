"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { resetPasswordAction } from "./actions";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch("password");

  const onSubmit = async (data: any) => {
    if (!token) {
      setApiError("Token reset password tidak ditemukan.");
      return;
    }

    setIsLoading(true);
    setApiError(null);

    const res = await resetPasswordAction(token, data.password);

    if (res?.error) {
      setApiError(res.error);
      setIsLoading(false);
    } else {
      router.push("/login?reset=success");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-md">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Password Baru
        </h2>

        {apiError && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password Baru
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password wajib diisi",
                minLength: { value: 6, message: "Minimal 6 karakter" },
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Konfirmasi Password
            </label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Konfirmasi password wajib diisi",
                validate: (val) => val === password || "Password tidak cocok",
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.confirmPassword.message as string}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Menyimpan..." : "Simpan Password Baru"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Suspense
        fallback={
          <p className="text-center text-gray-500">Memuat halaman...</p>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
