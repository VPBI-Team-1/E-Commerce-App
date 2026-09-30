"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "@/modules/account/actions/account.actions";
import {
  biodataSchema,
  BiodataInput,
} from "@/modules/account/schemas/account.schema";
import {
  LuCircleAlert,
  LuCircleCheck,
  LuLoader,
  LuKeyRound,
  LuX,
} from "react-icons/lu";

interface ProfileFormProps {
  onOpenPasswordModal: () => void;
}

export default function ProfileForm({ onOpenPasswordModal }: ProfileFormProps) {
  const { user, refreshUser } = useAuth();
  const [profileMessage, setProfileMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BiodataInput>({
    resolver: zodResolver(biodataSchema),
    defaultValues: {
      name: "",
    },
  });

  const watchedName = watch("name") || "";

  useEffect(() => {
    if (user?.name) {
      reset({ name: user.name });
    } else if (user?.email) {
      reset({ name: user.email.split("@")[0] });
    }
  }, [user, reset]);

  const onSaveBiodata = async (data: BiodataInput) => {
    setProfileMessage(null);
    try {
      const res = await updateProfile(data);
      if (res.success) {
        setProfileMessage({
          type: "success",
          text: res.message || "Profil berhasil diperbarui.",
        });
        await refreshUser();
      } else {
        setProfileMessage({
          type: "error",
          text: res.message || "Gagal memperbarui profil.",
        });
      }
    } catch (err: unknown) {
      setProfileMessage({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat menyimpan profil.",
      });
    }
  };

  return (
    <div className="max-w-2xl">
      {profileMessage && (
        <div
          className={`mb-6 flex items-start gap-3 rounded-xl p-4 text-sm ${
            profileMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
          role="alert"
        >
          {profileMessage.type === "success" ? (
            <LuCircleCheck className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
          ) : (
            <LuCircleAlert className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
          )}
          <div className="flex-1 font-medium">{profileMessage.text}</div>
          <button
            type="button"
            onClick={() => setProfileMessage(null)}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
            aria-label="Tutup pemberitahuan"
          >
            <LuX className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="border-b border-gray-100 pb-4 mb-6">
        <h1 className="text-lg font-bold text-gray-900">Ubah Biodata Diri</h1>
        <p className="mt-0.5 text-xs text-gray-500">
          Perbarui nama lengkap yang akan ditampilkan di profil dan transaksi toko Anda.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSaveBiodata)} className="space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="user-fullname"
              className="block text-sm font-semibold text-gray-800"
            >
              Nama Lengkap
            </label>
            <span className="text-xs text-gray-400">
              {watchedName.length}/100 karakter
            </span>
          </div>

          <input
            id="user-fullname"
            type="text"
            maxLength={100}
            {...register("name")}
            placeholder="Contoh: Budi Santoso"
            className={`mt-2 block w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
              errors.name
                ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-primary focus:ring-primary/20"
            }`}
          />

          {errors.name && (
            <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
              <LuCircleAlert className="h-3.5 w-3.5 shrink-0" />
              <span>{errors.name.message}</span>
            </p>
          )}

          <p className="mt-2 text-xs text-gray-500 leading-relaxed">
            Pastikan nama sesuai dengan identitas resmi untuk mempermudah penerimaan barang saat pengiriman.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <LuLoader className="h-4 w-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>Simpan Perubahan</span>
            )}
          </button>
        </div>
      </form>

      {/* Bagian Keamanan: Ubah Kata Sandi */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-700 shadow-2xs">
              <LuKeyRound className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Kata Sandi</h2>
              <p className="text-xs text-gray-500">
                Ganti kata sandi secara berkala untuk menjaga keamanan akun Anda.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenPasswordModal}
            className="shrink-0 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer self-start sm:self-auto"
          >
            Ubah Kata Sandi
          </button>
        </div>
      </div>
    </div>
  );
}
