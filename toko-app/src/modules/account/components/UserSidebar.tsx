"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LuUser,
  LuShoppingBag,
  LuHeart,
  LuLogOut,
  LuShieldCheck,
} from "react-icons/lu";

export default function UserSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const displayName = user?.name || user?.email?.split("@")[0] || "Pengguna";
  const userInitial = displayName.charAt(0).toUpperCase() || "U";
  const userEmail = user?.email || "";

  const menuItems = [
    {
      title: "Biodata Diri",
      description: "Kelola profil & daftar alamat",
      href: "/profile",
      icon: LuUser,
      exact: true,
    },
    {
      title: "Daftar Pembelian",
      description: "Riwayat pesanan belanja Anda",
      href: "/orders",
      icon: LuShoppingBag,
      exact: false,
    },
    {
      title: "Wishlist",
      description: "Daftar produk impian Anda",
      href: "/wishlist",
      icon: LuHeart,
      exact: false,
    },
  ];

  const isItemActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-4">
      {/* Profile Summary Card (Tokopedia Style) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xl font-bold text-primary ring-2 ring-blue-100">
            {userInitial}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-bold text-gray-900" title={displayName}>
              {displayName}
            </h2>
            <p className="truncate text-xs text-gray-500" title={userEmail}>
              {userEmail}
            </p>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-600">
              <LuShieldCheck className="h-3.5 w-3.5" />
              <span>Akun Terverifikasi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        <div className="border-b border-gray-100 px-5 py-3.5">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Aktivitas Saya
          </span>
        </div>

        <nav className="p-2 space-y-1" aria-label="Sidebar Navigasi Akun">
          {menuItems.map((item) => {
            const active = isItemActive(item.href, item.exact);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3.5 rounded-xl px-3.5 py-3 transition-colors text-sm font-medium ${
                  active
                    ? "bg-blue-50 text-primary font-semibold"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    active
                      ? "bg-primary text-white shadow-xs"
                      : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-800"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate leading-snug">{item.title}</p>
                  <p
                    className={`truncate text-xs font-normal ${
                      active ? "text-blue-700" : "text-gray-500"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 p-2">
          <button
            type="button"
            onClick={() => logout("/")}
            className="flex w-full items-center gap-3.5 rounded-xl px-3.5 py-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <LuLogOut className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate leading-snug">Keluar Akun</p>
              <p className="truncate text-xs font-normal text-red-500/80">
                Akhiri sesi saat ini
              </p>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}
