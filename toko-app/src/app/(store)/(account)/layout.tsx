import UserSidebar from "@/modules/account/components/UserSidebar";

export const metadata = {
  title: "Akun Saya | ByteStore",
  description: "Kelola profil, riwayat pesanan, dan wishlist belanja Anda di ByteStore.",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50/50 py-6 sm:py-8 lg:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <UserSidebar />
          <section className="flex-1 min-w-0">
            {children}
          </section>
        </div>
      </div>
    </div>
  );
}
