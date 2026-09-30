"use client";

import React from "react";
import { Address } from "@/modules/account/types/account.types";
import {
  LuMapPin,
  LuCheck,
  LuPencil,
  LuTrash2,
  LuLoader,
} from "react-icons/lu";

interface AddressCardProps {
  address: Address;
  isActionLoading: boolean;
  onSetDefault: (id: string) => void;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
}

export default function AddressCard({
  address,
  isActionLoading,
  onSetDefault,
  onEdit,
  onDelete,
}: AddressCardProps) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-all ${
        address.isDefault
          ? "border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500/30"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
              <LuMapPin className="h-4 w-4 text-gray-400" />
              <span>Alamat Pengiriman</span>
            </span>

            {address.isDefault && (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                <LuCheck className="h-3 w-3" />
                <span>Alamat Utama</span>
              </span>
            )}
          </div>

          <p className="text-sm text-gray-700 leading-relaxed font-normal">
            {address.fullAddress}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-start shrink-0 pt-1">
          {!address.isDefault && (
            <button
              type="button"
              onClick={() => onSetDefault(address.id)}
              disabled={isActionLoading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 cursor-pointer"
            >
              {isActionLoading ? (
                <LuLoader className="h-3.5 w-3.5 animate-spin text-primary" />
              ) : (
                <span>Jadikan Utama</span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => onEdit(address)}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            title="Ubah Alamat"
          >
            <LuPencil className="h-3.5 w-3.5 text-gray-500" />
            <span>Ubah</span>
          </button>

          <button
            type="button"
            onClick={() => onDelete(address.id)}
            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer"
            title="Hapus Alamat"
          >
            <LuTrash2 className="h-3.5 w-3.5 text-red-500" />
            <span>Hapus</span>
          </button>
        </div>
      </div>
    </div>
  );
}
