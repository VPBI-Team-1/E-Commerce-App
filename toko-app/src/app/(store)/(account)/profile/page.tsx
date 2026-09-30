"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import {
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  changePassword,
} from "@/app/actions/user";
import {
  biodataSchema,
  BiodataInput,
  addressSchema,
  AddressInput,
  changePasswordSchema,
  ChangePasswordInput,
} from "@/schemas/user";
import {
  LuUser,
  LuMapPin,
  LuPlus,
  LuCheck,
  LuPencil,
  LuTrash2,
  LuX,
  LuCircleAlert,
  LuCircleCheck,
  LuLoader,
  LuKeyRound,
  LuEye,
  LuEyeOff,
} from "react-icons/lu";

interface Address {
  id: string;
  userId: string;
  fullAddress: string;
  isDefault: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export default function ProfilePage() {
  const { user, isLoading: isAuthLoading, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState<"biodata" | "addresses">("biodata");

  // Profile message state
  const [profileMessage, setProfileMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Addresses state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isFetchingAddresses, setIsFetchingAddresses] = useState(true);
  const [addressActionLoadingId, setAddressActionLoadingId] = useState<string | null>(null);

  // Address Modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);

  // Delete Confirmation Modal state
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast / notification state for addresses
  const [addressToast, setAddressToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Password Modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // --- React Hook Form: Biodata ---
  const {
    register: registerBiodata,
    handleSubmit: handleSubmitBiodata,
    reset: resetBiodata,
    watch: watchBiodata,
    formState: { errors: biodataErrors, isSubmitting: isSavingProfile },
  } = useForm<BiodataInput>({
    resolver: zodResolver(biodataSchema),
    defaultValues: {
      name: "",
    },
  });

  const watchedName = watchBiodata("name") || "";

  // Sync user name from auth context
  useEffect(() => {
    if (user?.name) {
      resetBiodata({ name: user.name });
    } else if (user?.email) {
      resetBiodata({ name: user.email.split("@")[0] });
    }
  }, [user, resetBiodata]);

  // --- React Hook Form: Alamat ---
  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddressForm,
    reset: resetAddressForm,
    formState: { errors: addressErrors, isSubmitting: isSubmittingAddress },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullAddress: "",
    },
  });

