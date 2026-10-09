"use client";

import React, { useState, useEffect } from "react";
import {
  LuX,
  LuCopy,
  LuCheck,
  LuCircleAlert,
  LuCreditCard,
  LuChevronDown,
  LuChevronUp,
} from "react-icons/lu";
import { confirmOrderPayment } from "@/modules/account/actions/account.actions";

interface BankOption {
  id: string;
  name: string;
  shortName: string;
  vaNumber: string;
  color: string;
  instructions: string[];
}

const INDONESIAN_BANKS: BankOption[] = [
  {
    id: "bca",
    name: "Bank Central Asia",
    shortName: "BCA",
    vaNumber: "3901 0812 3456 7890",
    color: "bg-blue-600 text-white",
    instructions: [
      "Buka aplikasi BCA Mobile atau kunjungi ATM BCA terdekat.",
      "Pilih menu 'Transfer' lalu pilih 'BCA Virtual Account'.",
      "Masukkan nomor Virtual Account yang tertera di atas.",
      "Periksa rincian tagihan belanja Anda, kemudian konfirmasi pembayaran.",
    ],
  },
  {
    id: "mandiri",
    name: "Bank Mandiri",
    shortName: "Mandiri",
    vaNumber: "88708 0812 3456 7890",
    color: "bg-yellow-600 text-white",
    instructions: [
      "Buka aplikasi Livin' by Mandiri atau ATM Mandiri.",
      "Pilih menu 'Bayar' > 'Pembayaran Baru' > 'Multipayment'.",
      "Pilih penyedia jasa atau masukkan kode institusi dan nomor Virtual Account.",
      "Pastikan nominal pembayaran sesuai dan selesaikan transaksi.",
    ],
  },
  {
    id: "bni",
    name: "Bank Negara Indonesia",
    shortName: "BNI",
    vaNumber: "8277 0812 3456 7890",
    color: "bg-teal-600 text-white",
    instructions: [
      "Buka aplikasi BNI Mobile Banking atau mesin ATM BNI.",
      "Pilih menu 'Pembayaran' lalu pilih 'Virtual Account Billing'.",
      "Input nomor Virtual Account pada kolom yang tersedia.",
      "Periksa informasi pesanan dan masukkan password transaksi Anda.",
    ],
  },
  {
    id: "bri",
    name: "Bank Rakyat Indonesia",
    shortName: "BRI",
    vaNumber: "12800 0812 3456 7890",
    color: "bg-blue-800 text-white",
    instructions: [
      "Buka aplikasi BRImo atau datangi ATM BRI terdekat.",
      "Pilih menu 'Pembayaran' > 'BRIVA'.",
      "Masukkan nomor Virtual Account BRI yang tertera di layar.",
      "Cek kesesuaian nama dan jumlah pembayaran, lalu selesaikan pembayaran.",
    ],
  },
];

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  invoiceNumber: string;
  totalAmount: number;
  onPaymentSuccess?: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  orderId,
  invoiceNumber,
  totalAmount,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [selectedBank, setSelectedBank] = useState<BankOption>(INDONESIAN_BANKS[0]);
  const [copiedVA, setCopiedVA] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCopyVA = () => {
    const rawNumber = selectedBank.vaNumber.replace(/\s+/g, "");
    navigator.clipboard.writeText(rawNumber);
    setCopiedVA(true);
    setTimeout(() => setCopiedVA(false), 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(String(totalAmount));
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const handleConfirmPaid = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await confirmOrderPayment(orderId);
      if (res.success) {
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
        onClose();
      } else {
        setErrorMessage(res.message || "Gagal mengonfirmasi status pembayaran.");
      }
    } catch (err: unknown) {
      console.error("Error confirmation:", err);
      setErrorMessage("Terjadi kesalahan sistem saat menghubungi server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={isSubmitting ? undefined : onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white border border-gray-200 shadow-2xl p-6 sm:p-7 text-left my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-primary">
              <LuCreditCard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Pembayaran Virtual Account
              </h2>
              <p className="text-xs text-gray-500">{invoiceNumber}</p>
            </div>
          </div>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            aria-label="Tutup modal"
            className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <LuX className="h-5 w-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            <LuCircleAlert className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Bank Selection */}
        <div className="mt-5">
          <label className="text-xs font-semibold text-gray-700 block mb-2">
            Pilih Bank Tujuan:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {INDONESIAN_BANKS.map((bank) => {
              const isSelected = selectedBank.id === bank.id;
              return (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => setSelectedBank(bank)}
                  className={`flex flex-col items-center justify-center rounded-xl p-3 border text-center transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                  }`}
                >
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${bank.color} mb-1`}
                  >
                    {bank.shortName}
                  </span>
                  <span className="text-[11px] font-medium text-gray-700 truncate w-full">
                    {bank.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* VA Details Box */}
        <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50/70 p-4 space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Nomor Virtual Account {selectedBank.shortName}</span>
              <span className="text-emerald-700 font-medium">Otomatis Terverifikasi</span>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-lg bg-white border border-gray-200 px-3.5 py-2.5 shadow-2xs">
              <span className="font-mono text-sm sm:text-base font-bold text-gray-900 tracking-wider">
                {selectedBank.vaNumber}
              </span>
              <button
                type="button"
                onClick={handleCopyVA}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-blue-700 transition-colors cursor-pointer"
              >
                {copiedVA ? (
                  <>
                    <LuCheck className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-600">Tersalin</span>
                  </>
                ) : (
                  <>
                    <LuCopy className="h-4 w-4" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Total Tagihan Pembayaran</span>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-lg bg-white border border-gray-200 px-3.5 py-2.5 shadow-2xs">
              <span className="text-sm sm:text-base font-bold text-primary">
                {formatPrice(totalAmount)}
              </span>
              <button
                type="button"
                onClick={handleCopyAmount}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-blue-700 transition-colors cursor-pointer"
              >
                {copiedAmount ? (
                  <>
                    <LuCheck className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-600">Tersalin</span>
                  </>
                ) : (
                  <>
                    <LuCopy className="h-4 w-4" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Instructions Collapsible */}
        <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => setShowInstructions(!showInstructions)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <span>Petunjuk Pembayaran {selectedBank.shortName}</span>
            {showInstructions ? (
              <LuChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <LuChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          {showInstructions && (
            <div className="p-4 text-xs text-gray-600 border-t border-gray-100 space-y-2">
              <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                {selectedBank.instructions.map((step, idx) => (
                  <li key={idx} className="text-gray-700">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirmPaid}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <LuCheck className="h-4 w-4" />
                <span>Saya Sudah Bayar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
