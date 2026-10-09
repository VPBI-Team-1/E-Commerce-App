"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getAddresses,
  deleteAddress,
  setDefaultAddress,
} from "@/modules/account/actions/account.actions";
import { Address } from "@/modules/account/types/account.types";
import ProfileForm from "@/modules/account/components/ProfileForm";
import AddressForm from "@/modules/account/components/AddressForm";
import DeleteAddressModal from "@/modules/account/components/DeleteAddressModal";
import PasswordForm from "@/modules/account/components/PasswordForm";
import AddressCard from "@/modules/account/components/AddressCard";
import {
  LuUser,
  LuMapPin,
  LuPlus,
  LuCircleAlert,
  LuCircleCheck,
  LuX,
} from "react-icons/lu";

export default function ProfilePage() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"biodata" | "addresses">("biodata");

  // Addresses state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isFetchingAddresses, setIsFetchingAddresses] = useState(true);
  const [addressActionLoadingId, setAddressActionLoadingId] = useState<string | null>(null);

  // Address Modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Delete Confirmation Modal state
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast / notification state for addresses & profile
  const [addressToast, setAddressToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Password Modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Fetch addresses
  const fetchAddressList = useCallback(async () => {
    setIsFetchingAddresses(true);
    try {
      const res = await getAddresses();
      if (res.success && res.data) {
        setAddresses(res.data as Address[]);
      }
    } catch (err) {
      console.error("Gagal memuat alamat:", err);
    } finally {
      setIsFetchingAddresses(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchAddressList();
    }
  }, [user, fetchAddressList]);

  // Address Modal Helpers
  const openAddModal = () => {
    setEditingAddress(null);
    setIsAddressModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setIsAddressModalOpen(true);
  };

  const closeAddressModal = () => {
    setIsAddressModalOpen(false);
    setEditingAddress(null);
  };

  // Handle Set Default Address
  const handleSetDefault = async (id: string) => {
    setAddressActionLoadingId(id);
    try {
      const res = await setDefaultAddress(id);
      if (res.success) {
        setAddressToast({
          type: "success",
          text: res.message || "Alamat utama berhasil diperbarui.",
        });
        await fetchAddressList();
      } else {
        setAddressToast({
          type: "error",
          text: res.message || "Gagal mengatur alamat utama.",
        });
      }
    } catch (err: unknown) {
      setAddressToast({
        type: "error",
        text: err instanceof Error ? err.message : "Gagal mengatur alamat utama.",
      });
    } finally {
      setAddressActionLoadingId(null);
    }
  };

  // Handle Delete Address
  const handleDeleteAddress = async () => {
    if (!deletingAddressId) return;

    setIsDeleting(true);
    try {
      const res = await deleteAddress(deletingAddressId);
      if (res.success) {
        setAddressToast({
          type: "success",
          text: res.message || "Alamat berhasil dihapus.",
        });
        setDeletingAddressId(null);
        await fetchAddressList();
      } else {
        setAddressToast({
          type: "error",
          text: res.message || "Gagal menghapus alamat.",
        });
      }
    } catch (err: unknown) {
      setAddressToast({
        type: "error",
        text: err instanceof Error ? err.message : "Gagal menghapus alamat.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xs">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="h-4 w-72 rounded bg-gray-200" />
          <div className="space-y-4 pt-4">
            <div className="h-10 w-full rounded-xl bg-gray-100" />
            <div className="h-10 w-full rounded-xl bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
      {/* Tab Header (Tokopedia Style) */}
      <div className="border-b border-gray-200 px-6 pt-5">
        <div className="flex gap-8">
          <button
            type="button"
            onClick={() => setActiveTab("biodata")}
            className={`relative pb-4 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "biodata"
                ? "text-primary"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <LuUser className="h-4 w-4" />
              <span>Biodata Diri</span>
            </div>
            {activeTab === "biodata" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("addresses")}
            className={`relative pb-4 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "addresses"
                ? "text-primary"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <LuMapPin className="h-4 w-4" />
              <span>Daftar Alamat</span>
              {!isFetchingAddresses && addresses.length > 0 && (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
                  {addresses.length}
                </span>
              )}
            </div>
            {activeTab === "addresses" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
            )}
          </button>
        </div>
      </div>

      {/* Tab 1: Biodata Diri */}
      {activeTab === "biodata" && (
        <div className="p-6 sm:p-8">
          <ProfileForm
            onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
          />
        </div>
      )}

      {/* Tab 2: Daftar Alamat */}
      {activeTab === "addresses" && (
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Daftar Alamat</h1>
              <p className="mt-1 text-sm text-gray-500">
                Kelola alamat pengiriman untuk mempermudah proses checkout pesanan.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer self-start sm:self-auto shrink-0"
            >
              <LuPlus className="h-4 w-4" />
              <span>Tambah Alamat Baru</span>
            </button>
          </div>

          {addressToast && (
            <div
              className={`mb-6 flex items-start gap-3 rounded-xl p-4 text-sm ${
                addressToast.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
              role="alert"
            >
              {addressToast.type === "success" ? (
                <LuCircleCheck className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <LuCircleAlert className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
              )}
              <div className="flex-1 font-medium">{addressToast.text}</div>
              <button
                type="button"
                onClick={() => setAddressToast(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                aria-label="Tutup pemberitahuan"
              >
                <LuX className="h-4 w-4" />
              </button>
            </div>
          )}

          {isFetchingAddresses ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-gray-200 p-5 space-y-3"
                >
                  <div className="h-5 w-28 rounded bg-gray-200" />
                  <div className="h-4 w-full rounded bg-gray-100" />
                  <div className="h-4 w-3/4 rounded bg-gray-100" />
                </div>
              ))}
            </div>
          ) : addresses.length === 0 ? (
            /* Empty State */
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-primary">
                <LuMapPin className="h-7 w-7" />
              </div>
              <h2 className="mt-4 text-base font-bold text-gray-900">
                Belum Ada Alamat Tersimpan
              </h2>
              <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                Tambahkan alamat pengiriman agar Anda dapat menyelesaikan pesanan lebih cepat dan mudah.
              </p>
              <button
                type="button"
                onClick={openAddModal}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 cursor-pointer"
              >
                <LuPlus className="h-4 w-4" />
                <span>Tambah Alamat Sekarang</span>
              </button>
            </div>
          ) : (
            /* Address List */
            <div className="space-y-4">
              {addresses.map((addr) => (
                <AddressCard
                  key={addr.id}
                  address={addr}
                  isActionLoading={addressActionLoadingId === addr.id}
                  onSetDefault={handleSetDefault}
                  onEdit={openEditModal}
                  onDelete={(id) => setDeletingAddressId(id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Tambah / Ubah Alamat */}
      <AddressForm
        isOpen={isAddressModalOpen}
        editingAddress={editingAddress}
        onClose={closeAddressModal}
        onSuccess={(msg) => {
          setAddressToast({ type: "success", text: msg });
          fetchAddressList();
        }}
      />

      {/* Modal: Konfirmasi Hapus Alamat */}
      <DeleteAddressModal
        isOpen={Boolean(deletingAddressId)}
        isDeleting={isDeleting}
        onClose={() => setDeletingAddressId(null)}
        onConfirm={handleDeleteAddress}
      />

      {/* Modal: Ubah Kata Sandi */}
      <PasswordForm
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={(msg) => {
          setAddressToast({ type: "success", text: msg });
        }}
      />
    </div>
  );
}
