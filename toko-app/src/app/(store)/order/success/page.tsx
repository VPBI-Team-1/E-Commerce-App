import { getUserOrderDetail } from "@/modules/account/actions/account.actions";
import OrderSuccessClient from "./OrderSuccessClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pesanan Berhasil | ByteStore",
  description: "Pesanan Anda berhasil dibuat di ByteStore.",
};

interface OrderSuccessPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function OrderSuccessPage({
  searchParams,
}: OrderSuccessPageProps) {
  const { id } = await searchParams;
  let order = null;

  if (id) {
    const res = await getUserOrderDetail(id);
    if (res.success && res.data) {
      order = res.data;
    }
  }

  return <OrderSuccessClient order={order} orderId={id} />;
}