  // --- React Hook Form: Kata Sandi ---
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPasswordForm,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors, isSubmitting: isChangingPassword },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

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

  // Close modals on Escape key (Accessibility requirement R-32)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isAddressModalOpen) closeAddressModal();
        if (deletingAddressId) setDeletingAddressId(null);
        if (isPasswordModalOpen) closePasswordModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAddressModalOpen, deletingAddressId, isPasswordModalOpen]);

  // Handler: Simpan Biodata
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
        text: err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan profil.",
      });
    }
  };

  // Address Modal Helpers
  const openAddModal = () => {
    setEditingAddress(null);
    resetAddressForm({ fullAddress: "" });
    setAddressError(null);
    setIsAddressModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr);
    resetAddressForm({ fullAddress: addr.fullAddress });
    setAddressError(null);
    setIsAddressModalOpen(true);
  };

  const closeAddressModal = () => {
    setIsAddressModalOpen(false);
    setEditingAddress(null);
    resetAddressForm({ fullAddress: "" });
    setAddressError(null);
  };

  // Handler: Simpan Alamat (Tambah / Ubah)
  const onSaveAddress = async (data: AddressInput) => {
    setAddressError(null);
    try {
      if (editingAddress) {
        const res = await updateAddress(editingAddress.id, data);
        if (res.success) {
          setAddressToast({
            type: "success",
            text: res.message || "Alamat berhasil diperbarui.",
          });
          closeAddressModal();
          await fetchAddressList();
        } else {
          setAddressError(res.message || "Gagal memperbarui alamat.");
        }
      } else {
        const res = await addAddress(data);
        if (res.success) {
          setAddressToast({
            type: "success",
            text: res.message || "Alamat baru berhasil ditambahkan.",
          });
          closeAddressModal();
          await fetchAddressList();
        } else {
          setAddressError(res.message || "Gagal menambahkan alamat.");
        }
      }
    } catch (err: unknown) {
      setAddressError(
        err instanceof Error ? err.message : "Terjadi kesalahan sistem saat menyimpan alamat."
      );
    }
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

  // Password Modal Helpers
  const openPasswordModal = () => {
    resetPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError(null);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    resetPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError(null);
  };

  // Handler: Simpan Kata Sandi
  const onSavePassword = async (data: ChangePasswordInput) => {
    setPasswordError(null);
    try {
      const res = await changePassword(data);
      if (res.success) {
        closePasswordModal();
        setProfileMessage({
          type: "success",
          text: res.message || "Kata sandi berhasil diperbarui.",
        });
      } else {
        setPasswordError(res.message || "Gagal mengubah kata sandi.");
      }
    } catch (err: unknown) {
      setPasswordError(
        err instanceof Error ? err.message : "Terjadi kesalahan sistem saat mengubah kata sandi."
      );
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

          <div className="max-w-2xl">
            <div className="border-b border-gray-100 pb-4 mb-6">
              <h1 className="text-lg font-bold text-gray-900">Ubah Biodata Diri</h1>
              <p className="mt-0.5 text-xs text-gray-500">
                Perbarui nama lengkap yang akan ditampilkan di profil dan transaksi toko Anda.
              </p>
            </div>

            <form onSubmit={handleSubmitBiodata(onSaveBiodata)} className="space-y-6">
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
                  {...registerBiodata("name")}
                  placeholder="Contoh: Budi Santoso"
                  className={`mt-2 block w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    biodataErrors.name
                      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-primary focus:ring-primary/20"
                  }`}
                />

                {biodataErrors.name && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                    <LuCircleAlert className="h-3.5 w-3.5 shrink-0" />
                    <span>{biodataErrors.name.message}</span>
                  </p>
                )}

                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  Pastikan nama sesuai dengan identitas resmi untuk mempermudah penerimaan barang saat pengiriman.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSavingProfile ? (
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
                  onClick={openPasswordModal}
                  className="shrink-0 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer self-start sm:self-auto"
                >
                  Ubah Kata Sandi
                </button>
              </div>
            </div>
          </div>
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
              {addresses.map((addr) => {
                const isActionLoading = addressActionLoadingId === addr.id;

                return (
                  <div
                    key={addr.id}
                    className={`rounded-2xl border p-5 transition-all ${
                      addr.isDefault
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

                          {addr.isDefault && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                              <LuCheck className="h-3 w-3" />
                              <span>Alamat Utama</span>
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed font-normal">
                          {addr.fullAddress}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 self-start shrink-0 pt-1">
                        {!addr.isDefault && (
                          <button
                            type="button"
                            onClick={() => handleSetDefault(addr.id)}
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
                          onClick={() => openEditModal(addr)}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                          title="Ubah Alamat"
                        >
                          <LuPencil className="h-3.5 w-3.5 text-gray-500" />
                          <span>Ubah</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingAddressId(addr.id)}
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
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal: Tambah / Ubah Alamat */}
      {isAddressModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="address-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={closeAddressModal}
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
                onClick={closeAddressModal}
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

            <form onSubmit={handleSubmitAddressForm(onSaveAddress)} className="mt-4 space-y-4">
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
                  {...registerAddress("fullAddress")}
                  placeholder="Contoh: Jl. Sudirman No. 123, RT 01/RW 02, Kel. Menteng, Kec. Menteng, Jakarta Pusat 10310"
                  className={`mt-2 block w-full rounded-xl border p-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all resize-y ${
                    addressErrors.fullAddress
                      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-primary focus:ring-primary/20"
                  }`}
                />

                {addressErrors.fullAddress && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                    <LuCircleAlert className="h-3.5 w-3.5 shrink-0" />
                    <span>{addressErrors.fullAddress.message}</span>
                  </p>
                )}

                <p className="mt-1.5 text-xs text-gray-500">
                  Tuliskan jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota, dan patokan agar kurir mudah menemukan alamat Anda.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeAddressModal}
                  disabled={isSubmittingAddress}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAddress}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingAddress ? (
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
      )}

      {/* Modal: Konfirmasi Hapus Alamat */}
      {deletingAddressId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setDeletingAddressId(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <LuTrash2 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h2
                  id="delete-modal-title"
                  className="text-base font-bold text-gray-900"
                >
                  Hapus Alamat?
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Apakah Anda yakin ingin menghapus alamat pengiriman ini? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingAddressId(null)}
                disabled={isDeleting}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteAddress}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <LuLoader className="h-4 w-4 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Ubah Kata Sandi */}
      {isPasswordModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="password-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={closePasswordModal}
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
                onClick={closePasswordModal}
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

            <form onSubmit={handleSubmitPasswordForm(onSavePassword)} className="mt-4 space-y-4">
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
                    {...registerPassword("currentPassword")}
                    placeholder="Masukkan kata sandi saat ini"
                    className={`block w-full rounded-xl border px-3.5 py-2.5 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      passwordErrors.currentPassword
                        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-primary focus:ring-primary/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                    aria-label={showCurrentPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showCurrentPassword ? (
                      <LuEyeOff className="h-4 w-4" />
                    ) : (
                      <LuEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1">
                    <LuCircleAlert className="h-3 w-3 shrink-0" />
                    <span>{passwordErrors.currentPassword.message}</span>
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
                    {...registerPassword("newPassword")}
                    placeholder="Minimal 6 karakter"
                    className={`block w-full rounded-xl border px-3.5 py-2.5 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      passwordErrors.newPassword
                        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-primary focus:ring-primary/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                    aria-label={showNewPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showNewPassword ? (
                      <LuEyeOff className="h-4 w-4" />
                    ) : (
                      <LuEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {passwordErrors.newPassword ? (
                  <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1">
                    <LuCircleAlert className="h-3 w-3 shrink-0" />
                    <span>{passwordErrors.newPassword.message}</span>
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
                  {...registerPassword("confirmPassword")}
                  placeholder="Ulangi kata sandi baru"
                  className={`mt-1.5 block w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    passwordErrors.confirmPassword
                      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-primary focus:ring-primary/20"
                  }`}
                />
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1">
                    <LuCircleAlert className="h-3 w-3 shrink-0" />
                    <span>{passwordErrors.confirmPassword.message}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  disabled={isChangingPassword}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 cursor-pointer"
                >
                  {isChangingPassword ? (
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
      )}
    </div>
  );
}
