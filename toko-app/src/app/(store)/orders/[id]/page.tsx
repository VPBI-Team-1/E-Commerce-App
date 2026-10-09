import { notFound } from "next/navigation";
import { getUserOrderDetail } from "@/modules/account/actions/account.actions";
import TransactionDetail from "@/modules/account/components/TransactionDetail";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Detail Pesanan | ByteStore",
  description: "Lihat rincian transaksi belanja, status pengiriman, dan pembayaran pesanan Anda.",
};

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;

  const res = await getUserOrderDetail(id);

  if (!res.success || !res.data) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      <TransactionDetail initialOrder={res.data} />
    </div>
  );
}
