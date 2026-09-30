"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePassword } from "@/modules/account/actions/account.actions";
import {
  changePasswordSchema,
  ChangePasswordInput,
} from "@/modules/account/schemas/account.schema";
import {
  LuKeyRound,
  LuX,
  LuEye,
  LuEyeOff,
  LuCircleAlert,
  LuLoader,
} from "react-icons/lu";

interface PasswordFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function PasswordForm({
  isOpen,
  onClose,
  onSuccess,
}: PasswordFormProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordError(null);
      setShowCurrentPassword(false);
      setShowNewPassword(false);
    }
  }, [isOpen, reset]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const onSavePassword = async (data: ChangePasswordInput) => {
    setPasswordError(null);
    try {
      const res = await changePassword(data);
      if (res.success) {
        onSuccess(res.message || "Kata sandi berhasil diperbarui.");
        onClose();
      } else {
        setPasswordError(res.message || "Gagal mengubah kata sandi.");
      }
    } catch (err: unknown) {
      setPasswordError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan sistem saat mengubah kata sandi."
      );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="password-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-primary">
              <LuKeyRound className="h-4 w-4" />
            </div>
            <h2
              id="password-modal-title"
              className="text-base font-bold text-gray-900"
            >
              Ubah Kata Sandi
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
            aria-label="Tutup modal"
          >
            <LuX className="h-5 w-5" />
          </button>
        </div>

        {passwordError && (
          <div
            className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800"
            role="alert"
          >
            <LuCircleAlert className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
            <span className="font-medium">{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSavePassword)} className="mt-4 space-y-4">
          {/* Kata Sandi Saat Ini */}
          <div>
            <label
              htmlFor="current-password-input"
              className="block text-xs font-semibold text-gray-800"
            >
              Kata Sandi Saat Ini
            </label>
            <div className="relative mt-1.5">
              <input
                id="current-password-input"
                type={showCurrentPassword ? "text" : "password"}
                {...register("currentPassword")}
                placeholder="Masukkan kata sandi saat ini"
                className={`block w-full rounded-xl border px-3.5 py-2.5 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.currentPassword
                    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-primary focus:ring-primary/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                aria-label={
                  showCurrentPassword
                    ? "Sembunyikan kata sandi"
                    : "Tampilkan kata sandi"
                }
              >
                {showCurrentPassword ? (
                  <LuEyeOff className="h-4 w-4" />
                ) : (
                  <LuEye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1">
                <LuCircleAlert className="h-3 w-3 shrink-0" />
                <span>{errors.currentPassword.message}</span>
              </p>
            )}
          </div>

          {/* Kata Sandi Baru */}
          <div>
            <label
              htmlFor="new-password-input"
              className="block text-xs font-semibold text-gray-800"
            >
              Kata Sandi Baru
            </label>
            <div className="relative mt-1.5">
              <input
                id="new-password-input"
                type={showNewPassword ? "text" : "password"}
                {...register("newPassword")}
                placeholder="Minimal 6 karakter"
                className={`block w-full rounded-xl border px-3.5 py-2.5 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.newPassword
                    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-primary focus:ring-primary/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                aria-label={
                  showNewPassword
                    ? "Sembunyikan kata sandi"
                    : "Tampilkan kata sandi"
                }
              >
                {showNewPassword ? (
                  <LuEyeOff className="h-4 w-4" />
                ) : (
                  <LuEye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.newPassword ? (
              <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1">
                <LuCircleAlert className="h-3 w-3 shrink-0" />
                <span>{errors.newPassword.message}</span>
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-gray-500">
                Gunakan minimal 6 karakter dengan kombinasi huruf dan angka.
              </p>
            )}
          </div>

          {/* Konfirmasi Kata Sandi Baru */}
          <div>
            <label
              htmlFor="confirm-password-input"
              className="block text-xs font-semibold text-gray-800"
            >
              Konfirmasi Kata Sandi Baru
            </label>
            <input
              id="confirm-password-input"
              type="password"
              {...register("confirmPassword")}
              placeholder="Ulangi kata sandi baru"
              className={`mt-1.5 block w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                errors.confirmPassword
                  ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-primary focus:ring-primary/20"
              }`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1">
                <LuCircleAlert className="h-3 w-3 shrink-0" />
                <span>{errors.confirmPassword.message}</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <LuLoader className="h-4 w-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan Kata Sandi</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
