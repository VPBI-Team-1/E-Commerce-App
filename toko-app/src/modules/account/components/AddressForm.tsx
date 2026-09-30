"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addAddress, updateAddress } from "@/modules/account/actions/account.actions";
import {
  addressSchema,
  AddressInput,
} from "@/modules/account/schemas/account.schema";
import { Address } from "@/modules/account/types/account.types";
import {
  LuX,
  LuCircleAlert,
  LuLoader,
} from "react-icons/lu";

interface AddressFormProps {
  isOpen: boolean;
  editingAddress: Address | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function AddressForm({
  isOpen,
  editingAddress,
  onClose,
  onSuccess,
}: AddressFormProps) {
  const [addressError, setAddressError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullAddress: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ fullAddress: editingAddress?.fullAddress || "" });
      setAddressError(null);
    }
  }, [isOpen, editingAddress, reset]);

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

  const onSaveAddress = async (data: AddressInput) => {
    setAddressError(null);
    try {
      if (editingAddress) {
        const res = await updateAddress(editingAddress.id, data);
        if (res.success) {
          onSuccess(res.message || "Alamat berhasil diperbarui.");
          onClose();
        } else {
          setAddressError(res.message || "Gagal memperbarui alamat.");
        }
      } else {
        const res = await addAddress(data);
        if (res.success) {
          onSuccess(res.message || "Alamat baru berhasil ditambahkan.");
          onClose();
        } else {
          setAddressError(res.message || "Gagal menambahkan alamat.");
        }
      }
    } catch (err: unknown) {
      setAddressError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan sistem saat menyimpan alamat."
      );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="address-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2
            id="address-modal-title"
            className="text-lg font-bold text-gray-900"
          >
            {editingAddress ? "Ubah Alamat Pengiriman" : "Tambah Alamat Baru"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
            aria-label="Tutup modal"
          >
            <LuX className="h-5 w-5" />
          </button>
        </div>

        {addressError && (
          <div
            className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800"
            role="alert"
          >
            <LuCircleAlert className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
            <span className="font-medium">{addressError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSaveAddress)} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="full-address-input"
              className="block text-sm font-semibold text-gray-800"
            >
              Alamat Lengkap
            </label>
            <textarea
              id="full-address-input"
              rows={4}
              {...register("fullAddress")}
              placeholder="Contoh: Jl. Sudirman No. 123, RT 01/RW 02, Kel. Menteng, Kec. Menteng, Jakarta Pusat 10310"
              className={`mt-2 block w-full rounded-xl border p-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all resize-y ${
                errors.fullAddress
                  ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-primary focus:ring-primary/20"
              }`}
            />

            {errors.fullAddress && (
              <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                <LuCircleAlert className="h-3.5 w-3.5 shrink-0" />
                <span>{errors.fullAddress.message}</span>
              </p>
            )}

            <p className="mt-1.5 text-xs text-gray-500">
              Tuliskan jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota, dan patokan agar kurir mudah menemukan alamat Anda.
            </p>
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
                <span>{editingAddress ? "Simpan Perubahan" : "Simpan Alamat"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
