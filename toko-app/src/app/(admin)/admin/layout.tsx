import { AdminSidebar } from '@/modules/admin/components/AdminSidebar';

export const metadata = {
  title: 'Admin Dashboard | ByteStore',
  description: 'Panel Pengelolaan E-Commerce ByteStore',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth pages (login/register) skip the sidebar via client component check in page
  return (
    <div className="flex min-h-screen bg-white text-gray-900 font-sans antialiased">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <main className="flex-1 p-8 overflow-y-auto bg-white">{children}</main>
      </div>
    </div>
  );
}
